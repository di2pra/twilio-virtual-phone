import { Col, Row, Spinner } from "react-bootstrap";

export default function LoadingRow() {
  return (
    <Row className="justify-content-md-center">
      <Col className="d-flex flex-column justify-content-center align-items-center">
        <Spinner animation="border" variant="danger" />
      </Col>
    </Row>
  )
}