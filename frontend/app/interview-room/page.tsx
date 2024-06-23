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

export default function InterviewRoom() {
  const searchParams = useSearchParams();
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
        <div className=""></div>
        <div className="w-[100%] gap-y-[10px] flex flex-col items-center justify-center">
          <ButtonContainer />
          <TimerDisplay />
        </div>
      </div>
    </main>
  );
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

function ButtonContainer() {
  return (
    <div className="flex flex-row gap-x-[27px] items-center justify-center">
      <MicButton />
      <EndButton />
      <VidButton />
    </div>
  );
}

function TimerDisplay() {
  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [hours, setHours] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      // Update seconds
      setSeconds((prevSeconds) => {
        if (prevSeconds === 59) {
          setMinutes((prevMinutes) => {
            if (prevMinutes === 59) {
              setHours((prevHours) => prevHours + 1);
              return 0;
            } else {
              return prevMinutes + 1;
            }
          });
          return 0;
        } else {
          return prevSeconds + 1;
        }
      });
    }, 1000);

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []); // Empty dependency array ensures useEffect runs only once on mount

  return (
    <div className="text-[0.9rem]">
      {hours < 10 ? `0${hours}` : hours}:
      {minutes < 10 ? `0${minutes}` : minutes}:
      {seconds < 10 ? `0${seconds}` : seconds}
    </div>
  );
}

function EndButton() {
  const router = useRouter();
  return (
    <button
      className="flex justify-center items-center bg-[#F1414F] w-[70px] h-[70px] rounded-[50%]"
      type="button"
      onClick={() => router.push("/results")}
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
