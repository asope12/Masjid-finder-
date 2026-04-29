// src/components/MosqueCard.js
import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Platform,
  I18nManager,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../constants/colors";
import { translations } from "../constants/translations";

export default function MosqueCard({
  mosque = {},
  isFavorite = false,
  onToggleFavorite,
  onViewDetails,
  onGetDirections,
  language = "en",
}) {
  const t = translations[language] || translations.en;
  const isRTL = language === "ar" || I18nManager.isRTL;

  // 🌍 Always safely extract strings (avoid rendering objects)
  const safeText = (val) => {
    if (!val) return "";
    if (typeof val === "string") return val;
    if (typeof val === "object")
      return val[language] || val.en || Object.values(val)[0];
    return String(val);
  };

  const name = safeText(mosque.name);
  const area = safeText(mosque.area);

  const programs =
    Array.isArray(mosque.programs) && mosque.programs.length > 0
      ? mosque.programs.map((p) => safeText(p))
      : [];

  const openGoogleMaps = () => {
    const lat = mosque.latitude || 0;
    const lng = mosque.longitude || 0;
    const url = Platform.select({
      ios: `maps://app?daddr=${lat},${lng}`,
      android: `geo:${lat},${lng}?q=${lat},${lng}`,
    });

    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          Linking.openURL(url);
        } else {
          Linking.openURL(
            `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
          );
        }
      })
      .catch((err) => console.error("Failed to open map", err));
  };

  return (
    <View style={styles.mosqueCard}>
      <Image
        source={{ uri: mosque.image || "https://via.placeholder.com/150" }}
        style={styles.mosqueImage}
        resizeMode="cover"
      />

      <View style={styles.mosqueInfo}>
        {/* 🔹 Header */}
        <View
          style={[
            styles.mosqueHeader,
            isRTL && { flexDirection: "row-reverse" },
          ]}
        >
          <View style={styles.mosqueTitleContainer}>
            <Text
              style={[
                styles.mosqueName,
                { textAlign: isRTL ? "right" : "left" },
              ]}
            >
              {name || t.unknownMosque || "Unknown Mosque"}
            </Text>

            {area ? (
              <Text
                style={[
                  styles.mosqueArea,
                  { textAlign: isRTL ? "right" : "left" },
                ]}
              >
                {area}
              </Text>
            ) : null}
          </View>

          <TouchableOpacity onPress={() => onToggleFavorite?.(mosque.id)}>
            <Ionicons
              name={isFavorite ? "heart" : "heart-outline"}
              size={24}
              color={isFavorite ? COLORS.red : COLORS.white}
            />
          </TouchableOpacity>
        </View>

        {/* 🔹 Programs */}
        <View style={styles.programTags}>
          {programs.length > 0 ? (
            programs.slice(0, 3).map((program, idx) => (
              <View key={idx} style={styles.programTag}>
                <Text style={styles.programTagText}>{program}</Text>
              </View>
            ))
          ) : (
            <View style={styles.programTag}>
              <Text style={styles.programTagText}>
                {t.noPrograms || "No Programs"}
              </Text>
            </View>
          )}
        </View>

        {/* 🔹 Actions */}
        <View
          style={[styles.cardActions, isRTL && { flexDirection: "row-reverse" }]}
        >
          <TouchableOpacity
            style={styles.viewDetailsButton}
            onPress={onViewDetails}
          >
            <Text style={styles.viewDetailsText}>
              {t.viewDetails || "View Details"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.directionsButton}
            onPress={openGoogleMaps}
          >
            <Ionicons name="navigate" size={20} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mosqueCard: {
    backgroundColor: COLORS.darkBrown,
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
  },
  mosqueImage: {
    width: "100%",
    height: 160,
    backgroundColor: COLORS.taupeGray,
  },
  mosqueInfo: { padding: 16 },
  mosqueHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  mosqueTitleContainer: { flex: 1, marginRight: 12 },
  mosqueName: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.white,
    marginBottom: 6,
  },
  mosqueArea: {
    fontSize: 13,
    color: COLORS.lightBeige,
  },
  programTags: {
    flexDirection: "row",
    flexWrap: "wrap",
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
    fontWeight: "500",
  },
  cardActions: {
    flexDirection: "row",
    gap: 12,
  },
  viewDetailsButton: {
    flex: 1,
    backgroundColor: COLORS.lightBeige,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  viewDetailsText: {
    color: COLORS.darkBrown,
    fontWeight: "600",
    fontSize: 14,
  },
  directionsButton: {
    backgroundColor: COLORS.taupeGray,
    width: 48,
    height: 48,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});
