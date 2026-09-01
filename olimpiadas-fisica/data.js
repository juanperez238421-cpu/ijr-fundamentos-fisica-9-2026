window.PHYSICS_OLYMPIAD_DATA = {
  competition: {
    title: "EIA Physics Olympiad Preparation · 2026",
    subtitle: "Classical mechanics · reasoning first · procedure matters",
    scoring: "Qualifier score: P = 20 + 4C − W. Blank answers do not add or subtract points.",
    scope: [
      "Cinemática 1D/2D y magnitudes vectoriales",
      "Fuerza y dinámica · Leyes de Newton",
      "Trabajo y energía",
      "Cantidad de movimiento y choques",
      "Movimiento circular y gravitación",
      "Movimiento rotacional y equilibrio estático",
      "Estática y dinámica de sólidos y fluidos"
    ],
    note: "Este banco es material didáctico original/adaptado al estilo de olimpiadas de física. No se presenta como banco oficial ni como filtración de preguntas EIA 2026."
  },
  strategy: [
    {title:"1 · Modela antes de calcular", text:"Identifica el sistema, la incógnita, el diagrama y el principio físico antes de buscar una fórmula."},
    {title:"2 · Usa unidades como detector de errores", text:"El análisis dimensional permite eliminar expresiones imposibles sin sustituir números."},
    {title:"3 · Busca invariantes", text:"Pregunta qué se conserva: energía, momentum, masa, velocidad horizontal, momento angular o caudal."},
    {title:"4 · Compara por proporciones", text:"En olimpiadas muchas preguntas se resuelven con escalamiento: r→2r, v→2v, h→h/2, sin cálculo largo."},
    {title:"5 · Dibuja", text:"Un diagrama correcto suele revelar fuerzas, componentes, brazo de palanca, profundidad o geometría oculta."},
    {title:"6 · Verifica", text:"Comprueba signo, unidades, orden de magnitud y si el resultado tiene sentido físico."}
  ],
  topics: [
    {
      slug:"tools-vectors", number:"01", title:"Herramientas, dimensiones y vectores", english:"Tools, dimensions & vectors", level:"Foundation",
      overview:"Antes de entrar en mecánica, domina el lenguaje: unidades SI, dimensiones, vectores, componentes, proporcionalidad y producto punto.",
      objectives:["Usar análisis dimensional para descartar o reconstruir relaciones.","Descomponer vectores y reconocer resultantes.","Distinguir escalares de vectores.","Resolver comparaciones sin números innecesarios."],
      formulas:["\\([v]=LT^{-1}\\)","\\([a]=LT^{-2}\\)","\\(A_x=A\\cos\\theta,\\;A_y=A\\sin\\theta\\)","\\(|\\vec A+\\vec B|=\\sqrt{A^2+B^2+2AB\\cos\\theta}\\)","\\(\\vec A\\cdot\\vec B=AB\\cos\\theta\\)"],
      theory:[
        {title:"Análisis dimensional", text:"Una ecuación física válida debe ser dimensionalmente homogénea. Si el lado izquierdo es velocidad, el derecho también debe tener dimensión \\(LT^{-1}\\). Esta herramienta no demuestra que una ecuación sea correcta, pero sí puede demostrar rápidamente que es imposible."},
        {title:"Vectores", text:"Magnitud y dirección importan. En 2D conviene elegir ejes, proyectar y trabajar por componentes. Dos vectores pueden sumar cero, tener producto punto cero o producir una resultante mayor o menor según el ángulo."},
        {title:"Escalamiento", text:"Si \\(y\\propto x^n\\), multiplicar \\(x\\) por \\(k\\) multiplica \\(y\\) por \\(k^n\\). Esta idea aparece constantemente en energía, gravitación, movimiento circular y fluidos."}
      ],
      traps:["Confundir unidad con dimensión.","Sumar magnitudes vectoriales ignorando el ángulo.","Usar seno/coseno sin definir primero el eje y el ángulo.","Creer que producto punto cero implica que uno de los vectores es cero."],
      example:{
        title:"Ejemplo olímpico · reconstruir una ley sin conocerla",
        prompt:"El período T de un sistema depende únicamente de una longitud L y de g. ¿Qué forma funcional puede tener?",
        steps:["Supón \\(T\\propto L^a g^b\\).","Escribe dimensiones: \\(T=L^{a+b}T^{-2b}\\).","Iguala exponentes: \\(-2b=1\\Rightarrow b=-1/2\\).","Para longitud: \\(a+b=0\\Rightarrow a=1/2\\)."],
        answer:"\\(T\\propto\\sqrt{L/g}\\). No fue necesario conocer previamente la fórmula del péndulo."
      },
      questions:[
        {id:"tv-01",skill:"Dimensional analysis",difficulty:"Medium",prompt:"El período T depende solo de una longitud L y de la aceleración gravitacional g. ¿Cuál relación es dimensionalmente posible?",options:{A:"T ∝ Lg",B:"T ∝ √(L/g)",C:"T ∝ g/L",D:"T ∝ L²/g"}},
        {id:"tv-02",skill:"Vector resultant",difficulty:"Easy",prompt:"Una fuerza de 3 N apunta al este y otra de 4 N al norte. ¿Cuál es la magnitud de la resultante?",options:{A:"1 N",B:"4 N",C:"5 N",D:"7 N"}},
        {id:"tv-03",skill:"Scalar vs vector",difficulty:"Easy",prompt:"¿Cuál de las siguientes magnitudes es vectorial?",options:{A:"Masa",B:"Temperatura",C:"Energía",D:"Desplazamiento"}},
        {id:"tv-04",skill:"Units",difficulty:"Easy",prompt:"Si a es aceleración y t es tiempo, ¿qué expresión tiene dimensiones de velocidad?",options:{A:"at",B:"a/t",C:"at²",D:"a²t"}},
        {id:"tv-05",skill:"Components",difficulty:"Medium",prompt:"Una fuerza de 10 N forma 37° con el eje x. Usa cos37°≈0.8 y sin37°≈0.6. Sus componentes son aproximadamente:",options:{A:"(6,8) N",B:"(10,0) N",C:"(8,6) N",D:"(5,5) N"}},
        {id:"tv-06",skill:"Dot product",difficulty:"Medium",prompt:"Dos vectores no nulos son perpendiculares. ¿Qué valor tiene su producto punto?",options:{A:"AB",B:"0",C:"A+B",D:"Depende de las unidades"}}
      ]
    },
    {
      slug:"kinematics", number:"02", title:"Cinemática y movimiento relativo", english:"Kinematics & relative motion", level:"Core",
      overview:"La pregunta clave no es qué fórmula usar, sino qué describe la posición, la pendiente y el área en cada representación del movimiento.",
      objectives:["Interpretar x-t, v-t y a-t.","Resolver encuentros y alcances.","Separar movimientos horizontal y vertical.","Usar velocidad relativa."],
      formulas:["\\(v=\\frac{dx}{dt}\\)","\\(a=\\frac{dv}{dt}\\)","\\(x=x_0+v_0t+\\tfrac12at^2\\)","\\(v^2=v_0^2+2a\\Delta x\\)","\\(\\vec v_{A/B}=\\vec v_A-\\vec v_B\\)"],
      theory:[
        {title:"Gráficas", text:"En x-t la pendiente es velocidad. En v-t la pendiente es aceleración y el área algebraica es desplazamiento. En a-t el área produce cambio de velocidad."},
        {title:"Encuentros", text:"Dos móviles se encuentran cuando ocupan la misma posición al mismo tiempo: \\(x_A(t)=x_B(t)\\). No significa necesariamente igual velocidad."},
        {title:"Proyectiles", text:"El movimiento horizontal y vertical comparten el tiempo, pero se modelan por separado. En el modelo ideal \\(a_x=0\\) y \\(a_y=-g\\)."}
      ],
      traps:["Confundir distancia con desplazamiento.","Pensar que v=0 implica a=0.","Interpretar el cruce de curvas x-t como igualdad de velocidades.","Usar una sola ecuación 2D sin separar ejes."],
      example:{
        title:"Ejemplo olímpico · encuentro con dos modelos distintos",
        prompt:"A pasa por x=0 con velocidad constante 20 m/s. B parte del mismo punto desde reposo con a=2 m/s². ¿Cuándo vuelven a encontrarse?",
        steps:["\\(x_A=20t\\).","\\(x_B=\\tfrac12(2)t^2=t^2\\).","Iguala posiciones: \\(20t=t^2\\).","\\(t(t-20)=0\\): descarta t=0 porque es el encuentro inicial."],
        answer:"\\(t=20\\,s\\)."
      },
      questions:[
        {id:"kin-01",skill:"Meeting",difficulty:"Medium",prompt:"A se mueve a 20 m/s desde x=0. B parte simultáneamente del reposo desde x=0 con a=2 m/s². ¿Cuándo vuelven a encontrarse?",options:{A:"5 s",B:"10 s",C:"20 s",D:"40 s"}},
        {id:"kin-02",skill:"v-t graph",difficulty:"Medium",prompt:"La velocidad cambia linealmente de +8 m/s a −8 m/s durante 4 s. ¿Qué afirmación es necesariamente correcta?",options:{A:"La aceleración es cero",B:"Nunca se detiene",C:"Cambia de dirección",D:"La rapidez siempre aumenta"}},
        {id:"kin-03",skill:"Projectile",difficulty:"Easy",prompt:"En un lanzamiento horizontal ideal, ¿qué ocurre con las aceleraciones?",options:{A:"ax=g y ay=0",B:"ax=0 y ay=−g",C:"ax=ay=0",D:"ax=ay=−g"}},
        {id:"kin-04",skill:"Vertical motion",difficulty:"Easy",prompt:"En el punto más alto de un lanzamiento vertical, despreciando aire:",options:{A:"v=0 y a=0",B:"v=g y a=0",C:"v≠0 y a=0",D:"v=0 y a=−g"}},
        {id:"kin-05",skill:"x-t interpretation",difficulty:"Medium",prompt:"Dos gráficas posición-tiempo se cruzan. Eso garantiza que en ese instante los móviles tienen:",options:{A:"La misma posición",B:"La misma velocidad",C:"La misma aceleración",D:"El mismo desplazamiento total"}},
        {id:"kin-06",skill:"Relative speed",difficulty:"Medium",prompt:"Dos corredores parten del mismo punto de una pista circular de 400 m en sentidos opuestos con rapideces 6 m/s y 4 m/s. ¿Cuándo se encuentran por primera vez?",options:{A:"20 s",B:"40 s",C:"50 s",D:"100 s"}}
      ]
    },
    {
      slug:"dynamics", number:"03", title:"Dinámica y leyes de Newton", english:"Dynamics & Newton's laws", level:"Core",
      overview:"El diagrama de cuerpo libre es la herramienta central. Aísla el objeto, identifica interacciones reales y solo después proyecta ΣF=ma.",
      objectives:["Construir FBD correctos.","Relacionar fuerza neta con aceleración, no con velocidad.","Resolver tensión, fricción y peso aparente.","Aplicar correctamente la tercera ley."],
      formulas:["\\(\\sum\\vec F=m\\vec a\\)","\\(f_k=\\mu_kN\\)","\\(f_s\\leq\\mu_sN\\)","\\(W=mg\\)"],
      theory:[
        {title:"Segunda ley", text:"La fuerza neta determina la aceleración. Un cuerpo puede moverse con velocidad no nula y fuerza neta cero si su velocidad es constante."},
        {title:"Tercera ley", text:"Las fuerzas de acción-reacción son simultáneas, iguales en magnitud y opuestas, pero actúan sobre cuerpos diferentes; por eso no se cancelan en un FBD individual."},
        {title:"Fricción", text:"La fricción se opone al deslizamiento relativo o a la tendencia a deslizar. Su dirección se decide físicamente, no por una regla automática de signos."}
      ],
      traps:["Dibujar una 'fuerza de movimiento'.","Poner acción y reacción en el mismo cuerpo libre.","Suponer siempre f_s=μ_sN.","Confundir dirección de velocidad con dirección de aceleración."],
      example:{
        title:"Ejemplo olímpico · ascensor que baja frenando",
        prompt:"Una persona está en un ascensor que desciende pero reduce su rapidez. ¿Cómo se compara N con mg?",
        steps:["La velocidad apunta abajo, pero al frenar la aceleración apunta arriba.","Elige arriba positivo: \\(N-mg=ma\\).","Como a>0, entonces \\(N>mg\\)."],
        answer:"La balanza marca un peso aparente mayor que el peso real."
      },
      questions:[
        {id:"dyn-01",skill:"Apparent weight",difficulty:"Medium",prompt:"Un ascensor desciende pero está disminuyendo su rapidez. Para una persona dentro:",options:{A:"N=mg",B:"N<mg",C:"N>mg",D:"N=0"}},
        {id:"dyn-02",skill:"Newton I",difficulty:"Easy",prompt:"Un disco se mueve en línea recta con velocidad constante sobre una superficie ideal. La fuerza neta sobre él es:",options:{A:"0",B:"mv",C:"mg",D:"Depende de la velocidad"}},
        {id:"dyn-03",skill:"Friction direction",difficulty:"Medium",prompt:"Un bloque se desliza hacia arriba por un plano inclinado rugoso. La fricción cinética apunta:",options:{A:"Vertical hacia abajo",B:"Perpendicular al plano",C:"Hacia arriba del plano",D:"Hacia abajo del plano"}},
        {id:"dyn-04",skill:"Connected blocks",difficulty:"Hard",prompt:"Bloques de 2 kg y 3 kg están unidos sobre una superficie sin fricción. Una fuerza horizontal de 10 N tira del bloque de 3 kg. ¿Cuál es la tensión?",options:{A:"2 N",B:"4 N",C:"6 N",D:"10 N"}},
        {id:"dyn-05",skill:"Newton III",difficulty:"Medium",prompt:"Un automóvil pequeño choca frontalmente con un camión pesado. Durante el contacto, la magnitud de la fuerza del camión sobre el automóvil es:",options:{A:"Mayor",B:"Menor",C:"Igual a la del automóvil sobre el camión",D:"Cero si el camión casi no cambia su velocidad"}},
        {id:"dyn-06",skill:"Elevator",difficulty:"Medium",prompt:"Un ascensor acelera hacia arriba con magnitud a. La normal sobre una persona de masa m vale:",options:{A:"m(g−a)",B:"m(g+a)",C:"mg/a",D:"ma−mg"}}
      ]
    },
    {
      slug:"energy", number:"04", title:"Trabajo, energía y potencia", english:"Work, energy & power", level:"Core",
      overview:"Energía permite evitar cálculos cinemáticos innecesarios. Aprende a decidir cuándo un problema es más corto con conservación que con fuerzas.",
      objectives:["Relacionar trabajo con cambio de energía cinética.","Aplicar conservación de energía mecánica.","Reconocer dependencia cuadrática de K y energía elástica.","Interpretar potencia."],
      formulas:["\\(K=\\tfrac12mv^2\\)","\\(U_g=mgh\\)","\\(U_s=\\tfrac12kx^2\\)","\\(W=Fd\\cos\\theta\\)","\\(W_{net}=\\Delta K\\)","\\(P=W/t\\)"],
      theory:[
        {title:"Trabajo", text:"Solo la componente de fuerza paralela al desplazamiento realiza trabajo. Si fuerza y desplazamiento son perpendiculares, el trabajo instantáneo es cero."},
        {title:"Conservación", text:"Si no hay trabajo de fuerzas no conservativas, \\(K_i+U_i=K_f+U_f\\). La forma de la trayectoria no importa; importan estados inicial y final."},
        {title:"Potencia", text:"Dos estudiantes pueden realizar el mismo trabajo y tener potencias distintas si emplean tiempos diferentes."}
      ],
      traps:["Usar energía potencial sin definir referencia.","Confundir fuerza grande con trabajo grande.","Olvidar que K depende de v².","Creer que toda fuerza presente realiza trabajo."],
      example:{
        title:"Ejemplo olímpico · velocidad innecesaria",
        prompt:"Una esfera cae desde h. ¿Cuál es su energía cinética cuando ha descendido hasta h/2?",
        steps:["La caída vertical recorrida es h/2.","Pierde energía potencial \\(mg(h/2)\\).","Sin resistencia, esa pérdida se convierte en cinética."],
        answer:"\\(K=\\tfrac12mgh\\). No hace falta hallar primero la velocidad."
      },
      questions:[
        {id:"ene-01",skill:"Energy conservation",difficulty:"Easy",prompt:"Una esfera parte del reposo desde altura h. Cuando está a altura h/2, su energía cinética es:",options:{A:"mgh",B:"½mgh",C:"¼mgh",D:"0"}},
        {id:"ene-02",skill:"Scaling",difficulty:"Easy",prompt:"Si la rapidez de un cuerpo se duplica, manteniendo su masa, su energía cinética:",options:{A:"Se duplica",B:"Se triplica",C:"No cambia",D:"Se cuadruplica"}},
        {id:"ene-03",skill:"Path independence",difficulty:"Medium",prompt:"Dos bloques parten del reposo desde la misma altura y bajan por rampas sin fricción de formas diferentes hasta el mismo nivel. Al final:",options:{A:"Tienen la misma rapidez",B:"El de la rampa más corta siempre va más rápido",C:"El más pesado va más rápido",D:"No puede compararse"}},
        {id:"ene-04",skill:"Work",difficulty:"Medium",prompt:"En movimiento circular uniforme, el trabajo de la fuerza radial resultante durante un pequeño desplazamiento tangencial es:",options:{A:"Positivo",B:"Negativo",C:"Cero",D:"Igual a mv²/r"}},
        {id:"ene-05",skill:"Power",difficulty:"Easy",prompt:"Dos estudiantes de igual masa suben la misma escalera. A tarda 5 s y B tarda 10 s. ¿Quién desarrolla mayor potencia media?",options:{A:"B",B:"A",C:"Igual",D:"Depende de g"}},
        {id:"ene-06",skill:"Elastic energy",difficulty:"Easy",prompt:"Un resorte almacena energía U al comprimirse x. Si se comprime 2x, almacena:",options:{A:"U",B:"2U",C:"3U",D:"4U"}}
      ]
    },
    {
      slug:"momentum", number:"05", title:"Impulso, momentum y choques", english:"Impulse, momentum & collisions", level:"Core",
      overview:"Define primero el sistema. El momentum total se conserva cuando el impulso externo neto es despreciable, incluso si la energía cinética no se conserva.",
      objectives:["Usar conservación de momentum en 1D.","Interpretar impulso como área F-t.","Diferenciar choques elásticos e inelásticos.","Analizar retroceso y explosiones."],
      formulas:["\\(\\vec p=m\\vec v\\)","\\(\\vec J=\\Delta\\vec p\\)","\\(\\vec J=\\int\\vec F\\,dt\\)","\\(\\sum\\vec p_i=\\sum\\vec p_f\\)"],
      theory:[
        {title:"Sistema aislado", text:"Las fuerzas internas pueden ser enormes durante un choque, pero se cancelan al considerar el sistema completo. Lo relevante es el impulso externo neto."},
        {title:"Choques", text:"En todo choque aislado se conserva momentum. Solo en elástico también se conserva energía cinética. Si los cuerpos quedan unidos, el choque es perfectamente inelástico."},
        {title:"Impulso", text:"En un gráfico fuerza-tiempo, el área algebraica bajo la curva es el impulso y por tanto el cambio de momentum."}
      ],
      traps:["Conservar energía cinética en todo choque.","Olvidar signos en 1D.","Aplicar conservación de momentum a un sistema con impulso externo importante.","Confundir fuerza máxima con impulso."],
      example:{
        title:"Ejemplo olímpico · carros que se adhieren",
        prompt:"Un carrito de masa m y rapidez v choca y queda unido a otro idéntico en reposo.",
        steps:["Momentum inicial: \\(p_i=mv\\).","Masa final: \\(2m\\).","Conserva momentum: \\(mv=2mv_f\\)."],
        answer:"\\(v_f=v/2\\). La energía cinética disminuye, pero el momentum del sistema se conserva."
      },
      questions:[
        {id:"mom-01",skill:"Inelastic collision",difficulty:"Easy",prompt:"Un carrito de masa m con rapidez v queda unido a otro carrito idéntico en reposo. La rapidez final es:",options:{A:"v",B:"v/2",C:"2v",D:"v/4"}},
        {id:"mom-02",skill:"System momentum",difficulty:"Medium",prompt:"Un carrito m con rapidez v se adhiere sucesivamente a tres carritos idénticos en reposo. La rapidez final de los cuatro juntos es:",options:{A:"v/2",B:"v/3",C:"v/4",D:"v/8"}},
        {id:"mom-03",skill:"Recoil",difficulty:"Medium",prompt:"Un arma y su proyectil parten en reposo. Justo después del disparo, despreciando fuerzas externas:",options:{A:"Sus momenta son iguales en magnitud y opuestos",B:"El arma tiene mayor momentum",C:"El proyectil tiene mayor momentum",D:"Ambos tienen la misma velocidad"}},
        {id:"mom-04",skill:"Impulse",difficulty:"Easy",prompt:"En una gráfica fuerza-tiempo, el área algebraica bajo la curva representa:",options:{A:"Trabajo",B:"Potencia",C:"Aceleración",D:"Impulso"}},
        {id:"mom-05",skill:"Elastic collision",difficulty:"Hard",prompt:"En un choque elástico frontal entre dos masas iguales, la primera llega con rapidez v y la segunda está en reposo. Idealmente después del choque:",options:{A:"Ambas salen con v/2",B:"La primera se detiene y la segunda sale con v",C:"Quedan unidas",D:"La primera rebota con v"}},
        {id:"mom-06",skill:"Explosion",difficulty:"Medium",prompt:"Un objeto inicialmente en reposo explota en dos fragmentos en el espacio profundo. Sin fuerzas externas, el momentum total después de la explosión es:",options:{A:"Positivo",B:"Mayor que antes",C:"Cero",D:"Depende de la energía liberada"}}
      ]
    },
    {
      slug:"circular-gravity", number:"06", title:"Movimiento circular y gravitación", english:"Circular motion & gravitation", level:"Advanced",
      overview:"La aceleración centrípeta describe cambio de dirección. La 'fuerza centrípeta' no es una fuerza adicional: es la resultante radial de fuerzas reales.",
      objectives:["Interpretar aceleración centrípeta.","Usar ley inversa al cuadrado.","Aplicar escalamiento orbital.","Distinguir rapidez constante de velocidad constante."],
      formulas:["\\(a_c=v^2/r\\)","\\(\\sum F_r=mv^2/r\\)","\\(F_g=GMm/r^2\\)","\\(v_{orb}=\\sqrt{GM/r}\\)","\\(T^2\\propto r^3\\)"],
      theory:[
        {title:"Centrípeta", text:"En MCU la magnitud de v es constante, pero su dirección cambia. Esa variación requiere aceleración dirigida al centro."},
        {title:"Gravedad", text:"La fuerza gravitatoria y la aceleración gravitatoria decrecen como \\(1/r^2\\), donde r se mide desde el centro del cuerpo fuente."},
        {title:"Órbitas", text:"La gravedad puede ser precisamente la fuerza centrípeta. Igualar \\(GMm/r^2=mv^2/r\\) produce \\(v=\\sqrt{GM/r}\\)."}
      ],
      traps:["Agregar una fuerza ficticia llamada centrípeta al FBD.","Usar altura sobre la superficie en lugar de distancia al centro.","Creer que rapidez constante significa aceleración cero.","Olvidar el cuadrado en la ley gravitacional."],
      example:{
        title:"Ejemplo olímpico · cambiar el radio sin números",
        prompt:"Un satélite pasa de una órbita de radio r a otra de radio 4r. ¿Cómo cambia g?",
        steps:["\\(g=GM/r^2\\).","Sustituye \\(r' =4r\\).","\\(g'=GM/(4r)^2=g/16\\)."],
        answer:"La aceleración gravitatoria se reduce a 1/16."
      },
      questions:[
        {id:"cg-01",skill:"MCU concept",difficulty:"Medium",prompt:"Un automóvil recorre una circunferencia a rapidez constante. ¿Qué cantidad permanece necesariamente constante?",options:{A:"Vector velocidad",B:"Vector aceleración",C:"Momentum",D:"Energía cinética"}},
        {id:"cg-02",skill:"Inverse square",difficulty:"Easy",prompt:"Si la distancia al centro de un planeta pasa de r a 4r, la aceleración gravitatoria pasa de g a:",options:{A:"g/16",B:"g/4",C:"4g",D:"16g"}},
        {id:"cg-03",skill:"Centripetal force",difficulty:"Medium",prompt:"La expresión 'fuerza centrípeta' se refiere a:",options:{A:"Una quinta fuerza fundamental",B:"La resultante de fuerzas reales en dirección radial",C:"Una fuerza siempre producida por tensión",D:"Una fuerza que apunta tangencialmente"}},
        {id:"cg-04",skill:"Orbit scaling",difficulty:"Medium",prompt:"Para una órbita circular v=√(GM/r). Si el radio orbital se cuadruplica, la rapidez orbital se vuelve:",options:{A:"4v",B:"2v",C:"v/2",D:"v/4"}},
        {id:"cg-05",skill:"Kepler scaling",difficulty:"Hard",prompt:"Para órbitas alrededor del mismo cuerpo, T²∝r³. Si r→4r, el período pasa a:",options:{A:"2T",B:"4T",C:"6T",D:"8T"}},
        {id:"cg-06",skill:"Centripetal scaling",difficulty:"Easy",prompt:"Con masa y radio constantes, si la rapidez en una curva se duplica, la fuerza radial necesaria:",options:{A:"Se duplica",B:"Se cuadruplica",C:"Se reduce a la mitad",D:"No cambia"}}
      ]
    },
    {
      slug:"rotation-equilibrium", number:"07", title:"Rotación y equilibrio estático", english:"Rotation & static equilibrium", level:"Advanced",
      overview:"El torque mide la capacidad de una fuerza para cambiar el estado rotacional. En equilibrio deben anularse simultáneamente fuerza neta y torque neto.",
      objectives:["Calcular y comparar torques.","Usar brazos de palanca.","Localizar centros de masa sencillos.","Plantear condiciones de equilibrio."],
      formulas:["\\(\\tau=rF\\sin\\theta\\)","\\(\\sum\\tau=I\\alpha\\)","\\(\\sum F_x=0,\\;\\sum F_y=0,\\;\\sum\\tau=0\\)"],
      theory:[
        {title:"Torque", text:"No basta una fuerza grande: importa también la distancia perpendicular al eje. Una fuerza aplicada sobre la línea que pasa por el eje puede producir torque cero."},
        {title:"Centro de masa", text:"En cuerpos homogéneos y simétricos suele coincidir con el centro geométrico. En equilibrio, el peso puede modelarse aplicado allí."},
        {title:"Equilibrio", text:"Puedes elegir el punto de referencia para torques estratégicamente, por ejemplo en una bisagra, para eliminar fuerzas desconocidas del cálculo."}
      ],
      traps:["Usar rF sin considerar el ángulo.","Confundir fuerza neta cero con torque neto cero.","Tomar cualquier distancia en lugar de la perpendicular.","Olvidar el peso propio de una barra cuando no se declara despreciable."],
      example:{
        title:"Ejemplo olímpico · por qué la manija está lejos de la bisagra",
        prompt:"Dos personas aplican la misma fuerza perpendicular a una puerta, una cerca de la bisagra y otra en el borde.",
        steps:["\\(\\tau=rF\\sin90°=rF\\).","F es igual para ambas.","La persona con mayor r produce mayor torque."],
        answer:"Empujar lejos de la bisagra es más efectivo."
      },
      questions:[
        {id:"rot-01",skill:"Torque",difficulty:"Easy",prompt:"Con la misma fuerza perpendicular, ¿dónde conviene empujar una puerta para producir mayor torque?",options:{A:"En la bisagra",B:"En cualquier punto da igual",C:"Lo más lejos posible de la bisagra",D:"En el centro exacto"}},
        {id:"rot-02",skill:"Torque angle",difficulty:"Medium",prompt:"Una fuerza no nula actúa exactamente a lo largo de una línea radial que pasa por el eje. Su torque respecto al eje es:",options:{A:"0",B:"rF",C:"F/r",D:"Máximo"}},
        {id:"rot-03",skill:"Center of mass",difficulty:"Easy",prompt:"El centro de masa de una barra recta, uniforme y homogénea está:",options:{A:"En un extremo",B:"En el punto medio",C:"A 1/3 de la longitud",D:"Depende de g"}},
        {id:"rot-04",skill:"Lever balance",difficulty:"Medium",prompt:"En un balancín ideal en equilibrio con masas m1 y m2 a distancias d1 y d2 del pivote, se cumple:",options:{A:"m1+m2=d1+d2",B:"m1/d1=m2/d2",C:"m1d2=m2d1",D:"m1d1=m2d2"}},
        {id:"rot-05",skill:"Static equilibrium",difficulty:"Medium",prompt:"Para que un cuerpo rígido permanezca en equilibrio estático en 2D debe cumplirse:",options:{A:"Solo ΣFx=0",B:"Solo Στ=0",C:"ΣFx=0, ΣFy=0 y Στ=0",D:"v=0 pero las fuerzas pueden ser arbitrarias"}},
        {id:"rot-06",skill:"Rotational dynamics",difficulty:"Medium",prompt:"Para un cuerpo de momento de inercia I alrededor de un eje fijo, la relación dinámica es:",options:{A:"F=Iv",B:"Στ=Iα",C:"Στ=Iv",D:"L=ma"}}
      ]
    },
    {
      slug:"fluids", number:"08", title:"Fluidos: presión, empuje y flujo", english:"Fluids: pressure, buoyancy & flow", level:"Advanced",
      overview:"La geometría puede engañar. En hidrostática importa profundidad; en flotación importa volumen desplazado; en flujo ideal aparecen conservación de caudal y energía.",
      objectives:["Aplicar presión hidrostática.","Usar Arquímedes y condición de flotación.","Aplicar Pascal.","Interpretar continuidad y Bernoulli."],
      formulas:["\\(P=F/A\\)","\\(P=P_0+\\rho gh\\)","\\(F_B=\\rho_f gV_{despl}\\)","\\(A_1v_1=A_2v_2\\)","\\(P+\\tfrac12\\rho v^2+\\rho gh=const.\\)"],
      theory:[
        {title:"Hidrostática", text:"A igual fluido y profundidad, la presión es igual, independientemente de la forma del recipiente. Esto conduce a la llamada paradoja hidrostática."},
        {title:"Flotación", text:"Un cuerpo flotante está en equilibrio: \\(F_B=W\\). La fracción sumergida depende de la razón de densidades."},
        {title:"Flujo", text:"Para fluido incompresible estacionario el caudal se conserva. En una tubería que se estrecha, la rapidez aumenta. En una línea horizontal ideal, mayor rapidez suele asociarse con menor presión estática."}
      ],
      traps:["Creer que un recipiente más ancho siempre tiene mayor presión al fondo.","Confundir empuje con peso del objeto.","Usar el volumen total en Arquímedes cuando el cuerpo no está totalmente sumergido.","Aplicar Bernoulli sin revisar altura y condiciones ideales."],
      example:{
        title:"Ejemplo olímpico · recipientes de formas distintas",
        prompt:"Tres recipientes contienen el mismo líquido a la misma altura h. ¿Cómo se comparan las presiones en sus fondos?",
        steps:["Usa \\(P=P_0+\\rho gh\\).","P0, ρ, g y h son iguales.","La forma del recipiente no aparece en la ecuación."],
        answer:"Las presiones son iguales."
      },
      questions:[
        {id:"flu-01",skill:"Hydrostatic pressure",difficulty:"Easy",prompt:"Tres recipientes de formas distintas contienen el mismo líquido hasta la misma altura. La presión en sus fondos es:",options:{A:"La misma",B:"Mayor en el más ancho",C:"Mayor en el que contiene más volumen",D:"Mayor en el más estrecho"}},
        {id:"flu-02",skill:"Archimedes",difficulty:"Easy",prompt:"El empuje sobre un cuerpo sumergido es igual a:",options:{A:"El peso del cuerpo",B:"La masa del fluido desplazado",C:"El peso del fluido desplazado",D:"La presión atmosférica por el área"}},
        {id:"flu-03",skill:"Floating fraction",difficulty:"Medium",prompt:"Un objeto de densidad 600 kg/m³ flota en agua de densidad 1000 kg/m³. ¿Qué fracción de su volumen queda sumergida?",options:{A:"0.4",B:"0.6",C:"1.0",D:"1.67"}},
        {id:"flu-04",skill:"Pascal",difficulty:"Medium",prompt:"En una prensa hidráulica ideal A2=5A1. Si se aplica F1 en el pistón pequeño, la fuerza en el grande es:",options:{A:"F1/5",B:"F1",C:"√5F1",D:"5F1"}},
        {id:"flu-05",skill:"Continuity",difficulty:"Medium",prompt:"Agua fluye de forma estacionaria por una tubería que reduce su área transversal a la mitad. Idealmente la rapidez del agua:",options:{A:"Se reduce a la mitad",B:"No cambia",C:"Se duplica",D:"Se cuadruplica"}},
        {id:"flu-06",skill:"Bernoulli",difficulty:"Medium",prompt:"En una tubería horizontal ideal, una región donde el fluido se mueve más rápido suele tener presión estática:",options:{A:"Mayor",B:"Menor",C:"Igual siempre",D:"Cero"}}
      ]
    }
  ]
};
