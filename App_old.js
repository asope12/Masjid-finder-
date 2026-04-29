// import { StatusBar } from 'expo-status-bar';
// import { StyleSheet, Text, View } from 'react-native';

// export default function App() {
//   return (
//     <View style={styles.container}>
//       <Text>Open up App.js to start working on your app!</Text>
//       <StatusBar style="auto" />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });



import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  Switch,
  Dimensions,
  StatusBar,
} from 'react-native';
import mosquesData from './mosquesData'
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

// Colors
const COLORS = {
  taupeGray: '#88847D',
  darkBrown: '#2A241A',
  lightBeige: '#E8DFD6',
  cream: '#F5F0EB',
  accent: '#D4A574',
  white: '#FFFFFF',
  black: '#000000',
};

// Mock Data
// const mosquesData = [
//   {
//     id: 1,
//     name: "Al Ta121qwa Mosque",
//     nameAr: "مسجد التقوى",
//     image: "https://images.unsplash.com/photo-1591604129159-1e9d53c3f9b9?w=400&h=300&fit=crop",
//     distance: "9.1 km",
//     area: "Al Shawamekh District",
//     rating: 1242123413,
//     description: "Traditional neighborhood mosque in Al Shawamekh known for its comprehensive Tafsir classes and strong community presence among local families.",
//     programs: ["Tafsir", "Islamic Lessons", "Friday Prayer"],
//     latitude: 24.3118,
//     longitude: 54.6131,
//   },
//   {
//     id: 2,
//     name: "Masjid Al Muttaqin",
//     nameAr: "مسجد المتقين",
//     image: "https://images.unsplash.com/photo-1564769610726-5c4d0bd5c3c0?w=400&h=300&fit=crop",
//     distance: "11.2 km",
//     area: "Al Wahda District",
//     rating: 4.3,
//     description: "Modern mosque with excellent facilities and active community programs.",
//     programs: ["Islamic Lessons", "Friday Prayer", "Youth Programs"],
//     latitude: 24.3245,
//     longitude: 54.6298,
//   },
//   {
//     id: 3,
//     name: "Al Rahma Mosque",
//     nameAr: "مسجد الرحمة",
//     image: "https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=400&h=300&fit=crop",
//     distance: "18.3 km",
//     area: "Al Khalidiyah",
//     rating: 4.7,
//     description: "Beautiful mosque with comprehensive Islamic programs and community services.",
//     programs: ["Tafsir", "Islamic Lessons", "Hifdh"],
//     latitude: 24.4598,
//     longitude: 54.3558,
//   },
  
// ];

const translations = {
  masjidFinder: 'Masjid Finder',
  allFilters: 'All Filters',
  viewAll: 'View All',
  openNow: 'Open Now',
  findMosques: 'Find Mosques Near You',
  showing: 'Showing',
  mosques: 'mosques from',
  viewList: 'View List',
  getDirections: 'Get Directions',
  mapView: 'Map View',
  mosqueLists: 'Mosque List',
  viewDetails: 'View Details',
  quranPrograms: 'Quran Programs',
  prayerTimes: 'Prayer Times',
  today: 'Today',
  fajr: 'Fajr',
  dhuhr: 'Dhuhr',
  asr: 'Asr',
  maghrib: 'Maghrib',
  isha: 'Isha',
  darkMode: 'Dark Mode',
  filterMosques: 'Filter\nMosques',
  clearAllFilters: 'Clear All Filters',
  favoritesOnly: 'Favorites Only',
  noFavorites: 'No favorites saved yet. Add mosques to favorites to use this filter.',
  facilities: 'Facilities',
  itikaf: "I'tikaf",
  programs: 'Programs',
  hifdh: 'Hifdh',
  tafsir: 'Tafsir',
  islamicLessons: 'Islamic Lessons',
  youthPrograms: 'Youth Programs',
  fridayPrayer: 'Friday Prayer',
  maximumDistance: 'Maximum Distance',
  minimumRating: 'Minimum Rating',
  applyFilters: 'Apply Filters',
  home: 'Home',
  search: 'Search',
  prayer: 'Prayer',
  settings: 'Settings',
};

