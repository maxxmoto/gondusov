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
    "sleep-after-food": {
      title: "Сонливость после еды — не норма",
      html: "<p class=\"summary-lead\">Сонливость после еды — не норма. Чаще всего это признак нарушения, связанного с инсулинорезистентностью.</p><ul class=\"summary-list\"><li><strong>Что проверить.</strong> Глюкозу, инсулин и функцию щитовидной железы — особенно если хочется спать после каждого приёма пищи.</li><li><strong>Почему это важно.</strong> Постоянная сонливость после еды может быть сигналом метаболических нарушений, а не просто «тяжёлого обеда».</li><li><strong>Что делать.</strong> Не маскировать кофе, а обсудить с врачом обследование и тактику.</li></ul><div class=\"summary-takeaway\"><span>Главный вывод</span><p>Сонливость после еды — повод проверить обмен веществ, а не списывать всё на усталость.</p></div><p class=\"summary-audience\"><strong>Кому смотреть:</strong> тем, кто регулярно «выключается» после обеда и списывает это на усталость, стресс или возраст.</p><p class=\"summary-note\">Краткий пересказ ролика. Не заменяет консультацию врача.</p><button type=\"button\" class=\"summary-write-btn\">Написать врачу <span aria-hidden=\"true\">→</span></button>",
    },
    "bloating-reasons": {
      title: "Вздутие — не всегда про еду",
      html: "<p class=\"summary-lead\">Вздутие часто списывают на еду: съели не то, выпили не то. Но причина может быть в образе жизни и работе ЖКТ.</p><ul class=\"summary-list\"><li><strong>Что ещё влияет.</strong> Стресс, нарушение моторики, дисбактериоз, повышенная кислотность, проблемы с оттоком желчи.</li><li><strong>Когда еда ни при чём.</strong> Если исключили бобовые, капусту и мучное, а вздутие осталось — проблема не в еде.</li><li><strong>Что проверить.</strong> В зависимости от симптомов врач может назначить дыхательный тест на СИБР и УЗИ органов брюшной полости.</li><li><strong>Главное.</strong> Не ограничивать питание бесконечно, а найти причину вздутия.</li></ul><div class=\"summary-takeaway\"><span>Главный вывод</span><p>Вздутие — симптом, а не диагноз. Лечить нужно причину, а не только убирать продукты.</p></div><p class=\"summary-audience\"><strong>Кому смотреть:</strong> тем, у кого вздутие остаётся после исключения бобовых, капусты и мучного.</p><p class=\"summary-note\">Краткий пересказ ролика. Не заменяет консультацию врача.</p><button type=\"button\" class=\"summary-write-btn\">Написать врачу <span aria-hidden=\"true\">→</span></button>",
    },
    "gut-years": {
      title: "Лечишь кишечник годами — а легче не становится?",
      html: "<p class=\"summary-lead\">Самая частая ошибка — лечить симптом, а не причину. Эспумизан, слабительное и Но-шпа дают временное облегчение, но не решают проблему.</p><ul class=\"summary-list\"><li><strong>Что происходит.</strong> При вздутии пьют эспумизан, при запоре — слабительные, при боли — Но-шпу. Симптом возвращается.</li><li><strong>Какие причины искать.</strong> СИБР, ферментная недостаточность, нарушение моторики, дискинезия желчевыводящих путей.</li><li><strong>С чего начать.</strong> С диагностики и лечения причины, а не с очередной таблетки.</li></ul><div class=\"summary-takeaway\"><span>Главный вывод</span><p>Временное облегчение — не лечение. Найдите причину, иначе круг будет повторяться.</p></div><p class=\"summary-audience\"><strong>Кому смотреть:</strong> тем, кто годами лечит кишечник симптоматически и не видит результата.</p><p class=\"summary-note\">Краткий пересказ ролика. Не заменяет консультацию врача.</p><button type=\"button\" class=\"summary-write-btn\">Написать врачу <span aria-hidden=\"true\">→</span></button>",
    },
    "clean-tests": {
      title: "Обследования чистые — а живот болит?",
      html: "<p class=\"summary-lead\">Если колоноскопия не выявила патологии, а боль осталась, это не значит, что жалобы «ненастоящие».</p><ul class=\"summary-list\"><li><strong>Возможные причины.</strong> Синдром раздражённого кишечника, СИБР, непереносимость лактозы или глютена.</li><li><strong>Почему так.</strong> Эндоскоп видит не всё: функциональные нарушения и пищевую непереносимость он не исключает.</li><li><strong>Что делать.</strong> Обсудить с врачом дальнейшую диагностику и не терпеть боль.</li></ul><div class=\"summary-takeaway\"><span>Главный вывод</span><p>Боль — сигнал, даже если эндоскоп ничего не увидел.</p></div><p class=\"summary-audience\"><strong>Кому смотреть:</strong> тем, кому сказали «у вас всё нормально», но боль и дискомфорт продолжаются.</p><p class=\"summary-note\">Краткий пересказ ролика. Не заменяет консультацию врача.</p><button type=\"button\" class=\"summary-write-btn\">Написать врачу <span aria-hidden=\"true\">→</span></button>",
    },
    "heartburn": {
      title: "Изжога: почему таблетки не решают проблему?",
      html: "<p class=\"summary-lead\">Изжога — не норма. Если вы годами пьёте Альмагель, а симптом возвращается, значит, вы не лечите причину.</p><ul class=\"summary-list\"><li><strong>Что искать.</strong> Грыжу пищеводного отверстия диафрагмы, рефлюксную болезнь, низкую кислотность, Helicobacter pylori, стресс.</li><li><strong>Что даёт ответ.</strong> Только ВГДС помогает увидеть причину и оценить состояние слизистой.</li><li><strong>Почему не стоит тянуть.</strong> Постоянное раздражение пищевода может приводить к предраковым изменениям.</li><li><strong>Что делать.</strong> Не гасить симптом, а искать причину с врачом.</li></ul><div class=\"summary-takeaway\"><span>Главный вывод</span><p>Изжога — симптом, а не диагноз. Лечить нужно причину, а не только жжение.</p></div><p class=\"summary-audience\"><strong>Кому смотреть:</strong> тем, кто регулярно пьёт антациды или ИПП без наблюдения врача.</p><p class=\"summary-note\">Краткий пересказ ролика. Не заменяет консультацию врача.</p><button type=\"button\" class=\"summary-write-btn\">Написать врачу <span aria-hidden=\"true\">→</span></button>",
    },
    "pp-bloating": {
      title: "Перешли на ПП — а живот раздуло?",
      html: "<p class=\"summary-lead\">Много клетчатки, цельнозерновые, бобовые и сырые овощи — звучит полезно. Но при СИБР или сниженной ферментной активности это может усилить вздутие и боль.</p><ul class=\"summary-list\"><li><strong>Почему так.</strong> Не все «здоровые» продукты подходят вашему кишечнику.</li><li><strong>Что делать.</strong> Начинать постепенно, отслеживать реакцию и консультироваться с врачом.</li><li><strong>Главное.</strong> Здоровое питание — не список из интернета, а рацион, который подходит именно вам.</li></ul><div class=\"summary-takeaway\"><span>Главный вывод</span><p>ПП не равно «подходит всем». Смотрите на свою переносимость, а не на ярлык.</p></div><p class=\"summary-audience\"><strong>Кому смотреть:</strong> тем, у кого живот раздувается после «правильных» продуктов и клетчатки.</p><p class=\"summary-note\">Краткий пересказ ролика. Не заменяет консультацию врача.</p><button type=\"button\" class=\"summary-write-btn\">Написать врачу <span aria-hidden=\"true\">→</span></button>",
    },
    "alt-ast": {
      title: "АЛТ и АСТ повышены — это ещё не «плохая печень»",
      html: "<p class=\"summary-lead\">Повышение печёночных ферментов — маркер повреждения гепатоцитов, но не всегда признак тяжёлого заболевания.</p><ul class=\"summary-list\"><li><strong>Возможные причины.</strong> Жировой гепатоз, приём лекарств, алкоголь, вирусы, нарушение оттока желчи.</li><li><strong>Когда обследоваться.</strong> Если показатели повышены в 1,5–2 раза — это повод для дообследования.</li><li><strong>Что делать.</strong> Не паниковать и не игнорировать: обсудить с врачом причину и план проверки.</li></ul><div class=\"summary-takeaway\"><span>Главный вывод</span><p>Повышенные АЛТ и АСТ — не диагноз, а повод разобраться в причине.</p></div><p class=\"summary-audience\"><strong>Кому смотреть:</strong> тем, кто увидел повышенные печёночные ферменты и не знает, что делать дальше.</p><p class=\"summary-note\">Краткий пересказ ролика. Не заменяет консультацию врача.</p><button type=\"button\" class=\"summary-write-btn\">Написать врачу <span aria-hidden=\"true\">→</span></button>",
    },
    "hpylori": {
      title: "Нашли Helicobacter pylori. Что теперь?",
      html: "<p class=\"summary-lead\">Helicobacter pylori может вызывать воспаление желудка, язву и повышать риск рака при атрофии слизистой.</p><ul class=\"summary-list\"><li><strong>Если анализ положительный.</strong> Даже без симптомов лечение рекомендуется всегда.</li><li><strong>Как лечить.</strong> Схема подбирается индивидуально, с учётом чувствительности к антибиотикам.</li><li><strong>Что не делать.</strong> Не назначать себе терапию самостоятельно.</li></ul><div class=\"summary-takeaway\"><span>Главный вывод</span><p>H. pylori — не просто «бактерия в анализах». Это повод обсудить лечение с врачом.</p></div><p class=\"summary-audience\"><strong>Кому смотреть:</strong> тем, у кого нашли H. pylori и предлагают «просто наблюдать».</p><p class=\"summary-note\">Краткий пересказ ролика. Не заменяет консультацию врача.</p><button type=\"button\" class=\"summary-write-btn\">Написать врачу <span aria-hidden=\"true\">→</span></button>",
    },
    "uzi-clear": {
      title: "УЗИ чистое, а живот болит?",
      html: "<p class=\"summary-lead\">УЗИ — информативный, но не всевидящий метод. Он не показывает функциональные нарушения и плохо видит полые органы — желудок и кишечник.</p><ul class=\"summary-list\"><li><strong>Что может быть.</strong> СРК, СИБР, грыжа, у женщин — эндометриоз.</li><li><strong>Почему УЗИ не всё видит.</strong> Отсутствие патологии на УЗИ не исключает функциональную или другую причину боли.</li><li><strong>Что делать.</strong> Не игнорировать боль и обсудить с врачом дальнейшую диагностику.</li></ul><div class=\"summary-takeaway\"><span>Главный вывод</span><p>Чистое УЗИ не отменяет жалобы. Боль — повод искать причину дальше.</p></div><p class=\"summary-audience\"><strong>Кому смотреть:</strong> тем, у кого УЗИ без патологии, а живот продолжает болеть.</p><p class=\"summary-note\">Краткий пересказ ролика. Не заменяет консультацию врача.</p><button type=\"button\" class=\"summary-write-btn\">Написать врачу <span aria-hidden=\"true\">→</span></button>",
    },
    "probiotic-strain": {
      title: "Почему один пробиотик работает, а другой нет?",
      html: "<p class=\"summary-lead\">Пробиотики — комплекс живых бактерий. При СИБР дополнительные бактерии могут усилить вздутие, а в активную фазу воспаления пробиотики могут не работать.</p><ul class=\"summary-list\"><li><strong>Когда не помогут.</strong> При СИБР и активном воспалении — без диагностики и лечения причины.</li><li><strong>Как выбирать.</strong> С доказанной эффективностью, после антибиотиков, а не во время, и по назначению врача.</li><li><strong>Главное.</strong> Не все пробиотики одинаково полезны.</li></ul><div class=\"summary-takeaway\"><span>Главный вывод</span><p>Пробиотик — не универсальная таблетка. Сначала причина, потом препарат.</p></div><p class=\"summary-audience\"><strong>Кому смотреть:</strong> тем, кто перебирает пробиотики, но не видит улучшения.</p><p class=\"summary-note\">Краткий пересказ ролика. Не заменяет консультацию врача.</p><button type=\"button\" class=\"summary-write-btn\">Написать врачу <span aria-hidden=\"true\">→</span></button>",
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
