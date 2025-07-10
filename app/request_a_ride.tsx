import DateTimePicker from '@react-native-community/datetimepicker';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import type { LatLng, Region } from 'react-native-maps';
import MapView, { Marker } from 'react-native-maps';
import { useUser } from '../contexts/usercontext'; // import useUser


// Helper to format date in 12-hour AM/PM format
function format12Hour(date: Date) {
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // 0 should be 12
  const minStr = minutes < 10 ? '0' + minutes : minutes;
  return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()} ${hours}:${minStr} ${ampm}`;
}

export default function RequestARide() {
  const router = useRouter();
  const { getUserInfo } = useUser(); // get getUserInfo from context
  const userInfo = getUserInfo();
  const userEmailAddress = userInfo?.emailaddress || '';

  const [currentLocation, setCurrentLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');
  const [region, setRegion] = useState<Region | null>(null);
  const [marker, setMarker] = useState<LatLng | null>(null);
  const [pickupType, setPickupType] = useState<'now' | 'later' | 'at'>('now');
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
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
      setDropoffSuggestions([]);
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

  // Example error handler that navigates to dashboard
  const handleError = (message: string) => {
    Alert.alert('Error', message, [
      {
        text: 'Go to Dashboard',
        onPress: () => router.replace('/senior-dashboard'),
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* Back Arrow to Dashboard */}
      <TouchableOpacity style={styles.backArrow} onPress={() => router.replace('/senior-dashboard')}>
        <Text style={styles.backArrowText}>←</Text>
      </TouchableOpacity>
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
      {/* Pick Up Date button */}
      <TouchableOpacity
        style={styles.timePickerButton}
        onPress={() => setShowDatePicker(true)}
      >
        <Text style={styles.timePickerButtonText}>
          Select Pick Up Date{pickupTime && !showDatePicker ? ` (${pickupTime.getMonth() + 1}/${pickupTime.getDate()}/${pickupTime.getFullYear()})` : ''}
        </Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={pickupTime}
          mode="date"
          display="default"
          onChange={(event, date) => {
            setShowDatePicker(false);
            if (date) {
              // Keep the time, update only the date
              const newDate = new Date(date);
              newDate.setHours(pickupTime.getHours());
              newDate.setMinutes(pickupTime.getMinutes());
              setPickupTime(newDate);
            }
          }}
        />
      )}
      {/* Pick Up Time button */}
      <TouchableOpacity
        style={styles.timePickerButton}
        onPress={() => setShowTimePicker(true)}
      >
        <Text style={styles.timePickerButtonText}>
          Select Pick Up Time{pickupTime && !showTimePicker ? ` (${format12Hour(pickupTime).split(' ')[1]} ${format12Hour(pickupTime).split(' ')[2]})` : ''}
        </Text>
      </TouchableOpacity>
      {showTimePicker && (
        <DateTimePicker
          value={pickupTime}
          mode="time"
          display="default"
          onChange={(event, date) => {
            setShowTimePicker(false);
            if (date) {
              // Keep the date, update only the time
              const newDate = new Date(pickupTime);
              newDate.setHours(date.getHours());
              newDate.setMinutes(date.getMinutes());
              setPickupTime(newDate);
            }
          }}
        />
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
      {/* Example usage: call handleError('Something went wrong!') where appropriate */}
      {/* Remove Back to Home button */}

      {/* Submit Button */}
      <TouchableOpacity
        style={styles.submitButton}
        onPress={async () => {
          if (!currentLocation || !dropoffLocation) {
            handleError('Please enter both pickup and dropoff locations.');
            return;
          }
          try {
            // Only call the requestRide API, which now handles notifications/emails server-side
            await fetch('http://10.0.0.23:5000/requestRide', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                currentLocation,
                dropoffLocation,
                pickupDateTime: pickupTime.toISOString(),
                userEmailAddress
              }),
            });

            // Show success message, then navigate to dashboard
            Alert.alert(
              'Success',
              'Your ride will be here soon.',
              [
                {
                  text: 'OK',
                  onPress: () => router.replace('/senior-dashboard'),
                },
              ]
            );
          } catch (e) {
            handleError('There was a problem requesting your ride. Please try again.');
          }
        }}
      >
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
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
    paddingVertical: 7, // reduced from 10
    paddingHorizontal: 14, // reduced from 18
    alignItems: 'center',
    marginBottom: 10,
  },
  timePickerButtonText: {
    color: '#2F5233',
    fontWeight: '600',
    fontSize: 15, // reduced from 16
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
  backArrow: {
    position: 'absolute',
    top: 40,
    left: 20,
    padding: 8,
    zIndex: 10,
  },
  backArrowText: {
    fontSize: 32,
    color: '#2F5233',
  },
  submitButton: {
    backgroundColor: '#2F5233',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 40,
    alignItems: 'center',
    marginTop: 18,
    marginBottom: 24,
  },
  submitButtonText: {
    color: '#FFFDF6',
    fontWeight: '700',
    fontSize: 18,
  },
});



