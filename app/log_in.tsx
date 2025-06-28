import { useRouter } from 'expo-router';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function LoginScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Go Back Arrow */}
      <TouchableOpacity style={styles.goBackArrow} onPress={() => router.replace('/')}>
        <Text style={styles.goBackText}>←</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Log In</Text>

      <TextInput
        style={styles.input}
        placeholder="Email Address"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        autoCapitalize="none"
      />

      <TouchableOpacity style={styles.loginButton} onPress={() => router.push('/request_a_ride')}>
        <Text style={styles.loginText}>Submit</Text>
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
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#2F5233',
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
});
