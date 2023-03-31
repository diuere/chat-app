export function getNameInitials(name) {
  const splitName = name.toUpperCase().split(' ');
  if (splitName.length > 1) return splitName[0][0] + splitName[1][0];

  return splitName[0][0];
}

export function transformToArrayWithId(snapVal) {
  return Object.keys(snapVal).map(key => {
    return { ...snapVal[key], id: key };
  });
}

export async function getUserUpdates(userId, keyToUpdate, value, database) {
  // shall handle the update of duplicated references
  const updates = {};

  // handling the profiles update
  updates[`/profiles/${userId}/${keyToUpdate}`] = value;

  // getting references
  const getMsgs = database
    .ref('/messages')
    .orderByChild('author/uid')
    .equalTo(userId)
    .once('value');
  const getRooms = database
    .ref('/rooms')
    .orderByChild('lastMessage/author/uid')
    .equalTo(userId)
    .once('value');

    // resolving promises
    const [messagesSnap, roomsSnap] = await Promise.all([getMsgs, getRooms]);

    // handling messages and rooms prop update
    messagesSnap.forEach(msgSnap => {
      updates[`/messages/${msgSnap.key}/author/${keyToUpdate}`] = value;
    })
    roomsSnap.forEach(rSnap => {
      updates[`/rooms/${rSnap.key}/lastMessage/author/${keyToUpdate}`] = value;
    })

    return updates;
}
