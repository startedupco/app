// Site reference data for app.collanduni.co.za - grades, languages, subjects.
// Merges API lists into existing filter dropdowns without removing anything,
// so built-in filtering keeps working exactly as before.
(function () {
  'use strict';
  var API = '';

  function get(path) {
    return fetch(API + path + '?limit=5000')
      .then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      });
  }

  // Add options that aren't already there. Never removes or reorders.
  function mergeOptions(sel, items) {
    if (!sel) return 0;
    var have = {};
    Array.prototype.forEach.call(sel.options, function (o) { have[o.value] = true; });
    var added = 0;
    items.forEach(function (t) {
      if (!t || have[t]) return;
      var o = document.createElement('option');
      o.value = t; o.textContent = t;
      sel.appendChild(o);
      added++;
    });
    return added;
  }

  function names(list) {
    return (list || []).map(function (x) {
      return typeof x === 'string' ? x : x.name || x.grade || '';
    }).filter(Boolean);
  }

  function boot() {
    // Past papers subject filter: extend with the full subject list.
    var ppSubject = document.getElementById('pp-subject');
    if (ppSubject) {
      get('/api/data/subjects').then(function (d) {
        mergeOptions(ppSubject, names(d.subjects));
      }).catch(function (e) { console.warn('[site-data] subjects:', e.message); });
    }
    // Any select stamped data-data="subjects|languages|grades" gets filled.
    Array.prototype.forEach.call(document.querySelectorAll('select[data-data]'), function (sel) {
      var kind = sel.getAttribute('data-data');
      get('/api/data/' + kind).then(function (d) {
        mergeOptions(sel, names(d[kind]));
      }).catch(function (e) { console.warn('[site-data] ' + kind + ':', e.message); });
    });
    document.dispatchEvent(new CustomEvent('site-data-ready'));
  }

  window.SiteData = { boot: boot, mergeOptions: mergeOptions };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
