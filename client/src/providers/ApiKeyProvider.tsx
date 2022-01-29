import { createContext, FC, useCallback, useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
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

  const [apiKey, setApiKey] = useState<string>('');

  useEffect(() => {

    const data = sessionStorage.getItem('apiKey');

    if (data) {
      setApiKey(data);
    }

  }, []);

  const updateApiKey = useCallback((state: FormSchema) => {
    setApiKey(state.apiKeyInput.value);
    sessionStorage.setItem('apiKey', state.apiKeyInput.value);
  }, []);

  const { state, handleOnChange, handleOnSubmit } = useFormValidation(stateSchema, validationStateSchema, updateApiKey);

  if (apiKey === '') {
    return (
      <Container className="mt-3" fluid>
        <Row className="justify-content-md-center">
          <Col md={10}>
            <Card>
              <Card.Body>
                <Form onSubmit={handleOnSubmit}>
                  <Form.Group className="mb-3" controlId="apiKeyInput">
                    <Form.Label>API Key :</Form.Label>
                    <Form.Control value={state.apiKeyInput.value} isInvalid={state.apiKeyInput.isInvalid} onChange={handleOnChange} name='apiKeyInput' />
                    <div className="invalid-feedback">{state.apiKeyInput.errorMessage}</div>
                  </Form.Group>
                  <Button variant="primary" type="submit">Update Key</Button>
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