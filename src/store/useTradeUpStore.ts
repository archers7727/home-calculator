import { create } from 'zustand';
import { HousingInfo, BuyerInfo, PropertyForSale, SaleCalculation, CostCalculation, LoanResult, CalculatorStep } from '../types';

interface TradeUpState {
  // Step management
  currentStep: CalculatorStep;
  setCurrentStep: (step: CalculatorStep) => void;
  nextStep: () => void;
  prevStep: () => void;

  // Current property (to sell)
  currentProperty: Partial<PropertyForSale>;
  setCurrentProperty: (property: Partial<PropertyForSale>) => void;
  updateCurrentProperty: (updates: Partial<PropertyForSale>) => void;

  // Sale calculation result
  saleResult: SaleCalculation | null;
  setSaleResult: (result: SaleCalculation | null) => void;

  // New property (to buy)
  newProperty: Partial<HousingInfo>;
  setNewProperty: (property: Partial<HousingInfo>) => void;
  updateNewProperty: (updates: Partial<HousingInfo>) => void;

  // Buyer info
  buyer: Partial<BuyerInfo>;
  setBuyer: (buyer: Partial<BuyerInfo>) => void;
  updateBuyer: (updates: Partial<BuyerInfo>) => void;

  // Purchase cost result
  purchaseCost: CostCalculation | null;
  setPurchaseCost: (cost: CostCalculation | null) => void;

  // Loans
  loans: LoanResult[];
  setLoans: (loans: LoanResult[]) => void;

  // Temporary 2-house status
  isTemporary2House: boolean;
  setIsTemporary2House: (value: boolean) => void;

  // Reset
  reset: () => void;
}

const initialCurrentProperty: Partial<PropertyForSale> = {
  purchasePrice: 400_000_000,
  purchaseDate: new Date(2021, 2, 15), // 2021년 3월
  currentValue: 600_000_000,
  area: 59,
  region: '서울특별시',
  district: '마포구',
  residenceYears: 4,
  residenceMonths: 10,
  isSingleHousehold: true,
};

const initialNewProperty: Partial<HousingInfo> = {
  price: 1_000_000_000,
  area: 84,
  region: '서울특별시',
  district: '서초구',
  isAdjustmentArea: true,
  type: 'apartment',
};

const initialBuyer: Partial<BuyerInfo> = {
  houseCount: 1, // 갈아타기는 1주택자
  isFirstTime: false,
  isNewlywed: false,
  childCount: 0,
  hasBabyPlan: false,
  income: 50_000_000,
  spouseIncome: 40_000_000,
};

export const useTradeUpStore = create<TradeUpState>((set) => ({
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

  currentProperty: initialCurrentProperty,
  setCurrentProperty: (property) => set({ currentProperty: property }),
  updateCurrentProperty: (updates) =>
    set((state) => ({
      currentProperty: { ...state.currentProperty, ...updates },
    })),

  saleResult: null,
  setSaleResult: (result) => set({ saleResult: result }),

  newProperty: initialNewProperty,
  setNewProperty: (property) => set({ newProperty: property }),
  updateNewProperty: (updates) =>
    set((state) => ({
      newProperty: { ...state.newProperty, ...updates },
    })),

  buyer: initialBuyer,
  setBuyer: (buyer) => set({ buyer }),
  updateBuyer: (updates) =>
    set((state) => ({ buyer: { ...state.buyer, ...updates } })),

  purchaseCost: null,
  setPurchaseCost: (cost) => set({ purchaseCost: cost }),

  loans: [],
  setLoans: (loans) => set({ loans }),

  isTemporary2House: true,
  setIsTemporary2House: (value) => set({ isTemporary2House: value }),

  reset: () =>
    set({
      currentStep: 1,
      currentProperty: initialCurrentProperty,
      saleResult: null,
      newProperty: initialNewProperty,
      buyer: initialBuyer,
      purchaseCost: null,
      loans: [],
      isTemporary2House: true,
    }),
}));
