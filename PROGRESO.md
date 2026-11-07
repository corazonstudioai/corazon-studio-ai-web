## Sesión 06/11/2026
- Tarea: Verificar el acceso a Corazón Studio AI desde el navegador del teléfono.
- Estado: TERMINADO
- Cómo se comprobó: La usuaria compartió una captura de la pantalla principal cargada en Chrome desde el enlace de GitHub Pages.
- Próxima tarea: Generar un video de prueba y comprobar que se reproduzca con sonido.
- Decisiones pendientes de la usuaria: Ninguna para el acceso.

## Sesión 06/11/2026
- Tarea: Probar un video de 5 segundos con narración, reproducción y descarga en el teléfono.
- Estado: BLOQUEADO
- Cómo se comprobó: La revisión del código mostró que los motores en producción pueden diferir de los predeterminados y que el flujo registra un costo estimado. No se pudo confirmar la configuración activa ni un método para verificar el tope de US$0.15 y conciliar el cobro real. No se envió ninguna solicitud de generación.
- Próxima tarea: Confirmar los motores activos y cómo controlar y comprobar el cobro antes del único intento autorizado.
- Decisiones pendientes de la usuaria: Ninguna por ahora. La usuaria ya autorizó un intento con los motores indicados y un tope de US$0.15.

## Sesión 06/11/2026
- Tarea: Preparar el bloqueo de motores y el registro de facturación para la prueba narrada.
- Estado: PROBADO
- Cómo se comprobó: El borrador https://github.com/corazonstudioai/corazon-studio-ai-backend/pull/17 fija los motores y detiene la prueba si la configuración difiere. Pasaron las comprobaciones locales con respuestas simuladas y la revisión de sintaxis del flujo. La comprobación completa de Deno quedó pendiente por un import remoto.
- Próxima tarea: Completar las verificaciones del borrador y resolver la confirmación del cobro real antes de ejecutar la prueba.
- Decisiones pendientes de la usuaria: La usuaria dará una nueva autorización antes de la generación.

## Sesión 06/11/2026
- Tarea: Confirmar el costo real por proveedor y ejecutar un video de prueba con el tope acordado.
- Estado: BLOQUEADO
- Cómo se comprobó: Las respuestas de generación no documentan un importe por solicitud. El código preparado registra identificadores y unidades reportadas cuando existen. El importe sigue pendiente del reporte de facturación. No se desplegaron los cambios ni se consumió el intento.
- Próxima tarea: Confirmar el tope de US$0.15 y cómo atribuir el cobro real al único video de prueba.
- Decisiones pendientes de la usuaria: La usuaria deberá autorizar de nuevo la ejecución cuando se cumplan las condiciones.

## Sesión 06/11/2026
- Tarea: Verificar el borrador del backend en GitHub Actions.
- Estado: PROBADO
- Cómo se comprobó: GitHub Actions aprobó Backend quality y Supabase Edge quality para el borrador. La verificación de integración y base de datos seguía en curso al consultar.
- Próxima tarea: Revisar la verificación de integración y confirmar cómo conciliar el costo por proveedor.
- Decisiones pendientes de la usuaria: La usuaria deberá autorizar de nuevo la generación cuando se cumplan las condiciones.

## Sesión 06/11/2026
- Tarea: Auditar la reaplicación de migraciones y preparar la reversión del despliegue del borrador #17.
- Estado: BLOQUEADO
- Cómo se comprobó: El flujo de producción ejecuta todo el SQL y despliega siete funciones. La migración 001 sobrescribe límites del plan gratis y la 004 completa períodos faltantes de generaciones existentes. El último despliegue verde de referencia corresponde a 73ae34f. No se verificaron los valores actuales en producción ni un respaldo para revertir cambios de datos.
- Próxima tarea: Preparar un despliegue limitado a las dos funciones de video y verificar cómo volver a la versión anterior sin reaplicar migraciones.
- Decisiones pendientes de la usuaria: Autorizar la fusión cuando se aclare el despliegue y, por separado, autorizar la prueba.

## Sesión 06/11/2026
- Tarea: Preparar un despliegue manual limitado a video-start y video-status, con opción de reversión.
- Estado: PROBADO
- Cómo se comprobó: Se guardó el flujo en la rama codex/deploy-video-only y se validaron localmente la sintaxis, la confirmación obligatoria y los dos únicos comandos de despliegue. El flujo no aplica migraciones ni escribe datos de la app. No se fusionó el borrador #17 ni se ejecutó el despliegue.
- Próxima tarea: La usuaria puede guardar los límites del plan gratis con la consulta de solo lectura. Tras la autorización, comprobar el permiso de la rama y ejecutar el flujo limitado.
- Decisiones pendientes de la usuaria: Escribir «autorizo el despliegue limitado» para desplegar. La prueba de video requiere autorización separada.

