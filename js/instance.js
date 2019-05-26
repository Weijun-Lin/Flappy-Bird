import Background from "./background.js"
import SingleGround from "./ground.js"
import Button from "./button.js"
import Bird from "./bird.js"
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