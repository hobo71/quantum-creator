/*
 * anime.js v3.1.0
 * (c) 2019 Julian Garnier
 * Released under the MIT license
 * animejs.com
 */
!function (n, e) {
  "object" == typeof exports && "undefined" != typeof module ? module.exports = e() : "function" == typeof define && define.amd ? define(e) : n.anime = e();
}(this, function () {
  "use strict";

  var n = {
    update: null,
    begin: null,
    loopBegin: null,
    changeBegin: null,
    change: null,
    changeComplete: null,
    loopComplete: null,
    complete: null,
    loop: 1,
    direction: "normal",
    autoplay: !0,
    timelineOffset: 0
  },
      e = {
    duration: 1e3,
    delay: 0,
    endDelay: 0,
    easing: "easeOutElastic(1, .5)",
    round: 0
  },
      r = ["translateX", "translateY", "translateZ", "rotate", "rotateX", "rotateY", "rotateZ", "scale", "scaleX", "scaleY", "scaleZ", "skew", "skewX", "skewY", "perspective"],
      t = {
    CSS: {},
    springs: {}
  };

  function a(n, e, r) {
    return Math.min(Math.max(n, e), r);
  }

  function o(n, e) {
    return n.indexOf(e) > -1;
  }

  function u(n, e) {
    return n.apply(null, e);
  }

  var i = {
    arr: function (n) {
      return Array.isArray(n);
    },
    obj: function (n) {
      return o(Object.prototype.toString.call(n), "Object");
    },
    pth: function (n) {
      return i.obj(n) && n.hasOwnProperty("totalLength");
    },
    svg: function (n) {
      return n instanceof SVGElement;
    },
    inp: function (n) {
      return n instanceof HTMLInputElement;
    },
    dom: function (n) {
      return n.nodeType || i.svg(n);
    },
    str: function (n) {
      return "string" == typeof n;
    },
    fnc: function (n) {
      return "function" == typeof n;
    },
    und: function (n) {
      return void 0 === n;
    },
    hex: function (n) {
      return /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(n);
    },
    rgb: function (n) {
      return /^rgb/.test(n);
    },
    hsl: function (n) {
      return /^hsl/.test(n);
    },
    col: function (n) {
      return i.hex(n) || i.rgb(n) || i.hsl(n);
    },
    key: function (r) {
      return !n.hasOwnProperty(r) && !e.hasOwnProperty(r) && "targets" !== r && "keyframes" !== r;
    }
  };

  function c(n) {
    var e = /\(([^)]+)\)/.exec(n);
    return e ? e[1].split(",").map(function (n) {
      return parseFloat(n);
    }) : [];
  }

  function s(n, e) {
    var r = c(n),
        o = a(i.und(r[0]) ? 1 : r[0], .1, 100),
        u = a(i.und(r[1]) ? 100 : r[1], .1, 100),
        s = a(i.und(r[2]) ? 10 : r[2], .1, 100),
        f = a(i.und(r[3]) ? 0 : r[3], .1, 100),
        l = Math.sqrt(u / o),
        d = s / (2 * Math.sqrt(u * o)),
        p = d < 1 ? l * Math.sqrt(1 - d * d) : 0,
        h = 1,
        v = d < 1 ? (d * l - f) / p : -f + l;

    function g(n) {
      var r = e ? e * n / 1e3 : n;
      return r = d < 1 ? Math.exp(-r * d * l) * (h * Math.cos(p * r) + v * Math.sin(p * r)) : (h + v * r) * Math.exp(-r * l), 0 === n || 1 === n ? n : 1 - r;
    }

    return e ? g : function () {
      var e = t.springs[n];
      if (e) return e;

      for (var r = 0, a = 0;;) {
        if (1 === g(r += 1 / 6)) {
          if (++a >= 16) break;
        } else a = 0;
      }

      var o = r * (1 / 6) * 1e3;
      return t.springs[n] = o, o;
    };
  }

  function f(n) {
    return void 0 === n && (n = 10), function (e) {
      return Math.round(e * n) * (1 / n);
    };
  }

  var l,
      d,
      p = function () {
    var n = 11,
        e = 1 / (n - 1);

    function r(n, e) {
      return 1 - 3 * e + 3 * n;
    }

    function t(n, e) {
      return 3 * e - 6 * n;
    }

    function a(n) {
      return 3 * n;
    }

    function o(n, e, o) {
      return ((r(e, o) * n + t(e, o)) * n + a(e)) * n;
    }

    function u(n, e, o) {
      return 3 * r(e, o) * n * n + 2 * t(e, o) * n + a(e);
    }

    return function (r, t, a, i) {
      if (0 <= r && r <= 1 && 0 <= a && a <= 1) {
        var c = new Float32Array(n);
        if (r !== t || a !== i) for (var s = 0; s < n; ++s) {
          c[s] = o(s * e, r, a);
        }
        return function (n) {
          return r === t && a === i ? n : 0 === n || 1 === n ? n : o(f(n), t, i);
        };
      }

      function f(t) {
        for (var i = 0, s = 1, f = n - 1; s !== f && c[s] <= t; ++s) {
          i += e;
        }

        var l = i + (t - c[--s]) / (c[s + 1] - c[s]) * e,
            d = u(l, r, a);
        return d >= .001 ? function (n, e, r, t) {
          for (var a = 0; a < 4; ++a) {
            var i = u(e, r, t);
            if (0 === i) return e;
            e -= (o(e, r, t) - n) / i;
          }

          return e;
        }(t, l, r, a) : 0 === d ? l : function (n, e, r, t, a) {
          for (var u, i, c = 0; (u = o(i = e + (r - e) / 2, t, a) - n) > 0 ? r = i : e = i, Math.abs(u) > 1e-7 && ++c < 10;) {
            ;
          }

          return i;
        }(t, i, i + e, r, a);
      }
    };
  }(),
      h = (l = {
    linear: function () {
      return function (n) {
        return n;
      };
    }
  }, d = {
    Sine: function () {
      return function (n) {
        return 1 - Math.cos(n * Math.PI / 2);
      };
    },
    Circ: function () {
      return function (n) {
        return 1 - Math.sqrt(1 - n * n);
      };
    },
    Back: function () {
      return function (n) {
        return n * n * (3 * n - 2);
      };
    },
    Bounce: function () {
      return function (n) {
        for (var e, r = 4; n < ((e = Math.pow(2, --r)) - 1) / 11;) {
          ;
        }

        return 1 / Math.pow(4, 3 - r) - 7.5625 * Math.pow((3 * e - 2) / 22 - n, 2);
      };
    },
    Elastic: function (n, e) {
      void 0 === n && (n = 1), void 0 === e && (e = .5);
      var r = a(n, 1, 10),
          t = a(e, .1, 2);
      return function (n) {
        return 0 === n || 1 === n ? n : -r * Math.pow(2, 10 * (n - 1)) * Math.sin((n - 1 - t / (2 * Math.PI) * Math.asin(1 / r)) * (2 * Math.PI) / t);
      };
    }
  }, ["Quad", "Cubic", "Quart", "Quint", "Expo"].forEach(function (n, e) {
    d[n] = function () {
      return function (n) {
        return Math.pow(n, e + 2);
      };
    };
  }), Object.keys(d).forEach(function (n) {
    var e = d[n];
    l["easeIn" + n] = e, l["easeOut" + n] = function (n, r) {
      return function (t) {
        return 1 - e(n, r)(1 - t);
      };
    }, l["easeInOut" + n] = function (n, r) {
      return function (t) {
        return t < .5 ? e(n, r)(2 * t) / 2 : 1 - e(n, r)(-2 * t + 2) / 2;
      };
    };
  }), l);

  function v(n, e) {
    if (i.fnc(n)) return n;
    var r = n.split("(")[0],
        t = h[r],
        a = c(n);

    switch (r) {
      case "spring":
        return s(n, e);

      case "cubicBezier":
        return u(p, a);

      case "steps":
        return u(f, a);

      default:
        return u(t, a);
    }
  }

  function g(n) {
    try {
      return document.querySelectorAll(n);
    } catch (n) {
      return;
    }
  }

  function m(n, e) {
    for (var r = n.length, t = arguments.length >= 2 ? arguments[1] : void 0, a = [], o = 0; o < r; o++) {
      if (o in n) {
        var u = n[o];
        e.call(t, u, o, n) && a.push(u);
      }
    }

    return a;
  }

  function y(n) {
    return n.reduce(function (n, e) {
      return n.concat(i.arr(e) ? y(e) : e);
    }, []);
  }

  function b(n) {
    return i.arr(n) ? n : (i.str(n) && (n = g(n) || n), n instanceof NodeList || n instanceof HTMLCollection ? [].slice.call(n) : [n]);
  }

  function M(n, e) {
    return n.some(function (n) {
      return n === e;
    });
  }

  function x(n) {
    var e = {};

    for (var r in n) {
      e[r] = n[r];
    }

    return e;
  }

  function w(n, e) {
    var r = x(n);

    for (var t in n) {
      r[t] = e.hasOwnProperty(t) ? e[t] : n[t];
    }

    return r;
  }

  function k(n, e) {
    var r = x(n);

    for (var t in e) {
      r[t] = i.und(n[t]) ? e[t] : n[t];
    }

    return r;
  }

  function O(n) {
    return i.rgb(n) ? (r = /rgb\((\d+,\s*[\d]+,\s*[\d]+)\)/g.exec(e = n)) ? "rgba(" + r[1] + ",1)" : e : i.hex(n) ? (t = n.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, function (n, e, r, t) {
      return e + e + r + r + t + t;
    }), a = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(t), "rgba(" + parseInt(a[1], 16) + "," + parseInt(a[2], 16) + "," + parseInt(a[3], 16) + ",1)") : i.hsl(n) ? function (n) {
      var e,
          r,
          t,
          a = /hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/g.exec(n) || /hsla\((\d+),\s*([\d.]+)%,\s*([\d.]+)%,\s*([\d.]+)\)/g.exec(n),
          o = parseInt(a[1], 10) / 360,
          u = parseInt(a[2], 10) / 100,
          i = parseInt(a[3], 10) / 100,
          c = a[4] || 1;

      function s(n, e, r) {
        return r < 0 && (r += 1), r > 1 && (r -= 1), r < 1 / 6 ? n + 6 * (e - n) * r : r < .5 ? e : r < 2 / 3 ? n + (e - n) * (2 / 3 - r) * 6 : n;
      }

      if (0 == u) e = r = t = i;else {
        var f = i < .5 ? i * (1 + u) : i + u - i * u,
            l = 2 * i - f;
        e = s(l, f, o + 1 / 3), r = s(l, f, o), t = s(l, f, o - 1 / 3);
      }
      return "rgba(" + 255 * e + "," + 255 * r + "," + 255 * t + "," + c + ")";
    }(n) : void 0;
    var e, r, t, a;
  }

  function C(n) {
    var e = /[+-]?\d*\.?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?(%|px|pt|em|rem|in|cm|mm|ex|ch|pc|vw|vh|vmin|vmax|deg|rad|turn)?$/.exec(n);
    if (e) return e[1];
  }

  function B(n, e) {
    return i.fnc(n) ? n(e.target, e.id, e.total) : n;
  }

  function P(n, e) {
    return n.getAttribute(e);
  }

  function I(n, e, r) {
    if (M([r, "deg", "rad", "turn"], C(e))) return e;
    var a = t.CSS[e + r];
    if (!i.und(a)) return a;
    var o = document.createElement(n.tagName),
        u = n.parentNode && n.parentNode !== document ? n.parentNode : document.body;
    u.appendChild(o), o.style.position = "absolute", o.style.width = 100 + r;
    var c = 100 / o.offsetWidth;
    u.removeChild(o);
    var s = c * parseFloat(e);
    return t.CSS[e + r] = s, s;
  }

  function T(n, e, r) {
    if (e in n.style) {
      var t = e.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase(),
          a = n.style[e] || getComputedStyle(n).getPropertyValue(t) || "0";
      return r ? I(n, a, r) : a;
    }
  }

  function D(n, e) {
    return i.dom(n) && !i.inp(n) && (P(n, e) || i.svg(n) && n[e]) ? "attribute" : i.dom(n) && M(r, e) ? "transform" : i.dom(n) && "transform" !== e && T(n, e) ? "css" : null != n[e] ? "object" : void 0;
  }

  function E(n) {
    if (i.dom(n)) {
      for (var e, r = n.style.transform || "", t = /(\w+)\(([^)]*)\)/g, a = new Map(); e = t.exec(r);) {
        a.set(e[1], e[2]);
      }

      return a;
    }
  }

  function F(n, e, r, t) {
    var a,
        u = o(e, "scale") ? 1 : 0 + (o(a = e, "translate") || "perspective" === a ? "px" : o(a, "rotate") || o(a, "skew") ? "deg" : void 0),
        i = E(n).get(e) || u;
    return r && (r.transforms.list.set(e, i), r.transforms.last = e), t ? I(n, i, t) : i;
  }

  function N(n, e, r, t) {
    switch (D(n, e)) {
      case "transform":
        return F(n, e, t, r);

      case "css":
        return T(n, e, r);

      case "attribute":
        return P(n, e);

      default:
        return n[e] || 0;
    }
  }

  function A(n, e) {
    var r = /^(\*=|\+=|-=)/.exec(n);
    if (!r) return n;
    var t = C(n) || 0,
        a = parseFloat(e),
        o = parseFloat(n.replace(r[0], ""));

    switch (r[0][0]) {
      case "+":
        return a + o + t;

      case "-":
        return a - o + t;

      case "*":
        return a * o + t;
    }
  }

  function L(n, e) {
    if (i.col(n)) return O(n);
    if (/\s/g.test(n)) return n;
    var r = C(n),
        t = r ? n.substr(0, n.length - r.length) : n;
    return e ? t + e : t;
  }

  function j(n, e) {
    return Math.sqrt(Math.pow(e.x - n.x, 2) + Math.pow(e.y - n.y, 2));
  }

  function S(n) {
    for (var e, r = n.points, t = 0, a = 0; a < r.numberOfItems; a++) {
      var o = r.getItem(a);
      a > 0 && (t += j(e, o)), e = o;
    }

    return t;
  }

  function q(n) {
    if (n.getTotalLength) return n.getTotalLength();

    switch (n.tagName.toLowerCase()) {
      case "circle":
        return o = n, 2 * Math.PI * P(o, "r");

      case "rect":
        return 2 * P(a = n, "width") + 2 * P(a, "height");

      case "line":
        return j({
          x: P(t = n, "x1"),
          y: P(t, "y1")
        }, {
          x: P(t, "x2"),
          y: P(t, "y2")
        });

      case "polyline":
        return S(n);

      case "polygon":
        return r = (e = n).points, S(e) + j(r.getItem(r.numberOfItems - 1), r.getItem(0));
    }

    var e, r, t, a, o;
  }

  function $(n, e) {
    var r = e || {},
        t = r.el || function (n) {
      for (var e = n.parentNode; i.svg(e) && i.svg(e.parentNode);) {
        e = e.parentNode;
      }

      return e;
    }(n),
        a = t.getBoundingClientRect(),
        o = P(t, "viewBox"),
        u = a.width,
        c = a.height,
        s = r.viewBox || (o ? o.split(" ") : [0, 0, u, c]);

    return {
      el: t,
      viewBox: s,
      x: s[0] / 1,
      y: s[1] / 1,
      w: u / s[2],
      h: c / s[3]
    };
  }

  function X(n, e) {
    function r(r) {
      void 0 === r && (r = 0);
      var t = e + r >= 1 ? e + r : 0;
      return n.el.getPointAtLength(t);
    }

    var t = $(n.el, n.svg),
        a = r(),
        o = r(-1),
        u = r(1);

    switch (n.property) {
      case "x":
        return (a.x - t.x) * t.w;

      case "y":
        return (a.y - t.y) * t.h;

      case "angle":
        return 180 * Math.atan2(u.y - o.y, u.x - o.x) / Math.PI;
    }
  }

  function Y(n, e) {
    var r = /[+-]?\d*\.?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/g,
        t = L(i.pth(n) ? n.totalLength : n, e) + "";
    return {
      original: t,
      numbers: t.match(r) ? t.match(r).map(Number) : [0],
      strings: i.str(n) || e ? t.split(r) : []
    };
  }

  function Z(n) {
    return m(n ? y(i.arr(n) ? n.map(b) : b(n)) : [], function (n, e, r) {
      return r.indexOf(n) === e;
    });
  }

  function Q(n) {
    var e = Z(n);
    return e.map(function (n, r) {
      return {
        target: n,
        id: r,
        total: e.length,
        transforms: {
          list: E(n)
        }
      };
    });
  }

  function V(n, e) {
    var r = x(e);

    if (/^spring/.test(r.easing) && (r.duration = s(r.easing)), i.arr(n)) {
      var t = n.length;
      2 === t && !i.obj(n[0]) ? n = {
        value: n
      } : i.fnc(e.duration) || (r.duration = e.duration / t);
    }

    var a = i.arr(n) ? n : [n];
    return a.map(function (n, r) {
      var t = i.obj(n) && !i.pth(n) ? n : {
        value: n
      };
      return i.und(t.delay) && (t.delay = r ? 0 : e.delay), i.und(t.endDelay) && (t.endDelay = r === a.length - 1 ? e.endDelay : 0), t;
    }).map(function (n) {
      return k(n, r);
    });
  }

  function z(n, e) {
    var r = [],
        t = e.keyframes;

    for (var a in t && (e = k(function (n) {
      for (var e = m(y(n.map(function (n) {
        return Object.keys(n);
      })), function (n) {
        return i.key(n);
      }).reduce(function (n, e) {
        return n.indexOf(e) < 0 && n.push(e), n;
      }, []), r = {}, t = function (t) {
        var a = e[t];
        r[a] = n.map(function (n) {
          var e = {};

          for (var r in n) {
            i.key(r) ? r == a && (e.value = n[r]) : e[r] = n[r];
          }

          return e;
        });
      }, a = 0; a < e.length; a++) {
        t(a);
      }

      return r;
    }(t), e)), e) {
      i.key(a) && r.push({
        name: a,
        tweens: V(e[a], n)
      });
    }

    return r;
  }

  function H(n, e) {
    var r;
    return n.tweens.map(function (t) {
      var a = function (n, e) {
        var r = {};

        for (var t in n) {
          var a = B(n[t], e);
          i.arr(a) && 1 === (a = a.map(function (n) {
            return B(n, e);
          })).length && (a = a[0]), r[t] = a;
        }

        return r.duration = parseFloat(r.duration), r.delay = parseFloat(r.delay), r;
      }(t, e),
          o = a.value,
          u = i.arr(o) ? o[1] : o,
          c = C(u),
          s = N(e.target, n.name, c, e),
          f = r ? r.to.original : s,
          l = i.arr(o) ? o[0] : f,
          d = C(l) || C(s),
          p = c || d;

      return i.und(u) && (u = f), a.from = Y(l, p), a.to = Y(A(u, l), p), a.start = r ? r.end : 0, a.end = a.start + a.delay + a.duration + a.endDelay, a.easing = v(a.easing, a.duration), a.isPath = i.pth(o), a.isColor = i.col(a.from.original), a.isColor && (a.round = 1), r = a, a;
    });
  }

  var G = {
    css: function (n, e, r) {
      return n.style[e] = r;
    },
    attribute: function (n, e, r) {
      return n.setAttribute(e, r);
    },
    object: function (n, e, r) {
      return n[e] = r;
    },
    transform: function (n, e, r, t, a) {
      if (t.list.set(e, r), e === t.last || a) {
        var o = "";
        t.list.forEach(function (n, e) {
          o += e + "(" + n + ") ";
        }), n.style.transform = o;
      }
    }
  };

  function R(n, e) {
    Q(n).forEach(function (n) {
      for (var r in e) {
        var t = B(e[r], n),
            a = n.target,
            o = C(t),
            u = N(a, r, o, n),
            i = A(L(t, o || C(u)), u),
            c = D(a, r);
        G[c](a, r, i, n.transforms, !0);
      }
    });
  }

  function W(n, e) {
    return m(y(n.map(function (n) {
      return e.map(function (e) {
        return function (n, e) {
          var r = D(n.target, e.name);

          if (r) {
            var t = H(e, n),
                a = t[t.length - 1];
            return {
              type: r,
              property: e.name,
              animatable: n,
              tweens: t,
              duration: a.end,
              delay: t[0].delay,
              endDelay: a.endDelay
            };
          }
        }(n, e);
      });
    })), function (n) {
      return !i.und(n);
    });
  }

  function J(n, e) {
    var r = n.length,
        t = function (n) {
      return n.timelineOffset ? n.timelineOffset : 0;
    },
        a = {};

    return a.duration = r ? Math.max.apply(Math, n.map(function (n) {
      return t(n) + n.duration;
    })) : e.duration, a.delay = r ? Math.min.apply(Math, n.map(function (n) {
      return t(n) + n.delay;
    })) : e.delay, a.endDelay = r ? a.duration - Math.max.apply(Math, n.map(function (n) {
      return t(n) + n.duration - n.endDelay;
    })) : e.endDelay, a;
  }

  var K = 0;

  var U,
      _ = [],
      nn = [],
      en = function () {
    function n() {
      U = requestAnimationFrame(e);
    }

    function e(e) {
      var r = _.length;

      if (r) {
        for (var t = 0; t < r;) {
          var a = _[t];

          if (a.paused) {
            var o = _.indexOf(a);

            o > -1 && (_.splice(o, 1), r = _.length);
          } else a.tick(e);

          t++;
        }

        n();
      } else U = cancelAnimationFrame(U);
    }

    return n;
  }();

  function rn(r) {
    void 0 === r && (r = {});
    var t,
        o = 0,
        u = 0,
        i = 0,
        c = 0,
        s = null;

    function f(n) {
      var e = window.Promise && new Promise(function (n) {
        return s = n;
      });
      return n.finished = e, e;
    }

    var l,
        d,
        p,
        h,
        v,
        g,
        y,
        b,
        M = (d = w(n, l = r), p = w(e, l), h = z(p, l), v = Q(l.targets), g = W(v, h), y = J(g, p), b = K, K++, k(d, {
      id: b,
      children: [],
      animatables: v,
      animations: g,
      duration: y.duration,
      delay: y.delay,
      endDelay: y.endDelay
    }));
    f(M);

    function x() {
      var n = M.direction;
      "alternate" !== n && (M.direction = "normal" !== n ? "normal" : "reverse"), M.reversed = !M.reversed, t.forEach(function (n) {
        return n.reversed = M.reversed;
      });
    }

    function O(n) {
      return M.reversed ? M.duration - n : n;
    }

    function C() {
      o = 0, u = O(M.currentTime) * (1 / rn.speed);
    }

    function B(n, e) {
      e && e.seek(n - e.timelineOffset);
    }

    function P(n) {
      for (var e = 0, r = M.animations, t = r.length; e < t;) {
        var o = r[e],
            u = o.animatable,
            i = o.tweens,
            c = i.length - 1,
            s = i[c];
        c && (s = m(i, function (e) {
          return n < e.end;
        })[0] || s);

        for (var f = a(n - s.start - s.delay, 0, s.duration) / s.duration, l = isNaN(f) ? 1 : s.easing(f), d = s.to.strings, p = s.round, h = [], v = s.to.numbers.length, g = void 0, y = 0; y < v; y++) {
          var b = void 0,
              x = s.to.numbers[y],
              w = s.from.numbers[y] || 0;
          b = s.isPath ? X(s.value, l * x) : w + l * (x - w), p && (s.isColor && y > 2 || (b = Math.round(b * p) / p)), h.push(b);
        }

        var k = d.length;

        if (k) {
          g = d[0];

          for (var O = 0; O < k; O++) {
            d[O];
            var C = d[O + 1],
                B = h[O];
            isNaN(B) || (g += C ? B + C : B + " ");
          }
        } else g = h[0];

        G[o.type](u.target, o.property, g, u.transforms), o.currentValue = g, e++;
      }
    }

    function I(n) {
      M[n] && !M.passThrough && M[n](M);
    }

    function T(n) {
      var e = M.duration,
          r = M.delay,
          l = e - M.endDelay,
          d = O(n);
      M.progress = a(d / e * 100, 0, 100), M.reversePlayback = d < M.currentTime, t && function (n) {
        if (M.reversePlayback) for (var e = c; e--;) {
          B(n, t[e]);
        } else for (var r = 0; r < c; r++) {
          B(n, t[r]);
        }
      }(d), !M.began && M.currentTime > 0 && (M.began = !0, I("begin")), !M.loopBegan && M.currentTime > 0 && (M.loopBegan = !0, I("loopBegin")), d <= r && 0 !== M.currentTime && P(0), (d >= l && M.currentTime !== e || !e) && P(e), d > r && d < l ? (M.changeBegan || (M.changeBegan = !0, M.changeCompleted = !1, I("changeBegin")), I("change"), P(d)) : M.changeBegan && (M.changeCompleted = !0, M.changeBegan = !1, I("changeComplete")), M.currentTime = a(d, 0, e), M.began && I("update"), n >= e && (u = 0, M.remaining && !0 !== M.remaining && M.remaining--, M.remaining ? (o = i, I("loopComplete"), M.loopBegan = !1, "alternate" === M.direction && x()) : (M.paused = !0, M.completed || (M.completed = !0, I("loopComplete"), I("complete"), !M.passThrough && "Promise" in window && (s(), f(M)))));
    }

    return M.reset = function () {
      var n = M.direction;
      M.passThrough = !1, M.currentTime = 0, M.progress = 0, M.paused = !0, M.began = !1, M.loopBegan = !1, M.changeBegan = !1, M.completed = !1, M.changeCompleted = !1, M.reversePlayback = !1, M.reversed = "reverse" === n, M.remaining = M.loop, t = M.children;

      for (var e = c = t.length; e--;) {
        M.children[e].reset();
      }

      (M.reversed && !0 !== M.loop || "alternate" === n && 1 === M.loop) && M.remaining++, P(M.reversed ? M.duration : 0);
    }, M.set = function (n, e) {
      return R(n, e), M;
    }, M.tick = function (n) {
      i = n, o || (o = i), T((i + (u - o)) * rn.speed);
    }, M.seek = function (n) {
      T(O(n));
    }, M.pause = function () {
      M.paused = !0, C();
    }, M.play = function () {
      M.paused && (M.completed && M.reset(), M.paused = !1, _.push(M), C(), U || en());
    }, M.reverse = function () {
      x(), C();
    }, M.restart = function () {
      M.reset(), M.play();
    }, M.reset(), M.autoplay && M.play(), M;
  }

  function tn(n, e) {
    for (var r = e.length; r--;) {
      M(n, e[r].animatable.target) && e.splice(r, 1);
    }
  }

  return "undefined" != typeof document && document.addEventListener("visibilitychange", function () {
    document.hidden ? (_.forEach(function (n) {
      return n.pause();
    }), nn = _.slice(0), rn.running = _ = []) : nn.forEach(function (n) {
      return n.play();
    });
  }), rn.version = "3.1.0", rn.speed = 1, rn.running = _, rn.remove = function (n) {
    for (var e = Z(n), r = _.length; r--;) {
      var t = _[r],
          a = t.animations,
          o = t.children;
      tn(e, a);

      for (var u = o.length; u--;) {
        var i = o[u],
            c = i.animations;
        tn(e, c), c.length || i.children.length || o.splice(u, 1);
      }

      a.length || o.length || t.pause();
    }
  }, rn.get = N, rn.set = R, rn.convertPx = I, rn.path = function (n, e) {
    var r = i.str(n) ? g(n)[0] : n,
        t = e || 100;
    return function (n) {
      return {
        property: n,
        el: r,
        svg: $(r),
        totalLength: q(r) * (t / 100)
      };
    };
  }, rn.setDashoffset = function (n) {
    var e = q(n);
    return n.setAttribute("stroke-dasharray", e), e;
  }, rn.stagger = function (n, e) {
    void 0 === e && (e = {});
    var r = e.direction || "normal",
        t = e.easing ? v(e.easing) : null,
        a = e.grid,
        o = e.axis,
        u = e.from || 0,
        c = "first" === u,
        s = "center" === u,
        f = "last" === u,
        l = i.arr(n),
        d = l ? parseFloat(n[0]) : parseFloat(n),
        p = l ? parseFloat(n[1]) : 0,
        h = C(l ? n[1] : n) || 0,
        g = e.start || 0 + (l ? d : 0),
        m = [],
        y = 0;
    return function (n, e, i) {
      if (c && (u = 0), s && (u = (i - 1) / 2), f && (u = i - 1), !m.length) {
        for (var v = 0; v < i; v++) {
          if (a) {
            var b = s ? (a[0] - 1) / 2 : u % a[0],
                M = s ? (a[1] - 1) / 2 : Math.floor(u / a[0]),
                x = b - v % a[0],
                w = M - Math.floor(v / a[0]),
                k = Math.sqrt(x * x + w * w);
            "x" === o && (k = -x), "y" === o && (k = -w), m.push(k);
          } else m.push(Math.abs(u - v));

          y = Math.max.apply(Math, m);
        }

        t && (m = m.map(function (n) {
          return t(n / y) * y;
        })), "reverse" === r && (m = m.map(function (n) {
          return o ? n < 0 ? -1 * n : -n : Math.abs(y - n);
        }));
      }

      return g + (l ? (p - d) / y : d) * (Math.round(100 * m[e]) / 100) + h;
    };
  }, rn.timeline = function (n) {
    void 0 === n && (n = {});
    var r = rn(n);
    return r.duration = 0, r.add = function (t, a) {
      var o = _.indexOf(r),
          u = r.children;

      function c(n) {
        n.passThrough = !0;
      }

      o > -1 && _.splice(o, 1);

      for (var s = 0; s < u.length; s++) {
        c(u[s]);
      }

      var f = k(t, w(e, n));
      f.targets = f.targets || n.targets;
      var l = r.duration;
      f.autoplay = !1, f.direction = r.direction, f.timelineOffset = i.und(a) ? l : A(a, l), c(r), r.seek(f.timelineOffset);
      var d = rn(f);
      c(d), u.push(d);
      var p = J(u, n);
      return r.delay = p.delay, r.endDelay = p.endDelay, r.duration = p.duration, r.seek(0), r.reset(), r.autoplay && r.play(), r;
    }, r;
  }, rn.easing = v, rn.penner = h, rn.random = function (n, e) {
    return Math.floor(Math.random() * (e - n + 1)) + n;
  }, rn;
});
/* eslint-disable */

