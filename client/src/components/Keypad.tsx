import { useCallback } from "react";
import { Button, Col, Row } from "react-bootstrap";

type Props = {
  callback?: (value: string) => void
}

export default function KeyPad({callback} : Props) {

  const onPressButton = useCallback((value: string) => {

    if(callback) {
      callback(value)
    }
  }, [callback])

  return (
    <Row className="m-3 justify-content-center">
      <Col xxl="6" xl="8">
        <Row className="mb-3">
          <Col className="text-center"><Button variant="secondary" className="px-4 py-2" type="button" onClick={() => {onPressButton("1")}} >1</Button></Col>
          <Col className="text-center"><Button variant="secondary" className="px-4 py-2" type="button" onClick={() => {onPressButton("2")}} >2</Button></Col>
          <Col className="text-center"><Button variant="secondary" className="px-4 py-2" type="button" onClick={() => {onPressButton("3")}} >3</Button></Col>
        </Row>
        <Row className="mb-3">
          <Col className="text-center"><Button variant="secondary" className="px-4 py-2" type="button" onClick={() => {onPressButton("4")}} >4</Button></Col>
          <Col className="text-center"><Button variant="secondary" className="px-4 py-2" type="button" onClick={() => {onPressButton("5")}} >5</Button></Col>
          <Col className="text-center"><Button variant="secondary" className="px-4 py-2" type="button" onClick={() => {onPressButton("6")}} >6</Button></Col>
        </Row>
        <Row className="mb-3">
          <Col className="text-center"><Button variant="secondary" className="px-4 py-2" onClick={() => {onPressButton("7")}} >7</Button></Col>
          <Col className="text-center"><Button variant="secondary" className="px-4 py-2" onClick={() => {onPressButton("8")}} >8</Button></Col>
          <Col className="text-center"><Button variant="secondary" className="px-4 py-2" onClick={() => {onPressButton("9")}} >9</Button></Col>
        </Row>
        <Row className="mb-3">
          <Col className="text-center"><Button variant="secondary" className="px-4 py-2" onClick={() => {onPressButton("*")}} >*</Button></Col>
          <Col className="text-center"><Button variant="secondary" className="px-4 py-2" onClick={() => {onPressButton("0")}} >0</Button></Col>
          <Col className="text-center"><Button variant="secondary" className="px-4 py-2" onClick={() => {onPressButton("#")}} >#</Button></Col>
        </Row>
        <Row className="mb-3">
          <Col className="text-center"></Col>
          <Col className="text-center"><Button variant="secondary" className="px-4 py-2" onClick={() => {onPressButton("+")}} >+</Button></Col>
          <Col className="text-center"><Button variant="secondary" className="px-4 py-2" onClick={() => {onPressButton("Backspace")}} >Del</Button></Col>
        </Row>
      </Col>
    </Row>
  )
}