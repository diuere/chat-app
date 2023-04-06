import { useState, useCallback, useRef } from 'react';
import RecordRTC from 'recordrtc';
import firebase from 'firebase/app';
import { InputGroup, Input } from 'rsuite';
import { Icon } from '@iconify/react';
import { useParams } from 'react-router-dom';
import { useProfile } from '../../../context/profile-context';
import { database, storage } from '../../../misc/firebase';
import { toggleToasterPush } from '../../../helpers/custom-hooks';
import AttachmentBtnModal from './AttachmentBtnModal';
import AudioMsgBtn from './AudioMsgBtn';

function assembleMessage(profile, chatId) {
  // shall attach common properties to the messages
  return {
    roomId: chatId,
    author: {
      name: profile.name,
      uid: profile.uid,
      createdAt: profile.createdAt,
      ...(profile.avatar ? { avatar: profile.avatar } : {}),
    },
    createdAt: firebase.database.ServerValue.TIMESTAMP,
  };
}

const ChatBottom = () => {
  // states for text input handling
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { profile } = useProfile();
  const { chatId } = useParams();
  // states for audio upload handling
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const recorderRef = useRef(null);

  const onInputChange = useCallback(value => {
    setInput(value);
  }, []);

  const onSendClick = async () => {
    if (input.trim() === '') {
      return;
    }

    const msgData = assembleMessage(profile, chatId); // getting the proper chat object
    msgData.text = input; // attaching the actual message text

    const updates = {};

    const messagesId = database.ref('messages').push().key; // getting an unique key from the realtime database

    updates[`/messages/${messagesId}`] = msgData;
    updates[`/rooms/${chatId}/lastMessage`] = {
      // handling last message update
      ...msgData,
      msgId: messagesId,
    };

    setIsLoading(true);
    try {
      await database.ref().update(updates);

      setIsLoading(false);
      setInput('');
    } catch (error) {
      toggleToasterPush(
        'error',
        'Error',
        `${error.message}`,
        'topCenter',
        4000
      );
      setIsLoading(false);
    }
  };

  // handle send message on Enter key press
  const onKeyDownHandler = e => {
    if (e.keyCode === 13) {
      e.preventDefault();
      onSendClick();
    }
  };

  // function for file upload operation
  const afterUpload = useCallback(
    async files => {
      setIsLoading(true);

      const updates = {};

      files.forEach(file => {
        const msgData = assembleMessage(profile, chatId); // getting the proper chat object
        msgData.file = file; // attaching the file
        const messagesId = database.ref('messages').push().key; // getting an unique key from the realtime database

        updates[`/messages/${messagesId}`] = msgData;
      });

      // getting the last message id
      const lastMsgId = Object.keys(updates).pop();
      updates[`/rooms/${chatId}/lastMessage`] = {
        // handling last message update
        ...updates[lastMsgId],
        msgId: lastMsgId,
      };

      try {
        await database.ref().update(updates);

        setIsLoading(false);
      } catch (error) {
        toggleToasterPush(
          'error',
          'Error',
          `${error.message}`,
          'topCenter',
          4000
        );
        setIsLoading(false);
      }
    },
    [chatId, profile]
  );

  // functions for audio recording operation
  const startRecording = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(stream => {
        const recorder = RecordRTC(stream, {
          type: 'audio',
          mimeType: 'audio/mp3',
          sampleRate: 44100,
          desiredSampRate: 16000,
          recorderType: RecordRTC.StereoAudioRecorder,
          numberOfAudioChannels: 1,
        });
        recorder.startRecording();
        recorderRef.current = recorder;
        setRecording(true);
      })
      .catch(error => console.log(error));
  };

  const stopRecording = () => {
    recorderRef.current.stopRecording(() => {
      const blob = recorderRef.current.getBlob();
      const url = URL.createObjectURL(blob);
      setAudioURL(url);
      setRecording(false);
    });
  };

  const onAudioUpload = useCallback(async () => {
    setIsLoading(true);
    try {
      const audioBlob = recorderRef.current.getBlob();
      const uploadTask = storage
        .ref(`/chat/${chatId}`)
        .child(`audio_${Date.now()}.mp3`)
        .put(audioBlob, {
          cacheControl: `public, max-age=${3600 * 24 * 3}`,
        });

      // Wait for the upload to complete before accessing metadata
      uploadTask.on(
        'state_changed',
        snapshot => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        error => {
          setIsLoading(false);
          toggleToasterPush(
            'error',
            'Error',
            `${error.message}`,
            'topCenter',
            4000
          );
        },
        async () => {
          const snap = await uploadTask.snapshot.ref.getMetadata();

          // file for the database
          const file = {
            contentType: snap.contentType,
            name: snap.name,
            url: await uploadTask.snapshot.ref.getDownloadURL(),
          };

          setIsLoading(false);
          afterUpload([file]);
          setAudioURL(null);
        }
      );
    } catch (error) {
      setIsLoading(false);
      toggleToasterPush(
        'error',
        'Error',
        `${error.message}`,
        'topCenter',
        4000
      );
    }
  }, [chatId, afterUpload]);

  const cancelAudioUpload = () => {
    setAudioURL(null);
  };

  return (
    <div>
      <InputGroup>
        {!audioURL && <AttachmentBtnModal afterUpload={afterUpload} />}
        {!audioURL && (
          <Input
            placeholder="Write a new message here..."
            value={input}
            onChange={onInputChange}
            onKeyDown={onKeyDownHandler}
          />
        )}
        {input.length > 0 && (
          <InputGroup.Button
            color="blue"
            appearance="primary"
            onClick={onSendClick}
            disabled={isLoading}
          >
            <Icon icon="material-symbols:send" width="24" height="24" />
          </InputGroup.Button>
        )}
        {input.length < 1 && (
          <AudioMsgBtn
            recording={recording}
            audioURL={audioURL}
            startRecording={startRecording}
            stopRecording={stopRecording}
            onAudioUpload={onAudioUpload}
            isLoading={isLoading}
            cancelAudioUpload={cancelAudioUpload}
          />
        )}
      </InputGroup>
    </div>
  );
};

export default ChatBottom;
