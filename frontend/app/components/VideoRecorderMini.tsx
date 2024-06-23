import React, { useState, useEffect, useRef } from "react";

const VideoRecorderMini = () => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Get camera permission and start the camera immediately after the component is rendered
    const getCameraPermission = async () => {
      if ("MediaRecorder" in window) {
        try {
          const streamData = await navigator.mediaDevices.getUserMedia({
            audio: false, // Disable audio capture
            video: true,
          });
          setStream(streamData);
        } catch (err) {
          if (err instanceof Error) {
            alert(err.message);
          }
        }
      } else {
        alert("The MediaRecorder API is not supported in your browser.");
      }
    };

    getCameraPermission();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => {
          track.stop();
        });
      }
    };
  }, []);

  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div>
      <main>
        <div className="relative">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            width="100%"
            height="auto"
            className="z-0 top-[-50px]"
            muted // Add this attribute to mute the video element
          />
        </div>
      </main>
    </div>
  );
};

export default VideoRecorderMini;
