import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, I18nManager } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import { translations } from '../constants/translations';

export default function BottomNav({ currentPage, setCurrentPage, language = 'en' }) {
  const t = translations[language] || translations.en;
  const isRTL = language === 'ar' || I18nManager.isRTL;

  const navItems = [
    { id: 'home', icon: 'home', label: t.home },
    { id: 'search', icon: 'search', label: t.search },
    { id: 'prayer', icon: 'time', label: t.prayer },
    { id: 'settings', icon: 'settings', label: t.settings },
  ];

  const orderedItems = isRTL ? [...navItems].reverse() : navItems;

  return (
    <View
      style={[
        styles.bottomNav,
        { flexDirection: isRTL ? 'row-reverse' : 'row' },
      ]}
    >
      {orderedItems.map((item) => {
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
              color={isActive ? '#EAD7BD' : '#C4B4A5'} // ✅ Updated colors
            />
            <Text
              style={[
                styles.navText,
                isActive && styles.navTextActive,
                { textAlign: isRTL ? 'right' : 'left' },
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: '#3A2C29', // ✅ Darker rich brown
    paddingBottom: 22,
    paddingTop: 10,
    borderTopWidth: 0.5,
    borderTopColor: '#6B5B4D',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 6,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  navText: {
    fontSize: 11,
    color: '#C4B4A5', // ✅ softer beige
  },
  navTextActive: {
    color: '#EAD7BD', // ✅ highlight beige
    fontWeight: '700',
  },
});
