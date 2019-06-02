/*地面元素类
    @Name: SingleGround
    @Attributes:
        constructor：构造函数
        drawToCanvas：绘图
        move: 地面移动
    @Decription:
        地面单片移动 地面由许多的单片地面组成
*/

import { canvas, Global, Img } from "../global"

const ctx = canvas.getContext("2d");

export default class SingleGround {
    constructor(x) {
        this.x = x; // 地面只有x坐标改变
        this.y = Global.layout.ground.y;
        this.height = Global.layout.ground.height;
        this.width = Global.layout.ground.width;
    }

    drawToCanvas() {
        // 如果处于一半在画布之外的状态 同时在右边绘制一个
        if (this.x < 0 && this.x > -this.width) {
            var rightX = canvas.width + this.x;
            ctx.drawImage(Img.ground, rightX, this.y, this.width, this.height);
        }
        ctx.drawImage(Img.ground, this.x, this.y, this.width, this.height);
    }

    // 控制地面移动
    move() {
        this.x -= Global.layout.ground.step;
        if (this.x <= -this.width) {
            // 超出则放到最右边
            // 此处需注意 不能直接简单的设置为canvas*0.9避免移动步长不算宽度因子的情况
            this.x = canvas.width + this.x;
        }
    }
}