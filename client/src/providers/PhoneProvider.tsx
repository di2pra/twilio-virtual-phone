import { createContext, FC, useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Spinner from "react-bootstrap/Spinner";
import { useNavigate, useParams } from "react-router-dom";
import useAlertCard, { AlertMessageType } from "../hooks/useAlertCard";
import useApi from "../hooks/useApi";
import { IPhone } from "../Types";

const LOCAL_STORE_SELECTED_PHONE_SID = 'selectedPhoneSid';

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

  let params = useParams();
  let navigate = useNavigate();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [phoneList, setPhoneList] = useState<IPhone[]>([]);
  const [selectedPhone, setSelectedPhone] = useState<IPhone | null>(null);

  const { setAlertMessage, alertDom } = useAlertCard({ dismissible: false });

  useEffect(() => {

    let isMounted = true;

    setIsLoading(true);

    getAllPhone()
      .then((appPhoneData) => isMounted ? setPhoneList(appPhoneData) : null)
      .catch((error) => isMounted ? setAlertMessage({ type: AlertMessageType.ERROR, message: error.message }) : null)
      .finally(() => isMounted ? setIsLoading(false) : null);

    return () => {
      isMounted = false;
    }


  }, [getAllPhone, setAlertMessage]);

  useEffect(() => {

    if (setSelectedPhone && phoneList.length > 0) {

      const localStoragePhoneId = localStorage.getItem(LOCAL_STORE_SELECTED_PHONE_SID) || '';
      const localStoragePhone = phoneList.filter((item) => item.sid === localStoragePhoneId)[0];

      const paramPhoneId = params.phone_id || '';
      const paramPhone = phoneList.filter((item) => item.sid === paramPhoneId)[0];

      if (!paramPhone && params.phone_id) {
        navigate('/');
      }

      setSelectedPhone((prevState) => {

        let newValue = paramPhone;

        if (prevState === null) {
          if (!paramPhone) {
            if (localStoragePhone) {
              newValue = localStoragePhone
            } else {
              newValue = phoneList[0]
            }
          }
        } else {
          if (!paramPhone) {
            newValue = prevState;
          }
        }

        localStorage.setItem(LOCAL_STORE_SELECTED_PHONE_SID, newValue.sid);


        return newValue;
      });
    }

  }, [params, setSelectedPhone, phoneList, navigate]);

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