import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Quote } from '../backend';

export function useQuote() {
  const { actor, isFetching } = useActor();

  return useQuery<Quote>({
    queryKey: ['dailyQuote'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not initialized');
      
      const cachedQuote = localStorage.getItem('cachedQuote');
      const cacheDate = localStorage.getItem('quoteCacheDate');
      const today = new Date().toDateString();

      if (cachedQuote && cacheDate === today) {
        return JSON.parse(cachedQuote);
      }

      try {
        const quote = await actor.getDailyQuote();
        localStorage.setItem('cachedQuote', JSON.stringify(quote));
        localStorage.setItem('quoteCacheDate', today);
        return quote;
      } catch (error) {
        const fallbackQuotes: Quote[] = [
          { text: "Discipline is the bridge between goals and accomplishment.", author: "Jim Rohn" },
          { text: "Success is nothing more than a few simple disciplines, practiced every day.", author: "Jim Rohn" },
          { text: "Consistency is what transforms average into excellence.", author: "Tony Robbins" },
        ];
        const randomQuote = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
        return randomQuote;
      }
    },
    enabled: !!actor && !isFetching,
    staleTime: 24 * 60 * 60 * 1000,
  });
}

interface StudySession {
  date: string;
  seconds: number;
}

interface TimerState {
  isRunning: boolean;
  startTime: number | null;
}

interface HeatmapDay {
  date: string;
  hours: number;
}

interface DailyData {
  date: string;
  hours: number;
  label: string;
}

// Dispatch custom event when study sessions are updated
const dispatchStudyUpdate = () => {
  window.dispatchEvent(new CustomEvent('studySessionUpdated'));
};

export function useStudyData() {
  const getStudySessions = (): StudySession[] => {
    const data = localStorage.getItem('studySessions');
    return data ? JSON.parse(data) : [];
  };

  const saveStudySessions = (sessions: StudySession[]) => {
    localStorage.setItem('studySessions', JSON.stringify(sessions));
    dispatchStudyUpdate();
  };

  const getTodayHours = (): number => {
    const today = new Date().toDateString();
    const sessions = getStudySessions();
    const todaySession = sessions.find(s => s.date === today);
    return todaySession ? todaySession.seconds / 3600 : 0;
  };

  const addStudyTime = (seconds: number) => {
    const today = new Date().toDateString();
    const sessions = getStudySessions();
    const existingIndex = sessions.findIndex(s => s.date === today);

    if (existingIndex >= 0) {
      sessions[existingIndex].seconds += seconds;
    } else {
      sessions.push({ date: today, seconds });
    }

    saveStudySessions(sessions);
  };

  const getTimerState = (): TimerState => {
    const data = localStorage.getItem('timerState');
    return data ? JSON.parse(data) : { isRunning: false, startTime: null };
  };

  const saveTimerState = (state: TimerState) => {
    localStorage.setItem('timerState', JSON.stringify(state));
  };

  const getCurrentStreak = (): number => {
    const sessions = getStudySessions();
    let streak = 0;
    const today = new Date();

    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      const dateStr = checkDate.toDateString();
      
      const session = sessions.find(s => s.date === dateStr);
      const hours = session ? session.seconds / 3600 : 0;

      if (hours >= 3) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }

    return streak;
  };

  const getLongestStreak = (): number => {
    const sessions = getStudySessions();
    let maxStreak = 0;
    let currentStreak = 0;
    const today = new Date();

    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      const dateStr = checkDate.toDateString();
      
      const session = sessions.find(s => s.date === dateStr);
      const hours = session ? session.seconds / 3600 : 0;

      if (hours >= 3) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    }

    return maxStreak;
  };

  const isStreakBroken = (): boolean => {
    const sessions = getStudySessions();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();
    
    const session = sessions.find(s => s.date === yesterdayStr);
    const hours = session ? session.seconds / 3600 : 0;
    
    return hours < 3 && getCurrentStreak() === 0;
  };

  const checkMissedDay = (): boolean => {
    const sessions = getStudySessions();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();
    
    const session = sessions.find(s => s.date === yesterdayStr);
    const hours = session ? session.seconds / 3600 : 0;
    
    return hours === 0;
  };

  const getHeatmapData = (): HeatmapDay[] => {
    const sessions = getStudySessions();
    const data: HeatmapDay[] = [];
    const today = new Date();

    for (let i = 83; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.toDateString();
      
      const session = sessions.find(s => s.date === dateStr);
      const hours = session ? session.seconds / 3600 : 0;

      data.push({
        date: dateStr,
        hours,
      });
    }

    return data;
  };

  const getDailyProgressData = (): DailyData[] => {
    const sessions = getStudySessions();
    const data: DailyData[] = [];
    const today = new Date();

    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.toDateString();
      
      const session = sessions.find(s => s.date === dateStr);
      const hours = session ? session.seconds / 3600 : 0;

      data.push({
        date: dateStr,
        hours,
        label: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      });
    }

    return data;
  };

  return {
    getTodayHours,
    addStudyTime,
    getTimerState,
    saveTimerState,
    getCurrentStreak,
    getLongestStreak,
    isStreakBroken,
    checkMissedDay,
    getHeatmapData,
    getDailyProgressData,
  };
}
