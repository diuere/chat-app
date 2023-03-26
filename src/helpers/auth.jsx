import firebase from 'firebase/app';
import { toaster, Notification } from 'rsuite';
import { auth, database } from '../misc/firebase';

export const signUserIn = async provider => {
  try {
    const { additionalUserInfo, user } = await auth.signInWithPopup(provider);

    if (additionalUserInfo.isNewUser) {
      await database.ref(`/profiles/${user.uid}`).set({
        name: user.displayName,
        createdAt: firebase.database.ServerValue.TIMESTAMP,
      });
    }

    toaster.push(<Notification type="success" header="success" />, {
      placement: 'topStart',
      duration: 4000,
    });
  } catch (err) {
    toaster.push(
      <Notification type="error" header="error">
        {err.message}
      </Notification>,
      { placement: 'topStart', duration: 4000 }
    );
  }
};

export const handleUnlinking = async (provider, updateState) => {
  try {
    if (auth.currentUser.providerData.length === 1)
      throw new Error(`You cannot disconnect from ${provider}`);

    await auth.currentUser.unlink(provider);

    updateState(provider, false);

    toaster.push(
      <Notification type="info" header="Info">
        Disconnected from ${provider}
      </Notification>,
      {
        placement: 'topStart',
        duration: 4000,
      }
    );
  } catch (error) {
    toaster.push(
      <Notification type="error" header="error">
        {error.message}
      </Notification>,
      {
        placement: 'topStart',
        duration: 4000,
      }
    );
  }
};

export const handleLinking = async (provider, updateState) => {
  try {
    await auth.currentUser.linkWithPopup(provider);

    updateState(provider.providerId, true);

    toaster.push(
      <Notification type="info" header="Info">
        Connected to ${provider.providerId}
      </Notification>,
      {
        placement: 'topStart',
        duration: 4000,
      }
    );
  } catch (error) {
    toaster.push(
      <Notification type="error" header="error">
        {error.message}
      </Notification>,
      {
        placement: 'topStart',
        duration: 4000,
      }
    );
  }
}


