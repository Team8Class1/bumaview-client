import { useAuthStore } from "@/stores/auth";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";

class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    credentials: "include",
  });

  if (!response.ok) {
    if (response.status === 401) {
      useAuthStore.getState().logout();
    }

    const error = await response
      .json()
      .catch(() => ({ message: "Unknown error" }));
    throw new ApiError(response.status, error.message || "Request failed");
  }

  return response.json();
}

export const apiGet = <T>(endpoint: string) =>
  fetchApi<T>(endpoint, { method: "GET" });

export const apiPost = <T>(endpoint: string, data?: unknown) =>
  fetchApi<T>(endpoint, {
    method: "POST",
    body: data ? JSON.stringify(data) : undefined,
  });

export const apiPut = <T>(endpoint: string, data?: unknown) =>
  fetchApi<T>(endpoint, {
    method: "PUT",
    body: data ? JSON.stringify(data) : undefined,
  });

export const apiDelete = <T>(endpoint: string) =>
  fetchApi<T>(endpoint, { method: "DELETE" });

export const apiPatch = <T>(endpoint: string, data?: unknown) =>
  fetchApi<T>(endpoint, {
    method: "PATCH",
    body: data ? JSON.stringify(data) : undefined,
  });

// Auth API
export interface LoginRequest {
  id: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  id: string;
  password: string;
  interest: string[];
}

export interface AuthResponse {
  id: string;
  email?: string;
  role?: string;
  token?: string;
}

// Mock 데이터 (개발용)
const mockDelay = () => new Promise((resolve) => setTimeout(resolve, 500));

export const login = async (data: LoginRequest): Promise<AuthResponse> => {
  if (USE_MOCK) {
    await mockDelay();
    // Mock 로그인 - 항상 성공
    return {
      id: data.id,
      email: `${data.id}@example.com`,
      role: data.id === "admin" ? "admin" : "basic",
      token: "mock-token-12345",
    };
  }
  return apiGet<AuthResponse>(
    `/user/login?${new URLSearchParams(data as Record<string, string>).toString()}`,
  );
};

export const register = async (
  data: RegisterRequest,
): Promise<AuthResponse> => {
  if (USE_MOCK) {
    await mockDelay();
    // Mock 회원가입 - 항상 성공
    return {
      id: data.id,
      email: data.email,
      role: "basic",
      token: "mock-token-12345",
    };
  }
  return apiPost<AuthResponse>("/user/register", data);
};
