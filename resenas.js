/* =====================================================================
   RESEÑAS DE CLIENTES — MOFLES JIREH
   Aquí se agregan las opiniones que salen en la sección "Reseñas".
   =====================================================================

   Copia las reseñas REALES de Google Maps o Facebook (con permiso del
   cliente o tal como están publicadas). Mientras la lista esté vacía,
   la página solo muestra los botones para dejar una reseña.

   CAMPOS
   texto      Lo que dijo el cliente.                       (obligatorio)
   nombre     Nombre como aparece en la reseña. Ej: "Carlos M."  (obligatorio)
   estrellas  (opcional) Número del 1 al 5, tal como está en Google.
              Si no lo pones, no se muestran estrellas.
   fuente     De dónde viene: "Google" o "Facebook".

   EJEMPLO (quita las dos barras // del inicio para usarla):
   // { texto: "Me repararon el mofle en vez de cambiarlo, buen precio.", nombre: "Carlos M.", estrellas: 5, fuente: "Google" },

   Lo ideal es poner 3 o 6 reseñas (se ven en filas de 3 en computadora).
   Copia el texto tal cual, sin corregirlo. El nombre va con la inicial
   del apellido.
   ===================================================================== */

window.RESENAS = [
  { texto: "EXCELENTE TRABAJO, MUY AMABLE EL PERSONAL, MI CARRO QUEDO SIN FALLA, LOS RECOMIENDO 100000/10", nombre: "Loany C.", fuente: "Google" },
  { texto: "Excelente servicio y la calidad de las piezas uff es buenisima. Súper recomendado este lugar 👌", nombre: "Ivraimobysh C.", fuente: "Google" },
  { texto: "Es un lugar muy bien ambientado y enfocado en el servicio que ofrece, 10/10 y volvería sin dudarlo", nombre: "Nixia A.", fuente: "Google" },
  { texto: "La rapidez con la que te realizan el trabajo y la facilidad de pago un 10/10", nombre: "Orlando I.", fuente: "Google" },
  { texto: "Siempre me ha dejando un trabajo bien hecho y en buenas condiciones", nombre: "Genesis C.", fuente: "Google" },
  { texto: "super cómodo y rápido, los mejores sin duda 😌.", nombre: "Ariana M.", fuente: "Google" },
];
