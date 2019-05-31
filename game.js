import {Global,canvas} from "./js/global.js"
import StartPage from "./js/Page/startPage.js"
import GamePlayPage from "./js/Page/gamePlayPage.js"

// 设置游戏BGM
// var bgm = wx.createInnerAudioContext();
// bgm.src = Global.srcPath.bgm;
// bgm.loop = true;
// bgm.autoplay = true;

// 开始初始化界面
new StartPage()
// new GamePlayPage()
