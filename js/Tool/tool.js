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
function drawTextToCanvas(text, layout) {
    var x = layout.x;
    var width = layout.width;
    var y = layout.y;
    var height = layout.height;
    for(var i = 0;i < text.length;i++) {
        // 防止太长
        if(i >= 5) {
            break;
        }
        var number = Number(text[i]);
        // 设置当前子图
        var subImage = Img.font[number];
        ctx.drawImage(subImage, x, y, width, height);
        x += width;
    }
}

// 通过Global的布局对象绘制
function drawImage(img, lay) {
    ctx.drawImage(img, lay.x, lay.y, lay.width, lay.height);
}

export { drawTextToCanvas, drawImage }