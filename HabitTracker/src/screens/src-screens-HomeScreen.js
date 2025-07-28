import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useHabits } from '../context/HabitContext';
import HabitCard from '../components/HabitCard';
import FilterModal from '../components/FilterModal';
import { format } from 'date-fns';

const HomeScreen = ({ navigation }) => {
  const { habits, loading, getTodayHabits, getHabitsByFilter } = useHabits();
  const [filter, setFilter] = useState('all');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filteredHabits, setFilteredHabits] = useState([]);

  useEffect(() => {
    updateFilteredHabits();
  }, [habits, filter]);

  const updateFilteredHabits = () => {
    let habitsToShow;
    switch (filter) {
      case 'completed':
        habitsToShow = getHabitsByFilter('completed');
        break;
      case 'pending':
        habitsToShow = getHabitsByFilter('pending');
        break;
      default:
        habitsToShow = getTodayHabits();
    }
    setFilteredHabits(habitsToShow);
  };

  const handleAddHabit = () => {
    navigation.navigate('AddHabit');
  };

  const handleHabitPress = (habit) => {
    navigation.navigate('HabitDetail', { habit });
  };

  const getFilterIcon = () => {
    switch (filter) {
      case 'completed':
        return 'checkmark-circle';
      case 'pending':
        return 'time';
      default:
        return 'list';
    }
  };

  const getFilterText = () => {
    switch (filter) {
      case 'completed':
        return 'Completed';
      case 'pending':
        return 'Pending';
      default:
        return 'All';
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366f1" />
        <Text style={styles.loadingText}>Loading habits...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Today's Habits</Text>
          <Text style={styles.subtitle}>
            {format(new Date(), 'EEEE, MMMM d, yyyy')}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilterModal(true)}
        >
          <Ionicons name={getFilterIcon()} size={24} color="#6366f1" />
        </TouchableOpacity>
      </View>

      {/* Filter Display */}
      <View style={styles.filterDisplay}>
        <Text style={styles.filterText}>Showing: {getFilterText()}</Text>
        <Text style={styles.habitCount}>
          {filteredHabits.length} habit{filteredHabits.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {/* Habits List */}
      {filteredHabits.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="leaf-outline" size={64} color="#ccc" />
          <Text style={styles.emptyTitle}>
            {filter === 'all' ? 'No habits yet' : `No ${filter} habits`}
          </Text>
          <Text style={styles.emptySubtitle}>
            {filter === 'all'
              ? 'Create your first habit to get started!'
              : `You don't have any ${filter} habits for today.`}
          </Text>
          {filter === 'all' && (
            <TouchableOpacity style={styles.addButton} onPress={handleAddHabit}>
              <Text style={styles.addButtonText}>Add Your First Habit</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <FlatList
          data={filteredHabits}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <HabitCard
              habit={item}
              onPress={() => handleHabitPress(item)}
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      )}

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={handleAddHabit}>
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>

      {/* Filter Modal */}
      <FilterModal
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        currentFilter={filter}
        onFilterChange={setFilter}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#64748b',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    marginTop: 4,
  },
  filterButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
  },
  filterDisplay: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  filterText: {
    fontSize: 14,
    color: '#64748b',
  },
  habitCount: {
    fontSize: 14,
    color: '#6366f1',
    fontWeight: '600',
  },
  listContainer: {
    padding: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#64748b',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#94a3b8',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 24,
  },
  addButton: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 24,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});

export default HomeScreen;