import React from 'react';
import { Link } from 'react-router-dom';
import localStorage from 'localStorage';
import { format } from 'date-fns'
import { getHeptabaseData } from '../constantFunction'


class BlogPost extends React.Component {

    constructor(props) {
        super(props);
        this.state = { posts: [], isLoading: true };
    }

    componentDidMount() {

        // 获取数据
        getHeptabaseData.then((res) => {
            this.setState({ posts: res.data, isLoading: false })
        })

        console.log('BlogPost componentDidMount end');

    }

    componentDidUpdate() {
        console.log('BlogPost componentDidUpdate');
        console.log(this.state.posts);
    }

    // async fetch(){
    //     const heptabase_blog_data =  await getHeptabaseData()
    //     this.setState({ posts: heptabase_blog_data, isLoading: false })
    // }

    handlePostClick = (postID) => {


        console.log('handlePostClick');
        console.log(this);
        console.log(postID);
        this.props.handlePostClick(postID)
    }

    render() {

        console.log(this.state.isLoading);
        if (this.state.isLoading == false && this.state.posts != undefined) {
            console.log(this.state.posts);
            let posts = this.state.posts.cards

            let postList
            if (posts != undefined && posts != null) {


                console.log('posts.map');
                
                postList = posts.map((post) =>
                    <li key={post.id} >
                        {/* <Link to={'/post/' + post.id} > */}
                        <Link to={{ pathname: '/post/' + post.id }} >
                            <header>
                                <h2>
                                    {post.title}
                                </h2>
                            </header>
                        </Link>
                        <time>{format(new Date(post.createdTime), 'yyyy-MM-dd')}</time>

                    </li>
                )
            }

            return (
                <div className='post_list'>
                    <ul>{postList}</ul>
                </div>
            );
        }

        return <div>Loading...</div>

    }
}

export default BlogPost;