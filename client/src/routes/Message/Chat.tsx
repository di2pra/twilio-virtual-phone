import { useCallback, useContext, useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import Chatbox from "../../components/Message/Chatbox";
import { PhoneContext } from "../../providers/PhoneProvider";

function Chat() {

  const { selectedPhone } = useContext(PhoneContext);

  let navigate = useNavigate();
  let params = useParams();

  const [selectedContact, setSelectedContact] = useState<string | null>(null);

  const goToConversationList = useCallback(() => {
    if (selectedPhone) {
      navigate(`/${selectedPhone.phone_id}/message`, { replace: false });
    }
  }, [selectedPhone, navigate]);

  useEffect(() => {
    if (params.contact_number) {
      setSelectedContact(params.contact_number);
    }
  }, [params.contact_number]);

  if (!selectedPhone) {
    return null;
  }

  if (!selectedContact) {
    return null;
  }

  return (<Row className="justify-content-md-center">
    <Col md={10}>
      <Chatbox close={goToConversationList} selectedPhone={selectedPhone} contact_number={selectedContact} />
    </Col>
  </Row>);


}

export default Chat;