import Image from "next/image";
import type { Message } from "@/types/globals";

export default function ChatMessage({
  type,
  message,
  aiStatus,
  isTyping,
}: Message) {
  if (type === "ai") {
    return (
      <>
        <div className="flex gap-3 pl-5 pr-20 pb-0">
          <Image
            className="w-8 h-8 rounded-full mt-1"
            width={100}
            height={100}
            src="/images/ai.png"
            alt={type}
          />
          {isTyping && message.length === 0 ? (
            <div className="flex items-center gap-2 pb-0">
              <div className="pl-2">
                <div className="animate-spin h-3 w-3 bg-indigo-300 rounded-sm"></div>
              </div>
              <div className="px-1">
                {aiStatus && aiStatus.length > 0 && (
                  <p className="text-sm font-normal text-slate-500">
                    {aiStatus}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div
              className={
                isTyping
                  ? "flex flex-col p-3 border-gray-200 bg-gradient-to-r from-indigo-300 to-blue-300 text-white rounded-l-xl rounded-r-xl "
                  : "flex flex-col p-3 border-gray-200 bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-l-xl rounded-r-xl "
              }
            >
              <p className="text-sm font-extralight whitespace-pre-wrap">
                {message}
                {isTyping && <span className="animate-pulse">_</span>}
              </p>
            </div>
          )}
        </div>
      </>
    );
  } else if (type === "user") {
    return (
      <>
        <div className="flex flex-row-reverse gap-3 pl-20 pr-5">
          <div className="flex flex-col p-3 border-gray-200 bg-gray-100 rounded-l-xl rounded-r-xl ">
            <p className="text-sm font-extralight whitespace-pre-wrap">
              {message}
            </p>
          </div>
        </div>
      </>
    );
  }
  return <></>;
}
