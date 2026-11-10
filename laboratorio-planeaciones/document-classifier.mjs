/** Clasificación orientativa sin IA ni envío al servidor. Una coincidencia no acredita cumplimiento curricular. */
export function classifyDocument(pages) {
  const input = (Array.isArray(pages) ? pages : []).map(p => typeof p?.text === 'string' ? p.text : '').join(' ');
  const text = input.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/\s+/g, ' ');
  if (text.trim().length < 80) return {type:'indeterminado',label:'Documento indeterminado',reason:'El PDF no contiene suficiente texto extraíble para identificar su estructura. Verifica el archivo o utiliza OCR.',signals:[]};
  const matches = groups => groups.filter(([,rx]) => rx.test(text)).map(([label]) => label);
  const pedagogy = matches([
    ['Formato de planeación',/\b(?:planeacion(?:es)?(?: didactica| academica)?|plan de (?:clase|aula|area)|secuencia didactica|unidad didactica)\b/],
    ['Objetivos y competencias',/\b(?:objetivos?(?: de aprendizaje| pedagogicos?| de la clase| de la sesion| generales?| especificos?)?|propositos? de aprendizaje|competencias? (?:a desarrollar|especificas?|del area)|desempenos? esperados?|aprendizajes? esperados?)\b/],
    ['Actividades didácticas',/\b(?:actividades? (?:de aprendizaje|de ensenanza|pedagogicas?|de inicio|de desarrollo|de cierre)|estrategias? didacticas?|exploracion de saberes|saberes previos|momentos? de la clase|secuencia didactica)\b/],
    ['Evaluación pedagógica',/\b(?:evaluacion(?:es)?(?: formativa| diagnostica| sumativa| de aprendizajes?)?|criterios? de evaluacion|instrumentos? de evaluacion|rubricas?|evidencias? de aprendizaje|seguimiento al aprendizaje)\b/],
    ['Contexto escolar',/\b(?:grado (?:primero|segundo|tercero|cuarto|quinto|sexto|septimo|octavo|noveno|decimo|undecimo|\d{1,2})|asignatura|area de conocimiento|periodo academico|institucion educativa|docente(?:s)?|grupo [0-9]{1,2}[a-z]?)\b/],
    ['Recursos de clase',/\b(?:recursos? didacticos?|materiales? pedagogicos?|tiempo estimado de clase|derechos? basicos? de aprendizaje|estandares? basicos? de competencias|dba)\b/]
  ]);
  const schedule = matches([
    ['Título cronograma',/\b(?:cronograma|calendario de actividades|programacion (?:semanal|de actividades)|plan de trabajo calendarizado)\b/],
    ['Semanas o sesiones numeradas',/\b(?:semana|sesion)\s*(?:n(?:umero)?\s*)?[0-9]{1,2}\b/],
    ['Fechas y plazos',/\b(?:fecha(?:s)? de (?:inicio|fin|cierre|entrega|ejecucion)|fecha de entrega|fecha limite|plazo de entrega|inicio y fin)\b/],
    ['Responsables e hitos',/\b(?:responsables?|hitos?|entregables?)\b/],
    ['Distribución mensual',/\b(?:enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)\b/],
    ['Duración planificada',/\b(?:duracion de actividades|periodo de ejecucion|tiempo de ejecucion)\b/]
  ]);
  const research = matches([
    ['Identificador DOI',/(?:\bdoi\b|doi\.org\/|10\.[0-9]{4,9}\/)/],
    ['Resumen y palabras clave',/\b(?:abstract|keywords|palabras clave|articulo cientifico)\b/],
    ['Métodos y resultados científicos',/\b(?:materials and methods|resultados y discusion|results and discussion|methodology|metodologia de investigacion|experimental setup|resultados experimentales)\b/],
    ['Referencias científicas',/\b(?:references|referencias bibliograficas|bibliografia|works cited)\b/],
    ['Disciplina CFD',/\b(?:computational fluid dynamics|cfd|navier.stokes|rans|turbinas?|experimental characterization|simulacion numerica)\b/]
  ]);
  if (research.length >= 3 && (research.includes('Identificador DOI') || research.includes('Resumen y palabras clave') || research.includes('Referencias científicas')) && (research.length >= 4 || pedagogy.length < 3))
    return {type:'articulo_cientifico',label:'Artículo científico detectado',reason:'Presenta estructura propia de una publicación científica, no de una planeación docente.',signals:research};
  const hasPedagogy = pedagogy.includes('Formato de planeación') || (pedagogy.includes('Objetivos y competencias') && pedagogy.includes('Actividades didácticas') && pedagogy.includes('Evaluación pedagógica'));
  if (pedagogy.length >= 3 && hasPedagogy)
    return {type:'planeacion',label:'Planeación académica probable',reason:schedule.length >= 2 ? 'Incluye elementos de cronograma, pero también una estructura pedagógica identificable. Requiere revisión humana.' : 'Se identifican componentes pedagógicos suficientes para continuar la revisión; la clasificación no certifica calidad ni alineación curricular.',signals:pedagogy};
  const scheduleStrong = schedule.includes('Título cronograma');
  if ((scheduleStrong && schedule.length >= 2) || (schedule.length >= 3 && schedule.includes('Semanas o sesiones numeradas') && schedule.includes('Fechas y plazos')))
    return {type:'cronograma',label:'Cronograma detectado',reason:'El documento organiza actividades en el tiempo, pero no acredita estructura suficiente de planeación didáctica.',signals:schedule};
  if (research.length >= 3) return {type:'indeterminado',label:'Documento no validado como planeación',reason:'Se encontraron características de un texto académico; requiere verificación manual.',signals:research};
  return {type:'indeterminado',label:'Documento no validado como planeación',reason:'No se identificaron suficientes componentes para afirmar que sea una planeación o un cronograma. Verifica el documento antes de entregarlo.',signals:[...pedagogy,...schedule].slice(0,6)};
}
