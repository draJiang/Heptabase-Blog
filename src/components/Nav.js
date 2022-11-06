import React from 'react';
import { Link } from 'react-router-dom';
import { getHeptabaseData } from '../constantFunction'

class Nav extends React.Component {


    componentDidMount() {

        // getHeptabaseData()
    }

    render() {
        return (
            <div className='nav'>
                <header>江子龙</header>
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