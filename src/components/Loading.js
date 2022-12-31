import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams } from 'react-router-dom';

import '../index.css'

import { Skeleton, Spin, ConfigProvider, Button } from 'antd';
import 'antd/dist/reset.css';




function Loading(props) {
    let { slug } = useParams();
    let [rows, setRows] = useState(3)

    useEffect(() => {

        // 设置动态加载样式
        let timer
        timer = setInterval(() => {
            setRows(rows += 2)

            if (rows > 10) {
                clearInterval(timer);
            }


        }, 1400);
    }, [slug])



    // return <div className='loading'><div>🚀 Loading...</div></div>
    return <div className='loading'><Skeleton active paragraph={{ rows: rows }} /></div>


}

export default Loading;