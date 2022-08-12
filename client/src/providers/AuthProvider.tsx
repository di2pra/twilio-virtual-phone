import { IDToken } from "@okta/okta-auth-js";
import { useOktaAuth } from '@okta/okta-react';
import { createContext, FC, useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";

export const AuthContext = createContext<{
  loggedInUser?: IDToken["claims"];
}>({});

const AuthProvider: FC = ({ children }) => {

  const { authState } = useOktaAuth();
  const [loggedInUser, setLoggedInUser] = useState<IDToken["claims"]>();

  useEffect(() => {

    if (authState?.isAuthenticated) {
      setLoggedInUser(authState.idToken?.claims);
    }

  }, [authState?.isAuthenticated, authState?.idToken?.claims]);

  if (!authState) {
    return (
      <div className="d-flex flex-column min-vh-100 justify-content-center align-items-center">
        <Spinner className="mb-3" animation="border" variant="danger" />
        <h3>Checking authentication status...</h3>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{
      loggedInUser: loggedInUser
    }}>
      {children}
    </AuthContext.Provider>
  );

}

export default AuthProvider;