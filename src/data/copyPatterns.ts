export type Channel = 'SNS' | 'BANNER' | 'LANDING';

export type CopyPattern = {
  id: string;
  channel: Channel;
  keywords: string[];
  slots?: Partial<Record<'문제' | '타겟' | '제품' | '해결책' | '혜택', string>>;
  steps: {
    problem: string[];
    solution: string[];
    benefit: string[];
    socialProof: string[];
    cta: string[];
  };
};

export const copyPatterns: CopyPattern[] = [
  {
    id: 'sns-fitness-01',
    channel: 'SNS',
    keywords: ['운동', '헬스', '다이어트', '핏', '홈트'],
    slots: { 타겟: '바쁜 직장인', 문제: '시간이 없어 운동을 미루는 것', 혜택: '10분 루틴으로 땀내기' },
    steps: {
      problem: [
        '매번 {문제}, 공감되시죠?',
        '{타겟}이라면 한 번쯤 느꼈을 고민이에요.'
      ],
      solution: [
        '이제는 {해결책}으로 부담 없이 시작해보세요.',
        '{제품} 하나면 집에서도 바로 가능해요.'
      ],
      benefit: [
        '{혜택}를 누리며 몸이 달라집니다.',
        '꾸준히 하면 체력과 라인이 동시에 올라가요.'
      ],
      socialProof: [
        '이미 {숫자}명이 매일 따라 하고 있어요.',
        '요즘 피드에서 뜨는 루틴, 놓치지 마세요.'
      ],
      cta: [
        '오늘 첫 루틴부터 시작해보세요.',
        '저장해두고 바로 해보면 어때요?'
      ]
    }
  },
  {
    id: 'sns-productivity-01',
    channel: 'SNS',
    keywords: ['생산성', '플래너', '작업', '타임트래킹', '메모'],
    slots: { 문제: '계획만 세우고 지키지 못하는 것', 혜택: '가벼운 체크인으로 집중 유지' },
    steps: {
      problem: [
        '{문제}, 혹시 익숙하지 않나요?',
        '작은 습관 하나가 자꾸 흔들리곤 해요.'
      ],
      solution: [
        '간단한 {해결책}으로 리듬을 잡아보세요.',
        '{제품}가 하루를 세 줄로 정리해줍니다.'
      ],
      benefit: [
        '그 덕분에 {혜택}.',
        '작은 승리가 쌓이면 자신감도 붙어요.'
      ],
      socialProof: [
        '{숫자}명 이상이 매일 체크인 중이에요.',
        '커뮤니티 피드백이 끊이지 않는 이유를 느껴보세요.'
      ],
      cta: [
        '지금 바로 체크인 시작',
        '한 번 써보면 루틴이 달라집니다'
      ]
    }
  },
  {
    id: 'sns-edu-01',
    channel: 'SNS',
    keywords: ['교육', '강의', '수업', '스터디', '튜터'],
    slots: { 타겟: '초보자', 문제: '혼자 공부하다 막히는 순간' },
    steps: {
      problem: [
        '{타겟}라면 {문제}을 겪게 되죠.',
        '진도가 멈출 때마다 의지가 꺾이곤 해요.'
      ],
      solution: [
        '{제품}에서 강사에게 바로 질문하세요.',
        '{해결책}이 막힌 부분을 뚫어줍니다.'
      ],
      benefit: [
        '바로 이해되고 {혜택}까지 챙겨요.',
        '혼자보다 빠르게 완주할 수 있습니다.'
      ],
      socialProof: [
        '실제 수강생 {숫자}명이 남긴 별점 4.8점.',
        '리뷰와 함께 성장 기록을 확인해보세요.'
      ],
      cta: [
        '첫 강의 무료로 시작하기',
        '지금 커리큘럼 확인'
      ]
    }
  },
  {
    id: 'banner-finance-01',
    channel: 'BANNER',
    keywords: ['재테크', '투자', '예금', '적금', '포인트'],
    slots: { 혜택: '연 {숫자}% 혜택', 문제: '금리가 아쉬운 적금' },
    steps: {
      problem: ['{문제}, 아직도 반복하시나요?'],
      solution: ['{제품}으로 바로 해결'],
      benefit: ['{혜택}'],
      socialProof: ['{숫자}+ 사용자 선택'],
      cta: ['지금 바로 시작']
    }
  },
  {
    id: 'banner-delivery-01',
    channel: 'BANNER',
    keywords: ['배달', '주문', '포장', '딜리버리', '맛집'],
    slots: { 혜택: '첫 주문 30% 할인', 문제: '배달비 부담' },
    steps: {
      problem: ['{문제}, 이제 그만!'],
      solution: ['{제품}이 해결합니다'],
      benefit: ['{혜택}'],
      socialProof: ['{숫자}+명이 이미 사용 중'],
      cta: ['앱 열고 쿠폰 받기']
    }
  },
  {
    id: 'banner-saas-01',
    channel: 'BANNER',
    keywords: ['SaaS', '협업', '워크플로우', '자동화', '팀'],
    slots: { 문제: '수작업 보고서 작성', 혜택: '보고 자동 생성' },
    steps: {
      problem: ['{문제}, 오늘도 하시나요?'],
      solution: ['{해결책}으로 끝'],
      benefit: ['{혜택}'],
      socialProof: ['{숫자}팀이 효율 UP'],
      cta: ['데모 보기']
    }
  },
  {
    id: 'landing-wellness-01',
    channel: 'LANDING',
    keywords: ['명상', '수면', '마음', '루틴', '건강'],
    slots: { 타겟: '바쁜 현대인', 문제: '머릿속이 가득 차 잠이 안 오는 것' },
    steps: {
      problem: ['{타겟}이 가장 많이 겪는 문제는 {문제}입니다.'],
      solution: ['{제품}은 이 문제를 해결하기 위해 만들어졌습니다.'],
      benefit: ['그 결과, {혜택}을 경험할 수 있습니다.'],
      socialProof: ['이미 {숫자}명 이상의 고객이 선택했습니다.'],
      cta: ['지금 자세히 알아보세요.']
    }
  },
  {
    id: 'landing-b2b-01',
    channel: 'LANDING',
    keywords: ['B2B', '엔터프라이즈', '보안', '계약', '관리'],
    slots: { 타겟: '성장하는 팀', 문제: '복잡한 권한 관리', 혜택: '감사 추적과 자동화' },
    steps: {
      problem: ['{타겟}이 가장 많이 겪는 문제는 {문제}입니다.'],
      solution: ['{제품}은 이 문제를 해결하기 위해 만들어졌습니다.'],
      benefit: ['그 결과, {혜택}을 경험할 수 있습니다.'],
      socialProof: ['이미 {숫자}명 이상의 고객이 선택했습니다.'],
      cta: ['지금 자세히 알아보세요.']
    }
  },
  {
    id: 'landing-edu-01',
    channel: 'LANDING',
    keywords: ['교육', '코스', '부트캠프', '취업', '멘토'],
    slots: { 타겟: '커리어 전환러', 문제: '혼자 준비하며 생기는 불안', 혜택: '멘토 실습과 포트폴리오' },
    steps: {
      problem: ['{타겟}이 가장 많이 겪는 문제는 {문제}입니다.'],
      solution: ['{제품}은 이 문제를 해결하기 위해 만들어졌습니다.'],
      benefit: ['그 결과, {혜택}을 경험할 수 있습니다.'],
      socialProof: ['이미 {숫자}명 이상의 고객이 선택했습니다.'],
      cta: ['지금 자세히 알아보세요.']
    }
  }
];
