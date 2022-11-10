// import React from 'react';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams } from 'react-router-dom';

import Nav from '../components/Nav';
import '../index.css'
// import { Link } from 'react-router-dom';

import Home from './Home';
import Empty from './404';
import About from './About';

import 'github-markdown-css'

import ReactMarkdown from 'https://esm.sh/react-markdown@7'
import remarkGfm from 'https://esm.sh/remark-gfm@3'



import { getHeptabaseData, getClearCard, getClearImag } from '../constantFunction'


function Post() {
    let [isLoading, setLoadingState] = useState(true)
    let [card, setCard] = useState('card');
    let [heptabase_data, setHeptabaseData] = useState('heptabase_data');
    let { slug } = useParams();

    const setContent = (id) => {
        console.log('setContent');
        let heptabase_blog_data
        getHeptabaseData.then((res) => {
            heptabase_blog_data = res.data
            console.log(res);
            //获取 URL 中的文章 ID

            console.log('Post setContent for:');
            for (let i = 0; i < heptabase_blog_data.cards.length; i++) {

                if (heptabase_blog_data.cards[i]['id'] == id) {

                    // 处理内容中的图片
                    heptabase_blog_data.cards[i] = getClearImag(heptabase_blog_data.cards[i])
                    console.log('getClearImag done');
                    // 处理内容中的链接
                    let new_card = getClearCard(heptabase_blog_data.cards[i], heptabase_blog_data.cards)
                    heptabase_blog_data.cards[i] = new_card['card']

                    console.log('backLinks:');
                    console.log(new_card['backLinks']);
                    console.log(new_card);

                    // this.setState({ content: heptabase_blog_data.cards[i]['content'], backLinks: new_card['backLinks'], isLoading: false, old_post_id: heptabase_blog_data.cards[i]['id'] })
                    setHeptabaseData(heptabase_blog_data)
                    setCard(new_card)
                    setLoadingState(false)
                    break;
                }
            }

            // 404
        })

    }

    const handleBackLinkClick = (id) => {
        console.log('handleBackLinkClick');
        console.log(id);

        if (id != this.state.old_post_id) {
            this.setState({
                new_post_id: id
            })
        }

        // console.log(event);
    }

    // setContent(slug)

    useEffect(() => {

        console.log('useEffect');

        //设置页面内容
        console.log(card);
        if (card != 'card') {
            if (card['card']['id'] != slug) {
                setContent(slug)
            }
        }

    });


    if (isLoading) {
        return <div onClick={setContent(slug)}>Loaindg..</div>
    } else {
        console.log(slug);
        console.log(card);

        // md 转 HTML
        // var showdown = require('showdown'),
        //     converter = new showdown.Converter(),
        //     html = converter.makeHtml(card['card']['content']);
        // console.log(html);
        // setCard(slug)

        // 反向链接
        let backLinksBox = <div></div>
        console.log(card['backLinks']);
        if (card['backLinks'].length > 0) {
            let backLinks = card['backLinks'].map((backLink) =>
                <li key={backLink.id} >
                    <Link to={{ pathname: '/post/' + backLink.id }} >
                        {/* <span onClick={this.handleBackLinkClick.bind(Event, backLink.id)}> */}
                        {backLink.title}
                        {/* </span> */}
                    </Link>
                </li>
            )

            backLinksBox = <div className='markdown-body backLinks'>
                <header>Link to this page</header>
                <ul>
                    {backLinks}
                </ul>
            </div>
        }

        const mm = `
        
        A paragraph with *emphasis* and **strong importance**.

        > A block quote with ~strikethrough~ and a URL: https://reactjs.org.
        
        * Lists
        * [ ] todo
        * [x] done
        ~~this is~~

        A table:
        
        | a | b |
        | - | - |


        `
        window.scrollTo(0, 0);
        
        return <div>

            <div>
                <Nav />
                <div className='markdown-body container'>

                    {/* <article dangerouslySetInnerHTML={{ __html: html }}></article>
                    {backLinksBox} */}

                    <article><ReactMarkdown children={card['card']['content']} remarkPlugins={[remarkGfm, { singleTilde: false }]} /></article>
                    {backLinksBox}

                </div>

            </div>
        </div>;
    }


    // return (
    //     <div>Post</div>
    // )
}

export default Post;