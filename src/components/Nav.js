import React from 'react';
import { Link } from 'react-router-dom';
import CONFIG from '../config'

// 页面头部
class Nav extends React.Component {


    componentDidMount() {

        // getHeptabaseData()
    }

    handleNavBarClick = (e) => {
        // console.log('handleNavBarClick');
        // window.scrollTo(0, 0);
        // e.stopPropagation()
    }

    render() {
        return (
            <div className='markdown-body nav'>
                <header>
                    <Link to='/post?note-id=3a433c0b-e2e1-4722-8a88-a17e9aa2b927&active-note-id=3a433c0b-e2e1-4722-8a88-a17e9aa2b927'>{CONFIG.title}</Link>
                </header>
                <div>
                    <ul>
                        <li>
                            <Link to='/post?note-id=3dd9a603-a7f3-44e9-a6d7-cd2ebda08952&active-note-id=3dd9a603-a7f3-44e9-a6d7-cd2ebda08952'>🚀 Projects</Link>
                        </li>
                        <li>
                            <Link to='/post?note-id=9f31ea21-90b9-4523-b8d5-cb33b7a01bda&active-note-id=9f31ea21-90b9-4523-b8d5-cb33b7a01bda'>🗒️ Posts</Link>
                        </li>

                    </ul>
                </div>
            </div>
        );
    }
}

export default Nav;