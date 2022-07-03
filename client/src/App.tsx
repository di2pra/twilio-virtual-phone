import { OktaAuth, toRelativeUrl } from "@okta/okta-auth-js";
import { LoginCallback, Security } from '@okta/okta-react';
import { Route, Routes, useNavigate } from "react-router-dom";
import AppLayout from "./AppLayout";
import oktaConfig from "./oktaConfig";
import Account from "./routes/Account";
import Configuration from "./routes/Configuration";
import Home from "./routes/Home";
import Login from "./routes/Login";
import Logout from "./routes/Logout";
import Message from "./routes/Message";
import Chat from "./routes/Message/Chat";
import NewConversationForm from "./routes/Message/NewConversationForm";
import NotFound from "./routes/NotFound";
import Settings from "./routes/Settings";
import AddPhoneForm from "./routes/Settings/AddPhoneForm";
import EditPhoneForm from "./routes/Settings/EditPhoneForm";
import Voice from "./routes/Voice";
import SecureLayout from "./SecureLayout";



function App() {

  let navigate = useNavigate();

  const oktaAuth = new OktaAuth(oktaConfig.oidc);

  const restoreOriginalUri = async (_oktaAuth: any, originalUri: string) => {

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
            <Route path=":phone_id">
              <Route path="message" element={<Message />} />
              <Route path="message/new" element={<NewConversationForm />} />
              <Route path="message/:contact_number" element={<Chat />} />
              <Route path="voice" element={<Voice />} />
            </Route>
          </Route>
          <Route path="settings">
            <Route index element={<Settings />} />
            <Route path="phone">
              <Route path="new" element={<AddPhoneForm />} />
              <Route path=":edit_phone_id/edit" element={<EditPhoneForm />} />
            </Route>
          </Route>
          <Route path="init/account" element={<Account />} />
          <Route path="init/twiml" element={<Configuration />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Security>
  )
};

export default App;