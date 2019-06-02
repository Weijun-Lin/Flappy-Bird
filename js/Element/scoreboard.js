/*
分数板类：
    @Name: ScoreBoard
    @Attributes:
        constructor：构造函数
        drawToCanvas：绘图
    @Decription:
        分数板的绘制
*/

import { canvas, Global, Img } from "../global"
import { drawTextToCanvas } from "../Tool/tool"
import Button from "./button"

const ctx = canvas.getContext("2d");

export default class ScoreBoard {
    constructor() {
        // 布局
        this.x = Global.layout.scoreBoard.x;
        this.y = Global.layout.scoreBoard.y;
        this.width = Global.layout.scoreBoard.width;
        this.height = Global.layout.scoreBoard.height;
        // 字体
        this.fontHeight = this.height * 25 / 126;
        this.fontWidth = this.fontHeight / 2;
        // 分数显示区域
        this.scoreX = this.x + this.width * 160 / 238;
        this.scoreY = this.y + this.height * 55 / 126;
        // 奖牌显示区域
        this.medalR = this.height * 42 / 126;
        this.medalX = this.x + this.width * 53 / 238 - this.medalR / 2;
        this.medalY = this.y + this.height * 66 / 126 - this.medalR / 2;
        // 开始游戏按钮
        this.buttonPlay = new Button({
            x: this.x,
            y: this.y + this.height,
            width: this.width * 7 / 16,
            height: this.height / 3
        });
        // 排行榜按钮
        this.buttonScore = new Button({
            x: this.x + this.width * 9 / 16,
            y: this.y + this.height,
            width: this.width * 7 / 16,
            height: this.height / 3
        });
    }

    drawToCanvas(score) {
        ctx.drawImage(Img.scoreBoard, this.x, this.y, this.width, this.height);
        if(Global.score > 50) {
            ctx.drawImage(Img.medal1, this.medalX, this.medalY, this.medalR, this.medalR);
        } else if(Global.score > 35 && Global.score <= 50) {
            ctx.drawImage(Img.medal2, this.medalX, this.medalY, this.medalR, this.medalR);
        } else {
            ctx.drawImage(Img.medal3, this.medalX, this.medalY, this.medalR, this.medalR);
        }
        drawTextToCanvas(String(score), {
            x: this.scoreX,
            y: this.scoreY,
            width: this.fontWidth,
            height: this.fontHeight
        });
        this.buttonPlay.drawToCanvas(Img.buttonPlay);
        this.buttonScore.drawToCanvas(Img.buttonScore);
    }
}