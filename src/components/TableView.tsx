import React from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
} from 'react-native';
import {useTableStore, Row} from '../store/useTableStore';

// テーブルヘッダー行ラベル
const COLUMN_LABELS: Record<string, string> = {
  yearMonth: '年月',
  openingNetAssets: '純資産(月初)',
  openingAssets: '資産(月初)',
  openingLiabilities: '負債(月初)',
  expense: '費用',
  income: '収益',
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
  closingNetAssets: '#b6e2b6',
  closingAssets: '#b6e2b6',
  income: '#d6f5d6',
  openingLiabilities: '#ffb3b3',
  closingLiabilities: '#ffb3b3',
  expense: '#ffe5e5',
  investment: '#b3d1ff',
  disposal: '#b3d1ff',
  borrowedAmount: '#ffd9b3',
  repayment: '#ffd9b3',
};

export default function TableView() {
  const {
    data,
    visibleColumns,
    updateCell,
    visibleCount,
    visibleStartIndex,
    startYearMonth,
  } = useTableStore();
  const flatListData = data.slice(
    visibleStartIndex,
    visibleStartIndex + visibleCount,
  );

  return (
    <ScrollView horizontal>
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
                {visibleColumns.map((key, colIdx) =>
                  key === 'yearMonth' ? (
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
                  ) : key === 'openingAssets' ? (
                    // 資産(月初)列
                    item.yearMonth === startYearMonth ? (
                      // 1行目は入力可能
                      <TextInput
                        key={key}
                        value={String((item as Row)[key] ?? '')}
                        onChangeText={text =>
                          updateCell(item.id, key, Number(text))
                        }
                        style={[
                          styles.cell,
                          colIdx === visibleColumns.length - 1 &&
                            styles.rightmostCell,
                        ]}
                      />
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
                          ? String((prevItem as Row).closingAssets ?? '')
                          : ''}
                      </Text>
                    )
                  ) : key === 'openingLiabilities' ? (
                    // 負債(月初)列
                    item.yearMonth === startYearMonth ? (
                      // 1行目は入力可能
                      <TextInput
                        key={key}
                        value={String((item as Row)[key] ?? '')}
                        onChangeText={text =>
                          updateCell(item.id, key, Number(text))
                        }
                        style={[
                          styles.cell,
                          colIdx === visibleColumns.length - 1 &&
                            styles.rightmostCell,
                        ]}
                      />
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
                          ? String((prevItem as Row).closingLiabilities ?? '')
                          : ''}
                      </Text>
                    )
                  ) : // その他の自動計算列
                  key === 'openingNetAssets' ||
                    key === 'closingAssets' ||
                    key === 'closingLiabilities' ||
                    key === 'closingNetAssets' ? (
                    // 自動計算の列（ラベル表示）
                    <Text
                      key={key}
                      style={[
                        styles.cell,
                        styles.labelCell,
                        colIdx === visibleColumns.length - 1 &&
                          styles.rightmostCell,
                      ]}>
                      {String((item as Row)[key] ?? '')}
                    </Text>
                  ) : (
                    // その他の列（数値入力）
                    <TextInput
                      key={key}
                      value={String((item as Row)[key] ?? '')}
                      onChangeText={text =>
                        updateCell(item.id, key, Number(text))
                      }
                      style={[
                        styles.cell,
                        colIdx === visibleColumns.length - 1 &&
                          styles.rightmostCell,
                      ]}
                    />
                  ),
                )}
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
  row: {flexDirection: 'row', marginBottom: 0},
  header: {
    fontWeight: 'bold',
    width: 90,
    padding: 4,
    textAlign: 'center',
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#888',
    backgroundColor: '#f5f5f5',
  },
  cell: {
    width: 90,
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
