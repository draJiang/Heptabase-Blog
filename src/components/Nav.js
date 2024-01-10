import React from 'react';
import { Link } from 'react-router-dom';
import CONFIG from '../config'

import logo from '../logo.png'

// 页面头部
class Nav extends React.Component {


    componentDidMount() {

        // getHeptabaseData()
    }

    handleNavBarClick = (e) => {
        console.log('handleNavBarClick');
        // 记录跳转类型，实现打开新卡片后定位到卡片顶部
        sessionStorage.setItem('nav_type', 3)

    }

    render() {
        console.log(CONFIG);
        // 加载 Tabs
        let tabs = []
        Object.keys(CONFIG['pages']).forEach(key => {

            let page
            if (key === 'Activity') {
                page = <li >
                    <Link to='/activity'>Activity</Link>
                </li>
            } else {
                page = <li onClick={this.handleNavBarClick}>
                    <Link to={'/post?note-id=' + CONFIG['pages'][key] + '&active-note-id=' + CONFIG['pages'][key]}>{key}</Link>
                </li>
            }


            tabs.push(page)

        });

        console.log(tabs);

        return (
            <div className='markdown-body nav'>
                <header>
                    <span onClick={this.handleNavBarClick}><Link to='/post?note-id=8f1243cb-2689-45b2-9388-c1f114c7397b&active-note-id=8f1243cb-2689-45b2-9388-c1f114c7397b'><img src={logo}></img></Link></span>
                </header>
                <div>
                    <ul>

                        {tabs}

                    </ul>
                </div>
            </div>
        );
    }
}

export default Nav;