import React, {useState, useEffect, useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  ScrollView,
  TextInput,
  Pressable,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {Row, useTableStore} from '../store/useTableStore';
import {useSettingsStore} from '../store/useSettingsStore';
import {COLUMN_LABELS} from '../components/TableView';

export default function FieldCustomizeSection() {
  // 2020年1月〜2034年12月の年月リストを生成
  const yearMonthList = [];
  for (let year = 1950; year <= 2150; year++) {
    for (let month = 1; month <= 12; month++) {
      yearMonthList.push({
        value: `${year}${month.toString().padStart(2, '0')}`,
        label: `${year}年${month}月`,
      });
    }
  }
  const disabledKeys = [
    'yearMonth',
    'openingNetAssets',
    'closingNetAssets',
    'closingAssets',
    'closingLiabilities',
  ] as (keyof Row)[];

  const {startYearMonth, setStartYearMonth, data, updateCell} = useTableStore();
  const [selectedYm, setSelectedYm] = useState(startYearMonth);
  const startRow = data.find(row => row.yearMonth === startYearMonth);

  const columnKeys = useMemo(
    () => Object.keys(COLUMN_LABELS) as (keyof Row)[],
    [],
  );
  const {amountFormat, headerToggles, setHeaderToggles} = useSettingsStore();

  const [inputValues, setInputValues] = useState<{[key in keyof Row]?: string}>(
    {},
  );
  const formatValue = (value: string | undefined) => {
    const num = Number(value);
    if (isNaN(num) || value === undefined || value === '') {
      return '';
    }
    if (amountFormat === 'man') {
      if (num >= 100000000) {
        // 1億以上
        const oku = Math.floor(num / 100000000);
        const man = Math.floor((num % 100000000) / 10000);
        if (man === 0) {
          return `${oku}億`;
        }
        return `${oku}億${man}万`;
      } else if (num >= 10000) {
        // 1万以上
        return `${Math.floor(num / 10000)}万`;
      } else {
        // 1万未満
        return `${num}`;
      }
    } else if (amountFormat === 'comma') {
      return num.toLocaleString();
    }
    return value ?? '';
  };
  // 編集中のセルを管理するstate
  const [editingKey, setEditingKey] = useState<keyof Row | null>(null);

  useEffect(() => {
    if (startRow) {
      const initial: {[key in keyof Row]?: string} = {};
      columnKeys.forEach(key => {
        initial[key] = startRow[key] !== undefined ? String(startRow[key]) : '';
      });
      setInputValues(initial);
    }
  }, [startRow, columnKeys]);

  // 入力変更ハンドラ
  const handleInputChange = (key: keyof Row, text: string) => {
    setInputValues(prev => ({...prev, [key]: text}));
    // 入力開始年月の行の該当セルをstoreに反映
    const targetRow = data.find(row => row.yearMonth === startYearMonth);
    if (targetRow) {
      updateCell(targetRow.id, key, text);
    }
  };

  const handleToggle = (idx: number) => {
    const newToggles = headerToggles.map((v, i) => (i === idx ? !v : v));
    setHeaderToggles(newToggles);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.row}>
        <View style={[styles.labelContainer, styles.labelContainerH110]}>
          <Text style={styles.label}>入力開始年月</Text>
        </View>
        <Picker
          selectedValue={selectedYm}
          onValueChange={ym => {
            setSelectedYm(ym);
            setStartYearMonth(ym);
          }}
          style={styles.picker}
          itemStyle={styles.pickerItem}>
          {yearMonthList.map(ym => (
            <Picker.Item key={ym.value} label={ym.label} value={ym.value} />
          ))}
        </Picker>
      </View>
      <View style={[styles.paddingTop24]}>
        <View style={[styles.row, styles.toggleTitleRow]}>
          <Text style={[styles.toggleTitleItem, styles.toggleLabel]}>項目</Text>
          <Text style={[styles.toggleTitleItem]}>初期設定値</Text>
          <Text style={[styles.toggleTitleItem, styles.toggleTitletoggle]}>
            表示/非表示
          </Text>
        </View>
        {columnKeys.map((key, idx) => {
          const isLabel = disabledKeys.includes(key);
          return (
            <View key={key} style={[styles.row, styles.toggleRow]}>
              <Text style={styles.toggleLabel}>{COLUMN_LABELS[key]}</Text>
              {key === 'yearMonth' ? (
                // 年月列はラベル表示
                <Text style={[styles.toggleInput, styles.toggleInputLabel]}>
                  {(() => {
                    const ym = String(inputValues[key]);
                    const year = ym.slice(0, 4);
                    const month = String(Number(ym.slice(4)));
                    return `${year}年${month}月`;
                  })()}
                </Text>
              ) : isLabel ? (
                // 自動計算の列はラベル表示
                <Text style={[styles.toggleInput, styles.toggleInputLabel]}>
                  {formatValue(inputValues[key]) ?? ''}
                </Text>
              ) : editingKey === key ? (
                // 編集中は通常のTextInput
                <TextInput
                  style={styles.toggleInput}
                  value={inputValues[key] ?? ''}
                  onChangeText={text => handleInputChange(key, text)}
                  onBlur={() => setEditingKey(null)}
                  autoFocus
                  keyboardType="numeric"
                />
              ) : (
                // 通常時はフォーマット表示、タップで編集モード
                <Pressable
                  onPress={() => setEditingKey(key)}
                  style={styles.toggleInput}>
                  <Text style={styles.toggleInputText}>
                    {formatValue(inputValues[key])}
                  </Text>
                </Pressable>
              )}
              {key === 'yearMonth' ? (
                <Switch
                  value={headerToggles[idx]}
                  onValueChange={() => handleToggle(idx)}
                  disabled
                />
              ) : (
                <Switch
                  value={headerToggles[idx]}
                  onValueChange={() => handleToggle(idx)}
                />
              )}
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {padding: 16},
  row: {flexDirection: 'row', alignItems: 'center'},
  labelContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#b0c4de',
    width: 100,
  },
  labelContainerH30: {
    height: 30,
  },
  labelContainerH110: {
    height: 110,
  },
  labelContainerW120: {
    width: 120,
  },
  label: {
    fontSize: 16,
    textAlign: 'center',
  },
  picker: {
    backgroundColor: '#f0f0f0',
    flex: 1,
    height: 110,
    borderWidth: 1,
    borderColor: '#b0c4de',
    borderRadius: 0,
  },
  pickerItem: {height: 110, fontSize: 16},
  paddingTop24: {paddingTop: 24},
  toggleTitleRow: {
    backgroundColor: '#b0c4de',
  },
  toggleTitleItem: {
    padding: 8,
    margin: 1,
    fontSize: 16,
    textAlign: 'center',
  },
  toggleTitletoggle: {fontSize: 12},
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  toggleLabel: {
    flex: 1,
    fontSize: 16,
    textAlign: 'left',
  },
  toggleInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#888',
    borderRadius: 4,
    padding: 8,
    fontSize: 16,
    backgroundColor: '#fff',
    marginRight: 16,
    textAlign: 'right',
  },
  toggleInputLabel: {
    backgroundColor: '#f5f5f5',
    color: '#000000',
    borderWidth: 0,
  },
  toggleInputText: {
    textAlign: 'right',
  },
  segmentContainer: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    padding: 2,
    marginLeft: 16,
    alignItems: 'center',
    height: 36,
  },
  segmentButton: {
    paddingHorizontal: 18,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f5f5f5',
    marginHorizontal: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  segmentButtonActive: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 2,
  },
  segmentText: {
    fontSize: 16,
    color: '#888',
  },
  segmentTextActive: {
    color: '#222',
    fontWeight: 'bold',
  },
});
