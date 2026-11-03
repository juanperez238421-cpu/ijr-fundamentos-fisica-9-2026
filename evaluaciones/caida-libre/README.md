# Free Fall Lab — Física 9.º · Acceso directo por correo (v4)

URL: https://juanperez238421-cpu.github.io/ijr-fundamentos-fisica-9-2026/evaluaciones/caida-libre/

## Inscripción: solamente correo, sin verificación

El estudiante escribe una dirección con sufijo exacto `@ijr.edu.co` y pulsa **Ingresar**. No recibe ni introduce OTP, magic links, contraseñas ni códigos de invitación. No requiere que exista un buzón para aceptar la cadena. Se conserva la restricción por dominio en el navegador y servidor.

**IMPORTANTE: esto NO es autenticación de correo ni identidad.** Cualquier persona puede registrar una dirección `@ijr.edu.co` que no le pertenezca; no se puede afirmar que la persona es estudiante, es titular del buzón o pertenece a un grupo. Un usuario malintencionado puede ocupar primero la dirección ajena. La autoría de las respuestas debe verificarse por otras vías institucionales si es importante para calificación.

## Protección de respuestas dentro de la misma pestaña

Tras registrar por primera vez una dirección, el servidor emite de forma invisible un secreto aleatorio de 256 bits; solo almacena su SHA-256. La pestaña guarda el secreto en `sessionStorage` y lo adjunta internamente en cada llamada de guardar, subir y enviar. No aparece como código que el estudiante deba introducir. Esto protege las respuestas almacenadas de otras personas que simplemente escriban la misma dirección.

Un email solo puede crear un intento: índice único normalizado en PostgreSQL. Si alguien introduce una dirección ya usada desde otra pestaña, **no verá los datos**; el servidor responde `EMAIL_ALREADY_REGISTERED_DIFFERENT_SESSION`. Se puede continuar al recargar la pestaña original, pero si se cierra o se borra la sesión de esa pestaña no hay recuperación autónoma por correo (no habría forma de demostrar titularidad sin verificarlo). Para reponer un intento el docente deberá seguir un protocolo administrativo fuera de este formulario. El botón **Salir y cerrar sesión** borra la sesión local.

Con esta decisión el sistema prioriza entrada sin fricción y confidencialidad del contenido sobre la posibilidad de entrar desde cualquier navegador. No deben presentarse sus registros como identidades verificadas.

## Evaluación

- Tres ejercicios físicos con variantes privadas; nueve respuestas numéricas con selector de unidades, conversiones dimensionales y tolerancias configurables en servidor.
- Un PDF/JPG/PNG/WEBP privado (máximo 5 MB) con procedimientos manuscritos o digitalizados, obligatorio antes de entregar.
- Revisión de archivo por docente con Supabase Auth + MFA TOTP, enlace privado firmado de 90 segundos, calificación definitiva y bitácora.
- Profesor puede ajustar fechas, duración y calificación. Examen deshabilitado por defecto hasta QA.
- Datos de alumnos anteriores, evaluaciones históricas y tablas de otras asignaturas no se modifican.

## Cuenta de prueba

`qa.caidalibre.2026@ijr.edu.co` es **un identificador sintético** usado solo en QA. No se creó ningún buzón de correo ni usuario confirmado en Supabase Auth, y **no es necesario** para probar este modo: basta escribir la cadena cuando el docente abra la evaluación.

## QA mínimo

1. Rechazar `gmail.com`, subdominios falsos y variantes que no sean el dominio exacto.
2. Ingresar inmediatamente con un email de prueba del dominio, confirmar que no hay envío OTP/email.
3. Verificar que la primera respuesta incluye token solamente para su nueva sesión; confirmar que la página nunca pide teclearlo.
4. Intentar el mismo email desde otro navegador sin token: `409`, sin acceso a datos.
5. Guardar nueve resultados y unidades, recargar la misma pestaña y recuperar.
6. Verificar obligación de evidencia antes de entregar, archivo hasta 5MB, nota provisional y recibo; docente revisa con MFA.
7. Comprobar cierre de ventana y preservación del examen `enabled=false` tras QA.

**Advertencia operativa:** este esquema de entrada no sirve para demostrar autoría, asistencia o matrícula del estudiante. No es equivalente a SSO institucional ni al acceso mediante correo verificado.
