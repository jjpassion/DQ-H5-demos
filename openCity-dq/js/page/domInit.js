function domInit(clientWidth, clientHeight, render) {

  var container = document.getElementById('container');
  window.scroller = new Scroller(render, {
    zooming: true
  });

  var reflow = function () {
    var contentWidth = window.innerWidth;
    var contentHeight = window.innerHeight;
    // console.log(contentWidth, contentWidth * 52.5)
    scroller.setDimensions(contentWidth, contentHeight, contentWidth, contentWidth * 52.5);
  };

  window.addEventListener("resize", reflow, false);
  reflow();

  if ('ontouchstart' in window) {
    document.body.addEventListener('touchmove', function (e) {
      e.preventDefault(); //阻止默认的处理方式(阻止下拉滑动的效果)
    }, {passive: false});
    container.addEventListener("touchstart", function (e) {
      // Don't react if initial down happens on a form element
      if (e.touches[0] && e.touches[0].target && e.touches[0].target.tagName.match(/input|textarea|select/i)) {
        return;
      }

      scroller.doTouchStart(e.touches, e.timeStamp);
      // e.preventDefault();
    }, false);

    document.addEventListener("touchmove", function (e) {
      scroller.doTouchMove(e.touches, e.timeStamp, e.scale);
    }, false);

    document.addEventListener("touchend", function (e) {
      scroller.doTouchEnd(e.timeStamp);
    }, false);

    document.addEventListener("touchcancel", function (e) {
      scroller.doTouchEnd(e.timeStamp);
    }, false);

  } else {

    var mousedown = false;

    container.addEventListener("mousedown", function (e) {
      if (e.target.tagName.match(/input|textarea|select/i)) {
        return;
      }

      scroller.doTouchStart([{
        pageX: e.pageX,
        pageY: e.pageY
      }], e.timeStamp);

      mousedown = true;
    }, false);

    document.addEventListener("mousemove", function (e) {
      if (!mousedown) {
        return;
      }

      scroller.doTouchMove([{
        pageX: e.pageX,
        pageY: e.pageY
      }], e.timeStamp);

      mousedown = true;
    }, false);

    document.addEventListener("mouseup", function (e) {
      if (!mousedown) {
        return;
      }

      scroller.doTouchEnd(e.timeStamp);
      mousedown = false;
    }, false);

    container.addEventListener(navigator.userAgent.indexOf("Firefox") > -1 ? "DOMMouseScroll" : "mousewheel", function (e) {
      scroller.doMouseZoom(e.detail ? (e.detail * -120) : e.wheelDelta, e.timeStamp, e.pageX, e.pageY);
    }, false);
  }
}
