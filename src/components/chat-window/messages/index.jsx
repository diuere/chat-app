import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
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

  // declaring the conditions for rendering
  const isChatEmpty = messages && messages.length === 0;
  const canShowMessages = messages && messages.length > 0;

  return (
    <ul className="msg-list custom-scroll">
      {isChatEmpty && <li>No messages yet</li>}
      {canShowMessages && messages.map(msg => <MessageItem key={msg.id} message={msg} />)}
    </ul>
  );
};

export default ChatMessages;
