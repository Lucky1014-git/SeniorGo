import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { API_ENDPOINTS } from '../constants/api';
import { ButtonStyles, ContainerStyles, InputStyles, TextStyles } from '../styles/globalStyles';

export default function AdminLogin() {
  const router = useRouter();
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleAdminLogin = async () => {
    if (!userId || !password) {
      Alert.alert('Missing Fields', 'Please enter both User ID and password.');
      return;
    }
    setSubmitting(true);
    try {
      const response = await fetch(API_ENDPOINTS.ADMIN_LOGIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, password }),
      });
      const data = await response.json();
      if (response.ok && response.status === 200) {
        router.replace('/admin-dashboard');
      } else {
        Alert.alert('Login Failed', data.message || 'Invalid credentials.');
      }
    } catch (error) {
      Alert.alert('Error', 'Could not connect to server.');
    }
    setSubmitting(false);
  };

  return (
    <View style={ContainerStyles.centerContainer}>
      {/* Back Arrow */}
      <TouchableOpacity style={ButtonStyles.backArrowAlt} onPress={() => router.replace('/')}>
        <Ionicons name="arrow-back-circle-outline" size={30} color="black" />
      </TouchableOpacity>
      
      <Text style={TextStyles.header}>Admin Login</Text>
      <TextInput
        style={InputStyles.input}
        placeholder="User ID"
        autoCapitalize="none"
        value={userId}
        onChangeText={setUserId}
      />
      <TextInput
        style={InputStyles.input}
        placeholder="Password"
        secureTextEntry
        autoCapitalize="none"
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity
        style={ButtonStyles.primaryButton}
        onPress={handleAdminLogin}
        disabled={submitting}
        activeOpacity={0.85}
      >
        <Text style={ButtonStyles.primaryButtonText}>{submitting ? 'Submitting...' : 'Submit'}</Text>
      </TouchableOpacity>
    </View>
  );
}

// Any remaining page-specific styles that aren't in global styles
const styles = StyleSheet.create({
  // Add any unique styles for this page here if needed
});
