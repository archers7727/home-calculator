import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CostCalculation, LoanResult, SaleCalculation } from '../types';

export type CalculationType = 'first-buy' | 'trade-up' | 'acquisition-tax' | 'capital-gains-tax' | 'brokerage-fee' | 'loan';

interface FirstBuyHistoryItem {
  type: 'first-buy';
  id: string;
  timestamp: number;
  data: {
    propertyPrice: number;
    region: string;
    district: string;
    totalCost: number;
    loanAmount: number;
    monthlyPayment: number;
  };
}

interface TradeUpHistoryItem {
  type: 'trade-up';
  id: string;
  timestamp: number;
  data: {
    currentPropertyValue: number;
    newPropertyPrice: number;
    netProceeds: number;
    additionalFundsNeeded: number;
    loanAmount: number;
  };
}

interface AcquisitionTaxHistoryItem {
  type: 'acquisition-tax';
  id: string;
  timestamp: number;
  data: {
    propertyPrice: number;
    houseCount: number;
    totalTax: number;
    effectiveRate: number;
  };
}

interface CapitalGainsTaxHistoryItem {
  type: 'capital-gains-tax';
  id: string;
  timestamp: number;
  data: {
    salePrice: number;
    purchasePrice: number;
    capitalGain: number;
    tax: number;
    isTaxExempt: boolean;
  };
}

interface BrokerageFeeHistoryItem {
  type: 'brokerage-fee';
  id: string;
  timestamp: number;
  data: {
    transactionPrice: number;
    fee: number;
    rate: number;
  };
}

interface LoanHistoryItem {
  type: 'loan';
  id: string;
  timestamp: number;
  data: {
    propertyPrice: number;
    eligibleLoans: string[];
    totalLoanAmount: number;
    monthlyPayment: number;
  };
}

export type HistoryItem =
  | FirstBuyHistoryItem
  | TradeUpHistoryItem
  | AcquisitionTaxHistoryItem
  | CapitalGainsTaxHistoryItem
  | BrokerageFeeHistoryItem
  | LoanHistoryItem;

interface HistoryState {
  items: HistoryItem[];
  addItem: (item: Omit<HistoryItem, 'id' | 'timestamp'>) => void;
  removeItem: (id: string) => void;
  clearHistory: () => void;
  getItemsByType: (type: CalculationType) => HistoryItem[];
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const newItem = {
          ...item,
          id: crypto.randomUUID(),
          timestamp: Date.now(),
        } as HistoryItem;

        set((state) => ({
          items: [newItem, ...state.items].slice(0, 50), // Keep only last 50 items
        }));
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },

      clearHistory: () => {
        set({ items: [] });
      },

      getItemsByType: (type) => {
        return get().items.filter((item) => item.type === type);
      },
    }),
    {
      name: 'home-calculator-history',
    }
  )
);

// Helper function to get type label in Korean
export function getTypeLabel(type: CalculationType): string {
  const labels: Record<CalculationType, string> = {
    'first-buy': '처음 집 사기',
    'trade-up': '집 갈아타기',
    'acquisition-tax': '취득세 계산',
    'capital-gains-tax': '양도소득세 계산',
    'brokerage-fee': '중개수수료 계산',
    'loan': '대출 계산',
  };
  return labels[type];
}

// Helper function to format timestamp
export function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
