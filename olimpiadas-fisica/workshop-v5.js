(() => {
  const cfg = window.PHYSICS_OLYMPIAD_CONFIG;
  const data = window.PHYSICS_OLYMPIAD_DATA;
  const figures = window.PhysicsOlympiadWorkshopVisuals;
  if (!cfg || !data?.topics) return;
  const $=(id)=>document.getElementById(id);
  const esc=(v)=>String(v??"").replace(/[&<>'"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]));
  const endpoint=`${cfg.projectUrl}/functions/v1/${cfg.functionName}`;
  const state={token:null,profile:null,progress:new Map(),solved:new Set(),activeTopic:null};

  function math(root=document.body){ if(!window.renderMathInElement)return; try{window.renderMathInElement(root,{delimiters:[{left:"\\(",right:"\\)",display:false},{left:"\\[",right:"\\]",display:true},{left:"$$",right:"$$",display:true}],throwOnError:false});}catch(e){console.warn(e);} }
  async function api(payload){
    const res=await fetch(endpoint,{method:"POST",headers:{"Content-Type":"application/json","apikey":cfg.publishableKey},body:JSON.stringify(payload)});
    const body=await res.json().catch(()=>({}));
    if(!res.ok) throw new Error(body.error||`HTTP ${res.status}`);
    return body;
  }
  const totalQuestions=()=>data.topics.reduce((s,t)=>s+Number(t.questions?.length||0),0)||80;
  function status(msg,error=false){const el=$("workshopRegistrationStatus");if(!el)return;el.textContent=msg;el.style.color=error?"#b42318":"#667085";}
  function groups(){const grade=Number($("workshopGrade").value);const sel=$("workshopGroup");sel.innerHTML="";if(![9,10,11].includes(grade)){sel.disabled=true;sel.innerHTML='<option value="">Primero selecciona grado</option>';return;}sel.disabled=false;sel.innerHTML=`<option value="">Selecciona…</option>${["A","B","C"].map(l=>`<option value="${grade}${l}">${grade}°${l}</option>`).join("")}`;}
  function loadProgress(payload){state.progress.clear();(payload?.rows||[]).forEach(r=>state.progress.set(r.topic_slug,r));const correct=Number(payload?.correct||0),total=Number(payload?.total||totalQuestions()),percent=Number(payload?.percent||0);$("workshopGlobalPercent").textContent=`${percent}%`;$("workshopGlobalBar").style.width=`${percent}%`;$("workshopGlobalCopy").textContent=`${correct} / ${total} retos validados`;}
  function progressText(topic){const r=state.progress.get(topic.slug);const total=topic.questions.length;if(!r)return`0/${total}`;return r.completed?`${total}/${total} ✓`:`${r.correct_count}/${r.total_count||total}`;}
  function setIdentity(){if(!state.profile)return;$("workshopIdentity").textContent=`${state.profile.full_name} · ${state.profile.group_code} · ${state.profile.participant_code}`;$("workshopSessionBadge").textContent=`${state.profile.participant_code} · ${state.profile.group_code}`;$("workshopSessionBadge").classList.remove("hidden");$("workshopSwitch").classList.remove("hidden");}
  function nav(){
    $("workshopTopicNav").innerHTML=data.topics.map(t=>`<button type="button" class="v5-topic-btn ${t.slug===state.activeTopic?"active":""}" data-topic="${t.slug}"><span class="n">${esc(t.number)}</span><span class="t">${esc(t.title)}</span><span class="p">${progressText(t)}</span></button>`).join("");
    $("workshopTopicNav").querySelectorAll("[data-topic]").forEach(b=>b.addEventListener("click",()=>select(b.dataset.topic)));
  }
  function renderQuestion(topic,q,index){
    const solved=state.solved.has(q.id);const fig=figures?.renderQuestion?figures.renderQuestion(q):"";
    return `<article class="v5-question ${solved?"solved":""}" id="card-${q.id}">
      <div class="v5-question-top"><span class="v5-qid">Challenge ${index+1} · ${esc(q.id.toUpperCase())}</span><span class="v5-qmeta"><span class="v5-chip">${esc(q.skill)}</span><span class="v5-chip">${esc(q.difficulty)}</span></span></div>
      <h4>${q.prompt}</h4>
      <div class="v5-focus"><strong>Olympiad focus:</strong> ${esc(q.description||topic.problemLens||"Modela antes de calcular.")}</div>
      ${fig?`<div class="v5-figure-wrap">${fig}</div>`:`<p class="v5-diagram-policy">Este reto es principalmente simbólico/conceptual; se omite una figura decorativa para no introducir información irrelevante.</p>`}
      <div class="v5-options">${Object.entries(q.options).map(([letter,opt])=>`<label class="v5-option"><input type="radio" name="answer-${q.id}" value="${letter}" ${solved?"disabled":""}><span class="v5-letter">${letter}</span><span>${opt}</span></label>`).join("")}</div>
      <div class="v5-question-actions"><button type="button" class="v5-btn ${solved?"secondary":""}" data-check="${q.id}" ${solved?"disabled":""}>${solved?"Solved ✓":"Check answer"}</button><span class="v5-feedback" id="feedback-${q.id}" role="status" aria-live="polite">${solved?"Validated in saved progress.":"Choose one option."}</span></div>
      <div id="solution-${q.id}"></div>
    </article>`;
  }
  function renderTopic(topic){
    const row=state.progress.get(topic.slug);const correct=Number(row?.correct_count||0),total=Number(row?.total_count||topic.questions.length);
    $("workshopContent").innerHTML=`<section class="v5-workshop-intro"><div><p class="v5-kicker">Block ${esc(topic.number)} · ${esc(topic.english)}</p><h2>${esc(topic.title)}</h2><p>${esc(topic.problemLens||topic.overview)}</p></div><span class="v5-topic-score">${correct}/${total} correctas</span></section><div class="v5-routine"><strong>Rutina:</strong> lee → identifica sistema y datos → usa la figura solo como modelo físico → plantea simbólicamente → responde → comprueba unidades y sentido.</div><div class="v5-question-list">${topic.questions.map((q,i)=>renderQuestion(topic,q,i)).join("")}</div>`;
    $("workshopContent").querySelectorAll("[data-check]").forEach(b=>b.addEventListener("click",()=>submit(b.dataset.check,topic.slug)));
    math($("workshopContent"));
  }
  function select(slug,push=true){const topic=data.topics.find(t=>t.slug===slug)||data.topics[0];state.activeTopic=topic.slug;if(push)history.replaceState(null,"",`#${topic.slug}`);nav();renderTopic(topic);window.scrollTo({top:0,behavior:"smooth"});}
  function showWorkshop(){ $("workshopRegistration").classList.add("hidden");$("workshopMain").classList.remove("hidden");setIdentity();nav();const initial=data.topics.find(t=>t.slug===location.hash.slice(1))?.slug||data.topics[0].slug;select(initial,false); }
  async function submit(questionId,topicSlug){
    if(!state.token)return;const selected=document.querySelector(`input[name="answer-${questionId}"]:checked`),feedback=$(`feedback-${questionId}`),card=$(`card-${questionId}`),button=card?.querySelector("[data-check]");
    if(!selected){feedback.textContent="Selecciona una opción antes de validar.";feedback.className="v5-feedback wrong";return;}
    button.disabled=true;feedback.textContent="Validating…";feedback.className="v5-feedback";
    try{
      const result=await api({action:"submit",access_token:state.token,question_id:questionId,answer:selected.value});loadProgress(result.progress);
      if(result.correct||result.already_correct){state.solved.add(questionId);card.classList.add("solved");card.querySelectorAll("input").forEach(i=>i.disabled=true);button.textContent="Solved ✓";button.className="v5-btn secondary";feedback.textContent=result.already_correct?"Ya estaba validada en tu progreso.":`Correcta · intento ${result.try_count}.`;feedback.className="v5-feedback correct";if(result.solution)$(`solution-${questionId}`).innerHTML=`<div class="v5-solution"><strong>Reasoned solution</strong><div>${result.solution}</div></div>`;}
      else{feedback.textContent=`Aún no · intento ${result.try_count}. Hint: ${result.hint||"revisa el modelo físico."}`;feedback.className="v5-feedback wrong";button.disabled=false;}
      nav();math(card);
    }catch(e){feedback.textContent="No fue posible validar ahora. Intenta nuevamente.";feedback.className="v5-feedback wrong";button.disabled=false;}
  }
  async function register(ev){ev.preventDefault();const full_name=$("workshopName").value.trim(),grade=Number($("workshopGrade").value),group_code=$("workshopGroup").value;if(full_name.length<3||![9,10,11].includes(grade)||!group_code){status("Completa nombre, grado y grupo.",true);return;}const btn=$("workshopRegisterBtn");btn.disabled=true;status("Creando participante…");try{const result=await api({action:"register",full_name,grade,group_code});state.token=result.access_token;state.profile=result.profile;state.solved=new Set();localStorage.setItem(cfg.storageKey,state.token);loadProgress(result.progress);showWorkshop();}catch(e){status("No fue posible registrar: "+e.message,true);}finally{btn.disabled=false;}}
  async function restore(){const token=localStorage.getItem(cfg.storageKey);if(!token)return;status("Restaurando progreso…");try{const result=await api({action:"load",access_token:token});state.token=token;state.profile=result.profile;state.solved=new Set((result.solved||[]).map(x=>x.question_id));loadProgress(result.progress);showWorkshop();}catch(e){localStorage.removeItem(cfg.storageKey);status("La sesión anterior no pudo restaurarse. Registra el participante nuevamente.",true);}}
  function reset(){localStorage.removeItem(cfg.storageKey);state.token=null;state.profile=null;state.progress.clear();state.solved.clear();$("workshopMain").classList.add("hidden");$("workshopRegistration").classList.remove("hidden");$("workshopSessionBadge").classList.add("hidden");$("workshopSwitch").classList.add("hidden");status("Puedes registrar otro participante.");window.scrollTo({top:0,behavior:"smooth"});}
  $("workshopGrade").addEventListener("change",groups);$("workshopRegistrationForm").addEventListener("submit",register);$("workshopSwitch").addEventListener("click",reset);groups();restore();
})();