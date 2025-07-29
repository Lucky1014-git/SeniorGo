import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { API_ENDPOINTS } from '../constants/api';
import { useUser } from '../contexts/usercontext';

export default function ApprovedRides() {
  const router = useRouter();
  const { getUserInfo } = useUser();
  const emailaddress = getUserInfo()?.emailaddress;
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
        setApprovedRides(data.acceptedRequests || []);
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
      const response = await fetch(API_ENDPOINTS.UPDATE_STATUS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: rideId }),
      });
      const data = await response.json();
      if (response.ok && response.status === 200) {
        // If API returns rideEnded, update status accordingly
        const newStatus = (data.status && data.status.toLowerCase() === 'rideended') ? 'rideEnded' : 'volunteerStarted';
        setRideStatus(prev => ({ ...prev, [rideId]: newStatus }));
        Alert.alert('Success', newStatus === 'rideEnded' ? 'Ride ended status updated.' : 'Volunteer started status updated.');
      } else {
        Alert.alert('Error', data.message || 'Failed to update status.');
      }
    } catch (error) {
      Alert.alert('Error', 'Could not connect to server.');
    }
  };

  const handleRideStarted = async (rideId: string) => {
    try {
      const response = await fetch(API_ENDPOINTS.UPDATE_STATUS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: rideId }),
      });
      const data = await response.json();
      if (response.ok && response.status === 200) {
        const newStatus = (data.status && data.status.toLowerCase() === 'rideended') ? 'rideEnded' : 'rideEnded';
        setRideStatus(prev => ({ ...prev, [rideId]: newStatus }));
        Alert.alert('Success', 'Ride ended status updated.');
      } else {
        Alert.alert('Error', data.message || 'Failed to update status.');
      }
    } catch (error) {
      Alert.alert('Error', 'Could not connect to server.');
    }
  };

  const handleRideEnded = async (rideId: string) => {
    try {
      const response = await fetch(API_ENDPOINTS.UPDATE_STATUS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: rideId }),
      });
      const data = await response.json();
      if (response.ok && response.status === 200) {
        const newStatus = (data.status && data.status.toLowerCase() === 'rideended') ? 'rideEnded' : 'rideEnded';
        setRideStatus(prev => ({ ...prev, [rideId]: newStatus }));
        Alert.alert('Success', 'Ride ended status updated.');
      } else {
        Alert.alert('Error', data.message || 'Failed to update status.');
      }
    } catch (error) {
      Alert.alert('Error', 'Could not connect to server.');
    }
  };

  const renderRide = ({ item }: { item: any }) => {
    const status = rideStatus[item.id] || 'accepted';
    let buttonText = '';
    let buttonHandler = undefined;
    if (status === 'accepted') {
      buttonText = 'Volunteer Started';
      buttonHandler = () => handleVolunteerStarted(item.id);
    } else if (status === 'volunteerStarted') {
      buttonText = 'Ride Started';
      buttonHandler = () => handleRideStarted(item.id);
    } else if (status === 'rideStarted' || status === 'rideEnded') {
      buttonText = 'Ride Ended';
      buttonHandler = undefined;
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
          disabled={status === 'rideStarted' || status === 'rideEnded'}
        >
          <Text style={styles.volunteerButtonText}>{buttonText}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backArrow} onPress={goBack}>
        <Text style={{ fontSize: 28, color: '#2F5233' }}>{'\u2190'}</Text>
      </TouchableOpacity>
      <Text style={styles.header}>Accepted Rides</Text>
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
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No approved rides found.</Text>
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