var Keys = {
  down: 40,
  up: 38,
  left: 37,
  right: 39,
  enter: 13,
  tab: 9
};
$('.navbarToggler').click(function () {
  $($(this).data('target')).slideToggle(300);
});
$(window).scroll(function () {
  if ($(window).scrollTop() < 150) {
    $('.navbar-wrapper.size-down').css('padding', '1rem');
  } else if ($(window).scrollTop() > 150) {
    $('.navbar-wrapper.size-down').css('padding', '.5rem 1rem');
  }
});
$('.text-field').find('input:not([type]), input[type=text]:not(.browser-default), input[type=password]:not(.browser-default), input[type=email]:not(.browser-default), input[type=url]:not(.browser-default), input[type=time]:not(.browser-default), input[type=date]:not(.browser-default), input[type=datetime]:not(.browser-default), input[type=datetime-local]:not(.browser-default), input[type=tel]:not(.browser-default), input[type=number]:not(.browser-default), input[type=search]:not(.browser-default), textarea').not('[placeholder]').focus(function (e) {
  $(e.target).siblings('label,i').addClass('active');
}).change(function (e) {
  if ($(e.target).val() === '') {
    $(e.target).siblings('label,i').removeClass('active');
  }
}).blur(function (e) {
  if ($(e.target).val() === '') {
    $(e.target).siblings('label,i').removeClass('active');
  }
});
$('.text-field').find('input[placeholder]').siblings('label').addClass('active');
$('.chip').find('.close').click(function () {
  $(this).parent().remove();
});
$('a.smoothscroll').on('click', function (event) {
  if (this.hash !== '') {
    event.preventDefault();
    var hash = this.hash;
    $('html, body').animate({
      scrollTop: $(hash).offset().top
    }, 800, function () {
      window.location.hash = hash;
    });
  }
});

