import { FC, useCallback, useContext, useEffect, useState } from "react";
import { Button, Card, Col, Form, ListGroup, Row, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import useApi from "../../hooks/useApi";
import useModalBox from "../../hooks/useModalBox";
import { ConfigContext } from "../../providers/ConfigProvider";
import { IApplication } from "../../Types";
import ApplicationItem from "./ApplicationItem";

const Account: FC = () => {

  const { updateConfig } = useContext(ConfigContext);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [applicationList, setApplicationList] = useState<IApplication[]>([]);


  const handleOnConfirmSelectApplication = useCallback((context: IApplication | undefined) => {

    if (context && updateConfig) {
      updateConfig(context)
    }

  }, [updateConfig]);

  if (isLoading) {
    return (
      <div className="d-flex flex-column min-vh-100 justify-content-center align-items-center">
        <Spinner animation="border" variant="danger" />
      </div>
    )
  }

  return (
    <Row className="justify-content-md-center mt-3">
      <Col md={10}>
        <Card>
          <Card.Body>
            <h3>Application Settings</h3>
            <Form>
              <Form.Group className="mb-3" controlId="accountSid">
                <Form.Label>Account SID :</Form.Label>
                <Form.Control placeholder="ACxxxxxxxxxxxxxxx" />
                <div className="invalid-feedback">{ }</div>
              </Form.Group>
              <Row>
                <Col>
                  <Form.Group className="mb-3" controlId="friendlyName">
                    <Form.Label>API Key :</Form.Label>
                    <Form.Control placeholder="SKxxxxxxxxxxxxxxx" />
                    <div className="invalid-feedback">{ }</div>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-3" controlId="friendlyName">
                    <Form.Label>API Secret :</Form.Label>
                    <Form.Control placeholder="xxxxxxxxxxxxxxx" type="password" />
                    <div className="invalid-feedback">{ }</div>
                  </Form.Group>
                </Col>
              </Row>
              <Button variant="primary" type="submit">Save</Button>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  )
}

export default Account;