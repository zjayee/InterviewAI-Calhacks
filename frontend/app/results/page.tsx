"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Transcript from "./Transcript";
import ReactMarkdown from "react-markdown";

export default function ResultPage() {
  const router = useRouter();
  const [summary, setSummary] = useState("");
  const [transcript, setTranscript] = useState("");
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchSummaryAndTranscript = async () => {
      try {
        const sessionID = searchParams.get("id");
        const summaryResponse = await fetch(
          "http://127.0.0.1:8000/get_summary",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ session_id: sessionID }),
          }
        );

        if (summaryResponse.ok) {
          const summaryData = await summaryResponse.json();
          setSummary(summaryData.summary_analysis);
        } else {
          console.error("Failed to fetch summary:", summaryResponse.status);
        }

        const transcriptResponse = await fetch(
          "http://127.0.0.1:8000/get_transcript",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ session_id: sessionID }),
          }
        );

        if (transcriptResponse.ok) {
          const transcriptData = await transcriptResponse.json();
          setTranscript(transcriptData);
        } else {
          console.error(
            "Failed to fetch transcript:",
            transcriptResponse.status
          );
        }
      } catch (error: any) {
        console.error("Error fetching data:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSummaryAndTranscript();
  }, [searchParams]);

  if (loading) {
    return (
      <main className="main-container flex items-center justify-center h-[90vh] w-[100%]">
        <div className="loader"></div>
      </main>
    );
  }

  return (
    <main className="items-center main-container h-[100%] flex flex-row gap-x-[6vw]">
      <Transcript liveChat={transcript} />
      <div>
        <div className="pb-[3vh] flex flex-row items-center gap-x-[20px]">
          <img src="/assistant.png" className="w-[50px]" alt="assistant" />
          <h1 className="font-semibold text-[1.6rem]">Great Job!</h1>
        </div>
        <h1 className="ml-[0.5vw] pb-[1vh] font-medium text-[1.2rem]">
          Andrew's Feedback:
        </h1>
        <div className="mb-[30px] overflow-y-scroll max-h-[60vh] dashed-border rounded-[20px] p-[20px]">
          <ReactMarkdown className="text-[0.95rem] leading-[1.8]">
            {summary}
          </ReactMarkdown>
        </div>
        <div className="w-[100%] justify-center flex">
          <button
            className="flex justify-center items-center font-medium w-[120px] h-[50px] bg-[#6E87ED] text-white rounded-[50px]"
            type="button"
            onClick={() => router.push("/")}
          >
            Nice!
          </button>
        </div>
      </div>
    </main>
  );
}
