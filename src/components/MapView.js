import React from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { COLORS } from '../constants/colors';

export default function MosqueMapView({ mosques = [] }) {
  // Default region (you can adjust or make dynamic later)
  const initialRegion = {
    latitude: mosques[0]?.latitude || 17.3850,  // fallback to Hyderabad
    longitude: mosques[0]?.longitude || 78.4867,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  return (
    <View style={styles.mapContainer}>
      <MapView
        style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation={true}
        showsCompass={true}
        zoomControlEnabled={true}
      >
        {mosques.map((mosque, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: mosque.latitude || 17.3850 + Math.random() * 0.02,
              longitude: mosque.longitude || 78.4867 + Math.random() * 0.02,
            }}
            title={mosque.name || "Masjid"}
            description={mosque.address || "Mosque location"}
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  mapContainer: {
    height: 280,
    backgroundColor: COLORS.taupeGray,
    margin: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
});
