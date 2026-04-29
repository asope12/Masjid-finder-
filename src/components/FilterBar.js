// src/components/FilterBar.js
import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView,
  I18nManager,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import { translations } from '../constants/translations';

export default function FilterBar({ filters, onFilterPress, language = 'en' }) {
  const t = translations[language] || translations.en;
  const isRTL = language === 'ar' || I18nManager.isRTL;

  return (
    <View
      style={[
        styles.filterBar,
        isRTL && styles.filterBarRTL,
      ]}
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          isRTL && styles.scrollContentRTL,
        ]}
      >
        {/* 🔹 Filters Button */}
        <TouchableOpacity
          style={[styles.filterButton, isRTL && styles.filterButtonRTL]}
          onPress={onFilterPress}
        >
          <Ionicons
            name="filter"
            size={16}
            color={COLORS.white}
            style={isRTL ? { transform: [{ scaleX: -1 }] } : {}}
          />
          <Text
            style={[
              styles.filterButtonText,
              { textAlign: isRTL ? 'right' : 'left' },
            ]}
          >
            {t.allFilters || 'Filters'}
          </Text>

          {/* ✅ Filter count badge */}
          {filters?.activeCount > 0 && (
            <View style={styles.filterBadgeSmall}>
              <Text style={styles.filterBadgeTextSmall}>
                {filters.activeCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>

        {/* 🔹 View All */}
        <TouchableOpacity style={styles.filterChip}>
          <Text
            style={[
              styles.filterChipText,
              { textAlign: isRTL ? 'right' : 'left' },
            ]}
          >
            {t.viewAll || 'View All'}
          </Text>
        </TouchableOpacity>

        {/* 🔹 Open Now */}
        <TouchableOpacity style={styles.filterChip}>
          <Text
            style={[
              styles.filterChipText,
              { textAlign: isRTL ? 'right' : 'left' },
            ]}
          >
            {t.openNow || 'Open Now'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  filterBar: {
    backgroundColor: COLORS.darkBrown,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  filterBarRTL: {
    direction: 'rtl',
  },
  scrollContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scrollContentRTL: {
    flexDirection: 'row-reverse',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.taupeGray,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
    marginRight: 8,
  },
  filterButtonRTL: {
    flexDirection: 'row-reverse',
    marginRight: 0,
    marginLeft: 8,
  },
  filterButtonText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '600',
  },
  filterBadgeSmall: {
    backgroundColor: COLORS.accent,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBadgeTextSmall: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  filterChip: {
    backgroundColor: COLORS.taupeGray,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  filterChipText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '500',
  },
});
