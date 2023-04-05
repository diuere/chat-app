import { Button, InputGroup, Modal, Tooltip, Uploader, Whisper } from 'rsuite';
import { Icon } from '@iconify/react';
import { toggleToasterPush, useModalState } from '../../../helpers/custom-hooks';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { storage } from '../../../misc/firebase';

const MAX_FILE_SIZE = 1000 * 1024 * 5; // 5mb

const AttachmentBtnModal = ({ afterUpload }) => {
  const { isOpen, close, open } = useModalState();
  const [fileList, setFileList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { chatId } = useParams();

  const fileListChange = filesArr => {
    const filteredList = filesArr
      .filter(file => file.blobFile.size <= MAX_FILE_SIZE)
      .slice(0, 5);

    setFileList(filteredList);
  };

  const onUpload = async () => {
    try {
      const uploadPromises = fileList.map(file => {
        return storage
          .ref(`/chat/${chatId}`)
          .child(Date.now() + file.name)
          .put(file.blobFile, {
            cacheControl: `public, max-age=${3600 * 24 * 3}`,
          });
      });

      const uploadSnapshots = await Promise.all(uploadPromises);

      // shaping the data that will be stored in the database
      const shapePromises = uploadSnapshots.map(async (snap) => {
        return {
          contentType: snap.metadata.contentType,
          name: snap.metadata.name,
          url: await snap.ref.getDownloadURL()
        }
      });

      const files = await Promise.all(shapePromises);

      await afterUpload(files);
      setIsLoading(false);
      close();
    } catch (error) {
      setIsLoading(false);
      toggleToasterPush("error", "Error", `${error.message}`, "topCenter", 4000);
    }
  };

  return (
    <>
      <Whisper
        placement="top"
        delay={0}
        delayClose={0}
        delayOpen={0}
        trigger={'hover'}
        speaker={<Tooltip>Upload file</Tooltip>}
      >
        <InputGroup.Button onClick={open}>
          <Icon icon="mdi:paperclip" />
        </InputGroup.Button>
      </Whisper>
      <Modal open={isOpen} onClose={close}>
        <Modal.Header>
          <Modal.Title>File uploader</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Uploader
            fileList={fileList}
            autoUpload={false}
            action=""
            onChange={fileListChange}
            className="w-100"
            disabled={isLoading}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button
            block
            appearance="primary"
            disabled={isLoading}
            onClick={onUpload}
          >
            Send to chat
          </Button>
          <div className="text-right mt-2">
            <small>* only files less than 5mb are allowed</small>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AttachmentBtnModal;
