import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Card, CardContent } from '../../components/ui';
import { AcquisitionTaxCalculator } from './AcquisitionTaxCalculator';
import { CapitalGainsTaxCalculator } from './CapitalGainsTaxCalculator';
import { BrokerageFeeCalculator } from './BrokerageFeeCalculator';
import { LoanCalculator } from './LoanCalculator';
import { Calculator, TrendingUp, Home, Percent } from 'lucide-react';

const calculators = [
  {
    path: 'acquisition-tax',
    name: '취득세',
    description: '주택 구입 시 납부할 취득세',
    icon: Calculator,
  },
  {
    path: 'capital-gains-tax',
    name: '양도소득세',
    description: '주택 매도 시 양도소득세',
    icon: TrendingUp,
  },
  {
    path: 'brokerage-fee',
    name: '중개수수료',
    description: '부동산 거래 중개수수료',
    icon: Percent,
  },
  {
    path: 'loan',
    name: '대출',
    description: '정책금융 및 시중은행 대출',
    icon: Home,
  },
];

function CalculatorsIndex() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">개별 계산기</h1>
        <p className="text-slate-600 mt-1">
          필요한 항목만 빠르게 계산할 수 있습니다
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {calculators.map((calc) => (
          <Link key={calc.path} to={calc.path}>
            <Card hover className="h-full">
              <CardContent className="flex items-center gap-4 py-6">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <calc.icon className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">{calc.name}</h3>
                  <p className="text-sm text-slate-500">{calc.description}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function CalculatorsPage() {
  return (
    <Routes>
      <Route index element={<CalculatorsIndex />} />
      <Route path="acquisition-tax" element={<AcquisitionTaxCalculator />} />
      <Route path="capital-gains-tax" element={<CapitalGainsTaxCalculator />} />
      <Route path="brokerage-fee" element={<BrokerageFeeCalculator />} />
      <Route path="loan" element={<LoanCalculator />} />
    </Routes>
  );
}

export default CalculatorsPage;
