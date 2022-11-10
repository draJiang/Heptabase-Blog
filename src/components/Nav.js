import React from 'react';
import { Link } from 'react-router-dom';
import { getHeptabaseData } from '../constantFunction'


class Nav extends React.Component {


    componentDidMount() {

        // getHeptabaseData()
    }

    render() {
        return (
            <div className='markdown-body nav'>
                <header>
                    <Link to='/'><img src='	https://blog.dabing.one/apple-touch-icon.png'></img></Link>
                </header>
                <div>
                    <ul>
                        <li>
                            <Link to='/'>Blog</Link>
                        </li>
                        <li>
                            <Link to='/about/'>About</Link>
                        </li>
                    </ul>
                </div>
            </div>
        );
    }
}

export default Nav;