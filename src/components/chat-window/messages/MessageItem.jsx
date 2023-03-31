import TimeAgo from 'react-timeago';
import ProfileAvatar from '../../dashboard/ProfileAvatar';
import PresenceDot from '../../PresenceDot';
import ProfileInfoBtnModal from './ProfileInfoBtnModal';

const MessageItem = ({ message }) => {
  const { author, createdAt, text } = message;
  return (
    <li className='mt-2'>
      <div className="d-flex align-items-center font-bolder mb-1">
        <PresenceDot uid={author.uid} />
        <ProfileAvatar
          src={author.avatar}
          name={author.name}
          className="ml-1"
          size="xs"
        />
        <ProfileInfoBtnModal profile={author} />
        <TimeAgo date={createdAt} className="font-normal text-black-45 ml-2" />
      </div>
      <div className="ml-1">
        <span className="word-break-all">{text}</span>
      </div>
    </li>
  );
};

export default MessageItem;
