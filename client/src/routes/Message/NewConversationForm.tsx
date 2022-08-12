import { useCallback, useContext, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import { Link, useNavigate } from 'react-router-dom';
import useAlertCard, { AlertMessageType } from '../../hooks/useAlertCard';
import useApi from '../../hooks/useApi';
import useForm, { FormSchema, ValidationSchema } from '../../hooks/useForm';
import { PhoneContext } from '../../providers/PhoneProvider';


const stateSchema: FormSchema = {
  to: { value: '', errorMessage: '', isInvalid: false },
  body: { value: '', errorMessage: '', isInvalid: false }
};

const validationStateSchema: ValidationSchema = {
  to: {
    required: true,
    validator: {
      regEx: /^\+[1-9]\d{1,14}$/,
      errorMessage: "Invalid E.164 Number format"
    }
  },
  body: {
    required: true
  }
};

function NewConversationForm() {

  const { selectedPhone } = useContext(PhoneContext);
  let navigate = useNavigate();
  const { setAlertMessage, alertDom } = useAlertCard({ dismissible: false });
  const { sendMessage } = useApi();
  const { state, handleOnChange, handleOnSubmit } = useForm(stateSchema, validationStateSchema);

  const [isSending, setIsSending] = useState<boolean>(false);

  const goToConversation = useCallback((number: string) => {
    if (selectedPhone) {
      navigate(`/${selectedPhone.sid}/message/${number}`, { replace: false });
    }
  }, [navigate, selectedPhone]);

  const processSendMessage = useCallback((state) => {

    let isMounted = true;

    if (selectedPhone) {
      setIsSending(true);

      sendMessage({
        from_sid: selectedPhone.sid,
        to_number: state.to.value,
        body: state.body.value
      })
        .then(() => {
          if (isMounted) {
            setIsSending(false);
            goToConversation(state.to.value);
          }
        })
        .catch((error) => {
          if (isMounted) {
            setIsSending(false);
            setAlertMessage({
              type: AlertMessageType.ERROR,
              message: error.message
            });
          }
        })
    }

    return () => {
      isMounted = false;
    }

  }, [selectedPhone, sendMessage, setAlertMessage, goToConversation]);



  if (!selectedPhone) {
    return null
  }

  return (
    <Row className="justify-content-md-center">
      <Col md={10}>
        <Card>
          <Card.Body>
            {alertDom}
            <Form onSubmit={(e) => { handleOnSubmit(e, processSendMessage) }}>
              <Form.Group className="mb-3" controlId="fromNumber">
                <Form.Label>From :</Form.Label>
                <Form.Control disabled value={selectedPhone.phoneNumber} name='fromNumber' type="tel" />
              </Form.Group>
              <Form.Group className="mb-3" controlId="to">
                <Form.Label>To :</Form.Label>
                <Form.Control value={state.to.value} name='to' isInvalid={state.to.isInvalid} onChange={handleOnChange} type="tel" placeholder="Enter the Number in E.164 format : Example +33609474040" />
                <div className="invalid-feedback">{state.to.errorMessage}</div>
              </Form.Group>
              <Form.Group className="mb-3" controlId="body">
                <Form.Label>Message :</Form.Label>
                <Form.Control disabled={isSending} value={state.body.value} name='body' isInvalid={state.body.isInvalid} onChange={handleOnChange} as="textarea" rows={3} placeholder='Write your message here...' />
                <div className="invalid-feedback">{state.body.errorMessage}</div>
              </Form.Group>
              <Button variant="primary" type="submit" disabled={isSending}>{isSending ? 'Sending...' : 'Send'}</Button>{' '}
              <Link to={`/${selectedPhone.sid}/message`} replace>
                <Button variant="danger" type="button">Cancel</Button>
              </Link>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  )
}

export default NewConversationForm;