import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, PermissionsAndroid, Platform } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { magnetometer, SensorTypes, setUpdateIntervalForType } from 'react-native-sensors';
import { map, filter } from 'rxjs/operators';

const KAABA_LAT = 21.4225;   // Latitude of Kaaba
const KAABA_LON = 39.8262;   // Longitude of Kaaba

const toRadians = (deg) => deg * Math.PI / 180;
const toDegrees = (rad) => rad * 180 / Math.PI;

function calculateBearing(lat1, lon1, lat2, lon2) {
  let dLon = toRadians(lon2 - lon1);
  let y = Math.sin(dLon) * Math.cos(toRadians(lat2));
  let x = Math.cos(toRadians(lat1)) * Math.sin(toRadians(lat2)) -
          Math.sin(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.cos(dLon);
  let brng = Math.atan2(y, x);
  return (toDegrees(brng) + 360) % 360;
}

export default function QiblaCompass() {
  const [bearing, setBearing] = useState(0);   // Qibla direction
  const [heading, setHeading] = useState(0);   // Compass heading

  useEffect(() => {
    // Request GPS permission (Android only)
    if (Platform.OS === 'android') {
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
    }

    // Get user location
    Geolocation.getCurrentPosition(
      (pos) => {
        let { latitude, longitude } = pos.coords;
        let qiblaBearing = calculateBearing(latitude, longitude, KAABA_LAT, KAABA_LON);
        setBearing(qiblaBearing);
      },
      (err) => console.warn(err.message),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );

    // Compass updates
    setUpdateIntervalForType(SensorTypes.magnetometer, 100); // update every 100ms
    const subscription = magnetometer
      .pipe(
        map(({ x, y }) => {
          let angle = Math.atan2(y, x);
          let heading = toDegrees(angle);
          heading = (heading + 360) % 360;
          return heading;
        })
      )
      .subscribe(setHeading);

    return () => subscription.unsubscribe();
  }, []);

  let direction = (bearing - heading + 360) % 360;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Qibla Direction</Text>
      <View style={{ transform: [{ rotate: `${direction}deg` }] }}>
        <Image source={require('./arrow.png')} style={styles.arrow} />
      </View>
      <Text style={styles.text}>Rotate phone flat to find Qibla</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#222', justifyContent: 'center', alignItems: 'center' },
  text: { color: '#fff', fontSize: 18, margin: 10 },
  arrow: { width: 120, height: 120, tintColor: '#FFD700' } // golden arrow
});