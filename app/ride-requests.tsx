import { MaterialIcons } from '@expo/vector-icons'; // Add this import
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { API_ENDPOINTS } from '../constants/api';
import { useUser } from '../contexts/usercontext'; // <-- add this import

export default function RideRequests() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { getUserInfo } = useUser(); // <-- access useUser
  // Collect emailaddress from userInfo (from usercontext)
  const emailaddress = getUserInfo()?.emailaddress; 
  console.log('Email address:', emailaddress); // Debugging line to check email address
  useEffect(() => {
    // Fetch active ride requests from backend API
    const fetchRequests = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.ACTIVE_REQUESTS, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ emailaddress }),
        });
        const data = await response.json();
        console.log('Fetched ride requests:', data);
        setRequests(data.activeRequests); // ✅ Fix: unwrap the list
      } catch (error) {
        console.error('Fetch error:', error);
        Alert.alert('Error', 'Failed to load ride requests.');
      }
      setLoading(false);
    };
    fetchRequests();
  }, [emailaddress]);

  const approveRide = async (emailaddress: string, id: string) => {
    try {
      console.log('Approving ride:', { emailaddress, id });
      const response = await fetch(API_ENDPOINTS.ACCEPT_REQUESTS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ emailaddress, id }), // only pass emailaddress and id
      });
      if (!response.ok) {
        throw new Error('Failed to accept ride');
      }
      Alert.alert('Ride Accepted');
      // Find the approved ride from requests
      const approvedRide = requests.find(r => r.id === id);
      // Navigate to approved-rides page and pass ride info
      router.push({
        pathname: '/approved-rides',
        params: { ride: JSON.stringify(approvedRide) }
      });
    } catch (error) {
      console.error('Accept ride error:', error);
      Alert.alert('Error', 'Failed to accept ride.');
    }
  };

  const contactSenior = (email: string) => {
    Alert.alert('Contact', `Contact senior at: ${email}`);
  };

  // Helper to format UTC date string to local MM/DD/YYYY HH:MM AM/PM
  function formatLocalDateTime(utcString: string) {
    if (!utcString) return '';
    const date = new Date(utcString);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    };
    // Format: MM/DD/YYYY HH:MM AM/PM
    const formatted = date.toLocaleString(undefined, options);
    // Ensure MM/DD/YYYY format (some locales may swap month/day)
    const [month, day, year] = [
      date.getMonth() + 1,
      date.getDate(),
      date.getFullYear()
    ];
    const time = date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit', hour12: true });
    return `${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}/${year} ${time}`;
  }

  const renderRequest = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <Text style={styles.label}>Email:</Text>
      <Text style={styles.value}>{item.userEmailAddress}</Text>
      <Text style={styles.label}>Current Location:</Text>
      <Text style={styles.value}>{item.currentlocation}</Text>
      <Text style={styles.label}>Dropoff Location:</Text>
      <Text style={styles.value}>{item.dropofflocation}</Text>
      <Text style={styles.label}>Pickup Date/Time:</Text>
      <Text style={styles.value}>
        {formatLocalDateTime(item.pickupDateTime)}
      </Text>
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.approveButton} onPress={() => approveRide(emailaddress, item.id)}>
          <Text style={styles.buttonText}>Accept Ride</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.contactButton} onPress={() => contactSenior(item.email)}>
          <Text style={styles.buttonText}>Contact</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Add a handler for going back
  const goBack = () => {
    router.replace('/volunteer-dashboard');
  };

  // Signout handler
  const handleSignOut = () => {
    router.replace('/');
  };

  return (
    <View style={styles.container}>
      {/* Signout Icon Button */}
      <TouchableOpacity style={styles.signoutButton} onPress={handleSignOut}>
        <MaterialIcons name="logout" size={22} color="#2F5233" />
      </TouchableOpacity>
      {/* Back Arrow Button */}
      <TouchableOpacity style={styles.backArrow} onPress={goBack}>
        <Text style={{ fontSize: 28, color: '#2F5233' }}>{'\u2190'}</Text>
      </TouchableOpacity>
      <Text style={styles.header}>Ride Requests</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#2F5233" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={requests}
          keyExtractor={item => item.id}
          renderItem={renderRequest}
          contentContainerStyle={styles.listContent}
        />
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
  listContent: {
    paddingBottom: 24,
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
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
  },
  approveButton: {
    backgroundColor: '#2F5233',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
  },
  contactButton: {
    backgroundColor: '#4F8A8B',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
  },
  buttonText: {
    color: '#FFFDF6',
    fontWeight: '600',
    fontSize: 15,
  },
  signoutButton: {
    position: 'absolute',
    top: 44,
    right: 16,
    zIndex: 20,
    padding: 6,
    backgroundColor: '#FFFDF6',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#2F5233',
    alignItems: 'center',
    justifyContent: 'center',
  },
  signoutIcon: {
    fontSize: 22,
    color: '#2F5233',
  },
});

