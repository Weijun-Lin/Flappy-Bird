/*
按钮类：
    @Name: Button
    @Attributes:
        constructor：构造函数
        isClicked: 判断是否点击到
        drawToCanvas：绘图
    @Decription:
        按钮的基础操作 许多图片展示也可以使用按钮类
*/

import {canvas} from "../global"

const ctx = canvas.getContext("2d");

export default class Button {
    constructor(layout) {
        this.x = layout.x;
        this.y = layout.y;
        this.width = layout.width;
        this.height = layout.height
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