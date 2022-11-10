import React from 'react';
import { Link } from 'react-router-dom';
import Nav from '../components/Nav';
import '../index.css'
import { getHeptabaseData, getClearCard, getClearImag } from '../constantFunction'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'


// class About extends React.Component {

//     constructor(props) {
//         super(props);
//         this.state = { content: '', isLoading: true };
//     }

//     componentDidMount() {

//         // 获取 Heptabase 中 About 的内容进行显示

//         getHeptabaseData.then((res) => {
//             console.log(res);
//             let card_text = getClearImag(res['pages']['about']['content'])
//             card_text = getClearCard(card_text, res.data.cards)
//             this.setState({ content: card_text })


//         })
//     }

//     render() {

//         var showdown = require('showdown'),
//             converter = new showdown.Converter(),
//             text = this.state.content,
//             html = converter.makeHtml(text);

//         return (
//             <div>
//                 <Nav />
//                 <div className='container'>

//                     <article dangerouslySetInnerHTML={{ __html: html }}></article>

//                 </div>



//             </div >
//         );
//     }
// }

function About() {
    let markdown = '# hello '
    return <div>

        <ReactMarkdown children={markdown} remarkPlugins={[]} />
    </div>

}

export default About;