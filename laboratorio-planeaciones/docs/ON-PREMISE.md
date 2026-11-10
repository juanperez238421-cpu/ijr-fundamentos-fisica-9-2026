# Prueba local y camino a producción

## Qué está disponible

Esta entrega es una PWA estática funcional de demostración. No se ha desplegado una plataforma multiusuario en la institución. No se modifica el proyecto Supabase de los cursos ni se envían archivos a él. PDF.js 4.10.38 está incluido localmente y no usa CDN en ejecución.

El adaptador Python permite inferencia real con Ollama instalado en el mismo equipo. Es una prueba individual sin autenticación, almacenamiento central ni RAG completo. No debe exponerse en la red institucional como servidor de producción.

## Ejecutar una prueba real de IA

Requisitos: Python 3.11 o superior y Ollama instalado. Verificar disponibilidad de RAM/VRAM con el modelo y contexto elegidos; hacer una prueba de carga antes de fijar capacidad. Los recursos de Supabase se suman a los de inferencia.

1. Descargar el modelo durante la ventana de instalación administrada:

```sh
ollama pull qwen3:8b
```

2. Iniciar Ollama según su instalación (`ollama serve` si no corre como servicio). No exponer su puerto 11434 a Internet ni habilitar acceso a proveedores cloud.
3. Desde la carpeta `laboratorio-planeaciones`:

```sh
python3 server/dev_server.py
```

4. Abrir `http://127.0.0.1:8765`. Cargar un PDF de prueba con texto y pulsar **IA local** en revisión.
5. El adaptador envía exclusivamente al servicio `127.0.0.1:11434/api/chat`, requiere salida estructurada, valida páginas y comprueba que las citas de planeación existan literalmente. El único contexto institucional incorporado al adaptador es PEI §2.5.3, página original 41. No verifica el corpus curricular completo.
6. Si el modelo falla o cita texto inexistente, no se crea informe; la entrega vuelve a su estado previo. Continuar revisión humana.

Se limita a 50.000 caracteres por solicitud. El límite evita truncar la planeación silenciosamente; producción debe fragmentar y recuperar con cobertura verificable. El modelo puede seguir equivocándose incluso cuando la cita es válida.

**Verificación en esta entrega:** sintaxis, validación de entradas y citas, respuestas del adaptador con Ollama simulado y flujo estático del navegador. No se descargó ni ejecutó Qwen en el entorno de autoría; no se afirma validación de calidad pedagógica ni de latencia real.

## Supabase local para producción (por instalar)

- Seguir la [guía oficial de self-hosting](https://supabase.com/docs/guides/self-hosting/docker), seleccionando una versión release fija y registrando commit, imágenes y digests. Revisar changelog antes de actualizar; el stack local y el administrado no se configuran igual.
- Instalar Auth, Postgres y Storage en servidor propio. Claves generadas localmente; MFA de coordinación y rectoría. Buckets privados; acceso por API autenticada o URL breve autorizada.
- `CONTRATO-DATOS.sql` es un diseño en esquema privado sin permisos de API; no es una migración de producción. Implementar y probar endpoints, políticas por expediente y operaciones transaccionales antes de otorgar acceso.
- API institucional con tokens validados y asignación de rol consultada al servidor, transiciones atómicas, carga antivirus/OCR, cola persistente y recuperación RAG. La clave de servicio jamás va en la página.
- Temporizador independiente de los navegadores; outbox con idempotencia, recibos de entrega, reintentos y canal de contingencia. No SMTP externo por defecto; acordar el canal institucional y sus encargados.
- Proxy HTTPS, firewall, cifrado de discos, respaldo, restauración y plan de incidentes. En Linux los contenedores solo tendrán acceso saliente autorizado durante instalación; sin salida de documentos en operación.
- PWA en dispositivos administrados: claves de cifrado, caducidad de copias, cierre de sesión y sincronización con detección de conflictos. La demo usa almacenamiento local sin estos controles.

## Aceptación antes del piloto

Probar separación entre docentes, asesor, coordinador y rectoría; denegación de anónimo; archivo malicioso; datos de menores; borrado y recuperación; corte de IA; cola retrasada; fin de semana; D8 exacto; pérdida de conexión; reentrega sin reiniciar reloj; dos revisores simultáneos; repetición de notificaciones; fallo SMTP; versión curricular incorrecta; inyección en PDF; OCR defectuoso; citas inventadas; caída del servidor y restauración. Las pruebas del modelo deben usar una muestra revisada por asesores con métricas de citas válidas, falsos positivos y omisiones.

## Fuentes técnicas consultadas · 10 noviembre 2026

- https://supabase.com/docs/guides/self-hosting/docker
- https://supabase.com/changelog?types=breaking-change
- https://docs.ollama.com/api/chat
- https://docs.ollama.com/capabilities/structured-outputs
- https://huggingface.co/Qwen/Qwen3-8B/blob/main/LICENSE
