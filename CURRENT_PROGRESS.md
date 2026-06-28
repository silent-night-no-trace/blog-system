# 博客系统 - 当前进度报告

## 📅 日期
2026-06-27

## ✅ 已完成工作 (阶段 1-7 + 第二轮缺陷修复)

### 1. 核心功能
- ✅ UI 组件库
  - Button（变体: primary、ghost；尺寸: sm、md）
  - Card（默认变体 + CardContent）
  - Badge（变体: default、primary）
  - Header、Footer、GiscusComments
  - 已移除未使用的 `Container` 组件及 Button/Card/Badge 的未用变体
- ✅ 页面系统 (8个页面)
  - 首页、文章列表、文章详情
  - 标签云、标签详情、归档页、搜索页
- ✅ 内容管理 (3篇文章)
- ✅ 第三方服务 (Algolia + Giscus 已配置；Giscus 缺 env 时降级提示)
- ✅ Content Collections 内容生成
- ✅ next-themes + Tailwind class 暗黑模式
- ✅ Next.js 16.2.7 安全补丁与 Next 内部 PostCSS override
- ✅ 无用 MDX runtime 栈已移除
- ✅ SEO metadata、canonical、Open Graph、Twitter metadata
- ✅ `/sitemap.xml`、`/robots.txt`、`/rss.xml`
- ✅ RSS Feed 包含 Atom self link 和文章 `<category>`
- ✅ 可访问性增强：skip link、focus ring、reduced motion
- ✅ 本地封面图片白名单与示例封面
- ✅ 搜索状态增强：初始、loading、error、empty、结果数量
- ✅ Giscus 错误边界、中文说明和缺配置降级
- ✅ 文章卡片组件复用：`components/posts/post-card.tsx`
- ✅ 标签按规范化 slug 合并：`Next.js` 与 `nextjs` 归入 `/tags/nextjs`
- ✅ 内容校验：slug、日期、封面路径、tag slug
- ✅ Algolia 索引清洗正文并输出 `tagSlugs`
- ✅ 一键验证脚本：`npm run verify`（含 test）

### 2. 第二轮缺陷修复（2026-06-27）
- ✅ Markdown HTML 净化：引入 `rehype-sanitize`，sanitize → highlight 顺序，剥离 raw HTML/危险属性并保留 `hljs` 高亮 class
- ✅ 日期时区：`Post.date` 存为 date-only (`YYYY-MM-DD`)；新增 `lib/site.parsePostDate` 按分量构造；`getArchive` 改用之，跨时区不漂移
- ✅ 上一篇/下一篇改为按时间顺序（更早=上一篇、更新=下一篇）
- ✅ `normalizeTag` 支持日韩文：保留平假名/片假名/谚文，Hangul 经 NFKD/NFC 重组
- ✅ 死代码清理：删除 `components/ui/container.tsx`
- ✅ UI 变体精简：Button/Card/Badge 仅保留实际使用的变体
- ✅ 单元测试：引入 vitest；抽取 `lib/reading-time.ts`、`lib/search-content.ts`；`getArchive` 支持入参；22 个用例
- ✅ Header 移动端 hamburger 菜单（客户端组件，aria-expanded/controls、resize 自动收起）
- ✅ 打包器统一：`dev` 改为 `next dev`（Turbopack），与 build 一致

### 3. 服务器状态
```
✓ Server: http://localhost:3000
✓ Content Collections: 3 documents generated
✓ Environment: .env.local loaded
✓ npm audit --omit=dev: 0 vulnerabilities
✓ Production build: 22 static pages generated
✓ vitest: 22 tests passed
✓ RSS: /rss.xml generated
✓ Verify: npm run verify passed
```

### 4. 功能清单
✅ 首页
✅ 文章列表
✅ 文章详情
✅ 标签系统
✅ 归档页面
✅ 搜索功能
✅ 评论系统
✅ 响应式设计（含移动端导航菜单）
✅ 暗黑模式
✅ 安全审计通过（含 Markdown HTML 净化）
✅ SEO / sitemap / robots / RSS
✅ 内容校验脚本
✅ 单元测试
✅ 一键验证脚本

## 📝 下一步
1. 添加更多文章内容
2. 部署到 Vercel
3. 可选：新增 GitHub Actions，在 PR/push 上运行 `npm ci` 和 `npm run verify`
4. 后续 Next 官方修复内部 PostCSS 依赖后，评估是否移除 npm override

## ✅ 最新验证

最近一次完整验证命令：

```bash
npm run verify
```

验证链路包含：

- `npm run validate:content`
- `npm run lint`
- `npm run typecheck`
- `npm run test`
- `npm run build`
- `npm run sync:algolia -- --dry-run`

结果：通过。vitest 22 个用例通过，生产构建生成 22 个静态页面，Algolia dry-run 输出 3 条记录，搜索正文总计 968 chars。

## ⚠️ 已知环境限制

- LSP 工具不可用：本机缺少 `typescript-language-server` / `biome`。
- 已用 `npm run verify` 覆盖内容校验、lint、TypeScript、生产构建和 Algolia dry-run。

## 🎉 项目状态: 已完成！
