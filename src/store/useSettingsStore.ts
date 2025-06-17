import {create} from 'zustand';
import {Row} from '../store/useTableStore';
import {COLUMN_LABELS} from '../components/TableView';

type SettingsStore = {
  amountFormat: string;
  headerToggles: boolean[];
  setAmountFormat: (amountFormat: string) => void;
  setHeaderToggles: (toggles: boolean[]) => void;
};

const columnKeys = Object.keys(COLUMN_LABELS) as (keyof Row)[];

export const useSettingsStore = create<SettingsStore>(set => ({
  amountFormat: 'comma',
  headerToggles: Array(columnKeys.length).fill(true),
  setAmountFormat: amountFormat => set({amountFormat}),
  setHeaderToggles: toggles => set({headerToggles: toggles}),
}));
