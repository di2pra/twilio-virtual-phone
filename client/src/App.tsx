import { Routes, Route, useNavigate } from "react-router-dom";
import Home from "./routes/Home";
import Settings from "./routes/Settings";
import AppLayout from "./AppLayout";
import NotFound from "./routes/NotFound";
import Message from "./routes/Message";
import NewConversationForm from "./routes/Message/NewConversationForm";
import Chat from "./routes/Message/Chat";
import EditPhoneForm from "./routes/Settings/EditPhoneForm";
import Configuration from "./routes/Configuration";
import AddApplicationForm from "./routes/Configuration/AddApplicationForm";
import ConfigLayout from "./routes/Configuration/ConfigLayout";
import AddPhoneForm from "./routes/Settings/AddPhoneForm";
import Voice from "./routes/Voice";
import Login from "./routes/Login";
import { Security, LoginCallback } from '@okta/okta-react';
import { OktaAuth, toRelativeUrl } from "@okta/okta-auth-js";
import oktaConfig from "./oktaConfig";
import Logout from "./routes/Logout";
import SecureLayout from "./SecureLayout";



function App() {

  let navigate = useNavigate();

  console.log(oktaConfig);

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
        <Route path="/" element={<SecureLayout><AppLayout /></SecureLayout>}>
          <Route index element={<Home />} />
          <Route path=":phone_id">
            <Route path="message" element={<Message />} />
            <Route path="message/new" element={<NewConversationForm />} />
            <Route path="message/:contact_number" element={<Chat />} />
            <Route path="voice" element={<Voice />} />
          </Route>
          <Route path="settings">
            <Route index element={<Settings />} />
            <Route path="phone">
              <Route path="new" element={<AddPhoneForm />} />
              <Route path=":edit_phone_id/edit" element={<EditPhoneForm />} />
            </Route>
          </Route>
          <Route path="configuration" element={<ConfigLayout />}>
            <Route index element={<Configuration />} />
            <Route path="application/new" element={<AddApplicationForm />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Security>
  )
};

export default App;