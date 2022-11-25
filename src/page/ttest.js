import React, { useState, useEffect, useRef, useUrlState } from 'react';
import { Link } from 'react-router-dom';
import Nav from '../components/Nav';
import BlogPost from '../components/BlogPost';
import Container from '../components/Container';
import Footer from '../components/Footer'

import useHash from "../hooks/useHash";

// 笔记列表
function Ttteset(props) {

    const [hash, setHash] = useHash();

    useEffect(() => {
        console.log('useEffect');
        console.log(hash);
        // console.log('scrollTo(0, 0)');
        console.log(window.location.hash);
        // setHash('#hello')

    },[hash]) // 监听 hash 变化

    const handleContentDivClick = (x, y) => {
        // console.log(Event);
        console.log(x);
        console.log(y);
        console.log('click');
        window.scroll({ left: x, top: y, behavior: 'smooth' })

        console.log(hash);
        // 路由
        // console.log(window.location.hash);
        // if (window.location.hash == '') {
        //     window.location.hash += x
        // } else {
        //     window.location.hash += '&' + x
        // }

        // setHash(hash.toString()+='x.toString')
        setHash(window.location.hash += '&' + x)

        // 根据 hash 打开多个卡片（按顺序）

    }


    return <div className='test'>

        <div style={{ position: 'sticky', left: '0', right: '-360px' }} onClick={handleContentDivClick.bind(this, 0, 0)}>1</div>
        <div style={{ position: 'sticky', left: '40px', right: '-400px' }} onClick={handleContentDivClick.bind(this, 840, 0)}>2</div>
        <div style={{ position: 'sticky', left: '80px', right: '-440px' }} onClick={handleContentDivClick.bind(this, 1680, 0)}>3</div>
        <div style={{ position: 'sticky', left: '120px', right: '-480px' }} onClick={handleContentDivClick.bind(this, 2520, 0)}>4</div>
        <div style={{ position: 'sticky', left: '160px', right: '-520px' }} onClick={handleContentDivClick.bind(this, 3360, 0)}>5</div>
        <div style={{ position: 'sticky', left: '200px', right: '-560px' }} onClick={handleContentDivClick.bind(this, 4200, 0)}>6</div>
        <div style={{ position: 'sticky', left: '240px', right: '-600px' }} onClick={handleContentDivClick.bind(this, 5040, 0)}>7</div>
        <div style={{ position: 'sticky', left: '280px', right: '-640px' }} onClick={handleContentDivClick.bind(this, 5880, 0)}>8</div>
        <div style={{ position: 'sticky', left: '320px', right: '-680px' }} onClick={handleContentDivClick.bind(this, 6270, 0)}>9</div>
        <div style={{ position: 'sticky', left: '360px', right: '-720px' }} onClick={handleContentDivClick.bind(this, 7110, 0)}>10</div>

    </div>


}

export default Ttteset;