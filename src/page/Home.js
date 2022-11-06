import React from 'react';
import { Link } from 'react-router-dom';
import Nav from '../components/Nav';
import BlogPost from '../components/BlogPost';
import Container from '../components/Container';

class Home extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            posts: {}
            , showContainer: false
        };
    }

    componentDidMount() {
        console.log(this.state.posts);
        console.log(this.state.posts.length);




    }

    toggleContainer = (postID) => {
        console.log('toggleContainer');
        console.log(postID);
        this.setState({
            showContainer:!this.state.showContainer
        })
    }

    render() {
        let showContainer = this.state.showContainer
        return (
            <div>

                <Nav />
                {showContainer ? <Container content='# hello' />
                :<BlogPost handlePostClick={this.toggleContainer} />}
                
                

            </div>
        );
    }
}

export default Home;