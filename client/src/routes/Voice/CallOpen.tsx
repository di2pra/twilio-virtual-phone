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
        <Row className="m-3 justify-content-center">
          <Col xxl="6" xl="8">
            <Row className="mb-3">
              <Col className="text-center"><Button variant="secondary" className="px-4 py-2">1</Button></Col>
              <Col className="text-center"><Button variant="secondary" className="px-4 py-2">2</Button></Col>
              <Col className="text-center"><Button variant="secondary" className="px-4 py-2">3</Button></Col>
            </Row>
            <Row className="mb-3">
              <Col className="text-center"><Button variant="secondary" className="px-4 py-2">4</Button></Col>
              <Col className="text-center"><Button variant="secondary" className="px-4 py-2">5</Button></Col>
              <Col className="text-center"><Button variant="secondary" className="px-4 py-2">6</Button></Col>
            </Row>
            <Row className="mb-3">
              <Col className="text-center"><Button variant="secondary" className="px-4 py-2">7</Button></Col>
              <Col className="text-center"><Button variant="secondary" className="px-4 py-2">8</Button></Col>
              <Col className="text-center"><Button variant="secondary" className="px-4 py-2">9</Button></Col>
            </Row>
            <Row className="mb-3">
              <Col className="text-center"><Button variant="secondary" className="px-4 py-2">*</Button></Col>
              <Col className="text-center"><Button variant="secondary" className="px-4 py-2">0</Button></Col>
              <Col className="text-center"><Button variant="secondary" className="px-4 py-2">#</Button></Col>
            </Row>
            <Row className="mb-3">
              <Col className="text-center"></Col>
              <Col className="text-center"><Button variant="secondary" className="px-4 py-2">+</Button></Col>
              <Col className="text-center"></Col>
            </Row>
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