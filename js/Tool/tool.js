// 一些额外的工具包
// 例如 重写canvas绘制字体

import {Global, canvas, Img} from "../global"

const ctx = canvas.getContext("2d");

/*
    文本绘制函数
    @Args:
        text: string to draw
        width: the one char's width
        height: the one char's height
        type: whcih style to choose
*/
function drawTextToCanvas(text, x, y, width, height) {
    for(var i = 0;i < text.length;i++) {
        var number = Number(text[i]);
        // 设置当前子图
        var subImage = Img.font[number];
        ctx.drawImage(subImage, x, y, width, height);
        x += width;
    }
}

export {drawTextToCanvas}