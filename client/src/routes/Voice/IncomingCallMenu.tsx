import Card from "react-bootstrap/Card"
import Button from "react-bootstrap/Button"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import { MdCall, MdCallEnd } from "react-icons/md"
import { CallMetadata } from "../../Types"

type Props = {
  callData: CallMetadata | null;
  acceptCall: () => void;
  rejectCall: () => void
}

function IncomingCallMenu({ callData, acceptCall, rejectCall }: Props) {
  return (
    <Card>
      <Card.Body>
        <Row>
          <Col className="text-center">
            <h2>{callData?.from} is calling you...</h2>
          </Col>
        </Row>
      </Card.Body>
      <Card.Footer>
        <Row>
          <Col>
            <Button className="btn-circle" onClick={() => { acceptCall() }} variant="success"><MdCall /></Button>
          </Col>
          <Col className="text-end">
            <Button className="btn-circle" onClick={() => { rejectCall() }} variant="danger"><MdCallEnd /></Button>
          </Col>
        </Row>
      </Card.Footer>
    </Card>
  )
}

export default IncomingCallMenu;