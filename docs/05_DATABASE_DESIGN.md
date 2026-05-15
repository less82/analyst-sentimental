# Database Design

## Database
Supabase

---

# Table: sentiment_logs

| 컬럼명 | 타입 |
|---|---|
| id | uuid |
| input_text | text |
| sentiment | varchar |
| confidence | integer |
| reason | text |
| created_at | timestamp |

---

# SQL

```sql
create table sentiment_logs (
  id uuid primary key default gen_random_uuid(),
  input_text text not null,
  sentiment varchar(20) not null,
  confidence integer not null,
  reason text not null,
  created_at timestamp default now()
);
```

---

# 완료 기준
감성 분석 로그 저장 성공
