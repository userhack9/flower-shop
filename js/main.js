(function () {
  'use strict';
  document.documentElement.classList.add('js');

  /* Мобильное меню */
  var toggle = document.getElementById('menu-toggle');
  var nav = document.getElementById('site-nav');
  function setMenu(open) {
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
  }
  if (toggle && nav) {
    var wide = window.matchMedia('(min-width: 1024px)');
    var onWide = function (e) { if (e.matches) setMenu(false); };
    if (wide.addEventListener) wide.addEventListener('change', onWide); else wide.addListener(onWide);
    toggle.addEventListener('click', function () { setMenu(!nav.classList.contains('is-open')); });
    nav.addEventListener('click', function (e) { if (e.target.tagName === 'A') setMenu(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) { setMenu(false); toggle.focus(); }
    });
  }

  /* Волна на кнопках от точки нажатия */
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('.btn');
    if (!b || b.getAttribute('aria-disabled') === 'true') return;
    var r = b.getBoundingClientRect();
    var size = Math.max(r.width, r.height) * 2.4;
    var wave = document.createElement('span');
    wave.className = 'btn__wave';
    wave.style.width = wave.style.height = size + 'px';
    // клавиатурное нажатие (Enter) приходит с координатами 0,0: волна из центра
    var x = e.clientX || e.clientY ? e.clientX - r.left : r.width / 2;
    var y = e.clientX || e.clientY ? e.clientY - r.top : r.height / 2;
    wave.style.left = (x - size / 2) + 'px';
    wave.style.top = (y - size / 2) + 'px';
    b.appendChild(wave);
    wave.addEventListener('animationend', function () { wave.remove(); });
  });

  /* Таймер: время до конца сегодняшнего дня */
  var cdH = document.getElementById('cd-h');
  var cdM = document.getElementById('cd-m');
  var cdS = document.getElementById('cd-s');
  function pad(n) { return String(n).padStart(2, '0'); }
  function tick() {
    var now = new Date();
    var end = new Date(now);
    end.setHours(23, 59, 59, 999);
    var left = Math.max(0, Math.floor((end - now) / 1000));
    cdH.textContent = pad(Math.floor(left / 3600));
    cdM.textContent = pad(Math.floor((left % 3600) / 60));
    cdS.textContent = pad(left % 60);
  }
  if (cdH && cdM && cdS) { tick(); setInterval(tick, 1000); }

  /* Форма (имитация) */
  var form = document.getElementById('order-form');
  if (!form) return;
  var btn = document.getElementById('submit-btn');
  var status = document.getElementById('form-status');
  var dateInput = document.getElementById('date');

  function todayISO() {
    var d = new Date();
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  }
  dateInput.min = todayISO();
  dateInput.addEventListener('focus', function () { dateInput.min = todayISO(); });

  function showErrors(errors) {
    ['name', 'phone', 'date'].forEach(function (key) {
      var wrap = form.querySelector('[data-field="' + key + '"]');
      var msg = errors[key] || '';
      document.getElementById('err-' + key).textContent = msg;
      wrap.classList.toggle('field--error', Boolean(msg));
      form.elements[key].setAttribute('aria-invalid', msg ? 'true' : 'false');
    });
  }

  form.addEventListener('input', function (e) {
    var key = e.target && e.target.name;
    var box = key && document.getElementById('err-' + key);
    if (!box) return;
    box.textContent = '';
    form.querySelector('[data-field="' + key + '"]').classList.remove('field--error');
    e.target.setAttribute('aria-invalid', 'false');
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (btn.getAttribute('aria-disabled') === 'true') return;
    status.textContent = '';
    var result = window.FlowerValidate.validateForm({
      name: form.elements.name.value,
      phone: form.elements.phone.value,
      date: form.elements.date.value
    }, todayISO());
    showErrors(result.errors);
    if (!result.ok) {
      var first = form.querySelector('.field--error input');
      if (first) first.focus();
      return;
    }
    btn.setAttribute('aria-disabled', 'true');
    btn.textContent = 'Отправляем...';
    setTimeout(function () {
      status.textContent = 'Спасибо, мы перезвоним!';
      form.reset();
      btn.textContent = 'Отправить заявку';
      btn.removeAttribute('aria-disabled');
    }, 700);
  });
})();