function openFullscreen(elem) {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.mozRequestFullScreen) {
    elem.mozRequestFullScreen();
  } else if (elem.webkitRequestFullscreen) {
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) {
    elem.msRequestFullscreen();
  }
}

function closeFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  }
}
/*!
 * Waves v0.7.6
 * http://fian.my.id/Waves
 *
 * Copyright 2014-2018 Alfiana E. Sibuea and other contributors
 * Released under the MIT license
 * https://github.com/fians/Waves/blob/master/LICENSE
 */


;

(function (window, factory) {
  'use strict'; // AMD. Register as an anonymous module.  Wrap in function so we have access
  // to root via `this`.

  if (typeof define === 'function' && define.amd) {
    define([], function () {
      window.Waves = factory.call(window);
      return window.Waves;
    });
  } // Node. Does not work with strict CommonJS, but only CommonJS-like
  // environments that support module.exports, like Node.
  else if (typeof exports === 'object') {
      module.exports = factory.call(window);
    } // Browser globals.
    else {
        window.Waves = factory.call(window);
      }
})(typeof global === 'object' ? global : this, function () {
  'use strict';

  var Waves = Waves || {};
  var $$ = document.querySelectorAll.bind(document);
  var toString = Object.prototype.toString;
  var isTouchAvailable = 'ontouchstart' in window; // Find exact position of element

  function isWindow(obj) {
    return obj !== null && obj === obj.window;
  }

  function getWindow(elem) {
    return isWindow(elem) ? elem : elem.nodeType === 9 && elem.defaultView;
  }

  function isObject(value) {
    var type = typeof value;
    return type === 'function' || type === 'object' && !!value;
  }

  function isDOMNode(obj) {
    return isObject(obj) && obj.nodeType > 0;
  }

  function getWavesElements(nodes) {
    var stringRepr = toString.call(nodes);

    if (stringRepr === '[object String]') {
      return $$(nodes);
    } else if (isObject(nodes) && /^\[object (Array|HTMLCollection|NodeList|Object)\]$/.test(stringRepr) && nodes.hasOwnProperty('length')) {
      return nodes;
    } else if (isDOMNode(nodes)) {
      return [nodes];
    }

    return [];
  }

  function offset(elem) {
    var docElem,
        win,
        box = {
      top: 0,
      left: 0
    },
        doc = elem && elem.ownerDocument;
    docElem = doc.documentElement;

    if (typeof elem.getBoundingClientRect !== typeof undefined) {
      box = elem.getBoundingClientRect();
    }

    win = getWindow(doc);
    return {
      top: box.top + win.pageYOffset - docElem.clientTop,
      left: box.left + win.pageXOffset - docElem.clientLeft
    };
  }

  function convertStyle(styleObj) {
    var style = '';

    for (var prop in styleObj) {
      if (styleObj.hasOwnProperty(prop)) {
        style += prop + ':' + styleObj[prop] + ';';
      }
    }

    return style;
  }

  var Effect = {
    // Effect duration
    duration: 750,
    // Effect delay (check for scroll before showing effect)
    delay: 200,
    show: function (e, element, velocity) {
      // Disable right click
      if (e.button === 2) {
        return false;
      }

      element = element || this; // Create ripple

      var ripple = document.createElement('div');
      ripple.className = 'waves-ripple waves-rippling';
      element.appendChild(ripple); // Get click coordinate and element width

      var pos = offset(element);
      var relativeY = 0;
      var relativeX = 0; // Support for touch devices

      if ('touches' in e && e.touches.length) {
        relativeY = e.touches[0].pageY - pos.top;
        relativeX = e.touches[0].pageX - pos.left;
      } //Normal case
      else {
          relativeY = e.pageY - pos.top;
          relativeX = e.pageX - pos.left;
        } // Support for synthetic events


      relativeX = relativeX >= 0 ? relativeX : 0;
      relativeY = relativeY >= 0 ? relativeY : 0;
      var scale = 'scale(' + element.clientWidth / 100 * 3 + ')';
      var translate = 'translate(0,0)';

      if (velocity) {
        translate = 'translate(' + velocity.x + 'px, ' + velocity.y + 'px)';
      } // Attach data to element


      ripple.setAttribute('data-hold', Date.now());
      ripple.setAttribute('data-x', relativeX);
      ripple.setAttribute('data-y', relativeY);
      ripple.setAttribute('data-scale', scale);
      ripple.setAttribute('data-translate', translate); // Set ripple position

      var rippleStyle = {
        top: relativeY + 'px',
        left: relativeX + 'px'
      };
      ripple.classList.add('waves-notransition');
      ripple.setAttribute('style', convertStyle(rippleStyle));
      ripple.classList.remove('waves-notransition'); // Scale the ripple

      rippleStyle['-webkit-transform'] = scale + ' ' + translate;
      rippleStyle['-moz-transform'] = scale + ' ' + translate;
      rippleStyle['-ms-transform'] = scale + ' ' + translate;
      rippleStyle['-o-transform'] = scale + ' ' + translate;
      rippleStyle.transform = scale + ' ' + translate;
      rippleStyle.opacity = '1';
      var duration = e.type === 'mousemove' ? 2500 : Effect.duration;
      rippleStyle['-webkit-transition-duration'] = duration + 'ms';
      rippleStyle['-moz-transition-duration'] = duration + 'ms';
      rippleStyle['-o-transition-duration'] = duration + 'ms';
      rippleStyle['transition-duration'] = duration + 'ms';
      ripple.setAttribute('style', convertStyle(rippleStyle));
    },
    hide: function (e, element) {
      element = element || this;
      var ripples = element.getElementsByClassName('waves-rippling');

      for (var i = 0, len = ripples.length; i < len; i++) {
        removeRipple(e, element, ripples[i]);
      }

      if (isTouchAvailable) {
        element.removeEventListener('touchend', Effect.hide);
        element.removeEventListener('touchcancel', Effect.hide);
      }

      element.removeEventListener('mouseup', Effect.hide);
      element.removeEventListener('mouseleave', Effect.hide);
    }
  };
  /**
   * Collection of wrapper for HTML element that only have single tag
   * like <input> and <img>
   */

  var TagWrapper = {
    // Wrap <input> tag so it can perform the effect
    input: function (element) {
      var parent = element.parentNode; // If input already have parent just pass through

      if (parent.tagName.toLowerCase() === 'i' && parent.classList.contains('waves-effect')) {
        return;
      } // Put element class and style to the specified parent


      var wrapper = document.createElement('i');
      wrapper.className = element.className + ' waves-input-wrapper';
      element.className = 'waves-button-input'; // Put element as child

      parent.replaceChild(wrapper, element);
      wrapper.appendChild(element); // Apply element color and background color to wrapper

      var elementStyle = window.getComputedStyle(element, null);
      var color = elementStyle.color;
      var backgroundColor = elementStyle.backgroundColor;
      wrapper.setAttribute('style', 'color:' + color + ';background:' + backgroundColor);
      element.setAttribute('style', 'background-color:rgba(0,0,0,0);');
    },
    // Wrap <img> tag so it can perform the effect
    img: function (element) {
      var parent = element.parentNode; // If input already have parent just pass through

      if (parent.tagName.toLowerCase() === 'i' && parent.classList.contains('waves-effect')) {
        return;
      } // Put element as child


      var wrapper = document.createElement('i');
      parent.replaceChild(wrapper, element);
      wrapper.appendChild(element);
    }
  };
  /**
   * Hide the effect and remove the ripple. Must be
   * a separate function to pass the JSLint...
   */

  function removeRipple(e, el, ripple) {
    // Check if the ripple still exist
    if (!ripple) {
      return;
    }

    ripple.classList.remove('waves-rippling');
    var relativeX = ripple.getAttribute('data-x');
    var relativeY = ripple.getAttribute('data-y');
    var scale = ripple.getAttribute('data-scale');
    var translate = ripple.getAttribute('data-translate'); // Get delay beetween mousedown and mouse leave

    var diff = Date.now() - Number(ripple.getAttribute('data-hold'));
    var delay = 350 - diff;

    if (delay < 0) {
      delay = 0;
    }

    if (e.type === 'mousemove') {
      delay = 150;
    } // Fade out ripple after delay


    var duration = e.type === 'mousemove' ? 2500 : Effect.duration;
    setTimeout(function () {
      var style = {
        top: relativeY + 'px',
        left: relativeX + 'px',
        opacity: '0',
        // Duration
        '-webkit-transition-duration': duration + 'ms',
        '-moz-transition-duration': duration + 'ms',
        '-o-transition-duration': duration + 'ms',
        'transition-duration': duration + 'ms',
        '-webkit-transform': scale + ' ' + translate,
        '-moz-transform': scale + ' ' + translate,
        '-ms-transform': scale + ' ' + translate,
        '-o-transform': scale + ' ' + translate,
        'transform': scale + ' ' + translate
      };
      ripple.setAttribute('style', convertStyle(style));
      setTimeout(function () {
        try {
          el.removeChild(ripple);
        } catch (e) {
          return false;
        }
      }, duration);
    }, delay);
  }
  /**
   * Disable mousedown event for 500ms during and after touch
   */


  var TouchHandler = {
    /* uses an integer rather than bool so there's no issues with
     * needing to clear timeouts if another touch event occurred
     * within the 500ms. Cannot mouseup between touchstart and
     * touchend, nor in the 500ms after touchend. */
    touches: 0,
    allowEvent: function (e) {
      var allow = true;

      if (/^(mousedown|mousemove)$/.test(e.type) && TouchHandler.touches) {
        allow = false;
      }

      return allow;
    },
    registerEvent: function (e) {
      var eType = e.type;

      if (eType === 'touchstart') {
        TouchHandler.touches += 1; // push
      } else if (/^(touchend|touchcancel)$/.test(eType)) {
        setTimeout(function () {
          if (TouchHandler.touches) {
            TouchHandler.touches -= 1; // pop after 500ms
          }
        }, 500);
      }
    }
  };
  /**
   * Delegated click handler for .waves-effect element.
   * returns null when .waves-effect element not in "click tree"
   */

  function getWavesEffectElement(e) {
    if (TouchHandler.allowEvent(e) === false) {
      return null;
    }

    var element = null;
    var target = e.target || e.srcElement;

    while (target.parentElement) {
      if (!(target instanceof SVGElement) && target.classList.contains('waves-effect')) {
        element = target;
        break;
      }

      target = target.parentElement;
    }

    return element;
  }
  /**
   * Bubble the click and show effect if .waves-effect elem was found
   */


  function showEffect(e) {
    // Disable effect if element has "disabled" property on it
    // In some cases, the event is not triggered by the current element
    // if (e.target.getAttribute('disabled') !== null) {
    //     return;
    // }
    var element = getWavesEffectElement(e);

    if (element !== null) {
      // Make it sure the element has either disabled property, disabled attribute or 'disabled' class
      if (element.disabled || element.getAttribute('disabled') || element.classList.contains('disabled')) {
        return;
      }

      TouchHandler.registerEvent(e);

      if (e.type === 'touchstart' && Effect.delay) {
        var hidden = false;
        var timer = setTimeout(function () {
          timer = null;
          Effect.show(e, element);
        }, Effect.delay);

        var hideEffect = function (hideEvent) {
          // if touch hasn't moved, and effect not yet started: start effect now
          if (timer) {
            clearTimeout(timer);
            timer = null;
            Effect.show(e, element);
          }

          if (!hidden) {
            hidden = true;
            Effect.hide(hideEvent, element);
          }

          removeListeners();
        };

        var touchMove = function (moveEvent) {
          if (timer) {
            clearTimeout(timer);
            timer = null;
          }

          hideEffect(moveEvent);
          removeListeners();
        };

        element.addEventListener('touchmove', touchMove, false);
        element.addEventListener('touchend', hideEffect, false);
        element.addEventListener('touchcancel', hideEffect, false);

        var removeListeners = function () {
          element.removeEventListener('touchmove', touchMove);
          element.removeEventListener('touchend', hideEffect);
          element.removeEventListener('touchcancel', hideEffect);
        };
      } else {
        Effect.show(e, element);

        if (isTouchAvailable) {
          element.addEventListener('touchend', Effect.hide, false);
          element.addEventListener('touchcancel', Effect.hide, false);
        }

        element.addEventListener('mouseup', Effect.hide, false);
        element.addEventListener('mouseleave', Effect.hide, false);
      }
    }
  }

  Waves.init = function (options) {
    var body = document.body;
    options = options || {};

    if ('duration' in options) {
      Effect.duration = options.duration;
    }

    if ('delay' in options) {
      Effect.delay = options.delay;
    }

    if (isTouchAvailable) {
      body.addEventListener('touchstart', showEffect, false);
      body.addEventListener('touchcancel', TouchHandler.registerEvent, false);
      body.addEventListener('touchend', TouchHandler.registerEvent, false);
    }

    body.addEventListener('mousedown', showEffect, false);
  };
  /**
   * Attach Waves to dynamically loaded inputs, or add .waves-effect and other
   * waves classes to a set of elements. Set drag to true if the ripple mouseover
   * or skimming effect should be applied to the elements.
   */


  Waves.attach = function (elements, classes) {
    elements = getWavesElements(elements);

    if (toString.call(classes) === '[object Array]') {
      classes = classes.join(' ');
    }

    classes = classes ? ' ' + classes : '';
    var element, tagName;

    for (var i = 0, len = elements.length; i < len; i++) {
      element = elements[i];
      tagName = element.tagName.toLowerCase();

      if (['input', 'img'].indexOf(tagName) !== -1) {
        TagWrapper[tagName](element);
        element = element.parentElement;
      }

      if (element.className.indexOf('waves-effect') === -1) {
        element.className += ' waves-effect' + classes;
      }
    }
  };
  /**
   * Cause a ripple to appear in an element via code.
   */


  Waves.ripple = function (elements, options) {
    elements = getWavesElements(elements);
    var elementsLen = elements.length;
    options = options || {};
    options.wait = options.wait || 0;
    options.position = options.position || null; // default = centre of element

    if (elementsLen) {
      var element,
          pos,
          off,
          centre = {},
          i = 0;
      var mousedown = {
        type: 'mousedown',
        button: 1
      };

      var hideRipple = function (mouseup, element) {
        return function () {
          Effect.hide(mouseup, element);
        };
      };

      for (; i < elementsLen; i++) {
        element = elements[i];
        pos = options.position || {
          x: element.clientWidth / 2,
          y: element.clientHeight / 2
        };
        off = offset(element);
        centre.x = off.left + pos.x;
        centre.y = off.top + pos.y;
        mousedown.pageX = centre.x;
        mousedown.pageY = centre.y;
        Effect.show(mousedown, element);

        if (options.wait >= 0 && options.wait !== null) {
          var mouseup = {
            type: 'mouseup',
            button: 1
          };
          setTimeout(hideRipple(mouseup, element), options.wait);
        }
      }
    }
  };
  /**
   * Remove all ripples from an element.
   */


  Waves.calm = function (elements) {
    elements = getWavesElements(elements);
    var mouseup = {
      type: 'mouseup',
      button: 1
    };

    for (var i = 0, len = elements.length; i < len; i++) {
      Effect.hide(mouseup, elements[i]);
    }
  };
  /**
   * Deprecated API fallback
   */


  Waves.displayEffect = function (options) {
    console.error('Waves.displayEffect() has been deprecated and will be removed in future version. Please use Waves.init() to initialize Waves effect');
    Waves.init(options);
  };

  return Waves;
});

