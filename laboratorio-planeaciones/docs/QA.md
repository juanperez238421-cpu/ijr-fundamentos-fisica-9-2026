# Verificación · 10 noviembre 2026

## Comprobado

- Sintaxis de `app.js`, `sw.js` y compilación Python.
- Ocho pruebas automatizadas del adaptador: entradas vacías/sobredimensionadas, páginas duplicadas, cita inventada, página inexistente, cita válida, origen ajeno rechazado, solicitud inválida y respuesta de inferencia con Ollama simulado (8 casos en total, algunos agrupan entradas).
- Navegador Chrome real: bandeja; apertura de extracto PEI en canvas; búsqueda textual de prueba; observación con marca; solicitud de ajustes; reentrega de PDF real; versión 2 con mismo límite original; formulario de carga nuevo con PDF real; extracción de texto y lectura; análisis de prueba; rechazo de aprobación sin comentario; aprobación motivada; navegación al expediente.
- Referencia visual obtenida de los CSS actuales del Python Learning Hub de Estadística 11. Inspección visual de bandeja, modal y revisión de documentos.
- Service worker completó la precarga de interfaz, lector y extracto. La desconexión física de red y sincronización multiusuario no se ensayaron; esta última no está implementada.

## No validado ni desplegado

- Qwen real, calidad pedagógica, capacidad GPU/RAM y latencia.
- Supabase self-hosted, autenticación, políticas multiusuario, correo ni escalamiento de servidor.
- Cumplimiento jurídico completo, cifrado de dispositivos, auditoría resistente a administrador y recuperación ante desastre.
- Prueba de viewport móvil real. Se incluyen media queries 1250/850 px y navegación horizontal en pantalla estrecha.
- DOCX/OCR: descritos para arquitectura de producción; en la demo solo PDF con texto para análisis.

Los registros QA quedaron solo en el navegador de prueba. No se publican como datos iniciales.
