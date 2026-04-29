// src/components/FilterModal.js
import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  I18nManager,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import { translations } from '../constants/translations';

const { height } = Dimensions.get('window');

export default function FilterModal({
  visible,
  onClose,
  filters,
  setFilters,
  language = 'en',
}) {
  const t = translations[language] || translations.en;
  const isRTL = language === 'ar' || I18nManager.isRTL;

  const calculateActiveFilters = (newFilters) => {
    let count = 0;
    const keys = [
      'favorites',
      'itikaf',
      'hifdh',
      'tafsir',
      'islamicLessons',
      'youthPrograms',
      'fridayPrayer',
    ];
    keys.forEach((k) => {
      if (newFilters[k]) count++;
    });
    return count;
  };

  const toggleFilter = (filterName) => {
    const newFilters = { ...filters, [filterName]: !filters[filterName] };
    newFilters.activeCount = calculateActiveFilters(newFilters);
    setFilters(newFilters);
  };

  const clearAllFilters = () => {
    setFilters({
      activeCount: 0,
      tafsir: false,
      distance: 20,
      rating: 4,
      favorites: false,
      itikaf: false,
      hifdh: false,
      islamicLessons: false,
      youthPrograms: false,
      fridayPrayer: false,
    });
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View
          style={[
            styles.filterModal,
            isRTL && styles.filterModalRTL,
          ]}
        >
          {/* 🔹 Header */}
          <View
            style={[
              styles.filterHeader,
              isRTL && styles.filterHeaderRTL,
            ]}
          >
            <View
              style={[
                styles.filterTitleRow,
                isRTL && styles.filterTitleRowRTL,
              ]}
            >
              <Ionicons
                name="filter"
                size={28}
                color={COLORS.white}
                style={isRTL ? { transform: [{ scaleX: -1 }] } : {}}
              />
              <Text
                style={[
                  styles.filterTitle,
                  { textAlign: isRTL ? 'right' : 'left' },
                ]}
              >
                {t.filterMosques || 'Filter Mosques'}
              </Text>
            </View>

            <View
              style={[
                styles.filterHeaderRight,
                isRTL && styles.filterHeaderRightRTL,
              ]}
            >
              <View style={styles.filterBadge}>
                <Text style={styles.filterBadgeText}>
                  {filters?.activeCount || 0}
                </Text>
              </View>
              <TouchableOpacity onPress={clearAllFilters}>
                <Text style={styles.clearFilters}>
                  {t.clearAllFilters || 'Clear All Filters'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={onClose}>
                <Ionicons
                  name="close"
                  size={28}
                  color={COLORS.white}
                  style={isRTL ? { transform: [{ scaleX: -1 }] } : {}}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* 🔹 Content */}
          <ScrollView
            style={styles.filterContent}
            contentContainerStyle={[
              isRTL && { direction: 'rtl', alignItems: 'flex-end' },
            ]}
          >
            {/* ❤️ Favorites Only */}
            <View style={styles.filterSection}>
              <TouchableOpacity
                style={[
                  styles.filterSectionHeader,
                  isRTL && styles.filterSectionHeaderRTL,
                ]}
                onPress={() => toggleFilter('favorites')}
              >
                <Ionicons
                  name={filters?.favorites ? 'heart' : 'heart-outline'}
                  size={20}
                  color={COLORS.white}
                  style={isRTL ? { transform: [{ scaleX: -1 }] } : {}}
                />
                <Text
                  style={[
                    styles.filterSectionTitle,
                    { textAlign: isRTL ? 'right' : 'left' },
                  ]}
                >
                  {t.favoritesOnly || 'Favorites Only'}
                </Text>
                <View
                  style={[
                    styles.checkbox,
                    filters?.favorites && styles.checkboxChecked,
                  ]}
                >
                  {filters?.favorites && (
                    <Ionicons name="checkmark" size={18} color={COLORS.white} />
                  )}
                </View>
              </TouchableOpacity>

              {!filters?.favorites && (
                <Text
                  style={[
                    styles.filterDescription,
                    { textAlign: isRTL ? 'right' : 'left' },
                  ]}
                >
                  {t.noFavorites || 'No favorite mosques yet'}
                </Text>
              )}
            </View>

            {/* 🕌 Facilities */}
            <View style={styles.filterSection}>
              <Text
                style={[
                  styles.filterSectionTitleMain,
                  { textAlign: isRTL ? 'right' : 'left' },
                ]}
              >
                {t.facilities || 'Facilities'}
              </Text>

              {[
                { key: 'itikaf', label: t.itikaf || "I'tikaf" },
                { key: 'parking', label: t.parking || 'Parking Available' },
                {
                  key: 'wheelchairAccess',
                  label: t.wheelchairAccess || 'Wheelchair Access',
                },
                { key: 'library', label: t.library || 'Islamic Library' },
              ].map((item, i) => (
                <TouchableOpacity
                  key={i}
                  style={[
                    styles.checkboxRow,
                    isRTL && styles.checkboxRowRTL,
                  ]}
                  onPress={() => toggleFilter(item.key)}
                >
                  <View
                    style={[
                      styles.checkbox,
                      filters?.[item.key] && styles.checkboxChecked,
                    ]}
                  >
                    {filters?.[item.key] && (
                      <Ionicons name="checkmark" size={18} color={COLORS.white} />
                    )}
                  </View>
                  <Text
                    style={[
                      styles.checkboxLabel,
                      { textAlign: isRTL ? 'right' : 'left' },
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* 📖 Programs */}
            <View style={styles.filterSection}>
              <Text
                style={[
                  styles.filterSectionTitleMain,
                  { textAlign: isRTL ? 'right' : 'left' },
                ]}
              >
                {t.programs || 'Programs'}
              </Text>

              {[
                { key: 'hifdh', label: t.hifdh || 'Hifdh' },
                { key: 'tafsir', label: t.tafsir || 'Tafsir' },
                {
                  key: 'islamicLessons',
                  label: t.islamicLessons || 'Islamic Lessons',
                },
                {
                  key: 'youthPrograms',
                  label: t.youthPrograms || 'Youth Programs',
                },
                {
                  key: 'fridayPrayer',
                  label: t.fridayPrayer || 'Friday Prayer',
                },
              ].map((item, i) => (
                <TouchableOpacity
                  key={i}
                  style={[
                    styles.checkboxRow,
                    isRTL && styles.checkboxRowRTL,
                  ]}
                  onPress={() => toggleFilter(item.key)}
                >
                  <View
                    style={[
                      styles.checkbox,
                      filters?.[item.key] && styles.checkboxChecked,
                    ]}
                  >
                    {filters?.[item.key] && (
                      <Ionicons name="checkmark" size={18} color={COLORS.white} />
                    )}
                  </View>
                  <Text
                    style={[
                      styles.checkboxLabel,
                      { textAlign: isRTL ? 'right' : 'left' },
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* 📏 Distance */}
            <View style={styles.filterSection}>
              <Text
                style={[
                  styles.filterSectionTitleMain,
                  { textAlign: isRTL ? 'right' : 'left' },
                ]}
              >
                
              </Text>
            

          
              
              
            
              
            </View>
          </ScrollView>

          {/* ✅ Apply Button */}
          <View style={styles.applyButtonContainer}>
            <TouchableOpacity style={styles.applyButton} onPress={onClose}>
              <Text style={styles.applyButtonText}>
                {t.applyFilters || 'Apply Filters'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

// 🎨 Styles
const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  filterModal: {
    backgroundColor: COLORS.darkBrown,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: height * 0.85,
  },
  filterModalRTL: {
    direction: 'rtl',
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  filterHeaderRTL: {
    flexDirection: 'row-reverse',
  },
  filterTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  filterTitleRowRTL: {
    flexDirection: 'row-reverse',
  },
  filterTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  filterHeaderRight: {
    alignItems: 'flex-end',
    gap: 8,
  },
  filterHeaderRightRTL: {
    alignItems: 'flex-start',
  },
  filterBadge: {
    backgroundColor: COLORS.accent,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBadgeText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
  clearFilters: {
    color: COLORS.accent,
    fontSize: 13,
    fontWeight: '600',
  },
  filterContent: {
    maxHeight: height * 0.6,
  },
  filterSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  filterSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  filterSectionHeaderRTL: {
    flexDirection: 'row-reverse',
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.white,
    flex: 1,
  },
  filterSectionTitleMain: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 16,
  },
  filterDescription: {
    fontSize: 13,
    color: COLORS.lightBeige,
    lineHeight: 20,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  checkboxRowRTL: {
    flexDirection: 'row-reverse',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: COLORS.lightBeige,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  checkboxLabel: {
    fontSize: 15,
    color: COLORS.white,
  },
  sliderContainer: {
    paddingHorizontal: 4,
  },
  slider: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 4,
    position: 'relative',
  },
  sliderFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: COLORS.accent,
    borderRadius: 4,
  },
  sliderThumb: {
    position: 'absolute',
    top: -6,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.white,
    marginLeft: -10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  applyButtonContainer: {
    padding: 20,
  },
  applyButton: {
    backgroundColor: COLORS.lightBeige,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  applyButtonText: {
    color: COLORS.darkBrown,
    fontSize: 16,
    fontWeight: '700',
  },
});