!function (e, t) {
  'object' == typeof exports && 'object' == typeof module ? module.exports = t() : 'function' == typeof define && define.amd ? define([], t) : 'object' == typeof exports ? exports.AOS = t() : e.AOS = t();
}(this, function () {
  return function (e) {
    function t(o) {
      if (n[o]) return n[o].exports;
      var i = n[o] = {
        exports: {},
        id: o,
        loaded: !1
      };
      return e[o].call(i.exports, i, i.exports, t), i.loaded = !0, i.exports;
    }

    var n = {};
    return t.m = e, t.c = n, t.p = 'dist/', t(0);
  }([function (e, t, n) {
    'use strict';

    function o(e) {
      return e && e.__esModule ? e : {
        default: e
      };
    }

    var i = Object.assign || function (e) {
      for (var t = 1; t < arguments.length; t++) {
        var n = arguments[t];

        for (var o in n) {
          Object.prototype.hasOwnProperty.call(n, o) && (e[o] = n[o]);
        }
      }

      return e;
    },
        r = n(1),
        a = (o(r), n(6)),
        u = o(a),
        c = n(7),
        f = o(c),
        s = n(8),
        d = o(s),
        l = n(9),
        p = o(l),
        m = n(10),
        b = o(m),
        v = n(11),
        y = o(v),
        g = n(14),
        h = o(g),
        w = [],
        k = !1,
        x = document.all && !window.atob,
        j = {
      offset: 120,
      delay: 0,
      easing: 'ease',
      duration: 400,
      disable: !1,
      once: !1,
      startEvent: 'DOMContentLoaded',
      throttleDelay: 99,
      debounceDelay: 50,
      disableMutationObserver: !1
    },
        O = function () {
      var e = arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
      if (e && (k = !0), k) return w = (0, y.default)(w, j), (0, b.default)(w, j.once), w;
    },
        _ = function () {
      w = (0, h.default)(), O();
    },
        S = function () {
      w.forEach(function (e, t) {
        e.node.removeAttribute('data-aos'), e.node.removeAttribute('data-aos-easing'), e.node.removeAttribute('data-aos-duration'), e.node.removeAttribute('data-aos-delay');
      });
    },
        z = function (e) {
      return e === !0 || 'mobile' === e && p.default.mobile() || 'phone' === e && p.default.phone() || 'tablet' === e && p.default.tablet() || 'function' == typeof e && e() === !0;
    },
        A = function (e) {
      return j = i(j, e), w = (0, h.default)(), z(j.disable) || x ? S() : (document.querySelector('body').setAttribute('data-aos-easing', j.easing), document.querySelector('body').setAttribute('data-aos-duration', j.duration), document.querySelector('body').setAttribute('data-aos-delay', j.delay), 'DOMContentLoaded' === j.startEvent && ['complete', 'interactive'].indexOf(document.readyState) > -1 ? O(!0) : 'load' === j.startEvent ? window.addEventListener(j.startEvent, function () {
        O(!0);
      }) : document.addEventListener(j.startEvent, function () {
        O(!0);
      }), window.addEventListener('resize', (0, f.default)(O, j.debounceDelay, !0)), window.addEventListener('orientationchange', (0, f.default)(O, j.debounceDelay, !0)), window.addEventListener('scroll', (0, u.default)(function () {
        (0, b.default)(w, j.once);
      }, j.throttleDelay)), j.disableMutationObserver || (0, d.default)('[data-aos]', _), w);
    };

    e.exports = {
      init: A,
      refresh: O,
      refreshHard: _
    };
  }, function (e, t) {},,,,, function (e, t) {
    (function (t) {
      'use strict';

      function n(e, t, n) {
        function o(t) {
          var n = b,
              o = v;
          return b = v = void 0, k = t, g = e.apply(o, n);
        }

        function r(e) {
          return k = e, h = setTimeout(s, t), _ ? o(e) : g;
        }

        function a(e) {
          var n = e - w,
              o = e - k,
              i = t - n;
          return S ? j(i, y - o) : i;
        }

        function c(e) {
          var n = e - w,
              o = e - k;
          return void 0 === w || n >= t || n < 0 || S && o >= y;
        }

        function s() {
          var e = O();
          return c(e) ? d(e) : void (h = setTimeout(s, a(e)));
        }

        function d(e) {
          return h = void 0, z && b ? o(e) : (b = v = void 0, g);
        }

        function l() {
          void 0 !== h && clearTimeout(h), k = 0, b = w = v = h = void 0;
        }

        function p() {
          return void 0 === h ? g : d(O());
        }

        function m() {
          var e = O(),
              n = c(e);

          if (b = arguments, v = this, w = e, n) {
            if (void 0 === h) return r(w);
            if (S) return h = setTimeout(s, t), o(w);
          }

          return void 0 === h && (h = setTimeout(s, t)), g;
        }

        var b,
            v,
            y,
            g,
            h,
            w,
            k = 0,
            _ = !1,
            S = !1,
            z = !0;

        if ('function' != typeof e) throw new TypeError(f);
        return t = u(t) || 0, i(n) && (_ = !!n.leading, S = 'maxWait' in n, y = S ? x(u(n.maxWait) || 0, t) : y, z = 'trailing' in n ? !!n.trailing : z), m.cancel = l, m.flush = p, m;
      }

      function o(e, t, o) {
        var r = !0,
            a = !0;
        if ('function' != typeof e) throw new TypeError(f);
        return i(o) && (r = 'leading' in o ? !!o.leading : r, a = 'trailing' in o ? !!o.trailing : a), n(e, t, {
          leading: r,
          maxWait: t,
          trailing: a
        });
      }

      function i(e) {
        var t = 'undefined' == typeof e ? 'undefined' : c(e);
        return !!e && ('object' == t || 'function' == t);
      }

      function r(e) {
        return !!e && 'object' == ('undefined' == typeof e ? 'undefined' : c(e));
      }

      function a(e) {
        return 'symbol' == ('undefined' == typeof e ? 'undefined' : c(e)) || r(e) && k.call(e) == d;
      }

      function u(e) {
        if ('number' == typeof e) return e;
        if (a(e)) return s;

        if (i(e)) {
          var t = 'function' == typeof e.valueOf ? e.valueOf() : e;
          e = i(t) ? t + '' : t;
        }

        if ('string' != typeof e) return 0 === e ? e : +e;
        e = e.replace(l, '');
        var n = m.test(e);
        return n || b.test(e) ? v(e.slice(2), n ? 2 : 8) : p.test(e) ? s : +e;
      }

      var c = 'function' == typeof Symbol && 'symbol' == typeof Symbol.iterator ? function (e) {
        return typeof e;
      } : function (e) {
        return e && 'function' == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? 'symbol' : typeof e;
      },
          f = 'Expected a function',
          s = NaN,
          d = '[object Symbol]',
          l = /^\s+|\s+$/g,
          p = /^[-+]0x[0-9a-f]+$/i,
          m = /^0b[01]+$/i,
          b = /^0o[0-7]+$/i,
          v = parseInt,
          y = 'object' == ('undefined' == typeof t ? 'undefined' : c(t)) && t && t.Object === Object && t,
          g = 'object' == ('undefined' == typeof self ? 'undefined' : c(self)) && self && self.Object === Object && self,
          h = y || g || Function('return this')(),
          w = Object.prototype,
          k = w.toString,
          x = Math.max,
          j = Math.min,
          O = function () {
        return h.Date.now();
      };

      e.exports = o;
    }).call(t, function () {
      return this;
    }());
  }, function (e, t) {
    (function (t) {
      'use strict';

      function n(e, t, n) {
        function i(t) {
          var n = b,
              o = v;
          return b = v = void 0, O = t, g = e.apply(o, n);
        }

        function r(e) {
          return O = e, h = setTimeout(s, t), _ ? i(e) : g;
        }

        function u(e) {
          var n = e - w,
              o = e - O,
              i = t - n;
          return S ? x(i, y - o) : i;
        }

        function f(e) {
          var n = e - w,
              o = e - O;
          return void 0 === w || n >= t || n < 0 || S && o >= y;
        }

        function s() {
          var e = j();
          return f(e) ? d(e) : void (h = setTimeout(s, u(e)));
        }

        function d(e) {
          return h = void 0, z && b ? i(e) : (b = v = void 0, g);
        }

        function l() {
          void 0 !== h && clearTimeout(h), O = 0, b = w = v = h = void 0;
        }

        function p() {
          return void 0 === h ? g : d(j());
        }

        function m() {
          var e = j(),
              n = f(e);

          if (b = arguments, v = this, w = e, n) {
            if (void 0 === h) return r(w);
            if (S) return h = setTimeout(s, t), i(w);
          }

          return void 0 === h && (h = setTimeout(s, t)), g;
        }

        var b,
            v,
            y,
            g,
            h,
            w,
            O = 0,
            _ = !1,
            S = !1,
            z = !0;

        if ('function' != typeof e) throw new TypeError(c);
        return t = a(t) || 0, o(n) && (_ = !!n.leading, S = 'maxWait' in n, y = S ? k(a(n.maxWait) || 0, t) : y, z = 'trailing' in n ? !!n.trailing : z), m.cancel = l, m.flush = p, m;
      }

      function o(e) {
        var t = 'undefined' == typeof e ? 'undefined' : u(e);
        return !!e && ('object' == t || 'function' == t);
      }

      function i(e) {
        return !!e && 'object' == ('undefined' == typeof e ? 'undefined' : u(e));
      }

      function r(e) {
        return 'symbol' == ('undefined' == typeof e ? 'undefined' : u(e)) || i(e) && w.call(e) == s;
      }

      function a(e) {
        if ('number' == typeof e) return e;
        if (r(e)) return f;

        if (o(e)) {
          var t = 'function' == typeof e.valueOf ? e.valueOf() : e;
          e = o(t) ? t + '' : t;
        }

        if ('string' != typeof e) return 0 === e ? e : +e;
        e = e.replace(d, '');
        var n = p.test(e);
        return n || m.test(e) ? b(e.slice(2), n ? 2 : 8) : l.test(e) ? f : +e;
      }

      var u = 'function' == typeof Symbol && 'symbol' == typeof Symbol.iterator ? function (e) {
        return typeof e;
      } : function (e) {
        return e && 'function' == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? 'symbol' : typeof e;
      },
          c = 'Expected a function',
          f = NaN,
          s = '[object Symbol]',
          d = /^\s+|\s+$/g,
          l = /^[-+]0x[0-9a-f]+$/i,
          p = /^0b[01]+$/i,
          m = /^0o[0-7]+$/i,
          b = parseInt,
          v = 'object' == ('undefined' == typeof t ? 'undefined' : u(t)) && t && t.Object === Object && t,
          y = 'object' == ('undefined' == typeof self ? 'undefined' : u(self)) && self && self.Object === Object && self,
          g = v || y || Function('return this')(),
          h = Object.prototype,
          w = h.toString,
          k = Math.max,
          x = Math.min,
          j = function () {
        return g.Date.now();
      };

      e.exports = n;
    }).call(t, function () {
      return this;
    }());
  }, function (e, t) {
    'use strict';

    function n(e, t) {
      var n = new r(o);
      a = t, n.observe(i.documentElement, {
        childList: !0,
        subtree: !0,
        removedNodes: !0
      });
    }

    function o(e) {
      e && e.forEach(function (e) {
        var t = Array.prototype.slice.call(e.addedNodes),
            n = Array.prototype.slice.call(e.removedNodes),
            o = t.concat(n).filter(function (e) {
          return e.hasAttribute && e.hasAttribute('data-aos');
        }).length;
        o && a();
      });
    }

    Object.defineProperty(t, '__esModule', {
      value: !0
    });

    var i = window.document,
        r = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver,
        a = function () {};

    t.default = n;
  }, function (e, t) {
    'use strict';

    function n(e, t) {
      if (!(e instanceof t)) throw new TypeError('Cannot call a class as a function');
    }

    function o() {
      return navigator.userAgent || navigator.vendor || window.opera || '';
    }

    Object.defineProperty(t, '__esModule', {
      value: !0
    });

    var i = function () {
      function e(e, t) {
        for (var n = 0; n < t.length; n++) {
          var o = t[n];
          o.enumerable = o.enumerable || !1, o.configurable = !0, 'value' in o && (o.writable = !0), Object.defineProperty(e, o.key, o);
        }
      }

      return function (t, n, o) {
        return n && e(t.prototype, n), o && e(t, o), t;
      };
    }(),
        r = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i,
        a = /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i,
        u = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i,
        c = /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i,
        f = function () {
      function e() {
        n(this, e);
      }

      return i(e, [{
        key: 'phone',
        value: function () {
          var e = o();
          return !(!r.test(e) && !a.test(e.substr(0, 4)));
        }
      }, {
        key: 'mobile',
        value: function () {
          var e = o();
          return !(!u.test(e) && !c.test(e.substr(0, 4)));
        }
      }, {
        key: 'tablet',
        value: function () {
          return this.mobile() && !this.phone();
        }
      }]), e;
    }();

    t.default = new f();
  }, function (e, t) {
    'use strict';

    Object.defineProperty(t, '__esModule', {
      value: !0
    });

    var n = function (e, t, n) {
      var o = e.node.getAttribute('data-aos-once');
      t > e.position ? e.node.classList.add('aos-animate') : 'undefined' != typeof o && ('false' === o || !n && 'true' !== o) && e.node.classList.remove('aos-animate');
    },
        o = function (e, t) {
      var o = window.pageYOffset,
          i = window.innerHeight;
      e.forEach(function (e, r) {
        n(e, i + o, t);
      });
    };

    t.default = o;
  }, function (e, t, n) {
    'use strict';

    function o(e) {
      return e && e.__esModule ? e : {
        default: e
      };
    }

    Object.defineProperty(t, '__esModule', {
      value: !0
    });

    var i = n(12),
        r = o(i),
        a = function (e, t) {
      return e.forEach(function (e, n) {
        e.node.classList.add('aos-init'), e.position = (0, r.default)(e.node, t.offset);
      }), e;
    };

    t.default = a;
  }, function (e, t, n) {
    'use strict';

    function o(e) {
      return e && e.__esModule ? e : {
        default: e
      };
    }

    Object.defineProperty(t, '__esModule', {
      value: !0
    });

    var i = n(13),
        r = o(i),
        a = function (e, t) {
      var n = 0,
          o = 0,
          i = window.innerHeight,
          a = {
        offset: e.getAttribute('data-aos-offset'),
        anchor: e.getAttribute('data-aos-anchor'),
        anchorPlacement: e.getAttribute('data-aos-anchor-placement')
      };

      switch (a.offset && !isNaN(a.offset) && (o = parseInt(a.offset)), a.anchor && document.querySelectorAll(a.anchor) && (e = document.querySelectorAll(a.anchor)[0]), n = (0, r.default)(e).top, a.anchorPlacement) {
        case 'top-bottom':
          break;

        case 'center-bottom':
          n += e.offsetHeight / 2;
          break;

        case 'bottom-bottom':
          n += e.offsetHeight;
          break;

        case 'top-center':
          n += i / 2;
          break;

        case 'bottom-center':
          n += i / 2 + e.offsetHeight;
          break;

        case 'center-center':
          n += i / 2 + e.offsetHeight / 2;
          break;

        case 'top-top':
          n += i;
          break;

        case 'bottom-top':
          n += e.offsetHeight + i;
          break;

        case 'center-top':
          n += e.offsetHeight / 2 + i;
      }

      return a.anchorPlacement || a.offset || isNaN(t) || (o = t), n + o;
    };

    t.default = a;
  }, function (e, t) {
    'use strict';

    Object.defineProperty(t, '__esModule', {
      value: !0
    });

    var n = function (e) {
      for (var t = 0, n = 0; e && !isNaN(e.offsetLeft) && !isNaN(e.offsetTop);) {
        t += e.offsetLeft - ('BODY' != e.tagName ? e.scrollLeft : 0), n += e.offsetTop - ('BODY' != e.tagName ? e.scrollTop : 0), e = e.offsetParent;
      }

      return {
        top: n,
        left: t
      };
    };

    t.default = n;
  }, function (e, t) {
    'use strict';

    Object.defineProperty(t, '__esModule', {
      value: !0
    });

    var n = function (e) {
      return e = e || document.querySelectorAll('[data-aos]'), Array.prototype.map.call(e, function (e) {
        return {
          node: e
        };
      });
    };

    t.default = n;
  }]);
});

