// 토큰 관리 유틸리티

const ACCESS_TOKEN_KEY = "access_token";
const TOKEN_EXPIRES_KEY = "token_expires";

// 토큰을 HttpOnly 쿠키에 저장하는 것이 이상적이지만,
// 클라이언트에서 접근이 필요한 경우를 위한 대안 구현
export function setTokens(
  accessToken: string,
  _refreshToken?: string,
  expiresIn?: number,
) {
  // 액세스 토큰은 sessionStorage에 저장 (새로고침시 초기화됨)
  if (typeof window !== "undefined") {
    sessionStorage.setItem(ACCESS_TOKEN_KEY, accessToken);

    // 리프레시 토큰은 httpOnly 쿠키로 서버에서 관리되므로 클라이언트에서 저장하지 않음
    // if (refreshToken) {
    //   localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    // }

    if (expiresIn) {
      const expirationTime = Date.now() + expiresIn * 1000;
      localStorage.setItem(TOKEN_EXPIRES_KEY, expirationTime.toString());
    }
  }
}

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  // 리프레시 토큰은 httpOnly 쿠키로 관리되므로 클라이언트에서 접근 불가
  return null;
}

export function getTokenExpiration(): number | null {
  if (typeof window === "undefined") return null;
  const expires = localStorage.getItem(TOKEN_EXPIRES_KEY);
  return expires ? parseInt(expires, 10) : null;
}

export function isTokenExpired(): boolean {
  const expiration = getTokenExpiration();
  if (!expiration) return false;
  return Date.now() > expiration;
}

export function isTokenExpiringSoon(minutesBeforeExpiry = 5): boolean {
  const expiration = getTokenExpiration();
  if (!expiration) return false;
  const warningTime = expiration - minutesBeforeExpiry * 60 * 1000;
  return Date.now() > warningTime;
}

export function clearTokens() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  // 리프레시 토큰은 httpOnly 쿠키이므로 서버에서 만료 처리
  localStorage.removeItem(TOKEN_EXPIRES_KEY);
}

export function hasValidToken(): boolean {
  const token = getAccessToken();
  return !!token && !isTokenExpired();
}

// JWT 토큰 파싱 유틸리티 (보안상 서버에서 검증 필요)
export function parseJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join(""),
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("JWT 파싱 실패:", error);
    return null;
  }
}

// 토큰에서 만료 시간 추출
export function getTokenExpiry(token: string): number | null {
  const payload = parseJwtPayload(token);
  if (payload && typeof payload.exp === "number") {
    return payload.exp * 1000;
  }
  return null;
}
