import { useCallback, useContext } from "react";
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { PhoneContext } from "../../providers/PhoneProvider";
import ConversationList from "../../components/Message/ConversationList";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function Message() {

  const { selectedPhone } = useContext(PhoneContext);
  let navigate = useNavigate();

  const goToNewConversation = useCallback(() => {
    if (selectedPhone) {
      navigate(`/${selectedPhone.phone_id}/message/new`, { replace: false });
    }
  }, [navigate, selectedPhone]);

  return (
    <Row className="justify-content-md-center">
      <Col md={10}>
        <Row>
          <Col>
            <Button className="mb-3" type='button' variant='primary' onClick={() => { goToNewConversation() }}>Start new conversation</Button>
          </Col>
        </Row>
        <ConversationList />
      </Col>
    </Row>
  );
}

export default Message;