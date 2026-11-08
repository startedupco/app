// SA ID number validation for CollandUni app fields.
// Same rules as the ID API: 13 digits, Luhn checksum, real date of birth, citizenship digit.

(function () {
  'use strict';

  var FIELDS = ['edit-nok-idNumber', 'ob-id'];
  var wired = [];

  function injectStyle() {
    if (document.getElementById('id-validate-style')) return;
    var st = document.createElement('style');
    st.id = 'id-validate-style';
    st.textContent =
      '.idv-msg{font-size:12px;margin-top:4px;line-height:1.3}' +
      '.idv-msg.neutral{color:#9aa1a7}' +
      '.idv-msg.ok{color:#16a34a}' +
      '.idv-msg.err{color:#dc2626}' +
      '.idv-in-ok{box-shadow:0 0 0 2px rgba(34,197,94,.45)!important}' +
      '.idv-in-err{box-shadow:0 0 0 2px rgba(239,68,68,.55)!important}';
    document.head.appendChild(st);
  }

  function luhnOk(digits) {
    var total = 0;
    for (var i = 0; i < digits.length; i++) {
      var d = parseInt(digits.charAt(digits.length - 1 - i), 10);
      if (i % 2 === 1) {
        d *= 2;
        if (d > 9) d -= 9;
      }
      total += d;
    }
    return total % 10 === 0;
  }

  function validate(id) {
    if (!/^\d{13}$/.test(id)) return { ok: false, msg: 'SA ID must be 13 digits' };
    if (!luhnOk(id)) return { ok: false, msg: 'Invalid ID number (checksum failed)' };
    var yy = parseInt(id.substring(0, 2), 10);
    var mm = parseInt(id.substring(2, 4), 10);
    var dd = parseInt(id.substring(4, 6), 10);
    var now = new Date();
    var year = yy <= (now.getFullYear() % 100) ? 2000 + yy : 1900 + yy;
    var date = new Date(year, mm - 1, dd);
    if (date.getFullYear() !== year || date.getMonth() !== mm - 1 || date.getDate() !== dd) {
      return { ok: false, msg: 'Invalid date of birth in ID' };
    }
    if (date > now) return { ok: false, msg: 'Date of birth is in the future' };
    if ((now - date) / (365.25 * 24 * 3600 * 1000) > 120) {
      return { ok: false, msg: 'Date of birth is over 120 years ago' };
    }
    var citizen = id.charAt(10);
    if (citizen !== '0' && citizen !== '1') {
      return { ok: false, msg: 'Invalid citizenship digit' };
    }
    var gender = parseInt(id.charAt(6), 10) < 5 ? 'Female' : 'Male';
    return { ok: true, msg: 'Valid ID born ' + year + '-' + ('0' + mm).slice(-2) + '-' + ('0' + dd).slice(-2) + ', ' + gender };
  }

  function attach(input) {
    if (!input || wired.indexOf(input) > -1) return;
    wired.push(input);

    var msg = document.createElement('p');
    msg.className = 'idv-msg neutral';
    msg.style.display = 'none';
    input.insertAdjacentElement('afterend', msg);

    function refresh() {
      var id = input.value.replace(/[^0-9]/g, '').slice(0, 13);
      if (input.value !== id) input.value = id;
      input.classList.remove('idv-in-ok', 'idv-in-err');
      if (!id) {
        msg.style.display = 'none';
        return;
      }
      msg.style.display = 'block';
      if (id.length < 13) {
        msg.className = 'idv-msg neutral';
        msg.textContent = id.length + '/13 digits';
        return;
      }
      var r = validate(id);
      msg.className = 'idv-msg ' + (r.ok ? 'ok' : 'err');
      msg.textContent = r.msg;
      input.classList.add(r.ok ? 'idv-in-ok' : 'idv-in-err');
    }

    input.addEventListener('input', refresh);
    input.addEventListener('blur', refresh);
  }

  function scan() {
    FIELDS.forEach(function (id) {
      var nodes = document.querySelectorAll('[id="' + id + '"]');
      for (var i = 0; i < nodes.length; i++) attach(nodes[i]);
    });
  }

  function init() {
    injectStyle();
    scan();
    document.addEventListener('focusin', function (e) {
      var t = e.target;
      if (t && t.id && FIELDS.indexOf(t.id) > -1) attach(t);
    });
    var n = 0;
    var iv = setInterval(function () { scan(); if (++n >= 20) clearInterval(iv); }, 1000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