(function ($) {
  $.fn.collapsible = function (options) {
    var settings = $.extend({
      onlyOneActive: false,
      animInDuration: 250,
      animOutDuration: 250,
      onOpenStart: function () {},
      onOpenEnd: function () {},
      onCloseStart: function () {},
      onCloseEnd: function () {}
    }, options);
    $(this).each(function () {
      createCollapsible($(this));
    });

    function createCollapsible($this) {
      var collapsible = $this;
      var header = $(collapsible).find('.collapsible-header');
      var bodies = $(collapsible).find('.collapsible-body');
      $(header).unbind('click').click(function () {
        var body = $(this).siblings('.collapsible-body');
        var collapsibleItem = body.parent();

        if (collapsibleItem.hasClass('active')) {
          // Close Collapsible
          body.slideUp({
            duration: settings.animOutDuration,
            start: function () {
              settings.onCloseStart();
            },
            done: function () {
              settings.onCloseEnd();
            }
          });
          collapsibleItem.removeClass('active');
        } else {
          // Open Collapisble
          body.slideDown({
            duration: settings.animInDuration,
            start: function () {
              settings.onOpenStart();
            },
            done: function () {
              settings.onOpenEnd();
            }
          });
          collapsibleItem.addClass('active');
        }

        if (settings.onlyOneActive) {
          $(bodies).not(body).parent().removeClass('active');
          $(bodies).not(body).slideUp(settings.animOutDuration);
        }
      });
      $(header).filter('.active').click();
    }
  };
})(jQuery);

