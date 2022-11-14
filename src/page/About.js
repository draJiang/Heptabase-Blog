import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams } from 'react-router-dom';

import Container from '../components/Container'
import Nav from '../components/Nav';
import '../index.css'

import { getHeptabaseData, getClearCard, getClearImag } from '../constantFunction'




function About(props) {
    let { slug } = useParams();
    let [page_id, setPageID] = useState('');
    
    document.title = props.title

    useEffect(()=>{
        // console.log('scrollTo(0, 0)');
        // window.scrollTo(0, 0);

    })

    // 获取 About 数据的 ID
    let heptabase_blog_data

    getHeptabaseData.then((res) => {
        heptabase_blog_data = res.data
        console.log(res);

        if(res['pages']['about']!=undefined){
            setPageID(res['pages']['about']['id'])
        }else{
            // 404
            window.location = '/404'
        }
        

    })

    let content = <div></div>
    if (page_id != '') {
        content = <Container post_id={page_id} />
    }


    // return <div className='loading'><div>🚀 Loading...</div></div>
    return <div>
        <div>
            <Nav />
            {content}
        </div>
    </div>;

}

export default About;