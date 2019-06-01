import { canvas, Global, Img } from "../global.js"
import { drawTextToCanvas} from "../Tool/tool.js"
import Button from "./button.js"

const ctx = canvas.getContext("2d");

export default class ScoreBoard {
    constructor() {
        this.x = Global.layout.scoreBoard.x;
        this.y = Global.layout.scoreBoard.y;
        this.width = Global.layout.scoreBoard.width;
        this.height = Global.layout.scoreBoard.height;
        this.fontHeight = this.height*25/126;
        this.fontWidth = this.fontHeight/2;
        this.scoreX = this.x + this.width*160/238;
        this.scoreY = this.y + this.height*55/126;
        this.medalR = this.height*42/126;
        this.medalX = this.x + this.width*53/238 - this.medalR/2;
        this.medalY = this.y + this.height*66/126 - this.medalR/2;
        this.buttonPlay = new Button({
            x: this.x,
            y: this.y + this.height,
            width: this.width*7/16,
            height: this.height/3
        });
        this.buttonScore = new Button({
            x: this.x + this.width*9/16,
            y: this.y + this.height,
            width: this.width*7/16,
            height: this.height/3
        });
    }

    drawToCanvas(score) {
        ctx.drawImage(Img.scoreBoard, this.x, this.y, this.width, this.height);
        ctx.drawImage(Img.medal1, this.medalX, this.medalY, this.medalR, this.medalR);
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