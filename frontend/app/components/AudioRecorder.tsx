import React, { useState, useEffect, useRef } from "react";

const mimeType = "audio/webm";

const AudioRecorder: React.FC = () => {
  const [permission, setPermission] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const [recordingStatus, setRecordingStatus] = useState("inactive");
  const [audio, setAudio] = useState<string | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [audioBase64, setAudioBase64] = useState<string | null>(null);

  const getMicrophonePermission = async () => {
    if ("MediaRecorder" in window) {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false,
        });
        setPermission(true);
        setStream(mediaStream);
      } catch (err) {
        alert((err as Error).message);
      }
    } else {
      alert("The MediaRecorder API is not supported in your browser.");
    }
  };

  const startRecording = () => {
    if (stream) {
      setRecordingStatus("recording");
      const media = new MediaRecorder(stream, { mimeType });

      let chunks: Blob[] = [];

      media.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      media.onstop = () => {
        const audioBlob = new Blob(chunks, { type: mimeType });

        console.log("Audio Blob Size:", audioBlob.size);
        console.log("Audio Blob Type:", audioBlob.type);

        if (audioBlob.size === 0) {
          console.error("Empty audio blob. Recording may have failed.");
          return;
        }

        const audioUrl = URL.createObjectURL(audioBlob);
        console.log("Audio URL:", audioUrl);

        setAudio(audioUrl);
        setAudioChunks([]); // Clear audioChunks after successful processing

        // Convert Blob to Base64
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64data = reader.result as string;
          setAudioBase64(base64data);
        };
        reader.readAsDataURL(audioBlob);
      };

      mediaRecorder.current = media;
      mediaRecorder.current.start();
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && recordingStatus === "recording") {
      mediaRecorder.current.stop();
      setRecordingStatus("inactive");
    }
  };

  useEffect(() => {
    // Attempt to get microphone permission immediately on component mount
    getMicrophonePermission();
  }, []); // Empty dependency array ensures this runs only once on mount

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => {
          track.stop();
        });
      }
    };
  }, [stream]);

  return (
    <div>
      <main>
        <div className="audio-controls">
          {!permission ? (
            <button onClick={getMicrophonePermission} type="button">
              Get Microphone
            </button>
          ) : null}
          {permission && recordingStatus === "inactive" ? (
            <button onClick={startRecording} type="button">
              Start Recording
            </button>
          ) : null}
          {recordingStatus === "recording" ? (
            <button onClick={stopRecording} type="button">
              Stop Recording
            </button>
          ) : null}
        </div>
        {audio ? (
          <div className="audio-player">
            <audio src={audio} controls></audio>
          </div>
        ) : null}
        {audioBase64 ? (
          <div>
            <h3>Base64 Encoded Audio:</h3>
            <textarea
              readOnly
              style={{ width: "100%", height: "100px" }}
              value={audioBase64}
            />
          </div>
        ) : null}
      </main>
    </div>
  );
};

export default AudioRecorder;
