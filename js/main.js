(function () {
  var S = window.SITE;
  var IMG = 'images/factories/';
  var F = S.factories;
  var $ = function (id) { return document.getElementById(id); };
  var esc = function (t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var pad = function (i) { return (i + 1 < 10 ? '0' : '') + (i + 1); };
  var link = function (i) { return '#factory-' + (i + 1); };

  /* ---------- static text ---------- */
  var E = S.event;
  $('kicker').textContent = E.community + '　' + E.edition;
  $('title').innerHTML = E.title.map(esc).join('<br>');
  $('subtitle').textContent = E.subtitle;
  $('intro').textContent = E.intro;
  $('toursTitle').textContent = S.toursTitle;
  $('toursIntro').textContent = S.toursIntro;
  $('toursNote').textContent = S.toursNote;
  $('drawerCredit').textContent = E.community + '\n' + E.credit.replace('｜', '　');
  $('footer').innerHTML = E.footer.concat([E.credit]).map(function (l) { return '<p>' + esc(l) + '</p>'; }).join('');

  /* ---------- menu ---------- */
  var items = F.map(function (f, i) { return [f.name, link(i)]; }).concat([[S.toursTitle, '#tours'], ['樟湖茶廠地圖', '#map']]);
  $('menuLinks').innerHTML = items.map(function (m, i) {
    return '<a class="mlink ez" data-d="' + (150 + i * 60) + '" href="' + m[1] + '">' + esc(m[0]) + '</a>';
  }).join('');
  var page = document.querySelector('.page');
  function setMenu(open) {
    page.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
    document.querySelectorAll('.mlink').forEach(function (a) { a.style.transitionDelay = open ? a.getAttribute('data-d') + 'ms' : '0ms'; });
  }
  $('openMenu').onclick = function () { setMenu(true); };
  $('closeMenu').onclick = function () { setMenu(false); };
  $('overlay').onclick = function () { setMenu(false); };
  $('drawer').addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });

  /* ---------- marquee ---------- */
  var slides = S.marquee.map(function (m) {
    var f = F[m[0]], file = m[1] ? f.photos[m[1]] : '';
    return file
      ? '<div class="slide" data-i="' + m[0] + '"><img src="' + IMG + esc(file) + '" alt="' + esc(f.name) + '" draggable="false" loading="lazy"></div>'
      : '<div class="slide" data-i="' + m[0] + '"><div class="ph"><b>' + esc(f.name) + '</b><small>照片拍攝中</small></div></div>';
  }).join('');
  var track = $('track');
  track.innerHTML = slides + slides;
  var offset = 0, vel = 0, drag = false, sx = 0, so = 0, lx = 0, lt = 0, moved = 0, hit = -1;
  (function tick() {
    var half = track.scrollWidth / 2;
    if (!drag) {
      if (Math.abs(vel) > 0.1) { offset += vel; vel *= 0.95; } else { vel = 0; offset -= 0.8; }
    }
    if (half > 0) { if (offset <= -half) offset += half; if (offset > 0) offset -= half; }
    track.style.transform = 'translate3d(' + offset + 'px,0,0)';
    requestAnimationFrame(tick);
  })();
  track.addEventListener('pointerdown', function (e) {
    drag = true; vel = 0; moved = 0; sx = lx = e.clientX; so = offset; lt = performance.now();
    var s = e.target.closest('[data-i]'); hit = s ? Number(s.getAttribute('data-i')) : -1;
    track.setPointerCapture(e.pointerId); track.classList.add('grabbing');
  });
  track.addEventListener('pointermove', function (e) {
    if (!drag) return;
    var now = performance.now(), dt = Math.max(1, now - lt);
    vel = ((e.clientX - lx) / dt) * 16; lx = e.clientX; lt = now;
    moved = Math.max(moved, Math.abs(e.clientX - sx));
    offset = so + (e.clientX - sx);
  });
  function up(e) {
    if (!drag) return;
    drag = false; track.classList.remove('grabbing');
    try { track.releasePointerCapture(e.pointerId); } catch (err) {}
    if (moved < 6 && hit >= 0) { vel = 0; location.hash = link(hit); }
  }
  track.addEventListener('pointerup', up);
  track.addEventListener('pointercancel', up);

  /* ---------- tours ---------- */
  $('tourRows').innerHTML = S.tours.map(function (r) {
    var stops = r.stops.map(function (s, j) {
      var a = j ? '<span class="arrow" aria-hidden="true">→</span>' : '';
      return a + (s[1] >= 0 ? '<a class="ul" style="font-weight:500" href="' + link(s[1]) + '">' + esc(s[0]) + '</a>' : '<span>' + esc(s[0]) + '</span>');
    }).join('');
    var ph = r.photo ? '<img src="' + IMG + esc(r.photo) + '" alt="' + esc(r.title) + '" loading="lazy">' : '<span class="ph-empty">照片拍攝中</span>';
    var cls = r.photo ? 'tph' : 'tph empty';
    return '<div class="row tour"><figure class="' + cls + '">' + ph + '</figure><span class="no">' + esc(r.no) + '</span><div class="t"><p class="name">' + esc(r.title) + '</p><p class="meta">' + esc(r.time) + '　' + esc(r.note) + '</p></div><div class="stops">' + stops + '</div></div>';
  }).join('');

  /* ---------- map: every surveyed spot ---------- */
  // 地圖底圖的經緯度範圍（改底圖時一起改）
  var BOX = { w: 120.6255, e: 120.6605, n: 23.6215, s: 23.5955 };
  var gmap = function (p) { return 'https://www.google.com/maps/search/?api=1&query=' + p.lat + ',' + p.lng; };
  var SP = S.spots || [];
  SP.forEach(function (p) {
    p.x = (p.lng - BOX.w) / (BOX.e - BOX.w) * 100;
    p.y = (BOX.n - p.lat) / (BOX.n - BOX.s) * 100;
  });
  // 靠得太近、在地圖上會疊在一起的點合併成一組（例如謝義源集合點與佳龍製茶所、石橋路上的幾間茶廠）
  var NEAR = 0.0012;
  var groups = [];
  SP.forEach(function (p, i) {
    var g = groups.filter(function (g) { return Math.abs(g.p.lat - p.lat) < NEAR && Math.abs(g.p.lng - p.lng) < NEAR; })[0];
    if (g) { if (p.factory >= 0 && g.p.factory < 0) { g.p = p; g.items.unshift(i); } else g.items.push(i); }
    else groups.push({ p: p, items: [i] });
  });

  // Google 地圖路線：依 route 編號串起來
  var R = SP.filter(function (p) { return p.route; }).sort(function (a, b) { return a.route - b.route; });
  var ll = function (p) { return p.lat + ',' + p.lng; };
  var routeUrl = R.length > 1 ? 'https://www.google.com/maps/dir/?api=1&origin=' + ll(R[0]) + '&destination=' + ll(R[R.length - 1]) +
    (R.length > 2 ? '&waypoints=' + R.slice(1, -1).map(ll).join('%7C') : '') : '#map';
  document.querySelectorAll('[data-route]').forEach(function (a) { a.href = routeUrl; });

  var mapbox = $('mapbox'), info = $('spotInfo');
  var pins = [];
  function card(i) {
    var p = SP[i];
    var rows = (p.rows || []).map(function (r) {
      var v = r[0] === '電話' ? '<a class="ul" href="tel:' + r[1].replace(/[^0-9]/g, '') + '">' + esc(r[1]) + '</a>' : esc(r[1]);
      return '<dt>' + esc(r[0]) + '</dt><dd>' + v + '</dd>';
    }).join('');
    return '<article class="spot" id="spot-' + i + '">' +
      '<p class="st">' + esc(p.status || '') + '</p>' +
      '<h3>' + esc(p.name) + '</h3>' +
      (p.note ? '<p class="sn">' + esc(p.note) + '</p>' : '') +
      (rows ? '<dl class="info">' + rows + '</dl>' : '') +
      '<p class="sl"><a class="ul" href="' + gmap(p) + '" target="_blank" rel="noopener">在 Google 地圖開啟</a>' +
      (p.factory >= 0 ? '<a class="ul" href="' + link(p.factory) + '">看茶廠介紹</a>' : '') + '</p></article>';
  }
  function show(g, scroll) {
    pins.forEach(function (q) { q[0].classList.toggle('on', q[1] === g); });
    info.innerHTML = g.items.map(card).join('');
    if (scroll) info.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
  groups.forEach(function (g) {
    var p = g.p, big = p.factory >= 0;
    if (p.kind === 'venue') return; // 學校已經畫在底圖上
    var b = document.createElement('button');
    b.type = 'button';
    b.className = big ? 'pin' : 'dot' + (p.kind === 'venue' ? ' venue' : '');
    b.style.left = p.x + '%'; b.style.top = p.y + '%';
    b.setAttribute('aria-label', g.items.map(function (i) { return SP[i].name; }).join('、'));
    b.innerHTML = big ? '<span class="num">' + (p.factory + 1) + '</span><span class="lab">' + esc(p.name) + (g.items.length > 1 ? '<em> ＋' + (g.items.length - 1) + '</em>' : '') + '</span>'
                      : '<span class="d"></span><span class="lab">' + esc(p.name) + '</span>';
    b.onclick = function () { show(g, true); };
    mapbox.appendChild(b); pins.push([b, g]);
  });
  show(groups.filter(function (g) { return g.p.factory >= 0; })[0], false);

  // 調查過的地點清單
  $('spotList').innerHTML = SP.map(function (p, i) {
    var g = groups.filter(function (g) { return g.items.indexOf(i) >= 0; })[0];
    return '<button type="button" class="srow" data-g="' + groups.indexOf(g) + '"><span class="nm">' + esc(p.name) + '</span><span class="ln">' + esc(p.status || '') + '</span><span class="go">看資訊</span></button>';
  }).join('');
  $('spotList').addEventListener('click', function (e) {
    var b = e.target.closest('.srow'); if (!b) return;
    show(groups[+b.dataset.g], true);
  });

  /* ---------- factory list ---------- */
  $('list').innerHTML = F.map(function (f, i) {
    return '<a class="frow" href="' + link(i) + '"><span class="n">' + pad(i) + '</span><span class="nm">' + esc(f.name) + '</span><span class="ln">' + esc(f.line) + '</span><span class="go">認識茶廠</span></a>';
  }).join('');

  /* ---------- detail page ---------- */
  var img = function (file, cls, label) {
    var st = file ? ' style="background-image:url(\'' + IMG + encodeURI(file) + '\')"' : '';
    return '<div class="img ' + cls + '"' + st + '>' + (file ? '' : '<p class="ph">' + (label || '照片拍攝中') + '</p>') + '</div>';
  };
  function detail(i) {
    var f = F[i], p = f.photos, n = F.length, pv = (i + n - 1) % n, nx = (i + 1) % n;
    var buy = f.buy.url ? '<a class="pill pill-show" href="' + esc(f.buy.url) + '" target="_blank" rel="noopener">' + esc(f.buy.label) + '</a>'
                        : '<span class="pill pill-show" style="opacity:.4">' + esc(f.buy.label) + '（連結待補）</span>';
    return '<div class="dwrap">' +
      '<a class="ul" href="#">← 回首頁</a>' +
      img(p.hero, 'dhero') +
      '<div class="dhead"><p class="idx">' + pad(i) + ' / ' + pad(n - 1) + '</p><h2>' + esc(f.name) + '</h2><p class="ln">' + esc(f.line) + '</p><p class="story">' + esc(f.story) + '</p></div>' +
      '<div class="pair">' + img(p.portrait, '') + img(p.process, '') + '</div>' +
      '<div class="sig">' + img(p.signature, '') + '<div class="txt"><p class="lbl">招牌茶</p><h3>' + esc(f.signature.title) + '</h3><p class="desc">' + esc(f.signature.desc) + '</p>' +
      (f.signature.meta ? '<p class="meta">' + esc(f.signature.meta) + '</p>' : '') + '<div>' + buy + '</div></div></div>' +
      '<dl class="info">' + f.info.map(function (r) { return '<dt>' + esc(r[0]) + '</dt><dd>' + esc(r[1]) + '</dd>'; }).join('') + '</dl>' +
      '<div class="pager"><a class="ul" href="' + link(pv) + '">← ' + esc(F[pv].name) + '</a><a class="ul" href="' + link(nx) + '">' + esc(F[nx].name) + ' →</a></div>' +
      '</div>';
  }

  /* ---------- routing: #factory-N opens a factory, anything else is home ---------- */
  function route() {
    var m = location.hash.match(/^#factory-(\d+)$/);
    var i = m ? Number(m[1]) - 1 : -1;
    if (i >= 0 && i < F.length) {
      $('home').hidden = true; $('detail').hidden = false;
      $('detail').innerHTML = detail(i);
      document.title = F[i].name + '｜樟湖謝茶博覽會';
      window.scrollTo(0, 0);
    } else {
      var wasDetail = !$('detail').hidden;
      $('home').hidden = false; $('detail').hidden = true;
      document.title = '樟湖謝茶博覽會';
      var target = location.hash && document.querySelector(location.hash);
      if (target) target.scrollIntoView(); else if (wasDetail) window.scrollTo(0, 0);
    }
  }
  window.addEventListener('hashchange', route);
  route();
})();
