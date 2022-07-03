import { FC, useCallback, useState } from "react";
import { Alert, Button, Card, Col, Form, Row, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import useApi from "../hooks/useApi";
import useForm, { FormSchema, ValidationSchema } from "../hooks/useForm";


const stateSchema: FormSchema = {
  account_sid: { value: '', errorMessage: '', isInvalid: false },
  api_key: { value: '', errorMessage: '', isInvalid: false },
  api_secret: { value: '', errorMessage: '', isInvalid: false }
};

const validationStateSchema: ValidationSchema = {
  account_sid: {
    required: true
  },
  api_key: {
    required: true
  },
  api_secret: {
    required: true
  }
};


const Account: FC = () => {

  const { setAccount } = useApi();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  const { state, handleOnChange, handleOnSubmit } = useForm(stateSchema, validationStateSchema);

  let navigate = useNavigate();


  const processSaveAccountSettings = useCallback((state) => {

    setIsLoading(true);
    setError(undefined);

    setAccount({
      account_sid: state.account_sid.value,
      api_key: state.api_key.value,
      api_secret: state.api_secret.value
    }).then(() => {
      navigate('/');
    }).catch((error) => {
      setError(error.message);
    }).finally(() => {
      setIsLoading(false);
    })

  }, [setAccount])


  if (isLoading) {
    return (
      <Row className="justify-content-md-center mt-3">
        <Col md={10}>
          <Card>
            <Card.Header>Account Settings</Card.Header>
            <Card.Body>
              <div className="d-flex flex-column justify-content-center align-items-center">
                <Spinner animation="border" variant="danger" />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    )
  }

  return (
    <Row className="justify-content-md-center mt-3">
      <Col md={10}>
        <Card>
          <Card.Header>Account Settings</Card.Header>
          <Card.Body>
            {
              error ? <Alert variant="danger">
                <p className="mb-0">{error}</p>
              </Alert> : null
            }
            <Form onSubmit={(e) => { handleOnSubmit(e, processSaveAccountSettings) }}>
              <Form.Group className="mb-3" controlId="accountSid">
                <Form.Label>Account SID :</Form.Label>
                <Form.Control value={state.account_sid.value} name='account_sid' isInvalid={state.account_sid.isInvalid} onChange={handleOnChange} placeholder="ACxxxxxxxxxxxxxxx" />
                <div className="invalid-feedback">{state.account_sid.errorMessage}</div>
              </Form.Group>
              <Row>
                <Col>
                  <Form.Group className="mb-3" controlId="apiKey">
                    <Form.Label>API Key :</Form.Label>
                    <Form.Control value={state.api_key.value} name='api_key' isInvalid={state.api_key.isInvalid} onChange={handleOnChange} placeholder="SKxxxxxxxxxxxxxxx" />
                    <div className="invalid-feedback">{state.api_key.errorMessage}</div>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-3" controlId="apiSecret">
                    <Form.Label>API Secret :</Form.Label>
                    <Form.Control value={state.api_secret.value} name='api_secret' isInvalid={state.api_secret.isInvalid} onChange={handleOnChange} placeholder="xxxxxxxxxxxxxxx" type="password" />
                    <div className="invalid-feedback">{state.api_secret.errorMessage}</div>
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