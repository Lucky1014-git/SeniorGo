import { MaterialIcons } from '@expo/vector-icons'; // Add this import
import { useRouter } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useUser } from '../contexts/usercontext'; // import useUser
import { Colors, HeaderStyles, VolunteerDashboardStyles } from '../styles/globalStyles';

export default function VolunteerDashboard() {
  const router = useRouter();
  const { getUserInfo } = useUser(); // Use getUserInfo instead of userInfo
  const userInfo = getUserInfo ? getUserInfo() : {};
  const userName = userInfo?.fullname || 'Volunteer';
  const groupName = userInfo?.groupname || 'No Group Assigned';


  // Signout handler
  const handleSignOut = () => {
    router.replace('/');
  };

  return (
    <View style={VolunteerDashboardStyles.container}>
      {/* Signout Icon Button */}

      <View style={HeaderStyles.headerRow}>
        {/* Back/Home Button on the left */}
        <View style={{ width: 25 }} /> 

        {/* Logout Button on the right */}
        <TouchableOpacity
          style={HeaderStyles.headerButton}
          onPress={handleSignOut}
        >
          <MaterialIcons name="logout" size={25} color={Colors.primary} />
        </TouchableOpacity>
      </View>


      <View style={VolunteerDashboardStyles.navBar}>
        <Text style={VolunteerDashboardStyles.navBarText}>Welcome, {userName}!</Text>
        <View style={VolunteerDashboardStyles.groupContainer}>
          <Text style={VolunteerDashboardStyles.groupLabel}>Group:</Text>
          <Text style={VolunteerDashboardStyles.groupName}>{groupName}</Text>
        </View>
      </View>
     
      {/* Cards Grid */}
      <View style={VolunteerDashboardStyles.cardsGrid}>
        {/* Seniors Who Requested Rides */}
        <TouchableOpacity
          style={VolunteerDashboardStyles.card}
          onPress={() => router.push('/ride-requests')}
        >
          <Text style={VolunteerDashboardStyles.cardIcon}>🧓</Text>
          <Text style={VolunteerDashboardStyles.cardTitle}>Ride Requests</Text>
          <Text style={VolunteerDashboardStyles.cardDesc}>View and accept ride requests from seniors</Text>
        </TouchableOpacity>

        {/* Track Volunteers */}
        <TouchableOpacity
          style={VolunteerDashboardStyles.card}
          onPress={() => router.push('/track-volunteers')}
        >
          <Text style={VolunteerDashboardStyles.cardIcon}>⏱️</Text>
          <Text style={VolunteerDashboardStyles.cardTitle}>Track Hours</Text>
          <Text style={VolunteerDashboardStyles.cardDesc}>Log and view your volunteer hours</Text>
        </TouchableOpacity>

        {/* Approved Rides */}
        <TouchableOpacity
          style={VolunteerDashboardStyles.card}
          onPress={() => router.push('/approved-rides')}
        >
          <Text style={VolunteerDashboardStyles.cardIcon}>✅</Text>
          <Text style={VolunteerDashboardStyles.cardTitle}>Approved Rides</Text>
          <Text style={VolunteerDashboardStyles.cardDesc}>See rides you've approved</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}


