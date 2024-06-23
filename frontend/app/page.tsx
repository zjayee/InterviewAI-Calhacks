"use client";
import Form from "./components/Form";
import JoinButton from "./components/JoinButton";
import Logo from "./components/Logo";
import { useState } from "react";
import VideoRecorder from "./components/VideoRecorder";

export default function Home() {
  const [formData, setFormData] = useState({
    company: "",
    job_description: "",
    type: "",
    num_q: 1,
    resume: "",
  });

  const handleFormChange = (field: any, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <main className="main-container">
      <Logo />
      <div className="flex flex-row w-[100%] items-center">
        <section className="mt-[2vh] w-[50%] items-center justify-center">
          <Camera />
        </section>
        <section className="w-[50%] h-[100%] flex flex-col items-center justify-between">
          <Form handleFormChange={handleFormChange} />
          <JoinButton formData={formData} />
        </section>
      </div>
    </main>
  );
}

function Camera() {
  return (
    <div className="overflow-hidden rounded-[30px] bg-[#CDD8E7] h-[48vh] aspect-[765/501]">
      <VideoRecorder />
    </div>
  );
}
