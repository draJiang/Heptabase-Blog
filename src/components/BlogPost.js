import React from 'react';
import { Link } from 'react-router-dom';
import localStorage from 'localStorage';
import { format } from 'date-fns'
import { getHeptabaseData } from '../constantFunction'

import Loading from '../components/Loading'

// 文章列表
class BlogPost extends React.Component {

    constructor(props) {
        super(props);
        this.state = { posts: [], isLoading: true };
    }

    componentDidMount() {
        window.history.scrollRestoration = 'auto';

        // 设置网页标题
        document.title = 'Notes'

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

    handlePostClick(){
        // 记录跳转类型
        sessionStorage.setItem('nav_type', 3)
        // 记录当前滚动的位置
        // sessionStorage.setItem('scrollY', window.scrollY)
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

                        {/* <Link to={{ pathname: '/post',query:{'note-id':post.id}}}  > */}
                        <Link to={'/post?note-id='+post.id+'&active-note-id='+post.id}  >
                            <header onClick={this.handlePostClick}>
                                {post.title}
                            </header>
                        </Link>
                        <time>{post.lastEditedTimeDiff}</time>

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
        return  <Loading />

    }
}

export default BlogPost;