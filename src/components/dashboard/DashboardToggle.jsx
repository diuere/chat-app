import { Button, Drawer, Notification, toaster } from 'rsuite';
import { Dashboard } from '@rsuite/icons';
import { useMediaQuery, useModalState } from '../../helpers/custom-hooks';
import DashboardIndex from '.'
import { auth } from '../../misc/firebase';
import { useCallback } from 'react';

const DashboardToggle = () => {
  const { isOpen, open, close } = useModalState();
  const isMobile = useMediaQuery('(max-width: 768px)');

  const onSignOut = useCallback(() => {
    auth.signOut();

    toaster.push(
      <Notification type="info" header="info">You were signed out</Notification>,
      { placement: 'topStart', duration: 4000 }
    );
    
    close();
  }, [close])

  return (
    <>
      <Button block color="blue" onClick={open}>
        <Dashboard icon="dashboard" /> Dashboard
      </Button>
      <Drawer size={isMobile ? "full" : "sm"} open={isOpen} onClose={close} placement="left">
        <DashboardIndex onSignOut={onSignOut} />
        
      </Drawer>
    </>
  );
};

export default DashboardToggle;
