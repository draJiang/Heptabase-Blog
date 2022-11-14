import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams } from 'react-router-dom';
import { useLocation } from "react-router";

import Container from '../components/Container'
import Nav from '../components/Nav';
import '../index.css'

import 'github-markdown-css'

// 文章页面
function Post(props) {
    let { slug } = useParams();


    const useScrollToTop = () => {   //注意自定义Hooks要用useXXX定义
        const { pathname } = useLocation();
        useEffect(() => {

            console.log('useScrollToTop');

            console.log(window.history);
            window.history.scrollRestoration = 'manual';

            // 根据跳转类型来决定是否要定位到顶部，如果不是点击 span 或 backLink 则不回到顶部

            let nav_type = sessionStorage.getItem('nav_type')

            if (nav_type > -1) {
                // 点击了 span 或 backLink

                setTimeout(() => {
                    window.scrollTo(0, 0);
                }, 1);

                // window.scrollTo(0, 0);

                // 重置 nav_type
                sessionStorage.setItem('nav_type', -1)
            } else {

                // 返回上一页
                setTimeout(() => {
                    window.scrollTo(0, sessionStorage.getItem('scrollY'));
                }, 1);

                // window.scrollTo(0, sessionStorage.getItem('scrollY'));


            }

            // console.log(window.history);
            // console.log(window.history.pushState);

            // let url_histroy = sessionStorage.getItem('histroy')
            // let thisPageKey = window.history.state.key
            // console.log(url_histroy);

            // if (url_histroy != null) {
            //     url_histroy = url_histroy.split(',')
            //     if (url_histroy.indexOf(thisPageKey)>-1) {
            //         // 回到旧页面

            //     } else {
            //         url_histroy = url_histroy+','+thisPageKey
            //         sessionStorage.setItem('histroy', url_histroy)

            //         window.scrollTo(0, 0);
            //     }
            // } else {
            //     sessionStorage.setItem('histroy', thisPageKey)
            // }


            // console.log(url_histroy);

            // console.log(pathname);

            // console.log(sessionStorage.getItem('pathname'));



            // sessionStorage.setItem('pathname', pathname)



        }, [pathname]);
    }

    useScrollToTop();
    // useReStoreScrollTop();

    useEffect(() => {
        // console.log('scrollTo(0, 0)');
        // window.scrollTo(0, 0);
        console.log('Post useEffect');

    })

    document.title = props.title

    return <div>

        <div>
            <Nav />
            <Container post_id={slug} />
        </div>
    </div>;

}

export default Post;