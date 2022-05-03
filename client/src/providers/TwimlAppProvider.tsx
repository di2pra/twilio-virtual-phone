import { createContext, FC, useContext, useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { Navigate } from "react-router-dom";
import { AccountContext } from "./AccountProvider";

export const TwimlAppContext = createContext<{
  twimlApp: string | null;
}>({
  twimlApp: null
});

const TwimlAppProvider: FC = ({ children }) => {

  const { accountInfo } = useContext(AccountContext);

  const [twimlApp, setTwimlApp] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);


  useEffect(() => {

    if(accountInfo?.twiml_app_sid) {
      setTwimlApp(accountInfo?.twiml_app_sid)
    }

  }, [accountInfo?.twiml_app_sid]);

  if (isLoading) {
    return (
      <div className="d-flex flex-column min-vh-100 justify-content-center align-items-center">
        <Spinner className="mb-3" animation="border" variant="danger" />
        <h3>Loading Twiml App Information...</h3>
      </div>
    )
  }

  if (twimlApp === null) {
    return (
      <Navigate to="/init/twiml" />
    )
  }

  return (
    <TwimlAppContext.Provider value={{
      twimlApp: twimlApp
    }}>
      {children}
    </TwimlAppContext.Provider>
  );

}

export default TwimlAppProvider;