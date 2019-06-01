// 背景类 昼夜交替

import { canvas, Global, Img } from "../global.js"

const ctx = canvas.getContext("2d");

export default class Background {
    constructor() {
        this.type = 1;  // 表面状态 1：昼 ； -1： 夜
        this.width = Global.layout.bg.width
        this.height = Global.layout.bg.height;
        this.x = Global.layout.bg.x;
        this.y = Global.layout.bg.y;
        this.setAnimation();
    }

    drawToCanvas() {
        var image = this.type == 1 ? Img.bgDay : Img.bgNight;
        ctx.drawImage(image, this.x, this.y, this.width, this.height);
    }

    setAnimation() {
        this.timer = setInterval(this.changeType.bind(this), 10000);
    }

    changeType() {
        this.type = -this.type;
    }
}