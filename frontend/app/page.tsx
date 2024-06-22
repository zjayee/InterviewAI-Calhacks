import Link from "next/link";

export default function Home() {
  return (
    <main>
      <div>Config page, choose options and then start interview</div>
      <Link href="/interview-room">Join Now</Link>
    </main>
  );
}
