const DIAGNOSTIC_CONFIG={course:"Fundamentos de Física 9°",period:"2026-2",totalQuestions:15,secondsPerQuestion:60,teacherPassword:"fis9-docente-2026",groups:["9A","9B","9C"]};
const QUESTIONS=[
{id:1,topic:"Magnitudes físicas",answer:"B",skill:"Diferenciar magnitudes escalares y vectoriales"},
{id:2,topic:"Unidades del SI",answer:"C",skill:"Reconocer unidades básicas y derivadas"},
{id:3,topic:"Conversión de unidades",answer:"A",skill:"Convertir longitudes, masas o tiempos"},
{id:4,topic:"Notación científica",answer:"D",skill:"Expresar cantidades grandes o pequeñas"},
{id:5,topic:"Lectura de gráficas",answer:"B",skill:"Interpretar relaciones entre variables"},
{id:6,topic:"Movimiento rectilíneo",answer:"A",skill:"Relacionar distancia, tiempo y rapidez"},
{id:7,topic:"Velocidad promedio",answer:"C",skill:"Calcular razón de cambio de posición"},
{id:8,topic:"Aceleración",answer:"D",skill:"Reconocer cambio de velocidad en el tiempo"},
{id:9,topic:"Fuerza",answer:"B",skill:"Identificar interacciones y efectos de una fuerza"},
{id:10,topic:"Masa y peso",answer:"A",skill:"Distinguir masa, peso y gravedad"},
{id:11,topic:"Energía",answer:"C",skill:"Reconocer formas y transformaciones de energía"},
{id:12,topic:"Trabajo mecánico",answer:"B",skill:"Relacionar fuerza, desplazamiento y energía"},
{id:13,topic:"Presión",answer:"D",skill:"Relacionar fuerza y área"},
{id:14,topic:"Método científico",answer:"A",skill:"Identificar hipótesis, variable y evidencia"},
{id:15,topic:"Resolución de problemas",answer:"C",skill:"Seleccionar el procedimiento físico adecuado"}
];
const GROUP_RESULTS={"9A":{students:0,average:null,questions:QUESTIONS.map(q=>({id:q.id,correctPercent:null,dominantError:"Pendiente por cargar resultados"}))},"9B":{students:0,average:null,questions:QUESTIONS.map(q=>({id:q.id,correctPercent:null,dominantError:"Pendiente por cargar resultados"}))},"9C":{students:0,average:null,questions:QUESTIONS.map(q=>({id:q.id,correctPercent:null,dominantError:"Pendiente por cargar resultados"}))}};
const INDIVIDUAL_RESULTS={"9A":{},"9B":{},"9C":{}};