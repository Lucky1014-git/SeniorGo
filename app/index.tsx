import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { API_ENDPOINTS } from '../constants/api';
import { useUser } from '../contexts/usercontext';

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
    <View style={styles.container}>
      {/* Sign Up Button moved below */}
      <Text style={styles.title}>SeniorGo</Text>
      <Text style={styles.subtitle}>Welcome! Please log in</Text>

      <TextInput
        style={styles.input}
        placeholder="Email Address"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        autoCapitalize="none"
        value={password}
        onChangeText={setPassword}
      />

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={submitting}>
          <Text style={styles.loginText}>{submitting ? 'Submitting...' : 'Submit'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.signupButtonAlt} onPress={() => router.replace('/sign_up')}>
          <Text style={styles.signupTextAlt}>Sign Up</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={() => router.replace('/forgot-password')}>
        <Text style={styles.forgotPasswordLink}>Forgot password?</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.replace('/admin-login')}>
        <Text style={styles.adminLoginLink}>Admin login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFDF6',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: '600',
    color: '#2F5233',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#2F5233',
    marginBottom: 30,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#2F5233',
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
    backgroundColor: '#FFF',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    gap: 10, // If gap doesn't work, use marginRight on loginButton
  },
  loginButton: {
    backgroundColor: '#2F5233',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginRight: 10, // Space between buttons
  },
  loginText: {
    color: '#FFFDF6',
    fontSize: 16,
    fontWeight: '600',
  },
  signupButtonAlt: {
    backgroundColor: '#FFFDF6',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#2F5233',
  },
  signupTextAlt: {
    color: '#2F5233',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  forgotPasswordLink: {
    color: '#1B7F5B',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 12,
    textDecorationLine: 'underline',
  },
  adminLoginLink: {
    color: '#2F5233',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    textDecorationLine: 'underline',
    fontWeight: '600',
  },
});



