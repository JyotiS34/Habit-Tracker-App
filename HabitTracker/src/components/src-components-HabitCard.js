import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useHabits } from '../context/HabitContext';

const HabitCard = ({ habit, onPress }) => {
  const { toggleHabitCompletion, deleteHabit } = useHabits();
  const [isCompleting, setIsCompleting] = useState(false);

  const handleToggleCompletion = async () => {
    setIsCompleting(true);
    try {
      await toggleHabitCompletion(habit.id);
    } catch (error) {
      console.error('Error toggling habit completion:', error);
    } finally {
      setIsCompleting(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Habit',
      `Are you sure you want to delete "${habit.name}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteHabit(habit.id),
        },
      ]
    );
  };

  const getHabitIcon = (category) => {
    switch (category) {
      case 'health':
        return 'fitness';
      case 'productivity':
        return 'briefcase';
      case 'learning':
        return 'school';
      case 'mindfulness':
        return 'leaf';
      case 'social':
        return 'people';
      default:
        return 'star';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'health':
        return '#ef4444';
      case 'productivity':
        return '#3b82f6';
      case 'learning':
        return '#8b5cf6';
      case 'mindfulness':
        return '#10b981';
      case 'social':
        return '#f59e0b';
      default:
        return '#6366f1';
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.content}>
        {/* Icon and Category */}
        <View style={styles.iconContainer}>
          <View
            style={[
              styles.iconBackground,
              { backgroundColor: getCategoryColor(habit.category) + '20' },
            ]}
          >
            <Ionicons
              name={getHabitIcon(habit.category)}
              size={24}
              color={getCategoryColor(habit.category)}
            />
          </View>
        </View>

        {/* Habit Info */}
        <View style={styles.habitInfo}>
          <Text style={styles.habitName}>{habit.name}</Text>
          <Text style={styles.habitDescription}>{habit.description}</Text>
          {habit.todayNote && (
            <Text style={styles.note} numberOfLines={1}>
              📝 {habit.todayNote}
            </Text>
          )}
        </View>

        {/* Completion Status */}
        <View style={styles.statusContainer}>
          <TouchableOpacity
            style={[
              styles.completionButton,
              habit.isCompletedToday && styles.completedButton,
            ]}
            onPress={handleToggleCompletion}
            disabled={isCompleting}
          >
            {habit.isCompletedToday ? (
              <Ionicons name="checkmark" size={20} color="white" />
            ) : (
              <Ionicons name="ellipse-outline" size={20} color="#94a3b8" />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton} onPress={onPress}>
          <Ionicons name="eye-outline" size={16} color="#64748b" />
          <Text style={styles.actionText}>Details</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={handleDelete}>
          <Ionicons name="trash-outline" size={16} color="#ef4444" />
          <Text style={[styles.actionText, { color: '#ef4444' }]}>Delete</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    marginRight: 12,
  },
  iconBackground: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  habitInfo: {
    flex: 1,
  },
  habitName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  habitDescription: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
  },
  note: {
    fontSize: 12
  note: {
    fontSize: 12,
    color: '#8b5cf6',
    fontStyle: 'italic',
  },
  statusContainer: {
    marginLeft: 12,
  },
  completionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  completedButton: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },
  actions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    paddingVertical: 4,
  },
  actionText: {
    fontSize: 12,
    color: '#64748b',
    marginLeft: 4,
  },
});

export default HabitCard;