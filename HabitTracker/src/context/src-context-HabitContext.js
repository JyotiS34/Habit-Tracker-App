import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format } from 'date-fns';

const HabitContext = createContext();

const initialState = {
  habits: [],
  loading: true,
};

const habitReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_HABITS':
      return { ...state, habits: action.payload, loading: false };
    case 'ADD_HABIT':
      return { ...state, habits: [...state.habits, action.payload] };
    case 'UPDATE_HABIT':
      return {
        ...state,
        habits: state.habits.map(habit =>
          habit.id === action.payload.id ? action.payload : habit
        ),
      };
    case 'DELETE_HABIT':
      return {
        ...state,
        habits: state.habits.filter(habit => habit.id !== action.payload),
      };
    case 'TOGGLE_HABIT_COMPLETION':
      return {
        ...state,
        habits: state.habits.map(habit => {
          if (habit.id === action.payload.habitId) {
            const today = format(new Date(), 'yyyy-MM-dd');
            const updatedCompletions = { ...habit.completions };
            
            if (updatedCompletions[today]) {
              delete updatedCompletions[today];
            } else {
              updatedCompletions[today] = {
                completed: true,
                note: action.payload.note || '',
                timestamp: new Date().toISOString(),
              };
            }
            
            return { ...habit, completions: updatedCompletions };
          }
          return habit;
        }),
      };
    case 'ADD_NOTE':
      return {
        ...state,
        habits: state.habits.map(habit => {
          if (habit.id === action.payload.habitId) {
            const updatedCompletions = { ...habit.completions };
            if (updatedCompletions[action.payload.date]) {
              updatedCompletions[action.payload.date] = {
                ...updatedCompletions[action.payload.date],
                note: action.payload.note,
              };
            }
            return { ...habit, completions: updatedCompletions };
          }
          return habit;
        }),
      };
    default:
      return state;
  }
};

export const HabitProvider = ({ children }) => {
  const [state, dispatch] = useReducer(habitReducer, initialState);

  // Load habits from AsyncStorage on app start
  useEffect(() => {
    loadHabits();
  }, []);

  // Save habits to AsyncStorage whenever habits change
  useEffect(() => {
    if (!state.loading) {
      saveHabits();
    }
  }, [state.habits]);

  const loadHabits = async () => {
    try {
      const storedHabits = await AsyncStorage.getItem('habits');
      if (storedHabits) {
        dispatch({ type: 'SET_HABITS', payload: JSON.parse(storedHabits) });
      } else {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    } catch (error) {
      console.error('Error loading habits:', error);
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const saveHabits = async () => {
    try {
      await AsyncStorage.setItem('habits', JSON.stringify(state.habits));
    } catch (error) {
      console.error('Error saving habits:', error);
    }
  };

  const addHabit = (habit) => {
    const newHabit = {
      ...habit,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      completions: {},
    };
    dispatch({ type: 'ADD_HABIT', payload: newHabit });
  };

  const updateHabit = (habit) => {
    dispatch({ type: 'UPDATE_HABIT', payload: habit });
  };

  const deleteHabit = (habitId) => {
    dispatch({ type: 'DELETE_HABIT', payload: habitId });
  };

  const toggleHabitCompletion = (habitId, note = '') => {
    dispatch({ type: 'TOGGLE_HABIT_COMPLETION', payload: { habitId, note } });
  };

  const addNote = (habitId, date, note) => {
    dispatch({ type: 'ADD_NOTE', payload: { habitId, date, note } });
  };

  const getHabitStats = (habitId) => {
    const habit = state.habits.find(h => h.id === habitId);
    if (!habit) return null;

    const completions = Object.values(habit.completions);
    const totalDays = completions.length;
    const completedDays = completions.filter(c => c.completed).length;
    const currentStreak = calculateCurrentStreak(habit.completions);
    const longestStreak = calculateLongestStreak(habit.completions);

    return {
      totalDays,
      completedDays,
      successRate: totalDays > 0 ? (completedDays / totalDays) * 100 : 0,
      currentStreak,
      longestStreak,
    };
  };

  const calculateCurrentStreak = (completions) => {
    const dates = Object.keys(completions).sort().reverse();
    let streak = 0;
    
    for (const date of dates) {
      if (completions[date].completed) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  const calculateLongestStreak = (completions) => {
    const dates = Object.keys(completions).sort();
    let longestStreak = 0;
    let currentStreak = 0;
    
    for (const date of dates) {
      if (completions[date].completed) {
        currentStreak++;
        longestStreak = Math.max(longestStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    }
    
    return longestStreak;
  };

  const getTodayHabits = () => {
    const today = format(new Date(), 'yyyy-MM-dd');
    return state.habits.map(habit => ({
      ...habit,
      isCompletedToday: habit.completions[today]?.completed || false,
      todayNote: habit.completions[today]?.note || '',
    }));
  };

  const getHabitsByFilter = (filter) => {
    const today = format(new Date(), 'yyyy-MM-dd');
    
    switch (filter) {
      case 'completed':
        return state.habits.filter(habit => habit.completions[today]?.completed);
      case 'pending':
        return state.habits.filter(habit => !habit.completions[today]?.completed);
      default:
        return state.habits;
    }
  };

  const value = {
    ...state,
    addHabit,
    updateHabit,
    deleteHabit,
    toggleHabitCompletion,
    addNote,
    getHabitStats,
    getTodayHabits,
    getHabitsByFilter,
  };

  return (
    <HabitContext.Provider value={value}>
      {children}
    </HabitContext.Provider>
  );
};

export const useHabits = () => {
  const context = useContext(HabitContext);
  if (!context) {
    throw new Error('useHabits must be used within a HabitProvider');
  }
  return context;
};