// 필요한 모듈들을 불러옵니다.
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const crypto = require('crypto'); // 암호화를 위한 노드 내장 모듈
const { OpenAI } = require('openai');
const { createClient } = require('@supabase/supabase-js');

// .env 파일의 환경 변수를 사용할 수 있도록 설정합니다.
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

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

// 3. 암호화 설정 (보안 최우선)
// 암호화 키는 반드시 32바이트여야 합니다. (보안을 위해 .env에서 관리)
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'default_32_byte_key_for_dev_test_'; 
const IV_LENGTH = 16; // AES 암호화를 위한 초기화 벡터 길이

/**
 * 데이터 암호화 함수 (AES-256-CBC)
 * 사용자 규칙 8번(보안 및 암호화 최우선)에 따라 원문 텍스트를 암호화합니다.
 */
function encrypt(text) {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

/**
 * [POST] /api/analyze
 * 사용자가 보낸 텍스트를 분석하고, 암호화하여 DB에 저장한 뒤 결과를 반환합니다.
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
                {
                    role: "user",
                    content: text
                }
            ],
            response_format: { type: "json_object" }
        });

        const analysisResult = JSON.parse(response.choices[0].message.content);

        // B. 보안: 사용자 원문 텍스트 암호화
        const encryptedText = encrypt(text);

        // C. Supabase에 결과 저장
        const { error } = await supabase
            .from('sentiment_logs')
            .insert([
                { 
                    input_text: encryptedText, 
                    sentiment: analysisResult.sentiment,
                    confidence: analysisResult.confidence,
                    reason: analysisResult.reason
                }
            ]);

        if (error) {
            console.error('Supabase 저장 에러:', error);
            // 저장에 실패하더라도 분석 결과는 보여주기 위해 에러를 던지지는 않습니다.
        }

        // D. 최종 결과 반환
        res.json({
            success: true,
            data: analysisResult
        });

    } catch (error) {
        console.error('분석 처리 중 에러:', error);
        res.status(500).json({
            success: false,
            message: '서버 오류로 분석에 실패했습니다. API 키 설정을 확인해 주세요.'
        });
    }
});

// 서버 실행
app.listen(PORT, () => {
    console.log(`AI 감성 분석 서버가 포트 ${PORT}에서 작동 중입니다.`);
});
