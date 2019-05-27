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
        bgm: "src/Audio/bgm.mp3",
    },
    layout: {
        bg: {
            x: 0,
            y: 0,
            width: Width,
            height: Height*0.85,
        },
        // 地面由SingleGround组成 x坐标不一致
        ground: {
            y: Height*0.85,
            number: 10,
            width: Width/10,
            height: Height*0.15,
            interval: 15,
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
            height: Width*0.15,
        },
        buttonShare: {
            x: Width/8,
            y: Height*0.68,
            width: Width/3,
            height: Width*0.13,
        },
        tutorial: {
            x: Width/8,
            y: Height*0.65,
            width: Width/3,
            height: Width/4,
        },
    },
    /*
        游戏当前状态
        0：开始界面
        1：游戏运行中
        2：游戏暂停 
        3：游戏结束
    */
    gameState: 0,
};

function loadImage(imagePath) {
    var Image = wx.createImage();
    Image.src = imagePath;
    return Image;
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
};

export { canvas, loadImage, Global, Img};