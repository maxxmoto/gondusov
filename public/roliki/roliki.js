(function () {
  var summaryTimer = null;
  var typeFrame = null;

  document.querySelectorAll('.roliki-card-button').forEach(function (button) {
    button.addEventListener('click', function () {
      var embed = button.getAttribute('data-embed');
      if (!embed) return;

      var iframe = document.createElement('iframe');
      iframe.className = 'roliki-iframe';
      iframe.src = embed + '?autoplay=1';
      iframe.title = button.getAttribute('aria-label') || 'Ролик';
      iframe.allow = 'autoplay; fullscreen; picture-in-picture; encrypted-media; screen-wake-lock';
      iframe.setAttribute('loading', 'eager');
      button.replaceWith(iframe);
    });
  });

  var SUMMARIES = {
    'sleep-after-food': {
      title: 'Сонливость после еды — не норма',
      html:
        '<p class="summary-lead">Если после каждого обеда тянет в сон — это не просто «тяжёлый день». У этого есть три частые причины, которые стоит проверить.</p>' +
        '<ul class="summary-list">' +
          '<li><strong>Инсулинорезистентность.</strong> После еды сахар растёт, инсулина выбрасывается всё больше, а затем уровень глюкозы резко падает. <em>Этот провал и ощущается как внезапная сонливость.</em> Проблема может годами маскироваться под обычную усталость.</li>' +
          '<li><strong>Гипотиреоз.</strong> Если щитовидная железа вырабатывает мало гормонов, замедляется обмен веществ и пищеварение. После еды организм тратит последние силы — отсюда вялость. Иногда это <em>единственный заметный симптом</em>.</li>' +
          '<li><strong>Переедание и тяжёлая пища.</strong> Большая порция углеводов и жиров направляет кровоток к желудку и кишечнику. Чем больше жареного, мучного и сладкого, тем сильнее клонит в сон.</li>' +
          '<li><strong>Что проверить.</strong> Глюкоза натощак, инсулин, ТТГ и ферритин. С результатами — к терапевту или эндокринологу, а не на форум.</li>' +
          '<li><strong>Что помогает уже завтра.</strong> Белок и клетчатка в каждый приём пищи, умеренные порции и <em>10–15 минут ходьбы после еды</em>. Кофе — маскировка, а не решение.</li>' +
        '</ul>' +
        '<div class="summary-takeaway"><span>Главный вывод</span><p>Сонливость после еды — не характер и не лень, а сигнал организма. Начните с анализов и простых изменений, а не с очередной чашки кофе.</p></div>' +
        '<p class="summary-audience"><strong>Кому смотреть:</strong> тем, кто регулярно «выключается» после обеда и списывает это на усталость, стресс или возраст.</p>' +
        '<p class="summary-note">Краткий пересказ ролика. Не заменяет консультацию врача.</p>',
    },
    'bloating-reasons': {
      title: 'Вздутие — не всегда про еду',
      html:
        '<p class="summary-lead">Вздутие — не всегда «много газа» и не всегда «плохая микрофлора». За одним симптомом стоят разные механизмы, и лечение зависит от причины.</p>' +
        '<ul class="summary-list">' +
          '<li><strong>Газ и FODMAP.</strong> Бактерии ферментируют непереваренные углеводы: пшеницу, лук, бобовые, яблоки, молоко, сахарозаменители. Газ образуется при СИБР и нарушении всасывания углеводов.</li>' +
          '<li><strong>Нарушение моторики.</strong> Газа может быть нормально, но кишечник не продвигает его. Стенки растягиваются — появляется распирание и боль. Часто так бывает при СРК.</li>' +
          '<li><strong>Висцеральная чувствительность.</strong> Газ и моторика в норме, но нервная система воспринимает обычное растяжение как боль. Это проблема оси <em>«кишечник — мозг»</em>, и стресс её усиливает.</li>' +
          '<li><strong>Желчь и жирная еда.</strong> Если желчеотделение нарушено, жиры перевариваются хуже — появляется тяжесть и вздутие, особенно после жирной пищи.</li>' +
          '<li><strong>Что делать.</strong> Исключить органику, сделать дыхательные тесты, вести дневник питания 2–4 недели, попробовать низко-FODMAP диету. Пробиотики — только по показаниям, а не «на всякий случай».</li>' +
        '</ul>' +
        '<div class="summary-takeaway"><span>Главный вывод</span><p>Вздутие — симптом, а не диагноз. Лечить нужно не газ, а механизм, который его вызывает.</p></div>' +
        '<p class="summary-audience"><strong>Кому смотреть:</strong> тем, у кого вздутие возвращается после «таблеток от живота» и диет.</p>' +
        '<p class="summary-note">Краткий пересказ ролика. Не заменяет консультацию врача.</p>',
    },
  };

  var overlay = document.getElementById('roliki-summary');
  var body = document.getElementById('roliki-summary-body');
  var title = document.getElementById('roliki-summary-title');
  var closeBtn = overlay ? overlay.querySelector('.summary-close') : null;

  if (!overlay || !body || !title || !closeBtn) return;

  var loadingHtml =
    '<div class="summary-loading">' +
    '<span class="summary-spinner" aria-hidden="true"></span>' +
    '<p class="summary-loading-title">ИИ изучает ролик…</p>' +
    '<p class="summary-loading-sub">Выделяю главное</p>' +
    '</div>';

  function clearAnimation() {
    if (summaryTimer) {
      clearTimeout(summaryTimer);
      summaryTimer = null;
    }
    if (typeFrame) {
      cancelAnimationFrame(typeFrame);
      typeFrame = null;
    }
  }

  function closeSummary() {
    clearAnimation();
    overlay.hidden = true;
    document.body.style.overflow = '';
    body.classList.remove('is-loading');
    body.innerHTML = '';
    title.textContent = '';
  }

  function typeSummary(root) {
    var elements = [
      root.querySelector('.summary-lead'),
    ].concat(Array.from(root.querySelectorAll('.summary-list li')), [
      root.querySelector('.summary-takeaway'),
      root.querySelector('.summary-audience'),
      root.querySelector('.summary-note'),
    ]).filter(Boolean);

    var units = [];
    var start = 0;
    elements.forEach(function (element) {
      var walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
      var nodes = [];
      var current = walker.nextNode();
      while (current) {
        var text = current.nodeValue || '';
        if (text) nodes.push({ node: current, full: text });
        current = walker.nextNode();
      }
      var total = nodes.reduce(function (sum, item) { return sum + item.full.length; }, 0);
      units.push({ el: element, nodes: nodes, total: total, start: start });
      start += total;
    });

    var total = start;
    if (!total) return;

    units.forEach(function (unit) {
      unit.nodes.forEach(function (item) { item.node.nodeValue = ''; });
      unit.el.style.visibility = 'hidden';
    });

    var duration = 2400;
    var startedAt = performance.now();

    function tick(now) {
      var progress = Math.min(1, (now - startedAt) / duration);
      var revealed = Math.floor(total * progress);
      units.forEach(function (unit) {
        var inUnit = Math.max(0, Math.min(unit.total, revealed - unit.start));
        if (revealed > unit.start) unit.el.style.visibility = 'visible';
        unit.nodes.forEach(function (item) {
          var length = Math.min(item.full.length, inUnit);
          item.node.nodeValue = item.full.slice(0, length);
          inUnit -= length;
        });
      });
      if (progress < 1) typeFrame = requestAnimationFrame(tick);
    }

    typeFrame = requestAnimationFrame(tick);
  }

  function openSummary(id) {
    var summary = SUMMARIES[id];
    if (!summary) return;

    clearAnimation();
    overlay.hidden = false;
    document.body.style.overflow = 'hidden';
    title.textContent = summary.title;
    body.classList.add('is-loading');
    body.innerHTML = loadingHtml;
    closeBtn.focus();

    summaryTimer = setTimeout(function () {
      body.classList.remove('is-loading');
      body.innerHTML = summary.html;
      typeSummary(body);
    }, 1500);
  }

  document.querySelectorAll('.roliki-summary-btn').forEach(function (button) {
    button.addEventListener('click', function () {
      openSummary(button.getAttribute('data-summary'));
    });
  });

  closeBtn.addEventListener('click', closeSummary);
  overlay.addEventListener('click', function (event) {
    if (event.target === overlay) closeSummary();
  });
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && !overlay.hidden) closeSummary();
  });
})();
