(function (root) {
  'use strict';

  function validateName(value) {
    return String(value || '').trim() ? null : 'Введите имя';
  }

  function validatePhone(value) {
    var raw = String(value || '').trim();
    if (!raw) return 'Введите телефон';
    if (/[^0-9+()\-\s]/.test(raw)) return 'Телефон может содержать только цифры, пробелы, скобки, плюс и дефис';
    var digits = raw.replace(/\D/g, '');
    var ok = (digits.length === 11 && (digits[0] === '7' || digits[0] === '8')) ||
             (digits.length === 10 && digits[0] === '9');
    return ok ? null : 'Введите номер в формате +7 (999) 123-45-67';
  }

  function validateDate(value, todayISO) {
    var v = String(value || '').trim();
    if (!v) return 'Выберите дату доставки';
    if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return 'Некорректная дата';
    return v < todayISO ? 'Дата не может быть в прошлом' : null;
  }

  function validateForm(data, todayISO) {
    var errors = {};
    var e;
    if ((e = validateName(data.name))) errors.name = e;
    if ((e = validatePhone(data.phone))) errors.phone = e;
    if ((e = validateDate(data.date, todayISO))) errors.date = e;
    return { ok: Object.keys(errors).length === 0, errors: errors };
  }

  var api = { validateName: validateName, validatePhone: validatePhone,
              validateDate: validateDate, validateForm: validateForm };

  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.FlowerValidate = api;
})(typeof window !== 'undefined' ? window : this);
