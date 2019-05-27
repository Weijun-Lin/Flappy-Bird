// 游戏开始界面
// 点击开始按钮后进入正式游戏界面

import {Global, canvas, Img} from "../global.js"
import {Instance} from "../instance.js"

// 获取绘图上下文
const ctx = canvas.getContext("2d");

// ------开始页面类---------------------------------------------------------------
export default class StartPage {
    constructor() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        Global.gameState = 0;
        // 防止loop里面的this被替换
        this.bindloop = this.loop.bind(this);
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
        console.log("%d %d",x,y);
        if(Instance.buttonPlay.isClicked(x, y)) {
            Global.gameState = 1;
            console.log("clicked");
            wx.showToast({
                title: '开始游戏',
                icon: 'success',
                duration: 1000
            })
            this.removeTouchMonitor();
        }
    }

    // 取消点击按钮事件
    removeTouchMonitor() {
        wx.offTouchStart(this.dealTouochEventBind);
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
            this.frameCallBackId = requestAnimationFrame(this.bindloop);
        }
    }
}