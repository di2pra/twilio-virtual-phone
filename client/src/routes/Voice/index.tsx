import { useCallback, useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import useApi from "../../hooks/useApi";
import { Device, Call } from '@twilio/voice-sdk';
import VoiceDevice from "./VoiceDevice";

function Voice() {

  const { getVoiceAccessToken } = useApi();

  const [voiceAccessToken, setVoiceAccessToken] = useState<string | null>(null);
  const [deviceName, setDeviceName] = useState<string | null>(null);
  const [device, setDevice] = useState<Device | null>(null);
  const [isPhoneConnecting, setIsPhoneConnecting] = useState<boolean>(false);

  const connectToPhone = useCallback(() => {

    let isMounted = true;

    setIsPhoneConnecting(true);

    getVoiceAccessToken().then((data) => {

      if (isMounted) {
        setVoiceAccessToken(data.token);
        setDeviceName(data.identity);
      }

    }).catch((error) => {

    });

    return () => {
      isMounted = false;
    }

  }, []);

  const disconnectPhone = useCallback(() => {

    if (device) {
      if (device.state === Device.State.Registered) {
        device.unregister();
      }
    }

  }, [device]);

  useEffect(() => {

    if (voiceAccessToken) {

      const device = new Device(voiceAccessToken, {
        logLevel: 0,
        codecPreferences: [Call.Codec.Opus, Call.Codec.PCMU]
      });

      setDevice(device);

    }

  }, [voiceAccessToken]);

  useEffect(() => {

    if (device) {
      if (device.state === Device.State.Unregistered) {
        device.register();
      }
    }


    return () => {
      if (device) {
        if (device.state === Device.State.Registered) {
          device.unregister();
        }
      }
    }

  }, [device]);

  useEffect(() => {

    if (device) {
      device.on(Device.EventName.Registered, function () {
        console.log("Twilio.Device Ready to make and receive calls!");
        setIsPhoneConnecting(false);
      });

      device.on(Device.EventName.Unregistered, function () {
        console.log("Twilio.Device is switched off!");
        device.destroy();
        setDevice(null);
      });

      device.on("error", function (error) {
        console.log("Twilio.Device Error: " + error.message);
      });

      //device.on(Device.EventName.Incoming, handleIncomingCall);

      if (device.audio) {
        // device.audio.on("deviceChange", updateAllAudioDevices.bind(device));

        // Show audio selection UI if it is supported by the browser.
        if (device.audio.isOutputSelectionSupported) {
        }
      }

    }

    return () => {

      /*if (device) {
        device.off(Device.EventName.Incoming, handleIncomingCall);
      }*/

    }

  }, [device /*, handleIncomingCall*/]);


  console.log(device);

  return (
    <Row className="justify-content-md-center">
      <Col md={10}>
        <Row className="mb-3">
          <Col>
            {device ? <Button variant="danger" onClick={() => { disconnectPhone() }}>Disconnect your phone</Button> : <Button variant="primary" onClick={() => { connectToPhone() }}>Connect your phone</Button>}
            {device ? <VoiceDevice device={device} /> : null}
          </Col>
        </Row>
      </Col>
    </Row>
  )
}

export default Voice;