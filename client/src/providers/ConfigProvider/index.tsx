import { createContext, FC, useEffect, useState } from "react";
import { Button, Col, ListGroup, Row, Spinner } from "react-bootstrap";
import useApi from "../../hooks/useApi";
import useModalBox from "../../hooks/useModalBox";
import { IApplication, IConfig } from "../../Types";
import ApplicationItem from "./ApplicationItem";

export const ConfigContext = createContext<{
  config: IConfig | null;
}>({
  config: null
});

const ConfigProvider: FC = ({ children }) => {

  const { getConfiguration, getAllApplication } = useApi();
  const [config, setConfig] = useState<IConfig | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [applicationList, setApplicationList] = useState<IApplication[]>([]);

  const modalBox = useModalBox({
    title: "Confirmation",
    body: "Hello"
  })

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

  }, []);

  useEffect(() => {

    let isMounted = true;

    getConfiguration().then((data) => {
      if (isMounted) {

        if (data === null) {
          getAllApplication().then((data) => {
            setApplicationList(data);
            setIsLoading(false);
          });
        } else {
          setConfig(data);
          setIsLoading(false);
        }


      }
    })

    return () => {
      isMounted = false;
    }

  }, [getConfiguration, getAllApplication]);

  if (isLoading) {
    return (
      <div className="d-flex flex-column min-vh-100 justify-content-center align-items-center">
        <Spinner animation="border" variant="danger" />
      </div>
    )
  }

  if (config === null) {
    return (
      <>
        {modalBox}
        <Row className="justify-content-md-center mt-3">
          <Col md={10}>
            <Row className="mb-1">
              <Col>
                <h3>Select the Twilio Application to use :</h3>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col>
                <Button>Add new application</Button>
              </Col>
            </Row>
            <Row>
              <Col>
                <ListGroup as="ol">
                  {
                    applicationList.map((item, index) => {
                      return <ApplicationItem application={item} key={index} />
                    })
                  }
                </ListGroup>
              </Col>
            </Row>
          </Col>
        </Row>
      </>

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