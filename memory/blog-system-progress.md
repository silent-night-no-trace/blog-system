---
name: blog-system-progress
description: 博客系统项目当前进度
type: project
---

**当前状态**：阶段 1-7 优化已完成。当前实现是 Next.js 16.2.7 + Content Collections；不使用 Next MDX runtime；Markdown 由 Content Collections + remark/rehype 编译为 HTML。主题通过 next-themes + Tailwind `darkMode: 'class'` 接入。Giscus 缺 public env 时显示降级提示，运行时错误有边界兜底。

**安全状态**：`next` / `eslint-config-next` 固定为 `16.2.7`。`package.json` 使用 `overrides.next.postcss = 8.5.15` 修复 Next 内部 PostCSS audit advisory；该 override 只影响 Next 内部依赖解析，不改变项目自己的 Tailwind/PostCSS 配置。`npm audit --omit=dev --registry=https://registry.npmjs.org` 当前为 0 漏洞。后续 Next 官方内置修复后，应评估移除该 override。

**最新验证**：最近一次完整验证命令是 `npm run verify`，包含 `validate:content`、`lint`、`typecheck`、`build`、`sync:algolia -- --dry-run`。结果通过；生产构建生成 22 个静态页面；Algolia dry-run 准备 3 条记录，搜索正文总计 968 chars。

## 当前阶段 1-7 完成摘要

1. **SEO / metadata / sitemap / robots / 字体 / 客户端边界**：已完成。新增统一 `lib/site.ts`，补全全站 metadata、canonical、Open Graph、Twitter metadata、`/sitemap.xml` 和 `/robots.txt`；搜索页拆成 Server Page + Client Search。
2. **可访问性与交互质量**：已完成。补 skip link、focus ring、SearchBox title、reduced-motion，修复 Header 中 Link/Button 嵌套语义。
3. **内容呈现与图片优化**：已完成。新增本地示例封面 `public/images/welcome.svg`，文章详情使用 `next/image`，图片配置收敛到 `/images/**`。
4. **搜索与评论增强**：已完成。搜索页支持初始、loading、error、empty、结果数量状态；Giscus 有中文说明、错误边界和缺配置降级；Algolia 正文清洗/截断并输出 dry-run 指标。
5. **RSS、组件复用、标签规范化、内容校验、README**：已完成。新增 `/rss.xml`，抽 `components/posts/post-card.tsx`，标签按规范化 slug 合并，Content Collections 阶段校验 slug/date/coverImage。
6. **独立内容校验、Algolia tagSlugs、RSS Atom/category**：已完成。新增 `scripts/validate-content.ts` 和 `npm run validate:content`；Algolia records 增加 `tagSlugs` facet；RSS 增加 `atom:link` self link 和文章 `<category>`。
7. **一键验证**：已完成。新增 `npm run typecheck` 和 `npm run verify`；`verify` 串起内容校验、ESLint、TypeScript、生产构建和 Algolia dry-run。

## 当前可用命令

- `npm run dev`
- `npm run generate:content`
- `npm run validate:content`
- `npm run lint`
- `npm run typecheck`
- `npm run build`
- `npm run sync:algolia -- --dry-run`
- `npm run verify`

## 当前已知环境限制

- LSP 工具当前不可用：环境缺少 `typescript-language-server` / `biome`。
- 已用 `npm run verify` 覆盖主要质量门。

## 已完成的工作

> 历史记录：早期计划使用 Contentlayer/next-contentlayer；当前实现已迁移到 Content Collections。以下 Task 1 内容保留为项目历史，不代表当前依赖状态。

### Task 1: 项目初始化 ✅

#### 1.1 创建 Next.js 项目
- ✅ 使用 `npx create-next-app@latest` 创建 Next.js 15 项目
- ✅ 配置 TypeScript、Tailwind CSS、App Router
- ✅ 初始化 Git 仓库

#### 1.2 安装依赖
- ✅ 安装 Contentlayer (0.3.4)
- ✅ 安装 next-contentlayer
- ✅ 安装 MDX 相关依赖：remark, remark-gfm, rehype, rehype-highlight
- ✅ 安装 Algolia 相关：@algolia/client-search, algoliasearch
- ✅ 安装 Giscus：@giscus/react
- ✅ 安装 UI 组件：lucide-react
- ✅ 安装辅助工具：@tailwindcss/typography, tsx
- ⚠️ 使用 `--legacy-peer-deps` 避免 next-contentlayer 与 Next.js 16 的依赖冲突

#### 1.3 配置 Tailwind CSS
- ✅ 创建 `tailwind.config.ts`
- ✅ 配置字体家族（SF Pro Display, PingFang SC）
- ✅ 配置主色调（蓝色系）
- ✅ 添加 @tailwindcss/typography 插件

#### 1.4 配置 Contentlayer
- ✅ 创建 `contentlayer.config.ts`
- ✅ 定义 Post 文档类型（title, slug, date, tags, excerpt, coverImage）
- ✅ 添加计算字段（url, readingTime）
- ✅ 配置 remark-gfm 和 rehype-highlight 插件

