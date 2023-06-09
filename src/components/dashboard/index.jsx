import { Button, Divider, Drawer } from 'rsuite';
import { useProfile } from '../../context/profile-context';
import { toggleToasterPush } from '../../helpers/custom-hooks';
import { getUserUpdates } from '../../helpers/utils';
import { database } from '../../misc/firebase';
import EditableInput from '../EditableInput';
import AvatarUploadBtn from './AvatarUploadBtn';
import ProviderBlock from './ProviderBlock';

const DashboardIndex = ({ onSignOut }) => {
  const { profile } = useProfile();

  const onSave = async newData => {
    try {
      // updating profile user name
      await getUserUpdates(profile.uid, 'name', newData, database).then(
        updates => database.ref().update(updates)
      );

      toggleToasterPush('success', 'Success', `User nickname has been updated`, 'topStart', 4000);
    } catch (error) {
      toggleToasterPush('error', 'Error', `${error.message}`, 'topStart', 4000);
    }
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
        <ProviderBlock />
        <Divider />
        <EditableInput
          name="nickname"
          defaultValue={profile.name}
          onSave={onSave}
          label={<h6 className="mb-2">Nickname</h6>}
        />
        <AvatarUploadBtn />
      </Drawer.Body>
    </>
  );
};

export default DashboardIndex;
