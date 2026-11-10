# Fuentes auténticas: procedencia, estado y limitaciones

## Identificación institucional
- Instituto Jorge Robledo (colegio privado), Medellín, sitio oficial: https://ijr.edu.co/ijr/.
- Escudo oficial: https://ijr.edu.co/ijr/img/logo.png.
- No utilizar mallas de la Institución Educativa Jorge Robledo (colegio diferente).

## Referencias reales
- PEI IJR 2026, actualizado el 29 de abril de 2026. El lector conserva el extracto §2.5.3, página original 41.
- No se ha verificado un catálogo completo de mallas 2026 para todas las materias y grados.
- Las mallas de otras instituciones y los estándares MEN no se deben presentar como mallas originales del Instituto.
- Cada malla por grado/área/período requiere PDF auténtico aportado y validación documental por coordinación.

## Comportamiento actual
- El profesor selecciona el grado numérico, el grupo A/B/C, la materia y el período.
- En la revisión se carga el PDF curricular original, que se guarda en IndexedDB local con un manifiesto y SHA-256.
- No aportada: no existe una malla oficial comprobable para esa combinación.
- PDF aportado: lectura y notas disponibles, siempre marcado como PENDIENTE de validación institucional.
- Verificada: estado reservado a futura aprobación desde un servidor con identidad y permisos reales; no se concede desde esta interfaz.
- PEI, malla y planeación conservan páginas, versionado de notas y localizaciones propias.

## Para pasar a producción
1. Autenticación de docentes, asesores y coordinadores con autorización en servidor.
2. Versiones originales inmutables, aprobación, vigencia y registro de responsables.
3. Almacenamiento privado, protección de datos, antivirus, OCR y copias de seguridad.
4. Políticas RLS y trazabilidad independiente de cliente en Supabase local.
5. Comparación con documentos originales, citas literales de ambas fuentes y validación humana.
6. Pruebas con documentos reales anonimizados, falsos positivos, falsos negativos y recuperación ante fallos.

El prototipo de GitHub Pages NO sincroniza documentos entre usuarios y no ejecuta el modelo Ollama remoto. No exponer documentación con datos personales en esta demostración.