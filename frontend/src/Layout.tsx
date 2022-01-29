import { useContext, useEffect } from "react";
import Container from "react-bootstrap/Container";
import { Outlet, useParams } from "react-router-dom";
import Footer from "./components/Footer";
import Header from './components/Header';
import { PhoneContext } from "./providers/PhoneProvider";

const LOCAL_STORE_SELECTED_PHONE_ID_KEY = 'selectedPhoneId';

function Layout() {

  const { phoneList, setSelectedPhone } = useContext(PhoneContext);

  let params = useParams();

  useEffect(() => {

    if (setSelectedPhone) {

      const localStoragePhoneId = parseInt(localStorage.getItem(LOCAL_STORE_SELECTED_PHONE_ID_KEY) || '');
      const localStoragePhone = phoneList.filter((item) => item.phone_id === localStoragePhoneId)[0];

      const paramPhoneId = parseInt(params.phone_id || '');
      const paramPhone = phoneList.filter((item) => item.phone_id === paramPhoneId)[0];

      setSelectedPhone((prevState) => {

        let newValue = paramPhone;

        if (prevState === null) {
          if (!paramPhone) {
            if(localStoragePhone) {
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

  }, [params, setSelectedPhone, phoneList]);

  return (
    <>
      <Header />
      <Container className="mt-3" fluid>
        <Outlet />
      </Container>
      <Footer />
    </>
  )

}

export default Layout;