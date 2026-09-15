(() => {
  const data = window.PHYSICS_OLYMPIAD_DATA;
  if (!data?.topics) return;
  const topic = data.topics.find((t) => t.slug === "final-sprint");
  if (!topic) return;

  const storagePrefix = "ijr.physicsOlympiad.finalSprint.timer.v9.";
  const globalKey = `${storagePrefix}global`;
  let tickHandle = null;
  let injectQueued = false;
  const fmt = (seconds) => {
    const s = Math.max(0, Math.ceil(seconds));
    return `${String(Math.floor(s / 60)).padStart(2,"0")}:${String(s % 60).padStart(2,"0")}`;
  };
  const totalSec = () => topic.questions.reduce((sum,q)=>sum+Number(q.timeLimitSec||0),0);
  const readDeadline = (key) => {
    const value = Number(sessionStorage.getItem(key)||0);
    return Number.isFinite(value)&&value>0?value:null;
  };
  const writeDeadline = (key,deadline) => sessionStorage.setItem(key,String(deadline));
  const clearDeadline = (key) => sessionStorage.removeItem(key);

  function ensureGlobalPanel(){
    if(location.hash!=="#final-sprint") return;
    const content=document.getElementById("workshopContent");
    const intro=content?.querySelector(".v5-workshop-intro");
    if(!content||!intro||content.querySelector(".v9-final-brief")) return;
    const seconds=totalSec();
    const panel=document.createElement("section");
    panel.className="v9-final-brief";
    panel.innerHTML=`<div><p class="v5-kicker">SIMULACRO FINAL · GRADO 11</p><h3>20 problemas · ${Math.round(seconds/60)} min</h3><p>Entrena la velocidad de decisión. Si se agota el tiempo objetivo de un problema, termina el razonamiento y revisa qué parte del modelado consumió más tiempo.</p></div><div class="v9-global-timer" aria-live="polite"><span>Simulacro completo</span><strong id="v9GlobalClock">${fmt(seconds)}</strong><button type="button" id="v9GlobalStart">Iniciar ${Math.round(seconds/60)} min</button><button type="button" id="v9GlobalReset" class="secondary">Reiniciar</button></div>`;
    intro.insertAdjacentElement("afterend",panel);
    panel.querySelector("#v9GlobalStart")?.addEventListener("click",()=>{const current=readDeadline(globalKey);if(!current||current<=Date.now())writeDeadline(globalKey,Date.now()+seconds*1000);startTicker();updateAll();});
    panel.querySelector("#v9GlobalReset")?.addEventListener("click",()=>{clearDeadline(globalKey);updateAll();});
  }

  function ensureQuestionTimer(q){
    if(!q.timeLimitSec) return;
    const card=document.getElementById(`card-${q.id}`);
    if(!card||card.querySelector(".v9-question-timer")) return;
    const top=card.querySelector(".v5-question-top");
    if(!top) return;
    const timer=document.createElement("div");
    timer.className="v9-question-timer";
    timer.dataset.qid=q.id;
    timer.innerHTML=`<div class="v9-timer-copy"><span>${q.stage||"Cronometrado"} · tiempo objetivo</span><strong class="v9-clock">${fmt(q.timeLimitSec)}</strong></div><button type="button" class="v9-start">Iniciar</button><button type="button" class="v9-reset secondary">Reiniciar</button>`;
    top.insertAdjacentElement("afterend",timer);
    timer.querySelector(".v9-start")?.addEventListener("click",()=>{const key=`${storagePrefix}${q.id}`;const current=readDeadline(key);if(!current||current<=Date.now())writeDeadline(key,Date.now()+q.timeLimitSec*1000);startTicker();updateAll();});
    timer.querySelector(".v9-reset")?.addEventListener("click",()=>{clearDeadline(`${storagePrefix}${q.id}`);card.classList.remove("v9-time-expired","v9-time-running");updateAll();});
  }

  function updateQuestion(q){
    const card=document.getElementById(`card-${q.id}`);
    const timer=card?.querySelector(".v9-question-timer");
    if(!card||!timer) return;
    const clock=timer.querySelector(".v9-clock");const start=timer.querySelector(".v9-start");const solved=card.classList.contains("solved");const key=`${storagePrefix}${q.id}`;const deadline=readDeadline(key);
    if(solved){clearDeadline(key);card.classList.remove("v9-time-expired","v9-time-running");if(clock)clock.textContent="RESUELTO";if(start)start.disabled=true;return;}
    if(!deadline){card.classList.remove("v9-time-expired","v9-time-running");if(clock)clock.textContent=fmt(q.timeLimitSec);if(start){start.disabled=false;start.textContent="Iniciar";}return;}
    const remaining=(deadline-Date.now())/1000;
    if(remaining<=0){card.classList.remove("v9-time-running");card.classList.add("v9-time-expired");if(clock)clock.textContent="00:00";if(start){start.disabled=false;start.textContent="Reiniciar tiempo";}return;}
    card.classList.add("v9-time-running");card.classList.remove("v9-time-expired");if(clock)clock.textContent=fmt(remaining);if(start){start.disabled=true;start.textContent="En curso";}
  }

  function updateGlobal(){
    const clock=document.getElementById("v9GlobalClock"),start=document.getElementById("v9GlobalStart"),panel=document.querySelector(".v9-final-brief");
    if(!clock||!start||!panel)return;const seconds=totalSec();const deadline=readDeadline(globalKey);
    if(!deadline){panel.classList.remove("expired","running");clock.textContent=fmt(seconds);start.disabled=false;start.textContent=`Iniciar ${Math.round(seconds/60)} min`;return;}
    const remaining=(deadline-Date.now())/1000;
    if(remaining<=0){panel.classList.remove("running");panel.classList.add("expired");clock.textContent="00:00";start.disabled=false;start.textContent="Reiniciar simulacro";return;}
    panel.classList.add("running");panel.classList.remove("expired");clock.textContent=fmt(remaining);start.disabled=true;start.textContent="Simulacro en curso";
  }
  function updateAll(){updateGlobal();for(const q of topic.questions)updateQuestion(q);}
  function inject(){injectQueued=false;ensureGlobalPanel();if(location.hash==="#final-sprint")for(const q of topic.questions)ensureQuestionTimer(q);updateAll();}
  function queueInject(){if(injectQueued)return;injectQueued=true;requestAnimationFrame(inject);}
  function startTicker(){if(tickHandle)return;tickHandle=window.setInterval(updateAll,1000);}
  const root=document.getElementById("workshopContent");if(root)new MutationObserver(queueInject).observe(root,{childList:true});
  window.addEventListener("hashchange",queueInject);document.addEventListener("visibilitychange",()=>{if(!document.hidden)updateAll();});
  startTicker();queueInject();
})();
