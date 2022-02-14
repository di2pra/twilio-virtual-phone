import { useCallback, useState } from "react";
import { Button, Modal } from "react-bootstrap";

type Props<Type> = {
  title?: string;
  body?: string;
  closeBtnLabel?: string;
  saveBtnLabel?: string;
  handleOnConfirm?: (context: Type | undefined) => void;
  handleOnCancel?: () => void;
}

function useModalBox<Type>({title, body, closeBtnLabel, saveBtnLabel, handleOnCancel, handleOnConfirm} : Props<Type>) {

  const [show, setShow] = useState(false);
  const [context, setContext] = useState<Type>();
  const [options, setOptions] = useState<Props<Type>>({
    title: title,
    body: body,
    closeBtnLabel: closeBtnLabel,
    saveBtnLabel: saveBtnLabel,
    handleOnConfirm: handleOnConfirm,
    handleOnCancel: handleOnCancel
  });
  //const [handleOnConfirmState, setHandleOnConfirmState] = useState<(context: Type | undefined) => void | undefined>();
  //const [handleOnCancelState, setHandleOnCancelState] = useState<() => void | undefined>();

  const clickOnConfirm = useCallback(() => {

    console.log(options.handleOnConfirm);

    if(options.handleOnConfirm) {
      console.log(options.handleOnConfirm)
      options.handleOnConfirm(context);
    }

    setShow(false);

  }, [options.handleOnConfirm, context]);

  const clickOnCancel = useCallback(() => {

    if(options.handleOnCancel) {
      options.handleOnCancel();
    }

    setShow(false);

  }, [options.handleOnCancel]);

  const initModal = useCallback((
    { options, context }: {
    options: Props<Type>;
    context?: Type
  }) => {

    setShow(true);
    setContext(context);
    setOptions(prevState => {
      return {
        ...prevState,
        ...options
      }
    });

  }, []);

  console.log(options.handleOnConfirm);

  return {
    modalDom: <Modal show={show} animation={false}>
      <Modal.Header>
        <Modal.Title>{options.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{options.body}</Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={clickOnCancel}>{options.closeBtnLabel || 'Close'}</Button>
        <Button variant="primary" onClick={clickOnConfirm}>{options.saveBtnLabel || 'Save Change'}</Button>
      </Modal.Footer>
    </Modal>,
    initModal: initModal
  }
}

export default useModalBox;