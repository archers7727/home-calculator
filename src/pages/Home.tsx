import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ScenarioCard, Card, CardContent } from '../components/ui';
import { Calculator, TrendingUp, Home, RefreshCw, Plus } from 'lucide-react';

export function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center py-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-3">
          내집마련 종합 계산기
        </h1>
        <p className="text-lg text-slate-600">
          내 집 마련, 정확히 얼마가 필요한지 알려드립니다
        </p>
      </div>

      {/* Scenario Selection */}
      <section>
        <h2 className="text-lg font-semibold text-slate-800 mb-4">
          무엇을 계산할까요?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ScenarioCard
            icon="🆕"
            title="처음 집 사기"
            description="무주택에서 첫 내집마련"
            subtext="총 얼마가 필요할까?"
            onClick={() => navigate('/first-buy')}
          />
          <ScenarioCard
            icon="🔄"
            title="집 갈아타기"
            description="현재 집 팔고 새 집으로!"
            subtext="얼마가 더 필요할까?"
            onClick={() => navigate('/trade-up')}
          />
        </div>
        <div className="mt-4">
          <ScenarioCard
            icon="➕"
            title="추가 구매 (다주택)"
            description="1주택 보유 중 투자 검토"
            subtext="세금이 얼마나?"
            onClick={() => alert('준비 중입니다')}
          />
        </div>
      </section>

      {/* Quick Calculators */}
      <section>
        <h2 className="text-lg font-semibold text-slate-800 mb-4">
          빠른 계산이 필요하신가요?
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <QuickCalcButton
            icon={<Calculator className="w-5 h-5" />}
            label="취득세"
            onClick={() => navigate('/calculators/acquisition-tax')}
          />
          <QuickCalcButton
            icon={<TrendingUp className="w-5 h-5" />}
            label="양도세"
            onClick={() => navigate('/calculators/capital-gains-tax')}
          />
          <QuickCalcButton
            icon={<Home className="w-5 h-5" />}
            label="대출"
            onClick={() => navigate('/calculators/loan')}
          />
          <QuickCalcButton
            icon={<Calculator className="w-5 h-5" />}
            label="중개료"
            onClick={() => navigate('/calculators/brokerage-fee')}
          />
        </div>
      </section>

      {/* Info Box */}
      <section>
        <Card>
          <CardContent className="py-6">
            <h3 className="font-semibold text-slate-800 mb-3">
              📌 이 계산기가 도움을 드리는 것
            </h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex items-start gap-2">
                <span className="text-blue-600">✓</span>
                <span>
                  <strong>구매 의사결정:</strong> "이 집을 살 여유가 있는가?" 즉시
                  판단
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">✓</span>
                <span>
                  <strong>갈아타기 의사결정:</strong> "지금 집 팔고 얼마짜리 집으로
                  이동 가능한가?"
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">✓</span>
                <span>
                  <strong>자금 계획 수립:</strong> 대출 조합 최적화 + 필요 현금
                  명확화
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">✓</span>
                <span>
                  <strong>전문가 상담 준비:</strong> PDF 리포트로 은행/공인중개사
                  상담 시 활용
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

interface QuickCalcButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

function QuickCalcButton({ icon, label, onClick }: QuickCalcButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center gap-2 p-4 bg-white border border-slate-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all"
    >
      <span className="text-blue-600">{icon}</span>
      <span className="text-sm font-medium text-slate-700">{label}</span>
    </button>
  );
}
