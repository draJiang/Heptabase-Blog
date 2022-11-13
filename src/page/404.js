import React from 'react';
import { Link } from 'react-router-dom';
import Nav from '../components/Nav';

function Empty(props) {

    document.title = props.title

    return<div>
        <Nav />
        <div className='container'>
            <h3>404 Not Found</h3>
            <Link to='/'>Back to Home page</Link>
        </div>

    </div>
}

export default Empty;