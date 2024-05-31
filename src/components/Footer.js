import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams } from 'react-router-dom';

import '../style.css'


function Footer(props) {
    let { slug } = useParams();

    useEffect(() => {


    })


    return <div className='footer'><a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/"><img alt="知识共享许可协议" src="https://i.creativecommons.org/l/by-nc-sa/4.0/80x15.png" /></a></div>


}

export default Footer;