import { Button, ListGroup } from "react-bootstrap";
import { IAppPhoneNumber, ITwilioPhoneNumber } from "../../../Types";

type Props = {
  phoneNumber: ITwilioPhoneNumber;
  selectPhoneNumber: (phoneNumber: ITwilioPhoneNumber) => void
  phoneList: IAppPhoneNumber[]
}

function PhoneNumberItem({ selectPhoneNumber, phoneNumber, phoneList }: Props) {
  return (
    <ListGroup.Item className="d-flex justify-content-between align-items-center">
      <div className="ms-2 me-auto">
        <p className="m-0 fw-light text-muted" style={{ fontSize: '0.8rem' }}>{phoneNumber.sid}</p>
        <p className="fw-bold m-0">{phoneNumber.phoneNumber}</p>
        <p className="my-0">Fiendly Name : {phoneNumber.friendlyName}</p>
        <p className="m-0 fw-light text-muted" style={{ fontSize: '0.8rem' }}>created on : {phoneNumber.dateCreated.toLocaleDateString()} at {phoneNumber.dateCreated.toLocaleTimeString()}</p>
        <p className="m-0 fw-light text-muted" style={{ fontSize: '0.8rem' }}>updated on : {phoneNumber.dateUpdated.toLocaleDateString()} at {phoneNumber.dateUpdated.toLocaleTimeString()}</p>
      </div>
      <Button className="mx-2" type='button' disabled={phoneList.map(item => item.number).includes(phoneNumber.phoneNumber)} variant='success' onClick={() => { selectPhoneNumber(phoneNumber) }}>Select</Button>
    </ListGroup.Item>
  )
}

export default PhoneNumberItem;