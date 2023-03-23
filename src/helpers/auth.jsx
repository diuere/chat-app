import firebase from 'firebase/app';
import { toaster, Notification } from 'rsuite';
import { auth, database } from '../misc/firebase';

export const signUserIn = async (provider) => {
  try {
    const { additionalUserInfo, user } = await auth.signInWithPopup(provider);
    
    if (additionalUserInfo.isNewUser) {
      await database.ref(`/profiles/${user.uid}`).set({
        name: user.displayName,
        createdAt: firebase.database.ServerValue.TIMESTAMP,
      });
    }

    toaster.push(
      <Notification type="success" header="success" />,
      { placement: 'topStart', duration: 4000 }
    );
  } catch (err) {
    toaster.push(
      <Notification type="error" header="error" />,
      { placement: 'topStart', duration: 4000 }
    );
  }
};
