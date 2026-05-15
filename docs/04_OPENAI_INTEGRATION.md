# OpenAI Integration

## 목적
OpenAI API 기반 감성 분석 구현

---

# Prompt

사용자 문장을 분석하여 아래 JSON 형식으로 응답해.

{
  "sentiment": "positive | negative | neutral",
  "confidence": 0~100,
  "reason": "2~3문장 설명"
}

---

# 구현 내용
- OpenAI SDK 설정
- JSON 응답 강제
- temperature 최적화
- 에러 처리
- retry handling

---

# 완료 기준
실제 감성 분석 결과 반환
