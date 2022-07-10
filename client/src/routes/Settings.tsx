import { useCallback, useContext, useEffect, useState } from "react";
import { Alert } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import ListGroup from "react-bootstrap/ListGroup";
import Row from "react-bootstrap/Row";
import LoadingRow from "../components/LoadingRow";
import useApi from "../hooks/useApi";
import { PhoneContext } from "../providers/PhoneProvider";
import { ITwilioPhoneNumber } from "../Types";

export default function Settings() {

  const { phoneList, setPhoneList } = useContext(PhoneContext);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>();

  const [twilioNumberList, setTwilioNumberList] = useState<ITwilioPhoneNumber[]>([]);

  const { getAllNumber, addPhone } = useApi();

  useEffect(() => {

    let isMounted = true;

    getAllNumber()
      .then(data => isMounted ? setTwilioNumberList(data) : null)
      .catch((error) => isMounted ? setError(error.message) : null)
      .finally(() => isMounted ? setIsLoading(false) : null);


    return () => {
      isMounted = false
    }

  }, [getAllNumber]);

  const addPhoneHandler = useCallback((sid: string) => {

    setIsLoading(true);

    addPhone(sid)
      .then((data) => setPhoneList ? setPhoneList(data) : null)
      .catch((error) => setError(error.message))
      .finally(() => setIsLoading(false));

  }, [addPhone, setPhoneList]);

  if (isLoading) {
    return (
      <Row className="justify-content-md-center">
        <Col md={10}>
          <LoadingRow />
        </Col>
      </Row>
    );
  }

  if (error) {
    return (
      <Row className="justify-content-md-center">
        <Col md={10}>
          <Alert variant="danger">{error}</Alert>
        </Col>
      </Row>
    );
  }

  return (
    <Row className="justify-content-md-center">
      <Col md={10}>
        <Row>
          <Col>
            <ListGroup className="mb-3" as="ol">
              {twilioNumberList.map((item, index) => {
                return (
                  <ListGroup.Item
                    key={index} className="d-flex justify-content-between align-items-center"
                  >
                    <div className="ms-2 me-auto">
                      <p className="m-0 fw-light text-muted" style={{ fontSize: '0.8rem' }}>{item.sid}</p>
                      <p className="fw-bold m-0">{item.friendlyName}</p>
                      <p className="my-1">{item.phoneNumber}</p>
                      <p className="m-0 fw-light text-muted" style={{ fontSize: '0.8rem' }}>SMS Application ID : {item.smsApplicationSid}</p>
                      <p className="m-0 fw-light text-muted" style={{ fontSize: '0.8rem' }}>Voice Application ID : {item.voiceApplicationSid}</p>
                    </div>
                    {
                      phoneList.map(item => item.sid).includes(item.sid) ? null : <Button className="mx-2" type='button' variant='primary' onClick={() => addPhoneHandler(item.sid)}>Add</Button>
                    }
                  </ListGroup.Item>
                )
              })}
            </ListGroup>
          </Col>
        </Row>
      </Col>
    </Row>
  )
}



/*<Row>
<Col>
  <Alert variant="success">
    <Alert.Heading>Twiml Application</Alert.Heading>
    <hr />
    <div className="ms-2 me-auto">
      <p className="m-0 fw-light text-muted" style={{ fontSize: '0.8rem' }}>{config?.twimlApp.sid}</p>
      <p className="fw-bold m-0">{config?.twimlApp.friendlyName}</p>
      <p className="m-0 fw-light text-muted" style={{ fontSize: '0.8rem' }}>SMS URL : {config?.twimlApp.smsUrl}</p>
      <p className="m-0 fw-light text-muted" style={{ fontSize: '0.8rem' }}>Voice URL : {config?.twimlApp.voiceUrl}</p>
    </div>
  </Alert>
</Col>
</Row>*/