import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ButtonStyles, ContainerStyles, SignUpTypeStyles, TextStyles } from '../styles/globalStyles';


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
        <Ionicons name="arrow-back-circle-outline" size={30} color="black" />
        
      </TouchableOpacity>
      <Text style={TextStyles.headerLarge}>Create Account</Text>
      
      <TouchableOpacity 
        style={[
          SignUpTypeStyles.signUpButton,
          selected === 'senior' && SignUpTypeStyles.signUpButtonSelected
        ]} 
        onPress={handleSeniorPress}
      >
        <Text style={SignUpTypeStyles.signUpButtonText}>
          I'm a Senior who needs a ride
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[
          SignUpTypeStyles.signUpButton,
          { marginBottom: 0 },
          selected === 'volunteer' && SignUpTypeStyles.signUpButtonSelected
        ]} 
        onPress={handleVolunteerPress}
      >
        <Text style={SignUpTypeStyles.signUpButtonText}>
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
