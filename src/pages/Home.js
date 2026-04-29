// src/screens/HomePage.js
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  I18nManager, 
  ScrollView, 
  StatusBar,
  Dimensions 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import FilterBar from '../components/FilterBar';
import FilterModal from '../components/FilterModal';
import MosqueMapView from '../components/MosqueMapView';
import { COLORS } from '../constants/colors';
import { translations } from '../constants/translations';

const { width } = Dimensions.get('window');

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
    <View style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      
      {/* 🕌 Header */}
      <Header
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        currentLocation={currentLocation}
        language={language}
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>
            {language === 'ar' ? 'مرحباً بك 👋' : 'Welcome 👋'}
          </Text>
          <Text style={styles.welcomeSubtitle}>
            {language === 'ar' ? 'ابحث عن المساجد القريبة منك' : 'Find mosques near your location'}
          </Text>
        </View>

        {/* 🔍 Filter Bar */}
        <FilterBar
          filters={filters}
          onFilterPress={() => setShowFilter(true)}
          language={language}
        />

        {/* 🗺️ Mosque Map */}
        <View style={styles.mapSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {language === 'ar' ? 'الخريطة' : 'Map View'}
            </Text>
            <TouchableOpacity style={styles.viewAllButton}>
              <Text style={styles.viewAllText}>
                {language === 'ar' ? 'عرض الكل' : 'View All'}
              </Text>
              <Ionicons name="chevron-forward" size={16} color="#666" />
            </TouchableOpacity>
          </View>
          <MosqueMapView mosques={filteredMosques} language={language} />
        </View>

        {/* 📍 Mosque Info Card */}
        <View style={styles.findCard}>
          <View style={[styles.findCardHeader, isRTL && styles.findCardHeaderRTL]}>
            <View style={styles.findCardIcon}>
              <Ionicons
                name="location"
                size={24}
                color="#FFFFFF"
              />
            </View>
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
                {t.showing || 'Showing'} {filteredMosques.length} {t.mosques || 'mosques'} {formatLocation(currentLocation)}
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
              <Ionicons name="list" size={18} color="#FFFFFF" />
              <Text style={styles.findCardButtonPrimaryText}>
                {t.viewList || 'View List'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.findCardButtonSecondary}
              onPress={() => setCurrentPage('prayer')}
            >
              <Ionicons name="time" size={18} color="#8B4513" />
              <Text style={styles.findCardButtonSecondaryText}>
                {t.prayerTimes || 'Prayer Times'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 🕌 Quick Actions */}
        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>
            {language === 'ar' ? 'الإجراءات السريعة' : 'Quick Actions'}
          </Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity 
              style={styles.quickActionItem}
              onPress={() => setCurrentPage('qibla')}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: '#FFF5E6' }]}>
                <Text style={styles.quickActionEmoji}>🕋</Text>
              </View>
              <Text style={styles.quickActionText}>
                {language === 'ar' ? 'القبلة' : 'Qibla'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.quickActionItem}
              onPress={() => setCurrentPage('prayer')}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: '#E6F3FF' }]}>
                <Text style={styles.quickActionEmoji}>🕌</Text>
              </View>
              <Text style={styles.quickActionText}>
                {language === 'ar' ? 'أوقات الصلاة' : 'Prayer Times'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.quickActionItem}
              onPress={() => setCurrentPage('search')}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: '#E6FFE6' }]}>
                <Ionicons name="search" size={20} color="#27AE60" />
              </View>
              <Text style={styles.quickActionText}>
                {language === 'ar' ? 'بحث' : 'Search'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.quickActionItem}
              onPress={() => setCurrentPage('settings')}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: '#F0E6FF' }]}>
                <Ionicons name="settings" size={20} color="#9B59B6" />
              </View>
              <Text style={styles.quickActionText}>
                {language === 'ar' ? 'الإعدادات' : 'Settings'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 📊 Stats Section */}
        <View style={styles.statsSection}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{filteredMosques.length}</Text>
            <Text style={styles.statLabel}>
              {language === 'ar' ? 'مسجد' : 'Mosques'}
            </Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>24/7</Text>
            <Text style={styles.statLabel}>
              {language === 'ar' ? 'مفتوح' : 'Open'}
            </Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>5</Text>
            <Text style={styles.statLabel}>
              {language === 'ar' ? 'صلوات' : 'Prayers'}
            </Text>
          </View>
        </View>

        {/* Spacer for bottom nav */}
        <View style={styles.bottomSpacer} />
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
  container: { 
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  welcomeSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#636E72',
    lineHeight: 22,
  },
  mapSection: {
    marginTop: 8,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D3436',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewAllText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  findCard: {
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 20,
    borderRadius: 20,
    padding: 20,
    backgroundColor: '#8B4513', // Beautiful brown color
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  findCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 20,
  },
  findCardHeaderRTL: { 
    flexDirection: 'row-reverse' 
  },
  findCardIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  findCardText: { 
    flex: 1 
  },
  findCardTitle: { 
    color: '#FFFFFF', 
    fontSize: 20, 
    fontWeight: 'bold',
    marginBottom: 6,
  },
  findCardSubtitle: { 
    color: 'rgba(255, 255, 255, 0.8)', 
    fontSize: 14,
    lineHeight: 20,
  },
  findCardButtons: { 
    flexDirection: 'row', 
    gap: 12 
  },
  findCardButtonsRTL: { 
    flexDirection: 'row-reverse' 
  },
  findCardButtonPrimary: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  findCardButtonPrimaryText: {
    color: '#8B4513',
    fontWeight: '700',
    fontSize: 15,
  },
  findCardButtonSecondary: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  findCardButtonSecondaryText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 15,
  },
  quickActions: {
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 20,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 16,
  },
  quickActionItem: {
    width: (width - 64) / 2, // Calculate width for 2 columns with padding
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E9ECEF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  quickActionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  quickActionEmoji: {
    fontSize: 24,
  },
  quickActionText: {
    color: '#2D3436',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  statsSection: {
    flexDirection: 'row',
    backgroundColor: '#F8F9FA',
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#636E72',
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E9ECEF',
    marginHorizontal: 10,
  },
  bottomSpacer: {
    height: 100,
  },
});