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
        }
        ;
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
      }
      ;
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
        }
        ;
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
            }
            ;
            this.scenes = this.scenes.filter(function (item) {
              var isMatched = item[key] === value;
              isMatched && that.scenesConstainer.removeChild(item);
              return !isMatched;
            });
          }
          ;
        }
        return this;
      },
      popScenesExcept: function popScenesExcept(key, value) {
        var that = this;
        if (!key || !value) {
          return;
        }
        ;
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
    // c == createjs.Container
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

  // 游戏角色、元素相关
  var GameObject = function (a) {
    // a === createjs.Container
    __extends(b, a);

    function b() {
      a.call(this);
      this.liveTime = 0;
      this.killed = false;
    }

    __setMethods(b, {
      update: function update(c) {
        this.liveTime += c;
      },
      kill: function kill() {
        this.killed = true;
      },
      isDead: function isDead() {
        return this.killed;
      },
      onDead: function onDead() {
        if (this.parent) {
          this.parent.removeChild(this);
        }
      }
    });
    return b;
  }(createjs.Container);

  // 资源管理
  var AssetsLoader = function (b) {
    __extends(a, b);

    function a(resources) {
      b.call(this);
      var that = this;
      that.loader = new createjs.LoadQueue();
      that.res = resources || {};

      createjs.EventDispatcher.initialize(a.prototype);

      that.loader.installPlugin(createjs.Sound);
      createjs.Sound.initializeDefaultPlugins(); //安装回放插件
      that.soundsList = {};

      that.bg = new createjs.Shape();
      that.bg.graphics.beginFill(toolkits.BGColor).drawRect(0, 0, toolkits.ASSETS_WIDTH, toolkits.ASSETS_HEIGHT).endFill();

      that.addChild(that.bg);

      that.loader.on("complete", function (e) {
        that.handleComplete(e);
      });
      that.loader.on("progress", function (e) {
        that.handleProgress(e);
      });

      that.alpha = 0;
      that.sceneName = 'loader';
    }

    __setMethods(a, {
      update: function update() {
      },
      resetUI: function resetUI() {
        this.loadPercent && (this.removeAllChildren(), this.loadPercent = undefined);
        this.addChild(this.bg);
        return this;
      },
      transitionStart: function transitionStart(cb) {
        this.resetUI();
        this.alpha = 0;
        gameStage.pushScene(this);
        createjs.Tween.get(this).to({alpha: 1}, 300, createjs.Ease.linear).call(function () {
          gameStage.popScenes('sceneName', 'loader');
          typeof cb === 'function' && cb();
        });
        return this;
      },
      transitionEnd: function transitionEnd(cb) {
        this.alpha = 1;
        gameStage.pushScene(this);
        createjs.Tween.get(this).to({alpha: 0}, 300, createjs.Ease.linear).call(function () {
          gameStage.popScenes('sceneName', 'loader');
          typeof cb === 'function' && cb();
        });
        return this;
      },
      preload: function preload(newScene) {
        var _this = this;

        var resources = this.res[newScene.resKey];
        if (typeof newScene.startDraw !== 'function') {
          newScene.startDraw = function () {
          };
        }
        if (!resources || resources['res'].length == 0 || resources.isLoaded) {
          // 如果没有本场景的资源或本场景资源已经加载了
          // 则直接不输出loading，直接过渡动画到下一场景
          this.transitionStart(function () {
            gameStage.replaceAllSceneWith(newScene);
            newScene.startDraw();
            _this.transitionEnd(function () {
              newScene.startPlay();
            });
          });
        } else {
          this.newScene = newScene;
          this.newSceneRes = resources;
          this.handleStart();
        }
      },
      handleStart: function handleStart(e) {
        var _this2 = this;

        this.transitionStart(function () {
          gameStage.replaceAllSceneWith(_this2.newScene);
          gameStage.pushScene(_this2);
          _this2.loader.loadManifest(_this2.newSceneRes['res']);
        });
      },
      handleComplete: function handleComplete(e) {
        var _this3 = this;

        if (_this3.newScene) {
          _this3.res[_this3.newScene.resKey].isLoaded = true;
          // 即将淡出过渡动画时，先绘制
          _this3.newScene.startDraw();
          // 点击进入下一个场景
          // var text = new createjs.Text('点击进入', '24px Arial', toolkits.FGColor)
          // _this3.addChild(text)
          this.loadPercent.text = '点击进入'
          var a = false
          _this3.on('click', function () {
            if (a) {
              return
            }
            a = true
            _this3.transitionEnd(function () {
              // 过渡动画完全淡出后
              _this3.newScene.startPlay();
            });
          })
        } else {
          // this.callback();
        }
        ;
      },
      handleProgress: function handleProgress(e) {
        var TEXT = (toolkits.LOADINGTEXT || '') + (e.loaded * 100).toFixed(0) + "%";
        var horse = this.getResult('horse')
        if (horse && !this.horse) {
          horse = this.getSpriteCenter('horse')
          this.horse = horse
          horse.y += 20
          horse.gotoAndPlay('horse')
          this.addChild(horse)
        }
        // loading-sun
        // loading-text
        var sun = this.getResult('loading-sun')
        if (sun && !this.loading_sun) {
          sun = this.getBitmapCenter('loading-sun')
          sun.regY = toolkits.ASSETS_WIDTH * 1.7
          sun.y += toolkits.ASSETS_WIDTH * 1.17
          sun.rotation = 10
          createjs.Tween.get(sun).to({rotation: 10}).to({rotation: -10}, 9000)
          this.loading_sun = sun
          this.addChild(sun)
        }
        var border = this.getResult('loading-border')
        if (border && !this.loading_border) {
          border = this.getBitmapCenter('loading-border')
          this.loading_border = border
          border.y -= 60
          this.addChild(border)
        }
        var text = this.getResult('loading-text')
        if (text && !this.l_text) {
          text = this.getBitmapCenter('loading-text')
          text.y -= 180
          this.l_text = text
          this.addChild(text)
        }
        if (this.loadPercent) {
          this.loadPercent.text = TEXT;
        } else {
          this.loadPercent = new createjs.Text(TEXT, '26px Arial', toolkits.FGColor);
          this.loadPercent.y = toolkits.ASSETS_HEIGHT / 2 + 110;
          this.loadPercent.x = toolkits.ASSETS_WIDTH / 2;
          this.loadPercent.textAlign = 'center';
          this.addChild(this.loadPercent);
        }
        ;
      },
      getResult: function getResult(c) {
        return this.loader.getResult(c);
      },
      getButton: function getButton(c, fn, sprite) {
        fn = typeof fn == 'function' ? fn : function () {
        };
        var btn = this.getBitmapCenter(c);
        switch (sprite) {
          case 'sprite':
            btn = this.getSprite('btns');
            btn.gotoAndStop(c);
            break;
          case 'bitmap':
          default:
            btn = this.getBitmapCenter(c);
        }
        var _b = btn.getBounds();
        btn.x = toolkits.ASSETS_WIDTH / 2;
        btn.y = toolkits.ASSETS_HEIGHT / 2;
        btn.regX = _b.width / 2;
        btn.regY = _b.height / 2;

        var scale = function scale(num) {
          if (typeof num !== 'number') {
            num = 1;
          }
          createjs.Tween.get(btn).to({scaleX: num, scaleY: num}, 30);
        };
        btn.on('mousedown', function () {
          scale(0.95);
        });
        btn.on('click', function (e) {
          fn.call(btn, e);
          btn.clicked = true;
        });
        btn.on('pressmove', function () {
          scale(1);
        });
        btn.on('pressup', function () {
          scale(1);
        });
        return btn;
      },
      getBitmap: function getBitmap(c) {
        return new createjs.Bitmap(this.getResult(c));
      },
      getBitmapCenterX: function getBitmapCenterX(c) {
        var d = this.getBitmap(c);
        if (!d || !d.getBounds()) {
          console.log(c, d);
          return d;
        }
        ;
        d.regX = d.getBounds().width / 2;
        d.x = toolkits.ASSETS_WIDTH / 2;
        return d;
      },
      getBitmapCenter: function getBitmapCenter(c) {
        var d = this.getBitmap(c);
        if (!d || !d.getBounds()) {
          console.log(c, d);
          return d;
        }
        ;
        d.regX = d.getBounds().width / 2;
        d.regY = d.getBounds().height / 2;
        d.x = toolkits.ASSETS_WIDTH / 2;
        d.y = toolkits.ASSETS_HEIGHT / 2;
        return d;
      },
      getSpriteCenterX: function getSpriteCenterX(c, d) {
        var e = this.getSprite(c, d);
        e.regX = e.getBounds().width / 2;
        e.x = toolkits.ASSETS_WIDTH / 2;
        return e;
      },
      getSpriteCenter: function getSpriteCenter(c, d) {
        var e = this.getSprite(c, d);
        e.regX = e.getBounds().width / 2;
        e.regY = e.getBounds().height / 2;
        e.x = toolkits.ASSETS_WIDTH / 2;
        e.y = toolkits.ASSETS_HEIGHT / 2;
        return e;
      },
      getSpriteSheet: function getSpriteSheet(c) {
        var d = new createjs.SpriteSheet(this.getResult(c));
        return d;
      },
      getSprite: function getSprite(c, d) {
        var sheet = this.getSpriteSheet(c);
        var e = new createjs.Sprite(sheet, d);
        if (!e || !e.getBounds()) {
          console.log(c, d);
        }
        ;
        e.stop();
        return e;
      },
      getAudio: function getAudio(c, newOne) {
        var audio = this.loader.getResult(c);
        if (this.soundsList[c] && !newOne) {
          audio = this.soundsList[c];
        } else if (audio) {
          audio = createjs.Sound.createInstance(c);
          this.soundsList[c] = audio;
        } else {
          console.log('error: no such a audio of "' + c + '"');
          audio = {
            play: function play() {
            }, stop: function stop() {
            }
          };
        }
        return audio;
      }
    });
    return a;
  }(BaseScene);

  var gameManager = function () {
    var _scenes = {};
    var _gameObjects = {};
    var resources = {};
    var _cacheData = {};
    var currentScene = void 0;
    var currentStage = void 0;
    var gameAssets = void 0;
    var gameStage = void 0;

    var _LSHolder = {
      _data: {},
      setItem: function setItem(key, value) {
        this._data[key] = value;
      },
      getItem: function getItem(key) {
        return this._data[key];
      },
      removeItem: function removeItem(key) {
        delete this._data[key];
      }
    };
    var LSManager = function () {
      var mainkey = '';
      var _LSHolder = {
        _data: {},
        setItem: function setItem(key, value) {
          this._data[key] = value;
        },
        getItem: function getItem(key) {
          return this._data[key];
        },
        removeItem: function removeItem(key) {
          delete this._data[key];
        }
      };
      var ls = localStorage || _LSHolder;
      try {
        ls.setItem('game_test', '1');
        ls = ls.getItem('game_test') === '1' ? ls : _LSHolder;
        ls.removeItem('game_test');
      } catch (e) {
        ls = _LSHolder;
      }
      var getData = function getData() {
        return JSON.parse(ls.getItem(mainkey) || '{}');
      };

      return {
        setItem: function setItem(key, val) {
          if (!mainkey) {
            return this;
          }
          var _data = getData();
          _data[key] = val;
          ls.setItem(mainkey, JSON.stringify(_data));
          return this;
        },
        getItem: function getItem(key) {
          if (!mainkey) {
            return null;
          }
          var _data = getData();
          return _data[key];
        },
        removeItem: function removeItem(key) {
          if (!mainkey) {
            return this;
          }
          var _data = getData();
          delete _data[key];
          ls.setItem(mainkey, JSON.stringify(_data));
          return this;
        },
        clear: function clear(key) {
          if (!mainkey) {
            return this;
          }
          var _data = getData();
          delete _data[key];
          ls.setItem(mainkey, JSON.stringify(_data));
          return this;
        },
        init: function init(MAINKEY) {
          mainkey = MAINKEY;
          ls.getItem(mainkey) || ls.setItem(mainkey, '{}');
          return this;
        }
      };
    }();
    return {
      toolkits: toolkits,
      LS: LSManager,
      cache: {
        get: function get(key) {
          return typeof 'key' === 'string' ? _cacheData[key] : undefined;
        },
        set: function set(key, value) {
          typeof 'key' === 'string' && (_cacheData[key] = value);
          return this;
        }
      },
      getObject: function getObject(objectName) {
        if (!_gameObjects || !_gameObjects[objectName]) {
          return null;
        }

        for (var _len = arguments.length, arg = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          arg[_key - 1] = arguments[_key];
        }

        return new (Function.prototype.bind.apply(_gameObjects[objectName], [null].concat(arg)))();
      },
      addObject: function addObject(objectName, methods) {
        if (!_gameObjects) {
          _gameObjects = {};
        }
        _gameObjects[objectName] = function (a) {
          __extends(b, a);

          function b() {
            a.call(this);
            typeof this.init === 'function' && this.init.apply(this, arguments);
          }

          __setMethods(b, methods);
          return b;
        }(GameObject);
        return this;
      },
      addScene: function addScene(sceneName, methods, res) {
        if (typeof sceneName !== 'string' || (typeof methods === 'undefined' ? 'undefined' : _typeof(methods)) !== 'object') {
          return this;
        }
        ;
        _scenes[sceneName] = function (b) {
          __extends(_scene, b);

          function _scene() {
            var that = this;
            b.call(this);
            var bg = new createjs.Shape();
            bg.graphics.beginFill(toolkits.BGColor).drawRect(0, 0, toolkits.ASSETS_WIDTH, toolkits.ASSETS_HEIGHT).endFill();

            that.addChild(bg);

            that.resKey = sceneName;
            that.sceneName = sceneName;
            gameAssets.preload(that);
          }

          var newUpdateFn = typeof methods.update === 'function' ? methods.update : function () {
          };
          var methods_default = {
            startDraw: function startDraw() {
            },
            // 资源加载结束时
            startPlay: function startPlay() {
            },
            // 资源加载结束且过渡动画完全退出时
            update: function update(r) {
              b.prototype.update.call(this, r);
              newUpdateFn.call(this, r, b);
            }
          };
          Object.keys(methods_default).forEach(function (item) {
            if (!methods[item] || item === 'update') {
              methods[item] = methods_default[item];
            }
          });
          __setMethods(_scene, methods);
          return _scene;
        }(BaseScene);

        res && res instanceof Array && (resources[sceneName] = {'res': res});

        return this;
      },
      goToScene: function goToScene(sceneName) {
        var _scene = _scenes[sceneName];
        if (!_scene) {
          return undefined;
        }
        ;
        currentScene = new _scene();
        return currentScene;
      },
      getScene: function getScene(sceneName) {
        return _scenes[sceneName];
      },
      getCurrentScene: function getCurrentScene() {
        return currentScene;
      },
      getRes: function getRes(resName) {
        return resName && resources[resName] ? resources[resName] : resources;
      },
      init: function init(id, cb) {
        currentStage = this.stage = new StageManager(id);
        gameAssets = this.assets = new AssetsLoader(resources);
        typeof cb === 'function' && cb();
      }
    };
  }();

  win.gameManager = gameManager;

})(window);

