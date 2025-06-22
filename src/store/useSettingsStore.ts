import {create} from 'zustand';

export const initialLabels: {[key: string]: string} = {
  yearMonth: '年月',
  openingNetAssets: '純資産(月初)',
  openingAssets: '資産(月初)',
  openingLiabilities: '負債(月初)',
  income: '収入',
  expense: '支出',
  investment: '投資',
  disposal: '売却',
  borrowedAmount: '借入',
  repayment: '返済',
  closingNetAssets: '純資産(月末)',
  closingAssets: '資産(月末)',
  closingLiabilities: '負債(月末)',
};

type SettingsStore = {
  amountFormat: string;
  columnLabels: Record<string, string>;
  setAmountFormat: (amountFormat: string) => void;
  addColumnLabel: (key: string, label: string) => void;
  setColumnLabels: (labels: Record<string, string>) => void;
};

export const useSettingsStore = create<SettingsStore>(set => ({
  amountFormat: 'comma',
  columnLabels: initialLabels,
  setAmountFormat: amountFormat => set({amountFormat}),
  addColumnLabel: (key, label) =>
    set(state => ({
      columnLabels: {...state.columnLabels, [key]: label},
    })),
  setColumnLabels: labels => set({columnLabels: labels}),
}));
