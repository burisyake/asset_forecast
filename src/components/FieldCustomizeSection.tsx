import React, {useMemo, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Pressable,
} from 'react-native';
import {Row, useTableStore} from '../store/useTableStore';
import {useSettingsStore} from '../store/useSettingsStore';

export default function FieldCustomizeSection() {
  const {visibleColumns, columnOrder, setVisibleColumns, setColumnOrder} =
    useTableStore();
  const {columnLabels, addColumnLabel} = useSettingsStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [newFieldName, setNewFieldName] = useState('');

  const columnKeys = useMemo(
    () => Object.keys(columnLabels) as (keyof Row)[],
    [columnLabels],
  );

  const handleToggle = (key: string) => {
    if (visibleColumns.includes(key)) {
      // 非表示にする
      setVisibleColumns(visibleColumns.filter(k => k !== key));
    } else {
      // 表示にする（columnOrderの順序を保つ）
      const newVisible = [...visibleColumns, key].sort(
        (a, b) => columnOrder.indexOf(a) - columnOrder.indexOf(b),
      );
      setVisibleColumns(newVisible);
    }
  };
  return (
    <ScrollView style={styles.container}>
      <View style={[styles.row, styles.toggleTitleRow]}>
        <View style={[{flexDirection: 'row', alignItems: 'center', flex: 1}]}>
          <Text style={[styles.toggleTitleItem]}>項目</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setModalVisible(true)}>
            <Text style={styles.addButtonText}>＋項目を追加</Text>
          </TouchableOpacity>
        </View>
        <Text style={[styles.toggleTitleItem, styles.toggleTitletoggle]}>
          表示/非表示
        </Text>
      </View>
      <View>
        {columnKeys.map(key => {
          return (
            <View key={key} style={[styles.row, styles.toggleRow]}>
              <Text style={styles.toggleLabel}>{columnLabels[key]}</Text>
              {key === 'yearMonth' ? (
                <Switch
                  value={visibleColumns.includes(key)}
                  onValueChange={() => handleToggle(key)}
                  disabled
                  trackColor={{false: '#ccc', true: '#5C821A'}}
                  thumbColor={visibleColumns.includes(key) ? '#fff' : '#f4f3f4'}
                />
              ) : (
                <Switch
                  value={visibleColumns.includes(String(key))}
                  onValueChange={() => handleToggle(String(key))}
                  trackColor={{false: '#ccc', true: '#5C821A'}}
                  thumbColor={
                    visibleColumns.includes(String(key)) ? '#fff' : '#f4f3f4'
                  }
                />
              )}
            </View>
          );
        })}
      </View>
      {/* 追加用モーダル */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={{fontSize: 16, marginBottom: 12}}>
              新しい項目名を入力
            </Text>
            <TextInput
              style={styles.input}
              placeholder="項目名"
              value={newFieldName}
              onChangeText={setNewFieldName}
            />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                marginTop: 16,
              }}>
              <Pressable
                style={[styles.modalButton, {backgroundColor: '#ccc'}]}
                onPress={() => {
                  setModalVisible(false);
                  setNewFieldName('');
                }}>
                <Text>キャンセル</Text>
              </Pressable>
              <Pressable
                style={[
                  styles.modalButton,
                  {backgroundColor: '#1995AD', marginLeft: 8},
                ]}
                onPress={() => {
                  const newKey = `custom_${Date.now()}`;
                  addColumnLabel(newKey, newFieldName.trim());
                  setColumnOrder([...columnOrder, newKey]);
                  setVisibleColumns([...visibleColumns, newKey]);
                  setModalVisible(false);
                  setNewFieldName('');
                }}>
                <Text style={{color: '#fff'}}>追加</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {padding: 16},
  row: {flexDirection: 'row', alignItems: 'center'},
  toggleTitleRow: {
    backgroundColor: '#BCBABE',
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
  addButton: {
    backgroundColor: '#1995AD',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginHorizontal: 8,
    alignSelf: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    width: 300,
    elevation: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#888',
    borderRadius: 4,
    padding: 8,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  modalButton: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 8,
  },
});