(function (win) {
  var GM = gameManager;
  GM.toolkits.BGColor = "#E9DFCC";
  GM.toolkits.FGColor = "#333333";
  GM.toolkits.LOADINGTEXT = "";
  GM.toolkits.resize = function () {
    var w = window.innerWidth,
        h = window.innerHeight;

    // if (w / h > GM.toolkits.ASSETS_WIDTH / GM.toolkits.ASSETS_HEIGHT) {
    // 	GM.toolkits.CANVAS_WIDTH = Math.round(GM.toolkits.ASSETS_WIDTH * h / GM.toolkits.ASSETS_HEIGHT);
    // 	GM.toolkits.CANVAS_HEIGHT = h;
    // } else {
    GM.toolkits.CANVAS_WIDTH = w;
    // GM.toolkits.CANVAS_HEIGHT = Math.round(GM.toolkits.ASSETS_HEIGHT * w / GM.toolkits.ASSETS_WIDTH);
    GM.toolkits.CANVAS_HEIGHT = h
    GM.toolkits.ASSETS_HEIGHT = Math.round(GM.toolkits.ASSETS_WIDTH * h / w)
    // }
  }
  GM.addObject('Dialog', {
    init: function (txt, dir, isStatic, delay) {
      var me = this;
      me.objectType = 'dialog'
      var fontsize = 20
      var text = new createjs.Text(txt || '', fontsize + 'px Arial', GM.toolkits.FGColor)
      text.x = 14
      text.y = 12
      text.textAlign = 'left'
      text.lineHeight = 28

      var b = {
        width: text.getBounds().width,
        height: fontsize + (txt.match(/\n/g) && txt.match(/\n/g).length * text.lineHeight)
      }
      b.x_left = 0
      b.x_right = text.x * 2 + b.width
      b.y_left = 0
      b.y_bottom = text.y * 2 + b.height


      var rect = new createjs.Shape()
      if (dir === 'right') {
        rect.graphics
            .beginFill('#FFF')
            .beginStroke('#333')
            .mt(0, 0)
            .lt(b.x_right, 0)
            .lt(b.x_right, b.y_bottom)
            .lt(b.x_right - 5, b.y_bottom)
            .lt(b.x_right, b.y_bottom + 16)
            .lt(b.x_right - 22, b.y_bottom)
            .lt(0, b.y_bottom)
            .lt(0, 0)
            .endFill()
            .endStroke()

        me.setBounds(0, 0, b.x_right, b.y_bottom + 16)
        me.regX = b.x_right
        me.regY = b.y_bottom + 16
      } else if (dir === 'center') {
        rect.graphics
            .beginFill('#FFF')
            .beginStroke('#333')
            .mt(0, 0)
            .lt(b.x_right, 0)
            .lt(b.x_right, b.y_bottom)
            .lt(b.x_right / 2 + 22, b.y_bottom)
            .lt(b.x_right / 2, b.y_bottom + 16)
            .lt(b.x_right / 2 + 5, b.y_bottom)
            .lt(0, b.y_bottom)
            .lt(0, 0)
            .endFill()
            .endStroke()

        me.setBounds(0, 0, b.x_right, b.y_bottom + 16)
        me.regX = b.x_right / 2
        me.regY = b.y_bottom + 16
      } else if (dir === 'left') {
        rect.graphics
            .beginFill('#FFF')
            .beginStroke('#333')
            .mt(0, 0)
            .lt(b.x_right, 0)
            .lt(b.x_right, b.y_bottom)
            .lt(22, b.y_bottom)
            .lt(0, b.y_bottom + 16)
            .lt(5, b.y_bottom)
            .lt(0, b.y_bottom)
            .lt(0, 0)
            .endFill()
            .endStroke()

        me.setBounds(0, 0, b.x_right, b.y_bottom + 16)
        me.regX = 0
        me.regY = b.y_bottom + 16
      } else {
        text.x = 24
        text.y = 20
        b.x_right = text.x * 2 + b.width
        b.y_bottom = text.y * 2 + b.height
        rect.graphics
            .beginFill('#FFF')
            .beginStroke('#333')
            .dr(0, 0, b.x_right, b.y_bottom)
            .endFill()
            .endStroke()

        me.setBounds(0, 0, b.x_right, b.y_bottom)
        me.regX = b.x_right / 2
        me.regY = b.y_bottom / 2
      }


      me.addChild(rect, text)
      me.scaleX = 0
      me.scaleY = 0
      me.alpha = 0
      me.isStatic = !!isStatic
      me.delay = delay || 0
    },
    show: function (effect) {
      var me = this;
      if (me.shown) {
        return
      }
      me.shown = true
      switch (effect) {
        case 'fade':
          me.scaleX =
              me.scaleY = 1
          createjs.Tween.get(me).to({alpha: 1}, 500, createjs.Ease.quadOut)
          break;
        case 'scale' :
          me.alpha = 1
          createjs.Tween.get(me).to({scaleX: 1, scaleY: 1}, 300, createjs.Ease.backOut)
          break;
        default :
          me.scaleX = 1
          me.scaleY = 1
          me.alpha = 1
          break;
      }
    },
    hide: function () {
      var me = this;
      if (!me.shown) {
        return
      }
      createjs.Tween.get(me).to({scaleX: 0, scaleY: 0, alpha: 0}, 200, createjs.Ease.backIn)
          .call(function () {
            me.shown = false
          })
    },
    update: function (y) {
      var me = this;
      if (me.isStatic) {
        return
      }
      if (me.y + y > 0/*GM.toolkits.ASSETS_HEIGHT * 1 / 7*/ && me.y + y < GM.toolkits.ASSETS_HEIGHT * 4 / 7 - me.delay) {
        me.show('scale')
      } else {
        me.hide()
      }
    }
  })
  GM.addScene('PLAY', {
    startDraw: function () {
      var me = this; // _scene 场景
      me.ctn = new createjs.Container()
      // console.log(me)
      // 暂时暂停
      // GM.assets.getAudio('music').play({loop:1});

      var startY = []
      var startT = []
      me.on('mousedown', function(e){
        me.startY = e.stageY;
        if (me.cannotMove || !me.bg) {return}

        // console.log(me.cannotMove, me.bg)

        console.log(e.stageX, e.stageY)

        createjs.Tween.removeTweens(me.bg)
        me.bg._y = me.bg.y;
        GM.assets.getAudio('music').play({loop:-1});

        startY = [e.stageY]
        startT = [me.liveTime]
      })
      me.on('pressmove', function(e){
        if (me.cannotMove || !me.bg) {return}
        var y = me.bg._y + (e.stageY - me.startY) * 0.7
        var max_y = me.bg.getBounds().height - GM.toolkits.ASSETS_HEIGHT
        y >= 0 && (y = 0)
        y < -max_y && (y = - max_y)

        me.bg.y = y

        startY.push(e.stageY)
        startT.push(me.liveTime)
      })
      me.on('pressup', function(e){
        if (me.cannotMove || !me.bg) {return}
        if (startY.length > 2 && me.liveTime - startT[startT.length - 1] < 0.2) {
          var x = (startY[startY.length - 1] - startY[startY.length - 2])*1
          var t = 8 / (startT[startT.length - 1] - startT[startT.length - 2])
          var y = me.bg.y + x * 10
          var max_y = me.bg.getBounds().height - GM.toolkits.ASSETS_HEIGHT
          y >= 0 && (y = 0)
          y < -max_y && (y = - max_y)
          t >= 1000 && (t = 1000)

          createjs.Tween.get(me.bg).to({y: y}, t, createjs.Ease.circOut)
              .call(function(){
                me.bg._y = me.bg.y

              })
        }
      })

      me.sounds = []

    },
    startPlay: function () {
      var me = this;

      // window.bgg =
      me.bg = GM.assets.getBitmap('all');

      me.addChild(me.bg, me.ctn);

      var tips = (function(){
        var ctn = new createjs.Container();
        var tips = new createjs.Text('向上滑动', '28px Arial', GM.toolkits.FGColor)
        tips.textAlign = 'center'
        tips.x = GM.toolkits.ASSETS_WIDTH / 2
        tips.y = GM.toolkits.ASSETS_HEIGHT - 160
        tips.alpha = 0.4
        ctn.update = function(y){
          if (- y >= 50) {
            me.ctn.removeChild(ctn)
          }
        }
        ctn.addChild(tips)
        me.ctn.addChild(ctn)
        return this
      })();

      // me.bg.y = -15500

      var bird = (function(){
        var ctn = new createjs.Container();
        ctn.scaleX = -1
        ctn.regX = GM.toolkits.ASSETS_WIDTH
        var bird0 = GM.assets.getSpriteCenter('bird', 'fly')
        bird0.gotoAndPlay('fly')

        var bird1 = bird0.clone()
        var bird2 = bird0.clone()
        var bird3 = bird0.clone()
        var bird4 = bird0.clone()
        var bird5 = bird0.clone()
        bird0.x = bird0._x = 244
        bird0.y = bird0._y = 220
        bird1.x = bird1._x = 218
        bird1.y = bird1._y = 246
        bird2.x = bird2._x = 188
        bird2.y = bird2._y = 210
        bird3.x = bird3._x = 128
        bird3.y = bird3._y = 188
        bird4.x = bird4._x = 107
        bird4.y = bird4._y = 235
        bird5.x = bird5._x = 48
        bird5.y = bird5._y = 261

        bird0.scaleX = bird0.scaleY = 0.37
        bird1.scaleX = bird1.scaleY = 0.33
        bird2.scaleX = bird2.scaleY = 0.48
        bird3.scaleX = bird3.scaleY = 0.52
        bird4.scaleX = bird4.scaleY = 0.6
        bird5.scaleX = bird5.scaleY = 0.42


        bird0.framerate = GM.toolkits.getRandom(72, 54)
        bird1.framerate = GM.toolkits.getRandom(72, 54)
        bird2.framerate = GM.toolkits.getRandom(72, 54)
        bird3.framerate = GM.toolkits.getRandom(72, 54)
        bird4.framerate = GM.toolkits.getRandom(72, 54)
        bird5.framerate = GM.toolkits.getRandom(72, 54)

        var reset = function(){
          ctn.rotation = 10
          ctn.x = 350
          ctn.y = 200
        }
        reset()

        var flying = false
        var fly = function(){
          if (flying) {return}
          flying = true
          createjs.Tween.get(ctn).to({x: -GM.toolkits.ASSETS_WIDTH, y: -300}, 8000)
        }
        ctn.update = function(y){
          if (- y >= 0 && - y <= 300) {
            fly()
          }
          if (- y > 1000) {
            flying = false
            createjs.Tween.removeTweens(ctn)
            reset()
          }
        }
        ctn.addChild(bird0, bird1, bird2, bird3, bird4, bird5)
        me.ctn.addChild(ctn)
        return this
      })();

      var scroll0 = (function(){
        var ctn = new createjs.Container();

        ctn.y = 390
        var sl = GM.assets.getBitmap('scroll');
        var sr = sl.clone();
        var b = sl.getBounds()

        var maskl = new createjs.Shape()
        maskl.graphics.beginFill('#000').drawRect(0, 0, 36, b.height)

        var maskr = new createjs.Shape()
        maskr.graphics.beginFill('#000').drawRect(0, 0, b.width - 36, b.height)

        sl.x = maskl.x = (GM.toolkits.ASSETS_WIDTH - b.width) / 2
        sl.mask = maskl

        maskr.x = sl.x + 30
        sr.mask = maskr
        sr.regX = b.width - 36
        sr.x = sr._x = maskr.x
        ctn.update = function(y){
          if (- y < 400) {
            sr.x = sr._x - y * 4
            if (sr.x >= sl.x + 36 + 614) {
              sr.x = sl.x + 36 + 614
            }
          }else if(- y < 500){
            // this.y = 1180
          }else{
            // this.y = 1180
          }
        }
        ctn.addChild(sl, sr)
        me.ctn.addChild(ctn)
        return this
      })();

      var role1 = (function(){
        var ctn = new createjs.Container();
        var r = GM.assets.getSpriteCenterX('role1');
        r.gotoAndStop('r1-1')
        r.x = 280
        r.regY = r.getBounds().height
        ctn.update = function(y){
          if (- y < 200) {
            r.audioPlayed = false
          }
          if (- y < 236) {
            r.gotoAndStop('r1-1')
            this.y = - y * 5
          }else if(- y < 500){
            this.y = 1180
            r.gotoAndStop('r1-2')
            !r.audioPlayed && (GM.assets.getAudio('sound-down').play(), r.audioPlayed = true)
          }else{
            this.y = 1180
            r.gotoAndStop('r1-3')
          }
        }
        ctn.addChild(r)
        me.ctn.addChild(ctn)
        return this
      })();

      var role2 = (function(){
        var ctn = new createjs.Container();
        var r = GM.assets.getSprite('role2');
        r.gotoAndStop('r2-1')
        r.regY = r.getBounds().height
        ctn.x = ctn._x = 120
        ctn.y = ctn._y = 2504
        var start = 1540
        ctn.update = function(y){
          // 120 2504
          // 334 2718
          if (- y > start && this._y - (start + y) * 0.2 < 2718) {
            this.x = this._x - (start + y) * 0.2
            this.y = this._y - (start + y) * 0.2
          }else if(this._y - (start + y) * 0.2 >= 2718){
            this.x = 334
            this.y = 2718
          }else{
            ctn.x = ctn._x
            ctn.y = ctn._y
          }
          r.gotoAndStop(this.y % 60 > 30 ? 'r2-1' : 'r2-2')

        }
        ctn.addChild(r)
        me.ctn.addChild(ctn)
        return this
      })();

      var role3 = (function(){
        var ctn = new createjs.Container();
        var r = GM.assets.getBitmapCenter('clothes');
        ctn.y = 5220
        r.alpha = 0
        r.y = 0
        var h = ctn.y - GM.toolkits.ASSETS_HEIGHT * 2 / 3
        ctn.update = function(y){
          if (-y > h && -y < h + GM.toolkits.ASSETS_HEIGHT * 1 / 3) {
            r.alpha = -(h + y) * 0.003
            if (r.alpha >= 1) {
              r.alpha = 1
            }
          }/*else if(-y > h + GM.toolkits.ASSETS_HEIGHT * 1 / 2){
						r.alpha = 1 + (h + GM.toolkits.ASSETS_HEIGHT * 1 / 2 + y) * 0.01
						if (r.alpha < 0) {
							r.alpha = 0
						}

					}else if(-y < h){
						r.alpha = 0

					}*/
        }
        ctn.addChild(r)
        me.ctn.addChild(ctn)
        return this
      })();

      var cat = (function(){
        var ctn = new createjs.Container();
        var cat = GM.assets.getSpriteCenterX('cat');
        ctn.y = 14478
        cat.regY = cat.getBounds().height

        var h = ctn.y - GM.toolkits.ASSETS_HEIGHT * 4 / 4
        var reset = function(){
          cat.rotation = -6
          cat.animating = false
          cat.gotoAndStop('cat-01')
          cat.x = 294
          cat.y = 35
        }
        reset()
        var walk = function(){
          if (cat.animating) {return}
          cat.animating = true
          cat.gotoAndPlay('cat')
          createjs.Tween.get(cat).to({x: 840, y: -36}, 4500)
          GM.assets.getAudio('sound-cat').play()
        }
        ctn.update = function(y){
          if (-y > h && -y < h + GM.toolkits.ASSETS_HEIGHT * 3 / 3) {
            walk()
          }
          if (-y > h + 1400 || -y < h - 1400) {
            reset()
          }
        }
        ctn.addChild(cat)
        me.ctn.addChild(ctn)
        return this
      })();


      var siege = (function(){
        var ctn = new createjs.Container();
        var s1 = GM.assets.getSpriteCenter('siege', 's-1');
        var s2 = GM.assets.getSpriteCenter('siege', 's-2');
        var s3 = GM.assets.getSpriteCenter('siege', 's-3');
        var s4 = GM.assets.getSpriteCenter('siege', 's-4');
        var s5 = GM.assets.getSpriteCenter('siege', 's-5');

        ctn.y = 16190

        s1.x = s1._x = GM.toolkits.ASSETS_WIDTH / 2 + 40
        s1.y = s1._y = 100

        s2.x = s2._x = -s2.getBounds().width / 3
        s2.__x = 60
        s2.y = s2._y = 280

        s3.x = s3._x = GM.toolkits.ASSETS_WIDTH + s3.getBounds().width / 3
        s3.__x = GM.toolkits.ASSETS_WIDTH - 40
        s3.y = s3._y = 340

        s4.x = s4._x = GM.toolkits.ASSETS_WIDTH / 2 - 340
        s4.__x = GM.toolkits.ASSETS_WIDTH / 2 - 240
        s4.y = s4._y = 740
        s4.__y = 640

        s5.x = s5._x = GM.toolkits.ASSETS_WIDTH / 2 + 260
        s5.__x = GM.toolkits.ASSETS_WIDTH / 2 + 160
        s5.y = s5._y = 870
        s5.__y = 770

        ctn.update = function(y){
          if (-y > ctn.y - 490 && -y <= ctn.y - 490 + 1200) {
            s2.x = s2._x - (ctn.y - 490 + y) * 0.5
            if (s2.x >= s2.__x) {s2.x = s2.__x}
            if (s2.x <= s2._x) {s2.x = s2._x}
          }
          if (-y > ctn.y - 420 && -y <= ctn.y - 420 + 1200) {
            s3.x = s3._x + (ctn.y - 420 + y) * 0.3
            if (s3.x <= s3.__x) {s3.x = s3.__x}
            if (s3.x >= s3._x) {s3.x = s3._x}
          }
          if (-y > ctn.y - 370 && -y <= ctn.y - 370 + 1200) {
            s4.x = s4._x - (ctn.y - 370 + y) * 0.4
            s4.y = s4._y + (ctn.y - 370 + y) * 0.4
            if (s4.x >= s4.__x) {s4.x = s4.__x}
            if (s4.y <= s4.__y) {s4.y = s4.__y}
            if (s4.x <= s4._x) {s4.x = s4._x}
            if (s4.y >= s4._y) {s4.y = s4._y}
          }
          if (-y > ctn.y - 310 && -y <= ctn.y - 310 + 1200) {
            s5.x = s5._x + (ctn.y - 310 + y) * 0.3
            s5.y = s5._y + (ctn.y - 310 + y) * 0.3
            if (s5.x <= s5.__x) {s5.x = s5.__x}
            if (s5.y <= s5.__y) {s5.y = s5.__y}
            if (s5.x >= s5._x) {s5.x = s5._x}
            if (s5.y >= s5._y) {s5.y = s5._y}
          }
        }
        ctn.addChild(s1, s2, s3, s4, s5)
        me.ctn.addChild(ctn)
        return this
      })();

      var text_mingce = (function(){
        var ctn = new createjs.Container();
        var t_ming = GM.assets.getSpriteCenter('text-mingce', 'ming');
        var t_ce = GM.assets.getSpriteCenter('text-mingce', 'ce');
        var t_zhong = GM.assets.getSpriteCenter('text-mingce', 'zhong');
        var t_xian = GM.assets.getSpriteCenter('text-mingce', 'xian');
        var t_jiang = GM.assets.getSpriteCenter('text-mingce', 'jiang');
        var t_hu = GM.assets.getSpriteCenter('text-mingce', 'hu');
        var t_wu = GM.assets.getSpriteCenter('text-mingce', 'wu');
        var t_lin = GM.assets.getSpriteCenter('text-mingce', 'lin');
        var t_zai = GM.assets.getSpriteCenter('text-mingce', 'zai');
        var t_qi = GM.assets.getSpriteCenter('text-mingce', 'qi');
        var t_feng = GM.assets.getSpriteCenter('text-mingce', 'feng');
        var t_yun = GM.assets.getSpriteCenter('text-mingce', 'yun');

        var reset = function(obj){
          if (obj) {
            obj.scaleX = 0
            obj.scaleY = 0
            obj.animate_done = false
            return
          }
          ctn.children.forEach(function(item){
            item.scaleX = 0
            item.scaleY = 0
            item.animate_done = false
          })
        }
        var scaleOut = function(obj){
          obj.animate_done = true
          createjs.Tween.get(obj).to({scaleX: 1, scaleY: 1}, 300, createjs.Ease.backOut)
        }
        ctn.addChild(t_ming, t_ce, t_zhong, t_xian, t_jiang, t_hu, t_wu, t_lin, t_zai, t_qi, t_feng, t_yun)
        reset()

        t_ming.x = 166
        t_ming.y = 82
        t_ce.x = 256
        t_ce.y = 202
        t_zhong.x = 140
        t_zhong.y = 342
        t_xian.x = 244
        t_xian.y = 494
        t_jiang.x = 130
        t_jiang.y = 572
        t_hu.x = 215
        t_hu.y = 692

        t_wu.x = 512
        t_wu.y = 232
        t_lin.x = 606
        t_lin.y = 358
        t_zai.x = 490
        t_zai.y = 448
        t_qi.x = 612
        t_qi.y = 558
        t_feng.x = 498
        t_feng.y = 658
        t_yun.x = 586
        t_yun.y = 744

        ctn.y = 17740
        ctn.update = function(y){
          if (- y > ctn.y - 300 + 50 && - y < ctn.y + 50 && !t_ming.animate_done) {scaleOut(t_ming)}
          if (- y > ctn.y - 300 + 80 && - y < ctn.y + 80 && !t_ce.animate_done) {scaleOut(t_ce)}
          if (- y > ctn.y - 300 + 110 && - y < ctn.y + 110 && !t_zhong.animate_done) {scaleOut(t_zhong)}
          if (- y > ctn.y - 300 + 140 && - y < ctn.y + 140 && !t_xian.animate_done) {scaleOut(t_xian)}
          if (- y > ctn.y - 300 + 170 && - y < ctn.y + 170 && !t_jiang.animate_done) {scaleOut(t_jiang)}
          if (- y > ctn.y - 300 + 200 && - y < ctn.y + 200 && !t_hu.animate_done) {scaleOut(t_hu)}

          if (- y > ctn.y - 300 + 230 && - y < ctn.y + 230 && !t_wu.animate_done) {scaleOut(t_wu)}
          if (- y > ctn.y - 300 + 260 && - y < ctn.y + 260 && !t_lin.animate_done) {scaleOut(t_lin)}
          if (- y > ctn.y - 300 + 290 && - y < ctn.y + 290 && !t_zai.animate_done) {scaleOut(t_zai)}
          if (- y > ctn.y - 300 + 320 && - y < ctn.y + 320 && !t_qi.animate_done) {scaleOut(t_qi)}
          if (- y > ctn.y - 300 + 350 && - y < ctn.y + 350 && !t_feng.animate_done) {scaleOut(t_feng)}
          if (- y > ctn.y - 300 + 380 && - y < ctn.y + 380 && !t_yun.animate_done) {scaleOut(t_yun)}

          if (- y < ctn.y - 2000 || - y > ctn.y + 1400) {
            reset()
          }
        }
        me.ctn.addChild(ctn)
        return this
      })();



      var cars = (function(){
        var ctn = new createjs.Container();
        var car1 = GM.assets.getSpriteCenter('cars', 'c-1');
        var car2 = GM.assets.getSpriteCenter('cars', 'c-2');
        var car3 = GM.assets.getSpriteCenter('cars', 'c-3');
        var car4 = GM.assets.getSpriteCenter('cars', 'c-4');
        ctn.y = 23300
        car1.x = car1._x = -car1.getBounds().width / 2
        car1.y = car1._y = -20
        car2.x = car2._x = GM.toolkits.ASSETS_WIDTH + car2.getBounds().width / 2
        car2.y = 580
        car3.x = car3._x = 0
        car3.y = 900
        car3.rotation = 5
        // car4.x =
        // car4.y = car4._y =
        ctn.update = function(y){
          if (-y > 22330 && -y < 22330 + 320) {
            var _x = - (22330 + y)
            car1.x = car1._x + _x * 0.4
            car1.y = car1._y + _x
          }
          if (-y > 23000 && -y < 23000 + 400) {
            car2.x = car2._x + (23000 + y) * 0.6
          }
          if (-y > 23060 && -y < 23060 + 2000) {
            car3.x = car3._x - (23060 + y)
          }
        }
        ctn.addChild(car1, car2, car3/*, car4*/)
        me.ctn.addChild(ctn)
        return this
      })();



      var d0 = GM.getObject('Dialog', '此番混进荣国府，名册不弄到手，\n我名字倒着写。', 'left', undefined, GM.toolkits.ASSETS_HEIGHT * 1 / 7)
      d0.x = 342;
      d0.y = 958;
      me.ctn.addChild(d0)

      var d1 = GM.getObject('Dialog', '听说贾母的寿宴可气派了！', 'right')
      d1.x = 542;
      d1.y = 2016;
      me.ctn.addChild(d1)

      var d2 = GM.getObject('Dialog', '大户人家啊', 'right')
      d2.x = 426;
      d2.y = 2094;
      me.ctn.addChild(d2)

      var d3 = GM.getObject('Dialog', '　驾！~　', 'right')
      d3.x = 554;
      d3.y = 2800;
      me.ctn.addChild(d3)

      var d4 = GM.getObject('Dialog', '马上就到了，顶住！', 'right')
      d4.x = 580;
      d4.y = 3135;
      me.ctn.addChild(d4)

      var d5_1 = GM.getObject('Dialog', '叶掌门，你今天来的挺早啊', 'left')
      d5_1.x = 228;
      d5_1.y = 3460;
      me.ctn.addChild(d5_1)

      var d5_2 = GM.getObject('Dialog', '赖帮主，你不也一样', 'left')
      d5_2.x = 430;
      d5_2.y = 3566;
      me.ctn.addChild(d5_2)

      var d5 = GM.getObject('Dialog', '英文原版《红楼梦》歌剧\n2016年 9月，英文原版歌剧《红楼\n梦》在旧金山歌剧院首演并大获成\n功，盛宗亮、赖声川、叶锦添和黄\n哲伦等人组成的创作团队被誉为“华\n人梦之队”，这个用世界语言讲述的\n中国故事，于2017年9月8日、9日\n在北京保利剧院上演。', undefined, true)
      d5.x = 530;
      d5.y = 3850;
      me.ctn.addChild(d5)
      d5.show()

      var d6_1 = GM.getObject('Dialog', '里面请。', 'left')
      d6_1.x = 544;
      d6_1.y = 4394;
      me.ctn.addChild(d6_1)

      var d6 = GM.getObject('Dialog', '人都来齐了么？', 'right')
      d6.x = 312;
      d6.y = 4700;
      me.ctn.addChild(d6)

      var d7 = GM.getObject('Dialog', '到了九成', 'left')
      d7.x = 436;
      d7.y = 4830;
      me.ctn.addChild(d7)

      var d8_1 = GM.getObject('Dialog', '事不宜迟，躁动起来', 'left')
      d8_1.x = 224;
      d8_1.y = 5504;
      me.ctn.addChild(d8_1)

      var d8_2 = GM.getObject('Dialog', '荣国府\n《红楼梦》中荣国公的\n府邸。贾府分两支，一\n个是宁国府，一个是荣\n国府，宁公居长，荣公\n居次，所以宁国府是高\n于荣国府的，但荣国府\n人丁更兴旺。', undefined, true)
      d8_2.x = 590;
      d8_2.y = 5670;
      me.ctn.addChild(d8_2)
      d8_2.show()

      var d8_3 = GM.getObject('Dialog', '我的猫呢？呜', 'right')
      d8_3.x = 274;
      d8_3.y = 5878;
      me.ctn.addChild(d8_3)

      var d8_4 = GM.getObject('Dialog', '寿宴开始了吧？', 'left')
      d8_4.x = 470;
      d8_4.y = 5960;
      me.ctn.addChild(d8_4)

      var d8_5 = GM.getObject('Dialog', '这舞蹈跳得6啊', 'right')
      d8_5.x = 235;
      d8_5.y = 6496;
      me.ctn.addChild(d8_5)

      var d8_6 = GM.getObject('Dialog', '姐姐我也想学', 'right')
      d8_6.x = 662;
      d8_6.y = 6566;
      me.ctn.addChild(d8_6)

      var d8_7 = GM.getObject('Dialog', '妹子真靓啊', 'right')
      d8_7.x = 506;
      d8_7.y = 6644;
      me.ctn.addChild(d8_7)

      var d9 = GM.getObject('Dialog', '大观园和荣国府的关系\n总的来说，大观园属于荣\n国府，即大观园是荣国府\n的一部分，大观园是贾政\n的女儿元春回府省亲时盖\n的别墅，后来宝玉、黛玉\n就住在里面。', undefined, true)
      d9.x = 178;
      d9.y = 7400;
      me.ctn.addChild(d9)
      d9.show()

      var d10 = GM.getObject('Dialog', '好，好，好', 'center', undefined, GM.toolkits.ASSETS_HEIGHT * 2 / 7)
      d10.x = 310;
      d10.y = 8394;
      me.ctn.addChild(d10)

      var d11 = GM.getObject('Dialog', '祝老祖宗，\n福如东海！\n寿比南山！')
      d11.x = 524;
      d11.y = 8430;
      me.ctn.addChild(d11)

      var d12 = GM.getObject('Dialog', '贾母史太君的成功学\n贾母，娘家姓史，是宁荣二府\n的“老祖宗”。承托于出生贵族\n的眼界，并有数十年“媳妇熬成\n婆”的人生历练，贾母可谓知人\n善任，敢于任用王熙凤这样缺\n点和优点同样突出的年轻干部，\n自己在后方自得其乐。出现在\n读者眼中的贾母，已经是一把\n手退居二线的代表。', undefined, true)
      d12.x = 190;
      d12.y = 8810;
      me.ctn.addChild(d12)
      d12.show()

      var d13 = GM.getObject('Dialog', '看到宝玉这个小祖宗了吗?', 'center')
      d13.x = 235;
      d13.y = 9126;
      me.ctn.addChild(d13)

      var d14 = GM.getObject('Dialog', '感谢玉玉的小棉袄送的\n500个超级火箭，么么哒~', 'center')
      d14.x = 272;
      d14.y = 9884;
      me.ctn.addChild(d14)

      var d14_1 = GM.getObject('Dialog', '老铁们，666刷起来', 'center', undefined, GM.toolkits.ASSETS_HEIGHT * 1 / 7)
      d14_1.x = 568;
      d14_1.y = 9830;
      me.ctn.addChild(d14_1)

      var d14_2 = GM.getObject('Dialog', '黛玉的「不足之症」\n《红楼梦》第二回写到林黛\n玉有“不足之症”，不足之症\n是中医的病症名，即民间常\n说的先天不足，泛指各种虚\n症。在作品里面，黛玉怕冷\n又怕热，身体怯弱，应为阴\n阳皆虚的体质，而阴虚通常\n有气郁的症候，一般表现为\n多疑，爱生气，这也体现在\n作品里面黛玉的性格中。', undefined, true)
      d14_2.x = 160;
      d14_2.y = 10314;
      me.ctn.addChild(d14_2)
      d14_2.show()

      var d15 = GM.getObject('Dialog', '二奶奶，干嘛呢？', 'left')
      d15.x = 182;
      d15.y = 10930;
      me.ctn.addChild(d15)

      var d15_1 = GM.getObject('Dialog', '听说都是一些西洋派高手，\n古典派神童？', 'left', undefined, GM.toolkits.ASSETS_HEIGHT * 1 / 7)
      d15_1.x = 468;
      d15_1.y = 11220;
      me.ctn.addChild(d15_1)

      var d15_2 = GM.getObject('Dialog', '全国州府的舞林名册\n都在这里，你知道吗？', 'right', undefined, -GM.toolkits.ASSETS_HEIGHT * 1 / 7)
      d15_2.x = 412;
      d15_2.y = 11242;
      me.ctn.addChild(d15_2)

      var d16_1 = GM.getObject('Dialog', '好烦，真羡慕那些有故事的人\n不像我，一个帅字贯穿了一生', 'left')
      d16_1.x = 164;
      d16_1.y = 11730;
      me.ctn.addChild(d16_1)

      var d16_2 = GM.getObject('Dialog', '什么人？！站住！', 'right')
      d16_2.x = 350;
      d16_2.y = 12000;
      me.ctn.addChild(d16_2)

      var d16_3 = GM.getObject('Dialog', '嗯…', 'right')
      d16_3.x = 616;
      d16_3.y = 12150;
      me.ctn.addChild(d16_3)

      var d16 = GM.getObject('Dialog', '哈哈，名册终于到手！', 'left')
      d16.x = 254;
      d16.y = 13370;
      me.ctn.addChild(d16)

      var d17_1 = GM.getObject('Dialog', '是！', 'right', undefined, GM.toolkits.ASSETS_HEIGHT * 2 / 7)
      d17_1.x = 440;
      d17_1.y = 14920;
      me.ctn.addChild(d17_1)

      var d17_1 = GM.getObject('Dialog', '是！', 'right', undefined, GM.toolkits.ASSETS_HEIGHT * 2 / 7 - 30)
      d17_1.x = 676;
      d17_1.y = 14950;
      me.ctn.addChild(d17_1)

      var d17 = GM.getObject('Dialog', '守好这里，给我追！', 'right')
      d17.x = 488;
      d17.y = 15068;
      me.ctn.addChild(d17)

      var d18 = GM.getObject('Dialog', '有人偷东西啦', 'right', undefined, -GM.toolkits.ASSETS_HEIGHT * 2 / 7)
      d18.x = 246;
      d18.y = 15214;
      me.ctn.addChild(d18)

      var d19 = GM.getObject('Dialog', '抓贼啊！', 'right')
      d19.x = 288;
      d19.y = 15626;
      me.ctn.addChild(d19)

      var d20 = GM.getObject('Dialog', '站住！', 'left')
      d20.x = 474;
      d20.y = 15798;
      me.ctn.addChild(d20)

      var d21 = GM.getObject('Dialog', '这里是敕造荣国府的领土', 'right')
      d21.x = 500;
      d21.y = 16140;
      me.ctn.addChild(d21)

      var d22 = GM.getObject('Dialog', '你的行为已经属于非法入侵，\n请立刻放下武器投降！', 'left')
      d22.x = 320;
      d22.y = 16824;
      me.ctn.addChild(d22)

      var d23 = GM.getObject('Dialog', '剑一出鞘必见血，\n辣手摧花不留情。', 'left', undefined, GM.toolkits.ASSETS_HEIGHT * 1 / 7)
      d23.x = 442;
      d23.y = 18650;
      me.ctn.addChild(d23)

      var d24 = GM.getObject('Dialog', '哎呀我去！', 'left')
      d24.x = 406;
      d24.y = 20420;
      me.ctn.addChild(d24)


      // 剧院门口
      var d25 = GM.getObject('Dialog', '排到吐血', 'right')
      d25.x = 338;
      d25.y = 23260;
      me.ctn.addChild(d25)

      var d26 = GM.getObject('Dialog', '演的啥，这么多人', 'right')
      d26.x = 644;
      d26.y = 23500;
      me.ctn.addChild(d26)

      var d27 = GM.getObject('Dialog', '咱俩排最后了', 'left')
      d27.x = 248;
      d27.y = 23742;
      me.ctn.addChild(d27)




      var fight = (function(){
        var ctn = new createjs.Container();
        var bg = new createjs.Shape();
        bg.graphics.beginFill('rgba(0,0,0,0.8)')
            .mt(0, 400)
            .lt(GM.toolkits.ASSETS_WIDTH, 0)
            .lt(GM.toolkits.ASSETS_WIDTH, 400)
            .lt(0, 800)
            .endFill()
        var role = GM.assets.getSpriteCenter('fight', 'f-role');
        var role1 = GM.assets.getSpriteCenter('fight', 'f-role1');
        var role2 = GM.assets.getSpriteCenter('fight', 'f-role2');
        var shine = GM.assets.getSpriteCenter('fight', 'f-shine');

        ctn.y = ctn._y = 12060
        var reset = function(){
          createjs.Tween.removeTweens(bg)
          createjs.Tween.removeTweens(shine)
          createjs.Tween.removeTweens(role)
          createjs.Tween.removeTweens(role1)
          createjs.Tween.removeTweens(role2)
          createjs.Tween.removeTweens(role1)
          createjs.Tween.removeTweens(role2)
          bg.x = GM.toolkits.ASSETS_WIDTH
          bg.y = -400
          role.x = GM.toolkits.ASSETS_WIDTH / 2 - 20
          role.y = GM.toolkits.ASSETS_HEIGHT / 2 - 200
          role1.x = GM.toolkits.ASSETS_WIDTH / 2 - 200
          role1.y = GM.toolkits.ASSETS_HEIGHT / 2 + 90
          role2.x = GM.toolkits.ASSETS_WIDTH / 2 + 180
          role2.y = GM.toolkits.ASSETS_HEIGHT / 2 + 150
          shine.y = GM.toolkits.ASSETS_WIDTH / 2 - 50
          shine.x = GM.toolkits.ASSETS_WIDTH / 2 + 300

          role1.alpha = 0
          role2.alpha = 0
          role1.scaleX = 1
          role1.scaleY = 1
          role2.scaleX = 1
          role2.scaleY = 1

          role.alpha = 0
          role.y += 400

          shine.alpha = 0
          shine.scaleX = 1
          shine.scaleY = 0.5
          shine.rotation = -20
        }
        reset()

        ctn.fight = function(){
          if (this.fighted) {return}
          this.fighted = true
          createjs.Tween.get(bg).to({x: 0, y: 0}, 100).wait(2000).to({x: -GM.toolkits.ASSETS_WIDTH, y: 400}, 100)
          createjs.Tween.get(role).wait(100).to({alpha: 1, y: role.y - 400}, 500, createjs.Ease.quadOut).wait(1000).call(function(){GM.assets.getAudio('sound-broadsword').play();})
          createjs.Tween.get(shine).wait(1600).to({alpha: 1}).to({alpha: 0.2, x: shine.x - 800, y: shine.y + 700, scaleX: 1.3, scaleY: 1.3, rotation: 60}, 200, createjs.Ease.linear)
              .call(function(){
                createjs.Tween.get(role).to({alpha: 0}, 400)
                // me.cannotMove = true
              })

          createjs.Tween.get(role1).wait(1300).to({alpha: 1}, 300, createjs.Ease.quadOut)
          createjs.Tween.get(role2).wait(1300).to({alpha: 1}, 300, createjs.Ease.quadOut)
          createjs.Tween.get(role1).wait(1800).to({x: role1.x - 600, y: role1.y + 400, scaleX: 2, scaleY: 2}, 800, createjs.Ease.quadOut)
          createjs.Tween.get(role2).wait(1800).to({x: role2.x + 600, y: role2.y + 400, scaleX: 2, scaleY: 2}, 800, createjs.Ease.quadOut)
              .call(function(){
                reset()
                // me.cannotMove = false
              })

        }
        ctn.update = function(y){
          if (- y > ctn._y - 120 && - y < ctn._y - 120 + 200) {
            this.fight()
            ctn.y = ctn._y - (ctn._y - 120 + y)
          }
          if (- y > ctn._y + 1400 || (this.fighted == true &&  - y < ctn._y - 1400)) {
            this.fighted = false
            reset()
          }
        }
        ctn.addChild(bg, role, role1, role2, shine)
        me.ctn.addChild(ctn)
        return this
      })();

      var fight1 = (function(){
        var ctn = new createjs.Container()

        var bg = new createjs.Shape()
        bg.graphics.beginFill('rgba(0,0,0,1)').drawRect(0, 0, GM.toolkits.ASSETS_WIDTH, GM.toolkits.ASSETS_HEIGHT).endFill()

        var long = GM.toolkits.ASSETS_WIDTH * 1.5
        var shine0 = new createjs.Shape()
        shine0.graphics.beginFill('#FFF').drawRect(0, 0, long, 20).endFill()
        var shine1 = shine0.clone()
        var shine2 = shine0.clone()
        shine0.regX = long
        shine2.regX = long

        ctn.y = ctn._y = 16820

        var reset = function(){
          ctn.y = ctn._y
          ctn.alpha = 0
          shine0.x = long * 2
          shine0.y = -long * 0.9
          shine1.x = -long
          shine1.y = 0//long * 0.1
          shine2.x = long + GM.toolkits.ASSETS_WIDTH
          shine2.y = long * 0.02

          shine0.rotation = -40
          shine1.rotation = 20
          shine2.rotation = -30
          shine0.scaleY = 1
          shine1.scaleY = 1
          shine2.scaleY = 1
        }
        reset()

        ctn.fight = function(){
          if (this.fighted) {return}
          GM.assets.getAudio('sound-fight').play()
          this.fighted = true
          me.cannotMove = true
          // ctn.alpha = 1
          createjs.Tween.get(ctn).to({alpha: 1}, 100)
          createjs.Tween.get(shine0).wait(100).to({scaleY:0.1, x: -long, y: long * 1.64}, 200)
          createjs.Tween.get(shine1).wait(200).to({scaleY:0.1, x: long, y: long * 0.75}, 150)
          createjs.Tween.get(shine2).wait(300).to({scaleY:0.1, x: -30, y: long * 1.0}, 200)
              .wait(200).call(function(){
            reset()
            ctn.alpha = 1
            createjs.Tween.get(shine0).wait(300).to({scaleY:0.1, x: -long, y: long * 1.64}, 200)
            createjs.Tween.get(shine1).wait(0).to({scaleY:0.1, x: long, y: long * 0.75}, 200)
            createjs.Tween.get(shine2).wait(200).to({scaleY:0.1, x: -30, y: long * 1.0}, 200)
                .call(function(){
                  createjs.Tween.get(ctn).to({alpha: 0}, 100).call(function(){
                    reset()
                    me.cannotMove = false
                  })
                })
          })
        }
        ctn.update = function(y){
          if (-y > ctn._y && -y < ctn._y + 400) {
            ctn.y = - y
            this.fight()
          }
          if (-y > ctn._y + 2400 || (this.fighted == true && -y < ctn._y - 1400)) {
            reset()
            this.fighted = false
          }
        }
        ctn.addChild(bg, shine0, shine1, shine2)
        me.ctn.addChild(ctn)
        return this
      })();



      var theEnd = (function(){
        var ctn = new createjs.Container();
        var bg_height = 1240/*GM.toolkits.ASSETS_HEIGHT*/
        var bg = new createjs.Shape();
        bg.graphics.beginFill('#313131').drawRect(0, 0, GM.toolkits.ASSETS_WIDTH, bg_height).endFill();
        // bg.alpha = 0

        /*var title1 = new createjs.Text('剧终', '110px Simsun', '#FFF')
        title1.regX = title1.getBounds().width / 2
        title1.x = GM.toolkits.ASSETS_WIDTH / 2
        title1.y = 180*/

        var title = new createjs.Text('你\n以\n为\n故\n事\n就\n这\n样\n结\n束\n了\n吗\n？', '50px Simsun', '#FFF')
        title.regX = title.getBounds().width / 2
        title.regY = title.getBounds().height / 2
        title.x = GM.toolkits.ASSETS_WIDTH / 2
        title.y = bg_height / 2
        // title.alpha = 0

        ctn.y = 20740
        ctn.addChild(bg/*, title1*/, title)
        me.ctn.addChild(ctn)
        return this
      })();
      // var theEnd = (function(){
      // 	var ctn = new createjs.Container();
      // 	var bg_height = 1206/*GM.toolkits.ASSETS_HEIGHT*/
      // 	var bg = new createjs.Shape();
      // 	bg.graphics.beginFill('#313131').drawRect(0, 0, GM.toolkits.ASSETS_WIDTH, bg_height).endFill();
      // 	// bg.alpha = 0

      // 	var title = new createjs.Text('剧终', '110px Simsun', '#FFF')
      // 	title.regX = title.getBounds().width / 2
      // 	title.x = GM.toolkits.ASSETS_WIDTH / 2
      // 	title.y = 180
      // 	title.alpha = 0

      // 	var mask = new createjs.Shape();
      // 	mask.graphics.beginFill('#000').drawRect(0, 0, GM.toolkits.ASSETS_WIDTH, bg_height).endFill();
      // 	title.mask = mask


      // 	/*var text = new createjs.Text('\
      // 	　出品方：保利地产\n\
      // 	领衔主演：爱换装的戏精\n\
      // 	总制片人：更爱美图的某设计\n\
      // 	　总编剧：月薪3万的某文案\n\
      // 	责任编审：还是用回了第一稿的客户\n\
      // 	　　监制：当然是选择原谅客户啊的某销售\n\
      // 	　　剪接：某资深码农\n\
      // 	媒体支持：搜狐焦点\n\
      // 	特别鸣谢：曹雪芹（清）', '24px Simsun', '#FFF')*/

      // 	var text = new createjs.Text('出品方：\n保利地产\n\n英文原版歌剧《红楼梦》主创：\n盛宗亮、赖声川、叶锦添、黄哲伦\n\n领衔主演：\n贾母、林黛玉、贾宝玉、贾瑞、王熙凤\n\n媒体支持：\n搜狐焦点\n\n特别鸣谢：\n曹雪芹（清）\n\n你以为故事就这样结束了吗？', '24px Simsun', '#FFF')

      // 	text.lineHeight = 50
      // 	text.textAlign = 'left'
      // 	text.regX = text.getBounds().width / 2
      // 	text.x = GM.toolkits.ASSETS_WIDTH / 2

      // 	var mask1 = new createjs.Shape();
      // 	mask1.graphics.beginFill('#000').drawRect(0, 0, GM.toolkits.ASSETS_WIDTH, 50 * 10).endFill();
      // 	mask1.y = 480
      // 	text.mask = mask1
      // 	text.y = text._y = mask1.y + 50 * 10



      // 	ctn.update = function(y){
      // 		if (-y >= ctn.y - GM.toolkits.ASSETS_HEIGHT * 3 / 7 && -y <= ctn.y + bg_height) {
      // 			text.y =  text._y + (ctn.y - GM.toolkits.ASSETS_HEIGHT * 3 / 7 + y)
      // 		}
      // 		title.alpha = -(ctn.y - GM.toolkits.ASSETS_HEIGHT * 4 / 7 + y) * 0.002
      // 		if (title.alpha < 0) {
      // 			title.alpha = 0
      // 		}else if(title.alpha > 1){
      // 			title.alpha = 1
      // 		}

      // 	}
      // 	ctn.y = 20740
      // 	ctn.addChild(bg, title, text)
      // 	me.ctn.addChild(ctn)
      // 	return this
      // })();

      var last = (function(){
        var ctn = new createjs.Container();

        var btn = GM.assets.getBitmapCenter('btn-last')

        btn.x = 460
        btn.y = 697

        btn.on('click', function(){
          location.href = 'http://wx.gz.focus.cn/html/helechina_game/?isFromMovie=1'
        })

        var mask = new createjs.Shape()
        mask.graphics.beginFill('#FFF').drawRect(0, 50, GM.toolkits.ASSETS_WIDTH, 810).endFill()
        var hand = GM.assets.getBitmapCenterX('hand')
        var line = GM.assets.getBitmapCenterX('line')
        var cleaner = GM.assets.getSpriteCenter('cleaner')
        var light1 = GM.assets.getSpriteCenter('light', 'l-1')
        var light2 = GM.assets.getSpriteCenter('light', 'l-2')
        line.mask = mask

        line.regY = line.getBounds().height
        // cleaner.regY = cleaner.getBounds().height

        line.x = 254
        cleaner.x = 260

        var start_y = 160
        var end_y = 440
        var _y = 23780
        var gap = 25

        line.y = line._y = start_y
        cleaner.y = cleaner._y = start_y + gap

        light1.alpha = 0.3
        light2.alpha = 0.3
        light1.x = light1._x = 288
        light1.y = light1._y = 772
        light2.x = light2._x = 624
        light2.y = light2._y = 613


        hand.y = 800
        hand.x += 80
        ctn.light = function(){
          if (this.lighting) {return}
          this.lighting = true

          createjs.Tween.get(light1, {loop: -1})
              .to({alpha: 1, x: light1._x + 5 , y: light1._y - 4}, 400, createjs.Ease.sineInOut)
              .to({alpha: 0.5, x: light1._x, y: light1._y}, 400, createjs.Ease.sineInOut)
              .to({alpha: 1, x: light1._x + 5 , y: light1._y - 4}, 400, createjs.Ease.sineInOut)
              .wait(100)
              .to({alpha: 0.3, x: light1._x, y: light1._y}, 400, createjs.Ease.sineInOut)
          createjs.Tween.get(light2, {loop: -1})
              .to({alpha: 1, x: light2._x - 4 , y: light2._y + 3}, 400, createjs.Ease.sineInOut)
              .to({alpha: 0.5, x: light2._x, y: light2._y}, 400, createjs.Ease.sineInOut)
              .to({alpha: 1, x: light2._x - 4 , y: light2._y + 3}, 400, createjs.Ease.sineInOut)
              .wait(100)
              .to({alpha: 0.3, x: light2._x, y: light2._y}, 400, createjs.Ease.sineInOut)
          createjs.Tween.get(hand, {loop: -1})
              .to({y: hand.y - 70}, 600, createjs.Ease.sineInOut)
              .to({y: hand.y}, 600, createjs.Ease.sineInOut)
              .wait(1000)

        }

        ctn.update = function(y){
          if (-y > _y && cleaner.y < cleaner._y + 800) {
            line.y = line._y - (_y + y) * 0.8
            cleaner.y = cleaner._y - (_y + y) * 0.8

            if (cleaner.y < start_y + gap) {
              cleaner.y = start_y + gap
            }
            if (line.y < start_y) {
              line.y = start_y
            }
            if (cleaner.y >= end_y + gap) {
              line.y = end_y
              cleaner.y = end_y + gap
              !cleaner.currentAnimation && cleaner.gotoAndPlay('clean')
              // !light.currentAnimation && light.gotoAndPlay('lighting')
              ctn.light()
            }
          }
        }
        ctn.y = 24570
        ctn.addChild(btn, light1, light2, cleaner, line, hand)
        me.ctn.addChild(ctn)
        return this
      })();



      me.sounds = [
        {
          sound: 'sound-bazaar',
          startY: [700, 700 + 400],
          outY: [0, 700 + 1800]
        },
        {
          sound: 'sound-bird',
          startY: [9000, 9000 + 600],
          outY: [9000 - 1400, 9000 + 2000]
        },
        {
          sound: 'sound-carriage',
          startY: [1900, 1900 + 300],
          outY: [1900 - 1400, 1900 + 1700]
        },
        {
          sound: 'sound-car',
          startY: [22250, 22250 + 800],
          outY: [22250 - 1400, 22250 + 2200]
        },
        /*{
          sound: 'sound-guzheng',
          startY: [6100, 6100 + 400],
          outY: [6100 - 1400, 6100 + 1800]
        },*/
        /*{
          sound: 'sound-fight',
          startY: [16920, 16920 + 300],
          outY: [16920 - 1400, 16920 + 1700]
        },*/
        {
          sound: 'sound-water',
          startY: [19250, 19250 + 300],
          outY: [19250 - 1400, 19250 + 1700]
        }
      ]

    },
    update: function update(r) {
      var me = this;
      if (me.ctn && me.bg) {
        me.ctn.y = me.bg.y
        me.ctn.children.forEach(function(item){
          if (typeof item.update === 'function') {
            item.update(me.bg.y)
          }
        })
        me.sounds.forEach(function(item){
          if (- me.bg.y > item.startY[0] &&- me.bg.y < item.startY[1] && !item.started) {
            item.started = true
            GM.assets.getAudio(item.sound).play()
          }
          if (- me.bg.y < item.outY[0]) {
            item.started = false
          }
          if (- me.bg.y > item.outY[1]) {
            item.started = false
          }
        })
      }
    }
  }, [
    { id: 'loading-border', src: 'http://wx.gz.focus.cn/html/helechina_201709/res/loading-border.png?v=0.4' },
    { id: 'loading-sun', src: 'http://wx.gz.focus.cn/html/helechina_201709/res/loading-sun.png?v=0.4' },
    { id: 'loading-text', src: 'http://wx.gz.focus.cn/html/helechina_201709/res/loading-text.png?v=0.4' },
    { id: 'bird', src: 'http://wx.gz.focus.cn/html/helechina_201709/res/bird.json?v=0.4' },
    { id: 'horse', src: './res/horse.json?v=0.4' },
    { id: 'role2', src: 'http://wx.gz.focus.cn/html/helechina_201709/res/role2.json?v=0.4' },
    { id: 'all', src: 'http://wx.gz.focus.cn/html/helechina_201709/res/all.jpg?v=0.4' },
    { id: 'role1', src: 'http://wx.gz.focus.cn/html/helechina_201709/res/role1.json?v=0.4' },
    { id: 'scroll', src: 'http://wx.gz.focus.cn/html/helechina_201709/res/scroll.png?v=0.4' },
    { id: 'clothes', src: 'http://wx.gz.focus.cn/html/helechina_201709/res/clothes.png?v=0.4' },
    { id: 'text-mingce', src: 'http://wx.gz.focus.cn/html/helechina_201709/res/text-mingce.json?v=0.4' },
    { id: 'fight', src: 'http://wx.gz.focus.cn/html/helechina_201709/res/fight.json?v=0.4' },
    { id: 'siege', src: 'http://wx.gz.focus.cn/html/helechina_201709/res/siege.json?v=0.4' },
    { id: 'cat', src: 'http://wx.gz.focus.cn/html/helechina_201709/res/cat.json?v=0.4' },
    { id: 'cars', src: 'http://wx.gz.focus.cn/html/helechina_201709/res/cars.json?v=0.4' },
    { id: 'cleaner', src: 'http://wx.gz.focus.cn/html/helechina_201709/res/cleaner.json?v=0.4' },
    { id: 'light', src: 'http://wx.gz.focus.cn/html/helechina_201709/res/light.json?v=0.4' },
    { id: 'line', src: 'http://wx.gz.focus.cn/html/helechina_201709/res/line.png?v=0.4' },
    { id: 'btn-last', src: 'http://wx.gz.focus.cn/html/helechina_201709/res/btn-last.png?v=0.4' },
    { id: 'hand', src: 'http://wx.gz.focus.cn/html/helechina_201709/res/hand.png?v=0.4' },
    { id: 'music', src: 'http://wx.gz.focus.cn/html/helechina_201709/res/music.mp3?v=0.4' },
    { id: 'sound-water', src: 'http://wx.gz.focus.cn/html/helechina_201709/res/sound-water.mp3?v=0.4' },
    { id: 'sound-fight', src: 'http://wx.gz.focus.cn/html/helechina_201709/res/sound-fight.mp3?v=0.4' },
    { id: 'sound-down', src: 'http://wx.gz.focus.cn/html/helechina_201709/res/sound-down.mp3?v=0.4' },
    { id: 'sound-guzheng', src: 'http://wx.gz.focus.cn/html/helechina_201709/res/sound-guzheng.mp3?v=0.4' },
    { id: 'sound-bazaar', src: 'http://wx.gz.focus.cn/html/helechina_201709/res/sound-bazaar.mp3?v=0.4' },
    { id: 'sound-broadsword', src: 'http://wx.gz.focus.cn/html/helechina_201709/res/sound-broadsword.mp3?v=0.4' },
    { id: 'sound-bird', src: 'http://wx.gz.focus.cn/html/helechina_201709/res/sound-bird.mp3?v=0.4' },
    { id: 'sound-carriage', src: 'http://wx.gz.focus.cn/html/helechina_201709/res/sound-carriage.mp3?v=0.4' },
    { id: 'sound-car', src: 'http://wx.gz.focus.cn/html/helechina_201709/res/sound-car.mp3?v=0.4' },
    { id: 'sound-cat', src: 'http://wx.gz.focus.cn/html/helechina_201709/res/sound-cat.mp3?v=0.4' }
  ]);
  var gameInit = function gameInit() {
    GM.init('game');
    GM.goToScene('PLAY');
  };
  gameInit();


})(window);
