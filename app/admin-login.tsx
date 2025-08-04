import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { API_ENDPOINTS } from '../constants/api';

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
    <View style={styles.container}>
      <Text style={styles.header}>Admin Login</Text>
      <TextInput
        style={styles.input}
        placeholder="User ID"
        autoCapitalize="none"
        value={userId}
        onChangeText={setUserId}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        autoCapitalize="none"
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={handleAdminLogin}
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
});