## Sesión 06/11/2026
- Tarea: Consultar y guardar los límites actuales del plan gratis.
- Estado: BLOQUEADO
- Cómo se comprobó: La usuaria compartió una captura del panel de Supabase que muestra el proyecto en pausa. La consulta de solo lectura aún no se ejecutó.
- Próxima tarea: Revisar la opción para reanudar el proyecto antes de consultar los límites.
- Decisiones pendientes de la usuaria: Decidir si reanuda el proyecto. El despliegue limitado y la generación de video siguen sujetos a autorizaciones separadas.

## Sesión 06/11/2026
- Tarea: Reanudar el proyecto de Supabase.
- Estado: PROBADO
- Cómo se comprobó: La usuaria compartió una captura del panel con el estado Healthy después de reanudar el proyecto. Todavía no se verificaron los límites guardados mediante SQL.
- Próxima tarea: Ejecutar la consulta de solo lectura y guardar los límites del plan gratis.
- Decisiones pendientes de la usuaria: Autorizar por separado el despliegue limitado y la generación de video.

## Sesión 06/11/2026
- Tarea: Verificar los límites del plan gratis antes del despliegue limitado.
- Estado: PROBADO
- Cómo se comprobó: La consulta de solo lectura devolvió cinco filas en Supabase. La captura de la usuaria permite verificar images = 2, songs = 1, text_requests = 5 y video_minutes = 0.1667. La quinta fila quedó cubierta en la captura.
- Próxima tarea: Mostrar la quinta fila y completar la referencia para comparar después del despliegue.
- Decisiones pendientes de la usuaria: Autorizar por separado el despliegue limitado y la generación de video.

## Sesión 06/11/2026
- Tarea: Guardar los cinco límites del plan gratis antes del despliegue limitado.
- Estado: TERMINADO
- Cómo se comprobó: La usuaria compartió el resultado completo de la consulta de solo lectura en Supabase: images = 2.0000, songs = 1.0000, text_requests = 5.0000, video_minutes = 0.1667 y voice_minutes = 1.0000.
- Próxima tarea: Tras la autorización, desplegar únicamente video-start y video-status. Después, comparar los cinco límites con esta referencia.
- Decisiones pendientes de la usuaria: Escribir «autorizo el despliegue limitado» para desplegar. La generación de video requiere un «autorizado» por separado.

## Sesión 06/11/2026
- Tarea: Iniciar el despliegue limitado de video-status y video-start.
- Estado: PENDIENTE
- Cómo se comprobó: La usuaria autorizó el despliegue limitado. Se verificó que la rama codex/deploy-video-only contiene solo los dos comandos de despliegue y no aplica migraciones ni SQL. El acceso disponible no permite iniciar este flujo manual y todavía no hay resultado de despliegue.
- Próxima tarea: Iniciar el flujo en la rama codex/deploy-video-only, modo deploy, y revisar el resultado en GitHub Actions. Para otra sesión: revisar por qué el plan gratis tiene 2 imágenes y no 3.
- Decisiones pendientes de la usuaria: La generación del video aún requiere autorización separada.

## Sesión 07/11/2026
- Tarea: Ejecutar el despliegue limitado de video-status y video-start.
- Estado: BLOQUEADO
- Cómo se comprobó: GitHub Actions, ejecución 42376042268, aprobó la confirmación y 9 pruebas. Supabase CLI pidió confirmación interactiva antes de la primera publicación y reportó «This run can't ask because stdout is not a terminal. Nothing was changed.» No hubo cambios en Supabase que revertir.
- Próxima tarea: Iniciar una ejecución nueva del modo deploy en codex/deploy-video-only. Se añadió la opción --yes únicamente a los dos comandos de publicación y se conserva la confirmación escrita del flujo. No volver a ejecutar el intento anterior, que usa el código previo.
- Decisiones pendientes de la usuaria: La generación de video requiere autorización separada.

## Sesión 07/11/2026
- Tarea: Ejecutar el flujo corregido de despliegue limitado.
- Estado: BLOQUEADO
- Cómo se comprobó: En la ejecución 42376674276, GitHub Actions detectó un espacio en blanco adicional en la frase de confirmación. La rama y el modo eran correctos. El paso de despliegue quedó omitido y no hubo cambios en Supabase que revertir.
- Próxima tarea: Iniciar una ejecución nueva en codex/deploy-video-only, modo deploy, con la confirmación exacta sin espacios al final.
- Decisiones pendientes de la usuaria: La generación de video requiere autorización separada.

