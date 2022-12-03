import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';
import { useLocation } from "react-router";

import Container from '../components/Container'
import Nav from '../components/Nav';
import Footer from '../components/Footer'
import Loading from '../components/Loading'

import '../index.css'
import 'github-markdown-css'

import { getHeptabaseData, getClearCard, getClearImag } from '../constantFunction'
import { id } from 'date-fns/locale';

import useHash from "../hooks/useHash";



let windowWidth = window.innerWidth
let minWidth = 600

// 文章页面
class Post extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            card: null //所有的 hepta 数据
            , main_card: null //首页卡片
            , cardList: [] // 当前页面的卡片列表
            , location: '' // 记录 URL
            , activeNote: 'null'
        };
    }

    componentDidMount() {

        console.log(windowWidth);

        // 请求 hepta 数据 getHeptabaseData
        getHeptabaseData.then((res) => {

            let heptabase_blog_data = res.data

            // 将数据保存到 state 中
            this.setState({
                card: heptabase_blog_data,
                main_card: res['pages']['about']
            }, () => {

                // 渲染 URL、数据
                this.herfToData()
            })

        })

    }

    // 根据 card id 获取 card content
    findContent = (id, heptabase_blog_data) => {
        if (heptabase_blog_data === '') {
            return
        }

        let new_card = null
        console.log('Post findContent for:');
        for (let i = 0; i < heptabase_blog_data.cards.length; i++) {

            if (heptabase_blog_data.cards[i]['id'] == id) {

                // 处理内容中的图片
                heptabase_blog_data.cards[i] = getClearImag(heptabase_blog_data.cards[i])
                console.log('getClearImag done');
                // 处理内容中的链接
                new_card = getClearCard(heptabase_blog_data.cards[i], heptabase_blog_data.cards)
                heptabase_blog_data.cards[i] = new_card['card']

                return new_card

            }
        }

        return new_card

    }

    // 文章内链接、反向链接点击
    handleLinkClick = (link_id, current_id) => {

        // 设置当前活跃的笔记（用户焦点）
        this.setState({
            activeNote: link_id
        })

        // 已经显示此卡片则不更新 URL 和数据
        let bingo = false
        this.state.cardList.forEach(item => {

            if (link_id == item['card']['id']) {

                bingo = true

            }

        });

        if (bingo) {

            return
        }

        // 删除 Link 所在 card 后的所有 URL 参数
        let url_search = window.location.search
        url_search = url_search.replace('?', '')
        url_search = url_search.replace(/&/gi, '')
        let url_search_list = url_search.split('note-id=')

        let new_url_search = ''
        let current_page_index = -1
        for (let i = 0; i < url_search_list.length; i++) {

            if (url_search_list[i] === '') {
                continue
            }

            if (url_search_list[i] === current_id) {
                // URL 参数 === current_id
                current_page_index = i
            } else {
                // URL 参数 !== current_id
            }

            if (new_url_search == '') {
                new_url_search += '?note-id=' + url_search_list[i]
            } else {
                new_url_search += '&note-id=' + url_search_list[i]
            }

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

        // 设置 URL
        window.history.pushState({}, '', window.location.origin + '/post' + new_url_search)
        // 记录 URL
        this.setState({
            location: window.location.href
        })


        // 删除 URL 中不存在的 Card
        this.resetCardList()
        // 根据 URL 获取 card 数据
        this.herfToData()

    }

    herfToData = () => {

        // 首页的情况
        if (window.location.search === '') {

            // 找到首页卡片的 ID
            let main_id = this.state.main_card['id']
            // 设置 URL
            window.location.replace(window.location.origin + '/post?note-id=' + main_id)

        }

        // 从 URL 中获取 note id，根据 id 获取卡片数据
        let card_list = []
        let url_search = window.location.search
        url_search = url_search.replace('?', '')
        url_search = url_search.replace(/&/gi, '')
        let url_search_list = url_search.split('note-id=')

        for (let i = 0; i < url_search_list.length; i++) {
            if (url_search_list[i] == '') {
                continue
            }
            // 将数据保存到 card list 中
            card_list.push(this.findContent(url_search_list[i], this.state.card))

        }

        // 收集 card 数据后一次性 setState（在 for 内分多次 setState 的话容易丢失数据）
        this.setState({
            cardList: card_list,
            activeNote: card_list[card_list.length - 1]['card']['id'] // 设置当前活跃的笔记（用户焦点）
        })


    }

    // 当 URL 变化时（子组件 container 载入完毕后也会调用此方法）
    handleHashChange = (url) => {

        // 定位到当前用户关注的笔记
        setTimeout(() => {
            let note_list = document.getElementsByClassName('container')
            let foucus_note = this.state.activeNote

            let target_note_offsetLeft = 0
            for (let j = 0; j < note_list.length; j++) {
                let note = note_list[j]
                if (note.getAttribute('note_id') === foucus_note) {

                    if (windowWidth > minWidth) {
                        document.getElementsByClassName('notes')[0].scrollTo({ left: target_note_offsetLeft, behavior: 'smooth' })
                    } else {

                    }

                    break;

                }

                target_note_offsetLeft += note.clientWidth
            }
        }, 100);

        // 如果 url 发生变化，则更新数据
        if (url !== this.state.location) {


            // 将当前 URL 保存到 state 中
            this.setState({
                location: url
            })

            if (this.state.location !== '') {

                // cardList 中不存在 URL 的某一个 card
                // 加载此 card 的数据
                this.herfToData()

            }

        }

        // 删除 URL 中不存在的 Card
        this.resetCardList()

    }

    // 删除 URL 中不存在的 Card
    resetCardList = () => {
        let url = window.location.href
        //比对 url 和 cardList
        for (let i = 0; i < this.state.cardList.length; i++) {
            // url 中不存在此 card
            if (url.indexOf(this.state.cardList[i]['card']['id']) < 0) {


                // 删除 card
                this.state.cardList.splice(i, 1)
                this.setState({
                    cardList: this.state.cardList
                })

            } else {
                // url 中存在此 card
                // continue
            }

        }

    }

    render() {
        if (this.state.card === null || this.state.cardList.length === 0) {
            return (<div>
                <Nav />
                <Loading />
                <Footer />
            </div>)
        } else {

            console.log(this.state.activeNote);

            let card_list_dom = []

            //如果屏幕宽度较小，则只显示 1 条笔记
            if (windowWidth < minWidth) {

                // 获取用户关注的笔记进行展示

                let card = this.state.cardList[this.state.cardList.length - 1]

                for (let k = 0; k < this.state.cardList.length; k++) {
                    if (this.state.cardList[k]['card']['id'] === this.state.activeNote) {
                        card = this.state.cardList[k]
                        break;
                    }
                }

                //设置笔记样式
                // left = index*40px; right = index*-40-400
                let note_style = {
                    left: 0
                }
                card_list_dom.push(<Container style={note_style} key={card['card']['id']} handleHashChange={this.handleHashChange} handleLinkClick={this.handleLinkClick} card={card} />)
            } else {
                for (let i = 0; i < this.state.cardList.length; i++) {
                    let card = this.state.cardList[i]

                    //设置笔记样式
                    // left = index*40px; right = index*-40-400
                    let note_style = {
                        left: i * 40 + 'px',
                        flex: '0 0 auto'
                    }

                    let note = <Container style={note_style} key={card['card']['id']} handleHashChange={this.handleHashChange} handleLinkClick={this.handleLinkClick} card={card} />
                    card_list_dom.push(note)
                }
            }

            // 设置网页标题
            for (let k = 0; k < this.state.cardList.length; k++) {
                if (this.state.cardList[k]['card']['id'] === this.state.activeNote) {

                    if (this.state.cardList[k]['card']['title'] !== 'About') {
                        document.title = this.state.cardList[k]['card']['title']
                    } else {
                        document.title = 'Jiang 的数字花园🌱'
                    }

                    break;
                }
            }

            // 监听 notes 容器滚动
            if (document.getElementsByClassName('notes')[0] !== undefined) {

                let notes = document.getElementsByClassName('container')
                document.getElementsByClassName('notes')[0].addEventListener('scroll', function () {

                    // 判断卡片的位置，当遮挡前 1 个卡片时，前 1 个卡片显示垂直标题
                    for (let j = 0; j < notes.length; j++) {

                        if (j === 0) {
                            continue
                        }

                        // 小标题
                        if (notes[j].getBoundingClientRect().x <= j * 40) {

                            // 如果前一元素无标题
                            if (notes[j - 1].classList.contains('mini') == false) {
                                // 前一个元素显示垂直标题
                                let note_title = document.createElement('div')
                                note_title.classList.add('note_title')

                                // 小标题文案
                                if (notes[j - 1].getElementsByTagName('H1').length === 0) {
                                    // 如果笔记中没有 H1 标题
                                    note_title.innerHTML = notes[j - 1].innerText.substring(0,6)+'...'
                                } else {
                                    note_title.innerHTML = notes[j - 1].getElementsByTagName('H1')[0].innerHTML
                                }


                                notes[j - 1].appendChild(note_title)

                                notes[j - 1].classList.add('mini')
                            }

                        } else {

                            let note_title = notes[j - 1].getElementsByClassName('note_title')[0]
                            if (note_title !== undefined) {

                                // 移除标题父级容器的类名标记
                                notes[j - 1].classList.remove('mini')

                                // 移除前一个元素的垂直标题
                                notes[j - 1].removeChild(note_title)
                            }

                        }

                        // 样式
                        if (notes[j].getBoundingClientRect().x < notes[j - 1].getBoundingClientRect().x + notes[j - 1].getBoundingClientRect().width) {
                            notes[j].classList.add('overlay')
                        } else {
                            notes[j].classList.remove('overlay')
                        }

                    }

                })
            }



            return (<div>

                <div>
                    <Nav />
                    {/* <Container card={card} /> */}
                    <div className='notes'>
                        {card_list_dom}
                    </div>

                    {/* <Footer /> */}
                </div>

            </div>)
        }
    }



}

export default Post;