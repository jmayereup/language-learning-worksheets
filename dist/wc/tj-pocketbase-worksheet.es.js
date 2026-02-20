function xh(r) {
  return r && r.__esModule && Object.prototype.hasOwnProperty.call(r, "default") ? r.default : r;
}
var Ef = { exports: {} }, Ln = {};
/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Ud;
function ph() {
  if (Ud) return Ln;
  Ud = 1;
  var r = Symbol.for("react.transitional.element"), M = Symbol.for("react.fragment");
  function U(m, O, G) {
    var le = null;
    if (G !== void 0 && (le = "" + G), O.key !== void 0 && (le = "" + O.key), "key" in O) {
      G = {};
      for (var L in O)
        L !== "key" && (G[L] = O[L]);
    } else G = O;
    return O = G.ref, {
      $$typeof: r,
      type: m,
      key: le,
      ref: O !== void 0 ? O : null,
      props: G
    };
  }
  return Ln.Fragment = M, Ln.jsx = U, Ln.jsxs = U, Ln;
}
var Dd;
function Sh() {
  return Dd || (Dd = 1, Ef.exports = ph()), Ef.exports;
}
var s = Sh(), _f = { exports: {} }, Xn = {}, Mf = { exports: {} }, Af = {};
/**
 * @license React
 * scheduler.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var wd;
function Nh() {
  return wd || (wd = 1, (function(r) {
    function M(S, R) {
      var I = S.length;
      S.push(R);
      e: for (; 0 < I; ) {
        var Ne = I - 1 >>> 1, v = S[Ne];
        if (0 < O(v, R))
          S[Ne] = R, S[I] = v, I = Ne;
        else break e;
      }
    }
    function U(S) {
      return S.length === 0 ? null : S[0];
    }
    function m(S) {
      if (S.length === 0) return null;
      var R = S[0], I = S.pop();
      if (I !== R) {
        S[0] = I;
        e: for (var Ne = 0, v = S.length, c = v >>> 1; Ne < c; ) {
          var y = 2 * (Ne + 1) - 1, z = S[y], A = y + 1, D = S[A];
          if (0 > O(z, I))
            A < v && 0 > O(D, z) ? (S[Ne] = D, S[A] = I, Ne = A) : (S[Ne] = z, S[y] = I, Ne = y);
          else if (A < v && 0 > O(D, I))
            S[Ne] = D, S[A] = I, Ne = A;
          else break e;
        }
      }
      return R;
    }
    function O(S, R) {
      var I = S.sortIndex - R.sortIndex;
      return I !== 0 ? I : S.id - R.id;
    }
    if (r.unstable_now = void 0, typeof performance == "object" && typeof performance.now == "function") {
      var G = performance;
      r.unstable_now = function() {
        return G.now();
      };
    } else {
      var le = Date, L = le.now();
      r.unstable_now = function() {
        return le.now() - L;
      };
    }
    var C = [], N = [], V = 1, B = null, J = 3, ue = !1, he = !1, k = !1, Y = !1, ae = typeof setTimeout == "function" ? setTimeout : null, _e = typeof clearTimeout == "function" ? clearTimeout : null, ce = typeof setImmediate < "u" ? setImmediate : null;
    function W(S) {
      for (var R = U(N); R !== null; ) {
        if (R.callback === null) m(N);
        else if (R.startTime <= S)
          m(N), R.sortIndex = R.expirationTime, M(C, R);
        else break;
        R = U(N);
      }
    }
    function de(S) {
      if (k = !1, W(S), !he)
        if (U(C) !== null)
          he = !0, ve || (ve = !0, Fe());
        else {
          var R = U(N);
          R !== null && fe(de, R.startTime - S);
        }
    }
    var ve = !1, P = -1, Le = 5, ft = -1;
    function Ze() {
      return Y ? !0 : !(r.unstable_now() - ft < Le);
    }
    function $e() {
      if (Y = !1, ve) {
        var S = r.unstable_now();
        ft = S;
        var R = !0;
        try {
          e: {
            he = !1, k && (k = !1, _e(P), P = -1), ue = !0;
            var I = J;
            try {
              t: {
                for (W(S), B = U(C); B !== null && !(B.expirationTime > S && Ze()); ) {
                  var Ne = B.callback;
                  if (typeof Ne == "function") {
                    B.callback = null, J = B.priorityLevel;
                    var v = Ne(
                      B.expirationTime <= S
                    );
                    if (S = r.unstable_now(), typeof v == "function") {
                      B.callback = v, W(S), R = !0;
                      break t;
                    }
                    B === U(C) && m(C), W(S);
                  } else m(C);
                  B = U(C);
                }
                if (B !== null) R = !0;
                else {
                  var c = U(N);
                  c !== null && fe(
                    de,
                    c.startTime - S
                  ), R = !1;
                }
              }
              break e;
            } finally {
              B = null, J = I, ue = !1;
            }
            R = void 0;
          }
        } finally {
          R ? Fe() : ve = !1;
        }
      }
    }
    var Fe;
    if (typeof ce == "function")
      Fe = function() {
        ce($e);
      };
    else if (typeof MessageChannel < "u") {
      var ne = new MessageChannel(), pe = ne.port2;
      ne.port1.onmessage = $e, Fe = function() {
        pe.postMessage(null);
      };
    } else
      Fe = function() {
        ae($e, 0);
      };
    function fe(S, R) {
      P = ae(function() {
        S(r.unstable_now());
      }, R);
    }
    r.unstable_IdlePriority = 5, r.unstable_ImmediatePriority = 1, r.unstable_LowPriority = 4, r.unstable_NormalPriority = 3, r.unstable_Profiling = null, r.unstable_UserBlockingPriority = 2, r.unstable_cancelCallback = function(S) {
      S.callback = null;
    }, r.unstable_forceFrameRate = function(S) {
      0 > S || 125 < S ? console.error(
        "forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"
      ) : Le = 0 < S ? Math.floor(1e3 / S) : 5;
    }, r.unstable_getCurrentPriorityLevel = function() {
      return J;
    }, r.unstable_next = function(S) {
      switch (J) {
        case 1:
        case 2:
        case 3:
          var R = 3;
          break;
        default:
          R = J;
      }
      var I = J;
      J = R;
      try {
        return S();
      } finally {
        J = I;
      }
    }, r.unstable_requestPaint = function() {
      Y = !0;
    }, r.unstable_runWithPriority = function(S, R) {
      switch (S) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          S = 3;
      }
      var I = J;
      J = S;
      try {
        return R();
      } finally {
        J = I;
      }
    }, r.unstable_scheduleCallback = function(S, R, I) {
      var Ne = r.unstable_now();
      switch (typeof I == "object" && I !== null ? (I = I.delay, I = typeof I == "number" && 0 < I ? Ne + I : Ne) : I = Ne, S) {
        case 1:
          var v = -1;
          break;
        case 2:
          v = 250;
          break;
        case 5:
          v = 1073741823;
          break;
        case 4:
          v = 1e4;
          break;
        default:
          v = 5e3;
      }
      return v = I + v, S = {
        id: V++,
        callback: R,
        priorityLevel: S,
        startTime: I,
        expirationTime: v,
        sortIndex: -1
      }, I > Ne ? (S.sortIndex = I, M(N, S), U(C) === null && S === U(N) && (k ? (_e(P), P = -1) : k = !0, fe(de, I - Ne))) : (S.sortIndex = v, M(C, S), he || ue || (he = !0, ve || (ve = !0, Fe()))), S;
    }, r.unstable_shouldYield = Ze, r.unstable_wrapCallback = function(S) {
      var R = J;
      return function() {
        var I = J;
        J = R;
        try {
          return S.apply(this, arguments);
        } finally {
          J = I;
        }
      };
    };
  })(Af)), Af;
}
var Rd;
function Th() {
  return Rd || (Rd = 1, Mf.exports = Nh()), Mf.exports;
}
var Cf = { exports: {} }, ie = {};
/**
 * @license React
 * react.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Hd;
function jh() {
  if (Hd) return ie;
  Hd = 1;
  var r = Symbol.for("react.transitional.element"), M = Symbol.for("react.portal"), U = Symbol.for("react.fragment"), m = Symbol.for("react.strict_mode"), O = Symbol.for("react.profiler"), G = Symbol.for("react.consumer"), le = Symbol.for("react.context"), L = Symbol.for("react.forward_ref"), C = Symbol.for("react.suspense"), N = Symbol.for("react.memo"), V = Symbol.for("react.lazy"), B = Symbol.for("react.activity"), J = Symbol.iterator;
  function ue(c) {
    return c === null || typeof c != "object" ? null : (c = J && c[J] || c["@@iterator"], typeof c == "function" ? c : null);
  }
  var he = {
    isMounted: function() {
      return !1;
    },
    enqueueForceUpdate: function() {
    },
    enqueueReplaceState: function() {
    },
    enqueueSetState: function() {
    }
  }, k = Object.assign, Y = {};
  function ae(c, y, z) {
    this.props = c, this.context = y, this.refs = Y, this.updater = z || he;
  }
  ae.prototype.isReactComponent = {}, ae.prototype.setState = function(c, y) {
    if (typeof c != "object" && typeof c != "function" && c != null)
      throw Error(
        "takes an object of state variables to update or a function which returns an object of state variables."
      );
    this.updater.enqueueSetState(this, c, y, "setState");
  }, ae.prototype.forceUpdate = function(c) {
    this.updater.enqueueForceUpdate(this, c, "forceUpdate");
  };
  function _e() {
  }
  _e.prototype = ae.prototype;
  function ce(c, y, z) {
    this.props = c, this.context = y, this.refs = Y, this.updater = z || he;
  }
  var W = ce.prototype = new _e();
  W.constructor = ce, k(W, ae.prototype), W.isPureReactComponent = !0;
  var de = Array.isArray;
  function ve() {
  }
  var P = { H: null, A: null, T: null, S: null }, Le = Object.prototype.hasOwnProperty;
  function ft(c, y, z) {
    var A = z.ref;
    return {
      $$typeof: r,
      type: c,
      key: y,
      ref: A !== void 0 ? A : null,
      props: z
    };
  }
  function Ze(c, y) {
    return ft(c.type, y, c.props);
  }
  function $e(c) {
    return typeof c == "object" && c !== null && c.$$typeof === r;
  }
  function Fe(c) {
    var y = { "=": "=0", ":": "=2" };
    return "$" + c.replace(/[=:]/g, function(z) {
      return y[z];
    });
  }
  var ne = /\/+/g;
  function pe(c, y) {
    return typeof c == "object" && c !== null && c.key != null ? Fe("" + c.key) : y.toString(36);
  }
  function fe(c) {
    switch (c.status) {
      case "fulfilled":
        return c.value;
      case "rejected":
        throw c.reason;
      default:
        switch (typeof c.status == "string" ? c.then(ve, ve) : (c.status = "pending", c.then(
          function(y) {
            c.status === "pending" && (c.status = "fulfilled", c.value = y);
          },
          function(y) {
            c.status === "pending" && (c.status = "rejected", c.reason = y);
          }
        )), c.status) {
          case "fulfilled":
            return c.value;
          case "rejected":
            throw c.reason;
        }
    }
    throw c;
  }
  function S(c, y, z, A, D) {
    var q = typeof c;
    (q === "undefined" || q === "boolean") && (c = null);
    var w = !1;
    if (c === null) w = !0;
    else
      switch (q) {
        case "bigint":
        case "string":
        case "number":
          w = !0;
          break;
        case "object":
          switch (c.$$typeof) {
            case r:
            case M:
              w = !0;
              break;
            case V:
              return w = c._init, S(
                w(c._payload),
                y,
                z,
                A,
                D
              );
          }
      }
    if (w)
      return D = D(c), w = A === "" ? "." + pe(c, 0) : A, de(D) ? (z = "", w != null && (z = w.replace(ne, "$&/") + "/"), S(D, y, z, "", function(Ee) {
        return Ee;
      })) : D != null && ($e(D) && (D = Ze(
        D,
        z + (D.key == null || c && c.key === D.key ? "" : ("" + D.key).replace(
          ne,
          "$&/"
        ) + "/") + w
      )), y.push(D)), 1;
    w = 0;
    var $ = A === "" ? "." : A + ":";
    if (de(c))
      for (var te = 0; te < c.length; te++)
        A = c[te], q = $ + pe(A, te), w += S(
          A,
          y,
          z,
          q,
          D
        );
    else if (te = ue(c), typeof te == "function")
      for (c = te.call(c), te = 0; !(A = c.next()).done; )
        A = A.value, q = $ + pe(A, te++), w += S(
          A,
          y,
          z,
          q,
          D
        );
    else if (q === "object") {
      if (typeof c.then == "function")
        return S(
          fe(c),
          y,
          z,
          A,
          D
        );
      throw y = String(c), Error(
        "Objects are not valid as a React child (found: " + (y === "[object Object]" ? "object with keys {" + Object.keys(c).join(", ") + "}" : y) + "). If you meant to render a collection of children, use an array instead."
      );
    }
    return w;
  }
  function R(c, y, z) {
    if (c == null) return c;
    var A = [], D = 0;
    return S(c, A, "", "", function(q) {
      return y.call(z, q, D++);
    }), A;
  }
  function I(c) {
    if (c._status === -1) {
      var y = c._result;
      y = y(), y.then(
        function(z) {
          (c._status === 0 || c._status === -1) && (c._status = 1, c._result = z);
        },
        function(z) {
          (c._status === 0 || c._status === -1) && (c._status = 2, c._result = z);
        }
      ), c._status === -1 && (c._status = 0, c._result = y);
    }
    if (c._status === 1) return c._result.default;
    throw c._result;
  }
  var Ne = typeof reportError == "function" ? reportError : function(c) {
    if (typeof window == "object" && typeof window.ErrorEvent == "function") {
      var y = new window.ErrorEvent("error", {
        bubbles: !0,
        cancelable: !0,
        message: typeof c == "object" && c !== null && typeof c.message == "string" ? String(c.message) : String(c),
        error: c
      });
      if (!window.dispatchEvent(y)) return;
    } else if (typeof process == "object" && typeof process.emit == "function") {
      process.emit("uncaughtException", c);
      return;
    }
    console.error(c);
  }, v = {
    map: R,
    forEach: function(c, y, z) {
      R(
        c,
        function() {
          y.apply(this, arguments);
        },
        z
      );
    },
    count: function(c) {
      var y = 0;
      return R(c, function() {
        y++;
      }), y;
    },
    toArray: function(c) {
      return R(c, function(y) {
        return y;
      }) || [];
    },
    only: function(c) {
      if (!$e(c))
        throw Error(
          "React.Children.only expected to receive a single React element child."
        );
      return c;
    }
  };
  return ie.Activity = B, ie.Children = v, ie.Component = ae, ie.Fragment = U, ie.Profiler = O, ie.PureComponent = ce, ie.StrictMode = m, ie.Suspense = C, ie.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = P, ie.__COMPILER_RUNTIME = {
    __proto__: null,
    c: function(c) {
      return P.H.useMemoCache(c);
    }
  }, ie.cache = function(c) {
    return function() {
      return c.apply(null, arguments);
    };
  }, ie.cacheSignal = function() {
    return null;
  }, ie.cloneElement = function(c, y, z) {
    if (c == null)
      throw Error(
        "The argument must be a React element, but you passed " + c + "."
      );
    var A = k({}, c.props), D = c.key;
    if (y != null)
      for (q in y.key !== void 0 && (D = "" + y.key), y)
        !Le.call(y, q) || q === "key" || q === "__self" || q === "__source" || q === "ref" && y.ref === void 0 || (A[q] = y[q]);
    var q = arguments.length - 2;
    if (q === 1) A.children = z;
    else if (1 < q) {
      for (var w = Array(q), $ = 0; $ < q; $++)
        w[$] = arguments[$ + 2];
      A.children = w;
    }
    return ft(c.type, D, A);
  }, ie.createContext = function(c) {
    return c = {
      $$typeof: le,
      _currentValue: c,
      _currentValue2: c,
      _threadCount: 0,
      Provider: null,
      Consumer: null
    }, c.Provider = c, c.Consumer = {
      $$typeof: G,
      _context: c
    }, c;
  }, ie.createElement = function(c, y, z) {
    var A, D = {}, q = null;
    if (y != null)
      for (A in y.key !== void 0 && (q = "" + y.key), y)
        Le.call(y, A) && A !== "key" && A !== "__self" && A !== "__source" && (D[A] = y[A]);
    var w = arguments.length - 2;
    if (w === 1) D.children = z;
    else if (1 < w) {
      for (var $ = Array(w), te = 0; te < w; te++)
        $[te] = arguments[te + 2];
      D.children = $;
    }
    if (c && c.defaultProps)
      for (A in w = c.defaultProps, w)
        D[A] === void 0 && (D[A] = w[A]);
    return ft(c, q, D);
  }, ie.createRef = function() {
    return { current: null };
  }, ie.forwardRef = function(c) {
    return { $$typeof: L, render: c };
  }, ie.isValidElement = $e, ie.lazy = function(c) {
    return {
      $$typeof: V,
      _payload: { _status: -1, _result: c },
      _init: I
    };
  }, ie.memo = function(c, y) {
    return {
      $$typeof: N,
      type: c,
      compare: y === void 0 ? null : y
    };
  }, ie.startTransition = function(c) {
    var y = P.T, z = {};
    P.T = z;
    try {
      var A = c(), D = P.S;
      D !== null && D(z, A), typeof A == "object" && A !== null && typeof A.then == "function" && A.then(ve, Ne);
    } catch (q) {
      Ne(q);
    } finally {
      y !== null && z.types !== null && (y.types = z.types), P.T = y;
    }
  }, ie.unstable_useCacheRefresh = function() {
    return P.H.useCacheRefresh();
  }, ie.use = function(c) {
    return P.H.use(c);
  }, ie.useActionState = function(c, y, z) {
    return P.H.useActionState(c, y, z);
  }, ie.useCallback = function(c, y) {
    return P.H.useCallback(c, y);
  }, ie.useContext = function(c) {
    return P.H.useContext(c);
  }, ie.useDebugValue = function() {
  }, ie.useDeferredValue = function(c, y) {
    return P.H.useDeferredValue(c, y);
  }, ie.useEffect = function(c, y) {
    return P.H.useEffect(c, y);
  }, ie.useEffectEvent = function(c) {
    return P.H.useEffectEvent(c);
  }, ie.useId = function() {
    return P.H.useId();
  }, ie.useImperativeHandle = function(c, y, z) {
    return P.H.useImperativeHandle(c, y, z);
  }, ie.useInsertionEffect = function(c, y) {
    return P.H.useInsertionEffect(c, y);
  }, ie.useLayoutEffect = function(c, y) {
    return P.H.useLayoutEffect(c, y);
  }, ie.useMemo = function(c, y) {
    return P.H.useMemo(c, y);
  }, ie.useOptimistic = function(c, y) {
    return P.H.useOptimistic(c, y);
  }, ie.useReducer = function(c, y, z) {
    return P.H.useReducer(c, y, z);
  }, ie.useRef = function(c) {
    return P.H.useRef(c);
  }, ie.useState = function(c) {
    return P.H.useState(c);
  }, ie.useSyncExternalStore = function(c, y, z) {
    return P.H.useSyncExternalStore(
      c,
      y,
      z
    );
  }, ie.useTransition = function() {
    return P.H.useTransition();
  }, ie.version = "19.2.0", ie;
}
var Bd;
function Df() {
  return Bd || (Bd = 1, Cf.exports = jh()), Cf.exports;
}
var Of = { exports: {} }, rt = {};
/**
 * @license React
 * react-dom.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var qd;
function zh() {
  if (qd) return rt;
  qd = 1;
  var r = Df();
  function M(C) {
    var N = "https://react.dev/errors/" + C;
    if (1 < arguments.length) {
      N += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var V = 2; V < arguments.length; V++)
        N += "&args[]=" + encodeURIComponent(arguments[V]);
    }
    return "Minified React error #" + C + "; visit " + N + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  function U() {
  }
  var m = {
    d: {
      f: U,
      r: function() {
        throw Error(M(522));
      },
      D: U,
      C: U,
      L: U,
      m: U,
      X: U,
      S: U,
      M: U
    },
    p: 0,
    findDOMNode: null
  }, O = Symbol.for("react.portal");
  function G(C, N, V) {
    var B = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return {
      $$typeof: O,
      key: B == null ? null : "" + B,
      children: C,
      containerInfo: N,
      implementation: V
    };
  }
  var le = r.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
  function L(C, N) {
    if (C === "font") return "";
    if (typeof N == "string")
      return N === "use-credentials" ? N : "";
  }
  return rt.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = m, rt.createPortal = function(C, N) {
    var V = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!N || N.nodeType !== 1 && N.nodeType !== 9 && N.nodeType !== 11)
      throw Error(M(299));
    return G(C, N, null, V);
  }, rt.flushSync = function(C) {
    var N = le.T, V = m.p;
    try {
      if (le.T = null, m.p = 2, C) return C();
    } finally {
      le.T = N, m.p = V, m.d.f();
    }
  }, rt.preconnect = function(C, N) {
    typeof C == "string" && (N ? (N = N.crossOrigin, N = typeof N == "string" ? N === "use-credentials" ? N : "" : void 0) : N = null, m.d.C(C, N));
  }, rt.prefetchDNS = function(C) {
    typeof C == "string" && m.d.D(C);
  }, rt.preinit = function(C, N) {
    if (typeof C == "string" && N && typeof N.as == "string") {
      var V = N.as, B = L(V, N.crossOrigin), J = typeof N.integrity == "string" ? N.integrity : void 0, ue = typeof N.fetchPriority == "string" ? N.fetchPriority : void 0;
      V === "style" ? m.d.S(
        C,
        typeof N.precedence == "string" ? N.precedence : void 0,
        {
          crossOrigin: B,
          integrity: J,
          fetchPriority: ue
        }
      ) : V === "script" && m.d.X(C, {
        crossOrigin: B,
        integrity: J,
        fetchPriority: ue,
        nonce: typeof N.nonce == "string" ? N.nonce : void 0
      });
    }
  }, rt.preinitModule = function(C, N) {
    if (typeof C == "string")
      if (typeof N == "object" && N !== null) {
        if (N.as == null || N.as === "script") {
          var V = L(
            N.as,
            N.crossOrigin
          );
          m.d.M(C, {
            crossOrigin: V,
            integrity: typeof N.integrity == "string" ? N.integrity : void 0,
            nonce: typeof N.nonce == "string" ? N.nonce : void 0
          });
        }
      } else N == null && m.d.M(C);
  }, rt.preload = function(C, N) {
    if (typeof C == "string" && typeof N == "object" && N !== null && typeof N.as == "string") {
      var V = N.as, B = L(V, N.crossOrigin);
      m.d.L(C, V, {
        crossOrigin: B,
        integrity: typeof N.integrity == "string" ? N.integrity : void 0,
        nonce: typeof N.nonce == "string" ? N.nonce : void 0,
        type: typeof N.type == "string" ? N.type : void 0,
        fetchPriority: typeof N.fetchPriority == "string" ? N.fetchPriority : void 0,
        referrerPolicy: typeof N.referrerPolicy == "string" ? N.referrerPolicy : void 0,
        imageSrcSet: typeof N.imageSrcSet == "string" ? N.imageSrcSet : void 0,
        imageSizes: typeof N.imageSizes == "string" ? N.imageSizes : void 0,
        media: typeof N.media == "string" ? N.media : void 0
      });
    }
  }, rt.preloadModule = function(C, N) {
    if (typeof C == "string")
      if (N) {
        var V = L(N.as, N.crossOrigin);
        m.d.m(C, {
          as: typeof N.as == "string" && N.as !== "script" ? N.as : void 0,
          crossOrigin: V,
          integrity: typeof N.integrity == "string" ? N.integrity : void 0
        });
      } else m.d.m(C);
  }, rt.requestFormReset = function(C) {
    m.d.r(C);
  }, rt.unstable_batchedUpdates = function(C, N) {
    return C(N);
  }, rt.useFormState = function(C, N, V) {
    return le.H.useFormState(C, N, V);
  }, rt.useFormStatus = function() {
    return le.H.useHostTransitionStatus();
  }, rt.version = "19.2.0", rt;
}
var Yd;
function Eh() {
  if (Yd) return Of.exports;
  Yd = 1;
  function r() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(r);
      } catch (M) {
        console.error(M);
      }
  }
  return r(), Of.exports = zh(), Of.exports;
}
/**
 * @license React
 * react-dom-client.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Gd;
function _h() {
  if (Gd) return Xn;
  Gd = 1;
  var r = Th(), M = Df(), U = Eh();
  function m(e) {
    var t = "https://react.dev/errors/" + e;
    if (1 < arguments.length) {
      t += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var l = 2; l < arguments.length; l++)
        t += "&args[]=" + encodeURIComponent(arguments[l]);
    }
    return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  function O(e) {
    return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11);
  }
  function G(e) {
    var t = e, l = e;
    if (e.alternate) for (; t.return; ) t = t.return;
    else {
      e = t;
      do
        t = e, (t.flags & 4098) !== 0 && (l = t.return), e = t.return;
      while (e);
    }
    return t.tag === 3 ? l : null;
  }
  function le(e) {
    if (e.tag === 13) {
      var t = e.memoizedState;
      if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
    }
    return null;
  }
  function L(e) {
    if (e.tag === 31) {
      var t = e.memoizedState;
      if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
    }
    return null;
  }
  function C(e) {
    if (G(e) !== e)
      throw Error(m(188));
  }
  function N(e) {
    var t = e.alternate;
    if (!t) {
      if (t = G(e), t === null) throw Error(m(188));
      return t !== e ? null : e;
    }
    for (var l = e, a = t; ; ) {
      var n = l.return;
      if (n === null) break;
      var u = n.alternate;
      if (u === null) {
        if (a = n.return, a !== null) {
          l = a;
          continue;
        }
        break;
      }
      if (n.child === u.child) {
        for (u = n.child; u; ) {
          if (u === l) return C(n), e;
          if (u === a) return C(n), t;
          u = u.sibling;
        }
        throw Error(m(188));
      }
      if (l.return !== a.return) l = n, a = u;
      else {
        for (var i = !1, f = n.child; f; ) {
          if (f === l) {
            i = !0, l = n, a = u;
            break;
          }
          if (f === a) {
            i = !0, a = n, l = u;
            break;
          }
          f = f.sibling;
        }
        if (!i) {
          for (f = u.child; f; ) {
            if (f === l) {
              i = !0, l = u, a = n;
              break;
            }
            if (f === a) {
              i = !0, a = u, l = n;
              break;
            }
            f = f.sibling;
          }
          if (!i) throw Error(m(189));
        }
      }
      if (l.alternate !== a) throw Error(m(190));
    }
    if (l.tag !== 3) throw Error(m(188));
    return l.stateNode.current === l ? e : t;
  }
  function V(e) {
    var t = e.tag;
    if (t === 5 || t === 26 || t === 27 || t === 6) return e;
    for (e = e.child; e !== null; ) {
      if (t = V(e), t !== null) return t;
      e = e.sibling;
    }
    return null;
  }
  var B = Object.assign, J = Symbol.for("react.element"), ue = Symbol.for("react.transitional.element"), he = Symbol.for("react.portal"), k = Symbol.for("react.fragment"), Y = Symbol.for("react.strict_mode"), ae = Symbol.for("react.profiler"), _e = Symbol.for("react.consumer"), ce = Symbol.for("react.context"), W = Symbol.for("react.forward_ref"), de = Symbol.for("react.suspense"), ve = Symbol.for("react.suspense_list"), P = Symbol.for("react.memo"), Le = Symbol.for("react.lazy"), ft = Symbol.for("react.activity"), Ze = Symbol.for("react.memo_cache_sentinel"), $e = Symbol.iterator;
  function Fe(e) {
    return e === null || typeof e != "object" ? null : (e = $e && e[$e] || e["@@iterator"], typeof e == "function" ? e : null);
  }
  var ne = Symbol.for("react.client.reference");
  function pe(e) {
    if (e == null) return null;
    if (typeof e == "function")
      return e.$$typeof === ne ? null : e.displayName || e.name || null;
    if (typeof e == "string") return e;
    switch (e) {
      case k:
        return "Fragment";
      case ae:
        return "Profiler";
      case Y:
        return "StrictMode";
      case de:
        return "Suspense";
      case ve:
        return "SuspenseList";
      case ft:
        return "Activity";
    }
    if (typeof e == "object")
      switch (e.$$typeof) {
        case he:
          return "Portal";
        case ce:
          return e.displayName || "Context";
        case _e:
          return (e._context.displayName || "Context") + ".Consumer";
        case W:
          var t = e.render;
          return e = e.displayName, e || (e = t.displayName || t.name || "", e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef"), e;
        case P:
          return t = e.displayName || null, t !== null ? t : pe(e.type) || "Memo";
        case Le:
          t = e._payload, e = e._init;
          try {
            return pe(e(t));
          } catch {
          }
      }
    return null;
  }
  var fe = Array.isArray, S = M.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, R = U.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, I = {
    pending: !1,
    data: null,
    method: null,
    action: null
  }, Ne = [], v = -1;
  function c(e) {
    return { current: e };
  }
  function y(e) {
    0 > v || (e.current = Ne[v], Ne[v] = null, v--);
  }
  function z(e, t) {
    v++, Ne[v] = e.current, e.current = t;
  }
  var A = c(null), D = c(null), q = c(null), w = c(null);
  function $(e, t) {
    switch (z(q, t), z(D, e), z(A, null), t.nodeType) {
      case 9:
      case 11:
        e = (e = t.documentElement) && (e = e.namespaceURI) ? td(e) : 0;
        break;
      default:
        if (e = t.tagName, t = t.namespaceURI)
          t = td(t), e = ld(t, e);
        else
          switch (e) {
            case "svg":
              e = 1;
              break;
            case "math":
              e = 2;
              break;
            default:
              e = 0;
          }
    }
    y(A), z(A, e);
  }
  function te() {
    y(A), y(D), y(q);
  }
  function Ee(e) {
    e.memoizedState !== null && z(w, e);
    var t = A.current, l = ld(t, e.type);
    t !== l && (z(D, e), z(A, l));
  }
  function T(e) {
    D.current === e && (y(A), y(D)), w.current === e && (y(w), qn._currentValue = I);
  }
  var H, K;
  function Q(e) {
    if (H === void 0)
      try {
        throw Error();
      } catch (l) {
        var t = l.stack.trim().match(/\n( *(at )?)/);
        H = t && t[1] || "", K = -1 < l.stack.indexOf(`
    at`) ? " (<anonymous>)" : -1 < l.stack.indexOf("@") ? "@unknown:0:0" : "";
      }
    return `
` + H + e + K;
  }
  var me = !1;
  function Me(e, t) {
    if (!e || me) return "";
    me = !0;
    var l = Error.prepareStackTrace;
    Error.prepareStackTrace = void 0;
    try {
      var a = {
        DetermineComponentFrameRoot: function() {
          try {
            if (t) {
              var _ = function() {
                throw Error();
              };
              if (Object.defineProperty(_.prototype, "props", {
                set: function() {
                  throw Error();
                }
              }), typeof Reflect == "object" && Reflect.construct) {
                try {
                  Reflect.construct(_, []);
                } catch (p) {
                  var x = p;
                }
                Reflect.construct(e, [], _);
              } else {
                try {
                  _.call();
                } catch (p) {
                  x = p;
                }
                e.call(_.prototype);
              }
            } else {
              try {
                throw Error();
              } catch (p) {
                x = p;
              }
              (_ = e()) && typeof _.catch == "function" && _.catch(function() {
              });
            }
          } catch (p) {
            if (p && x && typeof p.stack == "string")
              return [p.stack, x.stack];
          }
          return [null, null];
        }
      };
      a.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
      var n = Object.getOwnPropertyDescriptor(
        a.DetermineComponentFrameRoot,
        "name"
      );
      n && n.configurable && Object.defineProperty(
        a.DetermineComponentFrameRoot,
        "name",
        { value: "DetermineComponentFrameRoot" }
      );
      var u = a.DetermineComponentFrameRoot(), i = u[0], f = u[1];
      if (i && f) {
        var o = i.split(`
`), b = f.split(`
`);
        for (n = a = 0; a < o.length && !o[a].includes("DetermineComponentFrameRoot"); )
          a++;
        for (; n < b.length && !b[n].includes(
          "DetermineComponentFrameRoot"
        ); )
          n++;
        if (a === o.length || n === b.length)
          for (a = o.length - 1, n = b.length - 1; 1 <= a && 0 <= n && o[a] !== b[n]; )
            n--;
        for (; 1 <= a && 0 <= n; a--, n--)
          if (o[a] !== b[n]) {
            if (a !== 1 || n !== 1)
              do
                if (a--, n--, 0 > n || o[a] !== b[n]) {
                  var j = `
` + o[a].replace(" at new ", " at ");
                  return e.displayName && j.includes("<anonymous>") && (j = j.replace("<anonymous>", e.displayName)), j;
                }
              while (1 <= a && 0 <= n);
            break;
          }
      }
    } finally {
      me = !1, Error.prepareStackTrace = l;
    }
    return (l = e ? e.displayName || e.name : "") ? Q(l) : "";
  }
  function qe(e, t) {
    switch (e.tag) {
      case 26:
      case 27:
      case 5:
        return Q(e.type);
      case 16:
        return Q("Lazy");
      case 13:
        return e.child !== t && t !== null ? Q("Suspense Fallback") : Q("Suspense");
      case 19:
        return Q("SuspenseList");
      case 0:
      case 15:
        return Me(e.type, !1);
      case 11:
        return Me(e.type.render, !1);
      case 1:
        return Me(e.type, !0);
      case 31:
        return Q("Activity");
      default:
        return "";
    }
  }
  function dt(e) {
    try {
      var t = "", l = null;
      do
        t += qe(e, l), l = e, e = e.return;
      while (e);
      return t;
    } catch (a) {
      return `
Error generating stack: ` + a.message + `
` + a.stack;
    }
  }
  var Ie = Object.prototype.hasOwnProperty, Ye = r.unstable_scheduleCallback, Yl = r.unstable_cancelCallback, Za = r.unstable_shouldYield, Ka = r.unstable_requestPaint, st = r.unstable_now, oi = r.unstable_getCurrentPriorityLevel, Ja = r.unstable_ImmediatePriority, Zn = r.unstable_UserBlockingPriority, ua = r.unstable_NormalPriority, Kn = r.unstable_LowPriority, ka = r.unstable_IdlePriority, Wa = r.log, di = r.unstable_setDisableYieldValue, Gl = null, Nt = null;
  function hl(e) {
    if (typeof Wa == "function" && di(e), Nt && typeof Nt.setStrictMode == "function")
      try {
        Nt.setStrictMode(Gl, e);
      } catch {
      }
  }
  var Tt = Math.clz32 ? Math.clz32 : u0, a0 = Math.log, n0 = Math.LN2;
  function u0(e) {
    return e >>>= 0, e === 0 ? 32 : 31 - (a0(e) / n0 | 0) | 0;
  }
  var Jn = 256, kn = 262144, Wn = 4194304;
  function Ql(e) {
    var t = e & 42;
    if (t !== 0) return t;
    switch (e & -e) {
      case 1:
        return 1;
      case 2:
        return 2;
      case 4:
        return 4;
      case 8:
        return 8;
      case 16:
        return 16;
      case 32:
        return 32;
      case 64:
        return 64;
      case 128:
        return 128;
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
        return e & 261888;
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return e & 3932160;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        return e & 62914560;
      case 67108864:
        return 67108864;
      case 134217728:
        return 134217728;
      case 268435456:
        return 268435456;
      case 536870912:
        return 536870912;
      case 1073741824:
        return 0;
      default:
        return e;
    }
  }
  function $n(e, t, l) {
    var a = e.pendingLanes;
    if (a === 0) return 0;
    var n = 0, u = e.suspendedLanes, i = e.pingedLanes;
    e = e.warmLanes;
    var f = a & 134217727;
    return f !== 0 ? (a = f & ~u, a !== 0 ? n = Ql(a) : (i &= f, i !== 0 ? n = Ql(i) : l || (l = f & ~e, l !== 0 && (n = Ql(l))))) : (f = a & ~u, f !== 0 ? n = Ql(f) : i !== 0 ? n = Ql(i) : l || (l = a & ~e, l !== 0 && (n = Ql(l)))), n === 0 ? 0 : t !== 0 && t !== n && (t & u) === 0 && (u = n & -n, l = t & -t, u >= l || u === 32 && (l & 4194048) !== 0) ? t : n;
  }
  function $a(e, t) {
    return (e.pendingLanes & ~(e.suspendedLanes & ~e.pingedLanes) & t) === 0;
  }
  function i0(e, t) {
    switch (e) {
      case 1:
      case 2:
      case 4:
      case 8:
      case 64:
        return t + 250;
      case 16:
      case 32:
      case 128:
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return t + 5e3;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        return -1;
      case 67108864:
      case 134217728:
      case 268435456:
      case 536870912:
      case 1073741824:
        return -1;
      default:
        return -1;
    }
  }
  function Rf() {
    var e = Wn;
    return Wn <<= 1, (Wn & 62914560) === 0 && (Wn = 4194304), e;
  }
  function mi(e) {
    for (var t = [], l = 0; 31 > l; l++) t.push(e);
    return t;
  }
  function Fa(e, t) {
    e.pendingLanes |= t, t !== 268435456 && (e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0);
  }
  function c0(e, t, l, a, n, u) {
    var i = e.pendingLanes;
    e.pendingLanes = l, e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0, e.expiredLanes &= l, e.entangledLanes &= l, e.errorRecoveryDisabledLanes &= l, e.shellSuspendCounter = 0;
    var f = e.entanglements, o = e.expirationTimes, b = e.hiddenUpdates;
    for (l = i & ~l; 0 < l; ) {
      var j = 31 - Tt(l), _ = 1 << j;
      f[j] = 0, o[j] = -1;
      var x = b[j];
      if (x !== null)
        for (b[j] = null, j = 0; j < x.length; j++) {
          var p = x[j];
          p !== null && (p.lane &= -536870913);
        }
      l &= ~_;
    }
    a !== 0 && Hf(e, a, 0), u !== 0 && n === 0 && e.tag !== 0 && (e.suspendedLanes |= u & ~(i & ~t));
  }
  function Hf(e, t, l) {
    e.pendingLanes |= t, e.suspendedLanes &= ~t;
    var a = 31 - Tt(t);
    e.entangledLanes |= t, e.entanglements[a] = e.entanglements[a] | 1073741824 | l & 261930;
  }
  function Bf(e, t) {
    var l = e.entangledLanes |= t;
    for (e = e.entanglements; l; ) {
      var a = 31 - Tt(l), n = 1 << a;
      n & t | e[a] & t && (e[a] |= t), l &= ~n;
    }
  }
  function qf(e, t) {
    var l = t & -t;
    return l = (l & 42) !== 0 ? 1 : hi(l), (l & (e.suspendedLanes | t)) !== 0 ? 0 : l;
  }
  function hi(e) {
    switch (e) {
      case 2:
        e = 1;
        break;
      case 8:
        e = 4;
        break;
      case 32:
        e = 16;
        break;
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        e = 128;
        break;
      case 268435456:
        e = 134217728;
        break;
      default:
        e = 0;
    }
    return e;
  }
  function vi(e) {
    return e &= -e, 2 < e ? 8 < e ? (e & 134217727) !== 0 ? 32 : 268435456 : 8 : 2;
  }
  function Yf() {
    var e = R.p;
    return e !== 0 ? e : (e = window.event, e === void 0 ? 32 : zd(e.type));
  }
  function Gf(e, t) {
    var l = R.p;
    try {
      return R.p = e, t();
    } finally {
      R.p = l;
    }
  }
  var vl = Math.random().toString(36).slice(2), at = "__reactFiber$" + vl, ht = "__reactProps$" + vl, ia = "__reactContainer$" + vl, yi = "__reactEvents$" + vl, f0 = "__reactListeners$" + vl, s0 = "__reactHandles$" + vl, Qf = "__reactResources$" + vl, Ia = "__reactMarker$" + vl;
  function gi(e) {
    delete e[at], delete e[ht], delete e[yi], delete e[f0], delete e[s0];
  }
  function ca(e) {
    var t = e[at];
    if (t) return t;
    for (var l = e.parentNode; l; ) {
      if (t = l[ia] || l[at]) {
        if (l = t.alternate, t.child !== null || l !== null && l.child !== null)
          for (e = sd(e); e !== null; ) {
            if (l = e[at]) return l;
            e = sd(e);
          }
        return t;
      }
      e = l, l = e.parentNode;
    }
    return null;
  }
  function fa(e) {
    if (e = e[at] || e[ia]) {
      var t = e.tag;
      if (t === 5 || t === 6 || t === 13 || t === 31 || t === 26 || t === 27 || t === 3)
        return e;
    }
    return null;
  }
  function Pa(e) {
    var t = e.tag;
    if (t === 5 || t === 26 || t === 27 || t === 6) return e.stateNode;
    throw Error(m(33));
  }
  function sa(e) {
    var t = e[Qf];
    return t || (t = e[Qf] = { hoistableStyles: /* @__PURE__ */ new Map(), hoistableScripts: /* @__PURE__ */ new Map() }), t;
  }
  function et(e) {
    e[Ia] = !0;
  }
  var Lf = /* @__PURE__ */ new Set(), Xf = {};
  function Ll(e, t) {
    ra(e, t), ra(e + "Capture", t);
  }
  function ra(e, t) {
    for (Xf[e] = t, e = 0; e < t.length; e++)
      Lf.add(t[e]);
  }
  var r0 = RegExp(
    "^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"
  ), Vf = {}, Zf = {};
  function o0(e) {
    return Ie.call(Zf, e) ? !0 : Ie.call(Vf, e) ? !1 : r0.test(e) ? Zf[e] = !0 : (Vf[e] = !0, !1);
  }
  function Fn(e, t, l) {
    if (o0(t))
      if (l === null) e.removeAttribute(t);
      else {
        switch (typeof l) {
          case "undefined":
          case "function":
          case "symbol":
            e.removeAttribute(t);
            return;
          case "boolean":
            var a = t.toLowerCase().slice(0, 5);
            if (a !== "data-" && a !== "aria-") {
              e.removeAttribute(t);
              return;
            }
        }
        e.setAttribute(t, "" + l);
      }
  }
  function In(e, t, l) {
    if (l === null) e.removeAttribute(t);
    else {
      switch (typeof l) {
        case "undefined":
        case "function":
        case "symbol":
        case "boolean":
          e.removeAttribute(t);
          return;
      }
      e.setAttribute(t, "" + l);
    }
  }
  function kt(e, t, l, a) {
    if (a === null) e.removeAttribute(l);
    else {
      switch (typeof a) {
        case "undefined":
        case "function":
        case "symbol":
        case "boolean":
          e.removeAttribute(l);
          return;
      }
      e.setAttributeNS(t, l, "" + a);
    }
  }
  function Ot(e) {
    switch (typeof e) {
      case "bigint":
      case "boolean":
      case "number":
      case "string":
      case "undefined":
        return e;
      case "object":
        return e;
      default:
        return "";
    }
  }
  function Kf(e) {
    var t = e.type;
    return (e = e.nodeName) && e.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
  }
  function d0(e, t, l) {
    var a = Object.getOwnPropertyDescriptor(
      e.constructor.prototype,
      t
    );
    if (!e.hasOwnProperty(t) && typeof a < "u" && typeof a.get == "function" && typeof a.set == "function") {
      var n = a.get, u = a.set;
      return Object.defineProperty(e, t, {
        configurable: !0,
        get: function() {
          return n.call(this);
        },
        set: function(i) {
          l = "" + i, u.call(this, i);
        }
      }), Object.defineProperty(e, t, {
        enumerable: a.enumerable
      }), {
        getValue: function() {
          return l;
        },
        setValue: function(i) {
          l = "" + i;
        },
        stopTracking: function() {
          e._valueTracker = null, delete e[t];
        }
      };
    }
  }
  function bi(e) {
    if (!e._valueTracker) {
      var t = Kf(e) ? "checked" : "value";
      e._valueTracker = d0(
        e,
        t,
        "" + e[t]
      );
    }
  }
  function Jf(e) {
    if (!e) return !1;
    var t = e._valueTracker;
    if (!t) return !0;
    var l = t.getValue(), a = "";
    return e && (a = Kf(e) ? e.checked ? "true" : "false" : e.value), e = a, e !== l ? (t.setValue(e), !0) : !1;
  }
  function Pn(e) {
    if (e = e || (typeof document < "u" ? document : void 0), typeof e > "u") return null;
    try {
      return e.activeElement || e.body;
    } catch {
      return e.body;
    }
  }
  var m0 = /[\n"\\]/g;
  function Ut(e) {
    return e.replace(
      m0,
      function(t) {
        return "\\" + t.charCodeAt(0).toString(16) + " ";
      }
    );
  }
  function xi(e, t, l, a, n, u, i, f) {
    e.name = "", i != null && typeof i != "function" && typeof i != "symbol" && typeof i != "boolean" ? e.type = i : e.removeAttribute("type"), t != null ? i === "number" ? (t === 0 && e.value === "" || e.value != t) && (e.value = "" + Ot(t)) : e.value !== "" + Ot(t) && (e.value = "" + Ot(t)) : i !== "submit" && i !== "reset" || e.removeAttribute("value"), t != null ? pi(e, i, Ot(t)) : l != null ? pi(e, i, Ot(l)) : a != null && e.removeAttribute("value"), n == null && u != null && (e.defaultChecked = !!u), n != null && (e.checked = n && typeof n != "function" && typeof n != "symbol"), f != null && typeof f != "function" && typeof f != "symbol" && typeof f != "boolean" ? e.name = "" + Ot(f) : e.removeAttribute("name");
  }
  function kf(e, t, l, a, n, u, i, f) {
    if (u != null && typeof u != "function" && typeof u != "symbol" && typeof u != "boolean" && (e.type = u), t != null || l != null) {
      if (!(u !== "submit" && u !== "reset" || t != null)) {
        bi(e);
        return;
      }
      l = l != null ? "" + Ot(l) : "", t = t != null ? "" + Ot(t) : l, f || t === e.value || (e.value = t), e.defaultValue = t;
    }
    a = a ?? n, a = typeof a != "function" && typeof a != "symbol" && !!a, e.checked = f ? e.checked : !!a, e.defaultChecked = !!a, i != null && typeof i != "function" && typeof i != "symbol" && typeof i != "boolean" && (e.name = i), bi(e);
  }
  function pi(e, t, l) {
    t === "number" && Pn(e.ownerDocument) === e || e.defaultValue === "" + l || (e.defaultValue = "" + l);
  }
  function oa(e, t, l, a) {
    if (e = e.options, t) {
      t = {};
      for (var n = 0; n < l.length; n++)
        t["$" + l[n]] = !0;
      for (l = 0; l < e.length; l++)
        n = t.hasOwnProperty("$" + e[l].value), e[l].selected !== n && (e[l].selected = n), n && a && (e[l].defaultSelected = !0);
    } else {
      for (l = "" + Ot(l), t = null, n = 0; n < e.length; n++) {
        if (e[n].value === l) {
          e[n].selected = !0, a && (e[n].defaultSelected = !0);
          return;
        }
        t !== null || e[n].disabled || (t = e[n]);
      }
      t !== null && (t.selected = !0);
    }
  }
  function Wf(e, t, l) {
    if (t != null && (t = "" + Ot(t), t !== e.value && (e.value = t), l == null)) {
      e.defaultValue !== t && (e.defaultValue = t);
      return;
    }
    e.defaultValue = l != null ? "" + Ot(l) : "";
  }
  function $f(e, t, l, a) {
    if (t == null) {
      if (a != null) {
        if (l != null) throw Error(m(92));
        if (fe(a)) {
          if (1 < a.length) throw Error(m(93));
          a = a[0];
        }
        l = a;
      }
      l == null && (l = ""), t = l;
    }
    l = Ot(t), e.defaultValue = l, a = e.textContent, a === l && a !== "" && a !== null && (e.value = a), bi(e);
  }
  function da(e, t) {
    if (t) {
      var l = e.firstChild;
      if (l && l === e.lastChild && l.nodeType === 3) {
        l.nodeValue = t;
        return;
      }
    }
    e.textContent = t;
  }
  var h0 = new Set(
    "animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(
      " "
    )
  );
  function Ff(e, t, l) {
    var a = t.indexOf("--") === 0;
    l == null || typeof l == "boolean" || l === "" ? a ? e.setProperty(t, "") : t === "float" ? e.cssFloat = "" : e[t] = "" : a ? e.setProperty(t, l) : typeof l != "number" || l === 0 || h0.has(t) ? t === "float" ? e.cssFloat = l : e[t] = ("" + l).trim() : e[t] = l + "px";
  }
  function If(e, t, l) {
    if (t != null && typeof t != "object")
      throw Error(m(62));
    if (e = e.style, l != null) {
      for (var a in l)
        !l.hasOwnProperty(a) || t != null && t.hasOwnProperty(a) || (a.indexOf("--") === 0 ? e.setProperty(a, "") : a === "float" ? e.cssFloat = "" : e[a] = "");
      for (var n in t)
        a = t[n], t.hasOwnProperty(n) && l[n] !== a && Ff(e, n, a);
    } else
      for (var u in t)
        t.hasOwnProperty(u) && Ff(e, u, t[u]);
  }
  function Si(e) {
    if (e.indexOf("-") === -1) return !1;
    switch (e) {
      case "annotation-xml":
      case "color-profile":
      case "font-face":
      case "font-face-src":
      case "font-face-uri":
      case "font-face-format":
      case "font-face-name":
      case "missing-glyph":
        return !1;
      default:
        return !0;
    }
  }
  var v0 = /* @__PURE__ */ new Map([
    ["acceptCharset", "accept-charset"],
    ["htmlFor", "for"],
    ["httpEquiv", "http-equiv"],
    ["crossOrigin", "crossorigin"],
    ["accentHeight", "accent-height"],
    ["alignmentBaseline", "alignment-baseline"],
    ["arabicForm", "arabic-form"],
    ["baselineShift", "baseline-shift"],
    ["capHeight", "cap-height"],
    ["clipPath", "clip-path"],
    ["clipRule", "clip-rule"],
    ["colorInterpolation", "color-interpolation"],
    ["colorInterpolationFilters", "color-interpolation-filters"],
    ["colorProfile", "color-profile"],
    ["colorRendering", "color-rendering"],
    ["dominantBaseline", "dominant-baseline"],
    ["enableBackground", "enable-background"],
    ["fillOpacity", "fill-opacity"],
    ["fillRule", "fill-rule"],
    ["floodColor", "flood-color"],
    ["floodOpacity", "flood-opacity"],
    ["fontFamily", "font-family"],
    ["fontSize", "font-size"],
    ["fontSizeAdjust", "font-size-adjust"],
    ["fontStretch", "font-stretch"],
    ["fontStyle", "font-style"],
    ["fontVariant", "font-variant"],
    ["fontWeight", "font-weight"],
    ["glyphName", "glyph-name"],
    ["glyphOrientationHorizontal", "glyph-orientation-horizontal"],
    ["glyphOrientationVertical", "glyph-orientation-vertical"],
    ["horizAdvX", "horiz-adv-x"],
    ["horizOriginX", "horiz-origin-x"],
    ["imageRendering", "image-rendering"],
    ["letterSpacing", "letter-spacing"],
    ["lightingColor", "lighting-color"],
    ["markerEnd", "marker-end"],
    ["markerMid", "marker-mid"],
    ["markerStart", "marker-start"],
    ["overlinePosition", "overline-position"],
    ["overlineThickness", "overline-thickness"],
    ["paintOrder", "paint-order"],
    ["panose-1", "panose-1"],
    ["pointerEvents", "pointer-events"],
    ["renderingIntent", "rendering-intent"],
    ["shapeRendering", "shape-rendering"],
    ["stopColor", "stop-color"],
    ["stopOpacity", "stop-opacity"],
    ["strikethroughPosition", "strikethrough-position"],
    ["strikethroughThickness", "strikethrough-thickness"],
    ["strokeDasharray", "stroke-dasharray"],
    ["strokeDashoffset", "stroke-dashoffset"],
    ["strokeLinecap", "stroke-linecap"],
    ["strokeLinejoin", "stroke-linejoin"],
    ["strokeMiterlimit", "stroke-miterlimit"],
    ["strokeOpacity", "stroke-opacity"],
    ["strokeWidth", "stroke-width"],
    ["textAnchor", "text-anchor"],
    ["textDecoration", "text-decoration"],
    ["textRendering", "text-rendering"],
    ["transformOrigin", "transform-origin"],
    ["underlinePosition", "underline-position"],
    ["underlineThickness", "underline-thickness"],
    ["unicodeBidi", "unicode-bidi"],
    ["unicodeRange", "unicode-range"],
    ["unitsPerEm", "units-per-em"],
    ["vAlphabetic", "v-alphabetic"],
    ["vHanging", "v-hanging"],
    ["vIdeographic", "v-ideographic"],
    ["vMathematical", "v-mathematical"],
    ["vectorEffect", "vector-effect"],
    ["vertAdvY", "vert-adv-y"],
    ["vertOriginX", "vert-origin-x"],
    ["vertOriginY", "vert-origin-y"],
    ["wordSpacing", "word-spacing"],
    ["writingMode", "writing-mode"],
    ["xmlnsXlink", "xmlns:xlink"],
    ["xHeight", "x-height"]
  ]), y0 = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
  function eu(e) {
    return y0.test("" + e) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : e;
  }
  function Wt() {
  }
  var Ni = null;
  function Ti(e) {
    return e = e.target || e.srcElement || window, e.correspondingUseElement && (e = e.correspondingUseElement), e.nodeType === 3 ? e.parentNode : e;
  }
  var ma = null, ha = null;
  function Pf(e) {
    var t = fa(e);
    if (t && (e = t.stateNode)) {
      var l = e[ht] || null;
      e: switch (e = t.stateNode, t.type) {
        case "input":
          if (xi(
            e,
            l.value,
            l.defaultValue,
            l.defaultValue,
            l.checked,
            l.defaultChecked,
            l.type,
            l.name
          ), t = l.name, l.type === "radio" && t != null) {
            for (l = e; l.parentNode; ) l = l.parentNode;
            for (l = l.querySelectorAll(
              'input[name="' + Ut(
                "" + t
              ) + '"][type="radio"]'
            ), t = 0; t < l.length; t++) {
              var a = l[t];
              if (a !== e && a.form === e.form) {
                var n = a[ht] || null;
                if (!n) throw Error(m(90));
                xi(
                  a,
                  n.value,
                  n.defaultValue,
                  n.defaultValue,
                  n.checked,
                  n.defaultChecked,
                  n.type,
                  n.name
                );
              }
            }
            for (t = 0; t < l.length; t++)
              a = l[t], a.form === e.form && Jf(a);
          }
          break e;
        case "textarea":
          Wf(e, l.value, l.defaultValue);
          break e;
        case "select":
          t = l.value, t != null && oa(e, !!l.multiple, t, !1);
      }
    }
  }
  var ji = !1;
  function es(e, t, l) {
    if (ji) return e(t, l);
    ji = !0;
    try {
      var a = e(t);
      return a;
    } finally {
      if (ji = !1, (ma !== null || ha !== null) && (Qu(), ma && (t = ma, e = ha, ha = ma = null, Pf(t), e)))
        for (t = 0; t < e.length; t++) Pf(e[t]);
    }
  }
  function en(e, t) {
    var l = e.stateNode;
    if (l === null) return null;
    var a = l[ht] || null;
    if (a === null) return null;
    l = a[t];
    e: switch (t) {
      case "onClick":
      case "onClickCapture":
      case "onDoubleClick":
      case "onDoubleClickCapture":
      case "onMouseDown":
      case "onMouseDownCapture":
      case "onMouseMove":
      case "onMouseMoveCapture":
      case "onMouseUp":
      case "onMouseUpCapture":
      case "onMouseEnter":
        (a = !a.disabled) || (e = e.type, a = !(e === "button" || e === "input" || e === "select" || e === "textarea")), e = !a;
        break e;
      default:
        e = !1;
    }
    if (e) return null;
    if (l && typeof l != "function")
      throw Error(
        m(231, t, typeof l)
      );
    return l;
  }
  var $t = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), zi = !1;
  if ($t)
    try {
      var tn = {};
      Object.defineProperty(tn, "passive", {
        get: function() {
          zi = !0;
        }
      }), window.addEventListener("test", tn, tn), window.removeEventListener("test", tn, tn);
    } catch {
      zi = !1;
    }
  var yl = null, Ei = null, tu = null;
  function ts() {
    if (tu) return tu;
    var e, t = Ei, l = t.length, a, n = "value" in yl ? yl.value : yl.textContent, u = n.length;
    for (e = 0; e < l && t[e] === n[e]; e++) ;
    var i = l - e;
    for (a = 1; a <= i && t[l - a] === n[u - a]; a++) ;
    return tu = n.slice(e, 1 < a ? 1 - a : void 0);
  }
  function lu(e) {
    var t = e.keyCode;
    return "charCode" in e ? (e = e.charCode, e === 0 && t === 13 && (e = 13)) : e = t, e === 10 && (e = 13), 32 <= e || e === 13 ? e : 0;
  }
  function au() {
    return !0;
  }
  function ls() {
    return !1;
  }
  function vt(e) {
    function t(l, a, n, u, i) {
      this._reactName = l, this._targetInst = n, this.type = a, this.nativeEvent = u, this.target = i, this.currentTarget = null;
      for (var f in e)
        e.hasOwnProperty(f) && (l = e[f], this[f] = l ? l(u) : u[f]);
      return this.isDefaultPrevented = (u.defaultPrevented != null ? u.defaultPrevented : u.returnValue === !1) ? au : ls, this.isPropagationStopped = ls, this;
    }
    return B(t.prototype, {
      preventDefault: function() {
        this.defaultPrevented = !0;
        var l = this.nativeEvent;
        l && (l.preventDefault ? l.preventDefault() : typeof l.returnValue != "unknown" && (l.returnValue = !1), this.isDefaultPrevented = au);
      },
      stopPropagation: function() {
        var l = this.nativeEvent;
        l && (l.stopPropagation ? l.stopPropagation() : typeof l.cancelBubble != "unknown" && (l.cancelBubble = !0), this.isPropagationStopped = au);
      },
      persist: function() {
      },
      isPersistent: au
    }), t;
  }
  var Xl = {
    eventPhase: 0,
    bubbles: 0,
    cancelable: 0,
    timeStamp: function(e) {
      return e.timeStamp || Date.now();
    },
    defaultPrevented: 0,
    isTrusted: 0
  }, nu = vt(Xl), ln = B({}, Xl, { view: 0, detail: 0 }), g0 = vt(ln), _i, Mi, an, uu = B({}, ln, {
    screenX: 0,
    screenY: 0,
    clientX: 0,
    clientY: 0,
    pageX: 0,
    pageY: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    getModifierState: Ci,
    button: 0,
    buttons: 0,
    relatedTarget: function(e) {
      return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
    },
    movementX: function(e) {
      return "movementX" in e ? e.movementX : (e !== an && (an && e.type === "mousemove" ? (_i = e.screenX - an.screenX, Mi = e.screenY - an.screenY) : Mi = _i = 0, an = e), _i);
    },
    movementY: function(e) {
      return "movementY" in e ? e.movementY : Mi;
    }
  }), as = vt(uu), b0 = B({}, uu, { dataTransfer: 0 }), x0 = vt(b0), p0 = B({}, ln, { relatedTarget: 0 }), Ai = vt(p0), S0 = B({}, Xl, {
    animationName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), N0 = vt(S0), T0 = B({}, Xl, {
    clipboardData: function(e) {
      return "clipboardData" in e ? e.clipboardData : window.clipboardData;
    }
  }), j0 = vt(T0), z0 = B({}, Xl, { data: 0 }), ns = vt(z0), E0 = {
    Esc: "Escape",
    Spacebar: " ",
    Left: "ArrowLeft",
    Up: "ArrowUp",
    Right: "ArrowRight",
    Down: "ArrowDown",
    Del: "Delete",
    Win: "OS",
    Menu: "ContextMenu",
    Apps: "ContextMenu",
    Scroll: "ScrollLock",
    MozPrintableKey: "Unidentified"
  }, _0 = {
    8: "Backspace",
    9: "Tab",
    12: "Clear",
    13: "Enter",
    16: "Shift",
    17: "Control",
    18: "Alt",
    19: "Pause",
    20: "CapsLock",
    27: "Escape",
    32: " ",
    33: "PageUp",
    34: "PageDown",
    35: "End",
    36: "Home",
    37: "ArrowLeft",
    38: "ArrowUp",
    39: "ArrowRight",
    40: "ArrowDown",
    45: "Insert",
    46: "Delete",
    112: "F1",
    113: "F2",
    114: "F3",
    115: "F4",
    116: "F5",
    117: "F6",
    118: "F7",
    119: "F8",
    120: "F9",
    121: "F10",
    122: "F11",
    123: "F12",
    144: "NumLock",
    145: "ScrollLock",
    224: "Meta"
  }, M0 = {
    Alt: "altKey",
    Control: "ctrlKey",
    Meta: "metaKey",
    Shift: "shiftKey"
  };
  function A0(e) {
    var t = this.nativeEvent;
    return t.getModifierState ? t.getModifierState(e) : (e = M0[e]) ? !!t[e] : !1;
  }
  function Ci() {
    return A0;
  }
  var C0 = B({}, ln, {
    key: function(e) {
      if (e.key) {
        var t = E0[e.key] || e.key;
        if (t !== "Unidentified") return t;
      }
      return e.type === "keypress" ? (e = lu(e), e === 13 ? "Enter" : String.fromCharCode(e)) : e.type === "keydown" || e.type === "keyup" ? _0[e.keyCode] || "Unidentified" : "";
    },
    code: 0,
    location: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    repeat: 0,
    locale: 0,
    getModifierState: Ci,
    charCode: function(e) {
      return e.type === "keypress" ? lu(e) : 0;
    },
    keyCode: function(e) {
      return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
    },
    which: function(e) {
      return e.type === "keypress" ? lu(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
    }
  }), O0 = vt(C0), U0 = B({}, uu, {
    pointerId: 0,
    width: 0,
    height: 0,
    pressure: 0,
    tangentialPressure: 0,
    tiltX: 0,
    tiltY: 0,
    twist: 0,
    pointerType: 0,
    isPrimary: 0
  }), us = vt(U0), D0 = B({}, ln, {
    touches: 0,
    targetTouches: 0,
    changedTouches: 0,
    altKey: 0,
    metaKey: 0,
    ctrlKey: 0,
    shiftKey: 0,
    getModifierState: Ci
  }), w0 = vt(D0), R0 = B({}, Xl, {
    propertyName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), H0 = vt(R0), B0 = B({}, uu, {
    deltaX: function(e) {
      return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
    },
    deltaY: function(e) {
      return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), q0 = vt(B0), Y0 = B({}, Xl, {
    newState: 0,
    oldState: 0
  }), G0 = vt(Y0), Q0 = [9, 13, 27, 32], Oi = $t && "CompositionEvent" in window, nn = null;
  $t && "documentMode" in document && (nn = document.documentMode);
  var L0 = $t && "TextEvent" in window && !nn, is = $t && (!Oi || nn && 8 < nn && 11 >= nn), cs = " ", fs = !1;
  function ss(e, t) {
    switch (e) {
      case "keyup":
        return Q0.indexOf(t.keyCode) !== -1;
      case "keydown":
        return t.keyCode !== 229;
      case "keypress":
      case "mousedown":
      case "focusout":
        return !0;
      default:
        return !1;
    }
  }
  function rs(e) {
    return e = e.detail, typeof e == "object" && "data" in e ? e.data : null;
  }
  var va = !1;
  function X0(e, t) {
    switch (e) {
      case "compositionend":
        return rs(t);
      case "keypress":
        return t.which !== 32 ? null : (fs = !0, cs);
      case "textInput":
        return e = t.data, e === cs && fs ? null : e;
      default:
        return null;
    }
  }
  function V0(e, t) {
    if (va)
      return e === "compositionend" || !Oi && ss(e, t) ? (e = ts(), tu = Ei = yl = null, va = !1, e) : null;
    switch (e) {
      case "paste":
        return null;
      case "keypress":
        if (!(t.ctrlKey || t.altKey || t.metaKey) || t.ctrlKey && t.altKey) {
          if (t.char && 1 < t.char.length)
            return t.char;
          if (t.which) return String.fromCharCode(t.which);
        }
        return null;
      case "compositionend":
        return is && t.locale !== "ko" ? null : t.data;
      default:
        return null;
    }
  }
  var Z0 = {
    color: !0,
    date: !0,
    datetime: !0,
    "datetime-local": !0,
    email: !0,
    month: !0,
    number: !0,
    password: !0,
    range: !0,
    search: !0,
    tel: !0,
    text: !0,
    time: !0,
    url: !0,
    week: !0
  };
  function os(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t === "input" ? !!Z0[e.type] : t === "textarea";
  }
  function ds(e, t, l, a) {
    ma ? ha ? ha.push(a) : ha = [a] : ma = a, t = ku(t, "onChange"), 0 < t.length && (l = new nu(
      "onChange",
      "change",
      null,
      l,
      a
    ), e.push({ event: l, listeners: t }));
  }
  var un = null, cn = null;
  function K0(e) {
    Wo(e, 0);
  }
  function iu(e) {
    var t = Pa(e);
    if (Jf(t)) return e;
  }
  function ms(e, t) {
    if (e === "change") return t;
  }
  var hs = !1;
  if ($t) {
    var Ui;
    if ($t) {
      var Di = "oninput" in document;
      if (!Di) {
        var vs = document.createElement("div");
        vs.setAttribute("oninput", "return;"), Di = typeof vs.oninput == "function";
      }
      Ui = Di;
    } else Ui = !1;
    hs = Ui && (!document.documentMode || 9 < document.documentMode);
  }
  function ys() {
    un && (un.detachEvent("onpropertychange", gs), cn = un = null);
  }
  function gs(e) {
    if (e.propertyName === "value" && iu(cn)) {
      var t = [];
      ds(
        t,
        cn,
        e,
        Ti(e)
      ), es(K0, t);
    }
  }
  function J0(e, t, l) {
    e === "focusin" ? (ys(), un = t, cn = l, un.attachEvent("onpropertychange", gs)) : e === "focusout" && ys();
  }
  function k0(e) {
    if (e === "selectionchange" || e === "keyup" || e === "keydown")
      return iu(cn);
  }
  function W0(e, t) {
    if (e === "click") return iu(t);
  }
  function $0(e, t) {
    if (e === "input" || e === "change")
      return iu(t);
  }
  function F0(e, t) {
    return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t;
  }
  var jt = typeof Object.is == "function" ? Object.is : F0;
  function fn(e, t) {
    if (jt(e, t)) return !0;
    if (typeof e != "object" || e === null || typeof t != "object" || t === null)
      return !1;
    var l = Object.keys(e), a = Object.keys(t);
    if (l.length !== a.length) return !1;
    for (a = 0; a < l.length; a++) {
      var n = l[a];
      if (!Ie.call(t, n) || !jt(e[n], t[n]))
        return !1;
    }
    return !0;
  }
  function bs(e) {
    for (; e && e.firstChild; ) e = e.firstChild;
    return e;
  }
  function xs(e, t) {
    var l = bs(e);
    e = 0;
    for (var a; l; ) {
      if (l.nodeType === 3) {
        if (a = e + l.textContent.length, e <= t && a >= t)
          return { node: l, offset: t - e };
        e = a;
      }
      e: {
        for (; l; ) {
          if (l.nextSibling) {
            l = l.nextSibling;
            break e;
          }
          l = l.parentNode;
        }
        l = void 0;
      }
      l = bs(l);
    }
  }
  function ps(e, t) {
    return e && t ? e === t ? !0 : e && e.nodeType === 3 ? !1 : t && t.nodeType === 3 ? ps(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1 : !1;
  }
  function Ss(e) {
    e = e != null && e.ownerDocument != null && e.ownerDocument.defaultView != null ? e.ownerDocument.defaultView : window;
    for (var t = Pn(e.document); t instanceof e.HTMLIFrameElement; ) {
      try {
        var l = typeof t.contentWindow.location.href == "string";
      } catch {
        l = !1;
      }
      if (l) e = t.contentWindow;
      else break;
      t = Pn(e.document);
    }
    return t;
  }
  function wi(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
  }
  var I0 = $t && "documentMode" in document && 11 >= document.documentMode, ya = null, Ri = null, sn = null, Hi = !1;
  function Ns(e, t, l) {
    var a = l.window === l ? l.document : l.nodeType === 9 ? l : l.ownerDocument;
    Hi || ya == null || ya !== Pn(a) || (a = ya, "selectionStart" in a && wi(a) ? a = { start: a.selectionStart, end: a.selectionEnd } : (a = (a.ownerDocument && a.ownerDocument.defaultView || window).getSelection(), a = {
      anchorNode: a.anchorNode,
      anchorOffset: a.anchorOffset,
      focusNode: a.focusNode,
      focusOffset: a.focusOffset
    }), sn && fn(sn, a) || (sn = a, a = ku(Ri, "onSelect"), 0 < a.length && (t = new nu(
      "onSelect",
      "select",
      null,
      t,
      l
    ), e.push({ event: t, listeners: a }), t.target = ya)));
  }
  function Vl(e, t) {
    var l = {};
    return l[e.toLowerCase()] = t.toLowerCase(), l["Webkit" + e] = "webkit" + t, l["Moz" + e] = "moz" + t, l;
  }
  var ga = {
    animationend: Vl("Animation", "AnimationEnd"),
    animationiteration: Vl("Animation", "AnimationIteration"),
    animationstart: Vl("Animation", "AnimationStart"),
    transitionrun: Vl("Transition", "TransitionRun"),
    transitionstart: Vl("Transition", "TransitionStart"),
    transitioncancel: Vl("Transition", "TransitionCancel"),
    transitionend: Vl("Transition", "TransitionEnd")
  }, Bi = {}, Ts = {};
  $t && (Ts = document.createElement("div").style, "AnimationEvent" in window || (delete ga.animationend.animation, delete ga.animationiteration.animation, delete ga.animationstart.animation), "TransitionEvent" in window || delete ga.transitionend.transition);
  function Zl(e) {
    if (Bi[e]) return Bi[e];
    if (!ga[e]) return e;
    var t = ga[e], l;
    for (l in t)
      if (t.hasOwnProperty(l) && l in Ts)
        return Bi[e] = t[l];
    return e;
  }
  var js = Zl("animationend"), zs = Zl("animationiteration"), Es = Zl("animationstart"), P0 = Zl("transitionrun"), em = Zl("transitionstart"), tm = Zl("transitioncancel"), _s = Zl("transitionend"), Ms = /* @__PURE__ */ new Map(), qi = "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(
    " "
  );
  qi.push("scrollEnd");
  function Qt(e, t) {
    Ms.set(e, t), Ll(t, [e]);
  }
  var cu = typeof reportError == "function" ? reportError : function(e) {
    if (typeof window == "object" && typeof window.ErrorEvent == "function") {
      var t = new window.ErrorEvent("error", {
        bubbles: !0,
        cancelable: !0,
        message: typeof e == "object" && e !== null && typeof e.message == "string" ? String(e.message) : String(e),
        error: e
      });
      if (!window.dispatchEvent(t)) return;
    } else if (typeof process == "object" && typeof process.emit == "function") {
      process.emit("uncaughtException", e);
      return;
    }
    console.error(e);
  }, Dt = [], ba = 0, Yi = 0;
  function fu() {
    for (var e = ba, t = Yi = ba = 0; t < e; ) {
      var l = Dt[t];
      Dt[t++] = null;
      var a = Dt[t];
      Dt[t++] = null;
      var n = Dt[t];
      Dt[t++] = null;
      var u = Dt[t];
      if (Dt[t++] = null, a !== null && n !== null) {
        var i = a.pending;
        i === null ? n.next = n : (n.next = i.next, i.next = n), a.pending = n;
      }
      u !== 0 && As(l, n, u);
    }
  }
  function su(e, t, l, a) {
    Dt[ba++] = e, Dt[ba++] = t, Dt[ba++] = l, Dt[ba++] = a, Yi |= a, e.lanes |= a, e = e.alternate, e !== null && (e.lanes |= a);
  }
  function Gi(e, t, l, a) {
    return su(e, t, l, a), ru(e);
  }
  function Kl(e, t) {
    return su(e, null, null, t), ru(e);
  }
  function As(e, t, l) {
    e.lanes |= l;
    var a = e.alternate;
    a !== null && (a.lanes |= l);
    for (var n = !1, u = e.return; u !== null; )
      u.childLanes |= l, a = u.alternate, a !== null && (a.childLanes |= l), u.tag === 22 && (e = u.stateNode, e === null || e._visibility & 1 || (n = !0)), e = u, u = u.return;
    return e.tag === 3 ? (u = e.stateNode, n && t !== null && (n = 31 - Tt(l), e = u.hiddenUpdates, a = e[n], a === null ? e[n] = [t] : a.push(t), t.lane = l | 536870912), u) : null;
  }
  function ru(e) {
    if (50 < On)
      throw On = 0, Wc = null, Error(m(185));
    for (var t = e.return; t !== null; )
      e = t, t = e.return;
    return e.tag === 3 ? e.stateNode : null;
  }
  var xa = {};
  function lm(e, t, l, a) {
    this.tag = e, this.key = l, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.refCleanup = this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = a, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function zt(e, t, l, a) {
    return new lm(e, t, l, a);
  }
  function Qi(e) {
    return e = e.prototype, !(!e || !e.isReactComponent);
  }
  function Ft(e, t) {
    var l = e.alternate;
    return l === null ? (l = zt(
      e.tag,
      t,
      e.key,
      e.mode
    ), l.elementType = e.elementType, l.type = e.type, l.stateNode = e.stateNode, l.alternate = e, e.alternate = l) : (l.pendingProps = t, l.type = e.type, l.flags = 0, l.subtreeFlags = 0, l.deletions = null), l.flags = e.flags & 65011712, l.childLanes = e.childLanes, l.lanes = e.lanes, l.child = e.child, l.memoizedProps = e.memoizedProps, l.memoizedState = e.memoizedState, l.updateQueue = e.updateQueue, t = e.dependencies, l.dependencies = t === null ? null : { lanes: t.lanes, firstContext: t.firstContext }, l.sibling = e.sibling, l.index = e.index, l.ref = e.ref, l.refCleanup = e.refCleanup, l;
  }
  function Cs(e, t) {
    e.flags &= 65011714;
    var l = e.alternate;
    return l === null ? (e.childLanes = 0, e.lanes = t, e.child = null, e.subtreeFlags = 0, e.memoizedProps = null, e.memoizedState = null, e.updateQueue = null, e.dependencies = null, e.stateNode = null) : (e.childLanes = l.childLanes, e.lanes = l.lanes, e.child = l.child, e.subtreeFlags = 0, e.deletions = null, e.memoizedProps = l.memoizedProps, e.memoizedState = l.memoizedState, e.updateQueue = l.updateQueue, e.type = l.type, t = l.dependencies, e.dependencies = t === null ? null : {
      lanes: t.lanes,
      firstContext: t.firstContext
    }), e;
  }
  function ou(e, t, l, a, n, u) {
    var i = 0;
    if (a = e, typeof e == "function") Qi(e) && (i = 1);
    else if (typeof e == "string")
      i = ch(
        e,
        l,
        A.current
      ) ? 26 : e === "html" || e === "head" || e === "body" ? 27 : 5;
    else
      e: switch (e) {
        case ft:
          return e = zt(31, l, t, n), e.elementType = ft, e.lanes = u, e;
        case k:
          return Jl(l.children, n, u, t);
        case Y:
          i = 8, n |= 24;
          break;
        case ae:
          return e = zt(12, l, t, n | 2), e.elementType = ae, e.lanes = u, e;
        case de:
          return e = zt(13, l, t, n), e.elementType = de, e.lanes = u, e;
        case ve:
          return e = zt(19, l, t, n), e.elementType = ve, e.lanes = u, e;
        default:
          if (typeof e == "object" && e !== null)
            switch (e.$$typeof) {
              case ce:
                i = 10;
                break e;
              case _e:
                i = 9;
                break e;
              case W:
                i = 11;
                break e;
              case P:
                i = 14;
                break e;
              case Le:
                i = 16, a = null;
                break e;
            }
          i = 29, l = Error(
            m(130, e === null ? "null" : typeof e, "")
          ), a = null;
      }
    return t = zt(i, l, t, n), t.elementType = e, t.type = a, t.lanes = u, t;
  }
  function Jl(e, t, l, a) {
    return e = zt(7, e, a, t), e.lanes = l, e;
  }
  function Li(e, t, l) {
    return e = zt(6, e, null, t), e.lanes = l, e;
  }
  function Os(e) {
    var t = zt(18, null, null, 0);
    return t.stateNode = e, t;
  }
  function Xi(e, t, l) {
    return t = zt(
      4,
      e.children !== null ? e.children : [],
      e.key,
      t
    ), t.lanes = l, t.stateNode = {
      containerInfo: e.containerInfo,
      pendingChildren: null,
      implementation: e.implementation
    }, t;
  }
  var Us = /* @__PURE__ */ new WeakMap();
  function wt(e, t) {
    if (typeof e == "object" && e !== null) {
      var l = Us.get(e);
      return l !== void 0 ? l : (t = {
        value: e,
        source: t,
        stack: dt(t)
      }, Us.set(e, t), t);
    }
    return {
      value: e,
      source: t,
      stack: dt(t)
    };
  }
  var pa = [], Sa = 0, du = null, rn = 0, Rt = [], Ht = 0, gl = null, Vt = 1, Zt = "";
  function It(e, t) {
    pa[Sa++] = rn, pa[Sa++] = du, du = e, rn = t;
  }
  function Ds(e, t, l) {
    Rt[Ht++] = Vt, Rt[Ht++] = Zt, Rt[Ht++] = gl, gl = e;
    var a = Vt;
    e = Zt;
    var n = 32 - Tt(a) - 1;
    a &= ~(1 << n), l += 1;
    var u = 32 - Tt(t) + n;
    if (30 < u) {
      var i = n - n % 5;
      u = (a & (1 << i) - 1).toString(32), a >>= i, n -= i, Vt = 1 << 32 - Tt(t) + n | l << n | a, Zt = u + e;
    } else
      Vt = 1 << u | l << n | a, Zt = e;
  }
  function Vi(e) {
    e.return !== null && (It(e, 1), Ds(e, 1, 0));
  }
  function Zi(e) {
    for (; e === du; )
      du = pa[--Sa], pa[Sa] = null, rn = pa[--Sa], pa[Sa] = null;
    for (; e === gl; )
      gl = Rt[--Ht], Rt[Ht] = null, Zt = Rt[--Ht], Rt[Ht] = null, Vt = Rt[--Ht], Rt[Ht] = null;
  }
  function ws(e, t) {
    Rt[Ht++] = Vt, Rt[Ht++] = Zt, Rt[Ht++] = gl, Vt = t.id, Zt = t.overflow, gl = e;
  }
  var nt = null, Re = null, Se = !1, bl = null, Bt = !1, Ki = Error(m(519));
  function xl(e) {
    var t = Error(
      m(
        418,
        1 < arguments.length && arguments[1] !== void 0 && arguments[1] ? "text" : "HTML",
        ""
      )
    );
    throw on(wt(t, e)), Ki;
  }
  function Rs(e) {
    var t = e.stateNode, l = e.type, a = e.memoizedProps;
    switch (t[at] = e, t[ht] = a, l) {
      case "dialog":
        ge("cancel", t), ge("close", t);
        break;
      case "iframe":
      case "object":
      case "embed":
        ge("load", t);
        break;
      case "video":
      case "audio":
        for (l = 0; l < Dn.length; l++)
          ge(Dn[l], t);
        break;
      case "source":
        ge("error", t);
        break;
      case "img":
      case "image":
      case "link":
        ge("error", t), ge("load", t);
        break;
      case "details":
        ge("toggle", t);
        break;
      case "input":
        ge("invalid", t), kf(
          t,
          a.value,
          a.defaultValue,
          a.checked,
          a.defaultChecked,
          a.type,
          a.name,
          !0
        );
        break;
      case "select":
        ge("invalid", t);
        break;
      case "textarea":
        ge("invalid", t), $f(t, a.value, a.defaultValue, a.children);
    }
    l = a.children, typeof l != "string" && typeof l != "number" && typeof l != "bigint" || t.textContent === "" + l || a.suppressHydrationWarning === !0 || Po(t.textContent, l) ? (a.popover != null && (ge("beforetoggle", t), ge("toggle", t)), a.onScroll != null && ge("scroll", t), a.onScrollEnd != null && ge("scrollend", t), a.onClick != null && (t.onclick = Wt), t = !0) : t = !1, t || xl(e, !0);
  }
  function Hs(e) {
    for (nt = e.return; nt; )
      switch (nt.tag) {
        case 5:
        case 31:
        case 13:
          Bt = !1;
          return;
        case 27:
        case 3:
          Bt = !0;
          return;
        default:
          nt = nt.return;
      }
  }
  function Na(e) {
    if (e !== nt) return !1;
    if (!Se) return Hs(e), Se = !0, !1;
    var t = e.tag, l;
    if ((l = t !== 3 && t !== 27) && ((l = t === 5) && (l = e.type, l = !(l !== "form" && l !== "button") || of(e.type, e.memoizedProps)), l = !l), l && Re && xl(e), Hs(e), t === 13) {
      if (e = e.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(m(317));
      Re = fd(e);
    } else if (t === 31) {
      if (e = e.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(m(317));
      Re = fd(e);
    } else
      t === 27 ? (t = Re, Dl(e.type) ? (e = yf, yf = null, Re = e) : Re = t) : Re = nt ? Yt(e.stateNode.nextSibling) : null;
    return !0;
  }
  function kl() {
    Re = nt = null, Se = !1;
  }
  function Ji() {
    var e = bl;
    return e !== null && (xt === null ? xt = e : xt.push.apply(
      xt,
      e
    ), bl = null), e;
  }
  function on(e) {
    bl === null ? bl = [e] : bl.push(e);
  }
  var ki = c(null), Wl = null, Pt = null;
  function pl(e, t, l) {
    z(ki, t._currentValue), t._currentValue = l;
  }
  function el(e) {
    e._currentValue = ki.current, y(ki);
  }
  function Wi(e, t, l) {
    for (; e !== null; ) {
      var a = e.alternate;
      if ((e.childLanes & t) !== t ? (e.childLanes |= t, a !== null && (a.childLanes |= t)) : a !== null && (a.childLanes & t) !== t && (a.childLanes |= t), e === l) break;
      e = e.return;
    }
  }
  function $i(e, t, l, a) {
    var n = e.child;
    for (n !== null && (n.return = e); n !== null; ) {
      var u = n.dependencies;
      if (u !== null) {
        var i = n.child;
        u = u.firstContext;
        e: for (; u !== null; ) {
          var f = u;
          u = n;
          for (var o = 0; o < t.length; o++)
            if (f.context === t[o]) {
              u.lanes |= l, f = u.alternate, f !== null && (f.lanes |= l), Wi(
                u.return,
                l,
                e
              ), a || (i = null);
              break e;
            }
          u = f.next;
        }
      } else if (n.tag === 18) {
        if (i = n.return, i === null) throw Error(m(341));
        i.lanes |= l, u = i.alternate, u !== null && (u.lanes |= l), Wi(i, l, e), i = null;
      } else i = n.child;
      if (i !== null) i.return = n;
      else
        for (i = n; i !== null; ) {
          if (i === e) {
            i = null;
            break;
          }
          if (n = i.sibling, n !== null) {
            n.return = i.return, i = n;
            break;
          }
          i = i.return;
        }
      n = i;
    }
  }
  function Ta(e, t, l, a) {
    e = null;
    for (var n = t, u = !1; n !== null; ) {
      if (!u) {
        if ((n.flags & 524288) !== 0) u = !0;
        else if ((n.flags & 262144) !== 0) break;
      }
      if (n.tag === 10) {
        var i = n.alternate;
        if (i === null) throw Error(m(387));
        if (i = i.memoizedProps, i !== null) {
          var f = n.type;
          jt(n.pendingProps.value, i.value) || (e !== null ? e.push(f) : e = [f]);
        }
      } else if (n === w.current) {
        if (i = n.alternate, i === null) throw Error(m(387));
        i.memoizedState.memoizedState !== n.memoizedState.memoizedState && (e !== null ? e.push(qn) : e = [qn]);
      }
      n = n.return;
    }
    e !== null && $i(
      t,
      e,
      l,
      a
    ), t.flags |= 262144;
  }
  function mu(e) {
    for (e = e.firstContext; e !== null; ) {
      if (!jt(
        e.context._currentValue,
        e.memoizedValue
      ))
        return !0;
      e = e.next;
    }
    return !1;
  }
  function $l(e) {
    Wl = e, Pt = null, e = e.dependencies, e !== null && (e.firstContext = null);
  }
  function ut(e) {
    return Bs(Wl, e);
  }
  function hu(e, t) {
    return Wl === null && $l(e), Bs(e, t);
  }
  function Bs(e, t) {
    var l = t._currentValue;
    if (t = { context: t, memoizedValue: l, next: null }, Pt === null) {
      if (e === null) throw Error(m(308));
      Pt = t, e.dependencies = { lanes: 0, firstContext: t }, e.flags |= 524288;
    } else Pt = Pt.next = t;
    return l;
  }
  var am = typeof AbortController < "u" ? AbortController : function() {
    var e = [], t = this.signal = {
      aborted: !1,
      addEventListener: function(l, a) {
        e.push(a);
      }
    };
    this.abort = function() {
      t.aborted = !0, e.forEach(function(l) {
        return l();
      });
    };
  }, nm = r.unstable_scheduleCallback, um = r.unstable_NormalPriority, Ke = {
    $$typeof: ce,
    Consumer: null,
    Provider: null,
    _currentValue: null,
    _currentValue2: null,
    _threadCount: 0
  };
  function Fi() {
    return {
      controller: new am(),
      data: /* @__PURE__ */ new Map(),
      refCount: 0
    };
  }
  function dn(e) {
    e.refCount--, e.refCount === 0 && nm(um, function() {
      e.controller.abort();
    });
  }
  var mn = null, Ii = 0, ja = 0, za = null;
  function im(e, t) {
    if (mn === null) {
      var l = mn = [];
      Ii = 0, ja = tf(), za = {
        status: "pending",
        value: void 0,
        then: function(a) {
          l.push(a);
        }
      };
    }
    return Ii++, t.then(qs, qs), t;
  }
  function qs() {
    if (--Ii === 0 && mn !== null) {
      za !== null && (za.status = "fulfilled");
      var e = mn;
      mn = null, ja = 0, za = null;
      for (var t = 0; t < e.length; t++) (0, e[t])();
    }
  }
  function cm(e, t) {
    var l = [], a = {
      status: "pending",
      value: null,
      reason: null,
      then: function(n) {
        l.push(n);
      }
    };
    return e.then(
      function() {
        a.status = "fulfilled", a.value = t;
        for (var n = 0; n < l.length; n++) (0, l[n])(t);
      },
      function(n) {
        for (a.status = "rejected", a.reason = n, n = 0; n < l.length; n++)
          (0, l[n])(void 0);
      }
    ), a;
  }
  var Ys = S.S;
  S.S = function(e, t) {
    To = st(), typeof t == "object" && t !== null && typeof t.then == "function" && im(e, t), Ys !== null && Ys(e, t);
  };
  var Fl = c(null);
  function Pi() {
    var e = Fl.current;
    return e !== null ? e : we.pooledCache;
  }
  function vu(e, t) {
    t === null ? z(Fl, Fl.current) : z(Fl, t.pool);
  }
  function Gs() {
    var e = Pi();
    return e === null ? null : { parent: Ke._currentValue, pool: e };
  }
  var Ea = Error(m(460)), ec = Error(m(474)), yu = Error(m(542)), gu = { then: function() {
  } };
  function Qs(e) {
    return e = e.status, e === "fulfilled" || e === "rejected";
  }
  function Ls(e, t, l) {
    switch (l = e[l], l === void 0 ? e.push(t) : l !== t && (t.then(Wt, Wt), t = l), t.status) {
      case "fulfilled":
        return t.value;
      case "rejected":
        throw e = t.reason, Vs(e), e;
      default:
        if (typeof t.status == "string") t.then(Wt, Wt);
        else {
          if (e = we, e !== null && 100 < e.shellSuspendCounter)
            throw Error(m(482));
          e = t, e.status = "pending", e.then(
            function(a) {
              if (t.status === "pending") {
                var n = t;
                n.status = "fulfilled", n.value = a;
              }
            },
            function(a) {
              if (t.status === "pending") {
                var n = t;
                n.status = "rejected", n.reason = a;
              }
            }
          );
        }
        switch (t.status) {
          case "fulfilled":
            return t.value;
          case "rejected":
            throw e = t.reason, Vs(e), e;
        }
        throw Pl = t, Ea;
    }
  }
  function Il(e) {
    try {
      var t = e._init;
      return t(e._payload);
    } catch (l) {
      throw l !== null && typeof l == "object" && typeof l.then == "function" ? (Pl = l, Ea) : l;
    }
  }
  var Pl = null;
  function Xs() {
    if (Pl === null) throw Error(m(459));
    var e = Pl;
    return Pl = null, e;
  }
  function Vs(e) {
    if (e === Ea || e === yu)
      throw Error(m(483));
  }
  var _a = null, hn = 0;
  function bu(e) {
    var t = hn;
    return hn += 1, _a === null && (_a = []), Ls(_a, e, t);
  }
  function vn(e, t) {
    t = t.props.ref, e.ref = t !== void 0 ? t : null;
  }
  function xu(e, t) {
    throw t.$$typeof === J ? Error(m(525)) : (e = Object.prototype.toString.call(t), Error(
      m(
        31,
        e === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : e
      )
    ));
  }
  function Zs(e) {
    function t(h, d) {
      if (e) {
        var g = h.deletions;
        g === null ? (h.deletions = [d], h.flags |= 16) : g.push(d);
      }
    }
    function l(h, d) {
      if (!e) return null;
      for (; d !== null; )
        t(h, d), d = d.sibling;
      return null;
    }
    function a(h) {
      for (var d = /* @__PURE__ */ new Map(); h !== null; )
        h.key !== null ? d.set(h.key, h) : d.set(h.index, h), h = h.sibling;
      return d;
    }
    function n(h, d) {
      return h = Ft(h, d), h.index = 0, h.sibling = null, h;
    }
    function u(h, d, g) {
      return h.index = g, e ? (g = h.alternate, g !== null ? (g = g.index, g < d ? (h.flags |= 67108866, d) : g) : (h.flags |= 67108866, d)) : (h.flags |= 1048576, d);
    }
    function i(h) {
      return e && h.alternate === null && (h.flags |= 67108866), h;
    }
    function f(h, d, g, E) {
      return d === null || d.tag !== 6 ? (d = Li(g, h.mode, E), d.return = h, d) : (d = n(d, g), d.return = h, d);
    }
    function o(h, d, g, E) {
      var F = g.type;
      return F === k ? j(
        h,
        d,
        g.props.children,
        E,
        g.key
      ) : d !== null && (d.elementType === F || typeof F == "object" && F !== null && F.$$typeof === Le && Il(F) === d.type) ? (d = n(d, g.props), vn(d, g), d.return = h, d) : (d = ou(
        g.type,
        g.key,
        g.props,
        null,
        h.mode,
        E
      ), vn(d, g), d.return = h, d);
    }
    function b(h, d, g, E) {
      return d === null || d.tag !== 4 || d.stateNode.containerInfo !== g.containerInfo || d.stateNode.implementation !== g.implementation ? (d = Xi(g, h.mode, E), d.return = h, d) : (d = n(d, g.children || []), d.return = h, d);
    }
    function j(h, d, g, E, F) {
      return d === null || d.tag !== 7 ? (d = Jl(
        g,
        h.mode,
        E,
        F
      ), d.return = h, d) : (d = n(d, g), d.return = h, d);
    }
    function _(h, d, g) {
      if (typeof d == "string" && d !== "" || typeof d == "number" || typeof d == "bigint")
        return d = Li(
          "" + d,
          h.mode,
          g
        ), d.return = h, d;
      if (typeof d == "object" && d !== null) {
        switch (d.$$typeof) {
          case ue:
            return g = ou(
              d.type,
              d.key,
              d.props,
              null,
              h.mode,
              g
            ), vn(g, d), g.return = h, g;
          case he:
            return d = Xi(
              d,
              h.mode,
              g
            ), d.return = h, d;
          case Le:
            return d = Il(d), _(h, d, g);
        }
        if (fe(d) || Fe(d))
          return d = Jl(
            d,
            h.mode,
            g,
            null
          ), d.return = h, d;
        if (typeof d.then == "function")
          return _(h, bu(d), g);
        if (d.$$typeof === ce)
          return _(
            h,
            hu(h, d),
            g
          );
        xu(h, d);
      }
      return null;
    }
    function x(h, d, g, E) {
      var F = d !== null ? d.key : null;
      if (typeof g == "string" && g !== "" || typeof g == "number" || typeof g == "bigint")
        return F !== null ? null : f(h, d, "" + g, E);
      if (typeof g == "object" && g !== null) {
        switch (g.$$typeof) {
          case ue:
            return g.key === F ? o(h, d, g, E) : null;
          case he:
            return g.key === F ? b(h, d, g, E) : null;
          case Le:
            return g = Il(g), x(h, d, g, E);
        }
        if (fe(g) || Fe(g))
          return F !== null ? null : j(h, d, g, E, null);
        if (typeof g.then == "function")
          return x(
            h,
            d,
            bu(g),
            E
          );
        if (g.$$typeof === ce)
          return x(
            h,
            d,
            hu(h, g),
            E
          );
        xu(h, g);
      }
      return null;
    }
    function p(h, d, g, E, F) {
      if (typeof E == "string" && E !== "" || typeof E == "number" || typeof E == "bigint")
        return h = h.get(g) || null, f(d, h, "" + E, F);
      if (typeof E == "object" && E !== null) {
        switch (E.$$typeof) {
          case ue:
            return h = h.get(
              E.key === null ? g : E.key
            ) || null, o(d, h, E, F);
          case he:
            return h = h.get(
              E.key === null ? g : E.key
            ) || null, b(d, h, E, F);
          case Le:
            return E = Il(E), p(
              h,
              d,
              g,
              E,
              F
            );
        }
        if (fe(E) || Fe(E))
          return h = h.get(g) || null, j(d, h, E, F, null);
        if (typeof E.then == "function")
          return p(
            h,
            d,
            g,
            bu(E),
            F
          );
        if (E.$$typeof === ce)
          return p(
            h,
            d,
            g,
            hu(d, E),
            F
          );
        xu(d, E);
      }
      return null;
    }
    function X(h, d, g, E) {
      for (var F = null, Te = null, Z = d, oe = d = 0, xe = null; Z !== null && oe < g.length; oe++) {
        Z.index > oe ? (xe = Z, Z = null) : xe = Z.sibling;
        var je = x(
          h,
          Z,
          g[oe],
          E
        );
        if (je === null) {
          Z === null && (Z = xe);
          break;
        }
        e && Z && je.alternate === null && t(h, Z), d = u(je, d, oe), Te === null ? F = je : Te.sibling = je, Te = je, Z = xe;
      }
      if (oe === g.length)
        return l(h, Z), Se && It(h, oe), F;
      if (Z === null) {
        for (; oe < g.length; oe++)
          Z = _(h, g[oe], E), Z !== null && (d = u(
            Z,
            d,
            oe
          ), Te === null ? F = Z : Te.sibling = Z, Te = Z);
        return Se && It(h, oe), F;
      }
      for (Z = a(Z); oe < g.length; oe++)
        xe = p(
          Z,
          h,
          oe,
          g[oe],
          E
        ), xe !== null && (e && xe.alternate !== null && Z.delete(
          xe.key === null ? oe : xe.key
        ), d = u(
          xe,
          d,
          oe
        ), Te === null ? F = xe : Te.sibling = xe, Te = xe);
      return e && Z.forEach(function(ql) {
        return t(h, ql);
      }), Se && It(h, oe), F;
    }
    function ee(h, d, g, E) {
      if (g == null) throw Error(m(151));
      for (var F = null, Te = null, Z = d, oe = d = 0, xe = null, je = g.next(); Z !== null && !je.done; oe++, je = g.next()) {
        Z.index > oe ? (xe = Z, Z = null) : xe = Z.sibling;
        var ql = x(h, Z, je.value, E);
        if (ql === null) {
          Z === null && (Z = xe);
          break;
        }
        e && Z && ql.alternate === null && t(h, Z), d = u(ql, d, oe), Te === null ? F = ql : Te.sibling = ql, Te = ql, Z = xe;
      }
      if (je.done)
        return l(h, Z), Se && It(h, oe), F;
      if (Z === null) {
        for (; !je.done; oe++, je = g.next())
          je = _(h, je.value, E), je !== null && (d = u(je, d, oe), Te === null ? F = je : Te.sibling = je, Te = je);
        return Se && It(h, oe), F;
      }
      for (Z = a(Z); !je.done; oe++, je = g.next())
        je = p(Z, h, oe, je.value, E), je !== null && (e && je.alternate !== null && Z.delete(je.key === null ? oe : je.key), d = u(je, d, oe), Te === null ? F = je : Te.sibling = je, Te = je);
      return e && Z.forEach(function(bh) {
        return t(h, bh);
      }), Se && It(h, oe), F;
    }
    function De(h, d, g, E) {
      if (typeof g == "object" && g !== null && g.type === k && g.key === null && (g = g.props.children), typeof g == "object" && g !== null) {
        switch (g.$$typeof) {
          case ue:
            e: {
              for (var F = g.key; d !== null; ) {
                if (d.key === F) {
                  if (F = g.type, F === k) {
                    if (d.tag === 7) {
                      l(
                        h,
                        d.sibling
                      ), E = n(
                        d,
                        g.props.children
                      ), E.return = h, h = E;
                      break e;
                    }
                  } else if (d.elementType === F || typeof F == "object" && F !== null && F.$$typeof === Le && Il(F) === d.type) {
                    l(
                      h,
                      d.sibling
                    ), E = n(d, g.props), vn(E, g), E.return = h, h = E;
                    break e;
                  }
                  l(h, d);
                  break;
                } else t(h, d);
                d = d.sibling;
              }
              g.type === k ? (E = Jl(
                g.props.children,
                h.mode,
                E,
                g.key
              ), E.return = h, h = E) : (E = ou(
                g.type,
                g.key,
                g.props,
                null,
                h.mode,
                E
              ), vn(E, g), E.return = h, h = E);
            }
            return i(h);
          case he:
            e: {
              for (F = g.key; d !== null; ) {
                if (d.key === F)
                  if (d.tag === 4 && d.stateNode.containerInfo === g.containerInfo && d.stateNode.implementation === g.implementation) {
                    l(
                      h,
                      d.sibling
                    ), E = n(d, g.children || []), E.return = h, h = E;
                    break e;
                  } else {
                    l(h, d);
                    break;
                  }
                else t(h, d);
                d = d.sibling;
              }
              E = Xi(g, h.mode, E), E.return = h, h = E;
            }
            return i(h);
          case Le:
            return g = Il(g), De(
              h,
              d,
              g,
              E
            );
        }
        if (fe(g))
          return X(
            h,
            d,
            g,
            E
          );
        if (Fe(g)) {
          if (F = Fe(g), typeof F != "function") throw Error(m(150));
          return g = F.call(g), ee(
            h,
            d,
            g,
            E
          );
        }
        if (typeof g.then == "function")
          return De(
            h,
            d,
            bu(g),
            E
          );
        if (g.$$typeof === ce)
          return De(
            h,
            d,
            hu(h, g),
            E
          );
        xu(h, g);
      }
      return typeof g == "string" && g !== "" || typeof g == "number" || typeof g == "bigint" ? (g = "" + g, d !== null && d.tag === 6 ? (l(h, d.sibling), E = n(d, g), E.return = h, h = E) : (l(h, d), E = Li(g, h.mode, E), E.return = h, h = E), i(h)) : l(h, d);
    }
    return function(h, d, g, E) {
      try {
        hn = 0;
        var F = De(
          h,
          d,
          g,
          E
        );
        return _a = null, F;
      } catch (Z) {
        if (Z === Ea || Z === yu) throw Z;
        var Te = zt(29, Z, null, h.mode);
        return Te.lanes = E, Te.return = h, Te;
      } finally {
      }
    };
  }
  var ea = Zs(!0), Ks = Zs(!1), Sl = !1;
  function tc(e) {
    e.updateQueue = {
      baseState: e.memoizedState,
      firstBaseUpdate: null,
      lastBaseUpdate: null,
      shared: { pending: null, lanes: 0, hiddenCallbacks: null },
      callbacks: null
    };
  }
  function lc(e, t) {
    e = e.updateQueue, t.updateQueue === e && (t.updateQueue = {
      baseState: e.baseState,
      firstBaseUpdate: e.firstBaseUpdate,
      lastBaseUpdate: e.lastBaseUpdate,
      shared: e.shared,
      callbacks: null
    });
  }
  function Nl(e) {
    return { lane: e, tag: 0, payload: null, callback: null, next: null };
  }
  function Tl(e, t, l) {
    var a = e.updateQueue;
    if (a === null) return null;
    if (a = a.shared, (ze & 2) !== 0) {
      var n = a.pending;
      return n === null ? t.next = t : (t.next = n.next, n.next = t), a.pending = t, t = ru(e), As(e, null, l), t;
    }
    return su(e, a, t, l), ru(e);
  }
  function yn(e, t, l) {
    if (t = t.updateQueue, t !== null && (t = t.shared, (l & 4194048) !== 0)) {
      var a = t.lanes;
      a &= e.pendingLanes, l |= a, t.lanes = l, Bf(e, l);
    }
  }
  function ac(e, t) {
    var l = e.updateQueue, a = e.alternate;
    if (a !== null && (a = a.updateQueue, l === a)) {
      var n = null, u = null;
      if (l = l.firstBaseUpdate, l !== null) {
        do {
          var i = {
            lane: l.lane,
            tag: l.tag,
            payload: l.payload,
            callback: null,
            next: null
          };
          u === null ? n = u = i : u = u.next = i, l = l.next;
        } while (l !== null);
        u === null ? n = u = t : u = u.next = t;
      } else n = u = t;
      l = {
        baseState: a.baseState,
        firstBaseUpdate: n,
        lastBaseUpdate: u,
        shared: a.shared,
        callbacks: a.callbacks
      }, e.updateQueue = l;
      return;
    }
    e = l.lastBaseUpdate, e === null ? l.firstBaseUpdate = t : e.next = t, l.lastBaseUpdate = t;
  }
  var nc = !1;
  function gn() {
    if (nc) {
      var e = za;
      if (e !== null) throw e;
    }
  }
  function bn(e, t, l, a) {
    nc = !1;
    var n = e.updateQueue;
    Sl = !1;
    var u = n.firstBaseUpdate, i = n.lastBaseUpdate, f = n.shared.pending;
    if (f !== null) {
      n.shared.pending = null;
      var o = f, b = o.next;
      o.next = null, i === null ? u = b : i.next = b, i = o;
      var j = e.alternate;
      j !== null && (j = j.updateQueue, f = j.lastBaseUpdate, f !== i && (f === null ? j.firstBaseUpdate = b : f.next = b, j.lastBaseUpdate = o));
    }
    if (u !== null) {
      var _ = n.baseState;
      i = 0, j = b = o = null, f = u;
      do {
        var x = f.lane & -536870913, p = x !== f.lane;
        if (p ? (be & x) === x : (a & x) === x) {
          x !== 0 && x === ja && (nc = !0), j !== null && (j = j.next = {
            lane: 0,
            tag: f.tag,
            payload: f.payload,
            callback: null,
            next: null
          });
          e: {
            var X = e, ee = f;
            x = t;
            var De = l;
            switch (ee.tag) {
              case 1:
                if (X = ee.payload, typeof X == "function") {
                  _ = X.call(De, _, x);
                  break e;
                }
                _ = X;
                break e;
              case 3:
                X.flags = X.flags & -65537 | 128;
              case 0:
                if (X = ee.payload, x = typeof X == "function" ? X.call(De, _, x) : X, x == null) break e;
                _ = B({}, _, x);
                break e;
              case 2:
                Sl = !0;
            }
          }
          x = f.callback, x !== null && (e.flags |= 64, p && (e.flags |= 8192), p = n.callbacks, p === null ? n.callbacks = [x] : p.push(x));
        } else
          p = {
            lane: x,
            tag: f.tag,
            payload: f.payload,
            callback: f.callback,
            next: null
          }, j === null ? (b = j = p, o = _) : j = j.next = p, i |= x;
        if (f = f.next, f === null) {
          if (f = n.shared.pending, f === null)
            break;
          p = f, f = p.next, p.next = null, n.lastBaseUpdate = p, n.shared.pending = null;
        }
      } while (!0);
      j === null && (o = _), n.baseState = o, n.firstBaseUpdate = b, n.lastBaseUpdate = j, u === null && (n.shared.lanes = 0), Ml |= i, e.lanes = i, e.memoizedState = _;
    }
  }
  function Js(e, t) {
    if (typeof e != "function")
      throw Error(m(191, e));
    e.call(t);
  }
  function ks(e, t) {
    var l = e.callbacks;
    if (l !== null)
      for (e.callbacks = null, e = 0; e < l.length; e++)
        Js(l[e], t);
  }
  var Ma = c(null), pu = c(0);
  function Ws(e, t) {
    e = sl, z(pu, e), z(Ma, t), sl = e | t.baseLanes;
  }
  function uc() {
    z(pu, sl), z(Ma, Ma.current);
  }
  function ic() {
    sl = pu.current, y(Ma), y(pu);
  }
  var Et = c(null), qt = null;
  function jl(e) {
    var t = e.alternate;
    z(Xe, Xe.current & 1), z(Et, e), qt === null && (t === null || Ma.current !== null || t.memoizedState !== null) && (qt = e);
  }
  function cc(e) {
    z(Xe, Xe.current), z(Et, e), qt === null && (qt = e);
  }
  function $s(e) {
    e.tag === 22 ? (z(Xe, Xe.current), z(Et, e), qt === null && (qt = e)) : zl();
  }
  function zl() {
    z(Xe, Xe.current), z(Et, Et.current);
  }
  function _t(e) {
    y(Et), qt === e && (qt = null), y(Xe);
  }
  var Xe = c(0);
  function Su(e) {
    for (var t = e; t !== null; ) {
      if (t.tag === 13) {
        var l = t.memoizedState;
        if (l !== null && (l = l.dehydrated, l === null || hf(l) || vf(l)))
          return t;
      } else if (t.tag === 19 && (t.memoizedProps.revealOrder === "forwards" || t.memoizedProps.revealOrder === "backwards" || t.memoizedProps.revealOrder === "unstable_legacy-backwards" || t.memoizedProps.revealOrder === "together")) {
        if ((t.flags & 128) !== 0) return t;
      } else if (t.child !== null) {
        t.child.return = t, t = t.child;
        continue;
      }
      if (t === e) break;
      for (; t.sibling === null; ) {
        if (t.return === null || t.return === e) return null;
        t = t.return;
      }
      t.sibling.return = t.return, t = t.sibling;
    }
    return null;
  }
  var tl = 0, re = null, Oe = null, Je = null, Nu = !1, Aa = !1, ta = !1, Tu = 0, xn = 0, Ca = null, fm = 0;
  function Ge() {
    throw Error(m(321));
  }
  function fc(e, t) {
    if (t === null) return !1;
    for (var l = 0; l < t.length && l < e.length; l++)
      if (!jt(e[l], t[l])) return !1;
    return !0;
  }
  function sc(e, t, l, a, n, u) {
    return tl = u, re = t, t.memoizedState = null, t.updateQueue = null, t.lanes = 0, S.H = e === null || e.memoizedState === null ? Dr : jc, ta = !1, u = l(a, n), ta = !1, Aa && (u = Is(
      t,
      l,
      a,
      n
    )), Fs(e), u;
  }
  function Fs(e) {
    S.H = Nn;
    var t = Oe !== null && Oe.next !== null;
    if (tl = 0, Je = Oe = re = null, Nu = !1, xn = 0, Ca = null, t) throw Error(m(300));
    e === null || ke || (e = e.dependencies, e !== null && mu(e) && (ke = !0));
  }
  function Is(e, t, l, a) {
    re = e;
    var n = 0;
    do {
      if (Aa && (Ca = null), xn = 0, Aa = !1, 25 <= n) throw Error(m(301));
      if (n += 1, Je = Oe = null, e.updateQueue != null) {
        var u = e.updateQueue;
        u.lastEffect = null, u.events = null, u.stores = null, u.memoCache != null && (u.memoCache.index = 0);
      }
      S.H = wr, u = t(l, a);
    } while (Aa);
    return u;
  }
  function sm() {
    var e = S.H, t = e.useState()[0];
    return t = typeof t.then == "function" ? pn(t) : t, e = e.useState()[0], (Oe !== null ? Oe.memoizedState : null) !== e && (re.flags |= 1024), t;
  }
  function rc() {
    var e = Tu !== 0;
    return Tu = 0, e;
  }
  function oc(e, t, l) {
    t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~l;
  }
  function dc(e) {
    if (Nu) {
      for (e = e.memoizedState; e !== null; ) {
        var t = e.queue;
        t !== null && (t.pending = null), e = e.next;
      }
      Nu = !1;
    }
    tl = 0, Je = Oe = re = null, Aa = !1, xn = Tu = 0, Ca = null;
  }
  function mt() {
    var e = {
      memoizedState: null,
      baseState: null,
      baseQueue: null,
      queue: null,
      next: null
    };
    return Je === null ? re.memoizedState = Je = e : Je = Je.next = e, Je;
  }
  function Ve() {
    if (Oe === null) {
      var e = re.alternate;
      e = e !== null ? e.memoizedState : null;
    } else e = Oe.next;
    var t = Je === null ? re.memoizedState : Je.next;
    if (t !== null)
      Je = t, Oe = e;
    else {
      if (e === null)
        throw re.alternate === null ? Error(m(467)) : Error(m(310));
      Oe = e, e = {
        memoizedState: Oe.memoizedState,
        baseState: Oe.baseState,
        baseQueue: Oe.baseQueue,
        queue: Oe.queue,
        next: null
      }, Je === null ? re.memoizedState = Je = e : Je = Je.next = e;
    }
    return Je;
  }
  function ju() {
    return { lastEffect: null, events: null, stores: null, memoCache: null };
  }
  function pn(e) {
    var t = xn;
    return xn += 1, Ca === null && (Ca = []), e = Ls(Ca, e, t), t = re, (Je === null ? t.memoizedState : Je.next) === null && (t = t.alternate, S.H = t === null || t.memoizedState === null ? Dr : jc), e;
  }
  function zu(e) {
    if (e !== null && typeof e == "object") {
      if (typeof e.then == "function") return pn(e);
      if (e.$$typeof === ce) return ut(e);
    }
    throw Error(m(438, String(e)));
  }
  function mc(e) {
    var t = null, l = re.updateQueue;
    if (l !== null && (t = l.memoCache), t == null) {
      var a = re.alternate;
      a !== null && (a = a.updateQueue, a !== null && (a = a.memoCache, a != null && (t = {
        data: a.data.map(function(n) {
          return n.slice();
        }),
        index: 0
      })));
    }
    if (t == null && (t = { data: [], index: 0 }), l === null && (l = ju(), re.updateQueue = l), l.memoCache = t, l = t.data[t.index], l === void 0)
      for (l = t.data[t.index] = Array(e), a = 0; a < e; a++)
        l[a] = Ze;
    return t.index++, l;
  }
  function ll(e, t) {
    return typeof t == "function" ? t(e) : t;
  }
  function Eu(e) {
    var t = Ve();
    return hc(t, Oe, e);
  }
  function hc(e, t, l) {
    var a = e.queue;
    if (a === null) throw Error(m(311));
    a.lastRenderedReducer = l;
    var n = e.baseQueue, u = a.pending;
    if (u !== null) {
      if (n !== null) {
        var i = n.next;
        n.next = u.next, u.next = i;
      }
      t.baseQueue = n = u, a.pending = null;
    }
    if (u = e.baseState, n === null) e.memoizedState = u;
    else {
      t = n.next;
      var f = i = null, o = null, b = t, j = !1;
      do {
        var _ = b.lane & -536870913;
        if (_ !== b.lane ? (be & _) === _ : (tl & _) === _) {
          var x = b.revertLane;
          if (x === 0)
            o !== null && (o = o.next = {
              lane: 0,
              revertLane: 0,
              gesture: null,
              action: b.action,
              hasEagerState: b.hasEagerState,
              eagerState: b.eagerState,
              next: null
            }), _ === ja && (j = !0);
          else if ((tl & x) === x) {
            b = b.next, x === ja && (j = !0);
            continue;
          } else
            _ = {
              lane: 0,
              revertLane: b.revertLane,
              gesture: null,
              action: b.action,
              hasEagerState: b.hasEagerState,
              eagerState: b.eagerState,
              next: null
            }, o === null ? (f = o = _, i = u) : o = o.next = _, re.lanes |= x, Ml |= x;
          _ = b.action, ta && l(u, _), u = b.hasEagerState ? b.eagerState : l(u, _);
        } else
          x = {
            lane: _,
            revertLane: b.revertLane,
            gesture: b.gesture,
            action: b.action,
            hasEagerState: b.hasEagerState,
            eagerState: b.eagerState,
            next: null
          }, o === null ? (f = o = x, i = u) : o = o.next = x, re.lanes |= _, Ml |= _;
        b = b.next;
      } while (b !== null && b !== t);
      if (o === null ? i = u : o.next = f, !jt(u, e.memoizedState) && (ke = !0, j && (l = za, l !== null)))
        throw l;
      e.memoizedState = u, e.baseState = i, e.baseQueue = o, a.lastRenderedState = u;
    }
    return n === null && (a.lanes = 0), [e.memoizedState, a.dispatch];
  }
  function vc(e) {
    var t = Ve(), l = t.queue;
    if (l === null) throw Error(m(311));
    l.lastRenderedReducer = e;
    var a = l.dispatch, n = l.pending, u = t.memoizedState;
    if (n !== null) {
      l.pending = null;
      var i = n = n.next;
      do
        u = e(u, i.action), i = i.next;
      while (i !== n);
      jt(u, t.memoizedState) || (ke = !0), t.memoizedState = u, t.baseQueue === null && (t.baseState = u), l.lastRenderedState = u;
    }
    return [u, a];
  }
  function Ps(e, t, l) {
    var a = re, n = Ve(), u = Se;
    if (u) {
      if (l === void 0) throw Error(m(407));
      l = l();
    } else l = t();
    var i = !jt(
      (Oe || n).memoizedState,
      l
    );
    if (i && (n.memoizedState = l, ke = !0), n = n.queue, bc(lr.bind(null, a, n, e), [
      e
    ]), n.getSnapshot !== t || i || Je !== null && Je.memoizedState.tag & 1) {
      if (a.flags |= 2048, Oa(
        9,
        { destroy: void 0 },
        tr.bind(
          null,
          a,
          n,
          l,
          t
        ),
        null
      ), we === null) throw Error(m(349));
      u || (tl & 127) !== 0 || er(a, t, l);
    }
    return l;
  }
  function er(e, t, l) {
    e.flags |= 16384, e = { getSnapshot: t, value: l }, t = re.updateQueue, t === null ? (t = ju(), re.updateQueue = t, t.stores = [e]) : (l = t.stores, l === null ? t.stores = [e] : l.push(e));
  }
  function tr(e, t, l, a) {
    t.value = l, t.getSnapshot = a, ar(t) && nr(e);
  }
  function lr(e, t, l) {
    return l(function() {
      ar(t) && nr(e);
    });
  }
  function ar(e) {
    var t = e.getSnapshot;
    e = e.value;
    try {
      var l = t();
      return !jt(e, l);
    } catch {
      return !0;
    }
  }
  function nr(e) {
    var t = Kl(e, 2);
    t !== null && pt(t, e, 2);
  }
  function yc(e) {
    var t = mt();
    if (typeof e == "function") {
      var l = e;
      if (e = l(), ta) {
        hl(!0);
        try {
          l();
        } finally {
          hl(!1);
        }
      }
    }
    return t.memoizedState = t.baseState = e, t.queue = {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: ll,
      lastRenderedState: e
    }, t;
  }
  function ur(e, t, l, a) {
    return e.baseState = l, hc(
      e,
      Oe,
      typeof a == "function" ? a : ll
    );
  }
  function rm(e, t, l, a, n) {
    if (Au(e)) throw Error(m(485));
    if (e = t.action, e !== null) {
      var u = {
        payload: n,
        action: e,
        next: null,
        isTransition: !0,
        status: "pending",
        value: null,
        reason: null,
        listeners: [],
        then: function(i) {
          u.listeners.push(i);
        }
      };
      S.T !== null ? l(!0) : u.isTransition = !1, a(u), l = t.pending, l === null ? (u.next = t.pending = u, ir(t, u)) : (u.next = l.next, t.pending = l.next = u);
    }
  }
  function ir(e, t) {
    var l = t.action, a = t.payload, n = e.state;
    if (t.isTransition) {
      var u = S.T, i = {};
      S.T = i;
      try {
        var f = l(n, a), o = S.S;
        o !== null && o(i, f), cr(e, t, f);
      } catch (b) {
        gc(e, t, b);
      } finally {
        u !== null && i.types !== null && (u.types = i.types), S.T = u;
      }
    } else
      try {
        u = l(n, a), cr(e, t, u);
      } catch (b) {
        gc(e, t, b);
      }
  }
  function cr(e, t, l) {
    l !== null && typeof l == "object" && typeof l.then == "function" ? l.then(
      function(a) {
        fr(e, t, a);
      },
      function(a) {
        return gc(e, t, a);
      }
    ) : fr(e, t, l);
  }
  function fr(e, t, l) {
    t.status = "fulfilled", t.value = l, sr(t), e.state = l, t = e.pending, t !== null && (l = t.next, l === t ? e.pending = null : (l = l.next, t.next = l, ir(e, l)));
  }
  function gc(e, t, l) {
    var a = e.pending;
    if (e.pending = null, a !== null) {
      a = a.next;
      do
        t.status = "rejected", t.reason = l, sr(t), t = t.next;
      while (t !== a);
    }
    e.action = null;
  }
  function sr(e) {
    e = e.listeners;
    for (var t = 0; t < e.length; t++) (0, e[t])();
  }
  function rr(e, t) {
    return t;
  }
  function or(e, t) {
    if (Se) {
      var l = we.formState;
      if (l !== null) {
        e: {
          var a = re;
          if (Se) {
            if (Re) {
              t: {
                for (var n = Re, u = Bt; n.nodeType !== 8; ) {
                  if (!u) {
                    n = null;
                    break t;
                  }
                  if (n = Yt(
                    n.nextSibling
                  ), n === null) {
                    n = null;
                    break t;
                  }
                }
                u = n.data, n = u === "F!" || u === "F" ? n : null;
              }
              if (n) {
                Re = Yt(
                  n.nextSibling
                ), a = n.data === "F!";
                break e;
              }
            }
            xl(a);
          }
          a = !1;
        }
        a && (t = l[0]);
      }
    }
    return l = mt(), l.memoizedState = l.baseState = t, a = {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: rr,
      lastRenderedState: t
    }, l.queue = a, l = Cr.bind(
      null,
      re,
      a
    ), a.dispatch = l, a = yc(!1), u = Tc.bind(
      null,
      re,
      !1,
      a.queue
    ), a = mt(), n = {
      state: t,
      dispatch: null,
      action: e,
      pending: null
    }, a.queue = n, l = rm.bind(
      null,
      re,
      n,
      u,
      l
    ), n.dispatch = l, a.memoizedState = e, [t, l, !1];
  }
  function dr(e) {
    var t = Ve();
    return mr(t, Oe, e);
  }
  function mr(e, t, l) {
    if (t = hc(
      e,
      t,
      rr
    )[0], e = Eu(ll)[0], typeof t == "object" && t !== null && typeof t.then == "function")
      try {
        var a = pn(t);
      } catch (i) {
        throw i === Ea ? yu : i;
      }
    else a = t;
    t = Ve();
    var n = t.queue, u = n.dispatch;
    return l !== t.memoizedState && (re.flags |= 2048, Oa(
      9,
      { destroy: void 0 },
      om.bind(null, n, l),
      null
    )), [a, u, e];
  }
  function om(e, t) {
    e.action = t;
  }
  function hr(e) {
    var t = Ve(), l = Oe;
    if (l !== null)
      return mr(t, l, e);
    Ve(), t = t.memoizedState, l = Ve();
    var a = l.queue.dispatch;
    return l.memoizedState = e, [t, a, !1];
  }
  function Oa(e, t, l, a) {
    return e = { tag: e, create: l, deps: a, inst: t, next: null }, t = re.updateQueue, t === null && (t = ju(), re.updateQueue = t), l = t.lastEffect, l === null ? t.lastEffect = e.next = e : (a = l.next, l.next = e, e.next = a, t.lastEffect = e), e;
  }
  function vr() {
    return Ve().memoizedState;
  }
  function _u(e, t, l, a) {
    var n = mt();
    re.flags |= e, n.memoizedState = Oa(
      1 | t,
      { destroy: void 0 },
      l,
      a === void 0 ? null : a
    );
  }
  function Mu(e, t, l, a) {
    var n = Ve();
    a = a === void 0 ? null : a;
    var u = n.memoizedState.inst;
    Oe !== null && a !== null && fc(a, Oe.memoizedState.deps) ? n.memoizedState = Oa(t, u, l, a) : (re.flags |= e, n.memoizedState = Oa(
      1 | t,
      u,
      l,
      a
    ));
  }
  function yr(e, t) {
    _u(8390656, 8, e, t);
  }
  function bc(e, t) {
    Mu(2048, 8, e, t);
  }
  function dm(e) {
    re.flags |= 4;
    var t = re.updateQueue;
    if (t === null)
      t = ju(), re.updateQueue = t, t.events = [e];
    else {
      var l = t.events;
      l === null ? t.events = [e] : l.push(e);
    }
  }
  function gr(e) {
    var t = Ve().memoizedState;
    return dm({ ref: t, nextImpl: e }), function() {
      if ((ze & 2) !== 0) throw Error(m(440));
      return t.impl.apply(void 0, arguments);
    };
  }
  function br(e, t) {
    return Mu(4, 2, e, t);
  }
  function xr(e, t) {
    return Mu(4, 4, e, t);
  }
  function pr(e, t) {
    if (typeof t == "function") {
      e = e();
      var l = t(e);
      return function() {
        typeof l == "function" ? l() : t(null);
      };
    }
    if (t != null)
      return e = e(), t.current = e, function() {
        t.current = null;
      };
  }
  function Sr(e, t, l) {
    l = l != null ? l.concat([e]) : null, Mu(4, 4, pr.bind(null, t, e), l);
  }
  function xc() {
  }
  function Nr(e, t) {
    var l = Ve();
    t = t === void 0 ? null : t;
    var a = l.memoizedState;
    return t !== null && fc(t, a[1]) ? a[0] : (l.memoizedState = [e, t], e);
  }
  function Tr(e, t) {
    var l = Ve();
    t = t === void 0 ? null : t;
    var a = l.memoizedState;
    if (t !== null && fc(t, a[1]))
      return a[0];
    if (a = e(), ta) {
      hl(!0);
      try {
        e();
      } finally {
        hl(!1);
      }
    }
    return l.memoizedState = [a, t], a;
  }
  function pc(e, t, l) {
    return l === void 0 || (tl & 1073741824) !== 0 && (be & 261930) === 0 ? e.memoizedState = t : (e.memoizedState = l, e = zo(), re.lanes |= e, Ml |= e, l);
  }
  function jr(e, t, l, a) {
    return jt(l, t) ? l : Ma.current !== null ? (e = pc(e, l, a), jt(e, t) || (ke = !0), e) : (tl & 42) === 0 || (tl & 1073741824) !== 0 && (be & 261930) === 0 ? (ke = !0, e.memoizedState = l) : (e = zo(), re.lanes |= e, Ml |= e, t);
  }
  function zr(e, t, l, a, n) {
    var u = R.p;
    R.p = u !== 0 && 8 > u ? u : 8;
    var i = S.T, f = {};
    S.T = f, Tc(e, !1, t, l);
    try {
      var o = n(), b = S.S;
      if (b !== null && b(f, o), o !== null && typeof o == "object" && typeof o.then == "function") {
        var j = cm(
          o,
          a
        );
        Sn(
          e,
          t,
          j,
          Ct(e)
        );
      } else
        Sn(
          e,
          t,
          a,
          Ct(e)
        );
    } catch (_) {
      Sn(
        e,
        t,
        { then: function() {
        }, status: "rejected", reason: _ },
        Ct()
      );
    } finally {
      R.p = u, i !== null && f.types !== null && (i.types = f.types), S.T = i;
    }
  }
  function mm() {
  }
  function Sc(e, t, l, a) {
    if (e.tag !== 5) throw Error(m(476));
    var n = Er(e).queue;
    zr(
      e,
      n,
      t,
      I,
      l === null ? mm : function() {
        return _r(e), l(a);
      }
    );
  }
  function Er(e) {
    var t = e.memoizedState;
    if (t !== null) return t;
    t = {
      memoizedState: I,
      baseState: I,
      baseQueue: null,
      queue: {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: ll,
        lastRenderedState: I
      },
      next: null
    };
    var l = {};
    return t.next = {
      memoizedState: l,
      baseState: l,
      baseQueue: null,
      queue: {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: ll,
        lastRenderedState: l
      },
      next: null
    }, e.memoizedState = t, e = e.alternate, e !== null && (e.memoizedState = t), t;
  }
  function _r(e) {
    var t = Er(e);
    t.next === null && (t = e.alternate.memoizedState), Sn(
      e,
      t.next.queue,
      {},
      Ct()
    );
  }
  function Nc() {
    return ut(qn);
  }
  function Mr() {
    return Ve().memoizedState;
  }
  function Ar() {
    return Ve().memoizedState;
  }
  function hm(e) {
    for (var t = e.return; t !== null; ) {
      switch (t.tag) {
        case 24:
        case 3:
          var l = Ct();
          e = Nl(l);
          var a = Tl(t, e, l);
          a !== null && (pt(a, t, l), yn(a, t, l)), t = { cache: Fi() }, e.payload = t;
          return;
      }
      t = t.return;
    }
  }
  function vm(e, t, l) {
    var a = Ct();
    l = {
      lane: a,
      revertLane: 0,
      gesture: null,
      action: l,
      hasEagerState: !1,
      eagerState: null,
      next: null
    }, Au(e) ? Or(t, l) : (l = Gi(e, t, l, a), l !== null && (pt(l, e, a), Ur(l, t, a)));
  }
  function Cr(e, t, l) {
    var a = Ct();
    Sn(e, t, l, a);
  }
  function Sn(e, t, l, a) {
    var n = {
      lane: a,
      revertLane: 0,
      gesture: null,
      action: l,
      hasEagerState: !1,
      eagerState: null,
      next: null
    };
    if (Au(e)) Or(t, n);
    else {
      var u = e.alternate;
      if (e.lanes === 0 && (u === null || u.lanes === 0) && (u = t.lastRenderedReducer, u !== null))
        try {
          var i = t.lastRenderedState, f = u(i, l);
          if (n.hasEagerState = !0, n.eagerState = f, jt(f, i))
            return su(e, t, n, 0), we === null && fu(), !1;
        } catch {
        } finally {
        }
      if (l = Gi(e, t, n, a), l !== null)
        return pt(l, e, a), Ur(l, t, a), !0;
    }
    return !1;
  }
  function Tc(e, t, l, a) {
    if (a = {
      lane: 2,
      revertLane: tf(),
      gesture: null,
      action: a,
      hasEagerState: !1,
      eagerState: null,
      next: null
    }, Au(e)) {
      if (t) throw Error(m(479));
    } else
      t = Gi(
        e,
        l,
        a,
        2
      ), t !== null && pt(t, e, 2);
  }
  function Au(e) {
    var t = e.alternate;
    return e === re || t !== null && t === re;
  }
  function Or(e, t) {
    Aa = Nu = !0;
    var l = e.pending;
    l === null ? t.next = t : (t.next = l.next, l.next = t), e.pending = t;
  }
  function Ur(e, t, l) {
    if ((l & 4194048) !== 0) {
      var a = t.lanes;
      a &= e.pendingLanes, l |= a, t.lanes = l, Bf(e, l);
    }
  }
  var Nn = {
    readContext: ut,
    use: zu,
    useCallback: Ge,
    useContext: Ge,
    useEffect: Ge,
    useImperativeHandle: Ge,
    useLayoutEffect: Ge,
    useInsertionEffect: Ge,
    useMemo: Ge,
    useReducer: Ge,
    useRef: Ge,
    useState: Ge,
    useDebugValue: Ge,
    useDeferredValue: Ge,
    useTransition: Ge,
    useSyncExternalStore: Ge,
    useId: Ge,
    useHostTransitionStatus: Ge,
    useFormState: Ge,
    useActionState: Ge,
    useOptimistic: Ge,
    useMemoCache: Ge,
    useCacheRefresh: Ge
  };
  Nn.useEffectEvent = Ge;
  var Dr = {
    readContext: ut,
    use: zu,
    useCallback: function(e, t) {
      return mt().memoizedState = [
        e,
        t === void 0 ? null : t
      ], e;
    },
    useContext: ut,
    useEffect: yr,
    useImperativeHandle: function(e, t, l) {
      l = l != null ? l.concat([e]) : null, _u(
        4194308,
        4,
        pr.bind(null, t, e),
        l
      );
    },
    useLayoutEffect: function(e, t) {
      return _u(4194308, 4, e, t);
    },
    useInsertionEffect: function(e, t) {
      _u(4, 2, e, t);
    },
    useMemo: function(e, t) {
      var l = mt();
      t = t === void 0 ? null : t;
      var a = e();
      if (ta) {
        hl(!0);
        try {
          e();
        } finally {
          hl(!1);
        }
      }
      return l.memoizedState = [a, t], a;
    },
    useReducer: function(e, t, l) {
      var a = mt();
      if (l !== void 0) {
        var n = l(t);
        if (ta) {
          hl(!0);
          try {
            l(t);
          } finally {
            hl(!1);
          }
        }
      } else n = t;
      return a.memoizedState = a.baseState = n, e = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: e,
        lastRenderedState: n
      }, a.queue = e, e = e.dispatch = vm.bind(
        null,
        re,
        e
      ), [a.memoizedState, e];
    },
    useRef: function(e) {
      var t = mt();
      return e = { current: e }, t.memoizedState = e;
    },
    useState: function(e) {
      e = yc(e);
      var t = e.queue, l = Cr.bind(null, re, t);
      return t.dispatch = l, [e.memoizedState, l];
    },
    useDebugValue: xc,
    useDeferredValue: function(e, t) {
      var l = mt();
      return pc(l, e, t);
    },
    useTransition: function() {
      var e = yc(!1);
      return e = zr.bind(
        null,
        re,
        e.queue,
        !0,
        !1
      ), mt().memoizedState = e, [!1, e];
    },
    useSyncExternalStore: function(e, t, l) {
      var a = re, n = mt();
      if (Se) {
        if (l === void 0)
          throw Error(m(407));
        l = l();
      } else {
        if (l = t(), we === null)
          throw Error(m(349));
        (be & 127) !== 0 || er(a, t, l);
      }
      n.memoizedState = l;
      var u = { value: l, getSnapshot: t };
      return n.queue = u, yr(lr.bind(null, a, u, e), [
        e
      ]), a.flags |= 2048, Oa(
        9,
        { destroy: void 0 },
        tr.bind(
          null,
          a,
          u,
          l,
          t
        ),
        null
      ), l;
    },
    useId: function() {
      var e = mt(), t = we.identifierPrefix;
      if (Se) {
        var l = Zt, a = Vt;
        l = (a & ~(1 << 32 - Tt(a) - 1)).toString(32) + l, t = "_" + t + "R_" + l, l = Tu++, 0 < l && (t += "H" + l.toString(32)), t += "_";
      } else
        l = fm++, t = "_" + t + "r_" + l.toString(32) + "_";
      return e.memoizedState = t;
    },
    useHostTransitionStatus: Nc,
    useFormState: or,
    useActionState: or,
    useOptimistic: function(e) {
      var t = mt();
      t.memoizedState = t.baseState = e;
      var l = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: null,
        lastRenderedState: null
      };
      return t.queue = l, t = Tc.bind(
        null,
        re,
        !0,
        l
      ), l.dispatch = t, [e, t];
    },
    useMemoCache: mc,
    useCacheRefresh: function() {
      return mt().memoizedState = hm.bind(
        null,
        re
      );
    },
    useEffectEvent: function(e) {
      var t = mt(), l = { impl: e };
      return t.memoizedState = l, function() {
        if ((ze & 2) !== 0)
          throw Error(m(440));
        return l.impl.apply(void 0, arguments);
      };
    }
  }, jc = {
    readContext: ut,
    use: zu,
    useCallback: Nr,
    useContext: ut,
    useEffect: bc,
    useImperativeHandle: Sr,
    useInsertionEffect: br,
    useLayoutEffect: xr,
    useMemo: Tr,
    useReducer: Eu,
    useRef: vr,
    useState: function() {
      return Eu(ll);
    },
    useDebugValue: xc,
    useDeferredValue: function(e, t) {
      var l = Ve();
      return jr(
        l,
        Oe.memoizedState,
        e,
        t
      );
    },
    useTransition: function() {
      var e = Eu(ll)[0], t = Ve().memoizedState;
      return [
        typeof e == "boolean" ? e : pn(e),
        t
      ];
    },
    useSyncExternalStore: Ps,
    useId: Mr,
    useHostTransitionStatus: Nc,
    useFormState: dr,
    useActionState: dr,
    useOptimistic: function(e, t) {
      var l = Ve();
      return ur(l, Oe, e, t);
    },
    useMemoCache: mc,
    useCacheRefresh: Ar
  };
  jc.useEffectEvent = gr;
  var wr = {
    readContext: ut,
    use: zu,
    useCallback: Nr,
    useContext: ut,
    useEffect: bc,
    useImperativeHandle: Sr,
    useInsertionEffect: br,
    useLayoutEffect: xr,
    useMemo: Tr,
    useReducer: vc,
    useRef: vr,
    useState: function() {
      return vc(ll);
    },
    useDebugValue: xc,
    useDeferredValue: function(e, t) {
      var l = Ve();
      return Oe === null ? pc(l, e, t) : jr(
        l,
        Oe.memoizedState,
        e,
        t
      );
    },
    useTransition: function() {
      var e = vc(ll)[0], t = Ve().memoizedState;
      return [
        typeof e == "boolean" ? e : pn(e),
        t
      ];
    },
    useSyncExternalStore: Ps,
    useId: Mr,
    useHostTransitionStatus: Nc,
    useFormState: hr,
    useActionState: hr,
    useOptimistic: function(e, t) {
      var l = Ve();
      return Oe !== null ? ur(l, Oe, e, t) : (l.baseState = e, [e, l.queue.dispatch]);
    },
    useMemoCache: mc,
    useCacheRefresh: Ar
  };
  wr.useEffectEvent = gr;
  function zc(e, t, l, a) {
    t = e.memoizedState, l = l(a, t), l = l == null ? t : B({}, t, l), e.memoizedState = l, e.lanes === 0 && (e.updateQueue.baseState = l);
  }
  var Ec = {
    enqueueSetState: function(e, t, l) {
      e = e._reactInternals;
      var a = Ct(), n = Nl(a);
      n.payload = t, l != null && (n.callback = l), t = Tl(e, n, a), t !== null && (pt(t, e, a), yn(t, e, a));
    },
    enqueueReplaceState: function(e, t, l) {
      e = e._reactInternals;
      var a = Ct(), n = Nl(a);
      n.tag = 1, n.payload = t, l != null && (n.callback = l), t = Tl(e, n, a), t !== null && (pt(t, e, a), yn(t, e, a));
    },
    enqueueForceUpdate: function(e, t) {
      e = e._reactInternals;
      var l = Ct(), a = Nl(l);
      a.tag = 2, t != null && (a.callback = t), t = Tl(e, a, l), t !== null && (pt(t, e, l), yn(t, e, l));
    }
  };
  function Rr(e, t, l, a, n, u, i) {
    return e = e.stateNode, typeof e.shouldComponentUpdate == "function" ? e.shouldComponentUpdate(a, u, i) : t.prototype && t.prototype.isPureReactComponent ? !fn(l, a) || !fn(n, u) : !0;
  }
  function Hr(e, t, l, a) {
    e = t.state, typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(l, a), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(l, a), t.state !== e && Ec.enqueueReplaceState(t, t.state, null);
  }
  function la(e, t) {
    var l = t;
    if ("ref" in t) {
      l = {};
      for (var a in t)
        a !== "ref" && (l[a] = t[a]);
    }
    if (e = e.defaultProps) {
      l === t && (l = B({}, l));
      for (var n in e)
        l[n] === void 0 && (l[n] = e[n]);
    }
    return l;
  }
  function Br(e) {
    cu(e);
  }
  function qr(e) {
    console.error(e);
  }
  function Yr(e) {
    cu(e);
  }
  function Cu(e, t) {
    try {
      var l = e.onUncaughtError;
      l(t.value, { componentStack: t.stack });
    } catch (a) {
      setTimeout(function() {
        throw a;
      });
    }
  }
  function Gr(e, t, l) {
    try {
      var a = e.onCaughtError;
      a(l.value, {
        componentStack: l.stack,
        errorBoundary: t.tag === 1 ? t.stateNode : null
      });
    } catch (n) {
      setTimeout(function() {
        throw n;
      });
    }
  }
  function _c(e, t, l) {
    return l = Nl(l), l.tag = 3, l.payload = { element: null }, l.callback = function() {
      Cu(e, t);
    }, l;
  }
  function Qr(e) {
    return e = Nl(e), e.tag = 3, e;
  }
  function Lr(e, t, l, a) {
    var n = l.type.getDerivedStateFromError;
    if (typeof n == "function") {
      var u = a.value;
      e.payload = function() {
        return n(u);
      }, e.callback = function() {
        Gr(t, l, a);
      };
    }
    var i = l.stateNode;
    i !== null && typeof i.componentDidCatch == "function" && (e.callback = function() {
      Gr(t, l, a), typeof n != "function" && (Al === null ? Al = /* @__PURE__ */ new Set([this]) : Al.add(this));
      var f = a.stack;
      this.componentDidCatch(a.value, {
        componentStack: f !== null ? f : ""
      });
    });
  }
  function ym(e, t, l, a, n) {
    if (l.flags |= 32768, a !== null && typeof a == "object" && typeof a.then == "function") {
      if (t = l.alternate, t !== null && Ta(
        t,
        l,
        n,
        !0
      ), l = Et.current, l !== null) {
        switch (l.tag) {
          case 31:
          case 13:
            return qt === null ? Lu() : l.alternate === null && Qe === 0 && (Qe = 3), l.flags &= -257, l.flags |= 65536, l.lanes = n, a === gu ? l.flags |= 16384 : (t = l.updateQueue, t === null ? l.updateQueue = /* @__PURE__ */ new Set([a]) : t.add(a), Ic(e, a, n)), !1;
          case 22:
            return l.flags |= 65536, a === gu ? l.flags |= 16384 : (t = l.updateQueue, t === null ? (t = {
              transitions: null,
              markerInstances: null,
              retryQueue: /* @__PURE__ */ new Set([a])
            }, l.updateQueue = t) : (l = t.retryQueue, l === null ? t.retryQueue = /* @__PURE__ */ new Set([a]) : l.add(a)), Ic(e, a, n)), !1;
        }
        throw Error(m(435, l.tag));
      }
      return Ic(e, a, n), Lu(), !1;
    }
    if (Se)
      return t = Et.current, t !== null ? ((t.flags & 65536) === 0 && (t.flags |= 256), t.flags |= 65536, t.lanes = n, a !== Ki && (e = Error(m(422), { cause: a }), on(wt(e, l)))) : (a !== Ki && (t = Error(m(423), {
        cause: a
      }), on(
        wt(t, l)
      )), e = e.current.alternate, e.flags |= 65536, n &= -n, e.lanes |= n, a = wt(a, l), n = _c(
        e.stateNode,
        a,
        n
      ), ac(e, n), Qe !== 4 && (Qe = 2)), !1;
    var u = Error(m(520), { cause: a });
    if (u = wt(u, l), Cn === null ? Cn = [u] : Cn.push(u), Qe !== 4 && (Qe = 2), t === null) return !0;
    a = wt(a, l), l = t;
    do {
      switch (l.tag) {
        case 3:
          return l.flags |= 65536, e = n & -n, l.lanes |= e, e = _c(l.stateNode, a, e), ac(l, e), !1;
        case 1:
          if (t = l.type, u = l.stateNode, (l.flags & 128) === 0 && (typeof t.getDerivedStateFromError == "function" || u !== null && typeof u.componentDidCatch == "function" && (Al === null || !Al.has(u))))
            return l.flags |= 65536, n &= -n, l.lanes |= n, n = Qr(n), Lr(
              n,
              e,
              l,
              a
            ), ac(l, n), !1;
      }
      l = l.return;
    } while (l !== null);
    return !1;
  }
  var Mc = Error(m(461)), ke = !1;
  function it(e, t, l, a) {
    t.child = e === null ? Ks(t, null, l, a) : ea(
      t,
      e.child,
      l,
      a
    );
  }
  function Xr(e, t, l, a, n) {
    l = l.render;
    var u = t.ref;
    if ("ref" in a) {
      var i = {};
      for (var f in a)
        f !== "ref" && (i[f] = a[f]);
    } else i = a;
    return $l(t), a = sc(
      e,
      t,
      l,
      i,
      u,
      n
    ), f = rc(), e !== null && !ke ? (oc(e, t, n), al(e, t, n)) : (Se && f && Vi(t), t.flags |= 1, it(e, t, a, n), t.child);
  }
  function Vr(e, t, l, a, n) {
    if (e === null) {
      var u = l.type;
      return typeof u == "function" && !Qi(u) && u.defaultProps === void 0 && l.compare === null ? (t.tag = 15, t.type = u, Zr(
        e,
        t,
        u,
        a,
        n
      )) : (e = ou(
        l.type,
        null,
        a,
        t,
        t.mode,
        n
      ), e.ref = t.ref, e.return = t, t.child = e);
    }
    if (u = e.child, !Hc(e, n)) {
      var i = u.memoizedProps;
      if (l = l.compare, l = l !== null ? l : fn, l(i, a) && e.ref === t.ref)
        return al(e, t, n);
    }
    return t.flags |= 1, e = Ft(u, a), e.ref = t.ref, e.return = t, t.child = e;
  }
  function Zr(e, t, l, a, n) {
    if (e !== null) {
      var u = e.memoizedProps;
      if (fn(u, a) && e.ref === t.ref)
        if (ke = !1, t.pendingProps = a = u, Hc(e, n))
          (e.flags & 131072) !== 0 && (ke = !0);
        else
          return t.lanes = e.lanes, al(e, t, n);
    }
    return Ac(
      e,
      t,
      l,
      a,
      n
    );
  }
  function Kr(e, t, l, a) {
    var n = a.children, u = e !== null ? e.memoizedState : null;
    if (e === null && t.stateNode === null && (t.stateNode = {
      _visibility: 1,
      _pendingMarkers: null,
      _retryCache: null,
      _transitions: null
    }), a.mode === "hidden") {
      if ((t.flags & 128) !== 0) {
        if (u = u !== null ? u.baseLanes | l : l, e !== null) {
          for (a = t.child = e.child, n = 0; a !== null; )
            n = n | a.lanes | a.childLanes, a = a.sibling;
          a = n & ~u;
        } else a = 0, t.child = null;
        return Jr(
          e,
          t,
          u,
          l,
          a
        );
      }
      if ((l & 536870912) !== 0)
        t.memoizedState = { baseLanes: 0, cachePool: null }, e !== null && vu(
          t,
          u !== null ? u.cachePool : null
        ), u !== null ? Ws(t, u) : uc(), $s(t);
      else
        return a = t.lanes = 536870912, Jr(
          e,
          t,
          u !== null ? u.baseLanes | l : l,
          l,
          a
        );
    } else
      u !== null ? (vu(t, u.cachePool), Ws(t, u), zl(), t.memoizedState = null) : (e !== null && vu(t, null), uc(), zl());
    return it(e, t, n, l), t.child;
  }
  function Tn(e, t) {
    return e !== null && e.tag === 22 || t.stateNode !== null || (t.stateNode = {
      _visibility: 1,
      _pendingMarkers: null,
      _retryCache: null,
      _transitions: null
    }), t.sibling;
  }
  function Jr(e, t, l, a, n) {
    var u = Pi();
    return u = u === null ? null : { parent: Ke._currentValue, pool: u }, t.memoizedState = {
      baseLanes: l,
      cachePool: u
    }, e !== null && vu(t, null), uc(), $s(t), e !== null && Ta(e, t, a, !0), t.childLanes = n, null;
  }
  function Ou(e, t) {
    return t = Du(
      { mode: t.mode, children: t.children },
      e.mode
    ), t.ref = e.ref, e.child = t, t.return = e, t;
  }
  function kr(e, t, l) {
    return ea(t, e.child, null, l), e = Ou(t, t.pendingProps), e.flags |= 2, _t(t), t.memoizedState = null, e;
  }
  function gm(e, t, l) {
    var a = t.pendingProps, n = (t.flags & 128) !== 0;
    if (t.flags &= -129, e === null) {
      if (Se) {
        if (a.mode === "hidden")
          return e = Ou(t, a), t.lanes = 536870912, Tn(null, e);
        if (cc(t), (e = Re) ? (e = cd(
          e,
          Bt
        ), e = e !== null && e.data === "&" ? e : null, e !== null && (t.memoizedState = {
          dehydrated: e,
          treeContext: gl !== null ? { id: Vt, overflow: Zt } : null,
          retryLane: 536870912,
          hydrationErrors: null
        }, l = Os(e), l.return = t, t.child = l, nt = t, Re = null)) : e = null, e === null) throw xl(t);
        return t.lanes = 536870912, null;
      }
      return Ou(t, a);
    }
    var u = e.memoizedState;
    if (u !== null) {
      var i = u.dehydrated;
      if (cc(t), n)
        if (t.flags & 256)
          t.flags &= -257, t = kr(
            e,
            t,
            l
          );
        else if (t.memoizedState !== null)
          t.child = e.child, t.flags |= 128, t = null;
        else throw Error(m(558));
      else if (ke || Ta(e, t, l, !1), n = (l & e.childLanes) !== 0, ke || n) {
        if (a = we, a !== null && (i = qf(a, l), i !== 0 && i !== u.retryLane))
          throw u.retryLane = i, Kl(e, i), pt(a, e, i), Mc;
        Lu(), t = kr(
          e,
          t,
          l
        );
      } else
        e = u.treeContext, Re = Yt(i.nextSibling), nt = t, Se = !0, bl = null, Bt = !1, e !== null && ws(t, e), t = Ou(t, a), t.flags |= 4096;
      return t;
    }
    return e = Ft(e.child, {
      mode: a.mode,
      children: a.children
    }), e.ref = t.ref, t.child = e, e.return = t, e;
  }
  function Uu(e, t) {
    var l = t.ref;
    if (l === null)
      e !== null && e.ref !== null && (t.flags |= 4194816);
    else {
      if (typeof l != "function" && typeof l != "object")
        throw Error(m(284));
      (e === null || e.ref !== l) && (t.flags |= 4194816);
    }
  }
  function Ac(e, t, l, a, n) {
    return $l(t), l = sc(
      e,
      t,
      l,
      a,
      void 0,
      n
    ), a = rc(), e !== null && !ke ? (oc(e, t, n), al(e, t, n)) : (Se && a && Vi(t), t.flags |= 1, it(e, t, l, n), t.child);
  }
  function Wr(e, t, l, a, n, u) {
    return $l(t), t.updateQueue = null, l = Is(
      t,
      a,
      l,
      n
    ), Fs(e), a = rc(), e !== null && !ke ? (oc(e, t, u), al(e, t, u)) : (Se && a && Vi(t), t.flags |= 1, it(e, t, l, u), t.child);
  }
  function $r(e, t, l, a, n) {
    if ($l(t), t.stateNode === null) {
      var u = xa, i = l.contextType;
      typeof i == "object" && i !== null && (u = ut(i)), u = new l(a, u), t.memoizedState = u.state !== null && u.state !== void 0 ? u.state : null, u.updater = Ec, t.stateNode = u, u._reactInternals = t, u = t.stateNode, u.props = a, u.state = t.memoizedState, u.refs = {}, tc(t), i = l.contextType, u.context = typeof i == "object" && i !== null ? ut(i) : xa, u.state = t.memoizedState, i = l.getDerivedStateFromProps, typeof i == "function" && (zc(
        t,
        l,
        i,
        a
      ), u.state = t.memoizedState), typeof l.getDerivedStateFromProps == "function" || typeof u.getSnapshotBeforeUpdate == "function" || typeof u.UNSAFE_componentWillMount != "function" && typeof u.componentWillMount != "function" || (i = u.state, typeof u.componentWillMount == "function" && u.componentWillMount(), typeof u.UNSAFE_componentWillMount == "function" && u.UNSAFE_componentWillMount(), i !== u.state && Ec.enqueueReplaceState(u, u.state, null), bn(t, a, u, n), gn(), u.state = t.memoizedState), typeof u.componentDidMount == "function" && (t.flags |= 4194308), a = !0;
    } else if (e === null) {
      u = t.stateNode;
      var f = t.memoizedProps, o = la(l, f);
      u.props = o;
      var b = u.context, j = l.contextType;
      i = xa, typeof j == "object" && j !== null && (i = ut(j));
      var _ = l.getDerivedStateFromProps;
      j = typeof _ == "function" || typeof u.getSnapshotBeforeUpdate == "function", f = t.pendingProps !== f, j || typeof u.UNSAFE_componentWillReceiveProps != "function" && typeof u.componentWillReceiveProps != "function" || (f || b !== i) && Hr(
        t,
        u,
        a,
        i
      ), Sl = !1;
      var x = t.memoizedState;
      u.state = x, bn(t, a, u, n), gn(), b = t.memoizedState, f || x !== b || Sl ? (typeof _ == "function" && (zc(
        t,
        l,
        _,
        a
      ), b = t.memoizedState), (o = Sl || Rr(
        t,
        l,
        o,
        a,
        x,
        b,
        i
      )) ? (j || typeof u.UNSAFE_componentWillMount != "function" && typeof u.componentWillMount != "function" || (typeof u.componentWillMount == "function" && u.componentWillMount(), typeof u.UNSAFE_componentWillMount == "function" && u.UNSAFE_componentWillMount()), typeof u.componentDidMount == "function" && (t.flags |= 4194308)) : (typeof u.componentDidMount == "function" && (t.flags |= 4194308), t.memoizedProps = a, t.memoizedState = b), u.props = a, u.state = b, u.context = i, a = o) : (typeof u.componentDidMount == "function" && (t.flags |= 4194308), a = !1);
    } else {
      u = t.stateNode, lc(e, t), i = t.memoizedProps, j = la(l, i), u.props = j, _ = t.pendingProps, x = u.context, b = l.contextType, o = xa, typeof b == "object" && b !== null && (o = ut(b)), f = l.getDerivedStateFromProps, (b = typeof f == "function" || typeof u.getSnapshotBeforeUpdate == "function") || typeof u.UNSAFE_componentWillReceiveProps != "function" && typeof u.componentWillReceiveProps != "function" || (i !== _ || x !== o) && Hr(
        t,
        u,
        a,
        o
      ), Sl = !1, x = t.memoizedState, u.state = x, bn(t, a, u, n), gn();
      var p = t.memoizedState;
      i !== _ || x !== p || Sl || e !== null && e.dependencies !== null && mu(e.dependencies) ? (typeof f == "function" && (zc(
        t,
        l,
        f,
        a
      ), p = t.memoizedState), (j = Sl || Rr(
        t,
        l,
        j,
        a,
        x,
        p,
        o
      ) || e !== null && e.dependencies !== null && mu(e.dependencies)) ? (b || typeof u.UNSAFE_componentWillUpdate != "function" && typeof u.componentWillUpdate != "function" || (typeof u.componentWillUpdate == "function" && u.componentWillUpdate(a, p, o), typeof u.UNSAFE_componentWillUpdate == "function" && u.UNSAFE_componentWillUpdate(
        a,
        p,
        o
      )), typeof u.componentDidUpdate == "function" && (t.flags |= 4), typeof u.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof u.componentDidUpdate != "function" || i === e.memoizedProps && x === e.memoizedState || (t.flags |= 4), typeof u.getSnapshotBeforeUpdate != "function" || i === e.memoizedProps && x === e.memoizedState || (t.flags |= 1024), t.memoizedProps = a, t.memoizedState = p), u.props = a, u.state = p, u.context = o, a = j) : (typeof u.componentDidUpdate != "function" || i === e.memoizedProps && x === e.memoizedState || (t.flags |= 4), typeof u.getSnapshotBeforeUpdate != "function" || i === e.memoizedProps && x === e.memoizedState || (t.flags |= 1024), a = !1);
    }
    return u = a, Uu(e, t), a = (t.flags & 128) !== 0, u || a ? (u = t.stateNode, l = a && typeof l.getDerivedStateFromError != "function" ? null : u.render(), t.flags |= 1, e !== null && a ? (t.child = ea(
      t,
      e.child,
      null,
      n
    ), t.child = ea(
      t,
      null,
      l,
      n
    )) : it(e, t, l, n), t.memoizedState = u.state, e = t.child) : e = al(
      e,
      t,
      n
    ), e;
  }
  function Fr(e, t, l, a) {
    return kl(), t.flags |= 256, it(e, t, l, a), t.child;
  }
  var Cc = {
    dehydrated: null,
    treeContext: null,
    retryLane: 0,
    hydrationErrors: null
  };
  function Oc(e) {
    return { baseLanes: e, cachePool: Gs() };
  }
  function Uc(e, t, l) {
    return e = e !== null ? e.childLanes & ~l : 0, t && (e |= At), e;
  }
  function Ir(e, t, l) {
    var a = t.pendingProps, n = !1, u = (t.flags & 128) !== 0, i;
    if ((i = u) || (i = e !== null && e.memoizedState === null ? !1 : (Xe.current & 2) !== 0), i && (n = !0, t.flags &= -129), i = (t.flags & 32) !== 0, t.flags &= -33, e === null) {
      if (Se) {
        if (n ? jl(t) : zl(), (e = Re) ? (e = cd(
          e,
          Bt
        ), e = e !== null && e.data !== "&" ? e : null, e !== null && (t.memoizedState = {
          dehydrated: e,
          treeContext: gl !== null ? { id: Vt, overflow: Zt } : null,
          retryLane: 536870912,
          hydrationErrors: null
        }, l = Os(e), l.return = t, t.child = l, nt = t, Re = null)) : e = null, e === null) throw xl(t);
        return vf(e) ? t.lanes = 32 : t.lanes = 536870912, null;
      }
      var f = a.children;
      return a = a.fallback, n ? (zl(), n = t.mode, f = Du(
        { mode: "hidden", children: f },
        n
      ), a = Jl(
        a,
        n,
        l,
        null
      ), f.return = t, a.return = t, f.sibling = a, t.child = f, a = t.child, a.memoizedState = Oc(l), a.childLanes = Uc(
        e,
        i,
        l
      ), t.memoizedState = Cc, Tn(null, a)) : (jl(t), Dc(t, f));
    }
    var o = e.memoizedState;
    if (o !== null && (f = o.dehydrated, f !== null)) {
      if (u)
        t.flags & 256 ? (jl(t), t.flags &= -257, t = wc(
          e,
          t,
          l
        )) : t.memoizedState !== null ? (zl(), t.child = e.child, t.flags |= 128, t = null) : (zl(), f = a.fallback, n = t.mode, a = Du(
          { mode: "visible", children: a.children },
          n
        ), f = Jl(
          f,
          n,
          l,
          null
        ), f.flags |= 2, a.return = t, f.return = t, a.sibling = f, t.child = a, ea(
          t,
          e.child,
          null,
          l
        ), a = t.child, a.memoizedState = Oc(l), a.childLanes = Uc(
          e,
          i,
          l
        ), t.memoizedState = Cc, t = Tn(null, a));
      else if (jl(t), vf(f)) {
        if (i = f.nextSibling && f.nextSibling.dataset, i) var b = i.dgst;
        i = b, a = Error(m(419)), a.stack = "", a.digest = i, on({ value: a, source: null, stack: null }), t = wc(
          e,
          t,
          l
        );
      } else if (ke || Ta(e, t, l, !1), i = (l & e.childLanes) !== 0, ke || i) {
        if (i = we, i !== null && (a = qf(i, l), a !== 0 && a !== o.retryLane))
          throw o.retryLane = a, Kl(e, a), pt(i, e, a), Mc;
        hf(f) || Lu(), t = wc(
          e,
          t,
          l
        );
      } else
        hf(f) ? (t.flags |= 192, t.child = e.child, t = null) : (e = o.treeContext, Re = Yt(
          f.nextSibling
        ), nt = t, Se = !0, bl = null, Bt = !1, e !== null && ws(t, e), t = Dc(
          t,
          a.children
        ), t.flags |= 4096);
      return t;
    }
    return n ? (zl(), f = a.fallback, n = t.mode, o = e.child, b = o.sibling, a = Ft(o, {
      mode: "hidden",
      children: a.children
    }), a.subtreeFlags = o.subtreeFlags & 65011712, b !== null ? f = Ft(
      b,
      f
    ) : (f = Jl(
      f,
      n,
      l,
      null
    ), f.flags |= 2), f.return = t, a.return = t, a.sibling = f, t.child = a, Tn(null, a), a = t.child, f = e.child.memoizedState, f === null ? f = Oc(l) : (n = f.cachePool, n !== null ? (o = Ke._currentValue, n = n.parent !== o ? { parent: o, pool: o } : n) : n = Gs(), f = {
      baseLanes: f.baseLanes | l,
      cachePool: n
    }), a.memoizedState = f, a.childLanes = Uc(
      e,
      i,
      l
    ), t.memoizedState = Cc, Tn(e.child, a)) : (jl(t), l = e.child, e = l.sibling, l = Ft(l, {
      mode: "visible",
      children: a.children
    }), l.return = t, l.sibling = null, e !== null && (i = t.deletions, i === null ? (t.deletions = [e], t.flags |= 16) : i.push(e)), t.child = l, t.memoizedState = null, l);
  }
  function Dc(e, t) {
    return t = Du(
      { mode: "visible", children: t },
      e.mode
    ), t.return = e, e.child = t;
  }
  function Du(e, t) {
    return e = zt(22, e, null, t), e.lanes = 0, e;
  }
  function wc(e, t, l) {
    return ea(t, e.child, null, l), e = Dc(
      t,
      t.pendingProps.children
    ), e.flags |= 2, t.memoizedState = null, e;
  }
  function Pr(e, t, l) {
    e.lanes |= t;
    var a = e.alternate;
    a !== null && (a.lanes |= t), Wi(e.return, t, l);
  }
  function Rc(e, t, l, a, n, u) {
    var i = e.memoizedState;
    i === null ? e.memoizedState = {
      isBackwards: t,
      rendering: null,
      renderingStartTime: 0,
      last: a,
      tail: l,
      tailMode: n,
      treeForkCount: u
    } : (i.isBackwards = t, i.rendering = null, i.renderingStartTime = 0, i.last = a, i.tail = l, i.tailMode = n, i.treeForkCount = u);
  }
  function eo(e, t, l) {
    var a = t.pendingProps, n = a.revealOrder, u = a.tail;
    a = a.children;
    var i = Xe.current, f = (i & 2) !== 0;
    if (f ? (i = i & 1 | 2, t.flags |= 128) : i &= 1, z(Xe, i), it(e, t, a, l), a = Se ? rn : 0, !f && e !== null && (e.flags & 128) !== 0)
      e: for (e = t.child; e !== null; ) {
        if (e.tag === 13)
          e.memoizedState !== null && Pr(e, l, t);
        else if (e.tag === 19)
          Pr(e, l, t);
        else if (e.child !== null) {
          e.child.return = e, e = e.child;
          continue;
        }
        if (e === t) break e;
        for (; e.sibling === null; ) {
          if (e.return === null || e.return === t)
            break e;
          e = e.return;
        }
        e.sibling.return = e.return, e = e.sibling;
      }
    switch (n) {
      case "forwards":
        for (l = t.child, n = null; l !== null; )
          e = l.alternate, e !== null && Su(e) === null && (n = l), l = l.sibling;
        l = n, l === null ? (n = t.child, t.child = null) : (n = l.sibling, l.sibling = null), Rc(
          t,
          !1,
          n,
          l,
          u,
          a
        );
        break;
      case "backwards":
      case "unstable_legacy-backwards":
        for (l = null, n = t.child, t.child = null; n !== null; ) {
          if (e = n.alternate, e !== null && Su(e) === null) {
            t.child = n;
            break;
          }
          e = n.sibling, n.sibling = l, l = n, n = e;
        }
        Rc(
          t,
          !0,
          l,
          null,
          u,
          a
        );
        break;
      case "together":
        Rc(
          t,
          !1,
          null,
          null,
          void 0,
          a
        );
        break;
      default:
        t.memoizedState = null;
    }
    return t.child;
  }
  function al(e, t, l) {
    if (e !== null && (t.dependencies = e.dependencies), Ml |= t.lanes, (l & t.childLanes) === 0)
      if (e !== null) {
        if (Ta(
          e,
          t,
          l,
          !1
        ), (l & t.childLanes) === 0)
          return null;
      } else return null;
    if (e !== null && t.child !== e.child)
      throw Error(m(153));
    if (t.child !== null) {
      for (e = t.child, l = Ft(e, e.pendingProps), t.child = l, l.return = t; e.sibling !== null; )
        e = e.sibling, l = l.sibling = Ft(e, e.pendingProps), l.return = t;
      l.sibling = null;
    }
    return t.child;
  }
  function Hc(e, t) {
    return (e.lanes & t) !== 0 ? !0 : (e = e.dependencies, !!(e !== null && mu(e)));
  }
  function bm(e, t, l) {
    switch (t.tag) {
      case 3:
        $(t, t.stateNode.containerInfo), pl(t, Ke, e.memoizedState.cache), kl();
        break;
      case 27:
      case 5:
        Ee(t);
        break;
      case 4:
        $(t, t.stateNode.containerInfo);
        break;
      case 10:
        pl(
          t,
          t.type,
          t.memoizedProps.value
        );
        break;
      case 31:
        if (t.memoizedState !== null)
          return t.flags |= 128, cc(t), null;
        break;
      case 13:
        var a = t.memoizedState;
        if (a !== null)
          return a.dehydrated !== null ? (jl(t), t.flags |= 128, null) : (l & t.child.childLanes) !== 0 ? Ir(e, t, l) : (jl(t), e = al(
            e,
            t,
            l
          ), e !== null ? e.sibling : null);
        jl(t);
        break;
      case 19:
        var n = (e.flags & 128) !== 0;
        if (a = (l & t.childLanes) !== 0, a || (Ta(
          e,
          t,
          l,
          !1
        ), a = (l & t.childLanes) !== 0), n) {
          if (a)
            return eo(
              e,
              t,
              l
            );
          t.flags |= 128;
        }
        if (n = t.memoizedState, n !== null && (n.rendering = null, n.tail = null, n.lastEffect = null), z(Xe, Xe.current), a) break;
        return null;
      case 22:
        return t.lanes = 0, Kr(
          e,
          t,
          l,
          t.pendingProps
        );
      case 24:
        pl(t, Ke, e.memoizedState.cache);
    }
    return al(e, t, l);
  }
  function to(e, t, l) {
    if (e !== null)
      if (e.memoizedProps !== t.pendingProps)
        ke = !0;
      else {
        if (!Hc(e, l) && (t.flags & 128) === 0)
          return ke = !1, bm(
            e,
            t,
            l
          );
        ke = (e.flags & 131072) !== 0;
      }
    else
      ke = !1, Se && (t.flags & 1048576) !== 0 && Ds(t, rn, t.index);
    switch (t.lanes = 0, t.tag) {
      case 16:
        e: {
          var a = t.pendingProps;
          if (e = Il(t.elementType), t.type = e, typeof e == "function")
            Qi(e) ? (a = la(e, a), t.tag = 1, t = $r(
              null,
              t,
              e,
              a,
              l
            )) : (t.tag = 0, t = Ac(
              null,
              t,
              e,
              a,
              l
            ));
          else {
            if (e != null) {
              var n = e.$$typeof;
              if (n === W) {
                t.tag = 11, t = Xr(
                  null,
                  t,
                  e,
                  a,
                  l
                );
                break e;
              } else if (n === P) {
                t.tag = 14, t = Vr(
                  null,
                  t,
                  e,
                  a,
                  l
                );
                break e;
              }
            }
            throw t = pe(e) || e, Error(m(306, t, ""));
          }
        }
        return t;
      case 0:
        return Ac(
          e,
          t,
          t.type,
          t.pendingProps,
          l
        );
      case 1:
        return a = t.type, n = la(
          a,
          t.pendingProps
        ), $r(
          e,
          t,
          a,
          n,
          l
        );
      case 3:
        e: {
          if ($(
            t,
            t.stateNode.containerInfo
          ), e === null) throw Error(m(387));
          a = t.pendingProps;
          var u = t.memoizedState;
          n = u.element, lc(e, t), bn(t, a, null, l);
          var i = t.memoizedState;
          if (a = i.cache, pl(t, Ke, a), a !== u.cache && $i(
            t,
            [Ke],
            l,
            !0
          ), gn(), a = i.element, u.isDehydrated)
            if (u = {
              element: a,
              isDehydrated: !1,
              cache: i.cache
            }, t.updateQueue.baseState = u, t.memoizedState = u, t.flags & 256) {
              t = Fr(
                e,
                t,
                a,
                l
              );
              break e;
            } else if (a !== n) {
              n = wt(
                Error(m(424)),
                t
              ), on(n), t = Fr(
                e,
                t,
                a,
                l
              );
              break e;
            } else {
              switch (e = t.stateNode.containerInfo, e.nodeType) {
                case 9:
                  e = e.body;
                  break;
                default:
                  e = e.nodeName === "HTML" ? e.ownerDocument.body : e;
              }
              for (Re = Yt(e.firstChild), nt = t, Se = !0, bl = null, Bt = !0, l = Ks(
                t,
                null,
                a,
                l
              ), t.child = l; l; )
                l.flags = l.flags & -3 | 4096, l = l.sibling;
            }
          else {
            if (kl(), a === n) {
              t = al(
                e,
                t,
                l
              );
              break e;
            }
            it(e, t, a, l);
          }
          t = t.child;
        }
        return t;
      case 26:
        return Uu(e, t), e === null ? (l = md(
          t.type,
          null,
          t.pendingProps,
          null
        )) ? t.memoizedState = l : Se || (l = t.type, e = t.pendingProps, a = Wu(
          q.current
        ).createElement(l), a[at] = t, a[ht] = e, ct(a, l, e), et(a), t.stateNode = a) : t.memoizedState = md(
          t.type,
          e.memoizedProps,
          t.pendingProps,
          e.memoizedState
        ), null;
      case 27:
        return Ee(t), e === null && Se && (a = t.stateNode = rd(
          t.type,
          t.pendingProps,
          q.current
        ), nt = t, Bt = !0, n = Re, Dl(t.type) ? (yf = n, Re = Yt(a.firstChild)) : Re = n), it(
          e,
          t,
          t.pendingProps.children,
          l
        ), Uu(e, t), e === null && (t.flags |= 4194304), t.child;
      case 5:
        return e === null && Se && ((n = a = Re) && (a = km(
          a,
          t.type,
          t.pendingProps,
          Bt
        ), a !== null ? (t.stateNode = a, nt = t, Re = Yt(a.firstChild), Bt = !1, n = !0) : n = !1), n || xl(t)), Ee(t), n = t.type, u = t.pendingProps, i = e !== null ? e.memoizedProps : null, a = u.children, of(n, u) ? a = null : i !== null && of(n, i) && (t.flags |= 32), t.memoizedState !== null && (n = sc(
          e,
          t,
          sm,
          null,
          null,
          l
        ), qn._currentValue = n), Uu(e, t), it(e, t, a, l), t.child;
      case 6:
        return e === null && Se && ((e = l = Re) && (l = Wm(
          l,
          t.pendingProps,
          Bt
        ), l !== null ? (t.stateNode = l, nt = t, Re = null, e = !0) : e = !1), e || xl(t)), null;
      case 13:
        return Ir(e, t, l);
      case 4:
        return $(
          t,
          t.stateNode.containerInfo
        ), a = t.pendingProps, e === null ? t.child = ea(
          t,
          null,
          a,
          l
        ) : it(e, t, a, l), t.child;
      case 11:
        return Xr(
          e,
          t,
          t.type,
          t.pendingProps,
          l
        );
      case 7:
        return it(
          e,
          t,
          t.pendingProps,
          l
        ), t.child;
      case 8:
        return it(
          e,
          t,
          t.pendingProps.children,
          l
        ), t.child;
      case 12:
        return it(
          e,
          t,
          t.pendingProps.children,
          l
        ), t.child;
      case 10:
        return a = t.pendingProps, pl(t, t.type, a.value), it(e, t, a.children, l), t.child;
      case 9:
        return n = t.type._context, a = t.pendingProps.children, $l(t), n = ut(n), a = a(n), t.flags |= 1, it(e, t, a, l), t.child;
      case 14:
        return Vr(
          e,
          t,
          t.type,
          t.pendingProps,
          l
        );
      case 15:
        return Zr(
          e,
          t,
          t.type,
          t.pendingProps,
          l
        );
      case 19:
        return eo(e, t, l);
      case 31:
        return gm(e, t, l);
      case 22:
        return Kr(
          e,
          t,
          l,
          t.pendingProps
        );
      case 24:
        return $l(t), a = ut(Ke), e === null ? (n = Pi(), n === null && (n = we, u = Fi(), n.pooledCache = u, u.refCount++, u !== null && (n.pooledCacheLanes |= l), n = u), t.memoizedState = { parent: a, cache: n }, tc(t), pl(t, Ke, n)) : ((e.lanes & l) !== 0 && (lc(e, t), bn(t, null, null, l), gn()), n = e.memoizedState, u = t.memoizedState, n.parent !== a ? (n = { parent: a, cache: a }, t.memoizedState = n, t.lanes === 0 && (t.memoizedState = t.updateQueue.baseState = n), pl(t, Ke, a)) : (a = u.cache, pl(t, Ke, a), a !== n.cache && $i(
          t,
          [Ke],
          l,
          !0
        ))), it(
          e,
          t,
          t.pendingProps.children,
          l
        ), t.child;
      case 29:
        throw t.pendingProps;
    }
    throw Error(m(156, t.tag));
  }
  function nl(e) {
    e.flags |= 4;
  }
  function Bc(e, t, l, a, n) {
    if ((t = (e.mode & 32) !== 0) && (t = !1), t) {
      if (e.flags |= 16777216, (n & 335544128) === n)
        if (e.stateNode.complete) e.flags |= 8192;
        else if (Ao()) e.flags |= 8192;
        else
          throw Pl = gu, ec;
    } else e.flags &= -16777217;
  }
  function lo(e, t) {
    if (t.type !== "stylesheet" || (t.state.loading & 4) !== 0)
      e.flags &= -16777217;
    else if (e.flags |= 16777216, !bd(t))
      if (Ao()) e.flags |= 8192;
      else
        throw Pl = gu, ec;
  }
  function wu(e, t) {
    t !== null && (e.flags |= 4), e.flags & 16384 && (t = e.tag !== 22 ? Rf() : 536870912, e.lanes |= t, Ra |= t);
  }
  function jn(e, t) {
    if (!Se)
      switch (e.tailMode) {
        case "hidden":
          t = e.tail;
          for (var l = null; t !== null; )
            t.alternate !== null && (l = t), t = t.sibling;
          l === null ? e.tail = null : l.sibling = null;
          break;
        case "collapsed":
          l = e.tail;
          for (var a = null; l !== null; )
            l.alternate !== null && (a = l), l = l.sibling;
          a === null ? t || e.tail === null ? e.tail = null : e.tail.sibling = null : a.sibling = null;
      }
  }
  function He(e) {
    var t = e.alternate !== null && e.alternate.child === e.child, l = 0, a = 0;
    if (t)
      for (var n = e.child; n !== null; )
        l |= n.lanes | n.childLanes, a |= n.subtreeFlags & 65011712, a |= n.flags & 65011712, n.return = e, n = n.sibling;
    else
      for (n = e.child; n !== null; )
        l |= n.lanes | n.childLanes, a |= n.subtreeFlags, a |= n.flags, n.return = e, n = n.sibling;
    return e.subtreeFlags |= a, e.childLanes = l, t;
  }
  function xm(e, t, l) {
    var a = t.pendingProps;
    switch (Zi(t), t.tag) {
      case 16:
      case 15:
      case 0:
      case 11:
      case 7:
      case 8:
      case 12:
      case 9:
      case 14:
        return He(t), null;
      case 1:
        return He(t), null;
      case 3:
        return l = t.stateNode, a = null, e !== null && (a = e.memoizedState.cache), t.memoizedState.cache !== a && (t.flags |= 2048), el(Ke), te(), l.pendingContext && (l.context = l.pendingContext, l.pendingContext = null), (e === null || e.child === null) && (Na(t) ? nl(t) : e === null || e.memoizedState.isDehydrated && (t.flags & 256) === 0 || (t.flags |= 1024, Ji())), He(t), null;
      case 26:
        var n = t.type, u = t.memoizedState;
        return e === null ? (nl(t), u !== null ? (He(t), lo(t, u)) : (He(t), Bc(
          t,
          n,
          null,
          a,
          l
        ))) : u ? u !== e.memoizedState ? (nl(t), He(t), lo(t, u)) : (He(t), t.flags &= -16777217) : (e = e.memoizedProps, e !== a && nl(t), He(t), Bc(
          t,
          n,
          e,
          a,
          l
        )), null;
      case 27:
        if (T(t), l = q.current, n = t.type, e !== null && t.stateNode != null)
          e.memoizedProps !== a && nl(t);
        else {
          if (!a) {
            if (t.stateNode === null)
              throw Error(m(166));
            return He(t), null;
          }
          e = A.current, Na(t) ? Rs(t) : (e = rd(n, a, l), t.stateNode = e, nl(t));
        }
        return He(t), null;
      case 5:
        if (T(t), n = t.type, e !== null && t.stateNode != null)
          e.memoizedProps !== a && nl(t);
        else {
          if (!a) {
            if (t.stateNode === null)
              throw Error(m(166));
            return He(t), null;
          }
          if (u = A.current, Na(t))
            Rs(t);
          else {
            var i = Wu(
              q.current
            );
            switch (u) {
              case 1:
                u = i.createElementNS(
                  "http://www.w3.org/2000/svg",
                  n
                );
                break;
              case 2:
                u = i.createElementNS(
                  "http://www.w3.org/1998/Math/MathML",
                  n
                );
                break;
              default:
                switch (n) {
                  case "svg":
                    u = i.createElementNS(
                      "http://www.w3.org/2000/svg",
                      n
                    );
                    break;
                  case "math":
                    u = i.createElementNS(
                      "http://www.w3.org/1998/Math/MathML",
                      n
                    );
                    break;
                  case "script":
                    u = i.createElement("div"), u.innerHTML = "<script><\/script>", u = u.removeChild(
                      u.firstChild
                    );
                    break;
                  case "select":
                    u = typeof a.is == "string" ? i.createElement("select", {
                      is: a.is
                    }) : i.createElement("select"), a.multiple ? u.multiple = !0 : a.size && (u.size = a.size);
                    break;
                  default:
                    u = typeof a.is == "string" ? i.createElement(n, { is: a.is }) : i.createElement(n);
                }
            }
            u[at] = t, u[ht] = a;
            e: for (i = t.child; i !== null; ) {
              if (i.tag === 5 || i.tag === 6)
                u.appendChild(i.stateNode);
              else if (i.tag !== 4 && i.tag !== 27 && i.child !== null) {
                i.child.return = i, i = i.child;
                continue;
              }
              if (i === t) break e;
              for (; i.sibling === null; ) {
                if (i.return === null || i.return === t)
                  break e;
                i = i.return;
              }
              i.sibling.return = i.return, i = i.sibling;
            }
            t.stateNode = u;
            e: switch (ct(u, n, a), n) {
              case "button":
              case "input":
              case "select":
              case "textarea":
                a = !!a.autoFocus;
                break e;
              case "img":
                a = !0;
                break e;
              default:
                a = !1;
            }
            a && nl(t);
          }
        }
        return He(t), Bc(
          t,
          t.type,
          e === null ? null : e.memoizedProps,
          t.pendingProps,
          l
        ), null;
      case 6:
        if (e && t.stateNode != null)
          e.memoizedProps !== a && nl(t);
        else {
          if (typeof a != "string" && t.stateNode === null)
            throw Error(m(166));
          if (e = q.current, Na(t)) {
            if (e = t.stateNode, l = t.memoizedProps, a = null, n = nt, n !== null)
              switch (n.tag) {
                case 27:
                case 5:
                  a = n.memoizedProps;
              }
            e[at] = t, e = !!(e.nodeValue === l || a !== null && a.suppressHydrationWarning === !0 || Po(e.nodeValue, l)), e || xl(t, !0);
          } else
            e = Wu(e).createTextNode(
              a
            ), e[at] = t, t.stateNode = e;
        }
        return He(t), null;
      case 31:
        if (l = t.memoizedState, e === null || e.memoizedState !== null) {
          if (a = Na(t), l !== null) {
            if (e === null) {
              if (!a) throw Error(m(318));
              if (e = t.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(m(557));
              e[at] = t;
            } else
              kl(), (t.flags & 128) === 0 && (t.memoizedState = null), t.flags |= 4;
            He(t), e = !1;
          } else
            l = Ji(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = l), e = !0;
          if (!e)
            return t.flags & 256 ? (_t(t), t) : (_t(t), null);
          if ((t.flags & 128) !== 0)
            throw Error(m(558));
        }
        return He(t), null;
      case 13:
        if (a = t.memoizedState, e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
          if (n = Na(t), a !== null && a.dehydrated !== null) {
            if (e === null) {
              if (!n) throw Error(m(318));
              if (n = t.memoizedState, n = n !== null ? n.dehydrated : null, !n) throw Error(m(317));
              n[at] = t;
            } else
              kl(), (t.flags & 128) === 0 && (t.memoizedState = null), t.flags |= 4;
            He(t), n = !1;
          } else
            n = Ji(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = n), n = !0;
          if (!n)
            return t.flags & 256 ? (_t(t), t) : (_t(t), null);
        }
        return _t(t), (t.flags & 128) !== 0 ? (t.lanes = l, t) : (l = a !== null, e = e !== null && e.memoizedState !== null, l && (a = t.child, n = null, a.alternate !== null && a.alternate.memoizedState !== null && a.alternate.memoizedState.cachePool !== null && (n = a.alternate.memoizedState.cachePool.pool), u = null, a.memoizedState !== null && a.memoizedState.cachePool !== null && (u = a.memoizedState.cachePool.pool), u !== n && (a.flags |= 2048)), l !== e && l && (t.child.flags |= 8192), wu(t, t.updateQueue), He(t), null);
      case 4:
        return te(), e === null && uf(t.stateNode.containerInfo), He(t), null;
      case 10:
        return el(t.type), He(t), null;
      case 19:
        if (y(Xe), a = t.memoizedState, a === null) return He(t), null;
        if (n = (t.flags & 128) !== 0, u = a.rendering, u === null)
          if (n) jn(a, !1);
          else {
            if (Qe !== 0 || e !== null && (e.flags & 128) !== 0)
              for (e = t.child; e !== null; ) {
                if (u = Su(e), u !== null) {
                  for (t.flags |= 128, jn(a, !1), e = u.updateQueue, t.updateQueue = e, wu(t, e), t.subtreeFlags = 0, e = l, l = t.child; l !== null; )
                    Cs(l, e), l = l.sibling;
                  return z(
                    Xe,
                    Xe.current & 1 | 2
                  ), Se && It(t, a.treeForkCount), t.child;
                }
                e = e.sibling;
              }
            a.tail !== null && st() > Yu && (t.flags |= 128, n = !0, jn(a, !1), t.lanes = 4194304);
          }
        else {
          if (!n)
            if (e = Su(u), e !== null) {
              if (t.flags |= 128, n = !0, e = e.updateQueue, t.updateQueue = e, wu(t, e), jn(a, !0), a.tail === null && a.tailMode === "hidden" && !u.alternate && !Se)
                return He(t), null;
            } else
              2 * st() - a.renderingStartTime > Yu && l !== 536870912 && (t.flags |= 128, n = !0, jn(a, !1), t.lanes = 4194304);
          a.isBackwards ? (u.sibling = t.child, t.child = u) : (e = a.last, e !== null ? e.sibling = u : t.child = u, a.last = u);
        }
        return a.tail !== null ? (e = a.tail, a.rendering = e, a.tail = e.sibling, a.renderingStartTime = st(), e.sibling = null, l = Xe.current, z(
          Xe,
          n ? l & 1 | 2 : l & 1
        ), Se && It(t, a.treeForkCount), e) : (He(t), null);
      case 22:
      case 23:
        return _t(t), ic(), a = t.memoizedState !== null, e !== null ? e.memoizedState !== null !== a && (t.flags |= 8192) : a && (t.flags |= 8192), a ? (l & 536870912) !== 0 && (t.flags & 128) === 0 && (He(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : He(t), l = t.updateQueue, l !== null && wu(t, l.retryQueue), l = null, e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (l = e.memoizedState.cachePool.pool), a = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (a = t.memoizedState.cachePool.pool), a !== l && (t.flags |= 2048), e !== null && y(Fl), null;
      case 24:
        return l = null, e !== null && (l = e.memoizedState.cache), t.memoizedState.cache !== l && (t.flags |= 2048), el(Ke), He(t), null;
      case 25:
        return null;
      case 30:
        return null;
    }
    throw Error(m(156, t.tag));
  }
  function pm(e, t) {
    switch (Zi(t), t.tag) {
      case 1:
        return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 3:
        return el(Ke), te(), e = t.flags, (e & 65536) !== 0 && (e & 128) === 0 ? (t.flags = e & -65537 | 128, t) : null;
      case 26:
      case 27:
      case 5:
        return T(t), null;
      case 31:
        if (t.memoizedState !== null) {
          if (_t(t), t.alternate === null)
            throw Error(m(340));
          kl();
        }
        return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 13:
        if (_t(t), e = t.memoizedState, e !== null && e.dehydrated !== null) {
          if (t.alternate === null)
            throw Error(m(340));
          kl();
        }
        return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 19:
        return y(Xe), null;
      case 4:
        return te(), null;
      case 10:
        return el(t.type), null;
      case 22:
      case 23:
        return _t(t), ic(), e !== null && y(Fl), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 24:
        return el(Ke), null;
      case 25:
        return null;
      default:
        return null;
    }
  }
  function ao(e, t) {
    switch (Zi(t), t.tag) {
      case 3:
        el(Ke), te();
        break;
      case 26:
      case 27:
      case 5:
        T(t);
        break;
      case 4:
        te();
        break;
      case 31:
        t.memoizedState !== null && _t(t);
        break;
      case 13:
        _t(t);
        break;
      case 19:
        y(Xe);
        break;
      case 10:
        el(t.type);
        break;
      case 22:
      case 23:
        _t(t), ic(), e !== null && y(Fl);
        break;
      case 24:
        el(Ke);
    }
  }
  function zn(e, t) {
    try {
      var l = t.updateQueue, a = l !== null ? l.lastEffect : null;
      if (a !== null) {
        var n = a.next;
        l = n;
        do {
          if ((l.tag & e) === e) {
            a = void 0;
            var u = l.create, i = l.inst;
            a = u(), i.destroy = a;
          }
          l = l.next;
        } while (l !== n);
      }
    } catch (f) {
      Ce(t, t.return, f);
    }
  }
  function El(e, t, l) {
    try {
      var a = t.updateQueue, n = a !== null ? a.lastEffect : null;
      if (n !== null) {
        var u = n.next;
        a = u;
        do {
          if ((a.tag & e) === e) {
            var i = a.inst, f = i.destroy;
            if (f !== void 0) {
              i.destroy = void 0, n = t;
              var o = l, b = f;
              try {
                b();
              } catch (j) {
                Ce(
                  n,
                  o,
                  j
                );
              }
            }
          }
          a = a.next;
        } while (a !== u);
      }
    } catch (j) {
      Ce(t, t.return, j);
    }
  }
  function no(e) {
    var t = e.updateQueue;
    if (t !== null) {
      var l = e.stateNode;
      try {
        ks(t, l);
      } catch (a) {
        Ce(e, e.return, a);
      }
    }
  }
  function uo(e, t, l) {
    l.props = la(
      e.type,
      e.memoizedProps
    ), l.state = e.memoizedState;
    try {
      l.componentWillUnmount();
    } catch (a) {
      Ce(e, t, a);
    }
  }
  function En(e, t) {
    try {
      var l = e.ref;
      if (l !== null) {
        switch (e.tag) {
          case 26:
          case 27:
          case 5:
            var a = e.stateNode;
            break;
          case 30:
            a = e.stateNode;
            break;
          default:
            a = e.stateNode;
        }
        typeof l == "function" ? e.refCleanup = l(a) : l.current = a;
      }
    } catch (n) {
      Ce(e, t, n);
    }
  }
  function Kt(e, t) {
    var l = e.ref, a = e.refCleanup;
    if (l !== null)
      if (typeof a == "function")
        try {
          a();
        } catch (n) {
          Ce(e, t, n);
        } finally {
          e.refCleanup = null, e = e.alternate, e != null && (e.refCleanup = null);
        }
      else if (typeof l == "function")
        try {
          l(null);
        } catch (n) {
          Ce(e, t, n);
        }
      else l.current = null;
  }
  function io(e) {
    var t = e.type, l = e.memoizedProps, a = e.stateNode;
    try {
      e: switch (t) {
        case "button":
        case "input":
        case "select":
        case "textarea":
          l.autoFocus && a.focus();
          break e;
        case "img":
          l.src ? a.src = l.src : l.srcSet && (a.srcset = l.srcSet);
      }
    } catch (n) {
      Ce(e, e.return, n);
    }
  }
  function qc(e, t, l) {
    try {
      var a = e.stateNode;
      Lm(a, e.type, l, t), a[ht] = t;
    } catch (n) {
      Ce(e, e.return, n);
    }
  }
  function co(e) {
    return e.tag === 5 || e.tag === 3 || e.tag === 26 || e.tag === 27 && Dl(e.type) || e.tag === 4;
  }
  function Yc(e) {
    e: for (; ; ) {
      for (; e.sibling === null; ) {
        if (e.return === null || co(e.return)) return null;
        e = e.return;
      }
      for (e.sibling.return = e.return, e = e.sibling; e.tag !== 5 && e.tag !== 6 && e.tag !== 18; ) {
        if (e.tag === 27 && Dl(e.type) || e.flags & 2 || e.child === null || e.tag === 4) continue e;
        e.child.return = e, e = e.child;
      }
      if (!(e.flags & 2)) return e.stateNode;
    }
  }
  function Gc(e, t, l) {
    var a = e.tag;
    if (a === 5 || a === 6)
      e = e.stateNode, t ? (l.nodeType === 9 ? l.body : l.nodeName === "HTML" ? l.ownerDocument.body : l).insertBefore(e, t) : (t = l.nodeType === 9 ? l.body : l.nodeName === "HTML" ? l.ownerDocument.body : l, t.appendChild(e), l = l._reactRootContainer, l != null || t.onclick !== null || (t.onclick = Wt));
    else if (a !== 4 && (a === 27 && Dl(e.type) && (l = e.stateNode, t = null), e = e.child, e !== null))
      for (Gc(e, t, l), e = e.sibling; e !== null; )
        Gc(e, t, l), e = e.sibling;
  }
  function Ru(e, t, l) {
    var a = e.tag;
    if (a === 5 || a === 6)
      e = e.stateNode, t ? l.insertBefore(e, t) : l.appendChild(e);
    else if (a !== 4 && (a === 27 && Dl(e.type) && (l = e.stateNode), e = e.child, e !== null))
      for (Ru(e, t, l), e = e.sibling; e !== null; )
        Ru(e, t, l), e = e.sibling;
  }
  function fo(e) {
    var t = e.stateNode, l = e.memoizedProps;
    try {
      for (var a = e.type, n = t.attributes; n.length; )
        t.removeAttributeNode(n[0]);
      ct(t, a, l), t[at] = e, t[ht] = l;
    } catch (u) {
      Ce(e, e.return, u);
    }
  }
  var ul = !1, We = !1, Qc = !1, so = typeof WeakSet == "function" ? WeakSet : Set, tt = null;
  function Sm(e, t) {
    if (e = e.containerInfo, sf = li, e = Ss(e), wi(e)) {
      if ("selectionStart" in e)
        var l = {
          start: e.selectionStart,
          end: e.selectionEnd
        };
      else
        e: {
          l = (l = e.ownerDocument) && l.defaultView || window;
          var a = l.getSelection && l.getSelection();
          if (a && a.rangeCount !== 0) {
            l = a.anchorNode;
            var n = a.anchorOffset, u = a.focusNode;
            a = a.focusOffset;
            try {
              l.nodeType, u.nodeType;
            } catch {
              l = null;
              break e;
            }
            var i = 0, f = -1, o = -1, b = 0, j = 0, _ = e, x = null;
            t: for (; ; ) {
              for (var p; _ !== l || n !== 0 && _.nodeType !== 3 || (f = i + n), _ !== u || a !== 0 && _.nodeType !== 3 || (o = i + a), _.nodeType === 3 && (i += _.nodeValue.length), (p = _.firstChild) !== null; )
                x = _, _ = p;
              for (; ; ) {
                if (_ === e) break t;
                if (x === l && ++b === n && (f = i), x === u && ++j === a && (o = i), (p = _.nextSibling) !== null) break;
                _ = x, x = _.parentNode;
              }
              _ = p;
            }
            l = f === -1 || o === -1 ? null : { start: f, end: o };
          } else l = null;
        }
      l = l || { start: 0, end: 0 };
    } else l = null;
    for (rf = { focusedElem: e, selectionRange: l }, li = !1, tt = t; tt !== null; )
      if (t = tt, e = t.child, (t.subtreeFlags & 1028) !== 0 && e !== null)
        e.return = t, tt = e;
      else
        for (; tt !== null; ) {
          switch (t = tt, u = t.alternate, e = t.flags, t.tag) {
            case 0:
              if ((e & 4) !== 0 && (e = t.updateQueue, e = e !== null ? e.events : null, e !== null))
                for (l = 0; l < e.length; l++)
                  n = e[l], n.ref.impl = n.nextImpl;
              break;
            case 11:
            case 15:
              break;
            case 1:
              if ((e & 1024) !== 0 && u !== null) {
                e = void 0, l = t, n = u.memoizedProps, u = u.memoizedState, a = l.stateNode;
                try {
                  var X = la(
                    l.type,
                    n
                  );
                  e = a.getSnapshotBeforeUpdate(
                    X,
                    u
                  ), a.__reactInternalSnapshotBeforeUpdate = e;
                } catch (ee) {
                  Ce(
                    l,
                    l.return,
                    ee
                  );
                }
              }
              break;
            case 3:
              if ((e & 1024) !== 0) {
                if (e = t.stateNode.containerInfo, l = e.nodeType, l === 9)
                  mf(e);
                else if (l === 1)
                  switch (e.nodeName) {
                    case "HEAD":
                    case "HTML":
                    case "BODY":
                      mf(e);
                      break;
                    default:
                      e.textContent = "";
                  }
              }
              break;
            case 5:
            case 26:
            case 27:
            case 6:
            case 4:
            case 17:
              break;
            default:
              if ((e & 1024) !== 0) throw Error(m(163));
          }
          if (e = t.sibling, e !== null) {
            e.return = t.return, tt = e;
            break;
          }
          tt = t.return;
        }
  }
  function ro(e, t, l) {
    var a = l.flags;
    switch (l.tag) {
      case 0:
      case 11:
      case 15:
        cl(e, l), a & 4 && zn(5, l);
        break;
      case 1:
        if (cl(e, l), a & 4)
          if (e = l.stateNode, t === null)
            try {
              e.componentDidMount();
            } catch (i) {
              Ce(l, l.return, i);
            }
          else {
            var n = la(
              l.type,
              t.memoizedProps
            );
            t = t.memoizedState;
            try {
              e.componentDidUpdate(
                n,
                t,
                e.__reactInternalSnapshotBeforeUpdate
              );
            } catch (i) {
              Ce(
                l,
                l.return,
                i
              );
            }
          }
        a & 64 && no(l), a & 512 && En(l, l.return);
        break;
      case 3:
        if (cl(e, l), a & 64 && (e = l.updateQueue, e !== null)) {
          if (t = null, l.child !== null)
            switch (l.child.tag) {
              case 27:
              case 5:
                t = l.child.stateNode;
                break;
              case 1:
                t = l.child.stateNode;
            }
          try {
            ks(e, t);
          } catch (i) {
            Ce(l, l.return, i);
          }
        }
        break;
      case 27:
        t === null && a & 4 && fo(l);
      case 26:
      case 5:
        cl(e, l), t === null && a & 4 && io(l), a & 512 && En(l, l.return);
        break;
      case 12:
        cl(e, l);
        break;
      case 31:
        cl(e, l), a & 4 && ho(e, l);
        break;
      case 13:
        cl(e, l), a & 4 && vo(e, l), a & 64 && (e = l.memoizedState, e !== null && (e = e.dehydrated, e !== null && (l = Cm.bind(
          null,
          l
        ), $m(e, l))));
        break;
      case 22:
        if (a = l.memoizedState !== null || ul, !a) {
          t = t !== null && t.memoizedState !== null || We, n = ul;
          var u = We;
          ul = a, (We = t) && !u ? fl(
            e,
            l,
            (l.subtreeFlags & 8772) !== 0
          ) : cl(e, l), ul = n, We = u;
        }
        break;
      case 30:
        break;
      default:
        cl(e, l);
    }
  }
  function oo(e) {
    var t = e.alternate;
    t !== null && (e.alternate = null, oo(t)), e.child = null, e.deletions = null, e.sibling = null, e.tag === 5 && (t = e.stateNode, t !== null && gi(t)), e.stateNode = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
  }
  var Be = null, yt = !1;
  function il(e, t, l) {
    for (l = l.child; l !== null; )
      mo(e, t, l), l = l.sibling;
  }
  function mo(e, t, l) {
    if (Nt && typeof Nt.onCommitFiberUnmount == "function")
      try {
        Nt.onCommitFiberUnmount(Gl, l);
      } catch {
      }
    switch (l.tag) {
      case 26:
        We || Kt(l, t), il(
          e,
          t,
          l
        ), l.memoizedState ? l.memoizedState.count-- : l.stateNode && (l = l.stateNode, l.parentNode.removeChild(l));
        break;
      case 27:
        We || Kt(l, t);
        var a = Be, n = yt;
        Dl(l.type) && (Be = l.stateNode, yt = !1), il(
          e,
          t,
          l
        ), Rn(l.stateNode), Be = a, yt = n;
        break;
      case 5:
        We || Kt(l, t);
      case 6:
        if (a = Be, n = yt, Be = null, il(
          e,
          t,
          l
        ), Be = a, yt = n, Be !== null)
          if (yt)
            try {
              (Be.nodeType === 9 ? Be.body : Be.nodeName === "HTML" ? Be.ownerDocument.body : Be).removeChild(l.stateNode);
            } catch (u) {
              Ce(
                l,
                t,
                u
              );
            }
          else
            try {
              Be.removeChild(l.stateNode);
            } catch (u) {
              Ce(
                l,
                t,
                u
              );
            }
        break;
      case 18:
        Be !== null && (yt ? (e = Be, ud(
          e.nodeType === 9 ? e.body : e.nodeName === "HTML" ? e.ownerDocument.body : e,
          l.stateNode
        ), Xa(e)) : ud(Be, l.stateNode));
        break;
      case 4:
        a = Be, n = yt, Be = l.stateNode.containerInfo, yt = !0, il(
          e,
          t,
          l
        ), Be = a, yt = n;
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        El(2, l, t), We || El(4, l, t), il(
          e,
          t,
          l
        );
        break;
      case 1:
        We || (Kt(l, t), a = l.stateNode, typeof a.componentWillUnmount == "function" && uo(
          l,
          t,
          a
        )), il(
          e,
          t,
          l
        );
        break;
      case 21:
        il(
          e,
          t,
          l
        );
        break;
      case 22:
        We = (a = We) || l.memoizedState !== null, il(
          e,
          t,
          l
        ), We = a;
        break;
      default:
        il(
          e,
          t,
          l
        );
    }
  }
  function ho(e, t) {
    if (t.memoizedState === null && (e = t.alternate, e !== null && (e = e.memoizedState, e !== null))) {
      e = e.dehydrated;
      try {
        Xa(e);
      } catch (l) {
        Ce(t, t.return, l);
      }
    }
  }
  function vo(e, t) {
    if (t.memoizedState === null && (e = t.alternate, e !== null && (e = e.memoizedState, e !== null && (e = e.dehydrated, e !== null))))
      try {
        Xa(e);
      } catch (l) {
        Ce(t, t.return, l);
      }
  }
  function Nm(e) {
    switch (e.tag) {
      case 31:
      case 13:
      case 19:
        var t = e.stateNode;
        return t === null && (t = e.stateNode = new so()), t;
      case 22:
        return e = e.stateNode, t = e._retryCache, t === null && (t = e._retryCache = new so()), t;
      default:
        throw Error(m(435, e.tag));
    }
  }
  function Hu(e, t) {
    var l = Nm(e);
    t.forEach(function(a) {
      if (!l.has(a)) {
        l.add(a);
        var n = Om.bind(null, e, a);
        a.then(n, n);
      }
    });
  }
  function gt(e, t) {
    var l = t.deletions;
    if (l !== null)
      for (var a = 0; a < l.length; a++) {
        var n = l[a], u = e, i = t, f = i;
        e: for (; f !== null; ) {
          switch (f.tag) {
            case 27:
              if (Dl(f.type)) {
                Be = f.stateNode, yt = !1;
                break e;
              }
              break;
            case 5:
              Be = f.stateNode, yt = !1;
              break e;
            case 3:
            case 4:
              Be = f.stateNode.containerInfo, yt = !0;
              break e;
          }
          f = f.return;
        }
        if (Be === null) throw Error(m(160));
        mo(u, i, n), Be = null, yt = !1, u = n.alternate, u !== null && (u.return = null), n.return = null;
      }
    if (t.subtreeFlags & 13886)
      for (t = t.child; t !== null; )
        yo(t, e), t = t.sibling;
  }
  var Lt = null;
  function yo(e, t) {
    var l = e.alternate, a = e.flags;
    switch (e.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        gt(t, e), bt(e), a & 4 && (El(3, e, e.return), zn(3, e), El(5, e, e.return));
        break;
      case 1:
        gt(t, e), bt(e), a & 512 && (We || l === null || Kt(l, l.return)), a & 64 && ul && (e = e.updateQueue, e !== null && (a = e.callbacks, a !== null && (l = e.shared.hiddenCallbacks, e.shared.hiddenCallbacks = l === null ? a : l.concat(a))));
        break;
      case 26:
        var n = Lt;
        if (gt(t, e), bt(e), a & 512 && (We || l === null || Kt(l, l.return)), a & 4) {
          var u = l !== null ? l.memoizedState : null;
          if (a = e.memoizedState, l === null)
            if (a === null)
              if (e.stateNode === null) {
                e: {
                  a = e.type, l = e.memoizedProps, n = n.ownerDocument || n;
                  t: switch (a) {
                    case "title":
                      u = n.getElementsByTagName("title")[0], (!u || u[Ia] || u[at] || u.namespaceURI === "http://www.w3.org/2000/svg" || u.hasAttribute("itemprop")) && (u = n.createElement(a), n.head.insertBefore(
                        u,
                        n.querySelector("head > title")
                      )), ct(u, a, l), u[at] = e, et(u), a = u;
                      break e;
                    case "link":
                      var i = yd(
                        "link",
                        "href",
                        n
                      ).get(a + (l.href || ""));
                      if (i) {
                        for (var f = 0; f < i.length; f++)
                          if (u = i[f], u.getAttribute("href") === (l.href == null || l.href === "" ? null : l.href) && u.getAttribute("rel") === (l.rel == null ? null : l.rel) && u.getAttribute("title") === (l.title == null ? null : l.title) && u.getAttribute("crossorigin") === (l.crossOrigin == null ? null : l.crossOrigin)) {
                            i.splice(f, 1);
                            break t;
                          }
                      }
                      u = n.createElement(a), ct(u, a, l), n.head.appendChild(u);
                      break;
                    case "meta":
                      if (i = yd(
                        "meta",
                        "content",
                        n
                      ).get(a + (l.content || ""))) {
                        for (f = 0; f < i.length; f++)
                          if (u = i[f], u.getAttribute("content") === (l.content == null ? null : "" + l.content) && u.getAttribute("name") === (l.name == null ? null : l.name) && u.getAttribute("property") === (l.property == null ? null : l.property) && u.getAttribute("http-equiv") === (l.httpEquiv == null ? null : l.httpEquiv) && u.getAttribute("charset") === (l.charSet == null ? null : l.charSet)) {
                            i.splice(f, 1);
                            break t;
                          }
                      }
                      u = n.createElement(a), ct(u, a, l), n.head.appendChild(u);
                      break;
                    default:
                      throw Error(m(468, a));
                  }
                  u[at] = e, et(u), a = u;
                }
                e.stateNode = a;
              } else
                gd(
                  n,
                  e.type,
                  e.stateNode
                );
            else
              e.stateNode = vd(
                n,
                a,
                e.memoizedProps
              );
          else
            u !== a ? (u === null ? l.stateNode !== null && (l = l.stateNode, l.parentNode.removeChild(l)) : u.count--, a === null ? gd(
              n,
              e.type,
              e.stateNode
            ) : vd(
              n,
              a,
              e.memoizedProps
            )) : a === null && e.stateNode !== null && qc(
              e,
              e.memoizedProps,
              l.memoizedProps
            );
        }
        break;
      case 27:
        gt(t, e), bt(e), a & 512 && (We || l === null || Kt(l, l.return)), l !== null && a & 4 && qc(
          e,
          e.memoizedProps,
          l.memoizedProps
        );
        break;
      case 5:
        if (gt(t, e), bt(e), a & 512 && (We || l === null || Kt(l, l.return)), e.flags & 32) {
          n = e.stateNode;
          try {
            da(n, "");
          } catch (X) {
            Ce(e, e.return, X);
          }
        }
        a & 4 && e.stateNode != null && (n = e.memoizedProps, qc(
          e,
          n,
          l !== null ? l.memoizedProps : n
        )), a & 1024 && (Qc = !0);
        break;
      case 6:
        if (gt(t, e), bt(e), a & 4) {
          if (e.stateNode === null)
            throw Error(m(162));
          a = e.memoizedProps, l = e.stateNode;
          try {
            l.nodeValue = a;
          } catch (X) {
            Ce(e, e.return, X);
          }
        }
        break;
      case 3:
        if (Iu = null, n = Lt, Lt = $u(t.containerInfo), gt(t, e), Lt = n, bt(e), a & 4 && l !== null && l.memoizedState.isDehydrated)
          try {
            Xa(t.containerInfo);
          } catch (X) {
            Ce(e, e.return, X);
          }
        Qc && (Qc = !1, go(e));
        break;
      case 4:
        a = Lt, Lt = $u(
          e.stateNode.containerInfo
        ), gt(t, e), bt(e), Lt = a;
        break;
      case 12:
        gt(t, e), bt(e);
        break;
      case 31:
        gt(t, e), bt(e), a & 4 && (a = e.updateQueue, a !== null && (e.updateQueue = null, Hu(e, a)));
        break;
      case 13:
        gt(t, e), bt(e), e.child.flags & 8192 && e.memoizedState !== null != (l !== null && l.memoizedState !== null) && (qu = st()), a & 4 && (a = e.updateQueue, a !== null && (e.updateQueue = null, Hu(e, a)));
        break;
      case 22:
        n = e.memoizedState !== null;
        var o = l !== null && l.memoizedState !== null, b = ul, j = We;
        if (ul = b || n, We = j || o, gt(t, e), We = j, ul = b, bt(e), a & 8192)
          e: for (t = e.stateNode, t._visibility = n ? t._visibility & -2 : t._visibility | 1, n && (l === null || o || ul || We || aa(e)), l = null, t = e; ; ) {
            if (t.tag === 5 || t.tag === 26) {
              if (l === null) {
                o = l = t;
                try {
                  if (u = o.stateNode, n)
                    i = u.style, typeof i.setProperty == "function" ? i.setProperty("display", "none", "important") : i.display = "none";
                  else {
                    f = o.stateNode;
                    var _ = o.memoizedProps.style, x = _ != null && _.hasOwnProperty("display") ? _.display : null;
                    f.style.display = x == null || typeof x == "boolean" ? "" : ("" + x).trim();
                  }
                } catch (X) {
                  Ce(o, o.return, X);
                }
              }
            } else if (t.tag === 6) {
              if (l === null) {
                o = t;
                try {
                  o.stateNode.nodeValue = n ? "" : o.memoizedProps;
                } catch (X) {
                  Ce(o, o.return, X);
                }
              }
            } else if (t.tag === 18) {
              if (l === null) {
                o = t;
                try {
                  var p = o.stateNode;
                  n ? id(p, !0) : id(o.stateNode, !1);
                } catch (X) {
                  Ce(o, o.return, X);
                }
              }
            } else if ((t.tag !== 22 && t.tag !== 23 || t.memoizedState === null || t === e) && t.child !== null) {
              t.child.return = t, t = t.child;
              continue;
            }
            if (t === e) break e;
            for (; t.sibling === null; ) {
              if (t.return === null || t.return === e) break e;
              l === t && (l = null), t = t.return;
            }
            l === t && (l = null), t.sibling.return = t.return, t = t.sibling;
          }
        a & 4 && (a = e.updateQueue, a !== null && (l = a.retryQueue, l !== null && (a.retryQueue = null, Hu(e, l))));
        break;
      case 19:
        gt(t, e), bt(e), a & 4 && (a = e.updateQueue, a !== null && (e.updateQueue = null, Hu(e, a)));
        break;
      case 30:
        break;
      case 21:
        break;
      default:
        gt(t, e), bt(e);
    }
  }
  function bt(e) {
    var t = e.flags;
    if (t & 2) {
      try {
        for (var l, a = e.return; a !== null; ) {
          if (co(a)) {
            l = a;
            break;
          }
          a = a.return;
        }
        if (l == null) throw Error(m(160));
        switch (l.tag) {
          case 27:
            var n = l.stateNode, u = Yc(e);
            Ru(e, u, n);
            break;
          case 5:
            var i = l.stateNode;
            l.flags & 32 && (da(i, ""), l.flags &= -33);
            var f = Yc(e);
            Ru(e, f, i);
            break;
          case 3:
          case 4:
            var o = l.stateNode.containerInfo, b = Yc(e);
            Gc(
              e,
              b,
              o
            );
            break;
          default:
            throw Error(m(161));
        }
      } catch (j) {
        Ce(e, e.return, j);
      }
      e.flags &= -3;
    }
    t & 4096 && (e.flags &= -4097);
  }
  function go(e) {
    if (e.subtreeFlags & 1024)
      for (e = e.child; e !== null; ) {
        var t = e;
        go(t), t.tag === 5 && t.flags & 1024 && t.stateNode.reset(), e = e.sibling;
      }
  }
  function cl(e, t) {
    if (t.subtreeFlags & 8772)
      for (t = t.child; t !== null; )
        ro(e, t.alternate, t), t = t.sibling;
  }
  function aa(e) {
    for (e = e.child; e !== null; ) {
      var t = e;
      switch (t.tag) {
        case 0:
        case 11:
        case 14:
        case 15:
          El(4, t, t.return), aa(t);
          break;
        case 1:
          Kt(t, t.return);
          var l = t.stateNode;
          typeof l.componentWillUnmount == "function" && uo(
            t,
            t.return,
            l
          ), aa(t);
          break;
        case 27:
          Rn(t.stateNode);
        case 26:
        case 5:
          Kt(t, t.return), aa(t);
          break;
        case 22:
          t.memoizedState === null && aa(t);
          break;
        case 30:
          aa(t);
          break;
        default:
          aa(t);
      }
      e = e.sibling;
    }
  }
  function fl(e, t, l) {
    for (l = l && (t.subtreeFlags & 8772) !== 0, t = t.child; t !== null; ) {
      var a = t.alternate, n = e, u = t, i = u.flags;
      switch (u.tag) {
        case 0:
        case 11:
        case 15:
          fl(
            n,
            u,
            l
          ), zn(4, u);
          break;
        case 1:
          if (fl(
            n,
            u,
            l
          ), a = u, n = a.stateNode, typeof n.componentDidMount == "function")
            try {
              n.componentDidMount();
            } catch (b) {
              Ce(a, a.return, b);
            }
          if (a = u, n = a.updateQueue, n !== null) {
            var f = a.stateNode;
            try {
              var o = n.shared.hiddenCallbacks;
              if (o !== null)
                for (n.shared.hiddenCallbacks = null, n = 0; n < o.length; n++)
                  Js(o[n], f);
            } catch (b) {
              Ce(a, a.return, b);
            }
          }
          l && i & 64 && no(u), En(u, u.return);
          break;
        case 27:
          fo(u);
        case 26:
        case 5:
          fl(
            n,
            u,
            l
          ), l && a === null && i & 4 && io(u), En(u, u.return);
          break;
        case 12:
          fl(
            n,
            u,
            l
          );
          break;
        case 31:
          fl(
            n,
            u,
            l
          ), l && i & 4 && ho(n, u);
          break;
        case 13:
          fl(
            n,
            u,
            l
          ), l && i & 4 && vo(n, u);
          break;
        case 22:
          u.memoizedState === null && fl(
            n,
            u,
            l
          ), En(u, u.return);
          break;
        case 30:
          break;
        default:
          fl(
            n,
            u,
            l
          );
      }
      t = t.sibling;
    }
  }
  function Lc(e, t) {
    var l = null;
    e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (l = e.memoizedState.cachePool.pool), e = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (e = t.memoizedState.cachePool.pool), e !== l && (e != null && e.refCount++, l != null && dn(l));
  }
  function Xc(e, t) {
    e = null, t.alternate !== null && (e = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== e && (t.refCount++, e != null && dn(e));
  }
  function Xt(e, t, l, a) {
    if (t.subtreeFlags & 10256)
      for (t = t.child; t !== null; )
        bo(
          e,
          t,
          l,
          a
        ), t = t.sibling;
  }
  function bo(e, t, l, a) {
    var n = t.flags;
    switch (t.tag) {
      case 0:
      case 11:
      case 15:
        Xt(
          e,
          t,
          l,
          a
        ), n & 2048 && zn(9, t);
        break;
      case 1:
        Xt(
          e,
          t,
          l,
          a
        );
        break;
      case 3:
        Xt(
          e,
          t,
          l,
          a
        ), n & 2048 && (e = null, t.alternate !== null && (e = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== e && (t.refCount++, e != null && dn(e)));
        break;
      case 12:
        if (n & 2048) {
          Xt(
            e,
            t,
            l,
            a
          ), e = t.stateNode;
          try {
            var u = t.memoizedProps, i = u.id, f = u.onPostCommit;
            typeof f == "function" && f(
              i,
              t.alternate === null ? "mount" : "update",
              e.passiveEffectDuration,
              -0
            );
          } catch (o) {
            Ce(t, t.return, o);
          }
        } else
          Xt(
            e,
            t,
            l,
            a
          );
        break;
      case 31:
        Xt(
          e,
          t,
          l,
          a
        );
        break;
      case 13:
        Xt(
          e,
          t,
          l,
          a
        );
        break;
      case 23:
        break;
      case 22:
        u = t.stateNode, i = t.alternate, t.memoizedState !== null ? u._visibility & 2 ? Xt(
          e,
          t,
          l,
          a
        ) : _n(e, t) : u._visibility & 2 ? Xt(
          e,
          t,
          l,
          a
        ) : (u._visibility |= 2, Ua(
          e,
          t,
          l,
          a,
          (t.subtreeFlags & 10256) !== 0 || !1
        )), n & 2048 && Lc(i, t);
        break;
      case 24:
        Xt(
          e,
          t,
          l,
          a
        ), n & 2048 && Xc(t.alternate, t);
        break;
      default:
        Xt(
          e,
          t,
          l,
          a
        );
    }
  }
  function Ua(e, t, l, a, n) {
    for (n = n && ((t.subtreeFlags & 10256) !== 0 || !1), t = t.child; t !== null; ) {
      var u = e, i = t, f = l, o = a, b = i.flags;
      switch (i.tag) {
        case 0:
        case 11:
        case 15:
          Ua(
            u,
            i,
            f,
            o,
            n
          ), zn(8, i);
          break;
        case 23:
          break;
        case 22:
          var j = i.stateNode;
          i.memoizedState !== null ? j._visibility & 2 ? Ua(
            u,
            i,
            f,
            o,
            n
          ) : _n(
            u,
            i
          ) : (j._visibility |= 2, Ua(
            u,
            i,
            f,
            o,
            n
          )), n && b & 2048 && Lc(
            i.alternate,
            i
          );
          break;
        case 24:
          Ua(
            u,
            i,
            f,
            o,
            n
          ), n && b & 2048 && Xc(i.alternate, i);
          break;
        default:
          Ua(
            u,
            i,
            f,
            o,
            n
          );
      }
      t = t.sibling;
    }
  }
  function _n(e, t) {
    if (t.subtreeFlags & 10256)
      for (t = t.child; t !== null; ) {
        var l = e, a = t, n = a.flags;
        switch (a.tag) {
          case 22:
            _n(l, a), n & 2048 && Lc(
              a.alternate,
              a
            );
            break;
          case 24:
            _n(l, a), n & 2048 && Xc(a.alternate, a);
            break;
          default:
            _n(l, a);
        }
        t = t.sibling;
      }
  }
  var Mn = 8192;
  function Da(e, t, l) {
    if (e.subtreeFlags & Mn)
      for (e = e.child; e !== null; )
        xo(
          e,
          t,
          l
        ), e = e.sibling;
  }
  function xo(e, t, l) {
    switch (e.tag) {
      case 26:
        Da(
          e,
          t,
          l
        ), e.flags & Mn && e.memoizedState !== null && fh(
          l,
          Lt,
          e.memoizedState,
          e.memoizedProps
        );
        break;
      case 5:
        Da(
          e,
          t,
          l
        );
        break;
      case 3:
      case 4:
        var a = Lt;
        Lt = $u(e.stateNode.containerInfo), Da(
          e,
          t,
          l
        ), Lt = a;
        break;
      case 22:
        e.memoizedState === null && (a = e.alternate, a !== null && a.memoizedState !== null ? (a = Mn, Mn = 16777216, Da(
          e,
          t,
          l
        ), Mn = a) : Da(
          e,
          t,
          l
        ));
        break;
      default:
        Da(
          e,
          t,
          l
        );
    }
  }
  function po(e) {
    var t = e.alternate;
    if (t !== null && (e = t.child, e !== null)) {
      t.child = null;
      do
        t = e.sibling, e.sibling = null, e = t;
      while (e !== null);
    }
  }
  function An(e) {
    var t = e.deletions;
    if ((e.flags & 16) !== 0) {
      if (t !== null)
        for (var l = 0; l < t.length; l++) {
          var a = t[l];
          tt = a, No(
            a,
            e
          );
        }
      po(e);
    }
    if (e.subtreeFlags & 10256)
      for (e = e.child; e !== null; )
        So(e), e = e.sibling;
  }
  function So(e) {
    switch (e.tag) {
      case 0:
      case 11:
      case 15:
        An(e), e.flags & 2048 && El(9, e, e.return);
        break;
      case 3:
        An(e);
        break;
      case 12:
        An(e);
        break;
      case 22:
        var t = e.stateNode;
        e.memoizedState !== null && t._visibility & 2 && (e.return === null || e.return.tag !== 13) ? (t._visibility &= -3, Bu(e)) : An(e);
        break;
      default:
        An(e);
    }
  }
  function Bu(e) {
    var t = e.deletions;
    if ((e.flags & 16) !== 0) {
      if (t !== null)
        for (var l = 0; l < t.length; l++) {
          var a = t[l];
          tt = a, No(
            a,
            e
          );
        }
      po(e);
    }
    for (e = e.child; e !== null; ) {
      switch (t = e, t.tag) {
        case 0:
        case 11:
        case 15:
          El(8, t, t.return), Bu(t);
          break;
        case 22:
          l = t.stateNode, l._visibility & 2 && (l._visibility &= -3, Bu(t));
          break;
        default:
          Bu(t);
      }
      e = e.sibling;
    }
  }
  function No(e, t) {
    for (; tt !== null; ) {
      var l = tt;
      switch (l.tag) {
        case 0:
        case 11:
        case 15:
          El(8, l, t);
          break;
        case 23:
        case 22:
          if (l.memoizedState !== null && l.memoizedState.cachePool !== null) {
            var a = l.memoizedState.cachePool.pool;
            a != null && a.refCount++;
          }
          break;
        case 24:
          dn(l.memoizedState.cache);
      }
      if (a = l.child, a !== null) a.return = l, tt = a;
      else
        e: for (l = e; tt !== null; ) {
          a = tt;
          var n = a.sibling, u = a.return;
          if (oo(a), a === l) {
            tt = null;
            break e;
          }
          if (n !== null) {
            n.return = u, tt = n;
            break e;
          }
          tt = u;
        }
    }
  }
  var Tm = {
    getCacheForType: function(e) {
      var t = ut(Ke), l = t.data.get(e);
      return l === void 0 && (l = e(), t.data.set(e, l)), l;
    },
    cacheSignal: function() {
      return ut(Ke).controller.signal;
    }
  }, jm = typeof WeakMap == "function" ? WeakMap : Map, ze = 0, we = null, ye = null, be = 0, Ae = 0, Mt = null, _l = !1, wa = !1, Vc = !1, sl = 0, Qe = 0, Ml = 0, na = 0, Zc = 0, At = 0, Ra = 0, Cn = null, xt = null, Kc = !1, qu = 0, To = 0, Yu = 1 / 0, Gu = null, Al = null, Pe = 0, Cl = null, Ha = null, rl = 0, Jc = 0, kc = null, jo = null, On = 0, Wc = null;
  function Ct() {
    return (ze & 2) !== 0 && be !== 0 ? be & -be : S.T !== null ? tf() : Yf();
  }
  function zo() {
    if (At === 0)
      if ((be & 536870912) === 0 || Se) {
        var e = kn;
        kn <<= 1, (kn & 3932160) === 0 && (kn = 262144), At = e;
      } else At = 536870912;
    return e = Et.current, e !== null && (e.flags |= 32), At;
  }
  function pt(e, t, l) {
    (e === we && (Ae === 2 || Ae === 9) || e.cancelPendingCommit !== null) && (Ba(e, 0), Ol(
      e,
      be,
      At,
      !1
    )), Fa(e, l), ((ze & 2) === 0 || e !== we) && (e === we && ((ze & 2) === 0 && (na |= l), Qe === 4 && Ol(
      e,
      be,
      At,
      !1
    )), Jt(e));
  }
  function Eo(e, t, l) {
    if ((ze & 6) !== 0) throw Error(m(327));
    var a = !l && (t & 127) === 0 && (t & e.expiredLanes) === 0 || $a(e, t), n = a ? _m(e, t) : Fc(e, t, !0), u = a;
    do {
      if (n === 0) {
        wa && !a && Ol(e, t, 0, !1);
        break;
      } else {
        if (l = e.current.alternate, u && !zm(l)) {
          n = Fc(e, t, !1), u = !1;
          continue;
        }
        if (n === 2) {
          if (u = t, e.errorRecoveryDisabledLanes & u)
            var i = 0;
          else
            i = e.pendingLanes & -536870913, i = i !== 0 ? i : i & 536870912 ? 536870912 : 0;
          if (i !== 0) {
            t = i;
            e: {
              var f = e;
              n = Cn;
              var o = f.current.memoizedState.isDehydrated;
              if (o && (Ba(f, i).flags |= 256), i = Fc(
                f,
                i,
                !1
              ), i !== 2) {
                if (Vc && !o) {
                  f.errorRecoveryDisabledLanes |= u, na |= u, n = 4;
                  break e;
                }
                u = xt, xt = n, u !== null && (xt === null ? xt = u : xt.push.apply(
                  xt,
                  u
                ));
              }
              n = i;
            }
            if (u = !1, n !== 2) continue;
          }
        }
        if (n === 1) {
          Ba(e, 0), Ol(e, t, 0, !0);
          break;
        }
        e: {
          switch (a = e, u = n, u) {
            case 0:
            case 1:
              throw Error(m(345));
            case 4:
              if ((t & 4194048) !== t) break;
            case 6:
              Ol(
                a,
                t,
                At,
                !_l
              );
              break e;
            case 2:
              xt = null;
              break;
            case 3:
            case 5:
              break;
            default:
              throw Error(m(329));
          }
          if ((t & 62914560) === t && (n = qu + 300 - st(), 10 < n)) {
            if (Ol(
              a,
              t,
              At,
              !_l
            ), $n(a, 0, !0) !== 0) break e;
            rl = t, a.timeoutHandle = ad(
              _o.bind(
                null,
                a,
                l,
                xt,
                Gu,
                Kc,
                t,
                At,
                na,
                Ra,
                _l,
                u,
                "Throttled",
                -0,
                0
              ),
              n
            );
            break e;
          }
          _o(
            a,
            l,
            xt,
            Gu,
            Kc,
            t,
            At,
            na,
            Ra,
            _l,
            u,
            null,
            -0,
            0
          );
        }
      }
      break;
    } while (!0);
    Jt(e);
  }
  function _o(e, t, l, a, n, u, i, f, o, b, j, _, x, p) {
    if (e.timeoutHandle = -1, _ = t.subtreeFlags, _ & 8192 || (_ & 16785408) === 16785408) {
      _ = {
        stylesheets: null,
        count: 0,
        imgCount: 0,
        imgBytes: 0,
        suspenseyImages: [],
        waitingForImages: !0,
        waitingForViewTransition: !1,
        unsuspend: Wt
      }, xo(
        t,
        u,
        _
      );
      var X = (u & 62914560) === u ? qu - st() : (u & 4194048) === u ? To - st() : 0;
      if (X = sh(
        _,
        X
      ), X !== null) {
        rl = u, e.cancelPendingCommit = X(
          Ro.bind(
            null,
            e,
            t,
            u,
            l,
            a,
            n,
            i,
            f,
            o,
            j,
            _,
            null,
            x,
            p
          )
        ), Ol(e, u, i, !b);
        return;
      }
    }
    Ro(
      e,
      t,
      u,
      l,
      a,
      n,
      i,
      f,
      o
    );
  }
  function zm(e) {
    for (var t = e; ; ) {
      var l = t.tag;
      if ((l === 0 || l === 11 || l === 15) && t.flags & 16384 && (l = t.updateQueue, l !== null && (l = l.stores, l !== null)))
        for (var a = 0; a < l.length; a++) {
          var n = l[a], u = n.getSnapshot;
          n = n.value;
          try {
            if (!jt(u(), n)) return !1;
          } catch {
            return !1;
          }
        }
      if (l = t.child, t.subtreeFlags & 16384 && l !== null)
        l.return = t, t = l;
      else {
        if (t === e) break;
        for (; t.sibling === null; ) {
          if (t.return === null || t.return === e) return !0;
          t = t.return;
        }
        t.sibling.return = t.return, t = t.sibling;
      }
    }
    return !0;
  }
  function Ol(e, t, l, a) {
    t &= ~Zc, t &= ~na, e.suspendedLanes |= t, e.pingedLanes &= ~t, a && (e.warmLanes |= t), a = e.expirationTimes;
    for (var n = t; 0 < n; ) {
      var u = 31 - Tt(n), i = 1 << u;
      a[u] = -1, n &= ~i;
    }
    l !== 0 && Hf(e, l, t);
  }
  function Qu() {
    return (ze & 6) === 0 ? (Un(0), !1) : !0;
  }
  function $c() {
    if (ye !== null) {
      if (Ae === 0)
        var e = ye.return;
      else
        e = ye, Pt = Wl = null, dc(e), _a = null, hn = 0, e = ye;
      for (; e !== null; )
        ao(e.alternate, e), e = e.return;
      ye = null;
    }
  }
  function Ba(e, t) {
    var l = e.timeoutHandle;
    l !== -1 && (e.timeoutHandle = -1, Zm(l)), l = e.cancelPendingCommit, l !== null && (e.cancelPendingCommit = null, l()), rl = 0, $c(), we = e, ye = l = Ft(e.current, null), be = t, Ae = 0, Mt = null, _l = !1, wa = $a(e, t), Vc = !1, Ra = At = Zc = na = Ml = Qe = 0, xt = Cn = null, Kc = !1, (t & 8) !== 0 && (t |= t & 32);
    var a = e.entangledLanes;
    if (a !== 0)
      for (e = e.entanglements, a &= t; 0 < a; ) {
        var n = 31 - Tt(a), u = 1 << n;
        t |= e[n], a &= ~u;
      }
    return sl = t, fu(), l;
  }
  function Mo(e, t) {
    re = null, S.H = Nn, t === Ea || t === yu ? (t = Xs(), Ae = 3) : t === ec ? (t = Xs(), Ae = 4) : Ae = t === Mc ? 8 : t !== null && typeof t == "object" && typeof t.then == "function" ? 6 : 1, Mt = t, ye === null && (Qe = 1, Cu(
      e,
      wt(t, e.current)
    ));
  }
  function Ao() {
    var e = Et.current;
    return e === null ? !0 : (be & 4194048) === be ? qt === null : (be & 62914560) === be || (be & 536870912) !== 0 ? e === qt : !1;
  }
  function Co() {
    var e = S.H;
    return S.H = Nn, e === null ? Nn : e;
  }
  function Oo() {
    var e = S.A;
    return S.A = Tm, e;
  }
  function Lu() {
    Qe = 4, _l || (be & 4194048) !== be && Et.current !== null || (wa = !0), (Ml & 134217727) === 0 && (na & 134217727) === 0 || we === null || Ol(
      we,
      be,
      At,
      !1
    );
  }
  function Fc(e, t, l) {
    var a = ze;
    ze |= 2;
    var n = Co(), u = Oo();
    (we !== e || be !== t) && (Gu = null, Ba(e, t)), t = !1;
    var i = Qe;
    e: do
      try {
        if (Ae !== 0 && ye !== null) {
          var f = ye, o = Mt;
          switch (Ae) {
            case 8:
              $c(), i = 6;
              break e;
            case 3:
            case 2:
            case 9:
            case 6:
              Et.current === null && (t = !0);
              var b = Ae;
              if (Ae = 0, Mt = null, qa(e, f, o, b), l && wa) {
                i = 0;
                break e;
              }
              break;
            default:
              b = Ae, Ae = 0, Mt = null, qa(e, f, o, b);
          }
        }
        Em(), i = Qe;
        break;
      } catch (j) {
        Mo(e, j);
      }
    while (!0);
    return t && e.shellSuspendCounter++, Pt = Wl = null, ze = a, S.H = n, S.A = u, ye === null && (we = null, be = 0, fu()), i;
  }
  function Em() {
    for (; ye !== null; ) Uo(ye);
  }
  function _m(e, t) {
    var l = ze;
    ze |= 2;
    var a = Co(), n = Oo();
    we !== e || be !== t ? (Gu = null, Yu = st() + 500, Ba(e, t)) : wa = $a(
      e,
      t
    );
    e: do
      try {
        if (Ae !== 0 && ye !== null) {
          t = ye;
          var u = Mt;
          t: switch (Ae) {
            case 1:
              Ae = 0, Mt = null, qa(e, t, u, 1);
              break;
            case 2:
            case 9:
              if (Qs(u)) {
                Ae = 0, Mt = null, Do(t);
                break;
              }
              t = function() {
                Ae !== 2 && Ae !== 9 || we !== e || (Ae = 7), Jt(e);
              }, u.then(t, t);
              break e;
            case 3:
              Ae = 7;
              break e;
            case 4:
              Ae = 5;
              break e;
            case 7:
              Qs(u) ? (Ae = 0, Mt = null, Do(t)) : (Ae = 0, Mt = null, qa(e, t, u, 7));
              break;
            case 5:
              var i = null;
              switch (ye.tag) {
                case 26:
                  i = ye.memoizedState;
                case 5:
                case 27:
                  var f = ye;
                  if (i ? bd(i) : f.stateNode.complete) {
                    Ae = 0, Mt = null;
                    var o = f.sibling;
                    if (o !== null) ye = o;
                    else {
                      var b = f.return;
                      b !== null ? (ye = b, Xu(b)) : ye = null;
                    }
                    break t;
                  }
              }
              Ae = 0, Mt = null, qa(e, t, u, 5);
              break;
            case 6:
              Ae = 0, Mt = null, qa(e, t, u, 6);
              break;
            case 8:
              $c(), Qe = 6;
              break e;
            default:
              throw Error(m(462));
          }
        }
        Mm();
        break;
      } catch (j) {
        Mo(e, j);
      }
    while (!0);
    return Pt = Wl = null, S.H = a, S.A = n, ze = l, ye !== null ? 0 : (we = null, be = 0, fu(), Qe);
  }
  function Mm() {
    for (; ye !== null && !Za(); )
      Uo(ye);
  }
  function Uo(e) {
    var t = to(e.alternate, e, sl);
    e.memoizedProps = e.pendingProps, t === null ? Xu(e) : ye = t;
  }
  function Do(e) {
    var t = e, l = t.alternate;
    switch (t.tag) {
      case 15:
      case 0:
        t = Wr(
          l,
          t,
          t.pendingProps,
          t.type,
          void 0,
          be
        );
        break;
      case 11:
        t = Wr(
          l,
          t,
          t.pendingProps,
          t.type.render,
          t.ref,
          be
        );
        break;
      case 5:
        dc(t);
      default:
        ao(l, t), t = ye = Cs(t, sl), t = to(l, t, sl);
    }
    e.memoizedProps = e.pendingProps, t === null ? Xu(e) : ye = t;
  }
  function qa(e, t, l, a) {
    Pt = Wl = null, dc(t), _a = null, hn = 0;
    var n = t.return;
    try {
      if (ym(
        e,
        n,
        t,
        l,
        be
      )) {
        Qe = 1, Cu(
          e,
          wt(l, e.current)
        ), ye = null;
        return;
      }
    } catch (u) {
      if (n !== null) throw ye = n, u;
      Qe = 1, Cu(
        e,
        wt(l, e.current)
      ), ye = null;
      return;
    }
    t.flags & 32768 ? (Se || a === 1 ? e = !0 : wa || (be & 536870912) !== 0 ? e = !1 : (_l = e = !0, (a === 2 || a === 9 || a === 3 || a === 6) && (a = Et.current, a !== null && a.tag === 13 && (a.flags |= 16384))), wo(t, e)) : Xu(t);
  }
  function Xu(e) {
    var t = e;
    do {
      if ((t.flags & 32768) !== 0) {
        wo(
          t,
          _l
        );
        return;
      }
      e = t.return;
      var l = xm(
        t.alternate,
        t,
        sl
      );
      if (l !== null) {
        ye = l;
        return;
      }
      if (t = t.sibling, t !== null) {
        ye = t;
        return;
      }
      ye = t = e;
    } while (t !== null);
    Qe === 0 && (Qe = 5);
  }
  function wo(e, t) {
    do {
      var l = pm(e.alternate, e);
      if (l !== null) {
        l.flags &= 32767, ye = l;
        return;
      }
      if (l = e.return, l !== null && (l.flags |= 32768, l.subtreeFlags = 0, l.deletions = null), !t && (e = e.sibling, e !== null)) {
        ye = e;
        return;
      }
      ye = e = l;
    } while (e !== null);
    Qe = 6, ye = null;
  }
  function Ro(e, t, l, a, n, u, i, f, o) {
    e.cancelPendingCommit = null;
    do
      Vu();
    while (Pe !== 0);
    if ((ze & 6) !== 0) throw Error(m(327));
    if (t !== null) {
      if (t === e.current) throw Error(m(177));
      if (u = t.lanes | t.childLanes, u |= Yi, c0(
        e,
        l,
        u,
        i,
        f,
        o
      ), e === we && (ye = we = null, be = 0), Ha = t, Cl = e, rl = l, Jc = u, kc = n, jo = a, (t.subtreeFlags & 10256) !== 0 || (t.flags & 10256) !== 0 ? (e.callbackNode = null, e.callbackPriority = 0, Um(ua, function() {
        return Go(), null;
      })) : (e.callbackNode = null, e.callbackPriority = 0), a = (t.flags & 13878) !== 0, (t.subtreeFlags & 13878) !== 0 || a) {
        a = S.T, S.T = null, n = R.p, R.p = 2, i = ze, ze |= 4;
        try {
          Sm(e, t, l);
        } finally {
          ze = i, R.p = n, S.T = a;
        }
      }
      Pe = 1, Ho(), Bo(), qo();
    }
  }
  function Ho() {
    if (Pe === 1) {
      Pe = 0;
      var e = Cl, t = Ha, l = (t.flags & 13878) !== 0;
      if ((t.subtreeFlags & 13878) !== 0 || l) {
        l = S.T, S.T = null;
        var a = R.p;
        R.p = 2;
        var n = ze;
        ze |= 4;
        try {
          yo(t, e);
          var u = rf, i = Ss(e.containerInfo), f = u.focusedElem, o = u.selectionRange;
          if (i !== f && f && f.ownerDocument && ps(
            f.ownerDocument.documentElement,
            f
          )) {
            if (o !== null && wi(f)) {
              var b = o.start, j = o.end;
              if (j === void 0 && (j = b), "selectionStart" in f)
                f.selectionStart = b, f.selectionEnd = Math.min(
                  j,
                  f.value.length
                );
              else {
                var _ = f.ownerDocument || document, x = _ && _.defaultView || window;
                if (x.getSelection) {
                  var p = x.getSelection(), X = f.textContent.length, ee = Math.min(o.start, X), De = o.end === void 0 ? ee : Math.min(o.end, X);
                  !p.extend && ee > De && (i = De, De = ee, ee = i);
                  var h = xs(
                    f,
                    ee
                  ), d = xs(
                    f,
                    De
                  );
                  if (h && d && (p.rangeCount !== 1 || p.anchorNode !== h.node || p.anchorOffset !== h.offset || p.focusNode !== d.node || p.focusOffset !== d.offset)) {
                    var g = _.createRange();
                    g.setStart(h.node, h.offset), p.removeAllRanges(), ee > De ? (p.addRange(g), p.extend(d.node, d.offset)) : (g.setEnd(d.node, d.offset), p.addRange(g));
                  }
                }
              }
            }
            for (_ = [], p = f; p = p.parentNode; )
              p.nodeType === 1 && _.push({
                element: p,
                left: p.scrollLeft,
                top: p.scrollTop
              });
            for (typeof f.focus == "function" && f.focus(), f = 0; f < _.length; f++) {
              var E = _[f];
              E.element.scrollLeft = E.left, E.element.scrollTop = E.top;
            }
          }
          li = !!sf, rf = sf = null;
        } finally {
          ze = n, R.p = a, S.T = l;
        }
      }
      e.current = t, Pe = 2;
    }
  }
  function Bo() {
    if (Pe === 2) {
      Pe = 0;
      var e = Cl, t = Ha, l = (t.flags & 8772) !== 0;
      if ((t.subtreeFlags & 8772) !== 0 || l) {
        l = S.T, S.T = null;
        var a = R.p;
        R.p = 2;
        var n = ze;
        ze |= 4;
        try {
          ro(e, t.alternate, t);
        } finally {
          ze = n, R.p = a, S.T = l;
        }
      }
      Pe = 3;
    }
  }
  function qo() {
    if (Pe === 4 || Pe === 3) {
      Pe = 0, Ka();
      var e = Cl, t = Ha, l = rl, a = jo;
      (t.subtreeFlags & 10256) !== 0 || (t.flags & 10256) !== 0 ? Pe = 5 : (Pe = 0, Ha = Cl = null, Yo(e, e.pendingLanes));
      var n = e.pendingLanes;
      if (n === 0 && (Al = null), vi(l), t = t.stateNode, Nt && typeof Nt.onCommitFiberRoot == "function")
        try {
          Nt.onCommitFiberRoot(
            Gl,
            t,
            void 0,
            (t.current.flags & 128) === 128
          );
        } catch {
        }
      if (a !== null) {
        t = S.T, n = R.p, R.p = 2, S.T = null;
        try {
          for (var u = e.onRecoverableError, i = 0; i < a.length; i++) {
            var f = a[i];
            u(f.value, {
              componentStack: f.stack
            });
          }
        } finally {
          S.T = t, R.p = n;
        }
      }
      (rl & 3) !== 0 && Vu(), Jt(e), n = e.pendingLanes, (l & 261930) !== 0 && (n & 42) !== 0 ? e === Wc ? On++ : (On = 0, Wc = e) : On = 0, Un(0);
    }
  }
  function Yo(e, t) {
    (e.pooledCacheLanes &= t) === 0 && (t = e.pooledCache, t != null && (e.pooledCache = null, dn(t)));
  }
  function Vu() {
    return Ho(), Bo(), qo(), Go();
  }
  function Go() {
    if (Pe !== 5) return !1;
    var e = Cl, t = Jc;
    Jc = 0;
    var l = vi(rl), a = S.T, n = R.p;
    try {
      R.p = 32 > l ? 32 : l, S.T = null, l = kc, kc = null;
      var u = Cl, i = rl;
      if (Pe = 0, Ha = Cl = null, rl = 0, (ze & 6) !== 0) throw Error(m(331));
      var f = ze;
      if (ze |= 4, So(u.current), bo(
        u,
        u.current,
        i,
        l
      ), ze = f, Un(0, !1), Nt && typeof Nt.onPostCommitFiberRoot == "function")
        try {
          Nt.onPostCommitFiberRoot(Gl, u);
        } catch {
        }
      return !0;
    } finally {
      R.p = n, S.T = a, Yo(e, t);
    }
  }
  function Qo(e, t, l) {
    t = wt(l, t), t = _c(e.stateNode, t, 2), e = Tl(e, t, 2), e !== null && (Fa(e, 2), Jt(e));
  }
  function Ce(e, t, l) {
    if (e.tag === 3)
      Qo(e, e, l);
    else
      for (; t !== null; ) {
        if (t.tag === 3) {
          Qo(
            t,
            e,
            l
          );
          break;
        } else if (t.tag === 1) {
          var a = t.stateNode;
          if (typeof t.type.getDerivedStateFromError == "function" || typeof a.componentDidCatch == "function" && (Al === null || !Al.has(a))) {
            e = wt(l, e), l = Qr(2), a = Tl(t, l, 2), a !== null && (Lr(
              l,
              a,
              t,
              e
            ), Fa(a, 2), Jt(a));
            break;
          }
        }
        t = t.return;
      }
  }
  function Ic(e, t, l) {
    var a = e.pingCache;
    if (a === null) {
      a = e.pingCache = new jm();
      var n = /* @__PURE__ */ new Set();
      a.set(t, n);
    } else
      n = a.get(t), n === void 0 && (n = /* @__PURE__ */ new Set(), a.set(t, n));
    n.has(l) || (Vc = !0, n.add(l), e = Am.bind(null, e, t, l), t.then(e, e));
  }
  function Am(e, t, l) {
    var a = e.pingCache;
    a !== null && a.delete(t), e.pingedLanes |= e.suspendedLanes & l, e.warmLanes &= ~l, we === e && (be & l) === l && (Qe === 4 || Qe === 3 && (be & 62914560) === be && 300 > st() - qu ? (ze & 2) === 0 && Ba(e, 0) : Zc |= l, Ra === be && (Ra = 0)), Jt(e);
  }
  function Lo(e, t) {
    t === 0 && (t = Rf()), e = Kl(e, t), e !== null && (Fa(e, t), Jt(e));
  }
  function Cm(e) {
    var t = e.memoizedState, l = 0;
    t !== null && (l = t.retryLane), Lo(e, l);
  }
  function Om(e, t) {
    var l = 0;
    switch (e.tag) {
      case 31:
      case 13:
        var a = e.stateNode, n = e.memoizedState;
        n !== null && (l = n.retryLane);
        break;
      case 19:
        a = e.stateNode;
        break;
      case 22:
        a = e.stateNode._retryCache;
        break;
      default:
        throw Error(m(314));
    }
    a !== null && a.delete(t), Lo(e, l);
  }
  function Um(e, t) {
    return Ye(e, t);
  }
  var Zu = null, Ya = null, Pc = !1, Ku = !1, ef = !1, Ul = 0;
  function Jt(e) {
    e !== Ya && e.next === null && (Ya === null ? Zu = Ya = e : Ya = Ya.next = e), Ku = !0, Pc || (Pc = !0, wm());
  }
  function Un(e, t) {
    if (!ef && Ku) {
      ef = !0;
      do
        for (var l = !1, a = Zu; a !== null; ) {
          if (e !== 0) {
            var n = a.pendingLanes;
            if (n === 0) var u = 0;
            else {
              var i = a.suspendedLanes, f = a.pingedLanes;
              u = (1 << 31 - Tt(42 | e) + 1) - 1, u &= n & ~(i & ~f), u = u & 201326741 ? u & 201326741 | 1 : u ? u | 2 : 0;
            }
            u !== 0 && (l = !0, Ko(a, u));
          } else
            u = be, u = $n(
              a,
              a === we ? u : 0,
              a.cancelPendingCommit !== null || a.timeoutHandle !== -1
            ), (u & 3) === 0 || $a(a, u) || (l = !0, Ko(a, u));
          a = a.next;
        }
      while (l);
      ef = !1;
    }
  }
  function Dm() {
    Xo();
  }
  function Xo() {
    Ku = Pc = !1;
    var e = 0;
    Ul !== 0 && Vm() && (e = Ul);
    for (var t = st(), l = null, a = Zu; a !== null; ) {
      var n = a.next, u = Vo(a, t);
      u === 0 ? (a.next = null, l === null ? Zu = n : l.next = n, n === null && (Ya = l)) : (l = a, (e !== 0 || (u & 3) !== 0) && (Ku = !0)), a = n;
    }
    Pe !== 0 && Pe !== 5 || Un(e), Ul !== 0 && (Ul = 0);
  }
  function Vo(e, t) {
    for (var l = e.suspendedLanes, a = e.pingedLanes, n = e.expirationTimes, u = e.pendingLanes & -62914561; 0 < u; ) {
      var i = 31 - Tt(u), f = 1 << i, o = n[i];
      o === -1 ? ((f & l) === 0 || (f & a) !== 0) && (n[i] = i0(f, t)) : o <= t && (e.expiredLanes |= f), u &= ~f;
    }
    if (t = we, l = be, l = $n(
      e,
      e === t ? l : 0,
      e.cancelPendingCommit !== null || e.timeoutHandle !== -1
    ), a = e.callbackNode, l === 0 || e === t && (Ae === 2 || Ae === 9) || e.cancelPendingCommit !== null)
      return a !== null && a !== null && Yl(a), e.callbackNode = null, e.callbackPriority = 0;
    if ((l & 3) === 0 || $a(e, l)) {
      if (t = l & -l, t === e.callbackPriority) return t;
      switch (a !== null && Yl(a), vi(l)) {
        case 2:
        case 8:
          l = Zn;
          break;
        case 32:
          l = ua;
          break;
        case 268435456:
          l = ka;
          break;
        default:
          l = ua;
      }
      return a = Zo.bind(null, e), l = Ye(l, a), e.callbackPriority = t, e.callbackNode = l, t;
    }
    return a !== null && a !== null && Yl(a), e.callbackPriority = 2, e.callbackNode = null, 2;
  }
  function Zo(e, t) {
    if (Pe !== 0 && Pe !== 5)
      return e.callbackNode = null, e.callbackPriority = 0, null;
    var l = e.callbackNode;
    if (Vu() && e.callbackNode !== l)
      return null;
    var a = be;
    return a = $n(
      e,
      e === we ? a : 0,
      e.cancelPendingCommit !== null || e.timeoutHandle !== -1
    ), a === 0 ? null : (Eo(e, a, t), Vo(e, st()), e.callbackNode != null && e.callbackNode === l ? Zo.bind(null, e) : null);
  }
  function Ko(e, t) {
    if (Vu()) return null;
    Eo(e, t, !0);
  }
  function wm() {
    Km(function() {
      (ze & 6) !== 0 ? Ye(
        Ja,
        Dm
      ) : Xo();
    });
  }
  function tf() {
    if (Ul === 0) {
      var e = ja;
      e === 0 && (e = Jn, Jn <<= 1, (Jn & 261888) === 0 && (Jn = 256)), Ul = e;
    }
    return Ul;
  }
  function Jo(e) {
    return e == null || typeof e == "symbol" || typeof e == "boolean" ? null : typeof e == "function" ? e : eu("" + e);
  }
  function ko(e, t) {
    var l = t.ownerDocument.createElement("input");
    return l.name = t.name, l.value = t.value, e.id && l.setAttribute("form", e.id), t.parentNode.insertBefore(l, t), e = new FormData(e), l.parentNode.removeChild(l), e;
  }
  function Rm(e, t, l, a, n) {
    if (t === "submit" && l && l.stateNode === n) {
      var u = Jo(
        (n[ht] || null).action
      ), i = a.submitter;
      i && (t = (t = i[ht] || null) ? Jo(t.formAction) : i.getAttribute("formAction"), t !== null && (u = t, i = null));
      var f = new nu(
        "action",
        "action",
        null,
        a,
        n
      );
      e.push({
        event: f,
        listeners: [
          {
            instance: null,
            listener: function() {
              if (a.defaultPrevented) {
                if (Ul !== 0) {
                  var o = i ? ko(n, i) : new FormData(n);
                  Sc(
                    l,
                    {
                      pending: !0,
                      data: o,
                      method: n.method,
                      action: u
                    },
                    null,
                    o
                  );
                }
              } else
                typeof u == "function" && (f.preventDefault(), o = i ? ko(n, i) : new FormData(n), Sc(
                  l,
                  {
                    pending: !0,
                    data: o,
                    method: n.method,
                    action: u
                  },
                  u,
                  o
                ));
            },
            currentTarget: n
          }
        ]
      });
    }
  }
  for (var lf = 0; lf < qi.length; lf++) {
    var af = qi[lf], Hm = af.toLowerCase(), Bm = af[0].toUpperCase() + af.slice(1);
    Qt(
      Hm,
      "on" + Bm
    );
  }
  Qt(js, "onAnimationEnd"), Qt(zs, "onAnimationIteration"), Qt(Es, "onAnimationStart"), Qt("dblclick", "onDoubleClick"), Qt("focusin", "onFocus"), Qt("focusout", "onBlur"), Qt(P0, "onTransitionRun"), Qt(em, "onTransitionStart"), Qt(tm, "onTransitionCancel"), Qt(_s, "onTransitionEnd"), ra("onMouseEnter", ["mouseout", "mouseover"]), ra("onMouseLeave", ["mouseout", "mouseover"]), ra("onPointerEnter", ["pointerout", "pointerover"]), ra("onPointerLeave", ["pointerout", "pointerover"]), Ll(
    "onChange",
    "change click focusin focusout input keydown keyup selectionchange".split(" ")
  ), Ll(
    "onSelect",
    "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(
      " "
    )
  ), Ll("onBeforeInput", [
    "compositionend",
    "keypress",
    "textInput",
    "paste"
  ]), Ll(
    "onCompositionEnd",
    "compositionend focusout keydown keypress keyup mousedown".split(" ")
  ), Ll(
    "onCompositionStart",
    "compositionstart focusout keydown keypress keyup mousedown".split(" ")
  ), Ll(
    "onCompositionUpdate",
    "compositionupdate focusout keydown keypress keyup mousedown".split(" ")
  );
  var Dn = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(
    " "
  ), qm = new Set(
    "beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(Dn)
  );
  function Wo(e, t) {
    t = (t & 4) !== 0;
    for (var l = 0; l < e.length; l++) {
      var a = e[l], n = a.event;
      a = a.listeners;
      e: {
        var u = void 0;
        if (t)
          for (var i = a.length - 1; 0 <= i; i--) {
            var f = a[i], o = f.instance, b = f.currentTarget;
            if (f = f.listener, o !== u && n.isPropagationStopped())
              break e;
            u = f, n.currentTarget = b;
            try {
              u(n);
            } catch (j) {
              cu(j);
            }
            n.currentTarget = null, u = o;
          }
        else
          for (i = 0; i < a.length; i++) {
            if (f = a[i], o = f.instance, b = f.currentTarget, f = f.listener, o !== u && n.isPropagationStopped())
              break e;
            u = f, n.currentTarget = b;
            try {
              u(n);
            } catch (j) {
              cu(j);
            }
            n.currentTarget = null, u = o;
          }
      }
    }
  }
  function ge(e, t) {
    var l = t[yi];
    l === void 0 && (l = t[yi] = /* @__PURE__ */ new Set());
    var a = e + "__bubble";
    l.has(a) || ($o(t, e, 2, !1), l.add(a));
  }
  function nf(e, t, l) {
    var a = 0;
    t && (a |= 4), $o(
      l,
      e,
      a,
      t
    );
  }
  var Ju = "_reactListening" + Math.random().toString(36).slice(2);
  function uf(e) {
    if (!e[Ju]) {
      e[Ju] = !0, Lf.forEach(function(l) {
        l !== "selectionchange" && (qm.has(l) || nf(l, !1, e), nf(l, !0, e));
      });
      var t = e.nodeType === 9 ? e : e.ownerDocument;
      t === null || t[Ju] || (t[Ju] = !0, nf("selectionchange", !1, t));
    }
  }
  function $o(e, t, l, a) {
    switch (zd(t)) {
      case 2:
        var n = dh;
        break;
      case 8:
        n = mh;
        break;
      default:
        n = Sf;
    }
    l = n.bind(
      null,
      t,
      l,
      e
    ), n = void 0, !zi || t !== "touchstart" && t !== "touchmove" && t !== "wheel" || (n = !0), a ? n !== void 0 ? e.addEventListener(t, l, {
      capture: !0,
      passive: n
    }) : e.addEventListener(t, l, !0) : n !== void 0 ? e.addEventListener(t, l, {
      passive: n
    }) : e.addEventListener(t, l, !1);
  }
  function cf(e, t, l, a, n) {
    var u = a;
    if ((t & 1) === 0 && (t & 2) === 0 && a !== null)
      e: for (; ; ) {
        if (a === null) return;
        var i = a.tag;
        if (i === 3 || i === 4) {
          var f = a.stateNode.containerInfo;
          if (f === n) break;
          if (i === 4)
            for (i = a.return; i !== null; ) {
              var o = i.tag;
              if ((o === 3 || o === 4) && i.stateNode.containerInfo === n)
                return;
              i = i.return;
            }
          for (; f !== null; ) {
            if (i = ca(f), i === null) return;
            if (o = i.tag, o === 5 || o === 6 || o === 26 || o === 27) {
              a = u = i;
              continue e;
            }
            f = f.parentNode;
          }
        }
        a = a.return;
      }
    es(function() {
      var b = u, j = Ti(l), _ = [];
      e: {
        var x = Ms.get(e);
        if (x !== void 0) {
          var p = nu, X = e;
          switch (e) {
            case "keypress":
              if (lu(l) === 0) break e;
            case "keydown":
            case "keyup":
              p = O0;
              break;
            case "focusin":
              X = "focus", p = Ai;
              break;
            case "focusout":
              X = "blur", p = Ai;
              break;
            case "beforeblur":
            case "afterblur":
              p = Ai;
              break;
            case "click":
              if (l.button === 2) break e;
            case "auxclick":
            case "dblclick":
            case "mousedown":
            case "mousemove":
            case "mouseup":
            case "mouseout":
            case "mouseover":
            case "contextmenu":
              p = as;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              p = x0;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              p = w0;
              break;
            case js:
            case zs:
            case Es:
              p = N0;
              break;
            case _s:
              p = H0;
              break;
            case "scroll":
            case "scrollend":
              p = g0;
              break;
            case "wheel":
              p = q0;
              break;
            case "copy":
            case "cut":
            case "paste":
              p = j0;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              p = us;
              break;
            case "toggle":
            case "beforetoggle":
              p = G0;
          }
          var ee = (t & 4) !== 0, De = !ee && (e === "scroll" || e === "scrollend"), h = ee ? x !== null ? x + "Capture" : null : x;
          ee = [];
          for (var d = b, g; d !== null; ) {
            var E = d;
            if (g = E.stateNode, E = E.tag, E !== 5 && E !== 26 && E !== 27 || g === null || h === null || (E = en(d, h), E != null && ee.push(
              wn(d, E, g)
            )), De) break;
            d = d.return;
          }
          0 < ee.length && (x = new p(
            x,
            X,
            null,
            l,
            j
          ), _.push({ event: x, listeners: ee }));
        }
      }
      if ((t & 7) === 0) {
        e: {
          if (x = e === "mouseover" || e === "pointerover", p = e === "mouseout" || e === "pointerout", x && l !== Ni && (X = l.relatedTarget || l.fromElement) && (ca(X) || X[ia]))
            break e;
          if ((p || x) && (x = j.window === j ? j : (x = j.ownerDocument) ? x.defaultView || x.parentWindow : window, p ? (X = l.relatedTarget || l.toElement, p = b, X = X ? ca(X) : null, X !== null && (De = G(X), ee = X.tag, X !== De || ee !== 5 && ee !== 27 && ee !== 6) && (X = null)) : (p = null, X = b), p !== X)) {
            if (ee = as, E = "onMouseLeave", h = "onMouseEnter", d = "mouse", (e === "pointerout" || e === "pointerover") && (ee = us, E = "onPointerLeave", h = "onPointerEnter", d = "pointer"), De = p == null ? x : Pa(p), g = X == null ? x : Pa(X), x = new ee(
              E,
              d + "leave",
              p,
              l,
              j
            ), x.target = De, x.relatedTarget = g, E = null, ca(j) === b && (ee = new ee(
              h,
              d + "enter",
              X,
              l,
              j
            ), ee.target = g, ee.relatedTarget = De, E = ee), De = E, p && X)
              t: {
                for (ee = Ym, h = p, d = X, g = 0, E = h; E; E = ee(E))
                  g++;
                E = 0;
                for (var F = d; F; F = ee(F))
                  E++;
                for (; 0 < g - E; )
                  h = ee(h), g--;
                for (; 0 < E - g; )
                  d = ee(d), E--;
                for (; g--; ) {
                  if (h === d || d !== null && h === d.alternate) {
                    ee = h;
                    break t;
                  }
                  h = ee(h), d = ee(d);
                }
                ee = null;
              }
            else ee = null;
            p !== null && Fo(
              _,
              x,
              p,
              ee,
              !1
            ), X !== null && De !== null && Fo(
              _,
              De,
              X,
              ee,
              !0
            );
          }
        }
        e: {
          if (x = b ? Pa(b) : window, p = x.nodeName && x.nodeName.toLowerCase(), p === "select" || p === "input" && x.type === "file")
            var Te = ms;
          else if (os(x))
            if (hs)
              Te = $0;
            else {
              Te = k0;
              var Z = J0;
            }
          else
            p = x.nodeName, !p || p.toLowerCase() !== "input" || x.type !== "checkbox" && x.type !== "radio" ? b && Si(b.elementType) && (Te = ms) : Te = W0;
          if (Te && (Te = Te(e, b))) {
            ds(
              _,
              Te,
              l,
              j
            );
            break e;
          }
          Z && Z(e, x, b), e === "focusout" && b && x.type === "number" && b.memoizedProps.value != null && pi(x, "number", x.value);
        }
        switch (Z = b ? Pa(b) : window, e) {
          case "focusin":
            (os(Z) || Z.contentEditable === "true") && (ya = Z, Ri = b, sn = null);
            break;
          case "focusout":
            sn = Ri = ya = null;
            break;
          case "mousedown":
            Hi = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            Hi = !1, Ns(_, l, j);
            break;
          case "selectionchange":
            if (I0) break;
          case "keydown":
          case "keyup":
            Ns(_, l, j);
        }
        var oe;
        if (Oi)
          e: {
            switch (e) {
              case "compositionstart":
                var xe = "onCompositionStart";
                break e;
              case "compositionend":
                xe = "onCompositionEnd";
                break e;
              case "compositionupdate":
                xe = "onCompositionUpdate";
                break e;
            }
            xe = void 0;
          }
        else
          va ? ss(e, l) && (xe = "onCompositionEnd") : e === "keydown" && l.keyCode === 229 && (xe = "onCompositionStart");
        xe && (is && l.locale !== "ko" && (va || xe !== "onCompositionStart" ? xe === "onCompositionEnd" && va && (oe = ts()) : (yl = j, Ei = "value" in yl ? yl.value : yl.textContent, va = !0)), Z = ku(b, xe), 0 < Z.length && (xe = new ns(
          xe,
          e,
          null,
          l,
          j
        ), _.push({ event: xe, listeners: Z }), oe ? xe.data = oe : (oe = rs(l), oe !== null && (xe.data = oe)))), (oe = L0 ? X0(e, l) : V0(e, l)) && (xe = ku(b, "onBeforeInput"), 0 < xe.length && (Z = new ns(
          "onBeforeInput",
          "beforeinput",
          null,
          l,
          j
        ), _.push({
          event: Z,
          listeners: xe
        }), Z.data = oe)), Rm(
          _,
          e,
          b,
          l,
          j
        );
      }
      Wo(_, t);
    });
  }
  function wn(e, t, l) {
    return {
      instance: e,
      listener: t,
      currentTarget: l
    };
  }
  function ku(e, t) {
    for (var l = t + "Capture", a = []; e !== null; ) {
      var n = e, u = n.stateNode;
      if (n = n.tag, n !== 5 && n !== 26 && n !== 27 || u === null || (n = en(e, l), n != null && a.unshift(
        wn(e, n, u)
      ), n = en(e, t), n != null && a.push(
        wn(e, n, u)
      )), e.tag === 3) return a;
      e = e.return;
    }
    return [];
  }
  function Ym(e) {
    if (e === null) return null;
    do
      e = e.return;
    while (e && e.tag !== 5 && e.tag !== 27);
    return e || null;
  }
  function Fo(e, t, l, a, n) {
    for (var u = t._reactName, i = []; l !== null && l !== a; ) {
      var f = l, o = f.alternate, b = f.stateNode;
      if (f = f.tag, o !== null && o === a) break;
      f !== 5 && f !== 26 && f !== 27 || b === null || (o = b, n ? (b = en(l, u), b != null && i.unshift(
        wn(l, b, o)
      )) : n || (b = en(l, u), b != null && i.push(
        wn(l, b, o)
      ))), l = l.return;
    }
    i.length !== 0 && e.push({ event: t, listeners: i });
  }
  var Gm = /\r\n?/g, Qm = /\u0000|\uFFFD/g;
  function Io(e) {
    return (typeof e == "string" ? e : "" + e).replace(Gm, `
`).replace(Qm, "");
  }
  function Po(e, t) {
    return t = Io(t), Io(e) === t;
  }
  function Ue(e, t, l, a, n, u) {
    switch (l) {
      case "children":
        typeof a == "string" ? t === "body" || t === "textarea" && a === "" || da(e, a) : (typeof a == "number" || typeof a == "bigint") && t !== "body" && da(e, "" + a);
        break;
      case "className":
        In(e, "class", a);
        break;
      case "tabIndex":
        In(e, "tabindex", a);
        break;
      case "dir":
      case "role":
      case "viewBox":
      case "width":
      case "height":
        In(e, l, a);
        break;
      case "style":
        If(e, a, u);
        break;
      case "data":
        if (t !== "object") {
          In(e, "data", a);
          break;
        }
      case "src":
      case "href":
        if (a === "" && (t !== "a" || l !== "href")) {
          e.removeAttribute(l);
          break;
        }
        if (a == null || typeof a == "function" || typeof a == "symbol" || typeof a == "boolean") {
          e.removeAttribute(l);
          break;
        }
        a = eu("" + a), e.setAttribute(l, a);
        break;
      case "action":
      case "formAction":
        if (typeof a == "function") {
          e.setAttribute(
            l,
            "javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')"
          );
          break;
        } else
          typeof u == "function" && (l === "formAction" ? (t !== "input" && Ue(e, t, "name", n.name, n, null), Ue(
            e,
            t,
            "formEncType",
            n.formEncType,
            n,
            null
          ), Ue(
            e,
            t,
            "formMethod",
            n.formMethod,
            n,
            null
          ), Ue(
            e,
            t,
            "formTarget",
            n.formTarget,
            n,
            null
          )) : (Ue(e, t, "encType", n.encType, n, null), Ue(e, t, "method", n.method, n, null), Ue(e, t, "target", n.target, n, null)));
        if (a == null || typeof a == "symbol" || typeof a == "boolean") {
          e.removeAttribute(l);
          break;
        }
        a = eu("" + a), e.setAttribute(l, a);
        break;
      case "onClick":
        a != null && (e.onclick = Wt);
        break;
      case "onScroll":
        a != null && ge("scroll", e);
        break;
      case "onScrollEnd":
        a != null && ge("scrollend", e);
        break;
      case "dangerouslySetInnerHTML":
        if (a != null) {
          if (typeof a != "object" || !("__html" in a))
            throw Error(m(61));
          if (l = a.__html, l != null) {
            if (n.children != null) throw Error(m(60));
            e.innerHTML = l;
          }
        }
        break;
      case "multiple":
        e.multiple = a && typeof a != "function" && typeof a != "symbol";
        break;
      case "muted":
        e.muted = a && typeof a != "function" && typeof a != "symbol";
        break;
      case "suppressContentEditableWarning":
      case "suppressHydrationWarning":
      case "defaultValue":
      case "defaultChecked":
      case "innerHTML":
      case "ref":
        break;
      case "autoFocus":
        break;
      case "xlinkHref":
        if (a == null || typeof a == "function" || typeof a == "boolean" || typeof a == "symbol") {
          e.removeAttribute("xlink:href");
          break;
        }
        l = eu("" + a), e.setAttributeNS(
          "http://www.w3.org/1999/xlink",
          "xlink:href",
          l
        );
        break;
      case "contentEditable":
      case "spellCheck":
      case "draggable":
      case "value":
      case "autoReverse":
      case "externalResourcesRequired":
      case "focusable":
      case "preserveAlpha":
        a != null && typeof a != "function" && typeof a != "symbol" ? e.setAttribute(l, "" + a) : e.removeAttribute(l);
        break;
      case "inert":
      case "allowFullScreen":
      case "async":
      case "autoPlay":
      case "controls":
      case "default":
      case "defer":
      case "disabled":
      case "disablePictureInPicture":
      case "disableRemotePlayback":
      case "formNoValidate":
      case "hidden":
      case "loop":
      case "noModule":
      case "noValidate":
      case "open":
      case "playsInline":
      case "readOnly":
      case "required":
      case "reversed":
      case "scoped":
      case "seamless":
      case "itemScope":
        a && typeof a != "function" && typeof a != "symbol" ? e.setAttribute(l, "") : e.removeAttribute(l);
        break;
      case "capture":
      case "download":
        a === !0 ? e.setAttribute(l, "") : a !== !1 && a != null && typeof a != "function" && typeof a != "symbol" ? e.setAttribute(l, a) : e.removeAttribute(l);
        break;
      case "cols":
      case "rows":
      case "size":
      case "span":
        a != null && typeof a != "function" && typeof a != "symbol" && !isNaN(a) && 1 <= a ? e.setAttribute(l, a) : e.removeAttribute(l);
        break;
      case "rowSpan":
      case "start":
        a == null || typeof a == "function" || typeof a == "symbol" || isNaN(a) ? e.removeAttribute(l) : e.setAttribute(l, a);
        break;
      case "popover":
        ge("beforetoggle", e), ge("toggle", e), Fn(e, "popover", a);
        break;
      case "xlinkActuate":
        kt(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:actuate",
          a
        );
        break;
      case "xlinkArcrole":
        kt(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:arcrole",
          a
        );
        break;
      case "xlinkRole":
        kt(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:role",
          a
        );
        break;
      case "xlinkShow":
        kt(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:show",
          a
        );
        break;
      case "xlinkTitle":
        kt(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:title",
          a
        );
        break;
      case "xlinkType":
        kt(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:type",
          a
        );
        break;
      case "xmlBase":
        kt(
          e,
          "http://www.w3.org/XML/1998/namespace",
          "xml:base",
          a
        );
        break;
      case "xmlLang":
        kt(
          e,
          "http://www.w3.org/XML/1998/namespace",
          "xml:lang",
          a
        );
        break;
      case "xmlSpace":
        kt(
          e,
          "http://www.w3.org/XML/1998/namespace",
          "xml:space",
          a
        );
        break;
      case "is":
        Fn(e, "is", a);
        break;
      case "innerText":
      case "textContent":
        break;
      default:
        (!(2 < l.length) || l[0] !== "o" && l[0] !== "O" || l[1] !== "n" && l[1] !== "N") && (l = v0.get(l) || l, Fn(e, l, a));
    }
  }
  function ff(e, t, l, a, n, u) {
    switch (l) {
      case "style":
        If(e, a, u);
        break;
      case "dangerouslySetInnerHTML":
        if (a != null) {
          if (typeof a != "object" || !("__html" in a))
            throw Error(m(61));
          if (l = a.__html, l != null) {
            if (n.children != null) throw Error(m(60));
            e.innerHTML = l;
          }
        }
        break;
      case "children":
        typeof a == "string" ? da(e, a) : (typeof a == "number" || typeof a == "bigint") && da(e, "" + a);
        break;
      case "onScroll":
        a != null && ge("scroll", e);
        break;
      case "onScrollEnd":
        a != null && ge("scrollend", e);
        break;
      case "onClick":
        a != null && (e.onclick = Wt);
        break;
      case "suppressContentEditableWarning":
      case "suppressHydrationWarning":
      case "innerHTML":
      case "ref":
        break;
      case "innerText":
      case "textContent":
        break;
      default:
        if (!Xf.hasOwnProperty(l))
          e: {
            if (l[0] === "o" && l[1] === "n" && (n = l.endsWith("Capture"), t = l.slice(2, n ? l.length - 7 : void 0), u = e[ht] || null, u = u != null ? u[l] : null, typeof u == "function" && e.removeEventListener(t, u, n), typeof a == "function")) {
              typeof u != "function" && u !== null && (l in e ? e[l] = null : e.hasAttribute(l) && e.removeAttribute(l)), e.addEventListener(t, a, n);
              break e;
            }
            l in e ? e[l] = a : a === !0 ? e.setAttribute(l, "") : Fn(e, l, a);
          }
    }
  }
  function ct(e, t, l) {
    switch (t) {
      case "div":
      case "span":
      case "svg":
      case "path":
      case "a":
      case "g":
      case "p":
      case "li":
        break;
      case "img":
        ge("error", e), ge("load", e);
        var a = !1, n = !1, u;
        for (u in l)
          if (l.hasOwnProperty(u)) {
            var i = l[u];
            if (i != null)
              switch (u) {
                case "src":
                  a = !0;
                  break;
                case "srcSet":
                  n = !0;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  throw Error(m(137, t));
                default:
                  Ue(e, t, u, i, l, null);
              }
          }
        n && Ue(e, t, "srcSet", l.srcSet, l, null), a && Ue(e, t, "src", l.src, l, null);
        return;
      case "input":
        ge("invalid", e);
        var f = u = i = n = null, o = null, b = null;
        for (a in l)
          if (l.hasOwnProperty(a)) {
            var j = l[a];
            if (j != null)
              switch (a) {
                case "name":
                  n = j;
                  break;
                case "type":
                  i = j;
                  break;
                case "checked":
                  o = j;
                  break;
                case "defaultChecked":
                  b = j;
                  break;
                case "value":
                  u = j;
                  break;
                case "defaultValue":
                  f = j;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  if (j != null)
                    throw Error(m(137, t));
                  break;
                default:
                  Ue(e, t, a, j, l, null);
              }
          }
        kf(
          e,
          u,
          f,
          o,
          b,
          i,
          n,
          !1
        );
        return;
      case "select":
        ge("invalid", e), a = i = u = null;
        for (n in l)
          if (l.hasOwnProperty(n) && (f = l[n], f != null))
            switch (n) {
              case "value":
                u = f;
                break;
              case "defaultValue":
                i = f;
                break;
              case "multiple":
                a = f;
              default:
                Ue(e, t, n, f, l, null);
            }
        t = u, l = i, e.multiple = !!a, t != null ? oa(e, !!a, t, !1) : l != null && oa(e, !!a, l, !0);
        return;
      case "textarea":
        ge("invalid", e), u = n = a = null;
        for (i in l)
          if (l.hasOwnProperty(i) && (f = l[i], f != null))
            switch (i) {
              case "value":
                a = f;
                break;
              case "defaultValue":
                n = f;
                break;
              case "children":
                u = f;
                break;
              case "dangerouslySetInnerHTML":
                if (f != null) throw Error(m(91));
                break;
              default:
                Ue(e, t, i, f, l, null);
            }
        $f(e, a, n, u);
        return;
      case "option":
        for (o in l)
          if (l.hasOwnProperty(o) && (a = l[o], a != null))
            switch (o) {
              case "selected":
                e.selected = a && typeof a != "function" && typeof a != "symbol";
                break;
              default:
                Ue(e, t, o, a, l, null);
            }
        return;
      case "dialog":
        ge("beforetoggle", e), ge("toggle", e), ge("cancel", e), ge("close", e);
        break;
      case "iframe":
      case "object":
        ge("load", e);
        break;
      case "video":
      case "audio":
        for (a = 0; a < Dn.length; a++)
          ge(Dn[a], e);
        break;
      case "image":
        ge("error", e), ge("load", e);
        break;
      case "details":
        ge("toggle", e);
        break;
      case "embed":
      case "source":
      case "link":
        ge("error", e), ge("load", e);
      case "area":
      case "base":
      case "br":
      case "col":
      case "hr":
      case "keygen":
      case "meta":
      case "param":
      case "track":
      case "wbr":
      case "menuitem":
        for (b in l)
          if (l.hasOwnProperty(b) && (a = l[b], a != null))
            switch (b) {
              case "children":
              case "dangerouslySetInnerHTML":
                throw Error(m(137, t));
              default:
                Ue(e, t, b, a, l, null);
            }
        return;
      default:
        if (Si(t)) {
          for (j in l)
            l.hasOwnProperty(j) && (a = l[j], a !== void 0 && ff(
              e,
              t,
              j,
              a,
              l,
              void 0
            ));
          return;
        }
    }
    for (f in l)
      l.hasOwnProperty(f) && (a = l[f], a != null && Ue(e, t, f, a, l, null));
  }
  function Lm(e, t, l, a) {
    switch (t) {
      case "div":
      case "span":
      case "svg":
      case "path":
      case "a":
      case "g":
      case "p":
      case "li":
        break;
      case "input":
        var n = null, u = null, i = null, f = null, o = null, b = null, j = null;
        for (p in l) {
          var _ = l[p];
          if (l.hasOwnProperty(p) && _ != null)
            switch (p) {
              case "checked":
                break;
              case "value":
                break;
              case "defaultValue":
                o = _;
              default:
                a.hasOwnProperty(p) || Ue(e, t, p, null, a, _);
            }
        }
        for (var x in a) {
          var p = a[x];
          if (_ = l[x], a.hasOwnProperty(x) && (p != null || _ != null))
            switch (x) {
              case "type":
                u = p;
                break;
              case "name":
                n = p;
                break;
              case "checked":
                b = p;
                break;
              case "defaultChecked":
                j = p;
                break;
              case "value":
                i = p;
                break;
              case "defaultValue":
                f = p;
                break;
              case "children":
              case "dangerouslySetInnerHTML":
                if (p != null)
                  throw Error(m(137, t));
                break;
              default:
                p !== _ && Ue(
                  e,
                  t,
                  x,
                  p,
                  a,
                  _
                );
            }
        }
        xi(
          e,
          i,
          f,
          o,
          b,
          j,
          u,
          n
        );
        return;
      case "select":
        p = i = f = x = null;
        for (u in l)
          if (o = l[u], l.hasOwnProperty(u) && o != null)
            switch (u) {
              case "value":
                break;
              case "multiple":
                p = o;
              default:
                a.hasOwnProperty(u) || Ue(
                  e,
                  t,
                  u,
                  null,
                  a,
                  o
                );
            }
        for (n in a)
          if (u = a[n], o = l[n], a.hasOwnProperty(n) && (u != null || o != null))
            switch (n) {
              case "value":
                x = u;
                break;
              case "defaultValue":
                f = u;
                break;
              case "multiple":
                i = u;
              default:
                u !== o && Ue(
                  e,
                  t,
                  n,
                  u,
                  a,
                  o
                );
            }
        t = f, l = i, a = p, x != null ? oa(e, !!l, x, !1) : !!a != !!l && (t != null ? oa(e, !!l, t, !0) : oa(e, !!l, l ? [] : "", !1));
        return;
      case "textarea":
        p = x = null;
        for (f in l)
          if (n = l[f], l.hasOwnProperty(f) && n != null && !a.hasOwnProperty(f))
            switch (f) {
              case "value":
                break;
              case "children":
                break;
              default:
                Ue(e, t, f, null, a, n);
            }
        for (i in a)
          if (n = a[i], u = l[i], a.hasOwnProperty(i) && (n != null || u != null))
            switch (i) {
              case "value":
                x = n;
                break;
              case "defaultValue":
                p = n;
                break;
              case "children":
                break;
              case "dangerouslySetInnerHTML":
                if (n != null) throw Error(m(91));
                break;
              default:
                n !== u && Ue(e, t, i, n, a, u);
            }
        Wf(e, x, p);
        return;
      case "option":
        for (var X in l)
          if (x = l[X], l.hasOwnProperty(X) && x != null && !a.hasOwnProperty(X))
            switch (X) {
              case "selected":
                e.selected = !1;
                break;
              default:
                Ue(
                  e,
                  t,
                  X,
                  null,
                  a,
                  x
                );
            }
        for (o in a)
          if (x = a[o], p = l[o], a.hasOwnProperty(o) && x !== p && (x != null || p != null))
            switch (o) {
              case "selected":
                e.selected = x && typeof x != "function" && typeof x != "symbol";
                break;
              default:
                Ue(
                  e,
                  t,
                  o,
                  x,
                  a,
                  p
                );
            }
        return;
      case "img":
      case "link":
      case "area":
      case "base":
      case "br":
      case "col":
      case "embed":
      case "hr":
      case "keygen":
      case "meta":
      case "param":
      case "source":
      case "track":
      case "wbr":
      case "menuitem":
        for (var ee in l)
          x = l[ee], l.hasOwnProperty(ee) && x != null && !a.hasOwnProperty(ee) && Ue(e, t, ee, null, a, x);
        for (b in a)
          if (x = a[b], p = l[b], a.hasOwnProperty(b) && x !== p && (x != null || p != null))
            switch (b) {
              case "children":
              case "dangerouslySetInnerHTML":
                if (x != null)
                  throw Error(m(137, t));
                break;
              default:
                Ue(
                  e,
                  t,
                  b,
                  x,
                  a,
                  p
                );
            }
        return;
      default:
        if (Si(t)) {
          for (var De in l)
            x = l[De], l.hasOwnProperty(De) && x !== void 0 && !a.hasOwnProperty(De) && ff(
              e,
              t,
              De,
              void 0,
              a,
              x
            );
          for (j in a)
            x = a[j], p = l[j], !a.hasOwnProperty(j) || x === p || x === void 0 && p === void 0 || ff(
              e,
              t,
              j,
              x,
              a,
              p
            );
          return;
        }
    }
    for (var h in l)
      x = l[h], l.hasOwnProperty(h) && x != null && !a.hasOwnProperty(h) && Ue(e, t, h, null, a, x);
    for (_ in a)
      x = a[_], p = l[_], !a.hasOwnProperty(_) || x === p || x == null && p == null || Ue(e, t, _, x, a, p);
  }
  function ed(e) {
    switch (e) {
      case "css":
      case "script":
      case "font":
      case "img":
      case "image":
      case "input":
      case "link":
        return !0;
      default:
        return !1;
    }
  }
  function Xm() {
    if (typeof performance.getEntriesByType == "function") {
      for (var e = 0, t = 0, l = performance.getEntriesByType("resource"), a = 0; a < l.length; a++) {
        var n = l[a], u = n.transferSize, i = n.initiatorType, f = n.duration;
        if (u && f && ed(i)) {
          for (i = 0, f = n.responseEnd, a += 1; a < l.length; a++) {
            var o = l[a], b = o.startTime;
            if (b > f) break;
            var j = o.transferSize, _ = o.initiatorType;
            j && ed(_) && (o = o.responseEnd, i += j * (o < f ? 1 : (f - b) / (o - b)));
          }
          if (--a, t += 8 * (u + i) / (n.duration / 1e3), e++, 10 < e) break;
        }
      }
      if (0 < e) return t / e / 1e6;
    }
    return navigator.connection && (e = navigator.connection.downlink, typeof e == "number") ? e : 5;
  }
  var sf = null, rf = null;
  function Wu(e) {
    return e.nodeType === 9 ? e : e.ownerDocument;
  }
  function td(e) {
    switch (e) {
      case "http://www.w3.org/2000/svg":
        return 1;
      case "http://www.w3.org/1998/Math/MathML":
        return 2;
      default:
        return 0;
    }
  }
  function ld(e, t) {
    if (e === 0)
      switch (t) {
        case "svg":
          return 1;
        case "math":
          return 2;
        default:
          return 0;
      }
    return e === 1 && t === "foreignObject" ? 0 : e;
  }
  function of(e, t) {
    return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.children == "bigint" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
  }
  var df = null;
  function Vm() {
    var e = window.event;
    return e && e.type === "popstate" ? e === df ? !1 : (df = e, !0) : (df = null, !1);
  }
  var ad = typeof setTimeout == "function" ? setTimeout : void 0, Zm = typeof clearTimeout == "function" ? clearTimeout : void 0, nd = typeof Promise == "function" ? Promise : void 0, Km = typeof queueMicrotask == "function" ? queueMicrotask : typeof nd < "u" ? function(e) {
    return nd.resolve(null).then(e).catch(Jm);
  } : ad;
  function Jm(e) {
    setTimeout(function() {
      throw e;
    });
  }
  function Dl(e) {
    return e === "head";
  }
  function ud(e, t) {
    var l = t, a = 0;
    do {
      var n = l.nextSibling;
      if (e.removeChild(l), n && n.nodeType === 8)
        if (l = n.data, l === "/$" || l === "/&") {
          if (a === 0) {
            e.removeChild(n), Xa(t);
            return;
          }
          a--;
        } else if (l === "$" || l === "$?" || l === "$~" || l === "$!" || l === "&")
          a++;
        else if (l === "html")
          Rn(e.ownerDocument.documentElement);
        else if (l === "head") {
          l = e.ownerDocument.head, Rn(l);
          for (var u = l.firstChild; u; ) {
            var i = u.nextSibling, f = u.nodeName;
            u[Ia] || f === "SCRIPT" || f === "STYLE" || f === "LINK" && u.rel.toLowerCase() === "stylesheet" || l.removeChild(u), u = i;
          }
        } else
          l === "body" && Rn(e.ownerDocument.body);
      l = n;
    } while (l);
    Xa(t);
  }
  function id(e, t) {
    var l = e;
    e = 0;
    do {
      var a = l.nextSibling;
      if (l.nodeType === 1 ? t ? (l._stashedDisplay = l.style.display, l.style.display = "none") : (l.style.display = l._stashedDisplay || "", l.getAttribute("style") === "" && l.removeAttribute("style")) : l.nodeType === 3 && (t ? (l._stashedText = l.nodeValue, l.nodeValue = "") : l.nodeValue = l._stashedText || ""), a && a.nodeType === 8)
        if (l = a.data, l === "/$") {
          if (e === 0) break;
          e--;
        } else
          l !== "$" && l !== "$?" && l !== "$~" && l !== "$!" || e++;
      l = a;
    } while (l);
  }
  function mf(e) {
    var t = e.firstChild;
    for (t && t.nodeType === 10 && (t = t.nextSibling); t; ) {
      var l = t;
      switch (t = t.nextSibling, l.nodeName) {
        case "HTML":
        case "HEAD":
        case "BODY":
          mf(l), gi(l);
          continue;
        case "SCRIPT":
        case "STYLE":
          continue;
        case "LINK":
          if (l.rel.toLowerCase() === "stylesheet") continue;
      }
      e.removeChild(l);
    }
  }
  function km(e, t, l, a) {
    for (; e.nodeType === 1; ) {
      var n = l;
      if (e.nodeName.toLowerCase() !== t.toLowerCase()) {
        if (!a && (e.nodeName !== "INPUT" || e.type !== "hidden"))
          break;
      } else if (a) {
        if (!e[Ia])
          switch (t) {
            case "meta":
              if (!e.hasAttribute("itemprop")) break;
              return e;
            case "link":
              if (u = e.getAttribute("rel"), u === "stylesheet" && e.hasAttribute("data-precedence"))
                break;
              if (u !== n.rel || e.getAttribute("href") !== (n.href == null || n.href === "" ? null : n.href) || e.getAttribute("crossorigin") !== (n.crossOrigin == null ? null : n.crossOrigin) || e.getAttribute("title") !== (n.title == null ? null : n.title))
                break;
              return e;
            case "style":
              if (e.hasAttribute("data-precedence")) break;
              return e;
            case "script":
              if (u = e.getAttribute("src"), (u !== (n.src == null ? null : n.src) || e.getAttribute("type") !== (n.type == null ? null : n.type) || e.getAttribute("crossorigin") !== (n.crossOrigin == null ? null : n.crossOrigin)) && u && e.hasAttribute("async") && !e.hasAttribute("itemprop"))
                break;
              return e;
            default:
              return e;
          }
      } else if (t === "input" && e.type === "hidden") {
        var u = n.name == null ? null : "" + n.name;
        if (n.type === "hidden" && e.getAttribute("name") === u)
          return e;
      } else return e;
      if (e = Yt(e.nextSibling), e === null) break;
    }
    return null;
  }
  function Wm(e, t, l) {
    if (t === "") return null;
    for (; e.nodeType !== 3; )
      if ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !l || (e = Yt(e.nextSibling), e === null)) return null;
    return e;
  }
  function cd(e, t) {
    for (; e.nodeType !== 8; )
      if ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !t || (e = Yt(e.nextSibling), e === null)) return null;
    return e;
  }
  function hf(e) {
    return e.data === "$?" || e.data === "$~";
  }
  function vf(e) {
    return e.data === "$!" || e.data === "$?" && e.ownerDocument.readyState !== "loading";
  }
  function $m(e, t) {
    var l = e.ownerDocument;
    if (e.data === "$~") e._reactRetry = t;
    else if (e.data !== "$?" || l.readyState !== "loading")
      t();
    else {
      var a = function() {
        t(), l.removeEventListener("DOMContentLoaded", a);
      };
      l.addEventListener("DOMContentLoaded", a), e._reactRetry = a;
    }
  }
  function Yt(e) {
    for (; e != null; e = e.nextSibling) {
      var t = e.nodeType;
      if (t === 1 || t === 3) break;
      if (t === 8) {
        if (t = e.data, t === "$" || t === "$!" || t === "$?" || t === "$~" || t === "&" || t === "F!" || t === "F")
          break;
        if (t === "/$" || t === "/&") return null;
      }
    }
    return e;
  }
  var yf = null;
  function fd(e) {
    e = e.nextSibling;
    for (var t = 0; e; ) {
      if (e.nodeType === 8) {
        var l = e.data;
        if (l === "/$" || l === "/&") {
          if (t === 0)
            return Yt(e.nextSibling);
          t--;
        } else
          l !== "$" && l !== "$!" && l !== "$?" && l !== "$~" && l !== "&" || t++;
      }
      e = e.nextSibling;
    }
    return null;
  }
  function sd(e) {
    e = e.previousSibling;
    for (var t = 0; e; ) {
      if (e.nodeType === 8) {
        var l = e.data;
        if (l === "$" || l === "$!" || l === "$?" || l === "$~" || l === "&") {
          if (t === 0) return e;
          t--;
        } else l !== "/$" && l !== "/&" || t++;
      }
      e = e.previousSibling;
    }
    return null;
  }
  function rd(e, t, l) {
    switch (t = Wu(l), e) {
      case "html":
        if (e = t.documentElement, !e) throw Error(m(452));
        return e;
      case "head":
        if (e = t.head, !e) throw Error(m(453));
        return e;
      case "body":
        if (e = t.body, !e) throw Error(m(454));
        return e;
      default:
        throw Error(m(451));
    }
  }
  function Rn(e) {
    for (var t = e.attributes; t.length; )
      e.removeAttributeNode(t[0]);
    gi(e);
  }
  var Gt = /* @__PURE__ */ new Map(), od = /* @__PURE__ */ new Set();
  function $u(e) {
    return typeof e.getRootNode == "function" ? e.getRootNode() : e.nodeType === 9 ? e : e.ownerDocument;
  }
  var ol = R.d;
  R.d = {
    f: Fm,
    r: Im,
    D: Pm,
    C: eh,
    L: th,
    m: lh,
    X: nh,
    S: ah,
    M: uh
  };
  function Fm() {
    var e = ol.f(), t = Qu();
    return e || t;
  }
  function Im(e) {
    var t = fa(e);
    t !== null && t.tag === 5 && t.type === "form" ? _r(t) : ol.r(e);
  }
  var Ga = typeof document > "u" ? null : document;
  function dd(e, t, l) {
    var a = Ga;
    if (a && typeof t == "string" && t) {
      var n = Ut(t);
      n = 'link[rel="' + e + '"][href="' + n + '"]', typeof l == "string" && (n += '[crossorigin="' + l + '"]'), od.has(n) || (od.add(n), e = { rel: e, crossOrigin: l, href: t }, a.querySelector(n) === null && (t = a.createElement("link"), ct(t, "link", e), et(t), a.head.appendChild(t)));
    }
  }
  function Pm(e) {
    ol.D(e), dd("dns-prefetch", e, null);
  }
  function eh(e, t) {
    ol.C(e, t), dd("preconnect", e, t);
  }
  function th(e, t, l) {
    ol.L(e, t, l);
    var a = Ga;
    if (a && e && t) {
      var n = 'link[rel="preload"][as="' + Ut(t) + '"]';
      t === "image" && l && l.imageSrcSet ? (n += '[imagesrcset="' + Ut(
        l.imageSrcSet
      ) + '"]', typeof l.imageSizes == "string" && (n += '[imagesizes="' + Ut(
        l.imageSizes
      ) + '"]')) : n += '[href="' + Ut(e) + '"]';
      var u = n;
      switch (t) {
        case "style":
          u = Qa(e);
          break;
        case "script":
          u = La(e);
      }
      Gt.has(u) || (e = B(
        {
          rel: "preload",
          href: t === "image" && l && l.imageSrcSet ? void 0 : e,
          as: t
        },
        l
      ), Gt.set(u, e), a.querySelector(n) !== null || t === "style" && a.querySelector(Hn(u)) || t === "script" && a.querySelector(Bn(u)) || (t = a.createElement("link"), ct(t, "link", e), et(t), a.head.appendChild(t)));
    }
  }
  function lh(e, t) {
    ol.m(e, t);
    var l = Ga;
    if (l && e) {
      var a = t && typeof t.as == "string" ? t.as : "script", n = 'link[rel="modulepreload"][as="' + Ut(a) + '"][href="' + Ut(e) + '"]', u = n;
      switch (a) {
        case "audioworklet":
        case "paintworklet":
        case "serviceworker":
        case "sharedworker":
        case "worker":
        case "script":
          u = La(e);
      }
      if (!Gt.has(u) && (e = B({ rel: "modulepreload", href: e }, t), Gt.set(u, e), l.querySelector(n) === null)) {
        switch (a) {
          case "audioworklet":
          case "paintworklet":
          case "serviceworker":
          case "sharedworker":
          case "worker":
          case "script":
            if (l.querySelector(Bn(u)))
              return;
        }
        a = l.createElement("link"), ct(a, "link", e), et(a), l.head.appendChild(a);
      }
    }
  }
  function ah(e, t, l) {
    ol.S(e, t, l);
    var a = Ga;
    if (a && e) {
      var n = sa(a).hoistableStyles, u = Qa(e);
      t = t || "default";
      var i = n.get(u);
      if (!i) {
        var f = { loading: 0, preload: null };
        if (i = a.querySelector(
          Hn(u)
        ))
          f.loading = 5;
        else {
          e = B(
            { rel: "stylesheet", href: e, "data-precedence": t },
            l
          ), (l = Gt.get(u)) && gf(e, l);
          var o = i = a.createElement("link");
          et(o), ct(o, "link", e), o._p = new Promise(function(b, j) {
            o.onload = b, o.onerror = j;
          }), o.addEventListener("load", function() {
            f.loading |= 1;
          }), o.addEventListener("error", function() {
            f.loading |= 2;
          }), f.loading |= 4, Fu(i, t, a);
        }
        i = {
          type: "stylesheet",
          instance: i,
          count: 1,
          state: f
        }, n.set(u, i);
      }
    }
  }
  function nh(e, t) {
    ol.X(e, t);
    var l = Ga;
    if (l && e) {
      var a = sa(l).hoistableScripts, n = La(e), u = a.get(n);
      u || (u = l.querySelector(Bn(n)), u || (e = B({ src: e, async: !0 }, t), (t = Gt.get(n)) && bf(e, t), u = l.createElement("script"), et(u), ct(u, "link", e), l.head.appendChild(u)), u = {
        type: "script",
        instance: u,
        count: 1,
        state: null
      }, a.set(n, u));
    }
  }
  function uh(e, t) {
    ol.M(e, t);
    var l = Ga;
    if (l && e) {
      var a = sa(l).hoistableScripts, n = La(e), u = a.get(n);
      u || (u = l.querySelector(Bn(n)), u || (e = B({ src: e, async: !0, type: "module" }, t), (t = Gt.get(n)) && bf(e, t), u = l.createElement("script"), et(u), ct(u, "link", e), l.head.appendChild(u)), u = {
        type: "script",
        instance: u,
        count: 1,
        state: null
      }, a.set(n, u));
    }
  }
  function md(e, t, l, a) {
    var n = (n = q.current) ? $u(n) : null;
    if (!n) throw Error(m(446));
    switch (e) {
      case "meta":
      case "title":
        return null;
      case "style":
        return typeof l.precedence == "string" && typeof l.href == "string" ? (t = Qa(l.href), l = sa(
          n
        ).hoistableStyles, a = l.get(t), a || (a = {
          type: "style",
          instance: null,
          count: 0,
          state: null
        }, l.set(t, a)), a) : { type: "void", instance: null, count: 0, state: null };
      case "link":
        if (l.rel === "stylesheet" && typeof l.href == "string" && typeof l.precedence == "string") {
          e = Qa(l.href);
          var u = sa(
            n
          ).hoistableStyles, i = u.get(e);
          if (i || (n = n.ownerDocument || n, i = {
            type: "stylesheet",
            instance: null,
            count: 0,
            state: { loading: 0, preload: null }
          }, u.set(e, i), (u = n.querySelector(
            Hn(e)
          )) && !u._p && (i.instance = u, i.state.loading = 5), Gt.has(e) || (l = {
            rel: "preload",
            as: "style",
            href: l.href,
            crossOrigin: l.crossOrigin,
            integrity: l.integrity,
            media: l.media,
            hrefLang: l.hrefLang,
            referrerPolicy: l.referrerPolicy
          }, Gt.set(e, l), u || ih(
            n,
            e,
            l,
            i.state
          ))), t && a === null)
            throw Error(m(528, ""));
          return i;
        }
        if (t && a !== null)
          throw Error(m(529, ""));
        return null;
      case "script":
        return t = l.async, l = l.src, typeof l == "string" && t && typeof t != "function" && typeof t != "symbol" ? (t = La(l), l = sa(
          n
        ).hoistableScripts, a = l.get(t), a || (a = {
          type: "script",
          instance: null,
          count: 0,
          state: null
        }, l.set(t, a)), a) : { type: "void", instance: null, count: 0, state: null };
      default:
        throw Error(m(444, e));
    }
  }
  function Qa(e) {
    return 'href="' + Ut(e) + '"';
  }
  function Hn(e) {
    return 'link[rel="stylesheet"][' + e + "]";
  }
  function hd(e) {
    return B({}, e, {
      "data-precedence": e.precedence,
      precedence: null
    });
  }
  function ih(e, t, l, a) {
    e.querySelector('link[rel="preload"][as="style"][' + t + "]") ? a.loading = 1 : (t = e.createElement("link"), a.preload = t, t.addEventListener("load", function() {
      return a.loading |= 1;
    }), t.addEventListener("error", function() {
      return a.loading |= 2;
    }), ct(t, "link", l), et(t), e.head.appendChild(t));
  }
  function La(e) {
    return '[src="' + Ut(e) + '"]';
  }
  function Bn(e) {
    return "script[async]" + e;
  }
  function vd(e, t, l) {
    if (t.count++, t.instance === null)
      switch (t.type) {
        case "style":
          var a = e.querySelector(
            'style[data-href~="' + Ut(l.href) + '"]'
          );
          if (a)
            return t.instance = a, et(a), a;
          var n = B({}, l, {
            "data-href": l.href,
            "data-precedence": l.precedence,
            href: null,
            precedence: null
          });
          return a = (e.ownerDocument || e).createElement(
            "style"
          ), et(a), ct(a, "style", n), Fu(a, l.precedence, e), t.instance = a;
        case "stylesheet":
          n = Qa(l.href);
          var u = e.querySelector(
            Hn(n)
          );
          if (u)
            return t.state.loading |= 4, t.instance = u, et(u), u;
          a = hd(l), (n = Gt.get(n)) && gf(a, n), u = (e.ownerDocument || e).createElement("link"), et(u);
          var i = u;
          return i._p = new Promise(function(f, o) {
            i.onload = f, i.onerror = o;
          }), ct(u, "link", a), t.state.loading |= 4, Fu(u, l.precedence, e), t.instance = u;
        case "script":
          return u = La(l.src), (n = e.querySelector(
            Bn(u)
          )) ? (t.instance = n, et(n), n) : (a = l, (n = Gt.get(u)) && (a = B({}, l), bf(a, n)), e = e.ownerDocument || e, n = e.createElement("script"), et(n), ct(n, "link", a), e.head.appendChild(n), t.instance = n);
        case "void":
          return null;
        default:
          throw Error(m(443, t.type));
      }
    else
      t.type === "stylesheet" && (t.state.loading & 4) === 0 && (a = t.instance, t.state.loading |= 4, Fu(a, l.precedence, e));
    return t.instance;
  }
  function Fu(e, t, l) {
    for (var a = l.querySelectorAll(
      'link[rel="stylesheet"][data-precedence],style[data-precedence]'
    ), n = a.length ? a[a.length - 1] : null, u = n, i = 0; i < a.length; i++) {
      var f = a[i];
      if (f.dataset.precedence === t) u = f;
      else if (u !== n) break;
    }
    u ? u.parentNode.insertBefore(e, u.nextSibling) : (t = l.nodeType === 9 ? l.head : l, t.insertBefore(e, t.firstChild));
  }
  function gf(e, t) {
    e.crossOrigin == null && (e.crossOrigin = t.crossOrigin), e.referrerPolicy == null && (e.referrerPolicy = t.referrerPolicy), e.title == null && (e.title = t.title);
  }
  function bf(e, t) {
    e.crossOrigin == null && (e.crossOrigin = t.crossOrigin), e.referrerPolicy == null && (e.referrerPolicy = t.referrerPolicy), e.integrity == null && (e.integrity = t.integrity);
  }
  var Iu = null;
  function yd(e, t, l) {
    if (Iu === null) {
      var a = /* @__PURE__ */ new Map(), n = Iu = /* @__PURE__ */ new Map();
      n.set(l, a);
    } else
      n = Iu, a = n.get(l), a || (a = /* @__PURE__ */ new Map(), n.set(l, a));
    if (a.has(e)) return a;
    for (a.set(e, null), l = l.getElementsByTagName(e), n = 0; n < l.length; n++) {
      var u = l[n];
      if (!(u[Ia] || u[at] || e === "link" && u.getAttribute("rel") === "stylesheet") && u.namespaceURI !== "http://www.w3.org/2000/svg") {
        var i = u.getAttribute(t) || "";
        i = e + i;
        var f = a.get(i);
        f ? f.push(u) : a.set(i, [u]);
      }
    }
    return a;
  }
  function gd(e, t, l) {
    e = e.ownerDocument || e, e.head.insertBefore(
      l,
      t === "title" ? e.querySelector("head > title") : null
    );
  }
  function ch(e, t, l) {
    if (l === 1 || t.itemProp != null) return !1;
    switch (e) {
      case "meta":
      case "title":
        return !0;
      case "style":
        if (typeof t.precedence != "string" || typeof t.href != "string" || t.href === "")
          break;
        return !0;
      case "link":
        if (typeof t.rel != "string" || typeof t.href != "string" || t.href === "" || t.onLoad || t.onError)
          break;
        switch (t.rel) {
          case "stylesheet":
            return e = t.disabled, typeof t.precedence == "string" && e == null;
          default:
            return !0;
        }
      case "script":
        if (t.async && typeof t.async != "function" && typeof t.async != "symbol" && !t.onLoad && !t.onError && t.src && typeof t.src == "string")
          return !0;
    }
    return !1;
  }
  function bd(e) {
    return !(e.type === "stylesheet" && (e.state.loading & 3) === 0);
  }
  function fh(e, t, l, a) {
    if (l.type === "stylesheet" && (typeof a.media != "string" || matchMedia(a.media).matches !== !1) && (l.state.loading & 4) === 0) {
      if (l.instance === null) {
        var n = Qa(a.href), u = t.querySelector(
          Hn(n)
        );
        if (u) {
          t = u._p, t !== null && typeof t == "object" && typeof t.then == "function" && (e.count++, e = Pu.bind(e), t.then(e, e)), l.state.loading |= 4, l.instance = u, et(u);
          return;
        }
        u = t.ownerDocument || t, a = hd(a), (n = Gt.get(n)) && gf(a, n), u = u.createElement("link"), et(u);
        var i = u;
        i._p = new Promise(function(f, o) {
          i.onload = f, i.onerror = o;
        }), ct(u, "link", a), l.instance = u;
      }
      e.stylesheets === null && (e.stylesheets = /* @__PURE__ */ new Map()), e.stylesheets.set(l, t), (t = l.state.preload) && (l.state.loading & 3) === 0 && (e.count++, l = Pu.bind(e), t.addEventListener("load", l), t.addEventListener("error", l));
    }
  }
  var xf = 0;
  function sh(e, t) {
    return e.stylesheets && e.count === 0 && ti(e, e.stylesheets), 0 < e.count || 0 < e.imgCount ? function(l) {
      var a = setTimeout(function() {
        if (e.stylesheets && ti(e, e.stylesheets), e.unsuspend) {
          var u = e.unsuspend;
          e.unsuspend = null, u();
        }
      }, 6e4 + t);
      0 < e.imgBytes && xf === 0 && (xf = 62500 * Xm());
      var n = setTimeout(
        function() {
          if (e.waitingForImages = !1, e.count === 0 && (e.stylesheets && ti(e, e.stylesheets), e.unsuspend)) {
            var u = e.unsuspend;
            e.unsuspend = null, u();
          }
        },
        (e.imgBytes > xf ? 50 : 800) + t
      );
      return e.unsuspend = l, function() {
        e.unsuspend = null, clearTimeout(a), clearTimeout(n);
      };
    } : null;
  }
  function Pu() {
    if (this.count--, this.count === 0 && (this.imgCount === 0 || !this.waitingForImages)) {
      if (this.stylesheets) ti(this, this.stylesheets);
      else if (this.unsuspend) {
        var e = this.unsuspend;
        this.unsuspend = null, e();
      }
    }
  }
  var ei = null;
  function ti(e, t) {
    e.stylesheets = null, e.unsuspend !== null && (e.count++, ei = /* @__PURE__ */ new Map(), t.forEach(rh, e), ei = null, Pu.call(e));
  }
  function rh(e, t) {
    if (!(t.state.loading & 4)) {
      var l = ei.get(e);
      if (l) var a = l.get(null);
      else {
        l = /* @__PURE__ */ new Map(), ei.set(e, l);
        for (var n = e.querySelectorAll(
          "link[data-precedence],style[data-precedence]"
        ), u = 0; u < n.length; u++) {
          var i = n[u];
          (i.nodeName === "LINK" || i.getAttribute("media") !== "not all") && (l.set(i.dataset.precedence, i), a = i);
        }
        a && l.set(null, a);
      }
      n = t.instance, i = n.getAttribute("data-precedence"), u = l.get(i) || a, u === a && l.set(null, n), l.set(i, n), this.count++, a = Pu.bind(this), n.addEventListener("load", a), n.addEventListener("error", a), u ? u.parentNode.insertBefore(n, u.nextSibling) : (e = e.nodeType === 9 ? e.head : e, e.insertBefore(n, e.firstChild)), t.state.loading |= 4;
    }
  }
  var qn = {
    $$typeof: ce,
    Provider: null,
    Consumer: null,
    _currentValue: I,
    _currentValue2: I,
    _threadCount: 0
  };
  function oh(e, t, l, a, n, u, i, f, o) {
    this.tag = 1, this.containerInfo = e, this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null, this.callbackPriority = 0, this.expirationTimes = mi(-1), this.entangledLanes = this.shellSuspendCounter = this.errorRecoveryDisabledLanes = this.expiredLanes = this.warmLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = mi(0), this.hiddenUpdates = mi(null), this.identifierPrefix = a, this.onUncaughtError = n, this.onCaughtError = u, this.onRecoverableError = i, this.pooledCache = null, this.pooledCacheLanes = 0, this.formState = o, this.incompleteTransitions = /* @__PURE__ */ new Map();
  }
  function xd(e, t, l, a, n, u, i, f, o, b, j, _) {
    return e = new oh(
      e,
      t,
      l,
      i,
      o,
      b,
      j,
      _,
      f
    ), t = 1, u === !0 && (t |= 24), u = zt(3, null, null, t), e.current = u, u.stateNode = e, t = Fi(), t.refCount++, e.pooledCache = t, t.refCount++, u.memoizedState = {
      element: a,
      isDehydrated: l,
      cache: t
    }, tc(u), e;
  }
  function pd(e) {
    return e ? (e = xa, e) : xa;
  }
  function Sd(e, t, l, a, n, u) {
    n = pd(n), a.context === null ? a.context = n : a.pendingContext = n, a = Nl(t), a.payload = { element: l }, u = u === void 0 ? null : u, u !== null && (a.callback = u), l = Tl(e, a, t), l !== null && (pt(l, e, t), yn(l, e, t));
  }
  function Nd(e, t) {
    if (e = e.memoizedState, e !== null && e.dehydrated !== null) {
      var l = e.retryLane;
      e.retryLane = l !== 0 && l < t ? l : t;
    }
  }
  function pf(e, t) {
    Nd(e, t), (e = e.alternate) && Nd(e, t);
  }
  function Td(e) {
    if (e.tag === 13 || e.tag === 31) {
      var t = Kl(e, 67108864);
      t !== null && pt(t, e, 67108864), pf(e, 67108864);
    }
  }
  function jd(e) {
    if (e.tag === 13 || e.tag === 31) {
      var t = Ct();
      t = hi(t);
      var l = Kl(e, t);
      l !== null && pt(l, e, t), pf(e, t);
    }
  }
  var li = !0;
  function dh(e, t, l, a) {
    var n = S.T;
    S.T = null;
    var u = R.p;
    try {
      R.p = 2, Sf(e, t, l, a);
    } finally {
      R.p = u, S.T = n;
    }
  }
  function mh(e, t, l, a) {
    var n = S.T;
    S.T = null;
    var u = R.p;
    try {
      R.p = 8, Sf(e, t, l, a);
    } finally {
      R.p = u, S.T = n;
    }
  }
  function Sf(e, t, l, a) {
    if (li) {
      var n = Nf(a);
      if (n === null)
        cf(
          e,
          t,
          a,
          ai,
          l
        ), Ed(e, a);
      else if (vh(
        n,
        e,
        t,
        l,
        a
      ))
        a.stopPropagation();
      else if (Ed(e, a), t & 4 && -1 < hh.indexOf(e)) {
        for (; n !== null; ) {
          var u = fa(n);
          if (u !== null)
            switch (u.tag) {
              case 3:
                if (u = u.stateNode, u.current.memoizedState.isDehydrated) {
                  var i = Ql(u.pendingLanes);
                  if (i !== 0) {
                    var f = u;
                    for (f.pendingLanes |= 2, f.entangledLanes |= 2; i; ) {
                      var o = 1 << 31 - Tt(i);
                      f.entanglements[1] |= o, i &= ~o;
                    }
                    Jt(u), (ze & 6) === 0 && (Yu = st() + 500, Un(0));
                  }
                }
                break;
              case 31:
              case 13:
                f = Kl(u, 2), f !== null && pt(f, u, 2), Qu(), pf(u, 2);
            }
          if (u = Nf(a), u === null && cf(
            e,
            t,
            a,
            ai,
            l
          ), u === n) break;
          n = u;
        }
        n !== null && a.stopPropagation();
      } else
        cf(
          e,
          t,
          a,
          null,
          l
        );
    }
  }
  function Nf(e) {
    return e = Ti(e), Tf(e);
  }
  var ai = null;
  function Tf(e) {
    if (ai = null, e = ca(e), e !== null) {
      var t = G(e);
      if (t === null) e = null;
      else {
        var l = t.tag;
        if (l === 13) {
          if (e = le(t), e !== null) return e;
          e = null;
        } else if (l === 31) {
          if (e = L(t), e !== null) return e;
          e = null;
        } else if (l === 3) {
          if (t.stateNode.current.memoizedState.isDehydrated)
            return t.tag === 3 ? t.stateNode.containerInfo : null;
          e = null;
        } else t !== e && (e = null);
      }
    }
    return ai = e, null;
  }
  function zd(e) {
    switch (e) {
      case "beforetoggle":
      case "cancel":
      case "click":
      case "close":
      case "contextmenu":
      case "copy":
      case "cut":
      case "auxclick":
      case "dblclick":
      case "dragend":
      case "dragstart":
      case "drop":
      case "focusin":
      case "focusout":
      case "input":
      case "invalid":
      case "keydown":
      case "keypress":
      case "keyup":
      case "mousedown":
      case "mouseup":
      case "paste":
      case "pause":
      case "play":
      case "pointercancel":
      case "pointerdown":
      case "pointerup":
      case "ratechange":
      case "reset":
      case "resize":
      case "seeked":
      case "submit":
      case "toggle":
      case "touchcancel":
      case "touchend":
      case "touchstart":
      case "volumechange":
      case "change":
      case "selectionchange":
      case "textInput":
      case "compositionstart":
      case "compositionend":
      case "compositionupdate":
      case "beforeblur":
      case "afterblur":
      case "beforeinput":
      case "blur":
      case "fullscreenchange":
      case "focus":
      case "hashchange":
      case "popstate":
      case "select":
      case "selectstart":
        return 2;
      case "drag":
      case "dragenter":
      case "dragexit":
      case "dragleave":
      case "dragover":
      case "mousemove":
      case "mouseout":
      case "mouseover":
      case "pointermove":
      case "pointerout":
      case "pointerover":
      case "scroll":
      case "touchmove":
      case "wheel":
      case "mouseenter":
      case "mouseleave":
      case "pointerenter":
      case "pointerleave":
        return 8;
      case "message":
        switch (oi()) {
          case Ja:
            return 2;
          case Zn:
            return 8;
          case ua:
          case Kn:
            return 32;
          case ka:
            return 268435456;
          default:
            return 32;
        }
      default:
        return 32;
    }
  }
  var jf = !1, wl = null, Rl = null, Hl = null, Yn = /* @__PURE__ */ new Map(), Gn = /* @__PURE__ */ new Map(), Bl = [], hh = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(
    " "
  );
  function Ed(e, t) {
    switch (e) {
      case "focusin":
      case "focusout":
        wl = null;
        break;
      case "dragenter":
      case "dragleave":
        Rl = null;
        break;
      case "mouseover":
      case "mouseout":
        Hl = null;
        break;
      case "pointerover":
      case "pointerout":
        Yn.delete(t.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        Gn.delete(t.pointerId);
    }
  }
  function Qn(e, t, l, a, n, u) {
    return e === null || e.nativeEvent !== u ? (e = {
      blockedOn: t,
      domEventName: l,
      eventSystemFlags: a,
      nativeEvent: u,
      targetContainers: [n]
    }, t !== null && (t = fa(t), t !== null && Td(t)), e) : (e.eventSystemFlags |= a, t = e.targetContainers, n !== null && t.indexOf(n) === -1 && t.push(n), e);
  }
  function vh(e, t, l, a, n) {
    switch (t) {
      case "focusin":
        return wl = Qn(
          wl,
          e,
          t,
          l,
          a,
          n
        ), !0;
      case "dragenter":
        return Rl = Qn(
          Rl,
          e,
          t,
          l,
          a,
          n
        ), !0;
      case "mouseover":
        return Hl = Qn(
          Hl,
          e,
          t,
          l,
          a,
          n
        ), !0;
      case "pointerover":
        var u = n.pointerId;
        return Yn.set(
          u,
          Qn(
            Yn.get(u) || null,
            e,
            t,
            l,
            a,
            n
          )
        ), !0;
      case "gotpointercapture":
        return u = n.pointerId, Gn.set(
          u,
          Qn(
            Gn.get(u) || null,
            e,
            t,
            l,
            a,
            n
          )
        ), !0;
    }
    return !1;
  }
  function _d(e) {
    var t = ca(e.target);
    if (t !== null) {
      var l = G(t);
      if (l !== null) {
        if (t = l.tag, t === 13) {
          if (t = le(l), t !== null) {
            e.blockedOn = t, Gf(e.priority, function() {
              jd(l);
            });
            return;
          }
        } else if (t === 31) {
          if (t = L(l), t !== null) {
            e.blockedOn = t, Gf(e.priority, function() {
              jd(l);
            });
            return;
          }
        } else if (t === 3 && l.stateNode.current.memoizedState.isDehydrated) {
          e.blockedOn = l.tag === 3 ? l.stateNode.containerInfo : null;
          return;
        }
      }
    }
    e.blockedOn = null;
  }
  function ni(e) {
    if (e.blockedOn !== null) return !1;
    for (var t = e.targetContainers; 0 < t.length; ) {
      var l = Nf(e.nativeEvent);
      if (l === null) {
        l = e.nativeEvent;
        var a = new l.constructor(
          l.type,
          l
        );
        Ni = a, l.target.dispatchEvent(a), Ni = null;
      } else
        return t = fa(l), t !== null && Td(t), e.blockedOn = l, !1;
      t.shift();
    }
    return !0;
  }
  function Md(e, t, l) {
    ni(e) && l.delete(t);
  }
  function yh() {
    jf = !1, wl !== null && ni(wl) && (wl = null), Rl !== null && ni(Rl) && (Rl = null), Hl !== null && ni(Hl) && (Hl = null), Yn.forEach(Md), Gn.forEach(Md);
  }
  function ui(e, t) {
    e.blockedOn === t && (e.blockedOn = null, jf || (jf = !0, r.unstable_scheduleCallback(
      r.unstable_NormalPriority,
      yh
    )));
  }
  var ii = null;
  function Ad(e) {
    ii !== e && (ii = e, r.unstable_scheduleCallback(
      r.unstable_NormalPriority,
      function() {
        ii === e && (ii = null);
        for (var t = 0; t < e.length; t += 3) {
          var l = e[t], a = e[t + 1], n = e[t + 2];
          if (typeof a != "function") {
            if (Tf(a || l) === null)
              continue;
            break;
          }
          var u = fa(l);
          u !== null && (e.splice(t, 3), t -= 3, Sc(
            u,
            {
              pending: !0,
              data: n,
              method: l.method,
              action: a
            },
            a,
            n
          ));
        }
      }
    ));
  }
  function Xa(e) {
    function t(o) {
      return ui(o, e);
    }
    wl !== null && ui(wl, e), Rl !== null && ui(Rl, e), Hl !== null && ui(Hl, e), Yn.forEach(t), Gn.forEach(t);
    for (var l = 0; l < Bl.length; l++) {
      var a = Bl[l];
      a.blockedOn === e && (a.blockedOn = null);
    }
    for (; 0 < Bl.length && (l = Bl[0], l.blockedOn === null); )
      _d(l), l.blockedOn === null && Bl.shift();
    if (l = (e.ownerDocument || e).$$reactFormReplay, l != null)
      for (a = 0; a < l.length; a += 3) {
        var n = l[a], u = l[a + 1], i = n[ht] || null;
        if (typeof u == "function")
          i || Ad(l);
        else if (i) {
          var f = null;
          if (u && u.hasAttribute("formAction")) {
            if (n = u, i = u[ht] || null)
              f = i.formAction;
            else if (Tf(n) !== null) continue;
          } else f = i.action;
          typeof f == "function" ? l[a + 1] = f : (l.splice(a, 3), a -= 3), Ad(l);
        }
      }
  }
  function Cd() {
    function e(u) {
      u.canIntercept && u.info === "react-transition" && u.intercept({
        handler: function() {
          return new Promise(function(i) {
            return n = i;
          });
        },
        focusReset: "manual",
        scroll: "manual"
      });
    }
    function t() {
      n !== null && (n(), n = null), a || setTimeout(l, 20);
    }
    function l() {
      if (!a && !navigation.transition) {
        var u = navigation.currentEntry;
        u && u.url != null && navigation.navigate(u.url, {
          state: u.getState(),
          info: "react-transition",
          history: "replace"
        });
      }
    }
    if (typeof navigation == "object") {
      var a = !1, n = null;
      return navigation.addEventListener("navigate", e), navigation.addEventListener("navigatesuccess", t), navigation.addEventListener("navigateerror", t), setTimeout(l, 100), function() {
        a = !0, navigation.removeEventListener("navigate", e), navigation.removeEventListener("navigatesuccess", t), navigation.removeEventListener("navigateerror", t), n !== null && (n(), n = null);
      };
    }
  }
  function zf(e) {
    this._internalRoot = e;
  }
  ci.prototype.render = zf.prototype.render = function(e) {
    var t = this._internalRoot;
    if (t === null) throw Error(m(409));
    var l = t.current, a = Ct();
    Sd(l, a, e, t, null, null);
  }, ci.prototype.unmount = zf.prototype.unmount = function() {
    var e = this._internalRoot;
    if (e !== null) {
      this._internalRoot = null;
      var t = e.containerInfo;
      Sd(e.current, 2, null, e, null, null), Qu(), t[ia] = null;
    }
  };
  function ci(e) {
    this._internalRoot = e;
  }
  ci.prototype.unstable_scheduleHydration = function(e) {
    if (e) {
      var t = Yf();
      e = { blockedOn: null, target: e, priority: t };
      for (var l = 0; l < Bl.length && t !== 0 && t < Bl[l].priority; l++) ;
      Bl.splice(l, 0, e), l === 0 && _d(e);
    }
  };
  var Od = M.version;
  if (Od !== "19.2.0")
    throw Error(
      m(
        527,
        Od,
        "19.2.0"
      )
    );
  R.findDOMNode = function(e) {
    var t = e._reactInternals;
    if (t === void 0)
      throw typeof e.render == "function" ? Error(m(188)) : (e = Object.keys(e).join(","), Error(m(268, e)));
    return e = N(t), e = e !== null ? V(e) : null, e = e === null ? null : e.stateNode, e;
  };
  var gh = {
    bundleType: 0,
    version: "19.2.0",
    rendererPackageName: "react-dom",
    currentDispatcherRef: S,
    reconcilerVersion: "19.2.0"
  };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var fi = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!fi.isDisabled && fi.supportsFiber)
      try {
        Gl = fi.inject(
          gh
        ), Nt = fi;
      } catch {
      }
  }
  return Xn.createRoot = function(e, t) {
    if (!O(e)) throw Error(m(299));
    var l = !1, a = "", n = Br, u = qr, i = Yr;
    return t != null && (t.unstable_strictMode === !0 && (l = !0), t.identifierPrefix !== void 0 && (a = t.identifierPrefix), t.onUncaughtError !== void 0 && (n = t.onUncaughtError), t.onCaughtError !== void 0 && (u = t.onCaughtError), t.onRecoverableError !== void 0 && (i = t.onRecoverableError)), t = xd(
      e,
      1,
      !1,
      null,
      null,
      l,
      a,
      null,
      n,
      u,
      i,
      Cd
    ), e[ia] = t.current, uf(e), new zf(t);
  }, Xn.hydrateRoot = function(e, t, l) {
    if (!O(e)) throw Error(m(299));
    var a = !1, n = "", u = Br, i = qr, f = Yr, o = null;
    return l != null && (l.unstable_strictMode === !0 && (a = !0), l.identifierPrefix !== void 0 && (n = l.identifierPrefix), l.onUncaughtError !== void 0 && (u = l.onUncaughtError), l.onCaughtError !== void 0 && (i = l.onCaughtError), l.onRecoverableError !== void 0 && (f = l.onRecoverableError), l.formState !== void 0 && (o = l.formState)), t = xd(
      e,
      1,
      !0,
      t,
      l ?? null,
      a,
      n,
      o,
      u,
      i,
      f,
      Cd
    ), t.context = pd(null), l = t.current, a = Ct(), a = hi(a), n = Nl(a), n.callback = null, Tl(l, n, a), l = a, t.current.lanes = l, Fa(t, l), Jt(t), e[ia] = t.current, uf(e), new ci(t);
  }, Xn.version = "19.2.0", Xn;
}
var Qd;
function Mh() {
  if (Qd) return _f.exports;
  Qd = 1;
  function r() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(r);
      } catch (M) {
        console.error(M);
      }
  }
  return r(), _f.exports = _h(), _f.exports;
}
var Ah = Mh(), se = Df();
const Vn = /* @__PURE__ */ xh(se), Id = (r) => {
  if (typeof window > "u" || !window.speechSynthesis) return null;
  const M = window.speechSynthesis.getVoices();
  if (M.length === 0) return null;
  const U = r.split(/[-_]/)[0].toLowerCase();
  let m = M.filter((L) => L.lang.toLowerCase() === r.toLowerCase());
  if (m.length === 0 && (m = M.filter((L) => L.lang.split(/[-_]/)[0].toLowerCase() === U)), m.length === 0) return null;
  const O = ["natural", "google", "enhanced", "premium", "siri"];
  for (const L of O) {
    const C = m.find((N) => N.name.toLowerCase().includes(L));
    if (C) return C;
  }
  const G = ["samantha", "karen", "daniel", "moira", "alex", "victoria", "fiona"];
  for (const L of G) {
    const C = m.find((N) => N.name.toLowerCase().includes(L));
    if (C) return C;
  }
  return m.find((L) => !L.name.toLowerCase().includes("microsoft")) || m[0];
}, Ch = (r) => {
  if (typeof window > "u" || !window.speechSynthesis) return [];
  const M = window.speechSynthesis.getVoices(), U = r.split(/[-_]/)[0].toLowerCase();
  return M.filter(
    (m) => m.lang.toLowerCase() === r.toLowerCase() || m.lang.split(/[-_]/)[0].toLowerCase() === U
  ).sort((m, O) => m.name.localeCompare(O.name));
}, Oh = (r, M, U = 1, m) => {
  if (typeof window > "u" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const O = new SpeechSynthesisUtterance(r), G = window.speechSynthesis.getVoices();
  if (m) {
    const le = G.find((L) => L.name === m);
    le && (O.voice = le);
  }
  if (!O.voice) {
    const le = Id(M);
    le && (O.voice = le);
  }
  O.lang = M, O.rate = U;
  try {
    window.speechSynthesis.speak(O);
  } catch (le) {
    console.warn("speechSynthesis.speak() failed:", le);
  }
  return O;
}, St = (r) => r ? r.trim().toLowerCase().replace(/[.!,?;:"'()\[\]{}‘’“”]/g, "").replace(/\s+/g, " ").trim() : "", ri = (r) => {
  const M = [...r];
  for (let U = M.length - 1; U > 0; U--) {
    const m = Math.floor(Math.random() * (U + 1));
    [M[U], M[m]] = [M[m], M[U]];
  }
  return M;
}, Uf = (r) => ({
  English: "en-US",
  French: "fr-FR",
  Spanish: "es-ES",
  German: "de-DE"
})[r] || "en-US", dl = (r, M, U = 1, m) => {
  const O = Uf(M);
  Oh(r, O, U, m);
}, Va = () => {
  const r = navigator.userAgent.toLowerCase();
  return !(r.includes("wv") || r.includes("webview") || r.includes("instagram") || r.includes("facebook") || r.includes("line"));
}, Ld = (r) => {
  if (!/android/i.test(navigator.userAgent)) return "";
  const U = new URL(window.location.href);
  r && U.searchParams.set("lesson", r);
  const O = U.toString().replace(/^https?:\/\//, ""), G = window.location.protocol.replace(":", "");
  return `intent://${O}#Intent;scheme=${G};package=com.android.chrome;end`;
}, Xd = (r) => {
  if (!r) return;
  const M = window.getSelection(), U = document.createRange();
  U.selectNodeContents(r), M == null || M.removeAllRanges(), M == null || M.addRange(U);
}, ot = ({
  children: r,
  variant: M = "primary",
  size: U = "md",
  isLoading: m,
  className: O = "",
  disabled: G,
  ...le
}) => {
  const L = "inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed", C = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-sm",
    secondary: "bg-indigo-100 text-indigo-700 hover:bg-indigo-200 focus:ring-indigo-500",
    outline: "border-2 border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50 focus:ring-gray-500",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    success: "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 shadow-sm"
  }, N = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg"
  };
  return /* @__PURE__ */ s.jsx(
    "button",
    {
      className: `${L} ${C[M]} ${N[U]} ${O}`,
      disabled: G || m,
      ...le,
      children: m ? /* @__PURE__ */ s.jsxs("span", { className: "flex items-center", children: [
        /* @__PURE__ */ s.jsxs("svg", { className: "animate-spin -ml-1 mr-2 h-4 w-4 text-current", xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", children: [
          /* @__PURE__ */ s.jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }),
          /* @__PURE__ */ s.jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })
        ] }),
        "Loading..."
      ] }) : r
    }
  );
};
/**
 * @license lucide-react v0.555.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Uh = (r) => r.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase(), Dh = (r) => r.replace(
  /^([A-Z])|[\s-_]+(\w)/g,
  (M, U, m) => m ? m.toUpperCase() : U.toLowerCase()
), Vd = (r) => {
  const M = Dh(r);
  return M.charAt(0).toUpperCase() + M.slice(1);
}, Pd = (...r) => r.filter((M, U, m) => !!M && M.trim() !== "" && m.indexOf(M) === U).join(" ").trim(), wh = (r) => {
  for (const M in r)
    if (M.startsWith("aria-") || M === "role" || M === "title")
      return !0;
};
/**
 * @license lucide-react v0.555.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
var Rh = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
};
/**
 * @license lucide-react v0.555.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Hh = se.forwardRef(
  ({
    color: r = "currentColor",
    size: M = 24,
    strokeWidth: U = 2,
    absoluteStrokeWidth: m,
    className: O = "",
    children: G,
    iconNode: le,
    ...L
  }, C) => se.createElement(
    "svg",
    {
      ref: C,
      ...Rh,
      width: M,
      height: M,
      stroke: r,
      strokeWidth: m ? Number(U) * 24 / Number(M) : U,
      className: Pd("lucide", O),
      ...!G && !wh(L) && { "aria-hidden": "true" },
      ...L
    },
    [
      ...le.map(([N, V]) => se.createElement(N, V)),
      ...Array.isArray(G) ? G : [G]
    ]
  )
);
/**
 * @license lucide-react v0.555.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const lt = (r, M) => {
  const U = se.forwardRef(
    ({ className: m, ...O }, G) => se.createElement(Hh, {
      ref: G,
      iconNode: M,
      className: Pd(
        `lucide-${Uh(Vd(r))}`,
        `lucide-${r}`,
        m
      ),
      ...O
    })
  );
  return U.displayName = Vd(r), U;
};
/**
 * @license lucide-react v0.555.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Bh = [["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }]], e0 = lt("check", Bh);
/**
 * @license lucide-react v0.555.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const qh = [["path", { d: "m9 18 6-6-6-6", key: "mthhwq" }]], Yh = lt("chevron-right", qh);
/**
 * @license lucide-react v0.555.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Gh = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }]
], Zd = lt("circle-check", Gh);
/**
 * @license lucide-react v0.555.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Qh = [
  [
    "path",
    {
      d: "M9 9.003a1 1 0 0 1 1.517-.859l4.997 2.997a1 1 0 0 1 0 1.718l-4.997 2.997A1 1 0 0 1 9 14.996z",
      key: "kmsa83"
    }
  ],
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }]
], Lh = lt("circle-play", Qh);
/**
 * @license lucide-react v0.555.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Xh = [
  [
    "path",
    {
      d: "M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49",
      key: "ct8e1f"
    }
  ],
  ["path", { d: "M14.084 14.158a3 3 0 0 1-4.242-4.242", key: "151rxh" }],
  [
    "path",
    {
      d: "M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143",
      key: "13bj9a"
    }
  ],
  ["path", { d: "m2 2 20 20", key: "1ooewy" }]
], Vh = lt("eye-off", Xh);
/**
 * @license lucide-react v0.555.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Zh = [
  [
    "path",
    {
      d: "M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",
      key: "1nclc0"
    }
  ],
  ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }]
], Kh = lt("eye", Zh);
/**
 * @license lucide-react v0.555.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Jh = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20", key: "13o1zl" }],
  ["path", { d: "M2 12h20", key: "9i4pu4" }]
], Kd = lt("globe", Jh);
/**
 * @license lucide-react v0.555.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const kh = [
  ["path", { d: "m5 8 6 6", key: "1wu5hv" }],
  ["path", { d: "m4 14 6-6 2-3", key: "1k1g8d" }],
  ["path", { d: "M2 5h12", key: "or177f" }],
  ["path", { d: "M7 2h1", key: "1t2jsx" }],
  ["path", { d: "m22 22-5-10-5 10", key: "don7ne" }],
  ["path", { d: "M14 18h6", key: "1m8k6r" }]
], Wh = lt("languages", kh);
/**
 * @license lucide-react v0.555.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const $h = [
  ["path", { d: "M12 19v3", key: "npa21l" }],
  ["path", { d: "M19 10v2a7 7 0 0 1-14 0v-2", key: "1vc78b" }],
  ["rect", { x: "9", y: "2", width: "6", height: "13", rx: "3", key: "s6n7sd" }]
], Fh = lt("mic", $h);
/**
 * @license lucide-react v0.555.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Ih = [
  ["rect", { x: "14", y: "3", width: "5", height: "18", rx: "1", key: "kaeet6" }],
  ["rect", { x: "5", y: "3", width: "5", height: "18", rx: "1", key: "1wsw3u" }]
], Jd = lt("pause", Ih);
/**
 * @license lucide-react v0.555.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Ph = [
  [
    "path",
    {
      d: "M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z",
      key: "10ikf1"
    }
  ]
], kd = lt("play", Ph);
/**
 * @license lucide-react v0.555.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ev = [
  [
    "path",
    {
      d: "M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2",
      key: "143wyd"
    }
  ],
  ["path", { d: "M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6", key: "1itne7" }],
  ["rect", { x: "6", y: "14", width: "12", height: "8", rx: "1", key: "1ue0tg" }]
], tv = lt("printer", ev);
/**
 * @license lucide-react v0.555.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const lv = [
  ["path", { d: "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8", key: "v9h5vc" }],
  ["path", { d: "M21 3v5h-5", key: "1q7to0" }],
  ["path", { d: "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16", key: "3uifl3" }],
  ["path", { d: "M8 16H3v5", key: "1cv678" }]
], t0 = lt("refresh-cw", lv);
/**
 * @license lucide-react v0.555.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const av = [
  ["path", { d: "M21 4v16", key: "7j8fe9" }],
  [
    "path",
    {
      d: "M6.029 4.285A2 2 0 0 0 3 6v12a2 2 0 0 0 3.029 1.715l9.997-5.998a2 2 0 0 0 .003-3.432z",
      key: "zs4d6"
    }
  ]
], Wd = lt("skip-forward", av);
/**
 * @license lucide-react v0.555.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const nv = [
  [
    "path",
    {
      d: "m12 10 2 4v3a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-3a8 8 0 1 0-16 0v3a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-3l2-4h4Z",
      key: "1lbbv7"
    }
  ],
  ["path", { d: "M4.82 7.9 8 10", key: "m9wose" }],
  ["path", { d: "M15.18 7.9 12 10", key: "p8dp2u" }],
  ["path", { d: "M16.93 10H20a2 2 0 0 1 0 4H2", key: "12nsm7" }]
], l0 = lt("turtle", nv);
/**
 * @license lucide-react v0.555.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const uv = [
  [
    "path",
    {
      d: "m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5",
      key: "ftymec"
    }
  ],
  ["rect", { x: "2", y: "6", width: "14", height: "12", rx: "2", key: "158x01" }]
], iv = lt("video", uv);
/**
 * @license lucide-react v0.555.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const cv = [
  [
    "path",
    {
      d: "M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z",
      key: "uqj9uw"
    }
  ],
  ["path", { d: "M16 9a5 5 0 0 1 0 6", key: "1q6k2b" }],
  ["path", { d: "M19.364 18.364a9 9 0 0 0 0-12.728", key: "ijwkga" }]
], ml = lt("volume-2", cv);
/**
 * @license lucide-react v0.555.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const fv = [
  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
  ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
], sv = lt("x", fv), rv = ({ data: r, language: M, onChange: U, savedAnswers: m, voiceName: O, savedIsChecked: G = !1, onComplete: le }) => {
  const [L, C] = se.useState([]), [N, V] = se.useState(G), [B, J] = se.useState(0);
  se.useEffect(() => {
    C(
      r.items.map((k, Y) => Y).sort(() => Math.random() - 0.5)
    );
  }, [r]);
  const ue = (k, Y) => {
    const ae = Y.slice(-1).toLowerCase(), _e = { ...m, [`vocab_${k}`]: ae };
    U(_e);
  }, he = () => {
    let k = 0;
    L.forEach((Y) => {
      const ae = r.items[Y], _e = m[`vocab_${Y}`] || "", ce = r.definitions.findIndex((de) => de.id === ae.answer), W = String.fromCharCode(97 + ce);
      _e.toLowerCase() === W && k++;
    }), J(k), V(!0), le == null || le(!0);
  };
  return /* @__PURE__ */ s.jsxs("section", { className: "bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8", children: [
    /* @__PURE__ */ s.jsx("div", { className: "flex justify-between items-center mb-6", children: /* @__PURE__ */ s.jsx("h2", { className: "text-2xl font-bold text-blue-800", children: "Activity 1: Vocabulary" }) }),
    /* @__PURE__ */ s.jsx("p", { className: "text-gray-600 mb-6 text-lg", children: "Select the correct letter for each word. You can check your answers as many times as you like." }),
    /* @__PURE__ */ s.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ s.jsx("h3", { className: "font-semibold text-xl text-gray-800 mb-4", children: "Match the words:" }),
        L.map((k, Y) => {
          const ae = r.items[k], _e = `vocab_${k}`, ce = m[_e] || "";
          let W = "border-gray-300 focus:ring-blue-500 focus:border-blue-500";
          if (N && ce) {
            const de = r.definitions.findIndex((P) => P.id === ae.answer), ve = String.fromCharCode(97 + de);
            W = ce.toLowerCase() === ve ? "border-green-500 bg-green-50 text-green-700" : "border-red-500 bg-red-50 text-red-700";
          }
          return /* @__PURE__ */ s.jsxs("div", { className: "flex items-center gap-4 p-3 bg-gray-50 rounded-lg", children: [
            /* @__PURE__ */ s.jsx(
              "input",
              {
                type: "text",
                maxLength: 1,
                value: ce,
                onChange: (de) => ue(k, de.target.value),
                className: `w-12 h-12 text-center text-xl font-bold rounded-md border-2 outline-none transition-colors uppercase ${W}`,
                placeholder: "?"
              }
            ),
            Va() && /* @__PURE__ */ s.jsx(
              "button",
              {
                onClick: (de) => {
                  dl(ae.label, M, 0.7, O);
                },
                className: "text-gray-400 hover:text-blue-600 transition-colors p-1",
                title: "Hear word",
                children: /* @__PURE__ */ s.jsx(ml, { size: 18 })
              }
            ),
            /* @__PURE__ */ s.jsxs("span", { className: "font-medium text-gray-700 text-lg selectable-text", translate: "no", children: [
              Y + 1,
              ". ",
              ae.label
            ] })
          ] }, `word-${k}`);
        })
      ] }),
      /* @__PURE__ */ s.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ s.jsx("h3", { className: "font-semibold text-xl text-gray-800 mb-4", children: "Definitions:" }),
        r.definitions.map((k, Y) => /* @__PURE__ */ s.jsxs("div", { className: "flex gap-3 p-4 bg-indigo-50 rounded-lg border border-indigo-100 items-start", children: [
          /* @__PURE__ */ s.jsxs("span", { className: "font-bold text-indigo-600 text-lg min-w-[1.5rem]", children: [
            String.fromCharCode(97 + Y),
            "."
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "flex-1 flex justify-between items-start gap-2", children: [
            /* @__PURE__ */ s.jsx("span", { className: "text-gray-700 leading-snug text-lg selectable-text", translate: "no", children: k.text }),
            Va() && /* @__PURE__ */ s.jsx(
              "button",
              {
                onClick: (ae) => {
                  dl(k.text, M, 0.7, O);
                },
                className: "text-indigo-300 hover:text-indigo-600 transition-colors p-1 shrink-0",
                title: "Hear definition",
                children: /* @__PURE__ */ s.jsx(ml, { size: 18 })
              }
            )
          ] })
        ] }, k.id))
      ] })
    ] }),
    /* @__PURE__ */ s.jsx("div", { className: "mt-8 flex flex-col items-center gap-4", children: /* @__PURE__ */ s.jsxs("div", { className: "flex items-center gap-4", children: [
      /* @__PURE__ */ s.jsx(ot, { onClick: he, size: "lg", children: "Check Answers" }),
      N && /* @__PURE__ */ s.jsxs("div", { className: `text-xl font-bold ${B === r.items.length ? "text-green-600" : "text-blue-600"}`, children: [
        "Score: ",
        B,
        " / ",
        r.items.length
      ] })
    ] }) })
  ] });
}, ov = ({ data: r, vocabItems: M, level: U, language: m, onChange: O, savedAnswers: G, voiceName: le, savedIsChecked: L = !1, onComplete: C }) => {
  const [N, V] = se.useState(L), B = se.useMemo(() => {
    const Y = r.map((ae, _e) => _e);
    return ri(Y);
  }, [r]), J = se.useMemo(() => {
    const Y = r.map((ae) => ae.answer);
    return ri(Y);
  }, [r]);
  if (!r || r.length === 0) return null;
  const ue = () => {
    V(!0), C == null || C(!0);
  }, he = (Y, ae) => {
    N && V(!1), O({
      ...G,
      [Y]: ae
    });
  }, k = r.reduce((Y, ae, _e) => {
    const ce = G[_e] || "";
    return St(ce) === St(ae.answer) ? Y + 1 : Y;
  }, 0);
  return /* @__PURE__ */ s.jsxs("section", { className: "bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100 mb-8", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "flex justify-between items-center mb-6", children: [
      /* @__PURE__ */ s.jsx("h2", { className: "text-2xl font-bold text-blue-800", children: "Activity 2: Fill in the blanks" }),
      N && /* @__PURE__ */ s.jsxs("div", { className: `text-xl font-bold ${k === r.length ? "text-green-600" : "text-blue-600"}`, children: [
        "Score: ",
        k,
        "/",
        r.length
      ] })
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: "bg-blue-50 p-4 rounded-lg mb-8 border border-blue-100", children: [
      /* @__PURE__ */ s.jsx("h3", { className: "text-sm font-semibold text-blue-600 uppercase tracking-wider mb-3", children: "Word Bank" }),
      /* @__PURE__ */ s.jsx("div", { className: "flex flex-wrap justify-around gap-2", translate: "no", children: J.map((Y, ae) => /* @__PURE__ */ s.jsx(
        "span",
        {
          className: "px-3 py-1.5 bg-white text-blue-800 rounded-md shadow-sm border border-blue-100 font-medium",
          children: Y
        },
        ae
      )) })
    ] }),
    /* @__PURE__ */ s.jsx("div", { className: "space-y-6", children: B.map((Y) => {
      const ae = r[Y], _e = G[Y] || "", ce = St(_e) === St(ae.answer);
      let W = "border-b-2 border-gray-300 bg-gray-50 px-2 py-1 mx-2 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors min-w-[120px] text-center font-medium";
      return N && (W = ce ? "border-b-2 border-green-500 bg-green-50 text-green-900 font-bold px-2 py-1 mx-2 min-w-[120px] text-center" : "border-b-2 border-red-500 bg-red-50 text-red-900 font-bold px-2 py-1 mx-2 min-w-[120px] text-center"), /* @__PURE__ */ s.jsxs("div", { className: "leading-loose text-lg text-gray-700 flex flex-wrap items-center", children: [
        Va() && /* @__PURE__ */ s.jsx(
          "button",
          {
            onClick: (de) => {
              dl(`${ae.before} ${ae.answer} ${ae.after}`, m, 0.7, le);
            },
            className: "mr-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 p-2 rounded-full transition-colors",
            title: "Hear sentence",
            children: /* @__PURE__ */ s.jsx(ml, { size: 24 })
          }
        ),
        /* @__PURE__ */ s.jsxs("div", { className: "selectable-text flex flex-wrap items-center", translate: "no", children: [
          /* @__PURE__ */ s.jsx("span", { children: ae.before }),
          /* @__PURE__ */ s.jsx(
            "input",
            {
              type: "text",
              value: _e,
              onChange: (de) => he(Y, de.target.value),
              className: W,
              placeholder: "_____"
            }
          ),
          /* @__PURE__ */ s.jsx("span", { children: ae.after })
        ] })
      ] }, Y);
    }) }),
    /* @__PURE__ */ s.jsx("div", { className: "mt-8 flex justify-center gap-4", children: /* @__PURE__ */ s.jsxs(ot, { onClick: ue, children: [
      /* @__PURE__ */ s.jsx(e0, { size: 20, className: "mr-2" }),
      " Check Answers"
    ] }) })
  ] });
}, dv = ({ data: r, readingText: M, language: U, onChange: m, savedAnswers: O, voiceName: G, savedIsCompleted: le = !1, onComplete: L }) => {
  const [C, N] = se.useState(0), [V, B] = se.useState(!1), [J, ue] = se.useState(le);
  if (!r || !r.questions || r.questions.length === 0) return null;
  const he = r.questions[C], k = O[C], Y = (W) => {
    V || m({ ...O, [C]: W });
  }, ae = () => {
    if (V)
      C < r.questions.length - 1 ? (B(!1), N((W) => W + 1)) : (ue(!0), L == null || L(!0));
    else {
      B(!0);
      const W = k === he.answer;
      W && C < r.questions.length - 1 ? setTimeout(() => {
        B(!1), N((de) => de + 1);
      }, 1e3) : W && C === r.questions.length - 1 && setTimeout(() => {
        ue(!0), L == null || L(!0);
      }, 1e3);
    }
  }, _e = () => {
    N(0), B(!1), ue(!1), m({});
  };
  if (J) {
    let W = 0;
    return r.questions.forEach((de, ve) => {
      O[ve] === de.answer && W++;
    }), /* @__PURE__ */ s.jsxs("section", { className: "bg-white p-8 rounded-xl shadow-sm border border-gray-100 mb-8 text-center", children: [
      /* @__PURE__ */ s.jsx("h2", { className: "text-2xl font-bold text-blue-800 mb-4", children: "Activity 3: Comprehension" }),
      /* @__PURE__ */ s.jsx("div", { className: `text-3xl font-bold mb-4 ${W === r.questions.length ? "text-green-600" : "text-blue-600"}`, children: W === r.questions.length ? "🎉 Perfect!" : "Good Job!" }),
      /* @__PURE__ */ s.jsxs("p", { className: "text-gray-600 text-lg mb-6", children: [
        "You got ",
        W,
        " out of ",
        r.questions.length,
        " correct."
      ] }),
      /* @__PURE__ */ s.jsxs(ot, { onClick: _e, variant: "secondary", children: [
        /* @__PURE__ */ s.jsx(t0, { className: "w-4 h-4 mr-2" }),
        " Retry Activity"
      ] })
    ] });
  }
  const ce = k === he.answer;
  return /* @__PURE__ */ s.jsxs("section", { className: "bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "flex justify-between items-center mb-6", children: [
      /* @__PURE__ */ s.jsx("h2", { className: "text-2xl font-bold text-blue-800", children: "Activity 3: Comprehension" }),
      /* @__PURE__ */ s.jsxs("span", { className: "font-medium text-gray-500 text-sm", children: [
        "Question ",
        C + 1,
        " of ",
        r.questions.length
      ] })
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-8", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "order-2 lg:order-1", children: [
        /* @__PURE__ */ s.jsx("h3", { className: "font-bold text-gray-500 uppercase mb-2", children: "Reference Text" }),
        /* @__PURE__ */ s.jsx("div", { className: "bg-indigo-50 p-4 rounded-lg border border-indigo-100 max-h-[300px] overflow-y-auto custom-scrollbar", children: /* @__PURE__ */ s.jsx("p", { className: "text-gray-700 leading-relaxed font-serif text-lg whitespace-pre-line", translate: "no", children: M }) })
      ] }),
      /* @__PURE__ */ s.jsxs("div", { className: "order-1 lg:order-2 flex flex-col justify-center", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "mb-6 min-h-[120px]", children: [
          /* @__PURE__ */ s.jsxs("div", { className: "flex items-start gap-3 mb-6", children: [
            /* @__PURE__ */ s.jsx("p", { className: "text-lg md:text-xl font-medium text-gray-800 flex-1 selectable-text", translate: "no", children: he.text }),
            Va() && /* @__PURE__ */ s.jsx(
              "button",
              {
                onClick: () => {
                  try {
                    setTimeout(() => dl(he.text, U, 0.7, G), 1);
                  } catch (W) {
                    console.warn("TTS failed:", W);
                  }
                },
                className: "text-gray-400 hover:text-blue-600 transition-colors p-1 shrink-0",
                title: "Hear question",
                children: /* @__PURE__ */ s.jsx(ml, { size: 24 })
              }
            )
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "flex flex-col sm:flex-row gap-4", children: [
            /* @__PURE__ */ s.jsxs("label", { className: `
                          flex-1 flex items-center justify-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all select-none
                          ${k === "true" ? V ? he.answer === "true" ? "border-green-500 bg-green-50 text-green-700" : "border-red-500 bg-red-50 text-red-700" : "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200 hover:border-blue-300 hover:bg-gray-50 text-gray-600"}
                      `, children: [
              /* @__PURE__ */ s.jsx(
                "input",
                {
                  type: "radio",
                  name: `q-${C}`,
                  value: "true",
                  checked: k === "true",
                  onChange: () => Y("true"),
                  className: "hidden",
                  disabled: V
                }
              ),
              /* @__PURE__ */ s.jsx("span", { className: "font-bold text-lg", translate: "no", children: "True" })
            ] }),
            /* @__PURE__ */ s.jsxs("label", { className: `
                          flex-1 flex items-center justify-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all select-none
                          ${k === "false" ? V ? he.answer === "false" ? "border-green-500 bg-green-50 text-green-700" : "border-red-500 bg-red-50 text-red-700" : "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200 hover:border-blue-300 hover:bg-gray-50 text-gray-600"}
                      `, children: [
              /* @__PURE__ */ s.jsx(
                "input",
                {
                  type: "radio",
                  name: `q-${C}`,
                  value: "false",
                  checked: k === "false",
                  onChange: () => Y("false"),
                  className: "hidden",
                  disabled: V
                }
              ),
              /* @__PURE__ */ s.jsx("span", { className: "font-bold text-lg", translate: "no", children: "False" })
            ] })
          ] }),
          V && !ce && /* @__PURE__ */ s.jsxs("div", { className: "mt-4 text-center font-bold text-red-600 animate-fade-in text-lg", children: [
            "Incorrect. The answer is ",
            he.answer === "true" ? "True" : "False",
            "."
          ] })
        ] }),
        /* @__PURE__ */ s.jsx("div", { className: "flex items-center justify-end mt-4 pt-4 border-t border-gray-100", children: /* @__PURE__ */ s.jsxs(
          ot,
          {
            variant: V && !ce ? "secondary" : "primary",
            onClick: ae,
            disabled: !k && !V,
            className: "min-w-[120px]",
            children: [
              V ? C === r.questions.length - 1 ? "Finish" : "Next" : "Check",
              !V && /* @__PURE__ */ s.jsx(e0, { className: "ml-2 w-4 h-4" }),
              V && /* @__PURE__ */ s.jsx(Yh, { className: "ml-2 w-4 h-4" })
            ]
          }
        ) })
      ] })
    ] })
  ] });
}, mv = ({ data: r, level: M, language: U, onChange: m, savedAnswers: O, voiceName: G, savedIsCompleted: le = !1, onComplete: L }) => {
  const [C, N] = se.useState(0), [V, B] = se.useState([]), [J, ue] = se.useState([]), [he, k] = se.useState(!1), [Y, ae] = se.useState(!1), [_e, ce] = se.useState(le);
  if (!r || r.length === 0) return null;
  const W = M === "A1" || M === "A2", de = r[C];
  se.useEffect(() => {
    if (de && W) {
      const ne = de.answer.replace(/[.!?]+$/, "").split(/\s+/).map((pe, fe) => ({ id: fe, text: pe }));
      for (let pe = ne.length - 1; pe > 0; pe--) {
        const fe = Math.floor(Math.random() * (pe + 1));
        [ne[pe], ne[fe]] = [ne[fe], ne[pe]];
      }
      B(ne), ue([]), k(!1), ae(!1);
    } else
      k(!1), ae(!1);
  }, [C, de, W]), se.useEffect(() => {
    if (W) {
      const ne = J.map((fe) => fe.text).join(" "), pe = O[C] || "";
      ne !== pe && m({ ...O, [C]: ne });
    }
  }, [J, C, W, O, m]);
  const ve = (ne) => {
    if (Y) return;
    k(!1);
    const pe = V.find((fe) => fe.id === ne);
    pe && (B((fe) => fe.filter((S) => S.id !== ne)), ue((fe) => [...fe, pe]), dl(pe.text, U, 1, G));
  }, P = (ne) => {
    if (Y) return;
    k(!1);
    const pe = J.find((fe) => fe.id === ne);
    pe && (ue((fe) => fe.filter((S) => S.id !== ne)), B((fe) => [...fe, pe]));
  }, Le = (ne) => {
    k(!1), m({ ...O, [C]: ne });
  }, ft = () => {
    k(!0);
    const ne = W ? J.map((fe) => fe.text).join(" ") : O[C] || "";
    St(ne) === St(de.answer) && (ae(!0), setTimeout(() => {
      C < r.length - 1 ? N((fe) => fe + 1) : (ce(!0), L == null || L(!0));
    }, 1500));
  }, Ze = () => {
    C < r.length - 1 ? N((ne) => ne + 1) : (ce(!0), L == null || L(!0));
  };
  if (_e) {
    const ne = r.reduce((pe, fe, S) => St(O[S] || "") === St(fe.answer) ? pe + 1 : pe, 0);
    return /* @__PURE__ */ s.jsxs("section", { className: "bg-white p-8 rounded-xl shadow-sm border border-gray-100 mb-8 text-center", children: [
      /* @__PURE__ */ s.jsx("h2", { className: "text-2xl font-bold text-blue-800 mb-4", children: "Activity 4: Sentences" }),
      /* @__PURE__ */ s.jsx("div", { className: `text-3xl font-bold mb-4 ${ne === r.length ? "text-green-600" : "text-blue-600"}`, children: "Activity Completed!" }),
      /* @__PURE__ */ s.jsxs("p", { className: "text-gray-600 text-lg mb-6", children: [
        "Score: ",
        ne,
        " / ",
        r.length
      ] }),
      /* @__PURE__ */ s.jsxs(ot, { onClick: () => {
        N(0), ce(!1), k(!1), m({});
      }, variant: "secondary", children: [
        /* @__PURE__ */ s.jsx(t0, { className: "w-4 h-4 mr-2" }),
        " Retry"
      ] })
    ] });
  }
  const $e = O[C] || "", Fe = St($e) === St((de == null ? void 0 : de.answer) || "");
  return /* @__PURE__ */ s.jsxs("section", { className: "bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "flex justify-between items-center mb-6", children: [
      /* @__PURE__ */ s.jsx("h2", { className: "text-2xl font-bold text-blue-800", children: "Activity 4: Sentences" }),
      Va() && /* @__PURE__ */ s.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ s.jsxs(
          ot,
          {
            variant: "secondary",
            size: "sm",
            onClick: (ne) => {
              dl(de.answer, U, 0.7, G);
            },
            title: "Slow",
            children: [
              /* @__PURE__ */ s.jsx(l0, { className: "w-4 h-4 mr-1" }),
              " Slow"
            ]
          }
        ),
        /* @__PURE__ */ s.jsxs(
          ot,
          {
            variant: "secondary",
            size: "sm",
            onClick: (ne) => {
              dl(de.answer, U, 1, G);
            },
            title: "Normal",
            children: [
              /* @__PURE__ */ s.jsx(ml, { className: "w-4 h-4 mr-1" }),
              " Normal"
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: "min-h-[200px] py-4", children: [
      /* @__PURE__ */ s.jsx("div", { className: `
          min-h-[80px] p-4 rounded-lg mb-6 border-2 flex flex-wrap gap-2 items-center transition-colors
          ${he ? Fe ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50" : "border-dashed border-gray-300 bg-gray-50"}
        `, children: W ? J.length === 0 && !he ? /* @__PURE__ */ s.jsx("span", { className: "text-gray-400 italic pointer-events-none text-lg", children: "Click words below to form the sentence..." }) : /* @__PURE__ */ s.jsx("div", { className: "selectable-text flex flex-wrap gap-2 items-center", translate: "no", children: J.map((ne) => /* @__PURE__ */ s.jsx(
        "button",
        {
          onClick: () => P(ne.id),
          disabled: Y,
          className: "bg-white text-blue-800 px-3 py-2 rounded shadow-sm border border-blue-100 font-medium hover:bg-red-50 hover:text-red-600 transition-colors animate-pop-in text-lg",
          children: ne.text
        },
        ne.id
      )) }) : /* @__PURE__ */ s.jsx(
        "input",
        {
          type: "text",
          className: "w-full bg-transparent outline-none text-lg p-2 selectable-text",
          placeholder: "Type the sentence here...",
          value: $e,
          onChange: (ne) => Le(ne.target.value),
          disabled: Y,
          translate: "no"
        }
      ) }),
      he && !Y && /* @__PURE__ */ s.jsx("div", { className: "mb-6 text-center animate-fade-in text-lg", children: /* @__PURE__ */ s.jsx("p", { className: "text-red-600 font-bold mb-1", children: "Incorrect. Try again." }) }),
      Y && /* @__PURE__ */ s.jsx("div", { className: "mb-6 text-center animate-fade-in text-lg", children: /* @__PURE__ */ s.jsx("p", { className: "text-green-600 font-bold mb-1", children: "Correct!" }) }),
      W && /* @__PURE__ */ s.jsx("div", { className: "flex flex-wrap gap-3 justify-center", translate: "no", children: V.map((ne) => /* @__PURE__ */ s.jsx(
        "button",
        {
          onClick: () => ve(ne.id),
          className: "bg-blue-100 text-blue-800 px-4 py-2 rounded-lg shadow-sm font-medium hover:bg-blue-200 hover:scale-105 transition-all text-lg",
          children: ne.text
        },
        ne.id
      )) })
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: "flex items-center justify-end mt-6 pt-6 border-t border-gray-100", children: [
      /* @__PURE__ */ s.jsxs("span", { className: "font-medium text-gray-500 mr-auto", children: [
        C + 1,
        " / ",
        r.length
      ] }),
      /* @__PURE__ */ s.jsxs("div", { className: "flex gap-2", children: [
        !Y && /* @__PURE__ */ s.jsxs(
          ot,
          {
            variant: "secondary",
            onClick: Ze,
            className: "min-w-[80px]",
            children: [
              Wd ? /* @__PURE__ */ s.jsx(Wd, { className: "w-4 h-4 mr-2" }) : null,
              " Skip"
            ]
          }
        ),
        /* @__PURE__ */ s.jsx(
          ot,
          {
            variant: he && !Y ? "secondary" : "primary",
            onClick: ft,
            disabled: !$e && !W && !Y || W && J.length === 0 && !Y || Y,
            className: "min-w-[120px]",
            children: Y ? "Correct!" : he ? "Try Again" : "Check"
          }
        )
      ] })
    ] })
  ] });
};
var wf = {};
(function r(M, U, m, O) {
  var G = !!(M.Worker && M.Blob && M.Promise && M.OffscreenCanvas && M.OffscreenCanvasRenderingContext2D && M.HTMLCanvasElement && M.HTMLCanvasElement.prototype.transferControlToOffscreen && M.URL && M.URL.createObjectURL), le = typeof Path2D == "function" && typeof DOMMatrix == "function", L = (function() {
    if (!M.OffscreenCanvas)
      return !1;
    try {
      var v = new OffscreenCanvas(1, 1), c = v.getContext("2d");
      c.fillRect(0, 0, 1, 1);
      var y = v.transferToImageBitmap();
      c.createPattern(y, "no-repeat");
    } catch {
      return !1;
    }
    return !0;
  })();
  function C() {
  }
  function N(v) {
    var c = U.exports.Promise, y = c !== void 0 ? c : M.Promise;
    return typeof y == "function" ? new y(v) : (v(C, C), null);
  }
  var V = /* @__PURE__ */ (function(v, c) {
    return {
      transform: function(y) {
        if (v)
          return y;
        if (c.has(y))
          return c.get(y);
        var z = new OffscreenCanvas(y.width, y.height), A = z.getContext("2d");
        return A.drawImage(y, 0, 0), c.set(y, z), z;
      },
      clear: function() {
        c.clear();
      }
    };
  })(L, /* @__PURE__ */ new Map()), B = (function() {
    var v = Math.floor(16.666666666666668), c, y, z = {}, A = 0;
    return typeof requestAnimationFrame == "function" && typeof cancelAnimationFrame == "function" ? (c = function(D) {
      var q = Math.random();
      return z[q] = requestAnimationFrame(function w($) {
        A === $ || A + v - 1 < $ ? (A = $, delete z[q], D()) : z[q] = requestAnimationFrame(w);
      }), q;
    }, y = function(D) {
      z[D] && cancelAnimationFrame(z[D]);
    }) : (c = function(D) {
      return setTimeout(D, v);
    }, y = function(D) {
      return clearTimeout(D);
    }), { frame: c, cancel: y };
  })(), J = /* @__PURE__ */ (function() {
    var v, c, y = {};
    function z(A) {
      function D(q, w) {
        A.postMessage({ options: q || {}, callback: w });
      }
      A.init = function(w) {
        var $ = w.transferControlToOffscreen();
        A.postMessage({ canvas: $ }, [$]);
      }, A.fire = function(w, $, te) {
        if (c)
          return D(w, null), c;
        var Ee = Math.random().toString(36).slice(2);
        return c = N(function(T) {
          function H(K) {
            K.data.callback === Ee && (delete y[Ee], A.removeEventListener("message", H), c = null, V.clear(), te(), T());
          }
          A.addEventListener("message", H), D(w, Ee), y[Ee] = H.bind(null, { data: { callback: Ee } });
        }), c;
      }, A.reset = function() {
        A.postMessage({ reset: !0 });
        for (var w in y)
          y[w](), delete y[w];
      };
    }
    return function() {
      if (v)
        return v;
      if (!m && G) {
        var A = [
          "var CONFETTI, SIZE = {}, module = {};",
          "(" + r.toString() + ")(this, module, true, SIZE);",
          "onmessage = function(msg) {",
          "  if (msg.data.options) {",
          "    CONFETTI(msg.data.options).then(function () {",
          "      if (msg.data.callback) {",
          "        postMessage({ callback: msg.data.callback });",
          "      }",
          "    });",
          "  } else if (msg.data.reset) {",
          "    CONFETTI && CONFETTI.reset();",
          "  } else if (msg.data.resize) {",
          "    SIZE.width = msg.data.resize.width;",
          "    SIZE.height = msg.data.resize.height;",
          "  } else if (msg.data.canvas) {",
          "    SIZE.width = msg.data.canvas.width;",
          "    SIZE.height = msg.data.canvas.height;",
          "    CONFETTI = module.exports.create(msg.data.canvas);",
          "  }",
          "}"
        ].join(`
`);
        try {
          v = new Worker(URL.createObjectURL(new Blob([A])));
        } catch (D) {
          return typeof console < "u" && typeof console.warn == "function" && console.warn("🎊 Could not load worker", D), null;
        }
        z(v);
      }
      return v;
    };
  })(), ue = {
    particleCount: 50,
    angle: 90,
    spread: 45,
    startVelocity: 45,
    decay: 0.9,
    gravity: 1,
    drift: 0,
    ticks: 200,
    x: 0.5,
    y: 0.5,
    shapes: ["square", "circle"],
    zIndex: 100,
    colors: [
      "#26ccff",
      "#a25afd",
      "#ff5e7e",
      "#88ff5a",
      "#fcff42",
      "#ffa62d",
      "#ff36ff"
    ],
    // probably should be true, but back-compat
    disableForReducedMotion: !1,
    scalar: 1
  };
  function he(v, c) {
    return c ? c(v) : v;
  }
  function k(v) {
    return v != null;
  }
  function Y(v, c, y) {
    return he(
      v && k(v[c]) ? v[c] : ue[c],
      y
    );
  }
  function ae(v) {
    return v < 0 ? 0 : Math.floor(v);
  }
  function _e(v, c) {
    return Math.floor(Math.random() * (c - v)) + v;
  }
  function ce(v) {
    return parseInt(v, 16);
  }
  function W(v) {
    return v.map(de);
  }
  function de(v) {
    var c = String(v).replace(/[^0-9a-f]/gi, "");
    return c.length < 6 && (c = c[0] + c[0] + c[1] + c[1] + c[2] + c[2]), {
      r: ce(c.substring(0, 2)),
      g: ce(c.substring(2, 4)),
      b: ce(c.substring(4, 6))
    };
  }
  function ve(v) {
    var c = Y(v, "origin", Object);
    return c.x = Y(c, "x", Number), c.y = Y(c, "y", Number), c;
  }
  function P(v) {
    v.width = document.documentElement.clientWidth, v.height = document.documentElement.clientHeight;
  }
  function Le(v) {
    var c = v.getBoundingClientRect();
    v.width = c.width, v.height = c.height;
  }
  function ft(v) {
    var c = document.createElement("canvas");
    return c.style.position = "fixed", c.style.top = "0px", c.style.left = "0px", c.style.pointerEvents = "none", c.style.zIndex = v, c;
  }
  function Ze(v, c, y, z, A, D, q, w, $) {
    v.save(), v.translate(c, y), v.rotate(D), v.scale(z, A), v.arc(0, 0, 1, q, w, $), v.restore();
  }
  function $e(v) {
    var c = v.angle * (Math.PI / 180), y = v.spread * (Math.PI / 180);
    return {
      x: v.x,
      y: v.y,
      wobble: Math.random() * 10,
      wobbleSpeed: Math.min(0.11, Math.random() * 0.1 + 0.05),
      velocity: v.startVelocity * 0.5 + Math.random() * v.startVelocity,
      angle2D: -c + (0.5 * y - Math.random() * y),
      tiltAngle: (Math.random() * (0.75 - 0.25) + 0.25) * Math.PI,
      color: v.color,
      shape: v.shape,
      tick: 0,
      totalTicks: v.ticks,
      decay: v.decay,
      drift: v.drift,
      random: Math.random() + 2,
      tiltSin: 0,
      tiltCos: 0,
      wobbleX: 0,
      wobbleY: 0,
      gravity: v.gravity * 3,
      ovalScalar: 0.6,
      scalar: v.scalar,
      flat: v.flat
    };
  }
  function Fe(v, c) {
    c.x += Math.cos(c.angle2D) * c.velocity + c.drift, c.y += Math.sin(c.angle2D) * c.velocity + c.gravity, c.velocity *= c.decay, c.flat ? (c.wobble = 0, c.wobbleX = c.x + 10 * c.scalar, c.wobbleY = c.y + 10 * c.scalar, c.tiltSin = 0, c.tiltCos = 0, c.random = 1) : (c.wobble += c.wobbleSpeed, c.wobbleX = c.x + 10 * c.scalar * Math.cos(c.wobble), c.wobbleY = c.y + 10 * c.scalar * Math.sin(c.wobble), c.tiltAngle += 0.1, c.tiltSin = Math.sin(c.tiltAngle), c.tiltCos = Math.cos(c.tiltAngle), c.random = Math.random() + 2);
    var y = c.tick++ / c.totalTicks, z = c.x + c.random * c.tiltCos, A = c.y + c.random * c.tiltSin, D = c.wobbleX + c.random * c.tiltCos, q = c.wobbleY + c.random * c.tiltSin;
    if (v.fillStyle = "rgba(" + c.color.r + ", " + c.color.g + ", " + c.color.b + ", " + (1 - y) + ")", v.beginPath(), le && c.shape.type === "path" && typeof c.shape.path == "string" && Array.isArray(c.shape.matrix))
      v.fill(R(
        c.shape.path,
        c.shape.matrix,
        c.x,
        c.y,
        Math.abs(D - z) * 0.1,
        Math.abs(q - A) * 0.1,
        Math.PI / 10 * c.wobble
      ));
    else if (c.shape.type === "bitmap") {
      var w = Math.PI / 10 * c.wobble, $ = Math.abs(D - z) * 0.1, te = Math.abs(q - A) * 0.1, Ee = c.shape.bitmap.width * c.scalar, T = c.shape.bitmap.height * c.scalar, H = new DOMMatrix([
        Math.cos(w) * $,
        Math.sin(w) * $,
        -Math.sin(w) * te,
        Math.cos(w) * te,
        c.x,
        c.y
      ]);
      H.multiplySelf(new DOMMatrix(c.shape.matrix));
      var K = v.createPattern(V.transform(c.shape.bitmap), "no-repeat");
      K.setTransform(H), v.globalAlpha = 1 - y, v.fillStyle = K, v.fillRect(
        c.x - Ee / 2,
        c.y - T / 2,
        Ee,
        T
      ), v.globalAlpha = 1;
    } else if (c.shape === "circle")
      v.ellipse ? v.ellipse(c.x, c.y, Math.abs(D - z) * c.ovalScalar, Math.abs(q - A) * c.ovalScalar, Math.PI / 10 * c.wobble, 0, 2 * Math.PI) : Ze(v, c.x, c.y, Math.abs(D - z) * c.ovalScalar, Math.abs(q - A) * c.ovalScalar, Math.PI / 10 * c.wobble, 0, 2 * Math.PI);
    else if (c.shape === "star")
      for (var Q = Math.PI / 2 * 3, me = 4 * c.scalar, Me = 8 * c.scalar, qe = c.x, dt = c.y, Ie = 5, Ye = Math.PI / Ie; Ie--; )
        qe = c.x + Math.cos(Q) * Me, dt = c.y + Math.sin(Q) * Me, v.lineTo(qe, dt), Q += Ye, qe = c.x + Math.cos(Q) * me, dt = c.y + Math.sin(Q) * me, v.lineTo(qe, dt), Q += Ye;
    else
      v.moveTo(Math.floor(c.x), Math.floor(c.y)), v.lineTo(Math.floor(c.wobbleX), Math.floor(A)), v.lineTo(Math.floor(D), Math.floor(q)), v.lineTo(Math.floor(z), Math.floor(c.wobbleY));
    return v.closePath(), v.fill(), c.tick < c.totalTicks;
  }
  function ne(v, c, y, z, A) {
    var D = c.slice(), q = v.getContext("2d"), w, $, te = N(function(Ee) {
      function T() {
        w = $ = null, q.clearRect(0, 0, z.width, z.height), V.clear(), A(), Ee();
      }
      function H() {
        m && !(z.width === O.width && z.height === O.height) && (z.width = v.width = O.width, z.height = v.height = O.height), !z.width && !z.height && (y(v), z.width = v.width, z.height = v.height), q.clearRect(0, 0, z.width, z.height), D = D.filter(function(K) {
          return Fe(q, K);
        }), D.length ? w = B.frame(H) : T();
      }
      w = B.frame(H), $ = T;
    });
    return {
      addFettis: function(Ee) {
        return D = D.concat(Ee), te;
      },
      canvas: v,
      promise: te,
      reset: function() {
        w && B.cancel(w), $ && $();
      }
    };
  }
  function pe(v, c) {
    var y = !v, z = !!Y(c || {}, "resize"), A = !1, D = Y(c, "disableForReducedMotion", Boolean), q = G && !!Y(c || {}, "useWorker"), w = q ? J() : null, $ = y ? P : Le, te = v && w ? !!v.__confetti_initialized : !1, Ee = typeof matchMedia == "function" && matchMedia("(prefers-reduced-motion)").matches, T;
    function H(Q, me, Me) {
      for (var qe = Y(Q, "particleCount", ae), dt = Y(Q, "angle", Number), Ie = Y(Q, "spread", Number), Ye = Y(Q, "startVelocity", Number), Yl = Y(Q, "decay", Number), Za = Y(Q, "gravity", Number), Ka = Y(Q, "drift", Number), st = Y(Q, "colors", W), oi = Y(Q, "ticks", Number), Ja = Y(Q, "shapes"), Zn = Y(Q, "scalar"), ua = !!Y(Q, "flat"), Kn = ve(Q), ka = qe, Wa = [], di = v.width * Kn.x, Gl = v.height * Kn.y; ka--; )
        Wa.push(
          $e({
            x: di,
            y: Gl,
            angle: dt,
            spread: Ie,
            startVelocity: Ye,
            color: st[ka % st.length],
            shape: Ja[_e(0, Ja.length)],
            ticks: oi,
            decay: Yl,
            gravity: Za,
            drift: Ka,
            scalar: Zn,
            flat: ua
          })
        );
      return T ? T.addFettis(Wa) : (T = ne(v, Wa, $, me, Me), T.promise);
    }
    function K(Q) {
      var me = D || Y(Q, "disableForReducedMotion", Boolean), Me = Y(Q, "zIndex", Number);
      if (me && Ee)
        return N(function(Ye) {
          Ye();
        });
      y && T ? v = T.canvas : y && !v && (v = ft(Me), document.body.appendChild(v)), z && !te && $(v);
      var qe = {
        width: v.width,
        height: v.height
      };
      w && !te && w.init(v), te = !0, w && (v.__confetti_initialized = !0);
      function dt() {
        if (w) {
          var Ye = {
            getBoundingClientRect: function() {
              if (!y)
                return v.getBoundingClientRect();
            }
          };
          $(Ye), w.postMessage({
            resize: {
              width: Ye.width,
              height: Ye.height
            }
          });
          return;
        }
        qe.width = qe.height = null;
      }
      function Ie() {
        T = null, z && (A = !1, M.removeEventListener("resize", dt)), y && v && (document.body.contains(v) && document.body.removeChild(v), v = null, te = !1);
      }
      return z && !A && (A = !0, M.addEventListener("resize", dt, !1)), w ? w.fire(Q, qe, Ie) : H(Q, qe, Ie);
    }
    return K.reset = function() {
      w && w.reset(), T && T.reset();
    }, K;
  }
  var fe;
  function S() {
    return fe || (fe = pe(null, { useWorker: !0, resize: !0 })), fe;
  }
  function R(v, c, y, z, A, D, q) {
    var w = new Path2D(v), $ = new Path2D();
    $.addPath(w, new DOMMatrix(c));
    var te = new Path2D();
    return te.addPath($, new DOMMatrix([
      Math.cos(q) * A,
      Math.sin(q) * A,
      -Math.sin(q) * D,
      Math.cos(q) * D,
      y,
      z
    ])), te;
  }
  function I(v) {
    if (!le)
      throw new Error("path confetti are not supported in this browser");
    var c, y;
    typeof v == "string" ? c = v : (c = v.path, y = v.matrix);
    var z = new Path2D(c), A = document.createElement("canvas"), D = A.getContext("2d");
    if (!y) {
      for (var q = 1e3, w = q, $ = q, te = 0, Ee = 0, T, H, K = 0; K < q; K += 2)
        for (var Q = 0; Q < q; Q += 2)
          D.isPointInPath(z, K, Q, "nonzero") && (w = Math.min(w, K), $ = Math.min($, Q), te = Math.max(te, K), Ee = Math.max(Ee, Q));
      T = te - w, H = Ee - $;
      var me = 10, Me = Math.min(me / T, me / H);
      y = [
        Me,
        0,
        0,
        Me,
        -Math.round(T / 2 + w) * Me,
        -Math.round(H / 2 + $) * Me
      ];
    }
    return {
      type: "path",
      path: c,
      matrix: y
    };
  }
  function Ne(v) {
    var c, y = 1, z = "#000000", A = '"Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji", "EmojiOne Color", "Android Emoji", "Twemoji Mozilla", "system emoji", sans-serif';
    typeof v == "string" ? c = v : (c = v.text, y = "scalar" in v ? v.scalar : y, A = "fontFamily" in v ? v.fontFamily : A, z = "color" in v ? v.color : z);
    var D = 10 * y, q = "" + D + "px " + A, w = new OffscreenCanvas(D, D), $ = w.getContext("2d");
    $.font = q;
    var te = $.measureText(c), Ee = Math.ceil(te.actualBoundingBoxRight + te.actualBoundingBoxLeft), T = Math.ceil(te.actualBoundingBoxAscent + te.actualBoundingBoxDescent), H = 2, K = te.actualBoundingBoxLeft + H, Q = te.actualBoundingBoxAscent + H;
    Ee += H + H, T += H + H, w = new OffscreenCanvas(Ee, T), $ = w.getContext("2d"), $.font = q, $.fillStyle = z, $.fillText(c, K, Q);
    var me = 1 / y;
    return {
      type: "bitmap",
      // TODO these probably need to be transfered for workers
      bitmap: w.transferToImageBitmap(),
      matrix: [me, 0, 0, me, -Ee * me / 2, -T * me / 2]
    };
  }
  U.exports = function() {
    return S().apply(this, arguments);
  }, U.exports.reset = function() {
    S().reset();
  }, U.exports.create = pe, U.exports.shapeFromPath = I, U.exports.shapeFromText = Ne;
})(/* @__PURE__ */ (function() {
  return typeof window < "u" ? window : typeof self < "u" ? self : this || {};
})(), wf, !1);
const hv = wf.exports;
wf.exports.create;
const vv = ({
  isOpen: r,
  onClose: M,
  voices: U,
  selectedVoiceName: m,
  onSelectVoice: O,
  language: G,
  hasRecordedAudio: le,
  audioPreference: L,
  onSelectPreference: C
}) => {
  const [N, V] = se.useState(null);
  if (se.useEffect(() => (r ? document.body.style.overflow = "hidden" : document.body.style.overflow = "unset", () => {
    document.body.style.overflow = "unset";
  }), [r]), !r) return null;
  const B = (J) => {
    window.speechSynthesis.cancel();
    const ue = new SpeechSynthesisUtterance(`Hello, this is my voice in ${G}.`);
    ue.voice = J, ue.lang = J.lang, ue.rate = 1, ue.onstart = () => V(J.name), ue.onend = () => V(null), ue.onerror = () => V(null), window.speechSynthesis.speak(ue);
  };
  return /* @__PURE__ */ s.jsxs("div", { className: "fixed inset-0 z-[100] flex items-center justify-center p-4", children: [
    /* @__PURE__ */ s.jsx(
      "div",
      {
        className: "absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-fade-in",
        onClick: M
      }
    ),
    /* @__PURE__ */ s.jsxs("div", { className: "relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden animate-scale-in border border-slate-100 flex flex-col max-h-[85vh]", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-indigo-50 to-white", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ s.jsx("div", { className: "w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-100", children: /* @__PURE__ */ s.jsx(ml, { size: 22 }) }),
          /* @__PURE__ */ s.jsxs("div", { children: [
            /* @__PURE__ */ s.jsx("h2", { className: "text-xl font-bold text-slate-900", children: "Audio Settings" }),
            /* @__PURE__ */ s.jsxs("p", { className: "text-xs text-slate-500 font-medium", children: [
              "Select your preferred audio source for ",
              G
            ] })
          ] })
        ] }),
        /* @__PURE__ */ s.jsx(
          "button",
          {
            onClick: M,
            className: "p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400 hover:text-slate-600",
            children: /* @__PURE__ */ s.jsx(sv, { size: 20 })
          }
        )
      ] }),
      /* @__PURE__ */ s.jsxs("div", { className: "p-4 overflow-y-auto space-y-2 custom-scrollbar", children: [
        le && /* @__PURE__ */ s.jsxs(
          "div",
          {
            onClick: () => C("recorded"),
            className: `
                group relative p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between
                ${L === "recorded" ? "border-emerald-600 bg-emerald-50/50 ring-4 ring-emerald-50" : "border-slate-100 bg-white hover:border-emerald-200 hover:bg-slate-50"}
              `,
            children: [
              /* @__PURE__ */ s.jsxs("div", { className: "flex items-center gap-4 flex-1 min-w-0", children: [
                /* @__PURE__ */ s.jsx("div", { className: `
                  w-10 h-10 rounded-xl flex items-center justify-center shrink-0
                  ${L === "recorded" ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-500 group-hover:bg-white"}
                `, children: /* @__PURE__ */ s.jsx(ml, { size: 20 }) }),
                /* @__PURE__ */ s.jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ s.jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ s.jsx("span", { className: `font-bold truncate ${L === "recorded" ? "text-emerald-900" : "text-slate-700"}`, children: "Recorded Audio" }),
                    /* @__PURE__ */ s.jsx("span", { className: "text-[10px] font-black tracking-tighter text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded uppercase", children: "OFFICIAL" })
                  ] }),
                  /* @__PURE__ */ s.jsx("p", { className: "text-[10px] text-slate-400 font-medium uppercase tracking-wider text-wrap leading-tight", children: "High Quality" })
                ] })
              ] }),
              L === "recorded" && /* @__PURE__ */ s.jsx(Zd, { size: 20, className: "text-emerald-600 ml-3 shrink-0" })
            ]
          }
        ),
        U.length > 0 && le && /* @__PURE__ */ s.jsx("div", { className: "pt-2 pb-1", children: /* @__PURE__ */ s.jsx("p", { className: "text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-2", children: "System TTS Voices" }) }),
        U.length === 0 ? /* @__PURE__ */ s.jsxs("div", { className: "py-12 text-center text-wrap", children: [
          /* @__PURE__ */ s.jsx(Kd, { className: "w-12 h-12 text-slate-200 mx-auto mb-3" }),
          /* @__PURE__ */ s.jsxs("p", { className: "text-slate-500 font-medium", children: [
            "No system voices found for ",
            G
          ] })
        ] }) : U.map((J) => {
          const ue = L === "tts" && J.name === m, he = J.name.toLowerCase().includes("natural") || J.name.toLowerCase().includes("google") || J.name.toLowerCase().includes("enhanced");
          return /* @__PURE__ */ s.jsxs(
            "div",
            {
              onClick: () => {
                O(J.name), C("tts");
              },
              className: `
                    group relative p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between
                    ${ue ? "border-indigo-600 bg-indigo-50/50 ring-4 ring-indigo-50" : "border-slate-100 bg-white hover:border-indigo-200 hover:bg-slate-50"}
                  `,
              children: [
                /* @__PURE__ */ s.jsxs("div", { className: "flex items-center gap-4 flex-1 min-w-0", children: [
                  /* @__PURE__ */ s.jsx("div", { className: `
                      w-10 h-10 rounded-xl flex items-center justify-center shrink-0
                      ${ue ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-500 group-hover:bg-white"}
                    `, children: ue ? /* @__PURE__ */ s.jsx(Zd, { size: 20 }) : /* @__PURE__ */ s.jsx(Kd, { size: 20 }) }),
                  /* @__PURE__ */ s.jsxs("div", { className: "flex-1 min-w-0", children: [
                    /* @__PURE__ */ s.jsxs("div", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ s.jsx("span", { className: `font-bold truncate ${ue ? "text-indigo-900" : "text-slate-700"}`, children: J.name.replace(/Microsoft |Google /g, "") }),
                      he && /* @__PURE__ */ s.jsx("span", { className: "text-[10px] font-black tracking-tighter text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded uppercase flex items-center gap-0.5", children: "✨ PREMIUM" })
                    ] }),
                    /* @__PURE__ */ s.jsx("p", { className: "text-[10px] text-slate-400 font-medium uppercase tracking-wider leading-tight", children: J.lang })
                  ] })
                ] }),
                /* @__PURE__ */ s.jsx(
                  "button",
                  {
                    onClick: (k) => {
                      k.stopPropagation(), B(J);
                    },
                    disabled: N === J.name,
                    className: `
                      ml-3 p-2 rounded-xl transition-all shrink-0
                      ${N === J.name ? "bg-indigo-600 text-white animate-pulse" : "bg-slate-50 text-slate-400 hover:bg-indigo-100 hover:text-indigo-600"}
                    `,
                    title: "Preview Voice",
                    children: /* @__PURE__ */ s.jsx(Lh, { size: 20 })
                  }
                )
              ]
            },
            J.name
          );
        })
      ] }),
      /* @__PURE__ */ s.jsx("div", { className: "p-6 bg-slate-50 border-t border-slate-100 flex justify-end", children: /* @__PURE__ */ s.jsx(ot, { onClick: M, variant: "primary", className: "rounded-xl px-8", children: "Done" }) })
    ] })
  ] });
}, si = ({ label: r, score: M, total: U }) => /* @__PURE__ */ s.jsxs("div", { className: "bg-white border border-gray-200 rounded p-2 flex justify-between items-center shadow-sm", children: [
  /* @__PURE__ */ s.jsx("span", { className: "text-xs text-gray-600 font-medium truncate mr-2", children: r }),
  /* @__PURE__ */ s.jsxs("span", { className: `text-sm font-bold ${M === U ? "text-green-600" : "text-blue-600"}`, children: [
    M,
    "/",
    U
  ] })
] }), $d = {
  vocabulary: {},
  fillBlanks: {},
  comprehension: {},
  scrambled: {},
  writing: {}
}, Fd = {
  vocabularyChecked: !1,
  fillBlanksChecked: !1,
  comprehensionCompleted: !1,
  scrambledCompleted: !1
}, yv = ({ lesson: r }) => {
  const M = `lesson-progress-${r.id}`, U = () => {
    try {
      const T = localStorage.getItem(M);
      if (T)
        return JSON.parse(T).answers ?? $d;
    } catch (T) {
      console.warn("Failed to read saved answers:", T);
    }
    return $d;
  }, m = () => {
    try {
      const T = localStorage.getItem(M);
      if (T)
        return JSON.parse(T).studentName ?? "";
    } catch {
    }
    return "";
  }, O = () => {
    try {
      const T = localStorage.getItem(M);
      if (T)
        return JSON.parse(T).completionStates ?? Fd;
    } catch {
    }
    return Fd;
  }, [G, le] = se.useState(U), [L, C] = se.useState(O), [N, V] = se.useState(!1), [B, J] = se.useState(m), [ue, he] = se.useState(!1), [k, Y] = se.useState(!1), [ae, _e] = se.useState(""), ce = Vn.useRef(null), W = Vn.useRef(null), de = Vn.useRef(!1), [ve, P] = se.useState({ status: "stopped", rate: 1 }), [Le, ft] = se.useState([]), [Ze, $e] = se.useState(null), [Fe, ne] = se.useState(!1), [pe, fe] = se.useState(!1), [S, R] = se.useState(r.audioFileUrl ? "recorded" : "tts"), I = r.title || r.content.title;
  se.useEffect(() => {
    const T = () => {
      const H = Uf(r.language), K = Ch(H);
      ft(K);
      const Q = /android|iphone|ipad|ipod/i.test(navigator.userAgent.toLowerCase());
      if (ne(Q), !de.current) {
        const me = Id(H);
        me && $e(me.name);
      }
    };
    return T(), window.speechSynthesis.onvoiceschanged !== void 0 && (window.speechSynthesis.onvoiceschanged = T), () => {
      window.speechSynthesis.cancel(), W.current && (W.current.pause(), W.current = null), window.speechSynthesis.onvoiceschanged !== void 0 && (window.speechSynthesis.onvoiceschanged = null);
    };
  }, [r.language]), se.useEffect(() => {
    try {
      localStorage.setItem(M, JSON.stringify({ answers: G, studentName: B, completionStates: L }));
    } catch (T) {
      console.warn("Failed to save progress:", T);
    }
  }, [G, B, L]);
  const Ne = (T) => {
    const H = window.speechSynthesis;
    if (r.audioFileUrl && S === "recorded") {
      W.current || (W.current = new Audio(r.audioFileUrl), W.current.onended = () => {
        P((Q) => ({ ...Q, status: "stopped" }));
      });
      const K = W.current;
      if (ve.rate === T && ve.status !== "stopped") {
        ve.status === "playing" ? (K.pause(), P((Q) => ({ ...Q, status: "paused" }))) : (K.play(), P((Q) => ({ ...Q, status: "playing" })));
        return;
      }
      H.cancel(), K.pause(), K.currentTime = 0, K.playbackRate = T, K.play().then(() => {
        P({ status: "playing", rate: T });
      }).catch((Q) => {
        console.error("Audio playback failed, falling back to TTS:", Q), R("tts"), v(T);
      }), ce.current && Xd(ce.current);
      return;
    }
    v(T);
  }, v = (T) => {
    const H = window.speechSynthesis;
    if (ve.rate === T && ve.status !== "stopped") {
      ve.status === "playing" ? (H.pause(), P((me) => ({ ...me, status: "paused" }))) : (H.resume(), P((me) => ({ ...me, status: "playing" })));
      return;
    }
    H.cancel(), W.current && W.current.pause();
    const K = new SpeechSynthesisUtterance(r.content.readingText), Q = Uf(r.language);
    if (K.lang = Q, K.rate = T, Ze) {
      const Me = H.getVoices().find((qe) => qe.name === Ze);
      Me && (K.voice = Me);
    }
    K.onend = () => {
      P((me) => ({ ...me, status: "stopped" }));
    }, H.speak(K), P({ status: "playing", rate: T }), ce.current && Xd(ce.current);
  }, c = se.useMemo(
    () => ri([...r.content.activities.vocabulary.items]),
    [r.content.activities.vocabulary.items]
  ), y = se.useMemo(() => r.content.activities.scrambled.map((T) => {
    const H = T.answer.replace(/[.!?]+$/, "").split(/\s+/).filter((Q) => Q), K = ri([...H]);
    return {
      ...T,
      scrambledText: K.join(" / ")
    };
  }), [r.content.activities.scrambled]), z = (T, H) => {
    le((K) => ({ ...K, [T]: H }));
  }, A = () => {
    window.print();
  }, D = async () => {
    const T = r.content.readingText, K = {
      English: "en",
      French: "fr",
      Spanish: "es",
      German: "de"
    }[r.language] || "auto";
    try {
      await navigator.clipboard.writeText(T);
    } catch (me) {
      console.warn("Failed to copy to clipboard:", me);
    }
    if (/android/i.test(navigator.userAgent)) {
      const me = `intent://translate.google.com/?sl=${K}&text=${encodeURIComponent(T)}&op=translate#Intent;scheme=https;package=com.google.android.apps.translate;end`, Me = window.open(me, "_blank");
      setTimeout(() => {
        (!Me || Me.closed) && window.open(`https://translate.google.com/?sl=${K}&text=${encodeURIComponent(T)}&op=translate`, "_blank");
      }, 1e3);
    } else
      window.open(`https://translate.google.com/?sl=${K}&text=${encodeURIComponent(T)}&op=translate`, "_blank");
  }, q = (T) => {
    const H = T.replace(/^[.,!?;:"'()\[\]{}]+|[.,!?;:"'()\[\]{}]+$/g, "");
    H && dl(H, r.language, 0.7, Ze);
  }, w = (T) => T ? T.split(/(\s+)/).map((K, Q) => {
    if (/^\s+$/.test(K)) return K;
    const me = K.split(/([.,!?;:"'()\[\]{}]+)/).filter(Boolean);
    return /* @__PURE__ */ s.jsx(Vn.Fragment, { children: me.map((Me, qe) => /^[.,!?;:"'()\[\]{}]+$/.test(Me) ? /* @__PURE__ */ s.jsx("span", { children: Me }, qe) : /* @__PURE__ */ s.jsx(
      "span",
      {
        onClick: () => q(Me),
        className: "cursor-pointer hover:text-indigo-600 hover:bg-indigo-100/50 rounded transition-colors",
        title: "Click to hear pronunciation",
        children: Me
      },
      qe
    )) }, Q);
  }) : null, $ = () => r.isVideoLesson || !r.videoUrl ? null : /* @__PURE__ */ s.jsxs("section", { className: "bg-white p-6 rounded-xl shadow-sm border border-indigo-100 mb-8 text-center animate-fade-in print:hidden", children: [
    /* @__PURE__ */ s.jsx("div", { className: "inline-flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-full mb-4", children: /* @__PURE__ */ s.jsx(iv, { className: "w-6 h-6 text-indigo-600" }) }),
    /* @__PURE__ */ s.jsx("h2", { className: "text-2xl font-bold text-indigo-900 mb-2", children: "Explore Further" }),
    /* @__PURE__ */ s.jsx("p", { className: "text-gray-600 mb-6 text-lg", children: "Want to learn more about this topic? Watch this video to dive deeper!" }),
    /* @__PURE__ */ s.jsx(
      "a",
      {
        href: r.videoUrl,
        target: "_blank",
        rel: "noopener noreferrer",
        className: "inline-flex items-center gap-2 bg-indigo-600 text-white px-8 py-3 rounded-full font-bold hover:bg-indigo-700 transform hover:scale-105 transition-all shadow-md",
        children: "Watch Video on YouTube"
      }
    )
  ] }), te = () => {
    let T = 0;
    const H = r.content.activities.vocabulary.items.length;
    r.content.activities.vocabulary.items.forEach((Ie, Ye) => {
      const Yl = r.content.activities.vocabulary.definitions.findIndex((Ka) => Ka.id === Ie.answer), Za = String.fromCharCode(97 + Yl);
      (G.vocabulary[`vocab_${Ye}`] || "").toLowerCase() === Za && T++;
    });
    let K = 0;
    const Q = r.content.activities.fillInTheBlanks.length;
    r.content.activities.fillInTheBlanks.forEach((Ie, Ye) => {
      St(G.fillBlanks[Ye] || "") === St(Ie.answer) && K++;
    });
    let me = 0;
    const Me = r.content.activities.comprehension.questions.length;
    r.content.activities.comprehension.questions.forEach((Ie, Ye) => {
      G.comprehension[Ye] === Ie.answer && me++;
    });
    let qe = 0;
    const dt = r.content.activities.scrambled.length;
    return r.content.activities.scrambled.forEach((Ie, Ye) => {
      St(G.scrambled[Ye] || "") === St(Ie.answer) && qe++;
    }), {
      vocab: { score: T, total: H },
      fill: { score: K, total: Q },
      comp: { score: me, total: Me },
      scrambled: { score: qe, total: dt },
      totalScore: T + K + me + qe,
      maxScore: H + Q + Me + dt
    };
  }, Ee = () => {
    if (!B.trim()) return;
    typeof document < "u" && document.activeElement instanceof HTMLElement && document.activeElement.blur(), he(!0);
    const T = /* @__PURE__ */ new Date(), H = T.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }), K = T.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: !0 });
    _e(`${H}, ${K}`), V(!0), setTimeout(() => {
      try {
        hv({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (Q) {
        console.warn("Confetti failed:", Q);
      }
    }, 200);
  };
  if (N) {
    const T = te();
    return /* @__PURE__ */ s.jsxs("div", { className: "max-w-md mx-auto p-4 bg-white rounded-lg shadow-lg border-t-4 border-blue-600 animate-fade-in my-4 print:hidden", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "flex justify-between items-start mb-3 pb-2 border-b border-gray-100", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "pr-4", children: [
          /* @__PURE__ */ s.jsx("h2", { className: "text-xl font-bold text-blue-900 leading-tight", children: "Report Card" }),
          /* @__PURE__ */ s.jsx("div", { className: "text-xs text-gray-500 mt-1 leading-tight", children: I })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "text-right whitespace-nowrap", children: [
          /* @__PURE__ */ s.jsxs("div", { className: "text-3xl font-bold text-blue-600 leading-none", children: [
            T.totalScore,
            /* @__PURE__ */ s.jsxs("span", { className: "text-lg text-gray-400", children: [
              "/",
              T.maxScore
            ] })
          ] }),
          /* @__PURE__ */ s.jsx("div", { className: "text-[10px] text-gray-400 uppercase tracking-wide font-bold mt-1", children: "Total Score" })
        ] })
      ] }),
      /* @__PURE__ */ s.jsxs("div", { className: "bg-gray-50 rounded-lg p-2.5 mb-3 flex justify-between items-center text-sm border border-gray-100", children: [
        /* @__PURE__ */ s.jsxs("div", { children: [
          /* @__PURE__ */ s.jsx("div", { className: "text-[10px] text-gray-500 uppercase font-bold", children: "Student" }),
          /* @__PURE__ */ s.jsx("div", { className: "font-bold text-gray-800 text-sm", children: B || "Anonymous" })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "text-right", children: [
          /* @__PURE__ */ s.jsx("div", { className: "text-[10px] text-gray-500 uppercase font-bold", children: "Date" }),
          /* @__PURE__ */ s.jsx("div", { className: "font-medium text-gray-800 text-xs", children: ae })
        ] })
      ] }),
      /* @__PURE__ */ s.jsxs("div", { className: "grid grid-cols-2 gap-2 mb-3", children: [
        /* @__PURE__ */ s.jsx(si, { label: "Vocabulary", score: T.vocab.score, total: T.vocab.total }),
        /* @__PURE__ */ s.jsx(si, { label: "Fill Blanks", score: T.fill.score, total: T.fill.total }),
        /* @__PURE__ */ s.jsx(si, { label: "Comprehension", score: T.comp.score, total: T.comp.total }),
        /* @__PURE__ */ s.jsx(si, { label: "Scrambled", score: T.scrambled.score, total: T.scrambled.total })
      ] }),
      r.content.activities.writtenExpression.questions.length > 0 && /* @__PURE__ */ s.jsxs("div", { className: "border-t border-gray-100 pt-2 mb-2", children: [
        /* @__PURE__ */ s.jsx("h3", { className: "font-bold text-gray-700 text-[10px] uppercase mb-2 tracking-wider", children: "Written Responses" }),
        /* @__PURE__ */ s.jsx("div", { className: "space-y-2", children: r.content.activities.writtenExpression.questions.map((H, K) => /* @__PURE__ */ s.jsxs("div", { className: "text-sm", children: [
          /* @__PURE__ */ s.jsxs("p", { className: "font-semibold text-blue-800 text-xs mb-1 line-clamp-2 leading-tight", children: [
            K + 1,
            ". ",
            H.text
          ] }),
          /* @__PURE__ */ s.jsx("p", { className: "text-gray-600 text-xs pl-2 border-l-2 border-blue-200 italic bg-gray-50 p-1.5 rounded-r leading-snug", children: G.writing[K] || "No answer provided" })
        ] }, K)) })
      ] }),
      /* @__PURE__ */ s.jsx("div", { className: "mt-3 text-center", children: /* @__PURE__ */ s.jsx("p", { className: "text-[12px] text-gray-600 italic", children: "Take a screenshot to send to your teacher." }) }),
      /* @__PURE__ */ s.jsx("div", { className: "mt-4 flex justify-center gap-2 print:hidden", children: /* @__PURE__ */ s.jsx(ot, { onClick: () => V(!1), size: "sm", children: "Back to Lesson" }) }),
      /* @__PURE__ */ s.jsx("div", { className: "mt-8", children: $() })
    ] });
  }
  return /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
    /* @__PURE__ */ s.jsxs("div", { className: "max-w-4xl mx-auto pb-20 print:hidden", children: [
      /* @__PURE__ */ s.jsxs("header", { className: "mb-8 text-center", children: [
        /* @__PURE__ */ s.jsx("h1", { className: "text-3xl md:text-4xl font-bold text-blue-900 mb-2", children: I }),
        /* @__PURE__ */ s.jsxs("div", { className: "flex items-center justify-center gap-4 text-gray-600", children: [
          /* @__PURE__ */ s.jsx("span", { className: "bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-bold", children: r.level }),
          /* @__PURE__ */ s.jsxs("button", { onClick: A, className: "flex items-center hover:text-blue-600 transition-colors", children: [
            /* @__PURE__ */ s.jsx(tv, { className: "w-4 h-4 mr-1" }),
            " Print"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ s.jsxs("section", { className: "bg-white p-6 rounded-xl shadow-sm border border-indigo-100 mb-8", children: [
        /* @__PURE__ */ s.jsx("div", { translate: "no", children: /* @__PURE__ */ s.jsx("h2", { className: "text-xl font-bold text-indigo-900 mb-4", children: "Reading Passage" }) }),
        r.isVideoLesson && r.videoUrl && /* @__PURE__ */ s.jsx("div", { className: "relative pt-[56.25%] mb-6 rounded-lg overflow-hidden bg-black shadow-md", children: /* @__PURE__ */ s.jsx(
          "iframe",
          {
            className: "absolute top-0 left-0 w-full h-full",
            src: r.videoUrl.replace("watch?v=", "embed/").replace("youtu.be/", "youtube.com/embed/"),
            allowFullScreen: !0
          }
        ) }),
        r.imageUrl && /* @__PURE__ */ s.jsx("div", { className: "w-full flex justify-center mb-6", children: /* @__PURE__ */ s.jsx(
          "img",
          {
            src: r.imageUrl,
            alt: "Lesson topic",
            className: "w-full h-auto max-h-[500px] object-contain rounded-lg shadow-sm"
          }
        ) }),
        /* @__PURE__ */ s.jsxs("div", { className: "flex flex-wrap gap-2 mb-4 justify-end", children: [
          /* @__PURE__ */ s.jsxs(ot, { size: "sm", variant: "secondary", onClick: D, title: "Translate via Google", children: [
            /* @__PURE__ */ s.jsx(Wh, { className: "w-4 h-4 mr-2" }),
            " Translate"
          ] }),
          Va() ? /* @__PURE__ */ s.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
            Le.length > 0 && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
              /* @__PURE__ */ s.jsxs(
                ot,
                {
                  size: "sm",
                  variant: "secondary",
                  onClick: () => fe(!0),
                  className: "flex items-center gap-2",
                  title: "Select TTS Voice",
                  children: [
                    /* @__PURE__ */ s.jsx(Fh, { className: "w-4 h-4" }),
                    /* @__PURE__ */ s.jsx("span", { className: "hidden sm:inline", children: "Voice" })
                  ]
                }
              ),
              /* @__PURE__ */ s.jsx(
                vv,
                {
                  isOpen: pe,
                  onClose: () => fe(!1),
                  voices: Le,
                  selectedVoiceName: Ze,
                  onSelectVoice: (T) => {
                    de.current = !0, $e(T);
                  },
                  language: r.language,
                  hasRecordedAudio: !!r.audioFileUrl,
                  audioPreference: S,
                  onSelectPreference: (T) => {
                    de.current = !0, R(T), window.speechSynthesis.cancel(), W.current && W.current.pause(), P((H) => ({ ...H, status: "stopped" }));
                  }
                }
              )
            ] }),
            /* @__PURE__ */ s.jsx(ot, { size: "sm", variant: "secondary", onClick: () => Ne(0.6), children: ve.rate === 0.6 && ve.status === "playing" ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
              /* @__PURE__ */ s.jsx(Jd, { className: "w-4 h-4 mr-2" }),
              " Pause"
            ] }) : ve.rate === 0.6 && ve.status === "paused" ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
              /* @__PURE__ */ s.jsx(kd, { className: "w-4 h-4 mr-2" }),
              " Resume"
            ] }) : /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
              /* @__PURE__ */ s.jsx(l0, { className: "w-4 h-4 mr-2" }),
              " Slow"
            ] }) }),
            /* @__PURE__ */ s.jsx(ot, { size: "sm", variant: "secondary", onClick: () => Ne(1), children: ve.rate === 1 && ve.status === "playing" ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
              /* @__PURE__ */ s.jsx(Jd, { className: "w-4 h-4 mr-2" }),
              " Pause"
            ] }) : ve.rate === 1 && ve.status === "paused" ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
              /* @__PURE__ */ s.jsx(kd, { className: "w-4 h-4 mr-2" }),
              " Resume"
            ] }) : /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
              /* @__PURE__ */ s.jsx(ml, { className: "w-4 h-4 mr-2" }),
              " Listen"
            ] }) })
          ] }) : /* @__PURE__ */ s.jsxs("div", { className: "flex items-center gap-2 bg-yellow-50 p-2 rounded border border-yellow-200", children: [
            /* @__PURE__ */ s.jsx("span", { className: "text-xs text-yellow-800", children: "⚠️ Audio unavailable." }),
            Ld(r.id) ? /* @__PURE__ */ s.jsx("a", { href: Ld(r.id), className: "text-xs font-bold text-blue-600 underline", children: "Open in Chrome" }) : /* @__PURE__ */ s.jsx("span", { className: "text-xs text-gray-500", children: "Please use Chrome or Safari." })
          ] })
        ] }),
        /* @__PURE__ */ s.jsx(
          "div",
          {
            ref: ce,
            className: "prose max-w-none font-serif text-2xl md:text-2xl leading-relaxed text-gray-800 bg-indigo-50/50 p-6 rounded-lg whitespace-pre-line",
            translate: "no",
            children: w(r.content.readingText)
          }
        )
      ] }),
      /* @__PURE__ */ s.jsx(
        rv,
        {
          data: r.content.activities.vocabulary,
          language: r.language,
          savedAnswers: G.vocabulary,
          onChange: (T) => z("vocabulary", T),
          voiceName: Ze,
          savedIsChecked: L.vocabularyChecked,
          onComplete: () => C((T) => ({ ...T, vocabularyChecked: !0 }))
        }
      ),
      /* @__PURE__ */ s.jsx(
        ov,
        {
          data: r.content.activities.fillInTheBlanks,
          vocabItems: r.content.activities.vocabulary.items,
          level: r.level.replace("Level ", ""),
          language: r.language,
          savedAnswers: G.fillBlanks,
          onChange: (T) => z("fillBlanks", T),
          voiceName: Ze,
          savedIsChecked: L.fillBlanksChecked,
          onComplete: () => C((T) => ({ ...T, fillBlanksChecked: !0 }))
        }
      ),
      /* @__PURE__ */ s.jsx(
        dv,
        {
          data: r.content.activities.comprehension,
          readingText: r.content.readingText,
          language: r.language,
          savedAnswers: G.comprehension,
          onChange: (T) => z("comprehension", T),
          voiceName: Ze,
          savedIsCompleted: L.comprehensionCompleted,
          onComplete: () => C((T) => ({ ...T, comprehensionCompleted: !0 }))
        }
      ),
      /* @__PURE__ */ s.jsx(
        mv,
        {
          data: r.content.activities.scrambled,
          level: r.level.replace("Level ", ""),
          language: r.language,
          savedAnswers: G.scrambled,
          onChange: (T) => z("scrambled", T),
          voiceName: Ze,
          savedIsCompleted: L.scrambledCompleted,
          onComplete: () => C((T) => ({ ...T, scrambledCompleted: !0 }))
        }
      ),
      /* @__PURE__ */ s.jsxs("section", { className: "bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "flex justify-between items-center mb-4", children: [
          /* @__PURE__ */ s.jsx("h2", { className: "text-2xl font-bold text-blue-800", children: "Activity 5: Written Expression" }),
          /* @__PURE__ */ s.jsxs(
            ot,
            {
              variant: "outline",
              size: "sm",
              onClick: () => Y(!k),
              className: "flex items-center gap-2",
              children: [
                k ? /* @__PURE__ */ s.jsx(Vh, { size: 16 }) : /* @__PURE__ */ s.jsx(Kh, { size: 16 }),
                k ? "Hide Examples" : "See Examples"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ s.jsx("p", { className: "text-gray-600 mb-6 text-lg", children: "Answer the questions with 1 or 2 complete sentences." }),
        k && r.content.activities.writtenExpression.examples && /* @__PURE__ */ s.jsx("div", { className: "mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg animate-fade-in", children: /* @__PURE__ */ s.jsx(
          "div",
          {
            className: "prose prose-sm text-blue-800",
            dangerouslySetInnerHTML: { __html: r.content.activities.writtenExpression.examples }
          }
        ) }),
        /* @__PURE__ */ s.jsx("div", { className: "space-y-6", children: r.content.activities.writtenExpression.questions.map((T, H) => {
          var K;
          return /* @__PURE__ */ s.jsxs("div", { children: [
            /* @__PURE__ */ s.jsxs("div", { className: "flex items-start gap-3 mb-2", children: [
              /* @__PURE__ */ s.jsxs("label", { className: "block font-medium text-gray-800 text-lg flex-1", children: [
                H + 1,
                ". ",
                T.text
              ] }),
              /* @__PURE__ */ s.jsx(
                "button",
                {
                  onClick: () => {
                    const Q = G.writing[H], me = Q && Q.trim() ? Q : T.text;
                    dl(me, r.language, 0.7, Ze);
                  },
                  className: "text-gray-400 hover:text-blue-600 transition-colors p-1 shrink-0",
                  title: (K = G.writing[H]) != null && K.trim() ? "Hear your answer" : "Hear question",
                  children: /* @__PURE__ */ s.jsx(ml, { size: 20 })
                }
              )
            ] }),
            /* @__PURE__ */ s.jsx(
              "textarea",
              {
                className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow text-lg",
                rows: 3,
                placeholder: "Your answer...",
                value: G.writing[H] || "",
                onChange: (Q) => z("writing", { ...G.writing, [H]: Q.target.value })
              }
            )
          ] }, H);
        }) })
      ] }),
      /* @__PURE__ */ s.jsxs("section", { className: "bg-indigo-700 p-8 rounded-xl shadow-lg text-white text-center mb-8", children: [
        /* @__PURE__ */ s.jsx("h2", { className: "text-2xl font-bold mb-4", children: ue ? "Update Score" : "Finished?" }),
        /* @__PURE__ */ s.jsxs("div", { className: "max-w-md mx-auto mb-6", children: [
          /* @__PURE__ */ s.jsx("label", { className: "block text-white mb-2 text-sm font-semibold uppercase tracking-wider", children: "Nickname and Student Number" }),
          ue ? /* @__PURE__ */ s.jsx("div", { className: "w-full p-3 rounded-lg bg-white text-blue-900 font-bold text-xl shadow-sm", children: B }) : /* @__PURE__ */ s.jsx(
            "input",
            {
              type: "text",
              "aria-label": "Nickname and Student Number",
              className: "w-full p-3 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-400 text-lg font-semibold",
              placeholder: "Jake 01",
              value: B,
              onChange: (T) => J(T.target.value)
            }
          )
        ] }),
        /* @__PURE__ */ s.jsx(
          "button",
          {
            onClick: Ee,
            disabled: !B.trim(),
            className: "bg-white text-blue-800 border border-blue-800 font-bold py-3 px-8 rounded-full shadow-lg hover:bg-gray-100 transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed",
            children: ue ? "See Updated Report Card" : "See My Score"
          }
        )
      ] }),
      $()
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: "hidden print:block font-serif text-black max-w-[210mm] mx-auto p-4", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "flex justify-between items-end mb-4 border-b border-gray-400 pb-2", children: [
        /* @__PURE__ */ s.jsxs("div", { children: [
          /* @__PURE__ */ s.jsx("h1", { className: "text-xl font-bold leading-tight", children: I }),
          /* @__PURE__ */ s.jsx("p", { className: "text-xs text-gray-600", children: r.level })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "text-right text-xs", children: [
          /* @__PURE__ */ s.jsx("p", { className: "mb-2", children: "Name: _______________________________" }),
          /* @__PURE__ */ s.jsx("p", { children: "Date: _______________________________" })
        ] })
      ] }),
      /* @__PURE__ */ s.jsxs("div", { className: "mb-6", children: [
        r.imageUrl && /* @__PURE__ */ s.jsx(
          "img",
          {
            src: r.imageUrl,
            className: "h-32 object-contain mx-auto mb-3",
            alt: "Lesson"
          }
        ),
        /* @__PURE__ */ s.jsx("div", { className: "text-xs text-justify leading-snug columns-2 gap-6 whitespace-pre-line", children: r.content.readingText })
      ] }),
      /* @__PURE__ */ s.jsxs("div", { className: "space-y-5", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "break-inside-avoid", children: [
          /* @__PURE__ */ s.jsx("h2", { className: "font-bold text-sm mb-2 border-b border-gray-300 pb-1", children: "1. Vocabulary" }),
          /* @__PURE__ */ s.jsxs("div", { className: "grid grid-cols-2 gap-4 text-xs", children: [
            /* @__PURE__ */ s.jsxs("div", { children: [
              /* @__PURE__ */ s.jsx("p", { className: "font-bold mb-1 text-[10px] text-gray-500 uppercase", children: "Definitions" }),
              r.content.activities.vocabulary.definitions.map((T, H) => /* @__PURE__ */ s.jsxs("div", { className: "mb-1", children: [
                /* @__PURE__ */ s.jsxs("span", { className: "font-bold mr-1", children: [
                  String.fromCharCode(97 + H),
                  "."
                ] }),
                T.text
              ] }, T.id))
            ] }),
            /* @__PURE__ */ s.jsxs("div", { children: [
              /* @__PURE__ */ s.jsx("p", { className: "font-bold mb-1 text-[10px] text-gray-500 uppercase", children: "Words" }),
              c.map((T) => /* @__PURE__ */ s.jsxs("div", { className: "mb-1", children: [
                /* @__PURE__ */ s.jsx("span", { className: "inline-block w-8 border-b border-black mr-2" }),
                " ",
                T.label
              ] }, T.label))
            ] })
          ] })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "break-inside-avoid", children: [
          /* @__PURE__ */ s.jsx("h2", { className: "font-bold text-sm mb-2 border-b border-gray-300 pb-1", children: "2. Fill in the Blanks" }),
          /* @__PURE__ */ s.jsx("div", { className: "grid grid-cols-2 gap-x-6 gap-y-2 text-xs", children: r.content.activities.fillInTheBlanks.map((T, H) => /* @__PURE__ */ s.jsxs("div", { children: [
            H + 1,
            ". ",
            T.before,
            " ",
            /* @__PURE__ */ s.jsx("span", { className: "inline-block w-16 border-b border-black" }),
            " ",
            T.after
          ] }, H)) })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "break-inside-avoid", children: [
          /* @__PURE__ */ s.jsx("h2", { className: "font-bold text-sm mb-2 border-b border-gray-300 pb-1", children: "3. Comprehension" }),
          /* @__PURE__ */ s.jsx("div", { className: "grid grid-cols-2 gap-x-6 gap-y-2 text-xs", children: r.content.activities.comprehension.questions.map((T, H) => /* @__PURE__ */ s.jsxs("div", { children: [
            H + 1,
            ". ",
            T.text,
            " ",
            /* @__PURE__ */ s.jsx("span", { className: "ml-2 whitespace-nowrap", children: "[ ] True [ ] False" })
          ] }, H)) })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "break-inside-avoid", children: [
          /* @__PURE__ */ s.jsx("h2", { className: "font-bold text-sm mb-2 border-b border-gray-300 pb-1", children: "4. Scrambled Sentences" }),
          /* @__PURE__ */ s.jsx("div", { className: "text-xs space-y-3", children: y.map((T, H) => /* @__PURE__ */ s.jsxs("div", { children: [
            /* @__PURE__ */ s.jsxs("p", { className: "italic mb-1", children: [
              H + 1,
              ". ",
              T.scrambledText
            ] }),
            /* @__PURE__ */ s.jsx("div", { className: "border-b border-gray-300 h-4 w-full" })
          ] }, H)) })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "break-inside-avoid", children: [
          /* @__PURE__ */ s.jsx("h2", { className: "font-bold text-sm mb-2 border-b border-gray-300 pb-1", children: "5. Written Expression" }),
          /* @__PURE__ */ s.jsx("div", { className: "text-xs space-y-4", children: r.content.activities.writtenExpression.questions.map((T, H) => /* @__PURE__ */ s.jsxs("div", { children: [
            /* @__PURE__ */ s.jsxs("p", { className: "font-semibold mb-1", children: [
              H + 1,
              ". ",
              T.text
            ] }),
            /* @__PURE__ */ s.jsx("div", { className: "border-b border-gray-300 h-4 w-full mb-2" }),
            /* @__PURE__ */ s.jsx("div", { className: "border-b border-gray-300 h-4 w-full" })
          ] }, H)) })
        ] })
      ] }),
      /* @__PURE__ */ s.jsx("div", { className: "mt-8 text-center text-[10px] text-gray-400", children: "worksheets.teacherjake.com" })
    ] })
  ] });
};
class gv extends HTMLElement {
  constructor() {
    super(...arguments), this.root = null, this.mountPoint = null;
  }
  connectedCallback() {
    this.render();
  }
  render() {
    let M = "";
    const U = this.querySelector('script[type="application/json"]');
    if (U ? M = U.textContent || "" : this.mountPoint || (M = this.textContent || ""), !(!M.trim() && !this.mountPoint))
      try {
        let m;
        if (M.trim()) {
          const O = JSON.parse(M.trim());
          m = {
            id: O.id,
            title: O.title,
            level: O.level,
            language: O.language,
            tags: O.tags || [],
            created: O.created,
            updated: O.updated,
            imageUrl: O.image ? O.image : void 0,
            audioFileUrl: O.audioFile ? O.audioFile : void 0,
            isVideoLesson: O.isVideoLesson,
            videoUrl: O.videoUrl,
            content: O.content,
            image: O.image || "",
            collectionId: O.collectionId || "",
            collectionName: O.collectionName || ""
          };
        }
        this.mountPoint || (this.innerHTML = "", this.mountPoint = document.createElement("div"), this.mountPoint.className = "tj-worksheet-wrapper", this.appendChild(this.mountPoint)), !this.root && this.mountPoint && (this.root = Ah.createRoot(this.mountPoint)), this.root && m && this.root.render(
          /* @__PURE__ */ s.jsx(Vn.StrictMode, { children: /* @__PURE__ */ s.jsx(yv, { lesson: m }) })
        );
      } catch (m) {
        console.error("TJ Worksheet: Failed to parse JSON content or render component", m), this.mountPoint || (this.innerHTML = '<div style="color: red; padding: 1rem; border: 1px solid red;">TJ Worksheet Error: Failed to load worksheet data. Check console for details.</div>');
      }
  }
}
customElements.get("tj-pocketbase-worksheet") || customElements.define("tj-pocketbase-worksheet", gv);
