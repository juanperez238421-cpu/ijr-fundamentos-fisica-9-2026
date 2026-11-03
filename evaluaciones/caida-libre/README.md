# Free Fall Lab — Física 9.º (v3, 2026)

Página: https://juanperez238421-cpu.github.io/ijr-fundamentos-fisica-9-2026/evaluaciones/caida-libre/

## Registro exclusivo con correo institucional

Cualquier persona que controle un buzón real con terminación EXACTA @ijr.edu.co puede solicitar su ingreso sin contraseña del examen ni código individual entregado por docente. El estudiante debe comprobar posesión del correo por enlace mágico u OTP de Supabase Auth. El backend valida el JWT con auth.getUser, la dirección email_confirmed_at y el dominio exacto; no confía en el correo escrito ni en los metadatos editables. Existe un único intento por dirección verificada, protegido con índices únicos.

La sesión se conserva para recuperar borradores y entregar al regresar. El docente conserva acceso con cuenta teacher/admin y MFA nivel aal2. La lista docente de Participantes muestra los emails autenticados; NO hay invitaciones.

## Requisitos externos de Supabase Auth para acceso real

El proveedor Email y la creación de cuentas deben estar habilitados para permitir ingreso espontáneo de buzones institucionales. En Auth → URL Configuration → Redirect URLs incluir:
https://juanperez238421-cpu.github.io/ijr-fundamentos-fisica-9-2026/evaluaciones/caida-libre/

La plantilla de correo estándar de Supabase usa enlace mágico. Para mostrar además un código OTP se debe incluir la variable Token de Auth (dos llaves, espacio, punto Token, espacio, dos llaves) en la plantilla de Magic Link; la página acepta ambas alternativas, no presupone que el código aparezca por defecto.

Confirmar que Supabase Auth puede realmente enviar a todos los usuarios del dominio. Para grupos numerosos, usar SMTP configurado para la institución y revisar límites. Cambios en templates y SMTP son globales al proyecto compartido y deben coordinarse para no afectar otras aplicaciones.

## Correo de prueba propuesto

qa.caidalibre.2026@ijr.edu.co

Solo es un identificador sintético de prueba registrado en QA documental. NO es un buzón creado en Google Workspace / Microsoft 365 ni una identidad verificada en Supabase Auth. Para probar la recepción y entrada real, TI del colegio debe habilitar este buzón/alias con acceso verificable. NO dar de alta un correo ficticio como confirmado a la fuerza ni distribuir credenciales inexistentes.

## Evaluación y procedimiento

Tres ejercicios, nueve respuestas numéricas; selector de unidades en cada campo. El motor acepta equivalencias s/min, ft/m y ft/s/m/s con conversión física y rechaza dimensiones incorrectas. Convención arriba positivo, g=32 ft/s². El servidor calcula la nota provisional automática de 0 a 5 y las tolerancias por categoría de variable.

El estudiante adjunta UN PDF/JPG/PNG/WEBP privado de hasta 5 MiB con todas las operaciones, sin teclear procedimientos. El archivo contiene SHA-256; no se permite entregar sin evidencia ni modificarla al finalizar. El profesor, autenticado con MFA, puede revisar el archivo mediante enlace temporal de 90 segundos y establecer nota definitiva con comentario auditado.

## Seguridad, operación y QA

- RLS activo, navegador sin acceso directo a las tablas o al bucket privado; service_role exclusivamente en Edge Function.
- JWT Auth.getUser en TODA acción estudiantil, incluso upload multipart. El código antiguo y las rutas administrativas de emisión/revocación de invitaciones han sido retirados.
- Migración de esquema no destructiva: preserva intentos antiguos y evita colisiones por email en intentos nuevos.
- Registro de cambios auditable y sello temporal del servidor. Reutilización del mismo email verificado recupera el mismo intento.
- La identidad por email confirma dominio y posesión del buzón, NO matrícula específica de grado 9 ni autoría del procedimiento.
- Cerrar sesión al terminar en equipos compartidos.
- Antes del aula, validar entrada real con buzón @ijr.edu.co existente, mensaje recibido, vinculación correcta, archivo PDF/imagen, comprobación docente con MFA, redondeos y cierre de evaluación.
- La evaluación permanece deshabilitada hasta que se confirme funcionamiento de email/SMTP y QA E2E con buzón real.

Fecha: 2026-11-03.
