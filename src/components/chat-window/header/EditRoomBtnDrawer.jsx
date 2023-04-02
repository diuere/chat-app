import { memo } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Drawer } from 'rsuite';
import { useCurrentRoom } from '../../../context/current-room-context';
import {
  toggleToasterPush,
  useMediaQuery,
  useModalState,
} from '../../../helpers/custom-hooks';
import { database } from '../../../misc/firebase';
import EditableInput from '../../EditableInput';

const EditRoomBtnDrawer = () => {
  const { isOpen, open, close } = useModalState();
  const name = useCurrentRoom(state => state.name);
  const description = useCurrentRoom(state => state.description);
  const { chatId } = useParams();
  const isMobile = useMediaQuery('(max-width: 768px)');

  const updateData = (key, value) => {
    database
      .ref(`/rooms/${chatId}`)
      .child(key)
      .set(value)
      .then(() => {
        toggleToasterPush('success', 'Success', `Successfully updated`, 'topCenter', 4000);
      })
      .catch(err => {
        toggleToasterPush( 'error', 'Error', `${err.message}`, 'topCenter', 4000);
      });
  };

  const deleteRoom = async () => {
    const userConfirm = window.confirm('Are you sure you want to delete this room? This action cannot be undone');
    
    if(userConfirm){
      await database.ref(`/rooms/${chatId}`).remove();
    }
  }

  const onNameSave = newName => {
    updateData('name', newName);
  };
  const onDescriptionSave = newDesc => {
    updateData('description', newDesc);
  };

  return (
    <>
      <Button appearance="primary" className="br-circle" color='red' size="sm" onClick={open}>
        A
      </Button>
      <Drawer size={isMobile ? "full" : "sm"} open={isOpen} onClose={close}>
        <Drawer.Header>
          <Drawer.Title>About {name}</Drawer.Title>
        </Drawer.Header>
        <Drawer.Body>
          <EditableInput
            defaultValue={name}
            onSave={onNameSave}
            label={<h6 className="mb-2">Name</h6>}
            emptyMsg="Name cannot be empty"
          />
          <EditableInput
            as="textarea"
            defaultValue={description}
            onSave={onDescriptionSave}
            rows={5}
            emptyMsg="Description cannot be empty"
            wrapperClassName="mt-3"
          />

          <Drawer.Actions className='mt-3'>
            <Button block appearance="primary" color="red" onClick={deleteRoom}>
              Delete Room
            </Button>
          </Drawer.Actions>
        </Drawer.Body>
      </Drawer>
    </>
  );
};

export default memo(EditRoomBtnDrawer);
