import React from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { COLORS } from "../constants/colors";
import { getLocalizedText } from "../utils/getLocalizedText";

export default function MosqueMapView({ mosques = [], language = "en" }) {
  const initialRegion = {
    latitude: mosques[0]?.latitude || 24.4539,
    longitude: mosques[0]?.longitude || 54.3773,
    latitudeDelta: 0.1, // zoom in slightly
    longitudeDelta: 0.1,
  };

  return (
    <View style={styles.mapContainer}>
      <MapView
        style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation
        showsCompass
        zoomEnabled
        zoomControlEnabled
      >
        {mosques.map((mosque, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: mosque.latitude || 24.4539 + Math.random() * 0.01,
              longitude: mosque.longitude || 54.3773 + Math.random() * 0.01,
            }}
            title={getLocalizedText(mosque.name, language) || "Mosque"}
            description={getLocalizedText(mosque.area, language) || "Mosque location"}
            pinColor={COLORS.darkBrown}
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  mapContainer: {
    height: Dimensions.get("window").height * 0.55, // ✅ bigger map
    marginHorizontal: 10,
    marginTop: 10,
    marginBottom: 25,
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: COLORS.taupeGray,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  map: {
    flex: 1,
  },
});
