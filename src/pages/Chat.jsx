import { useParams } from 'react-router-dom';
import { Loader } from 'rsuite';
import ChatBottom from '../components/chat-window/footer';
import ChatTop from '../components/chat-window/header';
import ChatMessages from '../components/chat-window/messages';
import { CurrentRoomProvider } from '../context/current-room-context';
import { useRooms } from '../context/rooms-context';

const Chat = () => {
  const { chatId } = useParams();
  const rooms = useRooms();

  if (!rooms) {
    return <Loader center vertical size="md" content="loading" speed="slow" />;
  }

  const currentRoom = rooms.find(r => r.id === chatId);

  if (!currentRoom) {
    return <h6 className="text-center mt-page">Chat {chatId} not found</h6>;
  }

  const currentRoomData = {
    name: currentRoom.name,
    description: currentRoom.description
  }

  return (
    <CurrentRoomProvider data={currentRoomData}>
      <div className="chat-top">
        <ChatTop />
      </div>
      <div className="chat-middle">
        <ChatMessages />
      </div>
      <div className="chat-bottom">
        <ChatBottom />
      </div>
    </CurrentRoomProvider>
  );
};

export default Chat;
