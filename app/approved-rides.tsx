import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { API_ENDPOINTS } from '../constants/api';
import { useUser } from '../contexts/usercontext';
import { ButtonStyles, ContainerStyles, TextStyles } from '../styles/globalStyles';

export default function ApprovedRides() {
  console.log('ApprovedRides component rendering...');
  const router = useRouter();
  const { getUserInfo } = useUser();
  const emailaddress = getUserInfo()?.emailaddress;
  console.log('Email address:', emailaddress);
  const [approvedRides, setApprovedRides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [rideStatus, setRideStatus] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchApprovedRides = async () => {
      try {
        console.log('Fetching approved rides for:', emailaddress);
        const response = await fetch(API_ENDPOINTS.ACCEPTED_REQUESTS, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ emailaddress }),
        });
        const data = await response.json();
        console.log('API Response:', data);
        setApprovedRides(data.acceptedRequests || []);
        console.log('Setting approved rides:', data.acceptedRequests);
        
        // Initialize ride status based on the current status from API
        if (data.acceptedRequests && Array.isArray(data.acceptedRequests)) {
          const initialStatuses: { [key: string]: string } = {};
          data.acceptedRequests.forEach((ride: any) => {
            console.log('Processing ride:', ride.id, 'with status:', ride.status);
            if (ride.status) {
              // Normalize status to lowercase
              initialStatuses[ride.id] = ride.status.toLowerCase();
            }
          });
          console.log('Initial statuses:', initialStatuses);
          setRideStatus(initialStatuses);
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to load approved rides.');
      }
      setLoading(false);
    };
    fetchApprovedRides();
  }, [emailaddress]);

  const goBack = () => { 
    router.replace('/volunteer-dashboard');
  };

  const formatLocalDateTime = (utcString: string) => {
    if (!utcString) return '';
    const date = new Date(utcString);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    return `${month}/${day}/${year} ${hours}:${minutes} ${ampm}`;
  };

  const handleVolunteerStarted = async (rideId: string) => {
    try {
      console.log('Updating ride status for volunteer:', { rideId });
      console.log('Current status before update:', rideStatus[rideId]);
      const currentStatus = rideStatus[rideId] || 'accepted';
      const response = await fetch(API_ENDPOINTS.UPDATE_STATUS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          rideId: rideId,
          currentStatus: currentStatus
        }),
      });
      const data = await response.json();
      if (response.ok && response.status === 200) {
        // Use the new_status returned by the API, normalized to lowercase
        const newStatus = data.new_status ? data.new_status.toLowerCase() : 'volunteerstarted';
        setRideStatus(prev => ({ ...prev, [rideId]: newStatus }));
        Alert.alert('Success', 'Status updated successfully.');
      } else {
        Alert.alert('Error', data.message || 'Failed to update status.');
      }
    } catch (error) {
      Alert.alert('Error', 'Could not connect to server.');
    }
  };

  const handleRideStarted = async (rideId: string) => {
    try {
      const currentStatus = rideStatus[rideId] || 'volunteerstarted';
      console.log('Updating ride status:', { rideId, currentStatus });
      const response = await fetch(API_ENDPOINTS.UPDATE_STATUS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          rideId: rideId,
          currentStatus: currentStatus
        }),
      });
      const data = await response.json();
      if (response.ok && response.status === 200) {
        // Use the new_status returned by the API, normalized to lowercase
        const newStatus = data.new_status ? data.new_status.toLowerCase() : 'ridestarted';
        setRideStatus(prev => ({ ...prev, [rideId]: newStatus }));
        Alert.alert('Success', 'Status updated successfully.');
      } else {
        Alert.alert('Error', data.message || 'Failed to update status.');
      }
    } catch (error) {
      Alert.alert('Error', 'Could not connect to server.');
    }
  };

  const handleRideEnded = async (rideId: string) => {
    try {
      const currentStatus = rideStatus[rideId] || 'ridestarted';
      const response = await fetch(API_ENDPOINTS.UPDATE_STATUS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          rideId: rideId,
          currentStatus: currentStatus
        }),
      });
      const data = await response.json();
      if (response.ok && response.status === 200) {
        // Use the new_status returned by the API, normalized to lowercase
        const newStatus = data.new_status ? data.new_status.toLowerCase() : 'rideended';
        setRideStatus(prev => ({ ...prev, [rideId]: newStatus }));
        Alert.alert('Success', 'Status updated successfully.');
      } else {
        Alert.alert('Error', data.message || 'Failed to update status.');
      }
    } catch (error) {
      Alert.alert('Error', 'Could not connect to server.');
    }
  };

  const renderRide = ({ item }: { item: any }) => {
    // Use the status from state if available, otherwise fall back to item status, then default to 'approved'
    const rawStatus = rideStatus[item.id] || item.status || 'approved';
    const status = typeof rawStatus === 'string' ? rawStatus.toLowerCase() : 'approved'; // Ensure it's a string before toLowerCase
    console.log('Ride ID:', item.id, 'Raw Status:', rawStatus, 'Normalized Status:', status, 'Type:', typeof status);
    
    let buttonText = '';
    let buttonHandler = undefined;
    
    if (status === 'accepted') {
      buttonText = 'Volunteer Started';
      buttonHandler = () => handleVolunteerStarted(item.id);
    } else if (status === 'volunteerstarted') {
      buttonText = 'Ride Started';
      buttonHandler = () => handleRideStarted(item.id);
    } else if (status === 'ridestarted') {
      buttonText = 'Ride Ended';
      buttonHandler = () => handleRideEnded(item.id);
    } else if (status === 'rideended') {
      buttonText = 'Remove Ride';
      buttonHandler = () => {
        // Remove the ride when clicked again
        setApprovedRides(prev => prev.filter(ride => ride.id !== item.id));
        Alert.alert('Success', 'Ride removed from list.');
      };
    } else {
      // Default case for any unexpected status
      buttonText = 'Volunteer Started';
      buttonHandler = () => handleVolunteerStarted(item.id);
      console.warn('Unexpected status:', status, 'for ride:', item.id);
    }
    return (
      <View style={styles.card}>
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{item.userEmailAddress}</Text>
        <Text style={styles.label}>Current Location:</Text>
        <Text style={styles.value}>{item.currentlocation}</Text>
        <Text style={styles.label}>Dropoff Location:</Text>
        <Text style={styles.value}>{item.dropofflocation}</Text>
        <Text style={styles.label}>Pickup Date/Time:</Text>
        <Text style={styles.value}>{formatLocalDateTime(item.pickupDateTime)}</Text>
        <TouchableOpacity
          style={styles.volunteerButton}
          onPress={buttonHandler}
          disabled={false}
        >
          <Text style={styles.volunteerButtonText}>{buttonText}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={ContainerStyles.screenContainer}>
      <TouchableOpacity style={ButtonStyles.backArrow} onPress={goBack}>
        <Text style={{ fontSize: 28, color: '#2F5233' }}>{'\u2190'}</Text>
      </TouchableOpacity>
      <Text style={TextStyles.header}>Accepted Rides</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#2F5233" style={{ marginTop: 40 }} />
      ) : approvedRides.length > 0 ? (
        <FlatList
          data={approvedRides}
          keyExtractor={item => item.id}
          renderItem={renderRide}
          contentContainerStyle={{ paddingBottom: 24, paddingTop: 16 }}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={ContainerStyles.emptyState}>
          <Text style={TextStyles.emptyText}>No approved rides found.</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4FFF7',
    paddingTop: 40,
    paddingHorizontal: 16,
  },
  backArrow: {
    position: 'absolute',
    top: 44,
    left: 16,
    zIndex: 10,
    padding: 4,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2F5233',
    marginBottom: 16,
    alignSelf: 'center',
  },
  card: {
    backgroundColor: '#FFFDF6',
    borderRadius: 14,
    padding: 18,
    marginBottom: 18,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 4,
  },
  label: {
    fontWeight: '600',
    marginTop: 8,
    color: '#2F5233',
  },
  value: {
    fontSize: 15,
    color: '#2F5233',
    marginBottom: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 60,
  },
  emptyText: {
    fontSize: 17,
    color: '#888',
    fontStyle: 'italic',
  },
  volunteerButton: {
    marginTop: 10,
    backgroundColor: '#2F5233',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 18,
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  volunteerButtonText: {
    color: '#FFFDF6',
    fontSize: 15,
    fontWeight: 'bold',
  },
});
