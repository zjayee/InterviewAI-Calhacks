"use client";
import Link from "next/link";
import Logo from "./components/Logo";
import { useState } from "react";
import JoinButton from "./components/JoinButton";
import Form from "./components/Form";

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
        <section className="mt-[6vh] w-[50%] items-center justify-center">
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
    <div className="rounded-[30px] bg-red-300 h-[48vh] aspect-[765/501]"></div>
  );
}
