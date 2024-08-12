import React, { useEffect, useRef, useState } from 'react';
import { Mic, Paperclip, Pause, Play, Send, StopCircle, X } from 'lucide-react';
import { useAudioRecorder, AudioRecorder } from 'react-audio-voice-recorder';

interface AudioRecordProps {
    inputMessage: string;
    handleInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    selectedFile: File | null;
    onSelectFile: (file: File) => void;
    handleSendMessage: () => void;
    recordedAudio: (audioBlob: Blob) => void
}

export const AudioRecord: React.FC<AudioRecordProps> = ({
    inputMessage,
    handleInput,
    handleKeyPress,
    selectedFile,
    onSelectFile,
    handleSendMessage,
    recordedAudio
}) => {
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [audioProgress, setAudioProgress] = useState(0);
    const [audioDuration, setAudioDuration] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const { startRecording, stopRecording, recordingBlob, isRecording, recordingTime } = useAudioRecorder();

    const recorderControls = useAudioRecorder();

    useEffect(() => {
        if (recordingBlob) {
            setAudioBlob(recordingBlob);
            const audio = new Audio(URL.createObjectURL(recordingBlob));
            audio.onloadedmetadata = () => {
                setAudioDuration(audio.duration);
            };
        }
    }, [recordingBlob]);

    useEffect(() => {
        return () => {
            if (isRecording) {
                stopRecording();
            }
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }
        };
    }, [isRecording, stopRecording]);

    const handleStartRecording = () => {
        setAudioBlob(null);
        setAudioProgress(0);
        setAudioDuration(0);
        startRecording();
    };

    const handleStopRecording = () => {
        stopRecording();
    };

    const cancelRecording = () => {
        if (isRecording) {
            stopRecording();
        }
        setAudioBlob(null);
        setAudioProgress(0);
        setAudioDuration(0);
    };

    const playRecording = () => {
        if (audioBlob && audioRef.current) {
            audioRef.current.src = URL.createObjectURL(audioBlob);
            audioRef.current.play();
            setIsPlaying(true);

            audioRef.current.ontimeupdate = () => {
                if (audioRef.current) {
                    setAudioProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
                }
            };

            audioRef.current.onended = () => {
                setAudioProgress(0);
                setIsPlaying(false);
            };
        }
    };

    const pauseRecording = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            setIsPlaying(false);
        }
    };

    const onRecordingComplete = (blob: Blob) => {
        setAudioBlob(blob);
        const audio = new Audio(URL.createObjectURL(blob));
        audio.onloadedmetadata = () => {
            setAudioDuration(audio.duration);
        };
    };

    const handleSaveRecordedAudio = (blob: Blob) => {
        recordedAudio(blob)
        handleSendMessage()
    }

    const formatDuration = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const handleSendButtonClick = () => {
        if (isRecording) {
            handleStopRecording();
        } else if (audioBlob) {
            handleSaveRecordedAudio(audioBlob);
        } else if (selectedFile || inputMessage.trim() !== '') {
            handleSendMessage();
        } else {
            handleStartRecording();
        }
    };

    const shouldShowSendButton = isRecording || audioBlob || selectedFile || inputMessage.trim() !== '';

    return (
        <div className="flex-grow flex items-center bg-white rounded-full border border-gray-300">
            {isRecording ? (
                <div className="flex-grow flex items-center justify-between p-2">
                    <AudioRecorder
                        onRecordingComplete={onRecordingComplete}
                        recorderControls={recorderControls}
                    />
                    <div className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                        <span className="text-sm text-gray-500">Recording: {formatDuration(recordingTime)}</span>
                    </div>
                    <div className="flex space-x-2">
                        <button onClick={cancelRecording} className="text-red-500 hover:text-red-700">
                            <X size={20} />
                        </button>
                        <button onClick={handleStopRecording} className="text-blue-500 hover:text-blue-700">
                            <StopCircle size={20} />
                        </button>
                    </div>
                </div>
            ) : audioBlob ? (
                <div className="flex-grow flex items-center justify-between p-2">
                    <div className="flex items-center space-x-2">
                        {isPlaying ? (
                            <button onClick={pauseRecording} className="text-blue-500 hover:text-blue-700">
                                <Pause size={20} />
                            </button>
                        ) : (
                            <button onClick={playRecording} className="text-blue-500 hover:text-blue-700">
                                <Play size={20} />
                            </button>
                        )}
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-in-out"
                                style={{ width: `${audioProgress}%` }}
                            ></div>
                        </div>
                        <span className="text-sm text-gray-500">{formatDuration(audioDuration)}</span>
                    </div>
                    <button onClick={cancelRecording} className="text-red-500 hover:text-red-700">
                        <X size={20} />
                    </button>
                </div>
            ) : (
                <input
                    type="text"
                    className="flex-grow px-4 py-2 focus:outline-none"
                    placeholder="Type a message"
                    value={inputMessage}
                    onChange={handleInput}
                    onKeyDown={handleKeyPress}
                />
            )}
            <button
                onClick={handleSendButtonClick}
                className={`p-2 rounded-full focus:outline-none transition duration-300 ${isRecording || audioBlob || selectedFile
                        ? 'bg-green-500 hover:bg-green-600'
                        : 'text-blue-500 hover:text-blue-700'
                    }`}
            >
                {isRecording || audioBlob || selectedFile || inputMessage.trim() !== '' ? (
                    <Send size={20} className="text-black" />
                ) : (
                    <Mic size={20} />
                )}
            </button>

            {!isRecording && !audioBlob && !selectedFile && inputMessage.trim() === '' && (
                <label className="cursor-pointer">
                    <input
                        type="file"
                        className="hidden"
                        onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                                onSelectFile(e.target.files[0]);
                            }
                        }}
                        accept="image/*,video/*,audio/*"
                    />
                    <Paperclip size={24} className="text-gray-500 hover:text-gray-700" />
                </label>
            )}
            <audio ref={audioRef} className="hidden" />
        </div>
    );
};