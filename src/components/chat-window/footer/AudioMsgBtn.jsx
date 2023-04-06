import { Icon } from '@iconify/react';
import { InputGroup } from 'rsuite';

function AudioRecorder({
  recording,
  audioURL,
  startRecording,
  stopRecording,
  onAudioUpload,
  isLoading,
  cancelAudioUpload
}) {
  return (
    <div
      className={`d-flex align-items-center ${
        audioURL ? 'w-100 message-bar-bg' : ''
      }`}
    >
      {!audioURL &&
        (recording ? (
          <InputGroup.Button onClick={stopRecording} className="animate-blink">
            <Icon icon="mdi:stop-circle" width="24" height="24" />
          </InputGroup.Button>
        ) : (
          <InputGroup.Button onClick={startRecording}>
            <Icon icon="mdi:microphone" width="24" height="24" />
          </InputGroup.Button>
        ))}
      {audioURL && <audio src={audioURL} controls className="flex-grow-2" />}
      {audioURL && (
        <>
          <InputGroup.Button
            onClick={cancelAudioUpload}
            disabled={isLoading}
            color="red"
            appearance="primary"
            className="h-100"
          >
            <Icon icon="mdi:delete" width="24" height="24" />
          </InputGroup.Button>
          <InputGroup.Button
            onClick={onAudioUpload}
            disabled={isLoading}
            color="blue"
            appearance="primary"
            className="h-100"
          >
            <Icon icon="material-symbols:send" width="24" height="24" />
          </InputGroup.Button>
        </>
      )}
    </div>
  );
}

export default AudioRecorder;
