import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import type { LatLng, Region } from 'react-native-maps';
import MapView, { Marker } from 'react-native-maps';
import { API_ENDPOINTS } from '../constants/api';
import { useUser } from '../contexts/usercontext'; // import useUser
import { ButtonStyles, Colors, HeaderStyles, RecurringRideStyles, RideRequestStyles, SeniorDashboardStyles } from '../styles/globalStyles';


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

// Helper to format date in "10th Aug 1997" format
function formatDateDisplay(date: Date) {
  const day = date.getDate();
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  
  // Add ordinal suffix to day
  const getOrdinalSuffix = (day: number) => {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };
  
  return `${day}${getOrdinalSuffix(day)} ${month} ${year}`;
}

export default function RequestARide() {
  const router = useRouter();
  const { getUserInfo } = useUser(); // get getUserInfo from context
  const userInfo = getUserInfo();
  const userEmailAddress = userInfo?.emailaddress || '';
  const groupName = userInfo?.groupname || 'No Group Assigned';

  const [currentLocation, setCurrentLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');
  const [specialNote, setSpecialNote] = useState('');
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      const startTime = Date.now();
      console.log('🗺️ Starting location request...');
      
      let { status } = await Location.requestForegroundPermissionsAsync();
      console.log('📍 Permission status:', status, `(${Date.now() - startTime}ms)`);
      
      if (status !== 'granted') {
        console.log('❌ Location permission denied');
        Alert.alert('Permission needed', 'Location permission is required to show the map');
        return;
      }
      
      // Try last known position FIRST (much faster)
      console.log('� Checking for cached location...');
      try {
        let lastLocation = await Location.getLastKnownPositionAsync({
          maxAge: 300000, // 5 minutes
          requiredAccuracy: 1000, // 1km is fine for map display
        });
        
        if (lastLocation) {
          console.log('⚡ Using cached location:', lastLocation.coords, `(${Date.now() - startTime}ms)`);
          const newRegion = {
            latitude: lastLocation.coords.latitude,
            longitude: lastLocation.coords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          } as Region;
          
          setRegion(newRegion);
          setMarker({
            latitude: lastLocation.coords.latitude,
            longitude: lastLocation.coords.longitude,
          } as LatLng);
          
          // Still try to get fresh location in background, but don't wait
          setTimeout(async () => {
            try {
              console.log('🔄 Getting fresh location in background...');
              let freshLocation = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Low, // Use LOW for speed
              });
              console.log('🆕 Fresh location received:', freshLocation.coords);
              
              // Update with fresh location
              const freshRegion = {
                latitude: freshLocation.coords.latitude,
                longitude: freshLocation.coords.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              } as Region;
              
              setRegion(freshRegion);
              setMarker({
                latitude: freshLocation.coords.latitude,
                longitude: freshLocation.coords.longitude,
              } as LatLng);
            } catch (e) {
              console.log('🤷 Background location update failed (keeping cached location)');
            }
          }, 100);
          
          return; // Exit early with cached location
        }
      } catch (e) {
        console.log('🔍 No cached location available');
      }
      
      console.log('📡 Getting fresh location...', `(${Date.now() - startTime}ms)`);
      try {
        // Use LOW accuracy for much faster response
        let location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Low, // LOW is much faster than Balanced
        });
        console.log('✅ Fresh location received:', location.coords, `(${Date.now() - startTime}ms)`);
        
        const newRegion = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        } as Region;
        
        setRegion(newRegion);
        setMarker({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        } as LatLng);
        
      } catch (error) {
        console.log('❌ Location error:', error, `(${Date.now() - startTime}ms)`);
        console.log('💭 Using default location (New York)');
        
        // Use default location
        const defaultRegion = {
          latitude: 40.7128,
          longitude: -74.0060,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        } as Region;
        
        setRegion(defaultRegion);
        setMarker({
          latitude: 40.7128,
          longitude: -74.0060,
        } as LatLng);
      }
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

  // Signout handler
  const handleSignOut = () => {
    router.replace('/');
  };

  // Example error handler that navigates to dashboard
  const handleError = (message: string) => {
    Alert.alert('Error', message, [
      {
        text: 'OK',
      },
    ]);
  };

  return (
    
    <ScrollView style={RecurringRideStyles.recurringContainer} contentContainerStyle={RecurringRideStyles.scrollContent}>

      {/* Back Button */}

      <View style={HeaderStyles.headerRow} >
        {/* Back Button on the left */}
        <TouchableOpacity
          style={HeaderStyles.headerButton}
          onPress={() => router.replace('/senior-dashboard')}
        >
          <AntDesign name="home" size={25} color={Colors.primary} />
        </TouchableOpacity>

        {/* Logout Button on the right */}
        <TouchableOpacity
          style={HeaderStyles.headerButton}
          onPress={handleSignOut}
        >
          <MaterialIcons name="logout" size={25} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      

        <View style={SeniorDashboardStyles.navBar}>
          <Text style={SeniorDashboardStyles.navBarText}>Request a Ride</Text>
          <Text style={SeniorDashboardStyles.groupName}>({groupName})</Text>
        </View>
 
      {/* Current Location Container */}
      <View style={RideRequestStyles.inputContainer}>
        <TextInput
          style={RideRequestStyles.rideInput}
          placeholder="Current Location"
          value={addressQuery}
          onChangeText={text => {
            setAddressQuery(text);
            fetchAddressSuggestions(text);
          }}
          onFocus={handleCurrentLocationFocus}
          multiline={true}
          numberOfLines={3}
          textAlignVertical="top"
        />
        {addressSuggestions.length > 0 && (
          <View style={RideRequestStyles.suggestionList}>
            {addressSuggestions.slice(0, 5).map((item, index) => {
              // Remove county information from display_name
              const cleanAddress = item.display_name
                .split(', ')
                .filter((part: string) => !part.includes('County'))
                .join(', ')
                .replace('United States of America', 'USA')
                .replace('United States', 'USA');
              
              return (
                <TouchableOpacity
                  key={item.osm_id?.toString() || `address-${index}`}
                  style={RideRequestStyles.suggestionItem}
                  onPress={() => {
                    setAddressQuery(cleanAddress);
                    setAddressSuggestions([]);
                    setCurrentLocation(cleanAddress);
                  }}
                >
                  <Text>{cleanAddress}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </View>
      
      {/* Dropoff Location Container */}
      <View style={RideRequestStyles.inputContainer}>
        <TextInput
          style={RideRequestStyles.rideInput}
          placeholder="Dropoff Location"
          value={dropoffQuery}
          onChangeText={text => {
            setDropoffQuery(text);
            fetchDropoffSuggestions(text);
          }}
          multiline={true}
          numberOfLines={3}
          textAlignVertical="top"
        />
        {dropoffSuggestions.length > 0 && (
          <View style={RideRequestStyles.suggestionList}>
            {dropoffSuggestions.slice(0, 5).map((item, index) => {
              // Remove county information from display_name
              const cleanAddress = item.display_name
                .split(', ')
                .filter((part: string) => !part.includes('County'))
                .join(', ')
                .replace('United States of America', 'USA')
                .replace('United States', 'USA');
              
              return (
                <TouchableOpacity
                  key={item.osm_id?.toString() || `dropoff-${index}`}
                  style={RideRequestStyles.suggestionItem}
                  onPress={() => {
                    setDropoffQuery(cleanAddress);
                    setDropoffSuggestions([]);
                    setDropoffLocation(cleanAddress);
                  }}
                >
                  <Text>{cleanAddress}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </View>

      {/* Special Note Container */}
      <View style={RideRequestStyles.inputContainer}>
        <TextInput
          style={RideRequestStyles.rideInput}
          placeholder="Special Note (Optional)"
          value={specialNote}
          onChangeText={setSpecialNote}
          multiline={true}
          numberOfLines={3}
          textAlignVertical="top"
        />
      </View>

      {/* Pick Up Date button */}
      <TouchableOpacity
        style={RideRequestStyles.timePickerButton}
        onPress={() => setShowDatePicker(true)}
      >
        <Text style={RideRequestStyles.timePickerButtonText}>
          Date{pickupTime && !showDatePicker ? ` (${formatDateDisplay(pickupTime)})` : ''}
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
        style={RideRequestStyles.timePickerButton}
        onPress={() => setShowTimePicker(true)}
      >
        <Text style={RideRequestStyles.timePickerButtonText}>
          {(() => {
            if (pickupTime && !showTimePicker) {
              const formatted = format12Hour(pickupTime).split(' ');
              // Defensive: formatted should have at least 3 elements
              const hour = formatted[1] || '';
              const ampm = formatted[2] || '';
              return `Time (${hour} ${ampm})`;
            }
            return 'Time';
          })()}
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
      {region ? (
        <MapView
          style={RideRequestStyles.map}
          region={region}
          showsUserLocation={true}
        >
          {marker && <Marker coordinate={marker} />}
        </MapView>
      ) : (
        <View style={RideRequestStyles.map}>
          <Text style={{ textAlign: 'center', marginTop: 50, color: '#666' }}>
            Loading map... {'\n'}Check console for debug info
          </Text>
        </View>
      )}
      {/* Example usage: call handleError('Something went wrong!') where appropriate */}
      {/* Remove Back to Home button */}

      {/* Submit Button */}
      <TouchableOpacity
        style={[ButtonStyles.submitButton, isSubmitting && RideRequestStyles.submitButtonDisabled]}
        onPress={async () => {
          if (isSubmitting) return; // Prevent double submission
          
          if (!currentLocation || !dropoffLocation) {
            handleError('Please enter both pickup and dropoff locations.');
            return;
          }
          
          // Validate that pickup time is in the future
          const now = new Date();
          if (pickupTime <= now) {
            handleError('Please select a pickup date and time that is in the future.');
            return;
          }
          
          setIsSubmitting(true);
          
          try {
            console.log('DEBUG: Starting ride request API call...');
            // Only call the requestRide API, which now handles notifications/emails server-side
            await fetch(API_ENDPOINTS.REQUEST_RIDE, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                currentLocation,
                dropoffLocation,
                specialNote,
                pickupDateTime: pickupTime.toISOString(),
                userEmailAddress
              }),
            });

            // Send emailaddress to acceptRequests API
            await fetch(API_ENDPOINTS.ACCEPT_REQUESTS, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                emailaddress: userEmailAddress
              }),
            });

            setIsSubmitting(false);

            // Show success message, then navigate to dashboard
            Alert.alert(
              'Success',
              'Your ride request has been created successfully.',
              [
                {
                  text: 'OK',
                  onPress: () => router.replace('/senior-dashboard'),
                },
              ]
            );
          } catch (e) {
            setIsSubmitting(false);
            handleError('There was a problem requesting your ride. Please try again.');
          }
        }}
        disabled={isSubmitting}
      >
        <Text style={ButtonStyles.submitButtonText}>
          {isSubmitting ? 'Creating Request...' : 'Submit'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// Any remaining page-specific styles that aren't in global styles
const styles = StyleSheet.create({
  // Add any unique styles for this page here if needed
});



