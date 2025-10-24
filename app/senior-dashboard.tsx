import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Octicons from '@expo/vector-icons/Octicons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useUser } from '../contexts/usercontext'; // import useUser
import { Colors, ContainerStyles, HeaderStyles, SeniorDashboardStyles } from '../styles/globalStyles';

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
    <View style={ContainerStyles.screenContainer}>
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
      

      
      {/* Welcome Section */}
      <View style={SeniorDashboardStyles.navBar}>
        <Text style={SeniorDashboardStyles.navBarText}>Welcome, {name}!</Text>
        <View style={SeniorDashboardStyles.groupContainer}>
          <Text style={SeniorDashboardStyles.groupLabel}>Group:</Text>
          <Text style={SeniorDashboardStyles.groupName}>{groupName}</Text>
        </View>
      </View>

    

      {/* Cards Grid */}
      <View style={SeniorDashboardStyles.cardsGrid}>
          {/* Request a Ride */}

          <TouchableOpacity
            style={SeniorDashboardStyles.card}
            onPress={() => router.push('/request_a_ride')}
          > 
          <Text style={SeniorDashboardStyles.cardIcon}><AntDesign name="car" size={40} color={Colors.primary} /></Text>
          <Text style={SeniorDashboardStyles.cardTitle}>Request a Ride</Text>
          <Text style={SeniorDashboardStyles.cardDesc}>Submit your ride request</Text>
          </TouchableOpacity>

          {/* Track Current Ride */}
          <TouchableOpacity
            style={SeniorDashboardStyles.card}
            onPress={() => router.push('/current-rides')}
          >

          <Text style={SeniorDashboardStyles.cardIcon}><MaterialCommunityIcons name="go-kart-track" size={40} color={Colors.primary} /></Text>
          <Text style={SeniorDashboardStyles.cardTitle}>Track Current Ride</Text>
          <Text style={SeniorDashboardStyles.cardDesc}>View your current ride status</Text>
          </TouchableOpacity>

          {/* Request Recurring Ride */}
          <TouchableOpacity
            style={SeniorDashboardStyles.card}
            onPress={() => router.push('/recurring-ride')}
          >
            <Text style={SeniorDashboardStyles.cardIcon}><AntDesign name="car" size={40} color={Colors.primary} /></Text>
            <Text style={SeniorDashboardStyles.cardTitle}>Request Recurring Ride</Text>
            <Text style={SeniorDashboardStyles.cardDesc}>Set up a recurring ride schedule</Text>
          </TouchableOpacity>

          {/* Past Rides */}
          <View style={SeniorDashboardStyles.card}>
            <Text style={SeniorDashboardStyles.cardIcon}><Octicons name="paste" size={40} color={Colors.primary} /></Text>
            <Text style={SeniorDashboardStyles.cardTitle}>Past Rides</Text>
            <Text style={SeniorDashboardStyles.cardDesc}>View your past ride history</Text>
          </View>
        </View>
    </View>
  );
}

// Any remaining page-specific styles that aren't in global styles
const styles = StyleSheet.create({
  // Add any unique styles for this page here if needed
});

