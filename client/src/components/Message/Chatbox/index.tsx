import './index.scss';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import CloseButton from 'react-bootstrap/CloseButton';
import Card from 'react-bootstrap/Card';
import useApi from '../../../hooks/useApi';
import MessageItem from './MessageItem';
import Form from 'react-bootstrap/Form';
import useAlertCard, { AlertMessageType } from '../../../hooks/useAlertCard';
import Button from 'react-bootstrap/Button';
import { Spinner } from 'react-bootstrap';
import { SocketContext } from '../../../providers/SocketProvider';
import useForm, { FormSchema } from '../../../hooks/useForm';
import { IMessage, IPhone } from '../../../Types';
import { Link, useNavigate } from 'react-router-dom';

const stateSchema: FormSchema = {
  body: { value: '', errorMessage: '', isInvalid: false }
};

const validationStateSchema = {
  body: {
    required: true
  }
};

type Props = {
  selectedPhone: IPhone,
  contact_number: string
}

function Chatbox({ selectedPhone, contact_number }: Props) {

  const chatBoxRef = useRef<HTMLDivElement | null>(null);

  const { socket } = useContext(SocketContext);

  const { setAlertMessage, alertDom } = useAlertCard({ dismissible: true });
  const { sendMessage, getMessageByConversation } = useApi();
  let navigate = useNavigate();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [conversationMessageList, setConversationMessageList] = useState<IMessage[] | null>(null);
  const { state, handleOnChange, handleOnSubmit } = useForm(stateSchema, validationStateSchema);

  const scrollToBottom = (behavior: ScrollBehavior) => {

    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTo({
        top: Math.max(0, chatBoxRef.current.scrollHeight - chatBoxRef.current.clientHeight),
        behavior: behavior
      });
    }

  }

  useEffect(() => {

    let isComponentMounted = true;

    setIsLoading(true);
    setConversationMessageList([]);

    getMessageByConversation({ phone_id: selectedPhone.phone_id, contact_number: contact_number }).then(
      (data) => {
        if (isComponentMounted) {

          if (data.length === 0) {
            navigate(`/${selectedPhone.phone_id}/message`, {replace: true});
          } else {
            setConversationMessageList(data);
            setIsLoading(false);
            scrollToBottom('auto');
          }

        }
      },
      (error) => {
        if (isComponentMounted) {
          setIsLoading(false);
        }
      }
    )

    return () => {
      isComponentMounted = false;
    }

  }, [selectedPhone.phone_id, contact_number, getMessageByConversation, navigate]);

  const refreshMessageListener = useCallback(() => {

    getMessageByConversation({ phone_id: selectedPhone.phone_id, contact_number: contact_number }).then(
      (data) => {
        setConversationMessageList(data);
        scrollToBottom('smooth');
      }
    )

  }, [getMessageByConversation, selectedPhone.phone_id, contact_number]);

  useEffect(() => {

    if (socket) {
      socket.on('refreshMessage', refreshMessageListener);
    }

    return () => {
      if (socket) {
        socket.off("refreshMessage", refreshMessageListener);
      }
    }

  }, [socket, refreshMessageListener]);

  const processSendMessage = useCallback((state) => {

    let isComponentMounted = true;

    setIsSending(true);
    setAlertMessage(null);

    sendMessage({
      from: selectedPhone.number,
      to: contact_number,
      body: state.body.value
    })
      .then(
        (data) => {
          if (isComponentMounted) {
            setIsSending(false);
            setConversationMessageList(prevState => [...prevState as IMessage[], data]);
            scrollToBottom('smooth');
          }
        },
        (error) => {
          if (isComponentMounted) {
            setIsSending(false);
            setAlertMessage({
              type: AlertMessageType.ERROR,
              message: error.message
            });
          }
        }
      );

    return () => {
      isComponentMounted = false;
    }

  }, [setAlertMessage, sendMessage, selectedPhone, contact_number]);



  let chatboxBody = <Card.Body><div className='chat-box d-flex flex-column justify-content-center align-items-center' ><Spinner animation="border" variant="danger" /></div></Card.Body>;

  if (!isLoading) {
    chatboxBody = <Card.Body>
      <div className='chat-box' ref={chatBoxRef}>
        {
          conversationMessageList?.map((item, index) => {
            return <MessageItem key={index} selectedPhone={selectedPhone} message={item} />
          })
        }
      </div>
    </Card.Body>;
  }

  return (
    <Card>
      <Card.Header className="d-flex flex-row align-items-center p-3">
        <p className='flex-grow-1 m-0'>{contact_number}</p>
        <Link to={`/${selectedPhone.phone_id}/message`} replace>
          <CloseButton />
        </Link>
      </Card.Header>
      {chatboxBody}
      <Card.Footer>
        {alertDom}
        <Form onSubmit={(e) => { handleOnSubmit(e, processSendMessage) }}>
          <Form.Group className="mb-3" controlId="body">
            <Form.Control disabled={isSending} value={state.body.value} name='body' isInvalid={state.body.isInvalid} onChange={handleOnChange} as="textarea" rows={3} placeholder='Write your message here...' />
            <div className="invalid-feedback">{state.body.errorMessage}</div>
          </Form.Group>
          <Button disabled={isSending} className='text-right' variant="primary" type="submit">{isSending ? 'Sending...' : 'Send'}</Button>
        </Form>
      </Card.Footer>
    </Card>
  )

}
export default Chatbox;