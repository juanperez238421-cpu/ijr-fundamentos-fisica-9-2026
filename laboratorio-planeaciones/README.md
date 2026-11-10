# IJR Planning Hub · Laboratorio de planeaciones

Demostración funcional preliminar, estilo visual del hub de Estadística 11. Abrir `index.html` por HTTP(S), no por `file://`.

- Bandeja, carga/lectura de PDF con PDF.js local, texto por página, marcas y comentarios por versión.
- Decisiones de prueba, reentrega sin reinicio de plazo, historial y exportación JSON.
- Plazo de ocho días y avisos visibles; wireframes, arquitectura y riesgos.
- PWA offline tras primera carga/caché completada. Sin sincronización institucional.
- Reglas de prueba claramente diferenciadas de IA real. Adaptador de inferencia Ollama en `server/dev_server.py`.

**No producción:** el selector de rol no autentica; registros locales manipulables y sin cifrar; no alertas con navegador cerrado; no Supabase institucional conectado. No cargar documentos con datos personales.

## IA local

Ver [ON-PREMISE](docs/ON-PREMISE.md). Ejecutar `python3 server/dev_server.py`, abrir `http://127.0.0.1:8765`, y usar Ollama con `qwen3:8b` instalado. Adaptador limitado a PEI §2.5.3; no RAG curricular completo.

## Pruebas

`python3 -m unittest discover -s tests -v` y `node --check app.js`. Ver `docs/QA.md` para verificación de interfaz y límites.

La especificación y contrato de datos son preliminares, no una migración aplicada. Ningún cambio a bases de datos de los cursos.
