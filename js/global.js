/*
    srcPath: 定义资源文件路径
    canvas： 全局画布
    loadImage: 根据路径返回图片
*/

const canvas = wx.createCanvas();
const ctx = canvas.getContext("2d");
const Height = canvas.height;
const Width = canvas.width;

// 界面配置 以及 资源路径
var Global = {
    score: 0,
    srcPath: {
        bird: "src/Image/bird.png",
        logo: "src/Image/logo.png",
        pipe: "src/Image/pipe.png",
        ground: "src/Image/ground.png",
        buttonPlay: "src/Image/button_play.png",
        buttonScore: "src/Image/button_score.png",
        buttonShare: "src/Image/button_share.png",
        bgDay: "src/Image/bg_day.png",
        bgNight: "src/Image/bg_night.png",
        tutorial: "src/Image/tutorial.png",
        pipeUp: "src/Image/pipe_up.png",
        pipeDown: "src/Image/pipe_down.png",
        textReady: "src/Image/text_ready.png",
        textGameOver: "src/Image/text_game_over.png",
        bgm: "src/Audio/bgm.mp3",
        font: "src/Image/Font/font_",
        scoreBoard: "src/Image/scoreboard.png",
        medal: "src/Image/medal.png",
    },
    layout: {
        bg: {
            x: 0,
            y: 0,
            width: Width,
            height: Height*0.8,
        },
        // 地面由SingleGround组成 x坐标不一致
        ground: {
            y: Height*0.8,
            number: 10,
            width: Width/10,
            height: Height*0.2,
            interval: 8,
            step: 1.2,
        },
        logo: {
            width: Width*2/3,
            height: Height/10,
            x: Width/2 - Width*2/6,
            y: Height/8,
        },
        buttonPlay: {
            x: Width/4,
            y: Height*0.53,
            width: Width/2,
            height: Width*0.16,
        },
        buttonScore: {
            x: Width/2 - Width/6,
            y: Height*0.68,
            width: Width/3,
            height: Width*0.17,
        },
        buttonShare: {
            x: Width/8,
            y: Height*0.68,
            width: Width/3,
            height: Width*0.13,
        },
        tutorial: {
            width: Width/2,
            height: Width*0.4,
            x: Width/2 - Width/5,
            y: Height/3,
        },
        textReady: {
            width: Width*2/3,
            height: Height/10,
            x: Width/2 - Width*2/6,
            y: Height/8,
        },
        pipe: {
            width: Width*0.15,
            gap: Height*0.18,
            minHeight: Height*0.1,
            maxHeight: Height*0.8 - Height*0.18 - Height*0.1, // bg.height - gap - minHeight
            changeX: Width*0.25,
        },
        scoreInPlay: {
            x: Width/2 - (18*3/2),
            y: Height/30,
            width: 18,
            height: 40,
        },
        scoreBoard: {
            width: Width*4/5,
            height: Width*8/15,
            x: Width/2 - Width*2/5,
            y: Height*0.4 - Width*4/15,
        },
    },
    /*
        游戏当前状态
        0：开始界面
        1：游戏开始运行页面
        2：游戏运行中
        3：游戏暂停
        4：游戏结束
    */
    gameState: 0,
};

function loadImage(imagePath) {
    var Image = wx.createImage();
    Image.src = imagePath;
    return Image;
}

// 接受路径前缀返回图片资源集合
function loadFromPrefix(prefixPath, type) {
    var fontImages = [];
    for(var i = 0;i < 10;i++) {
        fontImages.push(loadImage(prefixPath+String(i)+type));
    }
    return fontImages;
}

// 全局资源
var Img = {
    logo: loadImage(Global.srcPath.logo),
    bgDay: loadImage(Global.srcPath.bgDay),
    bgNight: loadImage(Global.srcPath.bgNight),
    ground: loadImage(Global.srcPath.ground),
    buttonPlay: loadImage(Global.srcPath.buttonPlay),
    buttonScore: loadImage(Global.srcPath.buttonScore),
    buttonShare: loadImage(Global.srcPath.buttonShare),
    bird: loadImage(Global.srcPath.bird),
    tutorial: loadImage(Global.srcPath.tutorial),
    pipeUp: loadImage(Global.srcPath.pipeUp),
    pipeDown: loadImage(Global.srcPath.pipeDown),
    textReady: loadImage(Global.srcPath.textReady),
    textGameOver: loadImage(Global.srcPath.textGameOver),
    font: loadFromPrefix(Global.srcPath.font, ".png"),
    scoreBoard: loadImage(Global.srcPath.scoreBoard),
    medal: loadImage(Global.srcPath.medal),
};

export { canvas, Global, Img };