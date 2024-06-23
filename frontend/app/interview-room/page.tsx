"use client";
import { useRouter } from "next/navigation";
import InterviewerCamera from "./InterviewerCamera";
import EmotionStatus from "./EmotionStatus";
import UserCamera from "./UserCamera";
import Logo from "../components/Logo";
import { ImPhoneHangUp } from "react-icons/im";
import { IoMicOutline, IoVideocamOutline } from "react-icons/io5";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import AudioRecorder from "../components/AudioRecorder";
import TimerDisplay from "../components/TimerDisplay";
import Image from "next/image";

export default function InterviewRoom() {
  const searchParams = useSearchParams();
  const [responseAudio, setResponseAudio] = useState("");
  const [responseText, setResponseText] = useState("");
  const [liveChat, setLiveChat] = useState([{ role: "user", content: "" }]);

  useEffect(() => {
    if (responseAudio) {
      const audioElement = new Audio(responseAudio);
      audioElement.play().catch((error) => {
        console.error("Failed to play audio:", error.message);
      });

      audioElement.addEventListener("ended", () => {
        setLiveChat((prevLiveChat) => [
          ...prevLiveChat,
          { role: "user", content: "" },
        ]);
      });
    }
  }, [responseAudio]);

  useEffect(() => {
    if (responseText !== "") {
      const newMessage = { role: "assistant", content: responseText };
      setLiveChat((prevLiveChat) => [...prevLiveChat, newMessage]);
    }
  }, [responseText]);

  return (
    <main className="main-container flex flex-row gap-x-[2vw]">
      <div className="relative w-[829.92px] gap-y-[2vh] flex flex-col">
        <div className="absolute">
          <Logo />
        </div>
        <InterviewerCamera />
        <div className="gap-x-[2vh] flex flex-row justify-between">
          <UserCamera />
          <EmotionStatus />
        </div>
      </div>
      <div className="flex-1 flex flex-col items-start justify-between">
        <Header
          company={searchParams.get("company")}
          numQ={searchParams.get("questions")}
        />
        <div className="mt-[2vh] w-[100%] mb-[2vh] overflow-hidden flex-1 max-h-[70vh]">
          <LiveChat />
        </div>
        <div className="w-[100%] gap-y-[10px] flex flex-col items-center justify-center">
          <ButtonContainer sessionID={searchParams.get("id")} />
          <TimerDisplay />
        </div>
      </div>
    </main>
  );

  function LiveChat() {
    return (
      <div className="pb-[3vh] flex-1 items-start justify-end h-[100%] w-[100%] flex flex-col gap-y-[35px]">
        {liveChat.map((item, index) =>
          item.role == "user" ? (
            <UserResponse key={index} />
          ) : (
            <AssistantResponse key={index} responseText={item.content} />
          )
        )}
      </div>
    );
  }

  function UserResponse() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");

    const [isDone, setIsDone] = useState(false);

    return (
      <div className="flex flex-row w-[100%] gap-x-[15px]">
        <Image
          className="w-[35px] h-[35px]"
          src="/user.png"
          width={35}
          height={35}
          alt="assistant"
        />
        <div className="w-[100%] flex flex-col gap-y-[10px]">
          <div className="flex flex-row text-[0.75rem] font-light justify-between">
            <p className="">Your answer...</p>
            <p className="mr-[0.5vw]">
              {hours}:{minutes}
            </p>
          </div>
          <div className="flex items-cente w-[210px] justify-center p-[20px] bg-[#EEF3FA] rounded-[15px]">
            <AudioRecorder
              isDone={isDone}
              setIsDone={setIsDone}
              setResponseText={setResponseText}
              setResponseAudio={setResponseAudio}
              sessionID={searchParams.get("id")}
            />
          </div>
        </div>
      </div>
    );
  }

  function AssistantResponse({
    responseText,
  }: {
    responseText: string | undefined;
  }) {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");

    return (
      <div className="flex flex-row w-[100%] gap-x-[15px]">
        <Image
          className="w-[35px] h-[35px]"
          src="/assistant.png"
          width={35}
          height={35}
          alt="assistant"
        />
        <div className="w-[100%] flex flex-col gap-y-[10px]">
          <div className="flex flex-row text-[0.75rem] font-light justify-between">
            <p className="">Andrew asked...</p>
            <p className="mr-[0.5vw]">
              {hours}:{minutes}
            </p>
          </div>
          <div className="w-[100%] p-[20px] shadow rounded-[15px]">
            {responseText}
          </div>
        </div>
      </div>
    );
  }
}

function Header({ company, numQ }: { company: any; numQ: any }) {
  const capitalizedCompany = company.charAt(0).toUpperCase() + company.slice(1);
  return (
    <div className="flex flex-row items-center gap-x-[12px]">
      <h1 className="font-semibold text-[1.5rem]">
        {capitalizedCompany} Interview
      </h1>
      <span className="w-[8px] h-[8px] bg-[#6E87ED] rounded-[50%]"></span>
      <span className="text-[0.9rem]">{numQ} question&#40;s&#41;</span>
    </div>
  );
}

function ButtonContainer({ sessionID }: { sessionID: string | null }) {
  return (
    <div className="flex flex-row gap-x-[27px] items-center justify-center">
      <MicButton />
      <EndButton sessionID={sessionID} />
      <VidButton />
    </div>
  );
}

function EndButton({ sessionID }: { sessionID: string | null }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const onEndButtonClick = () => {
    if (sessionID) {
      const params = new URLSearchParams(searchParams);
      params.set("id", sessionID);

      router.push("/results" + "?" + params.toString());
    } else {
      alert("session ID not found");
    }
  };

  return (
    <button
      className="flex justify-center items-center bg-[#F1414F] w-[70px] h-[70px] rounded-[50%]"
      type="button"
      onClick={onEndButtonClick}
    >
      <ImPhoneHangUp size={28} className="text-white" />
    </button>
  );
}

function MicButton() {
  return (
    <button
      className="flex justify-center items-center bg-[#EEF3FA] w-[60px] h-[60px] rounded-[50%]"
      type="button"
    >
      <IoMicOutline size={24} className="opacity-[0.7]" />
    </button>
  );
}

function VidButton() {
  return (
    <button
      className="flex justify-center items-center bg-[#EEF3FA] w-[60px] h-[60px] rounded-[50%]"
      type="button"
    >
      <IoVideocamOutline size={24} className="opacity-[0.7]" />
    </button>
  );
}
