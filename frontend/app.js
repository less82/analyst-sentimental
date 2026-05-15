/**
 * AI 감성 분석 서비스 프론트엔드 로직 (Claude 스타일 최적화)
 */

// UI 요소 선택
const textInput = document.getElementById('text-input');
const charCount = document.getElementById('char-count');
const analyzeBtn = document.getElementById('analyze-btn');
const btnText = analyzeBtn.querySelector('.btn-text');
const btnLoader = document.getElementById('btn-loader');

// 모달 요소
const modal = document.getElementById('result-modal');
const closeBtn = document.querySelector('.close-btn');
const sentimentIcon = document.getElementById('sentiment-icon');
const sentimentLabel = document.getElementById('sentiment-label');
const confidenceBar = document.getElementById('confidence-bar');
const confidenceValue = document.getElementById('confidence-value');
const sentimentReason = document.getElementById('sentiment-reason');

// 1. 실시간 글자 수 카운트
textInput.addEventListener('input', () => {
    const length = textInput.value.length;
    charCount.textContent = `${length} / 500`;
    
    // 임계치 도달 시 강조
    charCount.style.color = length >= 500 ? '#EF4444' : 'var(--text-secondary)';
});

// 2. 분석 시작 이벤트
analyzeBtn.addEventListener('click', async () => {
    const text = textInput.value.trim();

    if (text.length < 5) {
        alert('최소 5자 이상의 문장을 입력해 주세요.');
        return;
    }

    // UI 상태: Loading
    setLoadingState(true);

    try {
        // 백엔드 API 호출
        const response = await fetch('http://localhost:3000/api/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text }),
        });

        const result = await response.json();

        if (result.success) {
            // UI 상태: Success (결과 렌더링)
            showResultModal(result.data);
        } else {
            alert(result.message || '분석 중 오류가 발생했습니다.');
        }
    } catch (error) {
        console.error('API Error:', error);
        alert('서버와 통신할 수 없습니다. 백엔드 서버를 확인해 주세요.');
    } finally {
        setLoadingState(false);
    }
});

// 3. 로딩 상태 관리
function setLoadingState(isLoading) {
    analyzeBtn.disabled = isLoading;
    btnText.style.opacity = isLoading ? '0' : '1';
    btnLoader.style.display = isLoading ? 'inline-block' : 'none';
}

// 4. 결과 모달 표시 및 애니메이션
function showResultModal(data) {
    const { sentiment, confidence, reason } = data;

    // 감정별 테마 설정
    const themes = {
        positive: { icon: '😊', label: '긍정적인 문장입니다!', color: '#22C55E' },
        negative: { icon: '😢', label: '부정적인 문장입니다.', color: '#EF4444' },
        neutral: { icon: '😐', label: '중립적인 문장입니다.', color: '#FACC15' }
    };

    const theme = themes[sentiment] || themes.neutral;

    // 데이터 삽입
    sentimentIcon.textContent = theme.icon;
    sentimentLabel.textContent = theme.label;
    sentimentLabel.style.color = theme.color;
    sentimentReason.textContent = reason;
    confidenceValue.textContent = confidence;

    // 모달 활성화 (CSS 클래스 활용)
    modal.classList.add('active');

    // 신뢰도 바 애니메이션 (레이아웃 렌더링 후 실행)
    confidenceBar.style.width = '0%';
    setTimeout(() => {
        confidenceBar.style.width = `${confidence}%`;
        confidenceBar.style.backgroundColor = theme.color;
    }, 100);
}

// 5. 모달 닫기 로직
const hideModal = () => {
    modal.classList.remove('active');
};

closeBtn.addEventListener('click', hideModal);

// 배경 클릭 시 닫기
window.addEventListener('click', (e) => {
    if (e.target === modal) hideModal();
});

// ESC 키 닫기
window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') hideModal();
});
