import { createContext, FC, useEffect, useState } from "react";
import { Alert, Container, Spinner } from "react-bootstrap";
import { Navigate } from "react-router-dom";
import useApi from "../hooks/useApi";
import { IAccount } from "../Types";

export const AccountContext = createContext<{
  accountInfo: IAccount | null;
}>({
  accountInfo: null
});

const AccountProvider: FC = ({ children }) => {

  const { getAccount } = useApi();

  const [accountInfo, setAccountInfo] = useState<IAccount | null>(null);
  const [error, setError] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(true);


  useEffect(() => {

    let isMounted = true;

    getAccount()
      .then(data => isMounted ? setAccountInfo(data) : null)
      .catch(error => isMounted ? setError(error.message) : null)
      .finally(() => setIsLoading(false));

    return () => {
      isMounted = false;
    }

  }, [getAccount]);

  if (isLoading) {
    return (
      <div className="d-flex flex-column min-vh-100 justify-content-center align-items-center">
        <Spinner className="mb-3" animation="border" variant="danger" />
        <h3>Loading Account Information...</h3>
      </div>
    )
  }

  if (error) {
    return (
      <Container className="mt-3" fluid>
        <Alert variant="danger">{error}</Alert>
      </Container>
    )
  }

  if (accountInfo === null) {
    return (
      <Navigate to="account/init" />
    )
  }

  if (accountInfo.twiml_app_sid === null) {
    return (
      <Navigate to="twiml/init" />
    )
  }

  return (
    <AccountContext.Provider value={{
      accountInfo: accountInfo
    }}>
      {children}
    </AccountContext.Provider>
  );

}

export default AccountProvider;