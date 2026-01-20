import React, { useEffect } from 'react';
import { ProgressBar, Card, CardContent } from '../../components/ui';
import { useTradeUpStore } from '../../store';
import { Step1CurrentProperty } from './Step1CurrentProperty';
import { Step2SaleCost } from './Step2SaleCost';
import { Step3NewProperty } from './Step3NewProperty';
import { Step4Result } from './Step4Result';

const STEPS = [
  { label: '현재 집' },
  { label: '매도 비용' },
  { label: '새 집' },
  { label: '결과' },
];

export function TradeUpPage() {
  const { currentStep } = useTradeUpStore();

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1CurrentProperty />;
      case 2:
        return <Step2SaleCost />;
      case 3:
        return <Step3NewProperty />;
      case 4:
        return <Step4Result />;
      default:
        return <Step1CurrentProperty />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">🔄 집 갈아타기</h1>
        <p className="text-slate-600 mt-1">
          현재 집을 팔고 새 집으로 이사할 때 얼마가 더 필요한지 계산해드립니다
        </p>
      </div>

      {/* Progress Bar */}
      <Card>
        <CardContent className="py-6">
          <ProgressBar steps={STEPS} currentStep={currentStep} />
        </CardContent>
      </Card>

      {/* Step Content */}
      {renderStep()}
    </div>
  );
}

export default TradeUpPage;
