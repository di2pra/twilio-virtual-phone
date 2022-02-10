import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import SocketProvider from "./providers/SocketProvider";
import PhoneProvider from "./providers/PhoneProvider";
import App from './App';
import { BrowserRouter } from "react-router-dom";
import ApiKeyProvider from './providers/ApiKeyProvider';
import ConfigProvider from './providers/ConfigProvider';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <ApiKeyProvider>
        <ConfigProvider>
          <PhoneProvider>
            <SocketProvider><App /></SocketProvider>
          </PhoneProvider>
        </ConfigProvider>
      </ApiKeyProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);