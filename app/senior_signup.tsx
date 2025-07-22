import { MaterialIcons } from '@expo/vector-icons'; // Add this import
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function SeniorSignUp() {
  const router = useRouter();
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    address: '',
    agree: false,
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (key: string, value: any) => setForm({ ...form, [key]: value });

  const handleSubmit = async () => {
    if (!form.agree) {
      Alert.alert('Agreement Required', 'You must agree to the Terms of Service & Privacy Policy.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      Alert.alert('Password Mismatch', 'Passwords do not match.');
      return;
    }
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }
    setSubmitting(true);
    console.log('Submitting form:', JSON.stringify(form));
    try {
      const response = await fetch('http://10.0.0.23:5000/signUpSenior', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (response.ok) {
        Alert.alert('Success', 'Account created successfully!');
        router.replace('/');
      } else {
        Alert.alert('Error', data.message || 'Failed to create account.');
      }
    } catch (error) {
      console.error('API error:', error);
      Alert.alert('Error', 'Could not connect to server.');
    }
    setSubmitting(false);
  };

  // Signout handler
  const handleSignOut = () => {
    router.replace('/');
  };

  return (
    <View style={styles.container}>
      {/* Signout Icon Button */}
      <TouchableOpacity style={styles.signoutButton} onPress={handleSignOut}>
        <MaterialIcons name="logout" size={22} color="#2F5233" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.backArrow} onPress={() => router.back()}>
        <Text style={styles.backArrowText}>{'←'}</Text>
      </TouchableOpacity>
      <Text style={styles.header}>Senior Sign Up</Text>
      <TextInput style={styles.input} placeholder="Full Name" value={form.fullName} onChangeText={t => handleChange('fullName', t)} />
      <TextInput style={styles.input} placeholder="Phone Number" value={form.phone} onChangeText={t => handleChange('phone', t)} keyboardType="phone-pad" />
      <TextInput style={styles.input} placeholder="Email" value={form.email} onChangeText={t => handleChange('email', t)} keyboardType="email-address" autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="Password" value={form.password} onChangeText={t => handleChange('password', t)} secureTextEntry />
      <TextInput style={styles.input} placeholder="Confirm Password" value={form.confirmPassword} onChangeText={t => handleChange('confirmPassword', t)} secureTextEntry />
      <TextInput style={styles.input} placeholder="Home Address or ZIP Code" value={form.address} onChangeText={t => handleChange('address', t)} />
      <View style={styles.checkboxContainer}>
        <TouchableOpacity onPress={() => handleChange('agree', !form.agree)} style={styles.customCheckbox}>
          <Text style={styles.checkboxIcon}>{form.agree ? '🔘' : '⭕'}</Text>
        </TouchableOpacity>
        <Text style={styles.checkboxLabel}>I agree to the Terms of Service & Privacy Policy</Text>
      </View>
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={submitting}>
        <Text style={styles.submitButtonText}>{submitting ? 'Submitting...' : 'Submit'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#DFF5E3',
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2F5233',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2F5233',
    borderRadius: 8,
    backgroundColor: '#FFFDF6',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  customCheckbox: {
    marginRight: 8,
  },
  checkboxIcon: {
    fontSize: 22,
  },
  checkboxLabel: {
    color: '#2F5233',
  },
  submitButton: {
    backgroundColor: '#2F5233',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 10,
  },
  backArrow: {
    position: 'absolute',
    top: 40,
    left: 20,
    padding: 8,
    zIndex: 10,
  },
  backArrowText: {
    fontSize: 32,
    color: '#2F5233',
  },
  submitButtonText: {
    color: '#FFFDF6',
    fontWeight: '600',
    fontSize: 18,
  },
  signoutButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
    padding: 6,
    backgroundColor: '#FFFDF6',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#2F5233',
    alignItems: 'center',
    justifyContent: 'center',
  },
  signoutIcon: {
    fontSize: 22,
    color: '#2F5233',
  },
});
