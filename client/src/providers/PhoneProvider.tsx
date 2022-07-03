import { createContext, FC, useCallback, useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Spinner from "react-bootstrap/Spinner";
import useAlertCard, { AlertMessageType } from "../hooks/useAlertCard";
import useApi from "../hooks/useApi";
import { ITwilioPhoneNumber } from "../Types";

export const PhoneContext = createContext<{
  phoneList: ITwilioPhoneNumber[];
  selectedPhone: ITwilioPhoneNumber | null;
  setSelectedPhone: React.Dispatch<React.SetStateAction<ITwilioPhoneNumber | null>> | null,
  setPhoneList?: React.Dispatch<React.SetStateAction<ITwilioPhoneNumber[]>>
}>({
  phoneList: [],
  selectedPhone: null,
  setSelectedPhone: null
});

const PhoneProvider: FC = ({ children }) => {

  const { getAllPhone } = useApi();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [phoneList, setPhoneList] = useState<ITwilioPhoneNumber[]>([]);
  const [selectedPhone, setSelectedPhone] = useState<ITwilioPhoneNumber | null>(null);

  const { setAlertMessage, alertDom } = useAlertCard({ dismissible: false });

  const loadPhoneList = useCallback(() => {

    setIsLoading(true);

    getAllPhone().then(
      (appPhoneData) => {

        setPhoneList(appPhoneData);
        setIsLoading(false);

      }).catch(
        (error) => {
          setAlertMessage(
            {
              type: AlertMessageType.ERROR,
              message: error.message
            }
          );
          setIsLoading(false);
        })

  }, [getAllPhone, setAlertMessage]);

  useEffect(() => {
    loadPhoneList();
  }, [loadPhoneList]);

  if (isLoading) {
    return (
      <div className="d-flex flex-column min-vh-100 justify-content-center align-items-center">
        <Spinner className="mb-3" animation="border" variant="danger" />
        <h3>Loading Phone Numbers...</h3>
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

  return (<PhoneContext.Provider value={{
    phoneList: phoneList,
    selectedPhone: selectedPhone,
    setSelectedPhone: setSelectedPhone,
    setPhoneList: setPhoneList
  }}>
    {children}
  </PhoneContext.Provider>);

}

export default PhoneProvider;