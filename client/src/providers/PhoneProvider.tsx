import { createContext, FC, useCallback, useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Spinner from "react-bootstrap/Spinner";
import useAlertCard, { AlertMessageType } from "../hooks/useAlertCard";
import useApi from "../hooks/useApi";
import { IPhoneNumber, ITwilioPhoneNumber  } from "../Types";

export const PhoneContext = createContext<{
  phoneList: IPhoneNumber[];
  selectedPhone: IPhoneNumber | null;
  setSelectedPhone: React.Dispatch<React.SetStateAction<IPhoneNumber | null>> | null,
  setPhoneList?: React.Dispatch<React.SetStateAction<IPhoneNumber[]>>
}>({
  phoneList: [],
  selectedPhone: null,
  setSelectedPhone: null
});

const PhoneProvider: FC = ({ children }) => {

  const { getAllPhone, getAllNumber } = useApi();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [phoneList, setPhoneList] = useState<IPhoneNumber[]>([]);
  const [selectedPhone, setSelectedPhone] = useState<IPhoneNumber | null>(null);

  const { setAlertMessage, alertDom } = useAlertCard({ dismissible: false });

  const loadPhoneList = useCallback(() => {

    setIsLoading(true);

    getAllPhone().then(
      (appPhoneData) => {

        const numberList = appPhoneData.map(item => item.number);

        if (numberList.length > 0) {

          getAllNumber(numberList).then((twilioPhoneData) => {

            const bothPhoneData = appPhoneData.map((item, index) => {
              return { ...item, ...twilioPhoneData[index] as ITwilioPhoneNumber }
            })

            setPhoneList(bothPhoneData);
            setIsLoading(false);

          })

        } else {
          setIsLoading(false);
        }

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

  }, [getAllPhone, getAllNumber, setAlertMessage]);

  useEffect(() => {
    loadPhoneList();
  }, [loadPhoneList]);

  if (isLoading) {
    return (
      <div className="d-flex flex-column min-vh-100 justify-content-center align-items-center">
        <Spinner animation="border" variant="danger" />
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