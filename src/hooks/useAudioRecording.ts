import { uploadToCloudinary } from "../utils/cloudinary";
import { useState } from "react";

export const useAudioRecording = () => {
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [audioProgress, setAudioProgress] = useState(0);
    const [audioDuration, setAudioDuration] = useState(0);
  
    const handleRecordedAudio = (blob: Blob|null) => {
        if(blob){
            setAudioBlob(blob);
        }
    };
  
    const uploadAudio = async () => {
      if (audioBlob) {
        try {
          const fileUrl = await uploadToCloudinary(new File([audioBlob], 'audio.webm', { type: 'audio/webm' }), setAudioProgress);
          return { fileUrl, fileType: 'audio' };
        } catch (error) {
          console.error('Error uploading audio:', error);
          return null;
        }
      }
      return null;
    };
  
    return { audioBlob, audioProgress, audioDuration, handleRecordedAudio, uploadAudio, setAudioProgress, setAudioDuration,setAudioBlob };
}
