import { memo } from 'react';
import TimeAgo from 'react-timeago';
import { Button } from 'rsuite';
import { useCurrentRoom } from '../../../context/current-room-context';
import { auth } from '../../../misc/firebase';
import ProfileAvatar from '../../dashboard/ProfileAvatar';
import PresenceDot from '../../PresenceDot';
import ProfileInfoBtnModal from './ProfileInfoBtnModal';
import { useHover, useMediaQuery } from '../../../helpers/custom-hooks';
import IconBtnControl from './IconBtnControl';

const MessageItem = ({ message, handleAdmin, handleMsgDelete }) => {
  const { author, createdAt, text } = message;
  const isAdmin = useCurrentRoom(state => state.isAdmin);
  const admins = useCurrentRoom(state => state.admins);
  const isMobile = useMediaQuery('(max-width: 768px');

  const isMsgAuthorAdmin = admins.includes(author.uid); // is the selected user an admin?
  const isAuthor = auth.currentUser.uid === author.uid; // is the selected user the current user?
  const canGrantAdmin = isAdmin && !isAuthor; // the current user is admin and was not selected

  const [selfRef, isHovered] = useHover();

  const chanShowIcons = isMobile || isHovered;

  return (
    <li
      className={`mt-2 cursor-pointer ${isHovered ? 'bg-black-02' : ''}`}
      ref={selfRef}
    >
      <div className="d-flex justify-content-between mb-1 mt-3">
        <div className="d-flex align-items-center font-bolder">
          <PresenceDot uid={author.uid} />
          <ProfileAvatar
            src={author.avatar}
            name={author.name}
            className="ml-1"
            size="xs"
          />
          <ProfileInfoBtnModal profile={author}>
            {canGrantAdmin && (
              <Button
                block
                onClick={() => handleAdmin(author.uid)}
                color="blue"
                appearance="primary"
              >
                {isMsgAuthorAdmin
                  ? 'Remove admin permission'
                  : 'Give admin permission'}
              </Button>
            )}
          </ProfileInfoBtnModal>
          <TimeAgo date={createdAt} className="font-normal text-black-45 ml-2" />
        </div>

        <div className="mr-3">
          {isAuthor && (
            <IconBtnControl 
              isVisible={chanShowIcons}
              iconName="close"
              tooltip={"Delete message"}
              onClick={() => handleMsgDelete(message.id)}
            />
          )}
        </div>
      </div>
      <div className="ml-3">
        <span className="word-break-all">{text}</span>
      </div>
    </li>
  );
};

export default memo(MessageItem);
