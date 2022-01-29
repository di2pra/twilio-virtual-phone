import { createContext, FC, useCallback, useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import useAlertCard, { AlertMessageType } from "../hooks/useAlertCard";
import useApi from "../hooks/useApi";
import useFormValidation, { FormSchema } from "../hooks/useFormValidation";

export const ApiKeyContext = createContext<{
  apiKey: string;
}>({
  apiKey: ''
});

const stateSchema: FormSchema = {
  apiKeyInput: { value: '', errorMessage: '', isInvalid: false }
};

const validationStateSchema = {
  apiKeyInput: {
    required: true
  }
};

const ApiKeyProvider: FC = ({ children }) => {

  const {checkApiKey} = useApi();
  const [apiKey, setApiKey] = useState<string>('');
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const { setAlertMessage, alertDom } = useAlertCard({ dismissible: true });

  useEffect(() => {

    const data = sessionStorage.getItem('apiKey');

    if (data) {
      setApiKey(data);
    }

  }, []);

  const updateApiKey = useCallback((state: FormSchema) => {

    setAlertMessage(null);
    setIsChecking(true);

    checkApiKey(state.apiKeyInput.value).then(
      (res) => {
        setApiKey(state.apiKeyInput.value);
        sessionStorage.setItem('apiKey', state.apiKeyInput.value);
        setIsChecking(false);
      },
      (err) => {
        setAlertMessage(
          {
            type: AlertMessageType.ERROR,
            message: err.message
          }
        )
        setIsChecking(false);
      }
    )
    
  }, [setAlertMessage, checkApiKey]);

  const { state, handleOnChange, handleOnSubmit } = useFormValidation(stateSchema, validationStateSchema, updateApiKey);

  if (apiKey === '') {
    return (
      <Container className="mt-3" fluid>
        <Row className="justify-content-md-center">
          <Col md={10}>
            <Card>
              <Card.Body>
                {alertDom}
                <Form onSubmit={handleOnSubmit}>
                  <Form.Group className="mb-3" controlId="apiKeyInput">
                    <Form.Label>API Key :</Form.Label>
                    <Form.Control disabled={isChecking} value={state.apiKeyInput.value} isInvalid={state.apiKeyInput.isInvalid} onChange={handleOnChange} placeholder="Enter your API KEY" name='apiKeyInput' />
                    <div className="invalid-feedback">{state.apiKeyInput.errorMessage}</div>
                  </Form.Group>
                  <Button disabled={isChecking} variant="primary" type="submit">{isChecking ? 'Checking...' : 'Set Key'}</Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <ApiKeyContext.Provider value={{
      apiKey: apiKey
    }}>
      {children}
    </ApiKeyContext.Provider>
  );

}

export default ApiKeyProvider;