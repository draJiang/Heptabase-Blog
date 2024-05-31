# 使用 Heptabase 管理数字花园

## 是什么

在 Heptabase 中编写笔记，自动同步到个人的数字花园中。

- [数字花园地址](https://notes.dabing.one/) 

- [原始白板地址](https://app.heptabase.com/w/d4cc3728297609add1a00aab108e90c4e57a1c378cfc2307c251745bf7d2a884)

- Heptabase CSS 预览

![](https://media.heptabase.com/v1/images/3120a828-7e72-4637-aaff-ff8b5d72a2b3/9fbf682c-71a2-4dd6-b915-056bc841b1e0/image.png)

目前支持的功能

- [x] 展示 Heptabase 的笔记内容

- [x] Heptabase 编辑笔记可一键更新到网站

- [x] 双向链接

- [x] 深浅色模式

- [x] 面包片导航交互（参考了 [Andyʼs working notes](https://notes.andymatuschak.org/Evergreen_notes)）

- [x] 文字高亮

- [x] 嵌入网易云音乐歌曲、专辑

- [x] 嵌入视频

## 使用方法

### Heptabase

1. 在 Heptabase 中创建一个白板，这个白板中的所有卡片都可以在数字花园中查看

2. 公开此白板

   ![](https://media.heptabase.com/v1/images/3120a828-7e72-4637-aaff-ff8b5d72a2b3/3a644a97-7a6a-4ef3-8ca5-a7a2b72c7d41/image.png)

3. 根据你的喜好在上述白板中创建一些卡片，例如 About 介绍自己、Projects 介绍自己参与的项目等等

### GitHub

1. Fork [项目](https://github.com/draJiang/Heptabase-Blog)

   ![](https://jiangzilong-image.oss-cn-beijing.aliyuncs.com/uPic/CleanShot2024-01-2920.55.33@2x20240129205602.png)

2. 在 `src/config.js` 中设置你的网站名称等信息

   ```javascript
   const CONFIG = {
       'ga': 'G-XXXXXX',     // 填写 Google Analytics 的 ID，不填也没问题
       'whiteboard_id': '',  // 填写白板 ID
       'title': '数字花园🌱',  // 站点标题
       'pages': {            // pages 里的标题和卡片 ID 可自定义
           'Articles': '2e0bbcb8-fdf7-4cdb-8ee2-9f0651b71550',
           'Projects': '2e0bbcb8-fdf7-4cdb-8ee2-9f0651b71550',
           'Activity': 'activity', // 站点活跃状态热力图
           'About': '2e0bbcb8-fdf7-4cdb-8ee2-9f0651b71550',
           'XXXXX':'xxxx-xxxx-xxx(Heptabase 卡片 ID)'
       }
       'server': '', // Discord 服务器 ID，非必填，填写后将在网站中显示聊天入口
       'channel': '' // Discord 频道 ID，非必填，填写后将在网站中显示聊天入口
   }
   ```

   `pages` 里配置 Heptabase 中的卡片 ID， 配置后会显示在网站的右上角，点击会打开对应的卡片：

   ![](https://media.heptabase.com/v1/images/3120a828-7e72-4637-aaff-ff8b5d72a2b3/ca5fc266-33e4-45f4-a504-d5addfeacae2/CleanShot2023-02-2323.34.27-2x.png)

   `pages` 的配置会影响你的网站首页，目前的规则是：网站会在你的白板中寻找名称为 About 的卡片（不区分大小写），如果不存在，则会将 pages 配置中第 1 个卡片作为**首页**。

3. 设置 GitHub Action

   编辑 `.github/workflows/main.yml` ，将 `https://api.dabing.one` 修改为 `https://api.dabing.one?whiteboard_id=your_whiteboard_id` 例如 `https://api.dabing.one?whiteboard_id=d4cc3728297609add1a00aab108e90c4e57a1c378cfc2307c251745bf7d2a884` 

   编辑完毕后保存，这一步是为了后续更新网站的内容。

   ![](https://jiangzilong-image.oss-cn-beijing.aliyuncs.com/uPic/CleanShot2024-05-3119.25.4920240531192617.png)

4. 自定义 LOGO
   
   在 `public` 目录下替换 `favicon.ico`、`apple-touch-icon.png` 、`logo.png` 文件

## Vercel

1. 在 [Vercel](https://vercel.com/) 中新建项目

2. 选择 GitHub 中对应的项目名称

   ![](https://jiangzilong-image.oss-cn-beijing.aliyuncs.com/uPic/CleanShot2024-01-2921.02.23@2x20240129210251.png)

3. 自定义域名

   在 Vercel 中打开项目，在 Settings 中设置自己的域名

   ![](https://jiangzilong-image.oss-cn-beijing.aliyuncs.com/uPic/CleanShot2024-01-3002.29.41@2x20240130023011.png)

## 更新内容

Heptabase 的白板更新后不会自动同步到网站中，需要手动进行更新，手动更新方法：

1. 在你的 GitHub 仓库中打开 Actions

2. 点击 Run workflow

3. 几分钟后网站的内容就会与 Heptabase 同步

![](https://jiangzilong-image.oss-cn-beijing.aliyuncs.com/uPic/CleanShot2024-05-3119.37.21@2x20240531193753.png)

## 常见问题

Q：为什么上传到 Hepta 中的图片无法在网站上显示

A：直接在 Heptabase 中上传的图片，目前无法显示，一个解决方案是先将图片传到自己的图床里再放到 Hepta 里。

## 一些小技巧

### 嵌入 HTML

Buy me a coffee

```html
{HTML}
<a href="https://www.buymeacoffee.com/jiangzilong"><img src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=&slug=jiangzilong&button_colour=FFDD00&font_colour=000000&font_family=Cookie&outline_colour=000000&coffee_colour=ffffff" /></a>
```

Producthunt

```html
{HTML}
<a href="https://www.producthunt.com/posts/share-your-knowledge?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-share&#0045;your&#0045;knowledge" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=395211&theme=neutral" alt="Share&#0032;your&#0032;knowledge - based&#0032;on&#0032;your&#0032;Heptabase&#0032;data | Product Hunt" style="width: 250px; height: 54px;" width="250" height="54" /></a>
```

Bandcamp

```html
{HTML}
<iframe style="border: 0; width: 100%; height: 120px;" src="https://bandcamp.com/EmbeddedPlayer/album=2906945127/size=large/bgcol=ffffff/linkcol=0687f5/tracklist=false/artwork=small/transparent=true/" seamless><a href="https://rhodadakar.bandcamp.com/album/as-tears-go-by">As Tears Go By by Rhoda Dakar</a></iframe>
```

上述样式在编辑器中是这个样子：

![](https://jiangzilong-image.oss-cn-beijing.aliyuncs.com/uPic/CleanShot2024-02-2205.09.49@2x20240222051016.png)

## 拉取远程更新

当此项目功能更新后你可以通过以下方式同步更新你的网站。

首先需要在终端中安装 git 以及安装 [VScode](https://code.visualstudio.com/download) 客户端。

### 将自己的项目克隆到本地

首先获取你自己的项目 URL

![](https://jiangzilong-image.oss-cn-beijing.aliyuncs.com/uPic/CleanShot2024-03-1000.14.04@2x20240310001520.png)

接下来在终端中操作

```shell
git clone "https://github.com/YOURNAME/Heptabase-Blog.git"
```

通过以下命令进入项目文件夹

```shell
cd Heptabase-Blog
```

![](https://jiangzilong-image.oss-cn-beijing.aliyuncs.com/uPic/CleanShot2024-03-1000.21.21@2x20240310002214.png)

### 将本地的仓库与上游仓库关联

通过在终端中输入以下命令建立关联

```shell
git remote add upstream https://github.com/draJiang/Heptabase-Blog.git
```

关联成功后，通过以下命令确认是否添加成功

```shell
git remote -v
```

![](https://jiangzilong-image.oss-cn-beijing.aliyuncs.com/uPic/CleanShot2024-03-1000.35.50@2x20240310003617.png)

用以下命令从你的上游仓库获取更新

```shell
git fetch upstream
```

获取更新成功后，终端可能不会提供任何提示，接着进行下一步：合并上游仓库的更新

```shell
git merge upstream/main
```

在合并的过程中可能系统会提示你**上游仓库和你的本地仓库存在冲突**，其实就是两个项目中存在差异，需要你手动选择应该如何处理这些冲突。

### 在 VSCode 中处理冲突

首先打开 VScode，然后打开本地的 Heptabase-Blog 文件夹

![](https://jiangzilong-image.oss-cn-beijing.aliyuncs.com/uPic/CleanShot2024-03-1000.41.16@2x20240310004135.png)

在左侧的文件列表中，你可能会看到一些红色的文件名称，意味着这些文件中存在冲突，你需要点击这些文件逐个解决冲突。

![](https://jiangzilong-image.oss-cn-beijing.aliyuncs.com/uPic/CleanShot2024-03-1000.42.24@2x20240310004251.png)

通常 `config.js` 、LOGO 等你需要自行自定义的内容，你可以选择「Accept Current Change」，其他则可以选择「Accept Incoming Change」

![](https://jiangzilong-image.oss-cn-beijing.aliyuncs.com/uPic/W5WefL20240310004635.png)

### 将本地项目推送到自己的 GitHub 仓库中

你已经解决了所有的冲突，现在可以将代码提交到你的 GitHub 仓库中，提交成功后 Vercel 会自动更新网站。

在终端中分别输入以下命令提交本次更新

```shell
git add .
```

```shell
git commit -m 'Conflicts resolved'
```

推送到 GitHub 仓库中

```shell
git push origin main
```

### 检查 Vercel 是否更新成功

现在，一切都已完成，不过还是要检查一下 Vercel 是否正常完成网站的更新。

打开你的 GitHub 项目主页，点击注释 1 位置的图标，注意，根据部署状态这里会分别显示以下几种情况：

- 🟡：正在部署

- ❌：部署失败

- ✅：部署成功

![](https://jiangzilong-image.oss-cn-beijing.aliyuncs.com/uPic/CleanShot2024-03-1000.55.42@2x20240310005608.png)

如果正在部署、部署失败，你可以点击注释 2 查看失败原因。

---

## 为什么不用其他方式

### 工具选择

尝试过 [HUGO](https://gohugo.io/) 和 [Notion](https://sspai.com/post/66678) 等方式、研究了 [obsidian publish](https://obsidian.md/publish)，也实践用 Notion 维护了一年的[博客](https://blog.dabing.one/)，但一直没有找到比较理想的方案。

一方面，笔记在 Heptabase 中，文章放到其他平台会导致双向链接失效。我在实践卡片笔记法，文章与笔记有高度的关联性，例如下面这篇文章中就存在多个卡片链接，但是这些链接在 Heptabase 以外的地方显示时就无法正常打卡笔记，所以不得不转为普通文本，这不但增加了工作量，也使得原本文章的脉络失效。

![](https://media.heptabase.com/v1/images/3120a828-7e72-4637-aaff-ff8b5d72a2b3/7fa14e75-12eb-4ff4-97bc-1b5f0582d7ae/image.png)

另一方面，笔记、文章数据在不同平台有多份副本，后续修改起来就要穿梭在不同平台中进行更新，维护成本高。

Heptabase 本身也支持公开笔记，但移动端的支持不太好，于是决定自己开发了一个。

### 博客 vs 数字花园

数字花园的理念与我正在使用的卡片笔记法、Heptabase 的设计哲学更加贴近，所以放弃了持续 1 年的博客，改用数字花园的方式维护自己的个人站点，下面会详细介绍一下原因。

## 对数字花园的理解

聊一下我对数字花园理解，以及如何将这些理解体现到网站的设计上。

### 知识的持续性

数字花园的内容是持续迭代的，我可以发布尚不成熟的想法（不一定要等到输出完整的文章）并且可以在发布后持续的修订。所以在笔记列表中，不是强调笔记的创建时间而是展示最近编辑时间，并将最近编辑的笔记展示在最前，方便阅读者理解笔记的活跃状态。

![](https://media.heptabase.com/v1/images/3120a828-7e72-4637-aaff-ff8b5d72a2b3/3a43cd07-74f1-4223-a696-2ac8cf82c590/image.png)

这和我运用的卡片笔记法理念一致，通过不断的积累、迭代卡片完成文章的输出，而不是一来就面对一张白纸一步到位完成创作。（写作不是从零开始）

### 思考的脉络

传统博客通常会按创建时间展示文章列表供用户阅读，通过标签筛选某个类型的文章。而数字花园则强调思考的脉络，具体体现在以下几点

1. 弱化文章列表，用一个介绍页/索引页作为阅读者漫游的起点

2. 支持双向链接，阅读者可以看到与当前文章关联的其他知识、想法

3. 支持开头提到的[面包片导航](https://notes.andymatuschak.org/Evergreen_notes)的交互方式，阅读者可以快速地在不同笔记间流转

数字花园的首页与双向链接：

![](https://media.heptabase.com/v1/images/3120a828-7e72-4637-aaff-ff8b5d72a2b3/25b1dc56-b936-4afd-a3c6-eec9c58a47c9/image.png)

总的来说，使用持续迭代的、重在体现思考脉络的方式记录想法，最终也用同样的方式分享知识，这是我选择数字花园并开发此网站的原因。