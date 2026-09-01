(() => {
  const data = window.PHYSICS_OLYMPIAD_DATA;
  if (!data?.topics) return;

  data.competition.questionCount = 80;
  data.competition.trainingNote = "La ampliación V2 prioriza lectura de diagramas, escalamiento, conservación, estimación, elección estratégica del modelo y problemas de varios pasos, como se espera en entrenamiento de olimpiadas.";

  const bySlug = Object.fromEntries(data.topics.map((topic) => [topic.slug, topic]));
  const enrich = (slug, patch) => Object.assign(bySlug[slug], patch);

  enrich("tools-vectors", {
    olympiadTheory: [
      {title:"Decide antes de operar", text:"Pregunta primero si el problema puede resolverse por dimensiones, simetría, proporciones o geometría vectorial. En una clasificatoria, reconocer la estructura suele ahorrar más tiempo que desarrollar componentes completas."},
      {title:"Dimensiones como filtro, no como prueba", text:"La homogeneidad dimensional elimina expresiones imposibles y ayuda a reconstruir exponentes. Pero dos expresiones pueden tener las mismas dimensiones y describir física diferente; después debes usar límites, simetría o un caso conocido."},
      {title:"Geometría vectorial rápida", text:"Antes de proyectar, mira el ángulo. Con 0°, 90°, 120° o 180° aparecen simplificaciones inmediatas. Un dibujo a escala razonable también permite anticipar dirección y orden de magnitud de la resultante."},
      {title:"Escalamiento olímpico", text:"Si una ley es proporcional a una potencia, trabaja con razones. Pasar de x a kx transforma una dependencia x^n en un factor k^n. Esta técnica reaparece en energía, gravedad, rotación y fluidos."}
    ],
    contestUse: {
      qualifier:"Descartar opciones dimensionalmente imposibles y usar triángulos notables sin cálculo largo.",
      semifinal:"Justificar una relación funcional, declarar supuestos y construir una solución simbólica clara.",
      final:"Combinar dimensiones con simetría, límites físicos y estimaciones para decidir entre modelos rivales."
    },
    decisionSteps:["¿La incógnita es escalar o vectorial?","¿Hay un ángulo especial o una simetría?","¿Puedo trabajar con razones en vez de valores absolutos?","¿Las unidades de mi resultado son obligatoriamente correctas?"],
    visual:{type:"vector-components", title:"Vector laboratory", caption:"Observa cómo cambian las componentes al cambiar la orientación del vector; la resultante no se obtiene sumando magnitudes a ciegas."},
    problemLens:"Busca primero dimensión, dirección, simetría o factor de escala. Evita sustituir números hasta tener una relación simbólica consistente.",
    extraQuestions:[
      {id:"tv-07",skill:"Dimensional coefficient",difficulty:"Hard",description:"Un coeficiente desconocido se deduce sin memorizar ninguna ley adicional.",prompt:"Una fuerza de arrastre se modela como F = kv². ¿Cuáles son las dimensiones de k?",options:{A:"MLT⁻¹",B:"ML⁻¹",C:"M⁻¹L",D:"ML²T⁻²"},visual:{type:"vector-components",variant:"drag",label:"F = kv²"}},
      {id:"tv-08",skill:"Vector geometry",difficulty:"Hard",description:"La clave es reconocer un ángulo de 120° y evitar una descomposición innecesaria.",prompt:"Dos vectores tienen la misma magnitud A y forman entre sí 120°. ¿Cuál es la magnitud de su suma?",options:{A:"0",B:"A/2",C:"A",D:"√3 A"},visual:{type:"vector-components",variant:"two-vectors",angle:120}},
      {id:"tv-09",skill:"Unit vector",difficulty:"Medium",description:"Convierte una razón de componentes en una dirección normalizada.",prompt:"Un vector apunta en una dirección cuyas componentes están en razón Ax:Ay = 3:4, ambas positivas. ¿Cuál puede ser su vector unitario?",options:{A:"(3,4)",B:"(4/3,1)",C:"(4/5,3/5)",D:"(3/5,4/5)"},visual:{type:"vector-components",variant:"triangle-345"}},
      {id:"tv-10",skill:"Scaling law",difficulty:"Medium",description:"Pregunta clásica de proporciones: ninguna sustitución numérica es necesaria.",prompt:"Si una fuerza resistiva cumple F ∝ v² y la rapidez se triplica, ¿cómo cambia la fuerza?",options:{A:"9F",B:"6F",C:"3F",D:"√3 F"},visual:{type:"vector-components",variant:"scaling",label:"v → 3v"}}
    ]
  });

  enrich("kinematics", {
    olympiadTheory: [
      {title:"Representación antes que fórmula", text:"Decide si el problema vive mejor en una ecuación x(t), una gráfica v-t, una construcción geométrica o un marco relativo. La misma situación puede ser trivial en una representación y larga en otra."},
      {title:"Eventos simultáneos", text:"En encuentros, proyectiles y móviles relativos, la variable que conecta los movimientos es el tiempo. Igualar posiciones o compartir tiempo de vuelo suele ser más potente que buscar una ecuación aislada."},
      {title:"Pendiente y área", text:"Una gráfica no es decoración: la pendiente de x-t es v; la pendiente de v-t es a; el área bajo v-t es desplazamiento. Muchas preguntas olímpicas se resuelven visualmente sin ecuaciones de MRUA."},
      {title:"Promedios con cuidado", text:"La rapidez media es distancia total/tiempo total. En trayectos de igual distancia con rapideces distintas aparece una media armónica, no el promedio aritmético."}
    ],
    contestUse:{
      qualifier:"Leer pendientes, áreas, signos y factores de escala en segundos.",
      semifinal:"Separar ejes, declarar condiciones iniciales y conectar varios intervalos de movimiento.",
      final:"Elegir marcos relativos o variables adimensionales para simplificar configuraciones con varios móviles."
    },
    decisionSteps:["¿Qué evento marca el inicio y el final?","¿Conviene x(t), v(t), una gráfica o velocidad relativa?","¿Los ejes son independientes pero comparten el mismo tiempo?","¿Mi signo de velocidad y aceleración tiene sentido geométrico?"],
    visual:{type:"kinematics-graph",title:"Motion graph laboratory",caption:"El punto móvil y la curva muestran que posición, velocidad y aceleración son representaciones distintas del mismo movimiento."},
    problemLens:"Identifica el evento físico, el tiempo compartido y la representación que hace visible la relación buscada.",
    extraQuestions:[
      {id:"kin-07",skill:"Relative velocity",difficulty:"Medium",description:"Combina corriente y velocidad propia como vectores perpendiculares.",prompt:"Un bote avanza a 4 m/s perpendicularmente a la orilla respecto al agua. La corriente lleva 3 m/s paralela a la orilla. ¿Cuál es la rapidez del bote respecto a tierra?",options:{A:"1 m/s",B:"4 m/s",C:"5 m/s",D:"7 m/s"},visual:{type:"kinematics-graph",variant:"river"}},
      {id:"kin-08",skill:"Projectile scaling",difficulty:"Medium",description:"Usa la dependencia cuadrática del alcance con la rapidez inicial, manteniendo ángulo y g.",prompt:"Un proyectil ideal lanzado con rapidez v y ángulo θ tiene alcance R. Si se lanza con rapidez 2v al mismo ángulo, el nuevo alcance es:",options:{A:"R",B:"2R",C:"√2 R",D:"4R"},visual:{type:"kinematics-graph",variant:"projectile"}},
      {id:"kin-09",skill:"Derivative reasoning",difficulty:"Hard",description:"Extrae información dinámica directamente de una función de posición.",prompt:"La posición de una partícula es x(t)=4t−t², en SI. ¿En qué instante se detiene momentáneamente?",options:{A:"1 s",B:"2 s",C:"4 s",D:"8 s"},visual:{type:"kinematics-graph",variant:"parabola"}},
      {id:"kin-10",skill:"Average speed",difficulty:"Hard",description:"Un clásico de olimpiadas que penaliza promediar rapideces sin ponderar tiempos.",prompt:"Un móvil recorre una distancia d con rapidez v y regresa la misma distancia con rapidez 2v. Su rapidez media en todo el viaje es:",options:{A:"4v/3",B:"3v/2",C:"2v",D:"v"},visual:{type:"kinematics-graph",variant:"out-back"}}
    ]
  });

  enrich("dynamics", {
    olympiadTheory:[
      {title:"El FBD es una ecuación visual", text:"Aísla un solo cuerpo o el sistema completo. Cada flecha debe corresponder a una interacción real. Si una fuerza no puede nombrarse por su agente, probablemente no pertenece al diagrama."},
      {title:"Sistema completo vs subsistemas", text:"En bloques conectados, usar el sistema completo elimina tensiones internas y da la aceleración. Luego aislar un bloque permite hallar la tensión. Elegir el nivel correcto reduce álgebra."},
      {title:"Restricciones geométricas", text:"Cuerdas ideales, contactos y superficies imponen relaciones entre aceleraciones. En problemas olímpicos, la dificultad suele estar en la restricción, no en ΣF=ma."},
      {title:"Casos límite", text:"En contacto mínimo, cuerda apenas tensa o inminencia de deslizamiento, una cantidad llega a su frontera: N=0, T=0 o fs=μsN. Reconocer el límite es esencial."}
    ],
    contestUse:{qualifier:"Identificar dirección de fricción, normal y aceleración sin confundirlas con velocidad.",semifinal:"Construir FBD separados, elegir ejes y justificar restricciones de movimiento.",final:"Analizar condiciones límite, sistemas acoplados y marcos acelerados con argumentación completa."},
    decisionSteps:["¿Qué cuerpo o sistema voy a aislar?","¿Qué interacciones externas actúan realmente?","¿Qué restricción impone cuerda, contacto o superficie?","¿Hay un caso límite como T=0, N=0 o fs=μsN?"],
    visual:{type:"dynamics-incline",title:"Free-body diagram laboratory",caption:"El bloque, las componentes de peso, la normal y la fricción se animan para separar dirección de movimiento, aceleración y fuerzas."},
    problemLens:"Dibuja primero. La ecuación ΣF=ma es simple; la selección del sistema y de las fuerzas es la parte olímpica.",
    extraQuestions:[
      {id:"dyn-07",skill:"Atwood system",difficulty:"Hard",description:"Usa el sistema completo para eliminar la tensión interna.",prompt:"En una máquina de Atwood ideal cuelgan masas 2m y m. ¿Cuál es la magnitud de la aceleración del sistema?",options:{A:"g/2",B:"g/3",C:"2g/3",D:"g"},visual:{type:"dynamics-incline",variant:"atwood"}},
      {id:"dyn-08",skill:"Static friction limit",difficulty:"Hard",description:"La condición de no deslizamiento se convierte en una desigualdad de fricción estática.",prompt:"Un bloque permanece en reposo sobre un plano inclinado 30°. ¿Cuál es el valor mínimo de μs que puede impedir el deslizamiento?",options:{A:"1/2",B:"√3",C:"1/√3",D:"1"},visual:{type:"dynamics-incline",variant:"static-limit",angle:30}},
      {id:"dyn-09",skill:"Normal force",difficulty:"Medium",description:"Una fuerza oblicua cambia la normal incluso cuando no hay aceleración vertical.",prompt:"Un bloque sobre una mesa horizontal es empujado por una fuerza F que forma un ángulo θ por debajo de la horizontal. Si no hay aceleración vertical, la normal vale:",options:{A:"mg−F sinθ",B:"mg",C:"F cosθ",D:"mg+F sinθ"},visual:{type:"dynamics-incline",variant:"push-down"}},
      {id:"dyn-10",skill:"Minimum circular speed",difficulty:"Hard",description:"Problema de condición límite: la cuerda está justo a punto de perder tensión en la parte superior.",prompt:"Una masa gira en un círculo vertical de radio r unida a una cuerda. ¿Cuál es la rapidez mínima en la parte superior para que la cuerda permanezca apenas tensa?",options:{A:"√(gr/2)",B:"gr",C:"√(gr)",D:"√(2gr)"},visual:{type:"orbit",variant:"vertical-circle"}}
    ]
  });

  enrich("energy", {
    olympiadTheory:[
      {title:"Estado inicial y final", text:"Con energía, la trayectoria puede desaparecer del problema. Define con precisión estados, referencia de potencial y fuerzas no conservativas. Si la pregunta no requiere tiempo, energía suele ser la ruta corta."},
      {title:"Condición dinámica + energía", text:"Problemas de loop, contacto o escape suelen exigir dos ideas: una condición de fuerza en un punto crítico y conservación de energía entre dos posiciones."},
      {title:"Trabajo disipativo", text:"Fricción transforma energía mecánica. Si la fuerza disipativa es constante, el trabajo crece linealmente con distancia, mientras K crece como v²: de ahí muchos factores de cuatro."},
      {title:"Potencia instantánea", text:"Además de P=W/t, en muchos problemas conviene \(P=\vec F\cdot\vec v\). Permite razonar sobre máquinas y ascensos a velocidad constante sin calcular un trabajo completo."}
    ],
    contestUse:{qualifier:"Reconocer cuándo una relación cuadrática produce factores 4 o 9.",semifinal:"Construir balances energéticos con pérdidas y justificar la referencia de potencial.",final:"Combinar conservación con condiciones de contacto, fuerzas variables y optimización."},
    decisionSteps:["¿La pregunta necesita tiempo? Si no, prueba energía.","¿Qué fuerzas hacen trabajo no conservativo?","¿Cuál es la referencia conveniente para U?","¿Existe una condición crítica adicional en el punto final?"],
    visual:{type:"energy-track",title:"Energy transformation laboratory",caption:"La altura disminuye mientras aumenta la rapidez: el diagrama enfatiza estados y transformaciones, no una lista de fórmulas."},
    problemLens:"Busca estados, conservación y condiciones críticas. Si solo cambia altura o compresión, evita cinemática innecesaria.",
    extraQuestions:[
      {id:"ene-07",skill:"Spring scaling",difficulty:"Medium",description:"Convierte energía elástica en cinética y usa escalamiento.",prompt:"Un resorte ideal lanza un bloque sobre una superficie sin fricción. Si la compresión inicial pasa de x a 2x, la rapidez de salida del bloque:",options:{A:"Se cuadruplica",B:"Se duplica",C:"Aumenta √2",D:"No cambia"},visual:{type:"energy-track",variant:"spring"}},
      {id:"ene-08",skill:"Loop condition",difficulty:"Hard",description:"Requiere conservación de energía y condición mínima de contacto en la parte superior.",prompt:"Una partícula parte del reposo desde altura h y entra a un loop vertical de radio R sin fricción. ¿Cuál es la altura mínima h, medida desde el punto más bajo, para completar el loop sin perder contacto?",options:{A:"2R",B:"3R",C:"5R/2",D:"4R"},visual:{type:"energy-track",variant:"loop"}},
      {id:"ene-09",skill:"Power",difficulty:"Medium",description:"Relaciona potencia mecánica con velocidad vertical constante.",prompt:"Una persona de masa m sube verticalmente con rapidez constante v. Ignorando pérdidas, la potencia mecánica mínima requerida es:",options:{A:"mgv",B:"mg/v",C:"mv²/2",D:"mgh"},visual:{type:"energy-track",variant:"power"}},
      {id:"ene-10",skill:"Stopping distance scaling",difficulty:"Hard",description:"Compara trabajo de fricción con energía cinética inicial.",prompt:"Un bloque se frena por fricción cinética constante y se detiene tras recorrer d. Si inicia con el doble de rapidez, bajo las mismas condiciones se detiene tras aproximadamente:",options:{A:"2d",B:"d/2",C:"√2 d",D:"4d"},visual:{type:"energy-track",variant:"braking"}}
    ]
  });

  enrich("momentum", {
    olympiadTheory:[
      {title:"Define el sistema", text:"Momentum solo se conserva para el sistema que elegiste si el impulso externo neto es despreciable durante el intervalo. En un choque breve, peso y normal pueden ser irrelevantes horizontalmente aunque sigan existiendo."},
      {title:"Dos etapas, dos principios", text:"En péndulo balístico y problemas semejantes, el choque usa momentum; el movimiento posterior usa energía. Intentar conservar energía a través del choque inelástico produce un error estructural."},
      {title:"Impulso como área", text:"La forma de F(t) importa por su área, no solo por el pico. Triángulos, trapecios y pulsos simétricos permiten resolver cambios de momentum gráficamente."},
      {title:"Centro de masa", text:"El movimiento del centro de masa depende del momentum total. Puede simplificar explosiones y múltiples cuerpos incluso cuando las velocidades individuales cambian de forma compleja."}
    ],
    contestUse:{qualifier:"Usar signos y áreas F-t correctamente.",semifinal:"Separar etapas de choque y movimiento posterior con principios distintos.",final:"Trabajar en el marco del centro de masa y analizar colisiones o explosiones multietapa."},
    decisionSteps:["¿Cuál es mi sistema durante el intervalo?","¿El impulso externo puede despreciarse?","¿El choque conserva también energía cinética o solo momentum?","¿Hay una segunda etapa que exige otro principio?"],
    visual:{type:"momentum-collision",title:"Collision laboratory",caption:"Dos carros se aproximan, interactúan y separan/adhieren. Observa que fuerzas internas pueden ser grandes mientras el momentum total del sistema permanece controlado."},
    problemLens:"Marca el sistema y el intervalo de tiempo. Decide explícitamente qué se conserva y en qué etapa.",
    extraQuestions:[
      {id:"mom-07",skill:"Perfectly inelastic collision",difficulty:"Medium",description:"Choque corto con cuerpos que quedan unidos; la energía cinética no se conserva.",prompt:"Una partícula de masa m y rapidez v se incrusta en un bloque de masa 9m inicialmente en reposo sobre una superficie horizontal sin fricción. La rapidez inmediatamente después del choque es:",options:{A:"v/2",B:"v/9",C:"v/10",D:"10v"},visual:{type:"momentum-collision",variant:"embed"}},
      {id:"mom-08",skill:"Impulse graph",difficulty:"Medium",description:"Lee el impulso directamente como área bajo una gráfica fuerza-tiempo triangular.",prompt:"Una fuerza varía formando un pulso triangular de base 4 s y altura máxima 10 N. ¿Cuál es el impulso total?",options:{A:"10 N·s",B:"20 N·s",C:"40 N·s",D:"80 N·s"},visual:{type:"momentum-collision",variant:"impulse"}},
      {id:"mom-09",skill:"Explosion",difficulty:"Hard",description:"El sistema parte con momentum cero; los fragmentos deben salir con momenta opuestos.",prompt:"Un objeto en reposo explota en fragmentos de masas m y 3m. Si el fragmento ligero sale con rapidez v, la rapidez del fragmento pesado es:",options:{A:"3v",B:"v",C:"v/9",D:"v/3"},visual:{type:"momentum-collision",variant:"explosion"}},
      {id:"mom-10",skill:"Center of mass",difficulty:"Hard",description:"Calcula la velocidad del centro de masa a partir del momentum total con signos.",prompt:"Una masa 2m se mueve a +3v y una masa m se mueve a −v sobre la misma línea. La velocidad del centro de masa es:",options:{A:"+5v/3",B:"+2v/3",C:"+v",D:"0"},visual:{type:"momentum-collision",variant:"center-mass"}}
    ]
  });

  enrich("circular-gravity", {
    olympiadTheory:[
      {title:"Radial no significa fuerza nueva", text:"La ecuación radial \(\sum F_r=mv^2/r\) usa fuerzas reales: tensión, normal, gravedad, fricción. 'Centrípeta' describe el papel de la resultante, no un agente adicional."},
      {title:"Escala con el radio correcto", text:"En gravitación r se mide desde el centro de masa del cuerpo fuente. Duplicar altura sobre la superficie no suele duplicar r; este detalle cambia por completo una ley inversa al cuadrado."},
      {title:"Órbitas como equilibrio dinámico", text:"En una órbita circular la gravedad produce aceleración radial. De allí salen relaciones de velocidad y periodo; luego el escalamiento evita sustituir G, M o números enormes."},
      {title:"Condiciones de contacto", text:"En loops y curvas, la normal puede aumentar o disminuir según la posición. En el punto donde se pierde contacto, N llega a cero: una condición límite muy frecuente."}
    ],
    contestUse:{qualifier:"Aplicar rápidamente leyes de potencia en r y v.",semifinal:"Construir ecuaciones radiales por posición y distinguir peso de fuerza normal.",final:"Combinar energía, gravedad y dinámica radial en órbitas o trayectorias límite."},
    decisionSteps:["¿Cuál es la dirección radial hacia el centro?","¿Qué fuerzas reales tienen componente radial?","¿La pregunta pide rapidez, periodo, fuerza o condición de contacto?","¿Puedo resolver por escalamiento antes de usar constantes?"],
    visual:{type:"orbit",title:"Orbital and circular-motion laboratory",caption:"La velocidad es tangencial mientras la aceleración/resultante radial apunta al centro. El satélite cambia dirección aunque su rapidez pueda ser constante."},
    problemLens:"Dibuja la dirección radial, nombra las fuerzas reales y usa proporciones de r antes de números grandes.",
    extraQuestions:[
      {id:"cg-07",skill:"Banked curve",difficulty:"Hard",description:"La geometría de la normal permite una curva sin fricción a una rapidez específica.",prompt:"Una curva de radio r está peraltada un ángulo θ y se diseña para que un automóvil pueda tomarla sin fricción. ¿Qué relación debe cumplir su rapidez v?",options:{A:"sinθ=v²/(rg)",B:"tanθ=v²/(rg)",C:"cosθ=v²/(rg)",D:"tanθ=rg/v²"},visual:{type:"orbit",variant:"banked"}},
      {id:"cg-08",skill:"Apparent weight in circle",difficulty:"Hard",description:"En el punto más bajo, la resultante centrípeta apunta hacia arriba.",prompt:"Un pasajero de masa m atraviesa el punto más bajo de una trayectoria circular vertical de radio r con rapidez v. La fuerza normal del asiento es:",options:{A:"mg−mv²/r",B:"mv²/r",C:"mg",D:"mg+mv²/r"},visual:{type:"orbit",variant:"bottom-loop"}},
      {id:"cg-09",skill:"Kepler scaling",difficulty:"Hard",description:"Transforma una razón de periodos en una razón de radios usando una potencia 3/2.",prompt:"Para satélites alrededor del mismo planeta, T²∝r³. Si el periodo orbital se duplica, el radio orbital se multiplica por:",options:{A:"2",B:"4",C:"2^(2/3)",D:"√2"},visual:{type:"orbit",variant:"kepler"}},
      {id:"cg-10",skill:"Escape-speed scaling",difficulty:"Hard",description:"La rapidez de escape depende de r con una potencia negativa de un medio.",prompt:"La rapidez de escape desde una distancia r del centro de un planeta es ve. Desde una distancia 4r, ignorando otros cuerpos, vale:",options:{A:"ve/2",B:"ve/4",C:"2ve",D:"4ve"},visual:{type:"orbit",variant:"escape"}}
    ]
  });

  enrich("rotation-equilibrium", {
    olympiadTheory:[
      {title:"Elige el pivote estratégicamente", text:"En equilibrio puedes calcular torques alrededor de cualquier punto. Elegir una bisagra o apoyo elimina de la ecuación fuerzas desconocidas que pasan por ese punto."},
      {title:"Brazo perpendicular", text:"El torque depende de la distancia perpendicular entre el eje y la línea de acción. No toda distancia r sirve; un dibujo geométrico correcto evita factores seno/coseno equivocados."},
      {title:"Momento de inercia es distribución", text:"No depende solo de masa total. Alejar masa del eje aumenta I fuertemente porque aparecen distancias al cuadrado. Esto explica cambios grandes de ω por pequeñas redistribuciones."},
      {title:"Rodadura conecta traslación y rotación", text:"Sin deslizamiento, \(v=\omega R\). Esta restricción permite pasar entre variables lineales y angulares y suele acompañarse de conservación de energía."}
    ],
    contestUse:{qualifier:"Comparar torques y brazos de palanca visualmente.",semifinal:"Resolver barras, apoyos y centros de masa con elección estratégica de pivote.",final:"Combinar momento angular, energía rotacional y restricciones de rodadura."},
    decisionSteps:["¿Dónde conviene poner el pivote?","¿Cuál es la distancia perpendicular de cada fuerza?","¿El sistema está en equilibrio o tiene aceleración angular?","¿Existe conservación de momento angular o condición de rodadura?"],
    visual:{type:"lever",title:"Torque and equilibrium laboratory",caption:"La misma fuerza produce efectos distintos al cambiar el brazo. El pivote correcto puede eliminar incógnitas enteras de la ecuación."},
    problemLens:"Dibuja líneas de acción y brazos perpendiculares. En equilibrio, escoge un pivote que simplifique la mayor cantidad de incógnitas.",
    extraQuestions:[
      {id:"rot-07",skill:"Torque balance",difficulty:"Medium",description:"Equilibra dos torques opuestos sin necesidad de conocer las fuerzas del apoyo.",prompt:"Una barra ideal está en equilibrio alrededor de un pivote. Una fuerza de 20 N actúa a 0.20 m a un lado. ¿Qué fuerza perpendicular aplicada a 0.40 m al otro lado equilibra la barra?",options:{A:"5 N",B:"10 N",C:"20 N",D:"40 N"},visual:{type:"lever",variant:"balance"}},
      {id:"rot-08",skill:"Angular momentum",difficulty:"Hard",description:"Una redistribución interna cambia I pero no el momento angular si el torque externo es despreciable.",prompt:"Un sistema gira sin torque externo apreciable. Si su momento de inercia se reduce a la mitad, su rapidez angular:",options:{A:"Se reduce a la mitad",B:"No cambia",C:"Se cuadruplica",D:"Se duplica"},visual:{type:"lever",variant:"skater"}},
      {id:"rot-09",skill:"Rolling constraint",difficulty:"Medium",description:"Relaciona velocidad lineal del centro de masa y velocidad angular.",prompt:"Para una rueda de radio R que rueda sin deslizar con velocidad angular ω, la rapidez de su centro de masa es:",options:{A:"ωR",B:"ω/R",C:"ωR²",D:"R/ω"},visual:{type:"lever",variant:"rolling"}},
      {id:"rot-10",skill:"Moment of inertia scaling",difficulty:"Medium",description:"La distancia al eje entra al cuadrado en el momento de inercia de una masa puntual.",prompt:"Una masa puntual m está a distancia r de un eje y tiene momento de inercia I. Si se mueve a distancia 2r, su nuevo momento de inercia es:",options:{A:"2I",B:"I/2",C:"4I",D:"8I"},visual:{type:"lever",variant:"inertia"}}
    ]
  });

  enrich("fluids", {
    olympiadTheory:[
      {title:"Presión depende de profundidad", text:"En un fluido estático homogéneo, la forma del recipiente no entra en \(P=P_0+\rho gh\). Esta independencia genera preguntas conceptuales que parecen geométricas pero se resuelven por profundidad."},
      {title:"Empuje = peso del fluido desplazado", text:"No es automáticamente igual al peso del objeto. Solo en flotación en equilibrio ambas magnitudes coinciden. La fracción sumergida sale de comparar densidades."},
      {title:"Máquinas hidráulicas intercambian fuerza por distancia", text:"Pascal amplifica fuerza con razón de áreas, pero conservación de volumen exige que el pistón grande se mueva menos. No hay ganancia gratuita de trabajo ideal."},
      {title:"Continuidad + Bernoulli", text:"En flujo ideal, una constricción cambia la rapidez por continuidad y la presión por balance energético. Mantén separadas las dos ideas y revisa si la altura también cambia."}
    ],
    contestUse:{qualifier:"Reconocer profundidad, densidad y continuidad sin dejarse engañar por la forma.",semifinal:"Combinar Arquímedes, Pascal y Bernoulli con balances de energía y volumen.",final:"Resolver flujos con múltiples secciones, niveles y condiciones de salida usando conservación sistemática."},
    decisionSteps:["¿El fluido está estático o en movimiento?","¿Importa profundidad, volumen desplazado o caudal?","¿Qué magnitud se conserva: presión transmitida, volumen, caudal o energía?","¿La geometría cambia una variable física o solo distrae?"],
    visual:{type:"fluids",title:"Fluid reasoning laboratory",caption:"Partículas aceleran en la sección estrecha mientras las columnas y pistones muestran cómo profundidad, área y continuidad controlan el problema."},
    problemLens:"Decide primero si es hidrostática, flotación o flujo. Después identifica qué variable geométrica sí entra en la ley física.",
    extraQuestions:[
      {id:"flu-07",skill:"Torricelli scaling",difficulty:"Hard",description:"La rapidez de salida depende de la raíz cuadrada de la profundidad bajo la superficie libre.",prompt:"Un pequeño orificio está a profundidad h bajo la superficie de un depósito grande. Si la profundidad pasa a 4h, la rapidez ideal de salida del líquido:",options:{A:"Se cuadruplica",B:"No cambia",C:"Se duplica",D:"Aumenta por √8"},visual:{type:"fluids",variant:"torricelli"}},
      {id:"flu-08",skill:"Hydraulic displacement",difficulty:"Hard",description:"La ventaja mecánica de presión viene acompañada de una desventaja en desplazamiento.",prompt:"En una prensa hidráulica ideal A2=5A1. Si el pistón pequeño desciende una distancia x, ¿cuánto sube el pistón grande?",options:{A:"x/5",B:"x",C:"5x",D:"25x"},visual:{type:"fluids",variant:"hydraulic"}},
      {id:"flu-09",skill:"Floating ice",difficulty:"Hard",description:"Problema conceptual clásico de Arquímedes y conservación de masa.",prompt:"Un cubo de hielo puro flota en un vaso de agua lleno parcialmente. Al derretirse por completo, despreciando evaporación, el nivel del agua:",options:{A:"Sube",B:"Baja",C:"Depende del tamaño del hielo",D:"Permanece igual"},visual:{type:"fluids",variant:"ice"}},
      {id:"flu-10",skill:"Efflux comparison",difficulty:"Medium",description:"La forma del recipiente no cambia la rapidez ideal si la profundidad del orificio es la misma.",prompt:"Dos recipientes de formas distintas contienen el mismo líquido. Cada uno tiene un orificio pequeño a la misma profundidad h bajo su superficie libre. Idealmente, las rapideces de salida son:",options:{A:"Mayor en el recipiente ancho",B:"Iguales",C:"Mayor en el recipiente estrecho",D:"Imposibles de comparar sin conocer el volumen total"},visual:{type:"fluids",variant:"two-tanks"}}
    ]
  });

  for (const topic of data.topics) {
    if (Array.isArray(topic.extraQuestions)) topic.questions.push(...topic.extraQuestions);
  }

  const visualMap = {
    "tv-02":{type:"vector-components",variant:"two-vectors",angle:90},
    "tv-05":{type:"vector-components",variant:"components",angle:37},
    "kin-02":{type:"kinematics-graph",variant:"velocity-cross"},
    "kin-06":{type:"kinematics-graph",variant:"track"},
    "dyn-03":{type:"dynamics-incline",variant:"sliding-up"},
    "dyn-04":{type:"dynamics-incline",variant:"connected"},
    "ene-03":{type:"energy-track",variant:"two-paths"},
    "ene-04":{type:"energy-track",variant:"circular-work"},
    "mom-01":{type:"momentum-collision",variant:"stick"},
    "mom-04":{type:"momentum-collision",variant:"impulse"},
    "cg-01":{type:"orbit",variant:"uniform-circle"},
    "cg-05":{type:"orbit",variant:"kepler"},
    "rot-01":{type:"lever",variant:"door"},
    "rot-04":{type:"lever",variant:"seesaw"},
    "flu-01":{type:"fluids",variant:"hydrostatic"},
    "flu-05":{type:"fluids",variant:"continuity"}
  };

  for (const topic of data.topics) {
    for (const q of topic.questions) {
      if (!q.description) q.description = topic.problemLens;
      if (!q.visual && visualMap[q.id]) q.visual = visualMap[q.id];
    }
  }
})();
