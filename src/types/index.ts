// 주택 유형
export type HousingType = 'apartment' | 'villa' | 'officetel' | 'house';

// 주택 기본 정보
export interface HousingInfo {
  price: number;              // 매매가 (원)
  area: number;               // 전용면적 (㎡)
  region: string;             // 지역 (시/도)
  district: string;           // 지역 (구/군)
  isAdjustmentArea: boolean;  // 조정대상지역
  type: HousingType;
}

// 구매자 정보
export interface BuyerInfo {
  houseCount: 0 | 1 | 2 | 3;  // 현재 주택 보유 수
  isFirstTime: boolean;       // 생애최초
  isNewlywed: boolean;        // 신혼부부
  marriageYears?: number;     // 혼인 기간 (년)
  childCount: number;         // 자녀 수
  hasBabyPlan: boolean;       // 출산 예정
  income: number;             // 본인 연소득
  spouseIncome: number;       // 배우자 연소득
}

// 대출 결과
export interface LoanResult {
  type: string;               // 대출 종류
  name: string;               // 대출명
  limit: number;              // 한도
  rate: number;               // 금리 (%)
  monthlyPayment: number;     // 월 상환액
  eligible: boolean;          // 자격 여부
  eligibilityReasons: string[]; // 자격 조건 상세
}

// 취득세 계산 결과
export interface AcquisitionTaxResult {
  baseRate: number;           // 기본 세율 (%)
  baseTax: number;            // 기본 취득세
  ruralTax: number;           // 농어촌특별세
  educationTax: number;       // 지방교육세
  totalBeforeReduction: number; // 감면 전 합계
  reduction: number;          // 감면액
  reductionReason?: string;   // 감면 사유
  total: number;              // 최종 납부액
}

// 중개수수료 계산 결과
export interface BrokerageFeeResult {
  rate: number;               // 요율 (%)
  baseFee: number;            // 기본 수수료
  vat: number;                // 부가세
  total: number;              // 총 수수료
}

// 비용 계산 결과
export interface CostCalculation {
  acquisitionTax: AcquisitionTaxResult; // 취득세
  brokerageFee: BrokerageFeeResult;     // 중개수수료
  lawyerFee: number;          // 법무사 비용
  housingBond: number;        // 국민주택채권 할인
  stampDuty: number;          // 인지세
  movingCost: number;         // 이사비
  totalAdditional: number;    // 부대비용 합계
  total: number;              // 총 비용 (매매가 + 부대비용)
}

// 매도 예정 주택 정보
export interface PropertyForSale {
  purchasePrice: number;      // 매입가
  purchaseDate: Date;         // 매입일
  currentValue: number;       // 현재 시세 (매도 예상가)
  area: number;               // 전용면적
  region: string;             // 지역
  district: string;           // 구/군
  residenceYears: number;     // 실거주 기간 (년)
  residenceMonths: number;    // 실거주 기간 (월)
  isSingleHousehold: boolean; // 1세대 1주택
}

// 양도세 비과세 조건 충족 여부
export interface TaxExemptionConditions {
  isSingleHousehold: boolean;
  holdingOver2Years: boolean;
  residenceOver2Years: boolean;
  priceUnder12Billion: boolean;
}

// 매도 비용 계산 결과
export interface SaleCalculation {
  capitalGain: number;              // 양도차익
  holdingYears: number;             // 보유기간 (년)
  holdingMonths: number;            // 보유기간 (월)
  capitalGainsTax: number;          // 양도소득세
  longTermDeduction: number;        // 장기보유특별공제
  longTermDeductionRate: number;    // 공제율 (%)
  brokerageFee: BrokerageFeeResult; // 중개수수료
  netProceeds: number;              // 실수령액
  isTaxExempt: boolean;             // 비과세 여부
  exemptionConditions: TaxExemptionConditions;
}

// 갈아타기 종합 시뮬레이션
export interface TradeUpSimulation {
  currentProperty: PropertyForSale;
  saleResult: SaleCalculation;
  newProperty: HousingInfo;
  purchaseCost: CostCalculation;
  additionalFundsNeeded: number;    // 추가 필요 금액
  recommendedLoans: LoanResult[];   // 추천 대출
  totalLoanAvailable: number;       // 대출 가능 총액
  requiredCapital: number;          // 필요 자기자본
  alternatives: AlternativeSimulation[];
}

// 대안 시뮬레이션
export interface AlternativeSimulation {
  price: number;
  additionalFunds: number;
  requiredCapital: number;
}

// 첫 집 구매 시뮬레이션
export interface FirstBuySimulation {
  housing: HousingInfo;
  buyer: BuyerInfo;
  cost: CostCalculation;
  loans: LoanResult[];
  totalLoanAvailable: number;
  requiredCapital: number;
  monthlyPayment: number;
}

// 계산기 스텝
export type CalculatorStep = 1 | 2 | 3 | 4;
