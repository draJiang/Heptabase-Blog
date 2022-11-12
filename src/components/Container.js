import React, { useState, useEffect, useRef, useUrlState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams } from 'react-router-dom';

import '../index.css'

import 'github-markdown-css'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'



import { getHeptabaseData, getClearCard, getClearImag } from '../constantFunction'


function Container(props) {
    console.log(props);
    let post = useRef(null);

    let path = window.location.pathname

    let path_id
    if (path.indexOf('/post/') < 0) {

        path_id = props.post_id

    } else {
        path_id = path.replace('/post/', '')
    }


    console.log(path_id);

    let [isLoading, setLoadingState] = useState(true)
    let [thisPageId, setPageID] = useState('')

    let [my_link, setLink] = useState('');
    let [card, setCard] = useState('card');

    console.log(card);
    let [heptabase_data, setHeptabaseData] = useState('heptabase_data');
    let { slug } = useParams();

    if (thisPageId == '') {
        setPageID(props.post_id)
    }


    let isMobile = navigator.userAgent.match(/Mobile/i)
    let mobileSkale = 1
    if (isMobile) {
        mobileSkale = 2
    }







    const setContent = (id) => {
        console.log('setContent');
        let heptabase_blog_data
        getHeptabaseData.then((res) => {
            heptabase_blog_data = res.data

            console.log('Container setContent for:');
            for (let i = 0; i < heptabase_blog_data.cards.length; i++) {

                if (heptabase_blog_data.cards[i]['id'] == id) {

                    // 处理内容中的图片
                    heptabase_blog_data.cards[i] = getClearImag(heptabase_blog_data.cards[i])
                    console.log('getClearImag done');
                    // 处理内容中的链接
                    let new_card = getClearCard(heptabase_blog_data.cards[i], heptabase_blog_data.cards)
                    heptabase_blog_data.cards[i] = new_card['card']

                    // this.setState({ content: heptabase_blog_data.cards[i]['content'], backLinks: new_card['backLinks'], isLoading: false, old_post_id: heptabase_blog_data.cards[i]['id'] })
                    // setHeptabaseData(heptabase_blog_data)
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



    useEffect(() => {

        console.log('useEffect');

        //设置页面内容
        console.log(card);


        if (card === 'card') {
            setContent(path_id)
        } else {

            console.log(card['card']['id'] !== path_id);

            if (card['card']['id'] !== path_id) {
                console.log('useEffect setContent');
                

                setContent(path_id)
                setLink('')
                
                // console.log('scrollTo');
                // window.scrollTo(0, 0);
            }
        }

        // dom 加载完毕后
        if (post.current != null && card['card']['id'] == path_id) {
            // console.log(post);

            // 设置 img 的尺寸
            let article_img = document.getElementsByTagName('img');
            console.log(article_img);

            for (let i = 0; i < article_img.length; i++) {
                let width_key_index = article_img[i]['alt'].indexOf('{{width ')
                if (width_key_index > -1) {
                    let img_width = article_img[i]['alt'].substring(width_key_index, article_img[i]['alt'].length)
                    img_width = img_width.replace('{{width ', '')
                    img_width = img_width.replace('}}', '')

                    // console.log(img_width);
                    // console.log((Number(img_width.replace('%',''))*mobileSkale).toString());

                    article_img[i].setAttribute('style', 'width:' + (Number(img_width.replace('%', '')) * mobileSkale).toString() + '%')
                    article_img[i].style.display = 'block'
                    article_img[i].style.margin = '0 auto'
                }
            }

            // 设置 a 链接的点击事件
            let article_link = document.getElementsByTagName('span');
            console.log(article_link);
            let links = []

            for (let i = 0; i < article_link.length; i++) {
                // console.log(article_link[i]);
                // console.log(article_link[i].getAttribute('path'));

                if (article_link[i].getAttribute('path') == undefined || article_link[i].getAttribute('path') == null) {
                    continue
                }

                // let new_link = <li><Link className='new_link' to={article_link[i].getAttribute('path')}>newLink</Link></li>

                // links.push(new_link)

                let link_temp = <Link className='link_temp' to={article_link[i].getAttribute('path')}>Link</Link>
                links.push(link_temp)


                article_link[i].onclick = () => {
                    console.log('a click');
                    // console.log(article_link[i].getAttribute('path'));

                    let post_id = article_link[i].getAttribute('path').replace('/post/', '')
                    console.log(post_id);

                    let my_links = document.getElementsByClassName('link_temp')
                    console.log(my_links);

                    // setThisPageId(post_id)
                    // 修改当前 post id
                    for (let j = 0; j < my_links.length; j++) {
                        console.log(my_links[j]);
                        console.log(my_links[j].href);

                        if (my_links[j].href.indexOf(article_link[i].getAttribute('path')) >= 0) {
                            my_links[j].click()

                            window.scrollTo(0, 0);
                            
                            break
                        }
                    }


                    // window.location.pathname = article_link[i].getAttribute('path')

                    // window.history.pushState(null, null, article_link[i].getAttribute('path'))
                    // setPageID(post_id)
                    // setContent(post_id)
                    // article_link[0].click()

                    // new_link.click()

                }
            }

            if (my_link == '' && links.length > 0) {
                setLink(links)
            }


        }

    });


    if (isLoading) {
        return <div>Loaindg..</div>
    } else {


        let links = []


        // 反向链接
        let backLinksBox = <div className='markdown-body backLinks'>
            <header>Links to this page</header>
            <ul>
                💭
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



        return <div>

            <div>
                <div ref={post} className='markdown-body container'>

                    {/* <article dangerouslySetInnerHTML={{ __html: html }}></article>
                    {backLinksBox} */}

                    <article><ReactMarkdown children={card['card']['content']} rehypePlugins={[rehypeRaw]} remarkPlugins={[remarkGfm, { singleTilde: false }]} /></article>
                    {backLinksBox}
                    <ul style={{ display: 'none' }}>{my_link}</ul>


                </div>
            </div>
        </div>;
    }

}

export default Container;