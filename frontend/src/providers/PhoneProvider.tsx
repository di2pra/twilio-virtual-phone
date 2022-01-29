import { createContext, FC, useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { useParams } from "react-router-dom";
import Loading from "../components/Loading";
import useAlertCard, { AlertMessageType } from "../hooks/useAlertCard";
import useApi, { IPhone } from "../hooks/useApi";

export const PhoneContext = createContext<{
  phoneList: IPhone[];
  selectedPhone: IPhone | null;
  setSelectedPhone: React.Dispatch<React.SetStateAction<IPhone | null>> | null
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

  const { setAlertMessage, alertDom } = useAlertCard({dismissible: false});

  useEffect(() => {

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

  if (isLoading) {
    return <Loading />
  }

  if (alertDom) {
    return <Container className="mt-3" fluid>
      {alertDom}
    </Container>;
  }

  return (<PhoneContext.Provider value={{
    phoneList: phoneList,
    selectedPhone: selectedPhone,
    setSelectedPhone: setSelectedPhone
  }}>
    {children}
  </PhoneContext.Provider>);

}

export default PhoneProvider;