(function ($, anim) {
  $.fn.dropdown = function (options) {
    var settings = $.extend({
      coverTrigger: false,
      animInDuration: 500,
      animOutDuration: 500,
      hoverClass: '',
      onOpenStart: function () {},
      onOpenEnd: function () {},
      onCloseStart: function () {},
      onCloseEnd: function () {}
    }, options);
    $(this).each(function () {
      createDropdown($(this));
    });

    function createDropdown($this) {
      var dropdown = $this;
      var trigger = $(".dropdown-trigger[href='#" + $(dropdown).attr('id') + "']");
      var animationDone = false;
      var open = false;
      $(trigger).click(function (e) {
        e.preventDefault();

        if (open && animationDone) {
          _close();
        } else {
          animationDone = false;
          var offsetTop = $(trigger).offset().top;

          if (!settings.coverTrigger) {
            offsetTop = $(trigger).offset().top + $(trigger).outerHeight() + 5;
          }

          $(dropdown).css({
            top: offsetTop,
            left: $(trigger).offset().left
          });

          _open();
        }
      });
      var dropdownItems = $(dropdown).children('.dropdown-item');

      if (settings.hoverClass != '') {
        $(dropdownItems).mouseenter(function () {
          $(this).addClass(settings.hoverClass);
        }).mouseleave(function () {
          $(this).removeClass(settings.hoverClass);
        });
      }

      $(document).on('click', function () {
        if (open) {
          setTimeout(function () {
            _close();
          }, 75);
        }
      });
      $(trigger).keydown(function (e) {
        e.preventDefault();

        if (e.which == Keys.down || e.which == Keys.up && open) {
          var focusedDropdownItemIndex = $(dropdownItems).is('.focused') ? $(dropdownItems).filter('.focused').index() : -1;
          $(dropdownItems).removeClass('focused');

          if (e.which == Keys.down) {
            $(dropdownItems).eq(focusedDropdownItemIndex + 1).addClass('focused');
          } else {
            $(dropdownItems).eq(focusedDropdownItemIndex - 1).addClass('focused');
          }
        } else if (e.which == Keys.enter && open) {
          var _focusedDropdownItemIndex = $(dropdownItems).is('.focused') ? $(dropdownItems).filter('.focused').index() : -1;

          window.location.href = $(dropdownItems).eq(_focusedDropdownItemIndex).children('a').attr('href');

          _close();
        } else if (e.which == Keys.tab && open) {
          _close();
        }
      });

      function _close() {
        anim({
          targets: $(dropdown)[0],
          opacity: {
            value: 0,
            easing: 'easeOutQuint'
          },
          scaleX: 0.3,
          scaleY: 0.3,
          easing: 'easeOutQuint',
          duration: settings.animOutDuration,
          begin: function () {
            animationDone = false;
            settings.onCloseStart();
          },
          complete: function () {
            animationDone = true;
            open = false;
            settings.onCloseEnd();
          }
        });
      }

      function _open() {
        anim({
          targets: $(dropdown)[0],
          opacity: {
            value: [0, 1],
            easing: 'easeOutQuad'
          },
          scaleX: [0.3, 1],
          scaleY: [0.3, 1],
          easing: 'easeOutQuint',
          duration: settings.animInDuration,
          complete: function () {
            animationDone = true;
            open = true;
            settings.onOpenEnd();
          },
          begin: function () {
            $(dropdown).css('display', 'block');
            open = false;
            settings.onOpenStart();
          }
        });
      }

      $(window).resize(function () {
        _close();
      });
    }
  };
})(jQuery, anime);

(function ($, anim) {
  $.fn.modal = function (options) {
    var settings = $.extend({
      animInDuration: 500,
      animOutDuration: 500,
      topOffset: '10%',
      showOverlay: true,
      dismissable: true,
      onOpenStart: function () {},
      onOpenEnd: function () {},
      onCloseStart: function () {},
      onCloseEnd: function () {}
    }, options);
    $(this).each(function () {
      createModal($(this));
    });

    function createModal($this) {
      var modal = $this;
      var modalDialog = $this.find('.modal-dialog');
      var modalTrigger = $("a[href='#".concat(modal.attr('id'), "'].modal-trigger, button[data-target='#").concat(modal.attr('id'), "']"));
      modalDialog.css('margin-top', settings.topOffset);
      if (settings.showOverlay) $(modal).css('background-color', 'rgba(0, 0, 0, 0.5)');
      $(modalTrigger).click(function () {
        _open();
      });
      $(document).on('click touchstart', function (event) {
        if (!$(event.target).closest(modalDialog).length && $(modal).css('opacity') == '1' && settings.dismissable) {
          _close();
        }
      });
      $("a[href='#" + $(modal).attr('id') + "'].modal-close").click(function () {
        _close();
      }); // Modal Close

      function _close() {
        $(modalDialog).removeClass('show');
        anim({
          targets: $(modal)[0],
          opacity: 0,
          easing: 'easeOutQuart',
          duration: settings.animOutDuration,
          complete: function () {
            $(modal).css('display', 'none');
            settings.onCloseEnd();
          },
          begin: function () {
            settings.onCloseStart();
          }
        });
      } // Modal Open


      function _open() {
        $(modal).css('display', 'block');
        anim({
          targets: $(modal)[0],
          duration: settings.animInDuration,
          easing: 'easeOutQuad',
          opacity: 1,
          complete: function () {
            settings.onOpenEnd();
          },
          begin: function () {
            settings.onOpenStart();
            $(modalDialog).addClass('show');
          }
        });
      }
    }
  };
})(jQuery, anime);

