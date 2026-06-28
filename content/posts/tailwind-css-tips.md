---
title: "Tailwind CSS 实战技巧"
slug: tailwind-css-tips
date: 2026-04-25
tags: ["css", "tailwind", "frontend"]
excerpt: "分享 10 个实用的 Tailwind CSS 技巧，让你的开发效率倍增。"
coverImage: ""
---

# Tailwind CSS 实战技巧

Tailwind CSS 是一个功能强大的原子化 CSS 框架。以下是我总结的 10 个实用技巧。

## 1. 使用 @apply 提取重复样式

```css
/* tailwind.config.ts */
@layer components {
  .btn-primary {
    @apply bg-blue-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors;
  }
}
```

## 2. 自定义颜色主题

```js
// tailwind.config.ts
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#3b82f6',
          secondary: '#10b981',
        },
      },
    },
  },
}
```

## 3. 响应式设计简写

```html
<!-- 自动应用不同屏幕尺寸的样式 -->
<div class="text-sm md:text-base lg:text-lg">
  响应式文本
</div>
```

## 4. 暗黑模式切换

```html
<!-- 使用 class 策略 -->
<html class="dark">
  <body class="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">
```

## 5. 自定义动画

```css
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}
```

## 6. 使用容器查询

```html
<div class="container [@container]:[font-size:clamp(1rem,5vw,2rem)]">
  响应式字体
</div>
```

## 7. 优化图片加载

```html
<Image 
  src="/image.jpg" 
  alt="描述"
  width={800}
  height={600}
  className="rounded-lg"
  priority // 优先加载
/>
```

## 8. 创建渐变背景

```html
<div class="bg-gradient-to-r from-blue-500 to-purple-600">
  渐变背景
</div>
```

## 9. 使用 CSS Grid

```html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <!-- 网格布局 -->
</div>
```

## 10. 自定义间距系统

```js
theme: {
  extend: {
    spacing: {
      '128': '32rem',
      '144': '36rem',
    },
  },
}
```

## 总结

掌握这些技巧可以显著提升你的开发效率和代码质量。Tailwind CSS 的灵活性使其成为现代前端开发的绝佳选择。
