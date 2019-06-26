! function () {

	//v 20190122

	FastClick.attach(document.body);

	document.addEventListener('WeixinJSBridgeReady', function () {

		$(".video")[0].load();
		WeixinJSBridge.call('hideToolbar');

	}, false);

	f.isLowCheck();

	var app = window.app = app || {
		runRate: 0,
		nowRate: 0,
		sum: 0,
		sumall: 0,
		now: 0,
		videoNow: 0,
		bitmap: [],
		jsonAll: 0,
		dataAll: 0,
		event: [{
				id: 'shareTimes',
				desc: '分享'
			},
			{
				id: 'clickPlay',
				desc: '点击开启盘点'
			},
			{
				id: 'panPage1',
				desc: '滑动婴儿车到下一页'
			},
			{
				id: 'panPage2',
				desc: '滑动白天老爷车到下一页'
			},
			{
				id: 'panPage3',
				desc: '滑动夜里老爷车到下一页'
			},
			{
				id: 'panPage4',
				desc: '滑动雨天鲸鱼到下一页'
			},
			{
				id: 'panPage5',
				desc: '滑动飞行器到下一页'
			},
			{
				id: 'panPage6',
				desc: '滑动骑士到下一页'
			},
			{
				id: 'panPage7',
				desc: '滑动最后婴儿车到落版页'
			},
			{
				id: 'clickPage7',
				desc: '点击最后婴儿车到落版页'
			}
		]
	};

	// isIOS 表示IOS微信
	app.isIOS = f.isIOS();

	app.jsonAll = app.isIOS ? 9 : 1;
	// console.log('jsonAll:' + app.jsonAll, app.isIOS)
	// DQ
	let __urlPrefix = '//community.xiaojukeji.com/market/passenger-year-summary/'

	var iosData = ["image/change_0-8308a4cd0e.png", "image/change_1-e8b64bc783.png", "image/change_2-5ab7f9ae5b.png", "image/change_3-6abb1af9e2.png", "image/change_4-ca94ecf42a.png", "image/change_5-3456458cf8.png", "image/end_1-a5947d5741.png", "image/end_2-6d46f4d86e.png", "image/end_3-9f211d1944.png", "image/end_4-8c0035ea9b.png", "image/end_5-47e64efaaf.png", "image/end_6-d4d16fd38a.png", "image/end_7-47e64efaaf.png", "image/end_8-0c66002aba.png", "image/end_9-f82cfb13fe.png", "image/logo-480510eb00.png", "image/next-ddf5648c55.png",
		"image/run-f177419350.png", "image/shadow-802168682d.png", "image/share_1-8fbd36ee16.png", "image/share_2-c55cf1412d.png", "image/share_3-170657e2bb.png", "image/share_4-c0437d93c7.png", "image/share_5-cf2abfe62f.png", "image/share_6-8ec073b426.png", "image/share_7-cf2abfe62f.png", "image/share_8-7ed6e69f34.png", "image/share_9-ca61b9633e.png", "image/share_logo-c92d38395c.png"
	];

	Teemo.self.setData(iosData); // iosData length 29

	// 监听加载中事件
	Teemo.load.on('loading', function (e) {
		// console.log(e)
		app.nowRate = Math.floor((e.nowProgress / e.allProgress) * 89);

	});

	/**
	 * loading 逻辑解读
	 * loading 逻辑分为三个部分 100% === 89%（图片加载）+ 10%（动图Json）+ 1% (数据加载 app.dataAll)
	 * 图片的加载 --- 放在了Teemo（处理数据加载）-loading中处理，所以 app.nowRate 会乘以89
	 * 动图JSON --- factory.setBase 的回调当中，app.jsonAll 自增的方式
	 * 数据dataAll --- app.successCallback 的回调当中，表示数据接口请求完毕，再进行展示
	 */

	/**
		* 这里的f.loading 只不过就是处理这三种情况的加载数据，，，汇总成一个总体的进度比例==进度条的展示
		* f.loading = function (app, callback1, callback) {
		// callback1 加载中的cbk
		// callcack 加载结束后的callback
		app.runRate = 0; // rate 比率，率；速度；价格；等级 
		app.nowRate = 0;
		var timer = setInterval(function () {
			// app.runRate 0~1 0.99
			console.log(app.nowRate, app.jsonAll, app.dataAll)
			if (app.runRate * 100 < (app.nowRate + app.jsonAll + app.dataAll)) {
				app.runRate += 0.01;
				// console.log( app.nowRate, app.jsonAll, app.dataAll)
				callback1(app.runRate);
			}
			else if (Math.floor(app.runRate * 100) >= 100) {
				console.log('app.nowRate:', 'app.jsonAll: ' , 'app.dataAll: ')
				clearInterval(timer);
				callback();
			}
		}, 10);
	}
	  */


	Teemo.load.on('complete', function (e) {

		app.isSource = true;
		clearTimeout(f.errorTimer);
		$(".error").remove();
		$(".reset").forEach(function (el) {

			$(el).attr('src', $(el).attr('rsrc'));

		});
		console.log(11);
		!app.isIOS && initAction();

	});

	f.preventDefault('pd');

	var showPage0 = function () {

		$(".info-wrap, .info-wrap-swipe, .hand, .hand-arrow").removeClass('hide');

		$("#next, .arrow-0, .arrow-1").removeClass('hide');

		f.play(1);

	}

	var initAction = function () {
		// console.log('Frame', Frame)
		Frame.init('canvas', 540); // zoom 第二个参数，是什么意思呢？缩放---canvas
		Frame.drawBitmap();

		// 理解为请求数据接口
		f.setBASE('image/data_0-e014dfc6c4.json', function (base) {
			console.log(base, 'base')
			app.cartoonGo = new Frame.bitmap({
				base: base,
				sum: f.isLow ? 0 : 127,
				ftp: 0.5
			}); // isLow 低版本检测？？

			app.cartoonGo.callback = function () {

				app.cartoonGo.remove();
				app.cartoonLoop.play();
				app.isOneEnd = true;
				f.introTimerFun(playOne);
				$(".jump, .jump-wrap").addClass('hide');

			}

			app.jsonAll++;


		});
		f.setBASE('image/data_1-aeec54ae20.json', function (base) {

			app.cartoonLoop = new Frame.bitmap({
				base: base,
				sum: f.isLow ? 0 : 21
			});

			app.jsonAll++;

		});

		f.setBASE('image/data_2-029ed6539c.json', function (base) {

			app.AGo = new Frame.bitmap({
				base: base,
				sum: f.isLow ? 0 : 26,
				ftp: .6
			});
			app.AGo.setFrameCallback(14, function () {

				app.AGo.isFPS = 1.5;

			});

			app.AGo.callback = function () {

				app.AGo.remove();
				app.ALoop.play();
				showPage0();

			}

			app.bitmap[0] = {
				loop: app.ALoop,
				go: app.AGo
			}

			app.jsonAll++;

		});

		f.setBASE('image/data_3-db8b408e8b.json', function (base) {

			app.ALoop = new Frame.bitmap({
				base: base,
				sum: f.isLow ? 0 : 72
			});

			app.bitmap[0] = {
				loop: app.ALoop,
				go: app.AGo
			}

			app.bitmap[6] = {
				go: app.ALoop
			}

			app.jsonAll++;

		});

		f.setBASE('image/data_4-99712d0f2e.json', function (base) {

			app.BLoop = new Frame.bitmap({
				base: base,
				sum: f.isLow ? 0 : 72
			});

			app.bitmap[1] = {
				go: app.BLoop
			}

			app.jsonAll++;

		});

		f.setBASE('image/data_5-187d541dfe.json', function (base) {

			app.CLoop = new Frame.bitmap({
				base: base,
				sum: f.isLow ? 0 : 72
			});

			app.bitmap[2] = {
				go: app.CLoop
			}

			app.jsonAll++;

		});

		f.setBASE('image/data_6-38108fa9d5.json', function (base) {

			app.DLoop = new Frame.bitmap({
				base: base,
				sum: f.isLow ? 0 : 72
			});

			app.bitmap[3] = {
				go: app.DLoop
			}

			app.jsonAll++;

		});

		f.setBASE('image/data_7-4ef2c50281.json', function (base) {

			app.ELoop = new Frame.bitmap({
				base: base,
				sum: f.isLow ? 0 : 72
			});

			app.bitmap[4] = {
				go: app.ELoop
			}

			app.jsonAll++;

		});

		f.setBASE('image/data_8-376383c043.json', function (base) {

			app.FLoop = new Frame.bitmap({
				base: base,
				sum: f.isLow ? 0 : 72
			});

			app.bitmap[5] = {
				go: app.FLoop
			}

			app.jsonAll++;

		});
	}

	var loadingCallback = function (e) {
		// nowRate === e (0~1)
		var rate = Math.floor(e * 100) + '%';
		$(".run").css('width', rate);
		$("#rate").text('LOADING... ' + rate);

	}

	var endingCallback = function (e) {

		$("#play, .agree-info, .agree-bg, .agree-w, .agree-wrap, .info-l").removeClass('hide');

	}

	var errorCallback = app.errorCallback = function (error) {

		// window.location.href = 'error.html';

		console.error('error');

	}


	var successCallback = app.successCallback = function (data) {

		var isError = f.checkData(data);

		if (isError) {

			errorCallback();
			return false;
		}

		app.dataAll = 1;

		app.isLoadData = true;

		dUI.dataTransform(data.data);

		f.getShareImg(dUI);

		app.isGetUserInfo = true;

		if (dUI.type == 9) {

			$(".time-share, .rate-share").remove();

		}

		f.setShate();

	}

	// DQ
	// D.setLoginConfig({
	// 	loginType:'trinity',
	// 	role:1
	// });

	window.onload = function () {

		setTimeout(function () {
			// DQ
			// f.userLogin();

			// app.isLoadData = true;
			f.ajax('//api-summary.xiaojukeji.com/passenger/getYearSummaryInfo', app.ticket, app.successCallback, app.errorCallback, true);

			// app.successCallback()

			console.log(dUI)

			f.error();
			Teemo.load.start();
			// console.log(app)
			// 测试数据：
			app.dataAll = 1
			f.loading(app, loadingCallback, endingCallback);
			f.isIOS() && $(".video")[0].load();

		}, 100);

	}

	// var pageA = function(){

	// 	console.log('pageA');

	// }

	// var pageB = function(){

	// 	console.log('pageB');
	// 	showPage0();

	// }

	// var pageC = function(){

	// 	console.log('pageC');

	// }

	// var pageD = function(){

	// 	console.log('pageD');

	// }

	// var pageE = function(){

	// 	console.log('pageE');

	// }

	// var pageF = function(){

	// 	console.log('pageF');

	// }

	// var pageG = function(){

	// 	console.log('pageG');

	// }

	var anCanvasNext = function () {
		var now = app.now;
		var last = app.bitmap[now - 1];
		app.cartoonLoop.remove();

		last && last.loop && last.loop.remove();
		last && last.go && last.go.remove();
		app.bitmap[now].go.play();
		app.now++;
	}

	var changeNext = function () {

		if (app.isIOS) {
			f.playVideo();
		} else {
			anCanvasNext();
		}

		if (app.now >= 2) {

			var last = app.now == 2 ? $(".info-wrap, .info-wrap-swipe") : $(".info-sel-wrap");
			last.addClass('hide');
			$(".info-index, .hand, .hand-arrow").addClass('hide');
			$(".info-wrap, .info-wrap-swipe").remove();

			if (app.now >= 3 && app.now <= 6) {

				$(".hand").attr('src', __urlPrefix + 'image/hand_b-92dca22234.png');
				$(".hand-arrow").attr('src', __urlPrefix + 'image/hand_arrow_b-2170dbf884.png');

			} else {
				$(".hand").attr('src', __urlPrefix + 'image/hand-203046b462.png');
				$(".hand-arrow").attr('src', __urlPrefix + 'image/hand_arrow-095edb2c77.png');
			}

			if (app.now > 2 && app.now < 7) {
				$(".info-sel").addClass('sel-fff');
			} else {
				$(".info-sel").removeClass('sel-fff');
			}
			$(".info-sel").addClass('hide');

			setTimeout(function () {

				f.createP(dUI.pageData[app.now - 2], $(".info-sel"), $(".sel-index"));
				f.play(app.now, true);

				setTimeout(function () {

					$(".info-sel-wrap").removeClass('hide');
					f.panTimerFc();
					f.isChanging = false;

					$(".change").addClass('hide');

				}, 200);

			}, 400);

		}

	}

	var nextPage = function () {

		if (app.now == 7) {

			if (app.isIOS) {

				$("#video, #text-wrap").addClass('fade-out');

			} else {

				$("#canvas, #text-wrap").addClass('fade-out');

			}

			$("#ending").removeClass('hide');

			f.closeEff();
			app.isEnd = true;
			return false;
		}
		$(".hand-arrow, .hand").addClass('hide');
		clearTimeout(f.panTimer);

		$(".change").eq(app.now - 1).removeClass('hide');

		setTimeout(function () {

			changeNext()

		}, 500);

	}

	var jumpIntro = function () {

		$('.jump, .jump-wrap').addClass('hide');
		if (app.isIOS) {

			var video = $(".video");
			video[0].pause();
			video[1].pause();
			video[2].pause();
			setTimeout(function () {

				video[0].className = 'video hide video-bottom pd';

			}, 500);
			video.eq(1).removeClass('hide')[0].play();
			app.videoNow = 1;
		} else {
			app.cartoonGo.remove();
			app.cartoonLoop.play();
		}
		app.isOneEnd = true;

		app.now = 0;

	}

	$(".video")[0].addEventListener('ended', function () {

		app.isOneEnd = true;
		f.playVideo();
		f.introTimerFun(playOne);
		$(".jump, .jump-wrap").addClass('hide');
		$(".video").removeClass('video-top');

	}, false);

	$(".video")[2].addEventListener('ended', function () {

		f.playVideo();
		$(".info-wrap, .info-wrap-swipe, .hand, .hand-arrow").removeClass('hide');
		f.play(1, true);

	}, false);

	$("#play").click(function () {
		console.log('开始')
		if (!app.isLoadData) {

			// f.userLogin();

		}
		// DQ debugger  判断用户是否登录，先去掉
		// if($(".agree-w").hasClass('hide')||!app.isGetUserInfo){
		// 	return false;
		// }

		f.initAudio();
		$("#loading").addClass('fade-out');
		$("#con").removeClass('hide');
		$(".jump, .jump-wrap").removeClass('hide');

		if (app.isIOS) {
			f.initVideo();
			$(".video").eq(0).removeClass('hide')[0].play();
		} else {
			$("body").css('background-color', '#f1f1f1');
			$("#canvas").removeClass('hide');
			app.cartoonGo.play();
			f.play(0);
		}

		$("#orientLayer").removeClass('hide');

		f.setIosTop();

		f.setShate();

		// Omega.trackEvent(app.event[1].id,app.event[1].desc);

	});

	$("#next").click(function (e) {

		e.preventDefault();
		nextPage();

	});

	$("#con").click(function () {

		var con = $(".a-run");

		$(".con-eff")[0].play();

		if (con.hasClass('con-run')) {

			con.removeClass('con-run');
			f.close();
			$(".video")[0].muted = true;
			$("#bgm")[0].pause();

		} else {
			con.addClass('con-run');
			$(".video")[0].muted = false;
			$("#bgm")[0].play();
			f.isClose = false;
			!app.isEnd && f.play(app.now, true);

		}

	});

	$("#end-btn").click(function () {

		if (app.isIOS) {

			$("#video, #text-wrap").addClass('fade-out');

		} else {
			$("#canvas, #text-wrap").addClass('fade-out');
		}

		$("#ending").removeClass('hide');

		f.closeEff();

		app.isEnd = true;

		// 数据埋点
		// Omega.trackEvent(app.event[9].id,app.event[9].desc);

		return false;

	});

	var playOne = function () {

		if (app.isPanbottom || !app.isOneEnd) {
			return false;
		}
		clearTimeout(f.introTimer);
		app.isPanbottom = true;
		$("#text-wrap").removeClass('hide');
		$("#iosPanUp").addClass('hide');
		if (app.isIOS) {
			f.playVideo();
		} else {
			anCanvasNext();
		}

	}

	$("#iosPanUp").click(function () {

		playOne();

	});

	$("#canvas").click(function () {

		playOne();

	});

	$(".jump, .jump-wrap").click(function () {

		jumpIntro();

	});

	$(".agree-info, .agree-bg, .agree-wrap").click(function () {

		if ($(".agree-w").hasClass('hide')) {

			$(".agree-w").removeClass('hide');

		} else {

			$(".agree-w").addClass('hide');

		}

	});

	f.addHammer(app.isIOS ? '#iosPanUp' : '#canvas', 'panup', function () {

		playOne();

	});


	f.addHammer('.info-sel-wrap', 'panleft', function () {

		f.changeInfo('.info-sel', 1, nextPage);


	});

	f.addHammer('.info-wrap-swipe', 'panleft', function () {

		if (f.isPassOne) return false;
		f.isPassOne = true;
		$(".hand-arrow, .hand").addClass('hide');
		nextPage();
		// Omega.trackEvent(app.event[2].id,app.event[2].desc);

	});

	$(".video")[0].addEventListener(f.isWeiXin() ? 'canplaythrough' : 'loadedmetadata', function () {

		app.isIOS && app.jsonAll++;

	});



}();