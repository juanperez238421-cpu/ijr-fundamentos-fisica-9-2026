(() => {
  const api = window.PhysicsOlympiadTheoryVisuals;
  if (!api?.mount) return;

  const originalMount = api.mount.bind(api);
  const NS = "http://www.w3.org/2000/svg";
  const clamp = (v, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, v));
  const setLine = (el, x1, y1, x2, y2) => {
    if (!el) return;
    el.setAttribute("x1", x1); el.setAttribute("y1", y1);
    el.setAttribute("x2", x2); el.setAttribute("y2", y2);
  };
  const setText = (el, x, y, text) => {
    if (!el) return;
    el.setAttribute("x", x); el.setAttribute("y", y);
    if (text !== undefined) el.textContent = text;
  };

  function exactKinematicsArea(host) {
    const poly = host.querySelector('.mode-area .tv6-area-fill');
    if (!poly || poly.tagName.toLowerCase() !== 'polygon') return;
    const path = document.createElementNS(NS, 'path');
    path.setAttribute('class', poly.getAttribute('class') || 'tv6-area-fill');
    const clip = poly.getAttribute('clip-path');
    if (clip) path.setAttribute('clip-path', clip);
    path.setAttribute('d', 'M120 350 L120 285 C260 268 370 215 480 185 S625 155 720 120 L720 350 Z');
    poly.replaceWith(path);
  }

  function exactDynamicsGeometry(host) {
    const input = host.querySelector('[data-dyn-angle]');
    const output = host.querySelector('[data-dyn-angle-output]');
    if (!input) return;

    const update = () => {
      const deg = Number(input.value);
      const th = deg * Math.PI / 180;
      const x0 = 110, y0 = 360, xr = 620;
      const yr = y0 - (xr - x0) * Math.tan(th);
      const contactX = 405;
      const contactY = y0 - (contactX - x0) * Math.tan(th);
      const halfH = 32;
      const uDown = [-Math.cos(th), Math.sin(th)];
      const uUp = [Math.cos(th), -Math.sin(th)];
      const uInto = [Math.sin(th), Math.cos(th)];
      const uOut = [-Math.sin(th), -Math.cos(th)];
      const cx = contactX + halfH * uOut[0];
      const cy = contactY + halfH * uOut[1];
      const W = 125;

      if (output) output.textContent = `${deg}°`;
      const ramp = host.querySelector('[data-dyn-ramp]');
      if (ramp) ramp.setAttribute('points', `${x0},${y0} ${xr},${y0} ${xr},${yr}`);

      const block = host.querySelector('[data-dyn-block]');
      if (block) {
        block.setAttribute('x', cx - 50);
        block.setAttribute('y', cy - 32);
        block.setAttribute('transform', `rotate(${-deg} ${cx} ${cy})`);
      }

      const mg = [cx, cy + W];
      const n = [cx + 110 * uOut[0], cy + 110 * uOut[1]];
      const f = [cx + 90 * uDown[0], cy + 90 * uDown[1]];
      const v = [cx + 105 * uUp[0], cy + 105 * uUp[1]];
      setLine(host.querySelector('[data-dyn-mg]'), cx, cy, ...mg);
      setText(host.querySelector('[data-dyn-mg-label]'), mg[0] + 16, mg[1] - 8, 'mg');
      setLine(host.querySelector('[data-dyn-n]'), cx, cy, ...n);
      setText(host.querySelector('[data-dyn-n-label]'), n[0] - 16, n[1] - 12, 'N');
      setLine(host.querySelector('[data-dyn-f]'), cx, cy, ...f);
      setText(host.querySelector('[data-dyn-f-label]'), f[0] - 30, f[1] + 22, 'fₖ');
      setLine(host.querySelector('[data-dyn-v]'), cx, cy, ...v);
      setText(host.querySelector('[data-dyn-v-label]'), v[0] + 10, v[1] - 10, 'v');

      const lp = W * Math.sin(th), ln = W * Math.cos(th);
      const par = [cx + lp * uDown[0], cy + lp * uDown[1]];
      const perp = [cx + ln * uInto[0], cy + ln * uInto[1]];
      setLine(host.querySelector('[data-dyn-par]'), cx, cy, ...par);
      setText(host.querySelector('[data-dyn-par-label]'), par[0] - 48, par[1] + 22, 'mg sinθ');
      setLine(host.querySelector('[data-dyn-perp]'), cx, cy, ...perp);
      setText(host.querySelector('[data-dyn-perp-label]'), perp[0] + 8, perp[1] + 10, 'mg cosθ');
      setLine(host.querySelector('[data-dyn-guide1]'), par[0], par[1], mg[0], mg[1]);
      setLine(host.querySelector('[data-dyn-guide2]'), perp[0], perp[1], mg[0], mg[1]);

      const r = 60;
      const ex = x0 + r * Math.cos(th), ey = y0 - r * Math.sin(th);
      const arc = host.querySelector('[data-dyn-angle-arc]');
      if (arc) arc.setAttribute('d', `M${x0 + r} ${y0} A${r} ${r} 0 0 0 ${ex} ${ey}`);
      setText(host.querySelector('[data-dyn-angle-label]'), x0 + 78 * Math.cos(th / 2), y0 - 78 * Math.sin(th / 2), 'θ');

      const eq = host.querySelector('.mode-components .tv6-equation');
      if (eq) eq.textContent = 'mg = (mg sinθ)e∥ + (mg cosθ)e⊥';
    };

    input.addEventListener('input', update);
    update();
  }

  function exactEnergyConservation(host) {
    const mode = host.querySelector('.mode-energy');
    const path = mode?.querySelector('.tv6-track');
    const runner = mode?.querySelector('.tv6-energy-runner');
    const pe = mode?.querySelector('.tv6-pe-bar');
    const ke = mode?.querySelector('.tv6-ke-bar');
    if (!mode || !path || !runner || !pe || !ke || typeof path.getTotalLength !== 'function') return;

    runner.querySelector('animateMotion')?.remove();
    pe.style.animation = 'none';
    ke.style.animation = 'none';
    pe.style.transform = 'none';
    ke.style.transform = 'none';

    const bgBars = mode.querySelectorAll('.tv6-bar-bg');
    bgBars.forEach((bar) => { bar.setAttribute('y', '-150'); bar.setAttribute('height', '150'); });
    pe.setAttribute('y', '-150'); pe.setAttribute('height', '150');
    ke.setAttribute('y', '-150'); ke.setAttribute('height', '150');

    const svg = mode.closest('svg');
    const makeValue = (x, label) => {
      const t = document.createElementNS(NS, 'text');
      t.setAttribute('class', 'tv6-small qa-energy-value');
      t.setAttribute('x', x); t.setAttribute('y', '205'); t.setAttribute('text-anchor', 'middle');
      t.textContent = label;
      svg.appendChild(t);
      return t;
    };
    const uValue = svg.querySelector('[data-qa-energy-u]') || makeValue(131, 'U 100%');
    const kValue = svg.querySelector('[data-qa-energy-k]') || makeValue(201, 'K 0%');
    uValue.setAttribute('data-qa-energy-u', '');
    kValue.setAttribute('data-qa-energy-k', '');

    const totalLength = path.getTotalLength();
    const datumY = 320;
    const maxHeightY = 110;
    const barMax = 150;
    const oneWayMs = 7000;
    let elapsed = 0;
    let previous = performance.now();

    const draw = (fraction) => {
      const p = path.getPointAtLength(totalLength * clamp(fraction));
      runner.setAttribute('transform', `translate(${p.x} ${p.y})`);
      const U = clamp((datumY - p.y) / (datumY - maxHeightY));
      const K = 1 - U;
      const uH = barMax * U, kH = barMax * K;
      pe.setAttribute('y', -uH); pe.setAttribute('height', uH);
      ke.setAttribute('y', -kH); ke.setAttribute('height', kH);
      uValue.textContent = `U ${Math.round(U * 100)}%`;
      kValue.textContent = `K ${Math.round(K * 100)}%`;
      host.dataset.energySum = (U + K).toFixed(6);
    };

    const tick = (now) => {
      if (!document.documentElement.contains(host)) return;
      const dt = Math.min(100, Math.max(0, now - previous));
      previous = now;
      if (!host.classList.contains('is-paused')) elapsed += dt;
      const phase = (elapsed / oneWayMs) % 2;
      const fraction = phase <= 1 ? phase : 2 - phase;
      draw(fraction);
      requestAnimationFrame(tick);
    };

    host.querySelector('[data-tv6-replay]')?.addEventListener('click', () => {
      elapsed = 0;
      previous = performance.now();
      draw(0);
    });

    draw(0);
    if (!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) requestAnimationFrame(tick);
  }

  function exactHydrostaticIsotropy(host) {
    const input = host.querySelector('[data-fluid-depth]');
    const output = host.querySelector('[data-fluid-depth-output]');
    const layer = host.querySelector('.mode-hydrostatic');
    if (!input || !layer) return;

    input.min = '20';
    input.max = '70';
    if (Number(input.value) < 20 || Number(input.value) > 70) input.value = '60';

    let up = host.querySelector('[data-fluid-up]');
    if (!up) {
      up = document.createElementNS(NS, 'line');
      up.setAttribute('data-fluid-up', '');
      up.setAttribute('class', 'tv6-arrow blue');
      const marker = host.querySelector('[data-fluid-left]')?.getAttribute('marker-end');
      if (marker) up.setAttribute('marker-end', marker);
      layer.insertBefore(up, layer.querySelector('.tv6-equation'));
    }

    const update = () => {
      const pct = Number(input.value);
      const top = 125, bottom = 355;
      const y = top + (bottom - top) * (pct / 100);
      const len = 35 + 0.4 * pct;
      if (output) output.textContent = `${pct}%`;
      const probe = host.querySelector('[data-fluid-probe]');
      if (probe) probe.setAttribute('cy', y);
      setLine(host.querySelector('[data-fluid-depth-line]'), 390, top, 390, y);
      setText(host.querySelector('[data-fluid-depth-label]'), 350, (top + y) / 2, 'h');
      setLine(host.querySelector('[data-fluid-left]'), 430, y, 430 - len, y);
      setLine(host.querySelector('[data-fluid-right]'), 430, y, 430 + len, y);
      setLine(host.querySelector('[data-fluid-down]'), 430, y, 430, y + len);
      setLine(up, 430, y, 430, y - len);
    };

    input.addEventListener('input', update);
    update();

    const particle = host.querySelector('.mode-bernoulli .tv6-fluid-particle');
    if (particle && !particle.getAttribute('r')) particle.setAttribute('r', '6');
    const caption = host.querySelector('.tv6-caption');
    if (caption) caption.textContent = 'Continuity y Bernoulli conservan las relaciones geométricas del flujo. Hydrostatic muestra presión isotrópica: a una misma profundidad las flechas tienen igual magnitud en todas las direcciones, y esa magnitud aumenta al profundizar.';
  }

  api.mount = function(root, topic) {
    originalMount(root, topic);
    const host = root?.querySelector?.(`[data-tv6="${topic?.slug}"]`);
    if (!host) return;
    host.dataset.physicsQa = 'v7';

    if (topic.slug === 'kinematics') exactKinematicsArea(host);
    if (topic.slug === 'dynamics') exactDynamicsGeometry(host);
    if (topic.slug === 'energy') exactEnergyConservation(host);
    if (topic.slug === 'fluids') exactHydrostaticIsotropy(host);
  };
})();
