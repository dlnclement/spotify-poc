import { StyleSheet, Button, View, Dimensions, Text } from 'react-native';

import getAuthUrl from '@/utils/spotify.utils';
import { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';

const { width, height } = Dimensions.get("window")

export default function HomeScreen() {

  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { bottom, top } = useSafeAreaInsets()

  useEffect(() => {
    (async () => {

      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  let text = 'Waiting..';
  if (errorMsg) text = errorMsg;
  else if (location) text = JSON.stringify(location);

  return (
    <SafeAreaView>
      <ThemedView style={{ ...styles.titleContainer, gap: 16, height: height - bottom - top }}>
        <Button title='Spotify authentication' onPress={getAuthUrl}></Button>

        <View style={styles.titleContainer}>
          <ThemedText style={{ fontWeight: 600 }}>Location :</ThemedText>
          <ThemedText>altitude : {location?.coords.altitude}</ThemedText>
          <ThemedText>longitude : {location?.coords.longitude}</ThemedText>
          <ThemedText>latitude : {location?.coords.latitude}</ThemedText>
        </View>

        <View style={styles.titleContainer}>
          <ThemedText style={{ fontWeight: 600 }}>Precisions :</ThemedText>
          <ThemedText>altitude : {location?.coords.altitudeAccuracy}</ThemedText>
          <ThemedText>coordinates : {location?.coords.accuracy}</ThemedText>
        </View>

      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  }
});
