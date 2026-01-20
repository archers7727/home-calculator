import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  PriceInput,
  Checkbox,
  RadioGroup,
  ResultSection,
  ResultRow,
} from '../../components/ui';
import { calculateAllLoans, calculateMonthlyPayment } from '../../calculators';
import { HousingInfo, BuyerInfo, LoanResult } from '../../types';
import { formatPercent, formatPriceWon } from '../../constants';
import { Check, X } from 'lucide-react';

export function LoanCalculator() {
  const [price, setPrice] = useState(800_000_000);
  const [income, setIncome] = useState(40_000_000);
  const [spouseIncome, setSpouseIncome] = useState(30_000_000);
  const [isNewlywed, setIsNewlywed] = useState(false);
  const [hasBabyPlan, setHasBabyPlan] = useState(false);
  const [childCount, setChildCount] = useState(0);
  const [results, setResults] = useState<LoanResult[]>([]);

  const totalIncome = income + spouseIncome;

  useEffect(() => {
    const housing: HousingInfo = {
      price,
      area: 84,
      region: '서울특별시',
      district: '강남구',
      isAdjustmentArea: true,
      type: 'apartment',
    };

    const buyer: BuyerInfo = {
      houseCount: 0,
      isFirstTime: true,
      isNewlywed,
      childCount,
      hasBabyPlan,
      income,
      spouseIncome,
    };

    const loans = calculateAllLoans(housing, buyer);
    setResults(loans);
  }, [price, income, spouseIncome, isNewlywed, hasBabyPlan, childCount]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">대출 계산기</h1>
        <p className="text-slate-600 mt-1">
          정책금융 및 시중은행 대출 가능 여부와 한도를 확인합니다
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input */}
        <Card>
          <CardContent className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800">기본 정보</h3>

            <PriceInput
              label="주택 가격"
              value={price}
              onChange={setPrice}
              unit="eok"
            />

            <div className="grid grid-cols-2 gap-4">
              <PriceInput
                label="본인 연소득"
                value={income}
                onChange={setIncome}
                unit="man"
              />
              <PriceInput
                label="배우자 연소득"
                value={spouseIncome}
                onChange={setSpouseIncome}
                unit="man"
              />
            </div>

            <div className="p-3 bg-slate-50 rounded-lg">
              <div className="flex justify-between">
                <span className="text-slate-600">합산 연소득</span>
                <span className="font-bold text-blue-600">{formatPriceWon(totalIncome)}</span>
              </div>
            </div>

            <div className="space-y-3">
              <Checkbox
                label="신혼부부 (혼인 7년 이내)"
                checked={isNewlywed}
                onChange={setIsNewlywed}
              />
              <Checkbox
                label="2년 내 출산 예정 또는 자녀 있음"
                checked={hasBabyPlan || childCount > 0}
                onChange={(checked) => {
                  if (checked) {
                    setHasBabyPlan(true);
                    setChildCount(1);
                  } else {
                    setHasBabyPlan(false);
                    setChildCount(0);
                  }
                }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="space-y-4">
          {results.map((loan) => (
            <LoanResultCard key={loan.type} loan={loan} />
          ))}

          {/* Summary */}
          <Card>
            <CardContent>
              <h4 className="font-semibold text-slate-800 mb-3">대출 가능 총액</h4>
              <div className="text-2xl font-bold text-blue-600">
                {formatPriceWon(
                  results
                    .filter((l) => l.eligible)
                    .reduce((sum, l) => sum + l.limit, 0)
                )}
              </div>
              <p className="text-sm text-slate-500 mt-1">
                (정책금융 + 시중은행 합산, 중복 불가 시 별도 확인 필요)
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <h4 className="font-semibold text-slate-800 mb-2">참고사항</h4>
              <ul className="text-sm text-slate-600 space-y-1">
                <li>• 디딤돌/신생아 특례 대출은 무주택자 대상</li>
                <li>• 실제 대출 한도는 개인 신용, DSR 등에 따라 변동</li>
                <li>• 금리는 시장 상황에 따라 변경될 수 있음</li>
                <li>• 정확한 대출 조건은 금융기관에 문의하세요</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function LoanResultCard({ loan }: { loan: LoanResult }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card>
      <CardContent>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                loan.eligible ? 'bg-emerald-100' : 'bg-slate-100'
              }`}
            >
              {loan.eligible ? (
                <Check className="w-5 h-5 text-emerald-600" />
              ) : (
                <X className="w-5 h-5 text-slate-400" />
              )}
            </div>
            <div>
              <h4 className="font-semibold text-slate-800">{loan.name}</h4>
              {loan.eligible && (
                <p className="text-sm text-slate-600">
                  한도 {formatPriceWon(loan.limit)} | 금리 {formatPercent(loan.rate)}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-sm text-blue-600 hover:underline"
          >
            {expanded ? '접기' : '상세'}
          </button>
        </div>

        {expanded && (
          <div className="mt-4 pt-4 border-t border-slate-100">
            <ul className="space-y-2 text-sm">
              {loan.eligibilityReasons.map((reason, idx) => (
                <li key={idx} className="flex items-start gap-2 text-slate-600">
                  <span className="text-slate-400">•</span>
                  {reason}
                </li>
              ))}
            </ul>

            {loan.eligible && loan.monthlyPayment > 0 && (
              <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">예상 월 상환액</span>
                  <span className="font-bold text-blue-600">
                    약 {formatPriceWon(loan.monthlyPayment)}
                  </span>
                </div>
                <p className="text-xs text-slate-500">(원리금균등, 30년)</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
