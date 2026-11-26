/* Mofles Jireh — funciones de la página.
   Los trabajos de la galería NO se editan aquí: se editan en trabajos.js */
(function () {
  'use strict';

  var CATEGORIAS = {
    mofles: 'Mofles',
    flexibles: 'Flexibles',
    escape: 'Escape',
    resonadores: 'Resonadores',
    fabricacion: 'Fabricación',
    maquinaria: 'Maquinaria pesada',
    otros: 'Otros'
  };
  var MOSTRAR_INICIO = 10;   // cuántos trabajos se ven antes de "Ver más"
  var PLAY = '<svg viewBox="0 0 384 512" aria-hidden="true"><path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"/></svg>';

  var $ = function (id) { return document.getElementById(id); };
  var anio = $('anio'); if (anio) anio.textContent = new Date().getFullYear();

  var menosMov = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Menú del celular ---------- */
  var nav = $('nav'), menu = $('menu'), menuBtn = $('menuBtn');
  function menuAbierto(si) {
    menu.classList.toggle('abierto', si);
    menuBtn.setAttribute('aria-expanded', String(si));
    menuBtn.setAttribute('aria-label', si ? 'Cerrar menú' : 'Abrir menú');
    document.body.style.overflow = si ? 'hidden' : '';
  }
  if (menu && menuBtn) {
    menuBtn.addEventListener('click', function () { menuAbierto(menuBtn.getAttribute('aria-expanded') !== 'true'); });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) menuAbierto(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && menu.classList.contains('abierto')) { menuAbierto(false); menuBtn.focus(); } });
    window.addEventListener('resize', function () { if (window.innerWidth > 980 && menu.classList.contains('abierto')) menuAbierto(false); });
  }

  /* ---------- Línea bajo el menú al bajar ---------- */
  if (nav) {
    var marcar = function () { nav.classList.toggle('scrolled', window.scrollY > 8); };
    window.addEventListener('scroll', marcar, { passive: true }); marcar();
  }

  /* ---------- Soldadura animada en la foto de portada ----------
     Chispas y destello dibujados encima de la foto, saliendo del punto donde se suelda.
     Si cambias la foto, cambia PUNTO_X y PUNTO_Y (en píxeles de la foto original). */
  var shot = $('soldadura'), cv = $('chispas');
  if (shot && cv && cv.getContext && !menosMov) {
    var ctx = cv.getContext('2d');
    var IMG_W = 1280, IMG_H = 960, PUNTO_X = 895, PUNTO_Y = 324;
    var w = 0, h = 0, k = 1, wx = 0, wy = 0, piso = 0;
    var chispas = [], visible = true, soldando = true, cambioEn = 0, brillo = .7, corriendo = false;

    var medir = function () {
      var r = shot.getBoundingClientRect(), dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width; h = r.height;
      cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var pos = getComputedStyle(shot.querySelector('img')).objectPosition.split(' ');
      var esc = Math.max(w / IMG_W, h / IMG_H);
      wx = (w - IMG_W * esc) * (parseFloat(pos[0]) / 100) + PUNTO_X * esc;
      wy = (h - IMG_H * esc) * (parseFloat(pos[1]) / 100) + PUNTO_Y * esc;
      k = w / 560; piso = h * 0.93;
      shot.style.setProperty('--wx', wx + 'px'); shot.style.setProperty('--wy', wy + 'px');
    };

    var lanzar = function (n) {
      for (var i = 0; i < n; i++) {
        var ang = (Math.random() * 240 - 30) * Math.PI / 180;   // casi todas hacia abajo y a los lados
        var vel = (1.2 + Math.random() * Math.random() * 7.5) * k;
        chispas.push({ x: wx, y: wy, vx: Math.cos(ang) * vel, vy: Math.sin(ang) * vel - 1.2 * k,
          edad: 0, vida: 22 + Math.random() * 55, grosor: .8 + Math.random() * 1.4 });
      }
    };

    var cuadro = function (t) {
      if (!visible) { corriendo = false; return; }
      // el soldador suelda unos segundos y para un momento, como en la vida real
      if (t > cambioEn) {
        soldando = !soldando;
        cambioEn = t + (soldando ? 1800 + Math.random() * 2600 : 350 + Math.random() * 650);
      }
      var meta = soldando ? .72 + Math.random() * .28 : .1;
      brillo += (meta - brillo) * (soldando ? .55 : .2);
      shot.style.setProperty('--flash', brillo.toFixed(3));
      if (soldando) lanzar(3 + Math.floor(Math.random() * 7) + (Math.random() < .04 ? 28 : 0));

      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'lighter';
      ctx.lineCap = 'round';
      for (var i = chispas.length - 1; i >= 0; i--) {
        var c = chispas[i];
        c.edad++; c.vy += .2 * k; c.vx *= .985; c.vy *= .985;
        c.x += c.vx; c.y += c.vy;
        if (c.y > piso && c.vy > 0) { c.y = piso; c.vy *= -.3; c.vx *= .55; }   // rebotan en el piso
        var r = c.edad / c.vida;
        if (r >= 1 || c.x < -20 || c.x > w + 20) { chispas.splice(i, 1); continue; }
        var color = r < .25 ? '255,250,225' : r < .6 ? '255,196,92' : '255,118,38';
        ctx.strokeStyle = 'rgba(' + color + ',' + (1 - r).toFixed(2) + ')';
        ctx.lineWidth = c.grosor * (1 - r * .5);
        ctx.beginPath(); ctx.moveTo(c.x - c.vx * 2.2, c.y - c.vy * 2.2); ctx.lineTo(c.x, c.y); ctx.stroke();
      }
      // el arco: punto blanco-azulado que tiembla
      if (soldando) {
        var rad = (10 + Math.random() * 14) * k;
        var g = ctx.createRadialGradient(wx, wy, 0, wx, wy, rad);
        g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(.3, 'rgba(210,230,255,.8)'); g.addColorStop(1, 'rgba(255,170,60,0)');
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(wx, wy, rad, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalCompositeOperation = 'source-over';
      requestAnimationFrame(cuadro);
    };
    var arrancar = function () { if (!corriendo && visible) { corriendo = true; requestAnimationFrame(cuadro); } };

    medir();
    window.addEventListener('resize', medir);
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (e) { visible = e[0].isIntersecting && !document.hidden; arrancar(); }).observe(shot);
    }
    document.addEventListener('visibilitychange', function () { visible = !document.hidden; arrancar(); });
    arrancar();
  }

  /* ---------- Video de llegada: se reproduce solo cuando está a la vista ---------- */
  var lv = $('llegadaVideo');
  if (lv && !menosMov && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (e) {
      if (e[0].isIntersecting) { lv.preload = 'auto'; var q = lv.play(); if (q && q.catch) q.catch(function () {}); }
      else if (!lv.paused) lv.pause();
    }, { threshold: 0.5 }).observe(lv);
  }

  /* ---------- Menú: marca la sección en la que estás ---------- */
  var links = document.querySelectorAll('.nav-links a[href^="#"]');
  if (links.length && 'IntersectionObserver' in window) {
    var mapa = {};
    links.forEach(function (a) { var sec = document.querySelector(a.getAttribute('href')); if (sec) mapa[sec.id] = a; });
    var obs = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!mapa[e.target.id]) return;
        if (e.isIntersecting) {
          links.forEach(function (a) { a.classList.remove('activo'); a.removeAttribute('aria-current'); });
          mapa[e.target.id].classList.add('activo'); mapa[e.target.id].setAttribute('aria-current', 'true');
        } else {
          mapa[e.target.id].classList.remove('activo'); mapa[e.target.id].removeAttribute('aria-current');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(mapa).forEach(function (id) { obs.observe(document.getElementById(id)); });
  }

  /* ---------- Fotos: brillo de carga y aviso si no cargan ----------
     Mientras una foto carga se ve un bloque gris con brillo (skeleton).
     Si la foto no llega (mala señal o archivo que falta), en su lugar
     sale un recuadro con el aviso, del mismo tamaño, para que nada se mueva. */
  function fallaFoto(img) {
    var caja = document.createElement('div');
    caja.className = 'img-falla';
    caja.setAttribute('role', 'img');
    caja.setAttribute('aria-label', 'No se pudo cargar la foto: ' + (img.alt || ''));
    caja.innerHTML = '<svg class="ico" aria-hidden="true"><use href="#i-foto"/></svg><span>No se pudo cargar la foto</span>';
    // misma proporción que tenía la foto (la del CSS si tiene, si no la de width/height)
    var ar = getComputedStyle(img).aspectRatio, w = +img.getAttribute('width'), h = +img.getAttribute('height');
    if (ar && ar.indexOf('auto') < 0) caja.style.aspectRatio = ar;
    else if (w && h) caja.style.aspectRatio = w + ' / ' + h;
    img.replaceWith(caja);
  }
  function seguirFoto(img) {
    if (img.complete && img.naturalWidth) { img.classList.add('ok'); return; }
    img.classList.add('sk');
    img.addEventListener('load', function () { img.classList.remove('sk'); img.classList.add('ok'); }, { once: true });
    // si falla la versión chica (-640), se intenta una vez con la foto original
    var conError = function () {
      if (img.hasAttribute('srcset')) {
        img.removeAttribute('srcset');
        img.addEventListener('error', conError, { once: true });
        return;
      }
      fallaFoto(img);
    };
    if (img.complete) conError(); else img.addEventListener('error', conError, { once: true });
  }
  // versiones chicas de una foto: "trabajos/x.webp" -> x-640.webp, x-960.webp y la original de 1280
  function juegoFotos(src) {
    if (!/\.webp$/.test(src) || /-(640|960)\.webp$/.test(src)) return '';
    var base = src.replace(/\.webp$/, '');
    return base + '-640.webp 640w, ' + base + '-960.webp 960w, ' + src + ' 1280w';
  }
  document.querySelectorAll('main img').forEach(seguirFoto);

  /* ---------- Galería ---------- */
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var datos = (window.TRABAJOS || []).filter(function (t) { return t && t.foto; });
  var gal = $('galeria'), filtrosEl = $('filtros'), verMas = $('verMas');
  var filtro = 'todos', expandido = false, visibles = [];

  function lista() {
    return datos.filter(function (t) {
      if (filtro === 'todos') return true;
      if (filtro === 'videos') return !!t.video;
      return (t.categoria || 'otros') === filtro;
    });
  }

  function pintarFiltros() {
    if (!filtrosEl) return;
    var cuenta = {}, hayVideos = 0;
    datos.forEach(function (t) { var c = CATEGORIAS[t.categoria] ? t.categoria : 'otros'; cuenta[c] = (cuenta[c] || 0) + 1; if (t.video) hayVideos++; });
    var opciones = [['todos', 'Todos', datos.length]];
    Object.keys(CATEGORIAS).forEach(function (k) { if (cuenta[k]) opciones.push([k, CATEGORIAS[k], cuenta[k]]); });
    if (hayVideos) opciones.push(['videos', 'Videos', hayVideos]);
    filtrosEl.hidden = opciones.length <= 2;
    filtrosEl.innerHTML = opciones.map(function (o) {
      return '<button type="button" class="chip" data-f="' + o[0] + '" aria-pressed="' + (o[0] === filtro) + '">' + esc(o[1]) + '<small>' + o[2] + '</small></button>';
    }).join('');
  }

  function pintar() {
    if (!gal) return;
    var todos = lista();
    visibles = (expandido || !verMas) ? todos : todos.slice(0, MOSTRAR_INICIO);
    if (!todos.length) {
      gal.innerHTML = '<p class="g-empty">Todavía no hay trabajos en esta categoría.</p>';
    } else {
      gal.innerHTML = visibles.map(function (t, i) {
        var cat = CATEGORIAS[t.categoria] ? t.categoria : 'otros';
        var cls = 'g-item' + (t.video ? ' is-video' : '');
        var etiqueta = t.video ? 'Ver video: ' : 'Ver foto: ';
        return '<figure class="' + cls + '" data-cat="' + cat + '">' +
          '<button type="button" class="g-btn" data-i="' + i + '" aria-label="' + esc(etiqueta + t.titulo) + '">' +
          '<span class="g-img"><img src="' + esc(t.foto) + '"' +
          (juegoFotos(t.foto) ? ' srcset="' + esc(juegoFotos(t.foto)) + '" sizes="(max-width:760px) 50vw, (max-width:980px) 33vw, 300px"' : '') +
          ' alt="' + esc(t.titulo) + '" loading="lazy" decoding="async">' +
          (t.video ? '<span class="g-play">' + PLAY + 'Video</span>' : '') + '</span>' +
          '</button>' +
          '<figcaption class="g-cap g-cat">' + esc(CATEGORIAS[cat]) + '</figcaption>' +
          '</figure>';
      }).join('');
    }
    gal.querySelectorAll('img').forEach(seguirFoto);
    if (verMas) {
      var resto = todos.length - visibles.length;
      verMas.hidden = resto <= 0;
      verMas.textContent = 'Ver ' + resto + ' trabajo' + (resto === 1 ? '' : 's') + ' más';
    }
  }

  if (filtrosEl) filtrosEl.addEventListener('click', function (e) {
    var b = e.target.closest('.chip'); if (!b) return;
    filtro = b.getAttribute('data-f'); expandido = false;
    filtrosEl.querySelectorAll('.chip').forEach(function (c) { c.setAttribute('aria-pressed', String(c === b)); });
    pintar();
  });
  if (verMas) verMas.addEventListener('click', function () {
    var antes = visibles.length; expandido = true; pintar();
    var sig = gal.querySelectorAll('.g-btn')[antes]; if (sig) sig.focus();
  });
  if (gal) gal.addEventListener('click', function (e) {
    var b = e.target.closest('.g-btn'); if (b) abrir(+b.getAttribute('data-i'), b);
  });

  /* ---------- Visor de fotos y videos ---------- */
  var visor = $('visor'), escena = $('visorEscena'), cap = $('visorTitulo'), cont = $('visorContador');
  var btnCerrar = $('visorCerrar'), btnAnt = $('visorAnt'), btnSig = $('visorSig');
  var actual = 0, origen = null, media = null;

  function mostrar(i) {
    actual = (i + visibles.length) % visibles.length;
    var t = visibles[actual];
    if (media) { if (media.pause) media.pause(); media.remove(); }
    if (t.video) {
      media = document.createElement('video');
      media.controls = true; media.playsInline = true; media.poster = t.foto; media.src = t.video;
      escena.insertBefore(media, btnAnt);
      var p = media.play(); if (p && p.catch) p.catch(function () {});
    } else {
      media = document.createElement('img');
      media.src = t.foto; media.alt = t.titulo;
      escena.insertBefore(media, btnAnt);
    }
    // en pantalla solo sale la categoría; el título queda como texto alternativo de la foto
    cap.textContent = CATEGORIAS[CATEGORIAS[t.categoria] ? t.categoria : 'otros'] + (t.video ? ' · Video' : '');
    cont.textContent = (actual + 1) + ' / ' + visibles.length;
    var uno = visibles.length < 2; btnAnt.hidden = uno; btnSig.hidden = uno;
  }
  function abrir(i, desde) {
    origen = desde; visor.hidden = false; document.body.style.overflow = 'hidden';
    mostrar(i); btnCerrar.focus();
  }
  function cerrar() {
    if (media) { if (media.pause) media.pause(); media.remove(); media = null; }
    visor.hidden = true; document.body.style.overflow = '';
    if (origen) origen.focus();
  }
  if (visor) {
    btnCerrar.addEventListener('click', cerrar);
    btnAnt.addEventListener('click', function () { mostrar(actual - 1); });
    btnSig.addEventListener('click', function () { mostrar(actual + 1); });
    visor.addEventListener('click', function (e) { if (e.target === visor || e.target === escena) cerrar(); });
    document.addEventListener('keydown', function (e) {
      if (visor.hidden) return;
      if (e.key === 'Escape') cerrar();
      else if (e.key === 'ArrowLeft') mostrar(actual - 1);
      else if (e.key === 'ArrowRight') mostrar(actual + 1);
      else if (e.key === 'Tab') {
        var f = [btnCerrar, btnAnt, btnSig].filter(function (x) { return !x.hidden; });
        if (media && media.tagName === 'VIDEO') f.splice(1, 0, media);
        var k = f.indexOf(document.activeElement); e.preventDefault();
        f[(k + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus();
      }
    });
    // deslizar con el dedo en el celular
    var x0 = null;
    escena.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    escena.addEventListener('touchend', function (e) {
      if (x0 === null) return; var dx = e.changedTouches[0].clientX - x0; x0 = null;
      if (Math.abs(dx) > 50 && visibles.length > 1) mostrar(actual + (dx < 0 ? 1 : -1));
    });
  }

  pintarFiltros();
  pintar();

  /* ---------- Reseñas (se editan en resenas.js) ---------- */
  var listaRes = $('listaResenas'), vacio = $('resenasVacio');
  var resenas = (window.RESENAS || []).filter(function (r) { return r && r.texto && r.nombre; });
  var RESENAS_GOOGLE = 'https://share.google/ZDbmx4TkqxGoQE0gU';
  var ESTRELLA = '<svg class="ico" aria-hidden="true"><use href="#i-star"/></svg>';
  if (listaRes && resenas.length) {
    listaRes.innerHTML = resenas.map(function (r) {
      // las estrellas solo salen si se copiaron de la reseña real
      var n = r.estrellas ? Math.max(1, Math.min(5, Math.round(r.estrellas))) : 0;
      // cada tarjeta abre su reseña en Google (enlace propio) o la lista de reseñas
      var url = /^https:\/\//.test(r.enlace || '') ? r.enlace : RESENAS_GOOGLE;
      return '<a class="review-a" href="' + esc(url) + '" target="_blank" rel="noopener" aria-label="Ver la reseña de ' + esc(r.nombre) + ' en Google">' +
        '<figure class="review">' +
        (n ? '<div class="stars" role="img" aria-label="' + n + ' de 5 estrellas">' + new Array(n + 1).join(ESTRELLA) + '</div>' : '') +
        '<blockquote>“' + esc(r.texto) + '”</blockquote>' +
        '<figcaption><strong>' + esc(r.nombre) + '</strong>' + (r.fuente ? ' · ' + esc(r.fuente) : '') + '<span class="rv-go">Ver en Google <svg class="ico" aria-hidden="true"><use href="#i-arrow"/></svg></span></figcaption>' +
        '</figure></a>';
    }).join('');
    if (vacio) vacio.textContent = '¿Ya trajiste tu carro? Cuéntanos cómo te fue.';
  } else if (listaRes) {
    // sin reseñas todavía: la sección se vuelve una franja corta que pide la reseña
    var secRes = $('resenas'); if (secRes) secRes.classList.add('vacia');
  }

  /* ---------- Mapa: se carga al tocar "Ver mapa aquí" ---------- */
  var mapa = $('mapa'), verMapa = $('verMapa');
  if (mapa && verMapa) verMapa.addEventListener('click', function () {
    var f = document.createElement('iframe');
    f.src = mapa.getAttribute('data-src');
    f.title = 'Mapa de Mofles Jireh';
    f.referrerPolicy = 'no-referrer-when-downgrade';
    mapa.innerHTML = ''; mapa.appendChild(f); mapa.classList.add('cargado');
    f.focus();
  });
})();
