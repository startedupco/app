(function() {
  'use strict';

  var GITHUB_BASE = '/api/prospectus';
  var cache = {};
  var ready = false;
  var queue = [];

  var PROSPECTUS_MAP = {
    'CPUT': 'cput-prospectus.json',
    'NWU': 'nwu-prospectus.json',
    'UFH': 'ufh-prospectus.json',
    'UFS': 'ufs-prospectus.json',
    'UCT': 'uct-prospectus.json',
    'RU': 'rhodes-prospectus.json',
    'SU': 'stellenbosch-prospectus.json',
    'TUT': 'tut-prospectus.json',
    'UP': 'up-prospectus.json'
  };

  function loadJSON(url) {
    if (cache[url]) return Promise.resolve(cache[url]);
    return fetch(url).then(function(r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.text();
    }).then(function(text) {
      try { return JSON.parse(text); } catch(e) {
        var idx = text.indexOf('}\n{');
        if (idx > 0) { text = text.substring(0, idx + 1); return JSON.parse(text); }
        idx = text.indexOf('}\r\n{');
        if (idx > 0) { text = text.substring(0, idx + 1); return JSON.parse(text); }
        throw e;
      }
    }).then(function(d) {
      cache[url] = d;
      return d;
    });
  }

  var POPULATE_MAP = {
    'name': ['province']
  };

  function populateSelects(data, valueKey, labelKey) {
    var selectors = POPULATE_MAP[valueKey] || [valueKey];
    var selectorStr = selectors.map(function(s) { return '[data-populate="' + s + '"]'; }).join(',');
    var selects = document.querySelectorAll(selectorStr);
    selects.forEach(function(sel) {
      var current = sel.value;
      var hasAll = sel.querySelector('option[value="all"]');
      sel.innerHTML = hasAll ? '<option value="all">All Provinces</option>' : '<option value="">Select...</option>';
      data.forEach(function(item) {
        var val = typeof item === 'string' ? item : item[valueKey || 'name'];
        var lbl = typeof item === 'string' ? item : item[labelKey || 'name'];
        var opt = document.createElement('option');
        opt.value = val;
        opt.textContent = lbl;
        sel.appendChild(opt);
      });
      if (current && sel.querySelector('option[value="' + current + '"]')) {
        sel.value = current;
      }
    });
  }

  function loadProspectus(code) {
    var file = PROSPECTUS_MAP[code];
    if (!file) return Promise.resolve(null);
    return loadJSON(GITHUB_BASE + '/' + file).then(function(data) {
      if (!window.DataNormalizer) return null;
      var normalized = window.DataNormalizer.normalizeProspectusArray(data);
      return { code: code, courses: normalized };
    }).catch(function(err) {
      console.warn('[GoData] Failed to load prospectus for ' + code + ':', err.message);
      return null;
    });
  }

  function mergeProspectusIntoDB(prospectusResults) {
    if (!window.UNIVERSITY_DB) return;
    var db = window.UNIVERSITY_DB;
    var merged = {};

    prospectusResults.forEach(function(result) {
      if (!result || !result.courses || !result.courses.length) return;
      var code = result.code;
      var uni = db[code];
      if (!uni) return;

      var githubCourses = {};
      result.courses.forEach(function(c) {
        githubCourses[c.name] = c;
      });

      var updated = 0;
      var added = 0;
      if (uni.faculties) {
        Object.keys(uni.faculties).forEach(function(facName) {
          var courses = uni.faculties[facName];
          if (!Array.isArray(courses)) return;
          courses.forEach(function(localCourse, idx) {
            var match = githubCourses[localCourse.name];
            if (match) {
              var enriched = {};
              for (var k in localCourse) enriched[k] = localCourse[k];
              enriched._github_aps = match.aps;
              enriched._github_notes = match._notes;
              enriched._github_code = match._code;
              enriched._github_duration = match._duration;
              enriched._github_selection = match._selection;
              if (match.math_level > 0 && !localCourse.math_level) enriched.math_level = match.math_level;
              if (match.phys_level > 0 && !localCourse.phys_level) enriched.phys_level = match.phys_level;
              if (match.eng_level > 0 && !localCourse.eng_level) enriched.eng_level = match.eng_level;
              if (match.life_sciences_level > 0 && !localCourse.life_sciences_level) enriched.life_sciences_level = match.life_sciences_level;
              if (match.math_lit_level > 0 && !localCourse.math_lit_level) enriched.math_lit_level = match.math_lit_level;
              courses[idx] = enriched;
              updated++;
            }
          });
        });
      }

      var allLocalNames = {};
      if (uni.faculties) {
        Object.keys(uni.faculties).forEach(function(facName) {
          (uni.faculties[facName] || []).forEach(function(c) { allLocalNames[c.name] = true; });
        });
      }

      result.courses.forEach(function(c) {
        if (!allLocalNames[c.name]) {
          if (!uni.faculties) uni.faculties = {};
          var fac = c._faculty || 'Other Programmes';
          if (!uni.faculties[fac]) uni.faculties[fac] = [];
          uni.faculties[fac].push(c);
          added++;
        }
      });

      merged[code] = { updated: updated, added: added, total: result.courses.length };
    });

    window.GITHUB_MERGE_LOG = merged;
    return merged;
  }

  window.GoData = {
    GITHUB_BASE: GITHUB_BASE,
    PROSPECTUS_MAP: PROSPECTUS_MAP,

    loadProvinces: function() {
      return loadJSON(GITHUB_BASE + '/all-provinces.json').then(function(d) {
        window.ALL_PROVINCES = d.provinces;
        populateSelects(d.provinces, 'name', 'name');
        return d;
      });
    },

    loadTVETColleges: function() {
      return loadJSON(GITHUB_BASE + '/all-tvet-colleges.json').then(function(d) {
        var allowed = ['Waterberg TVET College', 'Boland TVET College', 'Mopani TVET College'];
        var arr = [];
        Object.keys(d).forEach(function(key) {
          var c = d[key];
          if (c && c.name && allowed.indexOf(c.name) !== -1) arr.push(c);
        });
        window.ALL_TVET_COLLEGES = arr;
        return arr;
      });
    },

    loadSubjects: function() {
      return loadJSON(GITHUB_BASE + '/all-subjects.json').then(function(d) {
        window.ALL_SUBJECTS = d;
        var flat = [];
        (d.categories || []).forEach(function(cat) {
          if (cat.name.indexOf('NCV - ') === 0) return;
          (cat.subjects || []).forEach(function(s) { flat.push(s.name); });
        });
        window.ALL_SUBJECT_NAMES = flat;
        return d;
      });
    },

    loadAll: function() {
      if (ready) return Promise.resolve();

      var codes = Object.keys(PROSPECTUS_MAP);
      var promises = codes.map(function(code) { return loadProspectus(code); });

      return Promise.all(promises).then(function(results) {
        var mergeLog = mergeProspectusIntoDB(results);

        window.GITHUB_PROSPECTUS = {};
        results.forEach(function(r) {
          if (r && r.courses) window.GITHUB_PROSPECTUS[r.code] = r.courses;
        });

        ready = true;
        queue.forEach(function(fn) { fn(); });
        queue = [];
        document.dispatchEvent(new CustomEvent('godata-ready'));

        var summary = [];
        for (var code in mergeLog) {
          summary.push(code + ':' + mergeLog[code].updated + 'updated/' + mergeLog[code].added + 'added');
        }
        console.log('[GoData] GitHub prospectus merged: ' + summary.join(', '));
      }).catch(function(err) {
        console.warn('[GoData] GitHub loading failed, using local data only:', err);
        window.GITHUB_PROSPECTUS = {};
        ready = true;
        queue.forEach(function(fn) { fn(); });
        queue = [];
        document.dispatchEvent(new CustomEvent('godata-ready'));
      });
    },

    onReady: function(fn) {
      if (ready) { fn(); return; }
      queue.push(fn);
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() { window.GoData.loadAll(); });
  } else {
    window.GoData.loadAll();
  }
})();
