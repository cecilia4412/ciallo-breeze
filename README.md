<div align="center">

# Phoebe Chirp

一个有趣的菲比啾比表情包飘动效果页面，点击屏幕会弹出表情包和动画效果。

</div>

## ✨ 功能特点

- 🎨 **表情包飘动**：菲比表情包从右到左无限循环滚动，大小随机
- 🎵 **点击音效**：点击屏幕随机播放菲比啾比音频文件
- ✨ **弹出动画**：点击时弹出随机表情包，带缩放和上浮效果，逐渐消失
- 📊 **计数器**：记录点击次数，显示"菲比入侵次数"
- 🎁 **彩蛋系统**：每点击10次触发菲比军团大入侵动画
- 🚀 **零依赖**：纯静态前端项目，无需安装任何依赖
- 📱 **响应式设计**：适配各种屏幕尺寸

## 🚀 快速开始

### 使用 HTTP 服务器

由于前端使用动态加载图片列表，需要通过 HTTP 服务器运行：

```bash
# 使用 Python 3
python -m http.server 3000

# 使用 Node.js
npx serve

# 使用 PHP
php -S localhost:3000
```

然后访问 `http://localhost:3000`

## 📦 图片处理

### 重命名图片

将 `assets/images` 目录中的图片重命名为 `phoebe_xxx` 格式：

```bash
cd scripts
python rename_images.py
```

### 去背景处理

将 `assets/images` 中的图片去背景后保存到 `assets/images_nobg`：

```bash
cd scripts
python remove_images_background.py
```

**说明：**
- GIF 文件会直接复制，保持动图效果
- JPG/PNG 等格式会去除白色背景并转换为 PNG 格式