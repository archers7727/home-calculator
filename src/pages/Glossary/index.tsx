import React, { useState } from 'react';
import { Search, BookOpen, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, Input } from '../../components/ui';

interface GlossaryTerm {
  term: string;
  definition: string;
  category: string;
  related?: string[];
}

const GLOSSARY_TERMS: GlossaryTerm[] = [
  // 세금 관련
  {
    term: '취득세',
    definition: '부동산을 취득할 때 납부하는 지방세입니다. 주택 가격과 보유 주택 수에 따라 세율이 달라집니다. 1주택자는 1~3%, 2주택자는 8%, 3주택 이상은 12%의 세율이 적용됩니다.',
    category: '세금',
    related: ['지방교육세', '농어촌특별세'],
  },
  {
    term: '양도소득세',
    definition: '부동산을 양도(매도)할 때 발생한 차익에 대해 납부하는 세금입니다. 보유 기간, 주택 수, 실거주 기간 등에 따라 세율과 공제가 달라집니다.',
    category: '세금',
    related: ['1세대 1주택 비과세', '장기보유특별공제'],
  },
  {
    term: '1세대 1주택 비과세',
    definition: '1세대가 1주택만 보유하고, 2년 이상 보유(조정대상지역은 2년 거주 포함) 후 양도하면 양도가액 12억원까지 양도세가 면제되는 제도입니다.',
    category: '세금',
    related: ['양도소득세', '조정대상지역'],
  },
  {
    term: '장기보유특별공제',
    definition: '부동산을 3년 이상 보유한 경우 양도차익에서 일정 비율을 공제해주는 제도입니다. 보유 기간이 길수록 공제율이 높아지며, 최대 30%(1주택 거주자는 80%)까지 공제받을 수 있습니다.',
    category: '세금',
    related: ['양도소득세'],
  },
  {
    term: '지방교육세',
    definition: '취득세의 부가세로, 취득세액의 10%를 납부합니다. 지방교육 재정에 사용됩니다.',
    category: '세금',
    related: ['취득세'],
  },
  {
    term: '농어촌특별세',
    definition: '취득세에 추가로 부과되는 세금으로, 면적 85㎡ 초과 주택 또는 다주택자 취득 시 취득세의 10~20%가 부과됩니다.',
    category: '세금',
    related: ['취득세'],
  },

  // 대출 관련
  {
    term: '디딤돌 대출',
    definition: '정부가 지원하는 서민 주거 안정 대출 상품입니다. 부부합산 연소득 6천만원 이하, 순자산 4.88억원 이하인 무주택자가 대상이며, 시중보다 낮은 금리로 최대 2.5억원까지 대출받을 수 있습니다.',
    category: '대출',
    related: ['LTV', 'DSR', '신생아 특례 대출'],
  },
  {
    term: '신생아 특례 대출',
    definition: '2024년 출생한 자녀가 있는 무주택 가구를 위한 저금리 대출 상품입니다. 부부합산 연소득 1.3억원 이하가 대상이며, 최대 5억원까지 1%대 금리로 대출받을 수 있습니다.',
    category: '대출',
    related: ['디딤돌 대출', 'LTV'],
  },
  {
    term: 'LTV (주택담보대출비율)',
    definition: 'Loan to Value의 약자로, 주택 가격 대비 대출 가능 금액의 비율입니다. 예를 들어 LTV 70%면 5억원 주택에 3.5억원까지 대출이 가능합니다. 지역과 주택 수에 따라 규제가 다릅니다.',
    category: '대출',
    related: ['DTI', 'DSR'],
  },
  {
    term: 'DTI (총부채상환비율)',
    definition: 'Debt to Income의 약자로, 연소득 대비 연간 원리금 상환액의 비율입니다. 대출 한도를 산정하는 기준으로 사용됩니다.',
    category: '대출',
    related: ['LTV', 'DSR'],
  },
  {
    term: 'DSR (총부채원리금상환비율)',
    definition: 'Debt Service Ratio의 약자로, 연소득 대비 모든 금융부채의 연간 원리금 상환액 비율입니다. 2022년부터 전면 시행되어 가계대출 심사의 핵심 기준이 됩니다.',
    category: '대출',
    related: ['LTV', 'DTI'],
  },
  {
    term: '원리금균등상환',
    definition: '대출 기간 동안 매월 동일한 금액(원금+이자)을 상환하는 방식입니다. 초기에는 이자 비중이 높고, 시간이 지날수록 원금 비중이 높아집니다.',
    category: '대출',
    related: ['원금균등상환'],
  },
  {
    term: '원금균등상환',
    definition: '매월 동일한 원금에 잔액에 대한 이자를 더해 상환하는 방식입니다. 초기 상환 부담이 크지만, 총 이자 부담은 원리금균등상환보다 적습니다.',
    category: '대출',
    related: ['원리금균등상환'],
  },

  // 부동산 거래 관련
  {
    term: '중개수수료',
    definition: '부동산 거래 시 공인중개사에게 지급하는 수수료입니다. 거래 금액에 따라 법정 요율이 정해져 있으며, 매매는 최대 0.9%, 전세는 최대 0.8%입니다.',
    category: '거래',
    related: ['법무사 비용', '등기비용'],
  },
  {
    term: '등기비용',
    definition: '소유권 이전등기를 할 때 드는 비용으로, 등록면허세, 취득세, 법무사 수수료 등이 포함됩니다.',
    category: '거래',
    related: ['취득세', '법무사 비용'],
  },
  {
    term: '법무사 비용',
    definition: '부동산 등기 업무를 대행하는 법무사에게 지급하는 수수료입니다. 보통 30~50만원 정도이며, 거래 금액이나 업무 복잡도에 따라 달라집니다.',
    category: '거래',
    related: ['등기비용'],
  },
  {
    term: '국민주택채권',
    definition: '부동산 등기 시 의무적으로 매입해야 하는 채권입니다. 매입 후 즉시 할인 매도하는 것이 일반적이며, 할인 손실액이 실질적인 비용이 됩니다.',
    category: '거래',
  },
  {
    term: '인지세',
    definition: '부동산 매매계약서 작성 시 납부하는 세금입니다. 거래 금액에 따라 2만원~35만원이 부과됩니다.',
    category: '거래',
  },

  // 지역/규제 관련
  {
    term: '조정대상지역',
    definition: '주택 가격 상승률이 높거나 청약 경쟁이 과열된 지역으로 지정됩니다. 이 지역에서는 LTV/DTI 규제가 강화되고, 1세대 1주택 비과세를 받으려면 2년 실거주 요건이 필요합니다.',
    category: '지역/규제',
    related: ['투기과열지구', '1세대 1주택 비과세'],
  },
  {
    term: '투기과열지구',
    definition: '주택 가격 급등 우려가 있는 지역으로, 조정대상지역보다 더 강한 규제가 적용됩니다. 주택담보대출, 전매 제한 등이 강화됩니다.',
    category: '지역/규제',
    related: ['조정대상지역'],
  },
  {
    term: '분양권 전매제한',
    definition: '아파트 분양권을 일정 기간 동안 다른 사람에게 팔 수 없도록 제한하는 규제입니다. 투기과열지구에서는 소유권 이전 등기까지, 조정대상지역에서는 1~3년 동안 전매가 금지됩니다.',
    category: '지역/규제',
  },

  // 주택 유형
  {
    term: '전용면적',
    definition: '아파트 내부에서 실제로 거주할 수 있는 공간의 면적입니다. 발코니, 복도, 계단 등 공용 면적은 제외됩니다. 흔히 말하는 "84㎡ 아파트"가 전용면적 기준입니다.',
    category: '주택',
    related: ['공급면적'],
  },
  {
    term: '공급면적',
    definition: '전용면적에 주거공용면적(복도, 계단 등)을 더한 면적입니다. 분양 시 기준이 되는 면적으로, "34평형"이라고 부르는 것이 공급면적 기준입니다.',
    category: '주택',
    related: ['전용면적'],
  },
  {
    term: '오피스텔',
    definition: '업무와 주거를 겸할 수 있는 건물입니다. 주택이 아니므로 주택 수에 포함되지 않지만, 주거용으로 사용하면 취득세가 주택과 동일하게 적용됩니다.',
    category: '주택',
  },
  {
    term: '다세대/다가구',
    definition: '다세대주택은 4층 이하, 연면적 660㎡ 이하의 공동주택이고, 다가구주택은 단독주택으로 분류됩니다. 다가구는 1세대가 통째로 소유하고, 다세대는 세대별로 구분 소유가 가능합니다.',
    category: '주택',
  },

  // 갈아타기 관련
  {
    term: '일시적 2주택',
    definition: '기존 주택을 매도하기 전에 새 주택을 취득하여 일시적으로 2주택이 되는 상황입니다. 새 주택 취득 후 3년 이내에 기존 주택을 매도하면 1주택자로 취급됩니다.',
    category: '갈아타기',
    related: ['양도소득세', '1세대 1주택 비과세'],
  },
  {
    term: '대체취득',
    definition: '기존 주택을 처분하고 새 주택을 취득하는 것을 말합니다. 갈아타기, 이사 등의 상황에서 발생하며, 세금 혜택을 받을 수 있는 조건들이 있습니다.',
    category: '갈아타기',
  },
];

