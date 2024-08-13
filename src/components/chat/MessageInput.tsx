// MessageInput.tsx
import React, { useState } from 'react';
import { Send, Paperclip, Mic, Smile } from 'lucide-react';
import Picker from 'emoji-picker-react';
import { AudioRecord } from './AudioRecorder';

export interface message{
  text?:string|null;
  file?:File|null;
  audioBlob?: Blob|null;
}
interface MessageInputProps {
  onSendMessage: (message:message) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const handleSubmit = () => {
    if (message.trim() || selectedFile || audioBlob) {
      onSendMessage({ text: message.trim(), file: selectedFile, audioBlob });
      setMessage('');
      setSelectedFile(null);
      setAudioBlob(null);
      setIsRecording(false);
    }
  };


  const handleEmojiClick = (emojiData: { emoji: string }) => {
    setMessage((prev) => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };


  const handleRecordedAudio = (audioBlob: Blob) => {
    setAudioBlob(audioBlob);
  };

  return (
    <div className="sticky bottom-0 left-0 w-full bg-white border-t border-gray-200 p-4">
      <div className="flex items-center space-x-2 relative">
        <button
          type="button"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          <Smile size={24} />
        </button>

        {showEmojiPicker && (
          <div className="absolute bottom-20 left-2 z-50">
            <Picker onEmojiClick={handleEmojiClick} />
          </div>
        )}

        <AudioRecord
          inputMessage={message}
          handleInput={handleInputChange}
          handleKeyPress={handleKeyPress}
          selectedFile={selectedFile}
          onSelectFile={(file) => setSelectedFile(file)}
          handleSendMessage={handleSubmit}
          recordedAudio={handleRecordedAudio}
        />

        <button
          onClick={handleSubmit}
          className={`p-2 rounded-full focus:outline-none mr-3 transition duration-300 ${isRecording || audioBlob || selectedFile || message.trim() !== '' 
            ? 'bg-green-500 hover:bg-green-600' 
            : 'text-blue-500 hover:text-blue-700'
          }`}
        >
          <Send size={20} className="text-black" />
        </button>
      </div>
    </div>
  );
};

export default MessageInput;
