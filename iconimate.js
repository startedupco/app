/* ============================================================
   Iconimate for Collanduni - vanilla JS port of animated icons
   from https://iconimate.app (MIT, glyphs: Phosphor Icons MIT).
   Hover/focus plays the animation; leave/blur snaps back.
   Usage: <span data-icon="bell-ringing" data-size="20"></span>
          Iconimate.init();            // scan document
          Iconimate.play(el);          // trigger programmatically
   ============================================================ */
(function (global) {
  'use strict';

  var RETURN = 'cubic-bezier(.4,0,.2,1)';
  var ARRIVE = 'cubic-bezier(.16,1,.3,1)';
  var SWEEP = 'cubic-bezier(.65,0,.35,1)';
  var STROKE = { fill: 'none', stroke: 'currentColor', 'stroke-width': 16, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' };
  var NS = 'http://www.w3.org/2000/svg';
  var uid = 0;

  function el(tag, attrs) {
    var n = document.createElementNS(NS, tag);
    if (attrs) for (var k in attrs) n.setAttribute(k, attrs[k]);
    return n;
  }
  function pivot(node, x, y) {
    node.style.transformBox = 'view-box';
    node.style.transformOrigin = x + 'px ' + y + 'px';
    return node;
  }
  function rectPath(x, y, w, h) { return 'M' + x + ',' + y + 'H' + (x + w) + 'V' + (y + h) + 'H' + x + 'Z'; }

  /* ---------- glyph definitions ---------- */
  var DEFS = {

    alarm: {
      paint: 'fill',
      build: function (svg) {
        var p = el('path', { d: 'M128,40a96,96,0,1,0,96,96A96.11,96.11,0,0,0,128,40Zm0,176a80,80,0,1,1,80-80A80.09,80.09,0,0,1,128,216ZM61.66,37.66l-32,32A8,8,0,0,1,18.34,58.34l32-32A8,8,0,0,1,61.66,37.66Zm176,32a8,8,0,0,1-11.32,0l-32-32a8,8,0,0,1,11.32-11.32l32,32A8,8,0,0,1,237.66,69.66ZM184,128a8,8,0,0,1,0,16H128a8,8,0,0,1-8-8V80a8,8,0,0,1,16,0v48Z' });
        pivot(p, 128, 136);
        svg.appendChild(p);
        return {
          start: function () {
            var anim;
            function ring() {
              anim = p.animate(
                [{ transform: 'rotate(0deg)' }, { transform: 'rotate(4deg)' }, { transform: 'rotate(-12deg)' }, { transform: 'rotate(12deg)' }, { transform: 'rotate(-9deg)' }, { transform: 'rotate(9deg)' }, { transform: 'rotate(-5deg)' }, { transform: 'rotate(5deg)' }, { transform: 'rotate(0deg)' }],
                { duration: 720, easing: 'ease-in-out' });
              return anim.finished;
            }
            function loop() {
              if (!svg._hovered) return;
              ring().then(function () {
                if (svg._hovered) setTimeout(loop, 450);
              }).catch(function () {});
            }
            loop();
          },
          stop: function () { p.getAnimations().forEach(function (a) { a.cancel(); }); }
        };
      }
    },

    'arrow-right': {
      overflow: 'hidden',
      paint: 'fill',
      build: function (svg) {
        var p = el('path', { d: 'M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z' });
        svg.appendChild(p);
        return {
          start: function () {
            return p.animate([
              { transform: 'translateX(0)', easing: 'ease-in', offset: 0 },
              { transform: 'translateX(224px)', offset: 0.34 },
              { transform: 'translateX(-228px)', easing: ARRIVE, offset: 0.3401 },
              { transform: 'translateX(0)', offset: 1 }
            ], { duration: 750 }).finished;
          },
          stop: function () { p.getAnimations().forEach(function (a) { a.cancel(); }); }
        };
      }
    },

    bank: {
      paint: 'fill',
      build: function (svg) {
        var BANK = 'M24,104H48v64H32a8,8,0,0,0,0,16H224a8,8,0,0,0,0-16H208V104h24a8,8,0,0,0,4.19-14.81l-104-64a8,8,0,0,0-8.38,0l-104,64A8,8,0,0,0,24,104Zm40,0H96v64H64Zm80,0v64H112V104Zm48,64H160V104h32ZM128,41.39,203.74,88H52.26ZM248,208a8,8,0,0,1-8,8H16a8,8,0,0,1,0-16H240A8,8,0,0,1,248,208Z';
        var g = pivot(el('g'), 128, 216);
        g.appendChild(el('path', { d: BANK }));
        svg.appendChild(g);
        return {
          start: function () {
            return g.animate([
              { opacity: 0, transform: 'translateY(16px)' },
              { opacity: 1, transform: 'translateY(0)' }
            ], { duration: 450, easing: ARRIVE }).finished.catch(function () {});
          },
          stop: function () { g.getAnimations().forEach(function (a) { a.cancel(); }); }
        };
      }
    },

    'bell-ringing': {
      paint: 'fill',
      build: function (svg) {
        var BELL = 'M224,71.1a8,8,0,0,1-10.78-3.42,94.13,94.13,0,0,0-33.46-36.91,8,8,0,1,1,8.54-13.54,111.46,111.46,0,0,1,39.12,43.09A8,8,0,0,1,224,71.1ZM35.71,72a8,8,0,0,0,7.1-4.32A94.13,94.13,0,0,1,76.27,30.77a8,8,0,1,0-8.54-13.54A111.46,111.46,0,0,0,28.61,60.32,8,8,0,0,0,35.71,72Zm186.1,103.94A16,16,0,0,1,208,200H167.2a40,40,0,0,1-78.4,0H48a16,16,0,0,1-13.79-24.06C43.22,160.39,48,138.28,48,112a80,80,0,0,1,160,0C208,138.27,212.78,160.38,221.81,175.94ZM150.62,200H105.38a24,24,0,0,0,45.24,0ZM208,184c-10.64-18.27-16-42.49-16-72a64,64,0,0,0-128,0c0,29.52-5.38,53.74-16,72Z';
        var bellG = pivot(el('g'), 128, 40);
        bellG.appendChild(el('path', { d: BELL }));
        svg.appendChild(bellG);
        return {
          start: function () {
            var T = [0, 0.2, 0.44, 0.64, 0.8, 0.92, 1];
            var R = [0, -11, 12, -9.5, 7.4, -2.5, 0];
            return bellG.animate(R.map(function (r, i) {
              return { transform: 'rotate(' + r + 'deg)', offset: T[i], easing: i < T.length - 1 ? 'ease-in-out' : undefined };
            }), { duration: 850 }).finished.catch(function () {});
          },
          stop: function () { bellG.getAnimations().forEach(function (a) { a.cancel(); }); }
        };
      }
    },

    envelope: {
      paint: 'stroke',
      build: function (svg) {
        if (!supportsDMorph()) {
          staticStroke(svg, [
            'M224,56L128,144L32,56',
            'M32,56H224a0,0,0,0,1,0,0V192a8,8,0,0,1-8,8H40a8,8,0,0,1-8-8V56A0,0,0,0,1,32,56Z',
            'M110.55,128L34.47,197.74', 'M221.53,197.74L145.45,128'
          ]);
          return noop();
        }
        var FLAP_REST = 'M224,56L128,144L32,56', FLAP_OPEN = 'M224,56L128,12L32,56';
        var BODY = 'M32,56H224a0,0,0,0,1,0,0V192a8,8,0,0,1-8,8H40a8,8,0,0,1-8-8V56A0,0,0,0,1,32,56Z';
        var CL = 'M110.55,128L34.47,197.74', CR = 'M221.53,197.74L145.45,128';
        var CLW = 'M128,112L34.47,197.74', CRW = 'M221.53,197.74L128,112';
        var CLO = 'M128,240.6L34.47,197.74', CRO = 'M221.53,197.74L128,240.6';
        function sp(d) { var n = el('path', { d: d }); for (var k in STROKE) n.setAttribute(k, STROKE[k]); return n; }
        var flap = sp(FLAP_REST), body = sp(BODY), l = sp(CL), r = sp(CR);
        svg.appendChild(body); svg.appendChild(flap); svg.appendChild(l); svg.appendChild(r);
        var CT = [0, 0.08, 0.38, 0.56, 0.72, 0.9, 1];
        function dmorph(node, frames, times) {
          return node.animate(frames.map(function (d, i) {
            var k = { d: 'path("' + d + '")', offset: times[i] }; if (i < times.length - 1) k.easing = ARRIVE;
            return k;
          }), { duration: 1800 }).finished;
        }
        return {
          start: function () {
            return Promise.all([
              dmorph(flap, [FLAP_REST, FLAP_OPEN, FLAP_OPEN, FLAP_REST], [0, 0.24, 0.78, 1]),
              dmorph(l, [CL, CLW, CLO, CLO, CLW, CL, CL], CT),
              dmorph(r, [CR, CRW, CRO, CRO, CRW, CR, CR], CT)
            ]).catch(function () {});
          },
          stop: function () { [flap, l, r].forEach(function (n) { n.getAnimations().forEach(function (a) { a.cancel(); }); }); }
        };
      }
    },

    house: {
      paint: 'stroke',
      build: function (svg) {
        var ROOF = 'M216,120a8,8,0,0,0-2.34-5.66l-80-80a8,8,0,0,0-11.32,0l-80,80A8,8,0,0,0,40,120';
        var ROOF_PEAK = 'M216,120a8,8,0,0,0-2.34-5.66l-80-100a8,8,0,0,0-11.32,0l-80,100A8,8,0,0,0,40,120';
        function sp(d) { var n = el('path', { d: d }); for (var k in STROKE) n.setAttribute(k, STROKE[k]); return n; }
        if (!supportsDMorph()) {
          staticStroke(svg, ['M104,216V152h48v64h64V120a8,8,0,0,0-2.34-5.66l-80-80a8,8,0,0,0-11.32,0l-80,80A8,8,0,0,0,40,120v96Z']);
          return noop();
        }
        var walls = sp('M104,216h-64V120M152,216h64V120');
        var door = pivot(sp('M104,216V152h48v64'), 104, 216);
        var roof = sp(ROOF);
        svg.appendChild(walls); svg.appendChild(door); svg.appendChild(roof);
        return {
          start: function () {
            return Promise.all([
              roof.animate([ROOF, ROOF_PEAK, ROOF_PEAK, ROOF].map(function (d, i) {
                var k = { d: 'path("' + d + '")', offset: [0, 0.3, 0.6, 1][i] }; if (i < 3) k.easing = ARRIVE; return k;
              }), { duration: 1400 }).finished,
              door.animate([{ transform: 'scaleX(1)', easing: 'ease-in-out' }, { transform: 'scaleX(0.12)' }, { transform: 'scaleX(0.12)' }, { transform: 'scaleX(1)' }], { duration: 1400 }).finished
            ]).catch(function () {});
          },
          stop: function () { [roof, door].forEach(function (n) { n.getAnimations().forEach(function (a) { a.cancel(); }); }); }
        };
      }
    },

    'magnifying-glass': {
      paint: 'stroke',
      build: function (svg) {
        var g = pivot(el('g'), 123.5, 123.5);
        var c = el('circle', { cx: 112, cy: 112, r: 80 }); for (var k in STROKE) c.setAttribute(k, STROKE[k]);
        var h = el('path', { d: 'M168.57,168.57L224,224' }); for (var k2 in STROKE) h.setAttribute(k2, STROKE[k2]);
        g.appendChild(c); g.appendChild(h); svg.appendChild(g);
        var HUNT = [[0, 0, 0], [6.71, -5.4, 4.69], [6.98, -13.34, 6.96], [0.5, -19.12, 4.93], [-8.93, -19.34, -0.21], [-15.78, -13.89, -5.45], [-16.05, -5.94, -7.72], [-9.57, -0.17, -5.69], [0, 0, 0]];
        return {
          start: function () {
            return g.animate(HUNT.map(function (kf, i) {
              return { transform: 'translate(' + kf[0] + 'px,' + kf[1] + 'px) rotate(' + kf[2] + 'deg)', offset: +(i / 8).toFixed(3), easing: i < 8 ? 'ease-in-out' : undefined };
            }), { duration: 900 }).finished.catch(function () {});
          },
          stop: function () { g.getAnimations().forEach(function (a) { a.cancel(); }); }
        };
      }
    },

    star: {
      overflow: 'visible',
      paint: 'fill',
      build: function (svg) {
        var STAR = 'M239.18,97.26A16.38,16.38,0,0,0,224.92,86l-59-4.76L143.14,26.15a16.36,16.36,0,0,0-30.27,0L90.11,81.23,31.08,86a16.46,16.46,0,0,0-9.37,28.86l45,38.83L53,211.75a16.38,16.38,0,0,0,24.5,17.82L128,198.49l50.53,31.08A16.4,16.4,0,0,0,203,211.75l-13.76-58.07,45-38.83A16.43,16.43,0,0,0,239.18,97.26Zm-15.34,5.47-48.7,42a8,8,0,0,0-2.56,7.91l14.88,62.8a.37.37,0,0,1-.17.48c-.18.14-.23.11-.38,0l-54.72-33.65a8,8,0,0,0-8.38,0L69.09,215.94c-.15.09-.19.12-.38,0a.37.37,0,0,1-.17-.48l14.88-62.8a8,8,0,0,0-2.56-7.91l-48.7-42c-.12-.1-.23-.19-.13-.5s.18-.27.33-.29l63.92-5.16A8,8,0,0,0,103,91.86l24.62-59.61c.08-.17.11-.25.35-.25s.27.08.35.25L153,91.86a8,8,0,0,0,6.75,4.92l63.92,5.16c.15,0,.24,0,.33.29S224,102.63,223.84,102.73Z';
        var CX = 128, CY = 124;
        var bodyG = pivot(el('g'), CX, CY);
        bodyG.appendChild(el('path', { d: STAR }));
        var raysG = pivot(el('g', { fill: 'none', stroke: 'currentColor', 'stroke-width': 11, 'stroke-linecap': 'round' }), CX, CY);
        [-54, 18, 90, 162, 234].forEach(function (deg) {
          var a = deg * Math.PI / 180;
          raysG.appendChild(el('line', {
            x1: (CX + 84 * Math.cos(a)).toFixed(2), y1: (CY + 84 * Math.sin(a)).toFixed(2),
            x2: (CX + 118 * Math.cos(a)).toFixed(2), y2: (CY + 118 * Math.sin(a)).toFixed(2)
          }));
        });
        svg.appendChild(bodyG); svg.appendChild(raysG);
        var BS = [1, 0.92, 1.18, 0.96, 1.06, 0.99, 1, 1];
        var BT = [0, 0.16, 0.3, 0.4, 0.5, 0.6, 0.7, 1];
        var BE = ['ease-in', 'ease-out', 'ease-in-out', 'ease-in-out', 'ease-in-out', 'ease-out', 'linear'];
        return {
          start: function () {
            return Promise.all([
              bodyG.animate(BS.map(function (s, i) {
                return { transform: 'scale(' + s + ')', offset: BT[i], easing: BE[i] || undefined };
              }), { duration: 1150 }).finished,
              raysG.animate((function () {
                var s = [0.72, 0.74, 0.9, 1.2, 1.2], o = [0, 0, 0.95, 0, 0], t = [0, 0.26, 0.4, 0.74, 1], e = ['linear', 'ease-out', 'ease-in', 'linear'];
                return s.map(function (sv, i) { return { transform: 'scale(' + sv + ')', opacity: o[i], offset: t[i], easing: e[i] }; });
              })(), { duration: 1150 }).finished
            ]).catch(function () {});
          },
          stop: function () { [bodyG, raysG].forEach(function (n) { n.getAnimations().forEach(function (a) { a.cancel(); }); }); }
        };
      }
    },

    moon: {
      paint: 'fill',
      build: function (svg) {
        svg.appendChild(el('path', { d: 'M136.6,32.1a8,8,0,0,0-9.1,10.2A64.1,64.1,0,0,1,72,120a64.3,64.3,0,0,1-13.8-1.5,8,8,0,0,0-9.6,9.6A88,88,0,1,0,136.6,32.1Z' }));
      }
    },

    lock: {
      paint: 'fill',
      build: function (svg) {
        svg.appendChild(el('path', { d: 'M88,96V72a40,40,0,0,1,80,0v24H152V72a24,24,0,0,0-48,0v24Z' }));
        svg.appendChild(el('path', { d: 'M48,112H208a16,16,0,0,1,16,16v88a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V128A16,16,0,0,1,48,112Z' }));
      }
    },

    wallet: {
      paint: 'fill',
      build: function (svg) {
        svg.appendChild(el('path', { d: 'M216,64H56a8,8,0,0,1,0-16H192a8,8,0,0,0,0-16H56A24,24,0,0,0,32,56V184a24,24,0,0,0,24,24H216a16,16,0,0,0,16-16V80A16,16,0,0,0,216,64Zm-36,80a12,12,0,1,1,12-12A12,12,0,0,1,180,144Z' }));
      }
    },

    'chart-line-up': {
      paint: 'fill',
      build: function (svg) {
        svg.appendChild(el('path', { d: 'M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40ZM200,192H56a8,8,0,0,1-8-8V72a8,8,0,0,1,16,0v76.69l34.34-34.35a8,8,0,0,1,11.32,0L128,132.69,172.69,88H144a8,8,0,0,1,0-16h48a8,8,0,0,1,8,8v48a8,8,0,0,1-16,0V99.31l-50.34,50.35a8,8,0,0,1-11.32,0L104,131.31l-40,40V176H200a8,8,0,0,1,0,16Z' }));
      }
    },

    'sign-out': {
      paint: 'fill',
      build: function (svg) {
        svg.appendChild(el('path', { d: 'M112,56H64a8,8,0,0,0-8,8V192a8,8,0,0,0,8,8h48a8,8,0,0,0,0-16H72V72h40a8,8,0,0,0,0-16Z' }));
        var g = el('g', { transform: 'translate(120,84) scale(0.55)' });
        g.appendChild(el('path', { d: 'M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z' }));
        svg.appendChild(g);
      }
    },

    trash: {
      paint: 'fill',
      build: function (svg) {
        var TRASH = 'M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z';
        var g = pivot(el('g'), 128, 216);
        g.appendChild(el('path', { d: TRASH }));
        svg.appendChild(g);
        return {
          start: function () {
            var T = [0, 0.15, 0.35, 0.55, 0.72, 0.86, 1];
            var R = [0, -7, 6, -5, 4, -2, 0];
            return g.animate(R.map(function (r, i) {
              return { transform: 'rotate(' + r + 'deg)', offset: T[i], easing: i < T.length - 1 ? 'ease-in-out' : undefined };
            }), { duration: 700 }).finished.catch(function () {});
          },
          stop: function () { g.getAnimations().forEach(function (a) { a.cancel(); }); }
        };
      }
    },

    archive: {
      paint: 'fill',
      build: function (svg) {
        var ARC = 'M224,48H32A16,16,0,0,0,16,64V88a16,16,0,0,0,16,16v88a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V104a16,16,0,0,0,16-16V64A16,16,0,0,0,224,48ZM208,192H48V104H208ZM224,88H32V64H224V88ZM96,136a8,8,0,0,1,8-8h48a8,8,0,0,1,0,16H104A8,8,0,0,1,96,136Z';
        var g = pivot(el('g'), 128, 216);
        g.appendChild(el('path', { d: ARC }));
        svg.appendChild(g);
        return {
          start: function () {
            return g.animate([
              { transform: 'scaleY(1)', easing: 'ease-in-out' },
              { transform: 'scaleY(0.92)', offset: 0.3, easing: 'cubic-bezier(.34,1.56,.64,1)' },
              { transform: 'scaleY(1.04)', offset: 0.55, easing: 'ease-in-out' },
              { transform: 'scaleY(1)', offset: 0.8 },
              { transform: 'scaleY(0.99)', offset: 0.9 },
              { transform: 'scaleY(1)' }
            ], { duration: 650 }).finished.catch(function () {});
          },
          stop: function () { g.getAnimations().forEach(function (a) { a.cancel(); }); }
        };
      }
    },

    user: {
      paint: 'stroke',
      build: function (svg) {
        var head = el('circle', { cx: 128, cy: 96, r: 64 }); for (var k in STROKE) head.setAttribute(k, STROKE[k]);
        var sh = el('path', { d: 'M32,216c19.37-33.47,54.55-56,96-56s76.63,22.53,96,56' }); for (var k2 in STROKE) sh.setAttribute(k2, STROKE[k2]);
        svg.appendChild(sh); svg.appendChild(head);
        var T = [0, 0.2, 0.34, 0.6, 0.72, 1];
        var X = [0, -22, -22, 22, 22, 0], Y = [0, -5, -5, -5, -5, 0];
        return {
          start: function () {
            return head.animate(X.map(function (x, i) {
              return { transform: 'translate(' + x + 'px,' + Y[i] + 'px)', offset: T[i], easing: i < 5 ? 'ease-in-out' : undefined };
            }), { duration: 1300 }).finished.catch(function () {});
          },
          stop: function () { head.getAnimations().forEach(function (a) { a.cancel(); }); }
        };
      }
    }
  };

  function noop() { return { start: function () { return Promise.resolve(); }, stop: function () {} }; }
  function supportsDMorph() {
    try { return typeof CSS !== 'undefined' && CSS.supports && (CSS.supports('d', 'path("M0,0H1")') || CSS.supports('d', 'path("M 0 0 H 1")')); }
    catch (e) { return false; }
  }
  function staticStroke(svg, ds) {
    ds.forEach(function (d) {
      var n = el('path', { d: d });
      for (var k in STROKE) n.setAttribute(k, STROKE[k]);
      svg.appendChild(n);
    });
  }

  /* ---------- renderer ---------- */
  function create(name, size) {
    var def = DEFS[name];
    size = size || 20;
    /* Fallback: static glyph from icons.js (PhIcons) when no animation exists */
    if (!def) {
      var staticSvg = (global.PhIcons && global.PhIcons.has(name)) ? global.PhIcons.get(name, size) : '';
      if (!staticSvg) return null;
      var wrapStatic = document.createElement('span');
      wrapStatic.className = 'icm';
      wrapStatic.setAttribute('data-icon', name);
      wrapStatic.innerHTML = staticSvg;
      return wrapStatic;
    }
    var wrap = document.createElement('span');
    wrap.className = 'icm' + (def.overflow === 'visible' ? ' icm-visible' : '');
    wrap.setAttribute('data-icon', name);
    var svg = el('svg', { viewBox: '0 0 256 256', width: size, height: size, 'aria-hidden': 'true' });
    svg.style.display = 'block';
    if (def.paint === 'fill') svg.setAttribute('fill', 'currentColor');
    else { svg.setAttribute('fill', 'none'); svg.setAttribute('stroke', 'currentColor'); }
    var ctrl = def.build(svg) || noop();
    wrap.appendChild(svg);

    var playing = null;
    function start() {
      wrap._hovered = true;
      if (playing) return;
      playing = ctrl.start();
      if (playing && playing.then) playing.then(function () { playing = null; }).catch(function () { playing = null; });
      else playing = null;
    }
    function stop() {
      wrap._hovered = false;
      playing = null;
      ctrl.stop();
    }
    wrap.addEventListener('pointerenter', start);
    wrap.addEventListener('pointerleave', stop);
    wrap.addEventListener('focusin', start);
    wrap.addEventListener('focusout', stop);
    // touch: tap plays once
    wrap.addEventListener('touchstart', function () { start(); setTimeout(stop, 1500); }, { passive: true });

    wrap._icmStart = start;
    wrap._icmStop = stop;
    return wrap;
  }

  function init(root) {
    (root || document).querySelectorAll('[data-icon]').forEach(function (node) {
      if (node._icmInit) return;
      node._icmInit = true;
      var fresh = create(node.getAttribute('data-icon'), parseInt(node.getAttribute('data-size') || '0', 10) || undefined);
      if (!fresh) return;
      if (node.tagName === 'SPAN' && !node.firstChild) {
        while (node.attributes.length) {
          var a = node.attributes[0];
          if (a.name !== 'data-icon') fresh.setAttribute(a.name, a.value);
          node.removeAttribute(a.name);
        }
        node.replaceWith(fresh);
      }
    });
  }
  function play(nodeOrSelector) {
    var n = typeof nodeOrSelector === 'string' ? document.querySelector('[data-icon="' + nodeOrSelector + '"]') : nodeOrSelector;
    if (n && n._icmStart) { n._icmStart(); setTimeout(n._icmStop, 2000); }
  }

  global.Iconimate = { create: create, init: init, play: play };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { init(); });
  else init();
})(window);
