import os
import azure.cognitiveservices.speech as speechsdk

class FileEncodingError(Exception):
    """Base exception for file encoding errors"""
    pass

class SpeechTranscriptionError(Exception):
    """Base exception for speech transcription errors"""
    pass

class NoSpeechDetectedError(SpeechTranscriptionError):
    """Raised when no speech could be recognized in the audio"""
    pass

class TranscriptionCanceledError(SpeechTranscriptionError):
    """Raised when transcription is canceled for any reason"""
    pass

class STTService :

    def __init__(self, lang='fr-FR'):
        self.speech_config = speechsdk.SpeechConfig(

            subscription=os.environ.get('SPEECH_KEY'), 
            region=os.environ.get('SPEECH_REGION')
        )
        self.speech_config.speech_recognition_language=lang

    def transcribe(self, filename='../audio/recording.wav'):

        if not os.path.isfile(filename): raise FileExistsError(f"`{filename}`: File not found.")
        try :
            # Runtime Exception is raise is encoding is not 
            # recognized by Azure STT service
            audio_config = speechsdk.audio.AudioConfig(filename=filename)

            speech_recognizer = speechsdk.SpeechRecognizer(
                speech_config=self.speech_config,
                audio_config=audio_config
            )
        except RuntimeError as e:
            raise RuntimeError("Wrong Encoding")

        speech_recognition_result = speech_recognizer.recognize_once_async().get()

        if speech_recognition_result.reason == speechsdk.ResultReason.RecognizedSpeech:
            return speech_recognition_result.text
        elif speech_recognition_result.reason == speechsdk.ResultReason.NoMatch:
            raise NoSpeechDetectedError(speech_recognition_result.no_match_details)
        elif speech_recognition_result.reason == speechsdk.ResultReason.Canceled:
            cancellation_details = speech_recognition_result.cancellation_details
    
            if cancellation_details.reason == speechsdk.CancellationReason.Error:
                raise TranscriptionCanceledError(cancellation_details.reason + " " + cancellation_details.error_details)
            raise SpeechTranscriptionError(cancellation_details.reason)

if __name__ == '__main__':
    stt_service = STTService()
    try :
        stt_service.transcribe(filename='../audio/recording.wav')
    except NoSpeechDetectedError as e:
        print(e)
    except RuntimeError as e:
        print(e)