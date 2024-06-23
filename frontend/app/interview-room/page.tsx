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

type ChatMessage = {
  role: string;
  content: string;
};

export default function InterviewRoom() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [responseAudio, setResponseAudio] = useState("");
  const [responseText, setResponseText] = useState("");
  const [liveChat, setLiveChat] = useState<ChatMessage[]>([]);
  const [videoIndex, setVideoIndex] = useState(0);

  const messages = [
    `Hello! My name is Andrew, and I'll be conducting your resume screen interview today. I'm excited to learn more about your background and experiences to see how they align with the Software Developer Internship role at Google. Let's start with a brief introduction. Could you please introduce yourself and provide an overview of your educational background and relevant experiences?`,
    `Thank you for sharing your experience, Wimmer. It sounds like you have a solid background in both web and mobile application development, along with experience in collaborating with various teams. Could you tell me more about a specific challenge you faced during your time at OpenAI or Intel and how you addressed it? What was the impact of your solution on the project or the team?`,
    `That sounds like a substantial contribution. Your initiative to implement automated testing demonstrates problem-solving abilities and a focus on efficiency. Can you tell me more about how you prioritized which test cases to automate first? Additionally, how did you ensure the team was aligned with the new automated processes, and what steps did you take to measure the effectiveness of this change?`,
    `Thank you for sharing your experiences and skills. We'll review everything and get back to you soon.`,
  ];
  const videoTimes = [19000, 19000, 20000, 5000];

  const numQ = Number(searchParams.get("questions"));

  const sessionID = searchParams.get("id");

  useEffect(() => {
    if (liveChat.length === numQ * 2 + 1) {
      setTimeout(() => {
        if (sessionID) {
          const params = new URLSearchParams(searchParams);
          params.set("id", sessionID);

          router.push("/results" + "?" + params.toString());
        } else {
          alert("session ID not found");
        }
      }, 5000);
    }
  }, [liveChat]);

  useEffect(() => {
    const initialText = sessionStorage.getItem("introText");
    const initialAudio = sessionStorage.getItem("introAudio");

    if (initialAudio && initialText) {
      //  setLiveChat([{ role: "assistant", content: initialText }]);
      setResponseAudio(`data:audio/wav;base64,${initialAudio}`);
    } else {
      alert("Initial data not found");
      console.log(initialAudio);
      console.log(initialText);
    }
  }, []);

  function filterDuplicates(chatArray: ChatMessage[]) {
    const seen = new Set();
    return chatArray.filter((item) => {
      const duplicate = seen.has(`${item.role}-${item.content}`);
      seen.add(`${item.role}-${item.content}`);
      return !duplicate;
    });
  }

  useEffect(() => {
    const newMessage = { role: "assistant", content: messages[videoIndex] };
    if (liveChat.length <= 1) {
      setLiveChat((prevLiveChat) =>
        filterDuplicates([...prevLiveChat, newMessage])
      );
      setTimeout(() => {
        setLiveChat((prevLiveChat) => [
          ...prevLiveChat,
          { role: "user", content: "" },
        ]);
      }, videoTimes[videoIndex]);
    } else {
      setLiveChat((prevLiveChat) => [...prevLiveChat, newMessage]);
      setTimeout(() => {
        setLiveChat((prevLiveChat) => [
          ...prevLiveChat,
          { role: "user", content: "" },
        ]);
      }, videoTimes[videoIndex]);
    }
  }, [videoIndex]);

  return (
    <main className="main-container flex flex-row gap-x-[2vw]">
      <div className="relative w-[829.92px] gap-y-[2vh] flex flex-col">
        <div className="absolute">
          <Logo />
        </div>
        <InterviewerCamera videoIndex={videoIndex} />
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
            <UserResponse key={index} isDone={index + 1 !== liveChat.length} />
          ) : (
            <AssistantResponse key={index} responseText={item.content} />
          )
        )}
      </div>
    );
  }

  function UserResponse({ isDone }: { isDone: boolean }) {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");

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
              setResponseText={setResponseText}
              setResponseAudio={setResponseAudio}
              sessionID={searchParams.get("id")}
              numberQuestions={searchParams.get("questions")}
              videoIndex={videoIndex}
              setVideoIndex={setVideoIndex}
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
