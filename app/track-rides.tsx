import { MaterialIcons } from '@expo/vector-icons'; // Add this import
import AntDesign from '@expo/vector-icons/AntDesign';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { API_ENDPOINTS } from '../constants/api';
import { useUser } from '../contexts/usercontext';
import { Colors, HeaderStyles, SeniorDashboardStyles } from '../styles/globalStyles';

export default function TrackRidesScreen() {
  const router = useRouter();
  const { getUserInfo } = useUser(); // get userInfo from context
  const [rides, setRides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Get group code from user info
  const groupcode = getUserInfo()?.groupcode;
  const groupName = getUserInfo()?.groupname || 'No Group Assigned';

  // Fetch rides information
  const fetchRidesInfo = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.GET_RIDES_INFO, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ groupcode }),
      });
      const data = await response.json();
      console.log('Fetched rides info:', data);
      setRides(data.rides || data || []);
    } catch (error) {
      console.error('Fetch rides info error:', error);
      Alert.alert('Error', 'Failed to load rides information.');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRidesInfo();
  }, []);

  // Signout handler
  const handleSignOut = () => {
    router.replace('/');
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

  // Render individual ride card
    const renderRide = ({ item }: { item: any }) => (
      <View style={styles.rideCard}>
            {/* Ride Status Section */}
            <View style={styles.statusHeader}>
                <Text style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                    {item.status || 'Unknown'}
                </Text>
            </View>

            {/* Ride Information Section */}
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Ride Details</Text>
            </View>
            <Text style={styles.rideDetail}>Requester: {item.userEmailAddress || 'N/A'}</Text>
            <Text style={styles.rideDetail}>Rider Name: {item.riderName || 'N/A'}</Text>
            <Text style={styles.rideDetail}>Current Location: {item.currentlocation || 'N/A'}</Text>
            <Text style={styles.rideDetail}>Dropoff Location: {item.dropofflocation || 'N/A'}</Text>
            <Text style={styles.rideDetail}>Pickup Date/Time: {formatLocalDateTime(item.pickupDateTime)}</Text>

            {/* Assignment Information Section */}
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Assignment Details</Text>
            </View>
            <Text style={styles.rideDetail}>Accepted By: {item.acceptedby || 'Not Assigned'}</Text>
            <Text style={styles.rideDetail}>Accepted By Name: {item.acceptedbyName || 'N/A'}</Text>
            <Text style={styles.rideDetail}>Group Code: {item.groupcode || 'N/A'}</Text>
            <Text style={styles.rideDetail}>Group Name: {groupName}</Text>

            {/* Edit Button */}
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => Alert.alert('Edit', `Edit ride for: ${item.userEmailAddress || item.id || ''}`)}
            >
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
        </View>
    );

  // Helper function to get status color
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return '#FFA500'; // Orange
      case 'accepted':
        return '#4CAF50'; // Green
      case 'completed':
        return '#2196F3'; // Blue
      case 'cancelled':
        return '#F44336'; // Red
      default:
        return '#9E9E9E'; // Gray
    }
  };

  return (
    <View style={styles.container}>
      {/* Header Row with Back and Logout buttons */}
      <View style={HeaderStyles.headerRow} >
        {/* Back Button on the left */}
        <TouchableOpacity
          style={HeaderStyles.headerButton}
          onPress={() => router.replace('/admin-dashboard')}
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

      {/* Title Section */}
      <View style={SeniorDashboardStyles.navBar}>
        <Text style={SeniorDashboardStyles.navBarText}>Track Rides</Text>
        <Text style={SeniorDashboardStyles.groupName}>({groupName})</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#2F5233" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={rides}
          keyExtractor={(item, index) => item.id || item.userEmailAddress + index.toString()}
          renderItem={renderRide}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  editButton: {
    marginTop: 14,
    backgroundColor: Colors.primary,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  container: {
    flex: 1,
    backgroundColor: '#DFF5E3',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  listContent: {
    paddingBottom: 20,
  },
  rideCard: {
    backgroundColor: '#FFFDF6',
    borderRadius: 14,
    padding: 18,
    marginBottom: 15,
    // Stronger shadow for both iOS and Android
    elevation: 8, // Android
    shadowColor: '#2F5233',
    shadowOpacity: 0.28, // iOS
    shadowRadius: 20,    // iOS
    shadowOffset: { width: 0, height: 10 }, // iOS
    borderWidth: 2,
    borderColor: '#2F5233',
  },
  statusHeader: {
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionHeader: {
    marginTop: 15,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    paddingBottom: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2F5233',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  rideDetail: {
    fontSize: 15,
    color: '#2F5233',
    marginBottom: 6,
    lineHeight: 20,
  },
});