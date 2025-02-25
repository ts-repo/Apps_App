import { create } from 'zustand';

interface TimerState {
  timeLeft: number;
  isRunning: boolean;
  isWorkSession: boolean;
  workDuration: number;
  breakDuration: number;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  adjustWorkDuration: (adjustment: number) => void;
  adjustBreakDuration: (adjustment: number) => void;
  switchToBreak: () => void;
  switchToWork: () => void;
}

export const useTimerStore = create<TimerState>((set, get) => ({
  timeLeft: 25 * 60,
  isRunning: false,
  isWorkSession: true,
  workDuration: 25 * 60,
  breakDuration: 5 * 60,

  startTimer: () => {
    set({ isRunning: true });
    const timer = setInterval(() => {
      const { timeLeft, isRunning, isWorkSession } = get();
      
      if (!isRunning) {
        clearInterval(timer);
        return;
      }

      if (timeLeft <= 0) {
        clearInterval(timer);
        // 作業時間が終了したら休憩時間に自動で切り替え
        if (isWorkSession) {
          get().switchToBreak();
        } else {
          get().switchToWork();
        }
        return;
      }

      set({ timeLeft: timeLeft - 1 });
    }, 1000);
  },

  pauseTimer: () => {
    set({ isRunning: false });
  },

  resetTimer: () => {
    const { isWorkSession, workDuration, breakDuration } = get();
    set({
      timeLeft: isWorkSession ? workDuration : breakDuration,
      isRunning: false,
    });
  },

  adjustWorkDuration: (adjustment: number) => {
    set((state) => {
      const newDuration = Math.max(5 * 60, Math.min(60 * 60, state.workDuration + adjustment));
      return {
        workDuration: newDuration,
        timeLeft: state.isWorkSession && !state.isRunning ? newDuration : state.timeLeft,
      };
    });
  },

  adjustBreakDuration: (adjustment: number) => {
    set((state) => {
      const newDuration = Math.max(1 * 60, Math.min(30 * 60, state.breakDuration + adjustment));
      return {
        breakDuration: newDuration,
        timeLeft: !state.isWorkSession && !state.isRunning ? newDuration : state.timeLeft,
      };
    });
  },

  switchToBreak: () => {
    set((state) => ({
      isWorkSession: false,
      timeLeft: state.breakDuration,
      isRunning: false,
    }));
  },

  switchToWork: () => {
    set((state) => ({
      isWorkSession: true,
      timeLeft: state.workDuration,
      isRunning: false,
    }));
  },
}));