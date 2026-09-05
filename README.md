# KiteTerm 官网

[KiteTerm](https://github.com/xltxb/KiteTerm) 的产品官网 —— 纯静态站点,无构建步骤。

## 结构

```
index.html            单页官网(中文):Hero / 功能 / AI 协助 / 安全 / 架构 / 快捷键 / 下载 / FAQ
assets/css/style.css  样式,沿用产品自身的 Vela Design System 令牌(深色为默认,支持浅色切换)
assets/js/main.js     主题切换、移动端菜单、复制代码、滚动显现、Hero 终端演示
assets/img/           品牌图标(取自 KiteTerm 仓库 desktop/src-tauri/icons/)
```

## 本地预览

```bash
python3 -m http.server 8080
# 打开 http://127.0.0.1:8080
```

## 部署

任意静态托管均可(GitHub Pages / Cloudflare Pages / Nginx),把仓库根目录作为站点根即可。

## 维护提示

- 版本号、下载说明位于 `index.html` 的 `#download` 区块;发布预编译包后请更新「尚未发布安装包」的提示并把按钮指向具体资产。
- 功能描述以 KiteTerm 仓库 README 的「功能对照(PRD F1–F10)」为准,产品有变更时同步更新。
