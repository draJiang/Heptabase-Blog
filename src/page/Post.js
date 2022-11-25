import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams } from 'react-router-dom';
import { useLocation } from "react-router";

import Container from '../components/Container'
import Nav from '../components/Nav';
import Footer from '../components/Footer'

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
                    window.scrollTo({
                        top:0,
                        left:0,
                        behavior:'auto'
                    });
                }, 10);

                // window.scrollTo(0, 0);

                // 重置 nav_type
                sessionStorage.setItem('nav_type', -1)
            } else {

                // 返回上一页
                setTimeout(() => {

                    window.scrollTo({
                        top:sessionStorage.getItem('scrollY'),
                        left:0,
                        behavior:'auto'
                    });

                    // window.scrollTo(0, sessionStorage.getItem('scrollY'));

                }, 10);

                // window.scrollTo(0, sessionStorage.getItem('scrollY'));


            }


        }, [pathname]);
    }

    useScrollToTop();
    // useReStoreScrollTop();

    useEffect(() => {
        // console.log('scrollTo(0, 0)');
        // window.scrollTo(0, 0);
        console.log('Post useEffect');

    })

    

    return <div>

        <div>
            <Nav />
            <Container post_id={slug} />
            <Footer />
        </div>
    </div>;

}

export default Post;