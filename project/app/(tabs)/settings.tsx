import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity } from 'react-native';
import { useThemeStore } from '../../stores/themeStore';
import { TimerSlider } from '../../components/TimerSlider';
import { useTimerStore } from '../../stores/timerStore';
import { Bell, Globe, Type } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LANGUAGES = ['English', '日本語', '한국어', '中文'];
const FONT_SIZES = ['Small', 'Medium', 'Large'];

export default function SettingsScreen() {
  const { theme } = useThemeStore();
  const { workDuration, breakDuration, setWorkDuration, setBreakDuration } = useTimerStore();

  const getThemeStyles = () => {
    switch (theme) {
      case 'dark':
        return {
          backgroundColor: '#121212',
          textColor: '#FFFFFF',
          accentColor: '#4A9DFF',
          secondaryBg: '#2A2A2A',
        };
      case 'gaming':
        return {
          backgroundColor: '#000000',
          textColor: '#00FFFF',
          accentColor: '#0066FF',
          secondaryBg: '#001133',
        };
      default:
        return {
          backgroundColor: '#FFFFFF',
          textColor: '#1A1A1A',
          accentColor: '#3B82F6',
          secondaryBg: '#F3F4F6',
        };
    }
  };

  const themeStyles = getThemeStyles();

  const exportSettings = async () => {
    try {
      const settings = await AsyncStorage.multiGet([
        '@theme_settings',
        '@timer_settings',
        '@app_settings'
      ]);
      const settingsObject = Object.fromEntries(settings);
      const settingsString = JSON.stringify(settingsObject, null, 2);
      // Web環境では、ダウンロードリンクを作成
      const blob = new Blob([settingsString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'focus-timer-settings.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export settings:', error);
    }
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: themeStyles.backgroundColor }]}
      contentContainerStyle={styles.content}
    >
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Clock size={24} color={themeStyles.textColor} />
          <Text style={[styles.sectionTitle, { color: themeStyles.textColor }]}>
            Timer Settings
          </Text>
        </View>
        
        <View style={styles.setting}>
          <Text style={[styles.settingLabel, { color: themeStyles.textColor }]}>
            Work Duration
          </Text>
          <TimerSlider
            value={workDuration}
            onValueChange={setWorkDuration}
            minimumValue={300}
            maximumValue={3600}
          />
        </View>

        <View style={styles.setting}>
          <Text style={[styles.settingLabel, { color: themeStyles.textColor }]}>
            Break Duration
          </Text>
          <TimerSlider
            value={breakDuration}
            onValueChange={setBreakDuration}
            minimumValue={60}
            maximumValue={1800}
          />
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Globe size={24} color={themeStyles.textColor} />
          <Text style={[styles.sectionTitle, { color: themeStyles.textColor }]}>
            Language
          </Text>
        </View>
        
        <View style={styles.languageOptions}>
          {LANGUAGES.map((lang) => (
            <TouchableOpacity
              key={lang}
              style={[
                styles.languageButton,
                { backgroundColor: themeStyles.secondaryBg }
              ]}
            >
              <Text style={[styles.languageButtonText, { color: themeStyles.textColor }]}>
                {lang}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Type size={24} color={themeStyles.textColor} />
          <Text style={[styles.sectionTitle, { color: themeStyles.textColor }]}>
            Font Size
          </Text>
        </View>
        
        <View style={styles.fontSizeOptions}>
          {FONT_SIZES.map((size) => (
            <TouchableOpacity
              key={size}
              style={[
                styles.fontSizeButton,
                { backgroundColor: themeStyles.secondaryBg }
              ]}
            >
              <Text style={[styles.fontSizeButtonText, { color: themeStyles.textColor }]}>
                {size}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Bell size={24} color={themeStyles.textColor} />
          <Text style={[styles.sectionTitle, { color: themeStyles.textColor }]}>
            Notifications
          </Text>
        </View>
        
        <View style={styles.setting}>
          <Text style={[styles.settingLabel, { color: themeStyles.textColor }]}>
            Sound
          </Text>
          <Switch
            trackColor={{ false: '#767577', true: themeStyles.accentColor }}
            thumbColor="#f4f3f4"
          />
        </View>

        <View style={styles.setting}>
          <Text style={[styles.settingLabel, { color: themeStyles.textColor }]}>
            Vibration
          </Text>
          <Switch
            trackColor={{ false: '#767577', true: themeStyles.accentColor }}
            thumbColor="#f4f3f4"
          />
        </View>
      </View>

      <View style={styles.section}>
        <TouchableOpacity
          style={[styles.exportButton, { backgroundColor: themeStyles.accentColor }]}
          onPress={exportSettings}
        >
          <Text style={styles.exportButtonText}>Export Settings</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  setting: {
    marginBottom: 16,
  },
  settingLabel: {
    fontSize: 16,
    marginBottom: 8,
  },
  languageOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  languageButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    minWidth: 100,
    alignItems: 'center',
  },
  languageButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  fontSizeOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  fontSizeButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    alignItems: 'center',
  },
  fontSizeButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  exportButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  exportButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});