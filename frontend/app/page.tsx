import Link from "next/link";
import Logo from "./components/Logo";

export default function Home() {
  return (
    <main className="main-container">
      <Logo />
      <div className="flex flex-row mt-[17vh] w-[100%] items-center">
        <section className="w-[50%] items-center justify-center">
          <div className="rounded-[30px] bg-red-300 h-[48vh] aspect-[765/501]"></div>
        </section>
        <section className="w-[50%] h-[100%] flex flex-col items-center justify-between">
          <div>Form here...</div>
          <JoinButton />
        </section>
      </div>
    </main>
  );
}

function JoinButton() {
  return (
    <button className="font-medium w-[120px] h-[50px] bg-[#6E87ED] text-white rounded-[50px]">
      <Link className="w-[100%] h-[100%]" href="/interview-room">
        Join Now
      </Link>
    </button>
  );
}
