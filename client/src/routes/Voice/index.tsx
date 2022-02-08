import { useCallback, useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import useApi from "../../hooks/useApi";
import { Device, Call } from '@twilio/voice-sdk';
import VoiceDevice from "./VoiceDevice";
import { ListGroup } from "react-bootstrap";

function Voice() {

  const { getVoiceAccessToken } = useApi();

  const [voiceAccessToken, setVoiceAccessToken] = useState<string | null>(null);
  const [device, setDevice] = useState<Device | null>(null);
  const [, setIsPhoneConnecting] = useState<boolean>(false);

  const connectToPhone = useCallback(() => {

    let isMounted = true;

    setIsPhoneConnecting(true);

    getVoiceAccessToken().then((data) => {

      if (isMounted) {
        const device = new Device(data.token, {
          codecPreferences: [Call.Codec.Opus, Call.Codec.PCMU]
        });
        setDevice(device);
      }

    }).catch((error) => {

    });

    return () => {
      isMounted = false;
    }

  }, [getVoiceAccessToken]);

  const handleRegistered = useCallback(() => {
    setIsPhoneConnecting(false);
  }, []);

  const handleUnregistered = useCallback((device : Device) => {
    setDevice(null);
  }, []);

  const disconnectPhone = useCallback(() => {

    if (device) {
      if (device.state === Device.State.Registered) {
        device.unregister().then(() => {
          device.off(Device.EventName.Registered, handleRegistered);
          device.off(Device.EventName.Unregistered, handleUnregistered);
        });
      }
    }

  }, [device]);

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

      device.on(Device.EventName.Registered, handleRegistered);
      device.on(Device.EventName.Unregistered, handleUnregistered);

    }

    return () => {
      if(device) {
        device.off(Device.EventName.Registered, handleRegistered);
        device.off(Device.EventName.Unregistered, handleUnregistered);
      }
    }

  }, [device, handleRegistered, handleUnregistered]);

  return (
    <Row className="justify-content-md-center">
      <Col md={10}>
        <Row className="mb-3">
          <Col>
            {device ? <Button variant="danger" onClick={() => { disconnectPhone() }}>Disconnect your phone</Button> : <Button variant="primary" onClick={() => { connectToPhone() }}>Connect your phone</Button>}
          </Col>
        </Row>
        {device ? <VoiceDevice device={device} /> : null}
        <Row>
          <Col>
            <ListGroup as="ol">
              <ListGroup.Item className="d-flex justify-content-between align-items-center">
                <div className="ms-2 me-auto">
                  <p className="fw-bold m-0">+33609474040</p>
                  <p className="m-0 fw-light text-muted" style={{ fontSize: '0.8rem' }}>at 2022/02/03</p>
                </div>
              </ListGroup.Item>
              <ListGroup.Item className="d-flex justify-content-between align-items-center">
                <div className="ms-2 me-auto">
                  <p className="fw-bold m-0">+33609474040</p>
                  <p className="m-0 fw-light text-muted" style={{ fontSize: '0.8rem' }}>at 2022/02/03</p>
                </div>
              </ListGroup.Item>
              <ListGroup.Item className="d-flex justify-content-between align-items-center">
                <div className="ms-2 me-auto">
                  <p className="fw-bold m-0">+33609474040</p>
                  <p className="m-0 fw-light text-muted" style={{ fontSize: '0.8rem' }}>at 2022/02/03</p>
                </div>
              </ListGroup.Item>
            </ListGroup>
          </Col>
        </Row>
      </Col>
    </Row>
  )
}

export default Voice;