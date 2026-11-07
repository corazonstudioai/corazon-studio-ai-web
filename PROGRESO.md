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
