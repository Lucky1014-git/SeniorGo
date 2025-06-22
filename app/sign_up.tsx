import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function SignUpScreen() {
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
    <View style={styles.container}>
      <Text style={styles.header}>Create Account</Text>
      <TouchableOpacity style={styles.radioContainer} onPress={handleSeniorPress}>
        <Text style={styles.radio}>{selected === 'senior' ? '🔘' : '⭕'} I'm a Senior who needs a ride</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.radioContainer} onPress={handleVolunteerPress}>
        <Text style={styles.radio}>{selected === 'volunteer' ? '🔘' : '⭕'} I'm a Volunteer offering rides</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.backButton} onPress={() => router.replace('/')}> 
        <Text style={styles.backButtonText}>Go Back</Text>
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
    fontSize: 32,
    fontWeight: '700',
    color: '#2F5233',
    marginBottom: 10,
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  radio: {
    fontSize: 18,
    color: '#2F5233',
  },
  backButton: {
    marginTop: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#2F5233',
    borderRadius: 8,
  },
  backButtonText: {
    color: '#FFFDF6',
    fontWeight: '500',
    fontSize: 16,
  },
});