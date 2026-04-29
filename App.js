// App.js
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  StatusBar,
  I18nManager,
  Platform,
  LogBox,
  View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context"; // ✅ new import

import HomePage from "./src/screens/HomePage";
import DetailsPage from "./src/screens/DetailsPage";
import PrayerPage from "./src/screens/PrayerPage";
import SettingsPage from "./src/screens/SettingsPage";
import BottomNav from "./src/components/BottomNav";
import { COLORS } from "./src/constants/colors";
import mosquesData from "./src/data/mosquesData";
import SearchPage from "./src/screens/SearchPage";
import AIAssistantPage from "./src/ai/AIAssistantPage";
import QiblaCompass from "./src/components/QiblaCompass";

// Ignore common Expo warnings
LogBox.ignoreLogs([
  "Each child in a list should have a unique",
  "VirtualizedLists should never be nested",
]);

export default function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [selectedMosque, setSelectedMosque] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [language, setLanguage] = useState("en");
  const [filters, setFilters] = useState({});
  const [currentTime, setCurrentTime] = useState("");

  // 🕒 Live Clock
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString(language === "ar" ? "ar-SA" : "en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
      );
    }, 1000);
    return () => clearInterval(timer);
  }, [language]);

  // ❤️ Favorite Toggle
  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]
    );
  };

  // 🌍 Language Switch
  const changeLanguage = (newLang) => {
    setLanguage(newLang);
    const isArabic = newLang === "ar";
    if (I18nManager.isRTL !== isArabic) {
      I18nManager.allowRTL(isArabic);
      I18nManager.forceRTL(isArabic);
      if (Platform.OS === "android") {

      }
    }
  };

  // 🕌 Filter Mosques
  const getFilteredMosques = () => {
    let filtered = mosquesData;

    if (filters.favorites && favorites.length > 0)
      filtered = filtered.filter((m) => favorites.includes(m.id));

    if (filters.tafsir)
      filtered = filtered.filter((m) =>
        m.programs.some(
          (p) => p.en.toLowerCase().includes("tafsir") || p.ar.includes("تفسير")
        )
      );

    if (filters.hifdh)
      filtered = filtered.filter((m) =>
        m.programs.some(
          (p) => p.en.toLowerCase().includes("hifdh") || p.ar.includes("تحفيظ")
        )
      );

    if (filters.youthPrograms)
      filtered = filtered.filter((m) =>
        m.programs.some(
          (p) =>
            p.en.toLowerCase().includes("youth") || p.ar.includes("الشباب")
        )
      );

    if (filters.itikaf)
      filtered = filtered.filter((m) =>
        m.facilities?.some(
          (f) => f.en.toLowerCase().includes("itikaf") || f.ar.includes("اعتكاف")
        )
      );

    return filtered;
  };

  const filteredMosques = getFilteredMosques();

  // 📱 Page Navigation
  const renderScreen = () => {
    switch (currentPage) {
      case "home":
        return (
          <HomePage
            isDarkMode={isDarkMode}
            setIsDarkMode={setIsDarkMode}
            setCurrentPage={setCurrentPage}
            filteredMosques={filteredMosques}
            filters={filters}
            setFilters={setFilters}
            language={language}
          />
        );

      case "search":
        return (
          <SearchPage
            isDarkMode={isDarkMode}
            setIsDarkMode={setIsDarkMode}
            setCurrentPage={setCurrentPage}
            filteredMosques={filteredMosques}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
            setSelectedMosque={setSelectedMosque}
            filters={filters}
            setFilters={setFilters}
            language={language}
          />
        );

      case "details":
        return (
          <DetailsPage
            isDarkMode={isDarkMode}
            setIsDarkMode={setIsDarkMode}
            setCurrentPage={setCurrentPage}
            selectedMosque={selectedMosque}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
            language={language}
          />
        );

      case "prayer":
        return (
          <PrayerPage
            isDarkMode={isDarkMode}
            setIsDarkMode={setIsDarkMode}
            language={language}
            currentTime={currentTime}
            setCurrentPage={setCurrentPage}
          />
        );

      case "qibla":
        return (
          <QiblaCompass
            isDarkMode={isDarkMode}
            setCurrentPage={setCurrentPage}
            language={language}
          />
        );

      case "settings":
        return (
          <SettingsPage
            isDarkMode={isDarkMode}
            setIsDarkMode={setIsDarkMode}
            language={language}
            setLanguage={changeLanguage}
            setCurrentPage={setCurrentPage}
          />
        );

      case "ai":
        return (
          <AIAssistantPage
            setCurrentPage={setCurrentPage}
            language={language}
          />
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={[
          styles.container,
          {
            flexDirection: language === "ar" ? "row-reverse" : "row",
            backgroundColor: isDarkMode ? COLORS.darkBrown : COLORS.sandBeige,
          },
        ]}
      >
        <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
        {renderScreen()}

        {/* ✅ Bottom navigation only on main screens */}
        {!["details", "ai", "qibla"].includes(currentPage) && (
          <BottomNav
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            language={language}
          />
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.sandBeige,
  },
});
