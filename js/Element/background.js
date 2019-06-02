/*
背景类:
    @Name: Background
    @Attrributes:
        constructor
        drawToCanvas
        setAnimation：设置昼夜转换动画
        changeType
    @Description:
        显示游戏背景提供昼夜交替效果
*/

import { canvas, Global, Img } from "../global"

const ctx = canvas.getContext("2d");

export default class Background {
    constructor() {
        this.type = 1; // 表面状态 1：昼 ； -1： 夜
        this.width = Global.layout.bg.width
        this.height = Global.layout.bg.height;
        this.x = Global.layout.bg.x;
        this.y = Global.layout.bg.y;
        this.setAnimation();
    }

    // 向画图绘图
    drawToCanvas() {
        var image = this.type == 1 ? Img.bgDay : Img.bgNight;
        ctx.drawImage(image, this.x, this.y, this.width, this.height);
    }

    // 设置昼夜交替定时器
    setAnimation() {
        this.timer = setInterval(this.changeType.bind(this), 10000);
    }

    // 同上
    changeType() {
        this.type = -this.type;
    }
}