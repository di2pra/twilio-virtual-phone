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

function useModalBox<Type>({ title, body, closeBtnLabel, saveBtnLabel, handleOnCancel, handleOnConfirm }: Props<Type>) {

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

  const clickOnConfirm = useCallback(() => {

    if (options.handleOnConfirm) {
      console.log(options.handleOnConfirm)
      options.handleOnConfirm(context);
    }

    setShow(false);

  }, [options, context]);

  const clickOnCancel = useCallback(() => {

    if (options.handleOnCancel) {
      options.handleOnCancel();
    }

    setShow(false);

  }, [options]);

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