import { createContext, useContext, useEffect, useState } from 'react';
import { transformToArrayWithId } from '../helpers/utils';
import { database } from '../misc/firebase';

const RoomsContext = createContext();

export const RoomsContextProvider = ({ children }) => {
  const [rooms, setRooms] = useState(null);

  useEffect(() => {
    const roomsListRef = database.ref('rooms');

    roomsListRef.on('value', snap => {
      const data = transformToArrayWithId(snap.val());
      setRooms(data);
    });

    return () => {
      roomsListRef.off();
    };
  }, []);

  return (
    <RoomsContext.Provider value={rooms}>
      {children}
    </RoomsContext.Provider>
  );
};

export const useRooms = () => useContext(RoomsContext);
