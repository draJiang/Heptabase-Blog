import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

React.Component.prototype.$config = window.config
ReactDOM.render(<App />, document.getElementById('root'));