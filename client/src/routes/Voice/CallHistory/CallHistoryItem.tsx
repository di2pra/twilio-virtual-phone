import { Call, Device } from "@twilio/voice-sdk";
import { useCallback } from "react";
import { Button, ListGroup } from "react-bootstrap";
import { VscCallIncoming, VscCallOutgoing } from "react-icons/vsc";
import { CallMetadata, ICall, ITwilioPhoneNumber } from "../../../Types";

type Props = {
  call: ICall;
  selectedPhone: ITwilioPhoneNumber;
  device: Device
  setCurrentCall: React.Dispatch<React.SetStateAction<Call | null>>
  setCallData: React.Dispatch<React.SetStateAction<CallMetadata | null>>
  onDeleteCall: (id: number) => void
}

function CallHistoryItem({ onDeleteCall, call, selectedPhone, device, setCurrentCall, setCallData }: Props) {

  const makeACall = useCallback((to_number: string) => {

    var params = {
      From: selectedPhone.phoneNumber,
      To: to_number
    };

    device.connect({ params }).then(call => {

      setCurrentCall(call);

      setCallData({
        type: Call.CallDirection.Outgoing,
        from: selectedPhone.phoneNumber,
        to: to_number,
        status: call.status()
      });

    });

  }, [device, selectedPhone.phoneNumber, setCallData, setCurrentCall])

  return (
    <ListGroup.Item className="d-flex justify-content-between align-items-center">
      <div>
        {(call.from_number === selectedPhone.phoneNumber) ? <VscCallOutgoing /> : <VscCallIncoming />}
      </div>
      <div className="ms-2 me-auto">
        <p className="fw-bold m-0">{(call.from_number === selectedPhone.phoneNumber) ? call.to_number : call.from_number}</p>
        <p className="m-0 fw-light text-muted" style={{ fontSize: '0.8rem' }}>{call.created_on.toLocaleDateString()} at {call.created_on.toLocaleTimeString()}</p>
      </div>
      <Button className="mx-2" type='button' variant='primary' onClick={() => { makeACall((call.from_number === selectedPhone.phoneNumber) ? call.to_number : call.from_number) }}>Call</Button>
      <Button className="mx-2" type='button' variant='danger' onClick={() => { onDeleteCall(call.call_id) }}>Delete</Button>
    </ListGroup.Item>
  )
}

export default CallHistoryItem;