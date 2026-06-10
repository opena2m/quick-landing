/**
 * Lightweight i18n engine (dependency-free).
 *
 * Markup contract:
 *   data-i18n="path.to.key"        -> sets element.textContent
 *   data-i18n-html="path.to.key"   -> sets element.innerHTML (allows <br>, <strong>)
 *   data-i18n-attr="attr:key; ..." -> sets one or more attributes
 *                                     e.g. data-i18n-attr="placeholder:form.name; aria-label:nav.menu"
 *
 * Language is resolved on load from: localStorage -> <html lang> override
 * -> navigator.language -> 'en'. The choice is persisted in localStorage.
 */
(function (global) {
  'use strict';

  var STORAGE_KEY = 'site-lang';
  var SUPPORTED = ['en', 'zh'];

  var I18N = {
    dict: {},
    lang: 'en',

    /** Register translation dictionaries: { en: {...}, zh: {...} } */
    register: function (dict) {
      this.dict = dict || {};
      return this;
    },

    /** Resolve a dotted key path against the active dictionary. */
    get: function (key, lang) {
      var table = this.dict[lang || this.lang];
      if (!table) return undefined;
      var value = key.split('.').reduce(function (acc, part) {
        return acc == null ? undefined : acc[part];
      }, table);
      return value;
    },

    detect: function () {
      try {
        var stored = global.localStorage.getItem(STORAGE_KEY);
        if (stored && SUPPORTED.indexOf(stored) !== -1) return stored;
      } catch (e) { /* storage may be blocked */ }

      var nav = (global.navigator.language || 'en').toLowerCase();
      if (nav.indexOf('zh') === 0) return 'zh';
      return 'en';
    },

    apply: function (lang) {
      if (SUPPORTED.indexOf(lang) === -1) lang = 'en';
      this.lang = lang;

      // text content
      each('[data-i18n]', function (el) {
        var v = I18N.get(el.getAttribute('data-i18n'));
        if (v != null) el.textContent = v;
      });

      // rich html content
      each('[data-i18n-html]', function (el) {
        var v = I18N.get(el.getAttribute('data-i18n-html'));
        if (v != null) el.innerHTML = v;
      });

      // attributes
      each('[data-i18n-attr]', function (el) {
        var spec = el.getAttribute('data-i18n-attr');
        spec.split(';').forEach(function (pair) {
          var bits = pair.split(':');
          if (bits.length !== 2) return;
          var attr = bits[0].trim();
          var key = bits[1].trim();
          var v = I18N.get(key);
          if (v != null) el.setAttribute(attr, v);
        });
      });

      // document-level
      var title = this.get('meta.title');
      if (title) global.document.title = title;
      global.document.documentElement.setAttribute('lang', lang === 'zh' ? 'zh-CN' : 'en');

      // reflect active language on any toggle controls
      each('[data-lang-option]', function (el) {
        var isActive = el.getAttribute('data-lang-option') === lang;
        el.classList.toggle('is-active', isActive);
        el.setAttribute('aria-pressed', isActive ? 'true' : 'false');
      });

      try { global.localStorage.setItem(STORAGE_KEY, lang); } catch (e) { /* ignore */ }
      global.document.dispatchEvent(new CustomEvent('langchange', { detail: { lang: lang } }));
    },

    set: function (lang) { this.apply(lang); },

    toggle: function () { this.apply(this.lang === 'en' ? 'zh' : 'en'); },

    init: function () {
      this.apply(this.detect());

      // wire up any toggle buttons
      each('[data-lang-option]', function (el) {
        el.addEventListener('click', function () {
          I18N.set(el.getAttribute('data-lang-option'));
        });
      });
    }
  };

  function each(selector, fn) {
    var nodes = global.document.querySelectorAll(selector);
    for (var i = 0; i < nodes.length; i++) fn(nodes[i]);
  }

  global.I18N = I18N;
})(window);
