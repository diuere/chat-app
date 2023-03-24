import { Button, Drawer } from 'rsuite';
import { Dashboard } from '@rsuite/icons';
import { useModalState } from '../../helpers/custom-hooks';
import DashboardIndex from '.'

const DashboardToggle = () => {
  const { isOpen, open, close } = useModalState();

  return (
    <>
      <Button block color="blue" onClick={open}>
        <Dashboard icon="dashboard" /> Dashboard
      </Button>
      <Drawer open={isOpen} onClose={close} placement="left">
        <DashboardIndex />
      </Drawer>
    </>
  );
};

export default DashboardToggle;
