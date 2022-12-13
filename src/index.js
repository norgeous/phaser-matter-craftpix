import React from 'react';
import ReactDOM from 'react-dom';
// import { AppProvider } from './contexts/AppContext';
import App from './components/App';

const rootElement = document.getElementById('root');
// ReactDOM.render(
//   (
//     <AppProvider>
//       <h1>react app</h1>
//     </AppProvider>
//   ),
//   rootElement,
// );
ReactDOM.render(
  (
      <App />
  ),
  rootElement,
);
