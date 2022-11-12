import { format } from 'date-fns'

// 数组按时间排序
const arrSort = (obj) => {
    console.log('arrSort');
    obj.sort((a, b) => {
        // 最后编辑时间
        let t1 = format(new Date(a.lastEditedTime), 'yyyyMMdd')
        let t2 = format(new Date(b.lastEditedTime), 'yyyyMMdd')

        return t2.getTime() - t1.getTime()
    })

    return obj

}

// 修复单个 md 文件中的 img
const getClearImag = (card) => {

    // 修改图片后缀，避免图片无法显示
    // 找到 ![]( 符号
    // 找到上述符号之后的第 1 个 jpg#/png#/gif# 符号
    // 找到上一个步骤后的第 1 个 ) 符号
    // 删除前面 2 步 index 中间的符号

    console.log('getClearImag');

    let content = card['content']

    // 支持的图片类型
    let img_type = ['.png', '.jpeg', '.jpg', '.gif']
    // 包含以下关键字则认为是图片
    let img_keyword_index = content.indexOf('![')

    while (img_keyword_index != -1) {


        // 获取下一个 ) 索引
        let img_end_inex = content.indexOf(')', img_keyword_index)

        // 获取下一个 ] 索引
        let img_alt_end_inex = content.indexOf(']', img_keyword_index)

        // 获取图片扩展名索引
        let img_etc_index
        for (let i = 0; i < img_type.length; i++) {
            img_etc_index = content.indexOf(img_type[i], img_keyword_index + 1)
            if (img_etc_index >= 0 && img_etc_index <= img_end_inex) {

                // 如果格式字符是这种格式 ![....jpg] 内，则跳过
                if (content.substring(img_etc_index + img_type[i].length, img_etc_index + img_type[i].length + 2) == '](') {
                    img_etc_index = content.indexOf(img_type[i], img_etc_index + 1)

                }

                img_etc_index += img_type[i].length
                break;


            }
        }

        if (img_keyword_index == -1 || img_end_inex == -1 || img_etc_index == -1) {
            break
        }

        let img_alt = content.substring(img_keyword_index + 2, img_alt_end_inex)
        let img_src = content.substring(img_alt_end_inex + 2, img_etc_index)

        console.log('image keyword');
        console.log(img_alt);
        console.log(img_src);

        let old_img_str = content.substring(img_keyword_index, img_end_inex + 1)


        // 获取 = 索引
        let img_width_inex = old_img_str.indexOf('=')

        if (img_width_inex > -1 && old_img_str.indexOf('{{width') < 0) {
            //将图片宽度保存到 alt 中
            img_alt = img_alt + '{{width ' + old_img_str.substring(img_width_inex + 1, old_img_str.length - 2) + '}}'
        }

        let new_img_str = '![' + img_alt + '](' + img_src + ')'

        content = content.replace(old_img_str, new_img_str)

        // 获取 ![ 索引
        img_keyword_index = content.indexOf('![', img_keyword_index + 1)


    }
    card['content'] = content
    return card

}

