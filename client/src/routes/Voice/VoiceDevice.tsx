import { Call, Device } from "@twilio/voice-sdk";
import { useCallback, useEffect, useState } from "react";
import { CallMetadata } from "../../Types";
import IncomingCallMenu from "./IncomingCallMenu";
import NewCallForm from "./NewCallForm";
import CallOpen from "./CallOpen";
import { Col, Row } from "react-bootstrap";

type Props = {
  device: Device
}

function VoiceDevice({ device }: Props) {

  const [currentCall, setCurrentCall] = useState<Call | null>(null);
  const [callData, setCallData] = useState<CallMetadata | null>(null);

  const handleIncomingCall = useCallback((call: Call) => {

    setCurrentCall(call);
    setCallData({
      type: Call.CallDirection.Incoming,
      from: call.parameters.From,
      to: call.parameters.To,
      status: call.status()
    });

  }, []);

  useEffect(() => {

    if (device) {
      device.on(Device.EventName.Incoming, handleIncomingCall);
    }

    return () => {

      if (device) {
        device.off(Device.EventName.Incoming, handleIncomingCall);
      }

    }

  }, [device, handleIncomingCall]);

  const acceptCall = useCallback(() => {

    if (currentCall) {
      if (currentCall.status() === Call.State.Pending) {
        currentCall.accept()
      }
    }

  }, [currentCall]);

  const rejectCall = useCallback(() => {

    if (currentCall) {
      if (currentCall.status() === Call.State.Pending) {
        currentCall.reject()
      }
    }

  }, [currentCall]);

  const cancelCall = useCallback(() => {

    if (currentCall) {
      currentCall.disconnect();
    }

  }, [currentCall]);


  const handleAcceptedCall = useCallback((call) => {

    setCallData(prevState => {
      if (prevState) {
        return {
          ...prevState,
          status: call.status()
        }
      } else {
        return prevState
      }
    })

  }, []);

  const handleDisconnectedCall = useCallback((call: Call) => {

    setCurrentCall(null);
    setCallData(null);

  }, []);

  useEffect(() => {

    if (currentCall) {
      currentCall.on("accept", handleAcceptedCall);
      currentCall.on("disconnect", handleDisconnectedCall);
      currentCall.on("cancel", handleDisconnectedCall);
      currentCall.on("reject", handleDisconnectedCall);
    }

    return () => {
      if (currentCall) {
        currentCall.off("accept", handleAcceptedCall);
        currentCall.off("disconnect", handleDisconnectedCall);
        currentCall.off("cancel", handleDisconnectedCall);
        currentCall.off("reject", handleDisconnectedCall);
      }
    }

  }, [currentCall, handleDisconnectedCall, handleAcceptedCall]);

  return (
    <Row className="mb-3">
      <Col>
        {callData ? null : <NewCallForm device={device} setCurrentCall={setCurrentCall} setCallData={setCallData} />}
        {(callData && (callData.status === Call.State.Open || callData.status === Call.State.Connecting)) ? <CallOpen callData={callData} cancelCall={cancelCall} /> : null}
        {(callData && callData.type === Call.CallDirection.Incoming && callData.status === Call.State.Pending) ? <IncomingCallMenu callData={callData} acceptCall={acceptCall} rejectCall={rejectCall} /> : null}
      </Col>
    </Row>
  )

}

export default VoiceDevice;