import { useCallback, useContext, useEffect, useState } from "react";
import { Col, ListGroup, Row, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import useApi from "../../../hooks/useApi";
import useModalBox from "../../../hooks/useModalBox";
import { PhoneContext } from "../../../providers/PhoneProvider";
import { IPhoneNumber } from "../../../Types";
import PhoneNumberItem from "./PhoneNumberItem";

function AddPhoneForm() {

  const { phoneList, setPhoneList } = useContext(PhoneContext);
  const { getAllNumber, createPhone } = useApi();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [phoneNumberList, setPhoneNumberList] = useState<IPhoneNumber[]>([]);
  let navigate = useNavigate();

  const handleOnConfirmSelectPhoneNumber = useCallback((phoneNumber: IPhoneNumber | undefined) => {

    if (phoneNumber) {

      setIsLoading(true);

      createPhone(phoneNumber.sid).then(data => {

        if (setPhoneList) {
          setPhoneList(data);
        }

        setIsLoading(false);
        navigate(`/settings`, { replace: true });

      });

    }

  }, [createPhone, setPhoneList, navigate])

  const { modalDom, initModal } = useModalBox<IPhoneNumber>({
    title: `Confirmation`,
    closeBtnLabel: `Cancel`,
    saveBtnLabel: `Confirm`,
    handleOnConfirm: handleOnConfirmSelectPhoneNumber
  });

  useEffect(() => {

    let isMounted = true;
    setIsLoading(true);

    getAllNumber().then((data) => {
      if (isMounted) {
        setPhoneNumberList(data);
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
    }

  }, [getAllNumber]);

  const selectPhoneNumber = useCallback((phoneNumber: IPhoneNumber) => {
    initModal({
      options: {
        body: `Are you sure to use the Phone Number called "${phoneNumber.friendlyName}" for your virtual phone application? This will override any current configuration of the Phone Number.`
      },
      context: phoneNumber
    });
  }, [initModal]);

  if (isLoading) {
    return (
      <Row className="justify-content-md-center">
        <Col className="d-flex flex-column justify-content-center align-items-center">
          <Spinner animation="border" variant="danger" />
        </Col>
      </Row>
    )
  }

  return (
    <Row className="justify-content-md-center">
      {modalDom}
      <Col md={10}>
        <ListGroup as="ol">
          {
            phoneNumberList.map((item, index) => {
              return <PhoneNumberItem phoneList={phoneList} selectPhoneNumber={selectPhoneNumber} phoneNumber={item} key={index} />
            })
          }
        </ListGroup>
      </Col>
    </Row>
  )

}

export default AddPhoneForm;