// Filter Modal Component
const FilterModal = ({ visible, onClose, filters, setFilters }) => {
  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.filterModal}>
          <View style={styles.filterHeader}>
            <View style={styles.filterTitleRow}>
              <Ionicons name="filter" size={28} color={COLORS.white} />
              <Text style={styles.filterTitle}>{translations.filterMosques}</Text>
            </View>
            <View style={styles.filterHeaderRight}>
              <View style={styles.filterBadge}>
                <Text style={styles.filterBadgeText}>{filters.activeCount}</Text>
              </View>
              <TouchableOpacity onPress={() => setFilters({ activeCount: 0, tafsir: false, distance: 20, rating: 4 })}>
                <Text style={styles.clearFilters}>{translations.clearAllFilters}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={28} color={COLORS.white} />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView style={styles.filterContent}>
            <View style={styles.filterSection}>
              <View style={styles.filterSectionHeader}>
                <Ionicons name="heart-outline" size={20} color={COLORS.white} />
                <Text style={styles.filterSectionTitle}>{translations.favoritesOnly}</Text>
              </View>
              <Text style={styles.filterDescription}>{translations.noFavorites}</Text>
            </View>

            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>{translations.facilities}</Text>
              <TouchableOpacity style={styles.checkboxRow}>
                <View style={styles.checkbox} />
                <Text style={styles.checkboxLabel}>{translations.itikaf}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>{translations.programs}</Text>
              <TouchableOpacity style={styles.checkboxRow}>
                <View style={styles.checkbox} />
                <Text style={styles.checkboxLabel}>{translations.hifdh}</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.checkboxRow}
                onPress={() => setFilters({
                  ...filters, 
                  tafsir: !filters.tafsir, 
                  activeCount: filters.tafsir ? filters.activeCount - 1 : filters.activeCount + 1
                })}
              >
                <View style={[styles.checkbox, filters.tafsir && styles.checkboxChecked]}>
                  {filters.tafsir && <Ionicons name="checkmark" size={18} color={COLORS.white} />}
                </View>
                <Text style={styles.checkboxLabel}>{translations.tafsir}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.checkboxRow}>
                <View style={styles.checkbox} />
                <Text style={styles.checkboxLabel}>{translations.islamicLessons}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.checkboxRow}>
                <View style={styles.checkbox} />
                <Text style={styles.checkboxLabel}>{translations.youthPrograms}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.checkboxRow}>
                <View style={styles.checkbox} />
                <Text style={styles.checkboxLabel}>{translations.fridayPrayer}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>
                {translations.maximumDistance}: {filters.distance} km
              </Text>
              <View style={styles.sliderContainer}>
                <View style={styles.slider}>
                  <View style={[styles.sliderFill, { width: `${(filters.distance / 50) * 100}%` }]} />
                  <View style={[styles.sliderThumb, { left: `${(filters.distance / 50) * 100}%` }]} />
                </View>
              </View>
            </View>

            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>
                {translations.minimumRating}: {filters.rating}
              </Text>
              <View style={styles.sliderContainer}>
                <View style={styles.slider}>
                  <View style={[styles.sliderFill, { width: `${((filters.rating - 1) / 4) * 100}%` }]} />
                  <View style={[styles.sliderThumb, { left: `${((filters.rating - 1) / 4) * 100}%` }]} />
                </View>
              </View>
            </View>
          </ScrollView>

          <View style={styles.applyButtonContainer}>
            <TouchableOpacity style={styles.applyButton} onPress={onClose}>
              <Text style={styles.applyButtonText}>{translations.applyFilters}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// Bottom Navigation Component
