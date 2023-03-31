import { Badge, Tooltip, Whisper } from 'rsuite';
import { usePresence } from '../helpers/custom-hooks';

const getColor = presence => {
  if (!presence) return 'gray';
  else if (presence.state === 'online') return 'green';
  else if (presence.state === 'offline') return 'red';
  else return 'gray';
};

const getText = presence => {
  if (!presence) return 'status incomplete';
  return presence.state === 'online'
    ? 'online'
    : `Last online ${new Date(presence.last_changed).toLocaleDateString()}`;
};

const PresenceDot = ({ uid }) => {
  const presence = usePresence(uid);

  return (
    <Whisper
      placement="top"
      controlId="control-id-hover"
      trigger="hover"
      speaker={<Tooltip>{getText(presence)}</Tooltip>}
    >
      <Badge
        className="cursor-pointer"
        style={{ backgroundColor: getColor(presence) }}
      />
    </Whisper>
  );
};

export default PresenceDot;
