import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UserProvider } from '../contexts/usercontext'; // Adjust the import path as needed

export default function Layout() {
  return (
    <UserProvider> {/* ✅ Wrap the app in your global user context */}
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar style="dark" />
        <View style={styles.container}>
          <Stack screenOptions={{ headerShown: false }} />
        </View>
      </SafeAreaView>
    </UserProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DFF5E3',
  },
});
