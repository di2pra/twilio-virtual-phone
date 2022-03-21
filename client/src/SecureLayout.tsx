import { createContext, FC, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import ConfigProvider from "./providers/ConfigProvider";
import PhoneProvider from "./providers/PhoneProvider";
import { useOktaAuth } from '@okta/okta-react';
import { Spinner } from "react-bootstrap";
import VoiceDeviceProvider from "./providers/VoiceDeviceProvider";
import SocketProvider from "./providers/SocketProvider";
import { IUser } from "./Types";

export const UserContext = createContext<{
  loggedInUser?: IUser;
}>({});

const SecureLayout: FC = ({ children }) => {

  const { oktaAuth, authState } = useOktaAuth();

  const [loggedInUser, setLoggedInUser] = useState<IUser>();

  useEffect(() => {

    if(authState && authState.isAuthenticated) {
      oktaAuth.getUser().then((data) => {
        setLoggedInUser(data as IUser);
      }).catch((error) => {
        oktaAuth.signOut()
      });
    }
    
 }, [oktaAuth, authState])

  if (!authState) {
    return (
      <div className="d-flex flex-column min-vh-100 justify-content-center align-items-center">
        <Spinner className="mb-3" animation="border" variant="danger" />
        <h3>Checking authentication status...</h3>
      </div>
    );
  }

  if (!authState.isAuthenticated) {
    return <Navigate to="/login" />
  }

  if (!loggedInUser) {
    return (
      <div className="d-flex flex-column min-vh-100 justify-content-center align-items-center">
        <Spinner className="mb-3" animation="border" variant="danger" />
        <h3>Loading user information...</h3>
      </div>
    );
  }

  return (
    <UserContext.Provider value={{
      loggedInUser: loggedInUser
    }}>
    <ConfigProvider>
      <PhoneProvider>
        <VoiceDeviceProvider>
          <SocketProvider>
            {children}
          </SocketProvider>
        </VoiceDeviceProvider>
      </PhoneProvider>
    </ConfigProvider>
    </UserContext.Provider>
  )

}

export default SecureLayout;