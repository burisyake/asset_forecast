import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {useTableStore} from '../store/useTableStore';

export default function SettingsScreen() {
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

  const {startYearMonth, setStartYearMonth} = useTableStore();
  const [selectedYm, setSelectedYm] = useState(startYearMonth);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>入力開始年月</Text>
      <Picker
        selectedValue={selectedYm}
        onValueChange={ym => {
          setSelectedYm(ym);
          setStartYearMonth(ym);
        }}
        style={styles.picker}>
        {yearMonthList.map(ym => (
          <Picker.Item key={ym.value} label={ym.label} value={ym.value} />
        ))}
      </Picker>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {padding: 16},
  label: {fontSize: 16, marginTop: 16, marginBottom: 4},
  picker: {backgroundColor: '#f0f0f0'},
  input: {
    borderWidth: 1,
    borderColor: '#888',
    borderRadius: 4,
    padding: 8,
    fontSize: 16,
    backgroundColor: '#fff',
  },
});
