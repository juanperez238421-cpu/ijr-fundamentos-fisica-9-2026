(() => {
  const data = window.PHYSICS_OLYMPIAD_DATA;
  const visuals = window.PhysicsOlympiadVisuals;
  if (!data?.topics) return;
  const $ = (id) => document.getElementById(id);
  const esc = (v) => String(v ?? "").replace(/[&<>'"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]));
  let active = null;

  function math(root=document.body){
    if (!window.renderMathInElement) return;
    try { window.renderMathInElement(root,{delimiters:[{left:"\\(",right:"\\)",display:false},{left:"\\[",right:"\\]",display:true},{left:"$$",right:"$$",display:true}],throwOnError:false}); } catch(e){ console.warn(e); }
  }
  function visual(cfg, compact=false){ return visuals?.render ? visuals.render(cfg, compact) : ""; }
  function nav(){
    $("theoryTopicNav").innerHTML = data.topics.map(t => `<button type="button" class="v5-topic-btn ${t.slug===active?"active":""}" data-topic="${t.slug}"><span class="n">${esc(t.number)}</span><span class="t">${esc(t.title)}</span><span class="p">Theory</span></button>`).join("");
    $("theoryTopicNav").querySelectorAll("[data-topic]").forEach(b=>b.addEventListener("click",()=>select(b.dataset.topic)));
  }
  function contest(topic){
    if(!topic.contestUse) return "";
    const rows=[["Qualifier",topic.contestUse.qualifier],["Semifinal",topic.contestUse.semifinal],["Final",topic.contestUse.final]];
    return `<div class="v5-theory-grid">${rows.map(([k,v])=>`<article class="v5-theory-card"><strong>${k}</strong><p>${esc(v)}</p></article>`).join("")}</div>`;
  }
  function render(topic){
    const methods=topic.decisionSteps||["Define sistema e incógnita.","Construye un diagrama físico.","Elige el principio.","Comprueba unidades y sentido físico."];
    $("theoryContent").innerHTML = `
      <header class="v5-topic-head">
        <div class="v5-topic-head-row"><div><p class="v5-kicker">Block ${esc(topic.number)} · ${esc(topic.english)}</p><h2>${esc(topic.title)}</h2></div><span class="v5-level">${esc(topic.level)}</span></div>
        <p>${esc(topic.overview)}</p>
        <div class="v5-objectives">${topic.objectives.map(x=>`<span>${esc(x)}</span>`).join("")}</div>
      </header>
      <section class="v5-section">
        <div class="v5-section-header"><div><span class="v5-section-tag">01 · Foundation</span><h3>Conceptual theory</h3></div></div>
        <div class="v5-theory-grid">${topic.theory.map(x=>`<article class="v5-theory-card"><strong>${esc(x.title)}</strong><p>${x.text}</p></article>`).join("")}</div>
      </section>
      <section class="v5-section">
        <div class="v5-section-header"><div><span class="v5-section-tag">02 · Olympiad reasoning</span><h3>Concept laboratory</h3></div></div>
        <div class="v5-deep-grid">
          <div>${visual(topic.visual)}</div>
          <div class="v5-olympiad-list">${(topic.olympiadTheory||[]).map(x=>`<article class="v5-olympiad-note"><strong>${esc(x.title)}</strong><p>${x.text}</p></article>`).join("")}</div>
        </div>
      </section>
      <section class="v5-section">
        <div class="v5-section-header"><div><span class="v5-section-tag">03 · Technical toolkit</span><h3>Equations with meaning</h3></div></div>
        <div class="v5-formulas">${topic.formulas.map(f=>`<div class="v5-formula">${f}</div>`).join("")}</div>
      </section>
      <section class="v5-section">
        <div class="v5-two-col">
          <div class="v5-callout danger"><h4>Conceptual traps</h4><ul>${topic.traps.map(x=>`<li>${esc(x)}</li>`).join("")}</ul></div>
          <div class="v5-callout good"><h4>Olympiad decision checklist</h4><ol>${methods.map(x=>`<li>${esc(x)}</li>`).join("")}</ol></div>
        </div>
      </section>
      <section class="v5-section">
        <div class="v5-section-header"><div><span class="v5-section-tag">04 · Worked example</span><h3>${esc(topic.example.title)}</h3></div></div>
        <div class="v5-worked"><p class="prompt">${topic.example.prompt}</p><ol>${topic.example.steps.map(x=>`<li>${x}</li>`).join("")}</ol><div class="v5-worked-answer">${topic.example.answer}</div></div>
      </section>
      <section class="v5-section">
        <div class="v5-section-header"><div><span class="v5-section-tag">05 · Competition use</span><h3>Where this matters</h3></div></div>
        ${contest(topic)}
      </section>`;
    math($("theoryContent"));
  }
  function select(slug,push=true){
    const topic=data.topics.find(t=>t.slug===slug)||data.topics[0]; active=topic.slug; if(push) history.replaceState(null,"",`#${active}`); nav(); render(topic); window.scrollTo({top:0,behavior:"smooth"});
  }
  const initial=data.topics.find(t=>t.slug===location.hash.slice(1))?.slug||data.topics[0].slug;
  select(initial,false);
})();