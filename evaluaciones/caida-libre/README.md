# Free Fall Lab — Física 9.º · Evaluación individual 2026-2

Ruta pública prevista: https://juanperez238421-cpu.github.io/ijr-fundamentos-fisica-9-2026/evaluaciones/caida-libre/

## Modelo
Los tres problemas cubren: (1) caída desde reposo, (2) lanzamiento hacia arriba y altura máxima, (3) lanzamiento hacia abajo y velocidad de impacto. Cada uno tiene tres campos numéricos y un procedimiento. Se asignan 3 variantes por problema; cada alumno recibe un paquete aleatorio. Convención: arriba positivo; g = 32 ft/s².

y(t) = h0 + v0*t - 0.5*g*t²
v(t) = v0 - g*t
t_impact = (v0 + sqrt(v0²+2*g*h0))/g
t_peak = v0/g
y_max = h0 + v0²/(2*g)

El servidor calcula la solución, no el navegador. Acepta |respuesta - exacto| <= max(tolerancia absoluta por unidad, tolerancia relativa × |exacto|).
Valores iniciales: 0.12 s, 2 ft, 1.5 ft/s y tolerancia relativa 0.5 %. Nota automática = 5 × aciertos / 9 (provisional). La nota final requiere revisión de los procedimientos escritos y decisión docente documentada.

## Docente
1. Abrir Acceso docente, autenticar con cuenta real Supabase Auth con rol teacher/admin y MFA TOTP nivel aal2. No se publica ni se crea ninguna contraseña docente.
2. En Invitaciones, emitir códigos por alumno con Nombre | 9A (o 9B/9C). Cada código es aleatorio de 120 bits, visible una vez. Entregar individualmente por canal privado.
3. En Configuración, definir fechas, duración y tolerancias; habilitar la evaluación solamente al realizar pruebas. Inicialmente enabled=false.
4. En Resultados, comparar valor exacto/tolerancia/respuesta y revisar procedimientos; registrar nota final y justificación.
5. En Auditoría, verificar guardados, entregas y revisiones.

## Seguridad
El código identifica posesión, no SSO institucional: el docente debe distribuir códigos y contrastar identidad. Hash SHA-256 de código, sesión aleatoria con rotación, un intento por invitación. RLS habilitada en todas las tablas privadas, sin permisos directos para roles de navegador. Edge Function actúa con service role solo en servidor. MFA aal2 y rol de perfiles validados para administración. El tiempo de entrega lo impone el servidor. Los eventos son append-only en la API y las operaciones del intento generan eventos atómicos con trigger. Un administrador total de DB puede alterar la información, por lo que no se afirma inmutabilidad criptográfica absoluta. No se vigilan pestañas ni cámara. No se publican soluciones exactas en la aplicación.

## QA previo a estudiantes
- Comprobar que no se inicia cuando enabled=false.
- Autenticación de profesor sin MFA: acceso denegado.
- Código falso: rechazo; código revocado: rechazo.
- Emitir código QA sintético, probar 9 resultados, signos negativos, redondeo dentro/fuera de tolerancia, recibo y nota provisional privada.
- Recargar con sesión abierta: recuperar borradores. Reutilizar mismo código: no se crea otro intento.
- Confirmar cierre por fecha/hora, RLS y bitácora.
- Revocar QA después.

Frontend: index.html, styles.css, app.js.
Backend: supabase/functions/physics9-freefall-exam/index.ts.
Migrations: supabase/migrations/20261103_physics9_freefall_exam.sql y 20261103_physics9_freefall_audit.sql.
