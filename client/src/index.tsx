import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import SocketProvider from "./providers/SocketProvider";
import PhoneProvider from "./providers/PhoneProvider";
import App from './App';
import { BrowserRouter } from "react-router-dom";
import ApiKeyProvider from './providers/ApiKeyProvider';
import ConfigProvider from './providers/ConfigProvider';
import "./index.scss";
import VoiceDeviceProvider from './providers/VoiceDeviceProvider';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <ApiKeyProvider>
        <ConfigProvider>
          <PhoneProvider>
            <VoiceDeviceProvider>
              <SocketProvider><App /></SocketProvider>
            </VoiceDeviceProvider>
          </PhoneProvider>
        </ConfigProvider>
      </ApiKeyProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);