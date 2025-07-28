import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useHabits } from '../context/HabitContext';
import { format, parseISO } from 'date-fns';

const HabitDetailScreen = ({ route, navigation }) => {
  const { habit } = route.params;
  const { toggleHabitCompletion, addNote, updateHabit, deleteHabit } = useHabits();
  const [noteModalVisible, setNoteModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [noteText, setNoteText] = useState('');

  const today = format(new Date(), 'yyyy-MM-dd');
  const isCompletedToday = habit.completions[today]?.completed || false;
  const todayNote = habit.completions[today]?.note || '';

  const handleToggleCompletion = () => {
    toggleHabitCompletion(habit.id);
  };

  const handleAddNote = () => {
    if (noteText.trim()) {
      addNote(habit.id, selectedDate, noteText.trim());
      setNoteText('');
      setNoteModalVisible(false);
    }
  };

  const handleDeleteHabit = () => {
    Alert.alert(
      'Delete Habit',
      `Are you sure you want to delete "${habit.name}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteHabit(habit.id);
            navigation.goBack();
          },
        },
      ]
    );
  };

  const getCategoryIcon = (category) => {
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

  const getCompletionHistory = () => {
    const dates = Object.keys(habit.completions).sort().reverse();
    return dates.slice(0, 10); // Show last 10 completions
  };

  const getReminderText = () => {
    if (!habit.reminderTime) return 'No reminder set';
    return `Reminder at ${habit.reminderTime}`;
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: getCategoryColor(habit.category) + '20' },
            ]}
          >
            <Ionicons
              name={getCategoryIcon(habit.category)}
              size={32}
              color={getCategoryColor(habit.category)}
            />
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.habitName}>{habit.name}</Text>
            <Text style={styles.habitCategory}>{habit.category}</Text>
          </View>
        </View>
      </View>

      {/* Today's Status */}
      <View style={styles.todaySection}>
        <Text style={styles.sectionTitle}>Today's Progress</Text>
        <View style={styles.todayCard}>
          <View style={styles.todayStatus}>
            <TouchableOpacity
              style={[
                styles.completionButton,
                isCompletedToday && styles.completedButton,
              ]}
              onPress={handleToggleCompletion}
            >
              {isCompletedToday ? (
                <Ionicons nam
	      {isCompletedToday ? (
                <Ionicons name="checkmark" size={24} color="white" />
              ) : (
                <Ionicons name="ellipse-outline" size={24} color="#94a3b8" />
              )}
            </TouchableOpacity>
            <View style={styles.todayInfo}>
              <Text style={styles.todayLabel}>
                {isCompletedToday ? 'Completed' : 'Not completed yet'}
              </Text>
              <Text style={styles.todayTime}>
                {isCompletedToday
                  ? `Completed at ${format(parseISO(habit.completions[today].timestamp), 'HH:mm')}`
                  : 'Tap to mark as completed'}
              </Text>
            </View>
          </View>

          {/* Today's Note */}
          <View style={styles.noteSection}>
            <View style={styles.noteHeader}>
              <Text style={styles.noteTitle}>Today's Note</Text>
              <TouchableOpacity
                style={styles.addNoteButton}
                onPress={() => {
                  setSelectedDate(today);
                  setNoteText(todayNote);
                  setNoteModalVisible(true);
                }}
              >
                <Ionicons name="create-outline" size={16} color="#6366f1" />
                <Text style={styles.addNoteText}>
                  {todayNote ? 'Edit' : 'Add'} Note
                </Text>
              </TouchableOpacity>
            </View>
            {todayNote ? (
              <Text style={styles.noteText}>{todayNote}</Text>
            ) : (
              <Text style={styles.noNoteText}>No note added yet</Text>
            )}
          </View>
        </View>
      </View>

      {/* Habit Details */}
      <View style={styles.detailsSection}>
        <Text style={styles.sectionTitle}>Habit Details</Text>
        <View style={styles.detailsCard}>
          <View style={styles.detailItem}>
            <Ionicons name="document-text-outline" size={20} color="#64748b" />
            <Text style={styles.detailLabel}>Description</Text>
            <Text style={styles.detailValue}>{habit.description}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="time-outline" size={20} color="#64748b" />
            <Text style={styles.detailLabel}>Reminder</Text>
            <Text style={styles.detailValue}>{getReminderText()}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="calendar-outline" size={20} color="#64748b" />
            <Text style={styles.detailLabel}>Created</Text>
            <Text style={styles.detailValue}>
              {format(parseISO(habit.createdAt), 'MMM dd, yyyy')}
            </Text>
          </View>
        </View>
      </View>

      {/* Recent Completions */}
      <View style={styles.historySection}>
        <Text style={styles.sectionTitle}>Recent Completions</Text>
        <View style={styles.historyCard}>
          {getCompletionHistory().length > 0 ? (
            getCompletionHistory().map((date) => {
              const completion = habit.completions[date];
              return (
                <View key={date} style={styles.historyItem}>
                  <View style={styles.historyDate}>
                    <Text style={styles.historyDateText}>
                      {format(parseISO(date), 'MMM dd')}
                    </Text>
                    <Text style={styles.historyYearText}>
                      {format(parseISO(date), 'yyyy')}
                    </Text>
                  </View>
                  <View style={styles.historyContent}>
                    <View style={styles.historyStatus}>
                      <Ionicons
                        name="checkmark-circle"
                        size={16}
                        color="#10b981"
                      />
                      <Text style={styles.historyTime}>
                        {format(parseISO(completion.timestamp), 'HH:mm')}
                      </Text>
                    </View>
                    {completion.note && (
                      <Text style={styles.historyNote} numberOfLines={2}>
                        {completion.note}
                      </Text>
                    )}
                  </View>
                  <TouchableOpacity
                    style={styles.editHistoryButton}
                    onPress={() => {
                      setSelectedDate(date);
                      setNoteText(completion.note || '');
                      setNoteModalVisible(true);
                    }}
                  >
                    <Ionicons name="create-outline" size={16} color="#64748b" />
                  </TouchableOpacity>
                </View>
              );
            })
          ) : (
            <Text style={styles.noHistoryText}>No completions yet</Text>
          )}
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsSection}>
        <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteHabit}>
          <Ionicons name="trash-outline" size={20} color="white" />
          <Text style={styles.deleteButtonText}>Delete Habit</Text>
        </TouchableOpacity>
      </View>

      {/* Note Modal */}
      <Modal
        visible={noteModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setNoteModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {selectedDate === today ? "Today's Note" : 'Add Note'}
              </Text>
              <TouchableOpacity
                onPress={() => setNoteModalVisible(false)}
                style={styles.closeModalButton}
              >
                <Ionicons name="close" size={24} color="#64748b" />
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.noteInput}
              placeholder="Add a note about this completion..."
              value={noteText}
              onChangeText={setNoteText}
              multiline
              numberOfLines={4}
              maxLength={200}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setNoteModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleAddNote}>
                <Text style={styles.saveButtonText}>Save Note</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  headerInfo: {
    flex: 1,
  },
  habitName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  habitCategory: {
    fontSize: 16,
    color: '#64748b',
    textTransform: 'capitalize',
  },
  todaySection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 12,
  },
  todayCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  todayStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  completionButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    marginRight: 16,
  },
  completedButton: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },
  todayInfo: {
    flex: 1,
  },
  todayLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  todayTime: {
    fontSize: 14,
    color: '#64748b',
  },
  noteSection: {
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 16,
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  addNoteButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addNoteText: {
    fontSize: 14,
    color: '#6366f1',
    marginLeft: 4,
  },
  noteText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  noNoteText: {
    fontSize: 14,
    color: '#9ca3af',
    fontStyle: 'italic',
  },
  detailsSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  detailsCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginLeft: 12,
    marginRight: 8,
    minWidth: 80,
  },
  detailValue: {
    fontSize: 14,
    color: '#64748b',
    flex: 1,
  },
  historySection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  historyCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  historyDate: {
    alignItems: 'center',
    marginRight: 16,
    minWidth: 60,
  },
  historyDateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  historyYearText: {
    fontSize: 12,
    color: '#64748b',
  },
  historyContent: {
    flex: 1,
  },
  historyStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  historyTime: {
    fontSize: 14,
    color: '#64748b',
    marginLeft: 8,
  },
  historyNote: {
    fontSize: 12,
    color: '#6b7280',
    fontStyle: 'italic',
  },
  editHistoryButton: {
    padding: 8,
  },
  noHistoryText: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    fontStyle: 'italic',
    paddingVertical: 20,
  },
  actionsSection: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  deleteButton: {
    backgroundColor: '#ef4444',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 8,
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
  },
  closeModalButton: {
    padding: 4,
  },
  noteInput: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: 'white',
    textAlignVertical: 'top',
    minHeight: 100,
    marginBottom: 16,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#64748b',
  },
  saveButton: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  saveButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
  },
});

export default HabitDetailScreen;