import test from 'node:test';
import assert from 'node:assert/strict';
import { classifyDocument } from '../document-classifier.mjs';

const examples = [
  [
    "artículo CFD",
    "CFD and experimental characterization of a hydrokinetic turbine. Abstract: computational fluid dynamics. Keywords: flow. Materials and Methods. Results and Discussion. References. DOI: 10.1016/j.foo.2026.1",
    "articulo_cientifico"
  ],
  [
    "cronograma",
    "CRONOGRAMA DE ACTIVIDADES. Semana 1: preparar laboratorio; semana 2: aplicar evaluación. Fecha de entrega: noviembre. Responsable: coordinación.",
    "cronograma"
  ],
  [
    "planeación",
    "Planeación académica. Docente: Persona. Grado 9. Asignatura Física. Objetivos de aprendizaje: describir caída libre. Actividades de aprendizaje: laboratorio, discusión. Evaluación formativa mediante rúbrica.",
    "planeacion"
  ],
  [
    "planeación con cronograma",
    "Planeación de clase. Grado 8. Docente de Matemáticas. Objetivos de aprendizaje: medir áreas. Actividades de aprendizaje: diseñar figuras. Evaluación formativa. Cronograma: semana 1, fecha de entrega 20 noviembre.",
    "planeacion"
  ],
  [
    "cronograma de obra",
    "Cronograma de actividades de instalación. Fecha de inicio: 11 de noviembre. Hitos: entrega y montaje. Responsables: equipo de mantenimiento.",
    "cronograma"
  ],
  [
    "documento corto",
    "Hola",
    "indeterminado"
  ],
  [
    "PDF sin texto",
    "",
    "indeterminado"
  ],
  [
    "informe genérico",
    "Un informe genérico sobre la evolución histórica de los sistemas y fenómenos físicos en el ambiente, con discusión de distintos aspectos organizativos de una institución.",
    "indeterminado"
  ],
  [
    "artículo educativo",
    "Abstract. Keywords: curriculum. Research article. Objetivos de aprendizaje. Actividades de aprendizaje. Evaluación formativa. Metodología de investigación. References. DOI 10.1234/school.2026",
    "articulo_cientifico"
  ]
];
for (const [name, text, expected] of examples) {
  test(name, () => assert.equal(classifyDocument([{ page: 1, text }]).type, expected));
}