// 处理单个 md 文件中的超链接
const getClearCard = (card, cards) => {
    console.log('getClearCard');
    // 找到 (./ 符号以及之后的第 1 个 ，或找到 {{ 符号 }}) 符号，截取这 2 个 index 中间的字符串
    // 将上述字符串放在 card 数据中匹配
    // 如果找到匹配的卡片：修改上述字符串的地址为 /post/post.id
    let content = card['content']
    let this_card_id = card['id']


    // 获取 {{ 符号
    let card_keyword_index = content.indexOf('{{')

    while (card_keyword_index != -1) {

        //获取卡片末尾的索引
        let card_end_inex = content.indexOf('}}', card_keyword_index)

        if (card_keyword_index == -1 || card_end_inex == -1) {
            break
        }

        let old_card = content.substring(card_keyword_index, card_end_inex + 2)
        // {{card xxxx-xxx-xxxx}}
        let new_card = '<span class="unknown_card">' + '{{未知卡片}}' + '</span>'

        // 检验一下的确是 card
        if (old_card.indexOf('card ') >= 0) {

            // 根据 ID 匹配数据中是否存在此卡片

            for (let i = 0; i < cards.length; i++) {

                // 处理当前卡片信息
                if (old_card.indexOf(cards[i]['id']) >= 0) {
                    // 存在：设置卡片链接
                    // new_card = '[' + cards[i]['title'] + ']' + '(' + '/post/' + cards[i]['id'] + ')'

                    // path 参数用于点击时加载对应笔记的数据，只有 my_link 类可点击
                    new_card = '<span class="my_link" path=' + '/post/' + cards[i]['id'] + '>' + cards[i]['title'] + '</span>'
                    break
                }


            }

            content = content.replace(old_card, new_card)


        } else {

        }

        card_keyword_index = content.indexOf('{{', card_keyword_index + 1)

    }


    // 获取拥有别名的卡片
    let custom_card_keyword_index = content.indexOf('[')
    console.log(custom_card_keyword_index);
    while (custom_card_keyword_index != -1) {


        if (content[custom_card_keyword_index - 1] == '!') {
            // 如果是图片则忽略

        } else {

            // ](./ 符号
            let custom_card_name_end_inex = content.indexOf(']', custom_card_keyword_index)

            //获取卡片末尾的索引
            let custom_card_end_inex = content.indexOf(')', custom_card_keyword_index)

            let custom_old_card = content.substring(custom_card_keyword_index, custom_card_end_inex + 1)

            if (custom_old_card.indexOf(']') < 0 || content[custom_card_name_end_inex + 1] != '(') {



            } else {

                let custom_card_name = content.substring(custom_card_keyword_index + 1, custom_card_name_end_inex)
                let custom_card_url = content.substring(custom_card_name_end_inex, custom_card_end_inex)
                // [name](./url)

                if (custom_card_url.indexOf('./') < 0 || custom_card_url.indexOf('.md') < 0) {
                    // 如果不是 Heptabase 内部链接则忽略
                } else {
                    // 卡片默认跳转到 404 页面
                    let custom_new_card = '<a class="unknown_card" href=' + '/404/' + '>' + custom_card_name + '</a>'

                    // 根据 ID 匹配数据中是否存在此卡片

                    for (let i = 0; i < cards.length; i++) {

                        if (custom_old_card.indexOf(cards[i]['id']) >= 0) {
                            // 存在：设置卡片链接
                            custom_new_card = '<span class="my_link" path=' + '/post/' + cards[i]['id'] + '>' + custom_card_name + '</span>'

                            break
                        }

                    }

                    console.log('custom_new_card:');
                    console.log(custom_new_card);

                    content = content.replace(custom_old_card, custom_new_card)
                }

            }



        }

        custom_card_keyword_index = content.indexOf('[', custom_card_keyword_index + 1)

    }


    // 处理反向连接
    // 如果 A 卡片中存在当前笔记的 ID，则 A 卡片为当前笔记的反向链接之一
    let backLinks = []
    for (let i = 0; i < cards.length; i++) {

        if (cards[i]['content'].indexOf(this_card_id) >= 0 && cards[i]['id'] != this_card_id) {

            backLinks.push(cards[i])

        }

    }

    card['content'] = content
    return { 'card': card, 'backLinks': backLinks }

}

// 获取 Heptabase 的笔记数据
const getHeptabaseData = new Promise((resolve, reject) => {

    console.log('getHeptabaseData');

    // 获取本地数据
    let heptabase_blog_data = localStorage.getItem("heptabase_blog_data")


    // 若本地存在数据则不重新获取
    if (heptabase_blog_data != undefined) {

        let createdTime = JSON.parse(heptabase_blog_data)['createdTime']
        console.log(Date.parse(new Date()) / 1000);

        console.log(Date.parse(new Date()) / 1000 - createdTime);
        if (Date.parse(new Date()) / 1000 - createdTime >= 600) {
            // 数据比较旧时再重新获取
            console.log('数据比较旧');

        } else {
            console.log('从缓存获取数据');
            // return heptabase_blog_data
            resolve(JSON.parse(heptabase_blog_data))
            return
        }


    }

    console.log('heptabase_blog_data == undefined');

    const header = new Headers({ "Access-Control-Allow-Origin": "*" });

    // 接口地址
    const url = 'https://api.dabing.one/'
    // 获取 Heptabase 数据
    fetch(url, {
        method: "get",
        header: header
        // mode: 'no-cors'
    })
        .then(res => res.json())
        .then(data => {
            console.log(data)

            // 按照时间排序卡片
            data.cards = data.cards.sort((a, b) => {

                // 最近编辑时间
                return b.lastEditedTime < a.lastEditedTime ? -1 : 1

            })

            let pages = {}
            // 获取 About、Projects 页面的数据
            pages.about = undefined
            pages.projects = undefined

            for (let i = 0; i < data.cards.length; i++) {
                console.log(data.cards[i]['title']);

                // About
                if (data.cards[i]['title'] == 'About') {

                    pages.about = data.cards[i]

                }

                // Projects
                if (data.cards[i]['title'] == 'Projects') {
                    pages.projects = data.cards[i]

                }
            }

            // createdTime 记录数据获取的时间
            const local_data = { 'createdTime': Date.parse(new Date()) / 1000, 'data': data, 'pages': pages }
            // 存储数据到本地缓存
            localStorage.setItem("heptabase_blog_data", JSON.stringify(local_data))
            // console.log(this.state.posts);

            console.log('getHeptabaseData return');
            // return heptabase_blog_data
            resolve(local_data)
        })
        .catch(e => console.log('错误:', e))

})


export { getHeptabaseData, getClearImag, getClearCard }