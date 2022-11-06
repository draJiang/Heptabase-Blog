import React from 'react';
import { Link } from 'react-router-dom';

class Container extends React.Component {

    constructor(props) {
        super(props);
        this.state = { content: this.props.content };
    }

    componentDidMount() {
        console.log('Container componentDidMount');


    }

    componentDidUpdate() {
        console.log('Container componentDidUpdate');

        if (this.props.content != this.state.content) {
            this.setState({ content: this.props.content })
        }

    }

    render() {

        return (
            <article>
                <div>{this.state.content}</div>
            </article>
        );
    }
}

export default Container;