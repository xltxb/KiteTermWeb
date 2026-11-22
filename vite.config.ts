import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// base 用相对路径:构建产物里的资源引用都相对 index.html,站点放在域名根路径
// (www.kiteterm.com)和子路径(xltxb.github.io/KiteTermWeb/)下都能正常加载。
// 自定义域名由仓库 Settings → Pages → Custom domain 决定,不靠 public/CNAME。
export default defineConfig({
  base: "./",
  plugins: [react(), tailwindcss()],
  build: {
    target: "es2022",
    sourcemap: false,
  },
});
