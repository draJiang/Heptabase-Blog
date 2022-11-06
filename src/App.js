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
                <div>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route cache path="/post/*" element={<Post />} />
                        <Route path="/about/" element={<About />} />
                        <Route path="/404/" element={<Empty />} />
                    </Routes>
                </div>
            </Router>
        )
    }
}
export default App;