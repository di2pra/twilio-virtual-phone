import { Call, Device } from '@twilio/voice-sdk';
import { createContext, FC, useCallback, useEffect, useState } from "react";
import { Col, Row } from 'react-bootstrap';
import Spinner from "react-bootstrap/Spinner";
import useAlertCard, { AlertMessageType } from "../hooks/useAlertCard";
import useApi from "../hooks/useApi";

export const VoiceDeviceContext = createContext<{
  device: Device | null;
}>({
  device: null
});

const VoiceDeviceProvider: FC = ({ children }) => {

  const { getVoiceAccessToken } = useApi();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [device, setDevice] = useState<Device | null>(null);

  const { setAlertMessage, alertDom } = useAlertCard({ dismissible: false });

  useEffect(() => {

    let isMounted = true;
    let newDevice: Device;

    setIsLoading(true);

    getVoiceAccessToken()
      .then((data) => {

        if (isMounted) {
          newDevice = new Device(data.token, {
            codecPreferences: [Call.Codec.Opus, Call.Codec.PCMU]
          });

          setDevice(newDevice);
        }

      })
      .catch((error) => isMounted ? setAlertMessage({ type: AlertMessageType.ERROR, message: error.message }) : null)
      .finally(() => setIsLoading(false));

    return () => {
      isMounted = false;
      if (newDevice) {
        newDevice.destroy();
      }
    }

  }, [getVoiceAccessToken, setAlertMessage]);

  const visibilitychangeListener = useCallback(() => {
    if (document.visibilityState === 'visible') {
      if (!device) {

        setIsLoading(true);

        getVoiceAccessToken()
          .then((data) => {

            let newDevice = new Device(data.token, {
              codecPreferences: [Call.Codec.Opus, Call.Codec.PCMU]
            });

            setDevice(newDevice);

          })
          .catch((error) => setAlertMessage({ type: AlertMessageType.ERROR, message: error.message }))
          .finally(() => setIsLoading(false));
      }
    }
  }, [device, getVoiceAccessToken, setAlertMessage]);

  useEffect(() => {
    document.addEventListener("visibilitychange", visibilitychangeListener);

    return () => {
      document.removeEventListener("visibilitychange", visibilitychangeListener)
    }
  }, [visibilitychangeListener]);

  const handleUnregistered = useCallback((device: Device) => {
    setDevice(null);
  }, []);

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

  const refreshDeviceToken = useCallback((device: Device) => {

    getVoiceAccessToken().then((data) => {
      device.updateToken(data);
    });

  }, [getVoiceAccessToken]);

  useEffect(() => {

    if (device) {
      device.on(Device.EventName.Unregistered, handleUnregistered);
      device.on(Device.EventName.TokenWillExpire, refreshDeviceToken);
    }

    return () => {
      if (device) {
        device.off(Device.EventName.Unregistered, handleUnregistered);
        device.off(Device.EventName.TokenWillExpire, refreshDeviceToken);
      }
    }

  }, [device, handleUnregistered, refreshDeviceToken]);

  if (isLoading) {
    return (
      <div className="d-flex flex-column min-vh-100 justify-content-center align-items-center">
        <Spinner className="mb-3" animation="border" variant="danger" />
        <h3>Loading Device...</h3>
      </div>
    );
  }

  if (alertDom) {
    return (
      <Row className="justify-content-md-center">
        <Col md={10}>
          {alertDom}
        </Col>
      </Row>
    );
  }

  return (<VoiceDeviceContext.Provider value={{
    device: device
  }}>
    {children}
  </VoiceDeviceContext.Provider>);

}

export default VoiceDeviceProvider;