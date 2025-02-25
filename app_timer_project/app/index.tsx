import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Play, Pause, RotateCcw, Moon, Sun, Coffee, Timer, Clock } from 'lucide-react-native';
import { useTimerStore } from '../stores/timerStore';
import { useThemeStore } from '../stores/themeStore';
import { TimePickerModal } from '../components/TimePickerModal';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue,
  withTiming,
  Easing,
  withSequence,
  withSpring,
  withRepeat,
  interpolate
} from 'react-native-reanimated';
import { useState } from 'react';

const { width, height } = Dimensions.get('window');
const TIMER_SIZE = Math.min(width * 0.8, height * 0.5);
const STROKE_WIDTH = 12;

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export default function TimerScreen() {
  const [isTimePickerVisible, setTimePickerVisible] = useState(false);
  const { 
    timeLeft,
    isRunning,
    isWorkSession,
    workDuration,
    breakDuration,
    startTimer,
    pauseTimer,
    resetTimer,
    adjustWorkDuration,
    adjustBreakDuration,
    switchToBreak,
    switchToWork,
  } = useTimerStore();

  const { theme, toggleTheme } = useThemeStore();
  const isDark = theme === 'dark';

  // アニメーション用の共有値
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);
  const themeIconRotation = useSharedValue(0);
  const sessionIconScale = useSharedValue(1);
  const durationButtonScale = useSharedValue(1);
  const controlButtonScale = useSharedValue(1);
  const controlIconRotation = useSharedValue(0);
  const rippleScale = useSharedValue(0);
  const rippleOpacity = useSharedValue(0);

  const currentDuration = isWorkSession ? workDuration : breakDuration;
  const progress = (timeLeft / currentDuration) * 360;

  rotation.value = withTiming(-progress, {
    duration: 300,
    easing: Easing.bezier(0.25, 0.1, 0.25, 1),
  });

  const handleTimeConfirm = (minutes: number) => {
    const seconds = minutes * 60;
    if (isWorkSession) {
      adjustWorkDuration(seconds - workDuration);
    } else {
      adjustBreakDuration(seconds - breakDuration);
    }
    setTimePickerVisible(false);
  };

  // アニメーションスタイル
  const themeIconStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${themeIconRotation.value}deg` }],
  }));

  const sessionToggleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: sessionIconScale.value }],
  }));

  const durationButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: durationButtonScale.value }],
  }));

  const controlButtonStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: controlButtonScale.value },
      { rotate: `${controlIconRotation.value}deg` }
    ],
  }));

  const rippleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: rippleScale.value }],
    opacity: rippleOpacity.value,
  }));

  const circleStyle = useAnimatedStyle(() => ({
    transform: [
      { rotateZ: '-90deg' },
      { rotateZ: `${rotation.value}deg` }
    ],
  }));

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <TimePickerModal
        isVisible={isTimePickerVisible}
        onClose={() => setTimePickerVisible(false)}
        onConfirm={handleTimeConfirm}
        initialMinutes={Math.floor(currentDuration / 60)}
        isDark={isDark}
        title={isWorkSession ? '作業時間の設定' : '休憩時間の設定'}
      />

      <Animated.View style={themeIconStyle}>
        <TouchableOpacity
          style={styles.themeToggle}
          onPress={() => {
            themeIconRotation.value = withSequence(
              withTiming(360, { duration: 400 }),
              withTiming(0, { duration: 0 })
            );
            toggleTheme();
          }}
        >
          {isDark ? (
            <Sun size={24} color="#FFFFFF" />
          ) : (
            <Moon size={24} color="#000000" />
          )}
        </TouchableOpacity>
      </Animated.View>

      <View style={styles.timerContainer}>
        <Animated.View style={sessionToggleStyle}>
          <TouchableOpacity
            style={[styles.sessionToggle, isDark && styles.sessionToggleDark]}
            onPress={() => {
              sessionIconScale.value = withSequence(
                withSpring(1.2, { damping: 2 }),
                withSpring(1)
              );
              isWorkSession ? switchToBreak() : switchToWork();
            }}
          >
            {isWorkSession ? (
              <Timer size={24} color={isDark ? '#FFFFFF' : '#000000'} />
            ) : (
              <Coffee size={24} color={isDark ? '#FFFFFF' : '#000000'} />
            )}
            <Text style={[styles.sessionToggleText, isDark && styles.textDark]}>
              {isWorkSession ? '作業時間' : '休憩時間'}
            </Text>
          </TouchableOpacity>
        </Animated.View>

        <TouchableOpacity
          onPress={() => setTimePickerVisible(true)}
          style={styles.timerCircleContainer}
        >
          <View style={[styles.circleBase, isDark && styles.circleBaseDark]} />
          <Animated.View
            style={[
              styles.circleBase,
              styles.circleProgress,
              circleStyle,
              isDark && styles.circleProgressDark
            ]}
          />
          <View style={styles.timerContent}>
            <Text style={[styles.timer, isDark && styles.textDark]}>
              {formatTime(timeLeft)}
            </Text>
            <View style={styles.editTimeButton}>
              <Clock size={20} color={isDark ? '#FFFFFF' : '#000000'} />
              <Text style={[styles.editTimeText, isDark && styles.textDark]}>
                時間を設定
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        <View style={styles.controls}>
          <View style={styles.buttonContainer}>
            <Animated.View style={[styles.ripple, rippleStyle]} />
            <Animated.View style={controlButtonStyle}>
              <TouchableOpacity 
                style={[styles.button, isDark && styles.buttonDark]}
                onPress={() => {
                  controlButtonScale.value = withSequence(
                    withTiming(0.9, { duration: 100 }),
                    withTiming(1, { duration: 100 })
                  );
                  isRunning ? pauseTimer() : startTimer();
                }}
              >
                {isRunning ? (
                  <Pause size={32} color="#FFFFFF" />
                ) : (
                  <Play size={32} color="#FFFFFF" />
                )}
              </TouchableOpacity>
            </Animated.View>
          </View>
          
          <View style={styles.buttonContainer}>
            <Animated.View style={[styles.ripple, rippleStyle]} />
            <Animated.View style={controlButtonStyle}>
              <TouchableOpacity 
                style={[
                  styles.button,
                  styles.buttonSecondary,
                  isDark && styles.buttonSecondaryDark
                ]}
                onPress={() => {
                  controlButtonScale.value = withSequence(
                    withTiming(0.9, { duration: 100 }),
                    withTiming(1, { duration: 100 })
                  );
                  resetTimer();
                }}
              >
                <RotateCcw size={32} color={isDark ? '#60A5FA' : '#3B82F6'} />
              </TouchableOpacity>
            </Animated.View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  containerDark: {
    backgroundColor: '#1A1A1A',
  },
  themeToggle: {
    position: 'absolute',
    top: 40,
    right: 20,
    padding: 12,
  },
  sessionToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    marginBottom: 24,
  },
  sessionToggleDark: {
    backgroundColor: '#374151',
  },
  sessionToggleText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  timerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerCircleContainer: {
    width: TIMER_SIZE,
    height: TIMER_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleBase: {
    position: 'absolute',
    width: TIMER_SIZE,
    height: TIMER_SIZE,
    borderRadius: TIMER_SIZE / 2,
    borderWidth: STROKE_WIDTH,
    borderColor: '#E5E7EB',
  },
  circleBaseDark: {
    borderColor: '#4B5563',
  },
  circleProgress: {
    borderColor: '#3B82F6',
    borderLeftColor: 'transparent',
    borderBottomColor: 'transparent',
    transform: [{ rotateZ: '-90deg' }],
  },
  circleProgressDark: {
    borderColor: '#60A5FA',
  },
  timerContent: {
    alignItems: 'center',
  },
  timer: {
    fontSize: 64,
    fontWeight: '700',
    fontFamily: 'monospace',
    letterSpacing: 2,
    color: '#1A1A1A',
  },
  editTimeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
    opacity: 0.7,
  },
  editTimeText: {
    fontSize: 14,
    color: '#1A1A1A',
  },
  textDark: {
    color: '#FFFFFF',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginTop: 32,
  },
  buttonContainer: {
    position: 'relative',
  },
  ripple: {
    position: 'absolute',
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#3B82F6',
    opacity: 0,
  },
  button: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonDark: {
    backgroundColor: '#60A5FA',
  },
  buttonSecondary: {
    backgroundColor: '#F3F4F6',
  },
  buttonSecondaryDark: {
    backgroundColor: '#374151',
  },
});