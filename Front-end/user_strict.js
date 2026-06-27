"use strict";
(() => {
    var je = Object.defineProperty,
        Xe = Object.defineProperties,
        Ze = Object.getOwnPropertyDescriptors,
        K = Object.getOwnPropertySymbols,
        se = Object.prototype.hasOwnProperty,
        ae = Object.prototype.propertyIsEnumerable,
        ie = (r, n, o) => n in r ? je(r, n, {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: o
        }) : r[n] = o,
        w = (r, n) => {
            for (var o in n || (n = {})) se.call(n, o) && ie(r, o, n[o]);
            if (K)
                for (var o of K(n)) ae.call(n, o) && ie(r, o, n[o]);
            return r
        },
        M = (r, n) => Xe(r, Ze(n)),
        ue = (r, n) => {
            var o = {};
            for (var i in r) se.call(r, i) && n.indexOf(i) < 0 && (o[i] = r[i]);
            if (r != null && K)
                for (var i of K(r)) n.indexOf(i) < 0 && ae.call(r, i) && (o[i] = r[i]);
            return o
        },
        le = (r, n, o) => new Promise((i, a) => {
            var l = f => {
                    try {
                        c(o.next(f))
                    } catch (d) {
                        a(d)
                    }
                },
                u = f => {
                    try {
                        c(o.throw(f))
                    } catch (d) {
                        a(d)
                    }
                },
                c = f => f.done ? i(f.value) : Promise.resolve(f.value).then(l, u);
            c((o = o.apply(r, n)).next())
        });

    function R(r, n) {
        return Math.round(r * n) / n
    }

    function Z(r, n, o, i) {
        let a = (r + (i || "")).toString().includes("%");
        if (typeof r == "string" ? [r, n, o, i] = r.match(/(0?\.?\d+)%?\b/g).map(l => Number(l)) : i !== void 0 && (i = Number.parseFloat(i)), typeof r != "number" || typeof n != "number" || typeof o != "number" || r > 255 || n > 255 || o > 255) throw new TypeError("Expected three numbers below 256");
        if (typeof i == "number") {
            if (!a && i >= 0 && i <= 1) i = Math.round(255 * i);
            else if (a && i >= 0 && i <= 100) i = Math.round(255 * i / 100);
            else throw new TypeError(`Expected alpha value (${i}) as a fraction or percentage`);
            i = (i | 256).toString(16).slice(1)
        } else i = "";
        return (o | n << 8 | r << 16 | 1 << 24).toString(16).slice(1) + i
    }

    function G(r) {
        return typeof r == "object" && r.type === "VARIABLE_ALIAS"
    }

    function U(r) {
        console.warn(r)
    }
    var D = r => r.filter(qe),
        qe = r => r != null;

    function Je(r) {
        if ("a" in r) {
            let o = R(r.a, 100);
            if (o !== 1) return `rgba(${r.r},${r.g},${r.b},${o})`
        }
        let n = Z(r.r, r.g, r.b);
        return n[0] === n[1] && n[2] === n[3] && n[4] === n[5] ? `#${n[0]}${n[2]}${n[4]}` : `#${n}`
    }

    function et(r) {
        let {
            r: n,
            g: o,
            b: i,
            a = 1
        } = r;
        return {
            r: R(n * 255, 1),
            g: R(o * 255, 1),
            b: R(i * 255, 1),
            a
        }
    }

    function H(r) {
        return `${R(r,10)}px`
    }

    function q(r) {
        return `${R(r,10)}%`
    }

    function ce(r) {
        switch (typeof r) {
            case "object":
                if (G(r)) return `var(${r.id})`;
                if ("r" in r) return Je(et(r));
            case "string":
            case "number":
            case "boolean":
            default:
                return String(r)
        }
    }

    function de(r) {
        return "T" + r
    }
    var fe = ["submit", "appear", "mousedown", "mouseenter", "mouseleave", "mouseup", "timeout", "click", "press", "drag", "keydown", "hover"];

    function z(r) {
        if (r) return (...n) => {
            if (!r) return;
            let o = r;
            return r = void 0, o(...n)
        }
    }
    var tt = r => r instanceof HTMLElement || r instanceof SVGElement;

    function nt(r, n) {
        if (!r.parentElement) return;
        let o = new MutationObserver(i => {
            for (let a of i.filter(l => l.type === "childList"))
                for (let l of a.removedNodes) l === r && (n?.(), o.disconnect())
        });
        o.observe(r.parentElement, {
            childList: !0
        })
    }

    function S(r, n) {
        let o = new MutationObserver(i => {
            for (let a of i.filter(l => l.type === "childList"))
                for (let l of a.addedNodes) tt(l) && l.matches(r) && nt(l, n(l))
        });
        return o.observe(document, {
            childList: !0,
            subtree: !0
        }), () => o.disconnect()
    }
    var pe = new Set(["youtube-video", "vimeo-video", "spotify-audio", "jwplayer-video", "videojs-video", "wistia-video", "cloudflare-video", "hls-video", "shaka-video", "dash-video"]);

    function ot(r) {
        return pe.has(r.tagName.toLowerCase()) || r.tagName === "VIDEO"
    }

    function it(r) {
        if (r.tagName !== "IFRAME") return !1;
        let n = r.src;
        return (n.includes("youtube.com") || n.includes("youtube-nocookie.com")) && n.includes("enablejsapi=1")
    }
    var W = class {
        constructor(r) {
            this.iframe = r, this.info = {}, this.messageListener = null, this.loaded = new Promise(n => {
                let o = () => {
                    this.iframe.removeEventListener("load", o), setTimeout(() => {
                        this.requestYoutubeListening()
                    })
                };
                this.iframe.addEventListener("load", o), this.messageListener = i => {
                    if (i.source === this.iframe.contentWindow && i.data) {
                        let a;
                        try {
                            a = JSON.parse(i.data)
                        } catch (l) {
                            console.error("YoutubeController messageListener", l);
                            return
                        }
                        a.event === "onReady" && this.iframe.removeEventListener("load", o), a.info && (Object.assign(this.info, a.info), n(!0))
                    }
                }, window.addEventListener("message", this.messageListener), this.requestYoutubeListening()
            })
        }
        sendYoutubeMessage(r) {
            return le(this, arguments, function*(n, o = []) {
                var i;
                yield this.loaded, (i = this.iframe.contentWindow) == null || i.postMessage(JSON.stringify({
                    event: "command",
                    func: n,
                    args: o
                }), "*")
            })
        }
        requestYoutubeListening() {
            var r;
            (r = this.iframe.contentWindow) == null || r.postMessage(JSON.stringify({
                event: "listening"
            }), "*")
        }
        get muted() {
            return this.info.muted
        }
        get volume() {
            return this.info.volume
        }
        set muted(r) {
            r ? this.sendYoutubeMessage("mute") : this.sendYoutubeMessage("unMute")
        }
        get currentTime() {
            return this.info.currentTime
        }
        set currentTime(r) {
            this.sendYoutubeMessage("seekTo", [r, !0])
        }
        get paused() {
            return this.info.playerState === 2
        }
        play() {
            this.sendYoutubeMessage("playVideo")
        }
        pause() {
            this.sendYoutubeMessage("pauseVideo")
        }
        static from(r) {
            return r.f2w_yt_controller || (r.f2w_yt_controller = new W(r))
        }
    };

    function V(r) {
        if (ot(r)) return r;
        if (it(r)) return W.from(r)
    }

    function me(r) {
        let n = V(r);
        return n ? () => (n.muted = !n.muted, () => {
            n.muted = !n.muted
        }) : () => console.warn("Video element not recognized", r)
    }

    function ge(r) {
        let n = V(r);
        return n ? () => (n.muted = !0, () => {
            n.muted = !1
        }) : () => console.warn("Video element not recognized", r)
    }

    function ye(r) {
        let n = V(r);
        return n ? () => (n.muted = !1, () => {
            n.muted = !0
        }) : () => console.warn("Video element not recognized", r)
    }

    function Ee(r) {
        let n = V(r);
        return n ? () => (n.play(), () => n.pause()) : () => console.warn("Video element not recognized", r)
    }

    function be(r) {
        let n = V(r);
        return n ? () => (n.pause(), () => n.play()) : () => console.warn("Video element not recognized", r)
    }

    function xe(r) {
        let n = V(r);
        return n ? () => (n.paused ? n.play() : n.pause(), () => {
            n.paused ? n.play() : n.pause()
        }) : () => console.warn("Video element not recognized", r)
    }

    function he(r, n) {
        let o = V(r);
        return o ? () => {
            o.currentTime = n
        } : () => console.warn("Video element not recognized", r)
    }

    function Te(r, n) {
        let o = V(r);
        return o ? () => (o.currentTime += n, () => {
            o.currentTime -= n
        }) : () => console.warn("Video element not recognized", r)
    }

    function Ae(r, n) {
        let o = V(r);
        return o ? () => (o.currentTime -= n, () => {
            o.currentTime += n
        }) : () => console.warn("Video element not recognized", r)
    }

    function Ce() {
        let r = navigator.userAgent;
        return r.includes("Safari") && !r.includes("Chrome")
    }

    function ve(r) {
        return r === "absolute" || r === "fixed"
    }
    var st = Ce();

    function at(r, n) {
        if (!n.length) return;
        let [o, i, a] = Ne(n).map(we);
        I(r, o), I(r, i, "::before"), I(r, a, "::after")
    }

    function Ne(r) {
        return [r.filter(n => !n.pseudo), r.filter(n => n.pseudo === "::before"), r.filter(n => n.pseudo === "::after")]
    }

    function Q(r) {
        switch (r) {
            case "width":
            case "height":
            case "top":
            case "left":
            case "right":
            case "bottom":
                return !0;
            default:
                return !1
        }
    }

    function I(r, n, o) {
        !Object.keys(n).length || r.animate(w({
            easing: "linear"
        }, n), {
            pseudoElement: o,
            iterations: 1,
            duration: 0,
            fill: "forwards"
        })
    }

    function J(r) {
        return M(w({}, r), {
            camelKey: r.key.startsWith("--") ? r.key : r.key.replace(/-([a-z])/g, (n, o) => o.toUpperCase())
        })
    }

    function we(r) {
        return Object.fromEntries(r.map(n => [n.camelKey, [n.from, n.to]]))
    }

    function Me(r, n, o) {
        let i = !1;
        for (let a = 0; a < n.length; a++) {
            let l = n[a];
            switch (l.key) {
                case "--f2w-img-src":
                    let u = r.f2w_image_lazy_loader,
                        c = String(l.to);
                    u || (r.f2w_image_lazy_loader = u = new Image, u.decoding = "sync", u.onload = () => {
                        r.decoding = "sync", r.setAttribute("src", c), delete r.f2w_image_lazy_loader
                    }), u.src = c, n.splice(a--, 1);
                    break;
                case "$innerHTML":
                    r.innerHTML = String(l.to), n.splice(a--, 1);
                    break;
                case "background-image":
                    i = !0;
                    break;
                case "overflow":
                    st && (r.style.setProperty(l.key, String(l.to)), n.splice(a--, 1));
                    break
            }
            l.key.startsWith("--f2w-attr-") && (r.setAttribute(l.key.slice(11), String(l.to)), n.splice(a--, 1))
        }
        if (i) {
            let a = Object.fromEntries(n.map((l, u) => ({
                it: l,
                idx: u
            })).filter(({
                it: l
            }) => l.key.startsWith("background-")).map(({
                it: l,
                idx: u
            }) => (n.splice(u, 1), [l.camelKey, String(l.to)])));
            I(r, a)
        }
        o && at(r, n)
    }

    function Y(r, n, o, i, a) {
        let l = r.parentElement,
            u = getComputedStyle(r),
            c = getComputedStyle(l).display,
            f = c.endsWith("flex") || c.endsWith("grid"),
            d = ve(u.position),
            m = n.map(J),
            [y, T, x] = Ne(m).map(we),
            h;
        y.display && (y.display[0] === "none" ? I(r, {
            display: String(y.display[1])
        }) : y.display[1] === "none" && f && !d && I(r, {
            display: "none"
        }), h = String(y.display[1]), delete y.display);
        let A = +getComputedStyle(r).getPropertyValue("--f2w-order");
        if (y["--f2w-order"]) {
            let s = y["--f2w-order"][1];
            A = s === void 0 ? NaN : +s, isNaN(A) || r.style.setProperty("--f2w-order", String(A)), delete y["--f2w-order"]
        }
        isNaN(A) || a.add(l);
        for (let [s, v] of [
                ["before", T],
                ["after", x]
            ]) v.display && (v.display[1] === "none" ? (r.classList.remove(s + "-visible"), r.classList.add(s + "-hidden")) : (r.classList.remove(s + "-hidden"), r.classList.add(s + "-visible")));
        let E = (s, v, N = !1) => {
                if (!(!N && !Object.keys(s).length)) return r.animate(w({
                    easing: o
                }, s), {
                    pseudoElement: v,
                    iterations: 1,
                    duration: i,
                    fill: "both"
                })
            },
            g = E(y, void 0, !!h);
        h && g.finished.then(() => {
            r.style.display = h
        }), E(T, "::before"), E(x, "::after")
    }

    function Le(r, n, o) {
        if (o.direction === "LEFT") {
            if (n === "BOTTOM_LEFT" || n === "TOP_LEFT") return [{
                eltId: r,
                props: [{
                    key: "left",
                    from: "100%",
                    to: "0%"
                }]
            }];
            if (n === "BOTTOM_RIGHT" || n === "TOP_RIGHT") return [{
                eltId: r,
                props: [{
                    key: "translate",
                    from: "100% 0px",
                    to: "0px 0px"
                }]
            }];
            {
                let i = n === "CENTER" ? "-50%" : "0px";
                return [{
                    eltId: r,
                    props: [{
                        key: "left",
                        from: "100%",
                        to: "50%"
                    }, {
                        key: "translate",
                        from: `0px ${i}`,
                        to: `-50% ${i}`
                    }]
                }]
            }
        } else if (o.direction === "RIGHT") {
            if (n === "BOTTOM_LEFT" || n === "TOP_LEFT") return [{
                eltId: r,
                props: [{
                    key: "translate",
                    from: "-100% 0px",
                    to: "0px 0px"
                }]
            }];
            if (n === "BOTTOM_RIGHT" || n === "TOP_RIGHT") return [{
                eltId: r,
                props: [{
                    key: "right",
                    from: "100%",
                    to: "0px"
                }]
            }];
            {
                let i = n === "CENTER" ? "-50%" : "0px";
                return [{
                    eltId: r,
                    props: [{
                        key: "left",
                        from: "0px",
                        to: "50%"
                    }, {
                        key: "translate",
                        from: `-100% ${i}`,
                        to: `-50% ${i}`
                    }]
                }]
            }
        } else if (o.direction === "TOP")
            if (n === "BOTTOM_LEFT" || n === "BOTTOM_RIGHT" || n === "BOTTOM_CENTER") {
                let i = n === "BOTTOM_CENTER" ? "-50%" : "0px";
                return [{
                    eltId: r,
                    props: [{
                        key: "translate",
                        from: `${i} 100%`,
                        to: `${i} 0px`
                    }]
                }]
            } else return n === "TOP_LEFT" || n === "TOP_RIGHT" || n === "TOP_CENTER" ? [{
                eltId: r,
                props: [{
                    key: "top",
                    from: "100%",
                    to: "0px"
                }]
            }] : [{
                eltId: r,
                props: [{
                    key: "top",
                    from: "100%",
                    to: "50%"
                }, {
                    key: "translate",
                    from: "-50% 0%",
                    to: "-50% -50%"
                }]
            }];
        else if (o.direction === "BOTTOM") {
            if (n === "BOTTOM_LEFT" || n === "BOTTOM_RIGHT" || n === "BOTTOM_CENTER") return [{
                eltId: r,
                props: [{
                    key: "bottom",
                    from: "100%",
                    to: "0px"
                }]
            }];
            if (n === "TOP_LEFT" || n === "TOP_RIGHT" || n === "TOP_CENTER") {
                let i = n === "TOP_CENTER" ? "-50%" : "0px";
                return [{
                    eltId: r,
                    props: [{
                        key: "translate",
                        from: `${i} -100%`,
                        to: `${i} 0px`
                    }]
                }]
            } else return [{
                eltId: r,
                props: [{
                    key: "top",
                    from: "0px",
                    to: "50%"
                }, {
                    key: "translate",
                    from: "-50% -100%",
                    to: "-50% -50%"
                }]
            }]
        } else console.warn("Unsupported transition:", o);
        return []
    }
    var $ = null,
        ee, te;
    S(".dragScroll", r => {
        let n = o => {
            document.elementFromPoint(o.clientX, o.clientY) === r && ($ = r, {
                clientX: ee,
                clientY: te
            } = o, o.preventDefault())
        };
        return r.addEventListener("mousedown", n), () => r.removeEventListener("mousedown", n)
    }), window.addEventListener("mousemove", r => {
        if (!$) return;
        let n = $ === document.body ? document.documentElement : $,
            [o, i] = [ee - r.clientX, te - r.clientY];
        n.scrollLeft += o, n.scrollTop += i, [ee, te] = [r.clientX, r.clientY]
    }), window.addEventListener("mouseup", () => $ = null);
    var ke = () => window.F2W_REACTIONS,
        j = () => window.F2W_VARIABLES,
        ut = () => window.F2W_COLLECTION_MODE_BPS,
        Be = r => {
            var n, o;
            return (o = (n = window.F2W_COLLECTION_VARS) == null ? void 0 : n[r]) != null ? o : {}
        },
        lt = (r, n) => Be(r)[n];

    function Fe(r, n) {
        j()[r] = n;
        let o = ce(n);
        document.body.style.setProperty(r, o);
        let i = `data${r.slice(1)}`;
        document.body.hasAttribute(i) && document.body.setAttribute(i, o), document.dispatchEvent(new CustomEvent("f2w-set-variable", {
            detail: {
                id: r,
                value: n,
                str: o
            }
        }))
    }

    function X(r, n) {
        var o;
        document.body.setAttribute(`data-${r}`, n);
        let i = (o = lt(r, n)) != null ? o : {};
        for (let [a, l] of Object.entries(i)) Fe(a, l)
    }

    function ct(r, n) {
        X(r, n), De(r, n)
    }

    function De(r, n) {
        var o, i;
        if ((o = window.F2W_COLOR_SCHEMES) != null && o.includes(r)) localStorage?.setItem(Ue, n);
        else if ((i = window.F2W_LANGUAGES) != null && i.includes(r)) {
            localStorage?.setItem(ze, n);
            let a = Array.from(document.head.querySelectorAll('link[rel="alternate"]')).find(l => l.hreflang === n);
            a && history.replaceState(null, "", new URL(a.href).pathname)
        }
    }

    function b(r) {
        return typeof r == "number" ? r : typeof r == "boolean" ? r ? 1 : 0 : typeof r == "string" ? parseFloat(r) : 0
    }

    function P(r) {
        return String(r)
    }

    function L(r) {
        return typeof r == "string" ? r === "true" : !!r
    }

    function F(r, n) {
        var o, i;
        if (r === void 0) return !1;
        if (G(r)) return F(j()[r.id]);
        if (typeof r == "object" && "expressionArguments" in r) {
            let a = r.expressionArguments.map(u => u.value).filter(u => u !== void 0).map(u => F(u, n)),
                l = (i = (o = r.expressionArguments[0]) == null ? void 0 : o.resolvedType) != null ? i : "STRING";
            switch (r.expressionFunction) {
                case "ADDITION":
                    return l === "FLOAT" ? a.map(b).reduce((u, c) => u + c) : a.map(P).reduce((u, c) => u + c);
                case "SUBTRACTION":
                    if (a.length !== 2) throw new Error("Invalid expression");
                    return b(a[0]) - b(a[1]);
                case "DIVISION":
                    if (a.length !== 2) throw new Error("Invalid expression");
                    return b(a[0]) / b(a[1]);
                case "MULTIPLICATION":
                    return a.map(b).reduce((u, c) => u * c);
                case "NEGATE":
                    if (a.length !== 1) throw new Error("Invalid expression");
                    return -b(a[0]);
                case "GREATER_THAN":
                    if (a.length !== 2) throw new Error("Invalid expression");
                    return b(a[0]) > b(a[1]);
                case "GREATER_THAN_OR_EQUAL":
                    if (a.length !== 2) throw new Error("Invalid expression");
                    return b(a[0]) >= b(a[1]);
                case "LESS_THAN":
                    if (a.length !== 2) throw new Error("Invalid expression");
                    return b(a[0]) < b(a[1]);
                case "LESS_THAN_OR_EQUAL":
                    if (a.length !== 2) throw new Error("Invalid expression");
                    return b(a[0]) <= b(a[1]);
                case "EQUALS":
                    if (a.length !== 2) throw new Error("Invalid expression");
                    return l === "FLOAT" ? b(a[0]) === b(a[1]) : l === "BOOLEAN" ? L(a[0]) === L(a[1]) : P(a[0]) === P(a[1]);
                case "NOT_EQUAL":
                    if (a.length !== 2) throw new Error("Invalid expression");
                    return l === "FLOAT" ? b(a[0]) !== b(a[1]) : l === "BOOLEAN" ? L(a[0]) !== L(a[1]) : P(a[0]) !== P(a[1]);
                case "AND":
                    if (a.length !== 2) throw new Error("Invalid expression");
                    return L(a[0]) && L(a[1]);
                case "OR":
                    if (a.length !== 2) throw new Error("Invalid expression");
                    return L(a[0]) || L(a[1]);
                case "NOT":
                    if (a.length !== 1) throw new Error("Invalid expression");
                    return !L(a[0]);
                case "VAR_MODE_LOOKUP":
                default:
                    return console.warn(`Expression not implemented yet: ${r.expressionFunction}`), !1
            }
        } else return r
    }

    function re(r, n, o) {
        let i = r.map(a => dt(a, n, o));
        return (a, l) => {
            let u = i.map(c => c(a, l)).filter(c => !!c);
            if (u.length) return (c, f) => u.forEach(d => d(c, f))
        }
    }

    function dt(r, n, o) {
        for (; r.type === "ALIAS";) r = ke()[r.alias];
        let i = ft(r, n, o);
        return a => {
            if (r.type !== "ANIMATE" && o === "drag") {
                let l = a.detail;
                if (!l.handled) return l.handled = !0, i(a)
            }
            if (!O) {
                if (r.type === "ANIMATE" && r.rootId) {
                    let l = document.getElementById(r.rootId);
                    if (l != null && l.parentElement) {
                        let u = z(i(a));
                        if (u) {
                            let c = l?.parentElement;
                            for (; c && ((c.f2w_reset || (c.f2w_reset = [])).push(u), c = c.parentElement, c?.tagName !== "BODY"););
                        }
                        return u
                    }
                }
                return i(a)
            }
        }
    }

    function ft(action, bound, trigger) {
        var e, t;
        switch (action.type) {
            case "BACK":
                return () => {
                    var r;
                    return ((r = window.F2W_PREVIEW_BACK) != null ? r : history.back.bind(history))()
                };
            case "JS":
                return () => eval(action.code);
            case "URL":
                return () => {
                    action.openInNewTab ? window.open(action.url, "_blank") : window.F2W_PREVIEW_NAVIGATE ? window.F2W_PREVIEW_NAVIGATE(action.url) : location.assign(action.url)
                };
            case "SET_VARIABLE":
                let {
                    variableId, variableValue
                } = action;
                if (variableId && variableValue?.value !== void 0) return () => Fe(variableId, F(variableValue.value, variableId));
                break;
            case "SET_VARIABLE_MODE":
                let {
                    variableCollectionName, variableModeName
                } = action;
                if (variableCollectionName && variableModeName) return () => ct(variableCollectionName, variableModeName);
                break;
            case "CONDITIONAL":
                let blocks = action.conditionalBlocks.map(r => {
                    let n = re(r.actions, bound, trigger),
                        {
                            condition: o
                        } = r;
                    return {
                        test: o ? () => L(F(o.value)) : () => !0,
                        run: n
                    }
                });
                return () => {
                    let r = [];
                    for (let n of blocks)
                        if (n.test()) {
                            let o = n.run();
                            o && r.push(o);
                            break
                        } if (r.length) return n => r.forEach(o => o(n))
                };
            case "KEY_CONDITION":
                let run = re(action.actions, bound, trigger),
                    keyCode = action.keyCodes[0],
                    shiftKey = action.keyCodes.slice(1).includes(16),
                    ctrlKey = action.keyCodes.slice(1).includes(17),
                    altKey = action.keyCodes.slice(1).includes(18),
                    metaKey = action.keyCodes.slice(1).includes(91);
                return r => {
                    if (r instanceof KeyboardEvent) {
                        if (r.keyCode !== keyCode || r.ctrlKey !== ctrlKey || r.altKey !== altKey || r.metaKey !== metaKey || r.shiftKey !== shiftKey) return;
                        r.preventDefault(), r.stopPropagation(), run(r)
                    }
                };
            case "CLOSE_OVERLAY": {
                if (action.self) return r => {
                    var n, o;
                    return (o = (n = r?.target) == null ? void 0 : n.f2w_close) == null ? void 0 : o.call(n)
                };
                if (action.overlayId) {
                    let r = document.getElementById(action.overlayId);
                    if (!r) break;
                    return () => {
                        var n;
                        return (n = r.f2w_close) == null ? void 0 : n.call(r)
                    }
                }
                break
            }
            case "SCROLL_TO":
                if (!action.destinationId) break;
                let elt = document.getElementById(action.destinationId);
                if (!elt) break;
                return r => {
                    var n;
                    r?.currentTarget instanceof HTMLAnchorElement && r?.preventDefault(), elt.scrollIntoView({
                        behavior: (n = action.transition) != null && n.type ? "smooth" : "instant"
                    })
                };
            case "OVERLAY":
                if (!action.destinationId) break;
                let overlay = document.getElementById(action.destinationId);
                if (!overlay) break;
                let modal = Array(...overlay.children).find(r => r.tagName !== "TEMPLATE");
                if (!modal) break;
                let {
                    transition, overlayPositionType, overlayRelativePosition
                } = action, duration = Math.round(1e3 * ((e = transition?.duration) != null ? e : 0)), animations = [{
                    eltId: action.destinationId,
                    props: [{
                        key: "visibility",
                        from: "hidden",
                        to: "visible"
                    }, {
                        key: "opacity",
                        from: "0",
                        to: "1"
                    }]
                }];
                return overlayPositionType === "MANUAL" ? () => {
                    var r, n, o;
                    if (trigger === "hover") {
                        let u = (r = bound.f2w_mouseleave_remove) == null ? void 0 : r.call(bound);
                        if (u) {
                            let c = f => {
                                Re(f, bound) && Re(f, modal) && (u(), document.removeEventListener("mousemove", c))
                            };
                            document.addEventListener("mousemove", c)
                        }
                    }
                    let i = animations.slice(0),
                        a = H(bound.getBoundingClientRect().left + ((n = overlayRelativePosition?.x) != null ? n : 0)),
                        l = H(bound.getBoundingClientRect().top + ((o = overlayRelativePosition?.y) != null ? o : 0));
                    return modal.style.setProperty("left", a), modal.style.setProperty("top", l), transition?.type === "MOVE_IN" && (transition.direction === "LEFT" ? i.push({
                        eltId: modal.id,
                        props: [{
                            key: "left",
                            from: "100%",
                            to: a
                        }]
                    }) : transition.direction === "RIGHT" ? i.push({
                        eltId: modal.id,
                        props: [{
                            key: "left",
                            from: "0px",
                            to: a
                        }, {
                            key: "translate",
                            from: "-100% 0px",
                            to: "0px 0px"
                        }]
                    }) : transition.direction === "TOP" ? i.push({
                        eltId: modal.id,
                        props: [{
                            key: "top",
                            from: "100%",
                            to: l
                        }]
                    }) : transition.direction === "BOTTOM" && i.push({
                        eltId: modal.id,
                        props: [{
                            key: "top",
                            from: "0px",
                            to: l
                        }, {
                            key: "translate",
                            from: "0px -100%",
                            to: "0px 0px"
                        }]
                    })), ne(i, transition?.easing, duration, bound, trigger, `${trigger}(manual_overlay)`, overlay)()
                } : (transition?.type === "MOVE_IN" ? animations.push(...Le(modal.id, overlayPositionType, transition)) : transition != null && transition.type && console.warn("Unsupported transition:", transition), ne(animations, transition?.easing, duration, bound, trigger, `${trigger}(overlay)`, overlay));
            case "ANIMATE": {
                let {
                    animations: r,
                    transition: n,
                    rootId: o,
                    reset: i
                } = action, a = Math.round(1e3 * ((t = n?.duration) != null ? t : 0)), l = ne(r, n?.easing, a, bound, trigger, i ? `${trigger}(+reset)` : trigger);
                return i && o ? (u, c) => {
                    let f = document.getElementById(o);
                    if (f) {
                        let {
                            f2w_reset: d
                        } = f;
                        d != null && d.length && (delete f.f2w_reset, d.reverse().forEach(m => m(void 0, !0)))
                    }
                    return l(u, c)
                } : l
            }
            case "UPDATE_MEDIA_RUNTIME": {
                if (!action.destinationId) break;
                let r = document.getElementById(action.destinationId);
                if (!r) break;
                switch (action.mediaAction) {
                    case "MUTE":
                        return ge(r);
                    case "UNMUTE":
                        return ye(r);
                    case "TOGGLE_MUTE_UNMUTE":
                        return me(r);
                    case "PLAY":
                        return Ee(r);
                    case "PAUSE":
                        return be(r);
                    case "TOGGLE_PLAY_PAUSE":
                        return xe(r);
                    case "SKIP_BACKWARD":
                        return Ae(r, action.amountToSkip);
                    case "SKIP_FORWARD":
                        return Te(r, action.amountToSkip);
                    case "SKIP_TO":
                        return he(r, action.newTimestamp)
                }
            }
            default:
                return () => console.warn("Action not implemented yet: " + action.type)
        }
        return () => {}
    }
    var Ve = 9999;

    function ne(r, n = "linear", o, i, a, l, u) {
        return c => {
            let f = r;
            u && (document.body.parentElement.style.overflow = "hidden", f = [{
                eltId: u.id,
                props: [{
                    key: "z-index",
                    from: 0,
                    to: Ve++
                }]
            }, ...f]);
            let d = B(f, n, o, i, a, l, c),
                m = z((y, T) => {
                    u && (Ve--, document.body.parentElement.style.overflow = ""), B(d, n, T ? 0 : o, i, a, `${l}(revert)`)
                });
            return u && (u.f2w_close = m), m
        }
    }

    function B(r, n, o, i, a, l, u) {
        var c, f;
        let d = [],
            m = new Set;
        if (a === "drag") return pt(r, n, o, i, u.detail), [];
        let y = [],
            T = [],
            x = !1;
        for (let {
                eltId: h,
                altId: A,
                props: E,
                reactions: g
            }
            of r) {
            let s = document.getElementById(h);
            if (!s) {
                U(`Can't find element for id: ${h}`);
                continue
            }
            if (s.f2w_replaced && (s = s.f2w_replaced), A) {
                let v = document.getElementById(A);
                if (!v) {
                    let C = document.getElementById(de(A));
                    if (!C) {
                        U(`Can't find template for id: ${A}`);
                        continue
                    }
                    v = ((c = C.content) == null ? void 0 : c.cloneNode(!0)).querySelector("*")
                }
                let {
                    f2w_mouseup: N
                } = s, Qe = (f = s.f2w_mouseleave_remove) == null ? void 0 : f.call(s);
                Qe && Ke(v, Qe), N && v.addEventListener("mouseup", N), (Qe || N) && He(v), We(v, !0, o), s.insertAdjacentElement("afterend", v), s.f2w_replaced = v, delete v.f2w_replaced;
                let p = getComputedStyle(s).display;
                y.push(() => {
                    I(s, {
                        display: "none"
                    }), I(v, {
                        display: p
                    })
                }), T.push(() => {
                    Y(s, [{
                        key: "display",
                        from: p,
                        to: "none"
                    }], n, o, m), Y(v, [{
                        key: "opacity",
                        from: 0,
                        to: "revert-layer"
                    }, {
                        key: "display",
                        from: "none",
                        to: "revert-layer"
                    }], n, o, m)
                }), d.push({
                    eltId: v.id,
                    altId: s.id
                }), isNaN(+getComputedStyle(v).getPropertyValue("--f2w-order")) || m.add(s.parentElement)
            } else {
                let v = (E || []).map(p => {
                        let C = Ie(s, p.key, p.from),
                            Ye = Ie(s, p.key, p.to);
                        return {
                            key: p.key,
                            pseudo: p.pseudo,
                            from: C,
                            to: Ye
                        }
                    }).filter(p => p.from !== p.to).map(J),
                    N = v.map(p => {
                        if (Q(p.key)) {
                            if (p.to === "auto") x = !0;
                            else if (p.from === "auto") return M(w({}, p), {
                                from: getComputedStyle(s).getPropertyValue(p.key)
                            })
                        }
                        return p
                    });
                y.push(p => {
                    Me(s, N, p)
                }), T.push(() => {
                    var p;
                    let C = N.map(Ye => Ye.to === "auto" && Q(Ye.key) ? M(w({}, Ye), {
                        to: getComputedStyle(s).getPropertyValue(Ye.key)
                    }) : Ye);
                    Y(s, C, n, o, m), g && (a !== "hover" && ((p = s.f2w_mouseleave_remove) == null || p.call(s)), g.forEach(Ye => $e(s, Ye.type, Ye.to, o)))
                });
                let Qe = {
                    eltId: h,
                    props: v.map(p => {
                        let C = {
                            key: p.key,
                            from: p.to,
                            to: p.from
                        };
                        return p.pseudo && (C.pseudo = p.pseudo), C
                    })
                };
                g && (Qe.reactions = g.map(p => ({
                    type: p.type,
                    from: p.to,
                    to: p.from
                }))), d.push(Qe)
            }
        }
        y.forEach(h => h(x)), T.forEach(h => h());
        for (let h of m) {
            let A = Array.from(h.children).map((g, s) => ({
                    it: g,
                    i: s
                })),
                E = !1;
            A.sort((g, s) => {
                let v = +(getComputedStyle(g.it).getPropertyValue("--f2w-order") || "99999"),
                    N = +(getComputedStyle(s.it).getPropertyValue("--f2w-order") || "99999");
                return v - N
            }).forEach((g, s) => {
                E ? h.appendChild(g.it) : E = s !== g.i
            })
        }
        return d
    }

    function He(r) {
        let n = r;
        for (; n;) n.classList.remove("pointer-events-none"), n = n.parentElement
    }

    function pt(r, n, o, i, a) {
        if (a.handled) return;
        let l = i.getBoundingClientRect(),
            u = B(r.filter(x => x.props).map(({
                eltId: x,
                props: h
            }) => ({
                eltId: x,
                props: h
            })), "linear", 0, i, "click", "drag_start(tmp)"),
            c = i.getBoundingClientRect(),
            f = c.left - l.left,
            d = c.top - l.top,
            m = Math.sqrt(f * f + d * d);
        B(u, "linear", 0, i, "click", "drag_start(tmp undo)");
        let {
            x: y,
            y: T
        } = oe(a.start, a.end);
        if (y > 0 && f > 0 || y < 0 && f < 0 || f === 0 && (T > 0 && d > 0 || T < 0 && d < 0)) {
            a.handled = !0;
            let x = r.map(E => {
                    var g;
                    return M(w({}, E), {
                        swapped: !1,
                        props: (g = E.props) == null ? void 0 : g.map(s => M(w({}, s), {
                            curr: s.from
                        }))
                    })
                }),
                h = E => {
                    let {
                        x: g,
                        y: s
                    } = oe(E.start, E.end), v = (g * f + s * d) / m;
                    return Math.max(0, Math.min(100, 100 * v / m))
                },
                A = E => {
                    E.end.preventDefault(), E.end.stopPropagation();
                    let g = h(E);
                    B(D(x.map(s => {
                        let v = s,
                            {
                                reactions: N
                            } = v,
                            Qe = ue(v, ["reactions"]);
                        if (s.props) return M(w({}, Qe), {
                            props: s.props.map(p => {
                                let C = bt(p, g),
                                    Ye = p.curr;
                                return p.curr = C, M(w({}, p), {
                                    from: Ye,
                                    to: C
                                })
                            })
                        });
                        if (s.altId) {
                            if (g < 50 && s.swapped) return s.swapped = !1, {
                                altId: s.eltId,
                                eltId: s.altId
                            };
                            if (g >= 50 && !s.swapped) return s.swapped = !0, Qe
                        }
                    })), "linear", 0, i, "click", "dragging")
                };
            A(a), i.f2w_drag_listener = E => {
                if (A(E), E.finished) {
                    let g = h(E);
                    B(D(x.map(s => {
                        if (s.props) {
                            let v = g < 50 ? void 0 : s.reactions;
                            return {
                                eltId: s.eltId,
                                props: s.props.map(N => M(w({}, N), {
                                    from: N.curr,
                                    to: g < 50 ? N.from : N.to
                                })),
                                reactions: v
                            }
                        }
                        if (s.altId) {
                            if (g < 50 && s.swapped) return s.swapped = !1, {
                                altId: s.eltId,
                                eltId: s.altId
                            };
                            if (g >= 50 && !s.swapped) return s.swapped = !0, s
                        }
                    })), n, o, i, "click", "drag_end")
                }
            }
        }
    }

    function Ie(r, n, o) {
        return o !== "$current" ? o : getComputedStyle(r).getPropertyValue(n)
    }

    function We(r, n = !1, o = 0) {
        for (let i of fe)
            for (let a of mt(r, `[data-reaction-${i}]`, n)) $e(a, i, a.getAttribute(`data-reaction-${i}`), o)
    }

    function mt(r, n, o = !1) {
        let i = [...r.querySelectorAll(n)];
        return o && r.matches(n) && i.unshift(r), i
    }

    function $e(r, n, o = "", i = 0) {
        var a;
        if (!o && n !== "hover") {
            yt(r, n);
            return
        }
        let l = 0;
        if (o[0] === "T") {
            let d = o.indexOf("ms");
            l = parseFloat(o.slice(1, d)) || 0, o = o.slice(d + 3)
        }
        let u = ke(),
            c = D(o.split(",").map(d => u[d])),
            f = re(c, r, n);
        if (n === "timeout") {
            gt(r, () => f(), l + i);
            return
        }
        if (He(r), n === "press") {
            let d, m = () => {
                d?.(), d = void 0
            };
            r.f2w_mouseup = m, k(r, "mousedown", y => {
                d?.(), d = f(y)
            }, n, _(r, "mouseup", m))
        } else if (n === "drag") k(r, "dragging", d => {
            f(d)
        }, n);
        else if (n === "hover") {
            let d, m = A => {
                    d || (d = z(f(A)))
                },
                y = (a = r.f2w_mouseleave_remove) == null ? void 0 : a.call(r),
                T = () => {
                    d?.(), d = void 0, y?.()
                },
                x = setTimeout(() => {
                    r.matches(":hover") && m()
                }, i),
                h = Ke(r, T, x);
            k(r, "mouseenter", m, n, h)
        } else if (n === "submit") {
            let d = r.closest("form");
            d && (k(r, n, f, n), k(d, n, m => {
                m.preventDefault(), r.toggleAttribute("disabled", !0), fetch(d.action, {
                    method: d.method,
                    body: new FormData(d)
                }).then(y => y.ok && r.dispatchEvent(m)).finally(() => r.toggleAttribute("disabled", !1))
            }, n))
        } else n === "keydown" && !r.getAttribute("tabindex") && r.setAttribute("tabindex", "-1"), n === "appear" && xt.observe(r), k(r, n, d => {
            n !== "keydown" && d.stopPropagation(), l ? setTimeout(() => f(d), l) : f(d)
        }, n)
    }

    function Ke(r, n, o = 0) {
        let i = _(r, "mouseleave", n),
            a = () => (i(), clearTimeout(o), r.f2w_mouseleave === n && delete r.f2w_mouseleave, r.f2w_mouseleave_remove === a && delete r.f2w_mouseleave_remove, n);
        return r.f2w_mouseleave = n, r.f2w_mouseleave_remove = a
    }

    function Re({
        clientX: r,
        clientY: n
    }, o) {
        let {
            top: i,
            left: a,
            right: l,
            bottom: u
        } = o.getBoundingClientRect();
        return r > l + 2 || r < a - 2 || n > u + 2 || n < i - 2
    }

    function Ge(r) {
        return `f2w_cleanup_${r}`
    }

    function gt(r, n, o) {
        var i;
        let a = setTimeout(n, o);
        (i = r.f2w_cleanup_timeout) == null || i.call(r), r.f2w_cleanup_timeout = () => {
            delete r.f2w_cleanup_timeout, clearTimeout(a)
        }
    }

    function yt(r, n) {
        var o;
        let i = Ge(n);
        (o = r[i]) == null || o.call(r)
    }

    function k(r, n, o, i, ...a) {
        var l;
        let u = [...a, _(r, n, o)],
            c = Ge(i);
        (l = r[c]) == null || l.call(r), r[c] = () => {
            delete r[c], u.forEach(f => f())
        }
    }

    function _(r, n, o, i) {
        let a = l => {
            !r.isConnected || o(l)
        };
        return r.addEventListener(n, a, i), () => {
            r.removeEventListener(n, a, i)
        }
    }
    var Ue = "f2w-color-scheme",
        ze = "f2w-lang";
    if (window.F2W_THEME_SWITCH = r => {
            var n;
            return (n = window.F2W_COLOR_SCHEMES) == null ? void 0 : n.forEach(o => X(o, r))
        }, window.F2W_COLOR_SCHEMES) {
        let r = matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light",
            n = localStorage == null ? void 0 : localStorage.getItem(Ue);
        S("body", () => {
            var o, i;
            let a = document.body.getAttribute("data-preview-theme"),
                l = (o = a ?? n) != null ? o : r;
            (i = window.F2W_THEME_SWITCH) == null || i.call(window, l)
        })
    }
    if (window.F2W_LANGUAGES) {
        let r = localStorage == null ? void 0 : localStorage.getItem(ze);
        S("body", () => {
            var n, o, i;
            let a = Array.from(document.head.querySelectorAll('link[rel="alternate"]'));
            a.length === 0 || a.some(u => u.getAttribute("hreflang") === "x-default" && u.getAttribute("href") === window.location.href) || (r = document.documentElement.lang);
            let l = (o = (n = document.head.querySelector('link[rel="canonical"]')) == null ? void 0 : n.href) == null ? void 0 : o.endsWith("/404/");
            (i = window.F2W_LANGUAGES) == null || i.forEach(u => {
                var c;
                let f = Object.fromEntries(Object.entries(Be(u)).map(([m]) => [m.toLowerCase(), m])),
                    d = [...navigator.languages];
                r && d.unshift(r);
                for (let m of d) {
                    m = m.toLowerCase();
                    let y = m.split("-")[0],
                        T = (c = f[m]) != null ? c : f[y];
                    if (T) {
                        X(u, T), l || De(u, T);
                        break
                    }
                }
            })
        })
    }
    var Se = {},
        Et = Object.entries(ut()).map(([r, n]) => ({
            collectionName: r,
            breakpoints: Object.entries(n).map(([o, {
                minWidth: i
            }]) => ({
                name: o,
                minWidth: i
            })).sort(({
                minWidth: o
            }, {
                minWidth: i
            }) => o - i)
        }));

    function Oe() {
        var r;
        let n = ((r = window.visualViewport) == null ? void 0 : r.width) || window.innerWidth;
        for (let {
                collectionName: o,
                breakpoints: i
            }
            of Et) {
            let a = [...i],
                l = a.splice(0, 1)[0].name;
            for (let {
                    name: u,
                    minWidth: c
                }
                of a) n >= c && (l = u);
            l !== Se[o] && (X(o, l), Se[o] = l)
        }
    }
    var O = !1;
    S("body", () => {
        let r, n = !1;
        _(document, "mousedown", o => {
            r = o, O = !1
        }), _(document, "mousemove", o => {
            var i, a, l;
            if (r && oe(r, o).dist > 2) {
                let u = {
                    start: r,
                    end: o
                };
                O ? (l = (a = r.target) == null ? void 0 : a.f2w_drag_listener) == null || l.call(a, u) : ((i = r.target) == null || i.dispatchEvent(new CustomEvent("dragging", {
                    detail: u
                })), O = !0, n = !0)
            }
        }), _(document, "mouseup", o => {
            var i, a;
            r && O && ((a = (i = r.target) == null ? void 0 : i.f2w_drag_listener) == null || a.call(i, {
                start: r,
                end: o,
                finished: !0
            })), r = void 0, O = !1
        }), _(document, "mouseup", o => {
            var i, a;
            r && O && ((a = (i = r.target) == null ? void 0 : i.f2w_drag_listener) == null || a.call(i, {
                start: r,
                end: o,
                finished: !0
            })), r = void 0, O = !1
        }), _(document, "click", o => {
            n && (n = !1, o.preventDefault(), o.stopPropagation())
        }, {
            capture: !0
        }), Oe(), window.addEventListener("resize", Oe)
    }), addEventListener("DOMContentLoaded", () => We(document)), addEventListener("DOMContentLoaded", () => {
        if ("mediumZoom" in window) {
            let r = mediumZoom("[data-zoomable]");
            r.on("open", n => {
                let o = getComputedStyle(n.target).objectFit,
                    i = n.detail.zoom.getZoomedImage();
                o && i && (i.style.objectFit = o)
            }), r.on("closed", n => {
                let o = n.detail.zoom.getZoomedImage();
                o.style.objectFit = ""
            })
        }
    });

    function _e(r) {
        return r.endsWith("px") || r.endsWith("%") || r.startsWith("calc")
    }

    function Pe(r) {
        return r.startsWith("calc") ? r.slice(4) : r
    }

    function bt({
        from: r,
        to: n
    }, o) {
        if (r === n) return n;
        if (typeof r == "number" && typeof n == "number") return r + (n - r) * (o / 100);
        if (typeof r == "string" && typeof n == "string") {
            if (r === "none" || n === "none" || r === "auto" || n === "auto") return o < 50 ? r : n;
            if (r.endsWith("px") && n.endsWith("px")) {
                let i = parseFloat(r),
                    a = parseFloat(n);
                return H(i + (a - i) * (o / 100))
            }
            if (r.endsWith("%") && n.endsWith("%")) {
                let i = parseFloat(r),
                    a = parseFloat(n);
                return q(i + (a - i) * (o / 100))
            }
            if (_e(r) && _e(n)) {
                let i = Pe(r),
                    a = Pe(n);
                return `calc(${i} + (${a} - ${i}) * ${o/100})`
            }
            if (r.startsWith("rgb") && n.startsWith("rgb")) {
                let i = r.match(/\d+/g).map(Number),
                    a = n.match(/\d+/g).map(Number);
                return `rgb(${i.map((l,u)=>l+(a[u]-l)*(o/100)).join(",")})`
            }
        }
        return o < 50 ? r : n
    }

    function oe(r, n) {
        let o = n.clientX - r.clientX,
            i = n.clientY - r.clientY;
        return {
            x: o,
            y: i,
            dist: Math.sqrt(Math.pow(o, 2) + Math.pow(i, 2))
        }
    }
    S("[data-bound-characters]", r => {
        let n = () => {
            let o = r.getAttribute("data-bound-characters"),
                i = P(F(j()[o]));
            "placeholder" in r ? i !== r.placeholder && (r.placeholder = i) : i !== r.textContent && (r.textContent = i)
        };
        return n(), document.addEventListener("f2w-set-variable", n), () => document.removeEventListener("f2w-set-variable", n)
    }), S("[data-bound-visible]", r => {
        let n = () => {
            let o = r.getAttribute("data-bound-visible"),
                i = P(F(j()[o]));
            i !== void 0 && r.setAttribute("data-visible", i)
        };
        return n(), document.addEventListener("f2w-set-variable", n), () => document.removeEventListener("f2w-set-variable", n)
    });
    var xt = new IntersectionObserver((r, n) => {
        r.forEach(o => {
            o.isIntersecting && (n.unobserve(o.target), o.target.dispatchEvent(new CustomEvent("appear")))
        })
    }, {
        threshold: .1
    });
    addEventListener("load", () => {
        let r = window.location.hash.slice(1),
            n = new RegExp(r + "(_\\d+)?$");
        for (let o of document.querySelectorAll(`[id^="${r}"]`))
            if (n.test(o.id) && o.getBoundingClientRect().height > 0) return o.scrollIntoView()
    })
})();