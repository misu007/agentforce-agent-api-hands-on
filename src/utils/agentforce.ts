"use server";
import "server-only";

const SF_MY_DOMAIN_URL = process.env.SF_MY_DOMAIN_URL ?? "";
const SF_CONSUMER_KEY = process.env.SF_CONSUMER_KEY ?? "";
const SF_CONSUMER_SECRET = process.env.SF_CONSUMER_SECRET ?? "";
const SF_AGENT_ID = process.env.SF_AGENT_ID ?? "";

const getToken = async () => {
  const params = new URLSearchParams();
  params.append("grant_type", "client_credentials");
  params.append("client_id", SF_CONSUMER_KEY);
  params.append("client_secret", SF_CONSUMER_SECRET);
  const res = await fetch(
    `https://${SF_MY_DOMAIN_URL}/services/oauth2/token?${params.toString()}`,
    {
      method: "post",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      cache: "force-cache",
      next: { revalidate: 1200 },
    }
  );
  const data = await res.json();
  const accessToken = data["access_token"];
  const apiInstanceUrl = data["api_instance_url"];
  return { accessToken, apiInstanceUrl };
};

export const newSession = async () => {
  const { accessToken, apiInstanceUrl } = await getToken();
  const uuid = crypto.randomUUID();
  const payload = {
    externalSessionKey: uuid,
    instanceConfig: {
      endpoint: `https://${SF_MY_DOMAIN_URL}/`,
    },
    featureSupport: "Streaming",
    streamingCapabilities: {
      chunkTypes: ["Text"],
    },
    bypassUser: true,
  };
  const res = await fetch(
    `${apiInstanceUrl}/einstein/ai-agent/v1/agents/${SF_AGENT_ID}/sessions`,
    {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    }
  );
  const data = await res.json();

  return data;
};

export const endSession = async (sessionId: string) => {
  const { accessToken, apiInstanceUrl } = await getToken();
  try {
    const res = await fetch(
      `${apiInstanceUrl}/einstein/ai-agent/v1/sessions/${sessionId}`,
      {
        method: "delete",
        headers: {
          "x-session-end-reason": "UserRequest",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const data = await res.json();

    return data;
  } catch (error) {
    console.log(error);
  }
};

export const sendStreamingMessage = async (
  sessionId: string,
  text: string,
  sequenceId: number
) => {
  const { accessToken, apiInstanceUrl } = await getToken();
  console.log("sessionId", sessionId);
  console.log("text", text);
  console.log("sequenceId", sequenceId);

  // eslint-disable-next-line prefer-const
  let endpoint = "";
  /*
    ================================
    クイズ #1 - APIコールのエンドポイント
    
    選択肢 (A), (B), (C)の中からひとつ選択してください
    (選択したものだけ、コメントアウト//を外してください)

    公式ドキュメント: https://developer.salesforce.com/docs/einstein/genai/references/agent-api?meta=sendMessageStream
    ================================
  */

  /* 選択肢 (A) */
  // endpoint = `/einstein/ai-agent/v1/sessions/${sessionId}/chat/stream`;
  /* 選択肢 (B) */
  // endpoint = `/einstein/ai-agent/v1/sessions/${sessionId}/messages/stream`;
  /* 選択肢 (C) */
  // endpoint = `/einstein/ai-agent/v1/sessions/${sessionId}/messages/${sequenceId}/message`;

  const payload = {
    /* 
    ================================
    クイズ #2 - リクエストボディ
    
    選択肢 (A), (B), (C)の中からひとつ選択してください
    (選択したものだけ、コメントアウト//を外してください)

    公式ドキュメント: https://developer.salesforce.com/docs/einstein/genai/references/agent-api?meta=sendMessageStream
    ================================
    */
    /* 選択肢 (A) */
    // message: {type: "Text", message: text},
    /* 選択肢 (B) */
    // message: { sequenceId: sequenceId, type: "Text", text: text },
    /* 選択肢 (C) */
    // message: { sequenceId: sequenceId, type: "User", message: text },
  };

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,

    /* 
    ================================
    クイズ #3 - Acceptヘッダー
    
    選択肢 (A), (B), (C)の中からひとつ選択してください
    (選択したものだけ、コメントアウト//を外してください)

    公式ドキュメント: https://developer.salesforce.com/docs/einstein/genai/references/agent-api?meta=sendMessageStream
    ================================
    */
    /* 選択肢 (A) */
    // Accept: "text/event-stream",
    /* 選択肢 (B) */
    // Accept : "text/streaming-events"
    /* 選択肢 (C) */
    // Accept : "text/server-sent-events"
  };

  try {
    const res = await fetch(`${apiInstanceUrl}${endpoint}`, {
      method: "post",
      cache: "no-store",
      headers,
      body: JSON.stringify(payload),
    });
    console.log("res", res);
    if (!res.ok) throw new Error(`${res.statusText} (${res.status})`);
    const data = res.body;
    return data;
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Agentforce APIの呼び出しでエラーが発生しました";
    throw new Error(errorMessage);
  }
};
