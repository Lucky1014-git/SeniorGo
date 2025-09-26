import { MaterialIcons } from '@expo/vector-icons'; // Add this import
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useUser } from '../contexts/usercontext'; // import useUser

export default function SeniorDashboard() {
  const router = useRouter();
  const { getUserInfo } = useUser(); // get userInfo from context

  // Fallbacks for missing data
  const name = getUserInfo()?.fullname || 'Senior';
  const groupName = getUserInfo()?.groupname || 'No Group Assigned';
  const ridesThisWeek = 0;//userInfo()?.ridesThisWeek || 0;
  const hasActiveRide = true;//!!userInfo()?.hasActiveRide;
  const currentRideLocation = '';//userInfo()?.currentRideLocation || '';

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
      
      {/* Welcome Section */}
      <View style={styles.navBar}>
        <Text style={styles.navBarText}>Welcome, {name}!</Text>
        <View style={styles.groupContainer}>
          <Text style={styles.groupLabel}>Group:</Text>
          <Text style={styles.groupName}>{groupName}</Text>
        </View>
      </View>

      {/* Cards Grid */}
      <View style={styles.cardsGrid}>
          {/* Request a Ride */}
          <TouchableOpacity
            style={styles.cardLarge}
            onPress={() => router.push('/request_a_ride')}
          > 
            <View style={styles.iconContainer}>
              <Text style={styles.cardIcon}>🚗</Text>
            </View>
            <Text style={styles.cardTitle}>Request a Ride</Text>
          </TouchableOpacity>

          {/* Track Current Ride */}
          <TouchableOpacity
            style={styles.cardLarge}
            onPress={() => router.push('/current-rides')}
          >
            <View style={styles.iconContainer}>
              <Text style={styles.cardIcon}>�</Text>
            </View>
            <Text style={styles.cardTitle}>Track Current Ride</Text>
          </TouchableOpacity>

          {/* Request Recurring Ride */}
          <TouchableOpacity
            style={styles.cardLarge}
            onPress={() => router.push('/recurring-ride')}
          >
            <View style={styles.iconContainer}>
              <Text style={styles.cardIcon}>�</Text>
            </View>
            <Text style={styles.cardTitle}>Request Recurring Ride</Text>
          </TouchableOpacity>

          {/* Past Rides */}
          <View style={styles.cardLarge}>
            <View style={styles.iconContainer}>
              <Text style={styles.cardIcon}>�</Text>
            </View>
            <Text style={styles.cardTitle}>Past Rides</Text>
          </View>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DFF5E3',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  navBar: {
    marginBottom: 30,
    alignItems: 'center',
  },
  navBarText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2F5233',
  },
  groupContainer: {
    marginTop: 8,
    alignItems: 'center',
  },
  groupLabel: {
    fontSize: 14,
    color: '#2F5233',
    fontWeight: '500',
  },
  groupName: {
    fontSize: 18,
    color: '#1B7F5B',
    fontWeight: '600',
    marginTop: 2,
  },
  cardsGrid: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  cardLarge: {
    width: '100%',
    backgroundColor: '#FFFDF6',
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 4,
  },
  iconContainer: {
    backgroundColor: '#2F5233',
    borderRadius: 50,
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  cardIcon: {
    fontSize: 30,
    marginBottom: 0,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2F5233',
    marginBottom: 6,
  },
  cardDesc: {
    fontSize: 16,
    color: '#2F5233',
  },
  cardLink: {
    fontSize: 13,
    color: '#1B7F5B',
    textDecorationLine: 'underline',
    marginTop: 2,
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

