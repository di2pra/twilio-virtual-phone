import { useCallback, useContext, useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Spinner from "react-bootstrap/Spinner";
import ListGroup from "react-bootstrap/ListGroup";
import useAlertCard, { AlertMessageType } from "../../../hooks/useAlertCard";
import useApi, { IConversation } from "../../../hooks/useApi";
import { useIsMounted } from "../../../hooks/useIsMounted";
import { PhoneContext } from "../../../providers/PhoneProvider";
import { SocketContext } from "../../../providers/SocketProvider";
import ConversationItem from "./ConversationItem";


function ConversationList() {

  const { selectedPhone } = useContext(PhoneContext);
  const { socket } = useContext(SocketContext);

  const { isMounted } = useIsMounted();

  const { getConversationListByPhoneId } = useApi();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { setAlertMessage, alertDom } = useAlertCard({ dismissible: false });
  const [conversationList, setConversationList] = useState<IConversation[] | null>(null);

  useEffect(() => {

    if (selectedPhone) {
      setIsLoading(true);

      getConversationListByPhoneId(selectedPhone.phone_id).then(
        (data) => {
          if (isMounted.current) {
            setConversationList(data);
            setIsLoading(false);
          }
        },
        (error) => {
          if (isMounted.current) {
            setAlertMessage({
              type: AlertMessageType.ERROR,
              message: error.message
            });
            setIsLoading(false);
          }
        }
      )
    }

  }, [selectedPhone, getConversationListByPhoneId, setAlertMessage, isMounted]);

  const refreshMessageListener = useCallback(() => {
    if (selectedPhone) {
      getConversationListByPhoneId(selectedPhone.phone_id).then(
        (data) => {
          if (isMounted.current) {
            setConversationList(data);
            var audio = new Audio('/notification.mp3');
            audio.play();
          }
        }
      )
    }
  }, [selectedPhone, getConversationListByPhoneId, isMounted])

  useEffect(() => {
    if (socket) {
      socket.on('refreshMessage', refreshMessageListener);
    }

    return () => {
      if (socket) {
        socket.off('refreshMessage', refreshMessageListener);
      }
    }
  }, [socket, getConversationListByPhoneId, selectedPhone, refreshMessageListener]);


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
        <ListGroup className="mt-3" as="ol">
          {
            conversationList?.map((item, index) => {
              return (
                <ConversationItem key={index} conversation={item} selectedPhone={selectedPhone} />
              )
            })
          }
        </ListGroup>
      </Col>
    </Row>
  )
}

export default ConversationList;