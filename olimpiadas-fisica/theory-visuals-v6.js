(() => {
  const esc = (v) => String(v ?? "").replace(/[&<>\"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
  let seq = 0;
  const uid = (p="tv6") => `${p}-${++seq}`;
  const markerDefs = (id) => `<defs>
    <marker id="${id}-blue" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L12,6 L0,12 z" class="tv6-mk-blue"/></marker>
    <marker id="${id}-gold" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L12,6 L0,12 z" class="tv6-mk-gold"/></marker>
    <marker id="${id}-red" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L12,6 L0,12 z" class="tv6-mk-red"/></marker>
    <marker id="${id}-ink" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L12,6 L0,12 z" class="tv6-mk-ink"/></marker>
  </defs>`;
  const btn = (mode,label,active=false) => `<button type="button" class="tv6-mode-btn ${active?"active":""}" data-tv6-mode="${esc(mode)}" aria-pressed="${active?"true":"false"}">${esc(label)}</button>`;
  const toolbar = (buttons, extras="") => `<div class="tv6-toolbar"><div class="tv6-mode-group">${buttons}</div><div class="tv6-play-group"><button type="button" data-tv6-play>Pause</button><button type="button" data-tv6-replay>Replay</button></div></div>${extras}`;
  const frame = (slug, mode, controls, svg, caption) => `<article class="tv6-lab" data-tv6="${esc(slug)}" data-mode="${esc(mode)}">${controls}<div class="tv6-stage">${svg}</div><p class="tv6-caption">${caption}</p></article>`;
  const lineArrow = (id,x1,y1,x2,y2,cls="blue",label="",tx=x2+10,ty=y2-8) => `<line class="tv6-arrow ${cls}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" marker-end="url(#${id}-${cls})"/>${label?`<text class="tv6-label" x="${tx}" y="${ty}">${esc(label)}</text>`:""}`;

  function vectorLab(topic){
    const id=uid("vec");
    const extras=`<label class="tv6-slider-row">Vector angle <output data-vector-output>37°</output><input data-vector-angle type="range" min="15" max="75" value="37" step="1"></label>`;
    const controls=toolbar(btn("components","Components",true)+btn("resultant","Resultant"),extras);
    const svg=`<svg class="tv6-svg" viewBox="0 0 860 460" role="img" aria-label="Interactive vector decomposition and resultant laboratory">${markerDefs(id)}
      <g class="tv6-layer mode-components">
        <text class="tv6-title" x="430" y="38" text-anchor="middle">Vector decomposition: geometry first</text>
        <line class="tv6-axis" x1="120" y1="350" x2="760" y2="350"/><line class="tv6-axis" x1="170" y1="395" x2="170" y2="70"/>
        <text class="tv6-axis-label" x="748" y="380">x</text><text class="tv6-axis-label" x="142" y="82">y</text>
        <line data-vector-main class="tv6-arrow blue" x1="170" y1="350" x2="354" y2="212" marker-end="url(#${id}-blue)"/>
        <line data-vector-x class="tv6-component" x1="170" y1="350" x2="354" y2="350"/>
        <line data-vector-y class="tv6-component" x1="354" y1="350" x2="354" y2="212"/>
        <text data-vector-label class="tv6-label" x="365" y="202">A</text><text data-vector-xlabel class="tv6-label muted" x="255" y="380">Aₓ=A cosθ</text><text data-vector-ylabel class="tv6-label muted" x="366" y="285">Aᵧ=A sinθ</text>
        <path data-vector-arc class="tv6-angle" d="M225 350 A55 55 0 0 0 214 317"/><text data-vector-angle-label class="tv6-label" x="225" y="323">θ</text>
        <text class="tv6-equation" x="430" y="430" text-anchor="middle">components are projections on chosen axes — not new vectors added by physics</text>
      </g>
      <g class="tv6-layer mode-resultant">
        <text class="tv6-title" x="430" y="38" text-anchor="middle">Equal vectors at 120°: see the geometry before calculating</text>
        ${lineArrow(id,285,320,520,320,"blue","A",500,300)}
        ${lineArrow(id,285,320,168,117,"gold","B",145,112)}
        ${lineArrow(id,285,320,403,117,"red","R=A+B",410,106)}
        <path class="tv6-angle" d="M350 320 A65 65 0 0 0 252 264"/><text class="tv6-label" x="278" y="260">120°</text>
        <path class="tv6-ghost-triangle" d="M520 320 L403 117 L168 117"/>
        <text class="tv6-equation" x="430" y="410" text-anchor="middle">R²=A²+A²+2A²cos120°  →  R=A</text>
      </g>
    </svg>`;
    return frame(topic.slug,"components",controls,svg,"Usa el deslizador para cambiar θ. La figura recalcula la dirección y las proyecciones; el modo Resultant muestra por qué un ángulo especial puede ahorrar álgebra.");
  }

  function kinematicsLab(topic){
    const id=uid("kin"), curve=`M120 340 C210 330 265 245 350 200 S545 188 720 95`;
    const controls=toolbar(btn("slope","x–t slope",true)+btn("area","v–t integral")+btn("accel","v–t slope"));
    const svg=`<svg class="tv6-svg" viewBox="0 0 860 460" role="img" aria-label="Interactive kinematics graph laboratory for slope and signed area">${markerDefs(id)}
      <g class="tv6-layer mode-slope">
        <text class="tv6-title" x="430" y="38" text-anchor="middle">Position–time: instantaneous velocity is the tangent slope</text>
        <line class="tv6-axis" x1="95" y1="365" x2="760" y2="365"/><line class="tv6-axis" x1="95" y1="395" x2="95" y2="70"/><text class="tv6-axis-label" x="748" y="398">t</text><text class="tv6-axis-label" x="64" y="82">x</text>
        <path id="${id}-xcurve" class="tv6-curve" d="${curve}"/>
        <g class="tv6-tangent-runner"><line class="tv6-tangent" x1="-62" y1="0" x2="62" y2="0"/><circle class="tv6-dot blue-dot" r="9"/><animateMotion dur="6s" repeatCount="indefinite" rotate="auto"><mpath href="#${id}-xcurve"/></animateMotion></g>
        <text class="tv6-equation" x="430" y="425" text-anchor="middle">v(t)=dx/dt = slope of the tangent to x(t)</text>
      </g>
      <g class="tv6-layer mode-area">
        <text class="tv6-title" x="430" y="38" text-anchor="middle">Velocity–time: displacement is signed area, not “slope of the integral”</text>
        <line class="tv6-axis" x1="95" y1="350" x2="760" y2="350"/><line class="tv6-axis" x1="95" y1="395" x2="95" y2="70"/><text class="tv6-axis-label" x="748" y="383">t</text><text class="tv6-axis-label" x="64" y="82">v</text>
        <defs><clipPath id="${id}-area-clip"><rect x="120" y="85" width="0" height="265"><animate attributeName="width" values="0;600;600" keyTimes="0;0.78;1" dur="6s" repeatCount="indefinite"/></rect></clipPath></defs>
        <polygon class="tv6-area-fill" clip-path="url(#${id}-area-clip)" points="120,350 120,285 300,245 480,185 720,120 720,350"/>
        <path class="tv6-curve" d="M120 285 C260 268 370 215 480 185 S625 155 720 120"/>
        <line class="tv6-sweep" x1="120" y1="82" x2="120" y2="350"><animate attributeName="x1" values="120;720;720" keyTimes="0;0.78;1" dur="6s" repeatCount="indefinite"/><animate attributeName="x2" values="120;720;720" keyTimes="0;0.78;1" dur="6s" repeatCount="indefinite"/></line>
        <text class="tv6-equation" x="430" y="425" text-anchor="middle">Δx = ∫ v(t)dt = signed area between v(t) and the v=0 axis</text>
      </g>
      <g class="tv6-layer mode-accel">
        <text class="tv6-title" x="430" y="38" text-anchor="middle">Velocity–time: acceleration is the slope</text>
        <line class="tv6-axis" x1="95" y1="350" x2="760" y2="350"/><line class="tv6-axis" x1="95" y1="395" x2="95" y2="70"/><text class="tv6-axis-label" x="748" y="383">t</text><text class="tv6-axis-label" x="64" y="82">v</text>
        <line class="tv6-curve" x1="140" y1="310" x2="700" y2="115"/><path class="tv6-slope-triangle" d="M425 210 H610 V146"/><text class="tv6-label" x="500" y="235">Δt</text><text class="tv6-label" x="622" y="182">Δv</text>
        <text class="tv6-equation" x="430" y="425" text-anchor="middle">a = dv/dt = Δv/Δt for a straight v–t segment</text>
      </g>
    </svg>`;
    return frame(topic.slug,"slope",controls,svg,"Tres operaciones diferentes: slope(x–t) → velocity; area(v–t) → displacement; slope(v–t) → acceleration. La animación separa estas ideas para evitar mezclar derivada e integral.");
  }

  function dynamicsLab(topic){
    const id=uid("dyn");
    const extras=`<label class="tv6-slider-row">Incline angle <output data-dyn-angle-output>28°</output><input data-dyn-angle type="range" min="12" max="32" value="28" step="1"></label>`;
    const controls=toolbar(btn("forces","Forces",true)+btn("components","Weight components"),extras);
    const svg=`<svg class="tv6-svg" viewBox="0 0 860 460" role="img" aria-label="Interactive inclined-plane free-body diagram">${markerDefs(id)}
      <text class="tv6-title" x="430" y="38" text-anchor="middle">Free-body diagram: directions come from interactions and geometry</text>
      <polygon data-dyn-ramp class="tv6-ramp" points="110,360 620,360 620,100"/>
      <rect data-dyn-block class="tv6-block" x="365" y="200" width="100" height="64" rx="4"/>
      <path data-dyn-angle-arc class="tv6-angle" d="M170 360 A60 60 0 0 0 162 331"/><text data-dyn-angle-label class="tv6-label" x="176" y="332">θ</text>
      <g class="tv6-layer-always">
        <line data-dyn-mg class="tv6-arrow red" marker-end="url(#${id}-red)"/><text data-dyn-mg-label class="tv6-label strong" x="450" y="360">mg</text>
      </g>
      <g class="tv6-layer mode-forces">
        <line data-dyn-n class="tv6-arrow blue" marker-end="url(#${id}-blue)"/><text data-dyn-n-label class="tv6-label strong">N</text>
        <line data-dyn-f class="tv6-arrow gold" marker-end="url(#${id}-gold)"/><text data-dyn-f-label class="tv6-label strong">fₖ</text>
        <line data-dyn-v class="tv6-arrow ink" marker-end="url(#${id}-ink)"/><text data-dyn-v-label class="tv6-label strong">v</text>
      </g>
      <g class="tv6-layer mode-components">
        <line data-dyn-par class="tv6-arrow gold" marker-end="url(#${id}-gold)"/><text data-dyn-par-label class="tv6-label">mg sinθ</text>
        <line data-dyn-perp class="tv6-arrow blue" marker-end="url(#${id}-blue)"/><text data-dyn-perp-label class="tv6-label">mg cosθ</text>
        <line data-dyn-guide1 class="tv6-guide"/><line data-dyn-guide2 class="tv6-guide"/>
        <text class="tv6-equation" x="430" y="430" text-anchor="middle">mg = (mg sinθ) e∥ + (mg cosθ) e⊥,into</text>
      </g>
    </svg>`;
    return frame(topic.slug,"forces",controls,svg,"El peso permanece vertical al cambiar θ. N permanece exactamente perpendicular al plano. Si el bloque se desliza hacia arriba, la fricción cinética apunta hacia abajo del plano. Las longitudes de N y f no representan magnitudes calculadas.");
  }

  function energyLab(topic){
    const id=uid("ene"), path=`M110 110 C220 110 260 320 405 320 S590 165 740 210`;
    const controls=toolbar(btn("energy","Energy transfer",true)+btn("work","Work & dissipation"));
    const svg=`<svg class="tv6-svg" viewBox="0 0 860 460" role="img" aria-label="Animated energy transformation laboratory">${markerDefs(id)}
      <g class="tv6-layer mode-energy">
        <text class="tv6-title" x="430" y="38" text-anchor="middle">Mechanical energy: follow states, not a memorized formula list</text>
        <path id="${id}-track" class="tv6-track" d="${path}"/>
        <g class="tv6-energy-runner"><circle class="tv6-dot blue-dot" r="11"/><animateMotion dur="7s" repeatCount="indefinite" rotate="auto"><mpath href="#${id}-track"/></animateMotion></g>
        <g transform="translate(110,370)"><rect class="tv6-bar-bg" x="0" y="-150" width="42" height="150"/><rect class="tv6-bar blue-bar tv6-pe-bar" x="0" y="-150" width="42" height="150"/><text class="tv6-small" x="21" y="24" text-anchor="middle">U</text></g>
        <g transform="translate(180,370)"><rect class="tv6-bar-bg" x="0" y="-150" width="42" height="150"/><rect class="tv6-bar gold-bar tv6-ke-bar" x="0" y="-10" width="42" height="10"/><text class="tv6-small" x="21" y="24" text-anchor="middle">K</text></g>
        <line class="tv6-datum" x1="95" y1="320" x2="760" y2="320"/><text class="tv6-small" x="665" y="348">choose a convenient U=0 datum</text>
        <text class="tv6-equation" x="430" y="430" text-anchor="middle">K + U = constant when non-conservative work is negligible</text>
      </g>
      <g class="tv6-layer mode-work">
        <text class="tv6-title" x="430" y="38" text-anchor="middle">With kinetic friction: mechanical energy decreases by the work of friction</text>
        <line class="tv6-ground" x1="110" y1="300" x2="750" y2="300"/><rect class="tv6-block" x="180" y="230" width="110" height="70" rx="4"/>
        ${lineArrow(id,290,255,455,255,"blue","v",360,235)}${lineArrow(id,200,275,105,275,"red","fₖ",90,255)}
        <line class="tv6-measure" x1="290" y1="340" x2="650" y2="340"/><text class="tv6-label" x="465" y="372">distance d</text>
        <text class="tv6-equation" x="430" y="420" text-anchor="middle">Wₙc = −fₖd = Δ(K+U) · if fₖ is constant, stopping distance scales as v²</text>
      </g>
    </svg>`;
    return frame(topic.slug,"energy",controls,svg,"En Energy transfer el punto recorre una trayectoria mientras las barras U y K cambian de forma complementaria. En Work & dissipation se separa la pérdida mecánica debida a fricción.");
  }

  function momentumLab(topic){
    const id=uid("mom");
    const controls=toolbar(btn("system","Choose the system",true)+btn("collision","Collision sequence"));
    const svg=`<svg class="tv6-svg" viewBox="0 0 860 460" role="img" aria-label="Animated momentum conservation laboratory">${markerDefs(id)}
      <g class="tv6-layer mode-system">
        <text class="tv6-title" x="430" y="38" text-anchor="middle">Momentum conservation begins by choosing the system</text>
        <rect class="tv6-system-boundary" x="105" y="100" width="650" height="265" rx="26"/>
        <g transform="translate(185 225)"><rect class="tv6-cart-body" x="0" y="0" width="160" height="82"/><circle class="tv6-wheel" cx="38" cy="92" r="17"/><circle class="tv6-wheel" cx="122" cy="92" r="17"/></g>
        <g transform="translate(520 225)"><rect class="tv6-cart-body" x="0" y="0" width="160" height="82"/><circle class="tv6-wheel" cx="38" cy="92" r="17"/><circle class="tv6-wheel" cx="122" cy="92" r="17"/></g>
        ${lineArrow(id,345,245,465,245,"blue","p₁",390,224)}${lineArrow(id,520,285,430,285,"gold","p₂",460,314)}
        <text class="tv6-small" x="430" y="135" text-anchor="middle">external impulse ≈ 0 during the short interaction</text>
        <text class="tv6-equation" x="430" y="420" text-anchor="middle">p⃗total,before = p⃗total,after</text>
      </g>
      <g class="tv6-layer mode-collision">
        <text class="tv6-title" x="430" y="38" text-anchor="middle">Internal forces change each cart’s momentum in equal-and-opposite amounts</text>
        <line class="tv6-ground" x1="90" y1="335" x2="770" y2="335"/>
        <g class="tv6-cart-anim left-cart"><rect class="tv6-cart-body" x="0" y="0" width="145" height="74"/><circle class="tv6-wheel" cx="34" cy="84" r="16"/><circle class="tv6-wheel" cx="111" cy="84" r="16"/></g>
        <g class="tv6-cart-anim right-cart"><rect class="tv6-cart-body" x="0" y="0" width="145" height="74"/><circle class="tv6-wheel" cx="34" cy="84" r="16"/><circle class="tv6-wheel" cx="111" cy="84" r="16"/></g>
        <g class="tv6-stuck-cart"><rect class="tv6-cart-body stuck" x="0" y="0" width="250" height="74"/><circle class="tv6-wheel" cx="50" cy="84" r="16"/><circle class="tv6-wheel" cx="200" cy="84" r="16"/></g>
        <text class="tv6-small" x="430" y="115" text-anchor="middle">before → interaction → after</text>
        <text class="tv6-equation" x="430" y="420" text-anchor="middle">Δp⃗₁ + Δp⃗₂ = 0 inside an isolated two-cart system</text>
      </g>
    </svg>`;
    return frame(topic.slug,"system",controls,svg,"El modo System muestra qué se conserva y por qué las fuerzas internas no cambian el momentum total. Collision sequence anima el evento sin confundir conservación de momentum con conservación de energía cinética.");
  }

  function circularLab(topic){
    const id=uid("cg");
    const controls=toolbar(btn("vectors","v and aᶜ",true)+btn("gravity","Gravity as centripetal"));
    const svg=`<svg class="tv6-svg" viewBox="0 0 860 460" role="img" aria-label="Animated circular motion and gravitation laboratory">${markerDefs(id)}
      <g class="tv6-layer mode-vectors">
        <text class="tv6-title" x="430" y="38" text-anchor="middle">Constant speed can still mean nonzero acceleration</text>
        <circle class="tv6-orbit" cx="430" cy="245" r="145"/><circle class="tv6-center" cx="430" cy="245" r="8"/>
        <g class="tv6-orbiting" style="transform-origin:430px 245px"><circle class="tv6-dot blue-dot" cx="430" cy="100" r="11"/>${lineArrow(id,430,100,555,100,"blue","v",565,92)}${lineArrow(id,430,100,430,195,"red","aᶜ",445,178)}</g>
        <text class="tv6-equation" x="430" y="430" text-anchor="middle">v⃗ is tangent · a⃗c points to the center · aᶜ=v²/r</text>
      </g>
      <g class="tv6-layer mode-gravity">
        <text class="tv6-title" x="430" y="38" text-anchor="middle">In a circular orbit, gravity can supply the entire radial force</text>
        <circle class="tv6-planet" cx="430" cy="245" r="78"/><circle class="tv6-orbit" cx="430" cy="245" r="165"/>
        <g class="tv6-orbiting slow" style="transform-origin:430px 245px"><circle class="tv6-satellite" cx="430" cy="80" r="12"/>${lineArrow(id,430,80,430,190,"red","Fᵍ",445,170)}${lineArrow(id,430,80,555,80,"blue","v",565,72)}</g>
        <text class="tv6-equation" x="430" y="430" text-anchor="middle">GMm/r² = mv²/r  →  v=√(GM/r)</text>
      </g>
    </svg>`;
    return frame(topic.slug,"vectors",controls,svg,"Las flechas giran junto con el móvil: v permanece tangente y aᶜ/Fᵍ permanece radial hacia el centro. Esto evita dibujar una fuerza centrípeta adicional que no existe como interacción independiente.");
  }

  function rotationLab(topic){
    const id=uid("rot");
    const controls=toolbar(btn("perpendicular","Perpendicular force",true)+btn("radial","Radial force"));
    const svg=`<svg class="tv6-svg" viewBox="0 0 860 460" role="img" aria-label="Interactive torque and lever-arm laboratory">${markerDefs(id)}
      <text class="tv6-title" x="430" y="38" text-anchor="middle">Torque depends on perpendicular lever arm, not simply on force size</text>
      <circle class="tv6-pivot" cx="190" cy="245" r="13"/><line class="tv6-door-line" x1="190" y1="245" x2="675" y2="245"/>
      <line class="tv6-measure" x1="190" y1="300" x2="675" y2="300"/><text class="tv6-label" x="420" y="330">r</text>
      <g class="tv6-layer mode-perpendicular">${lineArrow(id,675,245,675,105,"blue","F⊥",690,125)}<path class="tv6-torque-arc" d="M300 245 A110 110 0 0 0 235 150" marker-end="url(#${id}-gold)"/><text class="tv6-label" x="290" y="155">τ</text><text class="tv6-equation" x="430" y="410" text-anchor="middle">τ = rF sin90° = rF  → maximum for fixed r and F</text></g>
      <g class="tv6-layer mode-radial">${lineArrow(id,675,245,400,245,"blue","F along r",480,225)}<line class="tv6-guide" x1="190" y1="245" x2="760" y2="245"/><text class="tv6-equation" x="430" y="410" text-anchor="middle">line of action passes through pivot → lever arm = 0 → τ = 0</text></g>
    </svg>`;
    return frame(topic.slug,"perpendicular",controls,svg,"Alterna la dirección de F. La comparación hace visible que el brazo de palanca es la distancia perpendicular desde el pivote hasta la línea de acción.");
  }

  function fluidsLab(topic){
    const id=uid("flu"), flowPath=`M120 250 C260 250 285 250 350 250 S520 250 735 250`;
    const extras=`<label class="tv6-slider-row hydro-slider">Hydrostatic depth <output data-fluid-depth-output>60%</output><input data-fluid-depth type="range" min="15" max="85" value="60" step="1"></label>`;
    const controls=toolbar(btn("continuity","Continuity",true)+btn("bernoulli","Bernoulli")+btn("hydrostatic","Hydrostatic"),extras);
    const particles = [0,1.0,2.0,3.0,4.0].map((d,i)=>`<circle class="tv6-fluid-particle p${i}" r="6"><animateMotion dur="5s" begin="-${d}s" repeatCount="indefinite" keyPoints="0;0.42;0.58;1" keyTimes="0;0.55;0.68;1" calcMode="linear"><mpath href="#${id}-flow"/></animateMotion></circle>`).join("");
    const svg=`<svg class="tv6-svg" viewBox="0 0 860 460" role="img" aria-label="Interactive fluid continuity, Bernoulli, and hydrostatic pressure laboratory">${markerDefs(id)}
      <g class="tv6-layer mode-continuity">
        <text class="tv6-title" x="430" y="38" text-anchor="middle">Continuity: the same volume flow rate passes every section</text>
        <path class="tv6-pipe" d="M90 155 H300 Q350 155 380 205 H500 Q530 155 580 155 H770 V345 H580 Q530 345 500 295 H380 Q350 345 300 345 H90 Z"/>
        <path id="${id}-flow" class="tv6-flow-path" d="${flowPath}"/>${particles}
        <line class="tv6-section" x1="235" y1="155" x2="235" y2="345"/><line class="tv6-section" x1="440" y1="205" x2="440" y2="295"/>
        <text class="tv6-label" x="205" y="135">A₁</text><text class="tv6-label" x="415" y="185">A₂</text><text class="tv6-label" x="170" y="270">v₁</text><text class="tv6-label" x="435" y="270">v₂ &gt; v₁</text>
        <text class="tv6-equation" x="430" y="425" text-anchor="middle">Q=A₁v₁=A₂v₂ · smaller area → greater speed for incompressible steady flow</text>
      </g>
      <g class="tv6-layer mode-bernoulli">
        <text class="tv6-title" x="430" y="38" text-anchor="middle">Horizontal Bernoulli: faster flow corresponds to lower static pressure</text>
        <path class="tv6-pipe" d="M90 190 H310 Q355 190 390 225 H510 Q545 190 590 190 H770 V320 H590 Q545 320 510 285 H390 Q355 320 310 320 H90 Z"/>
        <path class="tv6-flow-path" d="${flowPath}"/><circle class="tv6-fluid-particle"><animateMotion dur="5s" repeatCount="indefinite" keyPoints="0;0.42;0.58;1" keyTimes="0;0.55;0.68;1" calcMode="linear"><mpath href="#${id}-flow"/></animateMotion></circle>
        <path class="tv6-pressure-tube" d="M220 190 V78 H275 V190"/><rect class="tv6-pressure-column high" x="228" y="102" width="39" height="88"/><path class="tv6-pressure-tube" d="M430 225 V118 H485 V225"/><rect class="tv6-pressure-column low" x="438" y="165" width="39" height="60"/>
        <text class="tv6-label" x="218" y="64">P₁ higher</text><text class="tv6-label" x="423" y="104">P₂ lower</text><text class="tv6-label" x="170" y="275">v₁</text><text class="tv6-label" x="430" y="270">v₂ &gt; v₁</text>
        <text class="tv6-equation" x="430" y="425" text-anchor="middle">same height: P₁+½ρv₁²=P₂+½ρv₂²</text>
      </g>
      <g class="tv6-layer mode-hydrostatic">
        <text class="tv6-title" x="430" y="38" text-anchor="middle">Hydrostatic pressure increases with depth, not with vessel shape</text>
        <rect class="tv6-tank" x="225" y="95" width="410" height="280" rx="8"/><rect class="tv6-water-fill" x="233" y="125" width="394" height="242"/><line class="tv6-waterline" x1="233" y1="125" x2="627" y2="125"/>
        <circle data-fluid-probe class="tv6-probe" cx="430" cy="270" r="11"/><line data-fluid-depth-line class="tv6-depth-line" x1="390" y1="125" x2="390" y2="270"/><text data-fluid-depth-label class="tv6-label" x="350" y="205">h</text>
        <line data-fluid-left class="tv6-arrow blue" x1="430" y1="270" x2="360" y2="270" marker-end="url(#${id}-blue)"/><line data-fluid-right class="tv6-arrow blue" x1="430" y1="270" x2="500" y2="270" marker-end="url(#${id}-blue)"/><line data-fluid-down class="tv6-arrow blue" x1="430" y1="270" x2="430" y2="340" marker-end="url(#${id}-blue)"/>
        <text class="tv6-equation" x="430" y="425" text-anchor="middle">P−P₀=ρgh · move the probe: deeper → larger pressure in every direction</text>
      </g>
    </svg>`;
    return frame(topic.slug,"continuity",controls,svg,"Continuity y Bernoulli usan partículas que aceleran al atravesar la sección estrecha. Hydrostatic incluye un deslizador de profundidad: el punto de medición y las flechas de presión se actualizan en tiempo real.");
  }

  const renderers={
    "tools-vectors":vectorLab,
    "kinematics":kinematicsLab,
    "dynamics":dynamicsLab,
    "energy":energyLab,
    "momentum":momentumLab,
    "circular-gravity":circularLab,
    "rotation-equilibrium":rotationLab,
    "fluids":fluidsLab,
  };

  function setMode(host, mode){
    host.dataset.mode=mode;
    host.querySelectorAll("[data-tv6-mode]").forEach(b=>{const on=b.dataset.tv6Mode===mode;b.classList.toggle("active",on);b.setAttribute("aria-pressed",on?"true":"false");});
  }
  function restart(host){
    const svg=host.querySelector("svg");
    if(svg?.setCurrentTime) try{svg.setCurrentTime(0);}catch(_e){}
    host.classList.remove("tv6-restart"); void host.offsetWidth; host.classList.add("tv6-restart");
  }
  const setLine=(el,x1,y1,x2,y2)=>{if(!el)return;el.setAttribute("x1",x1);el.setAttribute("y1",y1);el.setAttribute("x2",x2);el.setAttribute("y2",y2);};
  const setText=(el,x,y,text)=>{if(!el)return;el.setAttribute("x",x);el.setAttribute("y",y);if(text!==undefined)el.textContent=text;};

  function mountVector(host){
    const input=host.querySelector("[data-vector-angle]"), out=host.querySelector("[data-vector-output]"); if(!input)return;
    const update=()=>{const deg=Number(input.value),th=deg*Math.PI/180,ox=170,oy=350,L=235,x=ox+L*Math.cos(th),y=oy-L*Math.sin(th);
      out.textContent=`${deg}°`; setLine(host.querySelector("[data-vector-main]"),ox,oy,x,y); setLine(host.querySelector("[data-vector-x]"),ox,oy,x,oy); setLine(host.querySelector("[data-vector-y]"),x,oy,x,y);
      setText(host.querySelector("[data-vector-label]"),x+12,y-10,"A"); setText(host.querySelector("[data-vector-xlabel]"),(ox+x)/2,oy+31,"Aₓ=A cosθ"); setText(host.querySelector("[data-vector-ylabel]"),x+14,(oy+y)/2,"Aᵧ=A sinθ");
      const r=55,ex=ox+r*Math.cos(th),ey=oy-r*Math.sin(th),arc=host.querySelector("[data-vector-arc]"); if(arc)arc.setAttribute("d",`M${ox+r} ${oy} A${r} ${r} 0 0 0 ${ex} ${ey}`); setText(host.querySelector("[data-vector-angle-label]"),ox+72*Math.cos(th/2),oy-72*Math.sin(th/2),"θ");};
    input.addEventListener("input",update); update();
  }

  function mountDynamics(host){
    const input=host.querySelector("[data-dyn-angle]"),out=host.querySelector("[data-dyn-angle-output]"); if(!input)return;
    const update=()=>{const deg=Number(input.value),th=deg*Math.PI/180,x0=110,y0=360,x1=620,y1=y0-(x1-x0)*Math.tan(th),cx=405,cy=y0-(cx-x0)*Math.tan(th)-38,W=125;
      out.textContent=`${deg}°`; const ramp=host.querySelector("[data-dyn-ramp]"); if(ramp)ramp.setAttribute("points",`${x0},${y0} ${x1},${y0} ${x1},${y1}`);
      const block=host.querySelector("[data-dyn-block]"); if(block){block.setAttribute("x",cx-50);block.setAttribute("y",cy-32);block.setAttribute("transform",`rotate(${-deg} ${cx} ${cy})`);}
      const uDown=[-Math.cos(th),Math.sin(th)],uUp=[Math.cos(th),-Math.sin(th)],uInto=[Math.sin(th),Math.cos(th)],uOut=[-Math.sin(th),-Math.cos(th)];
      const mg=[cx,cy+W], n=[cx+110*uOut[0],cy+110*uOut[1]], f=[cx+90*uDown[0],cy+90*uDown[1]], v=[cx+105*uUp[0],cy+105*uUp[1]];
      setLine(host.querySelector("[data-dyn-mg]"),cx,cy,...mg); setText(host.querySelector("[data-dyn-mg-label]"),mg[0]+16,mg[1]-8,"mg");
      setLine(host.querySelector("[data-dyn-n]"),cx,cy,...n); setText(host.querySelector("[data-dyn-n-label]"),n[0]-16,n[1]-12,"N");
      setLine(host.querySelector("[data-dyn-f]"),cx,cy,...f); setText(host.querySelector("[data-dyn-f-label]"),f[0]-30,f[1]+22,"fₖ");
      setLine(host.querySelector("[data-dyn-v]"),cx,cy,...v); setText(host.querySelector("[data-dyn-v-label]"),v[0]+10,v[1]-10,"v");
      const lp=W*Math.sin(th),ln=W*Math.cos(th),par=[cx+lp*uDown[0],cy+lp*uDown[1]],perp=[cx+ln*uInto[0],cy+ln*uInto[1]];
      setLine(host.querySelector("[data-dyn-par]"),cx,cy,...par); setText(host.querySelector("[data-dyn-par-label]"),par[0]-48,par[1]+22,"mg sinθ");
      setLine(host.querySelector("[data-dyn-perp]"),cx,cy,...perp); setText(host.querySelector("[data-dyn-perp-label]"),perp[0]+8,perp[1]+10,"mg cosθ");
      setLine(host.querySelector("[data-dyn-guide1]"),par[0],par[1],mg[0],mg[1]); setLine(host.querySelector("[data-dyn-guide2]"),perp[0],perp[1],mg[0],mg[1]);
      const r=60,ex=x0+r*Math.cos(th),ey=y0-r*Math.sin(th),arc=host.querySelector("[data-dyn-angle-arc]"); if(arc)arc.setAttribute("d",`M${x0+r} ${y0} A${r} ${r} 0 0 0 ${ex} ${ey}`); setText(host.querySelector("[data-dyn-angle-label]"),x0+78*Math.cos(th/2),y0-78*Math.sin(th/2),"θ");};
    input.addEventListener("input",update); update();
  }

  function mountFluid(host){
    const input=host.querySelector("[data-fluid-depth]"),out=host.querySelector("[data-fluid-depth-output]"); if(!input)return;
    const update=()=>{const pct=Number(input.value),top=125,bottom=355,y=top+(bottom-top)*(pct/100),len=40+90*(pct/100);out.textContent=`${pct}%`;
      const probe=host.querySelector("[data-fluid-probe]"); if(probe)probe.setAttribute("cy",y); setLine(host.querySelector("[data-fluid-depth-line]"),390,top,390,y); setText(host.querySelector("[data-fluid-depth-label]"),350,(top+y)/2,"h");
      setLine(host.querySelector("[data-fluid-left]"),430,y,430-len,y); setLine(host.querySelector("[data-fluid-right]"),430,y,430+len,y); setLine(host.querySelector("[data-fluid-down]"),430,y,430,Math.min(385,y+len));};
    input.addEventListener("input",update); update();
  }

  function mount(root, topic){
    const host=root?.querySelector?.(`[data-tv6="${topic.slug}"]`); if(!host)return;
    host.querySelectorAll("[data-tv6-mode]").forEach(b=>b.addEventListener("click",()=>{setMode(host,b.dataset.tv6Mode);restart(host);}));
    const play=host.querySelector("[data-tv6-play]"); if(play)play.addEventListener("click",()=>{const paused=host.classList.toggle("is-paused"),svg=host.querySelector("svg");play.textContent=paused?"Play":"Pause";if(svg){try{paused?svg.pauseAnimations?.():svg.unpauseAnimations?.();}catch(_e){}}});
    const replay=host.querySelector("[data-tv6-replay]"); if(replay)replay.addEventListener("click",()=>restart(host));
    if(topic.slug==="tools-vectors")mountVector(host); if(topic.slug==="dynamics")mountDynamics(host); if(topic.slug==="fluids")mountFluid(host);
  }
  function render(topic){return (renderers[topic?.slug]||vectorLab)(topic);}
  window.PhysicsOlympiadTheoryVisuals={render,mount};
})();
