import { MaterialIcons } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { API_ENDPOINTS } from '../constants/api';
import { useUser } from '../contexts/usercontext';
import { Colors, HeaderStyles, SeniorDashboardStyles } from '../styles/globalStyles';

export default function EditSeniorAccountScreen() {
  const router = useRouter();
  const { getUserInfo } = useUser();
  const userInfo = getUserInfo();
  const emailaddress = userInfo?.emailaddress;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [riderInfo, setRiderInfo] = useState<any>({});

  // Editable fields state
  const [editableData, setEditableData] = useState({
    fullname: '',
    phone: '',
    address: '',
    dateofbirth: '',
    emergencycontact: '',
    medicalconditions: '',
    mobilityneeds: '',
    preferredlanguage: '',
    specialinstructions: '',
  });

  // Fetch rider information
  const fetchRiderInfo = async () => {
    if (!emailaddress) {
      Alert.alert('Error', 'User email not found.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(API_ENDPOINTS.GET_RIDER_INFO, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailaddress }),
      });
      const data = await response.json();
      console.log('Fetched rider info:', data);
      
      if (data.rider) {
        setRiderInfo(data.rider);
        setEditableData({
          fullname: data.rider.fullname || '',
          phone: data.rider.phone || '',
          address: data.rider.address || '',
          dateofbirth: data.rider.dateofbirth || '',
          emergencycontact: data.rider.emergencycontact || '',
          medicalconditions: data.rider.medicalconditions || '',
          mobilityneeds: data.rider.mobilityneeds || '',
          preferredlanguage: data.rider.preferredlanguage || '',
          specialinstructions: data.rider.specialinstructions || '',
        });
      } else {
        Alert.alert('Error', 'Rider information not found.');
      }
    } catch (error) {
      console.error('Fetch rider info error:', error);
      Alert.alert('Error', 'Failed to load rider information.');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRiderInfo();
  }, []);

  // Save changes
  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch(API_ENDPOINTS.UPDATE_RIDER_INFO, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emailaddress,
          ...editableData,
        }),
      });
      
      if (response.ok) {
        Alert.alert('Success', 'Your information has been updated successfully.', [
          { text: 'OK', onPress: () => router.back() }
        ]);
      } else {
        throw new Error('Failed to update information');
      }
    } catch (error) {
      console.error('Save error:', error);
      Alert.alert('Error', 'Failed to save changes. Please try again.');
    }
    setSaving(false);
  };

  // Cancel changes
  const handleCancel = () => {
    Alert.alert(
      'Cancel Changes',
      'Are you sure you want to cancel? All unsaved changes will be lost.',
      [
        { text: 'No', style: 'cancel' },
        { text: 'Yes', onPress: () => router.back() }
      ]
    );
  };

  // Handle input change
  const handleInputChange = (field: string, value: string) => {
    setEditableData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Signout handler
  const handleSignOut = () => {
    router.replace('/');
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={HeaderStyles.headerRow}>
          <TouchableOpacity
            style={HeaderStyles.headerButton}
            onPress={() => router.back()}
          >
            <AntDesign name="home" size={25} color={Colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={HeaderStyles.headerButton}
            onPress={handleSignOut}
          >
            <MaterialIcons name="logout" size={25} color={Colors.primary} />
          </TouchableOpacity>
        </View>
        <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 100 }} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={HeaderStyles.headerRow}>
        <TouchableOpacity
          style={HeaderStyles.headerButton}
          onPress={() => router.back()}
        >
          <AntDesign name="home" size={25} color={Colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity
          style={HeaderStyles.headerButton}
          onPress={handleSignOut}
        >
          <MaterialIcons name="logout" size={25} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Title */}
      <View style={SeniorDashboardStyles.navBar}>
        <Text style={SeniorDashboardStyles.navBarText}>Edit Account</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.formContainer}>
          
          {/* Personal Information Section */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Full Name</Text>
            <TextInput
              style={styles.textInput}
              value={editableData.fullname}
              onChangeText={(value) => handleInputChange('fullname', value)}
              placeholder="Enter your full name"
              placeholderTextColor={Colors.lightText}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Phone</Text>
            <TextInput
              style={styles.textInput}
              value={editableData.phone}
              onChangeText={(value) => handleInputChange('phone', value)}
              placeholder="Enter your phone number"
              placeholderTextColor={Colors.lightText}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Address</Text>
            <TextInput
              style={styles.textInput}
              value={editableData.address}
              onChangeText={(value) => handleInputChange('address', value)}
              placeholder="Enter your address"
              placeholderTextColor={Colors.lightText}
              multiline
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Date of Birth</Text>
            <TextInput
              style={styles.textInput}
              value={editableData.dateofbirth}
              onChangeText={(value) => handleInputChange('dateofbirth', value)}
              placeholder="MM/DD/YYYY"
              placeholderTextColor={Colors.lightText}
            />
          </View>

          {/* Emergency Information Section */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Emergency Information</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Emergency Contact</Text>
            <TextInput
              style={styles.textInput}
              value={editableData.emergencycontact}
              onChangeText={(value) => handleInputChange('emergencycontact', value)}
              placeholder="Emergency contact name and phone"
              placeholderTextColor={Colors.lightText}
              multiline
            />
          </View>

          {/* Medical Information Section */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Medical Information</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Medical Conditions</Text>
            <TextInput
              style={styles.textInput}
              value={editableData.medicalconditions}
              onChangeText={(value) => handleInputChange('medicalconditions', value)}
              placeholder="List any medical conditions"
              placeholderTextColor={Colors.lightText}
              multiline
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Mobility Needs</Text>
            <TextInput
              style={styles.textInput}
              value={editableData.mobilityneeds}
              onChangeText={(value) => handleInputChange('mobilityneeds', value)}
              placeholder="Describe mobility assistance needed"
              placeholderTextColor={Colors.lightText}
              multiline
            />
          </View>

          {/* Preferences Section */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Preferences</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Preferred Language</Text>
            <TextInput
              style={styles.textInput}
              value={editableData.preferredlanguage}
              onChangeText={(value) => handleInputChange('preferredlanguage', value)}
              placeholder="Enter preferred language"
              placeholderTextColor={Colors.lightText}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Special Instructions</Text>
            <TextInput
              style={styles.textInput}
              value={editableData.specialinstructions}
              onChangeText={(value) => handleInputChange('specialinstructions', value)}
              placeholder="Any special instructions for volunteers"
              placeholderTextColor={Colors.lightText}
              multiline
            />
          </View>

          {/* Read-only Information */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Account Information (Read-only)</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email Address</Text>
            <Text style={styles.readOnlyText}>{riderInfo.emailaddress || 'N/A'}</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Group Code</Text>
            <Text style={styles.readOnlyText}>{riderInfo.groupcode || 'N/A'}</Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleCancel}
              disabled={saving}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.saveButton]}
              onPress={handleSave}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator size="small" color="#FFFDF6" />
              ) : (
                <Text style={styles.saveButtonText}>Save Changes</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  formContainer: {
    paddingBottom: 30,
  },
  sectionHeader: {
    marginTop: 20,
    marginBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputGroup: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#FFFDF6',
    borderWidth: 2,
    borderColor: Colors.primary,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: Colors.primary,
    minHeight: 45,
  },
  readOnlyText: {
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#666',
    minHeight: 45,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
    gap: 15,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 45,
  },
  cancelButton: {
    backgroundColor: '#FFFDF6',
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  saveButton: {
    backgroundColor: Colors.primary,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFDF6',
  },
});