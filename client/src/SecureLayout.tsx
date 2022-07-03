import { IDToken } from "@okta/okta-auth-js";
import { useOktaAuth } from '@okta/okta-react';
import { createContext, FC, useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { Navigate, Outlet } from "react-router-dom";

export const UserContext = createContext<{
  loggedInUser?: IDToken["claims"];
}>({});

const SecureLayout: FC = () => {

  const { authState } = useOktaAuth();

  const [loggedInUser, setLoggedInUser] = useState<IDToken["claims"]>();

  useEffect(() => {

    if (authState?.isAuthenticated) {
      setLoggedInUser(authState.idToken?.claims);
    }

  }, [authState?.isAuthenticated, authState?.idToken?.claims])

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
      <Outlet />
    </UserContext.Provider>
  )

}

export default SecureLayout;