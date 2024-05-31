import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams } from 'react-router-dom';

import Container from '../components/Container'
import Nav from '../components/Nav';
import Footer from '../components/Footer'
import '../style.css'
import Loading from '../components/Loading'

import { getHeptabaseData, getClearCard, getClearImag } from '../constantFunction'




function About(props) {
    let { slug } = useParams();
    let [isLoading, setLoadingState] = useState(true)
    let [page_id, setPageID] = useState('');

    document.title = props.title

    useEffect(() => {
        // console.log('scrollTo(0, 0)');
        window.scrollTo(0, 0);
        window.history.scrollRestoration = 'auto';

    })

    // 获取 About 数据的 ID
    let heptabase_blog_data


    getHeptabaseData.then((res) => {
        heptabase_blog_data = res.data

        if (res['pages']['about'] != undefined) {
            setLoadingState(false)
            setPageID(res['pages']['about']['id'])
        } else {
            // 404
            window.location = '/404'
        }

    })

    let content = <Loading />
    if (page_id != '' || isLoading !== true) {
        content = <Container post_id={page_id} />
    } else {
        // content = <Loading />
    }


    // return <div className='loading'><div>🚀 Loading...</div></div>

    if (page_id != '' || isLoading !== true) {
        return <div>
            <div>
                <Nav />
                <Container post_id={page_id} />
                <Footer />
            </div>
        </div>;
    } else {
        return <div>
            <div>
                <Nav />
                <Loading />
                <Footer />
            </div>
        </div>;
    }


}

export default About;