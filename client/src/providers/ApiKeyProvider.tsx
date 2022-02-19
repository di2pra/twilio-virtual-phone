import { createContext, FC, useCallback, useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import useAlertCard, { AlertMessageType } from "../hooks/useAlertCard";
import useApi from "../hooks/useApi";
import useForm, { FormSchema } from "../hooks/useForm";

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
  const [apiKey, setApiKey] = useState<string>(sessionStorage.getItem('apiKey') || '');
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const { setAlertMessage, alertDom } = useAlertCard({ dismissible: true });
  const { state, handleOnChange, handleOnSubmit } = useForm(stateSchema, validationStateSchema);

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

  if (apiKey === '') {
    return (
      <Container className="mt-3" fluid>
        <Row className="justify-content-md-center">
          <Col md={10}>
            <Card>
              <Card.Body>
                {alertDom}
                <Form onSubmit={(e) => { handleOnSubmit(e, updateApiKey) }}>
                  <Form.Group className="mb-3" controlId="apiKeyInput">
                    <Form.Label>API Key :</Form.Label>
                    <Form.Control disabled={isChecking} value={state.apiKeyInput.value} isInvalid={state.apiKeyInput.isInvalid} onChange={handleOnChange} placeholder="Enter your API KEY" name='apiKeyInput' />
                    <div className="invalid-feedback">{state.apiKeyInput.errorMessage}</div>
                  </Form.Group>
                  <Button disabled={isChecking} variant="primary" type="submit">{isChecking ? 'Login...' : 'Login'}</Button>
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