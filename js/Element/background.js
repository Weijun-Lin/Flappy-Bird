// 背景类 昼夜交替

import { canvas } from "../global.js"

const ctx = canvas.getContext("2d");

export default class Background {
    constructor() {
        this.type = 1;  // 表面状态 1：昼 ； -1： 夜
        this.width = canvas.width;
        this.height = canvas.height*0.85;
        this.setAnimation();
    }

    drawToCanvas(imageDay, imageNight) {
        var image = this.type == 1 ? imageDay : imageNight;
        ctx.drawImage(image, 0, 0, this.width, this.height);
    }

    setAnimation() {
        this.timer = setInterval(this.changeType.bind(this), 5000);
    }

    changeType() {
        this.type = -this.type;
    }
}