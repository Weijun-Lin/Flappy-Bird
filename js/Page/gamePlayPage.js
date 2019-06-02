/*
正式开始界面类：
    @Name: GamePlayPage
    @Attributes:
        constructor：构造函数
        reStart：重新设置参数
        touchEventMonitor：监听点击事件
        dealTouochEvent：处理点击事件
        quitTutorial：tutorial图片的淡出
        setEnterAnimation：设置进场动画
        enterAnimation：进场动画
        drawGameReady：绘制初始元素（GameReady tutorial）
        loop：循环渲染
    @Decription:
        正式的游戏开始界面 游戏核心
*/

import { Global, canvas, Img, openDataContext, sharedCanvas } from "../global"
import { Instance } from "../instance"
import { drawTextToCanvas, drawImage } from "../Tool/tool"

// 获取绘图上下文
const ctx = canvas.getContext("2d");

export default class GamePlayPage {
    constructor() {
        // 游戏状态为游戏开始界面
        Global.gameState = 1;
        Instance.bird.x = canvas.width / 5;
        this.loopBind = this.loop.bind(this);
        this.dealTouochEventBind = this.dealTouochEvent.bind(this);
        this.tutorialAlpha = 1.0;
        this.alpha = 0;
        this.touchEventMonitor();
        this.loop();
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
        Global.pipeNum = 1;
        Instance.medal1.x = Global.layout.medal.x;
        Instance.medal2.x = Global.layout.medal.x;
        Instance.medal3.x = Global.layout.medal.x;
    }

    // 触摸事件
    touchEventMonitor() {
        wx.onTouchStart(this.dealTouochEventBind);
    }

    // 处理触摸事件
    dealTouochEvent(res) {
        var x = res.touches[0].pageX;
        var y = res.touches[0].pageY;
        // 没有排行榜的点击事件
        if (Global.scoreBoardState == 0) {
            // 第一次点将Tap和Ready淡出
            if (Global.gameState == 1) {
                Global.gameState = 2;
                this.tutorialTimer = setInterval(this.quitTutorial.bind(this), 20);
                Instance.bird.clearUpDownAnimation();
                Instance.bird.setDownAnimation();
                Instance.bird.jump();
            } else if (Global.gameState == 2) {
                Instance.bird.jump();
            } else if (Global.gameState == 4) {
                if (Instance.scoreBoard.buttonPlay.isClicked(x, y)) {
                    Instance.bird.clearDownAnimation();
                    this.reStart();
                    console.log("restart");
                }
                if (Instance.scoreBoard.buttonScore.isClicked(x, y)) {
                    Global.scoreBoardState = 1;
                }
            }
        } 
        // 排行榜点击事件
        else {
            if (Instance.buttonRankBoardClose.isClicked(x, y)) {
                Global.scoreBoardState = 0;
            }
            if (Instance.buttonRankBoardNextPage.isClicked(x, y)) {
                openDataContext.postMessage({
                    type: "nextPage",
                    score: Global.score,
                });
                console.log("nextPage");
            }
            if (Instance.buttonRankBoardLastPage.isClicked(x, y)) {
                openDataContext.postMessage({
                    type: "lastPage",
                    score: Global.score,
                });
                console.log("lastPage");
            }
        }
    }

    // 初始元素淡出
    quitTutorial() {
        this.tutorialAlpha -= 0.02;
        if (this.tutorialAlpha <= 0) {
            clearInterval(this.tutorialTimer);
        }
    }

    // 设置进场动画
    setEnterAnimation() {
        this.enterTimer = setInterval(this.enterAnimation.bind(this), 18);
    }

    enterAnimation() {
        this.alpha += 0.02;
        if (this.alpha >= 1) {
            this.alpha = 1;
            clearInterval(this.enterTimer);
        }
    }

    // 绘制初始元素
    drawGameReady() {
        if (this.tutorialAlpha <= 0) return;
        if (this.alpha >= 1) {
            ctx.globalAlpha = this.tutorialAlpha;
        }
        Instance.tutorial.drawToCanvas(Img.tutorial);
        Instance.textReady.drawToCanvas(Img.textReady);
        if (this.alpha >= 1) {
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

        // 道具绘制
        Instance.medal1.drawToCanvas(Img.medal1);
        Instance.medal2.drawToCanvas(Img.medal2);
        Instance.medal3.drawToCanvas(Img.medal3);

        Instance.bird.drawToCanvas();
        Instance.grounds.forEach(function (item) {
            item.drawToCanvas();
        });
        if (Global.gameState == 1) {
            this.drawGameReady();
        }
        this.drawGameReady();
        if (Global.gameState == 4) {
            Instance.scoreBoard.drawToCanvas(Global.score, 100);
            Instance.textGameOver.drawToCanvas(Img.textGameOver);
        }
        if (Global.gameState != 4 && Global.gameState != 1) {
            drawTextToCanvas(String(Global.score), Global.layout.scoreInPlay);
        }
        if (Global.scoreBoardState == 1) {
            ctx.globalAlpha = 1;
            openDataContext.postMessage({
                type: "draw"
            });
            drawImage(sharedCanvas, Global.layout.scoreRankBoard);
        }
        this.frameCallBackId = requestAnimationFrame(this.loopBind);
    }
}