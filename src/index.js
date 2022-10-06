import React from 'react';
// import ReactDOM from 'react-dom/client';
import ReactDOM from "react-dom";
import './index.css';
import App from './App/App.js';
// import reportWebVitals from './reportWebVitals';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';


const rootElement = document.getElementById("root");
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
  , rootElement);

/** root.render method is commented out as it brakes the wavesurfer react project that is used by this project. */
// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );




