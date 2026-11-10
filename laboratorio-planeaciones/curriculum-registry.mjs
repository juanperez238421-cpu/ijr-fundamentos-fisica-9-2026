/** Scoped curriculum source checks. Uploaded files are not institutionally certified. */
export const CURRICULUM_KEY='ijr-planning-curriculum-v1';
export function normalizeCurriculumText(value){return String(value??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\s+/g,' ').trim();}
export function curriculumScope(grade,area,period){
  const g=String(grade).trim(),a=normalizeCurriculumText(area),p=String(period).trim().toUpperCase();
  if(!/^(?:[1-9]|1[01])$/.test(g)||!a||!/^(?:I|II|III|IV)$/.test(p))throw Error('Ámbito curricular inválido.');
  return JSON.stringify([g,a,p]);
}
export function inspectCurriculumPdf(pages,scope){
  const raw=Array.isArray(pages)?pages.map(p=>typeof p?.text==='string'?p.text:'').join(' '):'';
  const txt=normalizeCurriculumText(raw);
  if(txt.length<120)return {accepted:false,signals:[],warnings:['PDF sin texto suficiente: verificar OCR o contenido.']};
  const groups=[
    ['Malla curricular',/\bmallas? curricular(?:es)?\b/],
    ['Plan de área',/\bplan(?:es)? de area\b/],
    ['Ejes curriculares',/\bejes? (?:curriculares|tematicos|de aprendizaje)\b/],
    ['Estándares',/\bestandares?(?: basicos?)? de competencias?\b/],
    ['Desempeños',/\b(?:desempenos?|derechos basicos de aprendizaje|dba)\b/],
    ['Objetivos',/\bobjetivos?\b/],
    ['Contenidos',/\b(?:contenidos?|tematicas?|saberes?)\b/]
  ];
  const signals=groups.filter(([,rx])=>rx.test(txt)).map(([k])=>k);
  if(/\b(?:doi|abstract|references|computational fluid dynamics|results and discussion)\b/.test(txt) && signals.length<4)
    return {accepted:false,signals,warnings:['Posible artículo científico, no una malla.']};
  if(signals.length<2||!signals.some(v=>['Malla curricular','Plan de área','Ejes curriculares','Estándares'].includes(v)))
    return {accepted:false,signals,warnings:['No se identificó una estructura suficiente de malla o plan de área.']};
  const warnings=[];
  if(scope){
    const a=normalizeCurriculumText(scope.area);
    if(a&&!txt.includes(a))warnings.push('Asignatura declarada no verificada dentro del texto.');
    const g=String(scope.grade),labels=['','primero','segundo','tercero','cuarto','quinto','sexto','septimo','octavo','noveno','decimo','undecimo'];
    if(!new RegExp('\\bgrado\\s*'+g+'\\b').test(txt)&&!txt.includes('grado '+labels[Number(g)]))warnings.push('Grado no confirmado en el PDF.');
    const p=String(scope.period);
    if(!txt.includes('periodo '+p.toLowerCase())&&!txt.includes('periodo '+({I:'1',II:'2',III:'3',IV:'4'})[p]))warnings.push('Período no confirmado en el PDF.');
  }
  warnings.push('Fuente aportada: PENDIENTE de validación de autoría y vigencia por coordinación.');
  return {accepted:true,signals,warnings};
}
export function displaySource(ref){return !ref?'Malla institucional no aportada':ref.status==='verificada'?'Referencia validada':'PDF aportado · pendiente de validación';}
