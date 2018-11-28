'use strict';

// 获取对象的type
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};


(function (win) {
  var gameStage = void 0;

  // 基本
  var __extends = function __extends(obj1, obj2) {
    Object.keys(obj2).forEach(function (e) {
      if (obj2.hasOwnProperty(e)) {
        obj1[e] = obj2[e];
      }
    });
    var c = function c() {
      this.constructor = obj1;
    };
    c.prototype = obj2.prototype;
    obj1.prototype = new c();
  };

  // let obj1 = {a:1, c: 0}
  // let obj2 = {b:2, a:3}
  // console.log(__extends(obj1, obj2), obj1, obj2)

  var __setMethods = function __setMethods(object, key, value) {
    // 判断 key 是否是 object
    if ((typeof key === 'undefined' ? 'undefined' : _typeof(key)) === 'object') {
      for (var item in key) {
        __setMethods(object, item, key[item]);
      }
    } else if (typeof key === 'string') {
      object.prototype[key] = value;
    }
  };

  // 工具方法
  var toolkits = function () {
    var a = {
      BGColor: '#000',
      FGColor: '#FFF',
      LOADINGTEXT: '前方高能... ',
      PIXEL_RATIO: window.devicePixelRatio || 2,
      ASSETS_WIDTH: 750,
      ASSETS_HEIGHT: 1206, //1206
      getRandom: function getRandom(max, min) {
        //max>x≥min
        max = max || 1;
        min = min || 0;
        return Math.floor(Math.random() * (max - min)) + min;
      },
      num2Str: function num2Str(num, length, strInstead) {
        // 数字转成固定长度的字符,ex: 数字20转成4位字符串 => '0020'
        if (typeof num == 'number' && num === num) {
          num = num.toString();
        }

        strInstead = strInstead || '0';

        if (typeof num !== 'string') {
          return strInstead;
        }
        if (length > num.length) {
          for (var i = 0, l = length - num.length; i < l; i++) {
            num = strInstead + num;
          }
        }
        return num;
      }
    };
    // proportion： 比例
    a.PROPORTION = a.ASSETS_WIDTH / a.ASSETS_HEIGHT, //比例
    // a.SCALE = 1;
    a.resize = function () {
      var w = window.innerWidth,
          h = window.innerHeight;

      if (w / h > a.ASSETS_WIDTH / a.ASSETS_HEIGHT) {
        a.CANVAS_WIDTH = Math.round(a.ASSETS_WIDTH * h / a.ASSETS_HEIGHT);
        a.CANVAS_HEIGHT = h;
      } else {
        a.CANVAS_WIDTH = w;
        a.CANVAS_HEIGHT = Math.round(a.ASSETS_HEIGHT * w / a.ASSETS_WIDTH);
      }
    };
    a.resize();
    return a;
  }();

  // 舞台相关 类？
  var StageManager = function () {
    // 构造函数？
    function stage(canvasid) {
      var that = this;
      console.log(this, 111)
      gameStage = that;
      that.scenesConstainer = new createjs.Container();
      that.timeDevider = 1;
      that.lastTime = 0;
      that.paused = false;
      that.scenes = new Array();
      that.canvas = document.getElementById(canvasid);
      that.stage = new createjs.Stage(that.canvas);
      createjs.Touch.enable(that.stage);
      // ticker 钟表，按不断重绘
      createjs.Ticker.setFPS(60);
      createjs.Ticker.addEventListener("tick", function (f) {
        if (that.isPaused()) {
          return;
        };
        return that.update(f);
      });
      that.stage.addChild(that.scenesConstainer);
      that.setRect(); //设置宽高
      /*
      that.stage.on('pressup',() => {
         createjs.Ticker.setFPS(60);
         that.slowDown()
       })
       */

      var event_resize = ['viewportready', 'viewportchange', 'orientationchange', 'resize'];
      // var __t;
      event_resize.forEach(function (item, i) {
        window.addEventListener(item, function () {
          that.handleResize()
        });
      });
      // 横屏则暂停
      if (typeof window.orientation == 'number' && window.orientation != 0) {
        this.pause();
      };
      /*window.addEventListener('orientationchange', function (e) {
        if (window.orientation != 0) {
          that.pause();
        } else {
          that.goon();
        }
      });*/
    }
    __setMethods(stage, {
      /*slowDown() {
     clearTimeout(this.readyToSlowDown);
     this.readyToSlowDown = setTimeout(() => {
       createjs.Ticker.setFPS(16);
     },4000)
   },*/
      goon: function goon() {
        this.paused = false;
        return this;
      },
      pause: function pause() {
        this.paused = true;
        return this;
      },
      isPaused: function isPaused() {
        return this.paused;
      },
      handleResize: function handleResize() {
        this.setRect();
      },
      setRect: function setRect() {
        var canvas = this.canvas;

        toolkits.resize();

        canvas.width = toolkits.ASSETS_WIDTH;
        canvas.height = toolkits.ASSETS_HEIGHT;
        canvas.style.width = toolkits.CANVAS_WIDTH + 'px';
        canvas.style.height = toolkits.CANVAS_HEIGHT + 'px';
        return this;
      },
      update: function update(d) {
        if (this.scenes.length != 0) {
          var b = this.scenes[this.scenes.length - 1];
          if (!b.isInited()) {
            b.init();
          }
          var c = createjs.Ticker.getTime();
          var e = c - this.lastTime;
          this.lastTime = c;
          b.update(e * 0.001 / this.timeDevider);
        }
        this.stage.update(d);
      },
      replaceAllSceneWith: function replaceAllSceneWith(b) {
        while (this.scenes.length != 0) {
          this.popScenes();
        }
        this.pushScene(b);
        return this;
      },
      pushScene: function pushScene(b) {
        if (this.scenes[this.scenes.length - 1] === b) {
          return this;
        };
        this.scenes.push(b);
        this.scenesConstainer.addChild(b);
        return this;
      },
      popScenes: function popScenes(key, value) {
        var that = this;
        if (this.scenes.length != 0) {
          if (!key && !value) {
            this.scenesConstainer.removeChild(this.scenes[this.scenes.length - 1]);
            this.scenes.pop();
          } else {
            if (!key || !value) {
              return;
            };
            this.scenes = this.scenes.filter(function (item) {
              var isMatched = item[key] === value;
              isMatched && that.scenesConstainer.removeChild(item);
              return !isMatched;
            });
          };
        }
        return this;
      },
      popScenesExcept: function popScenesExcept(key, value) {
        var that = this;
        if (!key || !value) {
          return;
        };
        if (this.scenes.length != 0) {
          this.scenes = this.scenes.filter(function (item) {
            var isMatched = item[key] === value;
            !isMatched && that.scenesConstainer.removeChild(item);
            return isMatched;
          });
        }
        return this;
      }
    });
    return stage;
  }();

  // let a = new StageManager('game')
  // console.log(a.isPaused())

  // 场景通用的扩展模块
  var BaseScene = function (c) {
    function _scene() {
      // console.log(this)
      c.call(this);
      this.liveTime = 0;
      // this.gui = new Array();
      this.gameObjects = new Array();
      this.initiliazed = false;
    }
    __extends(_scene, c);
    __setMethods(_scene, {
      init: function init() {
        this.initiliazed = true;
      },
      isInited: function isInited() {
        return this.initiliazed;
      },
      update: function update(d) {
        var that = this;
        that.liveTime += d;
        var newGameObjects = [];
        that.gameObjects.forEach(function (item, i) {
          if (!that.isGameOver && !that.isPaused) {
            item.update(d);
          }
          if (item.isDead()) {
            item.onDead();
          } else {
            newGameObjects.push(item);
          }
        });
        that.gameObjects.splice(0, that.gameObjects.length);
        newGameObjects.forEach(function (item, i) {
          that.gameObjects[i] = item;
        });
      },
      addObject: function addObject(obj_game) {
        this.gameObjects.push(obj_game);
      },
      addObjectAt: function addObjectAt(obj_game, ctn) {
        this.gameObjects.push(obj_game);
        (ctn || this).addChild(obj_game);
      }
    });

    return _scene;
  }(createjs.Container);



})(window)


