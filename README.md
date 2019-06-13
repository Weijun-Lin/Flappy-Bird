# Wechat Mini Game Flappy-Bird

![](https://img.shields.io/badge/Powered%20By-Wechat-brightgreen.svg)
![](https://img.shields.io/badge/Author-Lin%20Weijun-blue.svg)
![](https://img.shields.io/badge/Author-Liu%20Zhifei-blue.svg)
[![](https://img.shields.io/badge/download-2M-brightgreen.svg)](https://github.com/Joke-Lin/Flappy-Bird/archive/master.zip)

## 项目概述

> 基于微信实现的经典小游戏 **Flappy-Bird**

**此项目逻辑设计，代码编写均独立完成**

### 项目结构

│  content.txt
│  game.js
│  game.json
│  LICENSE
│  project.config.json
│  README.md
│  
├─js
│  │  global.js             # 游戏全局布局 以及 全局数据区
│  │  instance.js           # 游戏中所有需要的类示例 以及 贯穿游戏的动画设置
│  │  
│  ├─Element                # 游戏元素类
│  │      background.js
│  │      bird.js
│  │      button.js
│  │      ground.js
│  │      pipe.js
│  │      scoreboard.js
│  │      
│  ├─Page                   # 游戏页面类 开始界面以及运行时界面
│  │      gamePlayPage.js
│  │      startPage.js
│  │      
│  └─Tool                   # 辅助函数
│          tool.js
│          
├─myOpenDataContext         # 关系链数据域（排行榜配置）
│  │  index.js
│  │  
│  └─src                    # 排行榜资源
│          close.jpg
│          lastPage.jpg
│          nextPage.jpg
│          title.jpg
│          
├─out                       # 代码行数统计
│      linecount.json
│      linecount.txt
│      
└─src                       # 游戏资源文件
    ├─Audio                 # 音频资源
    │      bgm.mp3
    │      hit.mp3
    │      point.mp3
    │      wing.mp3
    │      
    └─Image                 # 图片资源
        │  bg_day.png
        │  bg_night.png
        │  bird.png
        │  button_menu.png
        │  button_ok.png
        │  button_pause.png
        │  button_play.png
        │  button_restart.png
        │  button_resume.png
        │  button_score.png
        │  ground.png
        │  logo.png
        │  medals_1.png
        │  medals_2.png
        │  medals_3.png
        │  pipe_down.png
        │  pipe_up.png
        │  score.png
        │  scoreboard.png
        │  text_game_over.png
        │  text_ready.png
        │  tutorial.png
        │  
        └─Font              # 字体图片
                font_0.png
                font_1.png
                font_2.png
                font_3.png
                font_4.png
                font_5.png
                font_6.png
                font_7.png
                font_8.png
                font_9.png
                
