import { Button, Divider, Drawer } from 'rsuite';
import { useProfile } from '../../context/profile-context';
import EditableInput from '../EditableInput';

const DashboardIndex = ({ onSignOut }) => {
  const { profile } = useProfile();

  const onSave = () => {
    
  };

  return (
    <>
      <Drawer.Header>
        <Drawer.Title>Dashboard</Drawer.Title>
        <Drawer.Actions>
          <Button block color="red" appearance="primary" onClick={onSignOut}>
            Sign out
          </Button>
        </Drawer.Actions>
      </Drawer.Header>

      <Drawer.Body>
        <h3>Hey, {profile.name}</h3>
        <Divider />
        <EditableInput 
          name="nickname"
          defaultValue={profile.name}
          onSave={onSave}
          label={<h6 className="mb-2">Nickname</h6>}
        />
      </Drawer.Body>
    </>
  );
};

export default DashboardIndex;
