import { canvas, Global, Img } from "../global.js"

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
        // console.log(this.downY, this.downHeight);
    }
}