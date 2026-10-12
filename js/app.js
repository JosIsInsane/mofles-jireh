/* Mofles Jireh — funciones de la página.
   Los trabajos de la galería NO se editan aquí: se editan en trabajos.js */
(function () {
  'use strict';

  var CATEGORIAS = {
    mofles: 'Mofles',
    flexibles: 'Flexibles',
    escape: 'Escape',
    resonadores: 'Resonadores',
    maquinaria: 'Maquinaria pesada',
    otros: 'Otros'
  };
  var MOSTRAR_INICIO = 10;   // cuántos trabajos se ven antes de "Ver más"
  var PLAY = '<svg viewBox="0 0 384 512" aria-hidden="true"><path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"/></svg>';

  var $ = function (id) { return document.getElementById(id); };
  var anio = $('anio'); if (anio) anio.textContent = new Date().getFullYear();

  /* ---------- Video del inicio: solo si el usuario no pidió menos movimiento ---------- */
  var hv = $('heroVideo');
  var menosMov = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (hv && !menosMov) {
    hv.preload = 'auto';
    var p = hv.play(); if (p && p.catch) p.catch(function () {});
  }

  /* ---------- Botón flotante de WhatsApp: aparece al pasar el inicio ---------- */
  var wf = $('waFloat'), hero = $('inicio');
  if (wf && hero && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (e) { wf.classList.toggle('off', e[0].isIntersecting); }, { threshold: 0.15 }).observe(hero);
  } else if (wf) { wf.classList.remove('off'); }

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
    visibles = expandido ? todos : todos.slice(0, MOSTRAR_INICIO);
    if (!todos.length) {
      gal.innerHTML = '<p class="g-empty">Todavía no hay trabajos en esta categoría.</p>';
    } else {
      gal.innerHTML = visibles.map(function (t, i) {
        var cat = CATEGORIAS[t.categoria] ? t.categoria : 'otros';
        var cls = 'g-item' + (t.grande ? ' grande' : '') + (t.video ? ' is-video' : '');
        var etiqueta = t.video ? 'Ver video: ' : 'Ver foto: ';
        return '<figure class="' + cls + '" data-cat="' + cat + '">' +
          '<button type="button" class="g-btn" data-i="' + i + '" aria-label="' + esc(etiqueta + t.titulo) + '">' +
          '<img src="' + esc(t.foto) + '" alt="' + esc(t.titulo) + '" loading="lazy" decoding="async">' +
          (t.video ? '<span class="g-play">' + PLAY + '</span>' : '') +
          '</button>' +
          '<figcaption class="g-cap">' + (t.video ? '<span class="g-tag">Video</span>' : '') + esc(t.titulo) + '</figcaption>' +
          '</figure>';
      }).join('');
    }
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
    cap.textContent = t.titulo;
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
})();
