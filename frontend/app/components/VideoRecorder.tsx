import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { LuCamera, LuCameraOff, LuMic } from "react-icons/lu";

const VideoRecorder = () => {
  const [permission, setPermission] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => {
          track.stop();
        });
      }
    };
  }, [stream]);

  const getCameraPermission = async () => {
    if ("MediaRecorder" in window) {
      try {
        const streamData = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true,
        });
        setPermission(true);
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

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => {
        track.stop();
      });
      setStream(null);
      setPermission(false);
    }
  };

  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div>
      <main>
        <div className="relative video-controls">
          {permission && stream ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              width="100%"
              height="auto"
              className="absolute z-0 top-[-50px]"
            />
          ) : (
            <span className="absolute top-[124px] left-[240px]">
              <Image
                src="/user-profile.png"
                alt="user-pfp"
                width={100}
                height={100}
                className="glowing-pfp"
              />
            </span>
          )}
          {!permission ? (
            <button
              className="glass-container-black w-[60px] h-[60px] flex justify-center items-center border border-white border-2 rounded-[50%] text-white absolute z-10 right-[219px] bottom-[-335px]"
              onClick={getCameraPermission}
              type="button"
            >
              <LuCameraOff size={25} />
            </button>
          ) : (
            <button
              className="glass-container-black w-[60px] h-[60px] flex justify-center items-center border border-white border-2 rounded-[50%] text-white absolute z-10 right-[219px] bottom-[-335px]"
              onClick={stopCamera}
              type="button"
            >
              <LuCamera size={25} />
            </button>
          )}
          <button
            className="glass-container-black w-[60px] h-[60px] flex justify-center items-center border border-white border-2 rounded-[50%] text-white absolute z-10 left-[219px] bottom-[-335px]"
            type="button"
          >
            <LuMic size={25} />
          </button>
        </div>
      </main>
    </div>
  );
};

export default VideoRecorder;
