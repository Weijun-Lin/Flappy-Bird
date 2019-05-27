import Background from "./Element/background.js"
import SingleGround from "./Element/ground.js"
import Button from "./Element/button.js"
import Bird from "./Element/bird.js"
import {Global} from "./global.js"

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
    tutorial: new Button(layout.tutorial.x, layout.tutorial.y, 
                layout.tutorial.width, layout.tutorial.height),
    buttonShare: new Button(layout.buttonShare.x, layout.buttonShare.y,
                layout.buttonShare.width, layout.buttonShare.height),
    buttonPlay: new Button(layout.buttonPlay.x, layout.buttonPlay.y,
                layout.buttonPlay.width, layout.buttonPlay.height),
    buttonScore: new Button(layout.buttonScore.x, layout.buttonScore.y,
        layout.buttonScore.width, layout.buttonScore.height),
}

var groundTimer = setInterval( () => {
    for(var i = 0;i < layout.ground.number;i++) {
        Instance.grounds[i].move();
    }
}, layout.ground.interval);

export {Instance}