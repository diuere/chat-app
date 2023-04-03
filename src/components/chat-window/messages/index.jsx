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
        if(snap.val()) {
          const data = transformToArrayWithId(snap.val());
          setMessages(data)
        }
      });

    return () => {
      messagesRef.off('value');
      setMessages(null);
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

  const handleMsgDelete = useCallback(async (messageId) => {
    const confirm = window.confirm(`Are you sure you want to delete this message?`);
    if (!confirm) return;

    // creating a new messages object for the database update
    const updates = {};

    updates[`/messages/${messageId}`] = null; // removing the message selected from it

    // determining if the message selected is also the last message sent to the chat
    const isLast = messages[messages.length - 1].id === messageId;  

    if (isLast) {
      if (messages.length > 1){
        // reassigning the last message to its predecessor
        updates[`/rooms/${chatId}/lastMessage`] = { 
          ...messages[messages.length - 2],
          msgId: messages[messages.length - 2].id
        };
      } else {
        updates[`/rooms/${chatId}/lastMessage`] = null;
      }
    }

    try {
      await database.ref().update(updates);
    } catch (error) {
      toggleToasterPush("error", "Error", `${error.message}`, "topCenter", 4000);
    }
  }, [chatId, messages])

  // declaring the conditions for rendering
  const isChatEmpty = !messages ||  messages.length === 0;
  const canShowMessages = messages && messages.length > 0;

  return (
    <ul className="msg-list custom-scroll">
      {isChatEmpty && <li>No messages yet</li>}
      {canShowMessages &&
        messages.map(msg => <MessageItem key={msg.id} message={msg} handleAdmin={handleAdmin} handleMsgDelete={handleMsgDelete} />)}
    </ul>
  );
};

export default ChatMessages;
