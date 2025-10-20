import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Octicons from '@expo/vector-icons/Octicons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useUser } from '../contexts/usercontext'; // import useUser
import { Colors, ContainerStyles, HeaderStyles, SeniorDashboardStyles, TextStyles } from '../styles/globalStyles';

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
            style={ContainerStyles.cardLarge}
            onPress={() => router.push('/request_a_ride')}
          > 
            <View style={SeniorDashboardStyles.iconContainer}>
              <AntDesign name="car" size={40} color={Colors.primary} />
            </View>
            <Text style={TextStyles.headerLarge}>Request a Ride</Text>
          </TouchableOpacity>

          {/* Track Current Ride */}
          <TouchableOpacity
            style={ContainerStyles.cardLarge}
            onPress={() => router.push('/current-rides')}
          >
            <View style={SeniorDashboardStyles.iconContainer}>
              <MaterialCommunityIcons name="go-kart-track" size={40} color={Colors.primary} />
            </View>
            <Text style={TextStyles.headerLarge}>Track Current Ride</Text>
          </TouchableOpacity>

          {/* Request Recurring Ride */}
          <TouchableOpacity
            style={ContainerStyles.cardLarge}
            onPress={() => router.push('/recurring-ride')}
          >
            <View style={SeniorDashboardStyles.iconContainer}>
              <AntDesign name="car" size={40} color={Colors.primary} />
            </View>
            <Text style={TextStyles.headerLarge}>Request Recurring Ride</Text>
          </TouchableOpacity>

          {/* Past Rides */}
          <View style={ContainerStyles.cardLarge}>
            <View style={SeniorDashboardStyles.iconContainer}>
              <Octicons name="paste" size={40} color={Colors.primary} />
            </View>
            <Text style={TextStyles.headerLarge}>Past Rides</Text>
          </View>
        </View>
    </View>
  );
}

// Any remaining page-specific styles that aren't in global styles
const styles = StyleSheet.create({
  // Add any unique styles for this page here if needed
});

