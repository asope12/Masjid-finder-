// src/screens/SettingsPage.js
import React, { useState } from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  I18nManager,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import { COLORS } from '../constants/colors';
import { translations } from '../constants/translations';

export default function SettingsPage({
  isDarkMode,
  setIsDarkMode,
  language = 'en',
  setLanguage,
  setCurrentPage,
}) {
  const t = translations[language] || translations.en;
  const [prayerNotifications, setPrayerNotifications] = useState(false);
  const [locationServices, setLocationServices] = useState(false);

  // 🎨 Dynamic theme colors
  const theme = {
    background: isDarkMode ? COLORS.darkBrown : COLORS.sandBeige,
    card: isDarkMode ? COLORS.taupeGray : COLORS.lightBeige, // ✅ fixed: lighter card in light mode
    text: isDarkMode ? COLORS.lightBeige : COLORS.darkBrown,
    subtitle: isDarkMode ? COLORS.sandBeige : COLORS.taupeGray,
  };

  // 🌍 Language change handler
  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    const isArabic = lang === 'ar';
    if (I18nManager.isRTL !== isArabic) {
      I18nManager.allowRTL(isArabic);
      I18nManager.forceRTL(isArabic);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView style={styles.settingsContent}>
        {/* 🕌 Header */}
        <Header
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
          title={t.settings}
          currentLocation={null}
          showThemeToggle={false}
          language={language}
        />

        {/* 🌙 Dark Mode */}
        <View style={[styles.settingCard, { backgroundColor: theme.card }]}>
          <Text style={[styles.settingLabel, { color: theme.text }]}>
            {t.darkMode}
          </Text>
          <Switch
            value={isDarkMode}
            onValueChange={setIsDarkMode}
            trackColor={{ false: COLORS.taupeGray, true: COLORS.accent }}
            thumbColor={COLORS.white}
          />
        </View>

        {/* 🌐 Language */}
        <View style={[styles.settingCard, { backgroundColor: theme.card }]}>
          <Text style={[styles.settingLabel, { color: theme.text }]}>
            {t.languageSettings}
          </Text>
          <View style={styles.languageButtons}>
            <TouchableOpacity
              style={[
                styles.languageButton,
                language === 'en' && { backgroundColor: COLORS.accent },
              ]}
              onPress={() => handleLanguageChange('en')}
            >
              <Text
                style={[
                  styles.languageButtonText,
                  { color: language === 'en' ? COLORS.darkBrown : COLORS.white },
                ]}
              >
                {t.english}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.languageButton,
                language === 'ar' && { backgroundColor: COLORS.accent },
              ]}
              onPress={() => handleLanguageChange('ar')}
            >
              <Text
                style={[
                  styles.languageButtonText,
                  { color: language === 'ar' ? COLORS.darkBrown : COLORS.white },
                ]}
              >
                {t.arabic}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ⚙️ Preferences */}
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          {language === 'ar' ? 'التفضيلات' : 'Preferences'}
        </Text>

        <View style={[styles.settingCard, { backgroundColor: theme.card }]}>
          <View style={styles.settingRow}>
            <Ionicons name="notifications" size={20} color={theme.text} />
            <Text style={[styles.settingLabel, { color: theme.text }]}>
              {t.prayerNotifications || 'Prayer Notifications'}
            </Text>
          </View>
          <Switch
            value={prayerNotifications}
            onValueChange={setPrayerNotifications}
            trackColor={{ false: COLORS.taupeGray, true: COLORS.accent }}
            thumbColor={COLORS.white}
          />
        </View>

        <View style={[styles.settingCard, { backgroundColor: theme.card }]}>
          <View style={styles.settingRow}>
            <Ionicons name="location" size={20} color={theme.text} />
            <Text style={[styles.settingLabel, { color: theme.text }]}>
              {t.locationServices || 'Location Services'}
            </Text>
          </View>
          <Switch
            value={locationServices}
            onValueChange={setLocationServices}
            trackColor={{ false: COLORS.taupeGray, true: COLORS.accent }}
            thumbColor={COLORS.white}
          />
        </View>

        {/* 👤 Account */}
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          {language === 'ar' ? 'الحساب' : 'Account'}
        </Text>

        <TouchableOpacity
          style={[styles.settingCardButton, { backgroundColor: theme.card }]}
        >
          <View style={styles.settingRow}>
            <Ionicons name="person" size={20} color={theme.text} />
            <View style={styles.settingTextContainer}>
              <Text style={[styles.settingLabel, { color: theme.text }]}>
                {t.profile || 'Profile'}
              </Text>
              <Text style={[styles.settingSubtitle, { color: theme.subtitle }]}>
                {t.manageProfile || 'Manage your profile'}
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color={theme.text} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.settingCardButton, { backgroundColor: theme.card }]}
        >
          <View style={styles.settingRow}>
            <Ionicons name="heart" size={20} color={theme.text} />
            <View style={styles.settingTextContainer}>
              <Text style={[styles.settingLabel, { color: theme.text }]}>
                {t.favorites}
              </Text>
              <Text style={[styles.settingSubtitle, { color: theme.subtitle }]}>
                {t.savedMosques || '0 saved mosques'}
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color={theme.text} />
        </TouchableOpacity>

        {/* 💬 Support */}
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          {language === 'ar' ? 'الدعم' : 'Support'}
        </Text>

        <TouchableOpacity
          style={[styles.settingCardButton, { backgroundColor: theme.card }]}
          onPress={() => setCurrentPage('ai')}
        >
          <View style={styles.settingRow}>
            <Ionicons name="chatbubbles" size={20} color={theme.text} />
            <Text style={[styles.settingLabel, { color: theme.text }]}>
              {language === 'ar' ? 'المساعد الذكي' : 'AI Assistant'}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={theme.text} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.settingCardButton, { backgroundColor: theme.card }]}
        >
          <View style={styles.settingRow}>
            <Ionicons name="help-circle" size={20} color={theme.text} />
            <Text style={[styles.settingLabel, { color: theme.text }]}>
              {t.help || 'Help & FAQ'}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={theme.text} />
        </TouchableOpacity>

        {/* 🕌 About Section */}
        <View style={[styles.aboutCard, { backgroundColor: theme.card }]}>
          <View
            style={[
              styles.aboutIconContainer,
              { backgroundColor: isDarkMode ? COLORS.darkBrown : COLORS.taupeGray },
            ]}
          >
            <Ionicons name="location" size={40} color={theme.text} />
          </View>
          <Text style={[styles.aboutTitle, { color: theme.text }]}>
            {t.masjidFinder}
          </Text>
          <Text style={[styles.aboutDescription, { color: theme.subtitle }]}>
            {t.aboutDescription ||
              'Connecting the Muslim community to nearby mosques with Quran programs and Islamic services.'}
          </Text>
          <Text style={[styles.aboutFooter, { color: theme.subtitle }]}>
            {t.madeWithLove || 'Made with ❤️ for the Muslim community'}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  settingsContent: { flex: 1, padding: 16, marginBottom: 80 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 12,
  },
  settingCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  settingCardButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  settingRow: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  settingTextContainer: { flex: 1 },
  settingLabel: { fontSize: 16, fontWeight: '500' },
  settingSubtitle: { fontSize: 13, marginTop: 2 },
  languageButtons: { flexDirection: 'row', gap: 12 },
  languageButton: {
    backgroundColor: COLORS.taupeGray,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  languageButtonText: { fontWeight: '500' },
  aboutCard: {
    borderRadius: 16,
    padding: 24,
    marginTop: 20,
    marginBottom: 32,
    alignItems: 'center',
  },
  aboutIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  aboutTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  aboutDescription: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 16,
  },
  aboutFooter: { fontSize: 13, fontStyle: 'italic' },
});
