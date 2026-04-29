import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Header from "../components/Header";
import { COLORS } from "../constants/colors";
import { translations } from "../constants/translations";
import { getLocalizedText } from "../utils/getLocalizedText";

export default function DetailsPage({
  isDarkMode,
  setIsDarkMode,
  currentLocation,
  setCurrentPage,
  selectedMosque,
  favorites = [],
  toggleFavorite,
  language = "en",
}) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const t = translations[language] || translations.en;

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!selectedMosque) return null;

  // 🧭 Open map
  const openGoogleMaps = () => {
    const lat = selectedMosque.latitude;
    const lng = selectedMosque.longitude;
    const url = Platform.select({
      ios: `maps://app?daddr=${lat},${lng}`,
      android: `geo:${lat},${lng}?q=${lat},${lng}`,
    });

    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) Linking.openURL(url);
        else Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`);
      })
      .catch((err) => console.error("Failed to open map", err));
  };

  // 🕌 Prayer times
  const prayerTimes = [
    { name: t?.fajr || "Fajr", time: "05:12 AM", hour: 5, minute: 12 },
    { name: t?.dhuhr || "Dhuhr", time: "12:35 PM", hour: 12, minute: 35 },
    { name: t?.asr || "Asr", time: "03:45 PM", hour: 15, minute: 45 },
    { name: t?.maghrib || "Maghrib", time: "06:15 PM", hour: 18, minute: 15 },
    { name: t?.isha || "Isha", time: "07:45 PM", hour: 19, minute: 45 },
  ];

  // 🔄 Next prayer
  const getNextPrayer = () => {
    const now = currentTime;
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    for (let i = 0; i < prayerTimes.length; i++) {
      const prayerMinutes = prayerTimes[i].hour * 60 + prayerTimes[i].minute;
      if (currentMinutes < prayerMinutes) {
        const diff = prayerMinutes - currentMinutes;
        const hours = Math.floor(diff / 60);
        const minutes = diff % 60;
        return {
          name: prayerTimes[i].name,
          time: prayerTimes[i].time,
          timeUntil: `${hours}h ${minutes}m`,
        };
      }
    }
    const tomorrowFajr = prayerTimes[0].hour * 60 + prayerTimes[0].minute;
    const minutesUntilMidnight = 24 * 60 - currentMinutes;
    const diff = minutesUntilMidnight + tomorrowFajr;
    const hours = Math.floor(diff / 60);
    const minutes = diff % 60;
    return {
      name: prayerTimes[0].name,
      time: prayerTimes[0].time,
      timeUntil: `${hours}h ${minutes}m`,
    };
  };

  const nextPrayer = getNextPrayer();

  const formatTime = (date) => {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  return (
    <View style={styles.container}>
      <Header
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        currentLocation={currentLocation}
        language={language}
      />

      <ScrollView style={styles.scrollView}>
        {/* 🕌 Mosque Image */}
        <View style={styles.detailsImageContainer}>
          <Image
            source={{ uri: selectedMosque.image }}
            style={styles.detailsImage}
            resizeMode="cover"
          />
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setCurrentPage("search")}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.darkBrown} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={() => toggleFavorite(selectedMosque.id)}
          >
            <Ionicons
              name={favorites.includes(selectedMosque.id) ? "heart" : "heart-outline"}
              size={24}
              color={favorites.includes(selectedMosque.id) ? COLORS.red : COLORS.darkBrown}
            />
          </TouchableOpacity>
        </View>

        {/* 🕌 Mosque Info */}
        <View style={styles.detailsInfo}>
          <View style={styles.detailsTitleRow}>
            <Image
              source={{ uri: selectedMosque.image }}
              style={styles.detailsThumb}
              resizeMode="cover"
            />
            <View style={styles.detailsTitleInfo}>
              <Text style={styles.detailsTitle}>
                {getLocalizedText(selectedMosque.name, language)}
              </Text>
              {selectedMosque.area && (
                <Text style={styles.detailsLocation}>
                  {getLocalizedText(selectedMosque.area, language)}
                </Text>
              )}
            </View>
          </View>

          {/* 🕰 Current & Next Prayer */}
          <View style={styles.currentTimeSection}>
            <View style={styles.currentTimeCard}>
              <Text style={styles.currentTimeLabel}>{t?.currentTime || "Current Time"}</Text>
              <Text style={styles.currentTimeValue}>{formatTime(currentTime)}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.nextPrayerCard}>
              <View style={styles.nextPrayerHeader}>
                <Ionicons name="sunny" size={20} color={COLORS.lightBeige} />
                <Text style={styles.nextPrayerLabel}>
                  {(t?.nextPrayer || "Next Prayer")}: {nextPrayer.name}
                </Text>
              </View>
              <Text style={styles.nextPrayerTime}>{nextPrayer.time}</Text>
              <View style={styles.timeUntilBadge}>
                <Text style={styles.timeUntilText}>
                  {(t?.in || "in")} {nextPrayer.timeUntil}
                </Text>
              </View>
            </View>
          </View>

          {/* 🧭 Directions */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.directionsButtonLarge} onPress={openGoogleMaps}>
              <Ionicons name="navigate" size={20} color={COLORS.darkBrown} />
              <Text style={styles.directionsButtonLargeText}>
                {t?.getDirections || "Get Directions"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* 📚 Quran Programs */}
          <View style={styles.programsSection}>
            <View style={styles.programsSectionHeader}>
              <Ionicons name="book" size={20} color={COLORS.white} />
              <Text style={styles.programsSectionTitle}>
                {t?.quranPrograms || "Quran Programs"}
              </Text>
            </View>
            <View style={styles.programsList}>
              {selectedMosque.programs && selectedMosque.programs.length > 0 ? (
                selectedMosque.programs.map((program, idx) => (
                  <View key={idx} style={styles.programTagLarge}>
                    <Text style={styles.programTagTextLarge}>
                      {getLocalizedText(program, language)}
                    </Text>
                  </View>
                ))
              ) : (
                <Text style={styles.programTagTextLarge}>
                  {t?.noPrograms || "No programs available"}
                </Text>
              )}
            </View>
          </View>

          {/* 🕋 Prayer Times */}
          <View style={styles.prayerTimesSection}>
            <View style={styles.prayerTimesHeader}>
              <Ionicons name="time" size={20} color={COLORS.white} />
              <Text style={styles.prayerTimesTitle}>
                {t?.prayerTimes || "Prayer Times"}
              </Text>
              <View style={styles.todayBadge}>
                <Text style={styles.todayBadgeText}>{t?.today || "Today"}</Text>
              </View>
            </View>

            <View style={styles.prayerTimesList}>
              {prayerTimes.map((prayer, idx) => (
                <View key={idx} style={styles.prayerTimeRow}>
                  <Text style={styles.prayerName}>{prayer.name}</Text>
                  <Text style={styles.prayerTime}>{prayer.time}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1, marginBottom: 80 },
  detailsImageContainer: { position: "relative", height: 260 },
  detailsImage: { width: "100%", height: "100%", backgroundColor: COLORS.taupeGray },
  backButton: {
    position: "absolute",
    top: 16,
    left: 16,
    backgroundColor: COLORS.white,
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  favoriteButton: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: COLORS.white,
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  detailsInfo: { backgroundColor: COLORS.darkBrown, padding: 20 },
  detailsTitleRow: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 12 },
  detailsThumb: { width: 60, height: 60, borderRadius: 12, backgroundColor: COLORS.taupeGray },
  detailsTitleInfo: { flex: 1 },
  detailsTitle: { fontSize: 20, fontWeight: "bold", color: COLORS.white, marginBottom: 6 },
  detailsLocation: { fontSize: 14, color: COLORS.lightBeige },
  currentTimeSection: {
    backgroundColor: COLORS.taupeGray,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  currentTimeCard: { alignItems: "center", marginBottom: 16 },
  currentTimeLabel: { fontSize: 14, color: COLORS.lightBeige, marginBottom: 8 },
  currentTimeValue: { fontSize: 48, fontWeight: "bold", color: COLORS.white },
  divider: { height: 1, backgroundColor: "rgba(255,255,255,0.1)", marginVertical: 16 },
  nextPrayerCard: { alignItems: "center" },
  nextPrayerHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12 },
  nextPrayerLabel: { fontSize: 14, color: COLORS.lightBeige },
  nextPrayerTime: { fontSize: 36, fontWeight: "bold", color: COLORS.white, marginBottom: 12 },
  timeUntilBadge: {
    backgroundColor: COLORS.darkBrown,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  timeUntilText: { color: COLORS.white, fontSize: 14, fontWeight: "600" },
  actionButtons: { flexDirection: "row", gap: 12, marginBottom: 24 },
  directionsButtonLarge: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.lightBeige,
    paddingVertical: 14,
    borderRadius: 10,
    gap: 8,
  },
  directionsButtonLargeText: { color: COLORS.darkBrown, fontWeight: "600", fontSize: 15 },
  programsSection: {
    backgroundColor: COLORS.taupeGray,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  programsSectionHeader: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 16 },
  programsSectionTitle: { fontSize: 16, fontWeight: "bold", color: COLORS.white },
  programsList: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  programTagLarge: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  programTagTextLarge: { fontSize: 13, color: COLORS.darkBrown, fontWeight: "500" },
  prayerTimesSection: { backgroundColor: COLORS.taupeGray, borderRadius: 16, padding: 16 },
  prayerTimesHeader: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 16 },
  prayerTimesTitle: { fontSize: 16, fontWeight: "bold", color: COLORS.white, flex: 1 },
  todayBadge: {
    backgroundColor: COLORS.darkBrown,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  todayBadgeText: { color: COLORS.white, fontSize: 12, fontWeight: "600" },
  prayerTimesList: { gap: 12 },
  prayerTimeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  prayerName: { fontSize: 15, color: COLORS.white },
  prayerTime: { fontSize: 15, color: COLORS.lightBeige, fontWeight: "600" },
});
