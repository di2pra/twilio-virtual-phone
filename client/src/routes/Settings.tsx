import { useContext } from "react";
import { Alert, Button, Col, ListGroup, Row } from "react-bootstrap";
import { PhoneContext } from "../providers/PhoneProvider";

function Settings() {

  const { phoneList } = useContext(PhoneContext);

  return (
    <Row className="justify-content-md-center">
      <Col md={10}>
        <Row>
          <Col>
            <Button className="mb-3" type='button' variant='info'>Add New Phone</Button>
          </Col>
        </Row>
        <Row>
          <Col>
            <ListGroup className="mb-3" as="ol">
              {phoneList?.map((item, index) => {
                return (<ListGroup.Item
                  key={index} className="d-flex justify-content-between align-items-center"
                >
                  <div className="ms-2 me-auto">
                    <p className="fw-bold m-0">{item.alias}</p>
                    <p className="my-1">{item.number}</p>
                  </div>
                  <Button type='button' variant='warning'>Edit</Button>
                </ListGroup.Item>)
              })}
            </ListGroup>
          </Col>
        </Row>
        <Row>
          <Col>
            <Alert variant="info">
              <Alert.Heading>Webhook</Alert.Heading>
              <p>
                Set this url as the callback url for the added phone numbers in the Twilio Console.<br />
                <code>{`${window.location.origin}/webhook/v1/message`}</code>
              </p>
            </Alert>
          </Col>
        </Row>
      </Col>
    </Row>
  )
}

export default Settings;