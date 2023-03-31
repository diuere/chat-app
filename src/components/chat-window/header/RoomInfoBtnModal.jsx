import { memo } from "react";
import { Button, Modal } from "rsuite";
import { useCurrentRoom } from "../../../context/current-room-context"
import { useModalState } from "../../../helpers/custom-hooks";


const RoomInfoBtnModal = () => {
  const { isOpen, close, open } = useModalState();
  const name = useCurrentRoom(state => state.name);
  const description = useCurrentRoom(state => state.description);

  return (
    <>
      <Button appearance="link" className="px-0" onClick={open}>
        Room Information
      </Button>
      <Modal open={isOpen} onClose={close}>
        <Modal.Header>
          <Modal.Title>About {name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h6 className="mb-1">Description</h6>
          <p>{description}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button block appearance="primary" onClick={close}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default memo(RoomInfoBtnModal);