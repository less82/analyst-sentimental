# Backend API

## 기술 스택
- Node.js
- Express.js

---

# Endpoint

POST /api/analyze

---

# Request

```json
{
  "text": "오늘 정말 행복해"
}
```

---

# Response

```json
{
  "success": true,
  "data": {
    "sentiment": "positive",
    "confidence": 92,
    "reason": "긍정 표현이 포함되어 있음"
  }
}
```

---

# 서버 구조
- routes/
- controllers/
- services/
- middleware/

---

# 완료 기준
API 요청/응답 정상 처리
