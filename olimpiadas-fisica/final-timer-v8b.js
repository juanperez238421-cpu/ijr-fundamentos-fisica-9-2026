(() => {
  const data = window.PHYSICS_OLYMPIAD_DATA;
  if (!data?.topics) return;

  const topic = data.topics.find((t) => t.slug === "final-sprint");
  if (!topic) return;

  const storagePrefix = "ijr.physicsOlympiad.finalSprint.timer.";
  const globalKey = `${storagePrefix}global`;
  let tickHandle = null;
  let injectQueued = false;

  const fmt = (seconds) => {
    const s = Math.max(0, Math.ceil(seconds));
    const m = Math.floor(s / 60);
    return `${String(m).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
  };

  const totalSec = () => topic.questions.reduce((sum, q) => sum + Number(q.timeLimitSec || 0), 0);

  function readDeadline(key) {
    const value = Number(sessionStorage.getItem(key) || 0);
    return Number.isFinite(value) && value > 0 ? value : null;
  }

  function writeDeadline(key, deadline) {
    sessionStorage.setItem(key, String(deadline));
  }

  function clearDeadline(key) {
    sessionStorage.removeItem(key);
  }

  function ensureGlobalPanel() {
    if (location.hash !== "#final-sprint") return;
    const content = document.getElementById("workshopContent");
    const intro = content?.querySelector(".v5-workshop-intro");
    if (!content || !intro || content.querySelector(".v8-final-brief")) return;

    const seconds = totalSec();
    const panel = document.createElement("section");
    panel.className = "v8-final-brief";
    panel.innerHTML = `
      <div>
        <p class="v5-kicker">THURSDAY SPRINT · GRADE 11</p>
        <h3>20 questions · ${Math.round(seconds / 60)} min target</h3>
        <p>Use the timer as pressure training, not as punishment. When a target expires, finish the reasoning and review the solution; the timer measures decision speed.</p>
      </div>
      <div class="v8-global-timer" aria-live="polite">
        <span>Full simulation</span>
        <strong id="v8GlobalClock">${fmt(seconds)}</strong>
        <button type="button" id="v8GlobalStart">Start ${Math.round(seconds / 60)} min</button>
        <button type="button" id="v8GlobalReset" class="secondary">Reset</button>
      </div>`;

    intro.insertAdjacentElement("afterend", panel);

    panel.querySelector("#v8GlobalStart")?.addEventListener("click", () => {
      const current = readDeadline(globalKey);
      if (!current || current <= Date.now()) writeDeadline(globalKey, Date.now() + seconds * 1000);
      startTicker();
      updateAll();
    });

    panel.querySelector("#v8GlobalReset")?.addEventListener("click", () => {
      clearDeadline(globalKey);
      updateAll();
    });
  }

  function ensureQuestionTimer(q) {
    if (!q.timeLimitSec) return;
    const card = document.getElementById(`card-${q.id}`);
    if (!card || card.querySelector(".v8-question-timer")) return;

    const top = card.querySelector(".v5-question-top");
    if (!top) return;

    const timer = document.createElement("div");
    timer.className = "v8-question-timer";
    timer.dataset.qid = q.id;
    timer.innerHTML = `
      <div class="v8-timer-copy">
        <span>${q.stage || "Timed"} target</span>
        <strong class="v8-clock">${fmt(q.timeLimitSec)}</strong>
      </div>
      <button type="button" class="v8-start">Start timer</button>
      <button type="button" class="v8-reset secondary">Reset</button>`;

    top.insertAdjacentElement("afterend", timer);

    timer.querySelector(".v8-start")?.addEventListener("click", () => {
      const key = `${storagePrefix}${q.id}`;
      const current = readDeadline(key);
      if (!current || current <= Date.now()) writeDeadline(key, Date.now() + q.timeLimitSec * 1000);
      startTicker();
      updateAll();
    });

    timer.querySelector(".v8-reset")?.addEventListener("click", () => {
      clearDeadline(`${storagePrefix}${q.id}`);
      card.classList.remove("v8-time-expired", "v8-time-running");
      updateAll();
    });
  }

  function updateQuestion(q) {
    const card = document.getElementById(`card-${q.id}`);
    const timer = card?.querySelector(".v8-question-timer");
    if (!card || !timer) return;

    const clock = timer.querySelector(".v8-clock");
    const start = timer.querySelector(".v8-start");
    const solved = card.classList.contains("solved");
    const key = `${storagePrefix}${q.id}`;
    const deadline = readDeadline(key);

    if (solved) {
      clearDeadline(key);
      card.classList.remove("v8-time-expired", "v8-time-running");
      if (clock) clock.textContent = "SOLVED";
      if (start) start.disabled = true;
      return;
    }

    if (!deadline) {
      card.classList.remove("v8-time-expired", "v8-time-running");
      if (clock) clock.textContent = fmt(q.timeLimitSec);
      if (start) {
        start.disabled = false;
        start.textContent = "Start timer";
      }
      return;
    }

    const remaining = (deadline - Date.now()) / 1000;
    if (remaining <= 0) {
      card.classList.remove("v8-time-running");
      card.classList.add("v8-time-expired");
      if (clock) clock.textContent = "00:00";
      if (start) {
        start.disabled = false;
        start.textContent = "Restart timer";
      }
      return;
    }

    card.classList.add("v8-time-running");
    card.classList.remove("v8-time-expired");
    if (clock) clock.textContent = fmt(remaining);
    if (start) {
      start.disabled = true;
      start.textContent = "Running";
    }
  }

  function updateGlobal() {
    const clock = document.getElementById("v8GlobalClock");
    const start = document.getElementById("v8GlobalStart");
    const panel = document.querySelector(".v8-final-brief");
    if (!clock || !start || !panel) return;

    const seconds = totalSec();
    const deadline = readDeadline(globalKey);

    if (!deadline) {
      panel.classList.remove("expired", "running");
      clock.textContent = fmt(seconds);
      start.disabled = false;
      start.textContent = `Start ${Math.round(seconds / 60)} min`;
      return;
    }

    const remaining = (deadline - Date.now()) / 1000;
    if (remaining <= 0) {
      panel.classList.remove("running");
      panel.classList.add("expired");
      clock.textContent = "00:00";
      start.disabled = false;
      start.textContent = "Restart simulation";
      return;
    }

    panel.classList.add("running");
    panel.classList.remove("expired");
    clock.textContent = fmt(remaining);
    start.disabled = true;
    start.textContent = "Simulation running";
  }

  function updateAll() {
    updateGlobal();
    for (const q of topic.questions) updateQuestion(q);
  }

  function inject() {
    injectQueued = false;
    ensureGlobalPanel();
    if (location.hash === "#final-sprint") {
      for (const q of topic.questions) ensureQuestionTimer(q);
    }
    updateAll();
  }

  function queueInject() {
    if (injectQueued) return;
    injectQueued = true;
    requestAnimationFrame(inject);
  }

  function startTicker() {
    if (tickHandle) return;
    tickHandle = window.setInterval(updateAll, 1000);
  }

  const root = document.getElementById("workshopContent");
  if (root) {
    const observer = new MutationObserver(() => queueInject());
    observer.observe(root, { childList: true });
  }

  window.addEventListener("hashchange", () => queueInject());
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) updateAll();
  });

  startTicker();
  queueInject();
})();
