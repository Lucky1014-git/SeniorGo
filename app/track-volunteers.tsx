import { MaterialIcons } from '@expo/vector-icons'; // Add this import
import AntDesign from '@expo/vector-icons/AntDesign';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { API_ENDPOINTS } from '../constants/api';
import { useUser } from '../contexts/usercontext';
import { Colors, HeaderStyles, SeniorDashboardStyles } from '../styles/globalStyles';

// The `export default function TrackHoursScreen() { ... }` syntax defines a React component function
// and makes it the default export of this file. This means when another file imports from this file
// (e.g., `import TrackHoursScreen from './track-hours'`), it will get this component by default.

export default function TrackHoursScreen() {
  const router = useRouter();
  const { getUserInfo } = useUser(); // get userInfo from context
  const [volunteers, setVolunteers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Get group code from user info
  const groupcode = getUserInfo()?.groupcode;
  const groupName = getUserInfo()?.groupname || 'No Group Assigned';

  // Fetch volunteer information
  const fetchVolunteerInfo = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.GET_VOLUNTEER_INFO, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ groupcode }),
      });
      const data = await response.json();
      console.log('Fetched volunteer info:', data);
      setVolunteers(data.volunteers || data || []);
    } catch (error) {
      console.error('Fetch volunteer info error:', error);
      Alert.alert('Error', 'Failed to load volunteer information.');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchVolunteerInfo();
  }, []);

  // Signout handler
  const handleSignOut = () => {
    router.replace('/');
  };

  // Render individual volunteer card
  const renderVolunteer = ({ item }: { item: any }) => (
  <View style={styles.volunteerCard}>
      {/* Personal Information Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Personal Information</Text>
      </View>
      <Text style={styles.volunteerName}>{item.fullname || 'N/A'}</Text>
      <Text style={styles.volunteerDetail}>Email: {item.emailaddress || 'N/A'}</Text>
      <Text style={styles.volunteerDetail}>Phone: {item.phone || 'N/A'}</Text>
      <Text style={styles.volunteerDetail}>Address: {item.address || 'N/A'}</Text>
      <Text style={styles.volunteerDetail}>Date of Birth: {item.dateofbirth || 'N/A'}</Text>
      
      {/* Group Information Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Group Information</Text>
      </View>
      <Text style={styles.volunteerDetail}>Group Code: {item.groupcode || 'N/A'}</Text>
      
      {/* Vehicle & License Information Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Vehicle & License</Text>
      </View>
      <Text style={styles.volunteerDetail}>Has Driver License: {item.hasdriverlicense === true || item.hasdriverlicense === 'true' ? 'Yes' : 'No'}</Text>
      <Text style={styles.volunteerDetail}>License Number: {item.licensenumber || 'N/A'}</Text>
      <Text style={styles.volunteerDetail}>Has Vehicle: {item.hasvehicle === true || item.hasvehicle === 'true' ? 'Yes' : 'No'}</Text>
      <Text style={styles.volunteerDetail}>Vehicle Type: {item.vehicletype || 'N/A'}</Text>
      <Text style={styles.volunteerDetail}>Proof of Insurance: {item.proofofinsurance === true || item.proofofinsurance === 'true' ? 'Yes' : 'No'}</Text>
      
      {/* Training & Experience Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Training & Experience</Text>
      </View>
      <Text style={styles.volunteerDetail}>First Aid Trained: {item.firstaidtrained === true || item.firstaidtrained === 'true' ? 'Yes' : 'No'}</Text>
      <Text style={styles.volunteerDetail}>Mobility Assistance: {item.mobilityassistance === true || item.mobilityassistance === 'true' ? 'Yes' : 'No'}</Text>
      <Text style={styles.volunteerDetail}>Volunteered Before: {item.volunteeredbefore === true || item.volunteeredbefore === 'true' ? 'Yes' : 'No'}</Text>
      <Text style={styles.volunteerDetail}>Background Check Consent: {item.backgroundcheckconsent === true || item.backgroundcheckconsent === 'true' ? 'Yes' : 'No'}</Text>
      
      {/* Status Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Status</Text>
      </View>
      <Text style={styles.volunteerDetail}>Status: {item.status || 'N/A'}</Text>
      
      {/* Profile Image */}
      {item.imageURL && (
        <View style={styles.imageSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Profile Photo</Text>
          </View>
          <Image 
            source={{ uri: item.imageURL }} 
            style={styles.profileImage}
            resizeMode="cover"
          />
        </View>
      )}

      {/* Edit Button */}
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => Alert.alert('Edit', `Edit volunteer: ${item.fullname || item.emailaddress || ''}`)}
      >
        <Text style={styles.editButtonText}>Edit</Text>
      </TouchableOpacity>
    </View>
  );

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
        <Text style={SeniorDashboardStyles.navBarText}>Track Volunteers</Text>
        <Text style={SeniorDashboardStyles.groupName}>({groupName})</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#2F5233" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={volunteers}
          keyExtractor={(item, index) => item.id || item.emailaddress || index.toString()}
          renderItem={renderVolunteer}
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
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
    padding: 6,
    backgroundColor: '#FFFDF6',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#2F5233',
    alignItems: 'center',
    justifyContent: 'center',
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
  header: {
    marginBottom: 20,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2F5233',
  },
  listContent: {
    paddingBottom: 20,
  },
  volunteerCard: {
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
  volunteerName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2F5233',
    marginBottom: 8,
    textAlign: 'center',
  },
  volunteerDetail: {
    fontSize: 15,
    color: '#2F5233',
    marginBottom: 6,
    lineHeight: 20,
  },
  imageSection: {
    marginTop: 10,
    alignItems: 'center',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#2F5233',
    marginTop: 8,
  },
});
