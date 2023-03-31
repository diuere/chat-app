import { Button, Drawer } from 'rsuite';
import { Dashboard } from '@rsuite/icons';
import { toggleToasterPush, useMediaQuery, useModalState } from '../../helpers/custom-hooks';
import DashboardIndex from '.';
import { auth, database } from '../../misc/firebase';
import { useCallback } from 'react';
import { isOfflineForDatabase } from '../../context/profile-context';

const DashboardToggle = () => {
  const { isOpen, open, close } = useModalState();
  const isMobile = useMediaQuery('(max-width: 768px)');

  const onSignOut = useCallback(() => {
    database
      .ref(`/status/${auth.currentUser.uid}`)
      .set(isOfflineForDatabase)
      .then(() => {
        auth.signOut();
        toggleToasterPush('info', "Info", `You were signed out`, "topCenter", 4000);
        close();
      })
      .catch((error) => {
        toggleToasterPush('error', "Error", `${error.message}`, "topCenter", 4000);
      });
  }, [close]);

  return (
    <>
      <Button block color="blue" onClick={open}>
        <Dashboard icon="dashboard" /> Dashboard
      </Button>
      <Drawer
        size={isMobile ? 'full' : 'sm'}
        open={isOpen}
        onClose={close}
        placement="left"
      >
        <DashboardIndex onSignOut={onSignOut} />
      </Drawer>
    </>
  );
};

export default DashboardToggle;
