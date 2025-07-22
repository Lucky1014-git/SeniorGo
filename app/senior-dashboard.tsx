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
    {/* Top Navigation Bar */}
    <View style={styles.navBar}>
      <Text style={styles.navBarText}>Welcome, {name}!</Text>
    </View>

    {/* Cards Grid */}
    <View style={styles.cardsGrid}>
      {/* Request a Ride */}
      <TouchableOpacity
        style={styles.cardLarge}
        onPress={() => router.push('/request_a_ride')}
      > 

        <Text style={styles.cardIcon}>🚗</Text>
        <Text style={styles.cardTitle}>Request a Ride</Text>
        <Text style={styles.cardDesc}>Tap to request a ride</Text>
      </TouchableOpacity>

      {/* Past Rides */}
      <View style={styles.cardSmall}>
        <Text style={styles.cardIconSmall}>📜</Text>
        <Text style={styles.cardTitleSmall}>Past Rides</Text>
        <Text style={styles.cardSummary}>{ridesThisWeek} rides this week</Text>
        <Text style={styles.cardLink}>View full history</Text>
      </View>

      {/* Track Current Ride */}
      <TouchableOpacity
        style={styles.cardSmall}
        onPress={() => router.push('/current-rides')}
      >
        <Text style={styles.cardIconSmall}>📍</Text>
        <Text style={styles.cardTitleSmall}>Track Current Ride</Text>
        {hasActiveRide ? (
          <Text style={styles.cardSummary}>Live location: {currentRideLocation}</Text>
        ) : (
          <Text style={styles.cardSummary}>No current ride</Text>
        )}
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
  },
  cardLarge: {
    width: '100%',
    backgroundColor: '#FFFDF6',
    borderRadius: 16,
    padding: 28,
    marginBottom: 20,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 4,
  },
  cardIcon: {
    fontSize: 48,
    marginBottom: 10,
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
  cardSmall: {
    width: '48%',
    backgroundColor: '#FFFDF6',
    borderRadius: 16,
    padding: 18,
    marginBottom: 10,
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  cardIconSmall: {
    fontSize: 32,
    marginBottom: 6,
  },
  cardTitleSmall: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2F5233',
    marginBottom: 2,
  },
  cardSummary: {
    fontSize: 14,
    color: '#2F5233',
    marginBottom: 2,
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
  signoutIcon: {
    fontSize: 22,
    color: '#2F5233',
  },
});

