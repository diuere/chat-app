import { Badge, Whisper, Tooltip, IconButton } from 'rsuite';
import { Icon } from '@iconify/react';

const ConditionalBadge = ({ children, condition }) => {
  return condition ? <Badge content={condition}>{children}</Badge> : children;
};

const IconBtnControl = ({
  isVisible,
  onClick,
  badgeContent,
  tooltip,
  iconName,
  ...props
}) => {
  const ConditionalIcon = () => {
    if (iconName === 'close') return <Icon icon="mdi:window-close" />;
    return <></>;
  };

  return (
    <div
      className="ml-2"
      style={{ visibility: isVisible ? 'visible' : 'hidden' }}
    >
      <ConditionalBadge condition={badgeContent}>
        <Whisper
          placement="top"
          delay={0}
          delayClose={0}
          delayOpen={0}
          trigger={'hover'}
          speaker={<Tooltip>{tooltip}</Tooltip>}
        >
          <IconButton
            {...props}
            circle
            size="xs"
            onClick={onClick}
            icon={<ConditionalIcon />}
          />
        </Whisper>
      </ConditionalBadge>
    </div>
  );
};

export default IconBtnControl;
