/* =====================================================================
   GALERÍA DE TRABAJOS — MOFLES JIREH
   Aquí se agregan, quitan o reemplazan los trabajos de la página.
   =====================================================================

   CÓMO AGREGAR UN TRABAJO
   1. Sube la foto (o el video) a la carpeta  trabajos/
   2. Copia una línea de abajo, pégala donde quieras y cambia los datos.
   3. Guarda. El orden de esta lista es el orden en la página.

   CAMPOS
   foto       Ruta de la imagen. Ej: "trabajos/mi-foto.jpg"  (obligatorio)
              Si es un video, esta foto se usa de portada.
   titulo     Texto corto que sale sobre la foto.            (obligatorio)
   categoria  Una de estas:  "mofles"  "flexibles"  "escape"
              "resonadores"  "maquinaria"  "otros"
   video      (opcional) Ruta del video .mp4. Ej: "trabajos/video-4.mp4"
   grande     (opcional) Pon  grande: true  para que salga del doble.

   REGLAS PARA QUE NO SE ROMPA
   - Cada línea va entre llaves { } y termina con coma.
   - Los textos van entre comillas "así".
   - No uses tildes ni espacios en los NOMBRES de archivo
     (bien: "mofle-civic.jpg"   mal: "mofle del Civic.jpg").
   - Para QUITAR un trabajo, borra su línea completa.
   - Para REEMPLAZAR una foto, sube la nueva con otro nombre y cambia la ruta.
   ===================================================================== */

window.TRABAJOS = [
  { foto: "trabajos/mofle-nuevo-chispas.webp", titulo: "Instalación de mofle nuevo",        categoria: "mofles",    grande: true },
  { foto: "trabajos/video-1-portada.jpg",      titulo: "Escape terminado",                  categoria: "escape",    video: "trabajos/video-1.mp4" },
  { foto: "trabajos/flexible-sensor.webp",     titulo: "Flexible nuevo con su sensor",      categoria: "flexibles" },
  { foto: "trabajos/soldando-mofle.webp",      titulo: "Soldadura de salida en mesa",       categoria: "mofles" },
  { foto: "trabajos/mofle-roto.webp",          titulo: "Mofle roto, antes de repararlo",    categoria: "mofles" },
  { foto: "trabajos/soldadura-toyota.webp",    titulo: "Reparación en camioneta Toyota",    categoria: "escape",    grande: true },
  { foto: "trabajos/video-2-portada.jpg",      titulo: "Recorrido del escape completo",     categoria: "escape",    video: "trabajos/video-2.mp4" },
  { foto: "trabajos/mofle-reparado.webp",      titulo: "Mofle reconstruido",                categoria: "mofles" },
  { foto: "trabajos/flexible-instalado.webp",  titulo: "Cambio de flexible",                categoria: "flexibles" },
  { foto: "trabajos/video-3-portada.jpg",      titulo: "Revisión del sistema de escape",    categoria: "escape",    video: "trabajos/video-3.mp4" },
  { foto: "trabajos/flexible-soldado.webp",    titulo: "Soporte y tubería nuevos",          categoria: "escape" },
  { foto: "trabajos/mofle-instalado.webp",     titulo: "Mofle instalado",                   categoria: "mofles" },
  { foto: "trabajos/soldadura-chispas.webp",   titulo: "Soldando el escape por debajo",     categoria: "escape" },
  { foto: "trabajos/soldando-debajo.webp",     titulo: "Trabajo debajo del carro",          categoria: "escape" },
];
