/* CollandUni offline indicator.
   Shows a full-screen wifi loader (Uiverse.io by mobinkakei, recolored to the
   app tokens) whenever the browser reports no network. Self-contained: injects
   its own styles + markup, so pages only need <script src="offline-loader.js" defer>.
   The overlay lives on <html> (not <body>) so it survives pages that rebuild
   document.body (e.g. the portal's auth-failure fallback). */
(function () {
    'use strict';
    if (document.getElementById('cuOfflineOverlay')) return;

    var css = '' +
        '.cu-offline-overlay{position:fixed;inset:0;z-index:2147483647;display:none;align-items:center;justify-content:center;flex-direction:column;background:rgba(255,255,255,.95);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);padding:24px;text-align:center;font-family:Poppins,-apple-system,"Segoe UI",Roboto,sans-serif}' +
        '.cu-offline-overlay.show{display:flex}' +
        'html.dark .cu-offline-overlay{background:rgba(14,16,19,.95)}' +
        '.cu-offline-box{display:flex;flex-direction:column;align-items:center;max-width:340px}' +
        '.cu-offline-msg{margin:0;color:#5b6470;font-size:.9375rem;line-height:1.5}' +
        'html.dark .cu-offline-msg{color:#9aa1ab}' +
        '.cu-offline-retry{margin-top:22px;background:#ffd60a;color:#111418;border:0;border-radius:14px;padding:12px 26px;font-weight:700;font-size:17px;font-family:inherit;cursor:pointer;box-shadow:0 4px 0 #e6b800;min-height:48px}' +
        '.cu-offline-retry:active{transform:translateY(3px);box-shadow:none}' +
        '.cu-offline-retry:disabled{opacity:.6;cursor:wait}' +
        /* From Uiverse.io by mobinkakei — colors mapped to CollandUni tokens */
        '#wifi-loader{--background:#ffd60a;--front-color:#ffd60a;--back-color:#e6e8ec;--text-color:#111418;--sweep-color:#e6b800;width:64px;height:64px;border-radius:50px;position:relative;display:flex;justify-content:center;align-items:center;margin:0 auto 56px}' +
        'html.dark #wifi-loader{--back-color:#262b33;--text-color:#e8eaed;--sweep-color:#ffd60a}' +
        '#wifi-loader svg{position:absolute;display:flex;justify-content:center;align-items:center}' +
        '#wifi-loader svg circle{position:absolute;fill:none;stroke-width:6px;stroke-linecap:round;stroke-linejoin:round;transform:rotate(-100deg);transform-origin:center}' +
        '#wifi-loader svg circle.back{stroke:var(--back-color)}' +
        '#wifi-loader svg circle.front{stroke:var(--front-color)}' +
        '#wifi-loader svg.circle-outer{height:86px;width:86px}' +
        '#wifi-loader svg.circle-outer circle{stroke-dasharray:62.75 188.25}' +
        '#wifi-loader svg.circle-outer circle.back{animation:circle-outer135 1.8s ease infinite .3s}' +
        '#wifi-loader svg.circle-outer circle.front{animation:circle-outer135 1.8s ease infinite .15s}' +
        '#wifi-loader svg.circle-middle{height:60px;width:60px}' +
        '#wifi-loader svg.circle-middle circle{stroke-dasharray:42.5 127.5}' +
        '#wifi-loader svg.circle-middle circle.back{animation:circle-middle6123 1.8s ease infinite .25s}' +
        '#wifi-loader svg.circle-middle circle.front{animation:circle-middle6123 1.8s ease infinite .1s}' +
        '#wifi-loader svg.circle-inner{height:34px;width:34px}' +
        '#wifi-loader svg.circle-inner circle{stroke-dasharray:22 66}' +
        '#wifi-loader svg.circle-inner circle.back{animation:circle-inner162 1.8s ease infinite .2s}' +
        '#wifi-loader svg.circle-inner circle.front{animation:circle-inner162 1.8s ease infinite .05s}' +
        '#wifi-loader .text{position:absolute;bottom:-40px;display:flex;justify-content:center;align-items:center;text-transform:lowercase;font-weight:500;font-size:14px;letter-spacing:.2px}' +
        '#wifi-loader .text::before,#wifi-loader .text::after{content:attr(data-text)}' +
        '#wifi-loader .text::before{color:var(--text-color)}' +
        '#wifi-loader .text::after{color:var(--sweep-color);animation:text-animation76 3.6s ease infinite;position:absolute;left:0}' +
        '@keyframes circle-outer135{0%{stroke-dashoffset:25}25%{stroke-dashoffset:0}65%{stroke-dashoffset:301}80%{stroke-dashoffset:276}100%{stroke-dashoffset:276}}' +
        '@keyframes circle-middle6123{0%{stroke-dashoffset:17}25%{stroke-dashoffset:0}65%{stroke-dashoffset:204}80%{stroke-dashoffset:187}100%{stroke-dashoffset:187}}' +
        '@keyframes circle-inner162{0%{stroke-dashoffset:9}25%{stroke-dashoffset:0}65%{stroke-dashoffset:106}80%{stroke-dashoffset:97}100%{stroke-dashoffset:97}}' +
        '@keyframes text-animation76{0%{clip-path:inset(0 100% 0 0)}50%{clip-path:inset(0)}100%{clip-path:inset(0 0 0 100%)}}';

    var markup = '' +
        '<div class="cu-offline-overlay" id="cuOfflineOverlay" role="alert" aria-live="assertive">' +
        '<div class="cu-offline-box">' +
        '<div id="wifi-loader" aria-hidden="true">' +
        '<svg class="circle-outer" viewBox="0 0 86 86"><circle class="back" cx="43" cy="43" r="40"></circle><circle class="front" cx="43" cy="43" r="40"></circle></svg>' +
        '<svg class="circle-middle" viewBox="0 0 60 60"><circle class="back" cx="30" cy="30" r="27"></circle><circle class="front" cx="30" cy="30" r="27"></circle></svg>' +
        '<svg class="circle-inner" viewBox="0 0 34 34"><circle class="back" cx="17" cy="17" r="14"></circle><circle class="front" cx="17" cy="17" r="14"></circle></svg>' +
        '<div class="text" data-text="offline"></div>' +
        '</div>' +
        '<p class="cu-offline-msg">You&rsquo;re offline. Check your connection &mdash; this clears automatically once you&rsquo;re back online.</p>' +
        '<button type="button" class="cu-offline-retry" id="cuOfflineRetry">Try again</button>' +
        '</div>' +
        '</div>';

    function inject() {
        var style = document.createElement('style');
        style.id = 'cuOfflineStyle';
        style.textContent = css;
        document.head.appendChild(style);

        var host = document.createElement('div');
        host.innerHTML = markup;
        // Append to <html> so a later document.body rebuild cannot remove it.
        document.documentElement.appendChild(host.firstChild);
    }

    function ready(fn) {
        if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
        else fn();
    }

    ready(function () {
        inject();
        var overlay = document.getElementById('cuOfflineOverlay');
        var retry = document.getElementById('cuOfflineRetry');

        function update() {
            overlay.classList.toggle('show', navigator.onLine === false);
        }

        window.addEventListener('online', update);
        window.addEventListener('offline', update);
        update();

        retry.addEventListener('click', function () {
            retry.disabled = true;
            retry.textContent = 'Checking\u2026';
            fetch(location.pathname + '?_cu_probe=' + Date.now(), { method: 'HEAD', cache: 'no-store' })
                .then(function (r) { return r.ok; })
                .catch(function () { return false; })
                .then(function (ok) {
                    retry.disabled = false;
                    retry.textContent = 'Try again';
                    if (ok) overlay.classList.remove('show');
                    else update();
                });
        });
    });
})();