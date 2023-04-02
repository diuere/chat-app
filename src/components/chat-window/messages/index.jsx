import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toggleToasterPush } from '../../../helpers/custom-hooks';
import { transformToArrayWithId } from '../../../helpers/utils';
import { database } from '../../../misc/firebase';
import MessageItem from './MessageItem';

const ChatMessages = () => {
  const [messages, setMessages] = useState(null);
  const { chatId } = useParams();

  useEffect(() => {
    const messagesRef = database.ref('/messages');

    // setting a listener to messages that are related to the specific room
    messagesRef
      .orderByChild('roomId')
      .equalTo(chatId)
      .on('value', snap => {
        const data = transformToArrayWithId(snap.val());

        setMessages(data);
      });

    return () => {
      messagesRef.off('value');
    };
  }, [chatId]);

  const handleAdmin = useCallback(
    async uid => {
      const adminsRef = database.ref(`/rooms/${chatId}/admins`);
      let alertMsg;

      await adminsRef.transaction(admins => {
        if (admins) {
          if (admins[uid]) {
            // if the user is already an admin, revoke the permission
            admins[uid] = null;
            alertMsg = "Admin permission removed";
          } else {
            // else, give the permission
            admins[uid] = true;
            alertMsg = "Admin permission granted";
          } 
        }
        return admins;
      });

      toggleToasterPush("info", "Info", `${alertMsg}`, "topCenter", 2000);
    },
    [chatId]
  );

  // declaring the conditions for rendering
  const isChatEmpty = messages && messages.length === 0;
  const canShowMessages = messages && messages.length > 0;

  return (
    <ul className="msg-list custom-scroll">
      {isChatEmpty && <li>No messages yet</li>}
      {canShowMessages &&
        messages.map(msg => <MessageItem key={msg.id} message={msg} handleAdmin={handleAdmin} />)}
    </ul>
  );
};

export default ChatMessages;
