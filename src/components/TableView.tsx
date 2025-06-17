import React, {useCallback, useState} from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  Alert,
} from 'react-native';
import {useTableStore, Row} from '../store/useTableStore';
import {useSettingsStore} from '../store/useSettingsStore';

// テーブルヘッダー行ラベル
export const COLUMN_LABELS: Record<string, string> = {
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

const HEADER_COLORS: Record<string, string> = {
  yearMonth: '#bbe2f1',
  openingNetAssets: '#b6e2b6',
  openingAssets: '#b6e2b6',
  openingLiabilities: '#ffb3b3',
  income: '#d6f5d6',
  expense: '#ffe5e5',
  investment: '#b3d1ff',
  disposal: '#b3d1ff',
  borrowedAmount: '#ffd9b3',
  repayment: '#ffd9b3',
  closingNetAssets: '#b6e2b6',
  closingAssets: '#b6e2b6',
  closingLiabilities: '#ffb3b3',
};

export default function TableView() {
  const {
    data,
    visibleColumns: allColumns,
    updateCell,
    visibleCount,
    visibleStartIndex,
    startYearMonth,
  } = useTableStore();
  const {amountFormat, headerToggles} = useSettingsStore();
  const [editingCell, setEditingCell] = useState<{
    id: string;
    key: string;
  } | null>(null);

  const visibleColumns =
    headerToggles && headerToggles.length === allColumns.length
      ? allColumns.filter((_, idx) => headerToggles[idx])
      : allColumns;
  const flatListData = data.slice(
    visibleStartIndex,
    visibleStartIndex + visibleCount,
  );
  const formatValue = useCallback(
    (value: string | undefined) => {
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
    },
    [amountFormat],
  );

  return (
    <ScrollView horizontal style={styles.container}>
      <View>
        {/* ヘッダー */}
        <View style={styles.row}>
          {visibleColumns.map((key, colIdx) => (
            <Text
              key={key}
              style={[
                styles.header,
                colIdx === visibleColumns.length - 1 && styles.rightmostCell,
                HEADER_COLORS[key] && {backgroundColor: HEADER_COLORS[key]},
              ]}>
              {COLUMN_LABELS[key] ?? key}
            </Text>
          ))}
        </View>
        {/* データ行（FlatListで描画） */}
        <FlatList
          data={flatListData}
          keyExtractor={item => item.id}
          renderItem={({item, index}) => {
            const prevItem = index > 0 ? flatListData[index - 1] : undefined;
            return (
              // データ行
              <View key={item.id} style={styles.row}>
                {visibleColumns.map((key, colIdx) => {
                  const isEditing =
                    editingCell?.id === item.id && editingCell?.key === key;
                  if (key === 'yearMonth') {
                    return (
                      // 年月列
                      <Text
                        key={key}
                        style={[
                          styles.cell,
                          styles.yearMonthCell,
                          colIdx === visibleColumns.length - 1 &&
                            styles.rightmostCell,
                        ]}>
                        {(() => {
                          const ym = String((item as Row)[key]);
                          const year = ym.slice(0, 4);
                          const month = String(Number(ym.slice(4)));
                          return `${year}年${month}月`;
                        })()}
                      </Text>
                    );
                  } else if (key === 'openingAssets') {
                    return (
                      // 資産(月初)列
                      item.yearMonth === startYearMonth ? (
                        // 1行目は入力可能
                        isEditing ? (
                          <TextInput
                            key={key}
                            value={String((item as Row)[key] ?? '')}
                            onChangeText={text =>
                              updateCell(item.id, key, Number(text))
                            }
                            onBlur={() => setEditingCell(null)}
                            autoFocus
                            style={[
                              styles.cell,
                              colIdx === visibleColumns.length - 1 &&
                                styles.rightmostCell,
                            ]}
                            keyboardType="numeric"
                          />
                        ) : (
                          <Text
                            key={key}
                            style={[
                              styles.cell,
                              colIdx === visibleColumns.length - 1 &&
                                styles.rightmostCell,
                            ]}
                            onPress={() => setEditingCell({id: item.id, key})}>
                            {formatValue(String((item as Row)[key]) ?? '')}
                          </Text>
                        )
                      ) : (
                        // 2行目以降は前行の資産(月末)を表示
                        <Text
                          key={key}
                          style={[
                            styles.cell,
                            styles.labelCell,
                            colIdx === visibleColumns.length - 1 &&
                              styles.rightmostCell,
                          ]}>
                          {prevItem
                            ? formatValue(
                                String((prevItem as Row).closingAssets) ?? '',
                              )
                            : ''}
                        </Text>
                      )
                    );
                  } else if (key === 'openingLiabilities') {
                    return (
                      // 負債(月初)列
                      item.yearMonth === startYearMonth ? (
                        // 1行目は入力可能
                        isEditing ? (
                          <TextInput
                            key={key}
                            value={String((item as Row)[key] ?? '')}
                            onChangeText={text =>
                              updateCell(item.id, key, Number(text))
                            }
                            onBlur={() => setEditingCell(null)}
                            autoFocus
                            style={[
                              styles.cell,
                              colIdx === visibleColumns.length - 1 &&
                                styles.rightmostCell,
                            ]}
                            keyboardType="numeric"
                          />
                        ) : (
                          <Text
                            key={key}
                            style={[
                              styles.cell,
                              colIdx === visibleColumns.length - 1 &&
                                styles.rightmostCell,
                            ]}
                            onPress={() => setEditingCell({id: item.id, key})}>
                            {formatValue(String((item as Row)[key]) ?? '')}
                          </Text>
                        )
                      ) : (
                        // 2行目以降は前行の負債(月末)を表示
                        <Text
                          key={key}
                          style={[
                            styles.cell,
                            styles.labelCell,
                            colIdx === visibleColumns.length - 1 &&
                              styles.rightmostCell,
                          ]}>
                          {prevItem
                            ? formatValue(
                                String((prevItem as Row).closingLiabilities) ??
                                  '',
                              )
                            : ''}
                        </Text>
                      )
                    );
                  } else if (
                    // その他の自動計算列
                    key === 'openingNetAssets' ||
                    key === 'closingAssets' ||
                    key === 'closingLiabilities' ||
                    key === 'closingNetAssets'
                  ) {
                    return (
                      // 自動計算の列（ラベル表示）
                      <Text
                        key={key}
                        style={[
                          styles.cell,
                          styles.labelCell,
                          colIdx === visibleColumns.length - 1 &&
                            styles.rightmostCell,
                        ]}>
                        {formatValue(String((item as Row)[key]) ?? '')}
                      </Text>
                    );
                  } else if (isEditing) {
                    return (
                      <TextInput
                        key={key}
                        value={String((item as Row)[key] ?? '')}
                        onChangeText={text =>
                          updateCell(item.id, key, Number(text))
                        }
                        onBlur={() => setEditingCell(null)}
                        autoFocus
                        style={[
                          styles.cell,
                          colIdx === visibleColumns.length - 1 &&
                            styles.rightmostCell,
                        ]}
                        keyboardType="numeric"
                      />
                    );
                  } else {
                    return (
                      <Text
                        key={key}
                        style={[
                          styles.cell,
                          colIdx === visibleColumns.length - 1 &&
                            styles.rightmostCell,
                        ]}
                        onLongPress={() =>
                          Alert.alert(
                            '確認',
                            '次月以降にも同じ金額を設定しますか？',
                            [
                              {text: 'いいえ', style: 'cancel'},
                              {
                                text: 'はい',
                                onPress: () => {
                                  const currentValue = (item as Row)[key];
                                  // 現在行のインデックスを取得
                                  const currentIndex = flatListData.findIndex(
                                    row => row.id === item.id,
                                  );
                                  // 次月以降の行に同じ値を設定
                                  for (
                                    let i = currentIndex + 1;
                                    i < flatListData.length;
                                    i++
                                  ) {
                                    updateCell(
                                      flatListData[i].id,
                                      key,
                                      currentValue,
                                    );
                                  }
                                },
                              },
                            ],
                          )
                        }
                        onPress={() => setEditingCell({id: item.id, key})}>
                        {formatValue(String((item as Row)[key]) ?? '')}
                      </Text>
                    );
                  }
                })}
              </View>
            );
          }}
          initialNumToRender={20}
          maxToRenderPerBatch={20}
          windowSize={21}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {backgroundColor: '#fff'},
  row: {flexDirection: 'row', marginBottom: 0},
  header: {
    width: 95,
    fontWeight: 'bold',
    padding: 4,
    textAlign: 'center',
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#888',
    backgroundColor: '#f5f5f5',
  },
  cell: {
    width: 95,
    padding: 4,
    textAlign: 'right',
    borderTopWidth: 0,
    borderLeftWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#888',
  },
  yearMonthCell: {
    backgroundColor: '#f0f0f0',
    textAlign: 'left',
  },
  labelCell: {
    backgroundColor: '#f0f0f0',
    textAlign: 'right',
  },
  rightmostCell: {
    borderRightWidth: 1,
    borderColor: '#888',
  },
  showMoreRow: {
    backgroundColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#888',
  },
  showMoreText: {textAlign: 'center', color: '#007AFF'},
});
