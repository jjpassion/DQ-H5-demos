!function(){

	//v 20190122

	var _dUI = Object.create(null);

	var checkN = function(n){

		if(n>=0){

			var s = n.toString().split('.');
			
			if(s[1]&&s[1].length > 2){
				
				return n.toString().slice(0,3 + s[0].length);

			}else{
				return n
			}

			return n;

		}else{

			return 0;

		}

	}


	var dateChange = function(date){

		var n = date.split("-");

		return '<span class="nub">'+Math.floor(n[1])+'</span>月<span class="nub">'+Math.floor(n[2])+'</span>日';

	}

	var dateChange1 = function(date){

		var n = date.split("-");

		return '<span class="nub-2">'+Math.floor(n[1])+'</span>月<span class="nub-2">'+Math.floor(n[2])+'</span>日';

	}

	var timeChangeGetTime = function(date){

		var n = date.split(" ")[1].split(":");

		return '<span class="nub">'+n[0]+':'+n[1]+'</span>';

	}

	var timeChangeGetDate = function(date){

		var n = date.split(" ")[0].split("-");

		return '<span class="nub-2">'+Math.floor(n[1])+'</span>月<span class="nub-2">'+Math.floor(n[2])+'</span>日';

	}

	var timeChangeGetDate1 = function(date){

		var n = date.split(" ")[0].split("-");

		return '<span class="nub">'+Math.floor(n[1])+'</span>月<span class="nub">'+Math.floor(n[2])+'</span>日';

	}

	var timeChange = function(date){

		var n = date.split(":");

		return '<span class="nub">'+n[0]+'</span>:<span class="nub">'+n[1]+'</span>';

	}

	var checkD = function(d){

		return !!(JSON.stringify(d) != '{}'&&d&&d.date&&d.date.toLowerCase() != 'null'&&d.date.toLowerCase().indexOf('nan') == -1);

	}

	var checkO = function(d){

		return !!(JSON.stringify(d) != '{}'&&d&&d.date&&d.date.toLowerCase() != 'null'&&d.date.toLowerCase().indexOf('nan') == -1);

	}


	_dUI.dataTransform = function(data){

		_dUI.name = data.userInfo.nick||data.userInfo.phone;
		_dUI.phone = data.userInfo.phone;
		_dUI.type = data.babyType.babyType;
		_dUI.time = data.babyType.mostOutSideTimes;
		_dUI.rate = checkN(data.babyType.mostOutSideTimesRange);

		_dUI.pageData = [];

		//info page 1
		_dUI.pageData[0] = infoPageOneInit(data);

		//info page 2
		_dUI.pageData[1] = infoPageTwoInit(data);

		//info page 3
		_dUI.pageData[2] = infoPageThreeInit(data);

		//info page 4
		_dUI.pageData[3] = infoPageFourInit(data);

		//info page 5
		_dUI.pageData[4] = infoPageFiveInit(data);

		//info page 6
		_dUI.pageData[5] = infoPageSixInit(data);
	}


	var infoPageOneInit = function(data){

		var rel = [];

		//条件判断

		if(data.travelDistanceRange==null||data.travelDistanceRange===''||data.travelDistanceRange == 0){

			rel.push('这一年，你闲庭信步。</br> 使用滴滴出行，仅完成了</br><span class=nub>'+ checkN(data.totalTravel) +'</span>公里的里程。');

		}else{

			rel.push('这一年，你步履不停。</br> 使用滴滴出行，</br>共完成了<span class=nub>'+checkN(data.totalTravel)+'</span>公里的里程， </br>超过了<span class=nub>'+checkN(data.travelDistanceRange)+'%</span>的滴滴用户。'); 
				
		}



		if(data.commentDriverTimes>0){

			rel.push('这一年，你一共评价了</br><span class=nub>'+checkN(data.commentDriverTimes)+'</span>位司机。</br>你对滴滴的服务和</br>体验十分在意，</br>你的每一个反馈</br>都帮助我们做的更好。');

		}



		if(data.mostTravelTimesInfo.time != 0&&JSON.stringify(data.visitFrequently) != '[]'&&data.visitFrequently){

			var carType = ['','出租车','快车','专车','豪华车','单车'];

			var visitString = '';

			data.visitFrequently.forEach(function(el,i){

				visitString += el.position;

			});

			rel.push('这一年，你最喜欢</br><span class=nub>'+carType[data.mostTravelTimesInfo.type]+'</span>出行，一共<span class=nub>'+data. mostTravelTimesInfo.time+'</span>次</br>最常在<span class=nub>'+data.mainTravelTime+':00</span>左右叫车</br>最常去这个地方：</br><span class=nub>'+visitString+'</span>');

		}


		return rel;

	}

	var infoPageTwoInit = function(data){

		var rel = [];

		var lastOut = data.lastOutSideInfo; //夜间

		if(checkO(lastOut)){

			rel.push('记得'+timeChangeGetDate1(lastOut.date)+'，</br>已经是晚上'+timeChangeGetTime(lastOut.date)+'，</br>你仍然从：<span class=nub>'+lastOut.startLocation+'</span></br>前往：<span class=nub>'+lastOut.endLocation+'</span></br>像这样的夜路，一年你走了<span class=nub>'+data.nightTravelTimes+'</span>次。');

		}else{

			rel.push('这一年，你还没有夜间用车，</br>如果未来免不了要走夜路，</br>滴滴会用心守护你的每一程。');

		}


		var earliest = data.earliestOutSideInfo; //早间

		if(checkO(earliest)){

			rel.push('这一年，你超级努力。</br> 记得'+dateChange(earliest.date)+'你起的特别早</br>刚刚'+timeChangeGetTime(earliest.time)+'</span></br>就从：<span class=nub>'+earliest.startLocation+'</span></br>前往：<span class=nub>'+earliest.endLocation+'</span>');

		}

		var long = data.longTravelInfo;  //远途

		if(checkO(long)){

			rel.push('记得'+timeChangeGetDate1(long.date)+'你'+timeChangeGetTime(long.date)+'</span>上车 </br>不惜一路长途跋涉<span class="nub">'+long.totalDistance+'</span>公里</br>从：<span class=nub>'+long.startLocation+'</span></br>前往：<span class=nub>'+long.endLocation+'</span></br>这是你全年最远的一程');

		}else{

			rel.push('这一年，你还没有远途用车，</br>如果有一天你不得不长途跋涉，</br>滴滴将会全力护送，让你一路安心。');

		}

		var most = data.mostTravelDayInfo;

		if(checkO(most)){

			rel.push('记得一年里最奔波的一天，</br>是'+dateChange(most.date)+'吧，</br>你一共用车<span class=nub>'+most.travelTimes+'</span>次，</br>去了<span class=nub>'+most.endLocationCount+'</span>个目的地。')
		}


		return rel;

	}

	var infoPageThreeInit = function(data){

		var rel = [];

		var rain = data.rainDayInfo;

		if(checkO(rain)){

			rel.push('<span class=nub-2>2018</span>年，'+timeChangeGetDate(rain.date)+'</br>你的出行赶上了特大风雨 </br>你用了'+f.changeSec(rain.waitTime)+'叫到车</br>恶劣天气全城遭遇叫车难， </br>感谢你在风雨中对司机的耐心等候。');

		}else{

			rel.push('这一年，你没有在风雨天叫过车，</br>如果有一天你不得不冒雨出门，</br>滴滴会竭尽全力前来接驾。</br>');

		}

		return rel;

	}

	var infoPageFourInit = function(data){

		var rel = [];

		var place = data.offsiteTravelPlaceCount;

		if(place>0){

			var lo = data.stationAirplanTime > 0 ? '这一年，你辗转于城市间，</br>有<span class=nub>'+checkN(data.stationAirplanTime)+'</span>次前往长途车站、</br>火车站或机场</br>':'';

			rel.push(lo+'<span class="sp-top">全年在<span class=nub>'+place+'</span class=m-top>个不同的</br>城市打车<span class=nub>'+checkN(data.offsiteTravelTimes)+'</span>次，</br>这些路上你一定看到了</br>不寻常的风景。</span>');

		}else{

			rel.push('这一年，你习惯了在</br> 同一个城市叫车，</br>虽然在熟悉的地方会很有安全感，</br>但如果有一天你想出去看看，</br>滴滴会随叫随到，一路用心陪伴。');

		}

		return rel;

	}

	var infoPageFiveInit = function(data){

		var rel = [];

		var isSpecialScenes = checkD(data.rainDayInfo)||checkD(data.lastOutSideInfo)||checkD(data.earliestOutSideInfo)||checkD(data.longTravelInfo);

		var setECPerons = data.setECPerons;

		if(isSpecialScenes&&setECPerons>0){

			rel.push('这一年，你早出晚归，</br>冒风雨、赶远路也成了家常便饭，</br>但路上的你并不孤单，</br>你一共设置了<span class=nub-c1>'+setECPerons+'</span>位<span class="nub-1-c1">紧急联系人</span></br>使用了<span class=nub-c1>'+data.shareTravelTimes+'</span>次<span class=nub-1-c1>行程分享</span>。</br>他们都时刻关注着你的行程，</br>守护你安全抵达。');

		}else if(!isSpecialScenes&&setECPerons>0){

			rel.push('未来的出行，难免有早出晚归，</br>冒风雨、赶远路这样的难熬的行程，</br>但路上的你不会孤单，</br>你一共设置了<span class=nub-c1>'+setECPerons+'</span>位<span class=nub-1-c1>紧急联系人</span>，</br>可以随时<span class=nub-c1>分享行程</span>给他们，</br>让所有关心你的人都能放心。</br>');

		}else if(isSpecialScenes&&setECPerons == 0){

			rel.push('这一年，你早出晚归，</br>冒风雨、赶远路也成了家常便饭，</br>虽然你习惯一个人承受路上的不安，</br>但你应该将亲友设置成</br><span class=nub-2-c1>紧急联系人</span>，</br>习惯去<span class="nub-1-c1">使用行程分享</span>，</br>让自己在路上更安心，</br>也让关心你的人都放心。');

		}else{

			rel.push('未来的出行，难免有早出晚归，</br>冒风雨、赶远路这样的难熬的行程，</br>为了在路上可以更安心，</br>建议您提前将亲友设置成</br><span class=nub-2-c1>紧急联系人</span>，</br>并习惯<span class="nub-1-c1">使用行程分享</span>，</br>让自己在路上更安心，</br>也让关心你的人都放心。');

		}

		return rel;

	}

	var infoPageSixInit = function(data){

		var rel = [];

		data.totalOrders>0&&rel.push('2018这一路并不好走，</br>滴滴有幸<span class=nub-c>'+data.totalOrders+'</span>次与你同行。</br>在路上，每一位</br>司机师傅都把你当作宝宝，</br>用心守护到终点。');

		rel.push('回顾这一路，</br>你发现你有多特别了吗？</br>马上查看你的年度出行印象，</br>了解你是哪种特别的宝宝。');

		return rel;

	}




	window.dUI = _dUI;


}();