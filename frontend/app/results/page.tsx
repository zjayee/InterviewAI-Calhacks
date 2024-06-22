"use client";
import { useRouter } from "next/navigation";

export default function ResultPage() {
  const router = useRouter();
  return (
    <main>
      <div>gj</div>
      <button type="button" onClick={() => router.push("/")}>
        Back to config
      </button>
    </main>
  );
}
