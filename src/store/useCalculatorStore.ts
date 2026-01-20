import { create } from 'zustand';
import { HousingInfo, BuyerInfo, CostCalculation, LoanResult, CalculatorStep } from '../types';

interface CalculatorState {
  // Step management
  currentStep: CalculatorStep;
  setCurrentStep: (step: CalculatorStep) => void;
  nextStep: () => void;
  prevStep: () => void;

  // Housing info
  housing: Partial<HousingInfo>;
  setHousing: (housing: Partial<HousingInfo>) => void;
  updateHousing: (updates: Partial<HousingInfo>) => void;

  // Buyer info
  buyer: Partial<BuyerInfo>;
  setBuyer: (buyer: Partial<BuyerInfo>) => void;
  updateBuyer: (updates: Partial<BuyerInfo>) => void;

  // Results
  cost: CostCalculation | null;
  setCost: (cost: CostCalculation | null) => void;
  loans: LoanResult[];
  setLoans: (loans: LoanResult[]) => void;

  // Capital
  availableCapital: number;
  setAvailableCapital: (capital: number) => void;

  // Reset
  reset: () => void;
}

const initialHousing: Partial<HousingInfo> = {
  price: 800_000_000,
  area: 84,
  region: '서울특별시',
  district: '강남구',
  isAdjustmentArea: true,
  type: 'apartment',
};

const initialBuyer: Partial<BuyerInfo> = {
  houseCount: 0,
  isFirstTime: true,
  isNewlywed: false,
  childCount: 0,
  hasBabyPlan: false,
  income: 40_000_000,
  spouseIncome: 30_000_000,
};

export const useCalculatorStore = create<CalculatorState>((set) => ({
  currentStep: 1,
  setCurrentStep: (step) => set({ currentStep: step }),
  nextStep: () =>
    set((state) => ({
      currentStep: Math.min(4, state.currentStep + 1) as CalculatorStep,
    })),
  prevStep: () =>
    set((state) => ({
      currentStep: Math.max(1, state.currentStep - 1) as CalculatorStep,
    })),

  housing: initialHousing,
  setHousing: (housing) => set({ housing }),
  updateHousing: (updates) =>
    set((state) => ({ housing: { ...state.housing, ...updates } })),

  buyer: initialBuyer,
  setBuyer: (buyer) => set({ buyer }),
  updateBuyer: (updates) =>
    set((state) => ({ buyer: { ...state.buyer, ...updates } })),

  cost: null,
  setCost: (cost) => set({ cost }),
  loans: [],
  setLoans: (loans) => set({ loans }),

  availableCapital: 300_000_000,
  setAvailableCapital: (capital) => set({ availableCapital: capital }),

  reset: () =>
    set({
      currentStep: 1,
      housing: initialHousing,
      buyer: initialBuyer,
      cost: null,
      loans: [],
      availableCapital: 300_000_000,
    }),
}));