jQuery.fn.extend({
  tabs: function (options) {
    var settings = $.extend({
      animDuration: 300,
      preActive: '',
      tabActiveClass: '',
      tabIndicatorClass: ''
    }, options);
    $(this).each(function () {
      createTab($(this));
    });

    function createTab($this) {
      var tabs = $this;
      var indicator = $("<div class='tab-indicator' />").addClass(settings.tabIndicatorClass);
      $(tabs).append(indicator);
      var tab = $(tabs).find('.tab');
      var tabContent = $('<div />');
      $(tab).each(function () {
        $(tabContent).append($($('.tab-content').filter($(this).attr('href'))[0]));
      });
      tabContent = $(tabContent).children();
      $(tabContent).insertAfter(tabs);
      $(tab).click(function (e) {
        e.preventDefault();
        $(this).addClass('active').siblings('.active').removeClass('active');
        $(indicator).css({
          top: $(this).position().top + $(this).height() - $(indicator).height(),
          left: $(this).position().left,
          right: $(tabs).outerWidth() - ($(this).position().left + $(this).outerWidth())
        });
        $(tabContent).filter($(this).attr('href')).addClass('active').fadeIn(settings.animDuration);

        if (settings.tabActiveClass != '') {
          $(tab).filter('.active').addClass(settings.tabActiveClass);
          $(tab).not('.active').removeClass(settings.tabActiveClass);
        }

        $(tabContent).not($(this).attr('href')).removeClass('active').css('display', 'none');
      });

      if (settings.preActive == '') {
        $(tab).eq(0).click();
      } else {
        $(tab).filter("a[href='" + settings.preActive + "']").click();
      }

      $(window).resize(function () {
        var activeTab = $(tab).filter('.active');
        $(indicator).css({
          top: $(activeTab).position().top + $(activeTab).height() - $(indicator).height(),
          left: $(activeTab).position().left,
          right: $(tabs).outerWidth() - ($(activeTab).position().left + $(activeTab).outerWidth())
        });
      });
    }
  }
});

(function ($, anim) {
  $.fn.sidenav = function (options) {
    var settings = $.extend({
      animInDuration: 500,
      animOutDuration: 500,
      width: '300px',
      edge: 'left',
      onOpenStart: function () {},
      onOpenEnd: function () {},
      onCloseStart: function () {},
      onCloseEnd: function () {}
    }, options);
    $(this).each(function () {
      setupSidenav($(this));
    });

    function setupSidenav($this) {
      var sidebar = $this;
      var open = false;
      var sidenavTrigger = $("a[href='#".concat(sidebar.attr('id'), "'].sidenav-trigger, button[data-target='#").concat(sidebar.attr('id'), "'].modal-trigger"));
      sidebar.css('width', settings.width);
      sidenavTrigger.click(function () {
        _open();
      });
      $(document).on('click touchstart', function (event) {
        if (!$(event.target).closest(sidebar).length && open) {
          _close();
        }
      });
      sidebar.find('.sidenav-close').click(function () {
        _close();
      }); // Sidenav Open

      function _open() {
        $(sidebar).css('display', 'block');

        if (settings.edge == 'left') {
          $(sidebar).css('left', '-100%');
          anim({
            targets: $(sidebar)[0],
            left: 0,
            duration: settings.animInDuration,
            easing: 'easeOutQuad',
            begin: function () {
              settings.onOpenStart();
            },
            complete: function () {
              open = true;
              settings.onOpenEnd();
            }
          });
        } else if (settings.edge == 'right') {
          $(sidebar).css('right', '-100%');
          anim({
            targets: $(sidebar)[0],
            right: 0,
            duration: settings.animInDuration,
            easing: 'easeOutQuad',
            complete: function () {
              open = true;
            }
          });
        }

        $(sidebar).after("<div class='sidenav-overlay' />");
        anim({
          targets: $(sidebar).next('.sidenav-overlay')[0],
          opacity: 0.5,
          duration: settings.animInDuration,
          easing: 'easeOutQuad'
        });
      } // Sidenav Close


      function _close() {
        if (settings.edge == 'left') {
          anim({
            targets: $(sidebar)[0],
            left: '-100%',
            duration: settings.animOutDuration,
            easing: 'easeInCubic',
            complete: function () {
              $(sidebar).css('display', 'none');
              open = false;
            }
          });
        } else if (settings.edge == 'right') {
          anim({
            targets: $(sidebar)[0],
            right: '-100%',
            duration: settings.animOutDuration,
            easing: 'easeInCubic',
            begin: function () {
              settings.onCloseStart();
            },
            complete: function () {
              $(sidebar).css('display', 'none');
              open = false;
              settings.onCloseEnd();
            }
          });
        }

        anim({
          targets: $(sidebar).next('.sidenav-overlay')[0],
          opacity: 0,
          duration: settings.animInDuration,
          easing: 'easeInCubic',
          complete: function () {
            $(sidebar).next('.sidenav-overlay').remove();
          }
        });
      }
    }
  };
})(jQuery, anime);

(function ($) {
  $.fn.carousel = function (options) {
    var settings = $.extend({
      showIndicators: true,
      interval: ''
    }, options);
    $(this).each(function () {
      createCarousel($(this));
    });

    function createCarousel($this) {
      var carousel = $this;
      var carouselNext = $(carousel).find('.carousel-controls').find('.carousel-next');
      var carouselPrev = $(carousel).find('.carousel-controls').find('.carousel-prev');
      var carouselItems = $(carousel).find('.carousel-inner').children('.carousel-item');
      var carouselIndicators;
      $(carouselItems).first().addClass('active');

      if (settings.showIndicators) {
        $(carousel).append("<ol class='carousel-indicators'></ol>");
        $(carouselItems).each(function () {
          $(carousel).find('.carousel-indicators').append('<li></li>');
        });
        carouselIndicators = $(carousel).find('.carousel-indicators').children('li');
        $(carouselIndicators).first().addClass('active');
        $(carouselIndicators).click(function () {
          $(this).addClass('active').siblings('.active').removeClass('active');
          $(carouselItems).eq($(this).index()).addClass('active').siblings('.active').removeClass('active');
        });
      }

      $(carouselNext).click(function () {
        var carouselItemActive = $(carouselItems).siblings('.carousel-item.active');
        $(carouselItemActive).siblings('.active').removeClass('active');

        if ($(carouselItemActive).index() == $(carouselItems).length - 1) {
          $(carouselItems).eq(0).addClass('active');
          if (settings.showIndicators) $(carouselIndicators).eq(0).addClass('active').siblings('.active').removeClass('active');
        } else {
          $(carouselItems).eq($(carouselItemActive).index() + 1).addClass('active');
          if (settings.showIndicators) $(carouselIndicators).eq($(carouselItemActive).index() + 1).addClass('active').siblings('.active').removeClass('active');
        }

        $(carouselItemActive).removeClass('active');
      });
      $(carouselPrev).click(function () {
        var carouselItemActive = $(carouselItems).siblings('.carousel-item.active');
        $(carouselItemActive).siblings('.active').removeClass('active');

        if ($(carouselItemActive).index() == 0) {
          $(carouselItems).eq($(carouselItems).length - 1).addClass('active');
          if (settings.showIndicators) $(carouselIndicators).eq($(carouselItems).length - 1).addClass('active').siblings('.active').removeClass('active');
        } else {
          $(carouselItems).eq($(carouselItemActive).index() - 1).addClass('active');
          if (settings.showIndicators) $(carouselIndicators).eq($(carouselItemActive).index() - 1).addClass('active').siblings('.active').removeClass('active');
        }

        $(carouselItemActive).removeClass('active');
      });

      if (settings.interval != '') {
        setInterval(function () {
          var carouselItemActive = $(carouselItems).siblings('.carousel-item.active');
          $(carouselItemActive).siblings('.active').removeClass('active');

          if ($(carouselItemActive).index() == $(carouselItems).length - 1) {
            $(carouselItems).eq(0).addClass('active');
            if (settings.showIndicators) $(carouselIndicators).eq(0).addClass('active').siblings('.active').removeClass('active');
          } else {
            $(carouselItems).eq($(carouselItemActive).index() + 1).addClass('active');
            if (settings.showIndicators) $(carouselIndicators).eq($(carouselItemActive).index() + 1).addClass('active').siblings('.active').removeClass('active');
          }

          $(carouselItemActive).removeClass('active');
        }, settings.interval);
      }
    }
  };
})(jQuery);

(function ($, anim) {
  $.fn.lightbox = function (options) {
    var settings = $.extend({
      showControls: true,
      animInDuration: 600,
      animOutDuration: 600
    }, options);
    $(this).each(function () {
      createLightbox($(this));
    });

    function createLightbox($this) {
      var lightboxContainer = $this;
      var images = $(lightboxContainer).find('img');
      var lightbox = $("<div class='lightbox-ui' data-lightbox='".concat(lightboxContainer.attr('id'), "' id='").concat(lightboxContainer.attr('id'), "-lightbox' />")).append("<div class='lightbox-images' />");
      lightbox.insertAfter(lightboxContainer);
      var lightboxImagesContainer = lightbox.find('div.lightbox-images');
      var left = $("<span class='left' />");
      var right = $("<span class='right' />");
      var topbar = $("<div class='top-bar'>").append("<span class='lightbox-counter' />").append("<span class='lightbox-close' />").append("<span class='lightbox-fullscreen' />");
      var isFullscreen = false;
      $(images).each(function () {
        $(lightboxImagesContainer).append("<img src='" + $(this).attr('src') + "' />");
      });
      var lightboxImages = $(lightboxImagesContainer).children('img');
      lightbox.append(topbar);
      $(topbar).find('.lightbox-close').click(function () {
        closeLightbox();
      });
      $(topbar).find('.lightbox-fullscreen').click(function () {
        if (isFullscreen) {
          closeFullscreen();
          isFullscreen = false;
        } else {
          openFullscreen(document.getElementById(lightbox.attr('id')));
          isFullscreen = true;
        }
      });
      $(images).click(function () {
        lightbox.addClass('active');
        anim({
          targets: lightbox[0],
          opacity: 1,
          easing: 'easeOutQuad',
          duration: settings.animInDuration
        });
        var selectedImage = $(this);
        var imageActive = lightboxImages.eq($(images).index(selectedImage));
        $(imageActive).addClass('active').siblings('.active').removeClass('active');
        anim({
          targets: $(imageActive)[0],
          width: ['40%', '100%'],
          height: ['40%', '100%'],
          duration: settings.animInDuration,
          easing: 'easeInOutQuad'
        });

        if (settings.showControls) {
          $(topbar).find('.lightbox-counter').text($(images).index(this) + 1 + '/' + $(lightboxImages).length);
        }
      });

      if (settings.showControls) {
        lightbox.append(left).append(right);
        $(right).click(function () {
          var imageActive = $(lightboxImages).siblings('.active');
          $(imageActive).siblings('.active').removeClass('active');

          if ($(imageActive).index() == $(lightboxImages).length - 1) {
            $(lightboxImages).eq(0).addClass('active').siblings('.active').removeClass('active');
            $(topbar).find('.lightbox-counter').text(1 + '/' + $(lightboxImages).length);
          } else {
            $(lightboxImages).eq($(imageActive).index() + 1).addClass('active');
            $(topbar).find('.lightbox-counter').text($(imageActive).index() + 2 + '/' + $(lightboxImages).length);
          }

          $(imageActive).removeClass('active');
        });
        $(left).click(function () {
          var imageActive = $(lightboxImages).siblings('.active');
          $(imageActive).siblings('.active').removeClass('active');

          if ($(imageActive).index() == 0) {
            $(lightboxImages).eq($(lightboxImages).length - 1).addClass('active').siblings('.active').removeClass('active');
            $(topbar).find('.lightbox-counter').text($(lightboxImages).length + '/' + $(lightboxImages).length);
          } else {
            $(lightboxImages).eq($(imageActive).index() - 1).addClass('active');
            $(topbar).find('.lightbox-counter').text($(imageActive).index() + '/' + $(lightboxImages).length);
          }

          $(imageActive).removeClass('active');
        });
      }

      function closeLightbox() {
        anim({
          targets: lightbox[0],
          opacity: 0,
          easing: 'easeOutCubic',
          duration: settings.animOutDuration,
          complete: function () {
            lightbox.removeClass('active');
          }
        });
        $(lightboxImages).filter('.active').removeClass('active');
        closeFullscreen();
      }

      $(document).on('click', function (event) {
        if ($(event.target).hasClass('lightbox-ui')) closeLightbox();
      });
    }
  };
})(jQuery, anime);

