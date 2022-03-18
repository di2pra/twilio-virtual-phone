import { Call } from "@twilio/voice-sdk"
import { useCallback, useContext } from "react"
import { Button, Card, Col, Row } from "react-bootstrap"
import { MdCallEnd } from "react-icons/md"
import KeyPad from "../../components/Keypad"
import { CallMetadata } from "../../Types"

type Props = {
  currentCall: Call | null;
  callData: CallMetadata;
  cancelCall: () => void
}

export default function CallOpen({ currentCall, callData, cancelCall }: Props) {

  const onKeyPressed = useCallback((value: string) => {

    if(value !== "Backspace" && currentCall) {
      currentCall.sendDigits(value);
    }

  }, [])

  return (
    <Card>
      <Card.Body>
        <Row>
          <Col className="text-center">
            <h2>In a call with {(callData.type === Call.CallDirection.Outgoing) ? callData.to : callData.from}</h2>
          </Col>
        </Row>
        <KeyPad callback={onKeyPressed} />
      </Card.Body>
      <Card.Footer>
        <Row>
          <Col className="text-center">
            <Button className="btn-circle" type="button" onClick={() => { cancelCall() }} variant="danger"><MdCallEnd /></Button>
          </Col>
        </Row>
      </Card.Footer>
    </Card>
  )
}