## Sesión 07/11/2026
- Tarea: Desplegar únicamente video-status y video-start en Supabase.
- Estado: TERMINADO
- Cómo se comprobó: La ejecución 42376839368 de GitHub Actions terminó en verde. Pasaron las 9 pruebas y el registro de Supabase confirmó la publicación de ambas funciones. El flujo no ejecutó migraciones ni SQL. No se fusionó el borrador #17 ni se generó video.
- Próxima tarea: La usuaria comprobará que la app sigue abriendo en el teléfono. Después se compararán los límites del plan gratis con la referencia anterior. Para otra sesión: revisar por qué el plan gratis tiene 2 imágenes y no 3.
- Decisiones pendientes de la usuaria: La generación de video requiere autorización separada.

## Sesión 07/11/2026
- Tarea: Comprobar que la app sigue abriendo después del despliegue limitado.
- Estado: PROBADO
- Cómo se comprobó: La usuaria compartió una captura de la pantalla principal de Corazón Studio AI abierta en Chrome desde su teléfono después del despliegue 42376839368.
- Próxima tarea: Repetir la consulta de solo lectura en Supabase y comparar los cinco límites con la referencia anterior.
- Decisiones pendientes de la usuaria: La generación de video requiere autorización separada.

## Sesión 07/11/2026
- Tarea: Comparar los límites del plan gratis antes y después del despliegue limitado.
- Estado: TERMINADO
- Cómo se comprobó: La usuaria compartió el resultado de la misma consulta de solo lectura después del despliegue. Coinciden los cinco valores: images = 2.0000, songs = 1.0000, text_requests = 5.0000, video_minutes = 0.1667 y voice_minutes = 1.0000.
- Próxima tarea: Confirmar cómo respetar el tope de US$0.15 y verificar el cobro real antes de la prueba narrada. Para otra sesión: revisar por qué el plan gratis tiene 2 imágenes y no 3.
- Decisiones pendientes de la usuaria: La prueba de video requiere autorización separada.

## Sesión 07/11/2026
- Tarea: Iniciar un único video narrado con Wan 2.2 Turbo y GPT-4o mini TTS.
- Estado: BLOQUEADO
- Cómo se comprobó: La usuaria autorizó un intento. El flujo narrado del borrador usa una cuenta técnica y un crédito de esa cuenta. La app normal pasa por el planificador y no activa el bloqueo de motores. El flujo técnico necesita publicar una función auxiliar temporal y el código no impone un límite monetario por solicitud. No se inició la generación, no se gastaron créditos y no hay identificadores de solicitudes.
- Próxima tarea: Preparar una ejecución técnica con un límite de US$0.15 verificable y acceso a los identificadores de fal. Para otra sesión: revisar por qué el plan gratis tiene 2 imágenes y no 3.
- Decisiones pendientes de la usuaria: Cualquier publicación adicional de una función auxiliar queda fuera del despliegue limitado autorizado.

## Sesión 07/11/2026
- Tarea: Preparar la función temporal autenticada y su limpieza para un único video narrado.
- Estado: PROBADO
- Cómo se comprobó: Se guardaron la función, sus pruebas y el flujo manual en codex/video-test-temporary. Pasaron cuatro pruebas simuladas de acceso, bloqueo de duplicados, motores fijos y fallo sin reintento. También se verificó localmente el MP4 final de 480p, cinco segundos y audio. El marcador de un solo uso está diseñado para crearse en GitHub antes de cualquier llamada de generación. No se publicó la función ni se llamó a los proveedores.
- Próxima tarea: Confirmar que existe una cuenta técnica con sesión válida y, con autorización, publicar solo video-test-once. Después, esperar autorización separada para generar. El flujo prevé eliminar la función al terminar. Para otra sesión: revisar por qué el plan gratis tiene 2 imágenes y no 3.
- Decisiones pendientes de la usuaria: Escribir «autorizo el despliegue de la función temporal» para publicar y después «autorizado» para generar. La usuaria aceptó usar el saldo prepagado sin recarga automática como protección de gasto.

## Sesión 07/11/2026
- Tarea: Identificar una cuenta técnica existente para la prueba.
- Estado: PENDIENTE
- Cómo se comprobó: La usuaria indicó que reconoce una cuenta en Supabase Auth para la prueba. Falta configurar su identificador en GitHub y comprobar que su sesión sea válida.
- Próxima tarea: La usuaria localizará el User UID en Supabase y lo guardará de forma privada como VIDEO_TEST_USER_ID en GitHub.
- Decisiones pendientes de la usuaria: Autorizar por separado la publicación de la función temporal y la generación del video.
