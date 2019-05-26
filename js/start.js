// 游戏开始界面
// 点击开始按钮后进入正式游戏界面

import {srcPath, canvas, loadImage} from "./global.js"
import Bird from "./bird.js"

// 获取绘图上下文
const cxt = canvas.getContext("2d");
// 定义Logo图片大小
const logoWidth = canvas.width*2/3;
const logoHeight = canvas.height/10;
// 背景高度为画布高度
const bgHeight = canvas.height*0.85;

// ------地面元素类--------------------------------------------------------
// 地面由多个地面小图组成
export class SingleGround {
    constructor(x) {
        this.x = x; // 地面只有x坐标改变
        this.y = canvas.height*0.85;
        this.height = canvas.height*0.15;
        this.width = canvas.width*0.1;
        // 移动一次的步长：必须设置为宽度的因子 否则会有黑边
        this.step = 2;
    }

    drawToCanvas(image) {
        // 如果处于一半在画布之外的状态 同时在右边绘制一个
        if(this.x < 0 && this.x > -this.width) {
            var rightX = canvas.width + this.x;
            cxt.drawImage(image, rightX, this.y, this.width, this.height);
        }
        cxt.drawImage(image, this.x, this.y, this.width, this.height);
    }
}

// ------开始页面类---------------------------------------------------------------
export default class StartPage {
    constructor() {
        cxt.clearRect(0, 0, canvas.width, canvas.height);
        this.height = canvas.height;
        this.width = canvas.width;
        // 定时器间隔
        this.interval = 15;
        // 防止loop里面的this被替换
        this.bindloop = this.loop.bind(this);
        // 图像加载
        this.logoImg = loadImage(srcPath.logo);
        this.bgDayImg = loadImage(srcPath.bgDay);
        this.bgNightImg = loadImage(srcPath.bgNight);
        this.groundImg = loadImage(srcPath.ground);
        this.buttonPlayImg = loadImage(srcPath.buttonPlay);
        this.initGround();
        this.moveGround();
        // 加载小鸟
        this.birdImg = loadImage(srcPath.bird);
        this.bird = new Bird();
        // 开始页面主循环
        this.loop()
    }

    // ------地面动画设置-----------------------------------------------------
    // 初始化地面 现在为10个
    initGround() {
        this.grounds = [];
        for(var i = 0;i < 10;i++) {
            this.grounds.push(new SingleGround(i*canvas.width*0.1));
        }
    }

    // 移动背景设置背景移动定时器
    moveGround() {
        this.groundTimer = 
            setInterval(this.moveGroundOneStep.bind(this), this.interval);
    }

    // 移动一步
    // Log: 所有改变地面的坐标都必须放在一个定时器完成
    moveGroundOneStep() {
        for(var i = 0;i < this.grounds.length;i++) {
            this.grounds[i].x -= this.grounds[i].step;
            if (this.grounds[i].x <= -this.grounds[i].width) {
                // 超出则放到最右边
                this.grounds[i].x = canvas.width*0.9;
            }
        }
    }
    
    // ------绘制函数区------------------------------------------------------
    // 绘制背景
    drawBk() {
        cxt.drawImage(this.bgNightImg, 0, 0, this.width, bgHeight);
    }

    // 绘制Logo
    drawLogo() {
        var x = canvas.width/2 - logoWidth/2;
        var y = canvas.height/8;
        cxt.drawImage(this.logoImg, x, y, logoWidth, logoHeight);
    }

    // 绘制地面 绘制和数据变换改变
    drawGround() {
        for(var i = 0;i < this.grounds.length;i++) {
            this.grounds[i].drawToCanvas(this.groundImg);
        }
    }

    // 绘制开始按钮
    drawButtonPlay() {
        var width = canvas.width*0.3;
        var height = width*0.4;
        var x = canvas.width/2 - width/2;
        var y = canvas.height*0.5;
        cxt.drawImage(this.buttonPlayImg, x, y, width, height);

    }

    // 开始界面主循环
    loop() {  
        cxt.clearRect(0, 0, canvas.width, canvas.height);
        this.drawBk();
        this.drawLogo();
        this.drawButtonPlay();
        this.drawGround();
        this.bird.drawToCanvas(this.birdImg);
        this.frameCallBackId = requestAnimationFrame(this.bindloop)
    }
}