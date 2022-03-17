import { Button, ListGroup } from "react-bootstrap";
import { CallMetadata, ICall, IPhoneNumber } from "../../../Types";
import { VscCallIncoming, VscCallOutgoing } from "react-icons/vsc";
import { Call, Device } from "@twilio/voice-sdk";
import { useCallback } from "react";

type Props = {
  call: ICall;
  selectedPhone: IPhoneNumber;
  device: Device
  setCurrentCall: React.Dispatch<React.SetStateAction<Call | null>>
  setCallData: React.Dispatch<React.SetStateAction<CallMetadata | null>>
  onDeleteCall: (id: number) => void
}

function CallHistoryItem({ onDeleteCall, call, selectedPhone, device, setCurrentCall, setCallData }: Props) {

  const makeACall = useCallback((to_number: string) => {

    var params = {
      From: selectedPhone.number,
      To: to_number
    };

    device.connect({ params }).then(call => {

      setCurrentCall(call);

      setCallData({
        type: Call.CallDirection.Outgoing,
        from: selectedPhone.number,
        to: to_number,
        status: call.status()
      });

    });

  }, [device, selectedPhone.number, setCallData, setCurrentCall])

  return (
    <ListGroup.Item className="d-flex justify-content-between align-items-center">
      <div>
        {(call.from_number === selectedPhone.number) ? <VscCallOutgoing /> : <VscCallIncoming />}
      </div>
      <div className="ms-2 me-auto">
        <p className="fw-bold m-0">{(call.from_number === selectedPhone.number) ? call.to_number : call.from_number}</p>
        <p className="m-0 fw-light text-muted" style={{ fontSize: '0.8rem' }}>{call.created_on.toLocaleDateString()} at {call.created_on.toLocaleTimeString()}</p>
      </div>
      <Button className="mx-2" type='button' variant='primary' onClick={() => {makeACall((call.from_number === selectedPhone.number) ? call.to_number : call.from_number)}}>Call</Button>
      <Button className="mx-2" type='button' variant='danger' onClick={() => {onDeleteCall(call.call_id)}}>Delete</Button>
    </ListGroup.Item>
  )
}

export default CallHistoryItem;