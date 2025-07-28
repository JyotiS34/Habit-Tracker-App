import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import * as Notifications from 'expo-notifications';
import { Ionicons } from '@expo/vector-icons';
import { Platform, Alert } from 'react-native';

// Import screens
import HomeScreen from './src/screens/HomeScreen';
import StatsScreen from './src/screens/StatsScreen';
import AddHabitScreen from './src/screens/AddHabitScreen';
import HabitDetailScreen from './src/screens/HabitDetailScreen';
import SettingsScreen from './src/screens/SettingsScreen';

// Import context
import { HabitProvider } from './src/context/HabitContext';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Stats') {
            iconName = focused ? 'stats-chart' : 'stats-chart-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#6366f1',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Stats" component={StatsScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [expoPushToken, setExpoPushToken] = useState('');

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => {
      if (token) {
        setExpoPushToken(token);
        console.log("Expo Push Token:", token);
        // You can send this token to your backend if needed
      }
    });

    // Example notification schedule
    const schedule = async () => {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Welcome!',
          body: 'Thanks for using the Habit Tracker App 💪',
        },
        trigger: { seconds: 10 },
      });
    };

    schedule();
  }, []);

  return (
    <HabitProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen 
            name="Main" 
            component={TabNavigator} 
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="AddHabit" 
            component={AddHabitScreen}
            options={{ 
              title: 'Add New Habit',
              headerStyle: { backgroundColor: '#6366f1' },
              headerTintColor: '#fff',
            }}
          />
          <Stack.Screen 
            name="HabitDetail" 
            component={HabitDetailScreen}
            options={{ 
              title: 'Habit Details',
              headerStyle: { backgroundColor: '#6366f1' },
              headerTintColor: '#fff',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar style="auto" />
    </HabitProvider>
  );
}

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    Alert.alert('Permission Required', 'Failed to get push notification permissions.');
    return null;
  }

  const result = await Notifications.getExpoPushTokenAsync();
  token = result.data;
  return token;
}
