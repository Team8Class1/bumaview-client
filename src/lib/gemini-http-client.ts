import ky from "ky";

export const geminiApi = ky.create({
  prefixUrl: "/gemini-api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30초 타임아웃
});
