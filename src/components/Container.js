import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams } from 'react-router-dom';

import '../index.css'

import 'github-markdown-css'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'



import { getHeptabaseData, getClearCard, getClearImag } from '../constantFunction'


function Container(props) {
    console.log(props);
    let [isLoading, setLoadingState] = useState(true)
    let [card, setCard] = useState('card');
    let [heptabase_data, setHeptabaseData] = useState('heptabase_data');
    let { slug } = useParams();

    const post = useRef(null);

    // 设置 img 的尺寸
    if (post.current != null) {
        console.log(post.current.innerHTML);
        let article_img = document.getElementsByTagName('img');

        for (let i = 0; i < article_img.length; i++) {
            let width_key_index = article_img[i]['alt'].indexOf('{{width ')
            if (width_key_index > -1) {
                let img_width = article_img[i]['alt'].substring(width_key_index, article_img[i]['alt'].length)
                img_width = img_width.replace('{{width ', '')
                img_width = img_width.replace('}}', '')

                article_img[i].setAttribute('style', 'width:' + img_width)
                article_img[i].style.display = 'block'
                article_img[i].style.margin = '0 auto'
            }
        }

    }

    const setContent = (id) => {
        console.log('setContent');
        let heptabase_blog_data
        getHeptabaseData.then((res) => {
            heptabase_blog_data = res.data
            console.log(res);

            console.log('Container setContent for:');
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

        // console.log(event);
    }

    // setContent(slug)
    console.log(props.post_id);
    useEffect(() => {

        console.log('useEffect');

        //设置页面内容
        console.log(card);

        if (card === 'card') {
            setContent(props.post_id)
        } else {

            console.log(card['card']['id'] !== props.post_id);

            if (card['card']['id'] !== props.post_id) {
                console.log('useEffect setContent');
                setContent(props.post_id)
            }
        }

    });


    if (isLoading) {
        return <div>Loaindg..</div>
    } else {

        // 反向链接
        let backLinksBox = <div className='markdown-body backLinks'>
            <header>Links to this page</header>
            <ul>
                null
            </ul>
        </div>

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
                <header>Links to this page</header>
                <ul>
                    {backLinks}
                </ul>
            </div>
        }


        window.scrollTo(0, 0);

        return <div>

            <div>
                <div ref={post} className='markdown-body container'>

                    {/* <article dangerouslySetInnerHTML={{ __html: html }}></article>
                    {backLinksBox} */}

                    <article><ReactMarkdown children={card['card']['content']} remarkPlugins={[remarkGfm, { singleTilde: false }]} /></article>
                    {backLinksBox}

                </div>
            </div>
        </div>;
    }

}

export default Container;