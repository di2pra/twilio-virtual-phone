import { ListGroup } from "react-bootstrap";
import { ICall, IPhoneNumber } from "../../../Types";
import { VscCallIncoming, VscCallOutgoing } from "react-icons/vsc";

type Props = {
  call: ICall;
  selectedPhone: IPhoneNumber
}

function CallHistoryItem({ call, selectedPhone }: Props) {
  return (
    <ListGroup.Item className="d-flex justify-content-between align-items-center">
      <div>
        {(call.from_number === selectedPhone.number) ? <VscCallOutgoing /> : <VscCallIncoming />}
      </div>
      <div className="ms-2 me-auto">
        <p className="fw-bold m-0">{(call.from_number === selectedPhone.number) ? call.to_number : call.from_number}</p>
        <p className="m-0 fw-light text-muted" style={{ fontSize: '0.8rem' }}>{call.created_on.toLocaleDateString()} at {call.created_on.toLocaleTimeString()}</p>
      </div>
    </ListGroup.Item>
  )
}

export default CallHistoryItem;