 window.F2W_REACTIONS = (() => {
    const p = [
        [{
            key: "border-width",
            from: "0.5px",
            to: "revert"
        }, {
            key: "border-style",
            from: "solid",
            to: "none"
        }, {
            key: "border-color",
            from: "rgba(40,167,69,0.9)",
            to: "revert"
        }, {
            key: "background-color",
            from: "#fff",
            to: "#146f23"
        }, {
            key: "box-shadow",
            from: "3px 3px 4px rgba(255,255,255,0.3) inset,-3px -3px 4px rgba(102,102,102,0.5) inset,-78px 78px 156px rgba(102,102,102,0.2),78px -78px 156px rgba(102,102,102,0.2),-78px -78px 156px rgba(255,255,255,0.9),78px 78px 195px rgba(102,102,102,0.9)",
            to: "1px 1px 2px rgba(28,157,49,0.3),-1px -1px 2px rgba(12,65,21,0.5),-3px 3px 6px rgba(12,65,21,0.2) inset,3px -3px 6px rgba(12,65,21,0.2) inset,-3px -3px 6px rgba(28,157,49,0.9) inset,3px 3px 8px rgba(12,65,21,0.9) inset"
        }, {
            key: "padding",
            from: "14.5px",
            to: "15px"
        }],
        [{
            key: "color",
            from: "rgba(40,167,69,0.9)",
            to: "rgba(255,255,255,0.9)"
        }],
        [{
            key: "background-color",
            from: "#630519",
            to: "#f4f4f4"
        }, {
            key: "box-shadow",
            from: "1px 1px 2px rgba(140,7,35,0.3),-1px -1px 2px rgba(58,3,15,0.5),-3px 3px 6px rgba(58,3,15,0.2) inset,3px -3px 6px rgba(58,3,15,0.2) inset,-3px -3px 6px rgba(140,7,35,0.9) inset,3px 3px 8px rgba(58,3,15,0.9) inset",
            to: "3px 3px 4px rgba(255,255,255,0.3) inset,-3px -3px 4px rgba(98,98,98,0.5) inset,-78px 78px 156px rgba(98,98,98,0.2),78px -78px 156px rgba(98,98,98,0.2),-78px -78px 156px rgba(255,255,255,0.9),78px 78px 195px rgba(98,98,98,0.9)"
        }, {
            key: "padding",
            from: "15px",
            to: "14.5px"
        }, {
            key: "border-width",
            from: "revert",
            to: "0.5px"
        }, {
            key: "border-style",
            from: "none",
            to: "solid"
        }, {
            key: "border-color",
            from: "revert",
            to: "rgba(220,53,69,0.9)"
        }],
        [{
            key: "color",
            from: "rgba(255,255,255,0.9)",
            to: "#dc3545"
        }],
        [{
            key: "background-color",
            from: "#146f23",
            to: "#fff"
        }, {
            key: "box-shadow",
            from: "1px 1px 2px rgba(28,157,49,0.3),-1px -1px 2px rgba(12,65,21,0.5),-3px 3px 6px rgba(12,65,21,0.2) inset,3px -3px 6px rgba(12,65,21,0.2) inset,-3px -3px 6px rgba(28,157,49,0.9) inset,3px 3px 8px rgba(12,65,21,0.9) inset",
            to: "3px 3px 4px rgba(255,255,255,0.3) inset,-3px -3px 4px rgba(102,102,102,0.5) inset,-78px 78px 156px rgba(102,102,102,0.2),78px -78px 156px rgba(102,102,102,0.2),-78px -78px 156px rgba(255,255,255,0.9),78px 78px 195px rgba(102,102,102,0.9)"
        }, {
            key: "padding",
            from: "15px",
            to: "14.5px"
        }, {
            key: "border-width",
            from: "revert",
            to: "0.5px"
        }, {
            key: "border-style",
            from: "none",
            to: "solid"
        }, {
            key: "border-color",
            from: "revert",
            to: "rgba(40,167,69,0.9)"
        }],
        [{
            key: "color",
            from: "rgba(255,255,255,0.9)",
            to: "rgba(40,167,69,0.9)"
        }],
        [{
            key: "border-width",
            from: "0.5px",
            to: "revert"
        }, {
            key: "border-style",
            from: "solid",
            to: "none"
        }, {
            key: "border-color",
            from: "rgba(220,53,69,0.9)",
            to: "revert"
        }, {
            key: "background-color",
            from: "#f4f4f4",
            to: "#630519"
        }, {
            key: "box-shadow",
            from: "3px 3px 4px rgba(255,255,255,0.3) inset,-3px -3px 4px rgba(98,98,98,0.5) inset,-78px 78px 156px rgba(98,98,98,0.2),78px -78px 156px rgba(98,98,98,0.2),-78px -78px 156px rgba(255,255,255,0.9),78px 78px 195px rgba(98,98,98,0.9)",
            to: "1px 1px 2px rgba(140,7,35,0.3),-1px -1px 2px rgba(58,3,15,0.5),-3px 3px 6px rgba(58,3,15,0.2) inset,3px -3px 6px rgba(58,3,15,0.2) inset,-3px -3px 6px rgba(140,7,35,0.9) inset,3px 3px 8px rgba(58,3,15,0.9) inset"
        }, {
            key: "padding",
            from: "14.5px",
            to: "15px"
        }],
        [{
            key: "color",
            from: "#dc3545",
            to: "rgba(255,255,255,0.9)"
        }],
        [{
            key: "box-shadow",
            from: "3px 3px 4px rgba(2,123,255,0.3) inset,-3px -3px 4px rgba(0,31,66,0.5) inset,-78px 78px 156px rgba(0,31,66,0.2),78px -78px 156px rgba(0,31,66,0.2),78px 78px 195px rgba(0,31,66,0.9)",
            to: "1px 1px 2px rgba(1,109,233,0.3),-1px -1px 2px rgba(1,45,97,0.5),-3px 3px 6px rgba(1,45,97,0.2) inset,3px -3px 6px rgba(1,45,97,0.2) inset,-3px -3px 6px rgba(1,109,233,0.9) inset,3px 3px 8px rgba(1,45,97,0.9) inset"
        }],
        [{
            key: "color",
            from: "#fff",
            to: "rgba(165,165,165,0.9)"
        }],
        [{
            key: "box-shadow",
            from: "1px 1px 2px rgba(1,109,233,0.3),-1px -1px 2px rgba(1,45,97,0.5),-3px 3px 6px rgba(1,45,97,0.2) inset,3px -3px 6px rgba(1,45,97,0.2) inset,-3px -3px 6px rgba(1,109,233,0.9) inset,3px 3px 8px rgba(1,45,97,0.9) inset",
            to: "3px 3px 4px rgba(2,123,255,0.3) inset,-3px -3px 4px rgba(0,31,66,0.5) inset,-78px 78px 156px rgba(0,31,66,0.2),78px -78px 156px rgba(0,31,66,0.2),78px 78px 195px rgba(0,31,66,0.9)"
        }],
        [{
            key: "color",
            from: "rgba(165,165,165,0.9)",
            to: "#fff"
        }]
    ];
    return {
        57: {
            type: "ANIMATE",
            transition: {
                type: "SMART_ANIMATE",
                easing: "linear",
                duration: 0
            },
            animations: [{
                props: p[0],
                reactions: [{
                    type: "click",
                    from: "57"
                }],
                eltId: "MP3"
            }, {
                props: p[1],
                eltId: "I5_77_5_18"
            }, {
                props: p[2],
                reactions: [{
                    type: "click",
                    to: "62"
                }],
                eltId: "MP4"
            }, {
                props: p[3],
                eltId: "I5_77_5_22"
            }],
            rootId: "options"
        },
        62: {
            type: "ANIMATE",
            transition: {
                type: "SMART_ANIMATE",
                easing: "linear",
                duration: 0
            },
            animations: [{
                props: p[4],
                reactions: [{
                    type: "click",
                    to: "57"
                }],
                eltId: "MP3"
            }, {
                props: p[5],
                eltId: "I5_77_5_18"
            }, {
                props: p[6],
                reactions: [{
                    type: "click",
                    from: "62"
                }],
                eltId: "MP4"
            }, {
                props: p[7],
                eltId: "I5_77_5_22"
            }],
            rootId: "options"
        },
        67: {
            type: "ANIMATE",
            transition: {
                type: "SMART_ANIMATE",
                easing: "linear",
                duration: 0
            },
            animations: [{
                props: p[8],
                reactions: [{
                    type: "click",
                    from: "67",
                    to: "68"
                }],
                eltId: "Button-Convert"
            }, {
                props: p[9],
                eltId: "I5_122_5_107"
            }],
            rootId: "Button-Convert"
        },
        68: {
            type: "ANIMATE",
            transition: {
                type: "SMART_ANIMATE",
                easing: "linear",
                duration: 0
            },
            animations: [{
                props: p[10],
                reactions: [{
                    type: "click",
                    from: "68",
                    to: "67"
                }],
                eltId: "Button-Convert"
            }, {
                props: p[11],
                eltId: "I5_122_5_107"
            }],
            rootId: "Button-Convert"
        }
    }
})(), window.F2W_VARIABLES = {
    "--responsive": 320,
    "--Columns-Grid-count": 4,
    "--Columns-Grid-margin": 16,
    "--Columns-Grid-gutter": 16
}, window.F2W_COLLECTION_VARS = {
    "-breakpoints": {
        laptop: {
            "--responsive": 1440,
            "--Columns-Grid-count": 12,
            "--Columns-Grid-margin": 95,
            "--Columns-Grid-gutter": 24
        },
        tablet: {
            "--responsive": 800,
            "--Columns-Grid-count": 8,
            "--Columns-Grid-margin": 60,
            "--Columns-Grid-gutter": 24
        },
        mobile: {
            "--responsive": 320,
            "--Columns-Grid-count": 4,
            "--Columns-Grid-margin": 16,
            "--Columns-Grid-gutter": 16
        },
        desktop: {
            "--responsive": 1920,
            "--Columns-Grid-count": 0,
            "--Columns-Grid-margin": 0,
            "--Columns-Grid-gutter": 0
        }
    }
}, window.F2W_COLLECTION_MODE_BPS = {
    "-breakpoints": {
        mobile: {
            minWidth: 0
        },
        tablet: {
            minWidth: 401
        },
        laptop: {
            minWidth: 769
        },
        desktop: {
            minWidth: 1025
        }
    }
}, window.F2W_COLOR_SCHEMES = void 0, window.F2W_LANGUAGES = void 0; 