// src/screens/QiblaCompass.js
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import * as Location from "expo-location";
import { Magnetometer } from "expo-sensors";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../constants/colors";

// 📍 Kaaba Coordinates
const KAABA_LAT = 21.4225;
const KAABA_LON = 39.8262;

const toRadians = (deg) => (deg * Math.PI) / 180;
const toDegrees = (rad) => (rad * 180) / Math.PI;

function calculateBearing(lat1, lon1, lat2, lon2) {
  const dLon = toRadians(lon2 - lon1);
  const y = Math.sin(dLon) * Math.cos(toRadians(lat2));
  const x =
    Math.cos(toRadians(lat1)) * Math.sin(toRadians(lat2)) -
    Math.sin(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.cos(dLon);
  const brng = Math.atan2(y, x);
  return (toDegrees(brng) + 360) % 360;
}

export default function QiblaCompass({ isDarkMode, setCurrentPage }) {
  const [bearing, setBearing] = useState(0);
  const [heading, setHeading] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Location permission denied.");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const qibla = calculateBearing(
        location.coords.latitude,
        location.coords.longitude,
        KAABA_LAT,
        KAABA_LON
      );
      setBearing(qibla);
    })();

    const subscription = Magnetometer.addListener((data) => {
      const { x, y } = data;
      let angle = Math.atan2(y, x);
      let heading = toDegrees(angle);
      heading = (heading + 360) % 360;
      setHeading(heading);
    });

    Magnetometer.setUpdateInterval(100);

    return () => subscription.remove();
  }, []);

  const direction = (bearing - heading + 360) % 360;

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? COLORS.darkBrown : "#111" },
      ]}
    >
      {/* 🔙 Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => setCurrentPage("prayer")}
      >
        <Ionicons name="arrow-back" size={24} color={COLORS.white} />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      {/* 🕋 Title */}
      <Text style={styles.title}>Qibla Direction</Text>

      {errorMsg ? (
        <Text style={styles.error}>{errorMsg}</Text>
      ) : (
        <View style={styles.compassOuter}>
          {/* Circular dial */}
          <View style={styles.dial}>
            {/* Kaaba in the center */}
            <Image
              source={require("../../assets/kaaba.png")}
              style={styles.kaaba}
            />

            {/* Rotating Arrow */}
            <View
              style={[
                styles.arrowContainer,
                { transform: [{ rotate: `${direction}deg` }] },
              ]}
            >
              <View style={styles.arrow} />
            </View>
          </View>
        </View>
      )}

      <Text style={styles.helperText}>
        {direction < 10 || direction > 350
          ? "✅ You are facing Qibla"
          : "↻ Rotate your phone to align with Qibla"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  backText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
  },
  title: {
    color: COLORS.white,
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 30,
  },
  compassOuter: {
    justifyContent: "center",
    alignItems: "center",
  },
  dial: {
    width: 250,
    height: 250,
    borderRadius: 125,
    borderWidth: 4,
    borderColor: "#FFD700",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1c1c1c",
  },
  arrowContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  arrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 17,
    borderRightWidth: 12,
    borderBottomWidth: 65,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "#FFD700", // golden arrow
    borderRadius: 2,
  },
  kaaba: {
    width: 0,
    height: 0,
    resizeMode: "contain",
  },
  helperText: {
    color: "#ccc",
    fontSize: 14,
    marginTop: 24,
    textAlign: "center",
  },
  error: {
    color: "red",
    fontSize: 14,
    marginVertical: 10,
  },
});
