import { useContext, useEffect } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import AccountProvider from "./providers/AccountProvider";
import PhoneProvider, { PhoneContext } from "./providers/PhoneProvider";
import SocketProvider from "./providers/SocketProvider";
import TwimlAppProvider from "./providers/TwimlAppProvider";
import VoiceDeviceProvider from "./providers/VoiceDeviceProvider";

const LOCAL_STORE_SELECTED_PHONE_ID_KEY = 'selectedPhoneId';

function AppLayout() {

  const { phoneList, setSelectedPhone } = useContext(PhoneContext);

  let params = useParams();
  let navigate = useNavigate();

  useEffect(() => {

    if (setSelectedPhone && phoneList.length > 0) {

      const localStoragePhoneId = parseInt(localStorage.getItem(LOCAL_STORE_SELECTED_PHONE_ID_KEY) || '');
      const localStoragePhone = phoneList.filter((item) => item.phone_id === localStoragePhoneId)[0];

      const paramPhoneId = parseInt(params.phone_id || '');
      const paramPhone = phoneList.filter((item) => item.phone_id === paramPhoneId)[0];

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

        localStorage.setItem(LOCAL_STORE_SELECTED_PHONE_ID_KEY, newValue.phone_id.toString());


        return newValue;
      });
    }

  }, [params, setSelectedPhone, phoneList, navigate]);

  return (
    <AccountProvider>
      <TwimlAppProvider>
        <PhoneProvider>
          <VoiceDeviceProvider>
            <SocketProvider>
              <Outlet />
            </SocketProvider>
          </VoiceDeviceProvider>
        </PhoneProvider>
      </TwimlAppProvider>
    </AccountProvider>
  )
}

export default AppLayout;