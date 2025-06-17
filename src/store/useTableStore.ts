import {create} from 'zustand';

export type Row = {
  id: string;
  yearMonth: string; // 年月
  openingNetAssets: number; // 純資産(月初)
  openingAssets: number; // 資産(月初)
  openingLiabilities: number; // 負債(月初)
  income: number; // 収益
  expense: number; // 費用
  investment: number; // 投資
  disposal: number; // 売却
  borrowedAmount: number; // 借入
  repayment: number; // 返済
  closingNetAssets: number; // 純資産(月末)
  closingAssets: number; // 純資産(月末)
  closingLiabilities: number; // 負債(月末)
};
type ColumnKey = keyof Row;

// 1950年1月〜2150年12月のyearMonth配列を生成
const rows: Row[] = [];
for (let year = 1950; year <= 2150; year++) {
  for (let month = 1; month <= 12; month++) {
    const ym = `${year}${month.toString().padStart(2, '0')}`;
    rows.push({
      id: ym,
      yearMonth: ym,
      openingNetAssets: 0,
      openingAssets: 0,
      openingLiabilities: 0,
      income: 0,
      expense: 0,
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
  startYearMonth: string;
  setStartYearMonth: (ym: string) => void;
  updateCell: (id: string, key: ColumnKey, value: string | number) => void;
};

// 初期表示は2025年1月〜2055年12月（30年分=361ヶ月）だけ
const startYearMonth = '202501';
const startYearMonthIndex = rows.findIndex(
  row => row.yearMonth === startYearMonth,
);
const INITIAL_VISIBLE_COUNT = 360;
const INITIAL_VISIBLE_START_INDEX = startYearMonthIndex;

export const useTableStore = create<TableStore>(set => ({
  data: rows,
  visibleColumns: [
    'yearMonth',
    'openingNetAssets',
    'openingAssets',
    'openingLiabilities',
    'income',
    'expense',
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
  startYearMonth: startYearMonth,
  setStartYearMonth: (ym: string) =>
    set(state => {
      const idx = state.data.findIndex(row => row.yearMonth === ym);
      return {
        startYearMonth: ym,
        visibleStartIndex: idx !== -1 ? idx : state.visibleStartIndex,
      };
    }),
  updateCell: (id, key, value) =>
    set(state => {
      // 変更対象の行インデックス
      const idx = state.data.findIndex(row => row.id === id);
      if (idx === -1) {
        return {data: state.data};
      }

      // データをコピー
      const newData = [...state.data];
      // まず現在行を更新
      let updated = {...newData[idx], [key]: value};
      // 以降、連鎖的に翌月以降も再計算
      for (let i = idx; i < newData.length; i++) {
        if (i !== idx) {
          // 前月のclosingAssets/closingLiabilitiesを今月のopeningAssets/openingLiabilitiesにコピー
          updated = {...newData[i]};
          updated.openingAssets = newData[i - 1].closingAssets;
          updated.openingLiabilities = newData[i - 1].closingLiabilities;
        }
        // 純資産(月初) = 資産(月初) - 負債(月初)
        updated.openingNetAssets =
          Number(updated.openingAssets ?? 0) -
          Number(updated.openingLiabilities ?? 0);
        // 資産(月末) = 資産(月初) + (収益 - 費用) + (借入 - 返済)
        updated.closingAssets =
          Number(updated.openingAssets ?? 0) +
          (Number(updated.income ?? 0) - Number(updated.expense ?? 0)) +
          (Number(updated.borrowedAmount ?? 0) -
            Number(updated.repayment ?? 0));
        // 負債(月末) = 負債(月初) + 借入 - 売却
        updated.closingLiabilities =
          Number(updated.openingLiabilities ?? 0) +
          Number(updated.borrowedAmount ?? 0) -
          Number(updated.repayment ?? 0);
        // 純資産(月末) = 資産(月末) - 負債(月末)
        updated.closingNetAssets =
          Number(updated.closingAssets ?? 0) -
          Number(updated.closingLiabilities ?? 0);
        newData[i] = updated;
      }
      return {data: newData};
    }),
}));
