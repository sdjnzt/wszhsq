# 部署配置信息

## 🏗️ 项目配置

### 仓库信息
- **仓库名**: `wszhsq`
- **用户名**: `sdjnzt`
- **GitHub Pages URL**: `https://sdjnzt.github.io/wszhsq/`

### 构建配置
- **构建工具**: Vite
- **输出目录**: `dist/`
- **Base路径**: `/wszhsq/`
- **路由模式**: HashRouter

## 📋 部署检查清单

### ✅ 已完成的配置
- [x] Vite base 配置设置为 `/wszhsq/`
- [x] 使用 HashRouter 路由模式
- [x] GitHub Actions 工作流配置
- [x] 用户上下文和登录功能
- [x] 响应式布局和样式

### 🔄 需要执行的步骤
1. **推送代码到GitHub**
   ```bash
   git add .
   git commit -m "配置适配wszhsq仓库"
   git push origin main
   ```

2. **启用GitHub Pages**
   - 进入仓库 Settings → Pages
   - Source 选择 GitHub Actions

3. **等待自动部署**
   - 查看 Actions 标签页
   - 确认部署成功

## 🌐 访问路径

### 部署后的访问地址
- **根路径**: `https://sdjnzt.github.io/wszhsq/`
- **登录页面**: `https://sdjnzt.github.io/wszhsq/#/login`
- **主页面**: `https://sdjnzt.github.io/wszhsq/#/dashboard`

### 本地开发地址
- **开发服务器**: `http://localhost:5173/`
- **构建预览**: `http://localhost:4173/`

## ⚠️ 注意事项

1. **Base路径**: 确保所有静态资源路径都基于 `/wszhsq/`
2. **路由兼容**: HashRouter 确保在GitHub Pages上正常工作
3. **构建输出**: 构建后的文件会正确包含base路径
4. **环境变量**: 生产环境使用正确的base路径

## 🐛 故障排除

### 如果部署后页面空白
1. 检查 `vite.config.ts` 中的 `base: '/wszhsq/'`
2. 确认 GitHub Actions 构建成功
3. 查看浏览器控制台错误信息

### 如果资源加载失败
1. 检查网络请求路径是否包含 `/wszhsq/`
2. 确认构建输出目录结构正确
3. 验证 GitHub Pages 设置
