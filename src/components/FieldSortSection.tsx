import React, {useMemo, useCallback} from 'react';
import {Text, StyleSheet, Pressable} from 'react-native';
import DraggableFlatList, {
  RenderItemParams,
} from 'react-native-draggable-flatlist';
import {Row, useTableStore} from '../store/useTableStore';
import {COLUMN_LABELS} from '../components/TableView';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

type Item = {
  key: keyof Row;
  label: string;
};

export default function FieldSortSection() {
  const columnOrder = useTableStore(state => state.columnOrder);
  const setColumnOrder = useTableStore(state => state.setColumnOrder);

  const data = useMemo<Item[]>(
    () => columnOrder.map(key => ({key, label: COLUMN_LABELS[key]})),
    [columnOrder],
  );

  const handleDragEnd = useCallback(
    ({data}: {data: Item[]}) => {
      setColumnOrder(data.map(item => item.key));
    },
    [setColumnOrder],
  );

  const renderItem = ({item, drag, isActive}: RenderItemParams<Item>) => (
    <Pressable
      style={[
        styles.row,
        styles.menuItem,
        isActive && {backgroundColor: '#e0e0e0'},
      ]}
      onLongPress={drag}>
      <Text style={styles.label}>{item.label}</Text>
      <MaterialCommunityIcons
        name="menu"
        size={22}
        color="#888"
        style={styles.menuRightIcon}
      />
    </Pressable>
  );

  return (
    <DraggableFlatList
      data={data}
      onDragEnd={handleDragEnd}
      keyExtractor={item => String(item.key)}
      renderItem={renderItem}
    />
  );
}

const styles = StyleSheet.create({
  container: {padding: 16, backgroundColor: '#fff'},
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#eee',
    backgroundColor: '#fff',
  },
  label: {
    flex: 1,
    fontSize: 16,
    color: '#222',
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
  menuRightIcon: {
    marginLeft: 8,
  },
});
