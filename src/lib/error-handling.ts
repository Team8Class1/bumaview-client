import { ApiError } from "./http-client";

// 에러 타입 정의
export enum AuthErrorType {
  INVALID_CREDENTIALS = "INVALID_CREDENTIALS",
  USER_NOT_FOUND = "USER_NOT_FOUND",
  EMAIL_ALREADY_EXISTS = "EMAIL_ALREADY_EXISTS",
  ID_ALREADY_EXISTS = "ID_ALREADY_EXISTS",
  WEAK_PASSWORD = "WEAK_PASSWORD",
  TOKEN_EXPIRED = "TOKEN_EXPIRED",
  UNAUTHORIZED = "UNAUTHORIZED",
  RATE_LIMITED = "RATE_LIMITED",
  SERVER_ERROR = "SERVER_ERROR",
  NETWORK_ERROR = "NETWORK_ERROR",
  VALIDATION_ERROR = "VALIDATION_ERROR",
}

// 에러 메시지 매핑
export const errorMessages: Record<AuthErrorType, string> = {
  [AuthErrorType.INVALID_CREDENTIALS]:
    "아이디 또는 비밀번호가 올바르지 않습니다.",
  [AuthErrorType.USER_NOT_FOUND]: "존재하지 않는 사용자입니다.",
  [AuthErrorType.EMAIL_ALREADY_EXISTS]: "이미 사용 중인 이메일입니다.",
  [AuthErrorType.ID_ALREADY_EXISTS]: "이미 사용 중인 아이디입니다.",
  [AuthErrorType.WEAK_PASSWORD]:
    "비밀번호가 보안 요구사항을 충족하지 않습니다.",
  [AuthErrorType.TOKEN_EXPIRED]:
    "로그인이 만료되었습니다. 다시 로그인해주세요.",
  [AuthErrorType.UNAUTHORIZED]: "접근 권한이 없습니다.",
  [AuthErrorType.RATE_LIMITED]:
    "너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해주세요.",
  [AuthErrorType.SERVER_ERROR]:
    "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
  [AuthErrorType.NETWORK_ERROR]: "네트워크 연결을 확인해주세요.",
  [AuthErrorType.VALIDATION_ERROR]: "입력값을 확인해주세요.",
};

// 에러 코드 매핑
export const statusToErrorType: Record<number, AuthErrorType> = {
  400: AuthErrorType.VALIDATION_ERROR,
  401: AuthErrorType.UNAUTHORIZED,
  403: AuthErrorType.UNAUTHORIZED,
  404: AuthErrorType.USER_NOT_FOUND,
  409: AuthErrorType.EMAIL_ALREADY_EXISTS, // 기본값, 메시지에 따라 변경
  429: AuthErrorType.RATE_LIMITED,
  500: AuthErrorType.SERVER_ERROR,
  502: AuthErrorType.SERVER_ERROR,
  503: AuthErrorType.SERVER_ERROR,
  504: AuthErrorType.SERVER_ERROR,
};

// 에러 분류 함수
export function classifyError(error: unknown): {
  type: AuthErrorType;
  message: string;
  originalError?: Error;
} {
  // ApiError 처리
  if (error instanceof ApiError) {
    let type = statusToErrorType[error.status] || AuthErrorType.SERVER_ERROR;
    const message = error.message;

    // 메시지 기반 에러 타입 세분화
    if (error.status === 400) {
      if (message.includes("아이디")) {
        type = AuthErrorType.INVALID_CREDENTIALS;
      } else if (message.includes("비밀번호")) {
        if (message.includes("강도") || message.includes("보안")) {
          type = AuthErrorType.WEAK_PASSWORD;
        } else {
          type = AuthErrorType.INVALID_CREDENTIALS;
        }
      }
    } else if (error.status === 409) {
      if (message.includes("아이디")) {
        type = AuthErrorType.ID_ALREADY_EXISTS;
      } else if (message.includes("이메일")) {
        type = AuthErrorType.EMAIL_ALREADY_EXISTS;
      }
    } else if (error.status === 401) {
      if (message.includes("만료")) {
        type = AuthErrorType.TOKEN_EXPIRED;
      } else {
        type = AuthErrorType.INVALID_CREDENTIALS;
      }
    }

    return {
      type,
      message: errorMessages[type] || message,
      originalError: error,
    };
  }

  // 네트워크 에러 처리
  if (error instanceof TypeError && error.message.includes("fetch")) {
    return {
      type: AuthErrorType.NETWORK_ERROR,
      message: errorMessages[AuthErrorType.NETWORK_ERROR],
      originalError: error as Error,
    };
  }

  // 일반 에러 처리
  if (error instanceof Error) {
    return {
      type: AuthErrorType.SERVER_ERROR,
      message: error.message || errorMessages[AuthErrorType.SERVER_ERROR],
      originalError: error,
    };
  }

  // 알 수 없는 에러
  return {
    type: AuthErrorType.SERVER_ERROR,
    message: errorMessages[AuthErrorType.SERVER_ERROR],
  };
}

// 재시도 가능한 에러인지 확인
export function isRetryableError(errorType: AuthErrorType): boolean {
  return [
    AuthErrorType.NETWORK_ERROR,
    AuthErrorType.SERVER_ERROR,
    AuthErrorType.RATE_LIMITED,
  ].includes(errorType);
}

// 사용자 액션이 필요한 에러인지 확인
export function requiresUserAction(errorType: AuthErrorType): boolean {
  return [
    AuthErrorType.INVALID_CREDENTIALS,
    AuthErrorType.EMAIL_ALREADY_EXISTS,
    AuthErrorType.ID_ALREADY_EXISTS,
    AuthErrorType.WEAK_PASSWORD,
    AuthErrorType.VALIDATION_ERROR,
    AuthErrorType.TOKEN_EXPIRED,
  ].includes(errorType);
}

// 폼 필드별 에러 매핑
export function getFieldError(errorType: AuthErrorType): {
  field?: string;
  message?: string;
} {
  switch (errorType) {
    case AuthErrorType.ID_ALREADY_EXISTS:
      return { field: "id", message: errorMessages[errorType] };
    case AuthErrorType.EMAIL_ALREADY_EXISTS:
      return { field: "email", message: errorMessages[errorType] };
    case AuthErrorType.WEAK_PASSWORD:
      return { field: "password", message: errorMessages[errorType] };
    case AuthErrorType.INVALID_CREDENTIALS:
      return { field: "password", message: errorMessages[errorType] };
    default:
      return {};
  }
}
