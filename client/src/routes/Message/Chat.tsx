import { useContext, useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";
import Chatbox from "./Chatbox";
import { PhoneContext } from "../../providers/PhoneProvider";

function Chat() {

  const { selectedPhone } = useContext(PhoneContext);

  let params = useParams();

  const [selectedContact, setSelectedContact] = useState<string | null>(null);

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

  return (
    <Row className="justify-content-md-center">
      <Col md={10}>
        <Chatbox selectedPhone={selectedPhone} contact_number={selectedContact} />
      </Col>
    </Row>
  );


}

export default Chat;