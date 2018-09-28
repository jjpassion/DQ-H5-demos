"use strict";

function noobnoob() {
}

var progressBar = document.querySelector(".progressBar");
var progressText = document.querySelector(".progressText");
var load = document.querySelector(".load");

var canvasDom = document.querySelector("#testCanvas");

var boy = document.querySelector(".boy");
var boy_1 = document.querySelector(".boy-1");
var boy_flag = true;

var DDpath = 'https://page.xiaojukeji.com/package/openCity'

setInterval(function () {
    if (boy_flag) {
        boy.style.display = "block";
        boy_1.style.display = "none"
    } else {
        boy.style.display = "none";
        boy_1.style.display = "block"
    }
    boy_flag = !boy_flag
}, 500);



var fileList = [{id: "ring", src: DDpath + "/audio/ring.mp3"}, {id: "bird", src: DDpath + "/audio/bird.mp3"}, {
    id: "girl",
    src: DDpath + "/audio/girl.mp3"
}, {id: "cd_audio1", src: DDpath + "/audio/cd_audio1.mp3"}, {id: "tj_audio1", src: DDpath + "/audio/tj_audio1.mp3"}, {
    id: "tj_audio2",
    src: DDpath + "/audio/tj_audio2.mp3"
}, {id: "tj_audio3", src: DDpath + "/audio/tj_audio3.mp3"}, {id: "tj_audio4", src: DDpath + "/audio/block.mp3"}, {
    id: "sy_audio1",
    src: DDpath + "/audio/sy_audio1.mp3"
}, {id: "sy_audio2", src: DDpath + "/audio/sy_audio2.mp3"}, {id: "sy_audio3", src: DDpath + "/audio/sy_audio3.mp3"}, {
    id: "sy_audio4",
    src: DDpath + "/audio/cat.mp3"
}, {id: "bg", src: DDpath + "/audio/bg.mp3"}, {
    id: "dog",
    src: DDpath + "/audio/dog.mp3"
},  DDpath + "/img/bg-repeat.png",  DDpath + "/img/boy1.png",  DDpath + "/img/boy2.png",  DDpath + "/img/cha-1.png"];


var queue = new createjs.LoadQueue();
queue.installPlugin(createjs.Sound);
queue.on("complete", complete, undefined);
queue.on("progress", progress, undefined);
queue.loadManifest(fileList);

function complete() {
    setTimeout(function () {
        load.style.display = "none";
        canvasDom.style.display = "block";
        // 暂时把背景音乐关闭
        // var a = createSound(DDpath + "/audio/bg.mp3").play({loop: 1});
        // a.volume = 0.5;
        // domInit(contentWidth, contentHeight, init)
        domInit(0, 0, init)
    }, 500)
}

// left top zoom
function init(c, b, a) {
    console.log(b)
    audioInit(b); // top
    render(c, b, a) // left top zoom
}

function audioInit(a) { // top 值
    // console.log(a)
    // 控制音频播放
    audioList.forEach(function (c, b) {
        // c,b ==> item, index; a ==> 滚动top值
        // function getScale() {
        //    return contentWidth / 750;
        // }
        var d = c.starY * getScale();
        var e = c.endY * getScale();
        if (a > d && a < e && !c.hasPlay) {
            c.hasPlay = true;
            c.sound.play()
        } else {
            if (a <= d || a >= e) {
                if (c.hasPlay) {
                    c.sound._paused = true;
                    c.hasPlay = false
                }
            }
        }
    })
}

function createSound(a) {
    return createjs.Sound.createInstance(a)
}

var audioList = [{
    name: "ring",
    sound: createSound(DDpath + "/audio/ring.mp3"),
    hasPlay: false,
    starY: "500",
    endY: "1000"
}, {name: "bird", sound: createSound(DDpath + "/audio/bird.mp3"), hasPlay: false, starY: "2300", endY: "3800"}, {
    name: "girl",
    sound: createSound(DDpath + "/audio/girl.mp3"),
    hasPlay: false,
    starY: "24507",
    endY: "25509"
}, {name: "dog", sound: createSound(DDpath + "/audio/dog.mp3"), hasPlay: false, starY: "4700", endY: "5700"}, {
    name: "cd_audio1",
    sound: createSound(DDpath + "/audio/cd_audio1.mp3"),
    hasPlay: false,
    starY: "5400",
    endY: "6400"
}, {
    name: "tj_audio1",
    sound: createSound(DDpath + "/audio/tj_audio1.mp3"),
    hasPlay: false,
    starY: "25507",
    endY: "26507"
}, {
    name: "tj_audio2",
    sound: createSound(DDpath + "/audio/tj_audio2.mp3"),
    hasPlay: false,
    starY: "20907",
    endY: "21907"
}, {
    name: "tj_audio3",
    sound: createSound(DDpath + "/audio/tj_audio3.mp3"),
    hasPlay: false,
    starY: "30507",
    endY: "31507"
}, {
    name: "tj_audio4",
    sound: createSound(DDpath + "/audio/block.mp3"),
    hasPlay: false,
    starY: "19271",
    endY: "20871"
}, {
    name: "sy_audio1",
    sound: createSound(DDpath + "/audio/sy_audio1.mp3"),
    hasPlay: false,
    starY: "11087",
    endY: "12387"
}, {
    name: "sy_audio2",
    sound: createSound(DDpath + "/audio/sy_audio2.mp3"),
    hasPlay: false,
    starY: "12387",
    endY: "13387"
}, {
    name: "sy_audio3",
    sound: createSound(DDpath + "/audio/sy_audio3.mp3"),
    hasPlay: false,
    starY: "9087",
    endY: "10387"
}, {name: "sy_audio4", sound: createSound(DDpath + "/audio/cat.mp3"), hasPlay: false, starY: "29060", endY: "30060"}];

function progress(a) {
    progressBar.style.transform = "translateX(" + -(408 - a.progress * 408) + "px)";
    progressText.innerHTML = parseInt(a.progress * 100) + "%"
}
