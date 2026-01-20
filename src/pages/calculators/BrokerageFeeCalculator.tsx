import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  PriceInput,
  ResultSection,
  ResultRow,
  TotalResultCard,
} from '../../components/ui';
import { calculateBrokerageFee } from '../../calculators';
import { BrokerageFeeResult } from '../../types';
import { formatPercent, formatPriceWon, BROKERAGE_FEE_RATES } from '../../constants';

export function BrokerageFeeCalculator() {
  const [price, setPrice] = useState(800_000_000);
  const [result, setResult] = useState<BrokerageFeeResult | null>(null);

  useEffect(() => {
    const calcResult = calculateBrokerageFee(price);
    setResult(calcResult);
  }, [price]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">중개수수료 계산기</h1>
        <p className="text-slate-600 mt-1">
          부동산 거래 시 중개수수료를 계산합니다
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input */}
        <Card>
          <CardContent className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800">거래 정보</h3>

            <PriceInput
              label="거래금액"
              value={price}
              onChange={setPrice}
              unit="eok"
            />

            {/* Rate Table */}
            <div className="mt-6">
              <h4 className="text-sm font-semibold text-slate-700 mb-3">
                📋 중개수수료 요율표 (주택 매매)
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-slate-50">
                      <th className="text-left py-2 px-3">거래금액</th>
                      <th className="text-right py-2 px-3">요율</th>
                      <th className="text-right py-2 px-3">상한</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2 px-3">5천만 미만</td>
                      <td className="text-right py-2 px-3">0.6%</td>
                      <td className="text-right py-2 px-3">25만원</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 px-3">5천만~2억</td>
                      <td className="text-right py-2 px-3">0.5%</td>
                      <td className="text-right py-2 px-3">80만원</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 px-3">2억~6억</td>
                      <td className="text-right py-2 px-3">0.4%</td>
                      <td className="text-right py-2 px-3">-</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 px-3">6억~9억</td>
                      <td className="text-right py-2 px-3">0.5%</td>
                      <td className="text-right py-2 px-3">-</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 px-3">9억 초과</td>
                      <td className="text-right py-2 px-3">0.9% 이내</td>
                      <td className="text-right py-2 px-3">협의</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Result */}
        {result && (
          <div className="space-y-4">
            <TotalResultCard
              title="중개수수료 (VAT 포함)"
              amount={result.total}
              description={`요율 ${formatPercent(result.rate)}`}
            />

            <Card>
              <CardContent>
                <ResultSection title="수수료 상세">
                  <ResultRow label="거래금액" value={price} />
                  <ResultRow label={`요율 (${formatPercent(result.rate)})`} value={result.baseFee} />
                  <ResultRow label="부가세 (10%)" value={result.vat} />
                  <ResultRow label="총 중개수수료" value={result.total} isTotal />
                </ResultSection>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <h4 className="font-semibold text-slate-800 mb-2">참고사항</h4>
                <ul className="text-sm text-slate-600 space-y-1">
                  <li>• 중개수수료는 매도인/매수인 각각 부담</li>
                  <li>• 부가세(VAT)는 별도 부과</li>
                  <li>• 9억 초과 시 0.9% 이내에서 협의</li>
                  <li>• 전세/월세는 별도 요율 적용</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
