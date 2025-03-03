// app/page.tsx
'use client';

import AudioRecorder from '@/components/AudioRecorder';


export default function Home() {
  const handleRecordingComplete = (success: boolean, text: string) => {
    if (success) {
      console.log('Recording uploaded successfully');
      console.log('Text value:', text); 
    } else {
      console.log('Recording upload failed');
    }
  };

  return (
    <main className="container py-2">
      <h1 className="text-center">WeatherWave</h1>
      <AudioRecorder onRecordingComplete={handleRecordingComplete} />
    </main>
  );
}