// 小鸟类

import { srcPath, canvas, loadImage } from "../global.js"

console.log(typeof(canvas));
const ctx = canvas.getContext("2d");

export default class Bird {
    constructor() {
        this.height = canvas.height*(1/24);
        this.width = this.height*1.4;   // 宽高比为1.4
        // 小鸟始终居中
        this.x = canvas.width/2 - this.width/2;
        this.y = canvas.height/3;
        this.index = 0; // 当前小鸟状态 即是那一张精灵图
        this.interval = 100;
        this.setAnimation();
        this.setAnimationUpDown();
    }

    // 绘制鸟到画布上 三只鸟在一张精灵图上 所以需指定第几个
    drawToCanvas(image) {
        var sliceX = image.width * this.index / 3;
        ctx.drawImage(image, sliceX, 0, image.width/3, image.height, 
                        this.x, this.y, this.width, this.height);
    }

    // 设置小鸟扇翅膀动画
    setAnimation() {
        this.birdTimer = 
            setInterval(this.changeStateOfSpirit.bind(this), this.interval);
    }

    // 设置小鸟在开始界面上下移动动画
    setAnimationUpDown() {
        this.direction = -1; // 1: down ; -1: up
        this.accel = -0.05;
        this.vY = 0.6;
        this.v0 = 0.6;
        this.yInterval = 30;
        this.birdTimerOfUpDown = 
            setInterval(this.changeStateOfUpDown.bind(this), this.yInterval);
    }

    // 改变状态 -- 翅膀
    changeStateOfSpirit() {
        this.index = (this.index + 1)%3;
    }

    // 改变上下
    changeStateOfUpDown() {
        // 向下移动 此处vY只有大小没有方向 方向由direction控制
        if(this.direction == 1) {
            if(this.vY == this.v0) {
                // 加速度改为反方向 减速
                this.accel = Math.abs(this.accel)*(-this.direction);
            }
            if(this.vY <= 0) {
                this.direction = -1; // 改为向上移动
                this.accel = Math.abs(this.accel)*(this.direction);
            }
        }   // 方向为向上移动
        else {
            if (this.vY == this.v0) {
                // 加速度改为反方向 减速
                this.accel = Math.abs(this.accel) * (-this.direction);
            }
            if (this.vY <= 0) {
                this.direction = 1; // 改为向上移动
                this.accel = Math.abs(this.accel) * (this.direction);
            }
        }
        this.vY += this.accel*this.yInterval*this.direction/10;
        this.y += this.vY*this.yInterval*this.direction/10;
    }
}