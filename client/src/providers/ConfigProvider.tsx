import { createContext, FC, useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import useApi from "../hooks/useApi";
import { IConfig } from "../Types";

export const ConfigContext = createContext<{
  config: IConfig | null;
}>({
  config: null
});

const ConfigProvider: FC = ({ children }) => {

  const { getConfiguration } = useApi();
  const [config, setConfig] = useState<IConfig | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);


  useEffect(() => {

    let isMounted = true;

    getConfiguration().then((data) => {
      if (isMounted) {
        setConfig(data);
        setIsLoading(false);
      }
    })

    return () => {
      isMounted = false;
    }

  }, [getConfiguration]);

  if (isLoading) {
    return (
      <div className="d-flex flex-column min-vh-100 justify-content-center align-items-center">
        <Spinner animation="border" variant="danger" />
      </div>
    )
  }

  return (
    <ConfigContext.Provider value={{
      config: config
    }}>
      {children}
    </ConfigContext.Provider>
  );

}

export default ConfigProvider;