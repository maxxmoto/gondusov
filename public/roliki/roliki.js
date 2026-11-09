(function () {
  document.querySelectorAll('.roliki-card-button').forEach(function (button) {
    button.addEventListener('click', function () {
      var embed = button.getAttribute('data-embed');
      var card = button.closest('.roliki-card');
      if (!embed || !card) return;

      var iframe = document.createElement('iframe');
      iframe.className = 'roliki-iframe';
      iframe.src = embed + '?autoplay=1';
      iframe.title = button.getAttribute('aria-label') || 'Ролик';
      iframe.allow = 'autoplay; fullscreen; picture-in-picture; encrypted-media; screen-wake-lock';
      iframe.setAttribute('loading', 'eager');
      card.replaceChildren(iframe);
    });
  });
})();
