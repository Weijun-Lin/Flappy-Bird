/*
按钮类：
    @Name: Pipe
    @Attributes:
        constructor：构造函数
        reSetHeight: 重新设置参数
        drawToCanvas：绘图
        move：移动 长度和地面相同
    @Decription:
        一对管道的基础操作实现 构造函数需提供横坐标
*/

import { canvas, Global, Img } from "../global"

const ctx = canvas.getContext("2d");

export default class Pipe {
    constructor(x) {
        this.width = Global.layout.pipe.width;
        this.gap = Global.layout.pipe.gap;
        this.minHeight = Global.layout.pipe.minHeight;
        this.maxHeight = Global.layout.pipe.maxHeight;
        this.x = x;
        this.reSetHeight();
    }

    // 重新设置大小
    reSetHeight() {
        this.downHeight = Math.random()*(this.maxHeight-this.minHeight)+this.minHeight;
        this.downY = Global.layout.bg.height - this.downHeight;
        this.upHeight = this.downY - this.gap;
        this.upY = this.upHeight - this.maxHeight;
    }

    move() {
        this.x -= Global.layout.ground.step;
    }

    drawToCanvas() {
        // 绘制上半部分
        ctx.drawImage(Img.pipeUp, this.x, this.upY, this.width, this.maxHeight);
        // 绘制上半部分
        ctx.drawImage(Img.pipeDown, this.x, this.downY, this.width, this.maxHeight);
    }
}