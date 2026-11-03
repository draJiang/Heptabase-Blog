# 使用 Heptabase 管理数字花园

在 Heptabase 中编辑笔记，通过本机 CLI 发布到 Vercel 私有 Blob。GitHub 只保存网站代码，网站运行时通过 `/api/notes` 获取当前发布内容。

## 首次配置

1. 使用 Node.js 22，运行 `npm ci --legacy-peer-deps`。
2. 启动 Heptabase 桌面应用，在 Settings → AI Features 开启 Local CLI Server 并安装 CLI。当前导出脚本支持 CLI 0.8.x。
3. 为需要公开的 note 添加标签 **public**。匹配完整标签名且严格区分大小写，`Public`、`public-test` 均不匹配。无需公开白板。
4. 在 Vercel 关联本 GitHub 仓库，生产分支设为 `jiang`，Node.js 设为 22.x。`src/config.js` 配置网站名称及导航卡片 ID。
5. 在同一个 Vercel 项目的 Storage 中创建 **Private Blob**，连接 Production、Development 环境。不要使用 Public Blob。
6. 在项目根目录运行 `vercel link`（已关联项目可跳过）和 `vercel env pull .env.local`，获取 `BLOB_READ_WRITE_TOKEN`。该文件被 Git 忽略，凭据不得添加 `REACT_APP_` 前缀。

## 发布笔记

在 `jiang` 分支运行：

```shell
npm run publish -- --dry-run
npm run publish
```

预览会读取并校验全部笔记，只输出数量、字节数和摘要，不写文件或上传。正式发布会替换私有 Blob 的 `heptabase/notes.json`。上传成功后，刷新网站即可读取新内容，无需 Git 提交或重新部署。

- 从 public 标签获取卡片，与 note 类型列表取交集，保留原始 ProseMirror 正文及创建/编辑时间。
- 多次出现的卡片按 ID 去重；不跟随引用发布未标记 public 的笔记。
- 取消 public 标签的笔记在下次成功发布后移除。已加载页面仍可能保留旧内容，需要刷新。
- 读取失败、标签不存在、发布集为空或导出期间标签/编辑时间发生变化时，停止发布并保留线上数据。
- 相同数据不重复上传；覆盖使用 ETag 防止并发写入。每次只保留一个固定路径快照，不创建正文历史文件。
- 当前快照最多 4 MB，为 Vercel Functions 响应大小上限留出余量。超过时会停止发布，需要先拆分 API。
- 凭据仅用于本机和 API 服务端。私有 Blob 的地址不可匿名直接读取，但 `/api/notes` 按网站用途公开返回已发布笔记。
- 图片和附件仍依赖正文中的可访问 URL；本脚本不导出本地附件，也不读取 Heptabase 数据库。

## 网站部署与本地开发

推送网站代码到 `jiang`，由现有 Vercel GitHub 集成自动构建部署。笔记内容不进入构建产物，不需要随代码推送。

```shell
npm run test:publish
npm run build
vercel dev
```

使用 `vercel dev` 同时运行前端和 `/api/notes`；仅运行 `npm start` 不会启动 Vercel API。首次运行网站前需要先完成一次 `npm run publish`。API 出错时显示加载错误，不回退到旧的仓库数据。

## 旧内容迁移

旧的远程 API 更新工作流已移除。`src/resources/data.json`、本地环境文件和构建目录不再由 Git 跟踪；笔记也不再持久保存到浏览器 localStorage，并会清除旧版本的笔记缓存。

停止跟踪不能删除旧提交中的正文。若需要减少历史暴露，必须单独重写所有包含该文件的 Git 分支和标签并强制推送，还应清理包含正文的旧 Vercel 部署。历史重写不在 Publish 脚本职责范围内。其他人的克隆、fork、缓存和下载无法收回。

## 自定义

- `src/config.js`：网站标题、Google Analytics、导航卡片、可选 Discord 聊天入口。
- `public/`：favicon、logo 等网站资源。
- 首页优先使用标题为 About 的已发布笔记，再使用配置中的首个页面，最后回退到一篇已发布笔记。

原项目使用 MIT License，见 LICENSE。
