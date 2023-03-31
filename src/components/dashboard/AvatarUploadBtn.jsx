import { useRef, useState } from 'react';
import { Button, Modal } from 'rsuite';
import AvatarEditor from 'react-avatar-editor';
import { toggleToasterPush, useModalState } from '../../helpers/custom-hooks';
import { useProfile } from '../../context/profile-context';
import { database, storage } from '../../misc/firebase';
import ProfileAvatar from './ProfileAvatar';
import { getUserUpdates } from '../../helpers/utils';

const fileInputTypes = '.png, .jpeg, .jpg'; // files types for the html input property

const acceptableFileTypes = ['image/png', 'image/jpeg', 'image/pjpeg']; // actual file restriction

const isValidFile = fileType => acceptableFileTypes.includes(fileType);

const getBlob = canvas => {
  // converting canvas to blob file
  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error('File process error'));
      }
    });
  });
};

const AvatarUploadBtn = () => {
  const { isOpen, open, close } = useModalState();
  const [userImg, setUserImg] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const avatarEditorRef = useRef();
  const { profile } = useProfile();

  const onFileInputChange = e => {
    const allFiles = e.target.files;

    if (allFiles.length === 1) {
      // selecting only one file
      const file = allFiles[0];

      if (isValidFile(file.type)) {
        setUserImg(file);
        open();
      } else {
        toggleToasterPush(
          'warning',
          'Warning',
          `Invalid file type of ${file.type}`,
          'topCenter',
          4000
        );
      }
    }
  };

  const onUploadClick = async () => {
    const canvas = avatarEditorRef.current.getImageScaledToCanvas();
    setIsLoading(true);
    try {
      const blob = await getBlob(canvas);
      const avatarRef = storage.ref(`/profiles/${profile.uid}`).child('avatar');

      // upload avatar to storage
      const uploadAvatarResult = await avatarRef.put(blob, {
        cacheControl: `public, max-age=${3600 * 24 * 3}`,
      });
      const downloadUrl = await uploadAvatarResult.ref.getDownloadURL(); // getting the file download url

      // setting avatar to the database
      await getUserUpdates(profile.uid, 'avatar', downloadUrl, database).then(
        updates => database.ref().update(updates)
      );

      toggleToasterPush("info", "Info", `Avatar has been successfully uploaded`, 'topStart', 4000);
      setIsLoading(false);
    } catch (error) {
      toggleToasterPush("error", "Error", `${error.message}`, 'topStart', 4000);
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-3 text-center">
      <ProfileAvatar
        name={profile.name}
        src={profile.avatar}
        className="width-200 height-200 img-fullsize font-huge"
      />

      <div>
        <label htmlFor="avatar-upload" className="d-bock cursor-pointer padded">
          Select new avatar
          <input
            id="avatar-upload"
            type="file"
            className="d-none"
            accept={fileInputTypes}
            onChange={onFileInputChange}
          />
        </label>

        <Modal open={isOpen} onClose={close}>
          <Modal.Header>
            <Modal.Title>Adjust and upload new avatar</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="d-flex justify-content-center align-items-center h-100">
              {userImg && (
                <AvatarEditor
                  ref={avatarEditorRef}
                  image={userImg}
                  width={200}
                  height={200}
                  border={10}
                  borderRadius={100}
                  rotate={0}
                />
              )}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              block
              appearance="primary"
              onClick={onUploadClick}
              disabled={isLoading}
            >
              Upload new avatar
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};
export default AvatarUploadBtn;
