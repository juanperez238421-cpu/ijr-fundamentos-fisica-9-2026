# Evaluación individual — Física 9° — Posición y velocidad media

Instituto Jorge Robledo · Juan Diego Pérez · Periodo 2026.

## Estado de publicación

- El código de la evaluación está completo y protegido por una lista de **un único correo institucional**, más un código privado individual.
- La fila `public.physics9_motion_single_access_v1` permanece con `enabled=false`, `allowed_email=null` y `access_code_sha256=null` hasta que el docente aporte el correo del estudiante y autorice la apertura.
- **No establecer un correo ficticio, ni compartir el código en este repositorio.**
- El acceso de un estudiante se controla realmente por Supabase Edge Function, no por deshabilitar solo un botón de HTML.
- El correo institucional declarado más el código de acceso no equivale a autenticación SSO; debe entregarse el código únicamente por un canal privado al estudiante autorizado.

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

- Tabla privada `public.physics9_motion_single_access_v1`: estado, email autorizado, hash SHA256 del código.
- Tabla privada `public.physics9_motion_single_attempts_v1`: un intento máximo por email y actividad; permite reabrir el mismo intento usando correo + código y rotando el token de sesión.
- Bitácora privada `private.physics9_motion_single_audit_v1`: snapshots e integridad SHA256, append-only.
- Edge Function `physics9-position-individual`: `config`, `start`, `status`, `answer`, `incident`, `submit`.
- El frontend solo recibe un token de sesión aleatorio y guarda una copia temporal en `sessionStorage`; nunca usa `service_role` ni consulta tablas de estudiantes directamente.
- Una salida de pantalla no demuestra copia por sí misma. Tras tres incidencias el intento se bloquea para revisión.
- No se fijó una fecha límite: el docente no la indicó para esta evaluación. No se hereda la fecha de Geometría 8°.

## Activación segura — solo administrador Supabase

Una vez que el docente indique el email real autorizado, generar un código **aleatorio de 16 o más caracteres**, compartirlo exclusivamente con el estudiante por Teams y registrar su SHA256 **solo en la consola privada**. No colocar el código en el frontend ni en GitHub. El ajuste se hace una vez el docente confirme los datos.

Ejemplo parametrizado (no ejecutable hasta sustituir valores privados):

```sql
-- Ejecutar únicamente por un administrador autenticado en Supabase.
-- Código secreto: mínimo 12 caracteres aleatorios de alta entropía, compartido fuera de banda.
UPDATE public.physics9_motion_single_access_v1
SET allowed_email=lower(trim(:correo_institucional)),
    access_code_sha256=encode(sha256(convert_to(:codigo_privado,'UTF8')),'hex'),
    enabled=true,updated_at=now()
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
