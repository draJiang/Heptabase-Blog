# 使用 Heptabase 管理数字花园

## 是什么

在 [Heptabase](https://heptabase.com/) 中编写笔记，自动同步到个人的数字花园中。

* [数字花园地址](https://notes.dabing.one/) 

* [原始白板地址](https://app.heptabase.com/w/d4cc3728297609add1a00aab108e90c4e57a1c378cfc2307c251745bf7d2a884)

![](https://media.heptabase.com/v1/images/3120a828-7e72-4637-aaff-ff8b5d72a2b3/9fbf682c-71a2-4dd6-b915-056bc841b1e0/image.png)目前支持的功能

* [x] 展示 Heptabase 的笔记内容

* [x] Heptabase 编辑笔记可一键更新到网站

* [x] 双向链接

* [x] 深浅色模式

* [x] 面包片导航交互（参考了 [Andyʼs working notes](https://notes.andymatuschak.org/Evergreen_notes)）

* [x] 文字高亮

* [ ] 嵌入网易云音乐歌曲、专辑

* [ ] 嵌入视频

## 使用方法

### Heptabase

1. 在 Heptabase 中创建一个白板，这个白板中的所有卡片都可以在数字花园中查看

2. 公开此白板

   ![](https://media.heptabase.com/v1/images/3120a828-7e72-4637-aaff-ff8b5d72a2b3/3a644a97-7a6a-4ef3-8ca5-a7a2b72c7d41/image.png)

3. 根据你的喜好在上述白板中创建一些卡片，例如 About 介绍自己、Projects 介绍自己参与的项目等等

### 前端

1. Fork [项目](https://github.com/draJiang/Heptabase-Blog)

2. 在项目文件夹下运行 `npm install`

3. 在 `config.js` 中设置你的 `api_url`（下面会介绍）

4. 设置 `pages`，分别设置**页面名称**和**页面 ID**

   页面名称将显示在网站导航栏中，点击将打开页面 ID 对应的卡片

   ![](https://media.heptabase.com/v1/images/3120a828-7e72-4637-aaff-ff8b5d72a2b3/ca5fc266-33e4-45f4-a504-d5addfeacae2/CleanShot2023-02-2323.34.27-2x.png)页面 ID 的获取方法：

   * 在目标卡片点击 Export as Markdown

     ![](https://media.heptabase.com/v1/images/3120a828-7e72-4637-aaff-ff8b5d72a2b3/7ff61492-f6ae-4a06-8395-f7d15db6211e/image.png)

   * Markdown 文件名中的就是此卡片的 ID

     ![](https://media.heptabase.com/v1/images/3120a828-7e72-4637-aaff-ff8b5d72a2b3/261a05fb-9ce8-43a9-9ed4-a70712340b20/image.png)

5. 将项目部署到 Vercel

### 后端

因为 Heptabase 还没有开放的 API，所以只能通过后端程序来避免前端直接请求数据带来的跨域问题。

1. Fork [后端项目](https://github.com/draJiang/heptabase-api)

2. 部署到 Vercel 上

3. 获取前面创建的公开白板 ID

   ![](https://jiangzilong-image.oss-cn-beijing.aliyuncs.com/uPic/hiKH8F20230319011002.png)


4. 将白板 ID 填入 `index.py` 中的 `HEPTABASE_WHITEBOARD_ID` 

5. 将 API URL 填入前端 `config.js` 中的 `api_url`


---


## 为什么不用其他方式

### 工具选择

尝试过 [HUGO](https://gohugo.io/) 和 [Notion](https://sspai.com/post/66678) 等方式、研究了 [obsidian publish](https://obsidian.md/publish)，也实践用 Notion 维护了一年的[博客](https://blog.dabing.one/)，但一直没有找到比较理想的方案。

一方面，笔记在 Heptabase 中，文章放到其他平台会导致双向链接失效。我在实践卡片笔记法，文章与笔记有高度的关联性，例如下面这篇文章中就存在多个卡片链接，但是这些链接在 Heptabase 以外的地方显示时就无法正常打卡笔记，所以不得不转为普通文本，这不但增加了工作量，也使得原本文章的脉络失效。

![](https://media.heptabase.com/v1/images/3120a828-7e72-4637-aaff-ff8b5d72a2b3/7fa14e75-12eb-4ff4-97bc-1b5f0582d7ae/image.png)另一方面，笔记、文章数据在不同平台有多份副本，后续修改起来就要穿梭在不同平台中进行更新，维护成本高。

Heptabase 本身也支持公开笔记，但移动端的支持不太好，于是决定自己开发了一个。

### 博客 vs 数字花园

数字花园的理念与我正在使用的卡片笔记法、Heptabase 的设计哲学更加贴近，所以放弃了持续 1 年的博客，改用数字花园的方式维护自己的个人站点，下面会详细介绍一下原因。

## 对数字花园的理解

聊一下我对数字花园理解，以及如何将这些理解体现到网站的设计上。

### 知识的持续性

数字花园的内容是持续迭代的，我可以发布尚不成熟的想法（不一定要等到输出完整的文章）并且可以在发布后持续的修订。所以在笔记列表中，不是强调笔记的创建时间而是展示最近编辑时间，并将最近编辑的笔记展示在最前，方便阅读者理解笔记的活跃状态。

![](https://media.heptabase.com/v1/images/3120a828-7e72-4637-aaff-ff8b5d72a2b3/3a43cd07-74f1-4223-a696-2ac8cf82c590/image.png)这和我运用的卡片笔记法理念一致，通过不断的积累、迭代卡片完成文章的输出，而不是一来就面对一张白纸一步到位完成创作。

### 思考的脉络

传统博客通常会按创建时间展示文章列表供用户阅读，通过标签筛选某个类型的文章。而数字花园则强调思考的脉络，具体体现在以下几点

1. 弱化文章列表，用一个介绍页/索引页作为阅读者漫游的起点

2. 支持双向链接，阅读者可以看到与当前文章关联的其他知识、想法

3. 支持开头提到的[面包片导航](https://notes.andymatuschak.org/Evergreen_notes)的交互方式，阅读者可以快速地在不同笔记间流转

数字花园的首页与双向链接：

![](https://media.heptabase.com/v1/images/3120a828-7e72-4637-aaff-ff8b5d72a2b3/25b1dc56-b936-4afd-a3c6-eec9c58a47c9/image.png)总的来说，使用持续迭代的、重在体现思考脉络的方式记录想法，最终也用同样的方式分享知识，这是我选择数字花园并开发此网站的原因。