import { createContext, FC, useCallback, useContext, useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import useApi from "../hooks/useApi";
import { IConfig } from "../Types";
import { ApiKeyContext } from "./ApiKeyProvider";

export const ConfigContext = createContext<{
  config: IConfig | null;
}>({
  config: null
});

const ConfigProvider: FC = ({ children }) => {

  const { getConfiguration } = useApi();
  const [config, setConfig] = useState<IConfig | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isInitalizing, setIsInitalizing] = useState<boolean>(false);

  useEffect(() => {

    let isMounted = true;

    getConfiguration().then((data) => {
      if(isMounted) {
        setConfig(data);
        setIsLoading(false);
      }
    })

    return () => {
      isMounted = false;
    }

  }, []);

  useEffect(() => {

    let isMounted = true;

    getConfiguration().then((data) => {
      if(isMounted) {
        setConfig(data);
        setIsLoading(false);
      }
    })

    return () => {
      isMounted = false;
    }

  }, []);


  if(isInitalizing) {
    return (
      <div className="d-flex flex-column min-vh-100 justify-content-center align-items-center">
        <p><Spinner animation="border" variant="danger" /></p>
        <h3>Initiliazing the app...</h3>
      </div>
    )
  }

  if (config === null) {
    return (
      <div className="d-flex flex-column min-vh-100 justify-content-center align-items-center">
        <p><Spinner animation="border" variant="danger" /></p>
      </div>
    )
  }

  return (
    <ConfigContext.Provider value={{
      config: null
    }}>
      {children}
    </ConfigContext.Provider>
  );

}

export default ConfigProvider;