import { useParams } from 'react-router-dom';
import { Loader } from 'rsuite';
import BackToHomeBtn from '../components/BackToHomeBtn';
import ChatBottom from '../components/chat-window/footer';
import ChatTop from '../components/chat-window/header';
import ChatMessages from '../components/chat-window/messages';
import { CurrentRoomProvider } from '../context/current-room-context';
import { useRooms } from '../context/rooms-context';
import { transformToArray } from '../helpers/utils';
import { auth } from '../misc/firebase';

const Chat = () => {
  const { chatId } = useParams();
  const rooms = useRooms();

  if (!rooms) {
    return <Loader center vertical size="md" content="loading" speed="slow" />;
  }

  const currentRoom = rooms.find(r => r.id === chatId);

  if (!currentRoom) {
    return (
      <div>
        <BackToHomeBtn />
        <h6 className="text-center mt-page">Chat {chatId} not found</h6>;
      </div>
    )
  }

  const { name, description } = currentRoom;
  const admins = transformToArray(currentRoom.admins);
  const isAdmin = admins.includes(auth.currentUser.uid);

  const currentRoomData = {
    name,
    description,
    admins,
    isAdmin,
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
