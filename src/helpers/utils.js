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
  });
  roomsSnap.forEach(rSnap => {
    updates[`/rooms/${rSnap.key}/lastMessage/author/${keyToUpdate}`] = value;
  });

  return updates;
}

export function transformToArray(snapVal) {
  return snapVal ? Object.keys(snapVal) : [];
}

export function groupByDate(messages) {
  // returns an object with keys as dates and values as arrays of messages for each date by
  return messages.reduce((result, message) => {
    // creating a grouping key for each message by converting its createdAt property to a date string 
    const groupingKey = new Date(message.createdAt).toDateString();

    // and if the grouping key doesn't exist in the accumulator object, add it with an empty array value
    if (!result[groupingKey]) result[groupingKey] = [];

    // then pushing the message to the array associated with its grouping key in the accumulator object
    result[groupingKey].push(message);

    return result;
  }, {});
}
