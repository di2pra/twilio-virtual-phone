import { useCallback } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import { useNavigate } from "react-router-dom";
import { IoIosArrowForward } from 'react-icons/io';
import { IConversation, IPhoneNumber } from "../../../Types";

type Props = {
  conversation: IConversation
  selectedPhone: IPhoneNumber
}

function ConversationItem({ conversation, selectedPhone }: Props) {

  let navigate = useNavigate();

  const navigateToConversation = useCallback(() => {
    navigate(`/${selectedPhone.phone_id}/message/${conversation.contact_number}`, { replace: false });
  }, [navigate, selectedPhone.phone_id, conversation.contact_number]);

  return (
    <ListGroup.Item
      className="d-flex justify-content-between align-items-center"
      action onClick={() => { navigateToConversation() }}
    >
      <div className="ms-2 me-auto">
        <p className="fw-bold m-0">{conversation.contact_number}</p>
        <p className="my-1">{conversation.body}</p>
        <p className="m-0 fw-light text-muted" style={{fontSize: '0.8rem'}}>{conversation.created_on.toLocaleDateString()} at {conversation.created_on.toLocaleTimeString()}</p>
      </div>
      <IoIosArrowForward />
    </ListGroup.Item>
  )
}

export default ConversationItem;