-- 001_create_sentiment_logs.sql
-- 감성 분석 로그를 저장하는 테이블을 생성합니다.

CREATE TABLE IF NOT EXISTS sentiment_logs (
    -- 고유 식별자 (자동 생성되는 UUID)
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- 사용자가 입력한 텍스트 (개인정보 보호를 위해 암호화되어 저장될 예정)
    input_text TEXT NOT NULL,
    
    -- 분석된 감정 결과 (positive, negative, neutral)
    sentiment VARCHAR(20) NOT NULL,
    
    -- 분석 신뢰도 (0~100 사이의 숫자)
    confidence INTEGER NOT NULL,
    
    -- 분석 이유에 대한 상세 설명
    reason TEXT NOT NULL,
    
    -- 로그 생성 일시 (현재 시간 기본값)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 추가: 감정별 통계를 위해 sentiment 컬럼에 인덱스를 생성합니다.
CREATE INDEX IF NOT EXISTS idx_sentiment ON sentiment_logs(sentiment);

-- 테이블에 대한 한글 설명 추가 (관리 용이성)
COMMENT ON TABLE sentiment_logs IS 'AI 감성 분석 결과 로그 저장 테이블';
COMMENT ON COLUMN sentiment_logs.input_text IS '사용자 입력 텍스트 (암호화됨)';
COMMENT ON COLUMN sentiment_logs.sentiment IS '감정 분석 결과';
