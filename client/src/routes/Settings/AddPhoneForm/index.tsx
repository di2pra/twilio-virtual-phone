import { useCallback, useContext, useEffect, useState } from "react";
import { Col, ListGroup, Row, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import LoadingRow from "../../../components/LoadingRow";
import useApi from "../../../hooks/useApi";
import useModalBox from "../../../hooks/useModalBox";
import { PhoneContext } from "../../../providers/PhoneProvider";
import { IPhoneNumber, ITwilioPhoneNumber } from "../../../Types";
import PhoneNumberItem from "./PhoneNumberItem";

function AddPhoneForm() {

  const { phoneList, setPhoneList } = useContext(PhoneContext);
  const { getAllNumber, addPhone } = useApi();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [phoneNumberList, setPhoneNumberList] = useState<ITwilioPhoneNumber[]>([]);
  let navigate = useNavigate();

  const handleOnConfirmSelectPhoneNumber = useCallback((phoneNumber: ITwilioPhoneNumber | undefined) => {

    if (phoneNumber) {

      setIsLoading(true);

      addPhone(phoneNumber.sid).then(data => {

        if (setPhoneList) {
          setPhoneList(data);
        }

        setIsLoading(false);
        navigate(`/settings`, { replace: true });

      });

    }

  }, [addPhone, setPhoneList, navigate])

  const { modalDom, initModal } = useModalBox<ITwilioPhoneNumber>({
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

  const selectPhoneNumber = useCallback((phoneNumber: ITwilioPhoneNumber) => {
    initModal({
      options: {
        body: `Are you sure to use the Phone Number called "${phoneNumber.friendlyName}" for your virtual phone application? This will override any current configuration of the Phone Number.`
      },
      context: phoneNumber
    });
  }, [initModal]);

  if (isLoading) {
    return <LoadingRow />
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