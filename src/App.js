import React from 'react';
import { BrowserRouter as Router, Routes,Route } from 'react-router-dom';
import PostList from './page/PostList';
import Post from './page/Post';
import Projects from './page/Projects';
import Empty from './page/404';
import About from './page/About';

// 设置路由
class App extends React.Component {
    render() {
        return (
            <Router >
                    <Routes >
                        <Route exact path="/" element={<About />} />
                        <Route path="/post/:slug" element={<Post />} />
                        <Route path="/notes/" element={<PostList />} />

                        <Route path="/404/" element={<Empty />} />
                        <Route element={<Empty />} />
                    </Routes>
            </Router>
        )
    }
}
export default App;