import React from 'react';
import { Link } from 'react-router-dom';

// 页面头部
class Nav extends React.Component {


    componentDidMount() {

        // getHeptabaseData()
    }

    handleNavBarClick = (e) =>{
        // console.log('handleNavBarClick');
        // window.scrollTo(0, 0);
        // e.stopPropagation()
    }

    render() {
        return (
            <div className='markdown-body nav'>
                <header>
                    <Link to='/'>江子龙的数字花园🌱</Link>
                </header>
                <div>
                    <ul>
                        <li>
                            <Link to='/notes'>🗒️</Link>
                        </li>
                    </ul>
                </div>
            </div>
        );
    }
}

export default Nav;