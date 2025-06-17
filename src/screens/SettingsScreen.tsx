import React from 'react';
import {useNavigation, NavigationProp} from '@react-navigation/native';
import {View, Text, StyleSheet, ScrollView, Pressable} from 'react-native';
import {useTableStore} from '../store/useTableStore';
import {useSettingsStore} from '../store/useSettingsStore';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

type RootStackParamList = {
  設定: undefined;
  入力開始年月: undefined;
  入力項目の追加削除: undefined;
};

export default function SettingsScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
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
  const {startYearMonth} = useTableStore();
  const {amountFormat, setAmountFormat} = useSettingsStore();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.menuList}>
        <Pressable
          style={styles.menuItem}
          onPress={() => navigation.navigate('入力開始年月')}>
          <MaterialCommunityIcons
            name="calendar-week"
            size={22}
            color="#444"
            style={styles.menuIcon}
          />
          <Text style={styles.menuLabel}>入力開始年月</Text>
          <Text style={styles.menuRightLabel}>
            {(() => {
              const ym = startYearMonth;
              const year = ym.slice(0, 4);
              const month = String(Number(ym.slice(4)));
              return `${year}年${month}月`;
            })()}
          </Text>
          <MaterialCommunityIcons
            name="chevron-right"
            size={22}
            color="#888"
            style={styles.menuRightIcon}
          />
        </Pressable>
        <Pressable
          style={styles.menuItem}
          onPress={() => navigation.navigate('入力項目の追加削除')}>
          <MaterialCommunityIcons
            name="border-color"
            size={22}
            color="#444"
            style={styles.menuIcon}
          />
          <Text style={styles.menuLabel}>入力項目の追加・削除</Text>
          <MaterialCommunityIcons
            name="chevron-right"
            size={22}
            color="#888"
            style={styles.menuRightIcon}
          />
        </Pressable>
        <View style={styles.amountRow}>
          <MaterialCommunityIcons
            name="currency-cny"
            size={22}
            color="#444"
            style={styles.menuIcon}
          />
          <Text style={styles.amountLabel}>金額の表示形式</Text>
          <View style={styles.segmentContainer}>
            <Pressable
              style={[
                styles.segmentButton,
                amountFormat === 'man' && styles.segmentButtonActive,
              ]}
              onPress={() => setAmountFormat('man')}>
              <Text
                style={[
                  styles.segmentText,
                  amountFormat === 'man' && styles.segmentTextActive,
                ]}>
                万
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.segmentButton,
                amountFormat === 'comma' && styles.segmentButtonActive,
              ]}
              onPress={() => setAmountFormat('comma')}>
              <Text
                style={[
                  styles.segmentText,
                  amountFormat === 'comma' && styles.segmentTextActive,
                ]}>
                カンマ区切り
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {padding: 16, backgroundColor: '#fff', flex: 1},
  menuList: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 0,
    marginBottom: 16,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#eee',
    backgroundColor: '#fff',
  },
  menuIcon: {
    width: 28,
    alignItems: 'center',
    marginRight: 12,
  },
  menuLabel: {
    fontSize: 16,
    color: '#222',
    flex: 1,
  },
  menuRightLabel: {
    fontSize: 12,
    color: '#888',
    marginRight: 4,
    alignSelf: 'center',
  },
  menuRightIcon: {
    marginLeft: 8,
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
    fontSize: 12,
    color: '#888',
  },
  segmentTextActive: {
    color: '#222',
    fontWeight: 'bold',
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  amountLabel: {
    fontSize: 16,
    color: '#222',
    marginRight: 16,
    minWidth: 120,
  },
});
