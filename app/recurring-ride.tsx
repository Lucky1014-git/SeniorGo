import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { API_ENDPOINTS } from '../constants/api';
import { useUser } from '../contexts/usercontext';

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

// Helper to format time in 12-hour format
function formatTimeDisplay(date: Date) {
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // 0 should be 12
  const minStr = minutes < 10 ? '0' + minutes : minutes;
  return `${hours}:${minStr} ${ampm}`;
}

export default function RecurringRide() {
  const router = useRouter();
  const { getUserInfo } = useUser();
  const userInfo = getUserInfo();
  const userEmailAddress = userInfo?.emailaddress || '';

  const [currentLocation, setCurrentLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(() => {
    const date = new Date();
    date.setMonth(date.getMonth() + 1); // Default to 1 month from now
    return date;
  });
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [activeTimeDay, setActiveTimeDay] = useState<string | null>(null);
  
  // Address suggestions
  const [addressSuggestions, setAddressSuggestions] = useState<any[]>([]);
  const [addressQuery, setAddressQuery] = useState('');
  const [dropoffSuggestions, setDropoffSuggestions] = useState<any[]>([]);
  const [dropoffQuery, setDropoffQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Weekly schedule - each day can have a time or be disabled
  const [weeklySchedule, setWeeklySchedule] = useState<{[key: string]: {enabled: boolean, time: Date}}>({
    Monday: { enabled: false, time: new Date() },
    Tuesday: { enabled: false, time: new Date() },
    Wednesday: { enabled: false, time: new Date() },
    Thursday: { enabled: false, time: new Date() },
    Friday: { enabled: false, time: new Date() },
    Saturday: { enabled: false, time: new Date() },
    Sunday: { enabled: false, time: new Date() },
  });

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  useEffect(() => {
    // Set default times for all days (9:00 AM)
    const defaultTime = new Date();
    defaultTime.setHours(9, 0, 0, 0);
    
    setWeeklySchedule(prev => {
      const updated = { ...prev };
      days.forEach(day => {
        updated[day] = { ...updated[day], time: new Date(defaultTime) };
      });
      return updated;
    });
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
      setAddressQuery(address);
    }
  };

  // Function to fetch address suggestions
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

  // Function to fetch dropoff address suggestions
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

  // Toggle day enabled/disabled
  const toggleDay = (day: string) => {
    setWeeklySchedule(prev => ({
      ...prev,
      [day]: { ...prev[day], enabled: !prev[day].enabled }
    }));
  };

  // Open time picker for specific day
  const openTimePicker = (day: string) => {
    setActiveTimeDay(day);
    setShowTimePicker(true);
  };

  // Handle time change
  const handleTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime && activeTimeDay) {
      setWeeklySchedule(prev => ({
        ...prev,
        [activeTimeDay]: { ...prev[activeTimeDay], time: selectedTime }
      }));
    }
    setActiveTimeDay(null);
  };

  // Validate end date (max 3 months from start)
  const validateEndDate = (end: Date, start: Date) => {
    const maxEndDate = new Date(start);
    maxEndDate.setMonth(maxEndDate.getMonth() + 3);
    return end <= maxEndDate;
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Signout Icon Button */}
      <TouchableOpacity style={styles.signoutButton} onPress={handleSignOut}>
        <MaterialIcons name="logout" size={22} color="#2F5233" />
      </TouchableOpacity>
      
      {/* Back Arrow to Dashboard */}
      <TouchableOpacity style={styles.backArrow} onPress={() => router.replace('/senior-dashboard')}>
        <Text style={styles.backArrowText}>←</Text>
      </TouchableOpacity>
      
      <Text style={styles.title}>Request Recurring Ride</Text>
      
      {/* Current Location Container */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Current Location"
          value={addressQuery}
          onChangeText={text => {
            setAddressQuery(text);
            setCurrentLocation(text); // Update currentLocation as user types
            fetchAddressSuggestions(text);
          }}
          onFocus={handleCurrentLocationFocus}
          multiline={true}
          numberOfLines={3}
          textAlignVertical="top"
        />
        {addressSuggestions.length > 0 && (
          <ScrollView
            style={styles.suggestionList}
            nestedScrollEnabled={true}
            keyboardShouldPersistTaps="handled"
          >
            {addressSuggestions.map((item) => (
              <TouchableOpacity
                key={item.osm_id?.toString() || item.display_name}
                style={styles.suggestionItem}
                onPress={() => {
                  setAddressQuery(item.display_name);
                  setAddressSuggestions([]);
                  setCurrentLocation(item.display_name);
                }}
              >
                <Text>{item.display_name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>
      
      {/* Dropoff Location Container */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Dropoff Location"
          value={dropoffQuery}
          onChangeText={text => {
            setDropoffQuery(text);
            setDropoffLocation(text); // Update dropoffLocation as user types
            fetchDropoffSuggestions(text);
          }}
          multiline={true}
          numberOfLines={3}
          textAlignVertical="top"
        />
        {dropoffSuggestions.length > 0 && (
          <ScrollView
            style={styles.suggestionList}
            nestedScrollEnabled={true}
            keyboardShouldPersistTaps="handled"
          >
            {dropoffSuggestions.map((item) => (
              <TouchableOpacity
                key={item.osm_id?.toString() || item.display_name}
                style={styles.suggestionItem}
                onPress={() => {
                  setDropoffQuery(item.display_name);
                  setDropoffSuggestions([]);
                  setDropoffLocation(item.display_name);
                }}
              >
                <Text>{item.display_name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>

      {/* Start Date */}
      <TouchableOpacity
        style={styles.datePickerButton}
        onPress={() => setShowStartDatePicker(true)}
      >
        <Text style={styles.datePickerButtonText}>
          Start Date ({formatDateDisplay(startDate)})
        </Text>
      </TouchableOpacity>
      {showStartDatePicker && (
        <DateTimePicker
          value={startDate}
          mode="date"
          display="default"
          minimumDate={new Date()}
          onChange={(event, date) => {
            setShowStartDatePicker(false);
            if (date) {
              setStartDate(date);
              // Update end date if it's now invalid
              if (!validateEndDate(endDate, date)) {
                const newEndDate = new Date(date);
                newEndDate.setMonth(newEndDate.getMonth() + 1);
                setEndDate(newEndDate);
              }
            }
          }}
        />
      )}

      {/* Weekly Schedule */}
      <Text style={styles.sectionTitle}>Weekly Schedule</Text>
      {days.map((day) => (
        <View key={day} style={styles.dayRow}>
          <TouchableOpacity
            style={[styles.dayToggle, weeklySchedule[day].enabled && styles.dayToggleActive]}
            onPress={() => toggleDay(day)}
          >
            <Text style={[styles.dayToggleText, weeklySchedule[day].enabled && styles.dayToggleTextActive]}>
              {weeklySchedule[day].enabled ? '✓' : '○'}
            </Text>
          </TouchableOpacity>
          
          <Text style={[styles.dayName, weeklySchedule[day].enabled && styles.dayNameActive]}>
            {day}
          </Text>
          
          <TouchableOpacity
            style={[styles.timeButton, !weeklySchedule[day].enabled && styles.timeButtonDisabled]}
            onPress={() => weeklySchedule[day].enabled && openTimePicker(day)}
            disabled={!weeklySchedule[day].enabled}
          >
            <Text style={[styles.timeButtonText, !weeklySchedule[day].enabled && styles.timeButtonTextDisabled]}>
              {formatTimeDisplay(weeklySchedule[day].time)}
            </Text>
          </TouchableOpacity>
        </View>
      ))}

      {showTimePicker && (
        <DateTimePicker
          value={activeTimeDay ? weeklySchedule[activeTimeDay].time : new Date()}
          mode="time"
          display="default"
          onChange={handleTimeChange}
        />
      )}

      {/* End Date */}
      <TouchableOpacity
        style={styles.datePickerButton}
        onPress={() => setShowEndDatePicker(true)}
      >
        <Text style={styles.datePickerButtonText}>
          End Date ({formatDateDisplay(endDate)})
        </Text>
      </TouchableOpacity>
      {showEndDatePicker && (
        <DateTimePicker
          value={endDate}
          mode="date"
          display="default"
          minimumDate={startDate}
          maximumDate={(() => {
            const maxDate = new Date(startDate);
            maxDate.setMonth(maxDate.getMonth() + 3);
            return maxDate;
          })()}
          onChange={(event: any, date?: Date) => {
            setShowEndDatePicker(false);
            if (date) {
              if (validateEndDate(date, startDate)) {
                setEndDate(date);
              } else {
                Alert.alert('Invalid Date', 'End date cannot be more than 3 months from start date.');
              }
            }
          }}
        />
      )}

      {/* Submit Button */}
      <TouchableOpacity
        style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
        onPress={async () => {
          if (isSubmitting) return;
          
          // Check both the state variables and the displayed text, trimming whitespace
          const pickupLocation = currentLocation?.trim() || addressQuery?.trim();
          const dropLocation = dropoffLocation?.trim() || dropoffQuery?.trim();
          
          if (!pickupLocation || !dropLocation) {
            Alert.alert('Error', 'Please enter both pickup and dropoff locations.');
            return;
          }
          
          const enabledDays = Object.entries(weeklySchedule).filter(([_, schedule]) => schedule.enabled);
          if (enabledDays.length === 0) {
            Alert.alert('Error', 'Please select at least one day for the recurring ride.');
            return;
          }
          
          // Validate that start date is in the future or today
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          if (startDate < today) {
            Alert.alert('Error', 'Please select a start date that is today or in the future.');
            return;
          }
          
          setIsSubmitting(true);
          
          try {
            // Prepare the recurring ride data
            const recurringRideData = {
              currentLocation: pickupLocation,
              dropoffLocation: dropLocation,
              startDate: startDate.toISOString(),
              endDate: endDate.toISOString(),
              weeklySchedule: Object.fromEntries(
                enabledDays.map(([day, schedule]) => [
                  day,
                  {
                    time: schedule.time.toTimeString().slice(0, 5), // HH:MM format
                    enabled: true
                  }
                ])
              ),
              userEmailAddress
            };
            
            console.log('DEBUG: Starting recurring ride API call...');
            console.log('DEBUG: REQUEST_RECURRING_RIDE endpoint:', API_ENDPOINTS.REQUEST_RECURRING_RIDE);
            console.log('DEBUG: Recurring ride payload:', recurringRideData);
            
            // Call the recurring ride API
            const response = await fetch(API_ENDPOINTS.REQUEST_RECURRING_RIDE, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(recurringRideData),
            });
            
            console.log('DEBUG: Recurring ride response status:', response.status);
            console.log('DEBUG: Recurring ride response ok:', response.ok);
            
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const responseData = await response.json();
            console.log('DEBUG: Recurring ride response data:', responseData);
            
            setIsSubmitting(false);
            
            Alert.alert(
              'Success',
              'Your recurring ride request has been created successfully.',
              [
                {
                  text: 'OK',
                  onPress: () => router.replace('/senior-dashboard'),
                },
              ]
            );
          } catch (e) {
            console.log('DEBUG: Error creating recurring ride:', e);
            const error = e as Error;
            console.log('DEBUG: Error message:', error.message);
            console.log('DEBUG: Error stack:', error.stack);
            setIsSubmitting(false);
            Alert.alert('Error', 'There was a problem creating your recurring ride. Please try again.');
          }
        }}
        disabled={isSubmitting}
      >
        <Text style={styles.submitButtonText}>
          {isSubmitting ? 'Creating Request...' : 'Submit Recurring Ride'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DFF5E3',
  },
  scrollContent: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2F5233',
    marginBottom: 20,
  },
  inputContainer: {
    width: '90%',
    position: 'relative',
    marginBottom: 12,
    zIndex: 1,
  },
  input: {
    width: '100%',
    padding: 10,
    marginBottom: 0,
    borderWidth: 1,
    borderColor: '#2F5233',
    borderRadius: 8,
    backgroundColor: '#FFFDF6',
    fontSize: 16,
    minHeight: 72,
  },
  suggestionList: {
    width: '100%',
    maxHeight: 120,
    backgroundColor: '#FFFDF6',
    borderColor: '#2F5233',
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 2,
    zIndex: 1000,
    elevation: 5,
    position: 'absolute',
    bottom: 72,
  },
  suggestionItem: {
    padding: 10,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  datePickerButton: {
    backgroundColor: '#FFFDF6',
    borderColor: '#2F5233',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 20,
    width: '90%',
  },
  datePickerButtonText: {
    color: '#2F5233',
    fontWeight: '600',
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2F5233',
    marginBottom: 15,
    marginTop: 10,
  },
  dayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    marginBottom: 12,
    paddingVertical: 8,
  },
  dayToggle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#2F5233',
    backgroundColor: '#FFFDF6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  dayToggleActive: {
    backgroundColor: '#2F5233',
  },
  dayToggleText: {
    color: '#2F5233',
    fontWeight: '700',
    fontSize: 16,
  },
  dayToggleTextActive: {
    color: '#FFFDF6',
  },
  dayName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  dayNameActive: {
    color: '#2F5233',
  },
  timeButton: {
    backgroundColor: '#FFFDF6',
    borderColor: '#2F5233',
    borderWidth: 1,
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    minWidth: 80,
    alignItems: 'center',
  },
  timeButtonDisabled: {
    backgroundColor: '#F5F5F5',
    borderColor: '#CCC',
  },
  timeButtonText: {
    color: '#2F5233',
    fontWeight: '600',
    fontSize: 14,
  },
  timeButtonTextDisabled: {
    color: '#999',
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
    marginTop: 30,
    marginBottom: 24,
    width: '90%',
  },
  submitButtonDisabled: {
    backgroundColor: '#9CA3AF',
    opacity: 0.7,
  },
  submitButtonText: {
    color: '#FFFDF6',
    fontWeight: '700',
    fontSize: 18,
  },
  signoutButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
    padding: 6,
    backgroundColor: '#FFFDF6',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#2F5233',
    alignItems: 'center',
    justifyContent: 'center',
  },
});