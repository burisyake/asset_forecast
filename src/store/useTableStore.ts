import {create} from 'zustand';

export type Row = {
  id: string;
  yearMonth: string; // 年月
  openingNetAssets: number; // 純資産(月初)
  openingAssets: number; // 資産(月初)
  openingLiabilities: number; // 負債(月初)
  expense: number; // 費用
  income: number; // 利益
  investment: number; // 投資
  disposal: number; // 売却
  borrowedAmount: number; // 借入
  repayment: number; // 返済
  closingNetAssets: number; // 純資産(月末)
  closingAssets: number; // 純資産(月末)
  closingLiabilities: number; // 負債(月末)
};
type ColumnKey = keyof Row;

// 2023年1月〜2034年12月のyearMonth配列を生成
const rows: Row[] = [];
for (let year = 2020; year <= 2034; year++) {
  for (let month = 1; month <= 12; month++) {
    const ym = `${year}${month.toString().padStart(2, '0')}`;
    rows.push({
      id: ym,
      yearMonth: ym,
      openingNetAssets: 0,
      openingAssets: 0,
      openingLiabilities: 0,
      expense: 0,
      income: 0,
      investment: 0,
      disposal: 0,
      borrowedAmount: 0,
      repayment: 0,
      closingNetAssets: 0,
      closingAssets: 0,
      closingLiabilities: 0,
    });
  }
}

type TableStore = {
  data: Row[];
  visibleColumns: ColumnKey[];
  visibleCount: number;
  visibleStartIndex: number;
  showMore: () => void;
  updateCell: (id: string, key: ColumnKey, value: string | number) => void;
};

// 初期表示は2024年1月〜2034年12月（11年分=132ヶ月）だけ
const first2024Index = rows.findIndex(row => row.yearMonth === '202401');
const INITIAL_VISIBLE_COUNT = 132;
const INITIAL_VISIBLE_START_INDEX = first2024Index;

export const useTableStore = create<TableStore>(set => ({
  data: rows,
  visibleColumns: [
    'yearMonth',
    'openingNetAssets',
    'openingAssets',
    'openingLiabilities',
    'expense',
    'income',
    'investment',
    'disposal',
    'borrowedAmount',
    'repayment',
    'closingNetAssets',
    'closingAssets',
    'closingLiabilities',
  ],
  visibleCount: INITIAL_VISIBLE_COUNT,
  visibleStartIndex: INITIAL_VISIBLE_START_INDEX,
  showMore: () =>
    set(state => ({
      visibleStartIndex: Math.max(state.visibleStartIndex - 12, 0),
      visibleCount: state.visibleCount + 12,
    })),
  updateCell: (id, key, value) =>
    set(state => ({
      data: state.data.map(row =>
        row.id === id ? {...row, [key]: value} : row,
      ),
    })),
}));
