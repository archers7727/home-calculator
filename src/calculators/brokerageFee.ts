import { BrokerageFeeResult } from '../types';
import { BROKERAGE_FEE_RATES } from '../constants';

/**
 * 중개수수료 계산 (주택 매매 기준)
 */
export function calculateBrokerageFee(price: number): BrokerageFeeResult {
  let rate = 0;
  let baseFee = 0;

  for (const bracket of BROKERAGE_FEE_RATES) {
    if (price <= bracket.limit) {
      rate = bracket.rate;
      baseFee = Math.floor(price * rate);

      // 상한 적용
      if (bracket.max && baseFee > bracket.max) {
        baseFee = bracket.max;
      }
      break;
    }
  }

  // 부가세 10%
  const vat = Math.floor(baseFee * 0.1);
  const total = baseFee + vat;

  return {
    rate,
    baseFee,
    vat,
    total,
  };
}

/**
 * 중개수수료율 조회
 */
export function getBrokerageRate(price: number): number {
  for (const bracket of BROKERAGE_FEE_RATES) {
    if (price <= bracket.limit) {
      return bracket.rate;
    }
  }
  return 0.009; // 기본 0.9%
}
