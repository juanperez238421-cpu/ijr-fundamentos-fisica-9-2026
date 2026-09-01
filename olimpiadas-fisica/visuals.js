(() => {
  const esc = (value) => String(value ?? "").replace(/[&<>\"]/g, (ch) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[ch]));

  function frame(inner, cfg = {}, compact = false) {
    const label = esc(cfg.title || cfg.label || "Animated physics diagram");
    const caption = cfg.caption ? `<figcaption>${esc(cfg.caption)}</figcaption>` : "";
    return `<figure class="physics-visual ${compact ? "compact" : ""}" role="img" aria-label="${label}"><div class="visual-stage">${inner}</div>${caption}</figure>`;
  }

  function vector(cfg, compact) {
    const angle = Number(cfg.angle ?? (cfg.variant === "triangle-345" ? 53 : 35));
    const rad = angle * Math.PI / 180;
    const x1 = 40, y1 = 160, len = compact ? 105 : 145;
    const x2 = x1 + len * Math.cos(rad), y2 = y1 - len * Math.sin(rad);
    const second = cfg.variant === "two-vectors" ? `<line class="v-arrow secondary" x1="40" y1="160" x2="${40 + len * Math.cos(120*Math.PI/180)}" y2="${160 - len * Math.sin(120*Math.PI/180)}" marker-end="url(#arrowV)"/>` : "";
    return frame(`<svg viewBox="0 0 260 200" class="physics-svg">
      <defs><marker id="arrowV" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z"/></marker></defs>
      <line class="axis" x1="25" y1="160" x2="235" y2="160"/><line class="axis" x1="40" y1="180" x2="40" y2="20"/>
      <line class="component dashed" x1="40" y1="160" x2="${x2}" y2="160"/><line class="component dashed" x1="${x2}" y1="160" x2="${x2}" y2="${y2}"/>
      <line class="v-arrow primary pulse-arrow" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" marker-end="url(#arrowV)"/>${second}
      <circle class="moving-dot" cx="${x2}" cy="${y2}" r="5"/>
      <text x="${Math.min(205,x2+8)}" y="${Math.max(28,y2-8)}">A</text><text x="190" y="178">x</text><text x="22" y="32">y</text>
      ${cfg.label ? `<text class="caption-text" x="125" y="28" text-anchor="middle">${esc(cfg.label)}</text>` : ""}
    </svg>`, cfg, compact);
  }

  function kinematics(cfg, compact) {
    const projectile = cfg.variant === "projectile" || cfg.variant === "river";
    if (projectile) {
      return frame(`<svg viewBox="0 0 300 190" class="physics-svg">
        <defs><marker id="arrowK" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z"/></marker></defs>
        <line class="axis" x1="25" y1="160" x2="278" y2="160"/><line class="axis" x1="35" y1="174" x2="35" y2="22"/>
        <path class="trajectory" d="M40 150 Q145 30 260 150" fill="none"/>
        <circle class="projectile-dot" r="6"><animateMotion dur="3.8s" repeatCount="indefinite" path="M40 150 Q145 30 260 150"/></circle>
        <line class="v-arrow primary pulse-arrow" x1="52" y1="142" x2="112" y2="142" marker-end="url(#arrowK)"/><text x="75" y="132">vₓ</text>
        <line class="v-arrow secondary pulse-arrow" x1="52" y1="142" x2="52" y2="90" marker-end="url(#arrowK)"/><text x="58" y="104">vᵧ</text>
        <text x="212" y="178">time shared in x,y</text>
      </svg>`, cfg, compact);
    }
    return frame(`<svg viewBox="0 0 300 190" class="physics-svg">
      <line class="axis" x1="35" y1="155" x2="275" y2="155"/><line class="axis" x1="35" y1="165" x2="35" y2="25"/>
      <path class="graph-line" d="M40 145 C85 125 105 80 150 72 S220 92 268 38" fill="none"/>
      <circle class="graph-dot" r="6"><animateMotion dur="4s" repeatCount="indefinite" path="M40 145 C85 125 105 80 150 72 S220 92 268 38"/></circle>
      <line class="tangent pulse-line" x1="118" y1="100" x2="180" y2="65"/>
      <text x="246" y="176">t</text><text x="15" y="34">x or v</text>
      <text class="caption-text" x="165" y="22" text-anchor="middle">slope ↔ rate · area ↔ accumulated change</text>
    </svg>`, cfg, compact);
  }

  function dynamics(cfg, compact) {
    if (cfg.variant === "atwood") {
      return frame(`<svg viewBox="0 0 300 200" class="physics-svg">
        <circle class="solid" cx="150" cy="48" r="25"/><path class="rope" d="M90 155 L90 48 Q150 6 210 48 L210 130" fill="none"/>
        <rect class="block block-a" x="68" y="135" width="44" height="35"/><rect class="block block-b" x="188" y="110" width="44" height="55"/>
        <text x="78" y="158">m</text><text x="199" y="143">2m</text>
        <path class="motion-arrow" d="M242 92 L242 150"/><path class="motion-arrow" d="M58 165 L58 108"/>
      </svg>`, cfg, compact);
    }
    return frame(`<svg viewBox="0 0 300 200" class="physics-svg">
      <defs><marker id="arrowD" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z"/></marker></defs>
      <polygon class="incline" points="35,170 265,170 265,65"/>
      <g class="incline-block"><rect class="block" x="168" y="105" width="46" height="34" transform="rotate(-24 191 122)"/></g>
      <line class="v-arrow primary pulse-arrow" x1="190" y1="118" x2="190" y2="58" marker-end="url(#arrowD)"/><text x="197" y="72">N</text>
      <line class="v-arrow secondary pulse-arrow" x1="190" y1="118" x2="190" y2="178" marker-end="url(#arrowD)"/><text x="198" y="172">mg</text>
      <line class="v-arrow friction pulse-arrow" x1="184" y1="126" x2="132" y2="149" marker-end="url(#arrowD)"/><text x="132" y="166">f</text>
      <text x="42" y="188">choose axes along / normal to plane</text>
    </svg>`, cfg, compact);
  }

  function energy(cfg, compact) {
    if (cfg.variant === "loop") {
      return frame(`<svg viewBox="0 0 300 200" class="physics-svg">
        <path class="track" d="M25 155 Q80 155 115 115 Q145 78 170 92 C205 110 205 163 170 172 C128 181 112 133 137 105 Q166 68 218 80 Q255 88 278 150" fill="none"/>
        <circle class="energy-dot" r="7"><animateMotion dur="5s" repeatCount="indefinite" path="M25 155 Q80 155 115 115 Q145 78 170 92 C205 110 205 163 170 172 C128 181 112 133 137 105 Q166 68 218 80 Q255 88 278 150"/></circle>
        <text x="150" y="34">contact condition at top</text>
      </svg>`, cfg, compact);
    }
    return frame(`<svg viewBox="0 0 300 200" class="physics-svg">
      <path class="track" d="M20 60 Q70 40 112 125 Q145 180 200 98 Q238 43 282 82" fill="none"/>
      <circle class="energy-dot" r="7"><animateMotion dur="4.5s" repeatCount="indefinite" path="M20 60 Q70 40 112 125 Q145 180 200 98 Q238 43 282 82"/></circle>
      <line class="height-line dashed" x1="24" y1="60" x2="24" y2="170"/><text x="30" y="112">h</text>
      <text x="42" y="28">U high · K low</text><text x="120" y="188">U low · K high</text>
    </svg>`, cfg, compact);
  }

  function momentum(cfg, compact) {
    if (cfg.variant === "impulse") {
      return frame(`<svg viewBox="0 0 300 190" class="physics-svg">
        <line class="axis" x1="38" y1="155" x2="275" y2="155"/><line class="axis" x1="38" y1="165" x2="38" y2="28"/>
        <polygon class="impulse-area" points="58,155 155,48 252,155"/><polyline class="graph-line" points="58,155 155,48 252,155" fill="none"/>
        <text x="138" y="176">t</text><text x="15" y="35">F</text><text x="120" y="95">area = J</text>
      </svg>`, cfg, compact);
    }
    return frame(`<svg viewBox="0 0 300 190" class="physics-svg">
      <line class="ground" x1="20" y1="145" x2="280" y2="145"/>
      <g class="cart cart-left"><rect x="42" y="108" width="58" height="30" rx="5"/><circle cx="57" cy="145" r="7"/><circle cx="86" cy="145" r="7"/></g>
      <g class="cart cart-right"><rect x="200" y="108" width="58" height="30" rx="5"/><circle cx="214" cy="145" r="7"/><circle cx="244" cy="145" r="7"/></g>
      <text x="55" y="98">p₁ →</text><text x="211" y="98">← p₂</text><text x="90" y="40">choose the system before conserving momentum</text>
    </svg>`, cfg, compact);
  }

  function orbit(cfg, compact) {
    return frame(`<svg viewBox="0 0 300 200" class="physics-svg orbit-svg">
      <defs><marker id="arrowO" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z"/></marker></defs>
      <circle class="orbit-path" cx="150" cy="100" r="72"/><circle class="planet" cx="150" cy="100" r="25"/>
      <g class="satellite-orbit"><circle class="satellite" cx="222" cy="100" r="7"/><line class="v-arrow primary" x1="222" y1="100" x2="222" y2="62" marker-end="url(#arrowO)"/></g>
      <line class="v-arrow secondary pulse-arrow" x1="222" y1="100" x2="175" y2="100" marker-end="url(#arrowO)"/>
      <text x="230" y="68">v</text><text x="184" y="92">aᵣ</text><text x="114" y="105">M</text>
    </svg>`, cfg, compact);
  }

  function lever(cfg, compact) {
    return frame(`<svg viewBox="0 0 300 190" class="physics-svg">
      <defs><marker id="arrowL" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z"/></marker></defs>
      <g class="lever-group"><line class="lever-bar" x1="40" y1="104" x2="260" y2="90"/><polygon class="pivot" points="145,145 155,104 172,145"/>
        <line class="v-arrow primary pulse-arrow" x1="62" y1="94" x2="62" y2="145" marker-end="url(#arrowL)"/><line class="v-arrow secondary pulse-arrow" x1="242" y1="91" x2="242" y2="140" marker-end="url(#arrowL)"/>
      </g>
      <text x="45" y="165">τ₁ = r₁F₁</text><text x="194" y="165">τ₂ = r₂F₂</text><text x="113" y="32">choose the pivot strategically</text>
    </svg>`, cfg, compact);
  }

  function fluids(cfg, compact) {
    if (cfg.variant === "hydraulic") {
      return frame(`<svg viewBox="0 0 300 190" class="physics-svg">
        <path class="fluid-pipe" d="M58 58 L58 145 L242 145 L242 58" fill="none"/>
        <rect class="piston small" x="38" y="52" width="40" height="14"/><rect class="piston large" x="205" y="47" width="74" height="14"/>
        <rect class="fluid-fill" x="62" y="98" width="176" height="43"/>
        <text x="30" y="35">A₁</text><text x="237" y="35">A₂=5A₁</text><text x="92" y="175">A₁x₁ = A₂x₂</text>
      </svg>`, cfg, compact);
    }
    return frame(`<svg viewBox="0 0 300 190" class="physics-svg">
      <path class="pipe-outline" d="M20 70 L110 70 L145 92 L265 92 L265 130 L145 130 L110 152 L20 152 Z"/>
      <g class="flow-particles"><circle cx="40" cy="92" r="4"/><circle cx="82" cy="130" r="4"/><circle cx="145" cy="112" r="4"/><circle cx="202" cy="112" r="4"/></g>
      <text x="42" y="58">A₁, v₁</text><text x="184" y="82">A₂, v₂</text><text x="72" y="178">continuity: A₁v₁ = A₂v₂</text>
    </svg>`, cfg, compact);
  }

  const renderers = {
    "vector-components": vector,
    "kinematics-graph": kinematics,
    "dynamics-incline": dynamics,
    "energy-track": energy,
    "momentum-collision": momentum,
    "orbit": orbit,
    "lever": lever,
    "fluids": fluids,
  };

  window.PhysicsOlympiadVisuals = {
    render(config, compact = false) {
      if (!config?.type || !renderers[config.type]) return "";
      return renderers[config.type](config, compact);
    }
  };
})();
