import React from "react";
import CONFIG from "./config";
import { Button, Modal } from 'antd';

const { confirm } = Modal;

const getCardName = (cardId) => {

    const heptabase_blog_data = JSON.parse(localStorage.getItem('heptabase_blog_data'))
    const cards = heptabase_blog_data.data.cards
    for (let i = 0; i < cards.length; i++) {
        if (cards[i]['id'] === cardId) {
            return cards[i]
        }
    }

    return null

}

// fetch 错误时的反馈弹窗
const showConfirm = () => {
    confirm({
        title: 'Sorry,some ting erro😥',
        // icon: <ExclamationCircleFilled />,
        content: 'Please try refresh',
        okText: 'Refresh',
        onOk() {
            console.log('Refresh');
            window.location.replace(window.location.href)
        },
        onCancel() {
            console.log('Cancel');
        },
    });
};

// 计算指定时间与当前的时间差
const getLastEditedTime = (dateBegin) => {

    dateBegin = new Date(dateBegin)

    let dateEnd = new Date();

    // 时间差的毫秒数
    let dateDiff = dateEnd.getTime() - dateBegin.getTime()
    // 时间差的天数
    let dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000))

    // 计算除天数外剩余的毫秒数
    let leave1 = dateDiff % (24 * 3600 * 1000)
    // 小时数
    let hours = Math.floor(leave1 / (3600 * 1000))

    // 计算除小时剩余的分钟数
    let leave2 = leave1 % (3600 * 1000)
    // 分钟数
    let minutes = Math.floor(leave2 / (60 * 1000))

    //计算相差的秒数
    let leave3 = leave2 % (60 * 1000)
    let seconds = Math.round(leave3 / 1000)

    return { 'day': dayDiff, 'hours': hours, 'minutes': minutes, 'seconds': seconds }

}

// 处理网易云音乐
// 输入 markdown 格式的 URL，例如 [xxx](http:....)，返回网易云音乐的 iframe HTML
const setNeteaseMusic = (custom_old_card) => {
    // 判断类型是歌曲还是歌单
    let type = 2 //歌曲
    let height_1 = 52
    let height_2 = 32
    if (custom_old_card.indexOf('playlist') > -1 || custom_old_card.indexOf('album') > -1) {

        height_1 = 110
        height_2 = 90

        if (custom_old_card.indexOf('playlist') > -1) {
            type = 0 // 歌单
        }
        if (custom_old_card.indexOf('album') > -1) {
            type = 1 // 专辑
        }
    }

    // 获取歌曲 ID
    let music_id_reg = /[0-9]{4,14}/g
    let music_id_list = custom_old_card.match(music_id_reg)

    if (music_id_list !== [] && music_id_list !== null) {
        // 匹配到 ID
        let music_id = music_id_list[0]
        let netease_music_iframe = '<div class="music netease_music"><iframe frameborder="no" border="0" marginwidth="0" marginheight="0" height=' + height_1 + ' style="width: 100%; " src="//music.163.com/outchain/player?type=' + type + '&id=' + music_id + '&auto=0&height=' + height_2 + '"></iframe></div>'

        return netease_music_iframe

    } else {
        return undefined
    }

}

