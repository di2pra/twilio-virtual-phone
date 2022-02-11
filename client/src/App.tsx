import { Routes, Route } from "react-router-dom";
import Home from "./routes/Home";
import Settings from "./routes/Settings";
import AppLayout from "./AppLayout";
import NotFound from "./routes/NotFound";
import Voice from "./routes/Voice";
import Message from "./routes/Message";
import NewConversationForm from "./routes/Message/NewConversationForm";
import Chat from "./routes/Message/Chat";
import NewPhoneForm from "./routes/Settings/NewPhoneForm";
import EditPhoneForm from "./routes/Settings/EditPhoneForm";
import Configuration from "./routes/Configuration";
import AddApplicationForm from "./routes/Configuration/AddApplicationForm";
import ConfigLayout from "./routes/Configuration/ConfigLayout";

function App() {

  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
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
            <Route path="new" element={<NewPhoneForm />} />
            <Route path=":edit_phone_id/edit" element={<EditPhoneForm />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Route>
      <Route path="configuration" element={<ConfigLayout />}>
        <Route index element={<Configuration />} />
        <Route path="application/new" element={<AddApplicationForm />} />
      </Route>
    </Routes>
  )
};

export default App;