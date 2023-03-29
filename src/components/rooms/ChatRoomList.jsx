import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Loader, Nav } from 'rsuite';
import { useRooms } from '../../context/rooms-context';
import RoomItem from './RoomItem';

const NavLink = React.forwardRef(({ href, children, ...rest }, ref) => (
  <Link ref={ref} to={href} {...rest}>
    {children}
  </Link>
));

NavLink.displayName = 'NavLink';

const ChatRoomList = ({ height }) => {
  const rooms = useRooms();
  const location = useLocation();

  return (
    <Nav
      appearance="subtle"
      vertical
      reversed
      className="overflow-y-scroll custom-scroll"
      style={{
        height: `calc(100% - ${height}px)`,
      }}
      activeKey={location.pathname}
    >
      {!rooms ? (
        <Loader />
      ) : (
        rooms.length > 0 &&
        rooms.map(room => (
          <Nav.Item as={NavLink} href={`/chat/${room.id}`} key={room.id} eventKey={`/chat/${room.id}`}>
            <RoomItem room={room} />
          </Nav.Item>
        ))
      )}
    </Nav>
  );
};

export default ChatRoomList;