// 修复单个 md 文件中的 img
const getClearImag = (card) => {

    // 修改图片后缀，避免图片无法显示
    // 找到 ![]( 符号
    // 找到上述符号之后的第 1 个 jpg#/png#/gif# 符号
    // 找到上一个步骤后的第 1 个 ) 符号
    // 删除前面 2 步 index 中间的符号

    let content = card['content']

    // 支持的图片类型
    let img_type = ['.png', '.jpeg', '.jpg', '.gif']
    // 包含以下关键字则认为是图片
    let img_keyword_index = content.indexOf('![')

    while (img_keyword_index !== -1) {


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
                if (content.substring(img_etc_index + img_type[i].length, img_etc_index + img_type[i].length + 2) === '](') {
                    img_etc_index = content.indexOf(img_type[i], img_etc_index + 1)

                }

                img_etc_index += img_type[i].length
                break;


            }
        }

        if (img_keyword_index === -1 || img_end_inex === -1 || img_etc_index === -1) {
            break
        }

        let img_alt = content.substring(img_keyword_index + 2, img_alt_end_inex)
        let img_src = content.substring(img_alt_end_inex + 2, img_etc_index)

        // console.log('image keyword');
        // console.log(img_alt);
        // console.log(img_src);

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

    // // 找到 (./ 符号以及之后的第 1 个 ，或找到 {{ 符号 }}) 符号，截取这 2 个 index 中间的字符串
    // // 将上述字符串放在 card 数据中匹配
    // // 如果找到匹配的卡片：修改上述字符串的地址为 /post/post.id
    // let content = card['content']
    let this_card_id = card['id']

    // 处理反向连接
    // 如果 A 卡片中存在当前笔记的 ID，则 A 卡片为当前笔记的反向链接之一
    let backLinks = []
    for (let i = 0; i < cards.length; i++) {
        let content = cards[i]['content']
        if (typeof (content) !== 'string') {
            content = cards[i]['content'].innerHTML
        }

        if (content.indexOf(this_card_id) >= 0 && cards[i]['id'] !== this_card_id) {

            backLinks.push(cards[i])

        }


    }

    // card['content'] = content
    return { 'card': card, 'backLinks': backLinks }

}

