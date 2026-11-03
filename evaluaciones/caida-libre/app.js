"use strict";
const API="https://rlfxnjbqxbozjdzkbwlz.supabase.co/functions/v1/physics9-freefall-exam";
const URL="https://rlfxnjbqxbozjdzkbwlz.supabase.co";
const PUBLIC_KEY="sb_publishable_rmVOQ3Orx49KpW_4uMqYew_c2HpcA87";
const SCHOOL_EMAIL_RE=/^[a-z0-9][a-z0-9._%+-]*@ijr[.]edu[.]co$/;
const STUDENT_AUTH_KEY="ijr-physics9-institutional-student-v3";
const $=id=>document.getElementById(id);
const UNIT_CHOICES={
 time:["s","min","ft","ft/s"],height:["ft","m","s","ft/s"],velocity:["ft/s","m/s","ft","s"]
};
const MEASURE_TYPE={impact_time:"time",peak_time:"time",height_observation:"height",max_height:"height",velocity_observation:"velocity",impact_velocity:"velocity"};
const fieldsByProblem={1:["impact_time","height_observation","velocity_observation"],2:["peak_time","max_height","impact_time"],3:["height_observation","impact_time","impact_velocity"]};
const names={EXAM_NOT_OPEN:"La evaluación no está abierta. Consulta al docente.",INSTITUTIONAL_EMAIL_REQUIRED:"Debes verificar un correo válido @ijr.edu.co para entrar.",IDENTITY_CONFLICT_CONTACT_TEACHER:"Esta dirección ya tiene un intento asociado a otra identidad. Contacta al docente.",START_CONFLICT_RETRY:"El intento se está creando. Vuelve a intentarlo.",DEADLINE_REACHED:"Se cumplió el plazo de entrega definido por el servidor.",REVISION_CONFLICT:"La respuesta cambió en otra sesión. Recarga el intento antes de continuar.",INCOMPLETE_ANSWERS:"Faltan valores numéricos o unidades en alguno de los tres problemas.",INVALID_NUMBER:"Ingresa solo números; se admite el signo menos y los decimales.",INVALID_UNITS:"Selecciona una unidad en cada resultado.",EVIDENCE_REQUIRED:"Debes subir un PDF o una imagen con el procedimiento antes de entregar.",FILE_TOO_LARGE:"El archivo excede 5 MB.",UNSUPPORTED_FILE_TYPE:"Solo se admiten archivos PDF, JPG, PNG o WEBP.",FILE_REQUIRED:"Selecciona un PDF o imagen antes de subir.",EVIDENCE_SAVE_FAILED:"No se pudo registrar el archivo. Inténtalo de nuevo.",TEACHER_MFA_REQUIRED:"Debes iniciar sesión con una cuenta docente y MFA habilitado."};
let current=null,index=0,dirty=false,uploadInProgress=false,supabase=null,studentAuth=null,pendingEmail="",teacherResults=[],teacherInfo=null,selectedReview=null;
const errorText=(code)=>names[code]||code||"No se completó la solicitud.";
const notice=(id,text,ok=false)=>{const el=$(id);el.textContent=text;el.classList.toggle("ok",ok)};
const show=id=>["welcome","exam","receipt","teacher"].forEach(n=>$(n).classList.toggle("hidden",n!==id));
const money=x=>Number(x).toLocaleString("en-US",{maximumFractionDigits:2});
async function ensureStudentAuth(){
 if(studentAuth)return studentAuth;
 const lib=await import("https://esm.sh/@supabase/supabase-js@2.49.4");
 studentAuth=lib.createClient(URL,PUBLIC_KEY,{auth:{
  autoRefreshToken:true,persistSession:true,detectSessionInUrl:true,
  flowType:"implicit",storageKey:STUDENT_AUTH_KEY
 }});
 return studentAuth;
}
async function verifiedStudent(){
 const client=await ensureStudentAuth();
 const {data,error}=await client.auth.getUser();
 const user=data?.user,email=String(user?.email||"").trim().toLowerCase();
 if(error||!user||!SCHOOL_EMAIL_RE.test(email)||(!user.email_confirmed_at&&!user.confirmed_at))return null;
 return{user,email};
}
async function showVerifiedStudent(){
 const identity=await verifiedStudent();
 if(!identity)return false;
 $("startForm").classList.add("hidden");
 $("otpPanel").classList.add("hidden");
 $("verifiedPanel").classList.remove("hidden");
 $("verifiedStudentEmail").textContent=identity.email;
 notice("verifiedMsg","Correo validado. Puedes entrar con tu único intento.",true);
 return true;
}
async function request(action,payload={},teacher=false){
 const headers={"content-type":"application/json"};
 if(action!=="config"){
  const client=teacher?await ensureSupabase():await ensureStudentAuth();
  const {data}=await client.auth.getSession();
  if(!data.session?.access_token)throw Error(teacher?"Sesión docente expirada.":"Verifica el correo institucional para continuar.");
  headers.authorization="Bearer "+data.session.access_token;
 }
 const control=new AbortController(),timeout=setTimeout(()=>control.abort(),18000);
 try{
  const res=await fetch(API,{method:"POST",headers,body:JSON.stringify({action,...payload}),signal:control.signal,cache:"no-store"});
  let data;try{data=await res.json()}catch{throw Error("Respuesta inválida del servidor.")}
  if(!res.ok)throw Error(errorText(data.error));
  return data;
 }finally{clearTimeout(timeout)}
}
function diagramSvg(q){
 const h=money(q.initial_height),v=money(q.initial_velocity),g=money(q.g),up=q.scenario==="up",balloon=q.scenario==="down";
 const ballX=balloon?360:330,ballY=balloon?157:140;
 const arrowY=up?"M"+(ballX+55)+" "+(ballY+38)+"v-76":"M"+(ballX+55)+" "+(ballY-16)+"v85";
 const structure=balloon?
  '<ellipse cx="170" cy="115" rx="55" ry="71" fill="#a8d8cf" stroke="#287668" stroke-width="3"/><path d="M126 162L150 228H190L214 162M150 228V241H190V228" fill="none" stroke="#246459" stroke-width="3"/><rect x="149" y="242" width="42" height="31" rx="4" fill="#ca9470" stroke="#8d5e3d" stroke-width="2"/><path d="M170 45V175M127 111H213" stroke="#65ada3" stroke-width="1.5"/>':
  '<rect x="105" y="137" width="114" height="175" fill="#dbece7" stroke="#397d6d" stroke-width="2"/><path d="M99 136H225" stroke="#1b6a5e" stroke-width="6"/><g fill="#fff" stroke="#98bfb5"><rect x="122" y="160" width="27" height="28"/><rect x="175" y="160" width="27" height="28"/><rect x="122" y="217" width="27" height="28"/><rect x="175" y="217" width="27" height="28"/></g>';
 return '<svg viewBox="0 0 720 350" role="img" aria-label="Diagrama de movimiento vertical: altura inicial, velocidad inicial, gravedad y nivel de referencia">'+
  '<defs><marker id="arrowVel" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0L8 4L0 8Z" fill="#c96d40"/></marker><marker id="arrowGrav" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0L8 4L0 8Z" fill="#1c7565"/></marker></defs>'+
  '<rect width="720" height="350" fill="#f6fbf9"/><g stroke="#e0eeea" stroke-width="1"><path d="M80 45V316M165 45V316M250 45V316M335 45V316M420 45V316M505 45V316M590 45V316M675 45V316"/><path d="M70 95H680M70 160H680M70 225H680M70 290H680"/></g>'+
  structure+'<path d="M60 313H680" stroke="#4e746b" stroke-width="5"/>'+
  '<path d="M'+ballX+' 55V310" stroke="#9ec5bc" stroke-width="2" stroke-dasharray="7 9"/>'+
  '<circle cx="'+ballX+'" cy="'+ballY+'" r="17" fill="#fff" stroke="#1b6e65" stroke-width="4"/><circle cx="'+(ballX-5)+'" cy="'+(ballY-5)+'" r="5" fill="#d9f4ea"/>'+
  '<path d="'+arrowY+'" stroke="#c96d40" stroke-width="4" marker-end="url(#arrowVel)"/>'+
  '<path d="M530 125V224" stroke="#1c7565" stroke-width="4" marker-end="url(#arrowGrav)"/>'+
  '<g fill="#244b43" font-family="Arial,sans-serif" font-size="17" font-weight="600"><text x="555" y="174">g = '+g+' ft/s²</text><text x="410" y="75">y₀ = '+h+' ft</text><text x="410" y="105">v₀ = '+(Number(q.initial_velocity)>0?"+":"")+v+' ft/s</text><text x="525" y="302" font-size="13">y = 0 (ground)</text></g>'+
  '</svg>';
}
function drawNavigation(){
 const wrap=$("stepButtons");wrap.replaceChildren();
 current.questions.forEach((q,i)=>{
  const el=document.createElement("button");el.type="button";el.className="step-btn"+(i===index?" selected":"");
  const done=fieldsByProblem[i+1].every(f=>current.answers?.[String(i+1)]?.values?.[f]?.trim()&&current.answers?.[String(i+1)]?.units?.[f]);
  const num=document.createElement("span");num.className="step-num";num.textContent=String(i+1).padStart(2,"0");
  const label=document.createElement("span");label.className="step-copy";
  const a=document.createElement("b");a.textContent="Problem "+(i+1);
  const b=document.createElement("small");b.textContent=q.title;
  label.append(a,b);
  const mark=document.createElement("span");mark.className="mark";mark.textContent=done?"✓":"○";
  el.append(num,label,mark);
  el.addEventListener("click",async()=>{if(i!==index)await goTo(i)});
  wrap.append(el);
 });
 const saved=[1,2,3].filter(n=>fieldsByProblem[n].every(f=>current.answers?.[String(n)]?.values?.[f]?.trim()&&current.answers?.[String(n)]?.units?.[f])).length;
 $("countSaved").textContent=saved+" / 3";
}
function renderProblem(){
 if(!current||current.state!=="active")return;
 const q=current.questions[index],one=current.answers?.[String(index+1)]||{values:{},units:{}};
 $("studentLabel").textContent=current.student_name+" · Correo institucional verificado · Respuestas privadas";
 $("numberPill").textContent="PROBLEMA "+String(index+1).padStart(2,"0")+" DE 03";
 $("problemTitle").textContent=q.title;
 $("problemStatement").textContent=q.statement;
 $("diagram").innerHTML=diagramSvg(q);
 const box=$("answerFields");box.replaceChildren();
 q.fields.forEach((f,j)=>{
  const wrap=document.createElement("div");wrap.className="answer-item";
  const label=document.createElement("label");label.htmlFor="metric-"+f.id;label.textContent=String(j+1)+". "+f.label;
  const unit=document.createElement("div");unit.className="with-unit";
  const input=document.createElement("input");input.id="metric-"+f.id;input.type="text";input.inputMode="decimal";input.autocomplete="off";input.spellcheck=false;input.placeholder=f.unit==="ft/s"?"−96.00":"0.00";
  input.value=one.values?.[f.id]||"";input.addEventListener("input",()=>{dirty=true;$("saveMsg").textContent="Cambios sin guardar";});
  const selector=document.createElement("select");selector.id="unit-"+f.id;selector.setAttribute("aria-label","Seleccionar unidad para "+f.label);
  const blank=document.createElement("option");blank.value="";blank.textContent="Unidad";selector.append(blank);
  for(const u of UNIT_CHOICES[MEASURE_TYPE[f.id]]){
   const option=document.createElement("option");option.value=u;option.textContent=u;selector.append(option);
  }
  selector.value=one.units?.[f.id]||"";
  selector.addEventListener("change",()=>{dirty=true;$("saveMsg").textContent="Cambios sin guardar"});
  unit.append(input,selector);wrap.append(label,unit);box.append(wrap);
 });
 updateEvidenceStatus();
 dirty=false;$("saveMsg").textContent="Sin cambios pendientes";
 $("previousBtn").disabled=index===0;$("nextBtn").disabled=index===2;
 drawNavigation();
 updateClock();
}
function collect(){
 const q=current.questions[index],values={},units={};
 for(const f of q.fields){values[f.id]=$("metric-"+f.id).value.trim();units[f.id]=$("unit-"+f.id).value;}
 return {values,units};
}
function validValue(s){return /^[+-]?(?:\d+(?:[.,]\d+)?|[.,]\d+)$/.test(s)&&Number.isFinite(Number(s.replace(",",".")));}
async function save(){
 if(!current||current.state!=="active")return false;
 const a=collect();
 if(Object.values(a.values).some(s=>s&&!validValue(s))){notice("saveMsg","Hay números no válidos.");return false;}
 try{
  const result=await request("save",{question_number:index+1,revision:current.revision,values:a.values,units:a.units});
  current.revision=result.revision;current.answers={...current.answers,[String(index+1)]:a};
  dirty=false;$("saveMsg").textContent="✓ Guardado en servidor";
  drawNavigation();return true;
 }catch(e){$("saveMsg").textContent=e.message;return false}
}
async function goTo(i){
 if(dirty&&!await save())return;
 index=i;renderProblem();
 document.getElementById("exam").scrollIntoView({behavior:"smooth",block:"start"});
}
function updateClock(){
 if(!current?.deadline_at||current.state!=="active")return;
 const remain=Math.max(0,Math.floor((Date.parse(current.deadline_at)-Date.now())/1000));
 $("clock").textContent=String(Math.floor(remain/60)).padStart(2,"0")+":"+String(remain%60).padStart(2,"0");
 if(remain===0){$("submitBtn").disabled=true;notice("submitMsg","Tiempo agotado: el servidor ha cerrado el intento.");}
}
function finish(data){
 show("receipt");$("receiptTitle").textContent="Entrega registrada";
 $("receiptText").textContent=data.final_score!==undefined?"Calificación final publicada: "+money(data.final_score)+" / 5":"Tu entrega quedó guardada. La nota definitiva se determina después de la revisión docente.";
 $("receiptData").textContent="Recibo: "+(data.receipt||data.attempt_id)+" · "+(data.submitted_at?new Date(data.submitted_at).toLocaleString("es-CO"): "Registrado");
}
async function initializeAssessment(data){
 current=data;
 if(data.state==="submitted"){finish(data);return}
 index=0;show("exam");renderProblem();
}
async function enterAssessment(){
 try{
  const identity=await verifiedStudent();
  if(!identity){notice("verifiedMsg","El correo no está verificado. Solicita un enlace nuevo.");return;}
  $("continueBtn").disabled=true;notice("verifiedMsg","Comprobando el acceso...");
  const result=await request("start");
  await initializeAssessment(result);
 }catch(e){notice("verifiedMsg",e.message)}
 finally{$("continueBtn").disabled=false}
}
$("startForm").addEventListener("submit",async e=>{
 e.preventDefault();
 const email=$("studentEmail").value.trim().toLowerCase();
 if(!SCHOOL_EMAIL_RE.test(email)){notice("startMsg","Solo se permiten buzones institucionales @ijr.edu.co.");return;}
 $("startBtn").disabled=true;notice("startMsg","Solicitando acceso...");
 try{
  const client=await ensureStudentAuth();
  const {error}=await client.auth.signInWithOtp({
   email,options:{shouldCreateUser:true,emailRedirectTo:location.origin+location.pathname}
  });
  if(error)throw error;
  pendingEmail=email;
  $("otpPanel").classList.remove("hidden");
  notice("startMsg","Si este buzón puede recibir mensajes, revisa el enlace o código enviado.",true);
 }catch(e){notice("startMsg","No se pudo enviar la verificación: "+e.message)}
 finally{$("startBtn").disabled=false}
});
$("verifyForm").addEventListener("submit",async e=>{
 e.preventDefault();
 const code=$("emailOtp").value.trim();
 if(!/^[0-9]{6,8}$/.test(code)){notice("verifyMsg","Introduce los 6–8 dígitos recibidos.");return;}
 $("verifyBtn").disabled=true;notice("verifyMsg","Comprobando código...");
 try{
  const client=await ensureStudentAuth();
  const {error}=await client.auth.verifyOtp({email:pendingEmail,token:code,type:"email"});
  if(error)throw error;
  if(!await showVerifiedStudent())throw Error("El dominio o la confirmación del buzón no son válidos.");
  await enterAssessment();
 }catch(e){notice("verifyMsg",e.message)}
 finally{$("verifyBtn").disabled=false}
});
$("changeEmailBtn").addEventListener("click",()=>{
 pendingEmail="";
 $("emailOtp").value="";
 $("otpPanel").classList.add("hidden");
 notice("startMsg","");
});
$("continueBtn").addEventListener("click",enterAssessment);
$("studentLogoutBtn").addEventListener("click",logoutStudent);
function updateEvidenceStatus(){
 const item=current?.evidence;
 const status=$("evidenceStatus");
 status.textContent=item?"✓ Procedimiento guardado de forma privada: "+item.name+" ("+(item.size/1024/1024).toFixed(2)+" MB) · "+new Date(item.uploaded_at).toLocaleString("es-CO"):"Todavía no has subido el procedimiento. Es obligatorio antes de entregar.";
 status.classList.toggle("ready",!!item);
}
$("uploadEvidenceBtn").addEventListener("click",async()=>{
 if(!current||current.state!=="active"||uploadInProgress)return;
 const file=$("evidenceFile").files?.[0];
 if(!file){notice("evidenceStatus","Selecciona un PDF o imagen.",false);return;}
 if(file.size>5242880||file.size<64){notice("evidenceStatus","El archivo debe tener entre 64 bytes y 5 MB.");return;}
 if(!["application/pdf","image/jpeg","image/png","image/webp"].includes(file.type)){notice("evidenceStatus","Formato no admitido; utiliza PDF, JPG, PNG o WEBP.");return;}
 const auth=await ensureStudentAuth();const {data:authData}=await auth.auth.getSession();
 if(!authData.session?.access_token){notice("evidenceStatus","Verifica el correo institucional antes de subir.");return;}
 uploadInProgress=true;$("uploadEvidenceBtn").disabled=true;$("submitBtn").disabled=true;
 notice("evidenceStatus","Subiendo archivo y verificando su integridad...");
 try{
  const form=new FormData();
  form.append("action","upload");
  form.append("file",file,file.name);
  const controller=new AbortController(),tid=setTimeout(()=>controller.abort(),70000);
  let response;
  try{response=await fetch(API,{method:"POST",headers:{authorization:"Bearer "+authData.session.access_token},body:form,signal:controller.signal,cache:"no-store"});}
  finally{clearTimeout(tid)}
  const data=await response.json();
  if(!response.ok)throw Error(errorText(data.error));
  current.evidence=data.evidence;
  $("evidenceFile").value="";
  updateEvidenceStatus();
 }catch(e){notice("evidenceStatus",e.message||"No se pudo cargar el archivo.");}
 finally{uploadInProgress=false;$("uploadEvidenceBtn").disabled=false;$("submitBtn").disabled=false;}
});
$("previousBtn").addEventListener("click",()=>goTo(Math.max(index-1,0)));
$("nextBtn").addEventListener("click",()=>goTo(Math.min(index+1,2)));
$("saveBtn").addEventListener("click",save);
function setSubmitDialog(open){
 const dialog=$("submitDialog");dialog.classList.toggle("hidden",!open);
 dialog.setAttribute("aria-hidden",String(!open));
 if(open){$("confirmStatus").textContent="";$("confirmSubmission").focus();}
 else $("submitBtn").focus();
}
$("submitBtn").addEventListener("click",async()=>{
 if(uploadInProgress)return;
 if(dirty&&!await save())return;
 if(!current||current.state!=="active")return;
 if(!current.evidence){notice("submitMsg","Debes subir el procedimiento como PDF o imagen para presentar la evaluación.");$("evidenceFile").focus();return;}
 setSubmitDialog(true);
});
$("cancelSubmission").addEventListener("click",()=>setSubmitDialog(false));
$("submitDialog").addEventListener("keydown",e=>{
 if(e.key==="Escape"){e.preventDefault();setSubmitDialog(false)}
});
$("confirmSubmission").addEventListener("click",async()=>{
 if(!current||current.state!=="active")return;
 $("confirmSubmission").disabled=true;
 notice("confirmStatus","Registrando entrega...");
 try{
  const r=await request("submit",{revision:current.revision});
  current.state="submitted";setSubmitDialog(false);finish(r);
 }catch(e){
  notice("confirmStatus",e.message);
 }finally{$("confirmSubmission").disabled=false}
});
async function logoutStudent(){
 if(studentAuth)await studentAuth.auth.signOut();
 current=null;pendingEmail="";
 $("studentEmail").value="";$("emailOtp").value="";
 $("verifiedPanel").classList.add("hidden");
 $("otpPanel").classList.add("hidden");
 $("startForm").classList.remove("hidden");
 notice("verifiedMsg","");notice("startMsg","");
 show("welcome");
}
$("receiptExit").addEventListener("click",logoutStudent);
setInterval(updateClock,1000);
async function restore(){
 try{
  const client=await ensureStudentAuth();
  const {data}=await client.auth.getSession();
  if(!data.session)return;
  if(!await showVerifiedStudent())return;
  try{const previous=await request("status");await initializeAssessment(previous)}
  catch(e){notice("verifiedMsg","Sesión institucional activa. Puedes entrar cuando el docente habilite la evaluación.",true)}
 }catch(e){notice("startMsg","No se pudo recuperar la sesión institucional.")}
}
async function ensureSupabase(){
 if(supabase)return supabase;
 const lib=await import("https://esm.sh/@supabase/supabase-js@2.49.4");
 supabase=lib.createClient(URL,PUBLIC_KEY,{auth:{autoRefreshToken:true,persistSession:true,detectSessionInUrl:false,storageKey:"ijr-physics9-freefall-teacher"}});
 return supabase;
}
$("teacherLink").addEventListener("click",()=>{show("teacher");$("teacherLogin").classList.remove("hidden");$("teacherConsole").classList.add("hidden");});
$("teacherExit").addEventListener("click",()=>show(current?.state==="active"?"exam":"welcome"));
async function handleMfa(){
 const {data}=await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
 if(data?.currentLevel==="aal2"){await enterTeacher();return}
 const {data:factors,error}=await supabase.auth.mfa.listFactors();
 if(error)throw error;
 if(!factors?.totp?.length)throw Error("La cuenta requiere configurar MFA TOTP en Supabase Auth antes de administrar este examen.");
 $("teacherForm").classList.add("hidden");$("mfaForm").classList.remove("hidden");
}
$("teacherForm").addEventListener("submit",async e=>{
 e.preventDefault();notice("teacherLoginMsg","Verificando...");
 try{
  const client=await ensureSupabase();
  const {error}=await client.auth.signInWithPassword({email:$("teacherEmail").value.trim(),password:$("teacherPassword").value});
  if(error)throw error;
  $("teacherPassword").value="";
  await handleMfa();
 }catch(e){notice("teacherLoginMsg",e.message)}
});
$("mfaForm").addEventListener("submit",async e=>{
 e.preventDefault();
 try{
  const {data:factors,error:fe}=await supabase.auth.mfa.listFactors();
  if(fe||!factors?.totp?.length)throw Error("No hay autenticador MFA registrado.");
  const {error}=await supabase.auth.mfa.challengeAndVerify({factorId:factors.totp[0].id,code:$("mfaCode").value.trim()});
  if(error)throw error;
  $("mfaCode").value="";await enterTeacher();
 }catch(e){notice("teacherLoginMsg",e.message)}
});
const input=id=>$(id).value;
const checkbox=id=>$(id).checked;
const dates=(iso)=>{if(!iso)return"";const d=new Date(iso);const z=n=>String(n).padStart(2,"0");return d.getFullYear()+"-"+z(d.getMonth()+1)+"-"+z(d.getDate())+"T"+z(d.getHours())+":"+z(d.getMinutes())};
function showSettings(s){
 $("duration").value=s.duration_minutes;$("relative").value=(Number(s.relative_tolerance)*100).toFixed(2);$("tolTime").value=s.absolute_time;$("tolHeight").value=s.absolute_height;$("tolVelocity").value=s.absolute_velocity;
 $("opens").value=dates(s.opens_at);$("closes").value=dates(s.closes_at);
 $("enabled").checked=s.enabled;$("showScore").checked=s.show_final_score;
}
async function enterTeacher(){
 const data=await request("admin_info",{},true);
 teacherInfo=data;$("teacherLogin").classList.add("hidden");$("teacherConsole").classList.remove("hidden");
 showSettings(data.settings);renderRoster(data.students);selectTeacherTab("settings");
 notice("teacherLoginMsg","Acceso verificado",true);
}
const panels={settings:"teacherSettings",students:"teacherStudents",results:"teacherResults",audit:"teacherAudit"};
function selectTeacherTab(which){
 for(const [key,id]of Object.entries(panels)){$(id).classList.toggle("hidden",key!==which);$(key+"Tab").classList.toggle("active",key===which)}
 if(which==="results")loadResults();if(which==="audit")loadAudit();
}
Object.keys(panels).forEach(x=>$(x+"Tab").addEventListener("click",()=>selectTeacherTab(x)));
$("logoutBtn").addEventListener("click",async()=>{if(supabase)await supabase.auth.signOut();$("teacherConsole").classList.add("hidden");$("teacherLogin").classList.remove("hidden");$("teacherForm").classList.remove("hidden");$("mfaForm").classList.add("hidden");notice("teacherLoginMsg","Sesión cerrada.",true)});
$("settingsForm").addEventListener("submit",async e=>{
 e.preventDefault();
 const toIso=s=>s?new Date(s).toISOString():null;
 const settings={enabled:checkbox("enabled"),show_final_score:checkbox("showScore"),duration_minutes:Number(input("duration")),relative_tolerance:Number(input("relative"))/100,absolute_time:Number(input("tolTime")),absolute_height:Number(input("tolHeight")),absolute_velocity:Number(input("tolVelocity")),opens_at:toIso(input("opens")),closes_at:toIso(input("closes"))};
 if(settings.enabled&&!confirm("Al habilitar, los estudiantes que tengan código activo podrán iniciar y entregar sus evaluaciones. ¿Continuar?"))return;
 notice("settingsMsg","Guardando...");
 try{const data=await request("admin_configure",{settings},true);showSettings(data.settings);notice("settingsMsg","✓ Configuración guardada y auditada.",true)}
 catch(e){notice("settingsMsg",e.message)}
});
function table(headers,rows){
 const node=document.createElement("table");node.className="data-table";
 const head=document.createElement("thead"),trh=document.createElement("tr");
 for(const h of headers){const th=document.createElement("th");th.textContent=h;trh.append(th)}head.append(trh);node.append(head);
 const body=document.createElement("tbody");
 for(const row of rows){const tr=document.createElement("tr");
  for(const val of row){const td=document.createElement("td");if(val instanceof Node)td.append(val);else td.textContent=String(val??"");tr.append(td)}
  body.append(tr)
 }
 node.append(body);return node;
}
function renderRoster(students){
 const rows=(students||[]).map(s=>[
  s.student_name,s.attempt?.state||"Sin iniciar",
  s.attempt?.started_at?new Date(s.attempt.started_at).toLocaleString("es-CO"):"—",
  s.attempt?.numeric_score??"Pendiente",
  s.attempt?.final_score??"Pendiente"
 ]);
 $("roster").replaceChildren(table(["Correo verificado","Intento","Fecha de inicio","Nota numérica","Nota final"],rows));
}
async function loadResults(){
 $("resultsTable").textContent="Consultando resultados...";
 try{
  const res=await request("admin_results",{},true);teacherResults=res.results;
  const rows=res.results.map(a=>{
   const btn=document.createElement("button");btn.type="button";btn.textContent="Revisar";
   btn.addEventListener("click",()=>renderReview(a));
   return [a.student.student_name,a.student.group_code,a.state,a.numeric_score??"—",a.final_score??"Sin revisar",a.evidence?.name||"Sin adjunto",a.submitted_at?new Date(a.submitted_at).toLocaleString("es-CO"):"—",btn];
  });
  $("resultsTable").replaceChildren(table(["Estudiante","Grupo","Estado","Auto / 5","Final / 5","Archivo","Entregado","Detalle"],rows));
 }catch(e){$("resultsTable").textContent=e.message}
}
$("refreshResults").addEventListener("click",loadResults);
function renderReview(a){
 const pane=$("reviewPane");pane.replaceChildren();
 const box=document.createElement("div");box.className="review-box";
 const h=document.createElement("h3");h.textContent=a.student.student_name+" · "+a.student.group_code+" · "+a.id;box.append(h);
 const summary=document.createElement("p");summary.textContent="Calificación numérica: "+(a.numeric_score??"pendiente")+" / 5 · Calificación revisada: "+(a.final_score??"pendiente");box.append(summary);
 const details=document.createElement("details"),summ=document.createElement("summary");summ.textContent="Ver los nueve valores, diferencias y tolerancias";
 const pre=document.createElement("pre");pre.textContent=(a.breakdown||[]).map(x=>"P"+x.question+" · "+x.field+": estudiante="+x.submitted+" "+(x.submitted_unit||"(sin unidad histórica)")+
 (x.normalized_base===null?"":", valor normalizado="+Number(x.normalized_base).toFixed(5))+
 ", exacto="+Number(x.expected).toFixed(5)+" "+(x.expected_unit||"")+ ", ±"+Number(x.epsilon).toFixed(5)+
 " => "+(x.correct?"CORRECTO":"REVISAR UNIDAD O VALOR")).join("\n")||"Aún no ha entregado.";
 details.append(summ,pre);box.append(details);
 if(a.evidence){
  const proof=document.createElement("div");proof.className="evidence-review";
  const h=document.createElement("strong");h.textContent="Archivo de procedimiento: "+a.evidence.name+" · "+(a.evidence.size/1024/1024).toFixed(2)+" MB";
  const digest=document.createElement("p");digest.className="hint";digest.textContent="SHA-256: "+a.evidence.sha256;
  const btn=document.createElement("button");btn.type="button";btn.className="secondary";btn.textContent="Generar enlace privado de descarga (90 s)";
  const linkWrap=document.createElement("div");linkWrap.className="download-area";
  btn.addEventListener("click",async()=>{
   btn.disabled=true;linkWrap.textContent="Verificando acceso y generando enlace...";
   try{
    const result=await request("admin_evidence_link",{attempt_id:a.id},true);
    const link=document.createElement("a");link.href=result.url;link.target="_blank";link.rel="noopener noreferrer";
    link.textContent="Descargar archivo para revisión (expira en 90 segundos)";
    linkWrap.replaceChildren(link);
   }catch(err){linkWrap.textContent=err.message}finally{btn.disabled=false}
  });
  proof.append(h,digest,btn,linkWrap);box.append(proof);
 }else{
  const old=document.createElement("p");old.className="hint";
  old.textContent="Esta entrega no tiene archivo adjunto (registro de versión anterior).";
  box.append(old);
 }
 if(a.state==="submitted"){
  const form=document.createElement("form");
  const label=document.createElement("label");label.textContent="Nota definitiva (0–5)";
  const score=document.createElement("input");score.type="number";score.min="0";score.max="5";score.step="0.01";score.required=true;score.value=a.final_score??a.numeric_score??"0";
  const noteLabel=document.createElement("label");noteLabel.textContent="Justificación de revisión (mínimo 10 caracteres)";
  const note=document.createElement("textarea");note.rows=3;note.required=true;note.value=a.teacher_feedback||"Revisión manual del archivo de procedimiento, operaciones, ecuaciones, signos y unidades.";
  const btn=document.createElement("button");btn.type="submit";btn.className="primary";btn.textContent="Registrar revisión docente";
  const msg=document.createElement("p");msg.className="alert";
  form.append(label,score,noteLabel,note,btn,msg);
  form.addEventListener("submit",async e=>{e.preventDefault();btn.disabled=true;
   try{await request("admin_review",{attempt_id:a.id,final_score:Number(score.value),comment:note.value},true);msg.textContent="Revisión registrada";await loadResults()}
   catch(ex){msg.textContent=ex.message}finally{btn.disabled=false}
  });box.append(form);
 }
 pane.append(box);
}
async function loadAudit(){
 $("auditData").textContent="Consultando eventos...";
 try{
  const d=await request("admin_events",{},true);
  const rows=d.events.map(x=>[x.id,new Date(x.occurred_at).toLocaleString("es-CO"),x.actor,x.event_type,x.attempt_id||"—",JSON.stringify(x.details).slice(0,380)]);
  $("auditData").replaceChildren(table(["ID","Hora","Actor","Evento","Intento","Datos"],rows));
 }catch(e){$("auditData").textContent=e.message}
}
$("refreshAudit").addEventListener("click",loadAudit);
restore();
request("config").then(s=>{if(!s.open)notice("startMsg",s.enabled?"La evaluación no está dentro de su ventana de apertura.":"Evaluación preparada. El docente aún no la ha habilitado.");}).catch(()=>notice("startMsg","No se pudo consultar el estado del servidor."));
