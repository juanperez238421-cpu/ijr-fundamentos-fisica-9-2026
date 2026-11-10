import test from 'node:test';
import assert from 'node:assert/strict';
import { SUBJECTS, GROUPS, normalizeSubject, normalizeGroup, gradeLabel } from '../academic-fields.mjs';
test('catálogo contiene las áreas solicitadas', () => {
  for (const subject of ['Ciencias Naturales','Filosofía','Matemáticas','Álgebra','Física','Sistemas','Geometría','Estadística']) assert.ok(SUBJECTS.includes(subject),subject);
});
test('grupos A, B y C funcionan con grados 1.º a 11.º', () => {
  assert.deepEqual(GROUPS,['A','B','C']);
  for (let grade=1;grade<=11;grade++) for (const group of GROUPS) assert.equal(gradeLabel(grade,group),`${grade}${group}`);
  assert.equal(gradeLabel(9,''),'9.º');
});
test('el área personalizada conserva el valor académico', () => {
  assert.equal(normalizeSubject('Otra asignatura',' Música '),'Música');
  assert.throws(()=>normalizeSubject('Otra asignatura',''));
  assert.throws(()=>normalizeSubject('No registrada'));
  assert.equal(normalizeSubject('Física'),'Física');
});
test('grupos fuera de catálogo se rechazan sin escribir', () => {
  assert.equal(normalizeGroup('C'),'C');
  assert.equal(normalizeGroup(''),'');
  assert.throws(()=>normalizeGroup('D'));
});
