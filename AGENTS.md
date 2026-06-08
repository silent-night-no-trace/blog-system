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
│   ├── layout.tsx                # 根布局
│   └── page.tsx                  # 首页
├── components/
│   ├── ui/                       # UI 组件
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── badge.tsx
│   │   └── container.tsx
│   ├── layout/                   # 布局组件
│   │   ├── header.tsx
│   │   └── footer.tsx
│   └── comments/                 # 评论组件
│       └── giscus.tsx
├── content/posts/                # Markdown 文章
├── lib/                          # 工具函数
├── public/                       # 静态资源
└── content-collections.ts        # Content Collections 配置
```

## 🛠️ 技术栈

- **框架**: Next.js 16 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS 3.4.x
- **内容**: Content Collections
- **搜索**: Algolia (react-instantsearch)
- **评论**: Giscus
- **字体**: Geist (苹果风格)
- **主题**: next-themes (暗黑模式)

## 🚀 开发

```bash
npm run dev          # 启动开发服务器
npm run build        # 构建生产版本
npm run start        # 启动生产服务器
npm run lint         # 运行 ESLint
npm run generate:content # 生成内容集合
```

## 🔧 环境变量

参考 `.env.local.example` 配置：

- `NEXT_PUBLIC_ALGOLIA_APP_ID` - Algolia App ID
- `NEXT_PUBLIC_ALGOLIA_SEARCH_KEY` - Algolia 搜索密钥
- `ALGOLIA_ADMIN_KEY` - Algolia 管理密钥
- `NEXT_PUBLIC_ALGOLIA_INDEX_NAME` - 索引名称
- `NEXT_PUBLIC_GISCUS_REPO` - GitHub 仓库 (username/repo)
- `NEXT_PUBLIC_GISCUS_REPO_ID` - 仓库 ID
- `NEXT_PUBLIC_GISCUS_CATEGORY_ID` - 讨论分类 ID

## ✨ 功能特性

### 已完成
✅ 苹果风格 UI 组件库（按钮、卡片、徽章、容器）
✅ 博客基础布局（Header、Footer、响应式）
✅ 文章列表页（带标签、日期、阅读时间）
✅ 文章详情页（Markdown 渲染、上下篇导航）
✅ 标签系统（标签云、标签筛选）
✅ 归档页面（按年月分组的时间线）
✅ 响应式设计（移动端适配）
✅ Algolia 搜索（需要环境变量与索引同步）
✅ Giscus 评论（需要 GitHub Discussions 配置）

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

使用 Markdown 或 MDX 编写...
```

## 🎨 设计特点

- 圆角卡片（rounded-2xl）
- 柔和阴影（shadow-sm, hover:shadow-md）
- 毛玻璃效果（backdrop-blur）
- 苹果字体（Geist）
- 暗黑模式支持
- 平滑过渡动画
