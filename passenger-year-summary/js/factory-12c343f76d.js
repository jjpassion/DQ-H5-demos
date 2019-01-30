!function(){

	//v 20190122

	var f = f||{};

	f.isIOS = function(){

	 	var u = navigator.userAgent, app = navigator.appVersion;
	    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //g
	    var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

	    if (isIOS&&f.isWeiXin()) {
	　　	return true;
	    }else{
	    	return false;
	    }
	}

	f.isIOSForReset = function(){

		var u = navigator.userAgent, app = navigator.appVersion;
	    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //g
	    var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

	    if (isIOS) {
	　　	return true;
	    }else{
	    	return false;
	    }

	}

	f.isWeiXin = function(){

		var ua = window.navigator.userAgent.toLowerCase();
		
		if(ua.match(/MicroMessenger/i) == 'micromessenger'){
			return true;
		}else{
			return false;
		}
	}

	f.isQQ = function(){
		var ua = navigator.userAgent.toLowerCase();
		if (ua.match(/QQ/i) == "qq") {
			return true;
		}else{
			return false;
		}
		
	}  

	f.isWeiXinAndZFB = function(){

	 	var u = navigator.userAgent, app = navigator.appVersion;
	    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //g
	    var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

		var browser = navigator.userAgent.toLowerCase()
		var isKey = false;
		if(/AlipayClient/.test(window.navigator.userAgent)){
		    isKey = true;
		    
		}

		return f.isWeiXin()||(isKey&&isIOS)||f.isQQ();

	}


	f.os = function() {  
		var ua = navigator.userAgent,  
		Info = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/),
		isWindowsPhone = /(?:Windows Phone)/.test(ua),  
		isSymbian = /(?:SymbianOS)/.test(ua) || isWindowsPhone,   
		isAndroid = /(?:Android)/.test(ua),   
		isFireFox = /(?:Firefox)/.test(ua),   
		isChrome = /(?:Chrome|CriOS)/.test(ua),  
		isTablet = /(?:iPad|PlayBook)/.test(ua) || (isAndroid && !/(?:Mobile)/.test(ua)) || (isFireFox && /(?:Tablet)/.test(ua)),  // tablet 平板电脑
		isPhone = /(?:iPhone)/.test(ua) && !isTablet,  
		isPc = !isPhone && !isAndroid && !isSymbian;  

		phoneInfo = Info && parseInt(Info[1], 10);

		return {  
		  isTablet: isTablet,  
		  isPhone: isPhone,  
		  isAndroid : isAndroid,  
		  isPc : isPc,
		  phoneInfo:phoneInfo 
		};  
	}();  

	f.loading = function(app,callback1,callback){

		app.runRate = 0; // rate 比率，率；速度；价格；等级 

		app.nowRate = 0;

		var timer = setInterval(function(){
			
			if(app.runRate * 100<(app.nowRate+app.jsonAll+app.dataAll)){
				console.log(app.nowRate,app.jsonAll,app.dataAll, '22222')
				app.runRate += 0.01;
				callback1(app.runRate);

			}
			if(Math.floor(app.runRate * 100) >= 100){

				clearInterval(timer);
				callback();

			}
		},10);
	}

	f.preventDefault = function(className){

		var els = document.getElementsByClassName(className);

		for (var i = 0; i < els.length; i++) {

			els[i].addEventListener('touchmove', function (e) { 
				e.preventDefault();
			},false);
		}

	}

	f.addHammer = function(className,dir,callback){

		var pan = new Hammer($(className)[0]);
		pan.get('pan').set({ direction: Hammer.DIRECTION_ALL });
		pan.on(dir,function(){

			callback();

		});

	}

	f.createP = function(pageInfo,wrap,index){

		pageInfo.forEach(function(el,i){

			wrap.eq(i).html('<p>'+el+'</p>');

		});

		var length = pageInfo.length;

		wrap.addClass('hide').eq(0).removeClass('hide');

		index.removeClass('hide').slice(length,4).addClass('hide');
		index.removeClass('sel-foucs-index').eq(0).addClass('sel-foucs-index');

		if(length>1){
			$(".info-index").removeClass('hide');
		}else{
			$(".info-index").addClass('hide');
		}

		if(app.now == 7){

			$(".info-sel").addClass('last-info');
			$(".info-index").addClass('last-info-index');
			// $("#next, .arrow-0, .arrow-1").remove('hide');

			// $("#end-btn, .arrow-2, .arrow-3").removeClass('hide');

		}

		clearTimeout(f.panTimer);

		f.nowPageLength = length;

		f.nowInfo = 0;

	}

	f.changeInfo = function(wrap,r,nextCallback){

		var length = f.nowPageLength;

		if(f.isChanging){
			return false;
		}
		if(r == 1&&f.nowInfo == length-1){
			f.isChanging = true;
			nextCallback();
			console.log(app.now)
			Omega.trackEvent(app.event[app.now+1].id,app.event[app.now+1].desc);
			return false;
		}

		f.isChanging = true;
		$(".hand, .hand-arrow").addClass('hide');
		clearTimeout(f.panTimer);
		f.panTimerFc();
		var now = f.nowInfo;
		f.nowInfo = r == 1 ? Math.abs((now+r)%(length)):Math.abs(now == 0?length-1:now+r);
		$(wrap).eq(now).addClass(r==1?'goLeft':'goRight');
		$(wrap).eq(f.nowInfo).removeClass('hide').addClass(r==1?'goLeftBack':'goRightBack');

		$(".sel-index").removeClass('sel-foucs-index').eq(f.nowInfo).addClass('sel-foucs-index');

		if(f.nowInfo == length-1&&app.now == 7){

			$("#end-btn, .arrow-2, .arrow-3").removeClass('hide');
			
		}

		setTimeout(function(){

			f.isChanging = false;
			$(wrap).removeClass('goLeft goRight goLeftBack goRightBack').eq(now).addClass('hide');

		},600);

	}

	f.panTimerFc = function(){

		f.panTimer = setTimeout(function(){

			$(".hand, .hand-arrow").removeClass('hide');

		},3000);

	}

	f.timerChange = function(){
		clearTimeout(f.timerChangeEl);
		f.timerChangeEl = setTimeout(function(){

			f.changeInfo('.info-sel',1);
		},3600);

	}


	f.getShareImg = function(info){

		var shareInfo = ['image/share/1-82bad4d554.jpg','image/share/2-f766f95d01.jpg','image/share/3-45c8e0f54b.jpg','image/share/4-0fb29bfbe2.jpg','image/share/5-95998258ea.jpg','image/share/6-6db3da516d.jpg','image/share/7-caaf8c5f77.jpg','image/share/8-68a622c5b4.jpg','image/share/9-9ff9663672.jpg']
		var endInfo = ['image/end_1-a5947d5741.png','image/end_2-6d46f4d86e.png','image/end_3-9f211d1944.png','image/end_4-8c0035ea9b.png','image/end_5-47e64efaaf.png','image/end_6-d4d16fd38a.png','image/end_7-47e64efaaf.png','image/end_8-0c66002aba.png','image/end_9-f82cfb13fe.png']
		var shareTips = ['image/share_1-3e2df4dabf.png','image/share_2-b444458ab3.png','image/share_3-e99ff48842.png','image/share_4-9f8164b6a4.png','image/share_5-c14cfbe82d.png','image/share_6-8e0c76f4a5.png','image/share_7-c14cfbe82d.png','image/share_8-5c8d2c163a.png','image/share_9-229ee93ba0.png']

		var shareAnTips = ['image/share_an_1-5111736edd.png','image/share_an_2-426fc21c18.png','image/share_an_3-e3a0c2be62.png','image/share_an_4-e6537b1198.png','image/share_an_5-524d804523.png','image/share_an_6-77759d264b.png','image/share_an_7-524d804523.png','image/share_an_8-3257c001b3.png','image/share_an_9-dd2d53a113.png'];

		var color = [
			{t:'#e4597a',i:'#c8959a'},
			{t:'#4a7849',i:'#abad6e'},
			{t:'#af2232',i:'#c72a3b'},
			{t:'#6c5990',i:'#835987'},
			{t:'#835987',i:'#f7a001'},
			{t:'#6594ec',i:'#709db4'},
			{t:'#d18106',i:'#f2a018'},
			{t:'#7f5f2e',i:'#97804e'}
		];

		var type = info.type;

		$(".name").text(info.name);
		$(".share-info").attr('src',f.isWeiXinAndZFB()?shareTips[type-1]:shareAnTips[type-1]);
		$(".end-info").attr('src',endInfo[type-1]);
		var image = new Image();
		image.onload = function(){
			
			if(f.isWeiXinAndZFB()){

				$("#ending").removeClass('hide');

				setTimeout(function(){

					html2canvas(document.querySelector("#share-con"),{canvas:$("share-canvas")[0]}).then(canvas => {
					    $("#data64").attr('src',canvas.toDataURL('image/jpeg','0.6'));
					    $("#ending").addClass('hide fade-in').removeClass('z-index');
					    $(".share-info, .share-logo").addClass('hide');
					});		

				},2500);

			}else{

				$("#ending").removeClass('z-index').addClass('hide fade-in')
				$(".end-info").addClass('hide');

			}

		}
		$(".share-bg").attr('src',shareInfo[type-1]);
		$(".name-share").text(info.name);
		if(type != 9){
			var colorNow = color[type-1];
			
			$(".time-share").css('color',colorNow.t);
			$(".rate-user").css('color',colorNow.t).text(info.rate+'%');
			$(".time-user").text(info.time);
			$(".rate-share").css('color',colorNow.i);
		}

		image.src = shareInfo[type-1];


	};

	f.login = function(id,callback,fallback){

		if(window.login){
			login.setConfig({appid: id});
			login.login(callback, fallback);
		}

	}
	
	f.getImageUrl = function(url,_sum){

		var dd = '[';

		for (_i = 0;_i <= _sum; _i++) {

			dd+='"image/'+url+'/'+_i+'.jpg",';
		}

	}

	f.isToken = function(name){

		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
		var r = window.location.search.substr(1).match(reg);
		if (r != null) return unescape(r[2]); return null;

	}


	f.ajax = function(url,data,successCallback,errorCallback,isMock){

		if(isMock){

			var mockData = {
			"errno": "0",
			"errmsg": "success",
			"data": {
			"userInfo": {
				"name": "",
				"nick": " ",
				"phone":"17710540327"
			},
			"mostTravelTimesInfo": {
				"type": 2,
				"time": 2
			},
			"lastOutSideInfo": {
				"date": "2018-01-01 22:00:04",
				"startLocation": "龙华区.博爱.中山路|博爱北路与中山路交叉口",
				"endLocation": "美兰区|海口鲁能希尔顿酒店",
				"driverName": "韩冠"
			},
			"earliestOutSideInfo": {
				"date": "",
				"time": "",
				"startLocation": "",
				"endLocation": "",
				"driverName": ""
			},
			"rainDayInfo": {
				"date": 'NaN-NaN-NaN NaN:NaN:NaN',
				"waitTime": 457,
				"startLocation": "龙华区.博爱.中山路|博爱北路与中山路交叉口",
				"endLocation": "美兰区|海口鲁能希尔顿酒店",
				"driverName": "韩冠"
			},
			"longTravelInfo": {
				"date": "2018-01-01 20:20:02",
				"totalDistance": "11709",
				"startLocation": "美兰区琼山大道2号|海口鲁能希尔顿酒店",
				"endLocation": "龙华区海口骑楼老街",
				"driverName": "吴居福"
			},
			"mostTravelDayInfo": {
				"date": "2018-01-01",
				"travelTimes": 2,
				"endLocationCount": 2
			},
			"notLocalOrderCount": 2,
			"nightTravelTimes": 1,
			"totalOrders": 2,
			"totalTravel": "22.79",
			"travelDistanceRange": 99.999999,
			"mainTravelTime": "22",
			"visitFrequently": [{
				"position": "龙华区海口骑楼老街",
				"times": 1
			}],
			"offsiteTravelTimes": 2,
			"offsiteTravelPlaceCount": 1,
			"stationAirplanTime": 0,
			"setECPerons": 0,
			"shareTravelTimes": 6,
			"commentDriverTimes": 0,
			"babyType": {
				"mostOutSideTimes": 2,
				"key": "不在家宝宝",
				"babyType": 6,
				"mostOutSideTimesRange": 68.8888888888888
			},
			"rawData": {
				"base": {
					"id": 191490,
					"pid": 17592220540669,
					"total_order_dis": 22793,
					"city_hero_dri_answer_order": 0,
					"five_star_dri_answer_order": 2,
					"wait_time_avg": 76,
					"main_travel_time_interval": "22\u000220",
					"travel_sharing_emergency_contact_pv": 0,
					"travel_sharing_pv": 6,
					"emergency_contact_cnt": 0,
					"long_dis_cnt": 2,
					"commonly_used_1st": "龙华区海口骑楼老街",
					"commonly_used_1st_cnt": 1,
					"commonly_used_2nd": "美兰区|海口鲁能希尔顿酒店",
					"commonly_used_2nd_cnt": 1,
					"commonly_used_3rd": "",
					"comment_complaint_cnt": 0,
					"travel_most_depart_time": "2018-01-01",
					"travel_most_travel_times": 2,
					"travel_most_end_addr_cnt": 2,
					"air_train_cnt": 0,
					"outland_travel_city_num": 1,
					"max_intensity_wait_dur": 457,
					"year_use_cnt": 0,
					"normal_trip_cnt": 1
				},
				"order": {
					"id": 237530,
					"pid": 17592220540669,
					"night_travel_orders": 1,
					"latest_order_time": "1514815204",
					"latest_order_start_name": "龙华区.博爱.中山路|博爱北路与中山路交叉口",
					"latest_order_end_name": "美兰区|海口鲁能希尔顿酒店",
					"latest_order_driver_name": "韩冠",
					"furthest_order_time": "2018-01-01 20:20:02",
					"furthest_order_start_name": "美兰区琼山大道2号|海口鲁能希尔顿酒店",
					"furthest_order_end_name": "龙华区海口骑楼老街",
					"furthest_order_driver_name": "吴居福",
					"maximum_rainfall_order_time": "2018-01-01 22:00:04",
					"maximum_rainfall_order_start_name": "龙华区.博爱.中山路|博爱北路与中山路交叉口",
					"maximum_rainfall_order_end_name": "美兰区|海口鲁能希尔顿酒店",
					"maximum_rainfall_order_name": "韩冠",
					"nonlocal_orders": 2,
					"furthest_to_local_order_time": "2018-01-01 22:00:04",
					"furthest_to_local_order_start_name": "龙华区.博爱.中山路|博爱北路与中山路交叉口",
					"furthest_to_local_order_end_name": "美兰区|海口鲁能希尔顿酒店",
					"furthest_to_local_order_driver_name": "韩冠",
					"total_fast_orders": 2,
					"total_gulf_orders": 0,
					"total_taxi_orders": 0,
					"total_lux_orders": 0,
					"total_htw_orders": 0,
					"earliest_order_date": "",
					"earliest_depart_time": "",
					"earliest_start_addr": "",
					"earliest_end_addr": "",
					"earliest_driver_name": "",
					"earliest_early_cnt": 0,
					"furthest_order_est_dis": "11709"
				},
				"range": {
					"id": 182566,
					"pid": 17592220540669,
					"total_displacement_dis_rank": 227342072,
					"taxi_fast_cnt_rank": 265994161,
					"gulf_luxr_cnt_rank": 131556244,
					"bicy_cnt_rank": 133682907,
					"nighttime_cnt_rank": 116837776,
					"driver_wait_average_dur_rank": 106505500,
					"travel_share_cnt_rank": 248337592,
					"city_hero_five_star_grab_cnt_rank": 257715592,
					"travel_times_rank": 301598992,
					"long_dis_rank": 107542746,
					"morning_travel_rank": 294175695,
					"normal_travel_rank": 241027458,
					"nonlocal_orders_rank": 103435708
				}
			}
		}
	}



		


			//data end
			successCallback(mockData);
			return false;


		}



		$.ajax({
			url:url,
			dataType:'json',
			beforeSend: function (XMLHttpRequest) {
         		XMLHttpRequest.setRequestHeader("ticket", data);
  
            },
			success:function(e){

				successCallback(e);

			},
			error:function(e){

				errorCallback(e);

			}

		});

	}

	f.changeSec = function(n){

		if(n == 60){
			return '<span class=nub>60秒</span>';
		}else{
			return n > 60 ?'<span class=nub>'+Math.floor(n/60)+'</span>'+'分<span class=nub>'+(n%60)+'</span>秒':'<span class=nub>'+n+'</span>秒';
		}
	}

	f.checkData = function(data){

		var isError = false;

		if(!data||JSON.stringify(data) == '{}'){

			console.error('返回数据为空或不完整');
			isError = true;

		}else if(data.errno == 1005){

			f.userLogin();
			isError = true;

		}else if(data.errno == 1004){

			console.error('请求数据返回错误码：'+data.errno);
			isError = true;

		}else if(JSON.stringify(data.data) == '{}'||!data.data){

			console.error('返回用户数据data不完整或为空');
			isError = true;

		}

		return isError;

	}

	f.loginNom = function(){

		f.login(39013,function(response){
			console.log(response)
			app.ticket = response.ticket;
			f.ajax('//api-summary.xiaojukeji.com/passenger/getYearSummaryInfo',app.ticket,app.successCallback,app.errorCallback);
		},function(e){
			console.error(e);
		});

	}

	f.userLogin = function(){

		var token = f.isToken('token');

		if(token){

			app.ticket = token;
			f.ajax('//api-summary.xiaojukeji.com/passenger/getYearSummaryInfo',app.ticket,app.successCallback,app.errorCallback);

		}else{

			D.getUserInfo(function(res){
				
				// console.log(res.token)
				if(res.token){

					app.ticket = res.token;
					f.ajax('//api-summary.xiaojukeji.com/passenger/getYearSummaryInfo',app.ticket,app.successCallback,app.errorCallback);

				}else{

					f.loginNom();

				}

			},function(err){

				f.loginNom();

			});

		}

	}


	f.error = function(){

		f.errorTimer = setTimeout(function(){

			if(!app.isSource){
				$(".error").removeClass('hide');
			}

		},30000);

	}

	f.iosVideoPlay = function(app,pageA,pageB,pageC,pageD,pageE,pageF,pageG){

		var p = app.videoPauseData = [
			{t:184/24,c:pageA,b:144/24},
			{t:380/24,c:pageB,b:237/24},
			{t:526/24,c:pageC,b:384/24},
			{t:672/24,c:pageD,b:529/24},
			{t:817/24,c:pageE,b:675/24},
			{t:960/24,c:pageF,b:820/24},
			{t:1105/24,c:pageG,b:964/24},
			{t:1249/24,c:pageG,b:1108/24}
		];

		var v = $("#video")[0];

		var t = f.videoTimer = setInterval(function(){

			var pn = p[app.now];
			var k = v.currentTime;

			if(pn&&k >= pn.t&&!pn.g){

				pn.c();				
				v.currentTime = pn.b;
				// pn.g = true;

			}

			if(k>9){

				$(".info-wrap").removeClass('hide');

			}

		},15);

	}

	f.iosVideoGo = function(app) {
		
		if(app.now < 7){
			var v = $('#video')[0];
			app.videoPauseData[app.now].g = true;
			v.currentTime = app.videoPauseData[app.now].t;
			app.now++;
			console.log(app.now)
		}
		
	}

	f.initAudio = function(){

		$(".eff").forEach(function(el){

			el.play();
			el.pause();

		});
		

		$("#bgm")[0].play();


	}

	f.close = function(){

		f.isClose = true;
		$("#bgm")[0].pause();
		$(".eff").forEach(function(el){

			$(el)[0].pause();

		});
		
	}

	f.closeEff = function(){

		$(".eff").forEach(function(el){

			$(el)[0].pause();

		});
		
		
	}


	f.play = function(n,isPk){
		
		if((!app.isIOS||isPk)&&!f.isClose&&!app.isEnd){
			$("#bgm")[0].play();
			$(".eff").forEach(function(el){

				$(el)[0].pause();

			});
			$(".eff").eq(n)[0].play();
		}
		

	}

	f.closeVideoAudio = function(b){

		$(".video").forEach(function(el){
			el.muted = b;
		});

	}

	f.initVideo = function(){

		$(".video").forEach(function(el){

			el.play();
			el.pause();

		});

		$("#iosPanUp").removeClass('hide');

	}

	f.playVideo = function(){

		app.videoNow++;
		var video = $(".video");
		var last = video.eq(app.videoNow-1);
		last[0].pause();
		setTimeout(function(){

			last.addClass('hide');

		},500);

		video.eq(app.videoNow).removeClass('hide')[0].play();
		
		if(app.videoNow>=3){
			app.now++;
		}

	}

	f.introTimerFun = function(c){

		f.introTimer = setTimeout(function(){

			c();

		},4000);

	}

	f.setBASE = function(url,callback){

		var base = null;
		var images = [];

		$.getJSON(url, function(data, textStatus, jqxhr) {

			
			data.base.forEach(function(el){

				var img = new Image();
				img.src = el;
				images.push(img);

			});

			callback&&callback(images);

		});

	}

	f.setShate = function(){

		var id = f.isToken('channelId');

		"undefined" != typeof Omega && Omega.setShare({
			title:'你的滴滴出行年度总结',
			content:'回看一路走来的温暖里程',
			url:'https://community.xiaojukeji.com/market/passenger-year-summary/index.html'+(id?'?channelId='+id:''),
			icon:'https://community.xiaojukeji.com/market/passenger-year-summary/image/icon-65b8763569.jpg',
			success:function(){
				Omega.trackEvent(app.event[0].id,app.event[0].desc);
			}
		});

	}

	f.setIosTop = function(){

		if(innerWidth / innerHeight>(0.661)&&f.isIOSForReset()){ 

			$(".info-wrap, .info-sel").css('top','-71vw');
			$(".last-info").css('top','-70vw');
			$(".video").eq(0).addClass('video-top');
			console.log('reset top');
		}

	}

	f.isLowCheck = function(){

		var u = navigator.userAgent, app = navigator.appVersion;

		if((u.indexOf('MIX 2') != -1||u.indexOf('MI 6') != -1)&&(f.isWeiXin()||f.isQQ())){

			f.isLow = true;

		}

		if(u.indexOf('EML-AL00') != -1&&u.indexOf('didi') != -1){

			f.isLow = true;

		}

		if((u.indexOf('SM-G9600') != -1) &&(f.isWeiXin()||f.isQQ()) ){

			if(f.getChrome()>58){

				f.isLow = true;

			}

		}

		if(u.indexOf('TBS/044432') != -1){

			f.isLow = true;
			
		}

	}


	f.getChrome = function(){

		var agent = navigator.userAgent.toLowerCase() ;
		var regStr_chrome = /chrome\/[\d.]+/gi;
		var v = 0;
		if(agent.indexOf("chrome") > 0){

			v = agent.match(regStr_chrome)[0].split('/')[1].split('.')[0];

		}

		return v;
	}


	window.f = f;

}();