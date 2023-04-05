import { useState, useCallback } from 'react';
import firebase from "firebase/app";
import { InputGroup, Input } from 'rsuite';
import { Icon } from '@iconify/react';
import { useParams } from 'react-router-dom';
import { useProfile } from '../../../context/profile-context';
import { database } from '../../../misc/firebase';
import { toggleToasterPush } from '../../../helpers/custom-hooks';
import AttachmentBtnModal from './AttachmentBtnModal';

function assembleMessage(profile, chatId) {
  // shall attach common properties to the messages
  return {
    roomId: chatId,
    author: {
      name: profile.name,
      uid: profile.uid,
      createdAt: profile.createdAt,
      ...(profile.avatar ? {avatar: profile.avatar} : {}), 
    },
    createdAt: firebase.database.ServerValue.TIMESTAMP
  }
}

const ChatBottom = () => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { profile } = useProfile();
  const { chatId } = useParams();

  const onInputChange = useCallback(value => {
    setInput(value);
  }, []);

  const onSendClick = async () => {
    if(input.trim() === ""){
      return;
    }

    const msgData = assembleMessage(profile, chatId); // getting the proper chat object
    msgData.text = input; // attaching the actual message text

    const updates = {};

    const messagesId = database.ref("messages").push().key; // getting an unique key from the realtime database

    updates[`/messages/${messagesId}`] = msgData;
    updates[`/rooms/${chatId}/lastMessage`] = { // handling last message update
      ...msgData,
      msgId: messagesId,
    };

    setIsLoading(true);
    try {
      await database.ref().update(updates);
      
      setIsLoading(false);
      setInput('');
    } catch (error) {
      toggleToasterPush('error', 'Error', `${error.message}`, 'topCenter', 4000);
      setIsLoading(false);
    }
  };
  
  const onKeyDownHandler = (e) => { 
    if(e.keyCode === 13){
      e.preventDefault();
      onSendClick();
    }
  }

  const afterUpload = useCallback(async (files) => {
    setIsLoading(true);

    const updates = {};

    files.forEach((file) => {
      const msgData = assembleMessage(profile, chatId); // getting the proper chat object
      msgData.file = file; // attaching the file
      const messagesId = database.ref("messages").push().key; // getting an unique key from the realtime database

      updates[`/messages/${messagesId}`] = msgData;
    });

    // getting the last message id
    const lastMsgId = Object.keys(updates).pop();
    updates[`/rooms/${chatId}/lastMessage`] = { // handling last message update
      ...updates[lastMsgId],
      msgId: lastMsgId,
    }

    try {
      await database.ref().update(updates);
      
      setIsLoading(false);
    } catch (error) {
      toggleToasterPush('error', 'Error', `${error.message}`, 'topCenter', 4000);
      setIsLoading(false);
    }
  }, [chatId, profile]);

  return (
    <div>
      <InputGroup>
        <AttachmentBtnModal afterUpload={afterUpload}/>
        <Input
          placeholder="Write a new message here..."
          value={input}
          onChange={onInputChange}
          onKeyDown={onKeyDownHandler}
        />
        <InputGroup.Button
          color="blue"
          appearance="primary"
          onClick={onSendClick}
          disabled={isLoading}
        >
          <Icon icon="material-symbols:send" width="24" height="24" />
        </InputGroup.Button>
      </InputGroup>
    </div>
  );
};

export default ChatBottom;
