(() => {
  const base = window.PhysicsOlympiadWorkshopVisuals;
  if (!base?.renderQuestion) return;
  const original = base.renderQuestion.bind(base);
  let seq = 0;
  const uid = (p = "fs9") => `${p}-${++seq}`;
  const esc = (v) => String(v ?? "").replace(/[&<>\"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
  const n = (v) => Number(v.toFixed(2));

  // Senior visual grammar: geometry first, given data second, physical emphasis last.
  // Motion is illustrative only; unknown numerical answers are never encoded by distance or speed.
  const defs = (id) => `<defs>
    <marker id="${id}-blue" markerWidth="10" markerHeight="10" refX="8.5" refY="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" class="fs9-fill-blue"/></marker>
    <marker id="${id}-gold" markerWidth="10" markerHeight="10" refX="8.5" refY="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" class="fs9-fill-gold"/></marker>
    <marker id="${id}-red" markerWidth="10" markerHeight="10" refX="8.5" refY="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" class="fs9-fill-red"/></marker>
    <marker id="${id}-ink" markerWidth="10" markerHeight="10" refX="8.5" refY="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" class="fs9-fill-ink"/></marker>
  </defs>`;
  const title = (t, s = "") => `<text class="fs9-title fs9-fade fs9-d1" x="450" y="34" text-anchor="middle">${esc(t)}</text>${s ? `<text class="fs9-subtitle fs9-fade fs9-d2" x="450" y="58" text-anchor="middle">${esc(s)}</text>` : ""}`;
  const arrow = (id, x1, y1, x2, y2, label, cls = "blue", tx = x2 + 10, ty = y2 - 8, extra = "") => `<line class="fs9-arrow fs9-draw ${cls} ${extra}" x1="${n(x1)}" y1="${n(y1)}" x2="${n(x2)}" y2="${n(y2)}" marker-end="url(#${id}-${cls})"/><text class="fs9-label fs9-fade fs9-d3" x="${n(tx)}" y="${n(ty)}">${esc(label)}</text>`;
  const measure = (x1,y1,x2,y2,label,tx=(x1+x2)/2,ty=(y1+y2)/2-8, anchor="middle") => `<line class="fs9-measure fs9-draw fs9-d2" x1="${n(x1)}" y1="${n(y1)}" x2="${n(x2)}" y2="${n(y2)}"/><text class="fs9-small fs9-fade fs9-d3" x="${n(tx)}" y="${n(ty)}" text-anchor="${anchor}">${esc(label)}</text>`;
  const divider = (x) => `<line class="fs9-divider fs9-draw fs9-d2" x1="${x}" y1="88" x2="${x}" y2="386"/>`;
  const frame = (body, label, note = "Esquema físico · proporciones conocidas respetadas; incógnitas no codificadas a escala") => `<figure class="workshop-figure fs9-figure" role="img" aria-label="${esc(label)}"><div class="workshop-figure-stage fs9-stage"><svg class="workshop-svg fs9-svg" viewBox="0 0 900 440" aria-hidden="true">${body}</svg></div><figcaption>${esc(note)}</figcaption></figure>`;

  function fs01() {
    const id=uid(); let b=defs(id)+title("Péndulo simple","Aproximación de ángulo pequeño");
    const px=450, py=96, L=220, ang=10*Math.PI/180;
    const bx=px+L*Math.sin(ang), by=py+L*Math.cos(ang);
    b += `<line class="fs9-roof fs9-draw fs9-d1" x1="300" y1="92" x2="600" y2="92"/><circle class="fs9-pivot fs9-fade fs9-d2" cx="${px}" cy="${py}" r="7"/><line class="fs9-guide fs9-draw fs9-d2" x1="${px}" y1="${py+8}" x2="${px}" y2="340"/>`;
    b += `<g class="fs9-pendulum-motion"><g transform="rotate(10 ${px} ${py})"><line class="fs9-string fs9-draw fs9-d2" x1="${px}" y1="${py+8}" x2="${px}" y2="${py+L}"/><circle class="fs9-body fs9-fade fs9-d3" cx="${px}" cy="${py+L}" r="24"/></g></g>`;
    b += `<path class="fs9-angle fs9-draw fs9-d3" d="M450 166 A70 70 0 0 1 ${n(px+70*Math.sin(ang))} ${n(py+70*Math.cos(ang))}"/><text class="fs9-small fs9-fade fs9-d3" x="474" y="163">θ≈10°</text>`;
    b += `<line class="fs9-measure fs9-draw fs9-d2" x1="${n(px+12)}" y1="${n(py+8)}" x2="${n(bx+12)}" y2="${n(by)}"/><text class="fs9-label fs9-fade fs9-d3" x="${n((px+bx)/2+22)}" y="${n((py+by)/2)}">L</text>`;
    b += arrow(id,690,115,690,220,"g","red",706,205,"fs9-gravity-pulse");
    return frame(b,"Péndulo simple con longitud L y gravedad g","El ángulo dibujado es pequeño; la oscilación es ilustrativa y conserva el pivote real");
  }

  function fs02(){
    const id=uid();let b=defs(id)+title("Avión + viento","200 km/h norte + 150 km/h este");
    const ox=250,oy=350, sy=240, sx=180;
    b+=`<line class="fs9-axis fs9-draw fs9-d1" x1="150" y1="350" x2="760" y2="350"/><line class="fs9-axis fs9-draw fs9-d1" x1="250" y1="390" x2="250" y2="80"/><text class="fs9-small fs9-fade fs9-d2" x="745" y="374">Este</text><text class="fs9-small fs9-fade fs9-d2" x="215" y="96">Norte</text>`;
    b+=arrow(id,ox,oy,ox,oy-sy,"200 km/h","blue",267,130,"fs9-vector-pulse")+arrow(id,ox,oy,ox+sx,oy,"150 km/h","gold",320,330,"fs9-vector-pulse")+arrow(id,ox,oy,ox+sx,oy-sy,"v suelo","ink",442,117,"fs9-resultant-pulse");
    b+=`<path class="fs9-guide fs9-draw fs9-d3" d="M${ox+sx} ${oy} L${ox+sx} ${oy-sy} L${ox} ${oy-sy}"/><path class="fs9-angle fs9-draw fs9-d4" d="M250 160 A50 50 0 0 1 280 170"/><text class="fs9-small fs9-fade fs9-d4" x="286" y="173">θ</text>`;
    b+=`<g class="fs9-plane fs9-fade fs9-d4" transform="translate(${ox+sx} ${oy-sy}) rotate(-53.13)"><path d="M0 -18 L7 -4 L28 2 L7 7 L0 22 L-4 7 L-24 2 L-4 -4 Z"/></g>`;
    return frame(b,"Suma vectorial de la velocidad del avión y el viento","Las longitudes de 200 y 150 km/h están dibujadas con la misma escala");
  }

  function fs03(){
    const id=uid();let b=defs(id)+title("Persecución con salida retrasada","A: 10 m/s · B: parte 4 s después con a=2 m/s²");
    const x0=130,y0=350, sx=35, sy=1.35;
    const X=t=>x0+sx*t, YA=t=>y0-sy*(10*t), YB=t=>y0-sy*((t-4)*(t-4));
    const tm=5+Math.sqrt(65)+4;
    let d=`M${n(X(4))} ${n(YB(4))}`; for(let t=5;t<=17;t+=1)d+=` L${n(X(t))} ${n(YB(t))}`; d+=` L${n(X(tm))} ${n(YB(tm))}`;
    b+=`<line class="fs9-axis fs9-draw fs9-d1" x1="110" y1="350" x2="800" y2="350"/><line class="fs9-axis fs9-draw fs9-d1" x1="110" y1="370" x2="110" y2="82"/><text class="fs9-small fs9-fade fs9-d2" x="785" y="378">t (s)</text><text class="fs9-small fs9-fade fs9-d2" x="78" y="98">x (m)</text>`;
    b+=`<line class="fs9-line blue fs9-draw fs9-d2" x1="${X(0)}" y1="${YA(0)}" x2="${X(18)}" y2="${YA(18)}"/><path class="fs9-line gold fs9-draw fs9-d3" d="${d}"/><line class="fs9-guide fs9-draw fs9-d2" x1="${X(4)}" y1="350" x2="${X(4)}" y2="325"/><text class="fs9-small fs9-fade fs9-d3" x="${X(4)}" y="380" text-anchor="middle">4 s</text><circle class="fs9-event fs9-pulse fs9-d4" cx="${n(X(tm))}" cy="${n(YA(tm))}" r="9"/>`;
    b+=`<text class="fs9-label fs9-fade fs9-d3" x="520" y="185">A</text><text class="fs9-label fs9-fade fs9-d4" x="465" y="300">B</text>`;
    return frame(b,"Gráfica posición-tiempo coherente con el retraso y las ecuaciones del problema","Las curvas usan una escala temporal y espacial común; el encuentro corresponde a la intersección real");
  }

  function fs04(){
    const id=uid();let b=defs(id)+title("Lanzamiento horizontal","h=15 m · vₓ=10 m/s · g=10 m/s²");
    const sx=270,sy=130, drop=225, range=260, ex=sx+range, ey=sy+drop;
    b+=`<rect class="fs9-platform fs9-fade fs9-d1" x="115" y="130" width="155" height="225"/><line class="fs9-ground fs9-draw fs9-d1" x1="80" y1="355" x2="820" y2="355"/><path class="fs9-trajectory fs9-draw fs9-d2" d="M${sx} ${sy} Q${sx+range/2} ${sy} ${ex} ${ey}"/>`;
    b+=`<g class="fs9-projectile-motion"><circle class="fs9-body" cx="${sx}" cy="${sy}" r="12"/></g>`+arrow(id,sx,sy,sx+120,sy,"10 m/s","blue",305,112,"fs9-vector-pulse")+arrow(id,675,205,675,305,"g","red",690,294,"fs9-gravity-pulse");
    b+=measure(770,130,770,355,"15 m",803,248)+measure(sx,385,ex,385,"alcance",400,410);
    return frame(b,"Lanzamiento horizontal desde quince metros con trayectoria parabólica","La trayectoria y el movimiento animado respetan h=15 m, vₓ=10 m/s y g=10 m/s² con una misma escala espacial");
  }

  function fs05(){
    const id=uid();let b=defs(id)+title("Bloque halado con fricción","F=30 N a 37° · μₖ=0,20");
    const cx=420,cy=285, L=180, th=37*Math.PI/180, fx=cx+L*Math.cos(th), fy=cy-L*Math.sin(th);
    b+=`<line class="fs9-ground fs9-draw fs9-d1" x1="90" y1="340" x2="810" y2="340"/><rect class="fs9-block fs9-fade fs9-d2" x="345" y="230" width="150" height="110" rx="8"/><circle class="fs9-point fs9-fade fs9-d2" cx="${cx}" cy="${cy}" r="6"/>`;
    b+=arrow(id,cx,cy,fx,fy,"30 N","gold",fx+8,fy-3,"fs9-force-pulse")+arrow(id,cx,cy,cx,150,"N","blue",438,170)+arrow(id,cx,cy,cx,410,"mg","red",438,398)+arrow(id,cx,cy,295,cy,"fₖ","ink",268,270);
    b+=`<path class="fs9-angle fs9-draw fs9-d3" d="M485 285 A65 65 0 0 0 ${n(cx+65*Math.cos(th))} ${n(cy-65*Math.sin(th))}"/><text class="fs9-small fs9-fade fs9-d3" x="491" y="253">37°</text><line class="fs9-guide fs9-draw fs9-d4" x1="${cx}" y1="${cy}" x2="${n(fx)}" y2="${cy}"/><line class="fs9-guide fs9-draw fs9-d4" x1="${n(fx)}" y1="${cy}" x2="${n(fx)}" y2="${n(fy)}"/>`;
    return frame(b,"Diagrama de cuerpo libre para un bloque halado a treinta y siete grados","La fuerza aplicada se dibuja con la razón geométrica cos37°:sin37°; N, mg y fₖ no están escaladas por magnitud");
  }

  function fs06(){
    const id=uid();let b=defs(id)+title("Máquina de Atwood ideal","m₁=2 kg · m₂=6 kg");
    const lx=395,rx=505;
    b+=`<circle class="fs9-pulley fs9-fade fs9-d1" cx="450" cy="120" r="55"/><path class="fs9-rope fs9-draw fs9-d2" d="M${lx} 250 L${lx} 120 C${lx} 47 ${rx} 47 ${rx} 120 L${rx} 220"/>`;
    b+=`<rect class="fs9-block fs9-fade fs9-d2" x="350" y="250" width="90" height="78" rx="6"/><rect class="fs9-block fs9-fade fs9-d2" x="460" y="220" width="90" height="108" rx="6"/><text class="fs9-label fs9-fade fs9-d3" x="395" y="298" text-anchor="middle">2 kg</text><text class="fs9-label fs9-fade fs9-d3" x="505" y="282" text-anchor="middle">6 kg</text>`;
    b+=arrow(id,395,270,395,205,"T","blue",410,215)+arrow(id,395,304,395,390,"W₁","red",410,380)+arrow(id,505,245,505,175,"T","blue",520,186)+arrow(id,505,304,505,400,"W₂","red",520,388);
    b+=arrow(id,305,300,305,225,"a","ink",318,240,"fs9-accel-pulse")+arrow(id,595,235,595,310,"a","gold",610,300,"fs9-accel-pulse");
    return frame(b,"Máquina de Atwood con cuerda tangente a la polea y unida a la parte superior de ambas masas","Los bloques permanecen unidos visualmente a la cuerda; la animación enfatiza la dirección de aceleración sin separar los elementos");
  }

  function fs07(){
    const id=uid();let b=defs(id)+title("Energía con fricción en un plano","Recorrido conocido: 5 m a 30°");
    const x0=180,y0=350,x1=180+500*Math.cos(Math.PI/6),y1=350-500*Math.sin(Math.PI/6);
    const s=0.78, cx=x0+(x1-x0)*s, sy=y0+(y1-y0)*s, normal=29.5, bcX=cx-normal*0.5, bcY=sy-normal*Math.cos(Math.PI/6);
    b+=`<polygon class="fs9-ramp fs9-fade fs9-d1" points="${x0},${y0} ${x1},${y0} ${x1},${y1}"/><line class="fs9-surface fs9-draw fs9-d1" x1="${x0}" y1="${y0}" x2="${n(x1)}" y2="${n(y1)}"/>`;
    b+=`<g class="fs9-incline-body"><rect class="fs9-block fs9-fade fs9-d2" x="${n(bcX-45)}" y="${n(bcY-29)}" width="90" height="58" rx="5" transform="rotate(-30 ${n(bcX)} ${n(bcY)})"/></g>`;
    b+=measure(x0+15,y0-18,x1-15,y1-18,"5 m",410,195)+`<path class="fs9-angle fs9-draw fs9-d3" d="M245 350 A65 65 0 0 0 ${n(180+65*Math.cos(Math.PI/6))} ${n(350-65*Math.sin(Math.PI/6))}"/><text class="fs9-small fs9-fade fs9-d3" x="224" y="322">30°</text>`;
    b+=arrow(id,bcX,bcY,bcX-100*Math.cos(Math.PI/6),bcY+100*Math.sin(Math.PI/6),"fₖ","gold",bcX-112,bcY+70,"fs9-force-pulse")+arrow(id,bcX,bcY,bcX,bcY+125,"mg","red",bcX+16,bcY+115);
    return frame(b,"Bloque deslizándose cinco metros por un plano de treinta grados","El plano tiene 30° reales y el segmento rotulado 5 m conserva esa misma geometría");
  }

  function fs08(){
    const id=uid();let b=defs(id)+title("Choque inelástico → resorte","Separar primero momentum y después energía");
    b+=divider(450)+`<text class="fs9-panel-title fs9-fade fs9-d2" x="250" y="92" text-anchor="middle">1 · CHOQUE</text><text class="fs9-panel-title fs9-fade fs9-d2" x="650" y="92" text-anchor="middle">2 · COMPRESIÓN</text>`;
    b+=`<line class="fs9-ground fs9-draw fs9-d1" x1="70" y1="320" x2="425" y2="320"/><rect class="fs9-cart fs9-fade fs9-d2" x="95" y="255" width="105" height="55" rx="6"/><rect class="fs9-cart fs9-fade fs9-d2" x="290" y="255" width="120" height="55" rx="6"/><text class="fs9-small fs9-fade fs9-d3" x="147" y="240" text-anchor="middle">1 kg · 8 m/s</text><text class="fs9-small fs9-fade fs9-d3" x="350" y="240" text-anchor="middle">3 kg</text>`;
    b+=arrow(id,200,282,275,282,"v","blue",225,264,"fs9-vector-pulse")+`<circle class="fs9-collision-cue fs9-pulse fs9-d4" cx="278" cy="282" r="13"/>`;
    b+=`<line class="fs9-ground fs9-draw fs9-d1" x1="475" y1="320" x2="835" y2="320"/><rect class="fs9-cart fs9-fade fs9-d2" x="500" y="255" width="135" height="55" rx="6"/><text class="fs9-small fs9-fade fs9-d3" x="568" y="240" text-anchor="middle">4 kg unidos</text><path class="fs9-spring fs9-draw fs9-d3 fs9-spring-pulse" d="M635 282 l18 -20 l18 40 l18 -40 l18 40 l18 -40 l18 20 H810"/><line class="fs9-wall fs9-draw fs9-d2" x1="810" y1="225" x2="810" y2="330"/>`;
    b+=`<line class="fs9-measure fs9-draw fs9-d4" x1="635" y1="355" x2="720" y2="355"/><text class="fs9-small fs9-fade fs9-d4" x="678" y="380" text-anchor="middle">x máx ?</text>`;
    return frame(b,"Choque inelástico y compresión de resorte mostrados como dos etapas separadas","La animación no desplaza el carro a través del resorte ni codifica la compresión desconocida");
  }

  function fs09(){
    const id=uid();let b=defs(id)+title("Impulso = área bajo F(t)","Triángulo: base 0,40 s · altura 100 N");
    const x0=185,x1=745,xp=(x0+x1)/2,yb=350,yp=115;
    b+=`<line class="fs9-axis fs9-draw fs9-d1" x1="130" y1="350" x2="790" y2="350"/><line class="fs9-axis fs9-draw fs9-d1" x1="130" y1="350" x2="130" y2="90"/><path class="fs9-area fs9-fade fs9-d2" d="M${x0} ${yb} L${xp} ${yp} L${x1} ${yb} Z"/><path class="fs9-line blue fs9-draw fs9-d2" d="M${x0} ${yb} L${xp} ${yp} L${x1} ${yb}"/>`;
    b+=`<line class="fs9-guide fs9-draw fs9-d3" x1="${xp}" y1="${yp}" x2="130" y2="${yp}"/><text class="fs9-label fs9-fade fs9-d3" x="90" y="120">100 N</text><line class="fs9-guide fs9-draw fs9-d3" x1="${x0}" y1="350" x2="${x0}" y2="365"/><line class="fs9-guide fs9-draw fs9-d3" x1="${x1}" y1="350" x2="${x1}" y2="365"/><text class="fs9-small fs9-fade fs9-d3" x="${x0}" y="384" text-anchor="middle">0</text><text class="fs9-small fs9-fade fs9-d3" x="${x1}" y="384" text-anchor="middle">0,40 s</text><text class="fs9-small fs9-fade fs9-d4" x="465" y="266" text-anchor="middle">Área = impulso</text>`;
    return frame(b,"Gráfica fuerza-tiempo triangular de base cero coma cuarenta segundos y altura cien newtons");
  }

  function fs10(){
    const id=uid();let b=defs(id)+title("Loop vertical: contacto mínimo","La incógnita h no se dibuja como múltiplo de R");
    b+=divider(420)+`<text class="fs9-panel-title fs9-fade fs9-d2" x="235" y="92" text-anchor="middle">ALTURA INICIAL</text><text class="fs9-panel-title fs9-fade fs9-d2" x="650" y="92" text-anchor="middle">CIMA DEL LOOP</text>`;
    b+=`<path class="fs9-track fs9-draw fs9-d1" d="M100 130 Q220 130 330 340 H390"/><circle class="fs9-body fs9-fade fs9-d2" cx="120" cy="130" r="12"/>`+measure(75,130,75,340,"h ?",52,238);
    b+=`<circle class="fs9-loop fs9-draw fs9-d2" cx="650" cy="250" r="95"/><circle class="fs9-body-gold fs9-pulse fs9-d4" cx="650" cy="155" r="11"/>`+measure(650,250,650,155,"R",675,205);
    b+=`<text class="fs9-small fs9-fade fs9-d4" x="704" y="168">contacto crítico</text>`;
    return frame(b,"Separación conceptual entre la altura inicial desconocida y la condición crítica en la cima del loop","h y R se muestran en paneles separados para que la figura no revele la razón h/R");
  }

  function fs11(){
    const id=uid();let b=defs(id)+title("Escalamiento orbital","Radio externo = 9 × radio interno");
    const cx=450,cy=240,r1=18.5,r2=166.5;
    b+=`<circle class="fs9-planet fs9-fade fs9-d1" cx="${cx}" cy="${cy}" r="8"/><circle class="fs9-orbit-line fs9-draw fs9-d2" cx="${cx}" cy="${cy}" r="${r1}"/><circle class="fs9-orbit-line fs9-draw fs9-d3" cx="${cx}" cy="${cy}" r="${r2}"/>`;
    b+=`<circle class="fs9-satellite fs9-satellite-pulse" cx="${cx+r1}" cy="${cy}" r="8"/><circle class="fs9-satellite fs9-satellite-pulse fs9-d4" cx="${cx+r2}" cy="${cy}" r="9"/>`;
    b+=measure(cx,cy,cx+r1,cy,"r",462,218)+measure(cx,cy,cx+r2,cy,"9r",535,266)+`<text class="fs9-small fs9-fade fs9-d4" x="450" y="245" text-anchor="middle">M</text><text class="fs9-small fs9-fade fs9-d4" x="604" y="215">v₂ ?, T₂ ?</text>`;
    return frame(b,"Dos órbitas circulares con radios r y nueve r en escala geométrica común","La razón de radios conocida se dibuja 1:9; la animación no codifica v₂ ni T₂");
  }

  function fs12(){
    const id=uid();let b=defs(id)+title("Equilibrio de una viga","L=4 m · carga a 3 m · cable a 30°");
    const xL=150,xR=750,y=275, x3=xL+(xR-xL)*0.75, xmid=(xL+xR)/2, dx=150, anchorX=xR-dx, anchorY=y-dx*Math.tan(Math.PI/6);
    b+=`<line class="fs9-wall fs9-draw fs9-d1" x1="${xL}" y1="145" x2="${xL}" y2="355"/><line class="fs9-beam fs9-draw fs9-d1" x1="${xL}" y1="${y}" x2="${xR}" y2="${y}"/><circle class="fs9-hinge fs9-fade fs9-d2" cx="${xL}" cy="${y}" r="13"/><path class="fs9-cable fs9-draw fs9-d2" d="M${xR} ${y} L${n(anchorX)} ${n(anchorY)}"/>`;
    b+=arrow(id,xmid,y,xmid,385,"200 N","red",xmid+16,374)+arrow(id,x3,y,x3,397,"300 N","red",x3+16,386)+arrow(id,xR,y,xR-90,y-90*Math.tan(Math.PI/6),"T","blue",640,214,"fs9-force-pulse");
    b+=measure(xL,318,x3,318,"3 m",375,340)+measure(xL,356,xR,356,"4 m",450,380)+`<path class="fs9-angle fs9-draw fs9-d3" d="M680 275 A70 70 0 0 1 ${n(xR-70*Math.cos(Math.PI/6))} ${n(y-70*Math.sin(Math.PI/6))}"/><text class="fs9-small fs9-fade fs9-d4" x="700" y="245">30°</text>`;
    return frame(b,"Viga horizontal de cuatro metros con carga a tres metros y cable de treinta grados","Las posiciones 2 m, 3 m y 4 m comparten una misma escala longitudinal; el cable está a 30° reales");
  }

  function fs13(){
    const id=uid();let b=defs(id)+title("Rodadura sin deslizamiento","Misma M y R · misma inclinación · distinto I");
    b+=divider(450)+`<text class="fs9-panel-title fs9-fade fs9-d2" x="245" y="92" text-anchor="middle">DISCO SÓLIDO</text><text class="fs9-panel-title fs9-fade fs9-d2" x="655" y="92" text-anchor="middle">ARO DELGADO</text>`;
    const th=20*Math.PI/180, r=32;
    const panel=(x0,x1)=>{const y0=345,y1=y0-(x1-x0)*Math.tan(th), contactX=x1-60, surfaceY=y0-(contactX-x0)*Math.tan(th), cx=contactX-r*Math.sin(th), cy=surfaceY-r*Math.cos(th); return {x0,x1,y0,y1,cx,cy};};
    const p1=panel(85,405), p2=panel(495,815);
    for(const p of [p1,p2]) b+=`<polygon class="fs9-ramp fs9-fade fs9-d1" points="${p.x0},${p.y0} ${p.x1},${p.y0} ${p.x1},${n(p.y1)}"/><line class="fs9-surface fs9-draw fs9-d1" x1="${p.x0}" y1="${p.y0}" x2="${p.x1}" y2="${n(p.y1)}"/>`;
    b+=`<g class="fs9-wheel-pulse"><circle class="fs9-disk" cx="${n(p1.cx)}" cy="${n(p1.cy)}" r="${r}"/><line class="fs9-spoke" x1="${n(p1.cx)}" y1="${n(p1.cy)}" x2="${n(p1.cx+26)}" y2="${n(p1.cy-12)}"/></g><g class="fs9-wheel-pulse fs9-d4"><circle class="fs9-hoop" cx="${n(p2.cx)}" cy="${n(p2.cy)}" r="${r}"/><line class="fs9-spoke" x1="${n(p2.cx)}" y1="${n(p2.cy)}" x2="${n(p2.cx+26)}" y2="${n(p2.cy-12)}"/></g>`;
    b+=`<text class="fs9-small fs9-fade fs9-d3" x="245" y="380" text-anchor="middle">misma altura de salida</text><text class="fs9-small fs9-fade fs9-d3" x="655" y="380" text-anchor="middle">misma altura de salida</text>`;
    return frame(b,"Disco y aro sobre dos planos idénticos con contacto geométrico correcto","La animación no muestra cuál llega primero; ambos cuerpos se presentan sin codificar la respuesta");
  }

  function fs14(){
    const id=uid();let b=defs(id)+title("Objeto totalmente sumergido","Equilibrio: empuje, peso y fuerza externa");
    b+=`<rect class="fs9-tank fs9-fade fs9-d1" x="205" y="95" width="490" height="280"/><rect class="fs9-water fs9-fade fs9-d2" x="210" y="145" width="480" height="225"/><line class="fs9-waterline fs9-draw fs9-d2" x1="210" y1="145" x2="690" y2="145"/><rect class="fs9-block fs9-fade fs9-d3" x="385" y="220" width="130" height="90" rx="8"/>`;
    b+=arrow(id,450,265,450,165,"E","blue",468,183,"fs9-force-pulse")+arrow(id,450,265,450,365,"mg","red",468,352,"fs9-force-pulse")+`<circle class="fs9-question fs9-pulse fs9-d4" cx="590" cy="260" r="19"/><text class="fs9-label fs9-fade fs9-d4" x="590" y="266" text-anchor="middle">?</text><text class="fs9-small fs9-fade fs9-d4" x="620" y="264">F externa</text>`;
    return frame(b,"Objeto completamente sumergido y en reposo con dirección de fuerza externa desconocida","El cuerpo permanece estático; E y mg usan longitudes gráficas iguales para no revelar la fuerza externa");
  }

  function fs15(){
    const id=uid();let b=defs(id)+title("Continuidad + Bernoulli","A₁=2A₂ · v₁=3 m/s");
    const cy=240, wide=140, narrow=99;
    b+=`<path class="fs9-pipe fs9-fade fs9-d1" d="M90 ${cy-wide/2} H330 L405 ${cy-narrow/2} H505 L580 ${cy-wide/2} H810 V${cy+wide/2} H580 L505 ${cy+narrow/2} H405 L330 ${cy+wide/2} H90 Z"/><line class="fs9-flow fs9-draw fs9-d2" x1="130" y1="${cy}" x2="760" y2="${cy}"/>`;
    b+=arrow(id,175,cy,255,cy,"v₁=3","blue",182,219)+arrow(id,425,cy,525,cy,"v₂ ?","gold",455,219,"fs9-vector-pulse")+`<text class="fs9-label fs9-fade fs9-d3" x="205" y="145">A₁</text><text class="fs9-label fs9-fade fs9-d3" x="445" y="178">A₂</text><text class="fs9-small fs9-fade fs9-d4" x="170" y="337">P₁</text><text class="fs9-small fs9-fade fs9-d4" x="455" y="310">P₂</text><text class="fs9-small fs9-fade fs9-d4" x="650" y="335">diámetro₁/diámetro₂≈√2</text>`;
    return frame(b,"Tubería circular horizontal cuya razón de áreas es dos a uno","La razón de diámetros se dibuja ≈√2, coherente con A₁=2A₂; la magnitud desconocida de v₂ no se codifica por longitud de flecha");
  }

  function fs16(){
    const id=uid();let b=defs(id)+title("Choque + proyectil","Etapa 1: momentum · Etapa 2: vuelo");
    b+=divider(450)+`<text class="fs9-panel-title fs9-fade fs9-d2" x="245" y="92" text-anchor="middle">CHOQUE EN EL BORDE</text><text class="fs9-panel-title fs9-fade fs9-d2" x="655" y="92" text-anchor="middle">VUELO POSTERIOR</text>`;
    b+=`<rect class="fs9-table fs9-fade fs9-d1" x="250" y="165" width="170" height="165"/><rect class="fs9-cart fs9-fade fs9-d2" x="340" y="110" width="80" height="55" rx="5"/><text class="fs9-small fs9-fade fs9-d3" x="380" y="102" text-anchor="middle">3m</text><circle class="fs9-bullet fs9-fade fs9-d2 fs9-bullet-collision" cx="105" cy="137" r="9"/><text class="fs9-small fs9-fade fs9-d3" x="105" y="112" text-anchor="middle">m</text>`+arrow(id,120,137,235,137,"12 m/s","blue",155,118,"fs9-vector-pulse");
    const sx=560,sy=137,drop=220,range=135,ex=sx+range,ey=sy+drop;
    b+=`<rect class="fs9-table fs9-fade fs9-d1" x="485" y="165" width="75" height="165"/><line class="fs9-ground fs9-draw fs9-d1" x1="475" y1="385" x2="820" y2="385"/><g class="fs9-projectile-block-motion"><rect class="fs9-cart" x="530" y="110" width="60" height="55" rx="5"/><circle class="fs9-bullet" cx="538" cy="137" r="6"/></g><path class="fs9-trajectory fs9-draw fs9-d3" d="M${sx} ${sy} Q${sx+range/2} ${sy} ${ex} ${ey}"/>`+measure(790,165,790,385,"5 m",820,275)+measure(sx,405,ex,405,"x ?",628,430);
    return frame(b,"Choque de m con 3m seguido por un vuelo horizontal desde cinco metros","La altura conocida se conserva; el alcance x permanece simbólico y la animación solo comunica la forma parabólica");
  }

  function fs17(){
    const id=uid();let b=defs(id)+title("Frenado con fricción máxima","v₀=30 m/s · μ=0,50");
    b+=`<line class="fs9-road fs9-draw fs9-d1" x1="80" y1="315" x2="820" y2="315"/><g><rect class="fs9-car" x="130" y="248" width="160" height="42" rx="12"/><circle class="fs9-wheel" cx="165" cy="298" r="17"/><circle class="fs9-wheel" cx="255" cy="298" r="17"/></g>`;
    b+=arrow(id,285,267,415,267,"30 m/s","blue",325,247,"fs9-vector-pulse")+arrow(id,210,282,100,282,"f máx","red",78,267,"fs9-force-pulse")+`<path class="fs9-skid fs9-draw fs9-d3" d="M145 323 C260 319 380 330 500 323 S700 329 805 323"/>`+measure(300,360,805,360,"d mínima ?",552,385)+`<text class="fs9-small fs9-fade fs9-d4" x="180" y="350">μ=0,50</text>`;
    return frame(b,"Automóvil correctamente apoyado sobre una vía horizontal durante frenado","El automóvil no se desplaza una distancia gráfica ligada a la respuesta; la animación enfatiza fuerzas y huella de frenado");
  }

  function fs18(){
    const id=uid();let b=defs(id)+title("Péndulo balístico","m se incrusta en 4m · ascenso vertical 0,80 m");
    const px=560,py=70,R=270, rise=80, theta=Math.acos((R-rise)/R)*180/Math.PI;
    b+=`<line class="fs9-roof fs9-draw fs9-d1" x1="430" y1="70" x2="700" y2="70"/><circle class="fs9-pivot fs9-fade fs9-d2" cx="${px}" cy="${py}" r="7"/><g class="fs9-ballistic-pendulum"><line class="fs9-string" x1="${px}" y1="${py}" x2="${px}" y2="340"/><rect class="fs9-block" x="515" y="310" width="90" height="60" rx="7"/><circle class="fs9-bullet-embedded fs9-embedded-appear" cx="523" cy="340" r="7"/></g>`;
    b+=`<circle class="fs9-bullet fs9-fade fs9-d2 fs9-bullet-into-pendulum" cx="180" cy="340" r="9"/><text class="fs9-small fs9-fade fs9-d3" x="180" y="315" text-anchor="middle">m</text><text class="fs9-small fs9-fade fs9-d3" x="560" y="300" text-anchor="middle">4m</text>`+arrow(id,195,340,350,340,"u ?","blue",245,320,"fs9-vector-pulse");
    b+=`<path class="fs9-swing-arc fs9-draw fs9-d3" d="M560 340 A270 270 0 0 0 ${n(px+R*Math.sin(theta*Math.PI/180))} ${n(py+R*Math.cos(theta*Math.PI/180))}"/>`+measure(815,260,815,340,"0,80 m",842,302)+`<text class="fs9-small fs9-fade fs9-d4" x="690" y="215">ascenso del centro de masa</text>`;
    return frame(b,"Péndulo balístico con choque y ascenso del conjunto de masa cinco m","La rotación se realiza alrededor del pivote real y el ascenso animado del centro de masa es exactamente 0,80 m en la escala del dibujo");
  }

  function fs19(){
    const id=uid();let b=defs(id)+title("Energía: altura → fricción → resorte","h=2,0 m · tramo rugoso=4,0 m");
    const scale=60, ground=300, startY=ground-2*scale, roughX=420, roughLen=4*scale, springX=roughX+roughLen;
    b+=`<path class="fs9-track fs9-draw fs9-d1" d="M100 ${startY} Q210 ${startY} 300 ${ground} H${roughX}"/><line class="fs9-rough fs9-draw fs9-d2 fs9-rough-pulse" x1="${roughX}" y1="${ground}" x2="${springX}" y2="${ground}"/><path class="fs9-spring fs9-draw fs9-d3 fs9-spring-late" d="M${springX} ${ground} l16 -18 l16 36 l16 -36 l16 36 l16 -36 l16 18 H820"/><line class="fs9-wall fs9-draw fs9-d2" x1="820" y1="245" x2="820" y2="330"/><circle class="fs9-body fs9-fade fs9-d2 fs9-energy-body-safe" cx="110" cy="${startY}" r="12"/>`;
    b+=measure(65,startY,65,ground,"2,0 m",38,244)+measure(roughX,345,springX,345,"4,0 m",540,370)+`<text class="fs9-small fs9-fade fs9-d4" x="540" y="282" text-anchor="middle">μₖ=0,25</text><text class="fs9-small fs9-fade fs9-d4" x="735" y="255" text-anchor="middle">k=100 N/m</text><text class="fs9-small fs9-fade fs9-d4" x="742" y="322">x máx ?</text>`;
    return frame(b,"Bloque que baja dos metros, cruza cuatro metros rugosos y llega a un resorte","2 m y 4 m usan la misma escala lineal; la animación se detiene antes de comprimir el resorte para no revelar x máx");
  }

  function fs20(){
    const id=uid();let b=defs(id)+title("Loop: energía + ecuación radial","Altura inicial conocida: 3R");
    const R=80,cx=600,cy=260,bottom=cy+R,top=cy-R,startY=bottom-3*R;
    b+=`<path class="fs9-track fs9-draw fs9-d1" d="M100 ${startY} Q220 ${startY} 330 ${bottom} H${cx}"/><circle class="fs9-loop fs9-draw fs9-d2" cx="${cx}" cy="${cy}" r="${R}"/><line class="fs9-track fs9-draw fs9-d2" x1="${cx}" y1="${bottom}" x2="780" y2="${bottom}"/><circle class="fs9-body fs9-fade fs9-d2" cx="120" cy="${startY}" r="12"/><circle class="fs9-body-gold fs9-pulse fs9-d4" cx="${cx}" cy="${top}" r="11"/>`;
    b+=measure(65,startY,65,bottom,"3R",42,225)+measure(cx,cy,cx,top,"R",625,222)+arrow(id,cx-12,top,cx-12,top+75,"mg","red",cx-60,top+68,"fs9-force-pulse")+arrow(id,cx+12,top,cx+12,top+55,"N ?","blue",cx+30,top+50,"fs9-force-pulse");
    return frame(b,"Bloque que parte desde tres radios sobre el fondo y fuerzas en la cima del loop","3R y R comparten escala exacta; la longitud de N es convencional para no codificar su magnitud");
  }

  const renderers = {"fs-01":fs01,"fs-02":fs02,"fs-03":fs03,"fs-04":fs04,"fs-05":fs05,"fs-06":fs06,"fs-07":fs07,"fs-08":fs08,"fs-09":fs09,"fs-10":fs10,"fs-11":fs11,"fs-12":fs12,"fs-13":fs13,"fs-14":fs14,"fs-15":fs15,"fs-16":fs16,"fs-17":fs17,"fs-18":fs18,"fs-19":fs19,"fs-20":fs20};

  window.PhysicsOlympiadWorkshopVisuals = Object.freeze({
    renderQuestion(question) {
      const fn = renderers[question?.id];
      return fn ? fn() : original(question);
    }
  });

  let queued = false;
  const markVisible = () => {
    queued = false;
    document.querySelectorAll(".fs9-figure:not([data-fs9-observed])").forEach((figure) => {
      figure.dataset.fs9Observed = "1";
      if (!("IntersectionObserver" in window)) { figure.classList.add("is-visible"); return; }
      const io = new IntersectionObserver((entries, observer) => {
        for (const entry of entries) if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); }
      }, { threshold: 0.28, rootMargin: "0px 0px -8% 0px" });
      io.observe(figure);
    });
  };
  const queue = () => { if (queued) return; queued = true; requestAnimationFrame(markVisible); };
  const root = document.getElementById("workshopContent");
  if (root) new MutationObserver(queue).observe(root,{childList:true});
  window.addEventListener("hashchange",queue);
  queue();
})();
