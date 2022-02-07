import { useCallback, useContext } from "react";
import { Alert, Button, Col, ListGroup, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { PhoneContext } from "../../providers/PhoneProvider";
import { IPhone } from "../../Types";

function Settings() {

  const { phoneList } = useContext(PhoneContext);
  let navigate = useNavigate();

  const goToAddNewPhone = useCallback(() => {
    navigate(`/settings/phone/new`, { replace: false });
  }, [navigate]);

  const goToEditPhone = useCallback((phone: IPhone) => {
    navigate(`/settings/phone/${phone.phone_id}/edit`, { replace: false, state: {selectedPhone: phone} });
  }, [navigate]);

  return (
    <Row className="justify-content-md-center">
      <Col md={10}>
        <Row>
          <Col>
            <Button className="mb-3" type='button' variant='primary' onClick={() => {goToAddNewPhone()}}>Add New Phone</Button>
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
                  <Button className="mx-2" type='button' variant='warning' onClick={() => {goToEditPhone(item)}}>Edit</Button>
                  <Button className="mx-2" type='button' variant='danger' disabled>Delete</Button>
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
                Set the url below as the callback url for the added phone numbers in the Twilio Console.<br />
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