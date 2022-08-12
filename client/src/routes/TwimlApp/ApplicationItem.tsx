import { Button, ListGroup } from "react-bootstrap";
import { IApplication } from "../../Types";

type Props = {
  application: IApplication;
  selectApplication: (application: IApplication) => void
}

function ApplicationItem({ selectApplication, application }: Props) {
  return (
    <ListGroup.Item className="d-flex justify-content-between align-items-center">
      <div className="ms-2 me-auto">
        <p className="m-0 fw-light text-muted" style={{ fontSize: '0.8rem' }}>{application.sid}</p>
        <p className="fw-bold m-0">{application.friendlyName}</p>
        <p className="my-0">SMS URL : {application.smsUrl}</p>
        <p className="my-0">Voice URL : {application.voiceUrl}</p>
        <p className="m-0 fw-light text-muted" style={{ fontSize: '0.8rem' }}>created on : {application.dateCreated.toLocaleDateString()} at {application.dateCreated.toLocaleTimeString()}</p>
        <p className="m-0 fw-light text-muted" style={{ fontSize: '0.8rem' }}>updated on : {application.dateUpdated.toLocaleDateString()} at {application.dateUpdated.toLocaleTimeString()}</p>
      </div>
      <Button className="mx-2" type='button' variant='success' onClick={() => { selectApplication(application) }}>Select</Button>
    </ListGroup.Item>
  )
}

export default ApplicationItem;