import DateTimePicker from '@react-native-community/datetimepicker';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import type { LatLng, Region } from 'react-native-maps';
import MapView, { Marker } from 'react-native-maps';

export default function RequestARide() {
  const [currentLocation, setCurrentLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');
  const [region, setRegion] = useState<Region | null>(null);
  const [marker, setMarker] = useState<LatLng | null>(null);
  const [pickupType, setPickupType] = useState<'now' | 'later'>('now');
  const [showPicker, setShowPicker] = useState(false);
  const [pickupTime, setPickupTime] = useState(new Date());
  // Store full suggestion objects for uniqueness
  const [addressSuggestions, setAddressSuggestions] = useState<any[]>([]);
  const [addressQuery, setAddressQuery] = useState('');
  const [dropoffSuggestions, setDropoffSuggestions] = useState<any[]>([]);
  const [dropoffQuery, setDropoffQuery] = useState('');

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      } as Region);
      setMarker({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      } as LatLng);
    })();
  }, []);

  // Only autofill when the user focuses and the field is empty
  const handleCurrentLocationFocus = async () => {
    if (currentLocation) return;
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') return;
    let location = await Location.getCurrentPositionAsync({});
    let geocode = await Location.reverseGeocodeAsync({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });
    if (geocode && geocode.length > 0) {
      const addressObj = geocode[0];
      const address = `${addressObj.name ? addressObj.name + ', ' : ''}${addressObj.street ? addressObj.street + ', ' : ''}${addressObj.city ? addressObj.city + ', ' : ''}${addressObj.region ? addressObj.region + ', ' : ''}${addressObj.postalCode ? addressObj.postalCode + ', ' : ''}${addressObj.country || ''}`.replace(/, $/, '');
      setCurrentLocation(address);
    }
  };

  // Function to fetch address suggestions using Nominatim API (restricted to US)
  const fetchAddressSuggestions = async (query: string) => {
    if (!query || query.length < 3) {
      setAddressSuggestions([]);
      return;
    }
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&countrycodes=us&q=${encodeURIComponent(query)}`;
      const response = await fetch(url);
      const data = await response.json();
      setAddressSuggestions(data);
    } catch (e) {
      setAddressSuggestions([]);
    }
  };

  // Function to fetch dropoff address suggestions using Nominatim API (restricted to US)
  const fetchDropoffSuggestions = async (query: string) => {
    if (!query || query.length < 3) {
      setDropoffSuggestions([]);
      return;
    }
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&countrycodes=us&q=${encodeURIComponent(query)}`;
      const response = await fetch(url);
      const data = await response.json();
      setDropoffSuggestions(data);
    } catch (e) {
      setDropoffSuggestions([]);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Request a Ride</Text>
      <TextInput
        style={styles.input}
        placeholder="Current Location"
        value={addressQuery}
        onChangeText={text => {
          setAddressQuery(text);
          fetchAddressSuggestions(text);
        }}
        onFocus={handleCurrentLocationFocus}
      />
      {addressSuggestions.length > 0 && (
        <FlatList
          data={addressSuggestions}
          keyExtractor={item => item.osm_id?.toString() || item.display_name}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.suggestionItem}
              onPress={() => {
                setAddressQuery(item.display_name);
                setAddressSuggestions([]);
                setCurrentLocation(item.display_name);
              }}
            >
              <Text>{item.display_name}</Text>
            </TouchableOpacity>
          )}
          style={styles.suggestionList}
        />
      )}
      <TextInput
        style={styles.input}
        placeholder="Dropoff Location"
        value={dropoffQuery}
        onChangeText={text => {
          setDropoffQuery(text);
          fetchDropoffSuggestions(text);
        }}
      />
      {dropoffSuggestions.length > 0 && (
        <FlatList
          data={dropoffSuggestions}
          keyExtractor={item => item.osm_id?.toString() || item.display_name}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.suggestionItem}
              onPress={() => {
                setDropoffQuery(item.display_name);
                setDropoffSuggestions([]);
                setDropoffLocation(item.display_name);
              }}
            >
              <Text>{item.display_name}</Text>
            </TouchableOpacity>
          )}
          style={styles.suggestionList}
        />
      )}
      <View style={styles.pickupOptions}>
        <TouchableOpacity
          style={[styles.pickupButton, pickupType === 'now' && styles.pickupButtonSelected]}
          onPress={() => setPickupType('now')}
        >
          <Text style={[styles.pickupButtonText, pickupType === 'now' && styles.pickupButtonTextSelected]}>Pick Up Now</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.pickupButton, pickupType === 'later' && styles.pickupButtonSelected]}
          onPress={() => setPickupType('later')}
        >
          <Text style={[styles.pickupButtonText, pickupType === 'later' && styles.pickupButtonTextSelected]}>Pick Up Later</Text>
        </TouchableOpacity>
      </View>
      {pickupType === 'later' && (
        <>
          <TouchableOpacity style={styles.timePickerButton} onPress={() => setShowPicker(true)}>
            <Text style={styles.timePickerButtonText}>
              {pickupTime ? pickupTime.toLocaleString() : 'Select Date & Time'}
            </Text>
          </TouchableOpacity>
          {showPicker && (
            <DateTimePicker
              value={pickupTime}
              mode="datetime"
              display="default"
              onChange={(event, date) => {
                setShowPicker(false);
                if (date) setPickupTime(date);
              }}
            />
          )}
        </>
      )}
      {region && (
        <MapView
          style={styles.map}
          region={region}
          showsUserLocation={true}
        >
          {marker && <Marker coordinate={marker} />}
        </MapView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DFF5E3',
    alignItems: 'center',
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2F5233',
    marginBottom: 20,
  },
  input: {
    width: '90%',
    padding: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2F5233',
    borderRadius: 8,
    backgroundColor: '#FFFDF6',
    fontSize: 16,
  },
  map: {
    width: '90%',
    height: 300,
    borderRadius: 12,
    marginTop: 10,
  },
  pickupOptions: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
    marginTop: 8,
    gap: 10,
  },
  pickupButton: {
    backgroundColor: '#FFFDF6',
    borderColor: '#2F5233',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 18,
    marginHorizontal: 5,
  },
  pickupButtonSelected: {
    backgroundColor: '#2F5233',
  },
  pickupButtonText: {
    color: '#2F5233',
    fontWeight: '600',
  },
  pickupButtonTextSelected: {
    color: '#FFFDF6',
  },
  timePickerButton: {
    backgroundColor: '#FFFDF6',
    borderColor: '#2F5233',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 18,
    alignItems: 'center',
    marginBottom: 10,
  },
  timePickerButtonText: {
    color: '#2F5233',
    fontWeight: '600',
    fontSize: 16,
  },
  suggestionList: {
    width: '90%',
    maxHeight: 120,
    backgroundColor: '#FFFDF6',
    borderColor: '#2F5233',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 8,
    zIndex: 10,
  },
  suggestionItem: {
    padding: 10,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
});
