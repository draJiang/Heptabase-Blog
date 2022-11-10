import React from 'react';
import { BrowserRouter as Router, Routes,Route } from 'react-router-dom';
import Home from './page/Home';
import Post from './page/Post';
import Empty from './page/404';
import About from './page/About';

class App extends React.Component {
    render() {
        return (
            
            <Router >
                    <Routes >
                        <Route exact path="/" element={<Home />} />
                        {/* <Route path="/post/:id/*" element={<Post p = 'hello' />} /> */}
                        {/* <Route exact path="/post?id" element={<Post />} /> */}
                        <Route path="/post/:slug" element={<Post />} />
                        
                        
                        {/* <Route exact path="/post/:id" render={()=>{
                            console.log('renderrenderrenderrenderrender');
                            return <Post />
                        }} /> */}

                        <Route path="/about/" element={<About />} />
                        <Route path="/404/" element={<Empty />} />
                        <Route element={<Empty />} />
                    </Routes>
            </Router>
        )
    }
}
export default App;