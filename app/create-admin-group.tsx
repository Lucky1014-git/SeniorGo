import { ButtonStyles, Colors, ContainerStyles, HeaderStyles, InputStyles, TextStyles } from '@/styles/globalStyles';
import { MaterialIcons } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { API_ENDPOINTS } from '../constants/api';

export default function CreateAdminGroup() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    userid: '',
    email: '',
    name: '',
    password: '',
    phone: '',
    groupcode: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignOut = () => {
    router.replace('/');
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    const { userid, email, name, password, phone, groupcode } = formData;
    
    if (!userid.trim()) {
      Alert.alert('Error', 'User ID is required');
      return false;
    }
    
    if (!email.trim()) {
      Alert.alert('Error', 'Email is required');
      return false;
    }
    
    if (!email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }
    
    if (!name.trim()) {
      Alert.alert('Error', 'Name is required');
      return false;
    }
    
    if (!password.trim()) {
      Alert.alert('Error', 'Password is required');
      return false;
    }
    
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return false;
    }
    
    if (!phone.trim()) {
      Alert.alert('Error', 'Phone number is required');
      return false;
    }
    
    if (!groupcode.trim()) {
      Alert.alert('Error', 'Group code is required');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch(API_ENDPOINTS.CREATE_ADMIN_GROUP, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        Alert.alert(
          'Success',
          'Group admin created successfully!',
          [
            {
              text: 'OK',
              onPress: () => router.replace('/admin-dashboard'),
            },
          ]
        );
      } else {
        const errorData = await response.text();
        Alert.alert('Error', errorData || 'Failed to create group admin');
      }
    } catch (error) {
      Alert.alert('Error', 'Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView style={ContainerStyles.screenContainer} contentContainerStyle={styles.scrollContent}>
      {/* Header */}
      <View style={HeaderStyles.headerRow}>
        {/* Back Button on the left */}
        <TouchableOpacity
          style={HeaderStyles.headerButton}
          onPress={() => router.replace('/admin-dashboard')}
        >
          <AntDesign name="arrowleft" size={25} color={Colors.primary} />
        </TouchableOpacity>

        {/* Logout Button on the right */}
        <TouchableOpacity
          style={HeaderStyles.headerButton}
          onPress={handleSignOut}
        >
          <MaterialIcons name="logout" size={25} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Title */}
      <Text style={TextStyles.header}>Create Group Admin</Text>

      {/* Form */}
      <View style={styles.formContainer}>
        <TextInput
          style={InputStyles.input}
          placeholder="User ID"
          value={formData.userid}
          onChangeText={(value) => handleInputChange('userid', value)}
          autoCapitalize="none"
        />

        <TextInput
          style={InputStyles.input}
          placeholder="Email Address"
          value={formData.email}
          onChangeText={(value) => handleInputChange('email', value)}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={InputStyles.input}
          placeholder="Full Name"
          value={formData.name}
          onChangeText={(value) => handleInputChange('name', value)}
        />

        <TextInput
          style={InputStyles.input}
          placeholder="Password"
          value={formData.password}
          onChangeText={(value) => handleInputChange('password', value)}
          secureTextEntry
        />

        <TextInput
          style={InputStyles.input}
          placeholder="Phone Number"
          value={formData.phone}
          onChangeText={(value) => handleInputChange('phone', value)}
          keyboardType="phone-pad"
        />

        <TextInput
          style={InputStyles.input}
          placeholder="Group Code"
          value={formData.groupcode}
          onChangeText={(value) => handleInputChange('groupcode', value)}
          autoCapitalize="characters"
        />

        {/* Submit Button */}
        <TouchableOpacity
          style={[ButtonStyles.submitButton, isSubmitting && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          <Text style={ButtonStyles.submitButtonText}>
            {isSubmitting ? 'Creating...' : 'Submit'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 40,
  },
  formContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  submitButtonDisabled: {
    backgroundColor: '#9CA3AF',
    opacity: 0.7,
  },
});