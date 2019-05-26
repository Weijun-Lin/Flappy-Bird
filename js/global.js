/*
    srcPath: 定义资源文件路径
    canvas： 全局画布
    loadImage: 根据路径返回图片
*/
var srcPath =
{
    bird: "src/Image/bird.png",
    logo: "src/Image/logo.png",
    pipe: "src/Image/pipe.png",
    ground: "src/Image/ground.png",
    buttonPlay: "src/Image/button_play.png",
    bgDay: "src/Image/bg_day.png",
    bgNight: "src/Image/bg_night.png",
    bgm: "src/Audio/bgm.mp3",
};

const canvas = wx.createCanvas();

function loadImage(imagePath) {
    var Image = wx.createImage();
    Image.src = imagePath;
    return Image;
}
export {srcPath, canvas, loadImage};