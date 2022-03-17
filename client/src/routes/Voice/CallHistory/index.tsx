import { Call, Device } from "@twilio/voice-sdk";
import { useCallback, useContext, useEffect, useState } from "react";
import { Col, ListGroup, Row, Spinner } from "react-bootstrap";
import useAlertCard, { AlertMessageType } from "../../../hooks/useAlertCard";
import useApi from "../../../hooks/useApi";
import { PhoneContext } from "../../../providers/PhoneProvider";
import { CallMetadata, ICall } from "../../../Types";
import CallHistoryItem from "./CallHistoryItem";

type Props = {
  device: Device
  setCurrentCall: React.Dispatch<React.SetStateAction<Call | null>>
  setCallData: React.Dispatch<React.SetStateAction<CallMetadata | null>>
  refreshList: boolean
}

function CallHistory({ device, setCurrentCall, setCallData, refreshList }: Props) {

  const { selectedPhone } = useContext(PhoneContext);

  const { getCallListByPhoneId, deleteCall } = useApi();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { setAlertMessage, alertDom } = useAlertCard({ dismissible: false });
  const [callHistoryList, setCallHistoryList] = useState<ICall[]>([]);

  const updateCallList = useCallback((phone_id: number, isComponentMounted: boolean) => {

    setIsLoading(true);

    getCallListByPhoneId(phone_id).then(
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

  }, [getCallListByPhoneId, setAlertMessage])

  useEffect(() => {

    let isComponentMounted = true;

    if (selectedPhone) {
      updateCallList(selectedPhone.phone_id, isComponentMounted)
    }

    return () => {
      isComponentMounted = false;
    }

  }, [selectedPhone, updateCallList]);

  const onDeleteCall = useCallback((id: number) => {

    if (selectedPhone) {

      setIsLoading(true);

      deleteCall(id).then(() => {
        updateCallList(selectedPhone.phone_id, true)
      })

    }

  }, [deleteCall, selectedPhone, updateCallList])

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
                <CallHistoryItem onDeleteCall={onDeleteCall} key={index} call={item} selectedPhone={selectedPhone} device={device} setCurrentCall={setCurrentCall} setCallData={setCallData} />
              )
            })
          }
        </ListGroup>
      </Col>
    </Row>
  )
}

export default CallHistory;