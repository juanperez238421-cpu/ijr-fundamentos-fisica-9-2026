# IJR Planning Hub — arquitectura preliminar

## Alcance y separación

La interfaz funcional se publica como laboratorio independiente bajo `/laboratorio-planeaciones/`. No se altera el acceso ni los contenidos de Física o Estadística. El diseño replica el lenguaje visual observado en `ijr-estadistica-11-2026/python/`: blanco/negro, tipografía de sistema, tarjetas, bordes grises y botones redondeados.

En GitHub: demostración con archivos de prueba, PDF.js, marcas, historial, reloj y wireframes. En la institución: futura PWA autenticada + API HTTPS + Supabase self-hosted + trabajadores de OCR/IA/notificaciones + Ollama. No se despliega contenido sensible en GitHub ni se conecta a Supabase cloud.

## Módulos y flujo de datos

1. Docente selecciona alcance y entrega PDF/DOCX. API inspecciona archivo, antivirus, clasificación y autorización. Rechazos generan registro de intento y mecanismo de contingencia.
2. Una transacción crea expediente, versión inmutable, hash, evento de recepción y tarea de cola. El reloj oficial nace con el recibo de servidor.
3. Trabajador aislado extrae texto y páginas. OCR local si el PDF es escaneado. Cuarentena ante sospecha de contenido sensible; un responsable resuelve sin detener el SLA silenciosamente.
4. Recuperación curricular por grado, área, período, tipo de fuente y vigencia. Fuentes aprobadas y fragmentos enlazados al original. Ausencia o contradicción se declara, no se reemplaza por conocimiento del modelo.
5. Ollama ejecuta Qwen3-8B local. Salida estructurada con evidencias y recomendaciones. Validar esquema, páginas y citas literales; verificar calidad pedagógica por humano. Sin herramientas ejecutables ni entrenamiento con las entregas.
6. Coordinador recibe planeación e informe unidos al expediente; contrasta malla, plan de área, estándares y PEI. Confirma o descarta IA y añade sus propios comentarios.
7. Decisión motivada y evento más aviso en una transacción. Trabajador de notificaciones registra cola, envío, entrega o fallo. El fallo de entrega genera incidencia y canal de contingencia; no se afirma retorno cumplido por solo guardar decisión.
8. Nueva versión conserva el expediente y el reloj original. Historial de comentarios, respuestas y versiones no se sobrescribe.
9. Rectoría consulta agregados, vencimientos y escalamiento; acceso excepcional al contenido se audita.

## Estados

Borrador (preentrega) → cargada → en análisis por IA → en revisión → aprobada o devuelta. Ruta de corrección: en revisión → con ajustes → cargada v2 → análisis → revisión. Falla de IA → en revisión con informe ausente y causa explícita. Devuelta cierra la devolución motivada; con ajustes mantiene el ciclo abierto. Reabrir un cierre requiere un evento excepcional autorizado y nunca borra la mora ni cambia el vencimiento del ciclo original.

## Ocho días calendario

Supuesto conservador: todo el ciclo, incluido un retorno de ajustes, tiene 192 horas desde aceptación oficial. Día 1 análisis, día 5 primer retorno, día 7 respuesta docente, día 8 cierre/retorno. Días festivos y fines de semana incluidos. Fechas UTC y visualización America/Bogota. No reinicio por reentrega ni pausa por falla de IA. Reloj de servidor, sincronización NTP, alertas D4/D6/D7 y vencimiento. En producción el trabajador se ejecuta aunque nadie abra la página. Capacidad de personal, suplencias, UPS y tiempos de recuperación son necesarios; software solo no garantiza el SLA.

## Fuera de línea

Producción: caché autorizada por expediente, cifrada en dispositivo administrado; borradores y cola con UUID, versión base, hash y autor. Un borrador offline no equivale a recepción. Al sincronizar, revalidar sesión, permisos y revisión; rechazo 409 ante conflicto, resolución humana y recibo de servidor. Revocación no instantánea mientras el equipo está aislado. Mostrar fecha de última sincronización y reloj estimado.

Demo: service worker cachea solo interfaz, lector y extracto institucional; PDF de prueba en IndexedDB y metadatos en localStorage. No hay sincronización real ni cifrado ni protección por roles. Limitar a documentos sin datos personales. La API local no se cachea.

## Trazabilidad

Eventos incluyen UUID idempotente, expediente, versión, hash, actor y rol verificado, sello de servidor, operación, estado anterior/nuevo, comentario o referencia y recibo de notificación. Conservar modelo/digest/prompt/corpus y validación de hallazgos. Exportar según permisos. Auditoría append-only para usuarios, respaldo y copia externa de integridad; un administrador no se vuelve incapaz de modificar datos por declarar append-only.

## Protección de datos y supuestos

No confundir dato personal de menor con categoría legal de dato sensible. Minimizar; excluir nombres/diagnósticos/listas del modelo. Evaluar interés superior, derechos, autorización y voz del menor según madurez con asesoría institucional. Identificar responsable y encargados, finalidades, consulta/reclamo, retención e incidentes. No atribuir cumplimiento automático al despliegue local. Validar corpus para 1.º–11.º: las fuentes disponibles no cubren toda esa población.

Fuentes jurídicas: Ley 1581 de 2012, artículos 4–7, 8, 9, 12, 14–15, 17–18; revisar reglamentación vigente y criterio SIC con asesoría jurídica. https://normograma.mintic.gov.co/mintic/compilacion/docs/ley_1581_2012.htm ; https://sedeelectronica.sic.gov.co/publicaciones/boletin-juridico/concepto/tratamiento-excepcional-y-autorizacion-del-representante-legal-con-interes-superior

## Fuentes institucionales utilizadas

- PEI 2026 aportado: página PDF 41, §2.5.3. Extracto real de una página, hash original y derivado en `fuente.json`. El resaltado es editorial y no señala un error del PEI.
- Malla Geometría 8.º 2026, período III: transcripción de ejes y un estándar/desempeño. Sin afirmar validación independiente de los estándares MEN.
- La planeación inicial «Áreas que habitamos» es sintética. Los hallazgos del botón de prueba son búsquedas textuales, no resultados de IA.

## Wireframes y flujos

Disponibles en la propia página: pestañas «Arquitectura y flujos» y «Wireframes», con seis pantallas de baja fidelidad, descripciones de acciones y adaptación a móvil. «Privacidad y supuestos» detalla decisiones pendientes y separación entre lo operativo y lo propuesto.
