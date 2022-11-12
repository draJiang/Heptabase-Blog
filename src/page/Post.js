import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams } from 'react-router-dom';

import Container from '../components/Container'
import Nav from '../components/Nav';
import '../index.css'

import 'github-markdown-css'


// 文章页面
function Post() {
    let { slug } = useParams();

    return <div>

        <div>
            <Nav />
            <Container post_id={slug} />
        </div>
    </div>;

}

export default Post;