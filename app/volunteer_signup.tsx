import Ionicons from '@expo/vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useState } from 'react';

import * as FileSystem from 'expo-file-system';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { API_ENDPOINTS } from '../constants/api';
import { VolunteerSignUpStyles } from '../styles/globalStyles';
;

export default function VolunteerSignUp() {
  const router = useRouter();
  const [form, setForm] = useState({
    fullName: '',
    dob: '',
    email: '',
    phone: '',
    address: '',
    hasLicense: '',
    licenseNumber: '',
    hasVehicle: '',
    vehicleType: '',
    proof: '',
    backgroundCheck: '',
    volunteeredBefore: '',
    firstAid: '',
    mobilityHelp: '',
  });
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [groupCode, setGroupCode] = useState('');
  const [image, setImage] = useState<string | null>(null);


  const handleChange = (key: string, value: any) => setForm({ ...form, [key]: value });

  const handleDateChange = (value: string) => {
    // Remove all non-numeric characters
    const cleaned = value.replace(/\D/g, '');
    
    let formatted = cleaned;
    
    // Add slashes as user types
    if (cleaned.length >= 2) {
      formatted = cleaned.slice(0, 2) + '/' + cleaned.slice(2);
    }
    if (cleaned.length >= 4) {
      formatted = cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4) + '/' + cleaned.slice(4, 8);
    }
    
    // Limit to 10 characters (MM/DD/YYYY)
    if (formatted.length <= 10) {
      setForm({ ...form, dob: formatted });
    }
  };



  const pickImage = async () => {
    Alert.alert(
      'Select Photo',
      'Choose how you want to add your photo:',
      [
        {
          text: 'Camera',
          onPress: async () => {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            if (status !== 'granted') {
              Alert.alert('Permission Denied', 'Camera permission is required to take photos.');
              return;
            }
            const result = await ImagePicker.launchCameraAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              aspect: [1, 1],
              quality: 0.8,
            });
            if (!result.canceled) {
              setImage(result.assets[0].uri);
            }
          }
        },
        {
          text: 'Photo Library',
          onPress: async () => {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
              Alert.alert('Permission Denied', 'Photo library permission is required to select photos.');
              return;
            }
            const result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              aspect: [1, 1],
              quality: 0.8,
            });
            if (!result.canceled) {
              setImage(result.assets[0].uri);
            }
          }
        },
        {
          text: 'Cancel',
          style: 'cancel'
        }
      ]
    );
  };

  const removeImage = () => {
    setImage(null);
  };

  const handleSubmit = async () => {
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }
    // Age validation
    if (form.dob) {
      // Parse MM/DD/YYYY
      const parts = form.dob.split('/');
      if (parts.length !== 3) {
        Alert.alert('Invalid Date', 'Please enter your date of birth in MM/DD/YYYY format.');
        return;
      }
      const [month, day, year] = parts.map(Number);
      const dob = new Date(year, month - 1, day);
      if (isNaN(dob.getTime())) {
        Alert.alert('Invalid Date', 'Please enter a valid date of birth in MM/DD/YYYY format.');
        return;
      }
      const today = new Date();
      let age = today.getFullYear() - dob.getFullYear();
      const m = today.getMonth() - dob.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
        age--;
      }
      if (age < 16) {
        Alert.alert('Age Restriction', 'You must be at least 16 years old to volunteer.');
        return;
      }
    } else {
      Alert.alert('Date of Birth Required', 'Please enter your date of birth.');
      return;
    }
    // License number required
    if (!form.licenseNumber || form.licenseNumber.trim() === '') {
      Alert.alert('License Number Required', 'Please enter your driver’s license number.');
      return;
    }
    // Password validation
    if (!password || !confirmPassword) {
      Alert.alert('Password Required', 'Please enter and confirm your password.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Password Mismatch', 'Passwords do not match.');
      return;
    }
    setSubmitting(true);
    try {
      console.log('Submitting form:', JSON.stringify(form));
      const formData: any = { ...form, password, groupCode };
      
      // Convert image to Base64 if present
      if (image) {
        try {
          const base64 = await FileSystem.readAsStringAsync(image, {
            encoding: FileSystem.EncodingType.Base64,
          });
          formData.profilePhoto = base64;
          console.log('Image converted to Base64, length:', base64.length);
        } catch (imageError) {
          console.error('Error converting image to Base64:', imageError);
          Alert.alert('Image Error', 'Failed to process the image. Please try again.');
          setSubmitting(false);
          return;
        }
      }
      
      const response = await fetch(API_ENDPOINTS.SIGNUP_VOLUNTEER, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        if (data.message === 'invalid group code') {
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

  const YesNo = ({ value, onChange }: { value: string, onChange: (v: string) => void }) => (
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

  // Signout handler
  const handleSignOut = () => {
    router.replace('/');
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={VolunteerSignUpStyles.volunteerContainer} keyboardShouldPersistTaps="handled">
        {/* Signout Icon Button */}


        <TouchableOpacity style={VolunteerSignUpStyles.volunteerBackArrow} onPress={() => router.back()}>
          <Ionicons name="arrow-back-circle-outline" size={30} color="black" />
        </TouchableOpacity>

        <Text style={VolunteerSignUpStyles.volunteerHeader}>Volunteer Sign Up</Text>

        {/* Personal Info */}
        <TextInput style={VolunteerSignUpStyles.volunteerInput} placeholder="Full Name" value={form.fullName} onChangeText={t => handleChange('fullName', t)} />
        
        {/* Date of Birth Input */}
        <TextInput 
          style={VolunteerSignUpStyles.volunteerInput} 
          placeholder="Date of Birth (MM/DD/YYYY)" 
          value={form.dob} 
          onChangeText={handleDateChange}
          keyboardType="numeric"
          maxLength={10}
        />
        
        <TextInput style={VolunteerSignUpStyles.volunteerInput} placeholder="Email Address" value={form.email} onChangeText={t => handleChange('email', t)} keyboardType="email-address" autoCapitalize="none" />
        <TextInput style={VolunteerSignUpStyles.volunteerInput} placeholder="Phone Number" value={form.phone} onChangeText={t => handleChange('phone', t)} keyboardType="phone-pad" />
        <TextInput style={VolunteerSignUpStyles.volunteerInput} placeholder="Address or City/Zip" value={form.address} onChangeText={t => handleChange('address', t)} />

        {/* Password fields */}
        <TextInput
          style={VolunteerSignUpStyles.volunteerInput}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
        />
        <TextInput
          style={VolunteerSignUpStyles.volunteerInput}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          autoCapitalize="none"
        />

        {/* Driving & Vehicle */}
        <Text style={VolunteerSignUpStyles.section}>Driver & Vehicle Info</Text>
        <Text style={VolunteerSignUpStyles.question}>Do you have a valid driver's license?</Text>
        <YesNo value={form.hasLicense} onChange={v => handleChange('hasLicense', v)} />
        <TextInput style={VolunteerSignUpStyles.volunteerInput} placeholder="License Number (optional)" value={form.licenseNumber} onChangeText={t => handleChange('licenseNumber', t)} />
        <Text style={VolunteerSignUpStyles.question}>Do you have your own vehicle?</Text>
        <YesNo value={form.hasVehicle} onChange={v => handleChange('hasVehicle', v)} />
        <TextInput style={VolunteerSignUpStyles.volunteerInput} placeholder="Vehicle type & capacity (e.g., SUV, wheelchair)" value={form.vehicleType} onChangeText={t => handleChange('vehicleType', t)} />
        <TextInput style={VolunteerSignUpStyles.volunteerInput} placeholder="Proof of insurance or registration" value={form.proof} onChangeText={t => handleChange('proof', t)} />

        {/* Experience */}
        <Text style={VolunteerSignUpStyles.section}>Experience & Qualifications</Text>
        <Text style={VolunteerSignUpStyles.question}>Willing to undergo background check?</Text>
        <YesNo value={form.backgroundCheck} onChange={v => handleChange('backgroundCheck', v)} />
        <Text style={VolunteerSignUpStyles.question}>Volunteered with seniors before?</Text>
        <YesNo value={form.volunteeredBefore} onChange={v => handleChange('volunteeredBefore', v)} />
        <Text style={VolunteerSignUpStyles.question}>First-aid/CPR trained?</Text>
        <YesNo value={form.firstAid} onChange={v => handleChange('firstAid', v)} />
        <Text style={VolunteerSignUpStyles.question}>Comfortable helping with mobility?</Text>
        <YesNo value={form.mobilityHelp} onChange={v => handleChange('mobilityHelp', v)} />

        {/* Group Code */}
        <TextInput style={VolunteerSignUpStyles.volunteerInput} placeholder="Group Code" value={groupCode} onChangeText={setGroupCode} />

        {/* Photo Capture */}
        <View style={VolunteerSignUpStyles.photoContainer}>
          <TouchableOpacity style={VolunteerSignUpStyles.photoButton} onPress={pickImage}>
            <Ionicons name="camera" size={20} color={VolunteerSignUpStyles.photoButtonText.color} />
            <Text style={VolunteerSignUpStyles.photoButtonText}>
              {image ? 'Change Photo' : 'Add Photo'}
            </Text>
          </TouchableOpacity>
          
          {image && (
            <View>
              <Image source={{ uri: image }} style={VolunteerSignUpStyles.smallPhotoPreview} />
              <TouchableOpacity style={VolunteerSignUpStyles.removePhotoButton} onPress={removeImage}>
                <Text style={VolunteerSignUpStyles.removePhotoText}>Remove Photo</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <TouchableOpacity style={VolunteerSignUpStyles.volunteerSubmitButton} onPress={handleSubmit} disabled={submitting}>
          <Text style={VolunteerSignUpStyles.volunteerSubmitButtonText}>{submitting ? 'Submitting...' : 'Submit'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// Any remaining page-specific styles that aren't in global styles
const styles = StyleSheet.create({
  // Add any unique styles for this page here if needed
});

