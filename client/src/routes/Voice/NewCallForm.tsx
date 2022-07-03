import { Call, Device } from "@twilio/voice-sdk";
import { useCallback, useContext, useEffect, useRef } from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { MdCall } from "react-icons/md";
import KeyPad from "../../components/Keypad";
import useForm, { FormSchema, ValidationSchema } from "../../hooks/useForm";
import { PhoneContext } from "../../providers/PhoneProvider";
import { CallMetadata } from "../../Types";

const stateSchema: FormSchema = {
  to: { value: '', errorMessage: '', isInvalid: false }
};

const validationStateSchema: ValidationSchema = {
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
  const refInput = useRef<HTMLInputElement | null>(null);

  const startOutgoingCall = useCallback((state) => {

    if (selectedPhone) {

      var params = {
        From: selectedPhone.phoneNumber,
        To: state.to.value
      };

      device.connect({ params }).then(call => {

        setCurrentCall(call);

        setCallData({
          type: Call.CallDirection.Outgoing,
          from: selectedPhone.phoneNumber,
          to: state.to.value,
          status: call.status()
        });

      });

    }


  }, [setCurrentCall, device, setCallData, selectedPhone]);

  const onKeyPressed = useCallback((value: string) => {

    if (refInput && refInput.current) {

      const lastValue = refInput.current.value;

      if (value === 'Backspace') {
        refInput.current.value = lastValue.slice(0, -1);
      } else {
        refInput.current.value = lastValue + value;
      }

      const event = new Event("input", { bubbles: true });

      // @ts-ignore: Unreachable code error
      const tracker = refInput.current._valueTracker;

      if (tracker) {
        tracker.setValue(lastValue);
      }

      refInput.current.dispatchEvent(event);

    }

  }, [refInput]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {

      if (refInput.current && refInput.current === document.activeElement) {
      } else {
        if (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+', '*', '#', 'Backspace'].includes(e.key)) {
          e.preventDefault();
          onKeyPressed(e.key);
        }
      }

    }

    document.addEventListener('keydown', handleKeyDown);

    // Don't forget to clean up
    return function () {
      document.removeEventListener('keydown', handleKeyDown);
    }
  }, [onKeyPressed]);

  if (!selectedPhone) {
    return null
  }

  return (
    <Card>
      <Form onSubmit={(e) => { handleOnSubmit(e, startOutgoingCall) }}>
        <Card.Body>
          <Row>
            <Col>
              <Form.Group className="mb-3" controlId="from">
                <Form.Label>From :</Form.Label>
                <Form.Control disabled value={selectedPhone.phoneNumber} name='from' type="tel" />
              </Form.Group>
              <Form.Group className="mb-3" controlId="to">
                <Form.Label>To :</Form.Label>
                <Form.Control ref={refInput} value={state.to.value} name='to' isInvalid={state.to.isInvalid} onChange={handleOnChange} type="tel" placeholder="Enter the Number in E.164 format : Example +33609474040" />
                <div className="invalid-feedback">{state.to.errorMessage}</div>
              </Form.Group>
            </Col>
          </Row>
          <KeyPad callback={onKeyPressed} />
        </Card.Body>
        <Card.Footer>
          <Row className="justify-content-center">
            <Col className="text-center">
              <Button className="btn-circle" type="submit" variant="success"><MdCall /></Button>
            </Col>
          </Row>
        </Card.Footer>
      </Form>
    </Card>
  )

}

export default NewCallForm;