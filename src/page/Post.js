import React, { useState, useEffect } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';


import Container from '../components/Container'
import Nav from '../components/Nav';
import Footer from '../components/Footer'
import Loading from '../components/Loading'

import CONFIG from "../config";

import '../index.css'
import 'github-markdown-css'
import 'antd/dist/reset.css';

import { getHeptabaseData, getClearCard, getClearImag, heptaToMD, getWhiteboardIdFromUrl } from '../constantFunction'
import { id } from 'date-fns/locale';

import useHash from "../hooks/useHash";

import { Button, message, Tooltip } from 'antd';

import Clipboard from 'clipboard';

// 属性
let ACTIVE_NOTE = ''                                            // 焦点笔记 ID 例如 38d9247c-1b0b-47ca-a119-933af80d71c2
let CURRENT_URL = window.location.href                          // 当前 URL，用来判断 URL 有变化时触发相关事件
let windowWidth = window.innerWidth                             // 窗口宽度
let minWidth = 600                                              // 以此宽度为分界线需渲染不同界面
// 数据
let HEPTABASE_DATA                                              // hepta 数据
let HOME_DATA                                                   // 首页数据
let WHITEBOARD_ID

// 文章页面
<<<<<<< HEAD
class Post extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            cardList: [] // 当前页面的卡片列表
            , activeNote: 'null' // 记录当前焦点卡片 etc 3a433c0b-e2e1-4722......
            , status: { 'code': 200, 'msg': '' }
        };
    }
