import * as z from "zod";

// 비밀번호 강도 검증 함수
export const isStrongPassword = (password: string): boolean => {
  // 최소 8자, 대문자, 소문자, 숫자, 특수문자 포함
  const hasMinLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  return (
    hasMinLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar
  );
};

// 공통 검증 규칙
export const commonValidation = {
  email: z
    .string()
    .min(1, { message: "이메일을 입력해주세요." })
    .email({ message: "올바른 이메일 주소를 입력해주세요." })
    .max(100, { message: "이메일은 100자를 초과할 수 없습니다." }),

  id: z
    .string()
    .min(1, { message: "아이디를 입력해주세요." })
    .min(4, { message: "아이디는 최소 4자 이상이어야 합니다." })
    .max(20, { message: "아이디는 최대 20자까지 가능합니다." })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: "아이디는 영문, 숫자, 언더스코어(_)만 사용 가능합니다.",
    }),

  password: z
    .string()
    .min(1, { message: "비밀번호를 입력해주세요." })
    .min(8, { message: "비밀번호는 최소 8자 이상이어야 합니다." })
    .max(128, { message: "비밀번호는 128자를 초과할 수 없습니다." })
    .refine(isStrongPassword, {
      message:
        "비밀번호는 대문자, 소문자, 숫자, 특수문자를 모두 포함해야 합니다.",
    }),

  interest: z
    .string()
    .min(1, { message: "관심사를 최소 하나 이상 선택해주세요." }),
};

// 로그인 스키마
export const loginSchema = z.object({
  id: z.string().min(1, { message: "아이디를 입력해주세요." }),
  password: z.string().min(1, { message: "비밀번호를 입력해주세요." }),
});

// 회원가입 스키마
export const registerSchema = z
  .object({
    email: commonValidation.email,
    id: commonValidation.id,
    password: commonValidation.password,
    passwordConfirm: z
      .string()
      .min(1, { message: "비밀번호 확인을 입력해주세요." }),
    interest: commonValidation.interest,
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["passwordConfirm"],
  });

// 비밀번호 변경 스키마
export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, { message: "현재 비밀번호를 입력해주세요." }),
    newPassword: commonValidation.password,
    newPasswordConfirm: z
      .string()
      .min(1, { message: "새 비밀번호 확인을 입력해주세요." }),
  })
  .refine((data) => data.newPassword === data.newPasswordConfirm, {
    message: "새 비밀번호가 일치하지 않습니다.",
    path: ["newPasswordConfirm"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "새 비밀번호는 현재 비밀번호와 달라야 합니다.",
    path: ["newPassword"],
  });

// 비밀번호 재설정 스키마
export const resetPasswordSchema = z.object({
  email: commonValidation.email,
});

// 비밀번호 강도 계산 함수
export const calculatePasswordStrength = (
  password: string,
): {
  score: number;
  feedback: string[];
} => {
  if (!password) return { score: 0, feedback: [] };

  let score = 0;
  const feedback: string[] = [];

  // 길이 검사
  if (password.length >= 8) {
    score += 1;
  } else {
    feedback.push("최소 8자 이상 입력하세요");
  }

  if (password.length >= 12) {
    score += 1;
  }

  // 문자 유형 검사
  if (/[a-z]/.test(password)) {
    score += 1;
  } else {
    feedback.push("소문자를 포함하세요");
  }

  if (/[A-Z]/.test(password)) {
    score += 1;
  } else {
    feedback.push("대문자를 포함하세요");
  }

  if (/\d/.test(password)) {
    score += 1;
  } else {
    feedback.push("숫자를 포함하세요");
  }

  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    score += 1;
  } else {
    feedback.push("특수문자를 포함하세요");
  }

  // 패턴 검사
  if (!/(.)\1{2,}/.test(password)) {
    score += 1;
  } else {
    feedback.push("동일한 문자를 3번 이상 연속으로 사용하지 마세요");
  }

  return { score, feedback };
};

// 타입 정의
export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
