// 游戏开始界面
// 点击开始按钮后进入正式游戏界面

import {Global, canvas, Img} from "./global.js"
import {Instance} from "./instance.js"

// 获取绘图上下文
const cxt = canvas.getContext("2d");

// ------开始页面类---------------------------------------------------------------
export default class StartPage {
    constructor() {
        cxt.clearRect(0, 0, canvas.width, canvas.height);
        // 防止loop里面的this被替换
        this.bindloop = this.loop.bind(this);
        this.loop()
    }

    // 开始界面主循环
    loop() {  
        cxt.clearRect(0, 0, canvas.width, canvas.height);
        Instance.background.drawToCanvas(Img.bgDay, Img.bgNight);
        for(var i = 0;i < Global.layout.ground.number;i++) {
            Instance.grounds[i].drawToCanvas(Img.ground);
        }
        Instance.buttonPlay.drawToCanvas(Img.buttonPlay);
        Instance.buttonScore.drawToCanvas(Img.buttonScore);
        Instance.bird.drawToCanvas(Img.bird);
        Instance.logo.drawToCanvas(Img.logo);
        this.frameCallBackId = requestAnimationFrame(this.bindloop)
    }
}