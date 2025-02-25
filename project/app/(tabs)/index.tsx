import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Play, Pause, RotateCcw, Clock, Coffee } from 'lucide-react-native';
import { useTimerStore } from '../../stores/timerStore';
import { useThemeStore } from '../../stores/themeStore';
import { ThemeToggle } from '../../components/ThemeToggle';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue,
  withSpring,
  withTiming,
  Easing,
  withSequence,
  withRepeat
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');
const TIMER_SIZE = Math.min(width * 0.7, height * 0.4);
const STROKE_WIDTH = 12;

export default function TimerScreen() {
  const { 
    timeLeft,
    isRunning,
    isWorkSession,
    workDuration,
    breakDuration,
    startTimer,
    pauseTimer,
    resetTimer,
    toggleSession
  } = useTimerStore();

  const { theme } = useThemeStore();

  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);

  const currentDuration = isWorkSession ? workDuration : breakDuration;
  // プログレスバーの計算を修正
  const progress = (timeLeft / currentDuration) * 360;

  // アニメーションの設定を改善
  rotation.value = withTiming(-progress, {
    duration: 500,
    easing: Easing.bezier(0.25, 0.1, 0.25, 1),
  });

  // ボタンのアニメーション
  const buttonPress = () => {
    scale.value = withSequence(
      withTiming(0.9, { duration: 100 }),
      withTiming(1, { duration: 100 })
    );
  };

  const circleStyle = useAnimatedStyle(() => ({
    transform: [
      { rotateZ: '-90deg' },  // 開始位置を3時の位置に設定
      { rotateZ: `${rotation.value}deg` }  // 反時計回りに回転
    ],
  }));

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getThemeStyles = () => {
    switch (theme) {
      case 'dark':
        return {
          backgroundColor: '#121212',
          textColor: '#FFFFFF',
          accentColor: '#4A9DFF',
          secondaryBg: '#2A2A2A',
          progressBg: '#333333',
        };
      case 'gaming':
        return {
          backgroundColor: '#000000',
          textColor: '#00FFFF',
          accentColor: '#0066FF',
          secondaryBg: '#001133',
          progressBg: '#002266',
        };
      default:
        return {
          backgroundColor: '#FFFFFF',
          textColor: '#1A1A1A',
          accentColor: '#3B82F6',
          secondaryBg: '#F3F4F6',
          progressBg: '#E5E7EB',
        };
    }
  };

  const themeStyles = getThemeStyles();

  return (
    <View style={[styles.container, { backgroundColor: themeStyles.backgroundColor }]}>
      <View style={[styles.header, { backgroundColor: themeStyles.backgroundColor }]}>
        <Text style={[styles.title, { color: themeStyles.textColor }]}>Focus Timer</Text>
        <ThemeToggle />
      </View>

      <View style={styles.timerContainer}>
        <View style={[styles.timerBackground, { backgroundColor: themeStyles.secondaryBg }]}>
          <View style={styles.timerCircleContainer}>
            <View style={[styles.circleBase, { borderColor: themeStyles.progressBg }]} />
            <Animated.View
              style={[
                styles.circleBase,
                styles.circleProgress,
                { borderColor: themeStyles.accentColor },
                circleStyle
              ]}
            />
            <View style={styles.timerContent}>
              <View style={styles.sessionTypeContainer}>
                {isWorkSession ? (
                  <Clock size={24} color={themeStyles.textColor} />
                ) : (
                  <Coffee size={24} color={themeStyles.textColor} />
                )}
                <Text style={[styles.sessionType, { color: themeStyles.textColor }]}>
                  {isWorkSession ? 'Work' : 'Break'}
                </Text>
              </View>
              <Text style={[styles.timer, { color: themeStyles.textColor }]}>
                {formatTime(timeLeft)}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.controls}>
        <Animated.View style={buttonStyle}>
          <TouchableOpacity 
            style={[styles.button, { backgroundColor: themeStyles.accentColor }]} 
            onPress={() => {
              buttonPress();
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
        
        <Animated.View style={buttonStyle}>
          <TouchableOpacity 
            style={[
              styles.button,
              styles.buttonSecondary,
              { backgroundColor: themeStyles.secondaryBg }
            ]} 
            onPress={() => {
              buttonPress();
              resetTimer();
            }}
          >
            <RotateCcw size={32} color={themeStyles.accentColor} />
          </TouchableOpacity>
        </Animated.View>
      </View>

      <TouchableOpacity 
        style={[styles.sessionToggle, { backgroundColor: themeStyles.secondaryBg }]}
        onPress={toggleSession}
      >
        <Text style={[styles.sessionToggleText, { color: themeStyles.textColor }]}>
          Switch to {isWorkSession ? 'Break' : 'Work'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  timerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerBackground: {
    width: TIMER_SIZE + 40,
    height: TIMER_SIZE + 40,
    borderRadius: (TIMER_SIZE + 40) / 2,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
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
  },
  circleProgress: {
    borderLeftColor: 'transparent',
    borderBottomColor: 'transparent',
    transform: [{ rotateZ: '-90deg' }],
  },
  timerContent: {
    alignItems: 'center',
  },
  sessionTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sessionType: {
    fontSize: 20,
    fontWeight: '600',
  },
  timer: {
    fontSize: 56,
    fontWeight: '700',
    fontFamily: 'monospace',
    letterSpacing: 2,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 32,
  },
  button: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonSecondary: {
    borderWidth: 0,
  },
  sessionToggle: {
    marginHorizontal: 20,
    marginBottom: 32,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  sessionToggleText: {
    fontSize: 16,
    fontWeight: '600',
  },
});