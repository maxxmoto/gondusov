(function () {
  function closeOverlay(overlay) {
    if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
  }

  function openChooser(telegramHref) {
    var overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML =
      '<div class="modal write-modal" role="dialog" aria-modal="true" aria-label="Куда написать врачу">' +
      '  <button class="modal-close" type="button" aria-label="Закрыть">' +
      '    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>' +
      '  </button>' +
      '  <h3>Куда написать?</h3>' +
      '  <p class="write-modal-sub">Выберите удобный способ связи.</p>' +
      '  <div class="write-choices">' +
      '    <a class="write-choice" href="https://web.max.ru/425256088" target="_blank" rel="noopener noreferrer">' +
      '      <img src="/max.webp" alt="" width="36" height="36" /><span>Max</span>' +
      '    </a>' +
      '    <a class="write-choice" href="' + telegramHref + '" target="_blank" rel="noopener noreferrer">' +
      '      <img src="/telegram.webp" alt="" width="36" height="36" /><span>Telegram</span>' +
      '    </a>' +
      '    <a class="write-choice" href="tel:+79185680599">' +
      '      <span class="write-choice-icon">' +
      '        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>' +
      '      </span><span>Позвонить</span>' +
      '    </a>' +
      '  </div>' +
      '</div>';
    document.body.appendChild(overlay);
    overlay.addEventListener('click', function (event) {
      if (event.target === overlay) closeOverlay(overlay);
    });
    var closeBtn = overlay.querySelector('.modal-close');
    if (closeBtn) closeBtn.addEventListener('click', function () { closeOverlay(overlay); });
  }

  document.addEventListener('click', function (event) {
    var cta = event.target.closest ? event.target.closest('.header-cta') : null;
    if (!cta) return;
    event.preventDefault();
    openChooser(cta.getAttribute('href') || 'https://t.me/Dr_161');
  });

  document.addEventListener('keydown', function (event) {
    if (event.key !== 'Escape') return;
    var overlay = document.querySelector('.modal-overlay');
    if (overlay) closeOverlay(overlay);
  });

  var article = document.querySelector('.article');
  if (!article) return;

  var progress = document.createElement('div');
  progress.className = 'reading-progress';
  progress.setAttribute('aria-hidden', 'true');
  progress.innerHTML = '<span></span>';
  document.body.appendChild(progress);
  var progressFill = progress.firstChild;

  function updateProgress() {
    var doc = document.documentElement;
    var scrollTop = window.pageYOffset || doc.scrollTop || 0;
    var max = doc.scrollHeight - window.innerHeight;
    var percent = max > 0 ? (scrollTop / max) * 100 : 0;
    progressFill.style.width = Math.min(100, Math.max(0, percent)) + '%';
  }

  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress);
  updateProgress();

  var heading = document.querySelector('h1');
  var shareTitle = heading ? heading.textContent.trim() : document.title;

  var share = document.createElement('div');
  share.className = 'article-share';
  share.innerHTML =
    '<button type="button" class="share-btn" aria-label="Поделиться статьёй">' +
    '  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
    '    <circle cx="18" cy="5" r="3" stroke="currentColor" stroke-width="2"/>' +
    '    <circle cx="6" cy="12" r="3" stroke="currentColor" stroke-width="2"/>' +
    '    <circle cx="18" cy="19" r="3" stroke="currentColor" stroke-width="2"/>' +
    '    <path d="M8.6 10.7 15.4 6.3M8.6 13.3l6.8 4.4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>' +
    '  </svg>' +
    '  <span>Поделиться</span>' +
    '</button>' +
    '<span class="share-status" aria-live="polite"></span>';

  var cta = article.querySelector('.cta-block');
  if (cta) {
    cta.parentNode.insertBefore(share, cta);
  } else {
    article.appendChild(share);
  }

  var shareBtn = share.querySelector('.share-btn');
  var shareStatus = share.querySelector('.share-status');
  var statusTimer = null;

  function showStatus(text) {
    shareStatus.textContent = text;
    shareStatus.classList.add('visible');
    if (statusTimer) clearTimeout(statusTimer);
    statusTimer = setTimeout(function () {
      shareStatus.classList.remove('visible');
    }, 2500);
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      var area = document.createElement('textarea');
      area.value = text;
      area.setAttribute('readonly', '');
      area.style.position = 'fixed';
      area.style.top = '-1000px';
      area.style.opacity = '0';
      document.body.appendChild(area);
      area.select();
      try {
        document.execCommand('copy') ? resolve() : reject(new Error('copy failed'));
      } catch (error) {
        reject(error);
      }
      document.body.removeChild(area);
    });
  }

  shareBtn.addEventListener('click', function () {
    var url = window.location.href;
    if (navigator.share) {
      navigator.share({ title: shareTitle, text: shareTitle, url: url }).catch(function () {});
      return;
    }
    copyText(url)
      .then(function () { showStatus('Ссылка скопирована'); })
      .catch(function () { showStatus('Не удалось скопировать ссылку'); });
  });
})();
