import { useCallback, useContext, useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import useAlertCard, { AlertMessageType } from '../../hooks/useAlertCard';
import useApi from '../../hooks/useApi';
import useForm, { FormSchema } from '../../hooks/useForm';
import { PhoneContext } from '../../providers/PhoneProvider';
import { ITwilioPhoneNumber } from '../../Types';


const stateSchema: FormSchema = {
  id: { value: '', errorMessage: '', isInvalid: false },
  number: { value: '', errorMessage: '', isInvalid: false },
  alias: { value: '', errorMessage: '', isInvalid: false }
};

const validationStateSchema = {
  alias: {
    required: true
  }
};

function EditPhoneForm() {

  const { setPhoneList } = useContext(PhoneContext);
  let navigate = useNavigate();
  const location = useLocation();
  let params = useParams();
  const { setAlertMessage, alertDom } = useAlertCard({ dismissible: true });
  const { updatePhone, getPhoneById } = useApi();

  const [initState, setInitState] = useState<FormSchema>(stateSchema);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [selectedPhone, setSelectedPhone] = useState<ITwilioPhoneNumber | null>(null);

  const { state, handleOnChange, handleOnSubmit } = useForm(initState, validationStateSchema);


  useEffect(() => {

    let isMounted = true;

    const locationState = location.state as {
      selectedPhone: ITwilioPhoneNumber
    } | null;

    if (locationState === null) {

      const phoneId = parseInt(params.edit_phone_id || '');

      if (phoneId) {
        getPhoneById(phoneId).then(
          (data) => {
            if (isMounted) {
              setSelectedPhone(data);
            }
          }
        )
      }

    } else {
      setSelectedPhone(locationState.selectedPhone)
    }

    return () => {
      isMounted = false
    }

  }, [location, getPhoneById, params.edit_phone_id]);



  useEffect(() => {

    if (selectedPhone) {
      setInitState(prevState => {
        return {
          ...prevState,
          ...{
            number: { ...prevState.number, ...{ value: selectedPhone.phoneNumber } },
            alias: { ...prevState.alias, ...{ value: selectedPhone.friendlyName } },
            id: { ...prevState.id, ...{ value: selectedPhone.sid } }
          }
        };
      })
    }

  }, [selectedPhone]);


  const goBackToSettings = useCallback(() => {
    navigate(`/settings`, { replace: false });
  }, [navigate]);

  const processUpdatePhone = useCallback((state: FormSchema) => {

    let isMounted = true;

    setIsUpdating(true);
    setAlertMessage(null);

    updatePhone({
      alias: state.alias.value,
      id: state.id.value
    })
      .then(
        (data) => {

          if (isMounted) {
            if (setPhoneList) {
              setPhoneList(data);
            }
            goBackToSettings();
          }

        },
        (error) => {
          if (isMounted) {
            setIsUpdating(false);
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

  }, [updatePhone, setAlertMessage, goBackToSettings, setPhoneList]);

  if (!state.id.value) {
    return null
  }

  return (
    <Row className="justify-content-md-center">
      <Col md={10}>
        <Card>
          <Card.Body>
            {alertDom}
            <Form onSubmit={(e) => { handleOnSubmit(e, processUpdatePhone) }}>
              <Form.Group className="mb-3" controlId="alias">
                <Form.Label>Alias :</Form.Label>
                <Form.Control value={state.alias.value} name='alias' isInvalid={state.alias.isInvalid} onChange={handleOnChange} placeholder="Alias / Friendly name of the Number" />
                <div className="invalid-feedback">{state.alias.errorMessage}</div>
              </Form.Group>
              <Form.Group className="mb-3" controlId="number">
                <Form.Label>Number :</Form.Label>
                <Form.Control name='number' value={state.number.value} disabled />
              </Form.Group>
              <Button variant="primary" type="submit" disabled={isUpdating}>{isUpdating ? 'Updating...' : 'Update'}</Button>{' '}
              <Link to="/settings">
                <Button variant="danger" type="button">Cancel</Button>
              </Link>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  )
}

export default EditPhoneForm;