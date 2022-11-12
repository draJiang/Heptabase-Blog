import React, { useState, useEffect, useRef, useUrlState } from 'react';
import { Link } from 'react-router-dom';
import Nav from '../components/Nav';
import BlogPost from '../components/BlogPost';
import Container from '../components/Container';

// 笔记列表
function PostList() {

    useEffect(()=>{

        window.scrollTo(0, 0);

    })


    return <div>

        <Nav />
        <BlogPost />

    </div>


}

export default PostList;