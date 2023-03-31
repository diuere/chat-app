import { memo } from 'react';
import { Icon } from '@iconify/react';
import { useCurrentRoom } from '../../../context/current-room-context';
import { useMediaQuery } from '../../../helpers/custom-hooks';
import { Link } from 'react-router-dom';
import RoomInfoBtnModal from './RoomInfoBtnModal';
import { Button, ButtonToolbar } from 'rsuite';

const ChatTop = () => {
  const name = useCurrentRoom(state => state.name);
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center">
        <h4 className="text-disappear d-flex align-items-center">
          <Link
            to="/"
            className={
              isMobile
                ? 'd-flex p-0 mr-2 text-blue link-unstyled h-100'
                : 'd-none'
            }
          >
            <Icon
              icon="material-symbols:arrow-circle-left"
              width="26"
              height="26"
            />
          </Link>
          <span className="text-disappear">{name}</span>
        </h4>

        <ButtonToolbar className="ws-nowrap">
          <Button>todo</Button>
        </ButtonToolbar>
      </div>

      <div className="d-flex justify-content-between align-items-center">
        <span>todo</span>
        <RoomInfoBtnModal />
      </div>
    </div>
  );
};

export default memo(ChatTop);
