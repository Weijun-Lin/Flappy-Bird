/*
@Attributes:
    createGround：生成地面
    Instance：游戏实例
    collisionPipe：判断小鸟与管道的碰撞
    produceMedal：生成奖牌
    collisionMedal：判断是否吃到奖牌
    medalMove：道具移动
    setInvincibleTimer：无敌状态定时器
    setInvincibleAndSeppdUpTimer：无敌 + 冲刺
    collisionMedals：判断和三种道具相撞
    collision：总的碰撞
    groundTimer：地面移动 管道移动 道具生成 逻辑判断

@Decription:
    整个游戏的实例库 以及 开始游戏的运行定时器 道具机制逻辑
*/

import Background from "./Element/background"
import SingleGround from "./Element/ground"
import Button from "./Element/button"
import Bird from "./Element/bird"
import Pipe from "./Element/pipe"
import ScoreBoard from "./Element/scoreboard"
import { Global, canvas, openDataContext, Music } from "./global"

var layout = Global.layout;


function createGround() {
    var grounds = [];
    for (var i = 0; i < layout.ground.number; i++) {
        grounds.push(new SingleGround(i * Global.layout.ground.width));
    }
    return grounds;
}

// 游戏实例
var Instance = {
    background: new Background(),
    grounds: createGround(),
    bird: new Bird(),
    logo: new Button(layout.logo),
    // 一共只有两个管道
    pipes: [new Pipe(2 * canvas.width), new Pipe(3 * canvas.width)],
    scoreBoard: new ScoreBoard(),
    tutorial: new Button(layout.tutorial),
    buttonPlay: new Button(layout.buttonPlay),
    buttonScore: new Button(layout.buttonScore),
    textReady: new Button(layout.textReady),
    textGameOver: new Button(layout.textReady),
    buttonRankBoardClose: new Button(layout.rankBoardClose),
    buttonRankBoardLastPage: new Button(layout.rankBoardLastPage),
    buttonRankBoardNextPage: new Button(layout.rankBoardNextPage),
    // 三个道具
    medal1: new Button(layout.medal),
    medal2: new Button(layout.medal),
    medal3: new Button(layout.medal),
}

// 处理和管道的碰撞
// 此处碰撞较为粗略 没有考虑小鸟旋转
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

// ---------------------- 道具区 ----------------------------------

// 随机生成一个道具 生成在管子中间
function produceMedal(pipe) {
    var y1 = pipe.upY + pipe.maxHeight + pipe.gap - Global.layout.medal.height * 1.2;
    var y2 = pipe.upY + pipe.maxHeight + Global.layout.medal.height / 8;
    // 道具产生在偏上还是偏下
    var y = Math.random() < 0.5 ? y1 : y2;
    var x = canvas.width + Global.layout.medal.width / 2;
    if (Global.pipeNum % 3 == 0) {
        // 按比例产生道具  
        var number = Math.random() * 10;
        if (number >= 0 && number < 3.5) {
            Instance.medal1.x = x;
            Instance.medal1.y = y;
        } else if (number >= 3.5 && number < 6.5) {
            Instance.medal2.x = x;
            Instance.medal2.y = y;
        } else {
            Instance.medal3.x = x;
            Instance.medal3.y = y;
        }
    }
}

// 判断鸟是否和道具相撞
function collisionMedal(medal) {
    var startX1 = Instance.bird.x;
    var startY1 = Instance.bird.y
    var endX1 = startX1 + Instance.bird.width;
    var endY1 = startY1 + Instance.bird.height;

    var startX2 = medal.x;
    var startY2 = medal.y
    var endX2 = startX2 + medal.width;
    var endY2 = startY2 + medal.height;

    return !(endY2 < startY1 || endY1 < startY2 || startX1 > endX2 || startX2 > endX1);
}

// 道具移动 和 管道同步
function medalMove() {
    Instance.medal1.x -= Global.layout.ground.step;
    Instance.medal2.x -= Global.layout.ground.step;
    Instance.medal3.x -= Global.layout.ground.step;
}

// 无敌效果 & 加速定时器
var invincibleTimer = undefined;
var invincibleSpeedUpTimer = undefined;
// 计时
var times = 0;

function setInvincibleTimer() {
    // 清楚之前的效果
    clearInterval(invincibleSpeedUpTimer);
    clearInterval(invincibleTimer);
    Global.layout.ground.step = 1.3;
    times = 0;
    Global.birdState = 1;
    invincibleTimer = setInterval(() => {
        times++;
        // 保证隐身时不与管子相撞
        if (times >= 280 && !collisionPipe(Instance.pipes[0]) && !collisionPipe(Instance.pipes[1])) {
            clearInterval(invincibleTimer);
            Global.birdState = 0;
        }
    }, 15)
}

