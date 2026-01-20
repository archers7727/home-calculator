import { AcquisitionTaxResult, HousingInfo, BuyerInfo } from '../types';
import { ACQUISITION_TAX_RATES, FIRST_TIME_BUYER_REDUCTION } from '../constants';

/**
 * 취득세 계산
 * - 주택 수에 따른 세율 적용
 * - 생애최초 감면 적용
 */
export function calculateAcquisitionTax(
  housing: HousingInfo,
  buyer: BuyerInfo
): AcquisitionTaxResult {
  const { price, isAdjustmentArea } = housing;
  const { houseCount, isFirstTime, income, spouseIncome } = buyer;

  // 1. 기본 세율 결정
  let baseRate: number;

  // 취득 후 주택 수 (현재 보유 + 1)
  const totalHouseCount = houseCount + 1;

  if (totalHouseCount === 1) {
    // 1주택: 가격 구간별 세율
    if (price <= 600_000_000) {
      baseRate = ACQUISITION_TAX_RATES.HOUSE_1.UNDER_6;
    } else if (price <= 900_000_000) {
      // 6~9억 구간: 누진 적용 (1~3%)
      const ratio = (price - 600_000_000) / 300_000_000;
      baseRate = 0.01 + ratio * 0.02;
    } else {
      baseRate = ACQUISITION_TAX_RATES.HOUSE_1.OVER_9;
    }
  } else if (totalHouseCount === 2) {
    // 2주택
    baseRate = isAdjustmentArea
      ? ACQUISITION_TAX_RATES.ADJUSTMENT_AREA.HOUSE_2
      : ACQUISITION_TAX_RATES.HOUSE_2;
  } else {
    // 3주택 이상
    baseRate = isAdjustmentArea
      ? ACQUISITION_TAX_RATES.ADJUSTMENT_AREA.HOUSE_3_PLUS
      : ACQUISITION_TAX_RATES.HOUSE_3_PLUS;
  }

  // 2. 취득세 계산
  const baseTax = Math.floor(price * baseRate);

  // 3. 농어촌특별세 (취득세의 10%, 전용면적 85㎡ 초과 시)
  const ruralTax = housing.area > 85 ? Math.floor(baseTax * 0.1) : 0;

  // 4. 지방교육세 (취득세의 10%)
  const educationTax = Math.floor(baseTax * 0.1);

  // 5. 감면 전 합계
  const totalBeforeReduction = baseTax + ruralTax + educationTax;

  // 6. 생애최초 감면 적용
  let reduction = 0;
  let reductionReason: string | undefined;

  const totalIncome = income + spouseIncome;

  if (
    isFirstTime &&
    totalHouseCount === 1 &&
    totalIncome <= FIRST_TIME_BUYER_REDUCTION.INCOME_LIMIT &&
    price <= FIRST_TIME_BUYER_REDUCTION.PRICE_LIMIT
  ) {
    // 생애최초 감면: 200만원 한도
    reduction = Math.min(totalBeforeReduction, FIRST_TIME_BUYER_REDUCTION.MAX_REDUCTION);
    reductionReason = '생애최초 주택 구입 감면';
  }

  // 7. 최종 납부액
  const total = totalBeforeReduction - reduction;

  return {
    baseRate,
    baseTax,
    ruralTax,
    educationTax,
    totalBeforeReduction,
    reduction,
    reductionReason,
    total,
  };
}

/**
 * 취득세율만 간단히 계산 (미리보기용)
 */
export function getAcquisitionTaxRate(
  price: number,
  houseCount: number,
  isAdjustmentArea: boolean
): number {
  const totalHouseCount = houseCount + 1;

  if (totalHouseCount === 1) {
    if (price <= 600_000_000) return 0.01;
    if (price <= 900_000_000) {
      const ratio = (price - 600_000_000) / 300_000_000;
      return 0.01 + ratio * 0.02;
    }
    return 0.03;
  }

  if (totalHouseCount === 2) {
    return isAdjustmentArea ? 0.08 : 0.08;
  }

  return isAdjustmentArea ? 0.12 : 0.12;
}
