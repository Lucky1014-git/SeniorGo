import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { API_ENDPOINTS } from '../constants/api';
import { useUser } from '../contexts/usercontext';

export default function CreateGroup() {
  const router = useRouter();
  const { getUserInfo } = useUser();
  const emailaddress = getUserInfo()?.emailaddress;
  const [groupName, setGroupName] = useState('');
  const [groupType, setGroupType] = useState('');
  const [groupLocation, setGroupLocation] = useState('');
  const [groupAdminEmail, setGroupAdminEmail] = useState('');
  const [groupAdminPhone, setGroupAdminPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!groupName || !groupType || !groupLocation || !groupAdminPhone) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }
    setSubmitting(true);
    try {
      const response = await fetch(API_ENDPOINTS.CREATE_GROUP, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emailaddress:groupAdminEmail,
          groupname: groupName,
          grouptype: groupType,
          location: groupLocation,
          phonenumber: groupAdminPhone,
        }),
      });
      const data = await response.json();
      if (response.ok && response.status === 200) {
        const groupCode = data.groupCode || data.groupcode || data.code;
        Alert.alert(
          'Success',
          `Group created successfully. Your group code is: ${groupCode}`,
          [
            { text: 'OK', onPress: () => router.replace('/admin-dashboard') },
          ]
        );
      } else {
        Alert.alert('Error', data.message || 'Failed to create group.');
      }
    } catch (error) {
      Alert.alert('Error', 'Could not connect to server.');
    }
    setSubmitting(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backArrow} onPress={() => router.replace('/admin-dashboard')}>
        <MaterialIcons name="arrow-back" size={28} color="#2F5233" />
      </TouchableOpacity>
      <Text style={styles.header}>Create Group</Text>
      <TextInput
        style={styles.input}
        placeholder="Group Name"
        value={groupName}
        onChangeText={setGroupName}
      />
      <TextInput
        style={styles.input}
        placeholder="Group Type"
        value={groupType}
        onChangeText={setGroupType}
      />
      <TextInput
        style={styles.input}
        placeholder="Location"
        value={groupLocation}
        onChangeText={setGroupLocation}
      />
      <TextInput
        style={styles.input}
        placeholder="Group Admin Email Address"
        value={groupAdminEmail}
        onChangeText={setGroupAdminEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Group Admin Phone Number"
        value={groupAdminPhone}
        onChangeText={setGroupAdminPhone}
        keyboardType="phone-pad"
      />
      {/* Add more fields here later */}
      <TouchableOpacity style={[styles.button, !submitting && groupName && groupType && groupLocation && groupAdminPhone ? { opacity: 1 } : { opacity: 0.5 }]} onPress={handleSubmit} disabled={submitting || !groupName || !groupType || !groupLocation || !groupAdminPhone}>
        <Text style={styles.buttonText}>{submitting ? 'Submitting...' : 'Submit'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DFF5E3',
    paddingTop: 60,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  backArrow: {
    position: 'absolute',
    top: 44,
    left: 16,
    zIndex: 10,
    padding: 4,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2F5233',
    marginBottom: 32,
    textAlign: 'center',
    marginTop: 16,
  },
  input: {
    width: '100%',
    borderWidth: 2,
    borderColor: '#2F5233',
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
    backgroundColor: '#FFFDF6',
    marginBottom: 18,
    color: '#2F5233',
  },
  button: {
    width: 180,
    backgroundColor: '#2F5233',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    elevation: 2,
    alignSelf: 'center',
    opacity: 0.5,
  },
  buttonText: {
    color: '#FFFDF6',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});
