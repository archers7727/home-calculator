import React, { useEffect } from 'react';
import {
  Card,
  CardContent,
  Button,
  PriceInput,
  ResultSection,
  ResultRow,
} from '../../components/ui';
import { useCalculatorStore } from '../../store';
import { calculateAllLoans, getRecommendedLoanCombination } from '../../calculators';
import { HousingInfo, BuyerInfo } from '../../types';
import { formatPriceWon, formatPercent } from '../../constants';
import { Check, X, Info } from 'lucide-react';

export function Step3Loan() {
  const {
    housing,
    buyer,
    loans,
    setLoans,
    availableCapital,
    setAvailableCapital,
    nextStep,
    prevStep,
  } = useCalculatorStore();

  // Calculate loans when component mounts or inputs change
  useEffect(() => {
    if (housing.price && buyer.income !== undefined) {
      const calculatedLoans = calculateAllLoans(
        housing as HousingInfo,
        buyer as BuyerInfo
      );
      setLoans(calculatedLoans);
    }
  }, [housing, buyer]);

  const eligibleLoans = loans.filter((l) => l.eligible);
  const totalAvailable = eligibleLoans.reduce((sum, l) => sum + l.limit, 0);

  // Recommended combination
  const targetAmount = Math.max(0, (housing.price || 0) - availableCapital);
  const recommendation = getRecommendedLoanCombination(loans, targetAmount);

  return (
    <div className="space-y-6">
      {/* Capital Input */}
      <Card>
        <CardContent className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-800">💰 자금 계획</h3>

          <PriceInput
            label="보유 자기자본"
            value={availableCapital}
            onChange={setAvailableCapital}
            unit="eok"
          />

          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">필요 대출금액</span>
              <span className="font-bold text-blue-600">
                {formatPriceWon(Math.max(0, (housing.price || 0) - availableCapital))}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loan Options */}
      <Card>
        <CardContent className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-800">
            📋 대출 가능 여부 자동 판정
          </h3>

          <div className="space-y-4">
            {loans.map((loan) => (
              <LoanCard key={loan.type} loan={loan} />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recommended Combination */}
      {eligibleLoans.length > 0 && (
        <Card>
          <CardContent className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800">
              🎯 추천 대출 조합
            </h3>

            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
              <div className="space-y-2">
                {recommendation.loans.map((loan) => (
                  <div key={loan.type} className="flex justify-between">
                    <span className="text-slate-700">{loan.name}</span>
                    <span className="font-medium">
                      {formatPriceWon(loan.limit)}
                    </span>
                  </div>
                ))}
                <div className="border-t border-emerald-200 pt-2 mt-2">
                  <div className="flex justify-between font-bold">
                    <span>총 대출</span>
                    <span className="text-emerald-700">
                      {formatPriceWon(recommendation.totalAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-600 mt-1">
                    <span>예상 월 상환액</span>
                    <span>약 {formatPriceWon(recommendation.monthlyPayment)}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    (원리금균등, 30년 기준)
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={prevStep}>
          ← 이전
        </Button>
        <Button onClick={nextStep} size="lg">
          결과 확인 →
        </Button>
      </div>
    </div>
  );
}

interface LoanCardProps {
  loan: {
    type: string;
    name: string;
    limit: number;
    rate: number;
    monthlyPayment: number;
    eligible: boolean;
    eligibilityReasons: string[];
  };
}

function LoanCard({ loan }: LoanCardProps) {
  const [expanded, setExpanded] = React.useState(false);

  return (
    <div
      className={`border rounded-lg p-4 ${
        loan.eligible
          ? 'border-emerald-200 bg-emerald-50'
          : 'border-slate-200 bg-slate-50'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          {loan.eligible ? (
            <span className="text-emerald-600 font-bold">✅</span>
          ) : (
            <span className="text-slate-400">⬜</span>
          )}
          <div>
            <h4 className="font-semibold text-slate-800">{loan.name}</h4>
            {loan.eligible && (
              <div className="text-sm text-slate-600 mt-1">
                <span>한도: {formatPriceWon(loan.limit)}</span>
                <span className="mx-2">|</span>
                <span>금리: {formatPercent(loan.rate)}</span>
              </div>
            )}
          </div>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-sm text-blue-600 hover:underline"
        >
          {expanded ? '접기' : '상세보기'}
        </button>
      </div>

      {expanded && (
        <div className="mt-3 pt-3 border-t border-slate-200">
          <ul className="space-y-1">
            {loan.eligibilityReasons.map((reason, idx) => (
              <li key={idx} className="text-sm text-slate-600 flex items-start gap-2">
                <span className="text-slate-400">•</span>
                {reason}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