=======
function Post(props) {
    const [cardList, setCardList] = useState([]);
    const [activeNote, setActiveNote] = useState('null');

    let { param1 } = useParams();
    let location = useLocation();
    let navigate = useNavigate();


    // console.log('location.search');
    // console.log(location.search);

    // useEffect(() => {
    //     // 在此可以处理 param1 或者其他路径参数的变化
    //     console.log('useEffect param');
    //     console.log(param1);
    // }, [param1]);

    useEffect(() => {
        // 在此，你可以通过创建一个 URLSearchParams 对象来获取查询参数
        let searchParams = new URLSearchParams(location.search);

        let queryParamValue = searchParams.get('myQueryParam');
        // console.log('location.search========');
        // console.log(location.search);
        // console.log(location);

        // const url = window.location.href
        // const activeCardId = getUrlSearch(url)['active_str'].replace('active-note-id=', '')
        // 渲染 URL、数据
        
        if (HOME_DATA) {
            herfToData()
        }

        // handleHashChange(window.location.href, props['card'])

        // 在此可以处理查询参数 myQueryParam 的变化
    }, [location.search]);
>>>>>>> a66da76f... 修复导航 bug


    useEffect(() => {
        console.log('Post useEffect');

        // 复制到剪切板实例化
        const copy = new Clipboard('.copy-btn');
        copy.on('success', e => {
            // message.open({
            //     type: 'success',
            //     content: 'Link copied',
            // });

        });
        copy.on('error', function (e) {
            console.error('Action:', e.action);
            console.error('Trigger:', e.trigger);
        });

        WHITEBOARD_ID = getWhiteboardIdFromUrl(window.location.href)

        // 请求 hepta 数据 getHeptabaseData
        getHeptabaseData.then((res) => {

            if (res.code === 200) {
                let heptabase_blog_data = res.data

                // 将数据保存到全局变量中
                HEPTABASE_DATA = heptabase_blog_data
                HOME_DATA = res['pages']['about']

                if (HOME_DATA === undefined) {
                    this.setState({
                        status: { 'code': 4004, 'msg': 'There is no card with the title "About" in the whiteboard. Please set it up and try again.' }
                    })
                }

                // 设置网页标题为白板标题
                document.title = res['data']['whiteboards'][0]['name']

                // 渲染 URL、数据
                this.herfToData()
            } else {

            }

            this.setState({
                status: { 'code': res.code, 'msg': '' }
            })

<<<<<<< HEAD
=======
            // 渲染 URL、数据
            herfToData()
>>>>>>> a66da76f... 修复导航 bug

        })

        // 监听 notes 容器滚动
        if (document.getElementsByClassName('notes')[0] !== undefined) {

            document.getElementsByClassName('notes')[0].addEventListener('scroll', setCardMiniTitleAndStyle)
        }
    }, [])


    // 根据 card id 获取 card content
    const findContent = (id, heptabase_blog_data) => {
        if (heptabase_blog_data === '') {
            return
        }

        let new_card
        console.log('Post findContent for:');
        for (let i = 0; i < heptabase_blog_data.cards.length; i++) {

            if (heptabase_blog_data.cards[i]['id'] == id) {

                // // 处理内容中的图片
                // heptabase_blog_data.cards[i] = getClearImag(heptabase_blog_data.cards[i])

                // 处理反向链接
                new_card = getClearCard(heptabase_blog_data.cards[i], heptabase_blog_data.cards)
                // heptabase_blog_data.cards[i] = new_card['card']

                new_card['card']['content'] = heptaToMD(new_card['card'])

                return new_card

            }
        }

        return new_card

    }

    // getWhiteboardId = () => {

    //     const urlSearch = this.getUrlSearch(window.location.search)
    //     console.log(urlSearch);

    //     if (urlSearch.url_search_list[0].indexOf('whiteboard_id' > -1)) {
    //         return urlSearch.url_search_list[0].replace('whiteboard_id=', '')
    //     }

    //     return ''

    // }

    // 文章内链接、反向链接点击
    const handleLinkClick = (link_id, current_id = undefined, type = -1) => {
        console.log('post.js handleLinkClick');
        let bingo = false
        cardList.forEach(item => {

            if (link_id === item['card']['id']) {

                // 界面上已显示点击的卡片
                bingo = true

            }

        });

        // 已经显示此卡片则不更新 URL 和数据
        if (bingo || current_id === undefined || current_id === null) {


            if (ACTIVE_NOTE !== link_id) {

                // 修改 URL 中的焦点卡片
                setUrlActiveNote(link_id)

                // 记录焦点卡片
                ACTIVE_NOTE = link_id

                // 如果是小尺寸设备，需要更新 UI 显示焦点卡片
                if (windowWidth < minWidth) {

                    // setState({
                    //     activeNote: ACTIVE_NOTE
                    // })

                    setActiveNote(ACTIVE_NOTE)

                }

            }

            ScrollToActiveNote()

            return

        } else {

            // 打开新卡片

            // 先判断卡片是否存在
            let target_card = findContent(link_id, HEPTABASE_DATA)
            if (target_card === undefined) {
                // 卡片无效
                message.info('Invalid card');

            } else {
                let getUrlSearch_req = getUrlSearch(window.location.search)
                let url_search_list = getUrlSearch_req['url_search_list']

                let new_url_search = ''
                let current_page_index = -1
                for (let i = 0; i < url_search_list.length; i++) {

                    if (url_search_list[i] === '') {
                        continue
                    }

                    if (url_search_list[i].indexOf('whiteboard_id') >= 0) {
                        new_url_search += '?' + url_search_list[i]
                        continue
                    }

                    if (url_search_list[i] === current_id) {
                        // URL 参数 === current_id
                        current_page_index = i
                    } else {
                        // URL 参数 !== current_id
                    }

                    new_url_search += '&note-id=' + url_search_list[i]

                    //如果当前 id === current_id，则忽略后面的所有 ID
                    if (current_page_index > -1) {
                        break;
                    }
                }

                if (new_url_search == '') {
                    new_url_search += '?note-id=' + link_id
                } else {
                    new_url_search += '&note-id=' + link_id
                }


                new_url_search += '&active-note-id=' + link_id

                // 设置 URL
                // window.history.pushState({}, '', window.location.origin + '/post' + new_url_search)
                navigate('/post' + new_url_search)

                // 记录 URL
                CURRENT_URL = window.location.origin + '/post' + new_url_search

                // 删除 URL 中不存在的 Card
                resetCardList()
                // 根据 URL 获取 card 数据
                herfToData()
            }

        }

    }

    // 根据 herf 渲染界面上显示的数据
    const herfToData = () => {

        let locationSearch1 = ''
        let locationSearch2 = ''


        if (window.location.search.toLowerCase().indexOf('whiteboard_id') < 0) {

            locationSearch1 = 'post?whiteboard_id=' + CONFIG.whiteboardId

        }

        if (window.location.search.toLowerCase().indexOf('note-id') < 0) {

            // 找到首页卡片的 ID
            let main_id = HOME_DATA['id']
            // 设置 URL
            if (locationSearch1 === '' && window.location.search.toLowerCase().indexOf('whiteboard_id') < 0) {
                locationSearch2 = '?note-id=' + main_id
            } else {
                locationSearch2 = '&note-id=' + main_id
            }


        }

        if (locationSearch1 !== '' || locationSearch2 !== '') {
            // 设置 URL
            window.location.replace(window.location.href + locationSearch1 + locationSearch2)
        }



        // // 首页的情况
        // if (window.location.search.indexOf('note-id') < 0) {

        //     // 找到首页卡片的 ID
        //     let main_id = HOME_DATA['id']
        //     // 设置 URL
        //     window.location.replace(window.location.origin + '/post' + window.location.search + '&note-id=' + main_id)

        // }

        // 从 URL 中获取 note id，根据 id 获取卡片数据
        let card_list = []
        let getUrlSearch_req = getUrlSearch(window.location.search)
        let url_search_list = getUrlSearch_req['url_search_list']

        for (let i = 0; i < url_search_list.length; i++) {
            if (url_search_list[i] == '' || url_search_list[i].indexOf('whiteboard_id') >= 0) {
                continue
            }
            // 将数据保存到 card list 中
            card_list.push(findContent(url_search_list[i], HEPTABASE_DATA))

        }

        // 设置当前活跃的笔记（用户焦点）
        let activeNote
        if (getUrlSearch_req['active_str'] !== '') {
            activeNote = getUrlSearch_req['active_str'].replace('active-note-id=', '')
        } else {
            activeNote = card_list[card_list.length - 1]['card']['id']
        }

        // 根据 URL 渲染新的数据到界面上
        if (cardList !== card_list) {
            setCardList(card_list);
        }


        // 如果焦点发生变化
        if (ACTIVE_NOTE !== activeNote) {
            ACTIVE_NOTE = activeNote
            // 将最新的焦点设置到 URL 中
            setUrlActiveNote(ACTIVE_NOTE)
        }

    }

    // 当 URL 变化时（子组件 container 载入完毕后也会调用此方法）
    const handleHashChange = (url, cardId) => {

        // 如果 url 发生变化，则更新数据
        let old_url = getUrlSearch(CURRENT_URL)
        let new_url = getUrlSearch(url)
        console.log('new_url:');
        console.log(new_url);
        let old_url_1 = old_url['url_search_list'].join('-')
        let new_url_1 = new_url['url_search_list'].join('-')

        // 定位到焦点卡片
        if (new_url['active_str'].indexOf(cardId) > -1) {

            // 定位到焦点卡片
            ScrollToActiveNote()

        }

        // 数据发生变化（忽略焦点变化）
        console.log('new_url_1 !== old_url_1:');
        console.log(new_url_1 !== old_url_1);
        if (new_url_1 !== old_url_1) {

            // 将当前 URL 保存到 state 中
            CURRENT_URL = url

            if (CURRENT_URL !== '') {

                herfToData()

            }
        }

        // 焦点发生变化
        if (old_url['active_str'] !== new_url['active_str']) {

            // 将当前 URL 保存到 state 中
            CURRENT_URL = url

            if (CURRENT_URL !== '') {
                // 记录新焦点到 state 中
                ACTIVE_NOTE = new_url['active_str'].replace('active-note-id=', '')

                // 如果是小尺寸设备，需要更新 UI 显示焦点卡片
                if (windowWidth < minWidth && activeNote !== ACTIVE_NOTE) {

                    // setState({
                    //     activeNote: ACTIVE_NOTE
                    // })

                    setActiveNote(ACTIVE_NOTE)

                }

            }

        }

        // 删除 URL 中不存在的 Card
        resetCardList()

        // 设置卡片样式、小标题
        setCardMiniTitleAndStyle()

        // 增加分享按钮
        // addShareBtn()



    }

<<<<<<< HEAD
    // addShareBtn = () => {
    //     // 增加分享按钮
    //     // let btn = < button data-clipboard-text='这里是需要复制的文本123'
    //     //     className="copy-btn"
    //     //     type="button" > Copy</button >
    //     let share_btn = document.createElement('button')
    //     share_btn.classList.add('copy-btn')
    //     share_btn.setAttribute('data-clipboard-text', '这里是需要复制的文本1232323')
    //     share_btn.innerText = '🔗'
=======
    const addShareBtn = () => {
        // 增加分享按钮
        // let btn = < button data-clipboard-text='这里是需要复制的文本123'
        //     className="copy-btn"
        //     type="button" > Copy</button >
        let share_btn = document.createElement('button')
        share_btn.classList.add('copy-btn')
        share_btn.setAttribute('data-clipboard-text', '这里是需要复制的文本1232323')
        share_btn.innerText = '🔗'
>>>>>>> a66da76f... 修复导航 bug


    //     let notes = document.getElementsByClassName('note_article')

    //     this.getWhiteboardId()

    //     for (let i = 0; i < notes.length; i++) {
    //         if (notes[i].getElementsByClassName('copy-btn').length > 0) {
    //             // 已经有分享按钮，不用重复添加
    //             continue
    //         } else {
    //             console.log(notes);
    //             let note_link = window.location.origin + '/post?note-id=' + notes[i].parentElement.getAttribute('note_id')
    //             share_btn.setAttribute('data-clipboard-text', note_link)
    //             notes[i].appendChild(share_btn)
    //         }
    //     }


    // }

    // 删除 URL 中不存在的 Card
    const resetCardList = () => {
        let url = window.location.href
        //比对 url 和 cardList
        for (let i = 0; i < cardList.length; i++) {
            // url 中不存在此 card
            if (url.indexOf(cardList[i]['card']['id']) < 0) {

                // 删除 card
                cardList.splice(i, 1)
                setCardList(cardList)

            } else {
                // url 中存在此 card
                // continue
            }

        }

    }

    // 定位到焦点卡片
    const ScrollToActiveNote = () => {

        let note_list = document.getElementsByClassName('containerBox')
        for (let j = 0; j < note_list.length; j++) {
            let note = note_list[j]
            // 定位到当前用户关注的笔记
            if (note.getAttribute('note_id') === ACTIVE_NOTE) {

                if (windowWidth > minWidth) {
                    document.getElementsByClassName('notes')[0].scrollTo({ left: j * 650, behavior: 'smooth' })


                } else {

                    // 如果是点击头部的页面（Projects、Posts 等）则需要定位到页面顶部
                    let bingo = false

                    if (sessionStorage.getItem('nav_type') > -1 || bingo) {
                        // 滚动到顶部
                        window.scrollTo(0, 0)

                        // 重置 nav_type
                        sessionStorage.setItem('nav_type', -1)
                    }


                }

                break;

            }

        }

    }

    // 设置小标题、overlay 样式
    const setCardMiniTitleAndStyle = () => {

        let notes = document.getElementsByClassName('containerBox')

        for (let j = 0; j < notes.length; j++) {

            // 小标题

            let type = 0 // 记录标题在左侧还是右侧
            let note // 记录需要添加标题的节点

            // 判断卡片的位置，当遮挡前 1 个卡片时，前 1 个卡片显示垂直标题
            let left_mark = notes[j].getBoundingClientRect().x <= j * 40
            // 判断是否要显示右侧标题
            let right_mark = notes[j].getBoundingClientRect().x + 1 >= window.innerWidth - (notes.length - j) * 40

            // 左侧小标题
            if (right_mark !== true) {

                if (left_mark) {

                    if (j !== 0) {
                        type = 1
                        note = notes[j - 1]
                    }

                } else {

                    // 移除小标题
                    if (j !== 0) {
                        note = notes[j - 1]
                    }

                    if (note !== undefined) {
                        let note_title = note.getElementsByClassName('note_title')[0]
                        if (note_title !== undefined) {

                            // 移除标题父级容器的类名标记
                            note.classList.remove('mini')

                            // 移除前一个元素的垂直标题
                            note.removeChild(note_title)
                        }
                    }

                }

            }


            // 右侧小标题
            if (left_mark !== true) {

                if (right_mark) {

                    type = 2
                    note = notes[j]
                    // 添加悬浮样式
                    // note.classList.add('overlay')

                } else {
                    // 移除小标题
                    note = notes[j]

                    if (note !== undefined && j !== 0) {
                        let note_title = note.getElementsByClassName('note_title')[0]
                        if (note_title !== undefined) {

                            // 移除标题父级容器的类名标记
                            note.classList.remove('mini')

                            // 移除前一个元素的垂直标题
                            note.removeChild(note_title)
                        }
                    }

                    // 移除悬浮样式
                    // note.classList.remove('overlay')
                }

            }


            // 需要显示小标题
            if (type > 0) {

                // 如果元素无标题
                if (note.classList.contains('mini') == false) {
                    // 前一个元素显示垂直标题
                    let note_title = document.createElement('div')
                    note_title.classList.add('note_title')


                    if (type === 1) {
                        // 左侧小标题
                        note_title.style.left = (j - 1) * 40 + 'px'
                    } else {
                        // 右侧小标题
                        note_title.style.right = (notes.length - j) * 40 - 40 + 'px'
                        note_title.classList.add('overlay')
                    }

                    // 小标题文案
                    let note_title_span = document.createElement('p')

                    if (note.getElementsByTagName('H1').length === 0) {
                        // 如果笔记中没有 H1 标题
                        note_title_span.innerHTML = note.innerText.substring(0, 6) + '...'
                    } else {
                        note_title_span.innerHTML = note.getElementsByTagName('H1')[0].innerHTML
                    }

                    note_title_span.onclick = (event) => {
                        console.log(event);
                        console.log(event.target.innerText);
                        console.log(note.getAttribute('note_id'));
                        handleLinkClick(note.getAttribute('note_id'), undefined, 0)
                    }

                    // 小标题关闭按钮
                    let note_close_button = document.createElement('span')
                    note_close_button.innerHTML = '<svg t="1670226356192" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2683" width="20" height="20"><path d="M557.2 512l233.4-233.4c12.5-12.5 12.5-32.8 0-45.2s-32.8-12.5-45.2 0L512 466.8 278.6 233.4c-12.5-12.5-32.8-12.5-45.2 0s-12.5 32.8 0 45.2L466.8 512 233.4 745.4c-12.5 12.5-12.5 32.8 0 45.2 6.2 6.2 14.4 9.4 22.6 9.4s16.4-3.1 22.6-9.4L512 557.2l233.4 233.4c6.2 6.2 14.4 9.4 22.6 9.4s16.4-3.1 22.6-9.4c12.5-12.5 12.5-32.8 0-45.2L557.2 512z" p-id="2684"></path></svg>'
                    note_close_button.classList.add('note_close_button')
                    note_close_button.onclick = (event) => {

                        // 点击关闭按钮

                        handleCardCloseClick(note.getAttribute('note_id'))
                    }

                    note_title.appendChild(note_title_span)
                    note_title.appendChild(note_close_button)
                    note.appendChild(note_title)

                    note.classList.add('mini')
                }

            }

            // 样式
            if (j !== 0) {
                if (notes[j].getBoundingClientRect().x < notes[j - 1].getBoundingClientRect().x + notes[j - 1].getBoundingClientRect().width) {
                    notes[j].classList.add('overlay')
                } else {
                    notes[j].classList.remove('overlay')
                }
            }


        }
    }

    // 关闭卡片
    const handleCardCloseClick = (note_id) => {

        console.log('handleCardCloseClick');
        // 修改 URL
        let new_url = window.location.href.replace('note-id=' + note_id, '')
        // 设置新的 URL
        // window.history.pushState({}, '', new_url)
        navigate(new_url)

        // 记录 URL
        CURRENT_URL = window.location.href

        // 更新 UI
        herfToData()

    }

    // 获取 URL 参数
    const getUrlSearch = (location_search) => {

        let url_search = location_search.replace('?', '')
        url_search = url_search.replace(/&/gi, '')

        // 忽略焦点卡片
        let active_str = '' // 焦点卡片参数名称及其值
        let active_index = url_search.indexOf('active-note-id')
        if (active_index > -1) {
            let is_last_index = url_search.indexOf('note-id', active_index + 14)
            if (is_last_index > -1) {
                // 焦点卡片不是最后一个参数
                active_str = url_search.substring(active_index, is_last_index)
            } else {
                // 焦点卡片是最后一个参数
                active_str = url_search.substring(active_index, url_search.length)
            }

        }

        url_search = url_search.replace(active_str, '')

        let url_search_list = url_search.split('note-id=')

        return { 'url_search_list': url_search_list, 'active_str': active_str }

    }

    // 将焦点卡片 ID 写入 URL
    const setUrlActiveNote = (note_id) => {

        // 获取 URL 中的焦点卡片信息
        let getUrlSearch_req = getUrlSearch(window.location.search)
        let active_str = getUrlSearch_req['active_str']

        let new_url_search = window.location.search

        if (active_str === '') {
            // URL 中无焦点卡片

            new_url_search = new_url_search + '&active-note-id=' + note_id

        } else {
            // URL 中有焦点卡片

            // 如果焦点卡片无变化，则不更新
            if (active_str.indexOf(note_id) > -1) {
                return
            }

            new_url_search = new_url_search.replace(active_str, 'active-note-id=' + note_id)
        }


        // 设置 URL
<<<<<<< HEAD
        window.history.pushState({}, '', window.location.origin + window.location.pathname + new_url_search)
=======
        // window.history.pushState({}, '', window.location.origin + '/post' + new_url_search)
        const newURL = '/post' + new_url_search;
        navigate(newURL)
>>>>>>> a66da76f... 修复导航 bug

        // 记录 URL
        CURRENT_URL = window.location.origin + new_url_search

        // setState({
        //     location: window.location.href
        // })

    }

    // return() {

<<<<<<< HEAD
        // 404
        if (this.state.status.code !== 200) {
            return (<div className='markdown-body notes_box'>
                <Nav whiteboard_id={WHITEBOARD_ID} />
                <div className='notes'>
                    <p style={{ marginRight: '10px' }}>
                        {this.state.status.code}
                    </p>
                    <p>
                        {this.state.status.msg}
                        {this.state.status.code === 404 && 'The whiteboard ID does not exist or is not set to "share to web"'}
                    </p>
                </div></div>)
        }

        if (HEPTABASE_DATA === null || this.state.cardList.length === 0) {
            return (<div className='markdown-body notes_box'>
                <Nav whiteboard_id={WHITEBOARD_ID} />
                <div className='notes'>
                    <Loading />
                </div>
                {/* <Footer /> */}
            </div>)
        } else {
=======
    if (HEPTABASE_DATA === null || cardList.length === 0) {
        return (<div>
            <Nav />
            <div className='notes'>
                <Loading />
            </div>
            {/* <Footer /> */}
        </div>)
    } else {
>>>>>>> a66da76f... 修复导航 bug

        // console.log(state.activeNote);

        let card_list_dom = []

        //如果屏幕宽度较小，则只显示 1 条笔记
        if (windowWidth < minWidth) {

            // 获取用户关注的笔记进行展示

            let card = cardList[cardList.length - 1]

            for (let k = 0; k < cardList.length; k++) {
                if (cardList[k]['card']['id'] === ACTIVE_NOTE) {
                    card = cardList[k]
                    break;
                }
            }

            //设置笔记样式
            // left = index*40px; right = index*-40-400
            let note_style = {
                left: 0
            }
            card_list_dom.push(<Container style={note_style} key={card['card']['id']} handleHashChange={handleHashChange} handleLinkClick={handleLinkClick} card={card} />)
        } else {
            for (let i = 0; i < cardList.length; i++) {
                let card = cardList[i]

                //设置笔记样式
                // left = index*40px; right = index*-40-400
                let note_style = {
                    left: i * 40 + 'px',
                    right: -694.8 + (cardList.length - i) * 40 + 'px',
                    flex: '0 0 auto'
                }
<<<<<<< HEAD
                card_list_dom.push(<Container style={note_style} key={card['card']['id']} whiteboard_id={WHITEBOARD_ID} handleHashChange={this.handleHashChange} handleLinkClick={this.handleLinkClick} card={card} />)
            } else {
                for (let i = 0; i < this.state.cardList.length; i++) {
                    let card = this.state.cardList[i]

                    //设置笔记样式
                    // left = index*40px; right = index*-40-400
                    let note_style = {
                        left: i * 40 + 'px',
                        right: -694.8 + (this.state.cardList.length - i) * 40 + 'px',
                        flex: '0 0 auto'
                    }

                    let note = <Container style={note_style} key={card['card']['id']} whiteboard_id={WHITEBOARD_ID} handleHashChange={this.handleHashChange} handleLinkClick={this.handleLinkClick} card={card} />
                    card_list_dom.push(note)
                }
=======

                let note = <Container style={note_style} key={card['card']['id']} handleHashChange={handleHashChange} handleLinkClick={handleLinkClick} card={card} />
                card_list_dom.push(note)
>>>>>>> a66da76f... 修复导航 bug
            }
        }

<<<<<<< HEAD
            // // 设置网页标题
            // for (let k = 0; k < this.state.cardList.length; k++) {
            //     if (this.state.cardList[k]['card']['id'] === ACTIVE_NOTE) {

            //         if (this.state.cardList[k]['card']['title'] !== 'About') {
            //             document.title = this.state.cardList[k]['card']['title']
            //         } else {
            //             document.title = 'Jiang 的数字花园🌱'
            //         }

            //         break;
            //     }
            // }

            return (<div className='markdown-body notes_box'>
                <Nav whiteboard_id={WHITEBOARD_ID} />
=======
        // 设置网页标题
        for (let k = 0; k < cardList.length; k++) {
            if (cardList[k]['card']['id'] === ACTIVE_NOTE) {

                if (cardList[k]['card']['title'] !== 'About') {
                    document.title = cardList[k]['card']['title']
                } else {
                    document.title = 'Jiang 的数字花园🌱'
                }

                break;
            }
        }

        return (<div className='notes_box'>
            <Nav />

>>>>>>> a66da76f... 修复导航 bug


<<<<<<< HEAD
                    {card_list_dom}

                </div>

                {/* <Footer /> */}
=======
            <div className='notes'>
>>>>>>> a66da76f... 修复导航 bug

                {card_list_dom}
            </div>
            {/* <Footer /> */}

        </div>)
    }
    // }

}

export default Post;