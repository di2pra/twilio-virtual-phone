import { useState } from "react";
import Alert from "react-bootstrap/Alert";

export interface IAlertMessage {
  type: AlertMessageType;
  message: string
}

export enum AlertMessageType {
  SUCCESS = "success",
  ERROR = "danger",
  WARNING = "warning"
}

type Props = {
  dismissible: boolean
}

function useAlertCard({dismissible} : Props) {

  const [alertMessage, setAlertMessage] = useState<IAlertMessage | null>(null);

  let alertDom = null;
  
  if(alertMessage) {
    alertDom = <Alert variant={alertMessage.type.toString()} onClose={() => {setAlertMessage(null)}} dismissible={dismissible}>{alertMessage.message}</Alert>
  }
  
  return { 
    setAlertMessage,
    alertDom
  };
}




export default useAlertCard;