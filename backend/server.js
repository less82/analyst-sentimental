// 필요한 모듈들을 불러옵니다.
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { OpenAI } = require('openai');
const { createClient } = require('@supabase/supabase-js');

// .env 파일의 환경 변수를 불러옵니다.
dotenv.config();

const app = express();

// 미들웨어 설정
app.use(cors());
app.use(express.json());

// 1. OpenAI API 클라이언트 초기화
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// 2. Supabase 클라이언트 초기화
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * [POST] /api/analyze
 * 사용자가 보낸 텍스트를 분석하고 DB에 저장한 뒤 결과를 반환합니다.
 * (사용자 요청에 따라 암호화 없이 평문 저장하도록 수정됨)
 */
app.post('/api/analyze', async (req, res) => {
    const { text } = req.body;

    // 입력값 검증
    if (!text || text.trim().length < 5) {
        return res.status(400).json({
            success: false,
            message: '분석할 텍스트를 5자 이상 입력해 주세요.'
        });
    }

    try {
        // A. OpenAI API를 통한 감성 분석
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "당신은 감성 분석 전문가입니다. 입력된 텍스트를 분석하여 반드시 아래 JSON 형식으로만 답변하세요: {\"sentiment\": \"positive\" | \"negative\" | \"neutral\", \"confidence\": 0~100, \"reason\": \"2~3문장 설명\"}"
                },
                { role: "user", content: text }
            ],
            response_format: { type: "json_object" }
        });

        const analysisResult = JSON.parse(response.choices[0].message.content);

        // B. Supabase에 결과 저장 (암호화 없이 원문 그대로 저장)
        const { error } = await supabase
            .from('sentiment_logs')
            .insert([
                { 
                    input_text: text, // 암호화 없이 텍스트 저장
                    sentiment: analysisResult.sentiment,
                    confidence: analysisResult.confidence,
                    reason: analysisResult.reason
                }
            ]);

        if (error) {
            console.error('Supabase 저장 에러:', error);
        }

        // C. 최종 결과 반환
        res.json({
            success: true,
            data: analysisResult
        });

    } catch (error) {
        console.error('분석 처리 중 에러:', error);
        res.status(500).json({
            success: false,
            message: '서버 오류로 분석에 실패했습니다. OpenAI API 키를 확인해 주세요.'
        });
    }
});

// Vercel 서버리스 환경 대응
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`서버가 포트 ${PORT}에서 작동 중입니다.`);
    });
}

module.exports = app;
