# Clasificación documental en el navegador

Antes de crear o actualizar un expediente, se analiza el texto extraído por PDF.js. Se distinguen `planeacion`, `cronograma`, `articulo_cientifico` e `indeterminado`. Solo `planeacion` continúa en el módulo de planeaciones. Una planeación con cronograma interno sigue admitiéndose si presenta suficientes componentes didácticos.

Esta clasificación usa grupos de expresiones regulares y NO es un modelo de IA: puede tener falsos positivos o negativos, especialmente con tablas, encabezados inusuales, OCR insuficiente o documentos muy breves. Un resultado `indeterminado` no equivale a fraude y requiere revisión manual/OCR; nunca se crea un informe pedagógico de un documento no validado. Esta demo no tiene flujo autenticado de excepciones.

No hay carga del archivo a Supabase ni a proveedores externos: el PDF se procesa dentro del navegador. No modificar `public.nexo_academic_reviews_v1` ni las funciones de cursos existentes para esta mejora.

## Pruebas

`node --test tests/document-classifier.test.mjs`

`node --check app.js`

`python3 -m unittest discover -s tests -v`

Antes del despliegue, validar además con PDF reales anonimizados y revisar regresiones de interfaz, reentrega, IndexedDB y caché PWA.
