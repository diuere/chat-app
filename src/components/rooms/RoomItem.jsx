import TimeAgo from 'react-timeago';

const RoomItem = ({ room }) => {
  const { createdAt, name } = room;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center">
        <h3 className="text-disappear">{name}</h3>
        <TimeAgo date={createdAt} className="font-normal text-black-45" />
      </div>
      <div className="flex align-items-center text-black-70">
        <span>No messages yet...</span>
      </div>
    </div>
  );
};
export default RoomItem;