(function ($) {
  $.fn.select = function (options) {
    var settings = $.extend({
      hoverClass: '',
      animDuration: 250
    }, options);
    $(this).each(function () {
      if ($(this).has('label').length) {
        $(this).find('label').addClass('active');
      }

      createSelect($(this));
    });

    function createSelect($this) {
      var input = $("<input type='text' readonly='true' class='select-dropdown' />");
      var list = $("<ul class='select-list' />");
      var options = $this.find('select').children('option');
      $this.append(input);
      $this.append(list);
      $this.append("<span class='caret' />");
      $(options).each(function () {
        if ($(this).attr('disabled')) {
          $(list).append("<li class='select-item disabled'>" + $(this).text() + '</li>');
        } else {
          $(list).append("<li class='select-item'>" + $(this).text() + '</li>');
        }
      });
      $(input).val($(options).filter('[selected]').text());

      if ($(options).filter('[selected]').length) {
        $(input).val($(options).filter('[selected]').text());
      } else {
        $(input).val($(options).first().text());
      }

      $(input).click(function () {
        $(list).slideDown(settings.animDuration);
      });
      $(input).blur(function () {
        setTimeout(function () {
          $(list).slideUp(settings.animDuration);
        }, 100);
      });
      $(list).children('li:not(.disabled)').click(function (event) {
        $(input).val($(this).text());
        event.preventDefault();
      });

      if (settings.hoverClass != '') {
        $(list).children('li:not(.disabled)').hover(function () {
          $(this).addClass(settings.hoverClass);
        }, function () {
          $(this).removeClass(settings.hoverClass);
        });
      }
    }
  };
})(jQuery);

(function ($) {
  $.fn.snackbar = function (options) {
    var settings = $.extend({
      dismissTime: 5000,
      target: 'body',
      classes: '',
      onDismiss: function () {}
    }, options);
    $(this).each(function () {
      createSnackbar($(this));
    });

    function createSnackbar($this) {
      $($this).click(function () {
        $('<div/>').addClass('snackbar').addClass(settings.classes).prependTo($(settings.target)).html($(this).data('snackbar')).queue(function (next) {
          $(this).css({
            opacity: 1
          });
          var topOffset = 15;
          $('.snackbar').each(function () {
            var $this = $(this);
            var height = $this.outerHeight();
            var offset = 15;
            $this.css('top', topOffset + 'px');
            topOffset += height + offset;
          });
          next();
        }).delay(settings.dismissTime).queue(function (next) {
          var $this = $(this);
          var width = $this.outerWidth() + 20;
          $this.css({
            right: '-' + width + 'px',
            opacity: 0
          });
          next();
        }).delay(600).queue(function (next) {
          $(this).remove();
          settings.onDismiss();
          next();
        });
      });
    }
  };
})(jQuery);

(function ($) {
  $.fn.tooltip = function (options) {
    var settings = $.extend({
      offset: 10
    }, options);
    $(this).each(function () {
      createTooltip($(this));
    });

    function createTooltip($this) {
      var trigger = $this;
      var tooltip = $("<div class='betterial-tooltip' />");
      var position = $(trigger).data('position') || 'top';
      $('body').append(tooltip);
      $(tooltip).html($(trigger).data('tooltip'));
      $(trigger).mouseenter(function () {
        var positionTop = 0;
        var positionLeft = 0;
        var translateX = 0;
        var translateY = 0;

        if (position == 'top') {
          positionTop = $(trigger).offset().top - $(tooltip).outerHeight();
          positionLeft = $(trigger).offset().left + $(trigger).outerWidth() / 2 - $(tooltip).outerWidth() / 2;
          translateX = '0';
          translateY = -settings.offset + 'px';
        } else if (position == 'bottom') {
          positionTop = $(trigger).offset().top + $(trigger).outerHeight();
          positionLeft = $(trigger).offset().left + $(trigger).outerWidth() / 2 - $(tooltip).outerWidth() / 2;
          translateX = '0';
          translateY = settings.offset + 'px';
        } else if (position == 'left') {
          positionTop = $(trigger).offset().top + $(trigger).outerHeight() / 2 - $(tooltip).outerHeight() / 2;
          positionLeft = $(trigger).offset().left - $(tooltip).outerWidth();
          translateX = -settings.offset + 'px';
          translateY = '0';
        } else if (position == 'right') {
          positionTop = $(trigger).offset().top + $(trigger).outerHeight() / 2 - $(tooltip).outerHeight() / 2;
          positionLeft = $(trigger).offset().left + $(trigger).outerWidth();
          translateX = settings.offset + 'px';
          translateY = '0';
        }

        $(tooltip).css({
          top: positionTop,
          left: positionLeft
        });
        $(tooltip).css('transform', 'translate(' + translateX + ', ' + translateY + ')');
        $(tooltip).addClass('active');
      }).mouseleave(function () {
        $(tooltip).removeClass('active');
        $(tooltip).css('transform', 'translate(0,0)');
      });
    }
  };
})(jQuery);

(function ($) {
  $.fn.pushpin = function (options) {
    var settings = $.extend({
      offsetTop: 0,
      end: Infinity
    }, options);
    var pushpin = $(this);
    var width = $(pushpin).width();
    var pushpinOffsetTop = $(pushpin).offset().top - settings.offsetTop;

    function update() {
      if ($(window).scrollTop() > settings.end - settings.offsetTop) {
        $(pushpin).removeClass('pinned').addClass('pin-bottom');
        $(pushpin).css('top', settings.end);
      } else if ($(window).scrollTop() < settings.end - settings.offsetTop) {
        if (pushpinOffsetTop - $(window).scrollTop() < 0) {
          $(pushpin).addClass('pinned').removeClass('pin-bottom');
          $(pushpin).css('width', width);
          $(pushpin).css('top', settings.offsetTop);
        } else if (pushpinOffsetTop > $(window).scrollTop()) {
          $(pushpin).removeClass('pinned').removeClass('pin-bottom');
          $(pushpin).css('top', 0);
        }
      }
    }

    $(window).bind('scroll', update);
  };
})(jQuery);

(function ($) {
  $.fn.parallax = function (options) {
    var settings = $.extend({
      speedFactor: 1
    }, options);
    var window_width = $(window).width();
    return this.each(function () {
      var $this = $(this);

      function createParallax(initial) {
        var containerHeight;
        var $img = $this.children('img').first();

        if (window_width < 601) {
          containerHeight = $this.height() > 0 ? $this.height() : $img.height();
        } else {
          containerHeight = $this.height() > 0 ? $this.height() : 500;
        }

        var imgHeight = $img.height();
        var parallaxDist = imgHeight - containerHeight;
        var bottom = $this.offset().top + containerHeight;
        var top = $this.offset().top;
        var scrollTop = $(window).scrollTop();
        var windowHeight = window.innerHeight;
        var windowBottom = scrollTop + windowHeight;
        var percentScrolled = (windowBottom - top) / (containerHeight + windowHeight);
        var parallaxFinal = Math.round(parallaxDist * percentScrolled * settings.speedFactor);

        if (initial) {
          $img.css('display', 'block');
        }

        if (bottom > scrollTop && top < scrollTop + windowHeight) {
          $img.css('transform', 'translate3D(-50%,' + parallaxFinal + 'px, 0)');
        }
      }

      $this.children('img').one('load', function () {
        createParallax(true);
      }).each(function () {
        if (this.complete) $(this).trigger('load');
      });
      $(window).scroll(function () {
        window_width = $(window).width();
        createParallax(false);
      });
      $(window).resize(function () {
        window_width = $(window).width();
        createParallax(false);
      });
    });
  };
})(jQuery);

(function ($) {
  $.fn.autocomplete = function (options) {
    var settings = $.extend({
      data: [],
      dataColor: 'rgba(0, 0, 0, 0.87)'
    }, options);
    $(this).each(function () {
      createAutocomplete($(this));
    });

    function createAutocomplete($this) {
      var autocompleteList = $("<ul class='autocomplete-items' />");
      $this.append(autocompleteList);
      var input = $this.find('input');
      $.each(settings.data, function (index, value) {
        $(autocompleteList).append('<li>' + value + '</li>');
      });
      var autocompleteItems = $this.find('.autocomplete-items').children('li');
      $(autocompleteItems).css('color', settings.dataColor);
      $(input).on('keyup change paste', function () {
        if ($(input).val() != '') {
          $(autocompleteItems).each(function () {
            $(this).css('display', 'none');

            if ($(this).text().toLowerCase().includes($(input).val().toLowerCase())) {
              $(this).css('display', 'block');
            }
          });
        }
      });
      $(autocompleteItems).click(function () {
        $(input).siblings('label,i').addClass('active');
        $(input).val($(this).text());
        $(autocompleteItems).css('display', 'none');
      });
      $(input).on('blur', function () {
        if ($(input).val() == '') {
          $(autocompleteItems).css('display', 'none');
        }
      });
    }
  };
})(jQuery);

(function ($) {
  $.fn.characterCounter = function () {
    $(this).each(function () {
      var counterWrapper = $(this);
      var counter = $("<div class='character-counter' />");
      $(this).find('.bottom-text').append(counter);
      $(this).find('input').attr('maxlength', $(counterWrapper).data('word-limit'));
      $(this).find('input').on('keyup change paste', function () {
        $(counter).text($(this).val().length + ' / ' + $(counterWrapper).data('word-limit'));
      });
    });
  };
})(jQuery);

function validateEmail(inputElem) {
  var re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  var isValid = re.test(inputElem.val());
  if (isValid) inputElem.addClass('valid').removeClass('invalid');else inputElem.addClass('invalid').removeClass('valid');
}

function validateNotEmpty(inputElem) {
  if (inputElem.val() == '' || typeof inputElem.val() === typeof undefined) {
    inputElem.addClass('invalid').removeClass('valid');
  } else inputElem.addClass('valid').removeClass('invalid');
}

$("input.validate[type='email']").on('blur', function (e) {
  validateEmail($(e.target));
});
$('input.validate.not-empty').on('blur', function (e) {
  validateNotEmpty($(e.target));
});