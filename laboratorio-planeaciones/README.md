# IJR Planning Hub · Laboratorio de planeaciones

Demostración funcional preliminar, estilo visual del hub de Estadística 11. Abrir `index.html` por HTTP(S), no por `file://`.

- Bandeja y carga/lectura de PDF con PDF.js local, texto original por página, marcas y comentarios por versión.
- Grados 1.º–11.º, grupos A/B/C, 25 asignaturas desplegables y campo para otra asignatura.
- Clasificación local de planeación, cronograma, artículo científico y texto indeterminado.
- Vinculación de PDF original de malla por grado, asignatura y período, con SHA-256, trazabilidad local y estado pendiente de validar.
- Doble anotación entre fuente malla/PEI y planeación con coordenadas independientes, referencias cruzadas y páginas.
- Decisiones de prueba, reentrega sin reinicio de plazo, historial y exportación JSON.
- Plazo de ocho días y avisos visibles; wireframes, arquitectura y riesgos.
- PWA offline tras primera carga/caché completada. Sin sincronización institucional.
- Reglas de prueba claramente diferenciadas de IA real. Adaptador de inferencia Ollama en `server/dev_server.py`.

**No producción:** el selector de rol no autentica; registros locales manipulables y sin cifrar; no alertas con navegador cerrado; no Supabase institucional conectado. No cargar documentos con datos personales.

## IA local

Ver [ON-PREMISE](docs/ON-PREMISE.md). Ejecutar `python3 server/dev_server.py`, abrir `http://127.0.0.1:8765`, y usar Ollama con `qwen3:8b` instalado. Adaptador limitado a PEI §2.5.3; no RAG curricular completo.

## Pruebas

Pruebas automatizadas: node --test tests/*.test.mjs; node --check app.js; python3 -m unittest discover -s tests -v. La CI ejecuta un smoke test adicional en Chromium. Ver `docs/QA.md` para verificación de interfaz y límites.

La especificación y contrato de datos son preliminares, no una migración aplicada. Ningún cambio a bases de datos de los cursos.

## Fuentes institucionales y límites

Identidad real: **Instituto Jorge Robledo** (colegio privado) en https://ijr.edu.co/ijr/; logo oficial https://ijr.edu.co/ijr/img/logo.png. No confundir con la institución educativa homónima pública. PEI 2026 disponible como extracto original §2.5.3, página 41; no equivale a malla curricular de asignatura.

El PDF de malla aportado se etiqueta pendiente de validación institucional; no hay un catálogo oficial de todas las mallas dentro del repositorio. Los grupos A/B/C comparten la referencia del grado salvo excepción institucional. Ver docs/FUENTES-REALES-Y-LIMITES.md.

**No producción:** el selector de rol no autentica; registros locales manipulables; Supabase institucional y corpus curricular RAG siguen pendientes. No cargar documentos reales con datos personales.
