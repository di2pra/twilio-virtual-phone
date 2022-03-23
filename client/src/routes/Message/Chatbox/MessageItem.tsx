import { IMessage, IPhoneNumber } from "../../../Types";

type Props = {
  selectedPhone: IPhoneNumber,
  message: IMessage
}

function MessageItem({selectedPhone, message}: Props) {

  return (
    <div className={'chat-msg-container' + (selectedPhone.phone_id === message.to_phone_id ? '' : ' right')}>
      <div className="chat-text-box">
        <p style={{'whiteSpace': 'pre-line'}}>{message.body}</p>
        <span className="chat-timestamp">{message.created_on.toLocaleDateString()} at {message.created_on.toLocaleTimeString()}</span>
      </div>
    </div>
  )
}

export default MessageItem;