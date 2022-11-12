import React from 'react';
import { Link } from 'react-router-dom';
import localStorage from 'localStorage';
import { format } from 'date-fns'
import { getHeptabaseData } from '../constantFunction'


// 文章列表
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

    render() {

        if (this.state.isLoading == false && this.state.posts != undefined) {
            // 加载完毕
            console.log(this.state.posts);
            let posts = this.state.posts.cards

            let postList
            if (posts != undefined && posts != null) {

                postList = posts.map((post) =>
                    <li key={post.id} >
                        
                        <Link to={{ pathname: '/post/' + post.id }} >
                            <header>
                                    {post.title}
                            </header>
                        </Link>
                        <time>Last edited time:{format(new Date(post.lastEditedTime), 'yyyy-MM-dd')}</time>

                    </li>
                )
            }

            return (
                <div className='post_list'>
                    <ul>{postList}</ul>
                </div>
            );
        }

        // 加载中
        return <div></div>

    }
}

export default BlogPost;