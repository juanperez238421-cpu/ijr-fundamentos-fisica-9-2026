# Clasificación documental en el navegador

Antes de crear o actualizar un expediente, se analiza el texto extraído por PDF.js. Se distinguen `planeacion`, `cronograma`, `articulo_cientifico` e `indeterminado`. Solo `planeacion` continúa en el módulo de planeaciones. Una planeación con cronograma interno sigue admitiéndose si presenta suficientes componentes didácticos.

Esta clasificación usa grupos de expresiones regulares y NO es un modelo de IA: puede tener falsos positivos o negativos, especialmente con tablas, encabezados inusuales, OCR insuficiente o documentos muy breves. Un resultado `indeterminado` no equivale a fraude y requiere revisión manual/OCR; nunca se crea un informe pedagógico de un documento no validado. Esta demo no tiene flujo autenticado de excepciones.

No hay carga del archivo a Supabase ni a proveedores externos: el PDF se procesa dentro del navegador. No modificar `public.nexo_academic_reviews_v1` ni las funciones de cursos existentes para esta mejora.

## Pruebas

`node --test tests/document-classifier.test.mjs`

`node --check app.js`

`python3 -m unittest discover -s tests -v`

Antes del despliegue, validar además con PDF reales anonimizados y revisar regresiones de interfaz, reentrega, IndexedDB y caché PWA.

## Asignaturas y grupos

El formulario de carga incorpora un catálogo ampliado de materias, con la opción **Otra asignatura** para registrar una materia no listada. El grado académico permanece numérico (`grade`: 1 a 11), y el grupo se almacena de forma independiente (`group`: `A`, `B`, `C` o vacío) para no alterar las búsquedas de mallas ni los expedientes existentes. La interfaz presenta `9B` o `9.º` según el caso. Los valores quedan en el expediente JSON y pueden buscarse en la bandeja. Elegir una asignatura no crea una referencia curricular: las mallas deben aportarse como PDFs originales según grado, asignatura y período; quedan pendientes de verificación institucional.

Pruebas de campos académicos: `node --test tests/academic-fields.test.mjs`.

## Referencia original y notas entre documentos

En la pestaña Malla se incorpora un PDF original con estructura curricular. La app guarda el SHA-256, ámbito grado/área/período, fecha, nombre de archivo y advertencias localmente, y permite leer todas sus páginas sin traducción. Una malla aportada no se considera validada.

Las observaciones se ubican sobre la malla o el PEI y sobre el PDF de la planeación. La opción Vincular a evidencia del otro PDF requiere un segundo clic sobre la localización verdadera. Las notas quedan asociadas a página, coordenadas, versión y hash, sin trasladar posiciones arbitrariamente entre documentos.

El logo se enlaza desde el sitio oficial del Instituto; se amplió la tipografía, se introdujeron verde/azul y acentos cálidos y se marca el visor PDF con translate=no.
