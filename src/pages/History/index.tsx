import React, { useState } from 'react';
import { Trash2, Clock, Home, ArrowRightLeft, Calculator, Percent, Users, Landmark } from 'lucide-react';
import { Card, CardContent, Button } from '../../components/ui';
import {
  useHistoryStore,
  HistoryItem,
  CalculationType,
  getTypeLabel,
  formatTimestamp,
} from '../../store/useHistoryStore';
import { formatPriceWon, formatPercent } from '../../constants';

const TYPE_ICONS: Record<CalculationType, React.ReactNode> = {
  'first-buy': <Home className="w-5 h-5" />,
  'trade-up': <ArrowRightLeft className="w-5 h-5" />,
  'acquisition-tax': <Calculator className="w-5 h-5" />,
  'capital-gains-tax': <Percent className="w-5 h-5" />,
  'brokerage-fee': <Users className="w-5 h-5" />,
  loan: <Landmark className="w-5 h-5" />,
};

const TYPE_COLORS: Record<CalculationType, string> = {
  'first-buy': 'bg-blue-100 text-blue-700',
  'trade-up': 'bg-green-100 text-green-700',
  'acquisition-tax': 'bg-purple-100 text-purple-700',
  'capital-gains-tax': 'bg-orange-100 text-orange-700',
  'brokerage-fee': 'bg-pink-100 text-pink-700',
  loan: 'bg-cyan-100 text-cyan-700',
};

