// 游戏开始界面
// 点击开始按钮后进入正式游戏界面

import { Global, canvas, Img, openDataContext, sharedCanvas } from "../global.js"
import { Instance, groundTimer } from "../instance.js"
import GamePlayPage from "./gamePlayPage.js"
import {drawTextToCanvas, drawImage } from "../Tool/tool.js"

// 获取绘图上下文
const ctx = canvas.getContext("2d");

// ------开始页面类---------------------------------------------------------------
export default class StartPage {
    constructor() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        Global.gameState = 0;
        // 设置透明度
        this.alpha = 1.0;
        // 防止loop里面的this被替换
        this.loopBind = this.loop.bind(this);
        this.dealTouochEventBind = this.dealTouochEvent.bind(this);
        this.touchEventMonitor();
        this.loop();
    }

    // 监听开始页面按钮点击事件
    touchEventMonitor() {
        wx.onTouchStart(this.dealTouochEventBind);
    }

    // 处理点击事件
    dealTouochEvent(res) {
        var x = res.touches[0].pageX;
        var y = res.touches[0].pageY;
        if(Global.scoreBoardState == 0) {
            if(Instance.buttonPlay.isClicked(x, y) && Global.scoreBoardState == 0) {
                console.log("click start button");
                // 加载退场动画 结束后退出
                this.removeTouchMonitor();
                this.setQuitAnimation();
            }
            if(Instance.buttonScore.isClicked(x, y)) {
                console.log("click score button");
                Global.scoreBoardState = 1;
                openDataContext.postMessage({
                    type: "getFriendInfo"
                });
            }
        }
        if(Global.scoreBoardState == 1) {
            if(Instance.buttonRankBoardClose.isClicked(x, y)) {
                console.log("close rank");
                Global.scoreBoardState = 0;
            }
        }
    }

    // 取消点击按钮事件
    removeTouchMonitor() {
        wx.offTouchStart(this.dealTouochEventBind);
    }

    // 设置退场动画 淡出
    setQuitAnimation() {
        this.quitAnimationTimer = setInterval(this.quitAnimation.bind(this), 20);
    }

    quitAnimation() {
        this.alpha -= 0.02;
        if(this.alpha <= 0) {
            Global.gameState = 1;
            clearInterval(this.quitAnimationTimer);
            new GamePlayPage();
            return;
        }
        ctx.globalAlpha = this.alpha;
    }

    // 开始界面主循环
    loop() {  
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // 如果处于排行榜显示状态 则背景半透明
        if (Global.scoreBoardState == 1) {
            ctx.globalAlpha = 0.5;
        }
        Instance.background.drawToCanvas();
        Instance.grounds.forEach(function(item){
            item.drawToCanvas();
        })
        Instance.buttonPlay.drawToCanvas(Img.buttonPlay);
        Instance.buttonScore.drawToCanvas(Img.buttonScore);
        Instance.bird.drawToCanvas();
        Instance.logo.drawToCanvas(Img.logo);
        // 绘制排行榜时透明度为1
        if(Global.scoreBoardState == 1) {
            ctx.globalAlpha = 1;
            openDataContext.postMessage({
                type: "draw"
            });
            drawImage(sharedCanvas, Global.layout.scoreRankBoard);
        }
        if(Global.gameState == 0) {
            this.frameCallBackId = requestAnimationFrame(this.loopBind);
        }
    }
}