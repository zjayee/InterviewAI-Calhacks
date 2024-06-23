import React from "react";
import { useRouter, useSearchParams } from "next/navigation";

type sessionType = {
  company: string;
  job_description: string;
  type: string;
  num_q: number;
  resume: string;
};

export default function JoinButton({ formData }: { formData: sessionType }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleJoinNow = async () => {
    const hasEmptyField = Object.values(formData).some((value) => value === "");
    let sessionID = "";

    if (hasEmptyField) {
      window.alert("Please fill in all fields before submitting.");
      return;
    }

    const requestBody = JSON.stringify(formData);
    console.log("Sending request:", requestBody);

    try {
      const response = await fetch("http://127.0.0.1:8000/create_session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: requestBody,
        redirect: "follow",
      });

      sessionID = await response.text();
      console.log("Session created successfully: " + sessionID);
    } catch (err) {
      console.log(err);
    }

    const params = new URLSearchParams(searchParams);
    params.set("company", formData.company);
    params.set("questions", formData.num_q.toString());
    params.set("id", sessionID);

    router.push("/interview-room" + "?" + params.toString());
  };

  return (
    <button
      className="flex justify-center items-center font-medium w-[120px] h-[50px] bg-[#6E87ED] text-white rounded-[50px]"
      onClick={handleJoinNow}
    >
      Join Now
    </button>
  );
}
