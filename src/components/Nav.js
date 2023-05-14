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

        return (
            <div className='markdown-body nav'>
                <header>
                    <span onClick={this.handleNavBarClick}><Link to={'/post?whiteboard_id=' + this.props['whiteboard_id']}><img src={logo}></img></Link></span>
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