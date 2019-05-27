// 游戏正式开始

import { Global, canvas, Img } from "./global.js"
import { Instance } from "./instance.js"

// 获取绘图上下文
const ctx = canvas.getContext("2d");

export default class GamePlay {
    constructor() {
        Global.gameState = 1;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}