import { useContext } from "react";
import { Button } from "react-bootstrap";
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { Link } from "react-router-dom";
import { PhoneContext } from "../../providers/PhoneProvider";
import ConversationList from "./ConversationList";

function Message() {

  const { selectedPhone } = useContext(PhoneContext);

  if (!selectedPhone) {
    return null
  }

  return (
    <Row className="justify-content-md-center">
      <Col md={10}>
        <Row>
          <Col>
            <Link to={`/${selectedPhone.sid}/message/new`} replace>
              <Button className="mb-3" type='button' variant='primary'>Start new conversation</Button>
            </Link>
          </Col>
        </Row>
        <ConversationList />
      </Col>
    </Row>
  );
}

export default Message;