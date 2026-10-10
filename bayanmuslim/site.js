'use strict';
(() => {
  const root = document.documentElement;
  const body = document.body;
  const languageButton = document.getElementById('language-toggle');
  const themeButton = document.getElementById('theme-toggle');
  const picker = document.getElementById('theme-picker');
  const themeButtons = [...picker.querySelectorAll('[data-theme]')];
  const themes = new Set(themeButtons.map(button => button.dataset.theme));
  const read = key => { try { return localStorage.getItem(key); } catch { return null; } };
  const save = (key, value) => { try { localStorage.setItem(key, value); } catch { /* Browsing works without storage. */ } };
  function language(value) {
    const lang = value === 'en' ? 'en' : 'ar';
    root.lang = lang;
    root.dir = lang === 'ar' ? 'rtl' : 'ltr';
    languageButton.textContent = lang === 'ar' ? 'English' : 'العربية';
    languageButton.setAttribute('aria-label', lang === 'ar' ? 'Switch to English' : 'التبديل إلى العربية');
    document.title = lang === 'ar' ? 'بيان المسلم | دليل التطبيق وسياسة الخصوصية' : 'Bayan Muslim | App guide & privacy policy';
    save('bayan-site-language', lang);
  }
  function theme(value) {
    const selected = themes.has(value) ? value : 'emerald';
    body.dataset.theme = selected;
    themeButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.theme === selected)));
    const color = getComputedStyle(body).getPropertyValue('--bg').trim();
    document.querySelector('meta[name="theme-color"]').content = color;
    save('bayan-site-theme', selected);
  }
  function closePicker(returnFocus = false) {
    picker.hidden = true;
    themeButton.setAttribute('aria-expanded', 'false');
    if (returnFocus) themeButton.focus();
  }
  languageButton.addEventListener('click', () => language(root.lang === 'ar' ? 'en' : 'ar'));
  themeButton.addEventListener('click', () => {
    const opening = picker.hidden;
    picker.hidden = !opening;
    themeButton.setAttribute('aria-expanded', String(opening));
    if (opening) picker.querySelector('[aria-pressed="true"]').focus();
  });
  themeButtons.forEach(button => button.addEventListener('click', () => {
    theme(button.dataset.theme);
    closePicker(true);
  }));
  document.addEventListener('click', event => {
    if (!picker.contains(event.target) && !themeButton.contains(event.target)) closePicker();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !picker.hidden) closePicker(true);
  });
  language(read('bayan-site-language'));
  theme(read('bayan-site-theme'));
})();
