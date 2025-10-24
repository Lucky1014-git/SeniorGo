import { MaterialIcons } from '@expo/vector-icons'; // Add this import
import AntDesign from '@expo/vector-icons/AntDesign';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Text, TouchableOpacity, View } from 'react-native';
import { API_ENDPOINTS } from '../constants/api';
import { useUser } from '../contexts/usercontext'; // <-- add this import
import { Colors, HeaderStyles, RideRequestsStyles, SeniorDashboardStyles } from '../styles/globalStyles';

export default function RideRequests() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [acceptingRide, setAcceptingRide] = useState(false);
  const [loadingRides, setLoadingRides] = useState(false);
  const router = useRouter();
  const { getUserInfo } = useUser(); // <-- access useUser
  // Collect emailaddress from userInfo (from usercontext)
  const emailaddress = getUserInfo()?.emailaddress;
  const groupName = getUserInfo()?.groupname || 'No Group Assigned';


  console.log('Email address:', emailaddress); // Debugging line to check email address
  
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

  useEffect(() => {
    fetchRequests();
  }, [emailaddress]);

  const acceptRide = async (emailaddress: string, id: string) => {
    setAcceptingRide(true);
    try {
      console.log('Accepting ride:', { emailaddress, id });
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
      setAcceptingRide(false);
      Alert.alert('Ride Accepted', '', [
        {
          text: 'OK',
          onPress: async () => {
            setLoadingRides(true);
            // Refresh the requests list to show updated data
            await fetchRequests();
            setLoadingRides(false);
          }
        }
      ]);
    } catch (error) {
      console.error('Accept ride error:', error);
      setAcceptingRide(false);
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
    <View style={RideRequestsStyles.card}>
      <Text style={RideRequestsStyles.label}>Name:</Text>
      <Text style={RideRequestsStyles.value}>{item.fullname || 'N/A'}</Text>
      <Text style={RideRequestsStyles.label}>Email:</Text>
      <Text style={RideRequestsStyles.value}>{item.userEmailAddress}</Text>
      <Text style={RideRequestsStyles.label}>Current Location:</Text>
      <Text style={RideRequestsStyles.value}>{item.currentlocation}</Text>
      <Text style={RideRequestsStyles.label}>Dropoff Location:</Text>
      <Text style={RideRequestsStyles.value}>{item.dropofflocation}</Text>
      <Text style={RideRequestsStyles.label}>Pickup Date/Time:</Text>
      <Text style={RideRequestsStyles.value}>
        {formatLocalDateTime(item.pickupDateTime)}
      </Text>
      <View style={RideRequestsStyles.buttonRow}>
        <TouchableOpacity style={RideRequestsStyles.approveButton} onPress={() => acceptRide(emailaddress, item.id)}>
          <Text style={RideRequestsStyles.buttonText}>Accept Ride</Text>
        </TouchableOpacity>
        <TouchableOpacity style={RideRequestsStyles.contactButton} onPress={() => contactSenior(item.email)}>
          <Text style={RideRequestsStyles.buttonText}>Contact Rider</Text>
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
    <View style={RideRequestsStyles.container}>


      {/* Signout Icon Button */}
      <View style={HeaderStyles.headerRow} >
        {/* Back Button on the left */}
        <TouchableOpacity
          style={HeaderStyles.headerButton}
          onPress={() => router.replace('/volunteer-dashboard')}
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

      <View style={SeniorDashboardStyles.navBar}>
        <Text style={SeniorDashboardStyles.navBarText}>Ride Requests</Text>
        <Text style={SeniorDashboardStyles.groupName}>({groupName})</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#2F5233" style={{ marginTop: 40 }} />
      ) : (
        <>
          <FlatList
            data={requests}
            keyExtractor={item => item.id}
            renderItem={renderRequest}
            contentContainerStyle={RideRequestsStyles.listContent}
          />
          {(acceptingRide || loadingRides) && (
            <View style={{ position: 'absolute', top: '50%', left: '50%', transform: [{ translateX: -25 }, { translateY: -25 }], backgroundColor: 'rgba(0,0,0,0.7)', padding: 20, borderRadius: 10 }}>
              <ActivityIndicator size="large" color="#FFFDF6" />
              <Text style={{ color: '#FFFDF6', marginTop: 10, textAlign: 'center' }}>
                {acceptingRide ? 'Accepting Ride...' : 'Loading Rides...'}
              </Text>
            </View>
          )}
        </>
      )}
    </View>
  );
}
