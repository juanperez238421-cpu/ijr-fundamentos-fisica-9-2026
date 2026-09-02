(() => {
  const base = window.PhysicsOlympiadWorkshopVisuals;
  if (!base?.renderQuestion) return;
  const original = base.renderQuestion.bind(base);

  const numericAttributes = new Set([
    'x','y','x1','y1','x2','y2','cx','cy','r','rx','ry','width','height'
  ]);

  function auditFigure(question, html) {
    if (!html) return '';
    const template = document.createElement('template');
    template.innerHTML = html.trim();
    const figure = template.content.querySelector('figure.workshop-figure');
    const svg = template.content.querySelector('svg.workshop-svg');
    const failures = [];

    if (!figure) failures.push('missing figure element');
    if (!svg) failures.push('missing SVG');
    if (svg && !svg.getAttribute('viewBox')) failures.push('missing viewBox');
    if (/\b(?:NaN|Infinity|undefined|null)\b/.test(html)) failures.push('non-finite or undefined geometry');

    if (svg) {
      svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
      svg.setAttribute('data-physics-qa', 'workshop-v6');
      svg.querySelectorAll('*').forEach((el) => {
        for (const attr of el.getAttributeNames()) {
          if (!numericAttributes.has(attr)) continue;
          const raw = el.getAttribute(attr);
          if (raw === null || raw === '') continue;
          const value = Number(raw);
          if (!Number.isFinite(value)) failures.push(`${el.tagName}.${attr}=${raw}`);
        }
      });
    }

    if (figure) {
      figure.setAttribute('data-qid', String(question?.id || 'unknown'));
      figure.setAttribute('data-qa-status', failures.length ? 'rejected' : 'pass');
    }

    if (failures.length) {
      console.warn('[Physics Olympiad Visual QA] figure omitted', question?.id, failures);
      return '';
    }
    return template.innerHTML;
  }

  window.PhysicsOlympiadWorkshopVisuals = Object.freeze({
    renderQuestion(question) {
      return auditFigure(question, original(question));
    },
    auditVersion: 'workshop-v6'
  });
})();
