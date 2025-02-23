// components/AudioRecorder.tsx
import React, { useState, useRef } from 'react';

interface AudioRecorderProps {
  onRecordingComplete?: (success: boolean, text: string) => void;
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({ onRecordingComplete }) => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [text, setText] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      
      mediaRecorder.current.ondataavailable = (event: BlobEvent) => {
        if (event.data.size > 0) {
          audioChunks.current.push(event.data);
        }
      };

      mediaRecorder.current.onstop = async () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
        await uploadAudio(audioBlob);
        audioChunks.current = [];
      };

      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state === 'recording') {
      mediaRecorder.current.stop();
      mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const uploadAudio = async (audioBlob: Blob) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.wav');
    formData.append('text', text);

    try {
      const response = await fetch('/api/weather', {  // This will be proxied to FastAPI
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Upload successful:', data);
      if (onRecordingComplete) {
        onRecordingComplete(true, text);
      }
    } catch (error) {
      console.error('Error uploading audio:', error);
      if (onRecordingComplete) {
        onRecordingComplete(false, 'Error');
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  return (
    <div className="card w-100 max-w-md mx-auto mt-4">
      <div className="card-body">
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Enter your text here..."
            value={text}
            onChange={handleTextChange}
          />
        </div>
        
        <div className="d-flex justify-content-center">
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`btn ${isRecording ? 'btn-danger' : 'btn-primary'}`}
            disabled={isUploading}
          >
            <i className={`bi ${isRecording ? 'bi-stop-fill' : 'bi-mic-fill'}`}></i>
            {' '}
            {isRecording ? 'Stop Recording' : 'Start Recording'}
          </button>
        </div>

        {isUploading && (
          <div className="text-center mt-3">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AudioRecorder;