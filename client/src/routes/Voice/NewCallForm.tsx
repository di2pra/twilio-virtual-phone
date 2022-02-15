import { Call, Device } from "@twilio/voice-sdk";
import { useCallback, useContext } from "react";
import { Button, Card, Form } from "react-bootstrap";
import { MdCall } from "react-icons/md";
import useForm, { FormSchema, ValidationSchema } from "../../hooks/useForm";
import { PhoneContext } from "../../providers/PhoneProvider";
import { CallMetadata } from "../../Types";

const stateSchema: FormSchema = {
  to: { value: '', errorMessage: '', isInvalid: false }
};

const validationStateSchema : ValidationSchema = {
  to: {
    required: true,
    validator: {
      regEx: /^\+[1-9]\d{1,14}$/,
      errorMessage: "Invalid E.164 Number format"
    }
  }
};

type Props = {
  device: Device
  setCurrentCall: React.Dispatch<React.SetStateAction<Call | null>>
  setCallData: React.Dispatch<React.SetStateAction<CallMetadata | null>>
}

function NewCallForm({ device, setCurrentCall, setCallData }: Props) {

  const { selectedPhone } = useContext(PhoneContext);
  const { state, handleOnChange, handleOnSubmit } = useForm(stateSchema, validationStateSchema);

  const startOutgoingCall = useCallback((state) => {

    if (selectedPhone) {
      var params = {
        From: selectedPhone.number,
        To: state.to.value
      };

      device.connect({ params }).then(call => {

        setCurrentCall(call);

        setCallData({
          type: Call.CallDirection.Outgoing,
          from: selectedPhone.number,
          to: state.to.value,
          status: call.status()
        });

      });

    }



  }, [setCurrentCall, device, setCallData, selectedPhone]);

  if(!selectedPhone) {
    return null
  }

  return (
    <Card>
      <Card.Body>
        <Form onSubmit={(e) => { handleOnSubmit(e, startOutgoingCall) }}>
          <Form.Group className="mb-3" controlId="from">
            <Form.Label>From :</Form.Label>
            <Form.Control disabled value={selectedPhone.number} name='from' type="tel" />
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
  )

}

export default NewCallForm;