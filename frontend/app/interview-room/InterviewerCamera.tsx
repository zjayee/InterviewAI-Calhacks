import { useState, useRef, useEffect } from "react";
import { BsSoundwave } from "react-icons/bs";

export default function InterviewerCamera({
  videoIndex,
}: {
  videoIndex: number;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoSources = [
    "/result_voice1.mp4",
    "/result_voice2.mp4",
    "/result_voice3.mp4",
    "/result_voice4.mp4",
  ];

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.src = videoSources[videoIndex];
      videoRef.current.load();
      videoRef.current.play().catch((error) => {
        console.error("Failed to play video:", error.message);
      });
    }
  }, [videoIndex]);

  const hideDefaultControls = (
    event: React.SyntheticEvent<HTMLVideoElement, Event>
  ) => {
    event.preventDefault();
    if (videoRef.current) {
      videoRef.current.controls = false;
    }
  };

  return (
    <div className="relative">
      <svg className="absolute top-[-999px] left-[-999px] w-0 h-0">
        <defs>
          <clipPath className="scale-[0.78]" id="interviewer-clip">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M194.597 0C178.028 0 164.597 13.4315 164.597 30V40.2942C164.597 62.3856 146.688 80.2942 124.597 80.2942H30C13.4315 80.2942 0 93.7257 0 110.294V629C0 645.569 13.4315 659 30 659H194.597H466.729H1034C1050.57 659 1064 645.569 1064 629V30C1064 13.4315 1050.57 0 1034 0H194.597Z"
              fill="#C4C4C4"
            />
          </clipPath>
        </defs>
      </svg>
      <div
        className="clipped-content"
        style={{ clipPath: "url(#interviewer-clip)" }}
      >
        <video
          ref={videoRef}
          className="w-[100%] aspect-[1064/659]"
          autoPlay
          onLoadedMetadata={hideDefaultControls}
        >
          <source src={videoSources[videoIndex]} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      <div className="flex justify-center items-center top-[10px] right-[10px] absolute w-[37px] aspect-square bg-[#6E87ED] rounded-[50%]">
        <BsSoundwave className="text-white" />
      </div>
      <div className="flex flex-row items-center justify-center gap-x-[8px] text-[0.9rem] text-white font-medium glass-container-white top-0 absolute left-[140px] top-[10px] px-[15px] py-[3px]">
        Live
        <div className="glowing-dot-red"></div>
      </div>
    </div>
  );
}
