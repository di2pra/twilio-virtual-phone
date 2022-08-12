import { OktaAuth, toRelativeUrl } from "@okta/okta-auth-js";
import { LoginCallback, Security } from '@okta/okta-react';
import { useEffect, useMemo } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import PhoneLayout from "./layouts/PhoneLayout";
import SecureLayout from "./layouts/SecureLayout";
import oktaConfig from "./oktaConfig";
import VoiceDeviceProvider from "./providers/VoiceDeviceProvider";
import Account from "./routes/Account";
import Home from "./routes/Home";
import Login from "./routes/Login";
import Logout from "./routes/Logout";
import Message from "./routes/Message";
import Chat from "./routes/Message/Chat";
import NewConversationForm from "./routes/Message/NewConversationForm";
import NotFound from "./routes/NotFound";
import Settings from "./routes/Settings";
import TwimlApp from "./routes/TwimlApp";
import AddTwimlAppForm from "./routes/TwimlApp/AddTwimlAppForm";
import Voice from "./routes/Voice";


function App() {

  let navigate = useNavigate();

  const oktaAuth = useMemo(() => {
    return new OktaAuth(oktaConfig);
  }, []);

  useEffect(() => {

    oktaAuth.start(); // start the service

    return () => {
      oktaAuth.stop(); // stop the service
    }

  }, [oktaAuth]);

  const restoreOriginalUri = async (_oktaAuth: OktaAuth, originalUri: string) => {
    navigate(toRelativeUrl(originalUri || '/', window.location.origin));
  };

  return (
    <Security oktaAuth={oktaAuth} restoreOriginalUri={restoreOriginalUri}>
      <Routes>
        <Route path="/login/callback" element={<LoginCallback />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/" element={<SecureLayout />}>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Home />} />
            <Route path=":phone_sid" element={<PhoneLayout />}>
              <Route path="message" element={<Message />} />
              <Route path="message/new" element={<NewConversationForm />} />
              <Route path="message/:contact_number" element={<Chat />} />
              <Route path="voice" element={<VoiceDeviceProvider><Voice /></VoiceDeviceProvider>} />
            </Route>
            <Route path="settings" element={<Settings />} />
          </Route>
          <Route path="account/init" element={<Account />} />
          <Route path="twiml/init">
            <Route index element={<TwimlApp />} />
            <Route path="add" element={<AddTwimlAppForm />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Security >
  )
};

export default App;