(() => {
  const api = window.PhysicsOlympiadWorkshopVisuals;
  if (!api?.renderQuestion) return;
  const original = api.renderQuestion.bind(api);
  let seq = 0;
  const uid = () => `fix-${++seq}`;
  const mark = (id) => `<defs><marker id="${id}-b" markerWidth="10" markerHeight="10" refX="8.4" refY="5" orient="auto"><path class="mk-blue" d="M0,0 L10,5 L0,10 z"/></marker><marker id="${id}-g" markerWidth="10" markerHeight="10" refX="8.4" refY="5" orient="auto"><path class="mk-gold" d="M0,0 L10,5 L0,10 z"/></marker><marker id="${id}-r" markerWidth="10" markerHeight="10" refX="8.4" refY="5" orient="auto"><path class="mk-red" d="M0,0 L10,5 L0,10 z"/></marker><marker id="${id}-k" markerWidth="10" markerHeight="10" refX="8.4" refY="5" orient="auto"><path class="mk-black" d="M0,0 L10,5 L0,10 z"/></marker></defs>`;
  const arrow=(id,x1,y1,x2,y2,label,cls="blue",tx=x2+8,ty=y2-8)=>`<line class="wv-arrow ${cls}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" marker-end="url(#${id}-${cls==='gold'?'g':cls==='red'?'r':cls==='black'?'k':'b'})"/><text class="wv-label" x="${tx}" y="${ty}">${label}</text>`;
  const head=(t,s)=>`<text class="wv-title" x="380" y="34" text-anchor="middle">${t}</text><text class="wv-subtitle" x="380" y="58" text-anchor="middle">${s}</text>`;
  const frame=(body,label,note="Esquema físico · no necesariamente a escala")=>`<figure class="workshop-figure" role="img" aria-label="${label}"><div class="workshop-figure-stage"><svg class="workshop-svg" viewBox="0 0 760 420" aria-hidden="true">${body}</svg></div><figcaption>${note}</figcaption></figure>`;

  function fixed(qid){
    const id=uid(); let b=mark(id);
    if(qid==="kin-04"){
      b+=head("Top of a vertical throw","velocity can be zero while acceleration remains downward");
      b+=`<line class="wv-ground" x1="120" y1="345" x2="640" y2="345"/><path class="wv-dash" d="M380 330 L380 115"/><circle class="dot-blue" cx="380" cy="115" r="10"/><text class="wv-label" x="400" y="120">v = 0</text>${arrow(id,380,130,380,245,"a = −g","red",395,220)}`;
      return frame(b,"Object at the top of a vertical throw with zero velocity and downward acceleration");
    }
    if(qid==="dyn-03"||qid==="dyn-08"){
      const stat=qid==="dyn-08", deg=stat?30:28, th=deg*Math.PI/180, x0=120,y0=340,x1=650,y1=y0-(x1-x0)*Math.tan(th),cx=430,cy=y0-(cx-x0)*Math.tan(th)-35;
      const nx=cx-95*Math.sin(th),ny=cy-95*Math.cos(th),downx=cx-120*Math.cos(th),downy=cy+120*Math.sin(th),upx=cx+120*Math.cos(th),upy=cy-120*Math.sin(th);
      b+=head("Inclined-plane free-body diagram",stat?"30° · block at rest":"block sliding upward · angle θ");
      b+=`<polygon class="wv-ramp" points="${x0},${y0} ${x1},${y0} ${x1},${y1}"/><rect class="wv-block" x="${cx-45}" y="${cy-30}" width="90" height="60" transform="rotate(-${deg} ${cx} ${cy})"/>${arrow(id,cx,cy,nx,ny,"N","blue",nx-20,ny-10)}${arrow(id,cx,cy,cx,cy+120,"mg","red",cx+15,cy+110)}`;
      if(stat)b+=arrow(id,cx,cy,upx,upy,"fₛ","gold",upx-5,upy-10);else b+=arrow(id,cx,cy,downx,downy,"fₖ","gold",downx-35,downy+20)+arrow(id,cx,cy,cx+105*Math.cos(th),cy-105*Math.sin(th),"v","black",cx+90,cy-70);
      b+=`<path class="wv-angle" d="M590 340 A55 55 0 0 0 ${590-55*Math.cos(th)} ${340-55*Math.sin(th)}"/><text class="wv-label" x="560" y="315">${stat?"30°":"θ"}</text>`;
      return frame(b,"Inclined-plane free-body diagram with normal exactly perpendicular to the surface and weight vertical","Force directions are physical; arrow lengths are not a magnitude scale");
    }
    if(qid==="ene-08"){
      b+=head("Minimum height to complete a loop","frictionless track · loop radius R");
      b+=`<path class="wv-track black" d="M95 95 Q210 95 320 340 H500"/><circle class="wv-circle" cx="500" cy="240" r="100"/><line class="wv-track black" x1="500" y1="340" x2="690" y2="340"/><circle class="dot-blue" cx="115" cy="95" r="10"/><line class="wv-measure" x1="75" y1="95" x2="75" y2="340"/><text class="wv-label" x="50" y="225">h</text><line class="wv-radius" x1="500" y1="240" x2="500" y2="140"/><text class="wv-label" x="515" y="190">R</text><circle class="dot-gold" cx="500" cy="140" r="9"/>`;
      return frame(b,"A continuous frictionless track entering a vertical loop of radius R from starting height h");
    }
    if(qid==="ene-10"){
      b+=head("Stopping distance with constant kinetic friction","compare v and 2v without using drawn length as the answer");
      b+=`<line class="wv-ground" x1="70" y1="165" x2="690" y2="165"/><rect class="wv-block" x="110" y="95" width="100" height="70"/>${arrow(id,210,115,330,115,"v","blue",260,95)}${arrow(id,155,135,85,135,"fₖ","red",72,120)}<line class="wv-measure" x1="210" y1="195" x2="470" y2="195"/><text class="wv-label" x="320" y="220">d</text><line class="wv-ground" x1="70" y1="340" x2="690" y2="340"/><rect class="wv-block" x="110" y="270" width="100" height="70"/>${arrow(id,210,290,390,290,"2v","gold",285,270)}${arrow(id,155,310,85,310,"same fₖ","red",65,295)}<line class="wv-measure" x1="210" y1="370" x2="470" y2="370"/><text class="wv-label" x="310" y="398">d₂ ?</text>`;
      return frame(b,"Two identical friction-braking cases with unknown second stopping distance","Distance brackets are intentionally the same drawn size so the figure does not reveal the scaling answer");
    }
    if(qid==="cg-07"){
      const deg=25,th=deg*Math.PI/180,x0=115,y0=325,x1=650,y1=y0-(x1-x0)*Math.tan(th),w=62,ox=w*Math.sin(th),oy=w*Math.cos(th),cx=405,surfaceY=y0-(cx-x0)*Math.tan(th),cy=surfaceY-26*Math.cos(th),nx=cx-120*Math.sin(th),ny=cy-120*Math.cos(th);
      b+=head("Frictionless banked curve","normal is perpendicular to the road; weight is vertical");
      b+=`<polygon class="wv-banked" points="${x0},${y0} ${x1},${y1} ${x1+ox},${y1+oy} ${x0+ox},${y0+oy}"/><rect class="wv-car" x="${cx-52}" y="${cy-28}" width="104" height="56" transform="rotate(-${deg} ${cx} ${cy})"/>${arrow(id,cx,cy,nx,ny,"N","blue",nx-18,ny-10)}${arrow(id,cx,cy,cx,cy+125,"mg","red",cx+15,cy+110)}<line class="wv-component" x1="${cx}" y1="${cy}" x2="${nx}" y2="${cy}"/><line class="wv-component" x1="${nx}" y1="${cy}" x2="${nx}" y2="${ny}"/><path class="wv-angle" d="M175 325 A60 60 0 0 0 ${175+60*Math.cos(th)} ${325-60*Math.sin(th)}"/><text class="wv-label" x="205" y="310">θ</text>`;
      return frame(b,"Car on an ideally banked frictionless road with geometrically consistent normal and road angle");
    }
    if(qid==="rot-02"){
      b+=head("Force line through the pivot","radial line of action");
      b+=`<line class="wv-door" x1="180" y1="220" x2="600" y2="220"/><circle class="wv-hinge" cx="180" cy="220" r="13"/><text class="wv-small" x="150" y="250">pivot</text><line class="wv-dash" x1="180" y1="220" x2="650" y2="220"/>${arrow(id,500,220,300,220,"F","blue",380,202)}`;
      return frame(b,"Force applied along a line whose extension passes through the pivot");
    }
    if(qid==="rot-07"){
      b+=head("Torque balance with unequal lever arms","0.40 m arm is exactly twice the 0.20 m arm");
      b+=`<line class="wv-beam" x1="100" y1="215" x2="680" y2="215"/><polygon class="wv-pivot" points="350,330 380,215 410,330"/>${arrow(id,245,215,245,330,"20 N","red",260,315)}${arrow(id,650,215,650,330,"F ?","blue",665,315)}<line class="wv-measure" x1="245" y1="175" x2="380" y2="175"/><text class="wv-small" x="290" y="160">0.20 m</text><line class="wv-measure" x1="380" y1="135" x2="650" y2="135"/><text class="wv-small" x="490" y="120">0.40 m</text>`;
      return frame(b,"Lever with a one-to-two ratio of the stated lever-arm distances");
    }
    if(qid==="flu-05"||qid==="flu-06"){
      const bern=qid==="flu-06";
      b+=head(bern?"Horizontal Bernoulli comparison":"Continuity in a narrowing pipe",bern?"narrower section has higher speed":"cross-sectional proxy height changes from A to A/2");
      b+=`<path class="wv-pipe" d="M80 155 H290 L360 195 L430 195 L500 155 H680 V315 H500 L430 275 H360 L290 315 H80 Z"/><line class="wv-flow" x1="120" y1="235" x2="625" y2="235"/>${arrow(id,155,235,255,235,"v₁","blue",185,215)}${arrow(id,385,235,475,235,bern?"faster":"v₂ ?","gold",400,215)}<text class="wv-label" x="150" y="135">${bern?"P₁":"A"}</text><text class="wv-label" x="385" y="180">${bern?"P₂ ?":"A/2"}</text>`;
      return frame(b,"Horizontal pipe with the narrow section drawn at half the wide-section height as a 2D area cue");
    }
    if(qid==="flu-09"){
      b+=head("Floating ice before melting","determine the final level rather than reading it from the picture");
      b+=`<rect class="wv-glass" x="170" y="95" width="180" height="275"/><rect class="wv-water" x="175" y="190" width="170" height="175"/><rect class="wv-ice" x="220" y="140" width="80" height="105"/><line class="wv-waterline" x1="175" y1="190" x2="345" y2="190"/><text class="wv-label" x="215" y="405">before</text><rect class="wv-glass" x="450" y="95" width="180" height="275"/><text class="wv-label" x="490" y="220">final level ?</text><text class="wv-label" x="500" y="405">after</text>`;
      return frame(b,"Floating ice before melting and an unresolved second glass for the final level","The second panel intentionally omits a waterline so the diagram does not give away the answer");
    }
    if(qid==="flu-10"){
      b+=head("Same depth, different vessel shape","compare ideal efflux speeds from the given geometry");
      b+=`<path class="wv-vessel" d="M90 90 L110 355 H315 L335 90"/><path class="wv-vessel" d="M450 90 Q560 155 490 355 H700 Q630 155 740 90"/><line class="wv-waterline" x1="100" y1="125" x2="325" y2="125"/><line class="wv-waterline" x1="485" y1="125" x2="705" y2="125"/><circle class="wv-orifice" cx="315" cy="285" r="7"/><circle class="wv-orifice" cx="700" cy="285" r="7"/><line class="wv-measure" x1="70" y1="125" x2="70" y2="285"/><line class="wv-measure" x1="430" y1="125" x2="430" y2="285"/><text class="wv-label" x="45" y="215">h</text><text class="wv-label" x="405" y="215">h</text><text class="wv-small" x="260" y="305">v₁ ?</text><text class="wv-small" x="645" y="305">v₂ ?</text>`;
      return frame(b,"Two differently shaped vessels with outlet holes at exactly the same depth below their free surfaces","Jet lengths are omitted because they would visually imply the unknown speed comparison");
    }
    return "";
  }

  window.PhysicsOlympiadWorkshopVisuals = Object.freeze({
    renderQuestion(question){ return fixed(question?.id) || original(question); }
  });
})();