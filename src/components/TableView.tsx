import React from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {useTableStore, Row} from '../store/useTableStore';

// テーブルヘッダー行ラベル
const COLUMN_LABELS: Record<string, string> = {
  yearMonth: '年月',
  openingNetAssets: '純資産(月初)',
  openingAssets: '資産(月初)',
  openingLiabilities: '負債(月初)',
  expense: '費用',
  income: '利益',
  investment: '投資',
  disposal: '売却',
  borrowedAmount: '借入',
  repayment: '返済',
  closingNetAssets: '純資産(月末)',
  closingAssets: '資産(月末)',
  closingLiabilities: '負債(月初)',
};

export default function TableView() {
  const {
    data,
    visibleColumns,
    updateCell,
    visibleCount,
    visibleStartIndex,
    showMore,
  } = useTableStore();
  // さらに表示ボタンを表示する条件
  const isShowShowMore = visibleStartIndex > 0;
  // FlatList用データ: さらに表示ボタン用のダミー行を先頭に追加
  const flatListData = isShowShowMore
    ? [
        {id: '__show_more__'},
        ...data.slice(visibleStartIndex, visibleStartIndex + visibleCount),
      ]
    : data.slice(visibleStartIndex, visibleStartIndex + visibleCount);

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
              ]}>
              {COLUMN_LABELS[key] ?? key}
            </Text>
          ))}
        </View>
        {/* データ行（FlatListで描画） */}
        <FlatList
          data={flatListData}
          keyExtractor={item => item.id}
          renderItem={({item}) =>
            item.id === '__show_more__' ? (
              <View style={styles.row}>
                <TouchableOpacity
                  style={[
                    styles.showMoreRow,
                    {width: 90 * visibleColumns.length},
                  ]}
                  onPress={showMore}
                  activeOpacity={0.7}>
                  <Text style={styles.showMoreText}>さらに表示</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View key={item.id} style={styles.row}>
                {visibleColumns.map((key, colIdx) =>
                  key === 'yearMonth' ? (
                    <Text
                      key={key}
                      style={[
                        styles.cell,
                        styles.labelCell,
                        colIdx === visibleColumns.length - 1 &&
                          styles.rightmostCell,
                      ]}>
                      {(item as Row)[key]}
                    </Text>
                  ) : (
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
            )
          }
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
  labelCell: {
    backgroundColor: '#f0f0f0',
    textAlign: 'center',
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
