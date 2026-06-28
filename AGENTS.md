<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Blog System Development

Next.js 16 博客系统 - 苹果设计风格

## 📁 项目结构

```
blog-system/
├── app/                    # Next.js App Router
│   ├── posts/
│   │   ├── page.tsx              # 文章列表
│   │   └── [slug]/
│   │       └── page.tsx          # 文章详情
│   ├── tags/
│   │   ├── page.tsx              # 标签云
│   │   └── [tag]/
│   │       └── page.tsx          # 标签详情
│   ├── archive/
│   │   └── page.tsx              # 归档页面
│   ├── search/
│   │   └── page.tsx              # 搜索页面
│   ├── providers.tsx             # next-themes 客户端 Provider
│   ├── layout.tsx                # 根布局
│   └── page.tsx                  # 首页
├── components/
│   ├── ui/                       # UI 组件
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── badge.tsx
│   ├── layout/                   # 布局组件
│   │   ├── header.tsx            # 客户端组件，含移动端 hamburger 菜单
│   │   └── footer.tsx
│   └── comments/                 # 评论组件
│       └── giscus.tsx
├── content/posts/                # Markdown 文章
├── lib/                          # 工具函数
│   ├── posts.ts                  # 内容 facade：排序、标签规范化、归档
│   ├── site.ts                   # 站点配置、parsePostDate、日期格式化
│   ├── reading-time.ts           # 阅读时间估算（CJK 感知）
│   └── search-content.ts         # Algolia 正文清洗与截断
├── lib/*.test.ts                 # vitest 单元测试
├── public/                       # 静态资源
├── vitest.config.ts              # vitest 配置（alias: content-collections, @）
└── content-collections.ts        # Content Collections 配置
```

## 🛠️ 技术栈

- **框架**: Next.js 16.2.7 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS 3.4.x
- **内容**: Content Collections
- **搜索**: Algolia (react-instantsearch)
- **评论**: Giscus
- **字体**: Geist (苹果风格)
- **主题**: next-themes + Tailwind `darkMode: 'class'`
- **测试**: Vitest（纯函数单元测试）
- **Markdown 渲染**: remark-gfm + rehype-sanitize + rehype-highlight

## 🧭 当前架构状态

- 内容管线是 Content Collections；不要重新引入 Contentlayer / `next-contentlayer`。
- Markdown 会在生成阶段通过 `remark` / `rehype` 编译为 HTML；当前不使用 Next MDX runtime。HTML 经 `rehype-sanitize` 净化（顺序：sanitize → highlight），剥离 raw HTML 与危险属性，`hljs` 高亮 class 在净化之后追加因此保留。
- 日期以 date-only (`YYYY-MM-DD`) 存储在 `Post.date`。显示与归档分组必须通过 `lib/site.ts` 的 `parsePostDate`（按 year/month/day 分量构造 `Date`），不要用 `new Date(post.date)`——date-only ISO 会被当作 UTC 午夜，跨时区会漂移到前一天。
- `normalizeTag` 保留 ASCII 与中日韩 CJK（含平假名/片假名/谚文）；Hangul 经 NFKD 分解后用 NFC 重组回首节。新增标签语种不要收窄这个范围。
- `app/providers.tsx` 提供 `next-themes` 的 `ThemeProvider`，Tailwind 使用 class 模式暗黑主题。
- `components/layout/header.tsx` 是客户端组件，窄屏显示 hamburger 菜单；不要改回无状态的纯服务端组件。
- Giscus public env 缺失时必须降级显示提示，不要用非空断言强行渲染。
- 纯函数（`normalizeTag`、`getArchive`、`getReadingTime`、`cleanSearchContent`）有 vitest 单测覆盖；改动它们时跑 `npm run test`。`getArchive` 接受可选 `posts` 入参以便用合成数据测试。
- `next` / `eslint-config-next` 固定为 `16.2.7`。`package.json` 中的 `overrides.next.postcss = 8.5.15` 用于修复 Next 内部 PostCSS audit advisory；该 override 只影响 Next 内部依赖解析，不改变项目自己的 Tailwind/PostCSS 配置。后续 Next 官方修复后再评估是否移除。
- `dev` 与 `build` 均使用 Turbopack（`next dev` / `next build`），保持一致。

## 🚀 开发

```bash
npm run dev          # 启动开发服务器（Turbopack）
npm run build        # 构建生产版本（Turbopack）
npm run start        # 启动生产服务器
npm run lint         # 运行 ESLint
npm run typecheck    # TypeScript 类型检查
npm run test         # 运行 vitest 单元测试
npm run generate:content # 生成内容集合
npm run verify       # 一键验证：内容校验、lint、typecheck、test、build、Algolia dry-run
```

## 🔧 环境变量

参考 `.env.local.example` 配置：

- `NEXT_PUBLIC_ALGOLIA_APP_ID` - Algolia App ID
- `NEXT_PUBLIC_ALGOLIA_SEARCH_KEY` - Algolia 搜索密钥
- `ALGOLIA_ADMIN_KEY` - Algolia 管理密钥
- `NEXT_PUBLIC_ALGOLIA_INDEX_NAME` - 索引名称
- `NEXT_PUBLIC_GISCUS_REPO` - GitHub 仓库 (username/repo)
- `NEXT_PUBLIC_GISCUS_REPO_ID` - 仓库 ID
- `NEXT_PUBLIC_GISCUS_CATEGORY` - 讨论分类名称
- `NEXT_PUBLIC_GISCUS_CATEGORY_ID` - 讨论分类 ID

## ✨ 功能特性

### 已完成
✅ 苹果风格 UI 组件库（Button、Card、Badge；变体已精简至实际使用的子集）
✅ 博客基础布局（Header 含移动端 hamburger 菜单、Footer、响应式）
✅ 文章列表页（带标签、日期、阅读时间）
✅ 文章详情页（Markdown 渲染、上下篇按时间顺序导航）
✅ 标签系统（标签云、标签筛选；中日韩标签规范化）
✅ 归档页面（按年月分组的时间线）
✅ 响应式设计（移动端适配）
✅ Algolia 搜索（需要环境变量与索引同步）
✅ Giscus 评论（需要 GitHub Discussions 配置；缺 env 时显示降级提示）
✅ next-themes class 暗黑模式
✅ 纯函数单元测试（vitest）

## 📝 文章示例

在 `content/posts/` 目录创建 `.md` 文件：

```markdown
---
title: "文章标题"
slug: article-slug
date: 2026-05-07
tags: ["标签1", "标签2"]
excerpt: "文章摘要"
coverImage: ""
---

# 内容

使用 Markdown 编写。当前项目不使用 MDX runtime。
```

## 🎨 设计特点

- 圆角卡片（rounded-2xl）
- 柔和阴影（shadow-sm, hover:shadow-md）
- 毛玻璃效果（backdrop-blur）
- 苹果字体（Geist）
- 暗黑模式支持
- 平滑过渡动画
