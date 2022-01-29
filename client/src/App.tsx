import { Routes, Route } from "react-router-dom";
import Home from "./routes/Home";
import Settings from "./routes/Settings";
import Layout from "./Layout";
import NotFound from "./routes/NotFound";
import Voice from "./routes/Voice";
import Message from "./routes/Message/Message";
import NewConversationForm from "./routes/Message/NewConversationForm";
import Chat from "./routes/Message/Chat";
import NewPhoneForm from "./routes/Settings/NewPhoneForm";

function App() {

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
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
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
};

export default App;