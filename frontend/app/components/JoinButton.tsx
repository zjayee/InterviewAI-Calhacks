import React from "react";
import { useRouter } from "next/navigation";

export default function JoinButton({ formData }: { formData: any }) {
  const router = useRouter();

  const handleJoinNow = async () => {
    const requestBody = JSON.stringify(formData);
    console.log("Sending request:", requestBody);

    const response = await fetch("http://127.0.0.1:8000/create_session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: requestBody,
      redirect: "follow",
    });

    if (response.ok) {
      const data = await response.json();
      console.log("Session created successfully:", data);
      router.push("/interview-room");
    } else {
      const errorMessage = await response.text();
      console.log(`Failed to create session: ${errorMessage}`);
    }
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
