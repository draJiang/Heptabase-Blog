import React from 'react';
import { Link } from 'react-router-dom';
import Nav from '../components/Nav';

class Empty extends React.Component {


    componentDidMount() {


    }

    render() {
        return (
            <div>
                <Nav />
                <div className='container'>
                    <h3>404 Not Found</h3>
                    <Link to='/'>Back to Home page</Link>
                </div>

            </div>
        );
    }
}

export default Empty;