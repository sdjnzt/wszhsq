# GitHub Pages 部署说明

## 🚀 部署步骤

### 1. 准备工作
- 确保项目已经推送到GitHub仓库
- 仓库必须是公开的（免费用户）或私有仓库（付费用户）

### 2. 启用GitHub Pages
1. 进入GitHub仓库页面
2. 点击 `Settings` 标签页
3. 在左侧菜单中找到 `Pages`
4. 在 `Source` 部分选择 `GitHub Actions`

### 3. 推送代码
```bash
git add .
git commit -m "准备部署到GitHub Pages"
git push origin main
```

### 4. 自动部署
- 推送代码后，GitHub Actions会自动运行
- 构建完成后会自动部署到GitHub Pages
- 可以在 `Actions` 标签页查看部署进度

## 📁 项目结构

```
wszhsq/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions配置
├── src/
│   ├── contexts/
│   │   └── UserContext.tsx     # 用户状态管理
│   ├── layouts/
│   │   ├── MainLayout.tsx      # 主布局
│   │   └── MainLayout.less     # 主布局样式
│   ├── pages/
│   │   ├── Login.tsx           # 登录页面
│   │   ├── Login.less          # 登录页面样式
│   │   └── ...                 # 其他页面
│   └── App.tsx                 # 应用主组件
├── package.json
└── vite.config.ts
```

## 🔧 路由配置

### 使用HashRouter
项目已配置为使用 `HashRouter`，适合GitHub Pages部署：

```tsx
// src/main.tsx
import { HashRouter } from 'react-router-dom'

<HashRouter>
  <App />
</HashRouter>
```

### 路由路径
- 登录页面：`/#/login`
- 主页面：`/#/dashboard`
- 其他页面：`/#/dashboard/[page]`

## 🌐 访问地址

部署成功后，可以通过以下地址访问：
```
https://[用户名].github.io/[仓库名]/
```

例如：
```
https://sdjnzt.github.io/wszhsq/
```

## ⚠️ 注意事项

### 1. 路由兼容性
- GitHub Pages不支持服务端路由
- 使用HashRouter确保路由正常工作
- 所有路由都以 `#/` 开头

### 2. 构建输出
- 构建输出目录：`dist/`
- 确保 `vite.config.ts` 中的 `base` 配置正确

### 3. 环境变量
- 生产环境的环境变量需要在构建时设置
- 敏感信息不要直接写在代码中

### 4. 性能优化
- 启用代码分割和懒加载
- 优化图片和静态资源
- 使用CDN加速（可选）

## 🐛 常见问题

### Q: 页面刷新后404错误
A: 这是GitHub Pages的常见问题，使用HashRouter可以解决

### Q: 部署后页面空白
A: 检查构建是否成功，查看浏览器控制台错误信息

### Q: 路由跳转不正常
A: 确保所有路由都使用相对路径，不要使用绝对路径

### Q: 样式文件加载失败
A: 检查CSS文件路径，确保构建后的路径正确

## 📞 技术支持

如果遇到部署问题，可以：
1. 检查GitHub Actions日志
2. 查看浏览器开发者工具
3. 确认仓库设置正确
4. 参考GitHub Pages官方文档
