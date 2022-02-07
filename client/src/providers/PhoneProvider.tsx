import { createContext, FC, useCallback, useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Spinner from "react-bootstrap/Spinner";
import useAlertCard, { AlertMessageType } from "../hooks/useAlertCard";
import useApi from "../hooks/useApi";
import { IPhone } from "../Types";

export const PhoneContext = createContext<{
  phoneList: IPhone[];
  selectedPhone: IPhone | null;
  setSelectedPhone: React.Dispatch<React.SetStateAction<IPhone | null>> | null,
  setPhoneList?: React.Dispatch<React.SetStateAction<IPhone[]>>
}>({
  phoneList: [],
  selectedPhone: null,
  setSelectedPhone: null
});

const PhoneProvider: FC = ({ children }) => {

  const { getAllPhone } = useApi();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [phoneList, setPhoneList] = useState<IPhone[]>([]);
  const [selectedPhone, setSelectedPhone] = useState<IPhone | null>(null);

  const { setAlertMessage, alertDom } = useAlertCard({ dismissible: false });

  const loadPhoneList = useCallback(() => {

    setIsLoading(true);

    getAllPhone().then(
      (result) => {
        setPhoneList(result);
        setIsLoading(false);
      },
      (error) => {
        setAlertMessage(
          {
            type: AlertMessageType.ERROR,
            message: error.message
          }
        );
        setIsLoading(false);
      }
    )

  }, [getAllPhone, setAlertMessage]);

  useEffect(() => {
    loadPhoneList();
  }, [loadPhoneList]);

  if (isLoading) {
    return <div className="d-flex flex-column min-vh-100 justify-content-center align-items-center">
      <Spinner animation="border" variant="danger" />
    </div>
  }

  if (alertDom) {
    return <Container className="mt-3" fluid>
      {alertDom}
    </Container>;
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