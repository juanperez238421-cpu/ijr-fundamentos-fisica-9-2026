(() => {
  const api = window.PhysicsOlympiadVisuals;
  if (!api?.render) return;
  const original = api.render.bind(api);
  let seq = 0;
  const uid = () => `dyn-precise-${++seq}`;
  const esc = (v) => String(v ?? "").replace(/[&<>\"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));

  function preciseIncline(cfg, compact) {
    const theta = Number(cfg.angle ?? 30);
    const rad = theta * Math.PI / 180;
    const x0 = 55, y0 = 225, x1 = 365, y1 = y0 - (x1-x0) * Math.tan(rad);
    const cx = 250;
    const cyRamp = y0 - (cx-x0) * Math.tan(rad);
    const cy = cyRamp - 26;
    const nLen = 82, fLen = 82;
    const nx = cx - nLen*Math.sin(rad), ny = cy - nLen*Math.cos(rad);
    const wx = cx, wy = cy + 92;
    const downX = cx - fLen*Math.cos(rad), downY = cy + fLen*Math.sin(rad);
    const upX = cx + fLen*Math.cos(rad), upY = cy - fLen*Math.sin(rad);
    const staticLimit = cfg.variant === "static-limit";
    const fx = staticLimit ? upX : downX, fy = staticLimit ? upY : downY;
    const id = uid();
    const caption = cfg.caption ? `<figcaption>${esc(cfg.caption)}</figcaption>` : "";
    const variant = esc(cfg.variant || "incline");
    return `<figure class="physics-visual ${compact ? "compact" : ""}" data-variant="${variant}" role="img" aria-label="${esc(cfg.title || "Precise inclined-plane free-body diagram")}"><div class="visual-stage"><svg viewBox="0 0 420 280" class="physics-svg" aria-hidden="true">
      <defs><marker id="${id}-p" markerWidth="10" markerHeight="10" refX="8.5" refY="5" orient="auto"><path class="marker-primary" d="M0,0 L10,5 L0,10 z"/></marker><marker id="${id}-s" markerWidth="10" markerHeight="10" refX="8.5" refY="5" orient="auto"><path class="marker-secondary" d="M0,0 L10,5 L0,10 z"/></marker><marker id="${id}-a" markerWidth="10" markerHeight="10" refX="8.5" refY="5" orient="auto"><path class="marker-accent" d="M0,0 L10,5 L0,10 z"/></marker></defs>
      <polygon class="incline" points="${x0},${y0} ${x1},${y0} ${x1},${y1}"/>
      <rect class="block" x="214" y="${cy-25}" width="72" height="50" transform="rotate(${-theta} ${cx} ${cy})"/>
      <line class="v-arrow primary" x1="${cx}" y1="${cy}" x2="${nx}" y2="${ny}" marker-end="url(#${id}-p)"/><text class="force-label" x="${nx-5}" y="${ny-9}">N</text>
      <line class="v-arrow secondary" x1="${cx}" y1="${cy}" x2="${wx}" y2="${wy}" marker-end="url(#${id}-s)"/><text class="force-label" x="${wx+10}" y="${wy-5}">mg</text>
      <line class="v-arrow accent" x1="${cx}" y1="${cy}" x2="${fx}" y2="${fy}" marker-end="url(#${id}-a)"/><text class="force-label" x="${fx + (staticLimit?6:-28)}" y="${fy + (staticLimit?-8:20)}">${staticLimit ? "fₛ" : "fₖ"}</text>
      <line class="component dashed" x1="${cx}" y1="${cy}" x2="${cx + 68*Math.sin(rad)}" y2="${cy + 68*Math.cos(rad)}"/><text x="${cx + 72*Math.sin(rad)}" y="${cy + 72*Math.cos(rad)}">mg cosθ</text>
      <line class="component dashed" x1="${cx}" y1="${cy}" x2="${downX}" y2="${downY}"/><text x="${downX-12}" y="${downY+22}">mg sinθ</text>
      <path class="angle-arc" d="M${x1-50} ${y0} A50 50 0 0 0 ${x1-50*Math.cos(rad)} ${y0-50*Math.sin(rad)}"/><text class="angle-label" x="${x1-62}" y="${y0-16}">${theta}°</text>
      <text class="diagram-equation" x="210" y="34" text-anchor="middle">${staticLimit ? "impending slide down: fₛ points UP the plane · μₛ,min = tanθ" : "if the block slides UP, kinetic friction points DOWN the plane"}</text>
      <text class="caption-text" x="210" y="263" text-anchor="middle">N is perpendicular to the surface; weight is vertical; components use axes parallel/perpendicular to the plane.</text>
    </svg></div>${caption}</figure>`;
  }

  api.render = function(config, compact = false) {
    if (config?.type === "dynamics-incline" && !["atwood","connected","push-down"].includes(config.variant)) {
      return preciseIncline(config, compact);
    }
    return original(config, compact);
  };
})();