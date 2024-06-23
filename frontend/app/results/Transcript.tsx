import Image from "next/image";

export default function Transcript({ liveChat }: { liveChat: any }) {
  return (
    <div className="h-[100%] items-center">
      <div className="no-scrollbar pr-[20px] pb-[20px] overflow-y-scroll h-[90vh] w-[30vw]">
        {liveChat.map((item: any, index: any) =>
          item.role == "user" ? (
            <UserResponse key={index} responseText={item.content} />
          ) : (
            <AssistantResponse key={index} responseText={item.content} />
          )
        )}
      </div>
    </div>
  );
}

function UserResponse({ responseText }: { responseText: string }) {
  return (
    <div className="flex flex-row w-[100%] gap-x-[15px] mt-[22px]">
      <Image
        className="w-[35px] h-[35px]"
        src="/user.png"
        width={35}
        height={35}
        alt="assistant"
      />
      <div className="w-[100%] flex flex-col gap-y-[10px]">
        <div className="flex flex-row text-[0.75rem] font-light justify-between">
          <p className="text-[0.75rem]">Your answer...</p>
        </div>
        <div className="text-[0.9rem] w-[100%] p-[20px] bg-[#EEF3FA] rounded-[15px]">
          {responseText}
        </div>
      </div>
    </div>
  );
}

function AssistantResponse({
  responseText,
}: {
  responseText: string | undefined;
}) {
  return (
    <div className="flex flex-row w-[100%] gap-x-[15px] mt-[22px]">
      <Image
        className="w-[35px] h-[35px]"
        src="/assistant.png"
        width={35}
        height={35}
        alt="assistant"
      />
      <div className="w-[100%] flex flex-col gap-y-[10px]">
        <div className="flex flex-row text-[0.75rem] font-light justify-between">
          <p className="">Andrew asked...</p>
        </div>
        <div className="text-[0.9rem] w-[100%] p-[20px] shadow rounded-[15px]">
          {responseText}
        </div>
      </div>
    </div>
  );
}
