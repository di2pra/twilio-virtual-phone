import { useContext, useEffect, useState } from "react";
import { Button, Col, ListGroup, Row, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import useApi from "../../hooks/useApi";
import { PhoneContext } from "../../providers/PhoneProvider";
import { IPhoneNumber } from "../../Types";

function Settings() {

  const { phoneList } = useContext(PhoneContext);

  const { getAllNumber } = useApi();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [phoneNumberList, setPhoneNumberList] = useState<IPhoneNumber[]>([]);

  useEffect(() => {

    let isMounted = true;

    if (phoneList) {

      setIsLoading(true);
      const numbers = phoneList.map(item => item.number);

      getAllNumber(numbers).then(data => {
        if (isMounted) {
          setPhoneNumberList(data);
          setIsLoading(false)
        }
      }).catch(error => {

      })

    }

    return () => {
      isMounted = false
    }

  }, [])

  if (isLoading) {
    return (
      <Row className="justify-content-md-center">
        <Col md={10}>
          <AddNumberRow />
          <Row className="justify-content-md-center">
            <Col className="d-flex flex-column justify-content-center align-items-center">
              <Spinner animation="border" variant="danger" />
            </Col>
          </Row>
        </Col>
      </Row>
    )
  }

  return (
    <Row className="justify-content-md-center">
      <Col md={10}>
        <AddNumberRow />
        <Row>
          <Col>
            <ListGroup className="mb-3" as="ol">
              {phoneList?.map((item, index) => {

                const numberDetails = phoneNumberList.filter(twilioNumber => {
                  return twilioNumber.phoneNumber === item.number
                });

                return (
                  <ListGroup.Item
                    key={index} className="d-flex justify-content-between align-items-center"
                  >
                    <div className="ms-2 me-auto">
                      <p className="m-0 fw-light text-muted" style={{ fontSize: '0.8rem' }}>{numberDetails[0].sid}</p>
                      <p className="fw-bold m-0">{item.alias}</p>
                      <p className="my-1">{item.number}</p>
                      <p className="m-0 fw-light text-muted" style={{ fontSize: '0.8rem' }}>SMS Application ID : {numberDetails[0].smsApplicationSid}</p>
                      <p className="m-0 fw-light text-muted" style={{ fontSize: '0.8rem' }}>Voice Application ID : {numberDetails[0].voiceApplicationSid}</p>
                    </div>
                    <Link to={`/settings/phone/${item.phone_id}/edit`} state={{ selectedPhone: item }} replace>
                      <Button className="mx-2" type='button' variant='warning'>Edit</Button>
                    </Link>
                    <Button className="mx-2" type='button' variant='danger' disabled>Delete</Button>
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

function AddNumberRow() {
  return (
    <Row>
      <Col>
        <Link to={`/settings/phone/new`} replace>
          <Button className="mb-3" type='button' variant='primary'>Add New Number</Button>
        </Link>
      </Col>
    </Row>
  )
}

export default Settings;