'use strict';

function getWid(w) {
  return contentWidth / 750 * w;
}

function getH(h, w) {
  w = w || 750;
  return h / w * getWid(w);
}

function getScale() {
  return contentWidth / 750;
}

function imgShow(y, top) {
  return y * getScale() <= top + contentHeight;
}
function bitmaps(imgList, stage) {
  var imgObj = {};
  var scale = getScale();
  imgList.forEach(function (v, k) {
    imgObj[v.name] = new createjs.Bitmap(v.url);
    imgObj[v.name].scaleX = scale;
    imgObj[v.name].scaleY = scale;
    imgObj[v.name].x = v.x * scale;
    imgObj[v.name].y = v.y * scale;
    v.bitmap = imgObj[v.name];
    v.init && v.init();
    stage.addChild(imgObj[v.name]);
  });
  stage.update();
  return imgObj;
}

function getBitmaps(obj) {
  var objList = [];
  if (typeof obj.url == 'string') obj.url = [obj.url];
  obj.url.forEach(function (v, k) {
    objList.push(Object.assign({}, obj, { url: v, name: obj.name + k }));
  });
  bitmaps(objList, stage);
  return objList;
}

function singleAnimate(obj, speed, stage) {
  var objList = [];
  if (typeof obj.url == 'string') obj.url = [obj.url];
  obj.url.forEach(function (v, k) {
    objList.push(Object.assign({}, obj, { url: v, name: obj.name + k }));
  });
  bitmaps(objList, stage);
  var len = objList.length;
  var index = 0;
  setInterval(function () {
    objList.forEach(function (v, k) {
      if (k == index) {
        objList[k].bitmap.visible = true;
      } else {
        objList[k].bitmap.visible = false;
      }
    });
    index >= len - 1 ? index = 0 : index++;
    stage.update();
  }, speed);
  return objList;
}

function moveAnimate(starTop, endTop, moveX, moveY, curTop, self) {
  if (curTop > starTop && curTop < endTop) {
    self.regY = curTop - (curTop - starTop) * (moveY * getScale() / (starTop * (moveX / moveY)));
    self.regX = -(curTop - starTop) * (moveY * getScale() / (starTop * (moveY / moveX)));
  } else if (curTop <= starTop) {
    self.regY = curTop;
  } else if (curTop >= endTop) {
    self.regY = curTop - (endTop - starTop) * (moveY * getScale() / (starTop * (moveX / moveY)));
  }
}

function moveAnimateByOffset(starTop, endTop, moveX, moveY, curTop, self, list) {
  if (curTop > starTop && curTop < endTop) {
    self.regY = curTop - moveY * getScale() / (endTop - starTop) * (curTop - starTop);
    self.regX = -(moveX * getScale() / (endTop - starTop)) * (curTop - starTop);
    showByOffset(starTop, curTop, list);
  } else if (curTop <= starTop) {
    self.regY = curTop;
  } else if (curTop >= endTop) {
    self.regY = curTop - moveY * getScale();
    // showByOffset(starTop, curTop, list);
  }
}

function showByOffset(starTop, curTop, list) {
  var num = parseInt(Math.abs(curTop - starTop) / 100);
  num = num >= list.length ? num % list.length : num;
  list.forEach(function (v, k) {
    if (k == num) {
      v.bitmap.visible = true;
    } else {
      v.bitmap.visible = false;
    }
  });
}