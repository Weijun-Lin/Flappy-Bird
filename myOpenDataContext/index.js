// 开放数据域配置
// 排行榜设置区域

let canvas = wx.getSharedCanvas();
let ctx = sharedCanvas.getContext('2d');
// 保存好友信息
let records = [];
// 图片资源

function isInRecords(name) {
    for(var i = 0;i < records.length;i++) {
        if(records[i].name == name) {
            return i;
        }
    }
    return -1;
}

function loadImage(imagePath) {
    var Image = wx.createImage();
    Image.src = imagePath;
    return Image;
}

var Img = {
    lastButton: loadImage("myOpenDataContext/src/lastPage.jpg"),
    nextButton: loadImage("myOpenDataContext/src/nextPage.jpg"),
    title: loadImage("myOpenDataContext/src/title.jpg"),
    close: loadImage("myOpenDataContext/src/close.jpg"),
};

// 通过布局类（定义位置大小）展示图片
function drawImage(img, lay) {
    ctx.drawImage(img, lay.x, lay.y, lay.width, lay.height);
}

// 记录类
class Record {
    constructor(name, avatarUrl, score) {
        this.name = name;
        this.avatarUrl = avatarUrl;
        this.score = score;
        this.avatar = loadImage(this.avatarUrl);
    }

    drawToCanvas(y, rank) {
        // 设置字体 左对齐
        ctx.font = (String(Math.ceil(canvas.height / 32)) + 'px Arial');
        // 配置每一个元素的位置
        var textX = canvas.width / 12;
        var avatarWidth = canvas.height / 10;
        var avatarX = canvas.width * 0.2;
        var nameX = avatarX + avatarWidth + canvas.height / 32;
        var delt = (canvas.height / 7 - avatarWidth) / 2;
        var scoreX = canvas.width * 0.8;
        // 绘制背景
        ctx.fillStyle = '#dfd9cb';  // 背景颜色
        ctx.fillRect(0, y, canvas.width, canvas.height / 7);
        // 绘制排名
        ctx.fillStyle = '#000000';  // 字体为黑色
        ctx.fillText(String(rank), textX, y+canvas.height*0.5/7 + canvas.height * 0.5 / 32);
        // 绘制头像
        ctx.drawImage(this.avatar, avatarX, y + delt, avatarWidth, avatarWidth);
        ctx.fillText(this.name, nameX, y+canvas.height*0.5/7+canvas.height*0.5/32);
        // 绘制分数
        ctx.fillText(String(this.score), scoreX, y+canvas.height*0.5/7 + canvas.height * 0.5 / 32);
    }
}

// 其大小须在主域设置 所以需要等主域加载完配置
// 基础布局设置
var layout = undefined;
setLayout();
function setLayout() {
    layout = {
        titleBar: {
            width: canvas.width,
            height: canvas.height / 7,
            x: 0,
            y: 0
        },
        buttomBar: {
            width: canvas.width,
            height: canvas.height / 7,
            x: 0,
            y: canvas.height * 6 / 7,
        },
        // 相对于底部边框
        lastButton: {
            height: canvas.height / 7,
            width: canvas.height * 1.5 / 7,
            x: 0,
            y: canvas.height * 6 / 7,
        },
        nextButton: {
            height: canvas.height / 7,
            width: canvas.height * 1.5 / 7,
            x: canvas.width - canvas.height * 1.5 / 7,
            y: canvas.height * 6 / 7,
        },
        title: {
            width: canvas.width * 0.4,
            height: canvas.height / 7,
            x: canvas.width / 2 - canvas.width * 0.2,
            y: 0,
        },
        close: {
            height: canvas.height / 12,
            width: canvas.height / 12,
            x: canvas.width - canvas.height / 12 - (canvas.height / 7 - canvas.height / 12) / 2,
            y: (canvas.height / 7 - canvas.height / 12) / 2,
        }
    };
}

// 避免主域延时导致的画布大小尚未改变
setTimeout(setLayout, 500);

// 获取好友信息 （好友之中已经包括自己）
function getFriendInfo() {
    wx.getFriendCloudStorage({
        keyList: ['score'],
        success: res => {
            let data = res.data;
            for (var i = 0; i < data.length; i++) {
                var value = data[i].KVDataList.length == 0 ? -1 : Number(data[i].KVDataList[0].value);
                var index = isInRecords(data[i].nickname);
                if(index == -1) {
                    records.push(new Record(data[i].nickname, data[i].avatarUrl, value));
                } else {
                    records[index].score = value;
                }
            }
            // 按分值排序
            records.sort((a,b)=>{
                return b.score - a.score;
            })
            // console.log("getFriend",records);
        },
        fail: res => {
            console.log("getFriendInfo fail",res);
        }
    });
}

// 处理最高分
// 每个用户只保留最高分
// 接受主域发送过来的分数信息 设置用户后台分数
function setBestScore(userScore) {
    // getFriendInfo();    // 先获取分数列表
    wx.getUserInfo({
        openIdList: ['selfOpenId'],
        lang: 'zh_CN',
        // 调整最大分值
        success: res => {
            console.log(res);
            var nickname = res.data[0].nickName;
            var flag = true;
            for (var i = 0; i < records.length; i++) {
                if (records[i].name == nickname) {
                    flag = false;
                    records[i].score = Math.max(records[i].score, userScore);
                    console.log("score:",records[i].score);
                    // 设置用户后台数据
                    wx.setUserCloudStorage({
                        KVDataList: [{ key: 'score', value: String(records[i].score) }],
                        success: res => {
                            console.log("setBest",res);
                        },
                        fail: res => {
                            console.log(res);
                        }
                    });
                    break;
                }
            }
            if(flag) {
                wx.setUserCloudStorage({
                    KVDataList: [{ key: 'score', value: String(userScore) }],
                    success: res => {
                        console.log("setBest",res);
                    },
                    fail: res => {
                        console.log(res);
                    }
                });
                getFriendInfo();
            }
        }
    })
}

// 监听主域信息
wx.onMessage(data => {
    if(data.type == "setScore") {
        setBestScore(data.score);
    }
    if(data.type == "draw") {
        drawBg();
        drawRecord();
    } 
});

// 绘制函数区

// 背景
function drawBg() {
    // 背景框
    ctx.fillStyle = '#fff8e8';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // 按钮
    drawImage(Img.lastButton, layout.lastButton);
    drawImage(Img.nextButton, layout.nextButton);
    // 标题
    drawImage(Img.title, layout.title);
    // 关闭按钮
    drawImage(Img.close, layout.close);
}

// 绘制记录
function drawRecord() {
    var index  = 1;
    for(var i = 0;i < records.length;i++) {
        if(i >= 5){
            break;
        }
        // 如果玩家还没有玩 则跳过绘制
        if(records[i].score == -1) {
            continue;
        }
        records[i].drawToCanvas(canvas.height*(i+1)/7, index);
        index++;
    }
}

wx.setUserCloudStorage({
    KVDataList: [{ key: 'signIn', value: "" }],
    success: res => {
        console.log("signIn",res);
    },
    fail: res => {
        console.log(res);
    }
});

setInterval(getFriendInfo, 1000);