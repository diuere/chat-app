import firebase from 'firebase/app';
import { auth, database } from '../misc/firebase';
import { toggleToasterPush } from './custom-hooks';

export const signUserIn = async provider => {
  try {
    const { additionalUserInfo, user } = await auth.signInWithPopup(provider);

    if (additionalUserInfo.isNewUser) {
      await database.ref(`/profiles/${user.uid}`).set({
        name: user.displayName,
        createdAt: firebase.database.ServerValue.TIMESTAMP,
      });
    }

    toggleToasterPush('success', 'Success', ``, 'topStart', 4000);
  } catch (error) {
    toggleToasterPush('error', 'Error', `${error.message}`, 'topStart', 4000);
  }
};

export const handleUnlinking = async (provider, updateState) => {
  try {
    if (auth.currentUser.providerData.length === 1)
    throw new Error(`You cannot disconnect from ${provider}`);
    
    await auth.currentUser.unlink(provider);
    
    updateState(provider, false);
    
    toggleToasterPush('info', 'Info', `Disconnected from ${provider}` , 'topStart', 4000);
  } catch (error) {
    toggleToasterPush('error', 'Error', `${error.message}`, 'topStart', 4000);
  }
};

export const handleLinking = async (provider, updateState) => {
  try {
    await auth.currentUser.linkWithPopup(provider);

    updateState(provider.providerId, true);

    toggleToasterPush('info', 'Info', `Connected to ${provider.providerId}` , 'topStart', 4000);
  } catch (error) {
    toggleToasterPush('error', 'Error', `${error.message}`, 'topStart', 4000);
  }
};
