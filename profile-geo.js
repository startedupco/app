// Profile location autocomplete for app.collanduni.co.za (#profile)
// Enhances #edit-province / #edit-city / #edit-suburb / #edit-school with live
// API data. Province select keeps its options; city/suburb/school get
// searchable datalists filtered by the selected province/city/suburb.
(function () {
  'use strict';
  var API = '';

  function get(path, params) {
    params = params || {};
    var qs = Object.keys(params)
      .filter(function (k) { return params[k] !== '' && params[k] != null; })
      .map(function (k) { return encodeURIComponent(k) + '=' + encodeURIComponent(params[k]); })
      .join('&');
    return fetch(API + path + '?' + qs).then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    });
  }

  function datalistFor(input) {
    var id = input.getAttribute('list');
    var dl = id && document.getElementById(id);
    if (!dl) {
      dl = document.createElement('datalist');
      dl.id = (input.id || 'geo') + '-list';
      input.setAttribute('list', dl.id);
      input.parentNode.appendChild(dl);
    }
    return dl;
  }

  function setOptions(dl, items) {
    dl.innerHTML = items.slice(0, 50).map(function (t) {
      return '<option value="' + String(t).replace(/"/g, '&quot;') + '">';
    }).join('');
  }

  function debounce(fn, ms) {
    var t;
    return function () {
      var a = arguments, s = this;
      clearTimeout(t);
      t = setTimeout(function () { fn.apply(s, a); }, ms || 250);
    };
  }

  function boot() {
    var prov = document.getElementById('edit-province');
    var city = document.getElementById('edit-city');
    var suburb = document.getElementById('edit-suburb');
    var school = document.getElementById('edit-school');
    if (!prov && !city && !suburb && !school) return;
    var ph = {};
    [city, suburb, school].forEach(function (el) {
      if (el) { ph[el.id] = el.placeholder; el.placeholder = 'Loading locations…'; }
    });
    var restore = function () {
      [city, suburb, school].forEach(function (el) {
        if (el && el.placeholder === 'Loading locations…') el.placeholder = ph[el.id] || '';
      });
    };

    if (city) {
      var cityDl = datalistFor(city);
      var loadCities = function () {
        get('/api/geo/cities', { province: prov ? prov.value : '', limit: 5000 })
          .then(function (d) { setOptions(cityDl, d.cities || []); restore(); })
          .catch(function (e) { console.warn('[profile-geo] cities:', e.message); restore(); });
      };
      if (prov) prov.addEventListener('change', function () {
        city.value = '';
        if (suburb) suburb.value = '';
        loadCities();
      });
      loadCities();
    }

    if (suburb) {
      var subDl = datalistFor(suburb);
      var loadSuburbs = function () {
        get('/api/geo/suburbs', {
          province: prov ? prov.value : '', city: city ? city.value : '', limit: 5000,
        }).then(function (d) { setOptions(subDl, d.suburbs || []); })
          .catch(function (e) { console.warn('[profile-geo] suburbs:', e.message); });
      };
      if (city) city.addEventListener('change', function () { suburb.value = ''; loadSuburbs(); });
      if (prov) prov.addEventListener('change', loadSuburbs);
    }

    if (school) {
      var sDl = datalistFor(school);
      school.setAttribute('autocomplete', 'off');
      school.addEventListener('input', debounce(function () {
        var q = school.value.trim();
        if (q.length < 2) { sDl.innerHTML = ''; return; }
        get('/api/geo/schools', {
          q: q,
          province: prov ? prov.value : '',
          city: city ? city.value : '',
          suburb: suburb ? suburb.value : '',
          limit: 20,
        }).then(function (d) {
          sDl.innerHTML = (d.results || []).map(function (s) {
            var loc = [s.suburb, s.city, s.province].filter(Boolean).join(' · ');
            return '<option value="' + s.name.replace(/"/g, '&quot;') + '">' + loc + '</option>';
          }).join('');
        }).catch(function (e) { console.warn('[profile-geo] schools:', e.message); });
      }, 250));
    }
    document.dispatchEvent(new CustomEvent('profile-geo-ready'));
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
