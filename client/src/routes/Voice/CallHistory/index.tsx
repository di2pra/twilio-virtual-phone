import { useContext, useEffect, useState } from "react";
import { Col, ListGroup, Row, Spinner } from "react-bootstrap";
import useAlertCard, { AlertMessageType } from "../../../hooks/useAlertCard";
import useApi from "../../../hooks/useApi";
import { PhoneContext } from "../../../providers/PhoneProvider";
import { ICall } from "../../../Types";
import CallHistoryItem from "./CallHistoryItem";

function CallHistory() {

  const { selectedPhone } = useContext(PhoneContext);

  const { getCallListByPhoneId } = useApi();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { setAlertMessage, alertDom } = useAlertCard({ dismissible: false });
  const [callHistoryList, setCallHistoryList] = useState<ICall[]>([]);

  useEffect(() => {

    let isComponentMounted = true;

    if (selectedPhone) {
      setIsLoading(true);

      getCallListByPhoneId(selectedPhone.phone_id).then(
        (data) => {
          if (isComponentMounted) {

            setCallHistoryList(data);
            setIsLoading(false);

            if (data.length === 0) {
              setAlertMessage({
                type: AlertMessageType.WARNING,
                message: 'No call'
              });
            }
          }
        },
        (error) => {
          if (isComponentMounted) {
            setAlertMessage({
              type: AlertMessageType.ERROR,
              message: error.message
            });
            setIsLoading(false);
          }
        }
      )
    }

    return () => {
      isComponentMounted = false;
    }

  }, [selectedPhone, getCallListByPhoneId, setAlertMessage]);

  if (!selectedPhone) {
    return null
  }


  if (isLoading) {
    return (
      <Row>
        <Col className="d-flex flex-column justify-content-center align-items-center">
          <Spinner animation="border" variant="danger" />
        </Col>
      </Row>
    );
  }

  if (alertDom) {
    return alertDom;
  }

  return (
    <Row>
      <Col>
        <ListGroup as="ol">
          {
            callHistoryList.map((item, index) => {
              return (
                <CallHistoryItem key={index} call={item} selectedPhone={selectedPhone} />
              )
            })
          }
        </ListGroup>
      </Col>
    </Row>
  )
}

export default CallHistory;