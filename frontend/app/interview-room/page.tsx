"use client";
import { useRouter } from "next/navigation";

export default function InterviewRoom() {
  const router = useRouter();

  return (
    <main>
      <div>
        <div>Hi</div>
        <button type="button" onClick={() => router.push("/results")}>
          End Call
        </button>
      </div>
    </main>
  );
}
