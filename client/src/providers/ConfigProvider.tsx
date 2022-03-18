import { createContext, FC, useCallback, useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import useApi from "../hooks/useApi";
import { IApplication, IConfig } from "../Types";

export const ConfigContext = createContext<{
  config: IConfig | null;
  updateConfig?: (application: IApplication) => void
}>({
  config: null
});

const ConfigProvider: FC = ({ children }) => {

  const { getConfiguration, setConfiguration } = useApi();
  const [config, setConfig] = useState<IConfig | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);


  useEffect(() => {

    let isMounted = true;

    getConfiguration().then((data) => {
      if (isMounted) {
        setConfig(data);
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
    }

  }, [getConfiguration]);

  const updateConfig = useCallback((application: IApplication) => {

    let isMounted = true;

    setIsLoading(true);

    setConfiguration(application.sid).then(data => {
      if(isMounted) {
        setConfig(data);
        setIsLoading(false);
      }
    })

    return () => {
      isMounted = false;
    }

  } ,[setConfiguration]);

  if (isLoading) {
    return (
      <div className="d-flex flex-column min-vh-100 justify-content-center align-items-center">
        <Spinner className="mb-3" animation="border" variant="danger" />
        <h3>Loading Configuration...</h3>
      </div>
    )
  }

  return (
    <ConfigContext.Provider value={{
      config: config,
      updateConfig: updateConfig
    }}>
      {children}
    </ConfigContext.Provider>
  );

}

export default ConfigProvider;