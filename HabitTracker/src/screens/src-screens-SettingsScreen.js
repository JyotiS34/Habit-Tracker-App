import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useHabits } from '../context/HabitContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingsScreen = () => {
  const { habits, deleteHabit } = useHabits();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [remindersEnabled, setRemindersEnabled] = useState(true);

  const handleClearAllData = () => {
    Alert.alert(
      'Clear All Data',
      'This will permanently delete all your habits and progress. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              habits.forEach(habit => deleteHabit(habit.id));
              Alert.alert('Success', 'All data has been cleared.');
            } catch (error) {
              Alert.alert('Error', 'Failed to clear data. Please try again.');
            }
          },
        },
      ]
    );
  };

  const handleExportData = () => {
    const exportData = {
      habits: habits,
      exportDate: new Date().toISOString(),
      version: '1.0.0',
    };

    // In a real app, you would implement actual data export
    Alert.alert(
      'Export Data',
      'Data export feature would be implemented here. For now, your data is safely stored locally.',
      [{ text: 'OK' }]
    );
  };

  const handleBackupData = () => {
    Alert.alert(
      'Backup Data',
      'Backup feature would be implemented here. Your data is currently stored locally on your device.',
      [{ text: 'OK' }]
    );
  };

  const handleOpenPrivacyPolicy = () => {
    // In a real app, this would open your privacy policy
    Alert.alert(
      'Privacy Policy',
      'Privacy policy would be displayed here.',
      [{ text: 'OK' }]
    );
  };

  const handleOpenTermsOfService = () => {
    // In a real app, this would open your terms of service
    Alert.alert(
      'Terms of Service',
      'Terms of service would be displayed here.',
      [{ text: 'OK' }]
    );
  };

  const handleContactSupport = () => {
    Alert.alert(
      'Contact Support',
      'Support contact information would be displayed here.',
      [{ text: 'OK' }]
    );
  };

  const handleRateApp = () => {
    // In a real app, this would open the app store
    Alert.alert(
      'Rate App',
      'This would open the app store to rate the app.',
      [{ text: 'OK' }]
    );
  };

  const settingsSections = [
    {
      title: 'Notifications',
      items: [
        {
          icon: 'notifications-outline',
          title: 'Push Notifications',
          subtitle: 'Receive reminders for your habits',
          type: 'switch',
          value: notificationsEnabled,
          onValueChange: setNotificationsEnabled,
        },
        {
          icon: 'time-outline',
          title: 'Daily Reminders',
          subtitle: 'Get reminded to check your habits',
          type: 'switch',
          value: remindersEnabled,
          onValueChange: setRemindersEnabled,
        },
      ],
    },
    {
      title: 'Appearance',
      items: [
        {
          icon: 'moon-outline',
          title: 'Dark Mode',
          subtitle: 'Switch to dark theme',
          type: 'switch',
          value: darkModeEnabled,
          onValueChange: setDarkModeEnabled,
        },
      ],
    },
    {
      title: 'Data Management',
      items: [
        {
          icon: 'cloud-upload-outline',
          title: 'Backup Data',
          subtitle: 'Backup your habits to cloud',
          type: 'button',
          onPress: handleBackupData,
        },
        {
          icon: 'download-outline',
          title: 'Export Data',
          subtitle: 'Export your data as JSON',
          type: 'button',
          onPress: handleExportData,
        },
        {
          icon: 'trash-outline',
          title: 'Clear All Data',
          subtitle: 'Permanently delete all data',
          type: 'button',
          onPress: handleClearAllData,
          destructive: true,
        },
      ],
    },
    {
      title: 'Support & Legal',
      items: [
        {
          icon: 'help-circle-outline',
          title: 'Contact Support',
          subtitle: 'Get help with the app',
          type: 'button',
          onPress: handleContactSupport,
        },
        {
          icon: 'shield-checkmark-outline',
          title: 'Privacy Policy',
          subtitle: 'Read our privacy policy',
          type: 'button',
          onPress: handleOpenPrivacyPolicy,
        },
        {
          icon: 'document-text-outline',
          title: 'Terms of Service',
          subtitle: 'Read our terms of service',
          type: 'button',
          onPress: handleOpenTermsOfService,
        },
        {
          icon: 'star-outline',
          title: 'Rate App',
          subtitle: 'Rate us on the app store',
          type: 'button',
          onPress: handleRateApp,
        },
      ],
    },
    {
      title: 'About',
      items: [
        {
          icon: 'information-circle-outline',
          title: 'Version',
          subtitle: '1.0.0',
          type: 'info',
        },
        {
          icon: 'code-outline',
          title: 'Developer',
          subtitle: 'Habit Tracker Team',
          type: 'info',
        },
      ],
    },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Customize your experience</Text>
      </View>

      {/* Settings Sections */}
      {settingsSections.map((section, sectionIndex) => (
        <View key={sectionIndex} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <View style={styles.sectionContent}>
            {section.items.map((item, itemIndex) => (
              <View key={itemIndex} style={styles.settingItem}>
                <View style={styles.settingIcon}>
                  <Ionicons
                    name={item.icon}
                    size={20}
                    color={item.destructive ? '#ef4444' : '#64748b'}
                  />
                </View>
                <View style={styles.settingInfo}>
                  <Text
                    style={[
                      styles.settingTitle,
                      item.destructive && styles.destructiveText,
                    ]}
                  >
                    {item.title}
                  </Text>
                  <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
                </View>
                <View style={styles.settingAction}>
                  {item.type === 'switch' && (
                    <Switch
                      value={item.value}
                      onValueChange={item.onValueChange}
                      trackColor={{ false: '#e2e8f0', true: '#6366f1' }}
                      thumbColor={item.value ? '#ffffff' : '#ffffff'}
                    />
                  )}
                  {item.type === 'button' && (
                    <TouchableOpacity onPress={item.onPress}>
                      <Ionicons
                        name="chevron-forward"
                        size={20}
                        color={item.destructive ? '#ef4444' : '#64748b'}
                      />
                    </TouchableOpacity>
                  )}
                  {item.type === 'info' && (
                    <Text style={styles.infoText}>{item.subtitle}</Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        </View>
      ))}

      {/* App Info */}
      <View style={styles.appInfo}>
        <Text style={styles.appInfoText}>
          Habit Tracker helps you build better habits and track your progress.
        </Text>
        <Text style={styles.appInfoText}>
          Thank you for using our app!
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
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
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    paddingHorizontal: 20,
  },
  sectionContent: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  settingIcon: {
    width: 40,
    alignItems: 'center',
    marginRight: 12,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1e293b',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#64748b',
  },
  settingAction: {
    marginLeft: 12,
  },
  destructiveText: {
    color: '#ef4444',
  },
  infoText: {
    fontSize: 14,
    color: '#64748b',
    fontStyle: 'italic',
  },
  appInfo: {
    paddingHorizontal: 20,
    paddingVertical: 40,
    alignItems: 'center',
  },
  appInfoText: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 8,
  },
});

export default SettingsScreen;