import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { API_ENDPOINTS } from '../constants/api';
import { ButtonStyles, ContainerStyles, InputStyles, VolunteerSignUpStyles } from '../styles/globalStyles';

export default function SeniorSignUp() {
  const router = useRouter();
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    address: '',
    agree: '', // Changed from boolean to string to match volunteer signup pattern
  });
  const [submitting, setSubmitting] = useState(false);
  const [groupCode, setGroupCode] = useState('');

  const handleChange = (key: string, value: any) => setForm({ ...form, [key]: value });

  // Radio button component similar to volunteer signup
  const YesNo = ({ value, onChange }: { value: string; onChange: (value: string) => void }) => (
    <View style={VolunteerSignUpStyles.radioRow}>
      <TouchableOpacity onPress={() => onChange('yes')} style={VolunteerSignUpStyles.radioOption}>
        <View style={[VolunteerSignUpStyles.radioButton, value === 'yes' && VolunteerSignUpStyles.radioButtonSelected]}>
          {value === 'yes' && <View style={VolunteerSignUpStyles.radioButtonInner} />}
        </View>
        <Text style={VolunteerSignUpStyles.radioLabel}>Yes</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onChange('no')} style={VolunteerSignUpStyles.radioOption}>
        <View style={[VolunteerSignUpStyles.radioButton, value === 'no' && VolunteerSignUpStyles.radioButtonSelected]}>
          {value === 'no' && <View style={VolunteerSignUpStyles.radioButtonInner} />}
        </View>
        <Text style={VolunteerSignUpStyles.radioLabel}>No</Text>
      </TouchableOpacity>
    </View>
  );

  const handleSubmit = async () => {
    if (form.agree !== 'yes') {
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
    if (!groupCode) {
      Alert.alert('Group Code Required', 'Please enter your group code.');
      return;
    }
    setSubmitting(true);
    console.log('Submitting form:', JSON.stringify(form));
    try {
      const response = await fetch(API_ENDPOINTS.SIGNUP_SENIOR, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, groupCode }),
      });
      const data = await response.json();
      if (response.ok) {
        if (data.message === 'Invalid groupcode') {
          Alert.alert('Invalid Group Code', 'The group code you entered is not valid.');
        } else {
          Alert.alert('Success', 'Account created successfully!');
          router.replace('/');
        }
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
    <View style={ContainerStyles.signupContainer}>
      {/* Back Button like volunteer signup */}
      <TouchableOpacity style={VolunteerSignUpStyles.volunteerBackArrow} onPress={() => router.back()}>
        <Ionicons name="arrow-back-circle-outline" size={30} color="black" />
      </TouchableOpacity>

      <Text style={VolunteerSignUpStyles.volunteerHeader}>Senior Sign Up</Text>
      <TextInput style={InputStyles.inputAlt} placeholder="Full Name" value={form.fullName} onChangeText={t => handleChange('fullName', t)} />
      <TextInput style={InputStyles.inputAlt} placeholder="Phone Number" value={form.phone} onChangeText={t => handleChange('phone', t)} keyboardType="phone-pad" />
      <TextInput style={InputStyles.inputAlt} placeholder="Email" value={form.email} onChangeText={t => handleChange('email', t)} keyboardType="email-address" autoCapitalize="none" />
      <TextInput style={InputStyles.inputAlt} placeholder="Password" value={form.password} onChangeText={t => handleChange('password', t)} secureTextEntry />
      <TextInput style={InputStyles.inputAlt} placeholder="Confirm Password" value={form.confirmPassword} onChangeText={t => handleChange('confirmPassword', t)} secureTextEntry />
      <TextInput style={InputStyles.inputAlt} placeholder="Home Address or ZIP Code" value={form.address} onChangeText={t => handleChange('address', t)} />
      <TextInput style={InputStyles.inputAlt} placeholder="Group Code" value={groupCode} onChangeText={setGroupCode} />
      
      {/* Agreement section with radio button style */}
      <View style={styles.questionSection}>
        <Text style={VolunteerSignUpStyles.question}>I agree to the Terms of Service & Privacy Policy</Text>
        <YesNo value={form.agree} onChange={(v) => handleChange('agree', v)} />
      </View>
      
      <TouchableOpacity style={ButtonStyles.submitButton} onPress={handleSubmit} disabled={submitting}>
        <Text style={ButtonStyles.submitButtonText}>{submitting ? 'Submitting...' : 'Submit'}</Text>
      </TouchableOpacity>
    </View>
  );
}

// Any remaining page-specific styles that aren't in global styles
const styles = StyleSheet.create({
  questionSection: {
    marginTop: 16,
    marginBottom: 16,
    alignSelf: 'flex-start',
    width: '100%',
  },
});
