import {Music} from "./js/global"
import StartPage from "./js/Page/startPage"

// 设置游戏BGM
function BGM() {
    Music.bgm.loop = true;
    Music.bgm.autoplay = true;
}

BGM();
// 切换至前台
wx.onShow(BGM);

// 开始初始化界面
new StartPage()