import React from 'react';
import Nav from '../components/Nav';
import '../index.css'
import { getHeptabaseData,getClearCard,getClearImag } from '../constantFunction'

class Post extends React.Component {

    constructor(props) {
        super(props);
        this.state = { content: '', isLoading: true };
    }

    componentWillMount() {
        //console.log(this.props.location)//传递过来的所有参数
        // console.log(this.props.location.state.key)//val值



        let heptabase_blog_data
        getHeptabaseData.then((res) => {
            heptabase_blog_data = res.data
            console.log(res);
            //获取 URL 中的文章 ID
            let post_id = window.location.pathname.replace('/post/', '')

            for (let i = 0; i < heptabase_blog_data.cards.length; i++) {
                if (heptabase_blog_data.cards[i]['id'] == post_id) {

                    let card_text = getClearImag(heptabase_blog_data.cards[i]['content'])
                    card_text = getClearCard(card_text, heptabase_blog_data.cards)

                    this.setState({ content: card_text,isLoading:false })
                    break;
                }
            }
        })



    }

    render() {


        if (this.state.isLoading) {
            return <div>Loaidng...</div>
        } else {
            let card_text = this.state.content




            var showdown = require('showdown'),
                converter = new showdown.Converter(),
                text = card_text,
                html = converter.makeHtml(text);
            // console.log(html);

            // 处理 html 中的卡片链接，首先确认是卡片，然后再获取卡片的标题和链接，获取不到则提示无效的卡片

            // 滚动到顶部
            window.scrollTo(0, 0);

            return (
                <div>
                    <Nav />
                    <div className='container'>

                        <article dangerouslySetInnerHTML={{ __html: html }}></article>

                    </div>
                </div>
            );
        }
    }

}

export default Post;