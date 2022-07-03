import { useCallback, useContext, useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import ListGroup from "react-bootstrap/ListGroup";
import Row from "react-bootstrap/Row";
import LoadingRow from "../../../components/LoadingRow";
import useAlertCard, { AlertMessageType } from "../../../hooks/useAlertCard";
import useApi from "../../../hooks/useApi";
import { PhoneContext } from "../../../providers/PhoneProvider";
import { SocketContext } from "../../../providers/SocketProvider";
import { IConversation } from "../../../Types";
import ConversationItem from "./ConversationItem";


function ConversationList() {

  const { selectedPhone } = useContext(PhoneContext);
  const { socket } = useContext(SocketContext);

  const { getConversationListByPhoneSid } = useApi();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { setAlertMessage, alertDom } = useAlertCard({ dismissible: false });
  const [conversationList, setConversationList] = useState<IConversation[]>([]);

  useEffect(() => {

    let isComponentMounted = true;

    if (selectedPhone) {
      setIsLoading(true);

      getConversationListByPhoneSid(selectedPhone.sid).then(
        (data) => {
          if (isComponentMounted) {

            setConversationList(data);
            setIsLoading(false);

            if (data.length === 0) {
              setAlertMessage({
                type: AlertMessageType.WARNING,
                message: 'No conversation'
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

  }, [selectedPhone, getConversationListByPhoneSid, setAlertMessage]);

  const refreshMessageListener = useCallback(() => {
    if (selectedPhone) {
      getConversationListByPhoneSid(selectedPhone.sid).then(
        (data) => {
          setConversationList(data);
          var audio = new Audio('/notification.mp3');
          audio.play();
        }
      )
    }
  }, [selectedPhone, getConversationListByPhoneSid])

  useEffect(() => {
    if (socket) {
      socket.on('refreshMessage', refreshMessageListener);
    }

    return () => {
      if (socket) {
        socket.off('refreshMessage', refreshMessageListener);
      }
    }
  }, [socket, getConversationListByPhoneSid, selectedPhone, refreshMessageListener]);


  if (!selectedPhone) {
    return null
  }


  if (isLoading) {
    return <LoadingRow />;
  }

  if (alertDom) {
    return alertDom;
  }

  return (
    <Row>
      <Col>
        <ListGroup as="ol">
          {
            conversationList.map((item, index) => {
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