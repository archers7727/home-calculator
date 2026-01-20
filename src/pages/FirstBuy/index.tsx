import React, { useEffect } from 'react';
import { ProgressBar, Card, CardContent } from '../../components/ui';
import { useCalculatorStore } from '../../store';
import { Step1Housing } from './Step1Housing';
import { Step2Buyer } from './Step2Buyer';
import { Step3Loan } from './Step3Loan';
import { Step4Result } from './Step4Result';

const STEPS = [
  { label: '주택 정보' },
  { label: '구매자 정보' },
  { label: '대출 계획' },
  { label: '결과' },
];

export function FirstBuyPage() {
  const { currentStep, reset } = useCalculatorStore();

  // Reset on mount
  useEffect(() => {
    return () => {
      // Optional: reset when leaving
    };
  }, []);

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1Housing />;
      case 2:
        return <Step2Buyer />;
      case 3:
        return <Step3Loan />;
      case 4:
        return <Step4Result />;
      default:
        return <Step1Housing />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">🆕 처음 집 사기</h1>
        <p className="text-slate-600 mt-1">
          무주택에서 첫 내집마련, 총 얼마가 필요한지 계산해드립니다
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

export default FirstBuyPage;
