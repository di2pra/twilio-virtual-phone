import { useCallback } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import { IoIosArrowForward } from 'react-icons/io';
import { useNavigate } from "react-router-dom";
import { IConversation, ITwilioPhoneNumber } from "../../../Types";

type Props = {
  conversation: IConversation
  selectedPhone: ITwilioPhoneNumber
}

function ConversationItem({ conversation, selectedPhone }: Props) {

  let navigate = useNavigate();

  const navigateToConversation = useCallback(() => {
    navigate(`/${selectedPhone.sid}/message/${conversation.contact_number}`, { replace: false });
  }, [navigate, selectedPhone.sid, conversation.contact_number]);

  return (
    <ListGroup.Item
      className="d-flex justify-content-between align-items-center"
      action onClick={() => { navigateToConversation() }}
    >
      <div className="ms-2 me-auto">
        <p className="fw-bold m-0">{conversation.contact_number}</p>
        <p className="my-1">{conversation.body}</p>
        <p className="m-0 fw-light text-muted" style={{ fontSize: '0.8rem' }}>{conversation.created_on.toLocaleDateString()} at {conversation.created_on.toLocaleTimeString()}</p>
      </div>
      <IoIosArrowForward />
    </ListGroup.Item>
  )
}

export default ConversationItem;