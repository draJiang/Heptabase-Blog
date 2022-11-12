import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams } from 'react-router-dom';

import Container from '../components/Container'
import Nav from '../components/Nav';
import '../index.css'

import { getHeptabaseData, getClearCard, getClearImag } from '../constantFunction'


import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'



function About() {
    let { slug } = useParams();
    let [page_id, setPageID] = useState('');

    // 获取 About 数据的 ID
    let heptabase_blog_data

    getHeptabaseData.then((res) => {
        heptabase_blog_data = res.data
        console.log(res);
        setPageID(res['pages']['about']['id'])

    })

    let content = <div></div>
    if (page_id != '') {
        content = <Container post_id={page_id} />
    }

    setTimeout(() => {
        window.scrollTo(0, 0);
    }, 50);

    return <div>
        <div>
            <Nav />
            {content}
        </div>
    </div>;

}

export default About;