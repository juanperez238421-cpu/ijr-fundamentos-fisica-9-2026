(() => {
  const Q = [
    {topic:'Álgebra',q:'Dos números reales positivos \(a,b\) satisfacen \(a+b=10\) y \(\sqrt{ab}=4\). ¿Cuánto vale \(\sqrt a+\sqrt b\)?',o:['\(3\sqrt2\)','\(2\sqrt5\)','\(5\)','\(\sqrt{10}\)','\(4\)'],a:0,s:'Eleva al cuadrado la suma pedida: \((\sqrt a+\sqrt b)^2=a+b+2\sqrt{ab}=10+8=18\). Como la suma es positiva, \(\sqrt a+\sqrt b=\sqrt{18}=3\sqrt2\).'},
    {topic:'Dinámica',q:'Dos bloques de masas \(4m\) y \(m\) están en contacto sobre una superficie lisa. En el caso I una fuerza horizontal \(F\) empuja el bloque \(4m\); en el caso II la misma fuerza empuja el bloque \(m\) desde el otro extremo. Determine \(a_1/a_2\).',o:['\(1/5\)','\(1\)','\(4\)','\(5/4\)','\(4/5\)'],a:1,s:'Toma ambos bloques como un solo sistema. En ambos casos la fuerza externa es \(F\) y la masa total es \(5m\), por tanto \(a_1=a_2=F/(5m)\). Las fuerzas de contacto cambian, pero la aceleración del sistema no.'},
    {topic:'Estática',q:'Un bloque rectangular tiene longitud de base \(L\) medida sobre una rampa y altura \(2L\) medida normal a ella. La rampa aumenta lentamente su inclinación y existe suficiente fricción para impedir deslizamiento. ¿A qué ángulo comienza a volcar?',o:['\(\arctan(1/2)\)','\(\pi/4\)','\(\arctan 2\)','\(\pi/6\)','\(\pi/3\)'],a:0,s:'El vuelco comienza cuando la vertical del centro de masa pasa por el borde inferior. Para base \(b=L\) y altura \(h=2L\), \(\tan\theta_c=b/h=1/2\). Así, \(\theta_c=\arctan(1/2)\).'},
    {topic:'Energía',q:'Un recipiente vertical de sección constante \(A=0.020\,\mathrm{m^2}\) contiene inicialmente \(1\,\mathrm{kg}\) de agua. Se agregan lentamente \(3\,\mathrm{kg}\) más. Use \(\rho=1000\,\mathrm{kg/m^3}\) y \(g=10\,\mathrm{m/s^2}\). ¿Cuál es el aumento de energía potencial gravitacional del agua?',o:['\(2.5\,\mathrm J\)','\(3.0\,\mathrm J\)','\(3.75\,\mathrm J\)','\(4.0\,\mathrm J\)','\(7.5\,\mathrm J\)'],a:2,s:'Para una columna uniforme, \(U=gm^2/(2\rho A)\). Inicialmente \(U_i=10(1)^2/(2\cdot1000\cdot0.02)=0.25\,J\). Finalmente \(U_f=10(4)^2/40=4\,J\). Entonces \(\Delta U=3.75\,J\).'},
    {topic:'Identidades',q:'Sea \(P=\sin^4x+\cos^4x\) y \(Q=\sin^6x+\cos^6x\). El valor de \(3P-2Q\) es:',o:['\(0\)','\(1/2\)','\(1\)','\(\sin^2(2x)\)','depende de \(x\)'],a:2,s:'Con \(u=\sin^2x\), \(v=\cos^2x\), se tiene \(u+v=1\). Entonces \(P=1-2uv\) y \(Q=1-3uv\). Por ello \(3P-2Q=3-6uv-2+6uv=1\).'},
    {topic:'Choque + circular',q:'Una partícula de masa \(2m\) choca elásticamente y de frente con una masa \(m\) inicialmente en reposo, suspendida de una cuerda de longitud \(L\). Después del choque, la masa suspendida describe un péndulo cónico de ángulo \(\theta\). ¿Cuál debía ser la rapidez inicial \(u\) de la partícula?',o:['\(\sin\theta\sqrt{gL/\cos\theta}\)','\(\frac34\sin\theta\sqrt{gL/\cos\theta}\)','\(\frac43\sin\theta\sqrt{gL/\cos\theta}\)','\(\sqrt{gL\tan\theta}\)','\(\frac12\sqrt{gL}\)'],a:1,s:'En un choque elástico frontal con \(m_1=2m\), \(m_2=m\) y blanco en reposo, la rapidez adquirida por el blanco es \(v=2m_1u/(m_1+m_2)=4u/3\). Para el péndulo cónico, \(v=\sin\theta\sqrt{gL/\cos\theta}\). Por tanto \(u=(3/4)v\).'},
    {topic:'Complementaria',q:'Un bloque de \(2\,\mathrm{kg}\) parte del reposo desde una altura vertical de \(5\,\mathrm m\). Durante el recorrido, la fricción disipa \(20\,\mathrm J\). Use \(g=10\,\mathrm{m/s^2}\). ¿Con qué rapidez llega al final?',o:['\(4\,\mathrm{m/s}\)','\(4\sqrt5\,\mathrm{m/s}\)','\(5\sqrt2\,\mathrm{m/s}\)','\(8\,\mathrm{m/s}\)','\(10\,\mathrm{m/s}\)'],a:1,s:'La energía disponible es \(mgh-W_f=2\cdot10\cdot5-20=80\,J\). Como \(K=\tfrac12mv^2=v^2\) para \(m=2\), resulta \(v^2=80\), luego \(v=4\sqrt5\,m/s\).'},
    {topic:'Teoría de números',q:'Tres enteros positivos consecutivos son \(n-1,n,n+1\). Su suma es un cuadrado perfecto y el número central \(n\) es un cubo perfecto. ¿Cuál es el menor valor posible de la raíz cuadrada de la suma?',o:['\(3\)','\(6\)','\(9\)','\(12\)','\(15\)'],a:2,s:'La suma es \(3n\). Probamos cubos positivos: \(n=1\Rightarrow3\) no es cuadrado; \(n=8\Rightarrow24\) no; \(n=27\Rightarrow81=9^2\). El mínimo pedido es 9.'},
    {topic:'Fricción estática',q:'Un bloque de \(3\,\mathrm{kg}\) comprime \(0.50\,\mathrm m\) un resorte de constante \(12\,\mathrm{N/m}\) sobre una superficie con \(\mu_s=0.25\). Use \(g=10\,\mathrm{m/s^2}\). Al soltarlo, ¿qué ocurre inicialmente?',o:['Acelera hacia la izquierda','Acelera hacia la derecha','Permanece en reposo','Oscila alrededor del equilibrio','No puede determinarse'],a:2,s:'El resorte ejerce \(F_s=kx=6\,N\). La fricción estática máxima es \(\mu_smg=0.25\cdot3\cdot10=7.5\,N\). Como puede equilibrar los 6 N, el bloque permanece en reposo.'},
    {topic:'Trigonometría',q:'Si \(-\pi/8\le\theta\le\pi/8\), simplifique \(\sqrt{\tfrac12+\tfrac12\sqrt{\tfrac12+\tfrac12\cos(8\theta)}}\).',o:['\(\cos\theta\)','\(\cos2\theta\)','\(\cos4\theta\)','\(\sqrt{\cos\theta}\)','\(1\)'],a:1,s:'El radical interior vale \(\sqrt{(1+\cos8\theta)/2}=|\cos4\theta|=\cos4\theta\) en el intervalo dado. El exterior queda \(\sqrt{(1+\cos4\theta)/2}=|\cos2\theta|=\cos2\theta\).'},
    {topic:'Gravitación',q:'Dos cuerpos iguales de masa \(M\), separados por \(R\), se atraen con fuerza \(F_0\). Se transfiere \(M/4\) del primero al segundo sin cambiar \(R\). La nueva fuerza es:',o:['\(3F_0/4\)','\(15F_0/16\)','\(5F_0/4\)','\(F_0\)','\(9F_0/16\)'],a:1,s:'Las nuevas masas son \(3M/4\) y \(5M/4\). Como \(R\) no cambia, \(F/F_0=[(3/4)(5/4)] = 15/16\).'},
    {topic:'Lógica',q:'Alex y Beto tienen números consecutivos tomados del conjunto \(\{1,2,3\}\). Cada uno conoce solo su propio número. Alex dice: “No sé qué número tienes”. ¿Qué número tiene Alex?',o:['\(1\)','\(2\)','\(3\)','Puede ser 1 o 3','No hay información suficiente'],a:1,s:'Si Alex tuviera 1, Beto necesariamente tendría 2 y Alex lo sabría. Si Alex tuviera 3, Beto también necesariamente tendría 2. Para poder decir que no sabe, Alex debe tener 2; entonces Beto podría tener 1 o 3.'},
    {topic:'Divisibilidad',q:'Un rectángulo de lados enteros tiene perímetro \(180\). El lado mayor es al menor como un número primo \(p\), y el lado mayor es al menos 45. ¿Cuántos rectángulos distintos cumplen?',o:['\(3\)','\(4\)','\(5\)','\(6\)','\(7\)'],a:2,s:'Si \(w/l=p\) y \(w+l=90\), entonces \((p+1)l=90\). Se requiere que \(p+1\) divida 90. Los valores primos son \(p=2,5,17,29,89\), que producen cinco rectángulos y todos tienen lado mayor \(\ge45\).'},
    {topic:'Congruencias',q:'Determine las dos últimas cifras de \(3^{27}+11^{11}+27^{27}\).',o:['01','21','41','61','81'],a:0,s:'Módulo 100: \(3^{27}\equiv87\), \(11^{11}\equiv11\) y \(27^{27}\equiv3\). La suma es \(101\equiv1\pmod{100}\), es decir, las dos últimas cifras son 01.'},
    {topic:'Dinámica',q:'Un bloque de masa \(2m\) desliza sobre una tabla de masa \(3m\). El coeficiente de fricción cinética bloque-tabla es \(\mu\). La tabla se apoya en un piso y debe permanecer en reposo. ¿Cuál es el mínimo coeficiente de fricción estática tabla-piso?',o:['\(\mu/5\)','\(2\mu/5\)','\(\mu/2\)','\(3\mu/5\)','\(\mu\)'],a:1,s:'La fricción que el bloque ejerce sobre la tabla es \(f_k=\mu(2mg)=2\mu mg\). El piso soporta masa total \(5m\), así que \(N=5mg\). En el límite, \(\mu_s5mg=2\mu mg\), de donde \(\mu_s=2\mu/5\).'},
    {topic:'Geometría',q:'Un rectángulo mide \(5\,m\times12\,m\). Se construye otro rectángulo que tiene como uno de sus lados la diagonal del primero y cuya cara opuesta pasa por el vértice restante, como en el patrón de la eliminatoria. ¿Cuál es el área del nuevo rectángulo?',o:['\(30\,m^2\)','\(50\,m^2\)','\(60\,m^2\)','\(65\,m^2\)','\(78\,m^2\)'],a:2,s:'La diagonal mide 13. El triángulo formado por media figura original tiene área 30, así que \(30=(1/2)(13)h\), de donde \(h=60/13\). El nuevo rectángulo tiene área \(13(60/13)=60\,m^2\), igual al área original.'},
    {topic:'Iteraciones',q:'Sea \(f(x)=3x+2\) y \(f_n\) la composición de \(f\) consigo misma \(n\) veces. ¿Cuál es el dígito de las unidades de la suma de los coeficientes de \(f_{2026}(x)\)?',o:['\(1\)','\(3\)','\(5\)','\(7\)','\(9\)'],a:3,s:'La iteración es \(f_n(x)=3^n x+(3^n-1)\). La suma de coeficientes es \(2\cdot3^n-1\). Como \(2026\equiv2\pmod4\), \(3^{2026}\equiv9\pmod{10}\). Entonces \(2(9)-1=17\), cuyo último dígito es 7.'},
    {topic:'Momentum + energía',q:'Una cuña móvil de masa \(3m\) contiene una pista semicircular lisa de radio \(R\). Un bloque de masa \(m\) se suelta desde el borde y llega al punto inferior. No hay fuerza externa horizontal. ¿Cuál es la rapidez del bloque respecto al suelo en el punto inferior?',o:['\(\sqrt{2gR}\)','\(\sqrt{3gR/2}\)','\(\sqrt{gR}\)','\(\sqrt{4gR/3}\)','\(\sqrt{gR/2}\)'],a:1,s:'Momentum horizontal: \(mv=(3m)V\Rightarrow V=v/3\). Energía: \(mgR=\tfrac12mv^2+\tfrac12(3m)(v/3)^2=\tfrac12mv^2(1+1/3)\). Así, \(v^2=3gR/2\).'},
    {topic:'Combinatoria',q:'Doce puntos distintos se marcan sobre el perímetro de un semicírculo. Cinco de ellos están sobre el diámetro y los otros siete sobre el arco. ¿Cuántos triángulos no degenerados pueden formarse?',o:['200','205','210','215','220'],a:2,s:'Todas las ternas son \(\binom{12}{3}=220\). Solo son degeneradas las ternas formadas por tres de los cinco puntos colineales del diámetro: \(\binom53=10\). Resultado: \(220-10=210\).'},
    {topic:'Cálculo mental',q:'Sea \(N=31746\). ¿Cuál es la suma de los dígitos de \(7N\)?',o:['6','9','12','18','27'],a:2,s:'\(31746\times7=222222\). La suma de sus seis dígitos es \(6\times2=12\).'}
  ];

  const qs = document.getElementById('questions');
  const timerEl = document.getElementById('timer');
  const progressEl = document.getElementById('progress');
  const scoreBox = document.getElementById('scoreBox');
  let left = 1800, tick = null, started = false, submitted = false;

  const math = (root=document.body) => {
    if (window.renderMathInElement) renderMathInElement(root,{delimiters:[{left:'$$',right:'$$',display:true},{left:'\\[',right:'\\]',display:true},{left:'\\(',right:'\\)',display:false}]});
  };
  const fmt = s => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;
  const updateTimer = () => { timerEl.textContent = fmt(left); if(left<=300) timerEl.style.color='#b42318'; };
  const updateProgress = () => {
    const n = Q.filter((_,i)=>document.querySelector(`input[name="q${i}"]:checked`)).length;
    progressEl.textContent = `${n} / ${Q.length} respondidas`;
  };
  const render = () => {
    qs.innerHTML = Q.map((x,i)=>`<article class="eia-question" id="q-${i}"><div class="eia-qnum">Pregunta ${i+1}<span class="eia-topic-chip">${x.topic}</span></div><h3>${x.q}</h3><div class="eia-options">${x.o.map((op,j)=>`<label class="eia-option"><input type="radio" name="q${i}" value="${j}"><span><strong>${String.fromCharCode(97+j)}.</strong> ${op}</span></label>`).join('')}</div><div class="eia-solution"><strong>Solución paso a paso.</strong><p>${x.s}</p><p><strong>Respuesta:</strong> ${String.fromCharCode(97+x.a)}. ${x.o[x.a]}</p></div></article>`).join('');
    qs.addEventListener('change', updateProgress);
    math(qs);
  };
  const start = () => {
    if(started || submitted) return;
    started = true;
    document.getElementById('startBtn').disabled = true;
    tick = setInterval(()=>{ left--; updateTimer(); if(left<=0){clearInterval(tick); submit(true);}},1000);
  };
  const submit = (auto=false) => {
    if(submitted) return;
    submitted = true;
    if(tick) clearInterval(tick);
    let correct=0, answered=0;
    Q.forEach((x,i)=>{
      const card=document.getElementById(`q-${i}`);
      const pick=document.querySelector(`input[name="q${i}"]:checked`);
      if(pick){answered++; if(Number(pick.value)===x.a){correct++; card.classList.add('correct');}else card.classList.add('wrong');}
      else card.classList.add('wrong');
      card.classList.add('revealed');
      card.querySelectorAll('input').forEach(el=>el.disabled=true);
    });
    scoreBox.classList.add('show');
    scoreBox.innerHTML=`<strong>${correct}/${Q.length}</strong><br>${auto?'Tiempo terminado. ':''}${answered} respondidas · ${Q.length-answered} en blanco. Revisa ahora el procedimiento, no solo la letra correcta.`;
    math(qs); window.scrollTo({top:scoreBox.offsetTop-90,behavior:'smooth'});
  };
  const reset = () => {
    if(tick) clearInterval(tick);
    left=1800; started=false; submitted=false; timerEl.style.color=''; scoreBox.classList.remove('show'); scoreBox.innerHTML='';
    document.getElementById('startBtn').disabled=false; updateTimer(); render(); updateProgress(); window.scrollTo({top:0,behavior:'smooth'});
  };
  document.getElementById('startBtn').addEventListener('click',start);
  document.getElementById('submitBtn').addEventListener('click',()=>submit(false));
  document.getElementById('resetBtn').addEventListener('click',reset);
  render(); updateTimer(); updateProgress();
})();