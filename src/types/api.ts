// Core API types based on OpenAPI specification

// Authentication types
export interface JoinDto {
  email: string;
  id: string;
  password: string;
  interest: string[];
}

export interface LoginRequestDto {
  id: string;
  password: string;
}

export interface UserInfoDto {
  userSequenceId: number;
  userId: string;
  email: string;
  role: "ADMIN" | "BASIC";
  birthday: string;
  favoriteList: string[];
}

// Interview types
export interface UploadInterviewDto {
  question: string;
  categoryList: number[];
  companyId: number;
  questionAt: string;
}

export interface ModifyInterviewDto {
  question: string;
  companyId: number;
  questionAt: string;
  categoryList: number[];
}

export interface InterviewDto {
  interviewId: number;
  question: string;
  companyId: number;
  companyName: string;
  questionAt: string;
  categoryList: CategoryList[];
  answer: DetailedAnswerDto[];
}

export interface AllInterviewDto {
  interviewId: number;
  question: string;
  categoryList: CategoryList[];
  companyId: number;
  companyName: string;
  questionAt: string;
}

// Company types
export interface CompanyDto {
  companyName: string;
  link: string;
}

// Answer types (기본 DTO - API 스펙 기준)
export interface AnswerDto {
  interviewId: number;
  answer: string;
  isPrivate: boolean;
}

export interface CreateAnswerDto {
  interviewId: number;
  answer: string;
  isPrivate: boolean;
}

export interface ReplyDto {
  interviewId: number;
  answer: string;
  isPrivate: boolean;
  parentAnswerId: number;
}

// Group types
export interface GroupDto {
  groupId: number;
  name: string;
  createdAt?: string;
}

export interface CreateGroupDto {
  name: string;
}

export interface AddGroupList {
  interviewIdList: number[];
}

// Category types
export interface CategoryList {
  categoryId: number;
  categoryName: string;
}

// Response wrapper types
export interface Data<T = unknown> {
  data: T;
}

export interface DataListAllInterviewDto {
  data: AllInterviewDto[];
}

// Search parameters
export interface InterviewSearchParams {
  questionAt?: number[];
  companyId?: number[];
  categoryId?: number[];
}

// File upload
export interface FileUploadRequest {
  file: File;
}

export interface ApiError {
  message: string;
  status: number;
}

// Extended types for frontend use
export interface InterviewWithBookmark extends AllInterviewDto {
  isBookmarked?: boolean;
}

// 상세 답변 타입 (실제 서버 응답에 포함되는 필드들)
export interface DetailedAnswerDto {
  answerId: number;
  userSequenceId: number;
  userId: string;
  interviewId: number;
  answer: string;
  isPrivate: boolean;
  like: number;
  parentAnswerId?: number;
  replies?: DetailedAnswerDto[];
}

export interface AnswerWithReplies extends DetailedAnswerDto {
  likeCount?: number;
  isLiked?: boolean;
}

export interface CompanyWithId extends CompanyDto {
  companyId: number;
}

export interface GroupWithInterviews extends GroupDto {
  interviews?: AllInterviewDto[];
  interviewCount?: number;
}
