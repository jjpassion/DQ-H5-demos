webpackJsonp([322], {
    0: function(e, t, s) {
        (function(e) {
                "use strict";
                function t(e) {
                    if (e && e.__esModule)
                        return e;
                    var t = {};
                    if (null != e)
                        for (var s in e)
                            Object.prototype.hasOwnProperty.call(e, s) && (t[s] = e[s]);
                    return t.default = e,
                        t
                }
                function o(e) {
                    return e && e.__esModule ? e : {
                        default: e
                    }
                }
                var r = s(60)
                    , n = o(r)
                    , a = s(2)
                    , c = o(a);
                s(999);
                var i = s(101)
                    , l = o(i)
                    , d = s(67)
                    , u = s(4)
                    , m = s(63)
                    , p = t(m)
                    , h = ""
                    , v = !0
                    , C = !0
                    , f = ""
                    , y = !1;
                e(function() {
                    function t(t) {
                        e("#certName").val(t.certName),
                            e("#certNo").val(t.certNo),
                            e("#mobilePhone").val(t.mobilePhone),
                        p.checkMobiles(i.mobile) && void 0 === t.mobilePhone && e("#mobilePhone").val(i.mobile)
                    }
                    function s(t, s) {
                        e("#province li, #city li").removeClass("selected"),
                            e("#province").find("li[data-code=" + t + "]").addClass("selected");
                        var o = [];
                        b[t].forEach(function(e) {
                            o.push("<li data-code=" + e.CITY_CODE + ">" + e.CITY_NAME + "</li>")
                        }),
                            e("#city").html(o),
                        p.isEmpty(s) || e("#city").find("li[data-code=" + s + "]").addClass("selected")
                    }
                    function o(t) {
                        b = t.cityData;
                        var o = [];
                        t.provinceData.forEach(function(e) {
                            o.push("<li data-code=" + e.PROVINCE_CODE + ">" + e.PROVINCE_NAME + "</li>")
                        }),
                            e("#province").html(o).find("li[data-code=" + m.numRes.essProvince + "]").addClass("selected"),
                            s(m.numRes.essProvince, m.numRes.essCity)
                    }
                    function r(t) {
                        e(".number-loading").hide();
                        var s = e("#search").data("val");
                        if (0 === t.numArray.length)
                            return void (p.isEmpty(s) ? (e(".no-number").html('当前选号人数过多，请稍后再试.<span class="error-code">' + t.code + "</span>").show(),
                                e("#refresh").text("再试一次")) : (e(".no-number").html('抱歉没有匹配的号码.<span class="error-code">' + t.code + "</span>").show(),
                                e("#refresh").text("换一批")));
                        e(".number-list").show(),
                            g.list = [],
                            g.current = 1;
                        for (var o = t.numArray, r = 0; r < o.length; r += 12) {
                            var n = {};
                            p.isEmpty(s) ? n.number = o[r] : n.number = o[r].toString().replace(new RegExp(s + "$"), "<span>" + s + "</span>"),
                                n.niceRule = o[r + 5],
                                n.monthLimit = o[r + 6],
                                g.list.push(n)
                        }
                        g.max = Math.ceil(g.list.length / g.size),
                            (0,
                                d.shuffle)(g.list),
                            _()
                    }
                    function a(s) {
                        x(s),
                            P(),
                            t(s),
                            o(s),
                            N(),
                            D(s),
                            V(),
                            F(e("#mobilePhone").val())
                    }
                    c.default.attach(document.body),
                        e("#certName").keyup(function(t) {
                            var s = e(t.currentTarget);
                            s.val((0,
                                u.wordChange)(s.val()))
                        }),
                        e(".privacy").css("width", e(window).width() / .75 + "px"),
                        (0,
                            u.resize)();
                    var i = (0,
                        u.getUrlParam)();
                    "undefined" !== i.channel && "" !== i.channel || (i.channel = "99");
                    var m = {}
                        , b = []
                        , g = {}
                        , k = !1
                        , I = function() {
                        e("html, body").addClass("no-scroll")
                    }
                        , E = function() {
                        e("html, body").removeClass("no-scroll")
                    }
                        , x = function(t) {
                        var s = e.cookie("mallcity") || "11|110"
                            , o = s.split("|")[0]
                            , r = s.split("|")[1]
                            , n = t.provinceData.filter(function(e) {
                            return e.PROVINCE_CODE === o
                        });
                        0 === n.length && (o = t.provinceData[0].PROVINCE_CODE,
                            r = t.cityData[o][0].CITY_CODE,
                            e.cookie("mallcity", o + "|" + r, {
                                expires: 7,
                                path: "/",
                                domain: ".10010.com"
                            })),
                            e("#delivery-desc").show(),
                            m.numRes = {},
                            m.numRes.essProvince = o,
                            m.numRes.essCity = r,
                            m.goodsId = "" + o + t.goodsId,
                            m.product = i.product,
                            m.channel = i.channel
                    }
                        , T = "根据国家实名制要求, 请准确提供身份证信息"
                        , w = void 0;
                    "0" === i.product ? w = "“懂我卡”" : "1" === i.product ? w = "“懂我卡Plus”" : "2" === i.product && (w = "“懂我卡MINI”"),
                        e("#fill-desc").find("span").text(w);
                    var P = function() {
                        e("#top-desc").show().text(T)
                    }
                        , R = function(t, s) {
                        e("#post-city li, #post-district li").removeClass("selected"),
                            e("#post-city").find("li[data-code=" + t + "]").addClass("selected");
                        var o = [];
                        l.default.CITY_MAP[t].forEach(function(e) {
                            o.push("<li data-code=" + e.DISTRICT_CODE + ">" + e.DISTRICT_NAME + "</li>")
                        }),
                            e("#post-district").html(o),
                        p.isEmpty(s) || e("#post-district").find("li[data-code=" + s + "]").addClass("selected")
                    }
                        , N = function() {
                        var t = l.default.PROVINCE_LIST.filter(function(e) {
                            return e.ESS_PROVINCE_CODE === m.numRes.essProvince
                        })[0]
                            , s = [];
                        l.default.PROVINCE_MAP[t.PROVINCE_CODE].forEach(function(e) {
                            s.push("<li data-province-name=" + t.PROVINCE_NAME + " data-code=" + e.CITY_CODE + " data-ess-code=" + e.ESS_CITY_CODE + ">" + e.CITY_NAME + "</li>")
                        }),
                            e("#post-city").html(s),
                            e("#post-city li[data-ess-code=" + m.numRes.essCity + "]").addClass("selected");
                        var o = l.default.PROVINCE_MAP[t.PROVINCE_CODE].filter(function(e) {
                            return e.ESS_CITY_CODE === m.numRes.essCity
                        })[0];
                        void 0 === o && (o = l.default.PROVINCE_MAP[t.PROVINCE_CODE][0]);
                        var r = [];
                        l.default.CITY_MAP[o.CITY_CODE].forEach(function(e) {
                            r.push("<li data-code=" + e.DISTRICT_CODE + ">" + e.DISTRICT_NAME + "</li>")
                        }),
                            e("#post-district").html(r);
                        var n = e("#post-district li:first");
                        n.addClass("selected"),
                            m.post = {},
                            m.post.webProvince = t.PROVINCE_CODE,
                            m.post.webCity = o.CITY_CODE,
                            m.post.webCounty = n.data("code") + ""
                    }
                        , _ = function() {
                        if (0 === g.list.length)
                            return void e(".number-list").html("无号码");
                        var t = (g.current - 1) * g.size
                            , s = t + g.size;
                        g.current === g.max && (s = g.list.length);
                        for (var o = [], r = t; r < s; r += 1) {
                            var n = g.list[r];
                            0 === n.niceRule ? o.push("<li><a data-niceRule='" + n.niceRule + "'\n      data-monthLimit='" + n.monthLimit + "' >" + n.number + "</a></li>") : o.push("<li><a data-niceRule='" + n.niceRule + "'\n      data-monthLimit='" + n.monthLimit + "' >" + n.number + "<i>靓</i></a></li>")
                        }
                        g.current += 1,
                            e(".number-list").html(o)
                    }
                        , D = function(e) {
                        g.list = [],
                            g.current = 1,
                            g.size = 10,
                            g.max = 1,
                            g.proGroupNum = e.proGroupNum
                    }
                        , O = function() {
                        e(".number-list, .no-number").hide(),
                            e(".number-loading").show();
                        var t = {
                            provinceCode: m.numRes.essProvince,
                            cityCode: m.numRes.essCity,
                            monthFeeLimit: 0,
                            groupKey: g.proGroupNum[m.numRes.essProvince],
                            searchCategory: 3,
                            net: "01",
                            amounts: 200,
                            codeTypeCode: "",
                            searchValue: e("#search").data("val"),
                            qryType: "02",
                            goodsNet: 4
                        };
                        p.isEmpty(t.groupKey) ? (e(".no-number").text("抱歉没有匹配的号码").show(),
                            e("#refresh").text("换一批"),
                            e(".number-list, .number-loading").hide()) : e.ajax({
                            type: "get",
                            url: "/NumApp/NumberCenter/qryNum",
                            data: t,
                            dataType: "jsonp",
                            jsonp: "callback",
                            jsonpCallback: "jsonp_queryMoreNums",
                            success: function(e) {
                                r(e)
                            },
                            complete: function(t, s) {
                                "timeout" === s && (e(".number-loading").hide(),
                                    e(".timeOut").show(),
                                    e("#refresh").addClass("time-out"))
                            }
                        })
                    }
                        , S = function(t, s, o) {
                        var r = {
                            provinceCode: m.numRes.essProvince,
                            cityCode: m.numRes.essCity,
                            numID: t,
                            goodsId: m.goodsId
                        };
                        k = !0,
                            e(".occupyTips").show(),
                            e.ajax({
                                type: "POST",
                                url: "/king/kingNumBuy/occupy",
                                data: r,
                                success: function(r) {
                                    "SUCCESS" === r ? (e(".mask, #number-popup, .occupyTips").hide(),
                                        E(),
                                        e("#number .p-content").text(t),
                                        m.numRes.number = t,
                                        "1" === s && "0" !== o ? e(".numberTips").show().find("i").text(o) : e(".numberTips").hide(),
                                    "请选择号码" === e("#top-desc").text() && e("#top-desc").removeClass("error").text(T)) : (e(".occupyTips").hide(),
                                        e("#error").show(),
                                        e("#reserved-number").find("span").text(t),
                                        e("#number-popup").hide()),
                                        e("#number").removeClass("error"),
                                        k = !1
                                },
                                error: function() {
                                    e(".occupyTips").hide(),
                                        e("#error").show(),
                                        e("#reserved-number").find("span").text(t),
                                        e("#number-popup").hide(),
                                        k = !1
                                }
                            })
                    };
                    e(".p-content").find("input").click(function(t) {
                        var s = e(t.currentTarget)
                            , o = s.parents("li")
                            , r = o.hasClass("error");
                        r && (o.removeClass("error"),
                            e("#top-desc").removeClass("error").text(T))
                    }),
                        e(".p-text-area").click(function() {
                            e("#delivery-desc").hasClass("error") && (e("#delivery-desc").removeClass("error"),
                                e("#top-desc").removeClass("error").text(T))
                        }),
                        e("#delivery").click(function(t) {
                            e(t.currentTarget).hasClass("error") && (e("#delivery").removeClass("error"),
                                e("#top-desc").removeClass("error").text(T))
                        });
                    var A = function() {
                        return e("li.error").removeClass("error"),
                        !!p.CustCheck.checkReceiverName(e("#certName").val()) && (!!p.CustCheck.checkIdCard(e("#certNo").val()) && (!!p.CustCheck.checkPhone(e("#mobilePhone").val()) && (!(y && !p.CustCheck.checkYzm(e(".yzmInput").val())) && (!(y && !p.CustCheck.checkYzmPhone(h)) && (!!p.CustCheck.checkNumAddress(e("#location .p-content").text()) && (!!p.CustCheck.checkNumber(e("#number .p-content").text()) && (!!p.CustCheck.checkAddress(e("#delivery .p-content").text()) && !!p.CustCheck.checkAddressInfo(e("#address").val()))))))))
                    }
                        , z = function(t) {
                        t && (m.delivery = {},
                            m.delivery.selfFetchCode = e(".since-content").find("input:checked").val()),
                            m.certInfo = {},
                            m.certInfo.certName = e("#certName").val().trim(),
                            m.certInfo.certId = e("#certNo").val().trim(),
                            m.certInfo.contractPhone = e("#mobilePhone").val().trim(),
                            m.post.address = e("#address").val().trim(),
                            m.goodsId = "" + m.numRes.essProvince + m.goodsId.substring(2),
                            m.product = i.product,
                            m.channel = i.channel,
                            m.captcha = e(".yzmInput").val().trim();
                        var s = {};
                        s.certInfo = m.certInfo,
                            s.post = m.post,
                            sessionStorage.setItem("ANT_CARD", (0,
                                n.default)(s))
                    }
                        , M = function(t) {
                        C = !1;
                        var s = {}
                            , o = void 0;
                        s.ttdwData = (0,
                            n.default)(m),
                            e.ajax({
                                type: "post",
                                url: "/king/kingBuy2/ttdw",
                                data: s,
                                success: function(s) {
                                    "0000" === s.code ? (e("#success, .mask").show(),
                                        e("#submit").attr("date", "have"),
                                        I(),
                                        t ? (o = '<p class="point">您的号码为：<span></span>。请您于拿到卡后<i>15天内</i>激活，如未激活，号码将被回收哦！',
                                            e("#success .point-list").empty().append(o),
                                            e("#success .point-list").find("span").text(e("#number .p-content").text())) : (o = '<p class="point">您的卡已在营业厅等待领取，营业员将会与您电话联系，请保持手机畅通！',
                                            e("#success .point-list").empty().append(o))) : "0005" === s.code ? (e("#error, .mask").show(),
                                        I(),
                                        e("#reserved-number").find("span").text(e("#number .p-content").text())) : (e("#errorAll, .mask").show(),
                                        I(),
                                        e("#errorAll .popup-desc").text(s.msg)),
                                        e("#since").hide(),
                                        C = !0,
                                        k = !1
                                },
                                error: function() {
                                    e("#overtime, .mask").show(),
                                        I(),
                                        e("#since").hide(),
                                        C = !0,
                                        k = !1
                                }
                            })
                    }
                        , F = function(t) {
                        p.checkMobiles(t) ? e(".yzm").removeClass("grey") : e(".yzm").addClass("grey")
                    }
                        , V = function() {
                        var t = sessionStorage.getItem("ANT_CARD");
                        if (!p.isEmpty(t)) {
                            var s = JSON.parse(t);
                            if (p.isEmpty(e("#certName").val())) {
                                var o = s.certInfo;
                                e("#certName").val(o.certName),
                                    e("#certNo").val(o.certId),
                                    e("#mobilePhone").val(o.contractPhone)
                            }
                            var r = s.post
                                , n = e("#post-city li[data-code=" + r.webCity + "]");
                            1 === n.length && (R(r.webCity, r.webCounty),
                                e("#delivery .p-content").text("请选择区/县").addClass("grey"),
                                e("#address").val(r.address),
                                m.post = r)
                        }
                    };
                    e("#location").on("click", function(t) {
                        e(t.currentTarget).hasClass("error") && (e("#location").removeClass("error"),
                            e("#top-desc").removeClass("error").text(T)),
                            s(m.numRes.essProvince, m.numRes.essCity);
                        var o = e(".mask");
                        o.show(),
                            I(),
                            e("#area").addClass("slip"),
                            o.one("click", function() {
                                e("#area").removeClass("slip"),
                                    setTimeout(function() {
                                        o.hide(),
                                            E()
                                    }, 300)
                            })
                    }),
                        e("#province").on("click", "li", function(t) {
                            var o = e(t.currentTarget)
                                , r = o.data("code");
                            o.addClass("selected").siblings("li").removeClass("selected"),
                                s(r)
                        }),
                        e("#city").on("click", "li", function(t) {
                            var s = e("#province li.selected")
                                , o = e(t.currentTarget);
                            o.addClass("selected").siblings("li").removeClass("selected"),
                                e("#location .p-content").text(s.text() + " " + o.text()).removeClass("grey"),
                                e.cookie("mallcity", s.data("code") + "|" + o.data("code"), {
                                    expires: 7,
                                    path: "/",
                                    domain: ".10010.com"
                                }),
                                m.numRes.essProvince = s.data("code") + "",
                                m.numRes.essCity = o.data("code") + "",
                                m.goodsId = "" + m.numRes.essProvince + m.goodsId.substring(2),
                                e("#area").removeClass("slip"),
                                e("#number .p-content").text(""),
                                e("#delivery-desc").show(),
                            f !== o.text() && (e("#delivery .p-content").text("请选择区/县").addClass("grey"),
                                f = o.text()),
                                N(),
                                setTimeout(function() {
                                    e(".mask").unbind("click").hide(),
                                        E()
                                }, 300),
                                e(".numberTips").hide(),
                            e(t.currentTarget).hasClass("error") && (e("#location").removeClass("error"),
                                e("#top-desc").removeClass("error").text(T))
                        }),
                        e(".popup-close").on("click", function(t) {
                            var s = e(t.currentTarget)
                                , o = s.attr("data-type");
                            e(".popup, .mask").hide(),
                                e("#refresh").text("换一批"),
                                E(),
                            "3" === o && window.history.back(-1)
                        }),
                        e("#number").on("click", function() {
                            p.CustCheck.checkNumAddress(e("#location .p-content").text()) && (e("#search").data("val", "").val(""),
                                e("#search-btn").show(),
                                e("#search-close-btn").hide(),
                                e(".timeOut").hide(),
                                O(),
                                e("#number-popup, .mask").show(),
                                I())
                        }),
                        e("#refresh").on("click", function() {
                            return e(".timeOut").hide(),
                                g.current > g.max ? void O() : void _()
                        }),
                        e("#search-btn").on("click", function() {
                            var t = e("#search").val().trim();
                            p.isEmpty(t) || (e("#search").data("val", t),
                                e("#search-btn").hide(),
                                e("#search-close-btn").show(),
                                O())
                        }),
                        e("#search-close-btn").on("click", function() {
                            e("#search").data("val", "").val(""),
                                e("#search-btn").show(),
                                e("#search-close-btn").hide(),
                                O()
                        }),
                        e("#search").on("keyup", function(t) {
                            var s = e(t.currentTarget)
                                , o = s.data("val");
                            "" + o !== s.val().trim() && (e("#search-btn").show(),
                                e("#search-close-btn").hide()),
                            "" === s.val().trim() && (s.data("val", ""),
                                O())
                        }),
                        e(".number-list").on("click", "a", function(t) {
                            var s = e(t.currentTarget).text().replace("靓", "")
                                , o = e(t.currentTarget).attr("data-niceRule")
                                , r = e(t.currentTarget).attr("data-monthLimit");
                            k || S(s, o, r)
                        }),
                        e("#reselect-number").on("click", function() {
                            e("#search-btn").show(),
                                e("#search-close-btn").hide(),
                                O(),
                                e("#error").hide(),
                                e("#number-popup").show()
                        }),
                        e("#delivery").on("click", function() {
                            if (p.CustCheck.checkNumAddress(e("#location .p-content").text())) {
                                R(m.post.webCity, m.post.webCounty);
                                var t = e(".mask");
                                t.show(),
                                    I(),
                                    e("#post").addClass("slip"),
                                    t.one("click", function() {
                                        e("#post").removeClass("slip"),
                                            setTimeout(function() {
                                                t.hide(),
                                                    E()
                                            }, 300)
                                    })
                            }
                        }),
                        e("#post-city").on("click", "li", function(t) {
                            var s = e(t.currentTarget)
                                , o = s.data("code");
                            s.addClass("selected").siblings("li").removeClass("selected"),
                                R(o)
                        }),
                        e("#post-district").on("click", "li", function(t) {
                            var s = e("#post-city li.selected")
                                , o = e(t.currentTarget);
                            o.addClass("selected").siblings("li").removeClass("selected"),
                                e("#delivery .p-content").text(s.data("province-name") + " " + s.text() + " " + o.text()).removeClass("grey"),
                                m.post.webCity = s.data("code") + "",
                                m.post.webCounty = o.data("code") + "",
                                e("#post").removeClass("slip"),
                                setTimeout(function() {
                                    e(".mask").unbind("click").hide(),
                                        E()
                                }, 300)
                        }),
                        e("#go-protocol").on("click", function() {
                            var t = {
                                city: m.numRes.essCity,
                                province: m.numRes.essProvince,
                                custName: e("#certName").val().trim(),
                                goodsId: m.goodsId,
                                number: m.numRes.number,
                                psptType: "02",
                                psptTypeCode: e("#certNo").val().trim(),
                                activityType: "27"
                            };
                            (0,
                                u.showProtocal)(t, "/mall-mobile/OrderInputAjax/kingProtocol", A)
                        }),
                        e("#protocol").on("click", function(t) {
                            var s = e(t.currentTarget);
                            s.hasClass("agree") ? (e("#submit").addClass("disable"),
                                s.removeClass("agree")) : (e("#submit").removeClass("disable"),
                                s.addClass("agree"))
                        });
                    var j = {}
                        , Y = function() {
                        j.webProvince = m.post.webProvince,
                            j.webCity = m.post.webCity,
                            j.webCounty = m.post.webCounty,
                            j.goodsId = m.goodsId,
                            j.essProvince = m.numRes.essProvince
                    };
                    e("#submit").on("click", function() {
                        k || e("#protocol").hasClass("agree") && A() && (Y(),
                            k = !0,
                            e("#top-desc").text(T).removeClass("error"),
                            e("#city li.selected").data("code") !== e("#post-city li.selected").data("ess-code") ? (z(!1),
                                M(!0),
                                k = !1) : e.ajax({
                                type: "post",
                                url: "/king/kingNumCard/selfFetch",
                                data: j,
                                success: function(t) {
                                    if ("1" === t.selfFetchFlag) {
                                        e("#since").show(),
                                            e(".mask").show(),
                                            I();
                                        var s = e(".since-content").find("ul");
                                        s.find("li").remove();
                                        for (var o = "", r = 0; r < t.selfFetchInfo.length; r += 1)
                                            o = 0 === r ? "<li><input type='radio' name='mall' id='radio" + r + "'  checked='checked'\n                value='" + t.selfFetchInfo[r].ADDRESS_ID + "' ><label for='radio" + r + "'\n                class='em'>" + t.selfFetchInfo[r].SELFGET_NAME + "：</label>\n                <label for='radio" + r + "' class='margin'>" + t.selfFetchInfo[r].SELFGET_ADDRESS + "</label></li>" : "<li><input type='radio' name='mall' id='radio" + r + "'\n                value='" + t.selfFetchInfo[r].ADDRESS_ID + "' ><label for='radio" + r + "'\n                class='em'>" + t.selfFetchInfo[r].SELFGET_NAME + "：</label>\n                <label for='radio" + r + "' class='margin'>" + t.selfFetchInfo[r].SELFGET_ADDRESS + "</label></li>",
                                                s.append(o)
                                    }
                                    "0" === t.selfFetchFlag && (z(!1),
                                        M(!0))
                                },
                                error: function() {
                                    z(!1),
                                        M(!0)
                                }
                            }))
                    }),
                        e(".sinceBtn").on("click", function() {
                            C && (z(!0),
                                M(!1))
                        }),
                        e(".noSince").on("click", function() {
                            C && (z(!1),
                                M(!0))
                        }),
                        e(window).resize(function() {
                            (0,
                                u.resize)()
                        }),
                        e("#address").on({
                            keydown: function(e) {
                                13 === e.keyCode && e.preventDefault()
                            },
                            input: function(t) {
                                var s = e(t.currentTarget)
                                    , o = s.val()
                                    , r = e("#address-temp").text(o).height();
                                s.css("height", r)
                            }
                        }),
                        e.ajax({
                            type: "get",
                            url: "/king/kingNumCard/ttdwinit",
                            data: i,
                            success: function(t) {
                                "0000" === t.resultCode ? a(t) : (e("#fail, .mask").show(),
                                    I())
                            },
                            error: function() {
                                e("#overtime, .mask").show(),
                                    I()
                            }
                        }),
                        e("#mobilePhone").on("keyup", function() {
                            var t = e("#mobilePhone").val();
                            11 === t.length ? (e(".yzm").removeClass("grey"),
                                e("#apply-phone").removeClass("error")) : e(".yzm").addClass("grey")
                        });
                    var L = 60
                        , G = void 0;
                    e(".yzm").on("click", function() {
                        e(".yzms").show(),
                            setTimeout(function() {
                                e(".yzms").hide(),
                                    E()
                            }, 2e3);
                        var t = e("#mobilePhone").val()
                            , s = e(".yzm");
                        p.CustCheck.checkPhone(e("#mobilePhone").val()) && v && (v = !1,
                            t !== h ? e(".rightI").hide() : e(".rightI").show(),
                            e("#apply-phone").removeClass("error"),
                            e("#top-desc").text(T).removeClass("error"),
                            e.ajax({
                                type: "get",
                                url: "/mall-mobile/CheckMessage/captcha",
                                data: {
                                    phoneVal: t,
                                    type: "22"
                                }
                            }),
                            G = setInterval(function() {
                                s.addClass("grey"),
                                    0 === L ? (clearInterval(G),
                                        s.text("重新获取").removeClass("grey"),
                                        L = 60,
                                        v = !0) : (s.text(L + "s"),
                                        L -= 1,
                                        v = !1)
                            }, 1e3))
                    });
                    var q = ""
                        , B = !0;
                    e("#captchaText").on("keyup", function() {
                        if (4 === e("#captchaText").val().trim().length && e("#captchaText").val().trim() !== q) {
                            var t = e("#mobilePhone").val().trim();
                            if (p.isEmpty(t))
                                return void p.error("mobilePhone", "请输入联系电话");
                            if (!p.checkMobiles(t))
                                return void p.error("mobilePhone", "您的手机号码格式有误，请重新输入");
                            e(".rightI").hide(),
                            B && (B = !1,
                                e.ajax({
                                    url: "/king/kingNumCard/captchaCheck",
                                    type: "POST",
                                    data: {
                                        phoneVal: e("#mobilePhone").val().trim(),
                                        captcha: e("#captchaText").val().trim(),
                                        type: 22
                                    },
                                    success: function(t) {
                                        q = e("#captchaText").val().trim(),
                                            "0000" === t.RespCode ? (h = e("#mobilePhone").val().trim(),
                                                e(".rightI").show(),
                                                e("#apply-yzm").removeClass("error"),
                                                e("#top-desc").removeClass("error"),
                                                P()) : "10001" === t.RespCode || "10002" === t.RespCode ? (h = "",
                                                p.error("apply-yzm", t.RespMsg)) : "10003" === t.RespCode && (h = "",
                                                "" === q ? p.error("apply-yzm", "请输入验证码！") : p.error("apply-yzm", t.RespMsg)),
                                            B = !0
                                    },
                                    error: function() {
                                        h = "",
                                            p.error("apply-yzm", "验证码错误"),
                                            B = !0
                                    }
                                }))
                        } else
                            4 !== e("#captchaText").val().trim().length && (q = "",
                                e(".rightI").hide())
                    })
                })
            }
        ).call(t, s(1))
    },
    999: function(e, t) {}
});
//# sourceMappingURL=fill.js.map
