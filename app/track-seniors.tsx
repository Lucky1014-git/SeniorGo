import { MaterialIcons } from '@expo/vector-icons'; // Add this import
import AntDesign from '@expo/vector-icons/AntDesign';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { API_ENDPOINTS } from '../constants/api';
import { useUser } from '../contexts/usercontext';
import { Colors, HeaderStyles, SeniorDashboardStyles } from '../styles/globalStyles';

export default function TrackSeniorsScreen() {
  const router = useRouter();
  const { getUserInfo } = useUser(); // get userInfo from context
  const [seniors, setSeniors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Get group code from user info
  const groupcode = getUserInfo()?.groupcode;
  const groupName = getUserInfo()?.groupname || 'No Group Assigned';

  // Fetch senior information
  const fetchSeniorInfo = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.GET_SENIOR_INFO, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ groupcode }),
      });
      const data = await response.json();
      console.log('Fetched senior info:', data);
      setSeniors(data.seniors || data || []);
    } catch (error) {
      console.error('Fetch senior info error:', error);
      Alert.alert('Error', 'Failed to load senior information.');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSeniorInfo();
  }, []);

  // Signout handler
  const handleSignOut = () => {
    router.replace('/');
  };

  // Render individual senior card
  const renderSenior = ({ item }: { item: any }) => (
  <View style={styles.seniorCard}>
      {/* Personal Information Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Personal Information</Text>
      </View>
      <Text style={styles.seniorName}>{item.fullname || 'N/A'}</Text>
      <Text style={styles.seniorDetail}>Email: {item.emailaddress || 'N/A'}</Text>
      <Text style={styles.seniorDetail}>Phone: {item.phone || 'N/A'}</Text>
      <Text style={styles.seniorDetail}>Address: {item.address || 'N/A'}</Text>
      <Text style={styles.seniorDetail}>Date of Birth: {item.dateofbirth || 'N/A'}</Text>
      
      {/* Group Information Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Group Information</Text>
      </View>
      <Text style={styles.seniorDetail}>Group Code: {item.groupcode || 'N/A'}</Text>
      
      {/* Medical Information Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Medical Information</Text>
      </View>
      <Text style={styles.seniorDetail}>Emergency Contact: {item.emergencycontact || 'N/A'}</Text>
      <Text style={styles.seniorDetail}>Medical Conditions: {item.medicalconditions || 'N/A'}</Text>
      <Text style={styles.seniorDetail}>Mobility Needs: {item.mobilityneeds || 'N/A'}</Text>
      
      {/* Additional Information Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Additional Information</Text>
      </View>
      <Text style={styles.seniorDetail}>Preferred Language: {item.preferredlanguage || 'N/A'}</Text>
      <Text style={styles.seniorDetail}>Special Instructions: {item.specialinstructions || 'N/A'}</Text>

      {/* Status Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Status</Text>
      </View>
      <Text style={styles.seniorDetail}>Status: {item.status || 'N/A'}</Text>
      
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
        onPress={() => Alert.alert('Edit', `Edit senior: ${item.fullname || item.emailaddress || ''}`)}
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
        <Text style={SeniorDashboardStyles.navBarText}>Track Seniors</Text>
        <Text style={SeniorDashboardStyles.groupName}>({groupName})</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#2F5233" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={seniors}
          keyExtractor={(item, index) => item.id || item.emailaddress || index.toString()}
          renderItem={renderSenior}
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
  seniorCard: {
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
  seniorName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2F5233',
    marginBottom: 8,
    textAlign: 'center',
  },
  seniorDetail: {
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