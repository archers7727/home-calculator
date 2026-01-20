import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Search, MessageCircle } from 'lucide-react';
import { Card, CardContent } from '../../components/ui';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const FAQ_ITEMS: FAQItem[] = [
  // 취득세 관련
  {
    question: '생애최초 주택 구매자 취득세 감면은 어떻게 받나요?',
    answer: `생애최초 주택 구매자는 다음 조건을 모두 충족하면 취득세 감면을 받을 수 있습니다:

1. 본인과 배우자 모두 과거에 주택을 소유한 적이 없어야 합니다
2. 주택 가격이 12억원 이하여야 합니다
3. 부부합산 연소득 7천만원 이하 (공동명의 시)

감면 혜택:
- 주택 가격 1.5억원 이하: 취득세 전액 면제
- 주택 가격 1.5억원 초과: 50% 감면 (최대 200만원)

신청은 취득일로부터 60일 이내에 주민센터나 구청 세무과에서 할 수 있습니다.`,
    category: '세금',
  },
  {
    question: '다주택자 취득세 중과는 어떻게 적용되나요?',
    answer: `2024년 현재 다주택자 취득세율은 다음과 같습니다:

• 1주택자: 1~3% (6억 이하 1%, 6~9억 1~3%, 9억 초과 3%)
• 2주택자: 기본 8% (비조정지역은 1~3%)
• 3주택 이상: 12%
• 법인: 12%

단, 일시적 2주택의 경우 기존 주택을 3년 내 매도하면 1주택 세율이 적용됩니다.

농어촌특별세와 지방교육세가 추가로 부과됩니다.`,
    category: '세금',
  },
  {
    question: '1세대 1주택 비과세 요건이 무엇인가요?',
    answer: `1세대 1주택 양도소득세 비과세를 받으려면:

1. 1세대가 1주택만 보유
2. 2년 이상 보유 (조정대상지역은 2년 거주 포함)
3. 양도가액 12억원 이하

12억원 초과분에 대해서만 양도세가 부과됩니다.

단, 다음 경우는 특례가 적용됩니다:
- 일시적 2주택: 새 주택 취득 후 3년 내 기존 주택 매도
- 상속주택: 상속 후 5년간 주택 수 제외
- 혼인합가: 혼인 후 5년 내 한 채 매도

조정대상지역 지정 전 취득한 주택은 거주 요건이 없습니다.`,
    category: '세금',
  },
  {
    question: '양도소득세 장기보유특별공제는 어떻게 계산하나요?',
    answer: `장기보유특별공제는 보유 기간과 거주 기간에 따라 달라집니다:

[일반 주택]
- 3년 이상: 연 2%씩, 최대 30% (15년 보유)

[1세대 1주택 (비과세 12억 초과분)]
- 보유기간: 연 4%씩, 최대 40% (10년)
- 거주기간: 연 4%씩, 최대 40% (10년)
- 합계 최대 80%

예시: 5억 양도차익, 10년 보유/8년 거주
- 보유공제: 5억 × 40% = 2억
- 거주공제: 5억 × 32% = 1.6억
- 과세대상: 5억 - 3.6억 = 1.4억`,
    category: '세금',
  },

  // 대출 관련
  {
    question: '디딤돌 대출 자격 요건은 무엇인가요?',
    answer: `디딤돌 대출 자격 요건:

[소득 요건]
- 부부합산 연소득 6,000만원 이하
- 생애최초 주택 구입자는 7,000만원 이하
- 2자녀 이상 또는 신혼가구는 8,500만원 이하

[자산 요건]
- 순자산 4.88억원 이하

[주택 요건]
- 무주택 세대주
- 전용면적 85㎡ 이하 (읍/면은 100㎡)
- 주택가격 5억원 이하 (신혼/2자녀는 6억원)

[대출 한도]
- 일반: 2.5억원
- 생애최초: 3억원
- 신혼/2자녀: 4억원

[금리]
- 연 2.15~3.0% (소득, 만기에 따라 차등)`,
    category: '대출',
  },
  {
    question: '신생아 특례 대출은 누가 받을 수 있나요?',
    answer: `2024년 신설된 신생아 특례 대출 자격:

[대상]
- 대출 신청일 기준 2년 이내 출생한 자녀가 있는 가구
- (또는 임신 중인 경우 출산 후 신청)

[소득 요건]
- 부부합산 연소득 1.3억원 이하

[주택 요건]
- 무주택 세대주
- 주택가격 9억원 이하

[대출 한도]
- 최대 5억원

[금리]
- 연 1.6~3.3% (소득에 따라 차등)
- 자녀 추가 출산 시 금리 인하 혜택

일반 디딤돌보다 소득 기준이 높고, 한도도 크며, 금리도 낮습니다.`,
    category: '대출',
  },
  {
    question: 'LTV, DTI, DSR은 무엇이고 어떻게 적용되나요?',
    answer: `[LTV - 담보인정비율]
주택가격 대비 대출 한도
- 비규제지역: 70%
- 조정대상지역: 50% (무주택자 60%)
- 투기과열지구: 40% (무주택자 50%)

[DTI - 총부채상환비율]
연소득 대비 해당 대출의 연간 원리금
- 비규제지역: 60%
- 규제지역: 40~50%

[DSR - 총부채원리금상환비율]
연소득 대비 모든 대출의 연간 원리금
- 1억 초과 대출 시 40% 적용
- 개인 신용대출, 카드론 등 모두 포함

실제로는 LTV와 DSR 중 더 낮은 금액이 한도가 됩니다.`,
    category: '대출',
  },

  // 거래 관련
  {
    question: '중개수수료는 얼마까지 내야 하나요?',
    answer: `주택 매매 중개수수료 법정 요율:

[매매]
- 5천만원 미만: 0.6% (최대 25만원)
- 5천만원~2억원: 0.5% (최대 80만원)
- 2억~9억원: 0.4%
- 9억~12억원: 0.5%
- 12억~15억원: 0.6%
- 15억원 이상: 0.7%

[전세/월세]
- 5천만원 미만: 0.5% (최대 20만원)
- 5천만원~1억원: 0.4% (최대 30만원)
- 1억~6억원: 0.3%
- 6억~12억원: 0.4%
- 12억~15억원: 0.5%
- 15억원 이상: 0.6%

부가세 별도입니다. 협상으로 요율 조정이 가능합니다.`,
    category: '거래',
  },
  {
    question: '부동산 매매 시 추가로 드는 비용은 뭐가 있나요?',
    answer: `주택 매매 시 추가 비용 목록:

[세금]
- 취득세: 1~12% (주택 수, 가격에 따라)
- 인지세: 2~35만원 (거래금액에 따라)

[수수료]
- 중개수수료: 0.4~0.7% + 부가세
- 법무사 비용: 30~50만원
- 국민주택채권 할인: 매매가의 0.5~1%

[기타]
- 이사비용: 50~200만원
- 도배/장판: 평당 2~5만원
- 인테리어: 선택사항

5억원 주택 1주택자 기준 약 1,500~2,000만원의 추가 비용이 들어갑니다.`,
    category: '거래',
  },

  // 갈아타기 관련
  {
    question: '집을 갈아탈 때 세금은 어떻게 되나요?',
    answer: `집 갈아타기(매도 후 매수) 시 세금:

[매도 시 - 양도소득세]
1세대 1주택자가 2년 이상 보유 시:
- 양도가 12억원 이하: 비과세
- 12억원 초과: 초과분에 대해 과세

[매수 시 - 취득세]
일시적 2주택 특례 적용 시:
- 새 주택 취득 후 3년 내 기존 주택 매도
- 1주택자 세율(1~3%) 적용

[주의사항]
- 기존 주택 먼저 매도하면 세금 문제 없음
- 신규 주택 먼저 취득 시 일시적 2주택 특례 요건 확인
- 조정대상지역 간 이동 시 실거주 요건 주의`,
    category: '갈아타기',
  },
  {
    question: '일시적 2주택 비과세 특례 요건은 무엇인가요?',
    answer: `일시적 2주택 양도세 비과세 특례 요건:

[기본 요건]
1. 기존 주택 2년 이상 보유
2. 새 주택 취득 후 3년 이내 기존 주택 매도
3. 양도가액 12억원 이하

[조정대상지역 요건]
기존 주택이 조정대상지역인 경우:
- 2년 이상 실거주 필수
- 새 주택 취득일로부터 3년 내 매도

[취득세 특례]
- 일시적 2주택 시 8%가 아닌 1~3% 적용
- 3년 내 기존 주택 미매도 시 차액 추징

[팁]
- 가능하면 기존 주택 매도 후 신규 주택 매수
- 불가피하면 매매 계약을 동시에 진행
- 자금 여력 있으면 잔금일 조절로 보유 기간 최소화`,
    category: '갈아타기',
  },
  {
    question: '갈아타기할 때 자금 계획은 어떻게 세우나요?',
    answer: `갈아타기 자금 계획 단계:

[1단계: 매도 예상 금액 계산]
- 현재 시세 파악 (네이버 부동산, 호갱노노)
- 급매 시 5~10% 할인 고려
- 중개수수료, 양도세 차감

[2단계: 매수 비용 계산]
- 신규 주택 가격
- 취득세 (1~3% + 부가세)
- 중개수수료, 법무사, 이사비용

[3단계: 자금 갭 확인]
- 매도 순수익 - 매수 총비용 = 필요 자금
- 마이너스면 대출 또는 추가 자금 필요

[4단계: 대출 계획]
- LTV, DSR 한도 확인
- 기존 주택담보대출 상환 후 신규 대출
- 금리 비교 (은행별 0.1~0.5% 차이)

[팁]
- 이 계산기로 시뮬레이션해보세요!
- 여유자금 10% 이상 확보 권장`,
    category: '갈아타기',
  },

  // 일반
  {
    question: '이 계산기의 결과는 정확한가요?',
    answer: `이 계산기는 참고용으로 제작되었습니다.

[정확성]
- 2024년 기준 세법과 대출 조건 반영
- 실제와 다를 수 있는 부분:
  • 지방세 감면 (지자체별 상이)
  • 대출 금리 (시장 상황, 신용도에 따라)
  • 중개수수료 (협상에 따라)

[확인 필요 사항]
- 취득세: 구청 세무과
- 양도세: 세무서 또는 세무사
- 대출: 각 금융기관 상담

[업데이트]
- 세법 변경 시 반영 예정
- 오류 발견 시 제보 부탁드립니다

중요한 결정 전에는 반드시 전문가 상담을 받으세요!`,
    category: '일반',
  },
  {
    question: '계산 결과를 저장할 수 있나요?',
    answer: `네, 계산 결과를 저장하고 관리할 수 있습니다!

[저장 방법]
1. 각 계산기에서 계산 완료 후 "저장하기" 버튼 클릭
2. 브라우저의 로컬 스토리지에 자동 저장
3. 최근 50개까지 저장 가능

[기록 확인]
- 상단 메뉴의 "계산 기록" 페이지
- 유형별 필터링 가능
- 불필요한 기록 개별 삭제 가능

[PDF 저장]
- "처음 집 사기", "집 갈아타기" 결과는 PDF로 저장 가능
- 결과 화면에서 "PDF 다운로드" 버튼 클릭

[주의사항]
- 브라우저 캐시 삭제 시 기록도 삭제됨
- 다른 기기에서는 기록 공유 불가`,
    category: '일반',
  },
];

