import {create} from 'zustand';

type ForecastState = {
  value: number;
  setValue: (v: number) => void;
};

export const useForecastStore = create<ForecastState>(set => ({
  value: 0,
  setValue: v => set({value: v}),
}));
