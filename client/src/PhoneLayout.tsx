import { useContext, useEffect } from "react";
import { Container } from "react-bootstrap";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { PhoneContext } from "./providers/PhoneProvider";
import SocketProvider from "./providers/SocketProvider";
import VoiceDeviceProvider from "./providers/VoiceDeviceProvider";

const LOCAL_STORE_SELECTED_PHONE_SID = 'selectedPhoneSid';

function PhoneLayout() {

  const { phoneList, setSelectedPhone } = useContext(PhoneContext);

  let params = useParams();
  let navigate = useNavigate();

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

  return (
    <VoiceDeviceProvider>
      <SocketProvider>
        <Header />
        <Container className="mt-3" fluid>
          <Outlet />
        </Container>
        <Footer />
      </SocketProvider>
    </VoiceDeviceProvider>
  )
}

export default PhoneLayout;