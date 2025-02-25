import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Dimensions,
  Platform,
} from 'react-native';
import { Clock, X, Check } from 'lucide-react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  withTiming,
  useSharedValue,
  interpolate,
} from 'react-native-reanimated';

const { width: WINDOW_WIDTH } = Dimensions.get('window');

interface TimePickerModalProps {
  isVisible: boolean;
  onClose: () => void;
  onConfirm: (minutes: number) => void;
  initialMinutes: number;
  isDark: boolean;
  title: string;
}

export function TimePickerModal({
  isVisible,
  onClose,
  onConfirm,
  initialMinutes,
  isDark,
  title,
}: TimePickerModalProps) {
  const [minutes, setMinutes] = useState(initialMinutes);
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  React.useEffect(() => {
    if (isVisible) {
      scale.value = withSpring(1, { damping: 12 });
      opacity.value = withTiming(1, { duration: 200 });
    } else {
      scale.value = withTiming(0, { duration: 200 });
      opacity.value = withTiming(0, { duration: 200 });
    }
  }, [isVisible]);

  const modalStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const handleMinuteAdjustment = (adjustment: number) => {
    setMinutes((prev) => {
      const newValue = prev + adjustment;
      return Math.max(1, Math.min(60, newValue));
    });
  };

  const timeButtons = [
    { value: 15, label: '15分' },
    { value: 25, label: '25分' },
    { value: 30, label: '30分' },
    { value: 45, label: '45分' },
    { value: 60, label: '60分' },
  ];

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="none"
      statusBarTranslucent
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <Animated.View style={[styles.overlay, overlayStyle]} />
          <TouchableWithoutFeedback>
            <Animated.View
              style={[
                styles.modalContent,
                isDark && styles.modalContentDark,
                modalStyle,
              ]}
            >
              <View style={styles.header}>
                <Clock
                  size={24}
                  color={isDark ? '#FFFFFF' : '#000000'}
                />
                <Text
                  style={[
                    styles.title,
                    isDark && styles.titleDark,
                  ]}
                >
                  {title}
                </Text>
                <TouchableOpacity
                  onPress={onClose}
                  style={styles.closeButton}
                >
                  <X
                    size={24}
                    color={isDark ? '#FFFFFF' : '#000000'}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.timePickerContainer}>
                <View style={styles.currentTime}>
                  <Text
                    style={[
                      styles.timeText,
                      isDark && styles.timeTextDark,
                    ]}
                  >
                    {minutes}分
                  </Text>
                </View>

                <View style={styles.adjustButtons}>
                  <TouchableOpacity
                    style={[
                      styles.adjustButton,
                      isDark && styles.adjustButtonDark,
                    ]}
                    onPress={() => handleMinuteAdjustment(-1)}
                  >
                    <Text
                      style={[
                        styles.adjustButtonText,
                        isDark && styles.adjustButtonTextDark,
                      ]}
                    >
                      -1
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.adjustButton,
                      isDark && styles.adjustButtonDark,
                    ]}
                    onPress={() => handleMinuteAdjustment(1)}
                  >
                    <Text
                      style={[
                        styles.adjustButtonText,
                        isDark && styles.adjustButtonTextDark,
                      ]}
                    >
                      +1
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.presetButtons}>
                  {timeButtons.map((button) => (
                    <TouchableOpacity
                      key={button.value}
                      style={[
                        styles.presetButton,
                        isDark && styles.presetButtonDark,
                        minutes === button.value && styles.presetButtonActive,
                        minutes === button.value &&
                          isDark &&
                          styles.presetButtonActiveDark,
                      ]}
                      onPress={() => setMinutes(button.value)}
                    >
                      <Text
                        style={[
                          styles.presetButtonText,
                          isDark && styles.presetButtonTextDark,
                          minutes === button.value &&
                            styles.presetButtonTextActive,
                        ]}
                      >
                        {button.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.footer}>
                <TouchableOpacity
                  style={[
                    styles.footerButton,
                    styles.cancelButton,
                    isDark && styles.cancelButtonDark,
                  ]}
                  onPress={onClose}
                >
                  <Text
                    style={[
                      styles.footerButtonText,
                      isDark && styles.footerButtonTextDark,
                    ]}
                  >
                    キャンセル
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.footerButton,
                    styles.confirmButton,
                    isDark && styles.confirmButtonDark,
                  ]}
                  onPress={() => onConfirm(minutes)}
                >
                  <Text style={styles.confirmButtonText}>確定</Text>
                  <Check size={20} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: Math.min(WINDOW_WIDTH - 32, 400),
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    ...Platform.select({
      web: {
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      },
    }),
  },
  modalContentDark: {
    backgroundColor: '#1A1A1A',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 12,
    flex: 1,
    color: '#000000',
  },
  titleDark: {
    color: '#FFFFFF',
  },
  closeButton: {
    padding: 8,
  },
  timePickerContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  currentTime: {
    marginBottom: 24,
  },
  timeText: {
    fontSize: 48,
    fontWeight: '700',
    color: '#000000',
  },
  timeTextDark: {
    color: '#FFFFFF',
  },
  adjustButtons: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  adjustButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
  },
  adjustButtonDark: {
    backgroundColor: '#374151',
  },
  adjustButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  adjustButtonTextDark: {
    color: '#FFFFFF',
  },
  presetButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
  presetButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
  },
  presetButtonDark: {
    backgroundColor: '#374151',
  },
  presetButtonActive: {
    backgroundColor: '#3B82F6',
  },
  presetButtonActiveDark: {
    backgroundColor: '#60A5FA',
  },
  presetButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
  },
  presetButtonTextDark: {
    color: '#FFFFFF',
  },
  presetButtonTextActive: {
    color: '#FFFFFF',
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
  },
  footerButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  cancelButton: {
    backgroundColor: '#F3F4F6',
  },
  cancelButtonDark: {
    backgroundColor: '#374151',
  },
  confirmButton: {
    backgroundColor: '#3B82F6',
  },
  confirmButtonDark: {
    backgroundColor: '#60A5FA',
  },
  footerButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  footerButtonTextDark: {
    color: '#FFFFFF',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});