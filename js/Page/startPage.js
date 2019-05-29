// 游戏开始界面
// 点击开始按钮后进入正式游戏界面

import {Global, canvas, Img} from "../global.js"
import {Instance, groundTimer} from "../instance.js"
import GamePlayPage from "./gamePlayPage.js"

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
        if(Instance.buttonPlay.isClicked(x, y)) {
            console.log("clicked");
            // 加载退场动画 结束后退出
            this.removeTouchMonitor();
            this.setQuitAnimation();
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
        Instance.background.drawToCanvas(Img.bgDay, Img.bgNight);
        Instance.grounds.forEach(function(item){
            item.drawToCanvas(Img.ground);
        })
        Instance.buttonPlay.drawToCanvas(Img.buttonPlay);
        Instance.buttonScore.drawToCanvas(Img.buttonScore);
        Instance.bird.drawToCanvas(Img.bird);
        Instance.logo.drawToCanvas(Img.logo);
        if(Global.gameState == 0) {
            this.frameCallBackId = requestAnimationFrame(this.loopBind);
        }
    }
}