function setInvincibleAndSeppdUpTimer() {
    // 清楚之前的效果
    clearInterval(invincibleSpeedUpTimer);
    clearInterval(invincibleTimer);
    times = 0;
    Global.birdState = 1;
    Global.layout.ground.step = 3.5;
    invincibleSpeedUpTimer = setInterval(() => {
        times++;
        // 保证隐身时不与管子相撞
        if ((times >= 180 && !collisionPipe(Instance.pipes[0]) && !collisionPipe(Instance.pipes[1]))) {
            clearInterval(invincibleSpeedUpTimer);
            Global.birdState = 0;
            Global.layout.ground.step = 1.3;
        }
    }, 15)
}


// 判断与三个道具相撞
function collisionMedals() {
    // 与金牌相撞效果： 无敌+冲刺
    if (collisionMedal(Instance.medal1)) {
        Instance.medal1.x = -canvas.width;
        setInvincibleAndSeppdUpTimer();
        Global.score++;
        Music.point.play();
        console.log("eat medal1");
    }
    // 与银牌相撞效果： 无敌 
    if (collisionMedal(Instance.medal2)) {
        Instance.medal2.x = -canvas.width;
        setInvincibleTimer();
        Global.score++;
        Music.point.play();
        console.log("eat medal2");
    }
    // 铜牌分数加 5
    if (collisionMedal(Instance.medal3)) {
        Instance.medal3.x = -canvas.width;
        Global.score += 5;
        Music.point.play();
        console.log("eat medal3");
    }
}

// ------------------------ End 道具区 -----------------------------------------

function collision() {
    // 处理上下界
    if (Global.birdState == 0) {
        if (Instance.bird.y <= 0 || Instance.bird.y + Instance.bird.height >= Global.layout.ground.y) {
            Music.hit.play();
            Global.gameState = 4;
            // 发送分数
            openDataContext.postMessage({
                type: "setScore",
                score: Global.score,
            });
        }
        // 处理与管道的碰撞
        if (collisionPipe(Instance.pipes[0]) || collisionPipe(Instance.pipes[1])) {
            Music.hit.play();
            // 发送分数
            Global.gameState = 4;
            openDataContext.postMessage({
                type: "setScore",
                score: Global.score,
            });
        }
    }
    // 处理道具和小鸟的碰撞
    medalMove();
    collisionMedals();
}

var rightX = Global.layout.pipe.changeX + 1.5 * Global.layout.ground.step;
var leftX = Global.layout.pipe.changeX - 1.5 * Global.layout.ground.step;
var pipeResetFlag = 0;

// 游戏运行中的数据设置
var groundTimer = setInterval(() => {
    // 游戏暂停和结束不更改数据 （暂无设置游戏暂停）
    if (Global.gameState != 3 && Global.gameState != 4) {
        // 如果正式运行时
        if (Global.gameState == 2) {
            Instance.pipes[0].move();
            Instance.pipes[1].move();
            // 产生下一个管道
            if (Instance.pipes[0].x <= rightX && Instance.pipes[0].x >= leftX && pipeResetFlag == 0) {
                Instance.pipes[1].x = canvas.width;
                Instance.pipes[1].reSetHeight();
                pipeResetFlag = 1;
                // 生成道具
                produceMedal(Instance.pipes[1]);
            }
            if (Instance.pipes[1].x <= rightX && Instance.pipes[1].x >= leftX && pipeResetFlag == 1) {
                Instance.pipes[0].x = canvas.width;
                Instance.pipes[0].reSetHeight();
                pipeResetFlag = 0;
                // 生成道具
                produceMedal(Instance.pipes[0]);
            }

            // 分数增加
            var pipeWidth = Global.layout.pipe.width / 2;
            if (Instance.pipes[0].x + pipeWidth <= Instance.bird.x && Global.scoreFlag == 0) {
                Global.score++;
                Global.pipeNum++;
                Global.scoreFlag = 1;
            }
            if (Instance.pipes[1].x + pipeWidth <= Instance.bird.x && Global.scoreFlag == 1) {
                Global.score++;
                Global.pipeNum++;
                Global.scoreFlag = 0;
            }
            // 加入碰撞检测
            collision();
        }
        Instance.grounds.forEach(function (item) {
            item.move();
        });
    }
}, layout.ground.interval);

export {
    Instance,
    groundTimer
}