import { CostCalculation, HousingInfo, BuyerInfo } from '../types';
import { OTHER_COSTS } from '../constants';
import { calculateAcquisitionTax } from './acquisitionTax';
import { calculateBrokerageFee } from './brokerageFee';

/**
 * 주택 구매 총 비용 계산
 */
export function calculateTotalCost(
  housing: HousingInfo,
  buyer: BuyerInfo
): CostCalculation {
  const { price } = housing;

  // 1. 취득세
  const acquisitionTax = calculateAcquisitionTax(housing, buyer);

  // 2. 중개수수료
  const brokerageFee = calculateBrokerageFee(price);

  // 3. 법무사 비용
  const lawyerFee = calculateLawyerFee(price);

  // 4. 국민주택채권 할인
  const housingBond = calculateHousingBondDiscount(price);

  // 5. 인지세
  const stampDuty = calculateStampDuty(price);

  // 6. 이사비
  const movingCost = OTHER_COSTS.MOVING_COST;

  // 7. 부대비용 합계
  const totalAdditional =
    acquisitionTax.total +
    brokerageFee.total +
    lawyerFee +
    housingBond +
    stampDuty +
    movingCost;

  // 8. 총 비용 (매매가 + 부대비용)
  const total = price + totalAdditional;

  return {
    acquisitionTax,
    brokerageFee,
    lawyerFee,
    housingBond,
    stampDuty,
    movingCost,
    totalAdditional,
    total,
  };
}

/**
 * 법무사 비용 계산
 */
function calculateLawyerFee(price: number): number {
  const baseFee = OTHER_COSTS.LAWYER_FEE.BASE;
  const additionalFee =
    Math.floor(price / 100_000_000) * OTHER_COSTS.LAWYER_FEE.PER_100M;
  return Math.min(baseFee + additionalFee, OTHER_COSTS.LAWYER_FEE.MAX);
}

/**
 * 국민주택채권 할인 비용 계산
 * 실제로는 채권 매입 후 즉시 할인 매도하는 비용
 */
function calculateHousingBondDiscount(price: number): number {
  // 채권 매입 비율은 가격대별로 다름 (간소화)
  let bondRate = 0;
  if (price <= 200_000_000) {
    bondRate = 0.01; // 2억 이하: 1%
  } else if (price <= 500_000_000) {
    bondRate = 0.015; // 2~5억: 1.5%
  } else {
    bondRate = 0.02; // 5억 초과: 2%
  }

  const bondAmount = Math.floor(price * bondRate);
  const discountCost = Math.floor(bondAmount * OTHER_COSTS.HOUSING_BOND_DISCOUNT);

  return discountCost;
}

/**
 * 인지세 계산
 */
function calculateStampDuty(price: number): number {
  if (price <= 100_000_000) {
    return OTHER_COSTS.STAMP_DUTY.UNDER_1B;
  } else if (price <= 1_000_000_000) {
    return OTHER_COSTS.STAMP_DUTY.UNDER_10B;
  } else {
    return OTHER_COSTS.STAMP_DUTY.OVER_10B;
  }
}
