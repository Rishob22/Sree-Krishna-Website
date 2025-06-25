import React from 'react';
import ReactDOM from 'react-dom'
import App from './App';
import { BrowserRouter } from 'react-router-dom';
const root=ReactDOM.createRoot(document.getElementById('root'));
root.render(<BrowserRouter><App /></BrowserRouter>);
//wrapping the App component in the BrowserRouter so that we can use the routes