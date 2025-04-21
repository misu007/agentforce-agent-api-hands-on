"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { newSession } from "@/utils/agentforce";
import ChatPublisher from "@/components/ChatPublisher";
import Image from "next/image";

export default function WelcomeCard() {
  const [welcomeMessage, setWelcomeMessage] = useState<string>("");
  const [sessionId, setSessionId] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    doInit();
  }, []);

  const doInit = async () => {
    const { sessionId, messages } = await newSession();
    setSessionId(sessionId);
    const message = messages[0].message;
    setWelcomeMessage(message);
  };

  const postedMessage = (message: string) => {
    router.push(`/chat/${sessionId}?message=${message}`);
  };
  return (
    <div className="flex items-center justify-items-center h-full w-full sm:w-4/5 md:w-3/5 lg:w-3/5 xl:w-1/2">
      <div className="flex flex-col items-center justify-center gap-2 w-full">
        <div className="py-10">
          <Image
            className="mt-1"
            width={150}
            height={200}
            src="/images/hero.png"
            alt="agentastro"
          />
        </div>
        <div className="mb-10 text-xl font-light text-gray-500 ">
          {welcomeMessage ? (
            <span>{welcomeMessage}</span>
          ) : (
            <div className="py-1">
              <div className="animate-pulse w-[400px] h-4 bg-gray-200 rounded-full mt-1"></div>
            </div>
          )}
        </div>
        <div className="flex px-3 pb-14 w-full">
          <ChatPublisher onPostMessage={postedMessage} />
        </div>
      </div>
    </div>
  );
}
