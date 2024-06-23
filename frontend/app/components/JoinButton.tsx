import React, { useState } from "react";
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
  const [introText, setIntroText] = useState("");
  const [introAudio, setIntroAudio] = useState("");
  const [loading, setLoading] = useState(false);

  const handleJoinNow = async () => {
    const hasEmptyField = Object.values(formData).some((value) => value === "");
    if (hasEmptyField) {
      window.alert("Please fill in all fields before submitting.");
      return;
    }

    setLoading(true);
    const requestBody = JSON.stringify(formData);

    try {
      const response = await fetch("http://127.0.0.1:8000/create_session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: requestBody,
        redirect: "follow",
      });

      const sessionID = await response.text();
      console.log("Session created successfully: " + sessionID);

      // Fetch the start interview outputs
      const startInterviewResponse = await fetch(
        "http://127.0.0.1:8000/start_interview",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ session_id: sessionID }),
        }
      );

      if (startInterviewResponse.ok) {
        const startInterviewData = await startInterviewResponse.json();
        setIntroText(startInterviewData.text_output);
        setIntroAudio(startInterviewData.audio_output);
        console.log("Success");
        console.log(startInterviewData.text_output);
        console.log(startInterviewData.audio);

        // Store introText and introAudio in sessionStorage
        sessionStorage.setItem("introText", startInterviewData.text_output);
        sessionStorage.setItem("introAudio", startInterviewData.audio_output);

        // Navigate after setting the intro text and audio
        const params = new URLSearchParams(searchParams);
        params.set("company", formData.company);
        params.set("questions", formData.num_q.toString());
        params.set("id", sessionID);

        router.push("/interview-room" + "?" + params.toString());
      } else {
        console.error(
          "Failed to fetch start interview outputs:",
          startInterviewResponse.status
        );
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className="flex justify-center items-center font-medium w-[120px] h-[50px] bg-[#6E87ED] text-white rounded-[50px]"
      onClick={handleJoinNow}
      disabled={loading}
    >
      {loading ? <div className="loader" /> : "Join Now"}
    </button>
  );
}
