!function(){

	var Frame = Frame||{}; 


	// bitmap  start

	var bitmap = function(ob){

		this.type = 'bitmap';
		this.x = 0;
		this.y = 0;
		this.isAccept = false;

		this.now = 0;
		this.url = ob.url;
		this.sum = ob.sum;
		this.loadSum = 0;
		this.isFPS = 0.7;//ob.ftp||.4;

		this.imagesUrl = ob.imagesUrl;

		this.isBottom = false;
		this.images = [];
		this.loop = true;
		this.audioLoop = false;
		this.isHeight = false;
		this.order = ob.order||false;
		this.isBase = ob.isBase||false;
		this.isPlay = false;
		this.isPause = false;
		this.callback = null;
		this.loadCallback = null;
		this.opacity = 1;
		this.isGOOpacity = false;

		this.init(ob.base);

	}
	

	bitmap.prototype.init = function(base){

		var _self = this,
			_iUrl = _self.imagesUrl,
			_images = _self.images,
			_url = _self.url,
			_sum = _self.sum,
			_order = _self.order,
			_img,_i;

		if(!base){

			for (_i = 0;_i <= _sum; _i++) {

				_img = new Image();
				_img.src = _url?(_url.replace('(x)',_order?_sum-_i:_i)):(_iUrl[_i]);
				console.log(_iUrl&&_iUrl[_i],i,_sum);
				_img.onload = function(){

					_self.loadSum++;
					
					if(_self.loadSum == _self.sum+1){
						_self.isLoad = true;
						_self.loadCallback && _self.loadCallback();
					}

				}
				_images.push(_img);
			}
		}else{

			_self.images = base;
			
			_self.isLoad = true;
			_self.loadCallback && _self.loadCallback();
			

		}
		

		Frame.data.push(this);

	}

	bitmap.prototype.fadeIn = function(){

		this.isFadeIn = true;
		this.isPlay = true;
		this.opacity = 0;

	}

	bitmap.prototype.hide = function(){

		this.isGOOpacity = true;

	}

	bitmap.prototype.play = function(){

		if(this.isLoad){
			this.now = 0;
			this.opacity = 1;
			this.isGOOpacity = false;
			this.isPlay = true;
			this.isPause = false;	
			this.auidoSrc&&this.audioPlay();
		}else{
			this.loadCallback = function(){
				this.play();
			}
		}
	}

	bitmap.prototype.remove = function(){
		
		this.isPlay = false;

	}

	bitmap.prototype.reset = function(){

		this.now = 0;
		this.isPlay = false;
		this.isPause = false;

	}

	bitmap.prototype.paused = function(){

		this.pause = true;

	}

	bitmap.prototype.goon = function(){

		this.pause = false;

	}


	bitmap.prototype.setFrameCallback = function(index,callback){

		this.frameEvent = index;
		this.frameCallback = callback;

	}

	Frame.bitmap = bitmap;



	// frame init start


	Frame.setArrayIndex = function(i){

		var d = this.data;
		this.data = d.slice(i).concat(d.slice(0,i));
		
	}

	Frame.init = function(id,zoom){

		this.data = [];
		this.can = document.getElementById(id);
		this.ctx = this.can.getContext('2d');

	    var ratio = parseFloat(innerWidth / zoom);
		this.can.width = innerWidth / ratio;
		this.can.height = innerHeight / ratio;
	    this.can.style.transform = "scale(" + ratio + "," + ratio + ")";
		
	    return ratio;

	};

	Frame.stop = function(){

		this.isStop = true;

	}

	
	var drawBitmap = function(){


		var _self = this,
			_img,_imgHeight,_imgWidth,_r,_n,_w,_h,
			_canWidth = _self.can.width,
			_canHeight = _self.can.height;
			

		_self.ctx.clearRect(0,0,_canWidth,_canHeight);
		_self.data.forEach(function(el){

			if(el.isPlay){
				
				_n = Math.floor(el.now) >= el.sum ? el.sum : Math.floor(el.now);
				_img = el.images[_n];
				_w = _img.width/_img.height * _canHeight;
				_h = _canHeight;

				_wc = _canWidth;
				_hc = _canWidth / (_img.width/_img.height);

				_r = _img.width/_img.height;

				if(el.isHeight){

					_imgWidth = _h * _r;
					_imgHeight = _h;

				}else{

					_imgWidth = _wc;
					_imgHeight = _hc;

				}

				if(el.isAccept){
					el.x = caitlyn.x*el.scaletly||0;
					el.y = caitlyn.y*el.scaletly+el.scaleY||0;
				}

				if(el.isGOOpacity){

					el.opacity = (el.opacity - 0.02);
					if(el.opacity <= 0.1){
						el.isGOOpacity = false;
						el.isPlay = false;
						el.opacity = 0;
					}
				}

				if(el.isFadeIn){
					el.opacity = (el.opacity + 0.02);
					if(el.opacity >= 1){
						el.isFadeIn = false;
						el.opacity = 1;
					}
				}

				_self.ctx.globalAlpha = el.opacity;
				
				if(el.isBottom){
					_self.ctx.drawImage(_img,0,0,_img.width,_img.height,0,_canHeight - _imgHeight,_imgWidth,_imgHeight);	
				}else{

					_self.ctx.drawImage(_img,0,0,_img.width,_img.height,0,(_canHeight - _imgHeight)/2,_imgWidth,_imgHeight);

				}

				if(_n == el.frameEvent){
					el.frameCallback&&el.frameCallback();
				}

				// frame callback
				el.onFrameRun&&el.onFrameRun(_n);

				if(el.loop){

					if(_n == el.sum){

						el.now = 0;
						el.callback&&el.callback();

					}else{
						el.now+=el.isFPS;
					};

				}else{

					if(_n >= el.sum){
						el.now = el.sum;

						!el.isPause&&el.callback&&el.callback();
						el.isPause = true;
					}else{

						el.now+=el.isFPS;

					}
				}
			}
		});

	    setTimeout(function(){

	        !_self.isStop&&requestAnimationFrame(_self.drawBitmap.bind(_self));

	    },1000/24);

	} 

	Frame.drawBitmap = drawBitmap;

	window.Frame = Frame;

}();



