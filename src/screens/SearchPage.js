// src/screens/SearchPage.js
import React, { useState } from "react";
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
  I18nManager,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Header from "../components/Header";
import FilterBar from "../components/FilterBar";
import FilterModal from "../components/FilterModal";
import MosqueCard from "../components/MosqueCard";
import { COLORS } from "../constants/colors";
import { translations } from "../constants/translations";

export default function SearchPage({
  isDarkMode,
  setIsDarkMode,
  currentLocation,
  setCurrentPage,
  filteredMosques = [],
  favorites = [],
  toggleFavorite,
  setSelectedMosque,
  filters,
  setFilters,
  language = "en",
}) {
  const [showFilter, setShowFilter] = useState(false);
  const t = translations[language] || translations.en;
  const isRTL = language === "ar" || I18nManager.isRTL;

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? COLORS.darkBrown : COLORS.sandBeige },
        isRTL && styles.containerRTL,
      ]}
    >
      {/* 🕌 Header */}
      <Header
        title={t.masjidFinder}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        currentLocation={currentLocation}
        language={language}
      />

      {/* 🔍 Filter Bar */}
      <FilterBar
        filters={filters}
        onFilterPress={() => setShowFilter(true)}
        language={language}
      />

      {/* 📋 List Header */}
      <View
        style={[
          styles.listHeader,
          isRTL && styles.listHeaderRTL,
          { backgroundColor: COLORS.darkBrown },
        ]}
      >
        <View style={styles.listHeaderText}>
          <Text
            style={[
              styles.listTitle,
              { textAlign: isRTL ? "right" : "left" },
            ]}
          >
            {t.mosqueLists}
          </Text>
          <Text
            style={[
              styles.listSubtitle,
              { textAlign: isRTL ? "right" : "left" },
            ]}
          >
            {t.showing} {filteredMosques.length} {t.mosques} {t.nearYourLocation}
          </Text>
        </View>

        {/* 🗺️ Map View Button */}
        <TouchableOpacity
          style={[styles.mapViewButton, isRTL && styles.mapViewButtonRTL]}
          onPress={() => setCurrentPage("home")}
        >
          <Ionicons
            name="location"
            size={16}
            color={COLORS.white}
            style={isRTL ? { transform: [{ scaleX: -1 }] } : {}}
          />
          <Text style={styles.mapViewButtonText}>{t.mapView}</Text>
        </TouchableOpacity>
      </View>

      {/* 🕌 Mosque List */}
      <ScrollView style={styles.mosqueList}>
        {filteredMosques.length > 0 ? (
          filteredMosques.map((mosque) => (
            <MosqueCard
              key={mosque.id}
              mosque={mosque}
              isFavorite={favorites.includes(mosque.id)}
              onToggleFavorite={toggleFavorite}
              onViewDetails={() => {
                setSelectedMosque(mosque);
                setCurrentPage("details");
              }}
              onGetDirections={() =>
                console.log("Get directions to", mosque.name)
              }
              language={language}
            />
          ))
        ) : (
          <Text
            style={[
              styles.noMosquesText,
              { textAlign: isRTL ? "right" : "center" },
            ]}
          >
            {t.noMosquesFound || "No mosques found nearby."}
          </Text>
        )}
      </ScrollView>

      {/* ⚙️ Filter Modal */}
      <FilterModal
        visible={showFilter}
        onClose={() => setShowFilter(false)}
        filters={filters}
        setFilters={setFilters}
        language={language}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  containerRTL: { direction: "rtl" },
  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  listHeaderRTL: { flexDirection: "row-reverse" },
  listHeaderText: { flex: 1 },
  listTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.white,
  },
  listSubtitle: {
    fontSize: 12,
    color: COLORS.lightBeige,
    marginTop: 2,
  },
  mapViewButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.taupeGray,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  mapViewButtonRTL: { flexDirection: "row-reverse" },
  mapViewButtonText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: "600",
  },
  mosqueList: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    marginBottom: 80,
  },
  noMosquesText: {
    color: COLORS.lightBeige,
    marginTop: 40,
    fontSize: 15,
  },
});
