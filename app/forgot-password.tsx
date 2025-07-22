import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleReset = async () => {
    if (!email) {
      Alert.alert('Please enter your email address.');
      return;
    }
    try {
      const response = await fetch('http://10.0.0.23:5000/forgotPassword', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailaddress: email }),
      });
      const data = await response.json();
      if (response.ok && response.status === 200) {
        Alert.alert(
          'Password Reset',
          'Password is reset successfully. A temporary password is sent to your email.',
          [
            {
              text: 'OK',
              onPress: () => router.replace('/'),
            },
          ]
        );
        setSubmitted(true);
      } else {
        Alert.alert('Error', data.message || 'Failed to send reset link.');
      }
    } catch (error) {
      Alert.alert('Error', 'Could not connect to server.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Signout Icon Button */}
      <TouchableOpacity style={styles.signoutButton} onPress={() => router.replace('/')}>
        <MaterialIcons name="logout" size={22} color="#2F5233" />
      </TouchableOpacity>
      <Text style={styles.header}>Forgot Your Password?</Text>
      <Text style={styles.subtext}>
        Please enter your email and we will send you a unique code to reset your password.
      </Text>
      {!submitted ? (
        <>
          <TextInput
            style={styles.input}
            placeholder="Email Address"
            placeholderTextColor="#7CA982"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            accessibilityLabel="Email Address"
          />
          <TouchableOpacity style={styles.button} onPress={handleReset} activeOpacity={0.85}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </>
      ) : (
        <View style={styles.confirmBox}>
          <Text style={styles.confirmText}>✅ We've sent a reset link to your email.</Text>
          <Text style={styles.confirmSubtext}>Check your inbox and follow the instructions to reset your password.</Text>
        </View>
      )}
      {/* Removed the back to login link, replaced with signout button above */}
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
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2F5233',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtext: {
    fontSize: 18,
    color: '#2F5233',
    marginBottom: 28,
    textAlign: 'center',
    fontWeight: '400',
  },
  input: {
    width: '100%',
    borderWidth: 2,
    borderColor: '#2F5233',
    borderRadius: 12,
    padding: 18,
    fontSize: 18,
    backgroundColor: '#FFFDF6',
    marginBottom: 24,
    color: '#2F5233',
  },
  button: {
    width: '100%',
    backgroundColor: '#2F5233',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
    elevation: 2,
  },
  buttonText: {
    color: '#FFFDF6',
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  confirmBox: {
    backgroundColor: '#DFF5E3',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    width: '100%',
  },
  confirmText: {
    fontSize: 20,
    color: '#2F5233',
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  confirmSubtext: {
    fontSize: 16,
    color: '#2F5233',
    textAlign: 'center',
  },
  supportLink: {
    marginTop: 10,
    marginBottom: 18,
    alignSelf: 'center',
  },
  supportText: {
    color: '#1B7F5B',
    fontSize: 17,
    textDecorationLine: 'underline',
    textAlign: 'center',
    fontWeight: '600',
  },
  backToLogin: {
    marginTop: 10,
    alignSelf: 'center',
  },
  backToLoginText: {
    color: '#2F5233',
    fontSize: 17,
    textAlign: 'center',
    textDecorationLine: 'underline',
    fontWeight: '600',
  },
  signoutButton: {
    position: 'absolute',
    top: 44,
    right: 16,
    zIndex: 20,
    padding: 6,
    backgroundColor: '#FFFDF6',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#2F5233',
    alignItems: 'center',
    justifyContent: 'center',
  },
});


