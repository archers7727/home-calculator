import { LoanResult, HousingInfo, BuyerInfo } from '../../types';
import { NEWBORN_LOAN } from '../../constants';
import { calculateMonthlyPayment } from './didimdol';

/**
 * 신생아 특례 대출 자격 및 한도 계산
 */
export function calculateNewbornLoan(
  housing: HousingInfo,
  buyer: BuyerInfo
): LoanResult {
  const { price } = housing;
  const { childCount, hasBabyPlan, income, spouseIncome, houseCount } = buyer;
  const totalIncome = income + spouseIncome;

  const eligibilityReasons: string[] = [];
  let eligible = true;

  // 1. 무주택 또는 1주택 (처분 조건)
  if (houseCount > 1) {
    eligible = false;
    eligibilityReasons.push('2주택 이상 보유 시 신청 불가');
  } else {
    eligibilityReasons.push('주택 수 요건 충족');
  }

  // 2. 출산 요건 (2년 내 출산 또는 자녀 있음)
  if (!hasBabyPlan && childCount === 0) {
    eligible = false;
    eligibilityReasons.push('2년 내 출산 예정 또는 미성년 자녀 필요');
  } else {
    if (childCount > 0) {
      eligibilityReasons.push(`자녀 ${childCount}명 보유`);
    } else {
      eligibilityReasons.push('2년 내 출산 예정');
    }
  }

  // 3. 소득 기준
  if (totalIncome > NEWBORN_LOAN.INCOME_LIMIT) {
    eligible = false;
    eligibilityReasons.push(`소득 초과 (한도: ${(NEWBORN_LOAN.INCOME_LIMIT / 10000).toLocaleString()}만원)`);
  } else {
    eligibilityReasons.push(`소득 요건 충족`);
  }

  // 4. 주택 가격 기준
  if (price > NEWBORN_LOAN.PRICE_LIMIT) {
    eligible = false;
    eligibilityReasons.push(`주택 가격 초과 (한도: ${NEWBORN_LOAN.PRICE_LIMIT / 100000000}억원)`);
  } else {
    eligibilityReasons.push(`주택 가격 요건 충족`);
  }

  // 5. 대출 한도 계산
  const ltvLimit = Math.floor(price * NEWBORN_LOAN.LTV);
  const limit = eligible ? Math.min(NEWBORN_LOAN.LOAN_LIMIT, ltvLimit) : 0;

  // 6. 금리 (소득에 따라 차등, 여기서는 중간값 사용)
  const rate = (NEWBORN_LOAN.RATE.MIN + NEWBORN_LOAN.RATE.MAX) / 2;

  // 7. 월 상환액
  const monthlyPayment = calculateMonthlyPayment(limit, rate, 30);

  return {
    type: 'newborn',
    name: '신생아 특례 대출',
    limit,
    rate,
    monthlyPayment,
    eligible,
    eligibilityReasons,
  };
}
