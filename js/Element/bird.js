/*
小鸟类：
    @Name: Bird
    @Attributes:
        constructor：构造函数
        reStart：重新设置参数 重开游戏使用到
        drawToCanvas：绘图
        setAnimation：设置小鸟精灵图切换
        changeStateOfSpirit：上面函数调用
        setAnimationUpDown：开始界面的上下移动动画
        changeStateOfUpDown：上下移动
        clearUpDownAnimation：删除上下移动动画
        jump：跳越 设置向上的初速度
        setDownAnimation：设置向下移动动画
        moveDown：向下移动
        clearDownAnimation：删除向下移动动画
    @Decription:
        提供小鸟的有关操作动画
*/

import { Global, canvas, Img, Music,} from "../global"

const ctx = canvas.getContext("2d");

export default class Bird {
    constructor() {
        this.height = canvas.height * 0.03;
        this.width = this.height * 1.4; // 宽高比为1.4
        // 小鸟始终居中 在开始界面
        this.x = canvas.width / 2 - this.width / 2;
        this.y = canvas.height / 3;
        this.index = 0; // 当前小鸟状态 即是那一张精灵图
        this.angle = 0; // 旋转显示的角度
        this.intervalOfUpDown = 100;    // 上下移动定时器间隔
        this.intervalOfDown = 16;   //下降动画定时器间隔
        // 重力设置；667 为开发工具iPhone6高度 统一比例适配不同手机
        this.gravity = 0.07*(canvas.height / 667);
        this.v = 0;
        this.setAnimation();
        this.setAnimationUpDown();
    }

    // 重新设置参数
    reStart() {
        this.x = canvas.width / 5;
        this.y = canvas.height / 3;
        this.index = 0;
        this.angle = 0;
        this.v = 0;
        this.setAnimationUpDown();
    }

    // 绘制鸟到画布上 三只鸟在一张精灵图上 所以需指定第几个 this.index指定
    drawToCanvas() {
        // 和道具相呼应 无敌效果即半透明状态
        if (Global.birdState == 1) {
            ctx.globalAlpha = 0.5;
        }
        // 旋转前需保存状态
        ctx.save();
        ctx.translate(this.x + 0.5 * this.width, this.y + 0.5 * this.height);
        ctx.rotate(this.angle);
        var sliceX = Img.bird.width * this.index / 3;
        ctx.drawImage(Img.bird, sliceX, 0, Img.bird.width / 3, Img.bird.height,
            -0.5 * this.width, -0.5 * this.height, this.width, this.height);
        // 旋转后恢复状态
        ctx.restore();
        // 同道具
        if (Global.birdState == 1) {
            ctx.globalAlpha = 1;
        }
    }

    // 设置小鸟扇翅膀动画
    setAnimation() {
        this.birdTimer =
            setInterval(this.changeStateOfSpirit.bind(this), this.intervalOfUpDown);
    }

    // 改变状态 -- 翅膀
    changeStateOfSpirit() {
        this.index = (this.index + 1) % 3;
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

    // 清除上下移动动画
    clearUpDownAnimation() {
        clearInterval(this.birdTimerOfUpDown);
    }

    // 改变上下
    changeStateOfUpDown() {
        // 向下移动 
        // 此处 vY 只有大小没有方向 方向由 direction 控制
        if (this.direction == 1) {
            if (this.vY == this.v0) {
                // 加速度改为反方向 减速
                this.accel = Math.abs(this.accel) * (-this.direction);
            }
            if (this.vY <= 0) {
                this.direction = -1; // 改为向上移动
                this.accel = Math.abs(this.accel) * (this.direction);
            }
        } 
        // 方向为向上移动
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
        // 次数的 10 为单位比例（恰巧10合适）
        this.vY += this.accel * this.yInterval * this.direction / 10;
        this.y += this.vY * this.yInterval * this.direction / 10;
    }

    // 点击后的跳跃
    jump() {
        // 速度与屏幕高有关 提高游戏体验 667 同上说明
        // 角度设置为20度向上 同时设置音效
        this.v = -3 * (canvas.height / 667);
        this.angle = -20 * Math.PI / 180;
        Music.wing.play();
    }

    // 设置向下移动动画
    setDownAnimation() {
        this.downAnimationTimer = setInterval(this.moveDown.bind(this), this.intervalOfDown);
    }

    clearDownAnimation() {
        clearInterval(this.downAnimationTimer);
    }

    // 向下移动
    moveDown() {
        // 只有在游戏中或者结束向下移动
        // 游戏结束设置为了撞到之后还会继续下落 提高游戏体验
        if (Global.gameState == 2 || Global.gameState == 4) {
            this.y += this.v * this.intervalOfDown / 10;
            if (this.y + this.height >= Global.layout.ground.y) {
                this.y = Global.layout.ground.y - this.height + 2;
            }
            this.v += this.intervalOfDown * this.gravity / 10;
            if (this.angle > Math.PI / 2) {
                this.angle = Math.PI / 2;
            }
            if (this.v >= 0) {
                this.angle += 3 * Math.PI / 180;
            }
        }
    }
}