// 游戏正式开始

import { Global, canvas, Img } from "../global.js"
import { Instance } from "../instance.js"

// 获取绘图上下文
const ctx = canvas.getContext("2d");

export default class GamePlayPage {
    constructor() {
        Global.gameState = 1;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        Instance.bird.x = canvas.width/5;
        // Bind函数
        this.loopBind = this.loop.bind(this);
        this.dealTouochEventBind = this.dealTouochEvent.bind(this);
        this.tutorialAlpha = 1.0;
        this.alpha = 0;
        this.touchEventMonitor();
        this.loop();
        // 设置进场效果
        this.setEnterAnimation();
    }

    // 触摸事件
    touchEventMonitor() {
        wx.onTouchStart(this.dealTouochEventBind);
    }

    // 处理触摸事件
    dealTouochEvent(res) {
        // 第一次点将Tap和Ready淡出
        if(Global.gameState == 1) {
            Global.gameState = 2;
            this.tutorialTimer = setInterval(this.quitTutorial.bind(this), 20);
            Instance.bird.clearUpDownAnimation();
            Instance.bird.setDownAnimation();
            Instance.bird.jump();
        } else {
            // 跳跃
            Instance.bird.jump();
        }
    }

    // 初始元素淡出
    quitTutorial() {
        this.tutorialAlpha -= 0.02;
        if(this.tutorialAlpha <= 0) {
            clearInterval(this.tutorialTimer);
        }
    }

    // 设置进场动画
    setEnterAnimation() {
        this.enterTimer = setInterval(this.enterAnimation.bind(this), 18);
    }

    enterAnimation() {
        this.alpha += 0.02;
        if(this.alpha >= 1) {
            this.alpha = 1;
            clearInterval(this.enterTimer);
        }
    }

    // 绘制初始元素
    drawGameReady() {
        if(this.tutorialAlpha <= 0) return;
        if(this.alpha >= 1) {
            ctx.globalAlpha = this.tutorialAlpha;
        }
        Instance.tutorial.drawToCanvas(Img.tutorial);
        Instance.textReady.drawToCanvas(Img.textReady);
        if(this.alpha >= 1) {
            ctx.globalAlpha = 1.0;
        }
    }

    loop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.globalAlpha = this.alpha;
        Instance.background.drawToCanvas(Img.bgDay, Img.bgNight);
        Instance.pipes.forEach(function (item) {
            item.drawToCanvas(Img.pipeUp, Img.pipeDown);
        })
        Instance.grounds.forEach(function (item) {
            item.drawToCanvas(Img.ground);
        });
        Instance.bird.drawToCanvas(Img.bird);
        if(Global.gameState == 1) {
            this.drawGameReady();
        }
        this.frameCallBackId = requestAnimationFrame(this.loopBind);
    }
}