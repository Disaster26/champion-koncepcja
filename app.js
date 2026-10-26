(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* menu mobilne */
  var ham = $('.ham'), panel = $('#panel');
  function zamknij() { panel.hidden = true; ham.setAttribute('aria-expanded', 'false'); ham.setAttribute('aria-label', 'Otwórz menu'); }
  ham.addEventListener('click', function () {
    var otw = panel.hidden;
    panel.hidden = !otw;
    ham.setAttribute('aria-expanded', String(otw));
    ham.setAttribute('aria-label', otw ? 'Zamknij menu' : 'Otwórz menu');
  });
  $$('#panel a').forEach(function (a) { a.addEventListener('click', zamknij); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !panel.hidden) zamknij(); });
  window.addEventListener('resize', function () { if (innerWidth > 1024) zamknij(); });

  /* dolny pasek: dopiero po przewinieciu za przyciski hero */
  var mob = $('#mob'), heroCta = $('.hero-cta');
  function pasek(w) {
    mob.classList.toggle('widac', w);
    mob.setAttribute('aria-hidden', String(!w));
    $$('a', mob).forEach(function (a) { a.tabIndex = w ? 0 : -1; });
  }
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (en) {
      en.forEach(function (x) { pasek(!x.isIntersecting && x.boundingClientRect.top < 0); });
    }).observe(heroCta);
  }

  /* kafle kursow ustawiaja kurs w formularzu */
  var form = $('#form'), info = $('#formInfo');
  var mapa = ['Kategoria B', 'Kategoria B+E', 'Kategoria C', 'Kategoria C+E', 'Kwalifikacja wstępna C, CE', 'Szkolenie okresowe C, CE'];
  $$('.kafel').forEach(function (k, i) {
    k.addEventListener('click', function () { form.kat.value = mapa[i]; });
  });

  /* formularz bez backendu - przygotowuje wiadomosc e-mail do biura */
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var ok = true;
    $$('[required]', form).forEach(function (el) {
      var zle = !el.value.trim();
      el.closest('.pole').classList.toggle('blad', zle);
      if (zle) ok = false;
    });
    if (!ok) { info.textContent = 'Wpisz imię i numer telefonu.'; return; }
    var linie = ['Kurs: ' + form.kat.value, 'Imię: ' + form.kto.value.trim(), 'Telefon: ' + form.tel.value.trim()];
    if (form.uw.value.trim()) linie.push('', form.uw.value.trim());
    info.textContent = 'Otwieramy program pocztowy z gotową wiadomością do biura.';
    location.href = 'mailto:biuro.oskchampion@wp.pl?subject=' + encodeURIComponent('Zapis: ' + form.kat.value) + '&body=' + encodeURIComponent(linie.join('\n'));
  });
  $$('[required]', form).forEach(function (el) {
    el.addEventListener('input', function () { el.closest('.pole').classList.remove('blad'); });
  });
})();
