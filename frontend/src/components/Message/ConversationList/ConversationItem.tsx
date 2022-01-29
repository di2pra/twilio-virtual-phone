import { useCallback } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import { useNavigate } from "react-router-dom";
import { IConversation, IPhone } from "../../../hooks/useApi";


type Props = {
  conversation: IConversation
  selectedPhone: IPhone
}

function ConversationItem({ conversation, selectedPhone }: Props) {

  let navigate = useNavigate();

  const navigateToConversation = useCallback(() => {
    navigate(`/${selectedPhone.phone_id}/message/${conversation.contact_number}`, { replace: true });
  }, [navigate, selectedPhone.phone_id, conversation.contact_number]);

  return (
    <ListGroup.Item
      className="d-flex justify-content-between align-items-start"
      action onClick={() => { navigateToConversation() }}
    >
      <div className="ms-2 me-auto">
        <p className="fw-bold m-0">{conversation.contact_number}</p>
        <p className="my-1">{conversation.body}</p>
        <p className="m-0 fw-light text-muted" style={{fontSize: '0.8rem'}}>{conversation.created_on.toLocaleDateString()} à {conversation.created_on.toLocaleTimeString()}</p>
      </div>
    </ListGroup.Item>
  )
}

export default ConversationItem;