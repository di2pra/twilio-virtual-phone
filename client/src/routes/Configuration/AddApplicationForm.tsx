import { useCallback, useState } from 'react';
import useApi from '../../hooks/useApi';
import useAlertCard, { AlertMessageType } from '../../hooks/useAlertCard';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Col, Row } from 'react-bootstrap';
import useForm, { FormSchema, ValidationSchema } from '../../hooks/useForm';
import { Link, useNavigate } from 'react-router-dom';
import { useOktaAuth } from '@okta/okta-react/bundles/types';


const stateSchema: FormSchema = {
  friendlyName: { value: '', errorMessage: '', isInvalid: false }
};

const validationStateSchema: ValidationSchema = {
  friendlyName: {
    required: true
  }
};

function AddApplicationForm() {

  const { setAlertMessage, alertDom } = useAlertCard({ dismissible: true });

  const [isAdding, setIsAdding] = useState<boolean>(false);

  const { createApplication } = useApi();

  let navigate = useNavigate();

  const { state, handleOnChange, handleOnSubmit } = useForm(stateSchema, validationStateSchema);

  const processCreateApplication = useCallback((state) => {

    let isMounted = true;

    setIsAdding(true);
    setAlertMessage(null);

    createApplication({
      friendlyName: state.friendlyName.value
    })
      .then(
        (data) => {

          if (isMounted) {
            setIsAdding(false);
            navigate(`/configuration`, { replace: true });
          }

        },
        (error) => {
          if (isMounted) {
            setIsAdding(false);
            setAlertMessage({
              type: AlertMessageType.ERROR,
              message: error.message
            });
          }
        }
      )

    return () => {
      isMounted = false;
    }

  }, [createApplication, setAlertMessage, navigate]);



  return (
    <Row className="justify-content-md-center">
      <Col md={10}>
        <Card>
          <Card.Body>
            {alertDom}
            <Form onSubmit={(e) => { handleOnSubmit(e, processCreateApplication) }}>
              <Form.Group className="mb-3" controlId="friendlyName">
                <Form.Label>Friendly Name :</Form.Label>
                <Form.Control value={state.friendlyName.value} name='friendlyName' isInvalid={state.friendlyName.isInvalid} onChange={handleOnChange} placeholder="Alias / Friendly name" />
                <div className="invalid-feedback">{state.friendlyName.errorMessage}</div>
              </Form.Group>
              <Button variant="primary" type="submit" disabled={isAdding}>{isAdding ? 'Adding...' : 'Add'}</Button>{' '}
              <Link to="/configuration" replace>
                <Button variant="danger" type="button" >Cancel</Button>
              </Link>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  )
}

export default AddApplicationForm;