import { createContext, FC, useCallback, useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Spinner from "react-bootstrap/Spinner";
import useAlertCard, { AlertMessageType } from "../hooks/useAlertCard";
import useApi from "../hooks/useApi";
import { Device, Call } from '@twilio/voice-sdk';

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

  const loadDevice = useCallback(() => {

    setIsLoading(true);

    getVoiceAccessToken().then((data) => {

      const device = new Device(data.token, {
        codecPreferences: [Call.Codec.Opus, Call.Codec.PCMU]
      });

      setDevice(device);

    }).catch((error) => {

      setAlertMessage(
        {
          type: AlertMessageType.ERROR,
          message: error.message
        }
      );

      setIsLoading(false);

    });


  }, [getVoiceAccessToken, setAlertMessage]);

  const handleRegistered = useCallback(() => {
    setIsLoading(false);
  }, []);

  const handleUnregistered = useCallback((device: Device) => {
    setDevice(null);
  }, []);

  useEffect(() => {
    loadDevice();
  }, [loadDevice]);

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
      if (device) {
        device.off(Device.EventName.Registered, handleRegistered);
        device.off(Device.EventName.Unregistered, handleUnregistered);
      }
    }

  }, [device, handleRegistered, handleUnregistered]);

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
      <Container className="mt-3" fluid>
        {alertDom}
      </Container>
    );
  }

  return (<VoiceDeviceContext.Provider value={{
    device: device
  }}>
    {children}
  </VoiceDeviceContext.Provider>);

}

export default VoiceDeviceProvider;