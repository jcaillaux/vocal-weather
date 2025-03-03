// components/AudioRecorder.tsx
import React, { useState, useRef } from 'react';


import 'bootstrap-icons/font/bootstrap-icons.css';


import WeatherApp from './MainCardWeather';
import WeatherForecastView from './SmallCardWeather';


interface AudioRecorderProps {
  onRecordingComplete?: (success: boolean, text: string) => void;
}

interface myData {
  daily: Array<object>,
  hourly: Array<object>,
  current: Array<string>,
  coordinates: object,
  timezone : object
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({ onRecordingComplete }) => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [text_data, setTextData] = useState<string>('');
  const [selectionIdx, setSelectionIdx] = useState<number>(0);
  const [city, setCity] = useState<string>('');
  const [weatherData, setWeatherData] = useState<myData>();
  const [isError, setIsError] = useState<boolean>(false);
  const [text, setText] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioContext = useRef<AudioContext | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          channelCount: 1,          // Mono audio
          sampleRate: 16000,        // 16 kHz sample rate
          sampleSize: 16,           // 16 bits per sample
        } 
      });

      // Initialize AudioContext
      audioContext.current = new AudioContext({
        sampleRate: 16000,
      });

      mediaRecorder.current = new MediaRecorder(stream, {
        mimeType: 'audio/webm',
      });

      const chunks: Blob[] = [];
      
      mediaRecorder.current.ondataavailable = (event: BlobEvent) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.current.onstop = async () => {
        const webmBlob = new Blob(chunks, { type: 'audio/webm' });
        const wavBlob = await convertToWav(webmBlob);
        await uploadAudio(wavBlob);
      };

      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const convertToWav = async (webmBlob: Blob): Promise<Blob> => {
    // Convert WebM to AudioBuffer
    const arrayBuffer = await webmBlob.arrayBuffer();
    const audioBuffer = await audioContext.current!.decodeAudioData(arrayBuffer);
    
    // Convert AudioBuffer to WAV
    const wavBuffer = audioBufferToWav(audioBuffer);
    return new Blob([wavBuffer], { type: 'audio/wav' });
  };

  const audioBufferToWav = (buffer: AudioBuffer): ArrayBuffer => {
    const numChannels = 1;  // Mono
    const sampleRate = buffer.sampleRate;
    const format = 1;  // PCM
    const bitDepth = 16;
    
    const bytesPerSample = bitDepth / 8;
    const blockAlign = numChannels * bytesPerSample;
    
    const data = buffer.getChannelData(0);  // Get mono channel data
    const dataLength = data.length * bytesPerSample;
    const buffer_ = new ArrayBuffer(44 + dataLength);
    const view = new DataView(buffer_);
    
    // WAV header
    writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + dataLength, true);
    writeString(view, 8, 'WAVE');
    writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, format, true);
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * blockAlign, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, bitDepth, true);
    writeString(view, 36, 'data');
    view.setUint32(40, dataLength, true);
    
    // Write audio data
    floatTo16BitPCM(view, 44, data);
    
    return buffer_;
  };

  const writeString = (view: DataView, offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  const floatTo16BitPCM = (view: DataView, offset: number, input: Float32Array) => {
    for (let i = 0; i < input.length; i++, offset += 2) {
      const s = Math.max(-1, Math.min(1, input[i]));
      view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
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
    //formData.append('text', text);

    try {
      const response = await fetch('/api/weather-audio', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const data = await response.json();
      if ('error' in data){
        setIsError(true);
        setTextData('Une erreur est survenue. Veuillez recommencer.');//data.message);
      }else{
        setIsError(false);
        setTextData(data.text);
        setWeatherData(data.data);
        setCity(data.city)
      }
      
      console.log('Upload successful:', data);
      if (onRecordingComplete) {
        onRecordingComplete(true, text);
      }
    } catch (error) {
      console.error('Error uploading audio:', error);
      if (onRecordingComplete) {
        onRecordingComplete(false, text);
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };
  const position = [51.505, -0.09];
  return (
    <div className="card max-h-sm mx-auto mt-0">
      <div className="card-body">
        <div className='container'>
        <div className='row'><div className='col'>
        <div className="d-flex justify-content-center mb-2">
            { isError && (
            <span className='text-danger'>{text_data}</span>
            )
            }
            { ! isError && (
            <span className='text-secondary'><b>{text_data}</b></span>
            )
            }
             </div></div>
            <div className='row'><div className='col'>
            <div className="d-flex justify-content-center">
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`btn ${isRecording ? 'btn-danger' : 'btn-primary'}`}
            disabled={isUploading}
          >
            <i className={`bi ${isRecording ? 'bi-stop-fill' : 'bi-mic'}`}></i>
            {' '}
            {isRecording ? 'Fin' : 'Demande'}
          </button>
          </div></div></div>
          </div>
        </div>

        {isUploading && (
          <div className="text-center mt-3">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}

        {! isError && weatherData && (<WeatherApp city={city} data={weatherData} selection={selectionIdx}/>)}
        {! isError && weatherData &&  weatherData.daily.length > 1 && (<WeatherForecastView data={weatherData} handleClick={(idx:number) => setSelectionIdx(idx)} selection={selectionIdx}/>)}


        </div>
    </div>
  );
};

export default AudioRecorder;