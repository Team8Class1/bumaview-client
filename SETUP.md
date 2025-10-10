# 개발 환경 설정

## 백엔드 연결 설정

### Mock 모드 (백엔드 없이 개발)

1. `.env.example`을 복사해서 `.env.local` 생성:
```bash
cp .env.example .env.local
```

2. `.env.local`에서 Mock 모드 활성화 (기본값):
```env
NEXT_PUBLIC_USE_MOCK=true
```

Mock 모드에서는:
- 로그인/회원가입이 항상 성공
- 실제 API 호출 없이 UI 개발 및 테스트 가능
- 0.5초 딜레이로 실제 API 호출처럼 동작

### 실제 백엔드 연결

백엔드가 준비되면 `.env.local` 수정:

```env
NEXT_PUBLIC_API_URL=http://your-backend-url/api
NEXT_PUBLIC_USE_MOCK=false
```

## 개발 서버 실행

```bash
bun dev
```

## Mock 동작 방식

- **로그인**: 어떤 ID/비밀번호든 성공 (ID가 "admin"이면 admin 권한)
- **회원가입**: 입력한 정보로 계정 생성 (항상 성공)
- **API 오류 테스트**: Mock 모드를 끄면 실제 API 호출 시도

## 페이지

- `/login` - 로그인
- `/register` - 회원가입

