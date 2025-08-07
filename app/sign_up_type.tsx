import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ButtonStyles, ContainerStyles, TextStyles } from '../styles/globalStyles';

export default function SignUpTypeScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState('');

  const handleSeniorPress = () => {
    setSelected('senior');
    router.push('/senior_signup');
  };

  const handleVolunteerPress = () => {
    setSelected('volunteer');
    router.push('/volunteer_signup');
  };

  return (
    <View style={ContainerStyles.signupContainer}>
      <TouchableOpacity style={ButtonStyles.backArrow} onPress={() => router.replace('/')}>
        <Text style={{ fontSize: 28, color: '#2F5233' }}>{'\u2190'}</Text>
      </TouchableOpacity>
      <Text style={TextStyles.headerLarge}>Create Account</Text>
      
      <TouchableOpacity 
        style={[
          ButtonStyles.primaryButton, 
          { marginBottom: 20, width: '80%' },
          selected === 'senior' && { backgroundColor: '#1B7F5B' }
        ]} 
        onPress={handleSeniorPress}
      >
        <Text style={[
          ButtonStyles.primaryButtonText,
          { textAlign: 'center' }
        ]}>
          I'm a Senior who needs a ride
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[
          ButtonStyles.primaryButton, 
          { width: '80%' },
          selected === 'volunteer' && { backgroundColor: '#1B7F5B' }
        ]} 
        onPress={handleVolunteerPress}
      >
        <Text style={[
          ButtonStyles.primaryButtonText,
          { textAlign: 'center' }
        ]}>
          I'm a Volunteer offering rides
        </Text>
      </TouchableOpacity>
    </View>
  );
}

// Any remaining page-specific styles that aren't in global styles
const styles = StyleSheet.create({
  // Add any unique styles for this page here if needed
});
