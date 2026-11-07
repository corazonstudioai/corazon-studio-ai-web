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
