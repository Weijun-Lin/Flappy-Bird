// 游戏正式开始

import { Global, canvas, Img, openDataContext, sharedCanvas } from "../global.js"
import { Instance } from "../instance.js"
import {drawTextToCanvas, drawImage } from "../Tool/tool.js"

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
        Global.scoreFlag = 0;
    }

    // 触摸事件
    touchEventMonitor() {
        wx.onTouchStart(this.dealTouochEventBind);
    }

    // 处理触摸事件
    dealTouochEvent(res) {
        var x = res.touches[0].pageX;
        var y = res.touches[0].pageY;
        if(Global.scoreBoardState == 0) {
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
                if(Instance.scoreBoard.buttonPlay.isClicked(x, y)) {
                    Instance.bird.clearDownAnimation();
                    this.reStart();
                    console.log("restart");
                }
                if(Instance.scoreBoard.buttonScore.isClicked(x, y)) {
                    Global.scoreBoardState = 1;
                }
            }
        }
        else {
            if(Instance.buttonRankBoardClose.isClicked(x, y)) {
                Global.scoreBoardState = 0;
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
        if (Global.scoreBoardState == 1) {
            ctx.globalAlpha = 0.5;
        }
        Instance.background.drawToCanvas();
        Instance.pipes.forEach(function (item) {
            item.drawToCanvas();
        })
        Instance.bird.drawToCanvas();
        Instance.grounds.forEach(function (item) {
            item.drawToCanvas();
        });
        if(Global.gameState == 1) {
            this.drawGameReady();
        }
        this.drawGameReady();
        if(Global.gameState == 4) {
            Instance.scoreBoard.drawToCanvas(Global.score, 100);
            Instance.textGameOver.drawToCanvas(Img.textGameOver);
        }
        if(Global.gameState != 4 && Global.gameState != 1) {
            drawTextToCanvas(String(Global.score), Global.layout.scoreInPlay);
        }
        if(Global.scoreBoardState == 1) {
            ctx.globalAlpha = 1;
            openDataContext.postMessage({
                type: "draw"
            });
            drawImage(sharedCanvas, Global.layout.scoreRankBoard);
        }
        this.frameCallBackId = requestAnimationFrame(this.loopBind);
    }
}