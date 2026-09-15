(() => {
  const base = window.PhysicsOlympiadWorkshopVisuals;
  if (!base?.renderQuestion) return;
  const original = base.renderQuestion.bind(base);
  let seq = 0;
  const uid = (p = "fs9") => `${p}-${++seq}`;
  const esc = (v) => String(v ?? "").replace(/[&<>\"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));

  // Visual language adapted from Statistics 11 Manim: staged Create/FadeIn/Indicate
  // becomes SVG line-draw + delayed fade + focus pulse. Motion starts only in viewport.
  const defs = (id) => `<defs>
    <marker id="${id}-blue" markerWidth="10" markerHeight="10" refX="8.5" refY="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" class="fs9-fill-blue"/></marker>
    <marker id="${id}-gold" markerWidth="10" markerHeight="10" refX="8.5" refY="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" class="fs9-fill-gold"/></marker>
    <marker id="${id}-red" markerWidth="10" markerHeight="10" refX="8.5" refY="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" class="fs9-fill-red"/></marker>
    <marker id="${id}-ink" markerWidth="10" markerHeight="10" refX="8.5" refY="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" class="fs9-fill-ink"/></marker>
  </defs>`;
  const title = (t, s = "") => `<text class="fs9-title fs9-fade fs9-d1" x="450" y="34" text-anchor="middle">${esc(t)}</text>${s ? `<text class="fs9-subtitle fs9-fade fs9-d2" x="450" y="58" text-anchor="middle">${esc(s)}</text>` : ""}`;
  const arrow = (id, x1, y1, x2, y2, label, cls = "blue", tx = x2 + 10, ty = y2 - 8, extra = "") => `<line class="fs9-arrow fs9-draw ${cls} ${extra}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" marker-end="url(#${id}-${cls})"/><text class="fs9-label fs9-fade fs9-d3" x="${tx}" y="${ty}">${esc(label)}</text>`;
  const measure = (x1,y1,x2,y2,label,tx=(x1+x2)/2,ty=(y1+y2)/2-8) => `<line class="fs9-measure fs9-draw fs9-d2" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/><text class="fs9-small fs9-fade fs9-d3" x="${tx}" y="${ty}" text-anchor="middle">${esc(label)}</text>`;
  const frame = (body, label, note = "Esquema físico · no necesariamente a escala") => `<figure class="workshop-figure fs9-figure" role="img" aria-label="${esc(label)}"><div class="workshop-figure-stage fs9-stage"><svg class="workshop-svg fs9-svg" viewBox="0 0 900 440" aria-hidden="true">${body}</svg></div><figcaption>${esc(note)}</figcaption></figure>`;

  function fs01() {
    const id=uid(); let b=defs(id)+title("Péndulo simple","El período depende de L y g");
    b += `<line class="fs9-roof fs9-draw fs9-d1" x1="300" y1="95" x2="600" y2="95"/><circle class="fs9-pivot fs9-fade fs9-d2" cx="450" cy="95" r="7"/>`;
    b += `<g class="fs9-pendulum"><line class="fs9-string fs9-draw fs9-d2" x1="450" y1="102" x2="585" y2="320"/><circle class="fs9-body fs9-fade fs9-d3" cx="585" cy="320" r="25"/></g>`;
    b += `<line class="fs9-guide fs9-draw fs9-d2" x1="450" y1="102" x2="450" y2="350"/><path class="fs9-angle fs9-draw fs9-d3" d="M450 175 A80 80 0 0 1 492 162"/><text class="fs9-small fs9-fade fs9-d3" x="500" y="164">θ pequeño</text>`;
    b += measure(470,110,580,292,"L",542,192)+arrow(id,690,115,690,220,"g","red",706,205,"fs9-gravity-pulse");
    return frame(b,"Péndulo simple con longitud L y gravedad g");
  }
  function fs02(){
    const id=uid();let b=defs(id)+title("Avión + viento","Suma vectorial de velocidades perpendiculares");
    b+=`<line class="fs9-axis fs9-draw fs9-d1" x1="180" y1="350" x2="760" y2="350"/><line class="fs9-axis fs9-draw fs9-d1" x1="180" y1="350" x2="180" y2="90"/><text class="fs9-small fs9-fade fs9-d2" x="748" y="372">Este</text><text class="fs9-small fs9-fade fs9-d2" x="145" y="105">Norte</text>`;
    b+=arrow(id,220,330,220,130,"200 km/h","blue",235,150,"fs9-vector-pulse")+arrow(id,220,330,430,330,"150 km/h","gold",300,312,"fs9-vector-pulse")+arrow(id,220,330,430,130,"v suelo","ink",440,132,"fs9-resultant-pulse");
    b+=`<path class="fs9-guide fs9-draw fs9-d3" d="M430 330 L430 130 L220 130"/><g class="fs9-plane fs9-fade fs9-d4" transform="translate(418 142) rotate(-45)"><path d="M0 -18 L7 -4 L28 2 L7 7 L0 22 L-4 7 L-24 2 L-4 -4 Z"/></g>`;
    return frame(b,"Triángulo vectorial de rapidez del avión y viento");
  }
  function fs03(){
    const id=uid();let b=defs(id)+title("Persecución con salida retrasada","Misma posición = mismo evento de encuentro");
    b+=`<line class="fs9-axis fs9-draw fs9-d1" x1="115" y1="360" x2="800" y2="360"/><line class="fs9-axis fs9-draw fs9-d1" x1="115" y1="360" x2="115" y2="90"/><text class="fs9-small fs9-fade fs9-d2" x="785" y="385">t</text><text class="fs9-small fs9-fade fs9-d2" x="90" y="105">x</text>`;
    b+=`<line class="fs9-line blue fs9-draw fs9-d2" x1="130" y1="340" x2="725" y2="120"/><path class="fs9-line gold fs9-draw fs9-d3" d="M250 340 Q430 330 725 120"/><line class="fs9-guide fs9-draw fs9-d2" x1="250" y1="360" x2="250" y2="335"/><text class="fs9-small fs9-fade fs9-d3" x="250" y="390" text-anchor="middle">4 s</text><circle class="fs9-event fs9-pulse fs9-d4" cx="725" cy="120" r="9"/>`;
    b+=`<text class="fs9-label fs9-fade fs9-d3" x="535" y="170">A: rapidez constante</text><text class="fs9-label fs9-fade fs9-d4" x="420" y="300">B: movimiento acelerado</text>`;
    return frame(b,"Gráfica posición-tiempo de una persecución con retraso de cuatro segundos");
  }
  function fs04(){
    const id=uid();let b=defs(id)+title("Lanzamiento horizontal","vx constante · vy cambia por gravedad");
    b+=`<rect class="fs9-platform fs9-fade fs9-d1" x="110" y="115" width="155" height="250"/><line class="fs9-ground fs9-draw fs9-d1" x1="80" y1="365" x2="825" y2="365"/><path class="fs9-trajectory fs9-draw fs9-d2" d="M265 135 Q500 150 735 350"/>`;
    b+=`<g class="fs9-projectile"><circle class="fs9-body" cx="265" cy="135" r="13"/></g>`+arrow(id,265,135,390,135,"10 m/s","blue",302,116,"fs9-vector-pulse")+arrow(id,640,230,640,330,"g","red",654,318,"fs9-gravity-pulse");
    b+=measure(790,135,790,365,"15 m",820,255);
    return frame(b,"Pelota lanzada horizontalmente desde una altura de quince metros");
  }
  function fs05(){
    const id=uid();let b=defs(id)+title("Bloque halado con fricción","La fuerza oblicua modifica la normal");
    b+=`<line class="fs9-ground fs9-draw fs9-d1" x1="90" y1="340" x2="810" y2="340"/><rect class="fs9-block fs9-fade fs9-d2" x="345" y="240" width="150" height="100" rx="8"/><circle class="fs9-point fs9-fade fs9-d2" cx="420" cy="290" r="6"/>`;
    b+=arrow(id,420,290,565,180,"30 N","gold",570,176,"fs9-force-pulse")+arrow(id,420,290,420,145,"N","blue",438,165)+arrow(id,420,290,420,410,"mg","red",438,400)+arrow(id,420,290,285,290,"fₖ","ink",255,275);
    b+=`<path class="fs9-angle fs9-draw fs9-d3" d="M485 290 A65 65 0 0 0 472 250"/><text class="fs9-small fs9-fade fs9-d3" x="492" y="260">37°</text><line class="fs9-guide fs9-draw fs9-d4" x1="420" y1="290" x2="565" y2="290"/><line class="fs9-guide fs9-draw fs9-d4" x1="565" y1="290" x2="565" y2="180"/>`;
    return frame(b,"Diagrama de cuerpo libre de un bloque halado a treinta y siete grados","Direcciones físicas validadas · las longitudes de flecha no representan magnitudes exactas");
  }
  function fs06(){
    const id=uid();let b=defs(id)+title("Máquina de Atwood ideal","Una cuerda · una magnitud de aceleración");
    b+=`<circle class="fs9-pulley fs9-fade fs9-d1" cx="450" cy="125" r="66"/><path class="fs9-rope fs9-draw fs9-d2" d="M384 330 L384 125 C384 38 516 38 516 125 L516 305"/><rect class="fs9-block fs9-fade fs9-d2 fs9-mass-up" x="324" y="260" width="120" height="100" rx="6"/><rect class="fs9-block fs9-fade fs9-d2 fs9-mass-down" x="456" y="225" width="120" height="135" rx="6"/><text class="fs9-label fs9-fade fs9-d3" x="384" y="320" text-anchor="middle">2 kg</text><text class="fs9-label fs9-fade fs9-d3" x="516" y="300" text-anchor="middle">6 kg</text>`;
    b+=arrow(id,384,275,384,205,"T","blue",400,218)+arrow(id,384,330,384,410,"2g","red",402,400)+arrow(id,516,250,516,175,"T","blue",533,190)+arrow(id,516,325,516,420,"6g","red",533,408);
    return frame(b,"Máquina de Atwood con masas de dos y seis kilogramos");
  }
  function fs07(){
    const id=uid();let b=defs(id)+title("Energía con fricción en un plano","La gravedad entrega energía; la fricción la disipa");
    const x0=115,y0=350,x1=720,y1=175;
    b+=`<polygon class="fs9-ramp fs9-fade fs9-d1" points="${x0},${y0} ${x1},${y0} ${x1},${y1}"/><line class="fs9-surface fs9-draw fs9-d1" x1="${x0}" y1="${y0}" x2="${x1}" y2="${y1}"/><rect class="fs9-block fs9-fade fs9-d2 fs9-slide-down" x="530" y="182" width="90" height="58" rx="5" transform="rotate(-16.1 575 211)"/>`;
    b+=measure(245,325,600,222,"5 m",435,255)+`<path class="fs9-angle fs9-draw fs9-d3" d="M180 350 A65 65 0 0 0 242 331"/><text class="fs9-small fs9-fade fs9-d3" x="220" y="328">30°</text>`;
    b+=arrow(id,575,211,455,246,"fₖ","gold",435,270)+arrow(id,575,211,575,338,"mg","red",592,326);
    return frame(b,"Bloque deslizándose por un plano inclinado rugoso");
  }
  function fs08(){
    const id=uid();let b=defs(id)+title("Choque inelástico → compresión del resorte","Dos etapas físicas distintas");
    b+=`<line class="fs9-ground fs9-draw fs9-d1" x1="70" y1="330" x2="830" y2="330"/><rect class="fs9-cart fs9-fade fs9-d2 fs9-cart-moving" x="135" y="255" width="105" height="60" rx="6"/><rect class="fs9-cart fs9-fade fs9-d2" x="365" y="255" width="125" height="60" rx="6"/><text class="fs9-small fs9-fade fs9-d3" x="187" y="245" text-anchor="middle">1 kg · 8 m/s</text><text class="fs9-small fs9-fade fs9-d3" x="427" y="245" text-anchor="middle">3 kg</text>`;
    b+=arrow(id,235,285,335,285,"v","blue",280,267,"fs9-vector-pulse");
    b+=`<path class="fs9-spring fs9-draw fs9-d3" d="M690 285 l18 -22 l18 44 l18 -44 l18 44 l18 -44 l18 22 H825"/><line class="fs9-wall fs9-draw fs9-d2" x1="825" y1="225" x2="825" y2="340"/><g class="fs9-combined-cart"><rect class="fs9-cart" x="560" y="255" width="130" height="60" rx="6"/></g><text class="fs9-small fs9-fade fs9-d4" x="625" y="235" text-anchor="middle">4 kg unidos</text>`;
    return frame(b,"Choque inelástico seguido por compresión de un resorte ideal");
  }
  function fs09(){
    const id=uid();let b=defs(id)+title("Impulso = área bajo F(t)","Pulso triangular positivo");
    b+=`<line class="fs9-axis fs9-draw fs9-d1" x1="130" y1="350" x2="790" y2="350"/><line class="fs9-axis fs9-draw fs9-d1" x1="130" y1="350" x2="130" y2="90"/><path class="fs9-area fs9-fade fs9-d2" d="M185 350 L465 115 L745 350 Z"/><path class="fs9-line blue fs9-draw fs9-d2" d="M185 350 L465 115 L745 350"/><text class="fs9-label fs9-fade fs9-d3" x="95" y="120">100 N</text><text class="fs9-small fs9-fade fs9-d3" x="745" y="380" text-anchor="middle">0,40 s</text><text class="fs9-small fs9-fade fs9-d4" x="470" y="265" text-anchor="middle">Área = impulso</text>`;
    return frame(b,"Gráfica fuerza-tiempo triangular utilizada para calcular impulso");
  }
  function fs10(){
    const id=uid();let b=defs(id)+title("Loop vertical: condición mínima","En la cima, el contacto está justo al límite");
    b+=`<path class="fs9-track fs9-draw fs9-d1" d="M90 105 Q205 105 315 340 H500"/><circle class="fs9-loop fs9-draw fs9-d2" cx="580" cy="240" r="100"/><line class="fs9-track fs9-draw fs9-d2" x1="500" y1="340" x2="760" y2="340"/><circle class="fs9-body fs9-fade fs9-d2" cx="115" cy="105" r="12"/><circle class="fs9-body-gold fs9-pulse fs9-d4" cx="580" cy="140" r="11"/>`;
    b+=measure(65,105,65,340,"h",45,228)+measure(580,240,580,140,"R",605,193)+arrow(id,580,140,580,225,"mg","red",596,210);
    return frame(b,"Pista que entra a un loop vertical con altura inicial h y radio R");
  }
  function fs11(){
    const id=uid();let b=defs(id)+title("Escalamiento orbital","Mismo planeta · radios r y 9r");
    b+=`<circle class="fs9-planet fs9-fade fs9-d1" cx="450" cy="245" r="52"/><circle class="fs9-orbit-line fs9-draw fs9-d2" cx="450" cy="245" r="110"/><circle class="fs9-orbit-line fs9-draw fs9-d3" cx="450" cy="245" r="185"/><circle class="fs9-satellite fs9-orbit-inner" cx="560" cy="245" r="10"/><circle class="fs9-satellite fs9-orbit-outer" cx="635" cy="245" r="10"/>`;
    b+=measure(450,245,560,245,"r",505,230)+measure(450,245,635,245,"9r",545,280)+`<text class="fs9-small fs9-fade fs9-d4" x="450" y="250" text-anchor="middle">M</text>`;
    return frame(b,"Comparación conceptual entre dos órbitas circulares alrededor del mismo planeta","Los radios dibujados son esquemáticos; la proporción visual no pretende ser 1:9");
  }
  function fs12(){
    const id=uid();let b=defs(id)+title("Equilibrio de una viga","Elige la bisagra como eje de momentos");
    b+=`<line class="fs9-beam fs9-draw fs9-d1" x1="150" y1="275" x2="760" y2="275"/><circle class="fs9-hinge fs9-fade fs9-d2" cx="150" cy="275" r="13"/><path class="fs9-cable fs9-draw fs9-d2" d="M760 275 L585 145"/><line class="fs9-wall fs9-draw fs9-d1" x1="150" y1="150" x2="150" y2="355"/>`;
    b+=arrow(id,455,275,455,390,"200 N","red",472,378)+arrow(id,610,275,610,400,"300 N","red",627,388)+arrow(id,760,275,655,195,"T","blue",640,185,"fs9-force-pulse");
    b+=measure(150,315,610,315,"3 m",380,338)+measure(150,350,760,350,"4 m",455,374)+`<path class="fs9-angle fs9-draw fs9-d3" d="M690 275 A70 70 0 0 0 704 233"/><text class="fs9-small fs9-fade fs9-d4" x="710" y="245">30°</text>`;
    return frame(b,"Viga articulada con peso propio, carga puntual y cable inclinado");
  }
  function fs13(){
    const id=uid();let b=defs(id)+title("Carrera de rodadura","Misma M y R · diferente momento de inercia");
    b+=`<polygon class="fs9-ramp fs9-fade fs9-d1" points="100,340 790,340 790,130"/><line class="fs9-surface fs9-draw fs9-d1" x1="100" y1="340" x2="790" y2="130"/>`;
    b+=`<g class="fs9-rolling-disk"><circle class="fs9-disk" cx="565" cy="188" r="42"/><line class="fs9-spoke" x1="565" y1="188" x2="600" y2="164"/></g><g class="fs9-rolling-hoop"><circle class="fs9-hoop" cx="690" cy="150" r="42"/><line class="fs9-spoke" x1="690" y1="150" x2="725" y2="126"/></g>`;
    b+=`<text class="fs9-label fs9-fade fs9-d3" x="550" y="120" text-anchor="middle">disco</text><text class="fs9-label fs9-fade fs9-d3" x="705" y="90" text-anchor="middle">aro</text>`+arrow(id,520,205,435,230,"v","blue",445,215)+arrow(id,650,165,565,190,"v","gold",575,176);
    return frame(b,"Disco sólido y aro delgado rodando sin deslizamiento por el mismo plano inclinado");
  }
  function fs14(){
    const id=uid();let b=defs(id)+title("Objeto totalmente sumergido","Empuje arriba · peso abajo");
    b+=`<rect class="fs9-tank fs9-fade fs9-d1" x="205" y="95" width="490" height="280"/><rect class="fs9-water fs9-fade fs9-d2" x="210" y="145" width="480" height="225"/><line class="fs9-waterline fs9-draw fs9-d2" x1="210" y1="145" x2="690" y2="145"/><rect class="fs9-block fs9-fade fs9-d3 fs9-buoyant-body" x="385" y="220" width="130" height="90" rx="8"/>`;
    b+=arrow(id,450,265,450,150,"E","blue",468,170,"fs9-force-pulse")+arrow(id,450,265,450,385,"mg","red",468,370)+`<text class="fs9-label fs9-fade fs9-d4" x="560" y="260">F ext ?</text><circle class="fs9-question fs9-pulse fs9-d4" cx="545" cy="255" r="18"/>`;
    return frame(b,"Objeto menos denso que el agua mantenido completamente sumergido","La dirección de la fuerza externa debe inferirse del balance; el diagrama no la revela");
  }
  function fs15(){
    const id=uid();let b=defs(id)+title("Continuidad + Bernoulli","Primero caudal; después presión");
    b+=`<path class="fs9-pipe fs9-fade fs9-d1" d="M90 155 H330 L405 205 H505 L580 155 H810 V325 H580 L505 275 H405 L330 325 H90 Z"/><line class="fs9-flow fs9-draw fs9-d2" x1="130" y1="240" x2="760" y2="240"/>`;
    b+=arrow(id,180,240,300,240,"v₁=3 m/s","blue",188,220)+arrow(id,430,240,525,240,"v₂ ?","gold",445,220,"fs9-vector-pulse")+`<text class="fs9-label fs9-fade fs9-d3" x="205" y="135">A₁=2A₂</text><text class="fs9-label fs9-fade fs9-d3" x="440" y="190">A₂</text><text class="fs9-small fs9-fade fs9-d4" x="215" y="355">P₁</text><text class="fs9-small fs9-fade fs9-d4" x="465" y="305">P₂</text>`;
    return frame(b,"Tubería horizontal que se estrecha para aplicar continuidad y Bernoulli");
  }
  function fs16(){
    const id=uid();let b=defs(id)+title("Choque en el borde + proyectil","Momentum primero · vuelo parabólico después");
    b+=`<rect class="fs9-table fs9-fade fs9-d1" x="430" y="160" width="340" height="170"/><line class="fs9-ground fs9-draw fs9-d1" x1="80" y1="390" x2="825" y2="390"/><rect class="fs9-cart fs9-fade fs9-d2" x="640" y="105" width="100" height="55" rx="5"/><circle class="fs9-bullet fs9-fade fs9-d2 fs9-bullet-move" cx="220" cy="132" r="10"/>`;
    b+=arrow(id,235,132,360,132,"12 m/s","blue",270,112,"fs9-vector-pulse")+`<path class="fs9-trajectory fs9-draw fs9-d3" d="M740 132 Q790 170 815 380"/><g class="fs9-projectile-block"><rect class="fs9-cart" x="700" y="105" width="100" height="55" rx="5"/></g>`+measure(790,160,790,390,"5 m",820,280)+measure(740,405,815,405,"x ?",778,430);
    return frame(b,"Proyectil que se incrusta en un bloque situado en el borde de una mesa y luego cae");
  }
  function fs17(){
    const id=uid();let b=defs(id)+title("Frenado con fricción máxima","La energía cinética inicial debe disiparse");
    b+=`<line class="fs9-road fs9-draw fs9-d1" x1="80" y1="315" x2="820" y2="315"/><g class="fs9-car-brake"><rect class="fs9-car" x="130" y="245" width="160" height="55" rx="12"/><circle class="fs9-wheel" cx="165" cy="310" r="17"/><circle class="fs9-wheel" cx="255" cy="310" r="17"/></g>`;
    b+=arrow(id,285,265,415,265,"30 m/s","blue",325,245,"fs9-vector-pulse")+arrow(id,210,285,100,285,"f máx","red",80,270)+`<path class="fs9-skid fs9-draw fs9-d3" d="M300 335 C410 322 510 348 620 332 S765 345 810 330"/>`+measure(300,365,810,365,"d mínima ?",555,390);
    return frame(b,"Automóvil frenando sobre una vía horizontal con fuerza de fricción máxima");
  }
  function fs18(){
    const id=uid();let b=defs(id)+title("Péndulo balístico","Etapa 1: choque · Etapa 2: ascenso");
    b+=`<line class="fs9-roof fs9-draw fs9-d1" x1="430" y1="80" x2="700" y2="80"/><line class="fs9-string fs9-draw fs9-d2" x1="565" y1="80" x2="565" y2="285"/><rect class="fs9-block fs9-fade fs9-d2" x="510" y="285" width="110" height="75" rx="8"/><circle class="fs9-bullet fs9-fade fs9-d2 fs9-bullet-move" cx="180" cy="320" r="10"/>`;
    b+=arrow(id,195,320,350,320,"u ?","blue",245,300,"fs9-vector-pulse")+`<path class="fs9-swing-arc fs9-draw fs9-d3" d="M565 285 A205 205 0 0 0 710 140"/><g class="fs9-swing-body"><line class="fs9-string" x1="565" y1="80" x2="710" y2="225"/><rect class="fs9-block" x="675" y="225" width="90" height="62" rx="7"/></g>`+measure(790,225,790,320,"0,80 m",820,275);
    return frame(b,"Péndulo balístico con proyectil que se incrusta y conjunto que asciende");
  }
  function fs19(){
    const id=uid();let b=defs(id)+title("Energía: altura → fricción → resorte","Sigue el presupuesto energético por etapas");
    b+=`<path class="fs9-track fs9-draw fs9-d1" d="M90 105 Q190 105 280 300 H460"/><line class="fs9-rough fs9-draw fs9-d2" x1="460" y1="300" x2="650" y2="300"/><path class="fs9-spring fs9-draw fs9-d3" d="M650 300 l18 -20 l18 40 l18 -40 l18 40 l18 -40 l18 20 H805"/><line class="fs9-wall fs9-draw fs9-d2" x1="805" y1="240" x2="805" y2="335"/><circle class="fs9-body fs9-fade fs9-d2 fs9-energy-body" cx="110" cy="105" r="12"/>`;
    b+=measure(60,105,60,300,"2,0 m",35,205)+measure(460,345,650,345,"4,0 m",555,370)+`<text class="fs9-small fs9-fade fs9-d4" x="555" y="285" text-anchor="middle">μₖ=0,25</text><text class="fs9-small fs9-fade fs9-d4" x="720" y="260" text-anchor="middle">k=100 N/m</text>`;
    return frame(b,"Bloque que baja, cruza una zona rugosa y comprime un resorte");
  }
  function fs20(){
    const id=uid();let b=defs(id)+title("Loop: energía + ecuación radial","La normal en la cima se obtiene después de conocer v");
    b+=`<path class="fs9-track fs9-draw fs9-d1" d="M90 85 Q210 85 315 340 H500"/><circle class="fs9-loop fs9-draw fs9-d2" cx="590" cy="240" r="100"/><line class="fs9-track fs9-draw fs9-d2" x1="500" y1="340" x2="760" y2="340"/><circle class="fs9-body fs9-fade fs9-d2" cx="115" cy="85" r="12"/><circle class="fs9-body-gold fs9-pulse fs9-d4" cx="590" cy="140" r="11"/>`;
    b+=measure(60,85,60,340,"3R",38,220)+measure(590,240,590,140,"R",615,193)+arrow(id,590,140,590,215,"mg","red",607,205)+arrow(id,590,140,590,225,"N ?","blue",545,215,"fs9-force-pulse");
    return frame(b,"Bloque en un loop vertical con fuerzas radiales en la parte superior","Las flechas de fuerza son esquemáticas y no codifican la magnitud de la respuesta");
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
      if (!("IntersectionObserver" in window)) {
        figure.classList.add("is-visible");
        return;
      }
      const io = new IntersectionObserver((entries, observer) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }
      }, { threshold: 0.28, rootMargin: "0px 0px -8% 0px" });
      io.observe(figure);
    });
  };
  const queue = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(markVisible);
  };
  const root = document.getElementById("workshopContent");
  if (root) new MutationObserver(queue).observe(root,{childList:true});
  window.addEventListener("hashchange",queue);
  queue();
})();