#### 1.5 配置 Next.js
- ✅ 更新 `next.config.ts` 集成 Contentlayer
- ✅ 配置图片远程模式
- ✅ 更新 `tsconfig.json` 添加 Contentlayer 路径映射

#### 1.6 创建环境变量
- ✅ 创建 `.env.local.example` 模板文件
- ✅ 创建 `.env.local`（本地配置）
- ✅ 配置 Algolia 和 Giscus 环境变量占位符

#### 1.7 创建内容目录
- ✅ 创建 `content/posts/` 目录
- ✅ 创建 `content/images/` 目录
- ✅ 创建 `.gitkeep` 文件保留空目录

#### 1.8 创建示例博文
- ✅ 创建 `content/posts/welcome-to-my-blog.md`
- ✅ 包含基本元数据（title, slug, date, tags, excerpt）
- ✅ 包含 Markdown 示例内容

#### 1.9 创建工具脚本
- ✅ 创建 `scripts/sync-algolia.ts` 用于同步数据到 Algolia
- ✅ 添加 `npm run sync:algolia` 脚本到 package.json

#### 1.10 Git 提交
- ✅ 初始提交（commit: 915df7c）
- ✅ 提交消息：chore: 初始化 Next.js 15 博客项目

## 历史待办（已由当前实现取代）

> 以下清单来自早期初始化阶段，仅保留项目历史。当前实现已经完成对应的 App Router 页面、`lib/posts.ts` 内容 facade、Content Collections 生成、搜索、评论、归档和构建验证。

### Task 2: 创建内容目录和工具函数 ⏸️
- [ ] 创建 `src/lib/posts.ts` - 博文数据加载工具
- [ ] 创建 `src/lib/tags.ts` - 标签处理工具
- [ ] 验证 Contentlayer 生成类型

### Task 3: 首页开发
- [ ] 创建导航栏组件（Navbar.tsx）
- [ ] 创建页脚组件（Footer.tsx）
- [ ] 创建博文卡片组件（PostCard.tsx）
- [ ] 创建标签云组件（TagCloud.tsx）
- [ ] 实现首页（app/page.tsx）

### Task 4: 博文详情页
- [ ] 创建 MDX 渲染组件（MDXRenderer.tsx）
- [ ] 实现博文详情页（app/posts/[slug]/page.tsx）

### Task 5: 标签页
- [ ] 创建标签列表页（app/tags/page.tsx）
- [ ] 创建标签详情页（app/tags/[tag]/page.tsx）

### Task 6: 搜索功能
- [ ] 创建搜索工具函数（src/lib/search.ts）
- [ ] 创建搜索组件（src/components/Search.tsx）
- [ ] 实现搜索页面（app/search/page.tsx）

### Task 7: 评论系统
- [ ] 创建评论组件（src/components/Comment.tsx）

### Task 8: 归档页面
- [ ] 实现归档页面（app/archive/page.tsx）

### Task 9: 额外功能
- [ ] 创建 RSS 订阅（app/rss.xml/route.ts）
- [ ] 创建 Sitemap（app/sitemap.xml/route.ts）
- [ ] 创建 robots.txt（app/robots.txt/route.ts）

### Task 10: 部署配置
- [ ] 创建 Vercel 配置文件（vercel.json）
- [ ] 测试构建（npm run build）
- [ ] 部署到 Vercel

## 技术栈确认

- ✅ Next.js 16.2.7 (App Router)
- ✅ TypeScript - 版本 5
- ✅ Tailwind CSS - 版本 3.4.x
- ✅ Content Collections - 版本 0.15.x
- ✅ React - 版本 19.2.4
- ✅ Markdown HTML 生成 - remark-gfm, rehype-highlight
- ✅ Algolia - 已安装并通过 dry-run 验证
- ✅ Giscus - 已集成，需要 GitHub Discussions 配置；缺 public env 时显示降级提示
- ✅ next-themes - 已通过 class 模式接入暗黑主题

## 已知问题

1. **历史依赖冲突已移除**：`next-contentlayer@0.3.4` 只支持 Next 12/13，当前实现不再使用 `next-contentlayer`。

2. **历史 clean build 风险已移除**：Contentlayer 生成目录缺失会导致 `contentlayer/generated` 找不到；当前 Content Collections 通过 Next adapter 在 build 时生成内容。

3. **历史 MDX runtime 已移除**：当前项目不使用 `@next/mdx`、`@mdx-js/react`、`mdxRs` 或 `app/mdx-components.tsx`。

## 下一步

当前核心博客功能、Content Collections 迁移、安全补丁、暗黑模式链路、Giscus 降级、RSS、内容校验和一键验证均已完成。下一步是添加更多文章、部署到 Vercel；可选新增 GitHub Actions，在 PR/push 上运行 `npm ci` 和 `npm run verify`。后续 Next 官方内置修复内部 PostCSS 依赖后，应重新评估 npm override。
