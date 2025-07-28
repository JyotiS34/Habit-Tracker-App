import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const FilterModal = ({ visible, onClose, currentFilter, onFilterChange }) => {
  const filters = [
    { key: 'all', label: 'All Habits', icon: 'list' },
    { key: 'completed', label: 'Completed', icon: 'checkmark-circle' },
    { key: 'pending', label: 'Pending', icon: 'time' },
  ];

  const handleFilterSelect = (filterKey) => {
    onFilterChange(filterKey);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Filter Habits</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#64748b" />
            </TouchableOpacity>
          </View>

          <View style={styles.filterList}>
            {filters.map((filter) => (
              <TouchableOpacity
                key={filter.key}
                style={[
                  styles.filterOption,
                  currentFilter === filter.key && styles.selectedFilter,
                ]}
                onPress={() => handleFilterSelect(filter.key)}
              >
                <View style={styles.filterContent}>
                  <Ionicons
                    name={filter.icon}
                    size={20}
                    color={currentFilter === filter.key ? '#6366f1' : '#64748b'}
                  />
                  <Text
                    style={[
                      styles.filterLabel,
                      currentFilter === filter.key && styles.selectedFilterText,
                    ]}
                  >
                    {filter.label}
                  </Text>
                </View>
                {currentFilter === filter.key && (
                  <Ionicons name="checkmark" size={20} color="#6366f1" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
  },
  closeButton: {
    padding: 4,
  },
  filterList: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  filterOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedFilter: {
    backgroundColor: '#f1f5f9',
  },
  filterContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterLabel: {
    fontSize: 16,
    color: '#64748b',
    marginLeft: 12,
  },
  selectedFilterText: {
    color: '#6366f1',
    fontWeight: '600',
  },
});

export default FilterModal;