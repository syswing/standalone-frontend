import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter } from 'react-router-dom'
import App from './App';
import reportWebVitals from './reportWebVitals';
import store from './store'
import { Provider } from 'react-redux'
import { ConfirmProvider } from "material-ui-confirm";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <Provider store={store}>
    <ConfirmProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ConfirmProvider>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

reportWebVitals();
