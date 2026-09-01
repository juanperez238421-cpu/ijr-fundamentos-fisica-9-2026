(() => {
  const api = window.PhysicsOlympiadTheoryVisuals;
  if (!api?.mount) return;
  const originalMount = api.mount.bind(api);

  function hardRestart(host) {
    const svg = host?.querySelector?.('svg');
    try { svg?.setCurrentTime?.(0); } catch (_e) {}
    const animated = host?.querySelectorAll?.('.tv6-orbiting,.tv6-pe-bar,.tv6-ke-bar,.tv6-cart-anim,.tv6-stuck-cart,.tv6-torque-arc') || [];
    animated.forEach((el) => {
      const previous = el.style.animation;
      el.style.animation = 'none';
      try { el.getBoundingClientRect(); } catch (_e) {}
      el.style.animation = previous;
    });
  }

  api.mount = function(root, topic) {
    originalMount(root, topic);
    const host = root?.querySelector?.(`[data-tv6="${topic?.slug}"]`);
    if (!host) return;

    host.querySelectorAll('.mode-bernoulli .tv6-fluid-particle').forEach((c) => {
      if (!c.getAttribute('r')) c.setAttribute('r', '6');
    });

    host.querySelectorAll('[data-tv6-mode]').forEach((button) => {
      button.addEventListener('click', () => requestAnimationFrame(() => hardRestart(host)));
    });
    host.querySelector('[data-tv6-replay]')?.addEventListener('click', () => hardRestart(host));
  };
})();
