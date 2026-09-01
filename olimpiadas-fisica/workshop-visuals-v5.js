(() => {
  const esc = (v) => String(v ?? "").replace(/[&<>\"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
  let seq = 0;
  const uid = (p="m") => `${p}-${++seq}`;
  const MARKERS = (id) => `<defs>
    <marker id="${id}-b" markerWidth="10" markerHeight="10" refX="8.4" refY="5" orient="auto"><path class="mk-blue" d="M0,0 L10,5 L0,10 z"/></marker>
    <marker id="${id}-g" markerWidth="10" markerHeight="10" refX="8.4" refY="5" orient="auto"><path class="mk-gold" d="M0,0 L10,5 L0,10 z"/></marker>
    <marker id="${id}-r" markerWidth="10" markerHeight="10" refX="8.4" refY="5" orient="auto"><path class="mk-red" d="M0,0 L10,5 L0,10 z"/></marker>
    <marker id="${id}-k" markerWidth="10" markerHeight="10" refX="8.4" refY="5" orient="auto"><path class="mk-black" d="M0,0 L10,5 L0,10 z"/></marker>
  </defs>`;
  const arr = (id,x1,y1,x2,y2,label="",cls="blue",tx=null,ty=null) => `<line class="wv-arrow ${cls}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" marker-end="url(#${id}-${cls==='gold'?'g':cls==='red'?'r':cls==='black'?'k':'b'})"/>${label?`<text class="wv-label" x="${tx ?? x2+8}" y="${ty ?? y2-8}">${esc(label)}</text>`:""}`;
  const frame = (body, label, note="Esquema físico · no necesariamente a escala") => `<figure class="workshop-figure" role="img" aria-label="${esc(label)}"><div class="workshop-figure-stage"><svg class="workshop-svg" viewBox="0 0 760 420" aria-hidden="true">${body}</svg></div><figcaption>${esc(note)}</figcaption></figure>`;
  const title = (t, s="") => `<text class="wv-title" x="380" y="34" text-anchor="middle">${esc(t)}</text>${s?`<text class="wv-subtitle" x="380" y="58" text-anchor="middle">${esc(s)}</text>`:""}`;
  const axis = (x1,y1,x2,y2,label="") => `<line class="wv-axis" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>${label?`<text class="wv-small" x="${x2-8}" y="${y2+20}">${esc(label)}</text>`:""}`;
  const dot = (x,y,r=7,cls="dot-blue") => `<circle class="${cls}" cx="${x}" cy="${y}" r="${r}"/>`;

  function vectors(qid) {
    const id = uid("vec"); let b = MARKERS(id);
    if (qid === "tv-02") {
      b += title("Vector addition", "3 N east + 4 N north");
      b += axis(125,330,610,330,"x")+axis(125,350,125,100,"y");
      b += arr(id,150,330,330,330,"3 N","blue",235,312)+arr(id,150,330,150,90,"4 N","gold",165,115)+arr(id,150,330,330,90,"R","black",340,86);
      b += `<path class="wv-dash" d="M330 330 L330 90 L150 90"/><text class="wv-small" x="225" y="365">3:4 right triangle</text>`;
      return frame(b,"Perpendicular force vectors forming a 3-4-right triangle");
    }
    if (qid === "tv-05") {
      const ox=160, oy=330, L=300, th=37*Math.PI/180, x=ox+L*Math.cos(th), y=oy-L*Math.sin(th);
      b += title("Resolve the vector", "10 N at 37° from +x");
      b += axis(110,330,650,330,"x")+axis(160,360,160,80,"y");
      b += arr(id,ox,oy,x,y,"10 N","black",x+12,y-8);
      b += `<line class="wv-component" x1="${ox}" y1="${oy}" x2="${x}" y2="${oy}"/><line class="wv-component" x1="${x}" y1="${oy}" x2="${x}" y2="${y}"/><text class="wv-label" x="${(ox+x)/2}" y="355">Aₓ</text><text class="wv-label" x="${x+10}" y="${(oy+y)/2}">Aᵧ</text><path class="wv-angle" d="M220 330 A60 60 0 0 0 ${ox+60*Math.cos(th)} ${oy-60*Math.sin(th)}"/><text class="wv-label" x="220" y="302">37°</text>`;
      return frame(b,"A ten-newton vector at thirty-seven degrees with horizontal and vertical components");
    }
    if (qid === "tv-06") {
      b += title("Dot product geometry", "A ⟂ B");
      b += arr(id,220,315,560,315,"A","blue",570,305)+arr(id,220,315,220,115,"B","gold",235,130);
      b += `<path class="wv-right-angle" d="M220 285 L250 285 L250 315"/><text class="wv-label" x="270" y="205">90°</text>`;
      return frame(b,"Two nonzero perpendicular vectors");
    }
    if (qid === "tv-08") {
      const ox=220,oy=310,L=230,th=120*Math.PI/180; const bx=ox+L*Math.cos(th),by=oy-L*Math.sin(th); const rx=ox+L/2, ry=oy-L*Math.sin(Math.PI/3);
      b += title("Equal vectors separated by 120°", "Construct the resultant geometrically");
      b += arr(id,ox,oy,ox+L,oy,"A","blue",ox+L+8,oy-10)+arr(id,ox,oy,bx,by,"A","gold",bx-25,by-10)+arr(id,ox,oy,rx,ry,"A+B","black",rx+10,ry-8);
      b += `<path class="wv-angle" d="M290 310 A70 70 0 0 0 ${ox+70*Math.cos(th)} ${oy-70*Math.sin(th)}"/><text class="wv-label" x="254" y="248">120°</text>`;
      return frame(b,"Two vectors of equal magnitude with an angle of one hundred twenty degrees and their resultant");
    }
    if (qid === "tv-09") {
      b += title("Direction ratio 3:4", "Normalize the direction");
      b += `<polygon class="wv-triangle" points="180,370 420,370 420,50"/><text class="wv-label" x="290" y="398">3</text><text class="wv-label" x="438" y="215">4</text><text class="wv-label" x="280" y="205">5</text>`;
      b += arr(id,180,370,420,50,"direction","black",430,46);
      return frame(b,"A three-four-five direction triangle");
    }
    return "";
  }

  function kinematics(qid) {
    const id=uid("kin"); let b=MARKERS(id);
    if (qid === "kin-01") {
      b += title("Meeting condition", "same position at the same time");
      b += axis(90,340,690,340,"t")+axis(90,340,90,80,"x");
      b += `<line class="wv-line blue" x1="105" y1="325" x2="620" y2="115"/><path class="wv-line gold" d="M105 325 Q330 325 620 115" fill="none"/><circle class="dot-black" cx="620" cy="115" r="8"/><text class="wv-small" x="555" y="98">second intersection</text><text class="wv-label" x="450" y="205">x=20t</text><text class="wv-label" x="320" y="300">x=t²</text>`;
      return frame(b,"Position time models for constant speed and uniformly accelerated motion that meet again");
    }
    if (qid === "kin-02") {
      b += title("Velocity-time graph", "+8 m/s to −8 m/s in 4 s");
      b += axis(95,210,690,210,"t")+axis(95,350,95,75,"v");
      b += `<line class="wv-line blue" x1="120" y1="100" x2="620" y2="320"/><line class="wv-dash" x1="345" y1="85" x2="345" y2="345"/><circle class="dot-black" cx="345" cy="210" r="8"/><text class="wv-label" x="112" y="92">+8</text><text class="wv-label" x="112" y="325">−8</text><text class="wv-small" x="330" y="372">t=2 s</text><text class="wv-small" x="600" y="372">4 s</text>`;
      return frame(b,"A linear velocity time graph crossing zero between positive and negative velocity");
    }
    if (qid === "kin-03") {
      b += title("Horizontal projectile", "separate horizontal and vertical motion");
      b += `<line class="wv-ground" x1="80" y1="345" x2="690" y2="345"/><rect class="wv-platform" x="90" y="105" width="135" height="240"/><path class="wv-trajectory" d="M225 120 Q420 135 640 330" fill="none"/>${dot(225,120,9)}`;
      b += arr(id,225,120,350,120,"vₓ","blue",285,102)+arr(id,520,245,520,330,"g","red",535,315);
      return frame(b,"A projectile launched horizontally with horizontal velocity and downward gravitational acceleration");
    }
    if (qid === "kin-04") {
      b += title("Top of a vertical throw", "velocity can be zero while acceleration is not");
      b += `<line class="wv-ground" x1="120" y1="345" x2="640" y2="345"/><path class="wv-dash" d="M380 330 L380 115"/>${dot(380,115,10)}`;
      b += `<text class="wv-label" x="400" y="120">v = 0</text>`+arr(id,380,130,380,245,"a = g","red",395,220);
      return frame(b,"Object at the highest point of a vertical throw with zero instantaneous velocity and downward acceleration");
    }
    if (qid === "kin-05") {
      b += title("Two x-t graphs cross", "same x does not imply same slope");
      b += axis(90,340,680,340,"t")+axis(90,340,90,70,"x");
      b += `<line class="wv-line blue" x1="120" y1="300" x2="615" y2="105"/><path class="wv-line gold" d="M120 120 Q390 200 615 300" fill="none"/><circle class="dot-black" cx="365" cy="205" r="8"/><line class="wv-tangent blue" x1="300" y1="230" x2="430" y2="178"/><line class="wv-tangent gold" x1="300" y1="185" x2="430" y2="225"/>`;
      return frame(b,"Two position time graphs intersecting at the same event with different local slopes");
    }
    if (qid === "kin-06") {
      b += title("Opposite runners on a 400 m track", "closing speed along the path");
      b += `<ellipse class="wv-track" cx="380" cy="220" rx="230" ry="120"/>${dot(380,100,10,"dot-blue")}${dot(380,340,10,"dot-gold")}<path class="wv-motion blue" d="M380 100 A230 120 0 0 1 610 220"/><path class="wv-motion gold" d="M380 340 A230 120 0 0 1 610 220"/><text class="wv-label" x="410" y="95">6 m/s</text><text class="wv-label" x="410" y="360">4 m/s</text><text class="wv-small" x="590" y="212">first meeting</text>`;
      return frame(b,"Two runners moving in opposite directions on the same circular track");
    }
    if (qid === "kin-07") {
      b += title("Boat + current", "perpendicular velocity components");
      b += `<rect class="wv-water" x="90" y="85" width="580" height="250"/><line class="wv-bank" x1="90" y1="85" x2="670" y2="85"/><line class="wv-bank" x1="90" y1="335" x2="670" y2="335"/><path class="wv-boat" d="M270 295 L300 280 L330 295 L300 310 Z"/>`;
      b += arr(id,300,295,300,135,"4 m/s","blue",315,155)+arr(id,300,295,420,295,"3 m/s","gold",345,280)+arr(id,300,295,420,135,"v ground","black",428,128);
      return frame(b,"Boat velocity relative to water and river current added as perpendicular vectors");
    }
    if (qid === "kin-08") {
      b += title("Projectile range scaling", "same launch angle, speeds v and 2v");
      b += `<line class="wv-ground" x1="70" y1="350" x2="705" y2="350"/><path class="wv-trajectory blue" d="M95 345 Q245 180 385 345" fill="none"/><path class="wv-trajectory gold" d="M95 345 Q360 55 665 345" fill="none"/><text class="wv-label" x="220" y="250">v</text><text class="wv-label" x="420" y="115">2v</text><line class="wv-measure" x1="95" y1="372" x2="385" y2="372"/><text class="wv-small" x="230" y="397">R</text><line class="wv-measure" x1="95" y1="405" x2="665" y2="405"/><text class="wv-small" x="360" y="418">new range ?</text>`;
      return frame(b,"Two ideal projectile trajectories at the same angle with different launch speeds","Comparative sketch · horizontal drawing is not a scale ruler for the unknown range");
    }
    if (qid === "kin-09") {
      b += title("x(t)=4t−t²", "instantaneous velocity = slope of x-t");
      b += axis(90,340,680,340,"t")+axis(90,340,90,70,"x");
      b += `<path class="wv-line blue" d="M105 330 Q345 70 620 330" fill="none"/><circle class="dot-black" cx="345" cy="112" r="8"/><line class="wv-tangent black" x1="270" y1="112" x2="420" y2="112"/><text class="wv-label" x="300" y="95">horizontal tangent</text><text class="wv-small" x="300" y="372">solve dx/dt = 0</text>`;
      return frame(b,"Position time parabola with a horizontal tangent at the turning point");
    }
    if (qid === "kin-10") {
      b += title("Equal distances, unequal speeds", "average speed uses total distance / total time");
      b += `<line class="wv-trackline" x1="130" y1="220" x2="630" y2="220"/>${dot(145,220,11)}${dot(615,220,11,"dot-gold")}<text class="wv-label" x="135" y="255">A</text><text class="wv-label" x="605" y="255">B</text>`;
      b += arr(id,180,185,565,185,"d at speed v","blue",320,165)+arr(id,565,275,180,275,"d at speed 2v","gold",320,305);
      b += `<text class="wv-small" x="260" y="365">times: d/v and d/(2v)</text>`;
      return frame(b,"Out and back trip over equal distances with two different speeds");
    }
    return "";
  }

  function dynamics(qid) {
    const id=uid("dyn"); let b=MARKERS(id);
    if (qid === "dyn-01" || qid === "dyn-06") {
      const braking = qid === "dyn-01";
      b += title("Elevator free-body diagram", braking?"moving down, acceleration up":"accelerating upward");
      b += `<rect class="wv-elevator" x="235" y="90" width="290" height="260"/><circle class="wv-person-head" cx="380" cy="160" r="22"/><line class="wv-person" x1="380" y1="182" x2="380" y2="255"/><line class="wv-person" x1="380" y1="210" x2="335" y2="245"/><line class="wv-person" x1="380" y1="210" x2="425" y2="245"/>`;
      b += arr(id,380,225,380,115,"N","blue",398,130)+arr(id,380,225,380,325,"mg","red",398,310);
      b += braking ? arr(id,520,245,520,145,"a","black",535,165)+arr(id,560,150,560,270,"v","gold",575,255) : arr(id,520,245,520,145,"a","black",535,165);
      return frame(b,"Person in an elevator with normal force, weight, and acceleration shown separately");
    }
    if (qid === "dyn-02") {
      b += title("Constant velocity on an ideal surface", "motion does not require a net force");
      b += `<line class="wv-ground" x1="90" y1="315" x2="670" y2="315"/><circle class="wv-disc" cx="300" cy="285" r="30"/>`+arr(id,300,260,455,260,"v = constant","blue",350,242)+`<text class="wv-label" x="280" y="120">ΣF = ?</text>`;
      return frame(b,"A disk moving at constant velocity on a frictionless horizontal surface");
    }
    if (qid === "dyn-03" || qid === "dyn-08") {
      const staticCase=qid==="dyn-08", theta=30*Math.PI/180; const x0=120,y0=340,x1=650,y1=340-(650-120)*Math.tan(theta); const cx=430,cy=340-(430-120)*Math.tan(theta)-35;
      b += title("Inclined-plane FBD", staticCase?"30° · block at rest":"block sliding upward");
      b += `<polygon class="wv-ramp" points="${x0},${y0} ${x1},${y0} ${x1},${y1}"/><rect class="wv-block" x="${cx-45}" y="${cy-30}" width="90" height="60" transform="rotate(-30 ${cx} ${cy})"/>`;
      b += arr(id,cx,cy,cx-95*Math.sin(theta),cy-95*Math.cos(theta),"N","blue",cx-55,cy-95)+arr(id,cx,cy,cx,cy+120,"mg","red",cx+15,cy+110);
      if (staticCase) b += arr(id,cx,cy,cx+120*Math.cos(theta),cy-120*Math.sin(theta),"fₛ","gold",cx+100,cy-80);
      else { b += arr(id,cx,cy,cx-120*Math.cos(theta),cy+120*Math.sin(theta),"fₖ","gold",cx-135,cy+85); b += arr(id,cx,cy,cx+105*Math.cos(theta),cy-105*Math.sin(theta),"v","black",cx+90,cy-70); }
      b += `<path class="wv-angle" d="M590 340 A55 55 0 0 0 ${590-55*Math.cos(theta)} ${340-55*Math.sin(theta)}"/><text class="wv-label" x="560" y="315">30°</text>`;
      return frame(b,"A block on a thirty-degree inclined plane with weight vertical and normal perpendicular to the surface");
    }
    if (qid === "dyn-04") {
      b += title("Connected blocks", "frictionless horizontal surface");
      b += `<line class="wv-ground" x1="70" y1="315" x2="690" y2="315"/><rect class="wv-block" x="160" y="240" width="120" height="75"/><rect class="wv-block" x="355" y="240" width="150" height="75"/><line class="wv-rope" x1="280" y1="278" x2="355" y2="278"/><text class="wv-label" x="195" y="285">2 kg</text><text class="wv-label" x="405" y="285">3 kg</text>`;
      b += arr(id,505,278,640,278,"10 N","blue",560,258)+arr(id,355,215,280,215,"T","gold",315,198)+arr(id,280,215,355,215,"T","gold",315,198);
      return frame(b,"Two blocks connected by an ideal string with a ten-newton external force on the three-kilogram block");
    }
    if (qid === "dyn-09") {
      b += title("Push below the horizontal", "vertical acceleration = 0");
      b += `<line class="wv-ground" x1="90" y1="320" x2="670" y2="320"/><rect class="wv-block" x="310" y="230" width="145" height="90"/>`;
      b += arr(id,382,230,382,125,"N","blue",398,145)+arr(id,382,275,382,375,"mg","red",398,365)+arr(id,310,265,195,325,"F","gold",172,340);
      b += `<line class="wv-component" x1="310" y1="265" x2="195" y2="265"/><line class="wv-component" x1="195" y1="265" x2="195" y2="325"/><path class="wv-angle" d="M255 265 A55 55 0 0 1 208 294"/><text class="wv-label" x="235" y="300">θ</text>`;
      return frame(b,"A block on a horizontal table pushed by an oblique force directed below the horizontal");
    }
    if (qid === "dyn-07") {
      b += title("Ideal Atwood machine", "m versus 2m");
      b += `<circle class="wv-pulley" cx="380" cy="115" r="55"/><path class="wv-rope" d="M220 330 L220 115 Q380 -5 540 115 L540 330" fill="none"/><rect class="wv-block" x="165" y="280" width="110" height="80"/><rect class="wv-block" x="485" y="250" width="110" height="110"/><text class="wv-label" x="205" y="328">m</text><text class="wv-label" x="515" y="315">2m</text>`;
      b += arr(id,285,320,285,235,"a","blue",300,250)+arr(id,610,265,610,350,"a","gold",625,340);
      return frame(b,"An ideal Atwood machine with hanging masses m and two m");
    }
    if (qid === "dyn-10") {
      b += title("Top of a vertical circle", "string just remains taut at the limiting case");
      b += `<circle class="wv-circle" cx="380" cy="235" r="125"/>${dot(380,110,11)}<line class="wv-radius" x1="380" y1="110" x2="380" y2="235"/><text class="wv-small" x="397" y="180">r</text>`;
      b += arr(id,380,110,380,205,"mg","red",395,192)+arr(id,380,110,380,165,"T","blue",345,155)+arr(id,380,110,500,110,"v","black",455,92);
      return frame(b,"Mass at the top of a vertical circular path with gravity and string tension directed toward the center");
    }
    return "";
  }

  function energy(qid) {
    const id=uid("ene"); let b=MARKERS(id);
    if (qid === "ene-01") {
      b += title("Energy between two heights", "starts from rest at h");
      b += `<line class="wv-level" x1="110" y1="110" x2="650" y2="110"/><line class="wv-level" x1="110" y1="235" x2="650" y2="235"/><line class="wv-level" x1="110" y1="360" x2="650" y2="360"/>${dot(210,110,10)}${dot(520,235,10,"dot-gold")}<text class="wv-label" x="150" y="98">h</text><text class="wv-label" x="475" y="222">h/2</text><text class="wv-small" x="130" y="380">reference level</text><line class="wv-measure" x1="90" y1="110" x2="90" y2="360"/><text class="wv-small" x="55" y="240">h</text>`;
      return frame(b,"Two positions of an object at heights h and h over two above the same reference level");
    }
    if (qid === "ene-03") {
      b += title("Two frictionless paths", "same initial and final heights");
      b += `<line class="wv-level" x1="100" y1="105" x2="660" y2="105"/><line class="wv-level" x1="100" y1="335" x2="660" y2="335"/><path class="wv-track blue" d="M125 105 Q260 150 320 335"/><path class="wv-track gold" d="M125 105 Q370 60 635 335"/>${dot(125,105,10)}${dot(320,335,9)}${dot(635,335,9,"dot-gold")}<text class="wv-small" x="290" y="380">frictionless</text>`;
      return frame(b,"Two different frictionless ramps connecting the same initial and final heights");
    }
    if (qid === "ene-04") {
      b += title("Work in uniform circular motion", "radial force versus tangential displacement");
      b += `<circle class="wv-circle" cx="380" cy="225" r="120"/>${dot(500,225,10)}<line class="wv-radius" x1="380" y1="225" x2="500" y2="225"/>`;
      b += arr(id,500,225,405,225,"Fᵣ","blue",425,208)+arr(id,500,225,500,115,"ds","gold",515,135)+`<path class="wv-right-angle" d="M470 225 L470 195 L500 195"/>`;
      return frame(b,"Radial force and an instantaneous tangential displacement at right angles");
    }
    if (qid === "ene-05" || qid === "ene-09") {
      const vertical=qid==="ene-09";
      b += title(vertical?"Vertical climb at constant speed":"Same stairs, different times", vertical?"power links force and velocity":"same gain in gravitational potential energy");
      b += `<path class="wv-stairs" d="M120 340 H220 V285 H320 V230 H420 V175 H520 V120 H640" fill="none"/><circle class="wv-person-head" cx="535" cy="92" r="16"/><line class="wv-person" x1="535" y1="108" x2="535" y2="150"/>`;
      if (vertical) b += arr(id,600,180,600,95,"v","blue",615,115)+arr(id,535,120,535,190,"mg","red",550,180);
      else b += `<text class="wv-label" x="170" y="390">A: 5 s</text><text class="wv-label" x="495" y="390">B: 10 s</text><text class="wv-small" x="300" y="80">same mass · same height</text>`;
      return frame(b, vertical?"A person moving vertically upward at constant speed":"Two equal-mass students climbing the same staircase in different times");
    }
    if (["ene-06","ene-07"].includes(qid)) {
      b += title(qid==="ene-06"?"Elastic energy scaling":"Spring launch scaling", "compare compression x and 2x");
      b += `<line class="wv-wall" x1="100" y1="105" x2="100" y2="330"/><path class="wv-spring" d="M100 165 l28 -18 l28 36 l28 -36 l28 36 l28 -36 l28 18"/><rect class="wv-block" x="268" y="125" width="90" height="80"/><text class="wv-label" x="175" y="120">x</text><line class="wv-wall" x1="410" y1="105" x2="410" y2="330"/><path class="wv-spring" d="M410 270 l18 -18 l18 36 l18 -36 l18 36 l18 -36 l18 18"/><rect class="wv-block" x="536" y="230" width="90" height="80"/><text class="wv-label" x="460" y="225">2x</text>`;
      return frame(b,"Two ideal springs shown with compressions x and two x");
    }
    if (qid === "ene-08") {
      b += title("Minimum height to complete a loop", "frictionless track · loop radius R");
      b += `<path class="wv-track black" d="M95 95 H220 Q300 95 300 170 V260 Q300 340 380 340 H610"/><circle class="wv-circle" cx="500" cy="240" r="100"/>${dot(115,95,10)}<line class="wv-measure" x1="75" y1="95" x2="75" y2="340"/><text class="wv-label" x="50" y="225">h</text><line class="wv-radius" x1="500" y1="240" x2="500" y2="140"/><text class="wv-label" x="515" y="190">R</text>${dot(500,140,9,"dot-gold")}`;
      return frame(b,"A particle starts from height h and enters a vertical loop of radius R");
    }
    if (qid === "ene-10") {
      b += title("Stopping distance with constant kinetic friction", "compare initial speeds v and 2v");
      b += `<line class="wv-ground" x1="70" y1="165" x2="690" y2="165"/><rect class="wv-block" x="110" y="95" width="100" height="70"/>`+arr(id,210,115,330,115,"v","blue",260,95)+arr(id,155,135,85,135,"fₖ","red",72,120)+`<line class="wv-measure" x1="210" y1="195" x2="470" y2="195"/><text class="wv-label" x="320" y="220">d</text><line class="wv-ground" x1="70" y1="340" x2="690" y2="340"/><rect class="wv-block" x="110" y="270" width="100" height="70"/>`+arr(id,210,290,390,290,"2v","gold",285,270)+arr(id,155,310,85,310,"same fₖ","red",65,295)+`<line class="wv-measure" x1="210" y1="370" x2="590" y2="370"/><text class="wv-label" x="360" y="398">stopping distance ?</text>`;
      return frame(b,"Two identical friction-braking situations with initial speeds v and two v");
    }
    return "";
  }

  function momentum(qid) {
    const id=uid("mom"); let b=MARKERS(id);
    const cart=(x,y,w,label,cls="wv-cart")=>`<rect class="${cls}" x="${x}" y="${y}" width="${w}" height="70" rx="10"/><circle class="wv-wheel" cx="${x+22}" cy="${y+73}" r="10"/><circle class="wv-wheel" cx="${x+w-22}" cy="${y+73}" r="10"/>${label?`<text class="wv-label" x="${x+w/2}" y="${y+42}" text-anchor="middle">${esc(label)}</text>`:""}`;
    if (["mom-01","mom-07"].includes(qid)) {
      const heavy=qid==="mom-07";
      b += title("Perfectly inelastic collision", heavy?"m hits 9m and sticks":"m hits identical m and sticks");
      b += `<line class="wv-ground" x1="60" y1="325" x2="700" y2="325"/>${cart(120,230,115,"m")}${cart(470,230,heavy?170:115,heavy?"9m":"m","wv-cart goldfill")}`+arr(id,235,250,365,250,"v","blue",290,230)+`<text class="wv-small" x="310" y="380">after impact: move together</text>`;
      return frame(b,"A moving cart collides and sticks to a cart initially at rest");
    }
    if (qid === "mom-02") {
      b += title("Successive sticking collisions", "one moving cart captures three identical carts");
      b += `<line class="wv-ground" x1="50" y1="325" x2="710" y2="325"/>${cart(80,235,95,"m")}${cart(260,235,95,"m","wv-cart goldfill")}${cart(420,235,95,"m","wv-cart goldfill")}${cart(580,235,95,"m","wv-cart goldfill")}`+arr(id,175,255,245,255,"v","blue",200,235);
      return frame(b,"Four identical carts on a line with only the first initially moving");
    }
    if (qid === "mom-03") {
      b += title("Recoil", "system starts from rest");
      b += `<rect class="wv-gun" x="260" y="210" width="210" height="70" rx="12"/><rect class="wv-barrel" x="455" y="225" width="120" height="28"/>${dot(625,239,8,"dot-gold")}`+arr(id,615,239,705,239,"projectile","blue",620,218)+arr(id,300,245,150,245,"gun recoil","gold",120,225);
      return frame(b,"A gun and projectile moving in opposite directions after firing from rest");
    }
    if (["mom-04","mom-08"].includes(qid)) {
      const numbers=qid==="mom-08";
      b += title("Force-time pulse", numbers?"base 4 s · peak 10 N":"area under F-t curve");
      b += axis(110,330,670,330,"t")+axis(110,350,110,80,"F")+`<polygon class="wv-area" points="150,330 380,105 610,330"/><polyline class="wv-line blue" points="150,330 380,105 610,330" fill="none"/>`;
      if(numbers)b+=`<text class="wv-label" x="70" y="115">10 N</text><text class="wv-label" x="365" y="370">4 s</text>`;
      return frame(b,"A triangular force versus time pulse with its enclosed area highlighted");
    }
    if (qid === "mom-05") {
      b += title("Equal-mass elastic collision", "before impact");
      b += `<line class="wv-ground" x1="60" y1="325" x2="700" y2="325"/>${cart(150,235,115,"m")}${cart(475,235,115,"m","wv-cart goldfill")}`+arr(id,265,255,390,255,"v","blue",320,235)+`<text class="wv-small" x="515" y="215">initially at rest</text>`;
      return frame(b,"Two equal-mass carts before a head-on elastic collision, with the second initially at rest");
    }
    if (["mom-06","mom-09"].includes(qid)) {
      const masses=qid==="mom-09";
      b += title("Explosion from rest", masses?"fragments m and 3m":"total initial momentum = 0");
      b += `<circle class="wv-core" cx="380" cy="220" r="34"/>${dot(200,220,15)}${dot(560,220,23,"dot-gold")}`+arr(id,340,220,205,220,masses?"m, v":"fragment 1","blue",145,200)+arr(id,420,220,555,220,masses?"3m, ?":"fragment 2","gold",565,200);
      return frame(b,"Two fragments moving in opposite directions after an explosion of an initially stationary object");
    }
    if (qid === "mom-10") {
      b += title("Center-of-mass velocity", "include velocity signs");
      b += `<line class="wv-ground" x1="70" y1="315" x2="690" y2="315"/>${dot(220,280,24)}${dot(530,280,18,"dot-gold")}<text class="wv-label" x="190" y="335">2m</text><text class="wv-label" x="515" y="335">m</text>`+arr(id,220,270,410,270,"+3v","blue",305,250)+arr(id,530,270,430,270,"−v","gold",450,250);
      return frame(b,"Two masses on one line with velocities of opposite signs for a center-of-mass calculation");
    }
    return "";
  }

  function circular(qid) {
    const id=uid("cg"); let b=MARKERS(id);
    const planet=(r=70)=>`<circle class="wv-planet" cx="380" cy="225" r="${r}"/>`;
    if (["cg-01","cg-03"].includes(qid)) {
      b += title("Uniform circular motion", qid==="cg-03"?"radial net force is not an extra force":"speed may be constant while velocity changes direction");
      b += `<circle class="wv-circle" cx="380" cy="225" r="135"/>${dot(515,225,10)}`+arr(id,515,225,515,105,"v tangent","blue",528,125)+arr(id,515,225,405,225,qid==="cg-03"?"ΣF radial":"aᵣ","red",420,205)+`<text class="wv-small" x="340" y="235">center</text>`;
      return frame(b,"Object in circular motion with tangential velocity and radial acceleration or net force");
    }
    if (["cg-02","cg-04","cg-05","cg-09","cg-10"].includes(qid)) {
      const isPeriod=qid==="cg-05"||qid==="cg-09", isEscape=qid==="cg-10";
      b += title(isEscape?"Escape-speed comparison":isPeriod?"Orbital period scaling":"Orbital radius scaling", isEscape?"launch from r and 4r":isPeriod?(qid==="cg-09"?"T → 2T":"r → 4r"):"same central body");
      if(qid==="cg-09"){
        b += planet(42)+`<circle class="wv-orbit blue" cx="380" cy="225" r="85"/><circle class="wv-orbit gold" cx="380" cy="225" r="155"/>${dot(465,225,9)}${dot(535,225,9,"dot-gold")}<text class="wv-label" x="440" y="205">r₁</text><text class="wv-label" x="505" y="245">r₂ ?</text><text class="wv-label" x="455" y="132">T</text><text class="wv-label" x="545" y="90">2T</text>`;
      } else {
        b += planet(28)+`<circle class="wv-orbit blue" cx="380" cy="225" r="40"/><circle class="wv-orbit gold" cx="380" cy="225" r="160"/>${dot(420,225,8)}${dot(540,225,9,"dot-gold")}<text class="wv-label" x="405" y="205">r</text><text class="wv-label" x="505" y="250">4r</text>`;
        if(isEscape) b += arr(id,420,225,500,170,"vₑ","blue",510,165)+arr(id,540,225,660,150,"?","gold",670,145);
        else if(isPeriod) b += `<text class="wv-label" x="425" y="170">T</text><text class="wv-label" x="565" y="85">?</text>`;
        else b += `<text class="wv-label" x="430" y="170">v</text><text class="wv-label" x="565" y="85">?</text>`;
      }
      return frame(b,"Two circular orbits around the same central body; when 4r is stated, the drawn radii use a 1:4 ratio");
    }
    if (qid === "cg-06") {
      b += title("Centripetal-force scaling", "same mass and radius; compare v and 2v");
      b += `<circle class="wv-circle" cx="380" cy="225" r="135"/>${dot(515,225,10)}`+arr(id,515,225,515,125,"v or 2v","blue",525,145)+arr(id,515,225,405,225,"required radial force","red",430,205);
      return frame(b,"Same circular path and mass with two possible speeds");
    }
    if (qid === "cg-07") {
      const th=25*Math.PI/180; const cx=390,cy=230;
      b += title("Frictionless banked curve", "only weight and road normal act on the car");
      b += `<polygon class="wv-banked" points="110,310 650,80 700,155 160,385"/><rect class="wv-car" x="340" y="195" width="105" height="55" transform="rotate(-25 ${cx} ${cy})"/>`;
      b += arr(id,cx,cy,cx-120*Math.sin(th),cy-120*Math.cos(th),"N","blue",cx-75,cy-115)+arr(id,cx,cy,cx,cy+125,"mg","red",cx+15,cy+110)+`<line class="wv-component" x1="${cx}" y1="${cy}" x2="${cx-120*Math.sin(th)}" y2="${cy}"/><line class="wv-component" x1="${cx-120*Math.sin(th)}" y1="${cy}" x2="${cx-120*Math.sin(th)}" y2="${cy-120*Math.cos(th)}"/><path class="wv-angle" d="M165 340 A60 60 0 0 0 220 315"/><text class="wv-label" x="192" y="335">θ</text>`;
      return frame(b,"A car on an ideally banked frictionless curve with weight vertical and normal perpendicular to the road");
    }
    if (qid === "cg-08") {
      b += title("Bottom of a vertical circular path", "center of curvature is above the passenger");
      b += `<circle class="wv-circle" cx="380" cy="210" r="135"/>${dot(380,345,11)}<text class="wv-small" x="395" y="210">center</text>`+arr(id,380,345,380,205,"N","blue",395,225)+arr(id,380,345,380,405,"mg","red",395,395)+arr(id,380,345,500,345,"v","black",455,327);
      return frame(b,"Passenger at the bottom of a vertical circular path with normal force upward and weight downward");
    }
    return "";
  }

  function rotation(qid) {
    const id=uid("rot"); let b=MARKERS(id);
    if (["rot-01","rot-02"].includes(qid)) {
      const radial=qid==="rot-02";
      b += title(radial?"Force line through the pivot":"Door torque", radial?"line of action is radial":"same force, different lever arm");
      b += `<line class="wv-door" x1="180" y1="220" x2="600" y2="220"/><circle class="wv-hinge" cx="180" cy="220" r="13"/><text class="wv-small" x="150" y="250">pivot</text>`;
      if(radial)b += arr(id,500,220,300,220,"F","blue",380,202);
      else b += arr(id,300,220,300,100,"F","gold",315,120)+arr(id,585,220,585,100,"same F","blue",600,120)+`<line class="wv-measure" x1="180" y1="275" x2="300" y2="275"/><line class="wv-measure" x1="180" y1="320" x2="585" y2="320"/><text class="wv-small" x="225" y="300">short r</text><text class="wv-small" x="365" y="345">long r</text>`;
      return frame(b, radial?"A force whose line of action passes through the rotation axis":"A door with the same perpendicular force applied near and far from the hinge");
    }
    if (["rot-04","rot-07"].includes(qid)) {
      const numeric=qid==="rot-07";
      b += title(numeric?"Torque balance with unequal lever arms":"Ideal seesaw equilibrium", "take torques about the pivot");
      b += `<line class="wv-beam" x1="100" y1="215" x2="660" y2="215"/><polygon class="wv-pivot" points="350,330 380,215 410,330"/>`;
      if(numeric){b += arr(id,235,215,235,330,"20 N","red",250,315)+arr(id,670,215,670,330,"F ?","blue",685,315)+`<line class="wv-measure" x1="235" y1="175" x2="380" y2="175"/><text class="wv-small" x="285" y="160">0.20 m</text><line class="wv-measure" x1="380" y1="135" x2="670" y2="135"/><text class="wv-small" x="495" y="120">0.40 m</text>`;} else {b += `<circle class="wv-mass" cx="220" cy="170" r="27"/><circle class="wv-mass goldfill" cx="560" cy="170" r="27"/><text class="wv-label" x="200" y="175">m₁</text><text class="wv-label" x="540" y="175">m₂</text><line class="wv-measure" x1="220" y1="120" x2="380" y2="120"/><text class="wv-small" x="285" y="105">d₁</text><line class="wv-measure" x1="380" y1="90" x2="560" y2="90"/><text class="wv-small" x="455" y="75">d₂</text>`;}
      return frame(b,"A horizontal lever in static equilibrium about a central pivot");
    }
    if (qid === "rot-06") {
      b += title("Rotational dynamics", "net torque causes angular acceleration");
      b += `<circle class="wv-wheelring" cx="380" cy="235" r="105"/><circle class="wv-hinge" cx="380" cy="235" r="11"/><path class="wv-arc blue" d="M465 150 A120 120 0 0 1 500 260"/><text class="wv-label" x="510" y="205">α</text>`+arr(id,275,235,275,125,"τ net","gold",290,145);
      return frame(b,"A rigid body rotating about a fixed axis under a net torque");
    }
    if (qid === "rot-08") {
      b += title("Angular momentum with negligible external torque", "same skater before and after moving arms");
      b += `<circle class="wv-person-head" cx="220" cy="120" r="18"/><line class="wv-person" x1="220" y1="138" x2="220" y2="240"/><line class="wv-person" x1="220" y1="165" x2="115" y2="165"/><line class="wv-person" x1="220" y1="165" x2="325" y2="165"/><circle class="wv-person-head" cx="540" cy="120" r="18"/><line class="wv-person" x1="540" y1="138" x2="540" y2="240"/><line class="wv-person" x1="540" y1="165" x2="505" y2="190"/><line class="wv-person" x1="540" y1="165" x2="575" y2="190"/><path class="wv-arc blue" d="M150 285 A90 55 0 0 1 290 285"/><path class="wv-arc gold" d="M475 285 A90 55 0 0 1 615 285"/><text class="wv-label" x="165" y="330">I₁, ω₁</text><text class="wv-label" x="505" y="330">I₂=I₁/2, ω₂=?</text>`;
      return frame(b,"A rotating person shown once with arms extended and once with arms pulled inward");
    }
    if (qid === "rot-09") {
      b += title("Rolling without slipping", "connect translation and rotation");
      b += `<line class="wv-ground" x1="80" y1="335" x2="690" y2="335"/><circle class="wv-wheelring" cx="340" cy="235" r="100"/><circle class="wv-hinge" cx="340" cy="235" r="8"/><line class="wv-radius" x1="340" y1="235" x2="340" y2="335"/><text class="wv-label" x="355" y="290">R</text>`+arr(id,340,205,520,205,"vCM","blue",430,185)+`<path class="wv-arc gold" d="M275 155 A95 95 0 0 1 410 165"/><text class="wv-label" x="405" y="145">ω</text><circle class="dot-black" cx="340" cy="335" r="8"/><text class="wv-small" x="365" y="360">contact point</text>`;
      return frame(b,"A wheel rolling on a horizontal surface with radius, center-of-mass velocity, and angular velocity shown");
    }
    if (qid === "rot-10") {
      b += title("Point-mass moment of inertia", "same mass at r and 2r");
      b += `<line class="wv-axisvert" x1="190" y1="90" x2="190" y2="350"/><line class="wv-axisvert" x1="500" y1="90" x2="500" y2="350"/><circle class="wv-mass" cx="280" cy="220" r="22"/><circle class="wv-mass goldfill" cx="680" cy="220" r="22"/><line class="wv-measure" x1="190" y1="220" x2="280" y2="220"/><text class="wv-label" x="225" y="205">r</text><line class="wv-measure" x1="500" y1="220" x2="680" y2="220"/><text class="wv-label" x="575" y="205">2r</text><text class="wv-small" x="155" y="380">axis</text><text class="wv-small" x="465" y="380">axis</text>`;
      return frame(b,"The same point mass positioned at distances r and two r from a rotation axis");
    }
    return "";
  }

  function fluids(qid) {
    const id=uid("flu"); let b=MARKERS(id);
    if (qid === "flu-01") {
      b += title("Hydrostatic pressure", "same liquid · same free-surface height");
      b += `<path class="wv-vessel" d="M80 100 L105 345 H235 L260 100"/><path class="wv-vessel" d="M310 100 L330 345 H470 L490 100"/><path class="wv-vessel" d="M540 100 Q600 160 560 345 H700 Q660 160 720 100"/><line class="wv-waterline" x1="92" y1="155" x2="248" y2="155"/><line class="wv-waterline" x1="320" y1="155" x2="480" y2="155"/><line class="wv-waterline" x1="575" y1="155" x2="685" y2="155"/>${dot(170,335,7)}${dot(400,335,7)}${dot(630,335,7)}<line class="wv-measure" x1="50" y1="155" x2="50" y2="335"/><text class="wv-label" x="30" y="250">h</text>`;
      return frame(b,"Three differently shaped vessels containing the same liquid to the same height, with bottom points marked");
    }
    if (qid === "flu-02") {
      b += title("Buoyant force", "object submerged in a fluid");
      b += `<rect class="wv-water" x="120" y="105" width="520" height="250"/><rect class="wv-object" x="310" y="190" width="140" height="100"/>`+arr(id,380,240,380,120,"F_B","blue",395,145)+arr(id,380,240,380,340,"mg","red",395,325);
      return frame(b,"A submerged object with upward buoyant force and downward weight");
    }
    if (qid === "flu-03") {
      b += title("Floating fraction", "ρobject = 600 kg/m³ · ρwater = 1000 kg/m³");
      b += `<rect class="wv-water" x="120" y="160" width="520" height="200"/><rect class="wv-float" x="310" y="105" width="140" height="150"/><line class="wv-waterline" x1="120" y1="160" x2="640" y2="160"/><line class="wv-measure" x1="475" y1="160" x2="475" y2="255"/><text class="wv-label" x="490" y="215">submerged fraction ?</text>`;
      return frame(b,"A floating block with the submerged fraction marked as unknown and both densities provided","Conceptual sketch · submerged depth is intentionally not drawn to scale because it is the unknown");
    }
    if (["flu-04","flu-08"].includes(qid)) {
      const displacement=qid==="flu-08";
      b += title("Ideal hydraulic press", "A₂ = 5A₁");
      b += `<path class="wv-hydraulic" d="M140 110 V335 H580 V110" fill="none"/><rect class="wv-piston" x="112" y="100" width="56" height="18"/><rect class="wv-piston" x="440" y="92" width="280" height="18"/><rect class="wv-fluidfill" x="145" y="245" width="430" height="85"/><text class="wv-label" x="102" y="75">A₁</text><text class="wv-label" x="540" y="68">A₂=5A₁</text>`;
      if(displacement){b += arr(id,140,125,140,210,"x","blue",155,190)+arr(id,580,195,580,125,"x₂ ?","gold",595,145);} else {b += arr(id,140,70,140,145,"F₁","blue",155,125)+arr(id,580,145,580,65,"F₂ ?","gold",595,90);}
      return frame(b,"An ideal hydraulic system with a small piston and a large piston of five times the area","Area labels are exact; visible piston widths use a 1:5 ratio as a teaching cue");
    }
    if (["flu-05","flu-06"].includes(qid)) {
      const bern=qid==="flu-06";
      b += title(bern?"Horizontal Bernoulli comparison":"Continuity in a narrowing pipe", bern?"narrower section has higher speed":"area reduces from A to A/2");
      b += `<path class="wv-pipe" d="M80 155 H290 L360 205 L430 205 L500 155 H680 V315 H500 L430 265 H360 L290 315 H80 Z"/><line class="wv-flow" x1="120" y1="235" x2="625" y2="235"/>`+arr(id,155,235,255,235,"v₁","blue",185,215)+arr(id,385,235,475,235,bern?"faster":"v₂ ?","gold",400,215)+`<text class="wv-label" x="150" y="135">${bern?"P₁":"A"}</text><text class="wv-label" x="385" y="185">${bern?"P₂ ?":"A/2"}</text>`;
      return frame(b,"A horizontal pipe narrowing to a smaller cross-sectional area");
    }
    if (qid === "flu-07") {
      b += title("Torricelli scaling", "compare depths h and 4h");
      b += `<rect class="wv-tank" x="100" y="90" width="230" height="270"/><line class="wv-waterline" x1="100" y1="125" x2="330" y2="125"/><circle class="wv-orifice" cx="330" cy="175" r="7"/><path class="wv-jet blue" d="M337 175 Q405 180 450 215"/><line class="wv-measure" x1="75" y1="125" x2="75" y2="175"/><text class="wv-label" x="50" y="158">h</text><rect class="wv-tank" x="500" y="65" width="180" height="295"/><line class="wv-waterline" x1="500" y1="90" x2="680" y2="90"/><circle class="wv-orifice" cx="680" cy="290" r="7"/><path class="wv-jet gold" d="M687 290 Q725 295 752 335"/><line class="wv-measure" x1="480" y1="90" x2="480" y2="290"/><text class="wv-label" x="445" y="200">4h</text>`;
      return frame(b,"Two large tanks with small side orifices at depths h and four h below their free surfaces","Depth markers use an exact 1:4 ratio; jet lengths are schematic because outlet speed is the unknown");
    }
    if (qid === "flu-09") {
      b += title("Floating ice before melting", "compare the final water level after the ice becomes liquid water");
      b += `<rect class="wv-glass" x="170" y="95" width="180" height="275"/><rect class="wv-water" x="175" y="190" width="170" height="175"/><rect class="wv-ice" x="220" y="140" width="80" height="105"/><line class="wv-waterline" x1="175" y1="190" x2="345" y2="190"/><text class="wv-label" x="215" y="405">before</text><rect class="wv-glass" x="450" y="95" width="180" height="275"/><rect class="wv-water" x="455" y="190" width="170" height="175"/><line class="wv-waterline" x1="455" y1="190" x2="625" y2="190"/><text class="wv-label" x="500" y="405">after ?</text>`;
      return frame(b,"A glass with floating ice before melting and a second glass asking for the final water level");
    }
    if (qid === "flu-10") {
      b += title("Same depth, different vessel shape", "compare ideal efflux speeds");
      b += `<path class="wv-vessel" d="M90 90 L110 355 H315 L335 90"/><path class="wv-vessel" d="M450 90 Q560 155 490 355 H700 Q630 155 740 90"/><line class="wv-waterline" x1="100" y1="125" x2="325" y2="125"/><line class="wv-waterline" x1="485" y1="125" x2="705" y2="125"/><circle class="wv-orifice" cx="315" cy="285" r="7"/><circle class="wv-orifice" cx="700" cy="285" r="7"/><path class="wv-jet blue" d="M322 285 Q380 292 420 335"/><path class="wv-jet gold" d="M707 285 Q735 290 755 315"/><line class="wv-measure" x1="70" y1="125" x2="70" y2="285"/><line class="wv-measure" x1="430" y1="125" x2="430" y2="285"/><text class="wv-label" x="45" y="215">h</text><text class="wv-label" x="405" y="215">h</text><text class="wv-small" x="230" y="390">v₁ ?</text><text class="wv-small" x="590" y="390">v₂ ?</text>`;
      return frame(b,"Two differently shaped tanks with small orifices at the same depth below the free surface");
    }
    return "";
  }

  const renderers = [vectors, kinematics, dynamics, energy, momentum, circular, rotation, fluids];
  function renderQuestion(question) {
    for (const fn of renderers) {
      const out = fn(question.id);
      if (out) return out;
    }
    return "";
  }

  window.PhysicsOlympiadWorkshopVisuals = Object.freeze({ renderQuestion });
})();