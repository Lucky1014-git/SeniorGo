import { MaterialIcons } from '@expo/vector-icons'; // Add this import
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useUser } from '../contexts/usercontext'; // import useUser

export default function VolunteerDashboard() {
  const router = useRouter();
  const { getUserInfo } = useUser(); // Use getUserInfo instead of userInfo
  const userInfo = getUserInfo ? getUserInfo() : {};
  const userName = userInfo?.fullname || 'Volunteer';

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
      {/* Top Navigation Bar */}
      <View style={styles.navBar}>
        <Text style={styles.navBarText}>Welcome, {userName}!</Text>
      </View>

      {/* Cards Grid */}
      <View style={styles.cardsGrid}>
        {/* Seniors Who Requested Rides */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push('/ride-requests')}
        >
          <Text style={styles.cardIcon}>🧓</Text>
          <Text style={styles.cardTitle}>Ride Requests</Text>
          <Text style={styles.cardDesc}>View and accept ride requests from seniors</Text>
        </TouchableOpacity>

        {/* Track Hours */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push('/track-hours')}
        >
          <Text style={styles.cardIcon}>⏱️</Text>
          <Text style={styles.cardTitle}>Track Hours</Text>
          <Text style={styles.cardDesc}>Log and view your volunteer hours</Text>
        </TouchableOpacity>

        {/* Approved Rides */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push('/approved-rides')}
        >
          <Text style={styles.cardIcon}>✅</Text>
          <Text style={styles.cardTitle}>Approved Rides</Text>
          <Text style={styles.cardDesc}>See rides you've approved</Text>
        </TouchableOpacity>
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
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2F5233',
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  card: {
    width: '48%',
    backgroundColor: '#FFFDF6',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 4,
    marginBottom: 12, // Add spacing for wrapping
  },
  cardIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2F5233',
    marginBottom: 6,
    textAlign: 'center',
  },
  cardDesc: {
    fontSize: 15,
    color: '#2F5233',
    textAlign: 'center',
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


