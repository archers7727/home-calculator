// 지역 데이터
export const REGIONS = [
  '서울특별시',
  '부산광역시',
  '대구광역시',
  '인천광역시',
  '광주광역시',
  '대전광역시',
  '울산광역시',
  '세종특별자치시',
  '경기도',
  '강원도',
  '충청북도',
  '충청남도',
  '전라북도',
  '전라남도',
  '경상북도',
  '경상남도',
  '제주특별자치도',
] as const;

export const DISTRICTS: Record<string, string[]> = {
  '서울특별시': [
    '강남구', '강동구', '강북구', '강서구', '관악구', '광진구', '구로구', '금천구',
    '노원구', '도봉구', '동대문구', '동작구', '마포구', '서대문구', '서초구', '성동구',
    '성북구', '송파구', '양천구', '영등포구', '용산구', '은평구', '종로구', '중구', '중랑구',
  ],
  '부산광역시': [
    '강서구', '금정구', '기장군', '남구', '동구', '동래구', '부산진구', '북구',
    '사상구', '사하구', '서구', '수영구', '연제구', '영도구', '중구', '해운대구',
  ],
  '경기도': [
    '수원시', '성남시', '고양시', '용인시', '부천시', '안산시', '안양시', '남양주시',
    '화성시', '평택시', '의정부시', '시흥시', '파주시', '광명시', '김포시', '군포시',
    '광주시', '이천시', '양주시', '오산시', '구리시', '안성시', '포천시', '의왕시',
    '하남시', '여주시', '양평군', '동두천시', '과천시', '가평군', '연천군',
  ],
  '인천광역시': [
    '계양구', '남동구', '동구', '미추홀구', '부평구', '서구', '연수구', '중구', '강화군', '옹진군',
  ],
  // 나머지 지역은 간단히 처리
};

// 조정대상지역 (2026년 기준 - 실제로는 정책에 따라 변경됨)
export const ADJUSTMENT_AREAS = [
  '서울특별시',
  // 필요시 추가
] as const;

// 취득세 세율
export const ACQUISITION_TAX_RATES = {
  // 주택 수별 기본 세율
  HOUSE_1: {
    UNDER_6: 0.01,      // 6억 이하: 1%
    UNDER_9: 0.02,      // 6~9억: 1~3% (누진)
    OVER_9: 0.03,       // 9억 초과: 3%
  },
  HOUSE_2: 0.08,        // 2주택: 8%
  HOUSE_3_PLUS: 0.12,   // 3주택 이상: 12%

  // 조정대상지역 추가 세율
  ADJUSTMENT_AREA: {
    HOUSE_2: 0.08,      // 2주택: 8%
    HOUSE_3_PLUS: 0.12, // 3주택 이상: 12%
  },
} as const;

// 생애최초 취득세 감면 (2026년 기준)
export const FIRST_TIME_BUYER_REDUCTION = {
  MAX_REDUCTION: 2_000_000,      // 최대 200만원 감면
  INCOME_LIMIT: 70_000_000,      // 합산소득 7천만원 이하
  PRICE_LIMIT: 1_200_000_000,    // 12억 이하 주택
} as const;

// 중개수수료 요율표 (주택 매매 기준)
export const BROKERAGE_FEE_RATES = [
  { limit: 50_000_000, rate: 0.006, max: 250_000 },      // 5천만 미만: 0.6%, 최대 25만
  { limit: 200_000_000, rate: 0.005, max: 800_000 },    // 5천만~2억: 0.5%, 최대 80만
  { limit: 600_000_000, rate: 0.004, max: null },       // 2억~6억: 0.4%
  { limit: 900_000_000, rate: 0.005, max: null },       // 6억~9억: 0.5%
  { limit: Infinity, rate: 0.009, max: null },          // 9억 초과: 0.9% (협의)
] as const;

// 양도소득세 누진세율 (2026년 기준)
export const CAPITAL_GAINS_TAX_BRACKETS = [
  { limit: 14_000_000, rate: 0.06, deduction: 0 },
  { limit: 50_000_000, rate: 0.15, deduction: 1_260_000 },
  { limit: 88_000_000, rate: 0.24, deduction: 5_760_000 },
  { limit: 150_000_000, rate: 0.35, deduction: 15_440_000 },
  { limit: 300_000_000, rate: 0.38, deduction: 19_940_000 },
  { limit: 500_000_000, rate: 0.40, deduction: 25_940_000 },
  { limit: 1_000_000_000, rate: 0.42, deduction: 35_940_000 },
  { limit: Infinity, rate: 0.45, deduction: 65_940_000 },
] as const;

