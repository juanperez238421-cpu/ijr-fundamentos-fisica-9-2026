(() => {
  const cfg = window.PHYSICS_OLYMPIAD_CONFIG;
  const data = window.PHYSICS_OLYMPIAD_DATA;
  const $ = (id) => document.getElementById(id);
  const state = { token: null, profile: null, progress: new Map(), solved: new Set(), guest: false, activeTopic: null };

  const endpoint = `${cfg.projectUrl}/functions/v1/${cfg.functionName}`;
  const registrationPanel = $("registrationPanel");
  const hubPanel = $("mainContent");
  const form = $("registrationForm");
  const gradeSelect = $("gradeSelect");
  const groupSelect = $("groupSelect");
  const status = $("registrationStatus");
  const switchButton = $("switchButton");
  const sessionBadge = $("sessionBadge");

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>'"]/g, (ch) => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[ch]));
  }

  async function api(payload) {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", "apikey": cfg.publishableKey },
      body: JSON.stringify(payload)
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(body.error || `HTTP ${res.status}`);
    return body;
  }

  function renderMath(root = document.body) {
    if (!window.renderMathInElement) return;
    try {
      window.renderMathInElement(root, {
        delimiters: [
          {left:"\\(",right:"\\)",display:false},
          {left:"\\[",right:"\\]",display:true},
          {left:"$$",right:"$$",display:true}
        ],
        throwOnError: false
      });
    } catch (err) { console.warn("KaTeX render warning", err); }
  }

  function setRegistrationStatus(message, isError = false) {
    status.textContent = message;
    status.style.color = isError ? "#b42318" : "#5f6b7a";
  }

  function populateGroups() {
    const grade = Number(gradeSelect.value);
    groupSelect.innerHTML = "";
    if (![9,10,11].includes(grade)) {
      groupSelect.disabled = true;
      groupSelect.innerHTML = '<option value="">Primero selecciona grado</option>';
      return;
    }
    groupSelect.disabled = false;
    groupSelect.innerHTML = `<option value="">Selecciona…</option>${["A","B","C"].map(letter => `<option value="${grade}${letter}">${grade}°${letter}</option>`).join("")}`;
  }

  function loadProgress(payload) {
    state.progress.clear();
    (payload?.rows || []).forEach(row => state.progress.set(row.topic_slug, row));
    updateGlobalProgress(payload);
  }

  function updateGlobalProgress(payload) {
    const correct = Number(payload?.correct || 0);
    const total = Number(payload?.total || 48);
    const percent = Number(payload?.percent || 0);
    $("globalPercent").textContent = `${percent}%`;
    $("globalProgressBar").style.width = `${percent}%`;
    $("globalProgressCopy").textContent = `${correct} / ${total} retos validados`;
  }

  function setSessionUI() {
    sessionBadge.classList.remove("hidden");
    switchButton.classList.remove("hidden");
    if (state.guest) {
      sessionBadge.textContent = "Guest · theory only";
      $("identitySummary").textContent = "Modo invitado · teoría y ejemplos disponibles · registra un participante para validar workshops.";
      updateGlobalProgress({correct:0,total:48,percent:0});
    } else if (state.profile) {
      sessionBadge.textContent = `${state.profile.participant_code} · ${state.profile.group_code}`;
      $("identitySummary").textContent = `${state.profile.full_name} · ${state.profile.group_code} · Participant ID ${state.profile.participant_code}`;
    }
  }

  function showHub() {
    registrationPanel.classList.add("hidden");
    hubPanel.classList.remove("hidden");
    setSessionUI();
    renderStrategy();
    renderTopicNav();
    const hashSlug = location.hash.replace("#", "");
    const first = data.topics.find(t => t.slug === hashSlug)?.slug || data.topics[0].slug;
    selectTopic(first, false);
  }

  function renderStrategy() {
    $("strategyGrid").innerHTML = data.strategy.map(item => `<article class="strategy-card"><strong>${escapeHtml(item.title)}</strong><p>${escapeHtml(item.text)}</p></article>`).join("");
  }

  function topicProgressText(slug) {
    if (state.guest) return "theory";
    const row = state.progress.get(slug);
    if (!row) return "0/6";
    return row.completed ? "6/6 ✓" : `${row.correct_count}/${row.total_count}`;
  }

  function renderTopicNav() {
    $("topicNav").innerHTML = data.topics.map(topic => {
      const row = state.progress.get(topic.slug);
      return `<button class="topic-link ${topic.slug === state.activeTopic ? "active" : ""} ${row?.completed ? "done" : ""}" type="button" data-topic="${topic.slug}">
        <span class="num">${topic.number}</span><span class="label">${escapeHtml(topic.title)}</span><span class="mini-progress">${topicProgressText(topic.slug)}</span>
      </button>`;
    }).join("");
    $("topicNav").querySelectorAll("[data-topic]").forEach(btn => btn.addEventListener("click", () => selectTopic(btn.dataset.topic)));
  }

  function selectTopic(slug, pushHash = true) {
    const topic = data.topics.find(t => t.slug === slug) || data.topics[0];
    state.activeTopic = topic.slug;
    if (pushHash) history.replaceState(null, "", `#${topic.slug}`);
    renderTopicNav();
    renderTopic(topic);
    window.scrollTo({top: Math.max(0, $("strategyTitle").offsetTop - 70), behavior: "smooth"});
  }

  function renderTopic(topic) {
    const progress = state.progress.get(topic.slug);
    const correctCount = Number(progress?.correct_count || 0);
    const totalCount = Number(progress?.total_count || 6);
    const guestNotice = state.guest ? '<div class="guest-lock"><strong>Workshop locked in guest mode.</strong> Registra un participante para validar respuestas y guardar progreso.</div>' : "";
    const methodItems = [
      "Identifica sistema, datos e incógnita.",
      "Dibuja y elige el principio físico.",
      "Modela simbólicamente antes de sustituir.",
      "Comprueba unidades, signo y orden de magnitud."
    ];

    $("topicContent").innerHTML = `<article class="topic-shell">
      <header class="topic-header">
        <div class="topic-header-top"><div><span class="topic-kicker">Block ${topic.number} · ${escapeHtml(topic.english)}</span><h2>${escapeHtml(topic.title)}</h2></div><span class="level-badge">${escapeHtml(topic.level)}</span></div>
        <p>${escapeHtml(topic.overview)}</p>
        <ul class="objective-list">${topic.objectives.map(x => `<li>${escapeHtml(x)}</li>`).join("")}</ul>
      </header>

      <section class="topic-section">
        <h3>Repaso teórico · Theory review</h3>
        <div class="theory-grid">${topic.theory.map(item => `<article class="theory-card"><strong>${escapeHtml(item.title)}</strong><p>${item.text}</p></article>`).join("")}</div>
      </section>

      <section class="topic-section">
        <h3>Technical toolkit · fórmulas que debes interpretar</h3>
        <div class="formula-grid">${topic.formulas.map(f => `<div class="formula-chip">${f}</div>`).join("")}</div>
      </section>

      <section class="topic-section split-grid">
        <div class="trap-box"><h4>Conceptual traps</h4><ul>${topic.traps.map(x => `<li>${escapeHtml(x)}</li>`).join("")}</ul></div>
        <div class="method-box"><h4>Olympiad method</h4><ul>${methodItems.map(x => `<li>${escapeHtml(x)}</li>`).join("")}</ul></div>
      </section>

      <section class="topic-section">
        <h3>Worked olympiad-style example</h3>
        <div class="worked-example">
          <h4>${escapeHtml(topic.example.title)}</h4>
          <p class="example-prompt">${topic.example.prompt}</p>
          <ol class="step-list">${topic.example.steps.map(x => `<li>${x}</li>`).join("")}</ol>
          <div class="example-answer">${topic.example.answer}</div>
        </div>
      </section>

      <section class="topic-section">
        <div class="workshop-head"><div><h3>Workshop · 6 olympiad-style challenges</h3><p>Responde, valida y analiza el feedback. Una respuesta correcta desbloquea la solución razonada.</p></div><span class="topic-progress-pill">${state.guest ? "Guest mode" : `${correctCount}/${totalCount} correctas`}</span></div>
        ${guestNotice}
        <div class="question-list">${topic.questions.map((q,i) => renderQuestion(topic,q,i)).join("")}</div>
      </section>
    </article>`;

    $("topicContent").querySelectorAll("[data-check-question]").forEach(button => button.addEventListener("click", () => submitQuestion(button.dataset.checkQuestion, topic.slug)));
    renderMath($("topicContent"));
  }

  function renderQuestion(topic, q, index) {
    const solved = state.solved.has(q.id);
    return `<article class="question-card ${solved ? "solved" : ""}" id="card-${q.id}">
      <div class="question-top"><span class="question-number">Challenge ${index+1} · ${q.id.toUpperCase()}</span><span class="question-meta"><span class="meta-chip">${escapeHtml(q.skill)}</span><span class="meta-chip">${escapeHtml(q.difficulty)}</span></span></div>
      <div class="question-prompt">${q.prompt}</div>
      <div class="options">${Object.entries(q.options).map(([letter,option]) => `<label class="option-label"><input type="radio" name="answer-${q.id}" value="${letter}" ${solved || state.guest ? "disabled" : ""}><span class="option-letter">${letter}</span><span>${option}</span></label>`).join("")}</div>
      <div class="question-actions">
        <button class="button ${solved ? "button-light" : "button-blue"}" type="button" data-check-question="${q.id}" ${solved || state.guest ? "disabled" : ""}>${solved ? "Solved ✓" : "Check answer"}</button>
        <span id="feedback-${q.id}" class="feedback">${solved ? "Validated in your saved progress." : state.guest ? "Register to validate this challenge." : "Choose one option."}</span>
      </div>
      <div id="solution-${q.id}"></div>
    </article>`;
  }

  async function submitQuestion(questionId, topicSlug) {
    if (!state.token || state.guest) return;
    const selected = document.querySelector(`input[name="answer-${questionId}"]:checked`);
    const feedback = $(`feedback-${questionId}`);
    const card = $(`card-${questionId}`);
    const button = card?.querySelector("[data-check-question]");
    if (!selected) {
      feedback.textContent = "Selecciona una opción antes de validar.";
      feedback.className = "feedback wrong";
      return;
    }
    button.disabled = true;
    feedback.textContent = "Validating…";
    feedback.className = "feedback";
    try {
      const result = await api({action:"submit", access_token:state.token, question_id:questionId, answer:selected.value});
      loadProgress(result.progress);
      if (result.correct || result.already_correct) {
        state.solved.add(questionId);
        card.classList.add("solved");
        card.querySelectorAll("input").forEach(input => input.disabled = true);
        button.textContent = "Solved ✓";
        feedback.textContent = result.already_correct ? "Ya estaba validada en tu progreso." : `Correcta · intento ${result.try_count}.`;
        feedback.className = "feedback correct";
        if (result.solution) $(`solution-${questionId}`).innerHTML = `<div class="solution-box"><strong>Solution reasoning:</strong> ${result.solution}</div>`;
      } else {
        feedback.textContent = `Aún no. Hint: ${result.hint}`;
        feedback.className = "feedback wrong";
        button.disabled = false;
      }
      renderTopicNav();
      const pill = $("topicContent").querySelector(".topic-progress-pill");
      const row = state.progress.get(topicSlug);
      if (pill && row) pill.textContent = `${row.correct_count}/${row.total_count} correctas`;
      renderMath(card);
    } catch (err) {
      feedback.textContent = "No fue posible validar ahora. Revisa conexión e inténtalo de nuevo.";
      feedback.className = "feedback wrong";
      button.disabled = false;
      console.error(err);
    }
  }

  async function register(event) {
    event.preventDefault();
    const fullName = $("fullName").value.trim();
    const grade = Number(gradeSelect.value);
    const groupCode = groupSelect.value;
    if (!fullName || !grade || !groupCode) return setRegistrationStatus("Completa nombre, grado y grupo.", true);
    $("registerButton").disabled = true;
    setRegistrationStatus("Creando ruta de preparación…");
    try {
      const result = await api({action:"register", full_name:fullName, grade, group_code:groupCode});
      state.token = result.access_token;
      state.profile = result.profile;
      state.guest = false;
      state.solved = new Set();
      localStorage.setItem(cfg.storageKey, state.token);
      loadProgress(result.progress);
      showHub();
    } catch (err) {
      setRegistrationStatus("No fue posible registrar el participante. Verifica los datos o intenta de nuevo.", true);
      console.error(err);
    } finally { $("registerButton").disabled = false; }
  }

  async function resume(token) {
    try {
      const result = await api({action:"load", access_token:token});
      state.token = token;
      state.profile = result.profile;
      state.guest = false;
      state.solved = new Set((result.solved || []).map(row => row.question_id));
      loadProgress(result.progress);
      showHub();
      return true;
    } catch (err) {
      console.warn("Saved session could not be resumed", err);
      localStorage.removeItem(cfg.storageKey);
      return false;
    }
  }

  function enterGuest() {
    state.token = null;
    state.profile = null;
    state.guest = true;
    state.solved.clear();
    state.progress.clear();
    showHub();
  }

  function switchParticipant() {
    localStorage.removeItem(cfg.storageKey);
    state.token = null; state.profile = null; state.guest = false; state.solved.clear(); state.progress.clear();
    hubPanel.classList.add("hidden");
    registrationPanel.classList.remove("hidden");
    sessionBadge.classList.add("hidden"); switchButton.classList.add("hidden");
    setRegistrationStatus("");
    window.scrollTo({top:0,behavior:"smooth"});
  }

  gradeSelect.addEventListener("change", populateGroups);
  form.addEventListener("submit", register);
  $("guestButton").addEventListener("click", enterGuest);
  switchButton.addEventListener("click", switchParticipant);
  window.addEventListener("hashchange", () => {
    if (hubPanel.classList.contains("hidden")) return;
    const slug = location.hash.replace("#", "");
    if (data.topics.some(t => t.slug === slug) && slug !== state.activeTopic) selectTopic(slug, false);
  });

  (async function init() {
    populateGroups();
    const token = localStorage.getItem(cfg.storageKey);
    if (token && await resume(token)) return;
    registrationPanel.classList.remove("hidden");
  })();
})();
