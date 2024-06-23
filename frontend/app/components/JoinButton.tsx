import React from "react";
import Link from "next/link";

export default function JoinButton({ formData }: { formData: any }) {
  const handleJoinNow = async () => {
    try {
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
      } else {
        const errorMessage = await response.text();
        throw new Error(`Failed to create session: ${errorMessage}`);
      }
    } catch (error) {
      console.error("Error creating session:", error);
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