// 장기보유특별공제 (1세대 1주택)
export const LONG_TERM_HOLDING_DEDUCTION = {
  HOLDING_RATE_PER_YEAR: 0.08,   // 보유기간 연 8%
  HOLDING_MAX: 0.40,             // 보유기간 최대 40%
  RESIDENCE_RATE_PER_YEAR: 0.08, // 거주기간 연 8%
  RESIDENCE_MAX: 0.40,           // 거주기간 최대 40%
  MIN_YEARS: 3,                  // 최소 3년 이상 보유
} as const;

// 디딤돌 대출 조건 (2026년 기준)
export const DIDIMDOL_LOAN = {
  // 소득 기준
  INCOME_LIMIT: {
    SINGLE: 60_000_000,         // 단독 6천만원
    MARRIED: 70_000_000,        // 부부합산 7천만원
    NEWLYWED: 85_000_000,       // 신혼부부 8.5천만원
  },
  // 주택 가격 기준
  PRICE_LIMIT: {
    GENERAL: 500_000_000,       // 일반 5억
    NEWLYWED: 600_000_000,      // 신혼부부 6억
  },
  // 대출 한도
  LOAN_LIMIT: {
    GENERAL: 250_000_000,       // 일반 2.5억
    NEWLYWED: 400_000_000,      // 신혼부부 4억
  },
  // 금리 (2026년 기준 예시)
  RATE: {
    BASE: 0.027,                // 기본 2.7%
    NEWLYWED: 0.021,            // 신혼부부 2.1%
  },
  // LTV 한도
  LTV: 0.70,                    // 70%
} as const;

// 신생아 특례 대출 조건 (2026년 기준)
export const NEWBORN_LOAN = {
  INCOME_LIMIT: 130_000_000,    // 1.3억 이하
  PRICE_LIMIT: 900_000_000,     // 9억 이하
  LOAN_LIMIT: 500_000_000,      // 5억 한도
  RATE: {
    MIN: 0.016,                 // 최저 1.6%
    MAX: 0.033,                 // 최고 3.3%
  },
  LTV: 0.80,                    // 80%
} as const;

// 시중은행 주담대 (일반적인 기준)
export const BANK_MORTGAGE = {
  LTV: {
    ADJUSTMENT: 0.40,           // 조정대상지역 40%
    NON_ADJUSTMENT: 0.50,       // 비조정지역 50%
  },
  DSR: 0.40,                    // DSR 40%
  RATE: {
    MIN: 0.040,                 // 최저 4.0%
    MAX: 0.050,                 // 최고 5.0%
  },
} as const;

// 기타 비용
export const OTHER_COSTS = {
  LAWYER_FEE: {
    BASE: 500_000,              // 기본 50만원
    PER_100M: 100_000,          // 1억당 10만원 추가
    MAX: 1_500_000,             // 최대 150만원
  },
  HOUSING_BOND_DISCOUNT: 0.05,  // 국민주택채권 할인율 약 5%
  STAMP_DUTY: {
    UNDER_1B: 150_000,          // 1억 이하: 15만원
    UNDER_10B: 350_000,         // 1~10억: 35만원
    OVER_10B: 350_000,          // 10억 초과: 35만원
  },
  MOVING_COST: 1_000_000,       // 이사비 기본 100만원
} as const;

// 포맷팅
export const formatPrice = (price: number): string => {
  if (price >= 100_000_000) {
    const eok = Math.floor(price / 100_000_000);
    const man = Math.floor((price % 100_000_000) / 10_000);
    if (man > 0) {
      return `${eok}억 ${man.toLocaleString()}만`;
    }
    return `${eok}억`;
  }
  if (price >= 10_000) {
    return `${Math.floor(price / 10_000).toLocaleString()}만`;
  }
  return price.toLocaleString();
};

export const formatPriceWon = (price: number): string => {
  return `${formatPrice(price)}원`;
};

export const formatPercent = (rate: number): string => {
  return `${(rate * 100).toFixed(2)}%`;
};

export const formatArea = (area: number): string => {
  const pyeong = (area / 3.3058).toFixed(0);
  return `${area}㎡ (약 ${pyeong}평)`;
};