function HistoryItemCard({ item, onDelete }: { item: HistoryItem; onDelete: () => void }) {
  const renderDetails = () => {
    switch (item.type) {
      case 'first-buy':
        return (
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-slate-500">매매가:</span>{' '}
              <span className="font-medium">{formatPriceWon(item.data.propertyPrice)}</span>
            </div>
            <div>
              <span className="text-slate-500">지역:</span>{' '}
              <span className="font-medium">{item.data.region} {item.data.district}</span>
            </div>
            <div>
              <span className="text-slate-500">총 필요금액:</span>{' '}
              <span className="font-medium text-blue-600">{formatPriceWon(item.data.totalCost)}</span>
            </div>
            <div>
              <span className="text-slate-500">대출금:</span>{' '}
              <span className="font-medium">{formatPriceWon(item.data.loanAmount)}</span>
            </div>
          </div>
        );

      case 'trade-up':
        return (
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-slate-500">현재 집 가치:</span>{' '}
              <span className="font-medium">{formatPriceWon(item.data.currentPropertyValue)}</span>
            </div>
            <div>
              <span className="text-slate-500">새 집 가격:</span>{' '}
              <span className="font-medium">{formatPriceWon(item.data.newPropertyPrice)}</span>
            </div>
            <div>
              <span className="text-slate-500">매도 순수익:</span>{' '}
              <span className="font-medium">{formatPriceWon(item.data.netProceeds)}</span>
            </div>
            <div>
              <span className="text-slate-500">추가 필요금액:</span>{' '}
              <span className="font-medium text-green-600">{formatPriceWon(item.data.additionalFundsNeeded)}</span>
            </div>
          </div>
        );

      case 'acquisition-tax':
        return (
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-slate-500">매매가:</span>{' '}
              <span className="font-medium">{formatPriceWon(item.data.propertyPrice)}</span>
            </div>
            <div>
              <span className="text-slate-500">주택 수:</span>{' '}
              <span className="font-medium">{item.data.houseCount}주택</span>
            </div>
            <div>
              <span className="text-slate-500">취득세:</span>{' '}
              <span className="font-medium text-purple-600">{formatPriceWon(item.data.totalTax)}</span>
            </div>
            <div>
              <span className="text-slate-500">실효세율:</span>{' '}
              <span className="font-medium">{formatPercent(item.data.effectiveRate)}</span>
            </div>
          </div>
        );

      case 'capital-gains-tax':
        return (
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-slate-500">양도가:</span>{' '}
              <span className="font-medium">{formatPriceWon(item.data.salePrice)}</span>
            </div>
            <div>
              <span className="text-slate-500">취득가:</span>{' '}
              <span className="font-medium">{formatPriceWon(item.data.purchasePrice)}</span>
            </div>
            <div>
              <span className="text-slate-500">양도차익:</span>{' '}
              <span className="font-medium">{formatPriceWon(item.data.capitalGain)}</span>
            </div>
            <div>
              <span className="text-slate-500">양도세:</span>{' '}
              <span className={`font-medium ${item.data.isTaxExempt ? 'text-green-600' : 'text-orange-600'}`}>
                {item.data.isTaxExempt ? '비과세' : formatPriceWon(item.data.tax)}
              </span>
            </div>
          </div>
        );

      case 'brokerage-fee':
        return (
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-slate-500">거래가:</span>{' '}
              <span className="font-medium">{formatPriceWon(item.data.transactionPrice)}</span>
            </div>
            <div>
              <span className="text-slate-500">요율:</span>{' '}
              <span className="font-medium">{formatPercent(item.data.rate)}</span>
            </div>
            <div className="col-span-2">
              <span className="text-slate-500">중개수수료:</span>{' '}
              <span className="font-medium text-pink-600">{formatPriceWon(item.data.fee)}</span>
            </div>
          </div>
        );

      case 'loan':
        return (
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-slate-500">매매가:</span>{' '}
              <span className="font-medium">{formatPriceWon(item.data.propertyPrice)}</span>
            </div>
            <div>
              <span className="text-slate-500">가능 대출:</span>{' '}
              <span className="font-medium">{item.data.eligibleLoans.join(', ') || '없음'}</span>
            </div>
            <div>
              <span className="text-slate-500">대출 총액:</span>{' '}
              <span className="font-medium text-cyan-600">{formatPriceWon(item.data.totalLoanAmount)}</span>
            </div>
            <div>
              <span className="text-slate-500">월 상환액:</span>{' '}
              <span className="font-medium">{formatPriceWon(item.data.monthlyPayment)}</span>
            </div>
          </div>
        );
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${TYPE_COLORS[item.type]}`}>
              {TYPE_ICONS[item.type]}
            </div>
            <div>
              <h3 className="font-medium text-slate-900">{getTypeLabel(item.type)}</h3>
              <p className="text-xs text-slate-500 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatTimestamp(item.timestamp)}
              </p>
            </div>
          </div>
          <button
            onClick={onDelete}
            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            title="삭제"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
        {renderDetails()}
      </CardContent>
    </Card>
  );
}

export function HistoryPage() {
  const { items, removeItem, clearHistory } = useHistoryStore();
  const [filter, setFilter] = useState<CalculationType | 'all'>('all');

  const filteredItems = filter === 'all' ? items : items.filter((item) => item.type === filter);

  const filterOptions: { value: CalculationType | 'all'; label: string }[] = [
    { value: 'all', label: '전체' },
    { value: 'first-buy', label: '처음 집 사기' },
    { value: 'trade-up', label: '집 갈아타기' },
    { value: 'acquisition-tax', label: '취득세' },
    { value: 'capital-gains-tax', label: '양도세' },
    { value: 'brokerage-fee', label: '중개수수료' },
    { value: 'loan', label: '대출' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">계산 기록</h1>
          <p className="text-slate-600 mt-1">
            이전에 계산한 결과를 확인할 수 있습니다
          </p>
        </div>
        {items.length > 0 && (
          <Button
            variant="outline"
            onClick={() => {
              if (confirm('모든 계산 기록을 삭제하시겠습니까?')) {
                clearHistory();
              }
            }}
            className="text-red-600 border-red-200 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            전체 삭제
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            {filterOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setFilter(option.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === option.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* History Items */}
      {filteredItems.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Clock className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-700 mb-2">
              {filter === 'all' ? '계산 기록이 없습니다' : '해당 유형의 기록이 없습니다'}
            </h3>
            <p className="text-slate-500">
              계산기를 사용하면 기록이 자동으로 저장됩니다
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredItems.map((item) => (
            <HistoryItemCard
              key={item.id}
              item={item}
              onDelete={() => removeItem(item.id)}
            />
          ))}
        </div>
      )}

      {/* Stats */}
      {items.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-slate-500 text-center">
              총 {items.length}개의 계산 기록 (최근 50개까지 저장)
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default HistoryPage;
