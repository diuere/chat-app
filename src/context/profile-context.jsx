import firebase from 'firebase/app';
import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, database } from '../misc/firebase';

export const isOfflineForDatabase = {
  state: 'offline',
  last_changed: firebase.database.ServerValue.TIMESTAMP,
};

const isOnlineForDatabase = {
  state: 'online',
  last_changed: firebase.database.ServerValue.TIMESTAMP,
};

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let userRef;
    let userStatusRef;

    const authSub = auth.onAuthStateChanged(authObj => {
      if (authObj) {
        userRef = database.ref(`/profiles/${authObj.uid}`);
        userStatusRef = database.ref(`/status/${authObj.uid}`);

        userRef.on('value', snap => {
          const props = snap.val();

          const data = {
            ...props,
            uid: authObj.uid,
            email: authObj.email,
          };

          setProfile(data);
          setIsLoading(false);
        });

        // perform real time presence management
        database
          .ref('.info/connected')
          .on('value', snapshot => {
            // If we're not currently connected, don't do anything.
            if (!!snapshot.val() === false) {
              return;
            }

            // the 'onDisconnect' method adds a set which will only trigger once this user has disconnected for any reason
            userStatusRef
              .onDisconnect()
              .set(isOfflineForDatabase)
              .then(function () {
                // with this, the user can be set as 'online' and the server will handle the offline status if the user lose connection.
                userStatusRef.set(isOnlineForDatabase);
              });
          });
      } else {
        if (userRef) userRef.off();
        if (userStatusRef) userStatusRef.off();

        database.ref(".info/connected").off();
        
        setProfile(null);
        setIsLoading(false);
      }
    });
    
    return () => {
      authSub();
      database.ref(".info/connected").off(); 
      
      if (userRef) userRef.off();
      if (userStatusRef) userStatusRef.off();
    };
  }, []);

  return (
    <ProfileContext.Provider value={{ isLoading, profile, navigate }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => useContext(ProfileContext);
