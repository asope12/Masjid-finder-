// src/components/Header.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  I18nManager,
  Platform,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import { translations } from '../constants/translations';

export default function Header({
  isDarkMode,
  setIsDarkMode,
  currentLocation,
  title,
  showThemeToggle = true,
  rightContent,
  language = 'en',
}) {
  const t = translations[language] || translations.en;
  const isRTL = language === 'ar' || I18nManager.isRTL;
  const headerTitle = title || t.masjidFinder || 'Masjid Finder';

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        { backgroundColor: isDarkMode ? COLORS.darkBrown : COLORS.lightBeige },
      ]}
    >
      <View
        style={[
          styles.header,
          isDarkMode && styles.headerDark,
          isRTL && styles.headerRTL,
        ]}
      >
        <View style={[styles.headerTop, isRTL && styles.headerTopRTL]}>
          {/* 📍 Left Section (or Right for Arabic) */}
          <View style={[styles.headerLeft, isRTL && styles.headerLeftRTL]}>
            <Ionicons
              name="location"
              size={24}
              color={isDarkMode ? COLORS.white : COLORS.black}
              style={isRTL ? { transform: [{ scaleX: -1 }] } : {}}
            />

            <View style={styles.textContainer}>
              <Text
                style={[
                  styles.headerTitle,
                  isDarkMode && styles.textDark,
                  { textAlign: isRTL ? 'right' : 'left' },
                ]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {headerTitle}
              </Text>

              {currentLocation && (
                <Text
                  style={[
                    styles.headerSubtitle,
                    isDarkMode && styles.textDark,
                    { textAlign: isRTL ? 'right' : 'left' },
                  ]}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {currentLocation}
                </Text>
              )}
            </View>
          </View>

          {/* 🌞🌜 Theme Toggle / Right Content */}
          {rightContent ? (
            rightContent
          ) : (
            showThemeToggle && (
              <View
                style={[
                  styles.themeToggle,
                  isRTL && styles.themeToggleRTL,
                ]}
              >
                <Ionicons
                  name="sunny"
                  size={20}
                  color={isDarkMode ? COLORS.white : COLORS.black}
                  style={isRTL ? { transform: [{ scaleX: -1 }] } : {}}
                />
                <Switch
                  value={isDarkMode}
                  onValueChange={setIsDarkMode}
                  trackColor={{
                    false: COLORS.taupeGray,
                    true: COLORS.darkBrown,
                  }}
                  thumbColor={COLORS.white}
                />
                <Ionicons
                  name="moon"
                  size={20}
                  color={isDarkMode ? COLORS.white : COLORS.black}
                  style={isRTL ? { transform: [{ scaleX: -1 }] } : {}}
                />
              </View>
            )
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    backgroundColor: COLORS.lightBeige,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerDark: {
    backgroundColor: COLORS.darkBrown,
  },
  headerRTL: {
    direction: 'rtl',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTopRTL: {
    flexDirection: 'row-reverse',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 1,
  },
  headerLeftRTL: {
    flexDirection: 'row-reverse',
  },
  textContainer: {
    flexShrink: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  headerSubtitle: {
    fontSize: 12,
    color: COLORS.taupeGray,
    marginTop: 2,
  },
  textDark: {
    color: COLORS.white,
  },
  themeToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  themeToggleRTL: {
    flexDirection: 'row-reverse',
  },
});
