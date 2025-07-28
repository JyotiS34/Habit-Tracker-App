import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useHabits } from '../context/HabitContext';
import RNPickerSelect from 'react-native-picker-select';

const AddHabitScreen = ({ navigation }) => {
  const { addHabit } = useHabits();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    reminderTime: '',
  });
  const [errors, setErrors] = useState({});

  const categories = [
    { label: 'Health & Fitness', value: 'health' },
    { label: 'Productivity', value: 'productivity' },
    { label: 'Learning', value: 'learning' },
    { label: 'Mindfulness', value: 'mindfulness' },
    { label: 'Social', value: 'social' },
    { label: 'Other', value: 'other' },
  ];

  const reminderTimes = [
    { label: 'No reminder', value: '' },
    { label: '6:00 AM', value: '06:00' },
    { label: '7:00 AM', value: '07:00' },
    { label: '8:00 AM', value: '08:00' },
    { label: '9:00 AM', value: '09:00' },
    { label: '12:00 PM', value: '12:00' },
    { label: '6:00 PM', value: '18:00' },
    { label: '8:00 PM', value: '20:00' },
    { label: '9:00 PM', value: '21:00' },
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Habit name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const newHabit = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        category: formData.category,
        reminderTime: formData.reminderTime,
      };

      addHabit(newHabit);
      Alert.alert(
        'Success!',
        'Your habit has been created successfully.',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    }
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

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Habit Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Habit Name *</Text>
            <TextInput
              style={[styles.input, errors.name && styles.inputError]}
              placeholder="e.g., Drink 8 glasses of water"
              value={formData.name}
              onChangeText={(text) => {
                setFormData({ ...formData, name: text });
                if (errors.name) setErrors({ ...errors, name: null });
              }}
              maxLength={50}
            />
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
          </View>

          {/* Description */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description *</Text>
            <TextInput
              style={[styles.textArea, errors.description && styles.inputError]}
              placeholder="Describe your habit in detail..."
              value={formData.description}
              onChangeText={(text) => {
                setFormData({ ...formData, description: text });
                if (errors.description) setErrors({ ...errors, description: null });
              }}
              multiline
              numberOfLines={4}
              maxLength={200}
            />
            {errors.description && (
              <Text style={styles.errorText}>{errors.description}</Text>
            )}
          </View>

          {/* Category */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Category *</Text>
            <View style={[styles.pickerContainer, errors.category && styles.inputError]}>
              <RNPickerSelect
                onValueChange={(value) => {
                  setFormData({ ...formData, category: value });
                  if (errors.category) setErrors({ ...errors, category: null });
                }}
                items={categories}
                value={formData.category}
                placeholder={{ label: 'Select a category', value: null }}
                style={pickerSelectStyles}
              />
            </View>
            {errors.category && <Text style={styles.errorText}>{errors.category}</Text>}
          </View>

          {/* Reminder Time */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Reminder Time (Optional)</Text>
            <View style={styles.pickerContainer}>
              <RNPickerSelect
                onValueChange={(value) => setFormData({ ...formData, reminderTime: value })}
                items={reminderTimes}
                value={formData.reminderTime}
                placeholder={{ label: 'No reminder', value: '' }}
                style={pickerSelectStyles}
              />
            </View>
          </View>

          {/* Category Preview */}
          {formData.category && (
            <View style={styles.previewContainer}>
              <Text style={styles.previewLabel}>Preview:</Text>
              <View style={styles.previewCard}>
                <View
                  style={[
                    styles.previewIcon,
                    { backgroundColor: getCategoryColor(formData.category) + '20' },
                  ]}
                >
                  <Ionicons
                    name={getCategoryIcon(formData.category)}
                    size={24}
                    color={getCategoryColor(formData.category)}
                  />
                </View>
                <View style={styles.previewContent}>
                  <Text style={styles.previewName}>{formData.name || 'Habit Name'}</Text>
                  <Text style={styles.previewDescription}>
                    {formData.description || 'Description will appear here'}
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Submit Button */}
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Create Habit</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    color: '#1e293b',
    paddingRight: 30,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    color: '#1e293b',
    paddingRight: 30,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: 'white',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: 'white',
    textAlignVertical: 'top',
    minHeight: 100,
  },
  inputError: {
    borderColor: '#ef4444',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 14,
    marginTop: 4,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    backgroundColor: 'white',
  },
  previewContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  previewLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 12,
  },
  previewCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  previewIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  previewContent: {
    flex: 1,
  },
  previewName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  previewDescription: {
    fontSize: 14,
    color: '#64748b',
  },
  submitButton: {
    backgroundColor: '#6366f1',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AddHabitScreen;