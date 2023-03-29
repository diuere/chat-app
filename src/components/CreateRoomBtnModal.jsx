import React from 'react';
import { useCallback, useRef, useState } from 'react';
import { Button, Form, Input, Modal } from 'rsuite';
import FormGroup from 'rsuite/esm/FormGroup';
import FormControl from 'rsuite/esm/FormControl';
import CreativeIcon from '@rsuite/icons/Creative';
import { SchemaModel, StringType } from 'schema-typed';
import firebase from 'firebase/app';
import { database } from "../misc/firebase"
import { toggleToasterPush, useModalState } from '../helpers/custom-hooks';

const Textarea = React.forwardRef((props, ref) => <Input {...props} as="textarea" ref={ref} />);

Textarea.displayName = 'textarea';

// validating the form submission with rsuite
const model = SchemaModel({
  name: StringType().isRequired('Chat name is required'),
  description: StringType().isRequired('Description is required'),
});

const INITIAL_FORM = {
  name: '',
  description: '',
};

const CreateRoomBtnModal = () => {
  const { isOpen, open, close } = useModalState();
  const [formValue, setFormValue] = useState(INITIAL_FORM);
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef();

  const onFormChange = useCallback(value => {
    setFormValue(value);
  }, []);

  const onSubmit = async () => {
    if (!formRef.current.check()) { // form validation
      return; // if form is not valid, return;
    }
 
    setIsLoading(true);

    const newRoomData = {
      ...formValue,
      createdAt: firebase.database.ServerValue.TIMESTAMP,
    };

    // update state and database process
    try {
      await database.ref('rooms').push(newRoomData);
      setIsLoading(false);
      setFormValue(INITIAL_FORM);
      close();
      toggleToasterPush('info', "Info", `${formValue.name} has been created`, 'topCenter', 4000);
    } catch (err) {
      setIsLoading(false);
      toggleToasterPush('error', "Error", `${err.message}`, 'topCenter', 4000);
    }
  };

  return (
    <div className="mt-1">
      <Button block color="green" appearance="primary" onClick={open}>
        <CreativeIcon /> Create new chat room
      </Button>

      <Modal open={isOpen} onClose={close}>
        <Modal.Header>
          <Modal.Title>New chat room</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            fluid
            onChange={onFormChange}
            formValue={formValue}
            model={model}
            ref={formRef}
          >
            <FormGroup>
              <Form.ControlLabel>Room name</Form.ControlLabel>
              <FormControl name="name" placeholder="Enter chat room name..." />
            </FormGroup>

            <FormGroup>
              <Form.ControlLabel>Description</Form.ControlLabel>
              <FormControl
                accepter={Textarea}
                rows={5}
                name="description"
                placeholder="Enter room description..."
              />
            </FormGroup>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button block appearance="primary" onClick={onSubmit} disabled={isLoading}>
            Create new chat room
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CreateRoomBtnModal;