// src/components/QiblaCompass.js
import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Animated,
  Easing,
  TouchableOpacity,
} from "react-native";
import * as Location from "expo-location";
import { Magnetometer } from "expo-sensors";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../constants/colors";

export default function QiblaCompass({ language = "en", setCurrentPage }) {
  const [heading, setHeading] = useState(0);
  const [qiblaAngle, setQiblaAngle] = useState(0);
  const [locationGranted, setLocationGranted] = useState(false);
  const [location, setLocation] = useState(null);
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const KAABA_LAT = 21.422487;
  const KAABA_LNG = 39.826206;

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert(
          language === "ar"
            ? "يرجى السماح بالوصول إلى الموقع لحساب اتجاه القبلة."
            : "Please allow location access to calculate Qibla direction."
        );
        setLocationGranted(false);
        return;
      }
      
      setLocationGranted(true);
      try {
        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.BestForNavigation,
        });
        const { latitude, longitude } = loc.coords;
        setLocation({ latitude, longitude });
        const calculatedAngle = calculateQiblaAngle(latitude, longitude);
        setQiblaAngle(calculatedAngle);
      } catch (error) {
        console.error("Location error:", error);
        setLocationGranted(false);
      }
    })();

    let magnetometerSubscription;
    if (Magnetometer.isAvailableAsync()) {
      magnetometerSubscription = Magnetometer.addListener((data) => {
        const { x, y } = data;
        
        // Calculate compass heading
        let angle = Math.atan2(y, x) * (180 / Math.PI);
        angle = angle >= 0 ? angle : angle + 360;
        
        // Convert from magnetic north to true north (basic conversion)
        // In a real app, you'd use DeviceMotion or more sophisticated methods
        setHeading(angle);
      });
      
      Magnetometer.setUpdateInterval(100);
    }

    return () => {
      if (magnetometerSubscription) {
        magnetometerSubscription.remove();
      }
    };
  }, []);

  const calculateQiblaAngle = (lat, lon) => {
    const phiK = (KAABA_LAT * Math.PI) / 180.0;
    const lambdaK = (KAABA_LNG * Math.PI) / 180.0;
    const phi = (lat * Math.PI) / 180.0;
    const lambda = (lon * Math.PI) / 180.0;
    
    const term1 = Math.sin(lambdaK - lambda);
    const term2 = Math.cos(phi) * Math.tan(phiK) - Math.sin(phi) * Math.cos(lambdaK - lambda);
    
    let psi = (180 / Math.PI) * Math.atan2(term1, term2);
    
    // Normalize to 0-360 degrees
    if (psi < 0) psi += 360;
    if (psi >= 360) psi -= 360;
    
    return psi;
  };

  // Calculate the rotation angle for the arrow
  const angle = (qiblaAngle - heading + 360) % 360;

  // Animate the arrow rotation
  Animated.timing(rotateAnim, {
    toValue: angle,
    duration: 300,
    easing: Easing.ease,
    useNativeDriver: true,
  }).start();

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 360],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={styles.container}>
      {/* 🔙 Floating Return Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => setCurrentPage("prayer")}
      >
        <Ionicons name="arrow-back" size={22} color={COLORS.darkBrown} />
      </TouchableOpacity>

      <Text style={styles.title}>
        {language === "ar" ? "🕋 اتجاه القبلة" : "🧭 Qibla Direction"}
      </Text>

      {locationGranted ? (
        <View style={styles.compassWrapper}>
          {/* 🧭 Compass Background */}
          <Animated.View
            style={[
              styles.compassContainer,
              { transform: [{ rotate: `${360 - heading}deg` }] },
            ]}
          >
            <Image
              source={{
                uri: "https://i.ibb.co/YL7KQ3f/compass-rose.png",
              }}
              style={styles.compass}
              resizeMode="contain"
            />
          </Animated.View>

          {/* 🕋 Kaaba Arrow */}
          <Animated.View
            style={[
              styles.arrowContainer,
              { transform: [{ rotate: rotation }] }
            ]}
          >
            <View style={styles.arrow} />
            <Text style={styles.kaabaText}>
              {language === "ar" ? "🕋" : "🕋 Kaaba"}
            </Text>
          </Animated.View>

          {/* Center dot */}
          <View style={styles.centerDot} />
        </View>
      ) : (
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionText}>
            {language === "ar"
              ? "يرجى تفعيل إذن الموقع لعرض الاتجاه."
              : "Please enable location permission to show direction."}
          </Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => window.location.reload()}
          >
            <Text style={styles.retryButtonText}>
              {language === "ar" ? "إعادة المحاولة" : "Retry"}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <Text style={styles.angleText}>
        {language === "ar"
          ? `زاوية القبلة: ${angle.toFixed(1)}° من الشمال`
          : `Qibla Angle: ${angle.toFixed(1)}° from North`}
      </Text>
      
      {location && (
        <Text style={styles.locationText}>
          {language === "ar" 
            ? `موقعك: ${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`
            : `Your Location: ${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3A2E2E",
    flex: 1,
    paddingHorizontal: 20,
  },
  backButton: {
    position: "absolute",
    top: 45,
    left: 20,
    backgroundColor: COLORS.lightBeige,
    borderRadius: 25,
    width: 45,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    zIndex: 10,
  },
  title: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 80,
    marginBottom: 30,
  },
  compassWrapper: {
    alignItems: "center",
    justifyContent: "center",
    width: 300,
    height: 300,
    position: 'relative',
  },
  compassContainer: {
    width: 280,
    height: 280,
    justifyContent: "center",
    alignItems: "center",
    position: 'absolute',
  },
  compass: {
    width: 280,
    height: 280,
    tintColor: COLORS.lightBeige,
    opacity: 0.9,
  },
  arrowContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: 140,
  },
  arrow: {
    width: 4,
    height: 120,
    backgroundColor: '#FFD700',
    borderRadius: 2,
  },
  kaabaText: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 5,
  },
  centerDot: {
    width: 12,
    height: 12,
    backgroundColor: '#FF6B6B',
    borderRadius: 6,
    position: 'absolute',
  },
  angleText: {
    color: COLORS.lightBeige,
    marginTop: 30,
    fontSize: 18,
    fontWeight: "600",
  },
  locationText: {
    color: COLORS.taupeGray,
    marginTop: 10,
    fontSize: 12,
  },
  permissionContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 50,
  },
  permissionText: {
    color: COLORS.white,
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: COLORS.lightBeige,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: COLORS.darkBrown,
    fontWeight: '600',
  },
});