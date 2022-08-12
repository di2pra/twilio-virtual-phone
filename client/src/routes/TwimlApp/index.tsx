import { FC, useCallback, useEffect, useState } from "react";
import { Button, Col, ListGroup, Row, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import useApi from "../../hooks/useApi";
import useModalBox from "../../hooks/useModalBox";
import { IApplication } from "../../Types";
import ApplicationItem from "./ApplicationItem";

const TwimlApp: FC = () => {

  const { updateAccountTwimlApp } = useApi();
  let navigate = useNavigate();

  const { getAllApplication } = useApi();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [applicationList, setApplicationList] = useState<IApplication[]>([]);

  const handleOnConfirmSelectApplication = useCallback((state: IApplication) => {

    setIsLoading(true);

    updateAccountTwimlApp({
      twiml_app_sid: state.sid,
    }).then(() => {
      navigate('/');
    }).catch((error) => {
    }).finally(() => {
      setIsLoading(false);
    })

  }, [updateAccountTwimlApp, navigate])

  const { modalDom, initModal } = useModalBox<IApplication>({
    title: `Confirmation`,
    closeBtnLabel: `Cancel`,
    saveBtnLabel: `Confirm`,
    handleOnConfirm: handleOnConfirmSelectApplication
  });

  const selectApplication = useCallback((application: IApplication) => {
    initModal({
      options: {
        body: `Are you sure to use the Twiml App called "${application.friendlyName}" for your virtual phone application? This will override any current configuration of the Twiml App.`
      },
      context: application
    });
  }, [initModal])

  useEffect(() => {

    let isMounted = true;
    setIsLoading(true);

    getAllApplication().then((data) => {
      if (isMounted) {
        setApplicationList(data);
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
    }

  }, [getAllApplication]);

  if (isLoading) {
    return (
      <div className="d-flex flex-column min-vh-100 justify-content-center align-items-center">
        <Spinner animation="border" variant="danger" />
      </div>
    )
  }


  return (
    <>
      {modalDom}
      <Row className="justify-content-md-center mt-3">
        <Col md={10}>
          <Row className="mb-1">
            <Col>
              <h3>Select the Twiml Application to use :</h3>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <Link to="/init/twiml/add">
                <Button type="button">Add new Twiml Application</Button>
              </Link>
            </Col>
          </Row>
          <Row>
            <Col>
              <ListGroup as="ol">
                {
                  applicationList.map((item, index) => {
                    return <ApplicationItem selectApplication={selectApplication} application={item} key={index} />
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

export default TwimlApp;