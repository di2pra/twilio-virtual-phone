import { useCallback, useContext, useState } from 'react';
import useFormValidation, { FormSchema } from '../../hooks/useFormValidation';
import useApi from '../../hooks/useApi';
import useAlertCard, { AlertMessageType } from '../../hooks/useAlertCard';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { PhoneContext } from '../../providers/PhoneProvider';
import { useNavigate } from 'react-router-dom';
import { Col, Row } from 'react-bootstrap';


function NewConversation() {


  const { selectedPhone } = useContext(PhoneContext);
  let navigate = useNavigate();

  const [isSending, setIsSending] = useState<boolean>(false);

  const { setAlertMessage, alertDom } = useAlertCard({ dismissible: false });
  const { sendMessage } = useApi();
  const [resetForm, setResetForm] = useState<boolean>(false);

  const stateSchema: FormSchema = {
    to: { value: '', errorMessage: '', isInvalid: false },
    body: { value: '', errorMessage: '', isInvalid: false }
  };

  const validationStateSchema = {
    to: {
      required: true
    },
    body: {
      required: true,
      resetAfterSubmit: true
    }
  };

  const processSendMessage = useCallback((state) => {

    if (selectedPhone) {
      setIsSending(true);

      sendMessage({
        from: selectedPhone.number,
        to: state.to.value,
        body: state.body.value
      })
        .then(
          () => {
            setIsSending(false);
            setResetForm(prevState => !prevState)
          },
          (error) => {
            setIsSending(false);
            setAlertMessage({
              type: AlertMessageType.ERROR,
              message: error.message
            });
          }
        )
    }

  }, [selectedPhone, sendMessage, setAlertMessage]);


  const { state, handleOnChange, handleOnSubmit } = useFormValidation(stateSchema, validationStateSchema, processSendMessage, resetForm);

  const goBackToConversationList = useCallback(() => {
    if (selectedPhone) {
      navigate(`/${selectedPhone.phone_id}/message`, { replace: true });
    }
  }, [navigate, selectedPhone]);

  return (
    <Row className="justify-content-md-center">
      <Col md={10}>
        <Card>
          <Card.Body>
            {alertDom}
            <Form onSubmit={handleOnSubmit}>
              <Form.Group className="mb-3" controlId="toNumber">
                <Form.Label>To :</Form.Label>
                <Form.Control value={state.to.value} name='to' isInvalid={state.to.isInvalid} onChange={handleOnChange} type="tel" placeholder="Enter Number : Example +34569604939" />
                <div className="invalid-feedback">{state.to.errorMessage}</div>
              </Form.Group>
              <Form.Group className="mb-3" controlId="body">
                <Form.Label>Message :</Form.Label>
                <Form.Control disabled={isSending} value={state.body.value} name='body' isInvalid={state.body.isInvalid} onChange={handleOnChange} as="textarea" rows={3} placeholder='Write your message here...' />
                <div className="invalid-feedback">{state.body.errorMessage}</div>
              </Form.Group>
              <Button variant="primary" type="submit" disabled={isSending}>{isSending ? 'Sending...' : 'Send'}</Button>{' '}
              <Button variant="danger" type="button" onClick={() => { goBackToConversationList() }}>Cancel</Button>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  )
}

export default NewConversation;