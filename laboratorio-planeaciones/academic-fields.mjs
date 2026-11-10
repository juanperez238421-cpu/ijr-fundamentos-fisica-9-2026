// Catálogo ampliable de asignaturas; la selección no equivale a tener una malla validada.
export const SUBJECTS = Object.freeze([
  "Geometría",
  "Matemáticas",
  "Álgebra",
  "Física",
  "Ciencias Naturales",
  "Biología",
  "Química",
  "Estadística",
  "Filosofía",
  "Sistemas",
  "Tecnología e Informática",
  "Informática",
  "Programación",
  "Ciencias Sociales",
  "Historia",
  "Geografía",
  "Lengua Castellana",
  "Inglés",
  "Ética y Valores",
  "Educación Religiosa",
  "Educación Artística",
  "Educación Física",
  "Emprendimiento",
  "Seminario",
  "Taller de Matemáticas"
]);
export const GROUPS = Object.freeze(['A','B','C']);
export function normalizeSubject(selection, other = '') {
  const value = selection === 'Otra asignatura' ? String(other).trim() : String(selection).trim();
  if (!value || value.length > 80) throw Error('Especifica una asignatura válida (máximo 80 caracteres).');
  if (selection !== 'Otra asignatura' && !SUBJECTS.includes(selection)) throw Error('Selecciona una asignatura del catálogo.');
  return value;
}
export function normalizeGroup(group = '') {
  if (group === '' || group === null || group === undefined) return '';
  if (!GROUPS.includes(group)) throw Error('Selecciona un grupo A, B o C.');
  return group;
}
export function gradeLabel(grade, group = '') {
  const g = String(grade);
  return /^[1-9]$|^1[01]$/.test(g) ? (GROUPS.includes(group) ? g + group : g + '.º') : g;
}
