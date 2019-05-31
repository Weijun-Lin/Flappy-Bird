// 游戏正式开始

import { Global, canvas, Img } from "../global.js"
import { Instance } from "../instance.js"
import {drawTextToCanvas} from "../Tool/tool.js"

// 获取绘图上下文
const ctx = canvas.getContext("2d");

export default class GamePlayPage {
    constructor() {
        Global.gameState = 1;
        // Bind函数
        Instance.bird.x = canvas.width/5;
        this.loopBind = this.loop.bind(this);
        this.dealTouochEventBind = this.dealTouochEvent.bind(this);
        this.tutorialAlpha = 1.0;
        this.alpha = 0;
        this.touchEventMonitor();
        this.loop();
        // this.scoreBoard = new 
        // 设置进场效果
        this.setEnterAnimation();
    }

    // 重新设置初始状态
    reStart() {
        Global.gameState = 1;
        this.tutorialAlpha = 1.0;
        this.alpha = 0;
        this.setEnterAnimation();
        Instance.bird.reStart();
        Instance.pipes[0].x = 2 * canvas.width;
        Instance.pipes[1].x = 3 * canvas.width;
        Global.score = 0;
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
        } 
        else if(Global.gameState == 2) {
            Instance.bird.jump();
        }
        else if(Global.gameState == 4) {
            var x = res.touches[0].pageX;
            var y = res.touches[0].pageY;
            if(Instance.scoreBoard.buttonPlay.isClicked(x, y)) {
                Instance.bird.clearDownAnimation();
                this.reStart();
            }
        }
    }

    // 初始元素淡出
    quitTutorial() {
        // console.log(this.tutorialAlpha);
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
        Instance.bird.drawToCanvas(Img.bird);
        Instance.grounds.forEach(function (item) {
            item.drawToCanvas(Img.ground);
        });
        if(Global.gameState == 1) {
            this.drawGameReady();
        }
        this.drawGameReady();
        if(Global.gameState == 4) {
            Instance.scoreBoard.drawToCanvas(Global.score, 100);
            Instance.textGameOver.drawToCanvas(Img.textGameOver);
        }
        var tempScoreLayout = Global.layout.scoreInPlay;
        if(Global.gameState != 4 && Global.gameState != 1) {
            drawTextToCanvas(String(Global.score), tempScoreLayout.x, tempScoreLayout.y, 
                        tempScoreLayout.width, tempScoreLayout.height);
        }
        this.frameCallBackId = requestAnimationFrame(this.loopBind);
    }
}