(function() {
  'use strict';

  var GITHUB_BASE = '/api/prospectus';
  var TVET_COURSES_URL = GITHUB_BASE + '/tvet-courses.json';

  window.GO_TVET_COURSES = {};
  window.ALL_TVET_COLLEGES = [];

  function loadJSON(url) {
    if (window.cuCachedJSON) {
      return window.cuCachedJSON(url, { key: 'tvet_' + url.split('/').pop(), ttl: 86400000 });
    }
    return fetch(url).then(function(r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    });
  }

  function applyData(data) {
    if (!data || typeof data !== 'object') { data = {}; }
    window.GO_TVET_COURSES = data;
    window.ALL_TVET_COLLEGES = Object.keys(data);
    Object.keys(data).forEach(function(college) {
      console.log('[GoTVET] ' + college + ' courses loaded:', data[college].length);
    });
    document.dispatchEvent(new CustomEvent('go-tvet-courses-loaded', { detail: data }));
  }

  function loadTVET() {
    loadJSON('tvet-courses.json')
      .then(function(data) {
        console.log('[GoTVET] Loaded TVET courses from local file');
        applyData(data);
      })
      .catch(function(e) {
        console.warn('[GoTVET] Local TVET fetch failed, trying GitHub:', e.message);
        loadJSON(TVET_COURSES_URL)
          .then(function(data) {
            console.log('[GoTVET] Loaded TVET courses from GitHub');
            applyData(data);
          })
          .catch(function(err) {
            console.error('[GoTVET] All TVET fetches failed - TVET courses unavailable:', err.message);
            applyData({});
            document.dispatchEvent(new CustomEvent('go-tvet-courses-load-failed', { detail: err.message }));
          });
      });
  }
  loadTVET();
})();
