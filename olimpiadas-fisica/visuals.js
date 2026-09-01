(() => {
  let visualSeq = 0;
  const esc = (value) => String(value ?? "").replace(/[&<>\"]/g, (ch) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[ch]));
  const uid = (prefix) => `${prefix}-${++visualSeq}`;
  const marker = (id, cls = "marker-primary") => `<marker id="${id}" markerWidth="10" markerHeight="10" refX="8.5" refY="5" orient="auto" markerUnits="strokeWidth"><path class="${cls}" d="M0,0 L10,5 L0,10 z"/></marker>`;
  const arrow = (id, x1, y1, x2, y2, cls = "v-arrow primary", label = "", tx = null, ty = null) => `<line class="${cls}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" marker-end="url(#${id})"/>${label ? `<text class="force-label" x="${tx ?? x2 + 8}" y="${ty ?? y2 - 7}">${esc(label)}</text>` : ""}`;
  const frame = (inner, cfg = {}, compact = false) => {
    const label = esc(cfg.title || cfg.label || "Physics diagram");
    const caption = cfg.caption ? `<figcaption>${esc(cfg.caption)}</figcaption>` : "";
    const variant = esc(cfg.variant || "general");
    return `<figure class="physics-visual ${compact ? "compact" : ""}" data-variant="${variant}" role="img" aria-label="${label}"><div class="visual-stage">${inner}</div>${caption}</figure>`;
  };
  const svg = (body, extra = "") => `<svg viewBox="0 0 420 280" class="physics-svg ${extra}" aria-hidden="true">${body}</svg>`;

  function vector(cfg, compact) {
    const variant = cfg.variant || "components";
    const a = uid("vA"), b = uid("vB"), c = uid("vC");
    let body = `<defs>${marker(a)}${marker(b, "marker-secondary")}${marker(c, "marker-accent")}</defs>`;
    body += `<line class="axis" x1="46" y1="224" x2="388" y2="224"/><line class="axis" x1="74" y1="248" x2="74" y2="34"/><text x="382" y="246">x</text><text x="54" y="42">y</text>`;
    if (variant === "two-vectors") {
      const angle = Number(cfg.angle ?? 120), rad = angle * Math.PI / 180, L = 135, ox = 160, oy = 205;
      const x2 = ox + L, y2 = oy, x3 = ox + L * Math.cos(rad), y3 = oy - L * Math.sin(rad);
      body += arrow(a, ox, oy, x2, y2, "v-arrow primary", "A", x2 - 5, y2 - 14);
      body += arrow(b, ox, oy, x3, y3, "v-arrow secondary", "B", x3 - 18, y3 - 10);
      body += `<path class="angle-arc" d="M205 205 A45 45 0 0 0 ${205 + 45*Math.cos(rad)} ${205 - 45*Math.sin(rad)}"/><text class="angle-label" x="205" y="166">${esc(angle)}°</text><text class="diagram-equation" x="210" y="60" text-anchor="middle">|A+B|² = A²+B²+2AB cosθ</text>`;
    } else if (variant === "triangle-345") {
      body += `<polygon class="vector-triangle" points="105,220 285,220 285,100"/><text x="185" y="244">3</text><text x="300" y="165">4</text><text x="190" y="145">5</text>`;
      body += arrow(a, 105,220,285,100,"v-arrow primary","û",295,92);
      body += `<text class="diagram-equation" x="210" y="55" text-anchor="middle">û = (3/5, 4/5)</text>`;
    } else if (variant === "drag") {
      body += `<rect class="object" x="165" y="145" width="82" height="48" rx="10"/><text x="190" y="175">body</text>`;
      body += arrow(a,165,169,92,169,"v-arrow secondary","Fᵈ",72,156);
      body += arrow(b,247,169,338,169,"v-arrow primary","v",346,158);
      body += `<text class="diagram-equation" x="210" y="72" text-anchor="middle">Fᵈ = kv²</text><text class="caption-text" x="210" y="100" text-anchor="middle">drag opposes relative velocity</text>`;
    } else if (variant === "scaling") {
      body += arrow(a,90,175,180,175,"v-arrow primary","v",128,158);
      body += arrow(b,90,100,350,100,"v-arrow secondary","3v",208,82);
      body += `<text class="diagram-equation" x="210" y="230" text-anchor="middle">F ∝ v²  ⇒  3v → 9F</text>`;
    } else {
      const angle = Number(cfg.angle ?? 37), rad = angle * Math.PI / 180, ox=90, oy=220, L=210, x2=ox+L*Math.cos(rad), y2=oy-L*Math.sin(rad);
      body += arrow(a,ox,oy,x2,y2,"v-arrow primary","A",x2+8,y2-8);
      body += `<line class="component dashed" x1="${ox}" y1="${oy}" x2="${x2}" y2="${oy}"/><line class="component dashed" x1="${x2}" y1="${oy}" x2="${x2}" y2="${y2}"/><text x="${(ox+x2)/2}" y="242">Aₓ</text><text x="${x2+10}" y="${(oy+y2)/2}">Aᵧ</text><path class="angle-arc" d="M135 220 A45 45 0 0 0 ${ox+45*Math.cos(rad)} ${oy-45*Math.sin(rad)}"/><text class="angle-label" x="142" y="203">${esc(angle)}°</text>`;
    }
    return frame(svg(body), cfg, compact);
  }

  function kinematics(cfg, compact) {
    const variant = cfg.variant || "graph";
    const a = uid("kA"), b = uid("kB");
    let body = `<defs>${marker(a)}${marker(b,"marker-secondary")}</defs>`;
    if (variant === "river") {
      body += `<rect class="river" x="45" y="38" width="330" height="205" rx="8"/><line class="bank" x1="45" y1="38" x2="375" y2="38"/><line class="bank" x1="45" y1="243" x2="375" y2="243"/><path class="boat" d="M170 205 L198 190 L226 205 L198 220 Z"/>`;
      body += arrow(a,198,205,198,90,"v-arrow primary","4 m/s",206,104);
      body += arrow(b,198,205,300,205,"v-arrow secondary","3 m/s",260,191);
      body += arrow(a,198,205,300,90,"v-arrow resultant","5 m/s",305,84);
      body += `<text class="caption-text" x="210" y="265" text-anchor="middle">ground velocity = boat/water + current</text>`;
    } else if (variant === "projectile") {
      body += `<line class="ground" x1="40" y1="230" x2="390" y2="230"/><path class="trajectory" d="M60 220 Q205 35 360 220" fill="none"/><circle class="projectile-dot" cx="60" cy="220" r="8"/>`;
      body += arrow(a,60,220,145,220,"v-arrow primary","vₓ",106,206);
      body += arrow(b,60,220,60,135,"v-arrow secondary","vᵧ",68,150);
      body += arrow(b,295,118,295,185,"v-arrow accent","g",305,164);
      body += `<text class="diagram-equation" x="210" y="55" text-anchor="middle">aₓ=0 · aᵧ=−g · same flight time</text>`;
    } else if (variant === "parabola") {
      body += `<line class="axis" x1="58" y1="225" x2="382" y2="225"/><line class="axis" x1="58" y1="245" x2="58" y2="40"/><path class="graph-line" d="M70 210 Q190 55 330 210" fill="none"/><line class="tangent" x1="165" y1="84" x2="245" y2="84"/><circle class="graph-dot" cx="205" cy="84" r="7"/><text x="367" y="248">t</text><text x="35" y="48">x</text><text class="caption-text" x="210" y="65" text-anchor="middle">v = dx/dt = slope; at the top v=0</text>`;
    } else if (variant === "out-back") {
      body += `<line class="track-line" x1="70" y1="155" x2="350" y2="155"/><circle class="station" cx="80" cy="155" r="10"/><circle class="station" cx="340" cy="155" r="10"/><text x="72" y="190">A</text><text x="333" y="190">B</text>`;
      body += arrow(a,100,130,300,130,"v-arrow primary","v",195,115);
      body += arrow(b,320,180,120,180,"v-arrow secondary","2v",205,205);
      body += `<text class="diagram-equation" x="210" y="62" text-anchor="middle">same distance d each way → compare times, not speeds</text>`;
    } else if (variant === "track") {
      body += `<circle class="track-circle" cx="210" cy="140" r="90"/><circle class="runner runner-a" cx="210" cy="50" r="8"/><circle class="runner runner-b" cx="210" cy="230" r="8"/>`;
      body += `<path class="motion-arc primary-stroke" d="M210 50 A90 90 0 0 1 300 140"/><path class="motion-arc secondary-stroke" d="M210 230 A90 90 0 0 1 300 140"/><text x="310" y="135">relative closing speed</text>`;
    } else {
      body += `<line class="axis" x1="58" y1="220" x2="382" y2="220"/><line class="axis" x1="58" y1="240" x2="58" y2="42"/>`;
      if (variant === "velocity-cross") {
        body += `<line class="graph-line" x1="75" y1="78" x2="340" y2="205"/><line class="zero-line dashed" x1="58" y1="143" x2="382" y2="143"/><circle class="graph-dot" cx="210" cy="143" r="7"/><text x="220" y="132">v=0 → direction changes</text><text x="365" y="244">t</text><text x="35" y="50">v</text>`;
      } else {
        body += `<path class="graph-line" d="M72 205 C120 190 150 132 205 118 S300 125 360 65" fill="none"/><line class="tangent" x1="170" y1="145" x2="245" y2="100"/><polygon class="area-fill" points="205,118 360,65 360,220 205,220"/><text x="365" y="244">t</text><text x="35" y="50">x/v</text><text class="caption-text" x="210" y="35" text-anchor="middle">slope = rate · area = accumulated change</text>`;
      }
    }
    return frame(svg(body), cfg, compact);
  }

  function dynamics(cfg, compact) {
    const variant = cfg.variant || "incline";
    const a=uid("dA"), b=uid("dB"), c=uid("dC");
    let body = `<defs>${marker(a)}${marker(b,"marker-secondary")}${marker(c,"marker-accent")}</defs>`;
    if (variant === "atwood") {
      body += `<circle class="pulley" cx="210" cy="70" r="34"/><path class="rope" d="M115 210 L115 70 Q210 -4 305 70 L305 195" fill="none"/><rect class="block" x="82" y="190" width="66" height="48"/><rect class="block" x="272" y="165" width="66" height="73"/><text x="103" y="220">m</text><text x="292" y="205">2m</text>`;
      body += arrow(a,157,204,157,155,"v-arrow primary","a",165,166)+arrow(b,348,174,348,224,"v-arrow secondary","a",356,218);
      body += `<text class="diagram-equation" x="210" y="266" text-anchor="middle">system: (2m−m)g = (3m)a</text>`;
    } else if (variant === "connected") {
      body += `<line class="ground" x1="35" y1="205" x2="385" y2="205"/><rect class="block" x="95" y="150" width="75" height="55"/><rect class="block" x="220" y="150" width="90" height="55"/><line class="rope" x1="170" y1="177" x2="220" y2="177"/><text x="116" y="184">2 kg</text><text x="245" y="184">3 kg</text>`;
      body += arrow(a,310,177,380,177,"v-arrow primary","10 N",336,160)+arrow(b,220,135,170,135,"v-arrow secondary","T",188,122)+arrow(b,170,135,220,135,"v-arrow secondary","T",198,122);
      body += `<text class="caption-text" x="210" y="248" text-anchor="middle">whole system first → a = F/(m₁+m₂); isolate 2 kg for T</text>`;
    } else if (variant === "push-down") {
      body += `<line class="ground" x1="45" y1="210" x2="380" y2="210"/><rect class="block" x="165" y="150" width="90" height="60"/>`;
      body += arrow(a,210,150,210,78,"v-arrow primary","N",218,94)+arrow(b,210,180,210,250,"v-arrow secondary","mg",218,244)+arrow(c,170,170,105,208,"v-arrow accent","F",86,217);
      body += `<line class="component dashed" x1="170" y1="170" x2="105" y2="170"/><line class="component dashed" x1="105" y1="170" x2="105" y2="208"/><text class="diagram-equation" x="210" y="48" text-anchor="middle">vertical: N − mg − F sinθ = 0</text>`;
    } else {
      const theta = Number(cfg.angle ?? 30);
      body += `<polygon class="incline" points="45,225 365,225 365,70"/><g class="incline-block"><rect class="block" x="220" y="135" width="72" height="50" transform="rotate(-${theta} 256 160)"/></g>`;
      body += arrow(a,255,150,255,70,"v-arrow primary","N",265,85)+arrow(b,255,150,255,238,"v-arrow secondary","mg",265,230);
      const frLabel = variant === "static-limit" ? "fₛ" : "fₖ";
      body += arrow(c,232,170,162,205,"v-arrow accent",frLabel,150,220);
      body += `<path class="angle-arc" d="M330 225 A36 36 0 0 0 362 208"/><text class="angle-label" x="325" y="204">${theta}°</text>`;
      if (variant === "static-limit") body += `<text class="diagram-equation" x="210" y="45" text-anchor="middle">limit: fₛ = μₛN · tanθ = μₛ,min</text>`;
      else body += `<text class="caption-text" x="210" y="260" text-anchor="middle">friction opposes sliding; choose axes parallel/perpendicular to plane</text>`;
    }
    return frame(svg(body), cfg, compact);
  }

  function energy(cfg, compact) {
    const variant = cfg.variant || "track";
    const a=uid("eA"), b=uid("eB");
    let body=`<defs>${marker(a)}${marker(b,"marker-secondary")}</defs>`;
    if (variant === "spring") {
      body += `<line class="ground" x1="35" y1="215" x2="385" y2="215"/><path class="spring" d="M48 175 L75 175 L88 155 L105 195 L122 155 L139 195 L156 155 L173 195 L190 175"/><rect class="block" x="190" y="148" width="72" height="67"/><line class="measure dashed" x1="50" y1="235" x2="190" y2="235"/><text x="113" y="258">compression x</text>`;
      body += arrow(a,265,180,350,180,"v-arrow primary","v",352,166)+`<text class="diagram-equation" x="210" y="65" text-anchor="middle">½kx² → ½mv² · doubling x doubles v</text>`;
    } else if (variant === "loop") {
      body += `<line class="ground" x1="25" y1="232" x2="395" y2="232"/><path class="track" d="M35 70 C90 70 115 155 145 200 C170 237 200 230 210 200 C225 150 185 95 245 72 C320 45 370 105 370 175" fill="none"/><circle class="loop-path" cx="245" cy="145" r="60"/><circle class="energy-dot" cx="245" cy="85" r="8"/>`;
      body += arrow(a,245,85,245,145,"v-arrow primary","mg",255,132)+`<text class="diagram-equation" x="210" y="35" text-anchor="middle">top limit: N=0 ⇒ v²=gR</text><text class="caption-text" x="75" y="55">start height h</text>`;
    } else if (variant === "power") {
      body += `<rect class="building" x="250" y="55" width="95" height="180"/><line class="rope" x1="185" y1="210" x2="185" y2="75"/><circle class="person" cx="185" cy="170" r="16"/>`;
      body += arrow(a,185,150,185,85,"v-arrow primary","v",195,98)+arrow(b,185,188,185,238,"v-arrow secondary","mg",195,230)+`<text class="diagram-equation" x="120" y="55">P = F·v = mgv</text>`;
    } else if (variant === "braking") {
      body += `<line class="ground" x1="30" y1="205" x2="390" y2="205"/><rect class="block" x="85" y="155" width="80" height="50"/>`;
      body += arrow(a,165,180,255,180,"v-arrow primary","v",205,165)+arrow(b,85,215,45,215,"v-arrow secondary","fₖ",38,232)+`<line class="measure dashed" x1="165" y1="235" x2="350" y2="235"/><text x="250" y="258">stopping distance d</text><text class="diagram-equation" x="210" y="65" text-anchor="middle">fₖd = ½mv² ⇒ d ∝ v²</text>`;
    } else if (variant === "two-paths") {
      body += `<circle class="point" cx="80" cy="70" r="8"/><circle class="point" cx="340" cy="205" r="8"/><path class="track" d="M80 70 Q210 80 340 205" fill="none"/><path class="track secondary-stroke" d="M80 70 Q115 220 340 205" fill="none"/><line class="height-line dashed" x1="55" y1="70" x2="55" y2="205"/><text x="38" y="142">h</text><text class="diagram-equation" x="210" y="42" text-anchor="middle">same initial/final heights → same ΔU</text>`;
    } else if (variant === "circular-work") {
      body += `<circle class="track-circle" cx="210" cy="145" r="85"/><circle class="energy-dot" cx="295" cy="145" r="8"/>`+arrow(a,295,145,295,82,"v-arrow primary","v",305,92)+arrow(b,295,145,210,145,"v-arrow secondary","Fᵣ",235,132)+`<text class="diagram-equation" x="210" y="45" text-anchor="middle">radial force ⟂ displacement ⇒ instantaneous power = 0</text>`;
    } else {
      body += `<path class="track" d="M28 75 Q95 48 145 185 Q195 245 255 125 Q310 42 392 95" fill="none"/><circle class="energy-dot" cx="35" cy="74" r="8"/><line class="height-line dashed" x1="42" y1="75" x2="42" y2="220"/><text x="50" y="150">h</text><text class="caption-text" x="105" y="55">U high · K low</text><text class="caption-text" x="190" y="225">U low · K high</text>`;
    }
    return frame(svg(body), cfg, compact);
  }

  function momentum(cfg, compact) {
    const variant=cfg.variant||"collision"; const a=uid("mA"), b=uid("mB");
    let body=`<defs>${marker(a)}${marker(b,"marker-secondary")}</defs>`;
    if (variant === "impulse") {
      body += `<line class="axis" x1="55" y1="225" x2="385" y2="225"/><line class="axis" x1="55" y1="245" x2="55" y2="45"/><polygon class="impulse-area" points="85,225 215,70 345,225"/><polyline class="graph-line" points="85,225 215,70 345,225" fill="none"/><text x="368" y="248">t</text><text x="34" y="50">F</text><text class="diagram-equation" x="215" y="150" text-anchor="middle">J = area = ½(4 s)(10 N)=20 N·s</text>`;
    } else if (variant === "explosion") {
      body += `<circle class="explosion-core" cx="210" cy="145" r="24"/>`+arrow(a,180,145,72,145,"v-arrow primary","m · v",68,128)+arrow(b,240,145,348,145,"v-arrow secondary","3m · v/3",305,128)+`<text class="diagram-equation" x="210" y="62" text-anchor="middle">pᵢ=0 ⇒ momenta after explosion are equal/opposite</text>`;
    } else if (variant === "center-mass") {
      body += `<line class="ground" x1="35" y1="205" x2="385" y2="205"/><rect class="cart" x="70" y="155" width="95" height="45"/><rect class="cart" x="265" y="155" width="75" height="45"/><text x="100" y="185">2m</text><text x="290" y="185">m</text>`+arrow(a,165,175,255,175,"v-arrow primary","+3v",202,160)+arrow(b,265,220,210,220,"v-arrow secondary","−v",220,244)+`<text class="diagram-equation" x="210" y="65" text-anchor="middle">vCM = Σp / Σm</text>`;
    } else {
      const embedded = variant === "embed" || variant === "stick";
      body += `<line class="ground" x1="25" y1="215" x2="395" y2="215"/><rect class="cart" x="62" y="160" width="85" height="45"/><rect class="cart" x="275" y="150" width="95" height="55"/><circle cx="84" cy="215" r="9"/><circle cx="126" cy="215" r="9"/><circle cx="300" cy="215" r="9"/><circle cx="345" cy="215" r="9"/>`;
      body += arrow(a,147,180,235,180,"v-arrow primary","p₁",182,164);
      if (!embedded) body += arrow(b,275,195,195,195,"v-arrow secondary","p₂",215,215);
      body += `<text class="diagram-equation" x="210" y="65" text-anchor="middle">${embedded ? "inelastic: momentum conserved, kinetic energy not necessarily" : "choose system → compare total momentum before/after"}</text>`;
    }
    return frame(svg(body), cfg, compact);
  }

  function orbit(cfg, compact) {
    const variant=cfg.variant||"uniform-circle"; const a=uid("oA"), b=uid("oB"), c=uid("oC");
    let body=`<defs>${marker(a)}${marker(b,"marker-secondary")}${marker(c,"marker-accent")}</defs>`;
    if (variant === "banked") {
      body += `<polygon class="banked-road" points="58,220 350,122 374,170 82,268"/><rect class="car" x="195" y="150" width="80" height="38" transform="rotate(-18 235 169)"/><line class="horizontal dashed" x1="65" y1="220" x2="365" y2="220"/>`;
      body += arrow(a,235,165,205,80,"v-arrow primary","N",188,82)+arrow(b,235,165,235,252,"v-arrow secondary","mg",244,245)+`<line class="component dashed" x1="205" y1="80" x2="205" y2="165"/><line class="component dashed" x1="205" y1="165" x2="150" y2="165"/><path class="angle-arc" d="M320 217 A40 40 0 0 0 354 204"/><text class="angle-label" x="325" y="197">θ</text><text class="diagram-equation" x="210" y="38" text-anchor="middle">Ncosθ=mg · Nsinθ=mv²/r ⇒ tanθ=v²/(rg)</text>`;
    } else if (variant === "vertical-circle" || variant === "bottom-loop") {
      body += `<circle class="loop-path" cx="210" cy="145" r="92"/><circle class="mass-dot" cx="210" cy="${variant === "vertical-circle" ? 53 : 237}" r="10"/>`;
      if (variant === "vertical-circle") {
        body += arrow(a,210,53,210,123,"v-arrow primary","mg",220,112)+arrow(b,210,53,210,108,"v-arrow secondary","T",178,102)+arrow(c,210,53,290,53,"v-arrow accent","v",280,38)+`<text class="diagram-equation" x="210" y="260" text-anchor="middle">top limit: T=0 ⇒ mg=mv²/r ⇒ vmin=√(gr)</text>`;
      } else {
        body += arrow(a,210,237,210,142,"v-arrow primary","N",220,158)+arrow(b,210,237,210,274,"v-arrow secondary","mg",220,270)+arrow(c,210,237,300,237,"v-arrow accent","v",290,222)+`<text class="diagram-equation" x="210" y="40" text-anchor="middle">bottom: N−mg=mv²/r ⇒ N=mg+mv²/r</text>`;
      }
    } else if (variant === "kepler") {
      body += `<circle class="planet" cx="150" cy="145" r="30"/><circle class="orbit-path" cx="150" cy="145" r="65"/><ellipse class="orbit-path secondary-stroke" cx="150" cy="145" rx="145" ry="105"/><circle class="satellite" cx="215" cy="145" r="7"/><circle class="satellite secondary-fill" cx="295" cy="145" r="7"/><text x="205" y="130">r₁,T₁</text><text x="292" y="130">r₂,T₂</text><text class="diagram-equation" x="210" y="40" text-anchor="middle">T² ∝ r³ ⇒ r ∝ T^(2/3)</text>`;
    } else if (variant === "escape") {
      body += `<circle class="planet" cx="120" cy="180" r="55"/><path class="escape-path" d="M165 145 Q240 95 350 55" fill="none"/>`+arrow(a,170,140,260,90,"v-arrow primary","vₑ",260,78)+`<line class="radius-line dashed" x1="120" y1="180" x2="170" y2="140"/><text x="136" y="145">r</text><text class="diagram-equation" x="265" y="220">vₑ = √(2GM/r) ⇒ vₑ ∝ r⁻¹ᐟ²</text>`;
    } else {
      body += `<circle class="orbit-path" cx="210" cy="145" r="92"/><circle class="planet" cx="210" cy="145" r="28"/><circle class="satellite" cx="302" cy="145" r="8"/>`+arrow(a,302,145,302,82,"v-arrow primary","v",311,93)+arrow(b,302,145,245,145,"v-arrow secondary","aᵣ",257,132)+`<text class="caption-text" x="210" y="35" text-anchor="middle">velocity tangent · net radial force toward center</text>`;
    }
    return frame(svg(body), cfg, compact);
  }

  function lever(cfg, compact) {
    const variant=cfg.variant||"balance"; const a=uid("lA"), b=uid("lB");
    let body=`<defs>${marker(a)}${marker(b,"marker-secondary")}</defs>`;
    if (variant === "skater") {
      body += `<g transform="translate(118 45)"><circle class="person-head" cx="0" cy="35" r="16"/><line class="person-line" x1="0" y1="52" x2="0" y2="135"/><line class="person-line" x1="0" y1="75" x2="-70" y2="75"/><line class="person-line" x1="0" y1="75" x2="70" y2="75"/><path class="spin-arrow" d="M-65 165 A70 30 0 0 0 65 165"/></g><g transform="translate(310 45)"><circle class="person-head" cx="0" cy="35" r="16"/><line class="person-line" x1="0" y1="52" x2="0" y2="135"/><line class="person-line" x1="0" y1="78" x2="-28" y2="100"/><line class="person-line" x1="0" y1="78" x2="28" y2="100"/><path class="spin-arrow fast" d="M-45 165 A50 25 0 0 0 45 165"/></g><text x="70" y="245">large I · smaller ω</text><text x="267" y="245">smaller I · larger ω</text><text class="diagram-equation" x="210" y="28" text-anchor="middle">L = Iω = constant (τext≈0)</text>`;
    } else if (variant === "rolling") {
      body += `<line class="ground" x1="35" y1="220" x2="390" y2="220"/><circle class="wheel" cx="190" cy="160" r="60"/><circle class="hub" cx="190" cy="160" r="6"/><line class="radius-line" x1="190" y1="160" x2="190" y2="220"/><circle class="contact" cx="190" cy="220" r="5"/>`+arrow(a,190,160,310,160,"v-arrow primary","vCM",270,145)+`<path class="rotation-arrow" d="M145 118 A60 60 0 0 1 233 120"/><text x="205" y="103">ω</text><text class="diagram-equation" x="210" y="50" text-anchor="middle">rolling without slipping: vCM = ωR · contact point instantaneously at rest</text>`;
    } else if (variant === "inertia") {
      body += `<circle class="pivot-dot" cx="105" cy="150" r="8"/><line class="radius-line" x1="105" y1="150" x2="205" y2="150"/><circle class="mass-dot" cx="205" cy="150" r="13"/><text x="150" y="135">r</text><line class="radius-line secondary-stroke" x1="105" y1="190" x2="305" y2="190"/><circle class="mass-dot secondary-fill" cx="305" cy="190" r="13"/><text x="190" y="215">2r</text><text class="diagram-equation" x="210" y="65" text-anchor="middle">point mass: I = mr² ⇒ at 2r, I′ = 4I</text>`;
    } else if (variant === "door") {
      body += `<rect class="door" x="105" y="75" width="210" height="135"/><circle class="hinge" cx="112" cy="100" r="6"/><circle class="hinge" cx="112" cy="185" r="6"/>`+arrow(a,290,145,360,145,"v-arrow primary","F",345,130)+`<line class="measure dashed" x1="112" y1="230" x2="290" y2="230"/><text x="195" y="254">lever arm r⊥</text><text class="diagram-equation" x="210" y="45" text-anchor="middle">τ = r⊥F · farther from hinge → larger torque</text>`;
    } else {
      body += `<line class="lever-bar" x1="55" y1="145" x2="365" y2="145"/><polygon class="pivot" points="195,225 210,145 225,225"/>`+arrow(a,92,145,92,220,"v-arrow primary","F₁",102,210)+arrow(b,335,145,335,195,"v-arrow secondary","F₂",345,190)+`<line class="measure dashed" x1="92" y1="115" x2="210" y2="115"/><line class="measure dashed" x1="210" y1="105" x2="335" y2="105"/><text x="140" y="98">r₁</text><text x="270" y="90">r₂</text><text class="diagram-equation" x="210" y="45" text-anchor="middle">equilibrium: Στ=0 ⇒ r₁F₁ = r₂F₂</text>`;
    }
    return frame(svg(body), cfg, compact);
  }

  function fluids(cfg, compact) {
    const variant=cfg.variant||"continuity"; const a=uid("fA"), b=uid("fB");
    let body=`<defs>${marker(a)}${marker(b,"marker-secondary")}</defs>`;
    if (variant === "hydrostatic") {
      body += `<path class="tank" d="M90 50 L90 235 L330 235 L330 50"/><rect class="water" x="94" y="85" width="232" height="146"/><line class="surface" x1="94" y1="85" x2="326" y2="85"/><circle class="probe" cx="210" cy="180" r="7"/><line class="depth dashed" x1="350" y1="85" x2="350" y2="180"/><text x="360" y="138">h</text>`+arrow(a,210,180,285,180,"v-arrow primary","P",275,165)+`<text class="diagram-equation" x="210" y="35" text-anchor="middle">P = P₀ + ρgh · same liquid + same depth ⇒ same pressure</text>`;
    } else if (variant === "torricelli") {
      body += `<path class="tank" d="M85 45 L85 235 L280 235 L280 45"/><rect class="water" x="89" y="75" width="187" height="156"/><line class="surface" x1="89" y1="75" x2="276" y2="75"/><circle class="orifice" cx="280" cy="195" r="7"/><path class="jet" d="M287 195 Q345 205 382 235" fill="none"/><line class="depth dashed" x1="310" y1="75" x2="310" y2="195"/><text x="320" y="140">h</text>`+arrow(a,287,195,355,200,"v-arrow primary","v",345,184)+`<text class="diagram-equation" x="210" y="35" text-anchor="middle">Torricelli: v = √(2gh) ⇒ h→4h gives v→2v</text>`;
    } else if (variant === "hydraulic") {
      body += `<path class="fluid-pipe" d="M75 62 L75 220 L345 220 L345 62" fill="none"/><rect class="fluid-fill" x="79" y="145" width="262" height="70"/><rect class="piston" x="48" y="78" width="55" height="18"/><rect class="piston" x="292" y="66" width="100" height="18"/><text x="50" y="55">A₁</text><text x="316" y="45">A₂=5A₁</text>`+arrow(a,75,100,75,145,"v-arrow primary","x₁",83,135)+arrow(b,342,145,342,112,"v-arrow secondary","x₂",350,126)+`<text class="diagram-equation" x="210" y="260" text-anchor="middle">incompressible: A₁x₁=A₂x₂ ⇒ x₂=x₁/5</text>`;
    } else if (variant === "ice") {
      body += `<path class="glass" d="M105 45 L125 235 L295 235 L315 45"/><rect class="water" x="124" y="130" width="172" height="101"/><line class="surface" x1="115" y1="130" x2="305" y2="130"/><rect class="ice" x="170" y="92" width="82" height="70" transform="rotate(-6 211 127)"/>`;
      body += arrow(a,210,150,210,92,"v-arrow primary","Fᴮ",218,104)+arrow(b,210,115,210,180,"v-arrow secondary","mg",218,173)+`<text class="diagram-equation" x="210" y="35" text-anchor="middle">floating: Fᴮ=mg ⇒ displaced water mass = ice mass</text><text class="caption-text" x="210" y="260" text-anchor="middle">after melting, that same mass becomes water → level unchanged</text>`;
    } else if (variant === "two-tanks") {
      body += `<path class="tank" d="M40 70 L40 225 L175 225 L175 70"/><path class="tank" d="M245 70 Q285 115 260 225 L380 225 Q355 115 395 70"/><rect class="water" x="44" y="95" width="127" height="126"/><path class="water" d="M255 95 Q285 125 270 221 L370 221 Q355 125 385 95 Z"/><circle class="orifice" cx="175" cy="190" r="6"/><circle class="orifice" cx="370" cy="190" r="6"/><line class="depth dashed" x1="205" y1="95" x2="205" y2="190"/><text x="213" y="150">h</text>`+arrow(a,181,190,225,195,"v-arrow primary","v₁",205,178)+arrow(b,376,190,414,195,"v-arrow secondary","v₂",382,178)+`<text class="diagram-equation" x="210" y="35" text-anchor="middle">same h, same fluid ⇒ v₁=v₂=√(2gh), independent of tank shape</text>`;
    } else {
      body += `<path class="pipe-outline" d="M28 82 L145 82 L185 110 L392 110 L392 180 L185 180 L145 208 L28 208 Z"/><text x="70" y="65">A₁</text><text x="270" y="95">A₂</text>`+arrow(a,68,145,132,145,"v-arrow primary","v₁",92,130)+arrow(b,235,145,350,145,"v-arrow secondary","v₂",290,130)+`<text class="diagram-equation" x="210" y="245" text-anchor="middle">continuity: A₁v₁=A₂v₂ · smaller area → larger speed</text>`;
    }
    return frame(svg(body), cfg, compact);
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
    },
    supportedVariants: {
      "vector-components":["components","two-vectors","triangle-345","drag","scaling"],
      "kinematics-graph":["graph","velocity-cross","track","river","projectile","parabola","out-back"],
      "dynamics-incline":["incline","sliding-up","connected","atwood","static-limit","push-down"],
      "energy-track":["track","two-paths","circular-work","spring","loop","power","braking"],
      "momentum-collision":["collision","stick","impulse","embed","explosion","center-mass"],
      "orbit":["uniform-circle","vertical-circle","banked","bottom-loop","kepler","escape"],
      "lever":["balance","door","seesaw","skater","rolling","inertia"],
      "fluids":["continuity","hydrostatic","torricelli","hydraulic","ice","two-tanks"]
    }
  };
})();