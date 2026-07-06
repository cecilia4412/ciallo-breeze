<div align="center">

# Phoebe Chirp

一个有趣的菲比啾比飘动效果页面，点击屏幕会弹出表情包和动画效果。

[![GitHub stars](https://img.shields.io/github/stars/cecilia4412/phoebe-chirp.svg)](https://github.com/cecilia4412/phoebe-chirp/stargazers) [![GitHub forks](https://img.shields.io/github/forks/cecilia4412/phoebe-chirp.svg)](https://github.com/cecilia4412/phoebe-chirp/network) [![GitHub license](https://img.shields.io/github/license/cecilia4412/phoebe-chirp.svg)](https://github.com/cecilia4412/phoebe-chirp/blob/main/LICENSE)

</div>

## 🖼️ 效果预览

一个充满菲比表情包飘动的页面，点击屏幕会弹出随机表情包并播放音效。

## ✨ 功能特点

- 🎨 **表情包飘动**：菲比表情包从右到左无限循环滚动，大小随机
- 🎵 **点击音效**：点击屏幕随机播放菲比啾比音频文件
- ✨ **弹出动画**：点击时弹出随机表情包，带缩放和上浮效果，逐渐消失
- 📊 **计数器**：记录点击次数，显示"菲比入侵次数"
- 🎁 **彩蛋系统**：每点击10次触发菲比军团大入侵动画
- 🚀 **零依赖**：纯静态前端项目，无需安装任何依赖
- 📱 **响应式设计**：适配各种屏幕尺寸

## 🚀 快速开始

### 方式一：直接打开

直接在浏览器中打开 `index.html` 文件即可运行。

### 方式二：使用 HTTP 服务器

```bash
# 使用 Python 3
python -m http.server 3000

# 使用 Node.js
npx serve

# 使用 PHP
php -S localhost:3000
```

然后访问 `http://localhost:3000`

## 📁 项目结构

```
phoebe-chirp/
├── index.html                    # 页面入口
├── README.md                     # 项目说明
└── assets/
    ├── css/
    │   └── main.css              # 样式文件
    ├── js/
    │   └── main.js               # 核心交互逻辑
    ├── audio/
    │   └── placeholder.txt       # 音频文件占位说明
    └── images/
        └── *.jpg/*.gif           # 菲比表情包图片
```

## 🎵 自定义音频

如需添加菲比啾比语音，只需将音频文件放入 `assets/audio/` 目录：
- `phoebe_01.mp3`
- `phoebe_02.mp3`
- `phoebe_03.wav`

音频文件会被硬编码在 `playAudioFile` 函数中，点击时随机播放。

## 🎨 自定义表情包

在 `assets/images/` 目录中添加图片文件即可，支持的格式：
- `.jpg` / `.jpeg`
- `.png`
- `.gif`（支持动态图）
- `.webp`
- `.svg`

图片文件名需要在 `assets/js/main.js` 的 `CONFIG.IMAGES` 数组中配置。