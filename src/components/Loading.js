import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams } from 'react-router-dom';

import '../index.css'


function Loading(props) {
    let { slug } = useParams();
    let [isLoading, setLoadingState] = useState(true)


    return <div className='loading'><div>🚀 Loading...</div></div>
    

}

export default Loading;