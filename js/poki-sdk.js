(() => {
  "use strict";
  const e = (e) => {
    const t = RegExp(`[?&]${e}=([^&]*)`).exec(window.location.search);
    return t && decodeURIComponent(t[1].replace(/\+/g, " "));
  },
    t = "kids" === e("tag"),
    o = !!window.adBridge,
    i = "yes" === e("hoist") || "yes" === e("gdhoist"),
    n = (parseInt(e("site_id") || "", 10) || 0) > 0;
  const a = new (class {
    #e = [];
    enqueue(e, o, i, n) {
      const a = { fn: e, args: o || [], resolveFn: i, rejectFn: n };
      t ? i && i(!0) : this.#e.push(a);
    }
    dequeue() {
      for (; this.#e.length > 0;) {
        const e = this.#e.shift(),
          { fn: t, args: o } = e;
        if ("function" == typeof window.PokiSDK[t])
          if (e?.resolveFn || e?.rejectFn) {
            const i = "init" === t;
            if (
              (window.PokiSDK[t](...o)
                .catch((...t) => {
                  ("function" == typeof e.rejectFn && e.rejectFn(...t),
                    i &&
                    setTimeout(() => {
                      this.dequeue();
                    }, 0));
                })
                .then((...t) => {
                  ("function" == typeof e.resolveFn && e.resolveFn(...t),
                    i &&
                    setTimeout(() => {
                      this.dequeue();
                    }, 0));
                }),
                i)
            )
              break;
          } else window.PokiSDK[t](...o);
        else
          console.error(
            `%cPOKI:%c cannot execute ${t}`,
            "font-weight: bold",
            "",
          );
      }
    }
    init = (e = {}) =>
      new Promise((t, o) => {
        this.enqueue("init", [e], t, o);
      });
    rewardedBreak = () =>
      new Promise((e) => {
        e(!1);
      });
    commercialBreak = (e) =>
      new Promise((t, o) => {
        this.enqueue("commercialBreak", [e], t, o);
      });
    displayAd = (e, t, o, i) => {
      (i && i(!0), o && o());
    };
    withArguments =
      (e) =>
        (...t) => {
          this.enqueue(e, t);
        };
    withPromise = (e) => () =>
      new Promise((t, o) => {
        this.enqueue(e, [], t, o);
      });
    handleAutoResolvePromise = () =>
      new Promise((e) => {
        e();
      });
    throwNotLoaded = () => {
      console.debug(
        "PokiSDK is not loaded yet. Not all methods are available.",
      );
    };
    doNothing = () => { };
  })();
  if (
    ((window.PokiSDK = {
      init: a.init,
      initWithVideoHB: a.init,
      commercialBreak: a.commercialBreak,
      rewardedBreak: a.rewardedBreak,
      displayAd: a.displayAd,
      destroyAd: a.doNothing,
      getLeaderboard: a.handleAutoResolvePromise,
      shareableURL: () =>
        new Promise((e, t) => {
          t();
        }),
      getURLParam: (t) => e(`gd${t}`) || e(t) || "",
      getLanguage: () => navigator.language.toLowerCase().split("-")[0],
      getIsoLanguage: () => e("iso_lang") || void 0,
      isAdBlocked: () => { },
      getUser: a.withPromise("getUser"),
      getToken: a.withPromise("getToken"),
      login: a.withPromise("login"),
      generateScreenshot: a.withPromise("generateScreenshot"),
    }),
      [
        "captureError",
        "customEvent",
        "gameInteractive",
        "gameLoadingFinished",
        "gameLoadingProgress",
        "gameLoadingStart",
        "gameplayStart",
        "gameplayStop",
        "happyTime",
        "logError",
        "muteAd",
        "roundEnd",
        "roundStart",
        "sendHighscore",
        "setDebug",
        "setDebugTouchOverlayController",
        "setLogging",
        "setPlayerAge",
        "setPlaytestCanvas",
        "enableEventTracking",
        "openExternalLink",
        "playtestSetCanvas",
        "playtestCaptureHtmlOnce",
        "playtestCaptureHtmlForce",
        "playtestCaptureHtmlOn",
        "playtestCaptureHtmlOff",
        "movePill",
        "showLeaderboard",
      ].forEach((e) => {
        window.PokiSDK[e] = a.withArguments(e);
      }),
      !o && !t)
  )
    try {
      let t = localStorage.getItem("poki_events_user_id");
      t ||
        ((t = crypto.randomUUID()),
          "GB" !== e("country") &&
          localStorage.setItem("poki_events_user_id", t));
      const o = crypto.randomUUID(),
        i = e("game_id"),
        a = e("game_version_id"),
        s = "1" === localStorage.getItem("poki_pbf");
      ((window.PokiSDK.measure = (e, r, d) => {
        if (
          ((e = `${e}`),
            (r = void 0 === r ? "" : `${r}`),
            (d = void 0 === d ? "" : `${d}`),
            (window.pokiMeasureBuildin = !0),
            window.parent.postMessage(
              {
                type: "pokiMessageEvent",
                content: {
                  event: "pokiTrackingMeasure",
                  data: { category: e, action: r, label: d },
                },
              },
              "*",
            ),
            i && a)
        ) {
          const c = {
            category: e,
            action: r,
            label: d,
            p4d_game_id: i,
            p4d_version_id: a,
            time_on_page: Math.floor(performance.now()),
            user_id: t,
            user_new: !s,
            gameplay_id: o,
          };
          n
            ? window.parent.postMessage(
              { type: "pokiMessageSendGameEvent", content: { payload: c } },
              "*",
            )
            : fetch("https://t.poki.io/game-event", {
              method: "POST",
              headers: { "Content-Type": "text/plain" },
              body: JSON.stringify(c),
              mode: "no-cors",
              keepalive: !0,
              credentials: "omit",
            }).catch((e) => {
              console.warn(
                "%cPOKI:%c failed to measure",
                "font-weight: bold",
                "",
                e,
              );
            });
        }
      }),
        window.PokiSDK.measure("game", "loading", "start"),
        (window.pokiMeasureBuildin = !1));
    } catch (e) {
      (console.error(e), (window.PokiSDK.measure = () => { }));
    }
  const s = (() => {
    const n =
      window.pokiSDKVersion ||
      e("ab") ||
      "3fce2865bb932fd00ebb9d50dff946b50b14019e";
    let a = `poki-sdk-core-${n}.js`;
    return (
      t && (a = `poki-sdk-kids-${n}.js`),
      o && (a = `poki-sdk-playground-${n}.js`),
      i && (a = `poki-sdk-hoist-${n}.js`),
      `/js/${a}`
    );
  })(),
    r = document.createElement("script");
  (r.setAttribute("src", s),
    r.setAttribute("type", "text/javascript"),
    r.setAttribute("crossOrigin", "anonymous"),
    (r.onload = () => a.dequeue()),
    document.head.appendChild(r));
})();