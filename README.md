# Habit Tracker Mobile App

A comprehensive React Native mobile application that helps users create and maintain habits by tracking their daily progress, sending reminders, and visualizing statistics.

## 🚀 Features

### ✅ Core Features Implemented

- **Habit Creation**: Users can add habits with custom names, descriptions, categories, and optional reminders
- **Daily Check-ins**: Mark habits as completed for the day with one-tap functionality
- **Push Notifications**: Configured for habit reminders (ready for implementation)
- **Statistics & Analytics**: 
  - Overall progress tracking
  - Individual habit statistics
  - Streak tracking (current and longest)
  - Success rate calculations
  - Weekly progress charts
- **Notes System**: Add notes to any habit completion for better tracking
- **Filtering**: View habits by completion status (All, Completed, Pending)
- **Data Persistence**: All data is stored locally using AsyncStorage
- **Modern UI**: Beautiful, intuitive interface with smooth animations

### 📱 Screens

1. **Home Screen**: Main dashboard with habit list, filtering, and quick actions
2. **Add Habit Screen**: Form to create new habits with validation
3. **Habit Detail Screen**: Detailed view with completion history and notes
4. **Stats Screen**: Comprehensive analytics with charts and statistics
5. **Settings Screen**: App configuration and data management

### 🎨 Design Features

- **Category-based Organization**: Habits are organized by categories (Health, Productivity, Learning, etc.)
- **Visual Progress Indicators**: Color-coded categories and completion status
- **Responsive Design**: Works on various screen sizes
- **Smooth Animations**: Modern UI with smooth transitions
- **Accessibility**: Proper contrast and touch targets

## 🛠️ Technology Stack

- **React Native**: Cross-platform mobile development
- **Expo**: Development platform and tools
- **React Navigation**: Navigation between screens
- **AsyncStorage**: Local data persistence
- **React Native Chart Kit**: Data visualization
- **Date-fns**: Date manipulation utilities
- **Expo Notifications**: Push notification support
- **React Native Vector Icons**: Icon library

## 📦 Installation & Setup

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd HabitTracker
2. Install dependencies

npm install
# or
yarn install
3. Start the development server

npm start
# or
yarn start

Development Commands
# Start development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android

# Run on web
npm run web