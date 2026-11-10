import test from 'node:test';
import assert from 'node:assert/strict';
import {curriculumScope,inspectCurriculumPdf,displaySource} from '../curriculum-registry.mjs';
const scope={grade:'9',area:'Física',period:'III'};
test('scope grade subject period, group independent',()=>{
 assert.equal(curriculumScope(9,'Física','III'),curriculumScope('9','FÍSICA','III'));
 assert.notEqual(curriculumScope(8,'Física','III'),curriculumScope(9,'Física','III'));
});
test('reject scientific article',()=>{
 assert.equal(inspectCurriculumPdf([{page:1,text:'Abstract. CFD computational fluid dynamics. Results and discussion. References. DOI 10.1016. Methods of experimentation.'}],scope).accepted,false);
});
test('curriculum PDF is candidate, never certified',()=>{
 const r=inspectCurriculumPdf([{page:1,text:'Instituto Jorge Robledo. Malla curricular de Física. Grado 9. Período III. Ejes temáticos, desempeños, contenidos por período, estándares básicos de competencias, objetivos y evaluación.'}],scope);
 assert.equal(r.accepted,true);
 assert.match(r.warnings.join(' '),/PENDIENTE/);
 assert.match(displaySource({status:'pendiente'}),/pendiente/);
});
test('reject short or unrelated content',()=>{
 assert.equal(inspectCurriculumPdf([{page:1,text:''}],scope).accepted,false);
 assert.equal(inspectCurriculumPdf([{page:1,text:'Este es un informe general del colegio con información administrativa y gestión documental sin contenido de malla curricular ni objetivos de grado.'}],scope).accepted,false);
});
test('recognize singular malla curricular and plan de área titles',()=>{
 const m=inspectCurriculumPdf([{page:1,text:'Malla curricular institucional de Matemáticas para grado octavo. Desempeños y objetivos de aprendizaje, periodo tercero, además de competencias y recursos de clase.'}],{grade:'8',area:'Matemáticas',period:'III'});
 assert.equal(m.accepted,true);
 assert.ok(m.signals.includes('Malla curricular'));
 const p=inspectCurriculumPdf([{page:1,text:'Plan de área de Física para noveno grado. Contenidos, ejes temáticos y objetivos de aprendizaje, desempeños esperados.'}],scope);
 assert.equal(p.accepted,true);
 assert.ok(p.signals.includes('Plan de área'));
});