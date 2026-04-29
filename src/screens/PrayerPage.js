// src/screens/PrayerPage.js
import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  I18nManager,
} from "react-native";
import Header from "../components/Header";
import { COLORS } from "../constants/colors";
import { translations } from "../constants/translations";

export default function PrayerPage({
  isDarkMode,
  setIsDarkMode,
  language,
  setCurrentPage,
}) {
  const t = translations[language] || translations.en;
  const isRTL = language === "ar" || I18nManager.isRTL;

  // 🎨 Color theme
  const theme = {
    background: isDarkMode ? COLORS.darkBrown : COLORS.sandBeige,
    card: isDarkMode ? "#3E2F2F" : COLORS.lightBeige,
    button: isDarkMode ? COLORS.accent : COLORS.darkBrown,
    textPrimary: isDarkMode ? COLORS.lightBeige : COLORS.darkBrown,
    textSecondary: isDarkMode ? COLORS.sandBeige : COLORS.taupeGray,
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <Header
        title={t.prayerTimes}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        language={language}
      />

      <View style={[styles.container, { backgroundColor: theme.background }]}>
        {/* 🧭 Qibla Compass Button */}
        <TouchableOpacity
          style={[styles.qiblaButton, { backgroundColor: theme.button }]}
          onPress={() => setCurrentPage("qibla")}
        >
          <Text style={[styles.qiblaButtonText, { color: COLORS. white}]}>
            🧭 {t.qiblaCompass}
          </Text>
        </TouchableOpacity>

        {/* 🕰 Prayer Times */}
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <Text
            style={[
              styles.title,
              { color: theme.textPrimary, textAlign: isRTL ? "right" : "left" },
            ]}
          >
            {t.todaysPrayer}
          </Text>

          {[
            [t.fajr, "05:12 AM"],
            [t.dhuhr, "12:35 PM"],
            [t.asr, "03:45 PM"],
            [t.maghrib, "06:15 PM"],
            [t.isha, "07:45 PM"],
          ].map(([name, time]) => (
            <View style={styles.timeRow} key={name}>
              <Text style={[styles.timeLabel, { color: theme.textPrimary }]}>{time}</Text>
              <Text style={[styles.timeValue, { color: theme.textSecondary }]}>{name}</Text>
            </View>
          ))}
        </View>

        {/* 🌙 Next Prayer */}
        <View style={[styles.nextPrayerCard, { backgroundColor: theme.card }]}>
          <Text style={[styles.nextLabel, { color: theme.textSecondary }]}>
            {t.nextPrayer || "Next Prayer"}: {t.fajr}
          </Text>
          <Text style={[styles.nextTime, { color: theme.textPrimary }]}>05:12 AM</Text>
          <Text style={[styles.nextCountdown, { color: theme.textSecondary }]}>
            {t.in || "in"} 3h 42m
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: {
    flex: 1,
    alignItems: "center",
    padding: 16,
  },
  qiblaButton: {
    width: "100%",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  qiblaButtonText: {
    fontWeight: "700",
    fontSize: 16,
  },
  card: {
    width: "100%",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 6,
  },
  timeLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
  timeValue: {
    fontSize: 16,
    fontWeight: "500",
  },
  nextPrayerCard: {
    width: "100%",
    borderRadius: 12,
    alignItems: "center",
    paddingVertical: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  nextLabel: {
    fontSize: 15,
  },
  nextTime: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 4,
  },
  nextCountdown: {
    fontSize: 14,
    marginTop: 4,
  },
});