const CATEGORIES = ['전체', '세금', '대출', '거래', '갈아타기', '일반'];

export function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set([0]));

  const filteredItems = FAQ_ITEMS.filter((item) => {
    const matchesSearch =
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === '전체' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleItem = (index: number) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <HelpCircle className="w-7 h-7 text-blue-600" />
          자주 묻는 질문
        </h1>
        <p className="text-slate-600 mt-1">
          부동산 거래와 세금에 관한 궁금증을 해결해드립니다
        </p>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="질문 검색..."
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

      {/* FAQ List */}
      {filteredItems.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <MessageCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-700 mb-2">
              검색 결과가 없습니다
            </h3>
            <p className="text-slate-500">다른 검색어를 입력해보세요</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredItems.map((item, index) => {
            const originalIndex = FAQ_ITEMS.indexOf(item);
            const isExpanded = expandedItems.has(originalIndex);

            return (
              <Card key={index} className="overflow-hidden">
                <button
                  onClick={() => toggleItem(originalIndex)}
                  className="w-full p-4 text-left flex items-start justify-between gap-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full font-medium">
                        {item.category}
                      </span>
                    </div>
                    <h3 className="font-medium text-slate-900 leading-relaxed">
                      Q. {item.question}
                    </h3>
                  </div>
                  <div className="flex-shrink-0 mt-1">
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-4 pb-4">
                    <div className="bg-slate-50 rounded-lg p-4">
                      <p className="text-slate-700 whitespace-pre-line leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {/* Stats */}
      <Card>
        <CardContent className="p-4">
          <p className="text-sm text-slate-500 text-center">
            총 {FAQ_ITEMS.length}개의 질문과 답변
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default FAQPage;
