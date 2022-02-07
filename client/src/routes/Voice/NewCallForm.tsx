import { Call, Device } from "@twilio/voice-sdk";
import { useCallback } from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { MdCall } from "react-icons/md";
import useForm, { FormSchema } from "../../hooks/useForm";
import { CallMetadata } from "../../Types";

const stateSchema: FormSchema = {
  from: { value: '+33644648641', errorMessage: '', isInvalid: false },
  to: { value: '', errorMessage: '', isInvalid: false }
};

const validationStateSchema = {
  from: {
    required: true
  },
  to: {
    required: true
  }
};

type Props = {
  device: Device
  setCurrentCall: React.Dispatch<React.SetStateAction<Call | null>>
  setCallData: React.Dispatch<React.SetStateAction<CallMetadata | null>>
}

function NewCallForm({device, setCurrentCall, setCallData} : Props) {

  const { state, handleOnChange, handleOnSubmit } = useForm(stateSchema, validationStateSchema);

  const startOutgoingCall = useCallback((state) => {

    var params = {
      To: state.to.value
    };

    device.connect({ params }).then(call => {
      setCurrentCall(call);

      setCallData({
        type: Call.CallDirection.Outgoing,
        from: state.from.value,
        to: state.to.value,
        status: call.status()
      });

    });

    

  }, [setCurrentCall, device, setCallData]);


  return (
    <Row className="justify-content-md-center">
      <Col md={6}>
        <Card>
          <Card.Body>
            <Form onSubmit={(e) => { handleOnSubmit(e, startOutgoingCall) }}>
              <Form.Group className="mb-3" controlId="from">
                <Form.Label>From :</Form.Label>
                <Form.Control disabled value={state.from.value} name='from' type="tel" />
              </Form.Group>
              <Form.Group className="mb-3" controlId="to">
                <Form.Label>To :</Form.Label>
                <Form.Control value={state.to.value} name='to' isInvalid={state.to.isInvalid} onChange={handleOnChange} type="tel" placeholder="Enter the Number in E.164 format : Example +33609474040" />
                <div className="invalid-feedback">{state.to.errorMessage}</div>
              </Form.Group>
              <Button className="btn-circle" type="submit" variant="success"><MdCall /></Button>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  )

}

export default NewCallForm;