const BottomNav = ({ currentPage, setCurrentPage }) => {
  const navItems = [
    { id: 'home', icon: 'home', label: translations.home },
    { id: 'search', icon: 'search', label: translations.search },
    { id: 'prayer', icon: 'time', label: translations.prayer },
    { id: 'settings', icon: 'settings', label: translations.settings },
  ];

  return (
    <View style={styles.bottomNav}>
      {navItems.map(item => {
        const isActive = currentPage === item.id;
        return (
          <TouchableOpacity
            key={item.id}
            style={styles.navItem}
            onPress={() => setCurrentPage(item.id)}
          >
            <Ionicons 
              name={item.icon} 
              size={24} 
              color={isActive ? COLORS.accent : COLORS.taupeGray} 
            />
            <Text style={[styles.navText, isActive && styles.navTextActive]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

// Main App Component
export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedMosque, setSelectedMosque] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState({
    activeCount: 2,
    tafsir: true,
    distance: 20,
    rating: 4,
  });
  const [currentTime, setCurrentTime] = useState('');

  const currentLocation = 'ATS Baniyas, Abu Dhabi';

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleFavorite = (id) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id]
    );
  };

  // const filteredMosques = filters.tafsir 
  //   ? mosquesData.filter(m => m.programs.includes('Tafsir'))
  //   : mosquesData;




const filteredMosques = filters.tafsir
  ? mosquesData.filter(mosque => mosque.programs?.includes('Tafsir'))
  : mosquesData;

  // Home Page
  if (currentPage === 'home') {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
        <ScrollView style={styles.scrollView}>
          <View style={[styles.header, isDarkMode && styles.headerDark]}>
            <View style={styles.headerTop}>
              <View style={styles.headerLeft}>
                <Ionicons name="location" size={24} color={isDarkMode ? COLORS.white : COLORS.black} />
                <View>
                  <Text style={[styles.headerTitle, isDarkMode && styles.textDark]}>
                    {translations.masjidFinder}
                  </Text>
                  <Text style={[styles.headerSubtitle, isDarkMode && styles.textDark]}>
                    {currentLocation}
                  </Text>
                </View>
              </View>
              <View style={styles.themeToggle}>
                <Ionicons name="sunny" size={20} color={isDarkMode ? COLORS.white : COLORS.black} />
                <Switch 
                  value={isDarkMode} 
                  onValueChange={setIsDarkMode}
                  trackColor={{ false: COLORS.taupeGray, true: COLORS.darkBrown }}
                  thumbColor={COLORS.white}
                />
                <Ionicons name="moon" size={20} color={isDarkMode ? COLORS.white : COLORS.black} />
              </View>
            </View>
          </View>

          <View style={styles.filterBar}>
            <TouchableOpacity style={styles.filterButton} onPress={() => setShowFilter(true)}>
              <Ionicons name="filter" size={16} color={COLORS.white} />
              <Text style={styles.filterButtonText}>{translations.allFilters}</Text>
              {filters.activeCount > 0 && (
                <View style={styles.filterBadgeSmall}>
                  <Text style={styles.filterBadgeTextSmall}>{filters.activeCount}</Text>
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterChip}>
              <Text style={styles.filterChipText}>{translations.viewAll}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterChip}>
              <Text style={styles.filterChipText}>{translations.openNow}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.mapPlaceholder}>
            <Text style={styles.mapText}>🗺️ Map View</Text>
            <View style={[styles.mapMarker, { top: 80, left: 60 }]}>
              <Text style={styles.markerIcon}>🕌</Text>
            </View>
            <View style={[styles.mapMarker, { top: 120, right: 80 }]}>
              <Text style={styles.markerIcon}>🕌</Text>
            </View>
            <View style={[styles.mapMarker, { bottom: 60, left: '45%' }]}>
              <Text style={styles.markerIcon}>🕌</Text>
            </View>
          </View>

          <View style={styles.findCard}>
            <View style={styles.findCardHeader}>
              <Ionicons name="navigate" size={24} color={COLORS.white} />
              <View style={styles.findCardText}>
                <Text style={styles.findCardTitle}>{translations.findMosques}</Text>
                <Text style={styles.findCardSubtitle}>
                  {translations.showing} {filteredMosques.length} {translations.mosques} {currentLocation}
                </Text>
              </View>
            </View>
            <View style={styles.findCardButtons}>
              <TouchableOpacity 
                style={styles.findCardButtonPrimary}
                onPress={() => setCurrentPage('search')}
              >
                <Text style={styles.findCardButtonPrimaryText}>{translations.viewList}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.findCardButtonSecondary}>
                <Text style={styles.findCardButtonSecondaryText}>{translations.getDirections}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        <BottomNav currentPage={currentPage} setCurrentPage={setCurrentPage} />
        <FilterModal 
          visible={showFilter} 
          onClose={() => setShowFilter(false)} 
          filters={filters}
          setFilters={setFilters}
        />
      </SafeAreaView>
    );
  }

  // Search/List Page
  if (currentPage === 'search') {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
        <View style={[styles.header, isDarkMode && styles.headerDark]}>
          <View style={styles.headerTop}>
            <View style={styles.headerLeft}>
              <Ionicons name="location" size={24} color={isDarkMode ? COLORS.white : COLORS.black} />
              <View>
                <Text style={[styles.headerTitle, isDarkMode && styles.textDark]}>
                  {translations.masjidFinder}
                </Text>
                <Text style={[styles.headerSubtitle, isDarkMode && styles.textDark]}>
                  {currentLocation}
                </Text>
              </View>
            </View>
            <View style={styles.themeToggle}>
              <Ionicons name="sunny" size={20} color={isDarkMode ? COLORS.white : COLORS.black} />
              <Switch 
                value={isDarkMode} 
                onValueChange={setIsDarkMode}
                trackColor={{ false: COLORS.taupeGray, true: COLORS.darkBrown }}
                thumbColor={COLORS.white}
              />
              <Ionicons name="moon" size={20} color={isDarkMode ? COLORS.white : COLORS.black} />
            </View>
          </View>
        </View>

        <View style={styles.filterBar}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity style={styles.filterButton} onPress={() => setShowFilter(true)}>
              <Ionicons name="filter" size={16} color={COLORS.white} />
              <Text style={styles.filterButtonText}>{translations.allFilters}</Text>
              {filters.activeCount > 0 && (
                <View style={styles.filterBadgeSmall}>
                  <Text style={styles.filterBadgeTextSmall}>{filters.activeCount}</Text>
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterChip}>
              <Text style={styles.filterChipText}>{translations.viewAll}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterChip}>
              <Text style={styles.filterChipText}>{translations.openNow}</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        <View style={styles.listHeader}>
          <View>
            <Text style={styles.listTitle}>{translations.mosqueLists}</Text>
            <Text style={styles.listSubtitle}>
              {translations.showing} {filteredMosques.length} {translations.mosques} near {currentLocation}
            </Text>
          </View>
          <TouchableOpacity 
            style={styles.mapViewButton}
            onPress={() => setCurrentPage('home')}
          >
            <Ionicons name="location" size={16} color={COLORS.white} />
            <Text style={styles.mapViewButtonText}>{translations.mapView}</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.mosqueList}>
          {filteredMosques.map(mosque => (
            <View key={mosque.id} style={styles.mosqueCard}>
              <Image 
                source={{ uri: mosque.image }} 
                style={styles.mosqueImage} 
                resizeMode="cover"
              />
              <View style={styles.mosqueInfo}>
                <View style={styles.mosqueHeader}>
                  <View style={styles.mosqueTitleContainer}>
                    <Text style={styles.mosqueName}>{mosque.name}</Text>
                    <View style={styles.mosqueRating}>
                      <Text style={styles.ratingText}>⭐ {mosque.rating}</Text>
                    </View>
                    <Text style={styles.mosqueDistance}>
                       {mosque.distance} • {mosque.area}
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => toggleFavorite(mosque.id)}>
                    <Ionicons 
                      name={favorites.includes(mosque.id) ? "heart" : "heart-outline"} 
                      size={24} 
                      color={favorites.includes(mosque.id) ? "#ef4444" : COLORS.white}
                    />
                  </TouchableOpacity>
                </View>
                <View style={styles.programTags}>
                  {mosque.programs.slice(0, 2).map((program, idx) => (
                    <View key={idx} style={styles.programTag}>
                      <Text style={styles.programTagText}>{program}</Text>
                    </View>
                  ))}
                  {mosque.programs.length > 2 && (
                    <View style={styles.programTag}>
                      <Text style={styles.programTagText}>+{mosque.programs.length - 2}</Text>
                    </View>
                  )}
                </View>
                <View style={styles.cardActions}>
                  <TouchableOpacity 
                    style={styles.viewDetailsButton}
                    onPress={() => {
                      setSelectedMosque(mosque);
                      setCurrentPage('details');
                    }}
                  >
                    <Text style={styles.viewDetailsText}>{translations.viewDetails}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.directionsButton}>
                    <Ionicons name="navigate" size={20} color={COLORS.white} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>

        <BottomNav currentPage={currentPage} setCurrentPage={setCurrentPage} />
        <FilterModal 
          visible={showFilter} 
          onClose={() => setShowFilter(false)} 
          filters={filters}
          setFilters={setFilters}
        />
      </SafeAreaView>
    );
  }

  // Details Page
  if (currentPage === 'details' && selectedMosque) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
        <ScrollView style={styles.scrollView}>
          <View style={[styles.header, isDarkMode && styles.headerDark]}>
            <View style={styles.headerTop}>
              <View style={styles.headerLeft}>
                <Ionicons name="location" size={24} color={isDarkMode ? COLORS.white : COLORS.black} />
                <View>
                  <Text style={[styles.headerTitle, isDarkMode && styles.textDark]}>
                    {translations.masjidFinder}
                  </Text>
                  <Text style={[styles.headerSubtitle, isDarkMode && styles.textDark]}>
                    {currentLocation}
                  </Text>
                </View>
              </View>
              <View style={styles.themeToggle}>
                <Ionicons name="sunny" size={20} color={isDarkMode ? COLORS.white : COLORS.black} />
                <Switch 
                  value={isDarkMode} 
                  onValueChange={setIsDarkMode}
                  trackColor={{ false: COLORS.taupeGray, true: COLORS.darkBrown }}
                  thumbColor={COLORS.white}
                />
                <Ionicons name="moon" size={20} color={isDarkMode ? COLORS.white : COLORS.black} />
              </View>
            </View>
          </View>

          <View style={styles.detailsImageContainer}>
            <Image 
              source={{ uri: selectedMosque.image }} 
              style={styles.detailsImage}
              resizeMode="cover"
            />
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => setCurrentPage('search')}
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
                color={favorites.includes(selectedMosque.id) ? "#ef4444" : COLORS.darkBrown}
              />
            </TouchableOpacity>
            <View style={styles.distanceBadge}>
              <Text style={styles.distanceBadgeText}> {selectedMosque.distance}</Text>
            </View>
          </View>

          <View style={styles.detailsInfo}>
            <View style={styles.detailsTitleRow}>
              <Image 
                source={{ uri: selectedMosque.image }} 
                style={styles.detailsThumb}
                resizeMode="cover"
              />
              <View style={styles.detailsTitleInfo}>
                <Text style={styles.detailsTitle}>{selectedMosque.name}</Text>
                <View style={styles.detailsRating}>
                  <Text style={styles.ratingText}>⭐ {selectedMosque.rating}</Text>
                </View>
              </View>
            </View>

            <Text style={styles.detailsLocation}>
               {selectedMosque.area}, Abu Dhabi
            </Text>

            <Text style={styles.detailsDescription}>
              {selectedMosque.description}
            </Text>

            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.directionsButtonLarge}>
                <Ionicons name="navigate" size={20} color={COLORS.darkBrown} />
                <Text style={styles.directionsButtonLargeText}>{translations.getDirections}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.phoneButton}>
                <Ionicons name="call" size={20} color={COLORS.white} />
              </TouchableOpacity>
            </View>

            <View style={styles.programsSection}>
              <View style={styles.programsSectionHeader}>
                <Ionicons name="book" size={20} color={COLORS.white} />
                <Text style={styles.programsSectionTitle}>{translations.quranPrograms}</Text>
              </View>
              <View style={styles.programsList}>
                {selectedMosque.programs.map((program, idx) => (
                  <View key={idx} style={styles.programTagLarge}>
                    <Text style={styles.programTagTextLarge}>{program}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.prayerTimesSection}>
              <View style={styles.prayerTimesHeader}>
                <Ionicons name="time" size={20} color={COLORS.white} />
                <Text style={styles.prayerTimesTitle}>{translations.prayerTimes}</Text>
                <View style={styles.todayBadge}>
                  <Text style={styles.todayBadgeText}>{translations.today}</Text>
                </View>
              </View>
              <View style={styles.prayerTimesList}>
                {[
                  { name: translations.fajr, time: '05:12 AM' },
                  { name: translations.dhuhr, time: '12:35 PM' },
                  { name: translations.asr, time: '03:45 PM' },
                ].map((prayer, idx) => (
                  <View key={idx} style={styles.prayerTimeRow}>
                    <Text style={styles.prayerName}>{prayer.name}</Text>
                    <Text style={styles.prayerTime}>{prayer.time}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </ScrollView>

        <BottomNav currentPage="search" setCurrentPage={setCurrentPage} />
      </SafeAreaView>
    );
  }

  // Prayer Page
  if (currentPage === 'prayer') {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
        <View style={[styles.header, isDarkMode && styles.headerDark]}>
          <View style={styles.headerTop}>
            <View style={styles.headerLeft}>
              <Ionicons name="time" size={24} color={isDarkMode ? COLORS.white : COLORS.black} />
              <Text style={[styles.headerTitle, isDarkMode && styles.textDark]}>
                {translations.prayerTimes}
              </Text>
            </View>
            <Text style={styles.currentTime}>{currentTime}</Text>
          </View>
        </View>

        <ScrollView style={styles.prayerContent}>
          <View style={styles.prayerCard}>
            <Text style={styles.prayerCardTitle}>Today's Prayer Times</Text>
            {[
              { name: translations.fajr, time: '05:12 AM' },
              { name: translations.dhuhr, time: '12:35 PM' },
              { name: translations.asr, time: '03:45 PM' },
              { name: translations.maghrib, time: '06:15 PM' },
              { name: translations.isha, time: '07:45 PM' },
            ].map((prayer, idx) => (
              <View key={idx} style={styles.prayerTimeRowLarge}>
                <Text style={styles.prayerNameLarge}>{prayer.name}</Text>
                <Text style={styles.prayerTimeLarge}>{prayer.time}</Text>
              </View>))}
          </View>
        </ScrollView>

        <BottomNav currentPage={currentPage} setCurrentPage={setCurrentPage} />
      </SafeAreaView>
    );
  }

  // Settings Page
  if (currentPage === 'settings') {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
        <View style={[styles.header, isDarkMode && styles.headerDark]}>
          <View style={styles.headerTop}>
            <View style={styles.headerLeft}>
              <Ionicons name="settings" size={24} color={isDarkMode ? COLORS.white : COLORS.black} />
              <Text style={[styles.headerTitle, isDarkMode && styles.textDark]}>
                {translations.settings}
              </Text>
            </View>
          </View>
        </View>

        <ScrollView style={styles.settingsContent}>
          <View style={styles.settingCard}>
            <Text style={styles.settingLabel}>{translations.darkMode}</Text>
            <Switch 
              value={isDarkMode} 
              onValueChange={setIsDarkMode}
              trackColor={{ false: COLORS.taupeGray, true: COLORS.accent }}
              thumbColor={COLORS.white}
            />
          </View>
          <View style={styles.settingCard}>
            <Text style={styles.settingLabel}>Language</Text>
            <Text style={styles.settingValue}>English</Text>
          </View>
        </ScrollView>

        <BottomNav currentPage={currentPage} setCurrentPage={setCurrentPage} />
      </SafeAreaView>
    );
  }

  return null;
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.cream,
  },
  scrollView: {
    flex: 1,
    marginBottom: 80,
  },
  header: {
    backgroundColor: COLORS.lightBeige,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  headerDark: {
    backgroundColor: COLORS.darkBrown,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
  filterBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
    backgroundColor: COLORS.darkBrown,
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
  },
  mapPlaceholder: {
    height: 280,
    backgroundColor: COLORS.taupeGray,
    margin: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  mapText: {
    fontSize: 24,
    color: COLORS.white,
  },
  mapMarker: {
    position: 'absolute',
    backgroundColor: COLORS.white,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  markerIcon: {
    fontSize: 20,
  },
  findCard: {
    margin: 16,
    marginBottom: 100,
    backgroundColor: COLORS.darkBrown,
    borderRadius: 16,
    padding: 20,
  },
  findCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  findCardText: {
    flex: 1,
  },
  findCardTitle: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  findCardSubtitle: {
    color: COLORS.lightBeige,
    fontSize: 14,
    marginTop: 4,
  },
  findCardButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  findCardButtonPrimary: {
    flex: 1,
    backgroundColor: COLORS.lightBeige,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  findCardButtonPrimaryText: {
    color: COLORS.darkBrown,
    fontWeight: '700',
    fontSize: 15,
  },
  findCardButtonSecondary: {
    flex: 1,
    backgroundColor: COLORS.taupeGray,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  findCardButtonSecondaryText: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: 15,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.darkBrown,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  listSubtitle: {
    fontSize: 12,
    color: COLORS.lightBeige,
    marginTop: 2,
  },
  mapViewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.taupeGray,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  mapViewButtonText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '600',
  },
  mosqueList: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    marginBottom: 80,
  },
  mosqueCard: {
    backgroundColor: COLORS.darkBrown,
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
  },
  mosqueImage: {
    width: '100%',
    height: 160,
    backgroundColor: COLORS.taupeGray,
  },
  mosqueInfo: {
    padding: 16,
  },
  mosqueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  mosqueTitleContainer: {
    flex: 1,
    marginRight: 12,
  },
  mosqueName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 6,
  },
  mosqueRating: {
    marginBottom: 4,
  },
  ratingText: {
    fontSize: 14,
    color: COLORS.lightBeige,
  },
  mosqueDistance: {
    fontSize: 13,
    color: COLORS.lightBeige,
  },
  programTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  programTag: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  programTagText: {
    fontSize: 12,
    color: COLORS.darkBrown,
    fontWeight: '500',
  },
  cardActions: {
    flexDirection: 'row',
    gap: 12,
  },
  viewDetailsButton: {
    flex: 1,
    backgroundColor: COLORS.lightBeige,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  viewDetailsText: {
    color: COLORS.darkBrown,
    fontWeight: '600',
    fontSize: 14,
  },
  directionsButton: {
    backgroundColor: COLORS.taupeGray,
    width: 48,
    height: 48,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailsImageContainer: {
    position: 'relative',
    height: 260,
  },
  detailsImage: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.taupeGray,
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: COLORS.white,
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  favoriteButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: COLORS.white,
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  distanceBadge: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  distanceBadgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.darkBrown,
  },
  detailsInfo: {
    backgroundColor: COLORS.darkBrown,
    padding: 20,
    minHeight: height - 340,
  },
  detailsTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  detailsThumb: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: COLORS.taupeGray,
  },
  detailsTitleInfo: {
    flex: 1,
  },
  detailsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 6,
  },
  detailsRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailsLocation: {
    fontSize: 14,
    color: COLORS.lightBeige,
    marginBottom: 16,
  },
  detailsDescription: {
    fontSize: 14,
    color: COLORS.white,
    lineHeight: 22,
    marginBottom: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  directionsButtonLarge: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.lightBeige,
    paddingVertical: 14,
    borderRadius: 10,
    gap: 8,
  },
  directionsButtonLargeText: {
    color: COLORS.darkBrown,
    fontWeight: '600',
    fontSize: 15,
  },
  phoneButton: {
    backgroundColor: COLORS.taupeGray,
    width: 52,
    height: 52,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  programsSection: {
    backgroundColor: COLORS.taupeGray,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  programsSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  programsSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  programsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  programTagLarge: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  programTagTextLarge: {
    fontSize: 13,
    color: COLORS.darkBrown,
    fontWeight: '500',
  },
  prayerTimesSection: {
    backgroundColor: COLORS.taupeGray,
    borderRadius: 16,
    padding: 16,
  },
  prayerTimesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  prayerTimesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.white,
    flex: 1,
  },
  todayBadge: {
    backgroundColor: COLORS.darkBrown,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  todayBadgeText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '600',
  },
  prayerTimesList: {
    gap: 12,
  },
  prayerTimeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  prayerName: {
    fontSize: 15,
    color: COLORS.white,
  },
  prayerTime: {
    fontSize: 15,
    color: COLORS.lightBeige,
    fontWeight: '600',
  },
  prayerContent: {
    flex: 1,
    paddingTop: 20,
    marginBottom: 80,
  },
  prayerCard: {
    backgroundColor: COLORS.darkBrown,
    margin: 16,
    borderRadius: 16,
    padding: 20,
  },
  prayerCardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 20,
  },
  prayerTimeRowLarge: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  prayerNameLarge: {
    fontSize: 16,
    color: COLORS.white,
    fontWeight: '500',
  },
  prayerTimeLarge: {
    fontSize: 16,
    color: COLORS.lightBeige,
    fontWeight: '700',
  },
  currentTime: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.darkBrown,
  },
  settingsContent: {
    flex: 1,
    padding: 16,
    marginBottom: 80,
  },
  settingCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.darkBrown,
    padding: 20,
    borderRadius: 12,
    marginBottom: 12,
  },
  settingLabel: {
    fontSize: 16,
    color: COLORS.white,
    fontWeight: '500',
  },
  settingValue: {
    fontSize: 16,
    color: COLORS.lightBeige,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: COLORS.darkBrown,
    paddingBottom: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  navText: {
    fontSize: 11,
    color: COLORS.taupeGray,
  },
  navTextActive: {
    color: COLORS.accent,
    fontWeight: '600',
  },
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
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  filterTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  filterTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.white,
    lineHeight: 26,
  },
  filterHeaderRight: {
    alignItems: 'flex-end',
    gap: 8,
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
  filterSectionTitle: {
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