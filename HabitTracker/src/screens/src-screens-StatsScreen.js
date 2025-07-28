import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { useHabits } from '../context/HabitContext';
import { format, subDays, eachDayOfInterval } from 'date-fns';

const { width } = Dimensions.get('window');

const StatsScreen = () => {
  const { habits, getHabitStats } = useHabits();
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [selectedHabit, setSelectedHabit] = useState(null);

  const periods = [
    { key: 'week', label: 'Week', days: 7 },
    { key: 'month', label: 'Month', days: 30 },
    { key: 'year', label: 'Year', days: 365 },
  ];

  const getOverallStats = () => {
    if (habits.length === 0) return null;

    const totalHabits = habits.length;
    const completedToday = habits.filter(habit => {
      const today = format(new Date(), 'yyyy-MM-dd');
      return habit.completions[today]?.completed;
    }).length;

    const totalCompletions = habits.reduce((total, habit) => {
      return total + Object.values(habit.completions).filter(c => c.completed).length;
    }, 0);

    const totalDays = habits.reduce((total, habit) => {
      return total + Object.keys(habit.completions).length;
    }, 0);

    const averageSuccessRate = totalDays > 0 ? (totalCompletions / totalDays) * 100 : 0;

    return {
      totalHabits,
      completedToday,
      totalCompletions,
      averageSuccessRate,
    };
  };

  const getWeeklyData = () => {
    const days = eachDayOfInterval({
      start: subDays(new Date(), 6),
      end: new Date(),
    });

    return days.map(day => {
      const dateStr = format(day, 'yyyy-MM-dd');
      const completedCount = habits.filter(habit => 
        habit.completions[dateStr]?.completed
      ).length;
      
      return {
        date: format(day, 'MMM dd'),
        completed: completedCount,
        total: habits.length,
      };
    });
  };

  const getHabitProgressData = (habitId) => {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return [];

    const days = eachDayOfInterval({
      start: subDays(new Date(), 6),
      end: new Date(),
    });

    return days.map(day => {
      const dateStr = format(day, 'yyyy-MM-dd');
      const completed = habit.completions[dateStr]?.completed ? 1 : 0;
      
      return {
        date: format(day, 'MMM dd'),
        completed,
      };
    });
  };

  const overallStats = getOverallStats();
  const weeklyData = getWeeklyData();

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(99, 102, 241, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(100, 116, 139, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#6366f1',
    },
  };

  if (habits.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="stats-chart-outline" size={64} color="#ccc" />
        <Text style={styles.emptyTitle}>No Data Yet</Text>
        <Text style={styles.emptySubtitle}>
          Create some habits and start tracking to see your statistics here!
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Statistics</Text>
        <Text style={styles.subtitle}>Track your progress</Text>
      </View>

      {/* Overall Stats */}
      {overallStats && (
        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>Overall Progress</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Ionicons name="list" size={24} color="#6366f1" />
              <Text style={styles.statNumber}>{overallStats.totalHabits}</Text>
              <Text style={styles.statLabel}>Total Habits</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="checkmark-circle" size={24} color="#10b981" />
              <Text style={styles.statNumber}>{overallStats.completedToday}</Text>
              <Text style={styles.statLabel}>Completed Today</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="trending-up" size={24} color="#8b5cf6" />
              <Text style={styles.statNumber}>{overallStats.totalCompletions}</Text>
              <Text style={styles.statLabel}>Total Completions</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="analytics" size={24} color="#f59e0b" />
              <Text style={styles.statNumber}>
                {overallStats.averageSuccessRate.toFixed(1)}%
              </Text>
              <Text style={styles.statLabel}>Success Rate</Text>
            </View>
          </View>
        </View>
      )}

      {/* Weekly Progress Chart */}
      <View style={styles.chartContainer}>
        <Text style={styles.sectionTitle}>Weekly Progress</Text>
        <LineChart
          data={{
            labels: weeklyData.map(d => d.date),
            datasets: [
              {
                data: weeklyData.map(d => d.completed),
                color: (opacity = 1) => `rgba(99, 102, 241, ${opacity})`,
                strokeWidth: 2,
              },
            ],
          }}
          width={width - 40}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
        />
        <Text style={styles.chartCaption}>
          Habits completed per day (last 7 days)
        </Text>
      </View>

      {/* Individual Habit Stats */}
      <View style={styles.habitsContainer}>
        <Text style={styles.sectionTitle}>Individual Habit Stats</Text>
        {habits.map(habit => {
          const stats = getHabitStats(habit.id);
          if (!stats) return null;

          return (
            <TouchableOpacity
              key={habit.id}
              style={styles.habitStatCard}
              onPress={() => setSelectedHabit(selectedHabit === habit.id ? null : habit.id)}
            >
              <View style={styles.habitStatHeader}>
                <View style={styles.habitStatInfo}>
                  <Text style={styles.habitStatName}>{habit.name}</Text>
                  <Text style={styles.habitStatCategory}>{habit.category}</Text>
                </View>
                <Ionicons
                  name={selectedHabit === habit.id ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color="#64748b"
                />
              </View>
              
              <View style={styles.habitStatNumbers}>
                <View style={styles.habitStatItem}>
                  <Text style={styles.habitStatNumber}>{stats.currentStreak}</Text>
                  <Text style={styles.habitStatLabel}>Current Streak</Text>
                </View>
                <View style={styles.habitStatItem}>
                  <Text style={styles.habitStatNumber}>{stats.longestStreak}</Text>
                  <Text style={styles.habitStatLabel}>Longest Streak</Text>
                </View>
                <View style={styles.habitStatItem}>
                  <Text style={styles.habitStatNumber}>
                    {stats.successRate.toFixed(1)}%
                  </Text>
                  <Text style={styles.habitStatLabel}>Success Rate</Text>
                </View>
              </View>

              {selectedHabit === habit.id && (
                <View style={styles.habitProgressChart}>
                  <BarChart
                    data={{
                      labels: getHabitProgressData(habit.id).map(d => d.date),
                      datasets: [
                        {
                          data: getHabitProgressData(habit.id).map(d => d.completed),
                        },
                      ],
                    }}
                    width={width - 80}
                    height={120}
                    chartConfig={{
                      ...chartConfig,
                      color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
                    }}
                    style={styles.miniChart}
                    showValuesOnTopOfBars
                  />
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    backgroundColor: '#f8fafc',
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
  statsContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    width: '48%',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
    textAlign: 'center',
  },
  chartContainer: {
    padding: 20,
    backgroundColor: 'white',
    marginHorizontal: 20,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  chartCaption: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 8,
  },
  habitsContainer: {
    padding: 20,
  },
  habitStatCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  habitStatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  habitStatInfo: {
    flex: 1,
  },
  habitStatName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  habitStatCategory: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  habitStatNumbers: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  habitStatItem: {
    alignItems: 'center',
    flex: 1,
  },
  habitStatNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6366f1',
  },
  habitStatLabel: {
    fontSize: 10,
    color: '#64748b',
    marginTop: 2,
    textAlign: 'center',
  },
  habitProgressChart: {
    marginTop: 16,
    alignItems: 'center',
  },
  miniChart: {
    marginVertical: 8,
    borderRadius: 16,
  },
});

export default StatsScreen;