const CATEGORIES = ['전체', '세금', '대출', '거래', '지역/규제', '주택', '갈아타기'];

export function GlossaryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [expandedTerms, setExpandedTerms] = useState<Set<string>>(new Set());

  const filteredTerms = GLOSSARY_TERMS.filter((item) => {
    const matchesSearch =
      item.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.definition.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === '전체' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleTerm = (term: string) => {
    setExpandedTerms((prev) => {
      const next = new Set(prev);
      if (next.has(term)) {
        next.delete(term);
      } else {
        next.add(term);
      }
      return next;
    });
  };

  const termsByCategory = CATEGORIES.slice(1).reduce((acc, category) => {
    acc[category] = filteredTerms.filter((item) => item.category === category);
    return acc;
  }, {} as Record<string, GlossaryTerm[]>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <BookOpen className="w-7 h-7 text-blue-600" />
          부동산 용어 사전
        </h1>
        <p className="text-slate-600 mt-1">
          부동산 거래에 필요한 용어들을 쉽게 설명해드립니다
        </p>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="용어 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Terms List */}
      {filteredTerms.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-700 mb-2">
              검색 결과가 없습니다
            </h3>
            <p className="text-slate-500">다른 검색어를 입력해보세요</p>
          </CardContent>
        </Card>
      ) : selectedCategory === '전체' ? (
        // Grouped by category when showing all
        <div className="space-y-6">
          {CATEGORIES.slice(1).map((category) => {
            const categoryTerms = termsByCategory[category];
            if (categoryTerms.length === 0) return null;

            return (
              <div key={category}>
                <h2 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-600 rounded-full" />
                  {category}
                </h2>
                <div className="space-y-2">
                  {categoryTerms.map((item) => (
                    <TermCard
                      key={item.term}
                      item={item}
                      isExpanded={expandedTerms.has(item.term)}
                      onToggle={() => toggleTerm(item.term)}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        // Flat list for specific category
        <div className="space-y-2">
          {filteredTerms.map((item) => (
            <TermCard
              key={item.term}
              item={item}
              isExpanded={expandedTerms.has(item.term)}
              onToggle={() => toggleTerm(item.term)}
            />
          ))}
        </div>
      )}

      {/* Stats */}
      <Card>
        <CardContent className="p-4">
          <p className="text-sm text-slate-500 text-center">
            총 {GLOSSARY_TERMS.length}개의 용어 수록
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function TermCard({
  item,
  isExpanded,
  onToggle,
}: {
  item: GlossaryTerm;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        <button
          onClick={onToggle}
          className="w-full p-4 text-left flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <span className="font-semibold text-slate-900">{item.term}</span>
            <span className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded-full">
              {item.category}
            </span>
          </div>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-slate-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-slate-400" />
          )}
        </button>

        {isExpanded && (
          <div className="px-4 pb-4 pt-0">
            <div className="border-t border-slate-100 pt-3">
              <p className="text-slate-700 leading-relaxed">{item.definition}</p>
              {item.related && item.related.length > 0 && (
                <div className="mt-3 flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-slate-500">관련 용어:</span>
                  {item.related.map((related) => (
                    <span
                      key={related}
                      className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-full"
                    >
                      {related}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default GlossaryPage;
