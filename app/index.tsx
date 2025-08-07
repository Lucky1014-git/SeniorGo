import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { API_ENDPOINTS } from '../constants/api';
import { useUser } from '../contexts/usercontext';
import { ButtonStyles, ContainerStyles, InputStyles, LayoutStyles, TextStyles } from '../styles/globalStyles';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { setUserInfo } = useUser(); // Move useUser() inside the component

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Missing Fields', 'Please enter both email and password.');
      return;
    }
    setSubmitting(true);
    try {
      const response = await fetch(API_ENDPOINTS.LOGIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok && data.message === 'success') {
        Alert.alert('Success', 'Logged in successfully!');
        console.log('User info:', data.userInfo);
        setUserInfo({ ...data.userInfo, accountType: data.accountType }); // Set user info and accountType in context

        if (data.userInfo && data.userInfo.resetPassword === true) {
          router.push('/change-password');
        } else if (data.accountType === 'senior') {
          router.push('/senior-dashboard');
        } else if (data.accountType === 'volunteer') {
          router.push('/volunteer-dashboard');
        } else {
          // fallback or handle other account types if needed
        }
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
      <Text style={TextStyles.title}>SeniorGo</Text>
      <Text style={TextStyles.subtitle}>Welcome! Please log in</Text>

      <TextInput
        style={InputStyles.input}
        placeholder="Email Address"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={InputStyles.input}
        placeholder="Password"
        secureTextEntry
        autoCapitalize="none"
        value={password}
        onChangeText={setPassword}
      />

      <View style={LayoutStyles.buttonRow}>
        <TouchableOpacity style={[ButtonStyles.primaryButton, { marginRight: 10 }]} onPress={handleLogin} disabled={submitting}>
          <Text style={ButtonStyles.primaryButtonText}>{submitting ? 'Submitting...' : 'Submit'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={ButtonStyles.secondaryButton} onPress={() => router.replace('/sign_up_type')}>
          <Text style={ButtonStyles.secondaryButtonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={() => router.replace('/forgot-password')}>
        <Text style={TextStyles.link}>Forgot password?</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.replace('/admin-login')}>
        <Text style={TextStyles.link}>Admin login</Text>
      </TouchableOpacity>
    </View>
  );
}

// Any remaining page-specific styles that aren't in global styles
const styles = StyleSheet.create({
  // Add any unique styles for this page here if needed
});



