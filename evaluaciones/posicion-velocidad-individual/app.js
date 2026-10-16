"use strict";
/* Instituto Jorge Robledo · Physics 9 · single-student exam.
 * No answers, access codes, service keys or grade keys are bundled here. */
(() => {
const API="https://rlfxnjbqxbozjdzkbwlz.supabase.co/functions/v1/physics9-position-individual";
const KEY="ijr-physics9-position-individual-v1";
const COUNT=4,MAX=3;
const $=id=>document.getElementById(id);
const qs=s=>Array.from(document.querySelectorAll(s));
const state={status:"welcome",problem:0,strikes:0,startedAt:null,armed:false,incidentBusy:false,
 session:null,answers:Array.from({length:COUNT},()=>({value:"",reasoning:""}))};
let manifest=[],saveTimer=0,saveChain=Promise.resolve(),focusTimer=0,authorized=false;
const two=n=>String(n).padStart(2,"0");
const positiveOrNegativeNumber=v=>/^-?(?:\d+(?:[.,]\d+)?|[.,]\d+)$/.test(String(v).trim())&&Number.isFinite(Number(v.replace(",",".")));
const complete=a=>positiveOrNegativeNumber(a.value)&&a.reasoning.trim().length>=15;
const show=id=>["welcomeView","examView","resultView"].forEach(n=>$(n).classList.toggle("hidden",n!==id));
const notice=(msg,error=false)=>{const n=$("accessNotice");n.textContent=msg;n.classList.toggle("error",error)};
const warn=msg=>{let n=$("runtimeNotice");if(!n){n=document.createElement("p");n.id="runtimeNotice";n.className="runtime-error";$("previewStart").parentElement.after(n)}n.textContent=msg};
const persist=()=>{try{sessionStorage.setItem(KEY,JSON.stringify({session:state.session,problem:state.problem}))}catch{}};
const stored=()=>{try{const x=JSON.parse(sessionStorage.getItem(KEY)||"null");return x?.session?.attempt_id&&x?.session?.token?x:null}catch{return null}};
async function request(action,more={}){
 const body={action,...more};
 if(!["start","config"].includes(action)){
  if(!state.session)throw Error("No hay sesión autorizada.");
  body.attempt_id=state.session.attempt_id;body.token=state.session.token;
 }
 const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),18000);
 try{
  const r=await fetch(API,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(body),signal:controller.signal,cache:"no-store"});
  const data=await r.json();
  if(!r.ok){
   const dict={EXAM_NOT_ENABLED:"La evaluación aún no está habilitada por el docente.",ACCESS_DENIED:"El correo institucional no está autorizado para esta evaluación.",STUDENT_DETAILS_MISMATCH:"El nombre o el grupo no coincide con el intento registrado.",INCOMPLETE_ANSWERS:"Revisa los cuatro ejercicios: cada uno requiere velocidad y desarrollo.",SESSION_BLOCKED:"La sesión está bloqueada para revisión docente.",ALREADY_SUBMITTED:"La evaluación ya fue entregada."};
   throw Error(dict[data.error]||data.error||"No se pudo conectar al servidor.");
  }
  return data;
 }finally{clearTimeout(timer)}
}
function status(){
 const names={welcome:"ACCESO CONTROLADO",active:"EN CURSO",paused:"SESIÓN PAUSADA",blocked:"BLOQUEADA",submitted:"ENTREGADA"};
 $("topStatus").innerHTML='<span class="status-dot"></span> '+(names[state.status]||"ACCESO CONTROLADO");
}
function progress(){
 const total=state.answers.filter(complete).length;
 $("progress").textContent=total+" / "+COUNT;
 $("strikeDots").setAttribute("aria-label",state.strikes+" de 3 incidencias");
 Array.from($("strikeDots").children).forEach((n,i)=>n.classList.toggle("active",i<state.strikes));
 qs(".rail-item").forEach((b,i)=>{
  const isActive=i===state.problem,isDone=complete(state.answers[i]);
  b.classList.toggle("selected",isActive);b.classList.toggle("complete",isDone);
  b.querySelector(".rail-state").textContent=isDone?"✓":"○";
  if(isActive)b.setAttribute("aria-current","step");else b.removeAttribute("aria-current");
 });
}
function render(){
 const q=manifest[state.problem];if(!q)return;
 $("questionCounter").textContent="EJERCICIO "+two(state.problem+1)+" DE 04";
 $("questionTitle").textContent=q.title;
 $("questionStatement").textContent=q.statement;
 $("diagramNumber").textContent=two(state.problem+1);
 $("dimensionCaption").textContent=q.dimensions;
 $("numericPrompt").textContent=q.prompt+" (m/s)";
 $("reasoningHint").textContent=q.hint;
 $("pageIndicator").textContent=two(state.problem+1)+" / 04";
 $("prevButton").disabled=state.problem===0;
 $("nextButton").textContent=state.problem===3?"Volver al primero ↺":"Siguiente →";
 const frame=$("diagramFrame");frame.replaceChildren();
 const img=document.createElement("img");
 img.className="problem-media";img.src=q.diagram;
 img.alt="Gráfica posición versus tiempo correspondiente a "+q.title;
 img.loading="eager";img.decoding="async";
 img.addEventListener("error",()=>{frame.textContent="No se pudo cargar la gráfica. Informa al docente."},{once:true});
 frame.appendChild(img);
 $("areaValue").value=state.answers[state.problem].value;
 $("reasoning").value=state.answers[state.problem].reasoning;
 $("saveStatus").textContent="Autoguardado en servidor activado.";
 progress();
}
function snapshot(){
 const i=state.problem;
 state.answers[i]={value:$("areaValue").value.trim().slice(0,32),reasoning:$("reasoning").value.slice(0,8000)};
 progress();
 return {problem_id:"P"+two(i+1),...state.answers[i]};
}
function queueSave(s){
 $("saveStatus").textContent="Guardando en servidor…";
 saveChain=saveChain.catch(()=>{}).then(()=>request("answer",s)).then((r)=>{
  if(r.saved)$("saveStatus").textContent="Guardado en servidor ✓";
 }).catch(err=>{
  $("saveStatus").textContent="Error de guardado: "+err.message+"; vuelve a intentar.";
  throw err;
 });
 saveChain.catch(()=>{});
 return saveChain;
}
function saveNow(){
 if(state.status!=="active")return saveChain;
 clearTimeout(saveTimer);
 return queueSave(snapshot());
}
function onInput(){
 if(state.status!=="active")return;
 const s=snapshot();clearTimeout(saveTimer);
 saveTimer=setTimeout(()=>queueSave(s),550);
}
function select(i){
 if(state.status!=="active"||i<0||i>=COUNT)return;
 saveNow();
 state.problem=i;persist();render();
}
async function fullscreen(){
 if(document.fullscreenElement)return true;
 if(!document.fullscreenEnabled||!document.documentElement.requestFullscreen){
  warn("Este navegador no permite pantalla completa. Usa Edge o Chrome en un computador.");return false;
 }
 try{await document.documentElement.requestFullscreen({navigationUI:"hide"});return !!document.fullscreenElement}
 catch{warn("Activa el permiso de pantalla completa en tu navegador.");return false}
}
async function loadManifest(){
 const r=await fetch("./manifest.json",{cache:"no-store"});
 if(!r.ok)throw Error("No se pudo cargar el cuestionario.");
 const m=await r.json();
 if(m.problems_expected!==COUNT||!m.restricted_to_one_student||!Array.isArray(m.problems)||m.problems.length!==COUNT||
   m.problems.some(q=>!q.ready||!q.id||!q.statement||!q.prompt||!/^assets\/[a-z0-9/_-]+\.svg$/.test(q.diagram)))throw Error("Cuestionario incompleto.");
 manifest=m.problems;
}
async function start(e){
 e.preventDefault();
 if(!authorized){warn("La evaluación todavía no está habilitada para el estudiante autorizado.");return}
 const student_name=$("studentName").value.trim().replace(/\s+/g," ");
 const student_email=$("studentEmail").value.trim().toLowerCase();
 const student_group=$("studentGroup").value;
 if(student_name.length<3||!/^[a-z0-9][a-z0-9._+-]*@ijr\.edu\.co$/.test(student_email)||
  !["9A","9B","9C","OTRO"].includes(student_group)||!$("studentAgree").checked){
  warn("Completa nombre, correo institucional @ijr.edu.co, grupo y acepta las reglas.");return;
 }
 if(!manifest.length){warn("La evaluación no está disponible.");return}
 $("previewStart").disabled=true;
 try{
  const d=await request("start",{student_name,student_email,student_group,agreed:true});
  state.session={attempt_id:d.attempt_id,token:d.token,student_name:d.student_name,student_group:d.student_group,student_email:d.student_email};
  state.strikes=d.strikes||0;state.startedAt=d.started_at;state.status=d.state;state.armed=d.state==="active";
  for(let i=0;i<COUNT;i++)state.answers[i]={value:String(d.answers?.["P"+two(i+1)]?.value||""),reasoning:String(d.answers?.["P"+two(i+1)]?.reasoning||"")};
  persist();
  if(d.state==="active"){show("examView");render();$("studentLabel").textContent=d.student_name+" · "+d.student_group;status();}
  else{showResult(d.state,d.attempt_id,d.submitted_at)}
 }catch(err){
  warn("No fue posible iniciar: "+err.message);
 }finally{$("previewStart").disabled=!authorized}
}
function modal(reason){
 const blocked=state.status==="blocked";
 $("modalEyebrow").textContent=blocked?"LÍMITE DE INCIDENCIAS":"CONTROL DE INTEGRIDAD";
 $("modalTitle").textContent=blocked?"Sesión bloqueada":"Salida detectada";
 $("modalText").textContent=blocked?"Se registraron tres incidencias. Consulta al docente.":"Se registró una salida ("+reason+"). Vuelve a pantalla completa para continuar.";
 $("modalStrikeCount").textContent=state.strikes+" de "+MAX+" incidencias";
 $("modalAction").textContent=blocked?"Ver comprobante":"Regresar a pantalla completa";
 $("modalSymbol").textContent=blocked?"×":"!";
 $("incidentModal").classList.remove("hidden");
}
async function incident(reason){
 if(state.status!=="active"||!state.armed||state.incidentBusy)return;
 state.armed=false;state.incidentBusy=true;state.status="paused";status();clearTimeout(saveTimer);
 try{
  await saveChain.catch(()=>{});
  const r=await request("incident",{event_id:crypto.randomUUID(),reason});
  state.strikes=r.strikes;state.status=r.state==="blocked"?"blocked":"paused";
 }catch(e){warn("No se pudo guardar la incidencia: "+e.message)}
 finally{state.incidentBusy=false;status();progress();modal(reason)}
}
async function resume(){
 if(state.status==="blocked"){showResult("blocked");return}
 if(state.status!=="paused")return;
 if(!await fullscreen())return;
 try{
  const s=await request("status");state.strikes=s.strikes;state.status=s.state;
  if(s.state!=="active"){showResult(s.state);return}
  state.armed=true;$("incidentModal").classList.add("hidden");status();progress();
 }catch(e){warn(e.message)}
}
function showResult(statusValue,receipt,stamp){
 state.status=statusValue;state.armed=false;
 $("incidentModal").classList.add("hidden");show("resultView");status();
 const blocked=statusValue==="blocked";
 $("resultIcon").textContent=blocked?"!":"✓";
 $("resultHeading").textContent=blocked?"Evaluación bloqueada":"Evaluación enviada";
 $("resultDescription").textContent=blocked?"Tres incidencias requieren revisión docente. Las respuestas guardadas permanecen registradas.":"El servidor confirmó la entrega y conserva tus respuestas. No se publican soluciones ni calificaciones.";
 $("resultSummary").textContent="Estudiante: "+(state.session?.student_name||"")+
  "\nGrupo: "+(state.session?.student_group||"")+
  "\nCorreo institucional: "+(state.session?.student_email||"")+
  "\nPreguntas completas: "+state.answers.filter(complete).length+" de 4"+
  "\nIncidencias: "+state.strikes+" de 3"+
  (stamp?"\nHora de entrega: "+new Date(stamp).toLocaleString("es-CO"):"");
 $("receipt").textContent="Comprobante: "+(receipt||state.session?.attempt_id||"");
 persist();if(document.fullscreenElement)document.exitFullscreen().catch(()=>{});
}
async function submit(){
 if(state.status!=="active")return;
 $("finishButton").disabled=true;
 try{
  await saveNow();
  if(state.answers.some(a=>!complete(a))){
   $("saveStatus").textContent="Debes completar los cuatro puntos, con valor de velocidad y justificación de al menos 15 caracteres.";
   return;
  }
  const r=await request("submit");showResult("submitted",r.receipt,r.submitted_at);
 }catch(e){$("saveStatus").textContent="No se pudo entregar: "+e.message+". Reintenta sin cerrar la página."}
 finally{$("finishButton").disabled=false}
}
async function recover(){
 const previous=stored();if(!previous)return;
 state.session=previous.session;
 state.problem=Number.isInteger(previous.problem)&&previous.problem>=0&&previous.problem<COUNT?previous.problem:0;
 try{
  const d=await request("status");state.startedAt=d.started_at;state.strikes=d.strikes||0;
  for(let i=0;i<COUNT;i++)state.answers[i]={value:String(d.answers?.["P"+two(i+1)]?.value||""),reasoning:String(d.answers?.["P"+two(i+1)]?.reasoning||"")};
  if(d.state==="active"){
   state.status="active";state.armed=true;show("examView");render();
   $("studentLabel").textContent=d.student_name+" · "+d.student_group;status();
   // Recover the original token and draft without adding incidents.
  }else showResult(d.state,d.attempt_id,d.submitted_at);
 }catch(e){show("welcomeView");warn("No se pudo recuperar el intento. Revisa la conexión y vuelve a registrarte con el mismo correo, nombre y grupo.");state.session=null}
}
function reset(){
 try{sessionStorage.removeItem(KEY)}catch{}
 state.session=null;state.armed=false;state.status="welcome";show("welcomeView");status();
}
const elapsed=()=>{const t=state.startedAt?Math.max(0,Math.floor((Date.now()-new Date(state.startedAt).getTime())/1000)):0;return String(Math.floor(t/60)).padStart(2,"0")+":"+String(t%60).padStart(2,"0")};
async function init(){
 $("registrationForm").addEventListener("submit",start);
 $("prevButton").addEventListener("click",()=>select(state.problem-1));
 $("nextButton").addEventListener("click",()=>select(state.problem===3?0:state.problem+1));
 qs(".rail-item").forEach(b=>b.addEventListener("click",()=>select(Number(b.dataset.problem))));
 $("areaValue").addEventListener("input",onInput);
 $("reasoning").addEventListener("input",onInput);
 $("finishButton").addEventListener("click",submit);
 $("restartButton").addEventListener("click",reset);
 $("modalAction").addEventListener("click",resume);
 document.addEventListener("visibilitychange",()=>{if(document.hidden)incident("cambio de pestaña");else if(["paused","blocked"].includes(state.status)&&!state.incidentBusy)modal("cambio de pestaña")});
 window.addEventListener("blur",()=>{clearTimeout(focusTimer);focusTimer=setTimeout(()=>{if(!document.hasFocus()&&!document.hidden)incident("pérdida de foco")},750)});
 window.addEventListener("focus",()=>clearTimeout(focusTimer));
 setInterval(()=>{if(state.startedAt&&["active","paused"].includes(state.status))$("clock").textContent=elapsed()},1000);
 try{await loadManifest()}catch(e){warn(e.message);return}
 try{
  const cfg=await request("config");authorized=cfg.enabled===true;
  notice(authorized?"Evaluación individual habilitada. Ingresa únicamente el correo institucional autorizado por el docente.":"Evaluación preparada. Pendiente de autorizar un correo institucional.");
  $("previewStart").disabled=!authorized;
 }catch(e){authorized=false;notice("No se pudo verificar el permiso de acceso. Informa al docente.",true)}
 await recover();status();
}
init();
})();