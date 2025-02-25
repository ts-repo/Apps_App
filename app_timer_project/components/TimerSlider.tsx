import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import { useThemeStore } from '../stores/themeStore';

interface TimerSliderProps {
  value: number;
  onValueChange: (value: number) => void;
  minimumValue?: number;
  maximumValue?: number;
}

export function TimerSlider({
  value,
  onValueChange,
  minimumValue = 1,
  maximumValue = 3600,
}: TimerSliderProps) {
  const { theme } = useThemeStore();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getThemeColors = () => {
    switch (theme) {
      case 'dark':
        return {
          thumbTint: '#E8B059',
          minimumTrackTint: '#E8B059',
          maximumTrackTint: '#404040',
        };
      case 'gaming':
        return {
          thumbTint: '#FF0000',
          minimumTrackTint: '#00FF00',
          maximumTrackTint: '#0000FF',
        };
      default:
        return {
          thumbTint: '#E8B059',
          minimumTrackTint: '#E8B059',
          maximumTrackTint: '#E0E0E0',
        };
    }
  };

  const themeColors = getThemeColors();

  return (
    <View style={styles.container}>
      <Text style={[
        styles.timeText,
        theme === 'dark' && styles.timeTextDark,
        theme === 'gaming' && styles.timeTextGaming
      ]}>
        {formatTime(Math.round(value))}
      </Text>
      <Slider
        style={styles.slider}
        value={value}
        minimumValue={minimumValue}
        maximumValue={maximumValue}
        onValueChange={onValueChange}
        step={1}
        {...themeColors}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 20,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  timeText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 8,
    color: '#333333',
  },
  timeTextDark: {
    color: '#FFFFFF',
  },
  timeTextGaming: {
    color: '#FF0000',
    textShadow: '0 0 8px #FF0000',
  },
});