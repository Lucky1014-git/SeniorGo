import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { API_ENDPOINTS } from '../constants/api';
import { useUser } from '../contexts/usercontext';

export default function ChangePassword() {
  const router = useRouter();
  const { getUserInfo } = useUser();
  const emailaddress = getUserInfo()?.emailaddress;
  const accountType = getUserInfo()?.accountType;
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const validatePassword = (password: string) => {
    return password.length >= 8 && /\d/.test(password);
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New password and confirm password do not match.');
      return;
    }
    if (!validatePassword(newPassword)) {
      Alert.alert('Error', 'New password must be at least 8 characters and include a number.');
      return;
    }
    setSubmitting(true);
    try {
      const response = await fetch(API_ENDPOINTS.CHANGE_PASSWORD, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emailaddress,
          oldpassword: currentPassword,
          newpassword: newPassword,
        }),
      });
      const data = await response.json();
      if (response.ok && response.status === 200) {
        if (accountType === 'senior') {
          router.replace('/senior-dashboard');
        } else {
          router.replace('/volunteer-dashboard');
        }
      } else {
        Alert.alert('Error', data.message || 'Failed to change password.');
      }
    } catch (error) {
      Alert.alert('Error', 'Could not connect to server.');
    }
    setSubmitting(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backArrow} onPress={() => router.replace('/')}>
        <Text style={{ fontSize: 28, color: '#2F5233' }}>{'\u2190'}</Text>
      </TouchableOpacity>
      <Text style={styles.header}>Change Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Current Password"
        secureTextEntry
        autoCapitalize="none"
        value={currentPassword}
        onChangeText={setCurrentPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="New Password"
        secureTextEntry
        autoCapitalize="none"
        value={newPassword}
        onChangeText={setNewPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm New Password"
        secureTextEntry
        autoCapitalize="none"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={handleChangePassword}
        disabled={submitting}
        activeOpacity={0.85}
      >
        <Text style={styles.buttonText}>{submitting ? 'Submitting...' : 'Submit'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E6F4EA',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2F5233',
    marginBottom: 24,
    textAlign: 'center',
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
  },
  buttonText: {
    color: '#FFFDF6',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  backArrow: {
    position: 'absolute',
    top: 44,
    left: 16,
    zIndex: 10,
    padding: 4,
  },
});

