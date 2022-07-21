import { FC, useCallback, useState } from "react";
import { Alert, Button, Card, Col, Form, Row, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import useApi from "../hooks/useApi";
import useForm, { FormSchema, ValidationSchema } from "../hooks/useForm";


const stateSchema: FormSchema = {
  account_sid: { value: '', errorMessage: '', isInvalid: false },
  auth_token: { value: '', errorMessage: '', isInvalid: false },
  key_sid: { value: '', errorMessage: '', isInvalid: false },
  key_secret: { value: '', errorMessage: '', isInvalid: false }
};

const validationStateSchema: ValidationSchema = {
  account_sid: {
    required: true
  },
  auth_token: {
    required: true
  },
  key_sid: {
    required: true
  },
  key_secret: {
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
      auth_token: state.auth_token.value,
      key_sid: state.key_sid.value,
      key_secret: state.key_secret.value
    })
      .then(() => navigate('/'))
      .catch((error) => {
        setError(error.message);
        setIsLoading(false);
      })

  }, [setAccount, navigate])


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
              <Form.Group className="mb-3" controlId="account_sid">
                <Form.Label>Account SID :</Form.Label>
                <Form.Control value={state.account_sid.value} name='account_sid' isInvalid={state.account_sid.isInvalid} onChange={handleOnChange} placeholder="ACxxxxxxxxxxxxxxx" />
                <div className="invalid-feedback">{state.account_sid.errorMessage}</div>
              </Form.Group>
              <Form.Group className="mb-3" controlId="auth_token">
                <Form.Label>Auth Token :</Form.Label>
                <Form.Control value={state.auth_token.value} name='auth_token' isInvalid={state.auth_token.isInvalid} onChange={handleOnChange} placeholder="xxxxxxxxxxxxxxx" type="password" />
                <div className="invalid-feedback">{state.auth_token.errorMessage}</div>
              </Form.Group>
              <Form.Group className="mb-3" controlId="key_sid">
                <Form.Label>Key SID :</Form.Label>
                <Form.Control value={state.key_sid.value} name='key_sid' isInvalid={state.key_sid.isInvalid} onChange={handleOnChange} placeholder="SKxxxxxxxxx" type="text" />
                <div className="invalid-feedback">{state.key_sid.errorMessage}</div>
              </Form.Group>
              <Form.Group className="mb-3" controlId="key_secret">
                <Form.Label>Key Secret :</Form.Label>
                <Form.Control value={state.key_secret.value} name='key_secret' isInvalid={state.key_secret.isInvalid} onChange={handleOnChange} placeholder="xxxxxxxxxxxxxxx" type="password" />
                <div className="invalid-feedback">{state.key_secret.errorMessage}</div>
              </Form.Group>
              <Button variant="primary" type="submit">Save</Button>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  )

}

export default Account;