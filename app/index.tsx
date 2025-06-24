import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SeniorGo</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.loginButton} onPress={() => router.push('/log_in')}>
          <Text style={styles.loginText}>Log in</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.signupButton} onPress={() => router.push('/sign_up')}>
          <Text style={styles.signupText}>Sign up</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.rideButton} onPress={() => router.push('/request_a_ride')}>
        <Text style={styles.rideButtonText}>Request a Ride</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DFF5E3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: '600',
    color: '#2F5233',
    marginBottom: 80,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 20,
  },
  loginButton: {
    borderColor: '#2F5233',
    borderWidth: 2,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    backgroundColor: '#DFF5E3',
  },
  signupButton: {
    backgroundColor: '#2F5233',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  rideButton: {
    marginTop: 40,
    backgroundColor: '#2F5233',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 10,
    alignItems: 'center',
  },
  loginText: {
    color: '#2F5233',
    fontWeight: '500',
    fontSize: 16,
  },
  signupText: {
    color: '#FFFDF6',
    fontWeight: '500',
    fontSize: 16,
  },
  rideButtonText: {
    color: '#FFFDF6',
    fontWeight: '600',
    fontSize: 18,
  },
});
