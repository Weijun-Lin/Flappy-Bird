import Background from "./Element/background.js"
import SingleGround from "./Element/ground.js"
import Button from "./Element/button.js"
import Bird from "./Element/bird.js"
import Pipe from "./Element/pipe.js"
import ScoreBoard from "./Element/scoreboard.js"
import {Global, canvas} from "./global.js"

var layout = Global.layout;

function createGround() {
    var grounds = [];
    for(var i = 0;i < layout.ground.number;i++) {
        grounds.push(new SingleGround(i*Global.layout.ground.width));
    }
    return grounds;
}

var Instance = {
    background: new Background(),
    grounds: createGround(),
    bird: new Bird(),
    logo: new Button(layout.logo.x, layout.logo.y,layout.logo.width, layout.logo.height),
    pipes: [new Pipe(2*canvas.width), new Pipe(3*canvas.width)],
    scoreBoard: new ScoreBoard(),
    tutorial: new Button(layout.tutorial.x, layout.tutorial.y, 
                layout.tutorial.width, layout.tutorial.height),
    buttonShare: new Button(layout.buttonShare.x, layout.buttonShare.y,
                layout.buttonShare.width, layout.buttonShare.height),
    buttonPlay: new Button(layout.buttonPlay.x, layout.buttonPlay.y,
                layout.buttonPlay.width, layout.buttonPlay.height),
    buttonScore: new Button(layout.buttonScore.x, layout.buttonScore.y,
        layout.buttonScore.width, layout.buttonScore.height),
    textReady: new Button(layout.textReady.x, layout.textReady.y,
        layout.textReady.width, layout.textReady.height),
    textGameOver: new Button(layout.textReady.x, layout.textReady.y,
        layout.textReady.width, layout.textReady.height),
}

// 处理碰撞
function collisionPipe(pipe) {
    var startX1 = Instance.bird.x;
    var startY1 = Instance.bird.y
    var endX1 = startX1 + Instance.bird.width;
    var endY1 = startY1 + Instance.bird.height;

    var startX2 = pipe.x;
    var endX2 = startX2 + pipe.width;
    var startY2up = 0;
    var endY2up = startY2up + pipe.upHeight;
    var startY2down = pipe.downY;
    var endY2down = pipe.downY + pipe.downHeight;

    return (!(endY2up < startY1 || endY1 < startY2up || startX1 > endX2 || startX2 > endX1) ||
            !(endY2down < startY1 || endY1 < startY2down || startX1 > endX2 || startX2 > endX1));
}

function collision() {
    // 处理上下界
    if (Instance.bird.y <= 0 || Instance.bird.y + Instance.bird.height >= Global.layout.ground.y) {
        Global.gameState = 4;
    }
    // 处理与管道的碰撞
    if(collisionPipe(Instance.pipes[0]) || collisionPipe(Instance.pipes[1])) {
        Global.gameState = 4;
    }
}

var rightX = Global.layout.pipe.changeX + Global.layout.ground.step;
var leftX = Global.layout.pipe.changeX - Global.layout.ground.step;
var scoreFlag = 0;

var groundTimer = setInterval( () => {
    if(Global.gameState != 3 && Global.gameState != 4) {
        // 如果正式运行时
        if(Global.gameState == 2) {
            Instance.pipes[0].move();
            Instance.pipes[1].move();
            if(Instance.pipes[0].x <= rightX && Instance.pipes[0].x >= leftX) {
                Instance.pipes[1].x = canvas.width;
                Instance.pipes[1].reSetHeight();
            }
            if (Instance.pipes[1].x <= rightX && Instance.pipes[1].x >= leftX) {
                Instance.pipes[0].x = canvas.width;
                Instance.pipes[0].reSetHeight();
            }
            var pipeWidth = Global.layout.pipe.width/2;
            if(Instance.pipes[0].x + pipeWidth <= Instance.bird.x && scoreFlag == 0) {
                Global.score++;   
                scoreFlag = 1;
            }
            if(Instance.pipes[1].x + pipeWidth <= Instance.bird.x && scoreFlag == 1) {
                Global.score++;
                scoreFlag = 0;
            }
            // 加入碰撞检测
            collision();
        }
        Instance.grounds.forEach(function (item) { item.move(); });
    }
}, layout.ground.interval);

export {Instance, groundTimer}