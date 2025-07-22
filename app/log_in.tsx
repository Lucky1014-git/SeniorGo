import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
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
      const response = await fetch('http://10.0.0.23:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok && data.message === 'success') {
        Alert.alert('Success', 'Logged in successfully!');
        console.log('User info:', data.userInfo);
        setUserInfo(data.userInfo); // Set user info in context
        if (data.accountType === 'senior') {
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
      {/* Go Back Arrow */}
      <TouchableOpacity style={styles.goBackArrow} onPress={() => router.replace('/')}>
        <Text style={styles.goBackText}>←</Text>
      </TouchableOpacity>
      {/* Sign Up Button */}
      <TouchableOpacity style={styles.signupButton} onPress={() => router.replace('/sign_up')}>
        <Text style={styles.signupText}>Sign Up</Text>
      </TouchableOpacity>

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

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={submitting}>
        <Text style={styles.loginText}>{submitting ? 'Submitting...' : 'Submit'}</Text>
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
  loginButton: {
    backgroundColor: '#2F5233',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginTop: 10,
  },
  loginText: {
    color: '#FFFDF6',
    fontSize: 16,
    fontWeight: '600',
  },
  goBackArrow: {
    position: 'absolute',
    top: 40,
    left: 20,
    padding: 8,
    zIndex: 1,
  },
  goBackText: {
    fontSize: 28,
    color: '#2F5233',
  },
  signupButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    padding: 8,
    zIndex: 1,
    backgroundColor: '#FFFDF6',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2F5233',
  },
  signupText: {
    color: '#2F5233',
    fontWeight: '600',
    fontSize: 16,
  },
});

