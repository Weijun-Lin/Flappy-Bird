/*
@Attributes:
    canvas：子域画布
    ctx：子域绘图上下文
    records：好友信息数组
    page：当前页数 绘制排行榜时需要
    isInRecords：通过用户名判断是否在记录中
    loadImage：加载图片
    Img：子域图片资源
    drawImage：通过布局对象绘图
    Record：记录类 绘制一条记录
    layout：子域布局
    setLayout：更新布局（因为子域大小通过主域设置 有延迟 延迟设置）
    getFriendInfo：获取好友信息
    setBestScore：设置用户最高分
    drawBg：绘制背景
    drawRecord：绘制记录 5 条置顶
    nextPage：下一页
    lastPage：上一页

@Decription:
    排行榜设置 子域和主域的通讯
*/

let canvas = wx.getSharedCanvas();
let ctx = sharedCanvas.getContext('2d');

// 保存好友信息
let records = [];

// 排行榜页数
var page = 0; // 第一页为 0

// 判断是否在记录中 不在返回-1否则返回下标
function isInRecords(name) {
    for (var i = 0; i < records.length; i++) {
        if (records[i].name == name) {
            return i;
        }
    }
    return -1;
}

// 加载图片
function loadImage(imagePath) {
    var Image = wx.createImage();
    Image.src = imagePath;
    return Image;
}

// 图片资源
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
        ctx.fillStyle = '#dfd9cb'; // 背景颜色
        ctx.fillRect(0, y, canvas.width, canvas.height / 7);
        // 绘制排名
        ctx.fillStyle = '#000000'; // 字体为黑色
        ctx.fillText(String(rank), textX, y + canvas.height * 0.5 / 7 + canvas.height * 0.5 / 32);
        // 绘制头像
        ctx.drawImage(this.avatar, avatarX, y + delt, avatarWidth, avatarWidth);
        ctx.fillText(this.name, nameX, y + canvas.height * 0.5 / 7 + canvas.height * 0.5 / 32);
        // 绘制分数
        ctx.fillText(String(this.score), scoreX, y + canvas.height * 0.5 / 7 + canvas.height * 0.5 / 32);
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
                if (index == -1) {
                    records.push(new Record(data[i].nickname, data[i].avatarUrl, value));
                } else {
                    records[index].score = value;
                }
            }
            // 按分值排序
            records.sort((a, b) => {
                return b.score - a.score;
            })
        },
        fail: res => {
            console.log("getFriendInfo fail", res);
        }
    });
}

// 处理最高分
// 每个用户只保留最高分
// 接受主域发送过来的分数信息 设置用户后台分数
function setBestScore(userScore) {
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
                    console.log("score:", records[i].score);
                    // 设置用户后台数据
                    wx.setUserCloudStorage({
                        KVDataList: [{
                            key: 'score',
                            value: String(records[i].score)
                        }],
                        success: res => {
                            console.log("setBest", res);
                        },
                        fail: res => {
                            console.log(res);
                        }
                    });
                    break;
                }
            }
            if (flag) {
                wx.setUserCloudStorage({
                    KVDataList: [{
                        key: 'score',
                        value: String(userScore)
                    }],
                    success: res => {
                        console.log("setBest", res);
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
    if (data.type == "setScore") {
        setBestScore(data.score);
    }
    if (data.type == "draw") {
        drawBg();
        drawRecord();
    }
    if (data.type == "nextPage") {
        nextPage();
    }
    if (data.type == "lastPage") {
        lastPage();
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
// 绘制特定页数的5个数据
function drawRecord() {
    var num = 0;
    var begin = page * 5;
    for (var i = 0; i < records.length; i++) {
        // 如果玩家还没有玩 则跳过绘制
        if (records[i].score == -1) {
            continue;
        }
        if (num >= begin) {
            records[i].drawToCanvas(canvas.height * (num - begin + 1) / 7, num + 1);
        }
        num++;
        if (num == begin + 5) {
            break;
        }
    }
}

// 下一页
function nextPage() {
    var num = 0; // 总记录数
    for (var i = 0; i < records.length; i++) {
        if (records[i].score == -1) {
            continue;
        }
        num++;
    }
    var maxPage = parseInt(num / 5); // 最大页码数
    console.log("maxPage", maxPage);
    if (page < maxPage) {
        page++;
        console.log("nextPageOK");
    }
}

// 上一页
function lastPage() {
    if (page > 0) {
        page--;
    }
}

// 新用户开始先设置其云数据
wx.setUserCloudStorage({
    KVDataList: [{
        key: 'signIn',
        value: ""
    }],
    success: res => {
        console.log("signIn", res);
    },
    fail: res => {
        console.log(res);
    }
});

// 定期获取用户信息 防止更新延迟
setInterval(getFriendInfo, 2000);