// School / suburb / city autocomplete for the CollandUni app.
// Backed by the public schools API suggest endpoints.

(function () {
  'use strict';

  var API = '/api/geo';
  var FIELDS = {
    'edit-school': API + '/schools/suggest',
    'ob-school': API + '/schools/suggest',
    'edit-suburb': API + '/places/suggest?type=suburb',
    'ob-suburb': API + '/places/suggest?type=suburb',
    'edit-city': API + '/places/suggest?type=city',
    'ob-city': API + '/places/suggest?type=city'
  };
  var wired = [];
  var styleDone = false;

  function injectStyle() {
    if (styleDone) return;
    styleDone = true;
    var st = document.createElement('style');
    st.id = 'app-suggest-style';
    st.textContent =
      '#as-list{position:fixed;background:#fff;border:1px solid #e5e7eb;border-radius:10px;box-shadow:0 10px 28px rgba(0,0,0,.18);z-index:2147483000;display:none;max-height:240px;overflow-y:auto;min-width:220px}' +
      '#as-list.show{display:block}' +
      '#as-list .as-i{padding:9px 12px;font-size:14px;color:#17191c;cursor:pointer;line-height:1.3}' +
      '#as-list .as-i:hover,#as-list .as-i.hi{background:#fff8dc}' +
      '#as-list .as-i small{display:block;color:#9aa1a7;font-size:11.5px;margin-top:1px}' +
      '#as-list .as-note{padding:9px 12px;font-size:12.5px;color:#9aa1a7}';
    document.head.appendChild(st);
  }

  var listEl = null;
  var items = [];
  var hi = -1;
  var active = null; // { input, url }
  var timer = null;
  var lastQ = '';
  var reqSeq = 0;

  function hide() {
    if (listEl) listEl.classList.remove('show');
    items = [];
    hi = -1;
    active = null;
  }

  function place(input) {
    var r = input.getBoundingClientRect();
    listEl.style.left = Math.max(8, r.left) + 'px';
    listEl.style.top = (r.bottom + 4) + 'px';
    listEl.style.width = Math.max(220, r.width) + 'px';
  }

  function paint() {
    var nodes = listEl.querySelectorAll('.as-i');
    for (var i = 0; i < nodes.length; i++) {
      nodes[i].classList.toggle('hi', i === hi);
      if (i === hi && nodes[i].scrollIntoView) nodes[i].scrollIntoView({ block: 'nearest' });
    }
  }

  function clearList() {
    while (listEl.firstChild) listEl.removeChild(listEl.firstChild);
  }

  function note(text) {
    clearList();
    items = [];
    hi = -1;
    var n = document.createElement('div');
    n.className = 'as-note';
    n.textContent = text;
    listEl.appendChild(n);
    listEl.classList.add('show');
  }

  function pick(idx) {
    var it = items[idx];
    if (!it || !active) return;
    var input = active.input;
    clearTimeout(timer);
    input.value = it.name;
    hide();
    input.focus();
  }

  function render(results) {
    clearList();
    items = results;
    hi = -1;
    if (!results.length) {
      hide();
      return;
    }
    results.forEach(function (it, idx) {
      var row = document.createElement('div');
      row.className = 'as-i';
      row.textContent = it.name;
      if (it.detail) {
        var sub = document.createElement('small');
        sub.textContent = it.detail;
        row.appendChild(sub);
      }
      row.addEventListener('mousedown', function (e) {
        e.preventDefault();
        pick(idx);
      });
      listEl.appendChild(row);
    });
    listEl.classList.add('show');
  }

  function normalize(j, isSchool) {
    var sugs = Array.isArray(j && j.suggestions) ? j.suggestions : [];
    return sugs.map(function (s) {
      if (isSchool) {
        return { name: s.name, detail: [s.suburb, s.city, s.province].filter(Boolean).join(', ') };
      }
      return { name: s.name, detail: s.detail || (s.type ? s.type : '') };
    });
  }

  function search() {
    if (!active) return;
    var q = active.input.value.trim();
    var url = active.url;
    lastQ = q;
    var seq = ++reqSeq;
    note('Searching…');
    fetch(url + (url.indexOf('?') > -1 ? '&' : '?') + 'q=' + encodeURIComponent(q))
      .then(function (r) { return r.json(); })
      .then(function (j) {
        if (seq !== reqSeq || !active || active.url !== url || active.input.value.trim() !== lastQ) return;
        render(normalize(j, url.indexOf('/schools/suggest') > -1));
      })
      .catch(function () {
        if (seq !== reqSeq || !active) return;
        note('Search unavailable keep typing, or try again in a few seconds');
      });
  }

  function onType(input, url) {
    active = { input: input, url: url };
    clearTimeout(timer);
    var q = input.value.trim();
    if (q.length < 2) { hide(); return; }
    place(input);
    note('Searching…');
    timer = setTimeout(search, 300);
  }

  function attach(input) {
    if (!input || wired.indexOf(input) > -1) return;
    wired.push(input);
    var url = FIELDS[input.id];
    input.setAttribute('autocomplete', 'off');
    input.addEventListener('input', function () { onType(input, url); });
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { hide(); return; }
      var count = items.length;
      if (!count) return;
      if (e.key === 'ArrowDown') {
        hi = (hi + 1) % count;
        paint();
        e.preventDefault();
        e.stopPropagation();
      } else if (e.key === 'ArrowUp') {
        hi = (hi - 1 + count) % count;
        paint();
        e.preventDefault();
        e.stopPropagation();
      } else if (e.key === 'Enter' && hi >= 0) {
        pick(hi);
        e.preventDefault();
        e.stopPropagation();
      }
    }, true);
    input.addEventListener('blur', function () { setTimeout(hide, 150); });
    input.addEventListener('focus', function () {
      active = { input: input, url: url };
    });
  }

  function scan() {
    Object.keys(FIELDS).forEach(function (id) {
      var nodes = document.querySelectorAll('[id="' + id + '"]');
      for (var i = 0; i < nodes.length; i++) attach(nodes[i]);
    });
  }

  function init() {
    injectStyle();
    listEl = document.createElement('div');
    listEl.id = 'as-list';
    document.body.appendChild(listEl);
    scan();
    // Auto-wire fields that appear later (forms rendered after login, etc.)
    document.addEventListener('focusin', function (e) {
      var t = e.target;
      if (t && t.id && FIELDS[t.id]) attach(t);
    });
    window.addEventListener('scroll', function () { if (listEl.classList.contains('show')) hide(); }, true);
    // Rescan a few times to catch late-rendered fields
    var n = 0;
    var iv = setInterval(function () { scan(); if (++n >= 20) clearInterval(iv); }, 1000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
