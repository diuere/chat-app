import firebase from 'firebase';
import { useState } from 'react';
import { Button, Tag } from 'rsuite';
import { auth } from '../../misc/firebase';
import { Icon } from '@iconify/react';
import { handleLinking, handleUnlinking } from '../../helpers/auth';

const ProviderBlock = () => {
  const [isConnectedTo, setIsConnectedTo] = useState({
    ['google.com']: auth.currentUser.providerData.some(
      data => data.providerId === 'google.com'
    ),
  });

  const updateIsConnectedTo = (providerId, isConnect) => {
    setIsConnectedTo(p => {
      return {
        ...p,
        [providerId]: isConnect
      }
    })
  }

  const unLinkFrom = service => {
    switch (service) {
      case 'google':
        handleUnlinking('google.com', updateIsConnectedTo);
        break;
      default:
        return new Error('Invalid service: ' + service);
    }
  };

  const linkTo = service => {
    switch (service) {
      case 'google':
        handleLinking( new firebase.auth.GoogleAuthProvider(), updateIsConnectedTo );
        break;
      default:
        throw new Error('Invalid service: ' + service);
    }
  }

  return (
    <div>
      {isConnectedTo['google.com'] && (
        <Tag color="green" closable onClose={() => unLinkFrom('google')}>
          <Icon icon="mdi:google" /> Connected
        </Tag>
      )}

      <div className="mt-2">
        {!isConnectedTo['google.com'] && (
          <Button block color="green" appearance="primary" onClick={() => linkTo('google')}>
            <Icon icon="mdi:google" /> Connect
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProviderBlock;
