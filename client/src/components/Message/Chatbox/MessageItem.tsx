import { IPhone, IMessage } from "../../../hooks/useApi";

type Props = {
  selectedPhone: IPhone,
  message: IMessage
}

function MessageItem({selectedPhone, message}: Props) {

  return (
    <div className={'chat-msg-container' + (selectedPhone.phone_id === message.to_phone_id ? '' : ' right')}>
      <div className="chat-text-box">
        <p>{message.body}</p>
        <span className="chat-timestamp">{message.created_on.toLocaleDateString()} à {message.created_on.toLocaleTimeString()}</span>
      </div>
    </div>
  )
}

export default MessageItem;