# Evaluación individual — Física 9° — Posición y velocidad media

Instituto Jorge Robledo · Juan Diego Pérez · Periodo 2026.

## Estado de publicación

- La evaluación conserva una lista de **correos institucionales explícitamente autorizados (estudiante y QA)**, sin PIN ni código adicional. El registro de correo es declarado, no verifica titularidad.
- La tabla `public.physics9_motion_single_access_v1` limita el acceso a un correo principal y a un correo adicional de QA, cada uno validado de forma exacta. Inicialmente se habilitará únicamente una dirección de prueba ficticia para validación; luego debe reemplazarse por el correo real.
- Correo ficticio de prueba, sin verificar que exista el buzón: `qa.fisica9.2026@ijr.edu.co`. Esta identidad no pertenece a un alumno real y debe reemplazarse antes de evaluar a un estudiante.
- El acceso de un estudiante se controla realmente por Supabase Edge Function, no por deshabilitar solo un botón de HTML.
- Sin código, cualquier persona que conozca el correo permitido podría declararlo. **No es un inicio de sesión de Microsoft ni autenticación institucional**; el docente debe contrastar identidad antes de asignar nota.

## Contenido y criterios

- P01: ecuación de posición en MRU, posición en un tiempo dado y velocidad media en un intervalo.
- P02: tres intervalos de avance, reposo y regreso. Velocidades positivas, nulas y negativas.
- P03: pendiente de la gráfica como velocidad, recuperación de `x(t)` y posición de un instante.
- P04: recorrido en tres tramos, distancia, desplazamiento y velocidad media de todo el intervalo.
- Los cuatro diagramas tienen unidades físicas, marcas de graduación y escalas proporcionales. Se trazan sin incluir claves de respuesta o soluciones en el código público.
- El alumno consigna un valor numérico de velocidad en m/s **con signo** por problema, y escribe todo el desarrollo de las otras preguntas del enunciado.
- Cada ejercicio requiere número válido y al menos 15 caracteres de explicación al entregar.
- Calculadora aritmética integrada sin `eval`, compatible con números negativos.

## Registro y trazabilidad

Supabase proyecto existente del IJR: `rlfxnjbqxbozjdzkbwlz`.

- Tabla privada `public.physics9_motion_single_access_v1`: estado de habilitación y correo autorizado, sin credenciales PIN.
- Tabla privada `public.physics9_motion_single_attempts_v1`: un intento máximo por email y actividad; permite reabrir el mismo intento declarando el mismo correo, nombre y grupo, rotando el token de sesión. Los tokens de una dirección siguen válidos mientras esa dirección permanezca en alguna de las dos entradas autorizadas.
- Bitácora privada `private.physics9_motion_single_audit_v1`: snapshots e integridad SHA256, append-only.
- Edge Function `physics9-position-individual`: `config`, `start`, `status`, `answer`, `incident`, `submit`.
- El frontend solo recibe un token de sesión aleatorio y guarda una copia temporal en `sessionStorage`; nunca usa `service_role` ni consulta tablas de estudiantes directamente.
- Una salida de pantalla no demuestra copia por sí misma. Tras tres incidencias el intento se bloquea para revisión.
- No se fijó una fecha límite: el docente no la indicó para esta evaluación. No se hereda la fecha de Geometría 8°.

## Identificación por correo y prueba temporal

**Dirección ficticia de QA habilitada:** `qa.fisica9.2026@ijr.edu.co`.

Para probar el formulario: usa un nombre de prueba (p. ej. `Prueba Fisica`), este correo y selecciona `9A`. No se envía ningún email y no se requiere que el buzón exista. Esto es un control de coincidencia de texto, no verificación de titularidad.

Para entregar el examen a un estudiante real, el docente debe cambiar el correo autorizado en Supabase y evitar confundir intentos de QA con entregas calificables. El acceso anterior se revocará al cambiarlo.

```sql
-- Solo desde el SQL Editor de Supabase, con permisos de administrador.
UPDATE public.physics9_motion_single_access_v1
SET allowed_email=lower(trim(:correo_institucional)),enabled=true,updated_at=now()
WHERE exam_key='physics9-position-velocity-2026';
```

La siguiente consulta es **solo para un docente administrador autenticado en SQL**:

```sql
SELECT id,student_name,student_email,student_group,state,strikes,started_at,submitted_at,
       answers
FROM public.physics9_motion_single_attempts_v1
ORDER BY started_at DESC;
```

## QA

```bash
node --test evaluaciones/posicion-velocidad-individual/qa.test.cjs
```

El workflow `.github/workflows/qa-physics9-individual-motion.yml` verifica estructura, 4 diagramas, registro individual, ausencia de soluciones en manifest y soporte de velocidades negativas.

> **Nota de seguridad:** El correo por sí solo no autentica a nadie; evita atribuir una entrega a un estudiante sin comprobarla por otro medio.

## Acceso QA paralelo sin afectar al estudiante

La configuración usa dos columnas independientes: `allowed_email` (estudiante real) y `additional_allowed_email` (QA). Agregar QA no cambia el correo de Tomás, su `token_hash`, sus respuestas, sus incidencias ni el estado de su intento. La función considera ambas columnas tanto al iniciar un intento como al validar los tokens de sesiones ya activas. El QA reutiliza exclusivamente su propio intento existente por correo institucional.

Para retirar el acceso de QA sin tocar al estudiante, ejecutar en SQL Editor:

```sql
UPDATE public.physics9_motion_single_access_v1
SET additional_allowed_email = NULL, updated_at=now()
WHERE exam_key='physics9-position-velocity-2026';
```
