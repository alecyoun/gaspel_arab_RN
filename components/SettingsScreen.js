import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { SettingsManager } from './SettingsManager';

const SettingsScreen = ({ navigation }) => {
  const [settings, setSettings] = useState({
    fontSize: 16,
    darkMode: false,
    theme: 'light',
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const loaded = await SettingsManager.getSettings();
    setSettings(loaded);
  };

  const updateSetting = async (key, value) => {
    const updated = { ...settings, [key]: value };
    setSettings(updated);
    await SettingsManager.updateSettings({ [key]: value });
  };

  const handleReset = () => {
    Alert.alert(
      'إعادة تعيين الإعدادات',
      'هل أنت متأكد من إعادة تعيين جميع الإعدادات إلى القيم الافتراضية؟',
      [
        { text: 'إلغاء', style: 'cancel' },
        {
          text: 'إعادة تعيين',
          style: 'destructive',
          onPress: async () => {
            const reset = await SettingsManager.resetSettings();
            setSettings(reset);
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.container, settings.darkMode && styles.darkContainer]}>
      <View style={[styles.header, settings.darkMode && styles.darkHeader]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon name="arrow-back" size={28} color={settings.darkMode ? '#fff' : '#333'} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, settings.darkMode && styles.darkText]}>الإعدادات</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        <View style={[styles.section, settings.darkMode && styles.darkSection]}>
          <Text style={[styles.sectionTitle, settings.darkMode && styles.darkText]}>المظهر</Text>
          
          <View style={[styles.settingItem, settings.darkMode && styles.darkItem]}>
            <View style={styles.settingLeft}>
              <Icon name="moon" size={24} color={settings.darkMode ? '#fff' : '#333'} />
              <Text style={[styles.settingLabel, settings.darkMode && styles.darkText]}>الوضع الداكن</Text>
            </View>
            <Switch
              value={settings.darkMode}
              onValueChange={(value) => updateSetting('darkMode', value)}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={settings.darkMode ? '#f5dd4b' : '#f4f3f4'}
            />
          </View>
        </View>

        <View style={[styles.section, settings.darkMode && styles.darkSection]}>
          <Text style={[styles.sectionTitle, settings.darkMode && styles.darkText]}>حجم الخط</Text>
          
          <View style={[styles.settingItem, settings.darkMode && styles.darkItem]}>
            <Text style={[styles.settingLabel, settings.darkMode && styles.darkText]}>صغير</Text>
            <TouchableOpacity
              style={[
                styles.fontSizeButton,
                settings.fontSize === 14 && styles.fontSizeButtonActive,
              ]}
              onPress={() => updateSetting('fontSize', 14)}
            >
              <Text style={styles.fontSizeButtonText}>Aa</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.settingItem, settings.darkMode && styles.darkItem]}>
            <Text style={[styles.settingLabel, settings.darkMode && styles.darkText]}>متوسط</Text>
            <TouchableOpacity
              style={[
                styles.fontSizeButton,
                settings.fontSize === 16 && styles.fontSizeButtonActive,
              ]}
              onPress={() => updateSetting('fontSize', 16)}
            >
              <Text style={[styles.fontSizeButtonText, { fontSize: 18 }]}>Aa</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.settingItem, settings.darkMode && styles.darkItem]}>
            <Text style={[styles.settingLabel, settings.darkMode && styles.darkText]}>كبير</Text>
            <TouchableOpacity
              style={[
                styles.fontSizeButton,
                settings.fontSize === 18 && styles.fontSizeButtonActive,
              ]}
              onPress={() => updateSetting('fontSize', 18)}
            >
              <Text style={[styles.fontSizeButtonText, { fontSize: 22 }]}>Aa</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.section, settings.darkMode && styles.darkSection]}>
          <TouchableOpacity
            style={[styles.resetButton, settings.darkMode && styles.darkResetButton]}
            onPress={handleReset}
          >
            <Icon name="refresh" size={20} color={settings.darkMode ? '#fff' : '#ff3b30'} />
            <Text style={[styles.resetButtonText, settings.darkMode && styles.darkText]}>
              إعادة تعيين الإعدادات
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
  },
  darkContainer: {
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  darkHeader: {
    borderBottomColor: '#333',
    backgroundColor: '#000',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    writingDirection: 'rtl',
  },
  darkText: {
    color: '#fff',
  },
  placeholder: {
    width: 44,
  },
  content: {
    flex: 1,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  darkSection: {
    // dark section styles
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 12,
    textTransform: 'uppercase',
    writingDirection: 'rtl',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  darkItem: {
    borderBottomColor: '#333',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
    writingDirection: 'rtl',
  },
  fontSizeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  fontSizeButtonActive: {
    borderColor: '#007AFF',
    backgroundColor: '#007AFF',
  },
  fontSizeButtonText: {
    fontSize: 14,
    color: '#333',
    fontWeight: 'bold',
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: '#ff3b30',
    borderRadius: 10,
    marginTop: 8,
  },
  darkResetButton: {
    borderColor: '#ff3b30',
  },
  resetButtonText: {
    fontSize: 16,
    color: '#ff3b30',
    marginLeft: 8,
    fontWeight: '600',
    writingDirection: 'rtl',
  },
});

export default SettingsScreen;





