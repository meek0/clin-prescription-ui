/* eslint-disable simple-import-sort/imports */
// required for the theme to be correctly applied

import 'style/themes/clin/dist/antd.css';
import 'style/themes/clin/main.css';
import './index.css';

import React from 'react';
import ReactDOM from 'react-dom';

// Import App after the style to make sure styles is apply correctly!
import App from './App';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('clin-ui'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// eslint-disable-next-line no-console
reportWebVitals(console.log);
