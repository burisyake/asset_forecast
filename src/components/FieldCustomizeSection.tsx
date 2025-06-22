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
import {useSettingsStore, initialLabels} from '../store/useSettingsStore';

export default function FieldCustomizeSection() {
  const {visibleColumns, columnOrder, setVisibleColumns, setColumnOrder} =
    useTableStore();
  const {columnLabels, addColumnLabel, setColumnLabels} = useSettingsStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [newFieldName, setNewFieldName] = useState('');
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editKey, setEditKey] = useState<string | null>(null);
  const [editFieldName, setEditFieldName] = useState('');

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

  // 項目名編集の保存
  const handleEditSave = () => {
    if (editKey && editFieldName.trim()) {
      setColumnLabels({
        ...columnLabels,
        [editKey]: editFieldName.trim(),
      });
      setEditModalVisible(false);
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
            <TouchableOpacity
              key={key}
              onPress={() => {
                setEditKey(String(key));
                setEditFieldName(columnLabels[key]);
                setEditModalVisible(true);
              }}
              activeOpacity={0.7}>
              <View key={key} style={[styles.row, styles.toggleRow]}>
                <Text style={styles.toggleLabel}>{columnLabels[key]}</Text>
                {key === 'yearMonth' ? (
                  <Switch
                    value={visibleColumns.includes(key)}
                    onValueChange={() => handleToggle(key)}
                    disabled
                    trackColor={{false: '#ccc', true: '#5C821A'}}
                    thumbColor={
                      visibleColumns.includes(key) ? '#fff' : '#f4f3f4'
                    }
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
            </TouchableOpacity>
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
            <Text style={{fontSize: 16, marginBottom: 12}}>項目を追加</Text>
            <View style={{marginBottom: 4}}>
              <Text style={styles.fieldLabel}>項目名</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="項目名"
              value={newFieldName}
              onChangeText={setNewFieldName}
            />
            <View style={styles.modalButtonRow}>
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
      {/* 編集用モーダル */}
      <Modal
        visible={editModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setEditModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.editModalHeader}>
              <Text style={{fontSize: 16, flex: 1}}>編集</Text>
              <Pressable
                style={[
                  styles.deleteButton,
                  editKey && initialLabels[editKey]
                    ? styles.deleteButtonDisabled
                    : styles.deleteButtonActive,
                ]}
                disabled={!!(editKey && initialLabels[editKey])}
                onPress={() => {
                  if (editKey && !initialLabels[editKey]) {
                    const {[editKey]: _, ...restLabels} = columnLabels;
                    setColumnLabels(restLabels);
                    setVisibleColumns(
                      visibleColumns.filter(k => k !== editKey),
                    );
                    setColumnOrder(columnOrder.filter(k => k !== editKey));
                    setEditModalVisible(false);
                  }
                }}>
                <Text style={{color: '#fff', fontSize: 13}}>削除</Text>
              </Pressable>
            </View>
            <View style={{marginBottom: 4}}>
              <Text style={styles.fieldLabel}>項目名</Text>
            </View>
            <TextInput
              style={styles.input}
              value={editFieldName}
              onChangeText={setEditFieldName}
              placeholder="項目名"
            />
            <View style={styles.modalButtonRow}>
              <Pressable
                style={[styles.modalButton, {backgroundColor: '#ccc'}]}
                onPress={() => setEditModalVisible(false)}>
                <Text>キャンセル</Text>
              </Pressable>
              <Pressable
                style={[
                  styles.modalButton,
                  {backgroundColor: '#1995AD', marginLeft: 8},
                ]}
                onPress={handleEditSave}>
                <Text style={{color: '#fff'}}>保存</Text>
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
  editModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  deleteButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  deleteButtonActive: {
    backgroundColor: '#ff6666',
    opacity: 1,
  },
  deleteButtonDisabled: {
    backgroundColor: '#ccc',
    opacity: 0.5,
  },
  fieldLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  modalButtonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
  },
});
