# 花与爱丽丝

一个中文为主的 WONI × MINAMI 视觉相册项目。

网站名“花与爱丽丝”与电影《花与爱丽丝》没有关联，也不代表 RESCENE、WONI、MINAMI 或所属公司。

## 技术栈

- React
- Vite
- TypeScript
- React Router
- CSS Variables
- IntersectionObserver、Web Audio API、localStorage

## 本地运行

```bash
npm install
npm run dev
```

打开 `http://localhost:5173`。

生产构建：

```bash
npm run build
npm run preview
```

## 主要组件

- `AssetImage`：统一图片比例、懒加载、fallback
- `Lightbox`：图片预览、键盘方向键、Esc、移动端滑动
- `RandomMomentButton`：随机翻一页
- `FilmStrip`：横向胶片条
- `MemoryStack`：可翻开的照片堆
- `BgmPlayer`：用户主动开启的自生成环境音
- `BookmarkButton`：localStorage 收藏
- `MessageWall`：localStorage 本地纸条
- `PageTransition` / `Reveal` / `ImageReveal` / `HoverImage`：页面与照片动画
- `ScrollProgress` / `BackToTop`：翻阅进度与返回顶部
- `CustomCursor`：桌面端轻量 VIEW 光标

## 替换图片

图片路径统一管理在：

```text
src/lib/media.ts
```

推荐目录：

```text
public/images/hero/
public/images/woni/
public/images/minami/
public/images/duo/
public/images/moments/
```

正式图片推荐使用 `.webp` 或 `.avif`，替换后修改 `src/lib/media.ts` 中的路径即可。

当前 SVG 都是原创占位素材，不包含真实偶像照片或电影素材。

## 添加新的 Moment

1. 将照片加入 `public/images/moments/`。
2. 在 `src/lib/media.ts` 注册路径。
3. 在 `src/data/moments.ts` 添加记录。

Moment 记录至少应包含：

```text
id / number / title / date / year / category
image / description / notes
source / credit / alt / tags / status
```

当前示例数据均标记为 `demo`，不会把虚构事件当成真实资料。

## 音乐与本地数据

BGM 使用浏览器 Web Audio API 即时生成，不会自动播放，也不使用电影原声或未授权音乐。后续如需替换，可在 `public/audio/` 放入有授权的音频并修改 `src/components/BgmPlayer/BgmPlayer.tsx`。

书签和“写给她们的一句话”只保存在当前浏览器的 localStorage，没有后端持久化。

## 部署到 Vercel

1. 推送项目到 GitHub。
2. 在 Vercel 导入仓库。
3. Framework Preset 选择 `Vite`。
4. Build Command 使用 `npm run build`。
5. Output Directory 使用 `dist`。
6. `vercel.json` 已包含 SPA 路由重写。

正式域名上线后，更新 `index.html`、`public/robots.txt`、`public/sitemap.xml` 和 `src/data/site.ts` 中的占位域名。

## 内容边界

- 不收录私人信息或泄露内容。
- 不编造日期、原话、互动或私人关系。
- 不直接使用电影海报、剧照、原声或受版权保护的字体。
- 来源与版权字段必须持续维护。

## Third-party credits

The Moments page includes a React/TypeScript adaptation of the infinite tiling, wrapping and layered movement logic from **Infinite Layers Grid** by Jorge Toloza / Codrops. The original project is MIT licensed. Full notice: `THIRD_PARTY_NOTICES.md`.
