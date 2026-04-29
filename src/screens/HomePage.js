// src/screens/HomePage.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, I18nManager, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import FilterBar from '../components/FilterBar';
import FilterModal from '../components/FilterModal';
import MosqueMapView from '../components/MosqueMapView';
import { COLORS } from '../constants/colors';
import { translations } from '../constants/translations';

export default function HomePage({
  isDarkMode,
  setIsDarkMode,
  currentLocation,
  setCurrentPage,
  filteredMosques = [],
  filters = {},
  setFilters,
  language = 'en',
}) {
  const [showFilter, setShowFilter] = useState(false);

  const t = translations[language] || translations.en;
  const isRTL = language === 'ar' || I18nManager.isRTL;

  // ✅ Safe location formatting
  const formatLocation = (loc) => {
    if (!loc) return '';
    if (typeof loc === 'string') return loc;
    if (typeof loc === 'object' && loc.latitude && loc.longitude)
      return `(${loc.latitude.toFixed(3)}, ${loc.longitude.toFixed(3)})`;
    return '';
  };

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? COLORS.darkBrown : COLORS.lightBeige },
        isRTL && styles.containerRTL,
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* 🕌 Header */}
      <Header
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

      {/* 🗺️ Mosque Map */}
      <View style={styles.mapFullScreen}>
        <MosqueMapView mosques={filteredMosques} language={language} />
      </View>

      {/* 📍 Mosque Info Card */}
      <View
        style={[
          styles.findCard,
          isRTL && styles.findCardRTL,
          { backgroundColor: COLORS.darkBrown },
        ]}
      >
        <View style={[styles.findCardHeader, isRTL && styles.findCardHeaderRTL]}>
          <Ionicons
            name="navigate"
            size={26}
            color={COLORS.white}
            style={isRTL ? { transform: [{ scaleX: -1 }] } : {}}
          />
          <View style={styles.findCardText}>
            <Text
              style={[
                styles.findCardTitle,
                { textAlign: isRTL ? 'right' : 'left' },
              ]}
            >
              {t.findMosques || 'Find Mosques Near You'}
            </Text>
            <Text
              style={[
                styles.findCardSubtitle,
                { textAlign: isRTL ? 'right' : 'left' },
              ]}
            >
              {t.showing} {filteredMosques.length} {t.mosques}{' '}
              {formatLocation(currentLocation)}
            </Text>
          </View>
        </View>

        {/* 🔘 Buttons */}
        <View
          style={[
            styles.findCardButtons,
            isRTL && styles.findCardButtonsRTL,
          ]}
        >
          <TouchableOpacity
            style={styles.findCardButtonPrimary}
            onPress={() => setCurrentPage('search')}
          >
            <Text style={styles.findCardButtonPrimaryText}>
              {t.viewList || 'View List'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.findCardButtonSecondary}
            onPress={() => setCurrentPage('prayer')}
          >
            <Text style={styles.findCardButtonSecondaryText}>
              {t.getDirections || 'Prayer Times'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ⚙️ Filter Modal */}
      <FilterModal
        visible={showFilter}
        onClose={() => setShowFilter(false)}
        filters={filters}
        setFilters={setFilters}
        language={language}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  containerRTL: { direction: 'rtl' },
  mapFullScreen: { flex: 1, marginBottom: 3 },
  findCard: {
    marginHorizontal: 14,
    marginBottom: 50,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    shadowColor: '#0f0b0bff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  findCardRTL: { direction: 'rtl' },
  findCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  findCardHeaderRTL: { flexDirection: 'row-reverse' },
  findCardText: { flex: 1 },
  findCardTitle: { color: COLORS.white, fontSize: 16, fontWeight: 'bold' },
  findCardSubtitle: { color: COLORS.lightBeige, fontSize: 13, marginTop: 2 },
  findCardButtons: { flexDirection: 'row', gap: 8 },
  findCardButtonsRTL: { flexDirection: 'row-reverse' },
  findCardButtonPrimary: {
    flex: 1,
    backgroundColor: COLORS.lightBeige,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  findCardButtonPrimaryText: {
    color: COLORS.darkBrown,
    fontWeight: '700',
    fontSize: 13,
  },
  findCardButtonSecondary: {
    flex: 1,
    backgroundColor: COLORS.taupeGray,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  findCardButtonSecondaryText: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: 13,
  },
});
