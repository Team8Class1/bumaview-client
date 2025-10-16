import ky from "ky";

const GEMINI_API_BASE_URL = process.env.NEXT_PUBLIC_GEMINI_API_URL;

export const geminiApi = ky.create({
  prefixUrl: "/gemini-api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30초 타임아웃
});
