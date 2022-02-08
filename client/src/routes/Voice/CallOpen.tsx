import { Call } from "@twilio/voice-sdk"
import { Button, Card, Col, Row } from "react-bootstrap"
import { MdCallEnd } from "react-icons/md"
import { CallMetadata } from "../../Types"

type Props = {
  callData: CallMetadata;
  cancelCall: () => void
}

function CallOpen({ callData, cancelCall }: Props) {
  return (
    <Card>
      <Card.Body>
        <Row>
          <Col className="text-center">
            <h2>In a call with {(callData.type === Call.CallDirection.Outgoing) ? callData.to : callData.from}</h2>
          </Col>
        </Row>
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

export default CallOpen;