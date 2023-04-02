import { memo } from 'react';
import { useCurrentRoom } from '../../../context/current-room-context';
import RoomInfoBtnModal from './RoomInfoBtnModal';
import { ButtonToolbar } from 'rsuite';
import EditRoomBtnDrawer from './EditRoomBtnDrawer';
import BackToHomeBtn from '../../BackToHomeBtn';

const ChatTop = () => {
  const name = useCurrentRoom(state => state.name);
  const description = useCurrentRoom(state => state.description);
  const isAdmin = useCurrentRoom(state => state.isAdmin);
  const briefDesc =
    description.length > 25
      ? description.replace(/^(.{1,20})[\s\S]*/, '$1') + '...'
      : description;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center">
        <h4 className="text-disappear d-flex align-items-center">
          <BackToHomeBtn />
          <span className="text-disappear">{name}</span>
        </h4>

        <ButtonToolbar className="ws-nowrap">
          {isAdmin && <EditRoomBtnDrawer />}
        </ButtonToolbar>
      </div>

      <div className="d-flex justify-content-between align-items-center">
        <span>{briefDesc}</span>
        <RoomInfoBtnModal />
      </div>
    </div>
  );
};

export default memo(ChatTop);
