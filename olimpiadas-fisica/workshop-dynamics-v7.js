(() => {
  const base = window.PhysicsOlympiadWorkshopVisuals;
  if (!base?.renderQuestion) return;
  const original = base.renderQuestion.bind(base);
  let seq = 0;
  const uid = () => `dyn7-${++seq}`;
  const esc = (v) => String(v ?? '').replace(/[&<>\"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

  const defs = (id) => `<defs>
    <marker id="${id}-blue" markerWidth="13" markerHeight="13" refX="11" refY="6.5" orient="auto" markerUnits="userSpaceOnUse"><path class="dyn7-mk-blue" d="M0,0 L13,6.5 L0,13 z"/></marker>
    <marker id="${id}-gold" markerWidth="13" markerHeight="13" refX="11" refY="6.5" orient="auto" markerUnits="userSpaceOnUse"><path class="dyn7-mk-gold" d="M0,0 L13,6.5 L0,13 z"/></marker>
    <marker id="${id}-red" markerWidth="13" markerHeight="13" refX="11" refY="6.5" orient="auto" markerUnits="userSpaceOnUse"><path class="dyn7-mk-red" d="M0,0 L13,6.5 L0,13 z"/></marker>
    <marker id="${id}-ink" markerWidth="13" markerHeight="13" refX="11" refY="6.5" orient="auto" markerUnits="userSpaceOnUse"><path class="dyn7-mk-ink" d="M0,0 L13,6.5 L0,13 z"/></marker>
  </defs>`;
  const title = (t,s='') => `<text class="dyn7-title" x="410" y="34" text-anchor="middle">${esc(t)}</text>${s?`<text class="dyn7-subtitle" x="410" y="58" text-anchor="middle">${esc(s)}</text>`:''}`;
  const arrow = (id,x1,y1,x2,y2,label,cls='blue',tx=x2+10,ty=y2-8,extra='') => `<line class="dyn7-arrow ${cls} ${extra}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" marker-end="url(#${id}-${cls})"/><text class="dyn7-label" x="${tx}" y="${ty}">${esc(label)}</text>`;
  const frame = (body,label,note='Direcciones físicas validadas · longitudes de flecha no representan magnitudes') => `<figure class="workshop-figure dyn7-figure" role="img" aria-label="${esc(label)}"><div class="workshop-figure-stage dyn7-stage"><svg class="workshop-svg dyn7-svg" viewBox="0 0 820 460" aria-hidden="true">${body}</svg></div><figcaption>${esc(note)}</figcaption></figure>`;
  const fbdPoint = (x,y) => `<circle class="dyn7-fbd-point" cx="${x}" cy="${y}" r="7"/>`;

  function elevator(qid) {
    const id=uid(); const slowing=qid==='dyn-01';
    let b=defs(id)+title('Elevator: separate motion from forces', slowing?'moving downward · slowing down ⇒ acceleration upward':'accelerating upward');
    b += `<g class="dyn7-scene"><rect class="dyn7-cab" x="80" y="95" width="265" height="280" rx="5"/><line class="dyn7-floor" x1="95" y1="330" x2="330" y2="330"/><rect class="dyn7-scale" x="176" y="309" width="72" height="20" rx="3"/><circle class="dyn7-person-head" cx="212" cy="178" r="20"/><line class="dyn7-person" x1="212" y1="198" x2="212" y2="270"/><line class="dyn7-person" x1="212" y1="220" x2="175" y2="252"/><line class="dyn7-person" x1="212" y1="220" x2="249" y2="252"/><line class="dyn7-person" x1="212" y1="270" x2="190" y2="309"/><line class="dyn7-person" x1="212" y1="270" x2="234" y2="309"/><text class="dyn7-small" x="150" y="402">physical scene</text></g>`;
    if (slowing) b += arrow(id,315,160,315,265,'v','gold',330,250)+arrow(id,365,265,365,150,'a','ink',380,170);
    else b += arrow(id,365,265,365,150,'a','ink',380,170);
    b += `<line class="dyn7-divider" x1="410" y1="92" x2="410" y2="390"/><text class="dyn7-panel-title" x="590" y="105" text-anchor="middle">FBD — person only</text>${fbdPoint(590,245)}`;
    b += arrow(id,590,240,590,125,'N','blue',607,145)+arrow(id,590,250,590,365,'mg','red',607,350);
    b += `<line class="dyn7-axis" x1="735" y1="310" x2="735" y2="180"/><path class="dyn7-axis-head" d="M729 190 L735 178 L741 190"/><text class="dyn7-small" x="748" y="195">+y</text><text class="dyn7-small" x="492" y="405">Motion arrows (v,a) are not forces.</text>`;
    return frame(b, slowing?'Elevator moving downward while slowing: velocity down, acceleration up, with normal and weight on the person':'Elevator accelerating upward with normal and weight on the person');
  }

  function dyn02() {
    const id=uid(); let b=defs(id)+title('Constant velocity on an ideal horizontal surface','velocity describes motion; forces describe interactions');
    b += `<line class="dyn7-ground" x1="70" y1="320" x2="390" y2="320"/><circle class="dyn7-disc" cx="210" cy="286" r="34"/>`;
    b += arrow(id,250,250,365,250,'v = constant','ink',272,228);
    b += `<line class="dyn7-divider" x1="420" y1="92" x2="420" y2="390"/><text class="dyn7-panel-title" x="605" y="105" text-anchor="middle">FBD — disk</text>${fbdPoint(605,245)}`;
    b += arrow(id,605,240,605,135,'N','blue',622,154)+arrow(id,605,250,605,355,'mg','red',622,340);
    b += `<text class="dyn7-small" x="505" y="405">Ideal surface: no friction force.</text>`;
    return frame(b,'Disk moving at constant velocity on an ideal surface, with a separate free-body diagram showing only normal and weight');
  }

  function incline(qid) {
    const id=uid(); const stat=qid==='dyn-08'; const deg=stat?30:28; const th=deg*Math.PI/180;
    const x0=105,y0=375,x1=705,y1=y0-(x1-x0)*Math.tan(th);
    const sx=445, sy=y0-(sx-x0)*Math.tan(th); const bw=112,bh=64,off=bh/2+3;
    const cx=sx-off*Math.sin(th), cy=sy-off*Math.cos(th);
    const nx=cx-118*Math.sin(th), ny=cy-118*Math.cos(th);
    const upx=cx+135*Math.cos(th), upy=cy-135*Math.sin(th);
    const downx=cx-135*Math.cos(th), downy=cy+135*Math.sin(th);
    let b=defs(id)+title('Inclined-plane free-body diagram',stat?'30° · block at rest · tendency to slide down':'block sliding upward · angle θ');
    b += `<polygon class="dyn7-ramp" points="${x0},${y0} ${x1},${y0} ${x1},${y1}"/><line class="dyn7-surface" x1="${x0}" y1="${y0}" x2="${x1}" y2="${y1}"/><rect class="dyn7-block" x="${cx-bw/2}" y="${cy-bh/2}" width="${bw}" height="${bh}" rx="4" transform="rotate(-${deg} ${cx} ${cy})"/><circle class="dyn7-contact" cx="${sx}" cy="${sy}" r="4"/>`;
    b += arrow(id,cx,cy,nx,ny,'N','blue',nx-16,ny-9)+arrow(id,cx,cy,cx,cy+132,'mg','red',cx+14,cy+117);
    if (stat) b += arrow(id,cx,cy,upx,upy,'fₛ','gold',upx-8,upy-10);
    else b += arrow(id,cx,cy,downx,downy,'fₖ','gold',downx-35,downy+22)+arrow(id,cx,cy,upx,upy,'v','ink',upx-5,upy-10);
    const ar=72, ax0=x0+ar, ay0=y0, ax1=x0+ar*Math.cos(th), ay1=y0-ar*Math.sin(th);
    b += `<path class="dyn7-angle" d="M${ax0} ${ay0} A${ar} ${ar} 0 0 0 ${ax1} ${ay1}"/><text class="dyn7-angle-label" x="${x0+50}" y="${y0-18}">${stat?'30°':'θ'}</text><line class="dyn7-axis-guide" x1="${cx-100*Math.cos(th)}" y1="${cy+100*Math.sin(th)}" x2="${cx+100*Math.cos(th)}" y2="${cy-100*Math.sin(th)}"/><line class="dyn7-axis-guide" x1="${cx-75*Math.sin(th)}" y1="${cy-75*Math.cos(th)}" x2="${cx+75*Math.sin(th)}" y2="${cy+75*Math.cos(th)}"/>`;
    return frame(b,stat?'Block at rest on a 30-degree incline with normal perpendicular, weight vertical, and static friction up the plane':'Block sliding upward on an incline with kinetic friction down the plane, weight vertical, and normal perpendicular');
  }

  function dyn04() {
    const id=uid(); let b=defs(id)+title('Connected blocks on a frictionless table','show forces where they act along the string');
    b += `<line class="dyn7-ground" x1="65" y1="330" x2="755" y2="330"/><rect class="dyn7-block" x="145" y="235" width="135" height="95" rx="4"/><rect class="dyn7-block" x="390" y="220" width="170" height="110" rx="4"/><line class="dyn7-rope" x1="280" y1="282" x2="390" y2="282"/><text class="dyn7-mass" x="212" y="292" text-anchor="middle">2 kg</text><text class="dyn7-mass" x="475" y="282" text-anchor="middle">3 kg</text>`;
    b += arrow(id,212,282,335,282,'T','gold',300,262)+arrow(id,475,282,350,282,'T','gold',360,306)+arrow(id,560,267,720,267,'10 N','blue',642,247);
    b += `<text class="dyn7-small" x="245" y="385">string pulls each block toward the other</text><text class="dyn7-small" x="540" y="385">vertical forces balance; surface is frictionless</text>`;
    return frame(b,'Two connected blocks on a frictionless table, with tension arrows along the string on each block and a ten-newton force on the three-kilogram block');
  }

  function dyn05() {
    const id=uid(); let b=defs(id)+title('Newton III during contact','force pair acts on different vehicles');
    b += `<line class="dyn7-ground" x1="70" y1="330" x2="750" y2="330"/><g class="dyn7-car"><rect x="145" y="245" width="155" height="60" rx="12"/><path d="M180 245 L215 205 H270 L300 245 Z"/><circle cx="185" cy="315" r="18"/><circle cx="270" cy="315" r="18"/></g><g class="dyn7-truck"><rect x="500" y="205" width="190" height="100" rx="8"/><rect x="455" y="245" width="75" height="60" rx="6"/><circle cx="500" cy="315" r="20"/><circle cx="645" cy="315" r="20"/></g><line class="dyn7-contact-line" x1="380" y1="195" x2="380" y2="325"/><text class="dyn7-small" x="380" y="180" text-anchor="middle">contact interface</text>`;
    b += arrow(id,300,265,155,265,'F truck→car','red',105,242)+arrow(id,455,265,600,265,'F car→truck','blue',515,242);
    return frame(b,'Small car and heavy truck in frontal contact, with the two interaction forces shown on different bodies','Interaction directions are physical; arrow lengths are intentionally schematic.');
  }

  function dyn07() {
    const id=uid(); let b=defs(id)+title('Ideal Atwood machine','same string · opposite accelerations');
    b += `<circle class="dyn7-pulley" cx="410" cy="120" r="66"/><path class="dyn7-rope" d="M344 315 L344 120 C344 34 476 34 476 120 L476 300"/><rect class="dyn7-block" x="289" y="255" width="110" height="100" rx="4"/><rect class="dyn7-block" x="416" y="225" width="120" height="135" rx="4"/><text class="dyn7-mass" x="344" y="315" text-anchor="middle">m</text><text class="dyn7-mass" x="476" y="300" text-anchor="middle">2m</text>`;
    b += arrow(id,344,285,344,205,'T','blue',360,220)+arrow(id,344,320,344,405,'mg','red',360,392)+arrow(id,476,260,476,180,'T','blue',492,195)+arrow(id,476,315,476,415,'2mg','red',492,402);
    b += arrow(id,245,310,245,205,'a','ink',260,225)+arrow(id,575,235,575,350,'a','gold',590,338);
    b += `<text class="dyn7-small" x="95" y="420">m moves up</text><text class="dyn7-small" x="625" y="420">2m moves down</text>`;
    return frame(b,'Ideal Atwood machine with masses m and two m, a continuous rope over the pulley, tensions upward, weights downward, and opposite accelerations');
  }

  function dyn09() {
    const id=uid(); const th=28*Math.PI/180, cx=385,cy=270,L=165,fx=cx+L*Math.cos(th),fy=cy+L*Math.sin(th);
    let b=defs(id)+title('Oblique push below the horizontal','vertical component of F points downward');
    b += `<line class="dyn7-ground" x1="90" y1="350" x2="720" y2="350"/><rect class="dyn7-block" x="300" y="210" width="170" height="140" rx="5"/>${fbdPoint(cx,cy)}`;
    b += arrow(id,cx,cy,cx,125,'N','blue',402,145)+arrow(id,cx,cy,cx,420,'mg','red',402,405)+arrow(id,cx,cy,fx,fy,'F','gold',fx+8,fy+6);
    b += `<line class="dyn7-component" x1="${cx}" y1="${cy}" x2="${fx}" y2="${cy}"/><line class="dyn7-component" x1="${fx}" y1="${cy}" x2="${fx}" y2="${fy}"/><text class="dyn7-small" x="${(cx+fx)/2-15}" y="${cy-12}">F cosθ</text><text class="dyn7-small" x="${fx+12}" y="${(cy+fy)/2}">F sinθ</text><path class="dyn7-angle" d="M${cx+60} ${cy} A60 60 0 0 1 ${cx+60*Math.cos(th)} ${cy+60*Math.sin(th)}"/><text class="dyn7-angle-label" x="${cx+70}" y="${cy+28}">θ</text>`;
    return frame(b,'Block on a horizontal table with normal upward, weight downward, and an applied force directed below the horizontal with correctly placed angle and components');
  }

  function dyn10() {
    const id=uid(); const cx=410,cy=265,r=135,topY=cy-r;
    let b=defs(id)+title('Top of a vertical circle','limiting case: the string is just taut');
    b += `<circle class="dyn7-circle" cx="${cx}" cy="${cy}" r="${r}"/><line class="dyn7-string" x1="${cx}" y1="${topY}" x2="${cx}" y2="${cy}"/><circle class="dyn7-mass-dot" cx="${cx}" cy="${topY}" r="12"/><circle class="dyn7-center" cx="${cx}" cy="${cy}" r="5"/><text class="dyn7-small" x="${cx+16}" y="${(topY+cy)/2}">r</text>`;
    b += arrow(id,cx,topY,cx,topY+118,'mg','red',cx+17,topY+102)+arrow(id,cx+12,topY,cx+145,topY,'v','ink',cx+105,topY-14);
    b += `<line class="dyn7-limit" x1="${cx-22}" y1="${topY+5}" x2="${cx-22}" y2="${topY+70}"/><text class="dyn7-small" x="${cx-92}" y="${topY+82}">T → 0 at the limit</text><text class="dyn7-small" x="${cx+25}" y="${cy+15}">center</text>`;
    return frame(b,'Mass at the top of a vertical circle: velocity tangent, gravity toward the center, and string tension tending to zero in the limiting just-taut case','At the limiting case the tension has zero magnitude, so it is labeled as T → 0 rather than drawn as a finite force arrow.');
  }

  function render(question) {
    switch (question?.id) {
      case 'dyn-01': return elevator('dyn-01');
      case 'dyn-02': return dyn02();
      case 'dyn-03': return incline('dyn-03');
      case 'dyn-04': return dyn04();
      case 'dyn-05': return dyn05();
      case 'dyn-06': return elevator('dyn-06');
      case 'dyn-07': return dyn07();
      case 'dyn-08': return incline('dyn-08');
      case 'dyn-09': return dyn09();
      case 'dyn-10': return dyn10();
      default: return '';
    }
  }

  window.PhysicsOlympiadWorkshopVisuals = Object.freeze({
    renderQuestion(question) { return render(question) || original(question); },
    dynamicsVisualVersion: 'workshop-dynamics-v7'
  });
})();
