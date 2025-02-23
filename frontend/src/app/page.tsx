// app/page.tsx
'use client';

import AudioRecorder from '@/components/AudioRecorder';

export default function Home() {
  const handleRecordingComplete = (success: boolean, text: string) => {
    if (success) {
      console.log('Recording uploaded successfully');
      console.log('Text value:', text);  // Vous avez maintenant accès au texte ici
    } else {
      console.log('Recording upload failed');
    }
  };

  return (
    <main className="container py-4">
      <h1 className="text-center mb-4">Vocal Weather App</h1>
      <AudioRecorder onRecordingComplete={handleRecordingComplete} />
    </main>
  );
}