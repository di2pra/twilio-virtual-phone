import { useContext } from "react";
import { Button, Col, ListGroup, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { PhoneContext } from "../../providers/PhoneProvider";

function Settings() {

  const { phoneList } = useContext(PhoneContext);

  return (
    <Row className="justify-content-md-center">
      <Col md={10}>
        <Row>
          <Col>
            <Link to={`/settings/phone/new`} replace>
              <Button className="mb-3" type='button' variant='primary'>Add New Number</Button>
            </Link>
          </Col>
        </Row>
        <Row>
          <Col>
            <ListGroup className="mb-3" as="ol">
              {phoneList?.map((item, index) => {
                return (
                  <ListGroup.Item
                    key={index} className="d-flex justify-content-between align-items-center"
                  >
                    <div className="ms-2 me-auto">
                      <p className="fw-bold m-0">{item.alias}</p>
                      <p className="my-1">{item.number}</p>
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

export default Settings;