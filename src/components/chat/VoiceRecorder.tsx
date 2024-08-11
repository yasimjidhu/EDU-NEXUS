// Voice recording component
import React, { useState, useRef } from 'react';
import { ReactMic } from 'react-mic';
import { Mic, StopCircle, Play, X } from 'lucide-react';

const VoiceRecorder: React.FC<{ onAudioBlob: (blob: Blob) => void }> = ({ onAudioBlob }) => {
    const [isRecording, setIsRecording] = useState<boolean>(false);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const startRecording = () => setIsRecording(true);
    const stopRecording = () => setIsRecording(false);

    const onStop = (recordedBlob: { blob: Blob; blobURL: string }) => {
        setAudioBlob(recordedBlob.blob);
        onAudioBlob(recordedBlob.blob);
    };

    const playRecording = () => {
        if (audioBlob && audioRef.current) {
            const url = URL.createObjectURL(audioBlob);
            audioRef.current.src = url;
            audioRef.current.play();
        }
    };

    const cancelRecording = () => {
        setIsRecording(false);
        setAudioBlob(null);
    };

    return (
        <div className="flex items-center space-x-2">
            <ReactMic
                record={isRecording}
                className="sound-wave"
                onStop={onStop}
                mimeType="audio/webm"
            />
            {isRecording ? (
                <button onClick={stopRecording} className="text-red-500 hover:text-red-700">
                    <StopCircle size={20} />
                </button>
            ) : (
                <button onClick={startRecording} className="text-green-500 hover:text-green-700">
                    <Mic size={20} />
                </button>
            )}
            {audioBlob && (
                <div className="flex items-center space-x-2">
                    <button onClick={playRecording} className="text-blue-500 hover:text-blue-700">
                        <Play size={20} />
                    </button>
                    <button onClick={cancelRecording} className="text-red-500 hover:text-red-700">
                        <X size={20} />
                    </button>
                </div>
            )}
            {audioBlob && <audio ref={audioRef} controls />}
        </div>
    );
};

export default VoiceRecorder;
