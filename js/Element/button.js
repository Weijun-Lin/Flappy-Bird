// 按钮类

import {canvas} from "../global.js"

const ctx = canvas.getContext("2d");

export default class Button {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height
    }

    // 接受坐标 判断是否点击到
    isClicked(x, y) {
        if(x > this.x && x < this.x + this.width && 
            y > this.y && y < this.y + this.height) {
               return true;
        }
        return false;
    }

    drawToCanvas(image) {
        ctx.drawImage(image, this.x, this.y, this.width, this.height);
    }
}