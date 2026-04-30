# Welcome to the Blog System

> 一个使用 Next.js 15 构建的精美博客系统，采用苹果设计风格

## 🚀 技术栈

- **Next.js 15** (App Router) - 全栈框架
- **TypeScript** - 静态类型
- **Tailwind CSS** - 原子化 CSS
- **Contentlayer** - 内容层（类型安全）
- **MDX** - 支持交互式组件
- **Algolia** - 搜索引擎
- **Giscus** - 评论系统（基于 GitHub Discussions）
- **Vercel** - 部署平台

## 📋 安装步骤

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `.env.local.example` 到 `.env.local` 并填写你的 API 密钥：

```bash
cp .env.local.example .env.local
```

需要配置：
- Algolia 搜索（App ID, Search Key, Admin Key）
- Giscus 评论（Repo, Repo ID, Category ID）

### 3. 创建内容目录

```bash
mkdir -p content/posts
```

### 4. 开发服务器

```bash
npm run dev
```

访问 `http://localhost:3000` 即可。

## 📁 项目结构

```
/blog-system
├── app/                    # Next.js App Router
│   ├── posts/[slug]/
│   ├── tags/[tag]/
│   ├── search/
│   ├── archive/
│   └── ...
├── components/             # React 组件
├── content/posts/          # Markdown 博文
├── lib/                    # 工具函数
├── public/                 # 静态资源
├── contentlayer.config.ts  # Contentlayer 配置
├── tailwind.config.ts      # Tailwind CSS 配置
└── package.json
```

## 🎯 核心功能

### ✅ 必做功能
1. 博文展示（列表页、详情页）
2. Algolia 搜索（自动补全、高亮）
3. 标签分类（标签云、标签页）
4. 归档页面（按年月分类）
5. Giscus 评论系统
6. 响应式设计

### 🚫 延期功能
- 用户系统
- 文章收藏
- 暗黑模式
- 社交分享

## 🔧 开发命令

```bash
npm run dev         # 启动开发服务器
npm run build       # 构建生产版本
npm run start       # 启动生产服务器
npm run lint        # 运行 ESLint
```

## 📝 创建博文

在 `content/posts/` 目录下创建 Markdown 文件：

```markdown
---
title: "文章标题"
slug: article-slug
date: 2026-04-30
tags: ["标签1", "标签2"]
excerpt: "文章摘要"
coverImage: "/images/cover.jpg"
---

# 文章内容

使用 Markdown 或 MDX 编写...
```

## 🌐 部署

使用 Vercel 一键部署：

```bash
npm install -g vercel
vercel
```

## 📄 许可证

MIT
