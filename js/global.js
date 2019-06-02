/*
@Attributes:
    canvas: 画布
    openDataContext: 子域绘图上下文
    sharedCanvas：子域画布
    Global: 游戏布局 资源路径 游戏状态保存
    Img：图片资源
    Music：音效资源
@Decription:
    整个游戏过程的游戏资源配置 所有元素的布局设置区
*/

const canvas = wx.createCanvas();
const Height = canvas.height;
const Width = canvas.width;
let openDataContext = wx.getOpenDataContext();
let sharedCanvas = openDataContext.canvas;

// 设置子域画布大小 即排行榜大小
sharedCanvas.width = canvas.width * 0.8;
sharedCanvas.height = canvas.height * 0.7;

// 界面配置 以及 资源路径 以及 游戏状态
var Global = {
    score: 0, //  分数
    scoreFlag: 0, // Instance 中使用 何时增加分数
    birdState: 0, // 判断鸟的状态 1：无敌 & 0：普通
    pipeNum: 1, // 经过的管子数 配合道具使用
    // 所有资源路径
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
        font: "src/Image/Font/font_",
        scoreBoard: "src/Image/scoreboard.png",
        medal1: "src/Image/medals_1.png",
        medal2: "src/Image/medals_2.png",
        medal3: "src/Image/medals_3.png",
        bgm: "src/Audio/bgm.mp3",
        hit: "src/Audio/hit.mp3",
        point: "src/Audio/point.mp3",
        wing: "src/Audio/wing.mp3",
    },
    // 所有元素布局
    layout: {
        // 背景
        bg: {
            x: 0,
            y: 0,
            width: Width,
            height: Height * 0.8,
        },
        // 地面由SingleGround组成 x坐标不一致
        ground: {
            y: Height * 0.8,
            number: 10,
            width: Width / 10,
            height: Height * 0.2,
            interval: 8,
            step: 1.3,
        },
        // 游戏Logo
        logo: {
            width: Width * 2 / 3,
            height: Height / 10,
            x: Width / 2 - Width * 2 / 6,
            y: Height / 8,
        },
        // 开始按钮 ------- 开始界面
        buttonPlay: {
            x: Width / 4,
            y: Height * 0.53,
            width: Width / 2,
            height: Width * 0.16,
        },
        // 排行榜按钮 -------开始界面
        buttonScore: {
            x: Width / 2 - Width / 6,
            y: Height * 0.68,
            width: Width / 3,
            height: Width * 0.17,
        },
        // 游戏开始界面 tutorial 图片
        tutorial: {
            width: Width / 2,
            height: Width * 0.4,
            x: Width / 2 - Width / 5,
            y: Height / 3,
        },
        // 游戏开始界面 textReady 图片
        textReady: {
            width: Width * 2 / 3,
            height: Height / 10,
            x: Width / 2 - Width * 2 / 6,
            y: Height / 8,
        },
        // 管道
        pipe: {
            width: Width * 0.18,
            gap: Height * 0.18,
            minHeight: Height * 0.15,
            maxHeight: Height * 0.8 - Height * 0.18 - Height * 0.15, // bg.height - gap - minHeight
            changeX: Width * 0.25,
        },
        // 游戏中的分数
        scoreInPlay: {
            x: Width / 2 - (18 * 3 / 2),
            y: Height / 30,
            width: 18,
            height: 40,
        },
        // 分数板
        scoreBoard: {
            width: Width * 4 / 5,
            height: Width * 8 / 15,
            x: Width / 2 - Width * 2 / 5,
            y: Height * 0.4 - Width * 4 / 15,
        },
        // 排行榜
        scoreRankBoard: {
            x: canvas.width / 2 - sharedCanvas.width / 2,
            y: canvas.height / 2 - sharedCanvas.height / 2,
            width: sharedCanvas.width,
            height: sharedCanvas.height,
        },
        // 排行榜的关闭按钮
        rankBoardClose: {
            x: canvas.width / 2 - sharedCanvas.width / 2 + sharedCanvas.width - sharedCanvas.height / 12 -
                (sharedCanvas.height / 7 - sharedCanvas.height / 12) / 2,
            y: canvas.height / 2 - sharedCanvas.height / 2 + (sharedCanvas.height / 7 - sharedCanvas.height / 12) / 2,
            width: sharedCanvas.height / 12,
            height: sharedCanvas.height / 12,
        },
        // 排行榜下一页
        rankBoardNextPage: {
            height: sharedCanvas.height / 7,
            width: sharedCanvas.height * 1.5 / 7,
            x: canvas.width / 2 - sharedCanvas.width / 2 + sharedCanvas.width - sharedCanvas.height * 1.5 / 7,
            y: canvas.height / 2 - sharedCanvas.height / 2 + sharedCanvas.height * 6 / 7,
        },
        // 排行榜上一页
        rankBoardLastPage: {
            height: sharedCanvas.height / 7,
            width: sharedCanvas.height * 1.5 / 7,
            x: canvas.width / 2 - sharedCanvas.width / 2,
            y: canvas.height / 2 - sharedCanvas.height / 2 + sharedCanvas.height * 6 / 7,
        },
        // 道具 （道具就是奖牌）。。。
        medal: {
            x: -canvas.width,
            y: -canvas.width,
            height: Width * 0.08,
            width: Width * 0.08,
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
    // 排行榜显示 0：不显示 1:显示
    scoreBoardState: 0,
};

// 加载图像
function loadImage(imagePath) {
    var Image = wx.createImage();
    Image.src = imagePath;
    return Image;
}

// 接受路径前缀返回图片资源集合
function loadFromPrefix(prefixPath, type) {
    var fontImages = [];
    for (var i = 0; i < 10; i++) {
        fontImages.push(loadImage(prefixPath + String(i) + type));
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
    bird: loadImage(Global.srcPath.bird),
    tutorial: loadImage(Global.srcPath.tutorial),
    pipeUp: loadImage(Global.srcPath.pipeUp),
    pipeDown: loadImage(Global.srcPath.pipeDown),
    textReady: loadImage(Global.srcPath.textReady),
    textGameOver: loadImage(Global.srcPath.textGameOver),
    font: loadFromPrefix(Global.srcPath.font, ".png"),
    scoreBoard: loadImage(Global.srcPath.scoreBoard),
    medal1: loadImage(Global.srcPath.medal1),
    medal2: loadImage(Global.srcPath.medal2),
    medal3: loadImage(Global.srcPath.medal3),
};

// 加载音乐
function loadMusic(src) {
    var audio = wx.createInnerAudioContext();
    audio.src = src;
    return audio;
}

// 所有音效
var Music = {
    bgm: loadMusic(Global.srcPath.bgm),
    hit: loadMusic(Global.srcPath.hit),
    point: loadMusic(Global.srcPath.point),
    wing: loadMusic(Global.srcPath.wing),
};

// 导出变量
export {
    canvas,
    openDataContext,
    Global,
    Img,
    sharedCanvas,
    Music
};