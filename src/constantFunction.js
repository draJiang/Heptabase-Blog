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

        let img_alt = content.substring(img_keyword_index+2,img_alt_end_inex)
        let img_src = content.substring(img_alt_end_inex+2,img_etc_index)

        console.log('image keyword');
        console.log(img_alt);
        console.log(img_src);

        let old_img_str = content.substring(img_keyword_index, img_end_inex+1)
        
        
        // 获取 = 索引
        let img_width_inex = old_img_str.indexOf('=')
        
        if(img_width_inex>-1){
            //将图片宽度保存到 alt 中
            img_alt = img_alt+'{{width '+old_img_str.substring(img_width_inex+1,old_img_str.length-2)+'}}'
        }
        
        let new_img_str = '!['+img_alt+']('+img_src+')'


        // console.log(old_img_str);
        // console.log(new_img_str);

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

        // console.log('card_keyword_index:');
        // console.log(card_keyword_index);
        // console.log('card_end_inex:');
        // console.log(card_end_inex);

        let old_card = content.substring(card_keyword_index, card_end_inex + 2)
        // {{card xxxx-xxx-xxxx}}
        let new_card = '{{未知卡片}}'

        // 检验一下的确是 card
        if (old_card.indexOf('card ') >= 0) {
            // console.log('old_card：');
            // console.log(old_card);

            // 根据 ID 匹配数据中是否存在此卡片

            for (let i = 0; i < cards.length; i++) {


                // 处理当前卡片信息
                if (old_card.indexOf(cards[i]['id']) >= 0) {
                    // 存在：设置卡片链接
                    new_card = '[' + cards[i]['title'] + ']' + '(' + '/post/' + cards[i]['id'] + ')'
                    break
                }



            }

            // console.log('new_card:');
            // console.log(new_card);

            content = content.replace(old_card, new_card)


            card_keyword_index = content.indexOf('{{', card_keyword_index + 1)

        } else {
            break
        }

    }


    // 获取 (./ 符号
    let custom_card_keyword_index = content.indexOf('(./')
    console.log(custom_card_keyword_index);
    while (custom_card_keyword_index != -1) {

        //获取卡片末尾的索引
        let custom_card_end_inex = content.indexOf(')', custom_card_keyword_index)

        if (custom_card_keyword_index == -1 || custom_card_end_inex == -1) {
            break
        }

        let custom_old_card = content.substring(custom_card_end_inex, custom_card_keyword_index + 1)
        // {{card xxxx-xxx-xxxx}}
        let custom_new_card = '/404/'

        // 根据 ID 匹配数据中是否存在此卡片

        for (let i = 0; i < cards.length; i++) {

            if (custom_old_card.indexOf(cards[i]['id']) >= 0) {
                // 存在：设置卡片链接
                custom_new_card = '/post/' + cards[i]['id'] + ')'

                break
            }

        }

        console.log('custom_new_card:');
        console.log(custom_new_card);

        content = content.replace(custom_old_card, custom_new_card)


        custom_card_keyword_index = content.indexOf('(./', card_keyword_index + 1)



    }


    // 处理反向连接
    // 如果 A 卡片中存在当前笔记的 ID，则 A 卡片为当前笔记的反向链接之一
    let backLinks = []
    for (let i = 0; i < cards.length; i++) {

        if (cards[i]['content'].indexOf(this_card_id) >= 0 && cards[i]['id'] != this_card_id) {
            console.log(this_card_id);
            // console.log(content);
            console.log(cards[i]['title']);
            backLinks.push(cards[i])
        }

    }

    card['content'] = content
    return { 'card': card, 'backLinks': backLinks }

}

const getHeptabaseData = new Promise((resolve, reject) => {

    console.log('getHeptabaseData');
    console.log(window.performance);
    console.log(performance);

    // 获取本地数据
    let heptabase_blog_data = localStorage.getItem("heptabase_blog_data")


    // 若本地存在数据则不重新获取
    if (heptabase_blog_data != undefined) {

        let createdTime = JSON.parse(heptabase_blog_data)['createdTime']
        console.log(Date.parse(new Date()) / 1000);
        console.log(createdTime);
        console.log(Date.parse(new Date()) / 1000 - createdTime);
        if (Date.parse(new Date()) / 1000 - createdTime >= 120) {
            // 数据比较旧时再重新获取
            // let heptabase_blog_data
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

            let pages = {}
            // 获取 About 页面的数据
            pages.about = undefined
            for (let i = 0; i < data.cards.length; i++) {
                console.log(data.cards[i]['title']);
                if (data.cards[i]['title'] == 'About') {
                    pages.about = data.cards[i]
                    break
                }
            }

            const local_data = { 'createdTime': Date.parse(new Date()) / 1000, 'data': data, 'pages': pages }
            // 存储数据到本地缓存
            localStorage.setItem("heptabase_blog_data", JSON.stringify(local_data))
            // console.log(this.state.posts);

            console.log('getHeptabaseData return');
            // return heptabase_blog_data
            resolve(local_data)
        })
        .catch(e => console.log('错误:', e))

    // jsonp
    // fetchJsonp('https://app.heptabase.com/api/whiteboard/?secret=d4cc3728297609add1a00aab108e90c4e57a1c378cfc2307c251745bf7d2a884')
    //     .then(function (response) {
    //         return response.json()
    //     }).then((json) => {
    //         console.log(json);
    //         //用到this需要注意指向，箭头函数

    //     }).catch(function (ex) {
    //     })



})


export { getHeptabaseData, getClearImag, getClearCard }