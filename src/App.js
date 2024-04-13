import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PostList from './page/PostList';
import Post from './page/Post';
import Chat from './page/Chat';
import Empty from './page/404';
import Activity from './page/Activity';

import CONFIG from "./config";
// import { NextUIProvider } from "@nextui-org/system";

// import generateSitemap from './sitemap';


// 设置路由
function App() {

    return (
        // <ScrollToTop>
        // <NextUIProvider>
        <Router >
            <Routes >
                <Route exact path="/" element={<Post title={CONFIG.title} />} />
                <Route exact path="/chat" element={<Chat />} />
                <Route path="/post/*" element={<Post title={CONFIG.title} />} />
                <Route path="/notes/" element={<PostList title={CONFIG.title} />} />
                <Route path="/activity" element={<Activity />} />

                <Route path="/404/" element={<Empty title={CONFIG.title} />} />
                <Route element={<Empty title={CONFIG.title} />} />

                {/* <Route path="/sitemap.xml" render={generateSitemap} /> */}

            </Routes>
        </Router>
        // </NextUIProvider>
        // </ScrollToTop>
    )
}
export default App;