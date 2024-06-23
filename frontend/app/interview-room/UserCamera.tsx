import { BsSoundwave } from "react-icons/bs";
import { FaUser } from "react-icons/fa";
import VideoRecorderMini from "../components/VideoRecorderMini";

export default function UserCamera() {
  return (
    <div className="relative h-[177px] overflow-hidden">
      <div className="w-[284.7px]">
        <svg className="absolute top-[-999px] left-[-999px] w-0 h-0">
          <defs>
            <clipPath className="scale-[0.78]" id="user-clip">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M30 0C13.4315 0 0 13.4315 0 30L0 194C0 210.569 13.4315 224 30 224H114H278H335C351.569 224 365 210.569 365 194V78C365 66.9543 356.046 58 345 58C324.565 58 308 41.4345 308 21V20C308 8.95431 299.046 0 288 0L30 0Z"
                fill="#C4C4C4"
              />
            </clipPath>
          </defs>
        </svg>
        <div
          className="clipped-content"
          style={{ clipPath: "url(#user-clip)" }}
        >
          <VideoRecorderMini />
        </div>
      </div>
      <div className="flex justify-center items-center top-0 right-0 absolute w-[37px] aspect-square bg-[#6E87ED] rounded-[50%]">
        <BsSoundwave className="text-white" />
      </div>
      <div className="flex flex-row justify-center gap-x-[7px] items-center text-[0.85rem] text-white bottom-[10px] left-[10px] glass-container-black absolute px-[12px] py-[6px]">
        <FaUser />
        Me
      </div>
    </div>
  );
}