// 获取 Heptabase 的笔记数据
const getHeptabaseData = new Promise((resolve, reject) => {

    console.log('getHeptabaseData');

    // 获取本地数据
    let heptabase_blog_data = localStorage.getItem("heptabase_blog_data")

    // 若本地存在数据则不重新获取
    if (heptabase_blog_data !== undefined && heptabase_blog_data !== null) {

        let frontGetTime = JSON.parse(heptabase_blog_data)['frontGetTime']
        console.log(Date.parse(new Date()) / 1000);
        console.log(frontGetTime);
        console.log(Date.parse(new Date()) / 1000 - frontGetTime);

        //Date.parse(new Date()) / 1000 - frontGetTime >= 1200 && frontGetTime !== undefined
        if (Date.parse(new Date()) / 1000 - frontGetTime >= 1200 || frontGetTime === undefined) {
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

    // 获取 Heptabase 数据
    fetch(CONFIG.api_url, {
        method: "get",
        header: header
        // mode: 'no-cors'
    })
        .then(res => res.json())
        .then(data => {
            console.log(data)

            // 按照时间排序卡片
            data.data.cards = data.data.cards.sort((a, b) => {

                // 最近编辑时间
                return b.lastEditedTime < a.lastEditedTime ? -1 : 1

            })

            let pages = {}
            // 获取 About、Projects 页面的数据
            pages.about = undefined
            pages.projects = undefined

            // 存储去重后的数组
            let new_cards = []
            // 存储卡片 ID，用户判断是否重复
            let cards_id = []

            for (let i = 0; i < data.data.cards.length; i++) {

                // About
                if (data.data.cards[i]['title'] === 'About') {

                    pages.about = data.data.cards[i]

                }

                // Projects
                if (data.data.cards[i]['title'] === 'Projects') {
                    pages.projects = data.data.cards[i]

                }

                // 去重
                if (cards_id.indexOf(data.data.cards[i]['id']) > -1) {
                    // 已存在此卡片，则忽略
                    // console.log(data.cards[i]);
                } else {

                    // 不存在此卡片

                    // 最近编辑的时间差
                    let timeDiff = getLastEditedTime(data.data.cards[i]['lastEditedTime'])
                    data.data.cards[i].lastEditedTimeDiff = ''
                    if (timeDiff['day'] > 0) {
                        data.data.cards[i].lastEditedTimeDiff = 'Edited ' + timeDiff['day'] + ' days ago'
                    } else if (timeDiff['hours'] > 0) {

                        data.data.cards[i].lastEditedTimeDiff = 'Edited ' + timeDiff['hours'] + ' hours ago'

                    } else if (timeDiff['minutes'] > 0) {

                        data.data.cards[i].lastEditedTimeDiff = 'Edited ' + timeDiff['minutes'] + ' minutes ago'

                    } else {

                        data.data.cards[i].lastEditedTimeDiff = 'Edited just'

                    }

                    new_cards.push(data.data.cards[i])
                    cards_id.push(data.data.cards[i]['id'])

                }

            }

            data.data.cards = new_cards
            data.frontGetTime = Date.parse(new Date()) / 1000
            data.pages = pages

            // 存储数据到本地缓存
            localStorage.setItem("heptabase_blog_data", JSON.stringify(data))
            // console.log(this.state.posts);

            console.log('getHeptabaseData return');
            // return heptabase_blog_data
            resolve(data)
        })
        .catch(e => {
            console.log('错误:', e)
            // 反馈错误
            showConfirm()
        })

})

/**
 * 
 * @param {Object} Hpeta_card_data Hepta 卡片数据
 * @returns 返回拼接后的 DOM 元素
 */
const heptaToMD = (Hpeta_card_data) => {

    // 如果对象已经是 DOM 则直接返回
    if (Hpeta_card_data['content'] instanceof HTMLElement) {
        return Hpeta_card_data['content']
    }

    let parent_card_id = Hpeta_card_data['id']
    let box = document.createElement('div')
    console.log(JSON.parse(Hpeta_card_data['content'])['content']);
    box = heptaContentTomd(JSON.parse(Hpeta_card_data['content'])['content'], box, parent_card_id)
    return box


}

/**
 * 
 * @param {list} content_list   block 列表
 * @param {string} parent_node   要添加子元素的父级 DOM 元素
 * @param {string} parent_card_id  当前卡片的 ID
 * @returns 返回拼接后的 md 字符串                    
 */
const heptaContentTomd = (content_list, parent_node, parent_card_id) => {

    let new_node
    let number_list_index = 1

    //遍历 content list
    for (let i = 0; i < content_list.length; i++) {

        // 根据 type 进行处理
        switch (content_list[i]['type']) {

            case 'heading':

                new_node = document.createElement('H' + content_list[i]['attrs']['level'])
                break

            case 'card':
                new_node = document.createElement('span')
                new_node.innerHTML = content_list[i]['attrs']['cardTitle']
                if (content_list[i]['attrs']['cardTitle'] === undefined) {
                    // 找不到卡片标题，根据卡片 ID 匹配标题
                    const card = getCardName(content_list[i]['attrs']['cardId'])

                    if (card) {
                        new_node.innerHTML = card.title
                    }

                }

                let bingo = false

                if (content_list[i]['attrs']['cardTitle'] === 'Invalid card') {
                    // 未知卡片
                    // 在数据中先找一下
                    let heptabase_blog_data = JSON.parse(localStorage.getItem("heptabase_blog_data"))

                    for (let k = 0; k < heptabase_blog_data.data.cards.length; k++) {
                        if (heptabase_blog_data.data.cards[k]['id'] === content_list[i]['attrs']['cardId']) {
                            new_node.innerHTML = heptabase_blog_data.data.cards[k]['title']
                            bingo = true
                            break
                        }
                    }

                    // if (bingo === true) {
                    //     new_node.classList.add('my_link')
                    //     new_node.classList.add('article_link')
                    //     new_node.setAttribute('path', '/post/' + content_list[i]['attrs']['cardId'])
                    //     new_node.setAttribute('parent_note_id', parent_card_id)
                    // } else {
                    //     new_node.classList.add('unknown_card')
                    // }


                }

                if (bingo === true || content_list[i]['attrs']['cardTitle'] !== 'Invalid card') {
                    new_node.classList.add('my_link')
                    new_node.classList.add('article_link')
                    new_node.setAttribute('path', '/post/' + content_list[i]['attrs']['cardId'])
                    new_node.setAttribute('parent_note_id', parent_card_id)
                } else {
                    new_node.classList.add('unknown_card')
                }







                break

            case 'whiteboard':
                new_node = document.createTextNode(content_list[i]['attrs']['whiteboardName'])
                break

            case 'image':
                new_node = document.createElement('img')
                new_node.setAttribute('src', content_list[i]['attrs']['src'])

                if (content_list[i]['attrs']['width'] !== null) {
                    new_node.setAttribute('style', 'width: ' + content_list[i]['attrs']['width']);
                }
                break

            case 'paragraph':
                // 如果父元素不是 task-list-item ，则创建 P 元素
                if (parent_node) {

                    if (parent_node['className'] !== 'task-list-item') {
                        new_node = document.createElement('p')
                    } else {
                        new_node = document.createElement('span')
                        new_node.setAttribute('style', 'margin-left:4px');
                    }

                }

                break

            case 'text':
                // 普通文本
                // 判断是否有行内样式，例如 strong、mark

                if ('marks' in content_list[i]) {

                    // 有行内样式
                    content_list[i]['marks'].forEach(mark => {

                        switch (mark['type']) {

                            // del-line
                            case 'strike':
                                new_node = document.createElement('del')
                                new_node.innerText = content_list[i]['text']
                                break

                            // inline-code
                            case 'code':
                                new_node = document.createElement('code')
                                new_node.innerText = content_list[i]['text']
                                break

                            // italic
                            case 'em':
                                new_node = document.createElement('em')
                                new_node.innerText = content_list[i]['text']
                                break

                            // strong
                            case 'strong':
                                new_node = document.createElement('strong')
                                new_node.innerText = content_list[i]['text']
                                break

                            case 'color':

                                new_node = document.createElement('span')

                                if (mark['attrs']['color']) {

                                    if (mark['attrs']['type'] === 'background') {
                                        // new_node.setAttribute('style', 'background-color: ' + mark['attrs']['color']);

                                        new_node.classList.add('highlight_bg')
                                    } else {
                                        // new_node.setAttribute('style', 'color: ' + mark['attrs']['color']);
                                        new_node.classList.add('highlight_color')
                                    }

                                }

                                new_node.innerText = content_list[i]['text']
                                break

                            case 'link':
                                // let link_title = mark['attrs']['title']
                                // if (link_title === null) {
                                //     link_title = mark['attrs']['href']
                                // }

                                if (mark['attrs']['data-internal-href'] !== null) {
                                    // 内部卡片链接
                                    new_node = document.createElement('span')
                                    new_node.innerHTML = content_list[i]['text']
                                    new_node.classList.add('my_link')
                                    new_node.classList.add('article_link')
                                    new_node.setAttribute('path', '/post/' + mark['attrs']['data-internal-href'].replace('meta://card/', ''))
                                    new_node.setAttribute('parent_note_id', parent_card_id)

                                } else {

                                    if (mark['attrs']['href'].indexOf('app.heptabase') > -1 && mark['attrs']['href'].indexOf('card/') > -1) {
                                        // Link to block
                                        // 获取 card ID
                                        let card_id_index_start = mark['attrs']['href'].indexOf('card/')
                                        let card_id_index_end = mark['attrs']['href'].indexOf('#')

                                        if (card_id_index_start > -1) {
                                            let card_id = mark['attrs']['href'].substring(card_id_index_start + 5, card_id_index_end > -1 ? card_id_index_end : mark['attrs']['href'].length)

                                            new_node = document.createElement('span')
                                            new_node.innerHTML = content_list[i]['text']
                                            new_node.classList.add('my_link')
                                            new_node.classList.add('article_link')
                                            new_node.setAttribute('path', '/post/' + card_id)
                                            new_node.setAttribute('parent_note_id', parent_card_id)

                                        } else {
                                            // 外链
                                            new_node = document.createElement('a')
                                            new_node.href = mark['attrs']['href']
                                            new_node.innerHTML = content_list[i]['text']
                                        }

                                    } else {
                                        // 外链
                                        new_node = document.createElement('a')
                                        new_node.href = mark['attrs']['href']
                                        new_node.innerHTML = content_list[i]['text']
                                    }




                                }

                                break
                            default:
                                break

                        }

                    });
                } else {
                    // 无行内样式
                    // new_node = document.createElement('span')
                    // new_node.innerText = new_node.innerText + content_list[i]['text']
                    new_node = document.createTextNode(content_list[i]['text'])
                }

                break

            case 'bullet_list_item':
                // List 容器
                const bulletListBox = document.createElement('div')
                bulletListBox.classList.add('listBox')

                // List 手柄
                const bulletHand = document.createElement('div')
                bulletHand.classList.add('listBullet')

                // List 内容
                new_node = document.createElement('div')

                bulletListBox.appendChild(bulletHand)
                bulletListBox.appendChild(new_node)

                parent_node.appendChild(bulletListBox)

                break

            case 'numbered_list_item':

                // 如果上一个节点不是 number_list 则此节点的 index 为 1，否则 index +=1
                if (i > 0) {
                    if (content_list[i - 1]['type'] !== 'numbered_list_item') {
                        number_list_index = 1
                    } else {
                        number_list_index += 1
                    }
                }

                // List 容器
                const numberListBox = document.createElement('div')
                numberListBox.classList.add('listBox')

                // List 手柄
                const numberHand = document.createElement('div')
                // numberHand.classList.add('listBullet')
                numberHand.classList.add('numberListBullet')
                numberHand.setAttribute('data-before', number_list_index + '.')
                console.log(i);
                // numberHand.attr('--before-content', beforeContent)

                // List 内容
                new_node = document.createElement('div')

                numberListBox.appendChild(numberHand)
                numberListBox.appendChild(new_node)

                parent_node.appendChild(numberListBox)

                break

            case 'todo_list_item':
                new_node = document.createElement('li')

                let task_input = document.createElement('input')
                task_input.type = 'checkbox'
                // task_input.checked = 'true'
                if (content_list[i]['attrs']['checked']) {
                    task_input.setAttribute("checked", content_list[i]['attrs']['checked']);
                }

                task_input.disabled = true

                new_node.classList.add('task-list-item')
                // new_node.setAttribute('style', 'margin: 16px 0');
                new_node.appendChild(task_input)
                break

            case 'ordered_list':
                new_node = document.createElement('ol')
                break

            case 'bullet_list':
                new_node = document.createElement('ul')
                break

            case 'toggle_list':
                new_node = document.createElement('ul')
                break

            case 'task_list':
                new_node = document.createElement('ul')
                new_node.classList.add('task-list')
                break

            case 'list_item':
                new_node = document.createElement('li')

                // 如果是 task
                if (parent_node.className.indexOf('task-list') > -1) {
                    let task_input = document.createElement('input')
                    task_input.type = 'checkbox'
                    // task_input.checked = 'true'
                    if (content_list[i]['attrs']['checked']) {
                        task_input.setAttribute("checked", content_list[i]['attrs']['checked']);
                    }

                    task_input.disabled = true

                    new_node.classList.add('task-list-item')
                    // new_node.setAttribute('style', 'margin: 16px 0');
                    new_node.appendChild(task_input)
                }
                break

            case 'horizontal_rule':
                new_node = document.createElement('hr')
                break

            case 'blockquote':
                new_node = document.createElement('blockquote')
                break

            case 'code_block':

                new_node = document.createElement('pre')
                new_node.classList.add('hljs')
                new_node.classList.add('language-' + content_list[i]['attrs']['params'])

                // new_node = React.createElement('SyntaxHighlighter')
                console.log(new_node);

                // <SyntaxHighlighter language="javascript" style={dark}>{codeString}</SyntaxHighlighter>
                break

            case 'table':
                new_node = document.createElement('table')
                break

            case 'table_row':
                new_node = document.createElement('tr')
                break

            case 'table_header':
                new_node = document.createElement('th')
                break

            case 'table_cell':
                new_node = document.createElement('td')
                break

            case 'video':
                new_node = document.createElement('video')
                new_node.src = content_list[i]['attrs']['url']
                break

            case 'math_inline':
                new_node = document.createElement('span')
                break

            default:
                break

        }



        if (new_node !== undefined && parent_node !== undefined) {

            try {
                if (content_list[i]['type'] === 'numbered_list_item' || content_list[i]['type'] === 'bullet_list_item') {
                    // parent_node.appendChild(new_node)
                } else {
                    parent_node.appendChild(new_node)
                }


            } catch (error) {
                console.log(parent_node);
            }

        } else {
            console.log(parent_node);
        }

        if (new_node === undefined) {
            console.log(new_node);
            // new_node = parent_node
        }

        if (parent_node === undefined) {
            console.log(parent_node);
            // new_node = parent_node
        }


        // 如果还有子 content
        if ('content' in content_list[i]) {

            heptaContentTomd(content_list[i]['content'], new_node, parent_card_id)

        }

    }



    return parent_node

}


export { getHeptabaseData, getClearImag, getClearCard, heptaToMD }