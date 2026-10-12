# Página web de Mofles Jireh

Página del taller Mofles Jireh (San Pedro Sula). Es una página estática: solo archivos HTML, CSS, JS, fotos y videos. Se publica gratis en Cloudflare Pages.

## Qué hay en cada archivo

| Archivo / carpeta | Para qué sirve |
|---|---|
| `trabajos.js` | **La galería de trabajos.** Aquí se agregan, quitan o reemplazan fotos y videos. |
| `trabajos/` | Las fotos y videos de la galería. |
| `index.html` | Los textos de la página: servicios, horario, dirección, teléfono. |
| `css/estilos.css` | Colores, letras y diseño. Los colores están arriba del todo. |
| `js/app.js` | El funcionamiento de la galería, el visor y los filtros. Normalmente no se toca. |
| `img/` | Logo, portada del video de inicio e imagen para compartir en redes. |
| `video/hero.mp4` | El video de fondo del inicio. |

## Agregar un trabajo nuevo (desde GitHub, sin instalar nada)

1. Entra al repositorio en github.com y abre la carpeta `trabajos/`.
2. Toca **Add file → Upload files**, sube la foto y dale **Commit changes**.
   - Nombre sin tildes ni espacios: `mofle-hilux-2.jpg` ✅, `Mofle Hilux 2.jpg` ❌
   - Fotos de celular están bien; procura que pesen menos de 1 MB.
3. Vuelve al inicio del repositorio, abre `trabajos.js` y toca el lápiz ✏️ para editar.
4. Copia una línea, pégala donde quieras que salga y cambia la ruta y el título:
   ```js
   { foto: "trabajos/mofle-hilux-2.jpg", titulo: "Mofle nuevo en Hilux", categoria: "mofles" },
   ```
5. Toca **Commit changes**. En uno o dos minutos la página se actualiza sola.

**Video:** sube el `.mp4` y una foto de portada, y agrega `video`:
```js
{ foto: "trabajos/video-4-portada.jpg", titulo: "Cambio de flexible", categoria: "flexibles", video: "trabajos/video-4.mp4" },
```

**Foto más grande:** agrega `grande: true` al final de la línea.

**Categorías disponibles:** `mofles`, `flexibles`, `escape`, `resonadores`, `maquinaria`, `otros`. Los filtros de la galería se crean solos según las categorías que uses.

**Quitar un trabajo:** borra su línea completa. **Reemplazar:** sube la foto nueva y cambia la ruta en su línea.

> Si la galería sale vacía después de editar, casi siempre falta una coma, una comilla o una llave `}`. Revisa la última línea que cambiaste.

## Cambiar textos, horario o teléfono

Todo está en `index.html`. Busca el texto con Ctrl+F (por ejemplo `9549-4420`) y cámbialo en todos los lugares donde aparezca. El número de WhatsApp de los botones está en los enlaces `https://wa.me/50495494420`.

## Ver la página en tu computadora

Abre una terminal en esta carpeta y corre:
```
python -m http.server 8000
```
Luego entra a http://localhost:8000
