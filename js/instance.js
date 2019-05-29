import Background from "./Element/background.js"
import SingleGround from "./Element/ground.js"
import Button from "./Element/button.js"
import Bird from "./Element/bird.js"
import Pipe from "./Element/pipe.js"
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
}

var rightX = Global.layout.pipe.changeX + Global.layout.ground.step;
var leftX = Global.layout.pipe.changeX - Global.layout.ground.step;

var groundTimer = setInterval( () => {
    if(Global.gameState != 3 || Global.gameState != 4) {
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
        }
        Instance.grounds.forEach(function (item) { item.move(); });
    }
}, layout.ground.interval);

export {Instance, groundTimer}