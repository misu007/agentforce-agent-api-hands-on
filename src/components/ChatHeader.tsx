"use client";
import { endSession } from "@/utils/agentforce";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";

export default function ChatHeader() {
  const router = useRouter();
  const params = useParams<{ sessionId: string }>();
  const sessionId = params.sessionId;

  const clickedEndSession = () => {
    endSession(sessionId);
    router.push("/");
  };

  return (
    <div className="flex w-full py-3 px-6 flex-row-reverse">
      <button className="text-slate-500 text-lg" onClick={clickedEndSession}>
        <span>✕</span>
      </button>
    </div>
  );
}
