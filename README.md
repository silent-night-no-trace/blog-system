# 博客系统 (Blog System)

> 一个使用 Next.js 16 构建的精美博客系统，采用苹果设计风格，支持 Markdown 内容、Algolia 搜索和 Giscus 评论。

![Next.js](https://img.shields.io/badge/Next.js-16.2.7-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38bdf8?logo=tailwind-css)
![License](https://img.shields.io/badge/License-MIT-green)

## 🚀 技术栈

| 类别 | 技术 | 版本 |
|------|------|------|
| 框架 | Next.js (App Router) | 16.2.7 |
| 语言 | TypeScript | 5.x |
| 样式 | Tailwind CSS | 3.4+ |
| 内容 | Content Collections | 0.15+ |
| 搜索 | Algolia | 5.52.0 |
| 评论 | Giscus | 3.1.0 |
| 主题 | next-themes | 0.4.6 |
| Markdown 渲染 | remark/rehype（含 rehype-sanitize 净化） | - |
| 字体 | Geist | - |
| 测试 | Vitest | - |
| 构建 | Next.js + Content Collections adapter（Turbopack） | - |

## 📋 快速开始

### 1. 克隆项目

```bash
git clone <your-repo-url>
cd blog-system
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

复制示例配置文件：

```bash
cp .env.local.example .env.local
```

编辑 `.env.local` 填写你的 API 密钥：

```env
# 站点地址（用于 canonical、Open Graph、sitemap、robots、RSS）
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Algolia 搜索
NEXT_PUBLIC_ALGOLIA_APP_ID=your_app_id
NEXT_PUBLIC_ALGOLIA_SEARCH_KEY=your_search_key
ALGOLIA_ADMIN_KEY=your_admin_key
NEXT_PUBLIC_ALGOLIA_INDEX_NAME=blog_posts

# Giscus 评论
NEXT_PUBLIC_GISCUS_REPO=your-username/your-repo
NEXT_PUBLIC_GISCUS_REPO_ID=your_repo_id
NEXT_PUBLIC_GISCUS_CATEGORY=Announcements
NEXT_PUBLIC_GISCUS_CATEGORY_ID=your_category_id
```

**获取 API 密钥**：

- **Algolia**: [注册账号](https://www.algolia.com/) → 创建应用 → 获取 App ID 和 API Keys
- **Giscus**: [配置指南](https://giscus.app/zh-CN) → 选择仓库 → 获取 Repo ID 和 Category ID

### 4. 运行开发服务器

```bash
npm run dev
```

访问 `http://localhost:3000` 即可。

## 📁 项目结构

```
blog-system/
├── app/                          # Next.js App Router
│   ├── posts/                    # 文章相关
│   │   ├── page.tsx             # 文章列表
│   │   └── [slug]/page.tsx      # 文章详情
│   ├── tags/                     # 标签相关
│   │   ├── page.tsx             # 标签云
│   │   └── [tag]/page.tsx       # 标签详情
│   ├── archive/                  # 归档页面
│   ├── search/                   # 搜索页面
│   ├── providers.tsx            # 客户端主题 Provider
│   ├── layout.tsx               # 根布局
│   └── page.tsx                 # 首页
├── components/                   # React 组件
│   ├── ui/                       # UI 组件
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── badge.tsx
│   ├── layout/                   # 布局组件
│   │   ├── header.tsx           # 客户端组件，含移动端 hamburger 菜单
│   │   └── footer.tsx
│   └── comments/                 # 评论组件
│       └── giscus.tsx
├── content/posts/                # Markdown 文章
├── lib/                          # 工具函数
│   ├── posts.ts                 # 内容 facade
│   ├── site.ts                  # 站点配置、parsePostDate、日期格式化
│   ├── reading-time.ts          # 阅读时间估算
│   └── search-content.ts        # Algolia 正文清洗
├── lib/*.test.ts                 # vitest 单元测试
├── public/                       # 静态资源
├── .env.local                    # 环境变量（不提交）
├── .env.local.example            # 环境变量示例
├── content-collections.ts        # Content Collections 配置
├── next.config.ts                # Next.js 配置
├── tailwind.config.ts            # Tailwind CSS 配置
├── vitest.config.ts              # vitest 配置
└── package.json
```

## 🎯 核心功能

### ✅ 已实现功能

1. **文章系统**
   - 📝 Markdown 文件通过 Content Collections 编译为 HTML，并经 `rehype-sanitize` 净化（剥离 raw HTML/危险属性，保留代码高亮）
   - 📅 按日期排序；日期以 date-only 存储，跨时区显示稳定
   - ⏱️ 阅读时间计算（CJK 感知）
   - 🔗 上下篇按时间顺序导航
   - 📰 RSS Feed：`/rss.xml`

2. **搜索系统**
   - 🔍 Algolia 全文搜索
   - 💡 实时搜索建议
   - 🎯 高亮搜索结果
   - 🏷️ 标签筛选

3. **标签系统**
   - 🏷️ 标签云展示
   - 📊 标签文章统计
   - 🔗 标签详情页
   - 🔁 标签会按规范化 slug 合并，例如 `Next.js` 与 `nextjs` 归入同一标签页；支持中日韩标签（含日文假名、韩文谚文）

4. **归档系统**
   - 📅 按年月分组
   - 📊 文章时间线
   - 🏷️ 标签展示

5. **评论系统**
   - 💬 Giscus 评论（基于 GitHub Discussions）
   - 🌓 跟随 `next-themes` 当前主题
   - 🛡️ 缺少 Giscus public env 时显示降级提示，不阻塞文章详情页
   - 🔄 实时互动

6. **UI/UX**
   - 🎨 苹果设计风格
   - 🌙 `next-themes` + Tailwind `darkMode: 'class'` 暗黑模式
   - 📱 响应式设计（Header 含移动端 hamburger 菜单）
   - 🎭 平滑动画
   - 🔍 毛玻璃效果

## 🔧 开发命令

```bash
# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm run start

# 运行 ESLint
npm run lint

# 运行 TypeScript 类型检查
npm run typecheck

# 运行单元测试
npm run test

# 显式生成内容集合（构建会自动生成）
npm run generate:content

# 校验文章内容、slug、日期、封面和标签 slug
npm run validate:content

# 同步文章到 Algolia
npm run sync:algolia

# 一键运行内容校验、ESLint、TypeScript、单元测试、生产构建和 Algolia dry-run
npm run verify
```

内容由 Content Collections 生成。`npm run dev` 与 `npm run build` 均使用 Turbopack。`npm run build` 会通过 Next adapter 自动生成内容；`npm run validate:content` 和 `npm run sync:algolia` 都会先运行 `npm run generate:content`，因此 clean checkout 也能校验内容并同步搜索索引。

Algolia 记录会同时保留原始 `tags` 和规范化后的 `tagSlugs`。展示和全文搜索使用原始标签；稳定筛选、去重和同义写法合并应优先使用 `tagSlugs`。

站点地址由 `NEXT_PUBLIC_SITE_URL` 控制，用于生成 canonical URL、Open Graph URL、`/sitemap.xml`、`/robots.txt` 和 `/rss.xml`。生产部署时请设置为真实域名，例如 `https://example.com`。

安全状态：当前 `next` 和 `eslint-config-next` 固定为 `16.2.7`。由于 `next@16.2.7` 内部仍精确依赖存在 audit advisory 的 `postcss@8.4.31`，项目在 `package.json` 中使用 scoped npm override 将 Next 内部 `postcss` 提升到 `8.5.15`；该 override 仅修复 Next 内部依赖解析，不改变项目自己的 Tailwind/PostCSS 配置。`npm audit --omit=dev --registry=https://registry.npmjs.org` 当前为 `0 vulnerabilities`。后续 Next 官方内置修复后，应重新评估并移除该 override。

## 📝 创建文章

在 `content/posts/` 目录下创建 `.md` 文件。当前项目不使用 Next MDX runtime；文章内容会由 Content Collections + `remark`/`rehype` 编译为 HTML，并经 `rehype-sanitize` 净化。

```markdown
---
title: "文章标题"
slug: article-slug
date: 2026-05-16
tags: ["标签1", "标签2"]
excerpt: "文章摘要，用于列表展示"
coverImage: "/images/cover.jpg"
---

# 文章内容

使用 Markdown 编写...

## 支持的语法

- ✅ 标题
- ✅ 代码块
- ✅ 列表
- ✅ 链接
- ✅ 表格
- ✅ 图片

## 代码示例

```typescript
function hello() {
  console.log('Hello World')
}
```
```

内容约定：

- `slug` 必须使用小写字母、数字和连字符，例如 `my-first-post`；构建时会拒绝重复 slug。
- `date` 必须是合法日期，且不能晚于构建当天。日期以 date-only (`YYYY-MM-DD`) 存储并显示，跨时区不会漂移。
- `coverImage` 可留空；若填写，必须使用 `/images/` 下的本地资源路径，例如 `/images/cover.jpg`。图片文件需放在 `public/images/`，避免构建出缺失封面。
- 标签展示会保留文章中的原始写法，但标签页 URL 会按规范化 slug 合并。比如 `Next.js` 与 `nextjs` 会共同指向 `/tags/nextjs`。支持中日韩标签（含日文假名、韩文谚文）。
- 文章 HTML 在生成阶段经 `rehype-sanitize` 净化：raw HTML（如 `<script>`）与危险属性（如 `onerror`）会被剥离，代码高亮 class 保留。因此不要在 Markdown 中依赖原始 HTML 标签输出。
- RSS Feed 位于 `/rss.xml`，会使用文章标题、摘要、发布时间和文章永久链接生成；feed 包含 `atom:link` self link，每篇文章会把标签写入 RSS `<category>`。

---

## 🚀 部署指南

### 🌐 Vercel 部署（推荐）

**1. 连接 GitHub 仓库**

- 访问 [Vercel](https://vercel.com/)
- 点击 "New Project"
- 选择你的 GitHub 仓库

**2. 配置环境变量**

在 Vercel Dashboard 中添加环境变量：

```
NEXT_PUBLIC_ALGOLIA_APP_ID=...
NEXT_PUBLIC_ALGOLIA_SEARCH_KEY=...
ALGOLIA_ADMIN_KEY=...
NEXT_PUBLIC_ALGOLIA_INDEX_NAME=blog_posts
NEXT_PUBLIC_GISCUS_REPO=...
NEXT_PUBLIC_GISCUS_REPO_ID=...
NEXT_PUBLIC_GISCUS_CATEGORY=Announcements
NEXT_PUBLIC_GISCUS_CATEGORY_ID=...
```

**3. 同步内容到 Algolia**

```bash
npm run sync:algolia
```

**4. 部署**

```bash
npm install -g vercel
vercel --prod
```

访问生成的 URL 即可。

---

### 🐳 Docker 部署

**1. 创建 Dockerfile**

```dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/.env.production ./.env.local

RUN npm ci --production

EXPOSE 3000

CMD ["npm", "start"]
```

**2. 构建镜像**

```bash
docker build -t blog-system .
```

**3. 运行容器**

```bash
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_ALGOLIA_APP_ID=... \
  -e NEXT_PUBLIC_ALGOLIA_SEARCH_KEY=... \
  -e ALGOLIA_ADMIN_KEY=... \
  -e NEXT_PUBLIC_ALGOLIA_INDEX_NAME=blog_posts \
  -e NEXT_PUBLIC_GISCUS_REPO=... \
  -e NEXT_PUBLIC_GISCUS_REPO_ID=... \
  -e NEXT_PUBLIC_GISCUS_CATEGORY=Announcements \
  -e NEXT_PUBLIC_GISCUS_CATEGORY_ID=... \
  blog-system
```

**4. 同步 Algolia 内容**

```bash
docker exec <container-id> npm run sync:algolia
```

---

### 🖥️ 传统服务器部署

**1. 安装 Node.js**

```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# CentOS/RHEL
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo yum install -y nodejs
```

**2. 上传项目**

```bash
# 使用 scp 或其他方式上传
scp -r ./blog-system user@your-server:/var/www/
```

**3. 安装依赖**

```bash
cd /var/www/blog-system
npm install
```

**4. 配置环境变量**

```bash
cp .env.local.example .env.local
nano .env.local
# 填写生产环境的 API 密钥
```

**5. 构建项目**

```bash
npm run build
```

**6. 同步到 Algolia**

```bash
npm run sync:algolia
```

**7. 使用 PM2 启动（推荐）**

```bash
# 安装 PM2
npm install -g pm2

# 启动应用
pm2 start npm --name "blog-system" -- start

pm2 start npm --name "blog-system" -- run start -- -H 0.0.0.0 -p 3001

# 设置开机自启
pm2 startup
pm2 save

# 查看状态
pm2 status

# 查看日志
pm2 logs blog-system


pm2 restart app_name
pm2 reload app_name
pm2 stop app_name
pm2 delete app_name

# 端口检测
# （不指定 tcp/udp）
lsof -i :3001 

netstat -tulnp | grep 3001
ss -tulnp | grep 3001


```

**8. 配置 Nginx**

创建 `/etc/nginx/sites-available/blog-system`：

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

启用配置：

```bash
sudo ln -s /etc/nginx/sites-available/blog-system /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

**9. 配置 HTTPS（可选）**

使用 Certbot：

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

### 🛠️ 常见部署问题

#### 1. Algolia 搜索不工作

**原因**: 环境变量未正确配置  
**解决**:
```bash
# 检查环境变量
echo $NEXT_PUBLIC_ALGOLIA_APP_ID

# 重新同步
npm run sync:algolia
```

#### 2. Giscus 评论不显示

**原因**: GitHub 仓库未启用 Discussions，或 `NEXT_PUBLIC_GISCUS_REPO` / `NEXT_PUBLIC_GISCUS_REPO_ID` / `NEXT_PUBLIC_GISCUS_CATEGORY_ID` 未配置。  
**解决**:
1. 访问 GitHub 仓库 Settings
2. 启用 Discussions 功能
3. 创建对应的 Category
4. 在环境变量中配置 `NEXT_PUBLIC_GISCUS_CATEGORY` 和 `NEXT_PUBLIC_GISCUS_CATEGORY_ID`

如果这些 public env 缺失，文章页会显示 Giscus 降级提示，不会导致页面崩溃。

#### 3. 构建失败

**原因**: Content Collections 生成失败  
**解决**:
```bash
# 清理缓存
rm -rf .next .content-collections node_modules
npm install
npm run build
```

#### 4. 端口被占用

**解决**:
```bash
# 修改端口（Next.js 默认 3000）
PORT=3001 npm start

# 或修改 package.json
"start": "next start -p 3001"
```

---

### 📊 性能优化建议

1. **启用 CDN**
   - 使用 Vercel/Cloudflare CDN
   - 配置静态资源缓存

2. **图片优化**
   - 使用 Next.js Image 组件
   - 压缩图片大小

3. **代码分割**
   - 已默认启用（Next.js App Router）

4. **启用 Gzip/Brotli 压缩**
   ```nginx
   # Nginx 配置
   gzip on;
   gzip_types text/plain text/css application/json application/javascript;
   ```

---

### 🔄 CI/CD 配置（GitHub Actions）

创建 `.github/workflows/deploy.yml`：

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

---

## 🎨 UI 组件文档

### Button

```tsx
<Button variant="primary" size="md">
  Click me
</Button>
```

**Variants**: `primary` | `ghost`
**Sizes**: `sm` | `md`

### Card

```tsx
<Card>
  <CardContent>
    Content here
  </CardContent>
</Card>
```

**Variants**: `default`（仅默认变体）

### Badge

```tsx
<Badge variant="primary">
  New
</Badge>
```

**Variants**: `default` | `primary`

---

## 📄 许可证

MIT License

Copyright (c) 2026 Blog System

Permission is hereby granted...

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

## 📧 联系方式

- 邮箱: your-email@example.com
- GitHub: [@your-username](https://github.com/your-username)
