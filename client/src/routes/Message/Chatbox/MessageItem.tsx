import { IMessage, ITwilioPhoneNumber } from "../../../Types";

type Props = {
  selectedPhone: ITwilioPhoneNumber,
  message: IMessage
}

function MessageItem({ selectedPhone, message }: Props) {

  return (
    <div className={'chat-msg-container' + (selectedPhone.sid === message.to_sid ? '' : ' right')}>
      <div className="chat-text-box">
        <p style={{ 'whiteSpace': 'pre-line' }}>{message.body}</p>
        <span className="chat-timestamp">{message.created_on.toLocaleDateString()} at {message.created_on.toLocaleTimeString()}</span>
      </div>
    </div>
  )
}

export default MessageItem;