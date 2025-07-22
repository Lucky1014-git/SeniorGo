import { MaterialIcons } from '@expo/vector-icons'; // Add this import
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// The `export default function TrackHoursScreen() { ... }` syntax defines a React component function
// and makes it the default export of this file. This means when another file imports from this file
// (e.g., `import TrackHoursScreen from './track-hours'`), it will get this component by default.

export default function TrackHoursScreen() {
  const router = useRouter();

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
      <Text>This is the Track Hours screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
