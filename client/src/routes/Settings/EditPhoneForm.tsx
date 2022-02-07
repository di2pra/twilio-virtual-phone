import { useCallback, useContext, useEffect, useState } from 'react';
import useForm, { FormSchema } from '../../hooks/useForm';
import useApi from '../../hooks/useApi';
import useAlertCard, { AlertMessageType } from '../../hooks/useAlertCard';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { PhoneContext } from '../../providers/PhoneProvider';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Col, Row } from 'react-bootstrap';
import { useIsMounted } from '../../hooks/useIsMounted';
import { IPhone } from '../../Types';


const stateSchema: FormSchema = {
  id: {value: '', errorMessage: '', isInvalid: false},
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
  const { isMounted } = useIsMounted();
  
  const [initState, setInitState] = useState<FormSchema>(stateSchema);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [selectedPhone, setSelectedPhone] = useState<IPhone | null>(null);

  const { state, handleOnChange, handleOnSubmit } = useForm(initState, validationStateSchema);


  useEffect(() => {

    let isComponentMounted = true;

    const locationState = location.state as {
      selectedPhone: IPhone
    } | null;

    if (locationState === null) {

      const phoneId = parseInt(params.edit_phone_id || '');

      if(phoneId) {
        getPhoneById(phoneId).then(
          (data) => {
            if(isComponentMounted) {
              setSelectedPhone(data);
            }
          }
        )
      }

    } else {
      setSelectedPhone(locationState.selectedPhone)
    }

    return () => {
      isComponentMounted = false
    }

  }, [location, getPhoneById, params.edit_phone_id]);

  

  useEffect(() => {

    if(selectedPhone) {
      setInitState(prevState => {
        return {
          ...prevState,
          ...{
            number: { ...prevState.number, ...{ value: selectedPhone.number}},
            alias : { ...prevState.alias, ...{ value: selectedPhone.alias}},
            id : { ...prevState.id, ...{ value: selectedPhone.phone_id.toString()}}
          }
        };
      })
    }

  }, [selectedPhone]);


  const goBackToSettings = useCallback(() => {
    navigate(`/settings`, { replace: false });
  }, [navigate]);

  const processUpdatePhone = useCallback((state: FormSchema) => {

    setIsUpdating(true);
    setAlertMessage(null);

    updatePhone({
      alias: state.alias.value,
      id: state.id.value
    })
      .then(
        (data) => {

          if (setPhoneList) {
            setPhoneList(data);
          }

          goBackToSettings();

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

  }, [updatePhone, setAlertMessage, isMounted, goBackToSettings, setPhoneList]);

  if(!state.id.value) {
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
              <Button variant="danger" type="button" onClick={() => { goBackToSettings() }}>Cancel</Button>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  )
}

export default EditPhoneForm;