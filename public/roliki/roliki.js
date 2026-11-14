(function () {
  var summaryTimer = null;
  var typeFrame = null;

  document.querySelectorAll('.roliki-card-button').forEach(function (button) {
    button.addEventListener('click', function () {
      var videoSrc = button.getAttribute('data-video');
      if (videoSrc) {
        var poster = button.querySelector('img');
        var video = document.createElement('video');
        video.className = 'roliki-video';
        video.src = videoSrc;
        video.poster = poster ? poster.src : '';
        video.controls = true;
        video.autoplay = true;
        video.playsInline = true;
        video.muted = false;
        video.setAttribute('playsinline', '');
        video.setAttribute('preload', 'auto');
        button.replaceWith(video);
        video.play().catch(function () {});
        return;
      }

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
        '<p class="summary-note">Краткий пересказ ролика. Не заменяет консультацию врача.</p>' +
        '<button type="button" class="summary-write-btn">Написать врачу <span aria-hidden="true">→</span></button>',
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
        '<p class="summary-note">Краткий пересказ ролика. Не заменяет консультацию врача.</p>' +
        '<button type="button" class="summary-write-btn">Написать врачу <span aria-hidden="true">→</span></button>',
    },
    'gut-years': {
      title: 'Лечишь кишечник годами — а легче не становится?',
      html:
        '<p class="summary-lead">Если лечение кишечника годами не даёт результата, возможно, дело не в «плохой микрофлоре», а в СИБР — избыточном бактериальном росте в тонкой кишке.</p>' +
        '<ul class="summary-list">' +
          '<li><strong>После антибиотиков.</strong> Микробиом меняется, но восстанавливается не у всех: у части людей изменения сохраняются через полгода. На этом фоне развивается постантибиотиковый СИБР.</li>' +
          '<li><strong>Почему анализы чистые.</strong> Кал на дисбактериоз показывает толстую кишку, а проблема — в тонкой. Общий анализ крови, гастроскопия и колоноскопия могут быть в норме.</li>' +
          '<li><strong>Как проверить.</strong> Основной метод — водородный дыхательный тест с лактулозой. Он показывает, как кишечник реагирует на специальную нагрузку.</li>' +
          '<li><strong>Как восстанавливаться.</strong> Врач может назначить диету, антимикробную терапию и прокинетики. Затем постепенно возвращают клетчатку и пробиотики — не во время лечения, а после.</li>' +
          '<li><strong>Главная ошибка.</strong> Начинать с пробиотиков «на всякий случай»: при СИБР они могут усилить вздутие. Нужен план и контроль врача.</li>' +
        '</ul>' +
        '<div class="summary-takeaway"><span>Главный вывод</span><p>Лечить вслепую — значит годами ходить по кругу. Сначала нужен точный диагноз, потом — понятный план восстановления.</p></div>' +
        '<p class="summary-audience"><strong>Кому смотреть:</strong> тем, кто уже менял диеты и пробиотики, но вздутие и дискомфорт возвращаются.</p>' +
        '<p class="summary-note">Краткий пересказ ролика. Не заменяет консультацию врача.</p>' +
        '<button type="button" class="summary-write-btn">Написать врачу <span aria-hidden="true">→</span></button>',
    },
    'clean-tests': {
      title: 'Обследования чистые — а живот болит?',
      html:
        '<p class="summary-lead">Анализы, УЗИ и гастроскопия в норме, а живот болит? Это не значит, что проблемы нет: СИБР часто не виден на стандартных обследованиях.</p>' +
        '<ul class="summary-list">' +
          '<li><strong>Что не показывает.</strong> Кал на дисбактериоз отражает состояние толстой кишки, а при СИБР бактерии растут в тонкой. Поэтому стандартные анализы могут быть нормальными.</li>' +
          '<li><strong>На что обратить внимание.</strong> Вздутие после еды, непереносимость молока, хлеба или капусты, чередование диареи и запора, дискомфорт без явной причины.</li>' +
          '<li><strong>Как проверить.</strong> Водородный дыхательный тест с лактулозой. Он помогает подтвердить избыточный бактериальный рост и выбрать тактику.</li>' +
          '<li><strong>Что делать.</strong> Врач может назначить low-FODMAP диету на 4–6 недель, антимикробную терапию и прокинетики. Клетчатку и пробиотики возвращают постепенно.</li>' +
          '<li><strong>Чего не делать.</strong> Не ставить диагноз по интернету и не пить пробиотики до лечения — они могут усилить симптомы.</li>' +
        '</ul>' +
        '<div class="summary-takeaway"><span>Главный вывод</span><p>«Чистые анализы» не отменяют жалобы. Если живот болит регулярно, нужен врач и целенаправленное обследование.</p></div>' +
        '<p class="summary-audience"><strong>Кому смотреть:</strong> тем, кому говорят «у вас всё нормально», но симптомы продолжаются.</p>' +
        '<p class="summary-note">Краткий пересказ ролика. Не заменяет консультацию врача.</p>' +
        '<button type="button" class="summary-write-btn">Написать врачу <span aria-hidden="true">→</span></button>',
    },
    'pp-bloating': {
      title: 'Перешли на ПП — а живот раздуло?',
      html:
        '<p class="summary-lead">Овсянка, салат и отруби звучат полезно. Но при СИБР «здоровая» клетчатка может усиливать вздутие: бактерии ферментируют её с образованием газа.</p>' +
        '<ul class="summary-list">' +
          '<li><strong>Триггер 1: бобовые.</strong> Фасоль, нут и чечевица — классические газообразующие продукты, которые на время исключают.</li>' +
          '<li><strong>Триггер 2: цельнозерновые.</strong> Овёс, рожь, ячмень и отруби могут поддерживать вздутие при СИБР.</li>' +
          '<li><strong>Триггер 3: фрукты.</strong> Яблоки, груши, арбуз, сливы и сухофрукты содержат фруктозу и полиолы, которые усиливают брожение.</li>' +
          '<li><strong>Что есть.</strong> Рис, картофель, зеленоватые бананы, твёрдые сыры, яйца, мясо, рыба, морковь, кабачки, оливковое масло.</li>' +
          '<li><strong>Сколько соблюдать.</strong> Обычно 4–6 недель, затем продукты вводят по одному и оценивают реакцию. Это временная мера, а не пожизненная диета.</li>' +
        '</ul>' +
        '<div class="summary-takeaway"><span>Главный вывод</span><p>ПП не всегда равно «подходит вашему кишечнику». При вздутии важен не ярлык, а переносимость и причина симптомов.</p></div>' +
        '<p class="summary-audience"><strong>Кому смотреть:</strong> тем, у кого живот раздувается после «правильных» продуктов и клетчатки.</p>' +
        '<p class="summary-note">Краткий пересказ ролика. Не заменяет консультацию врача.</p>' +
        '<button type="button" class="summary-write-btn">Написать врачу <span aria-hidden="true">→</span></button>',
    },
    'heartburn': {
      title: 'Изжога: почему таблетки не решают проблему?',
      html:
        '<p class="summary-lead">Изжога пару раз в год после жирного — не катастрофа. Но если она два и более раз в неделю, беспокоит ночью или после каждой еды, таблетки только глушат симптом.</p>' +
        '<ul class="summary-list">' +
          '<li><strong>Что происходит.</strong> Содержимое желудка забрасывается в пищевод, а его слизистая не приспособлена к кислоте. Появляются жжение, горечь и дискомфорт.</li>' +
          '<li><strong>Почему не стоит тянуть.</strong> Без лечения рефлюкс может приводить к эрозиям, язвам и пищеводу Барретта — предраковому состоянию.</li>' +
          '<li><strong>Почему сода не решение.</strong> Она даёт кратковременное облегчение, а затем кислотность может вернуться с рикошетом.</li>' +
          '<li><strong>Про таблетки.</strong> ИПП и антациды не должны назначаться «на всякий случай» и приниматься годами без контроля врача.</li>' +
          '<li><strong>Что делать.</strong> Обсудить с гастроэнтерологом ФГДС, при необходимости pH-метрию, лечение причины и контроль. После 45 лет при длительной изжоге гастроскопия особенно важна.</li>' +
        '</ul>' +
        '<div class="summary-takeaway"><span>Главный вывод</span><p>Изжога — симптом, а не отдельный диагноз. Нужно лечить причину рефлюкса, а не только убирать жжение таблеткой.</p></div>' +
        '<p class="summary-audience"><strong>Кому смотреть:</strong> тем, кто регулярно пьёт антациды или ИПП без наблюдения врача.</p>' +
        '<p class="summary-note">Краткий пересказ ролика. Не заменяет консультацию врача.</p>' +
        '<button type="button" class="summary-write-btn">Написать врачу <span aria-hidden="true">→</span></button>',
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

  document.addEventListener('click', function (event) {
    var writeButton = event.target.closest ? event.target.closest('.summary-write-btn') : null;
    if (!writeButton) return;
    closeSummary();
    var headerCta = document.querySelector('.header-cta');
    if (headerCta) headerCta.click();
  });

  closeBtn.addEventListener('click', closeSummary);
  overlay.addEventListener('click', function (event) {
    if (event.target === overlay) closeSummary();
  });
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && !overlay.hidden) closeSummary();
  });
})();
