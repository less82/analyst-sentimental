# Project Overview

## 프로젝트명
AI Sentiment Analyzer

## 프로젝트 목표
사용자가 입력한 텍스트를 OpenAI API로 감성 분석하여
긍정 / 부정 / 중립 결과를 제공하는 웹 서비스 구축.

---

# 핵심 기능
- 텍스트 입력
- 감성 분석 요청
- OpenAI API 연동
- 결과 모달 출력
- Supabase 저장

---

# 기술 스택

## Frontend
- HTML5
- CSS3
- Vanilla JavaScript

## Backend
- Node.js
- Express.js

## AI
- OpenAI API

## Database
- Supabase

## Deployment
- Vercel

---


# Design System (GetDesign Claude Theme)

## 설치 명령어

```bash
npx getdesign@latest add claude
```

---

## 디자인 방향
- Claude 스타일 미니멀 UI
- Soft Dark Theme
- Large spacing
- Rounded card layout
- Neutral typography
- AI SaaS 스타일 인터페이스

---

## 컬러 시스템

| 용도 | 색상 |
|---|---|
| Background | #0B0F19 |
| Surface | #111827 |
| Card | #1F2937 |
| Primary | #8B5CF6 |
| Secondary | #6366F1 |
| Text Primary | #F9FAFB |
| Text Secondary | #9CA3AF |
| Border | #374151 |
| Positive | #22C55E |
| Negative | #EF4444 |
| Neutral | #FACC15 |

---

## Typography
- Inter
- Pretendard

---

## UI 스타일 가이드
- radius: 16px~24px
- shadow: soft shadow
- transition: 0.2s ease
- button: filled modern style
- modal: centered glass style

---

## 컴포넌트 방향
- Floating Card Layout
- Large CTA Button
- Soft Gradient Accent
- Clean Input Area


---

# 시스템 흐름

Frontend
→ Backend API
→ OpenAI API
→ Result Parsing
→ Supabase 저장
→ Frontend 반환
