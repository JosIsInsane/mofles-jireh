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
   titulo     Describe la foto. No sale en pantalla: lo leen Google y los
              lectores de pantalla (para personas ciegas).            (obligatorio)
   categoria  Una de estas:  "mofles"  "flexibles"  "escape"  "fabricacion"
              "resonadores"  "maquinaria"  "otros"
              "fabricacion" = solo piezas COMPLETAS hechas a la medida para
              un cliente (sistema de escape, mofle, etc.). El proceso
              (soldando, piezas a medio hacer) va en su categoria normal.
   video      (opcional) Ruta del video .mp4. Ej: "trabajos/video-4.mp4"

   REGLAS PARA QUE NO SE ROMPA
   - Cada línea va entre llaves { } y termina con coma.
   - Los textos van entre comillas "así".
   - No uses tildes ni espacios en los NOMBRES de archivo
     (bien: "mofle-civic.jpg"   mal: "mofle del Civic.jpg").
   - Para QUITAR un trabajo, borra su línea completa.
   - Para REEMPLAZAR una foto, sube la nueva con otro nombre y cambia la ruta.
   ===================================================================== */

window.TRABAJOS = [
  { foto: "trabajos/lc-camioneta.webp",          titulo: "Toyota Land Cruiser en el taller para tubería y mofle nuevos", categoria: "escape", video: "trabajos/lc-camioneta.mp4" },
  { foto: "trabajos/lc-corte-tuberia.webp",      titulo: "Cortando la tubería vieja de la Land Cruiser", categoria: "escape", video: "trabajos/lc-corte-tuberia.mp4" },
  { foto: "trabajos/lc-en-el-taller.webp",       titulo: "Toyota Land Cruiser sobre la rampa del taller", categoria: "escape" },
  { foto: "trabajos/lc-soldando.webp",           titulo: "Soldando la tubería nueva bajo la Land Cruiser", categoria: "escape", video: "trabajos/lc-soldando.mp4" },
  { foto: "trabajos/lc-tuberia-mofle.webp",      titulo: "Tubería y mofle nuevos instalados en la Land Cruiser", categoria: "escape", video: "trabajos/lc-tuberia-mofle.mp4" },
  { foto: "trabajos/lc-salida.webp",             titulo: "Salida del escape terminada en la Land Cruiser", categoria: "escape", video: "trabajos/lc-salida.mp4" },
  { foto: "trabajos/mofle-nuevo-chispas.webp",   titulo: "Instalación de mofle nuevo",                    categoria: "mofles" },
  { foto: "trabajos/fab-mofle-terminado.webp",   titulo: "Mofle fabricado en el taller",                  categoria: "fabricacion" },
  { foto: "trabajos/mofle-medida-video.webp",    titulo: "Mofle fabricado a la medida, terminado",       categoria: "fabricacion", video: "trabajos/mofle-medida-video.mp4" },
  { foto: "trabajos/flexible-sensor.webp",       titulo: "Flexible nuevo con su sensor",                  categoria: "flexibles" },
  { foto: "trabajos/resonador-punta-corte.webp", titulo: "Resonador con salida en corte",                 categoria: "resonadores" },
  { foto: "trabajos/soldando-mofle-mesa.webp",   titulo: "Soldando un mofle en la mesa de trabajo",      categoria: "mofles", video: "trabajos/soldando-mofle-mesa.mp4" },
  { foto: "trabajos/soldando-mofle.webp",        titulo: "Soldadura de salida en mesa",                   categoria: "mofles" },
  { foto: "trabajos/video-1-portada.jpg",        titulo: "Escape terminado",                              categoria: "escape", video: "trabajos/video-1.mp4" },
  { foto: "trabajos/mofle-roto.webp",            titulo: "Mofle roto, antes de repararlo",                categoria: "mofles" },
  { foto: "trabajos/escape-doble-salida.webp",   titulo: "Escape con doble salida instalado",            categoria: "escape", video: "trabajos/escape-doble-salida.mp4" },
  { foto: "trabajos/mofle-fabricado-medida.webp", titulo: "Mofle fabricado a la medida",                  categoria: "fabricacion" },
  { foto: "trabajos/soldadura-toyota.webp",      titulo: "Reparación en camioneta Toyota",                categoria: "escape" },
  { foto: "trabajos/mofle-negro-soporte.webp",   titulo: "Resonador negro instalado con su soporte",                categoria: "resonadores" },
  { foto: "trabajos/flexible-resortes.webp",     titulo: "Flexible con brida y resortes, listo para instalar", categoria: "flexibles", video: "trabajos/flexible-resortes.mp4" },
  { foto: "trabajos/video-2-portada.jpg",        titulo: "Recorrido del escape completo",                 categoria: "escape", video: "trabajos/video-2.mp4" },
  { foto: "trabajos/mofle-reparado.webp",        titulo: "Mofle reconstruido",                            categoria: "mofles" },
  { foto: "trabajos/mofle-crv.webp",             titulo: "Mofle y soportes nuevos en una Honda CR-V",    categoria: "mofles", video: "trabajos/mofle-crv.mp4" },
  { foto: "trabajos/lc-soldadura.webp",          titulo: "Soldadura de la tubería de la Land Cruiser",   categoria: "escape" },
  { foto: "trabajos/fab-soldando-cuerpo.webp",   titulo: "Soldando el cuerpo de un mofle",                categoria: "mofles" },
  { foto: "trabajos/flexible-listo.webp",        titulo: "Flexible listo para instalar",                  categoria: "flexibles" },
  { foto: "trabajos/resonador-negro.webp",       titulo: "Resonador negro instalado bajo el carro",      categoria: "resonadores", video: "trabajos/resonador-negro.mp4" },
  { foto: "trabajos/resonador-recto.webp",       titulo: "Resonador recto terminado",                     categoria: "resonadores" },
  { foto: "trabajos/flexible-instalado.webp",    titulo: "Cambio de flexible",                            categoria: "flexibles" },
  { foto: "trabajos/resonador-corte-video.webp", titulo: "Resonador con salida en corte, terminado",     categoria: "resonadores", video: "trabajos/resonador-corte-video.mp4" },
  { foto: "trabajos/video-3-portada.jpg",        titulo: "Revisión del sistema de escape",                categoria: "escape", video: "trabajos/video-3.mp4" },
  { foto: "trabajos/mofle-bajo-carro.webp",      titulo: "Mofle nuevo instalado bajo el carro",          categoria: "mofles", video: "trabajos/mofle-bajo-carro.mp4" },
  { foto: "trabajos/fab-tubo-perforado.webp",    titulo: "Tubo perforado para el interior de un mofle",   categoria: "mofles" },
  { foto: "trabajos/mofle-nuevo-carro.webp",     titulo: "Mofle nuevo bajo el carro",                     categoria: "mofles" },
  { foto: "trabajos/flexible-bajo-carro.webp",   titulo: "Flexible nuevo instalado bajo el carro",       categoria: "flexibles", video: "trabajos/flexible-bajo-carro.mp4" },
  { foto: "trabajos/flexible-soldado.webp",      titulo: "Soporte y tubería nuevos",                      categoria: "escape" },
  { foto: "trabajos/resonador-recto-video.webp", titulo: "Resonador recto terminado",                    categoria: "resonadores", video: "trabajos/resonador-recto-video.mp4" },
  { foto: "trabajos/mofle-instalado.webp",       titulo: "Mofle instalado",                               categoria: "mofles" },
  { foto: "trabajos/soldadura-chispas.webp",     titulo: "Soldando el escape por debajo",                 categoria: "escape" },
  { foto: "trabajos/soldando-debajo.webp",       titulo: "Trabajo debajo del carro",                      categoria: "escape" },
];
