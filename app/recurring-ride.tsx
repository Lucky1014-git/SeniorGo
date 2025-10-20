import { MaterialIcons } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { API_ENDPOINTS } from '../constants/api';
import { useUser } from '../contexts/usercontext';
import { Colors, HeaderStyles, RecurringRideStyles, SeniorDashboardStyles } from '../styles/globalStyles';

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
  const groupName = userInfo?.groupname || 'No Group Assigned';
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
    <ScrollView style={RecurringRideStyles.recurringContainer} contentContainerStyle={RecurringRideStyles.scrollContent}>
      {/* Signout Icon Button */}

      <View style={HeaderStyles.headerRow}>
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
        <Text style={SeniorDashboardStyles.navBarText}>Request Recurring Ride</Text>
        <Text style={SeniorDashboardStyles.groupName}>({groupName})</Text>
      </View>

      
      
      {/* Current Location Container */}
      <View style={RecurringRideStyles.recurringInputContainer}>
        <TextInput
          style={RecurringRideStyles.recurringInput}
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
            style={RecurringRideStyles.recurringSuggestionList}
            nestedScrollEnabled={true}
            keyboardShouldPersistTaps="handled"
          >
            {addressSuggestions.map((item) => (
              <TouchableOpacity
                key={item.osm_id?.toString() || item.display_name}
                style={RecurringRideStyles.recurringSuggestionItem}
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
      <View style={RecurringRideStyles.recurringInputContainer}>
        <TextInput
          style={RecurringRideStyles.recurringInput}
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
            style={RecurringRideStyles.recurringSuggestionList}
            nestedScrollEnabled={true}
            keyboardShouldPersistTaps="handled"
          >
            {dropoffSuggestions.map((item) => (
              <TouchableOpacity
                key={item.osm_id?.toString() || item.display_name}
                style={RecurringRideStyles.recurringSuggestionItem}
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
        style={RecurringRideStyles.datePickerButton}
        onPress={() => setShowStartDatePicker(true)}
      >
        <Text style={RecurringRideStyles.datePickerButtonText}>
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
      <Text style={RecurringRideStyles.sectionTitle}>Weekly Schedule</Text>
      {days.map((day) => (
        <View key={day} style={RecurringRideStyles.dayRow}>
          <TouchableOpacity
            style={[RecurringRideStyles.dayToggle, weeklySchedule[day].enabled && RecurringRideStyles.dayToggleActive]}
            onPress={() => toggleDay(day)}
          >
            <Text style={[RecurringRideStyles.dayToggleText, weeklySchedule[day].enabled && RecurringRideStyles.dayToggleTextActive]}>
              {weeklySchedule[day].enabled ? '✓' : '○'}
            </Text>
          </TouchableOpacity>
          
          <Text style={[RecurringRideStyles.dayName, weeklySchedule[day].enabled && RecurringRideStyles.dayNameActive]}>
            {day}
          </Text>
          
          <TouchableOpacity
            style={[RecurringRideStyles.timeButton, !weeklySchedule[day].enabled && RecurringRideStyles.timeButtonDisabled]}
            onPress={() => weeklySchedule[day].enabled && openTimePicker(day)}
            disabled={!weeklySchedule[day].enabled}
          >
            <Text style={[RecurringRideStyles.timeButtonText, !weeklySchedule[day].enabled && RecurringRideStyles.timeButtonTextDisabled]}>
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
        style={RecurringRideStyles.datePickerButton}
        onPress={() => setShowEndDatePicker(true)}
      >
        <Text style={RecurringRideStyles.datePickerButtonText}>
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
        style={[RecurringRideStyles.recurringSubmitButton, isSubmitting && RecurringRideStyles.recurringSubmitButtonDisabled]}
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
        <Text style={RecurringRideStyles.recurringSubmitButtonText}>
          {isSubmitting ? 'Creating Request...' : 'Submit Recurring Ride'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// Any remaining page-specific styles that aren't in global styles
const styles = StyleSheet.create({
  // Add any unique styles for this page here if needed
});