import { FC, useEffect, useState } from "react";
import { Button, Col, ListGroup, Row, Spinner } from "react-bootstrap";
import { Link} from "react-router-dom";
import useApi from "../../hooks/useApi";
import useModalBox from "../../hooks/useModalBox";
import { IApplication } from "../../Types";
import ApplicationItem from "./ApplicationItem";

const Configuration: FC = () => {

  const { getAllApplication } = useApi();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [applicationList, setApplicationList] = useState<IApplication[]>([]);

  const modalBox = useModalBox({
    title: "Confirmation",
    body: "Hello"
  })

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
              <Link to="/configuration/application/new" replace>
                <Button type="button">Add new application</Button>
              </Link>
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

export default Configuration;