import { Button, Drawer } from 'rsuite';
import { Dashboard } from '@rsuite/icons';
import { useMediaQuery, useModalState } from '../../helpers/custom-hooks';
import DashboardIndex from '.'

const DashboardToggle = () => {
  const { isOpen, open, close } = useModalState();
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <>
      <Button block color="blue" onClick={open}>
        <Dashboard icon="dashboard" /> Dashboard
      </Button>
      <Drawer size={isMobile ? "full" : "sm"} open={isOpen} onClose={close} placement="left">
        <DashboardIndex />
      </Drawer>
    </>
  );
};

export default DashboardToggle;
