import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function CurrentGroup() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.replace('/admin-dashboard')}>
        <MaterialIcons name="arrow-back" size={24} color="#2F5233" />
      </TouchableOpacity>

      {/* Signout Icon Button */}
      <TouchableOpacity style={styles.signoutButton} onPress={() => router.replace('/')}> 
        <MaterialIcons name="logout" size={22} color="#2F5233" />
      </TouchableOpacity>

      <View style={styles.navBar}>
        <Text style={styles.navBarText}>Current Group</Text>
      </View>

      <View style={styles.cardsGrid}>
        <TouchableOpacity
          style={styles.cardLarge}
          onPress={() => router.push('/track-volunteers')}
        >
          <Text style={styles.cardIcon}>👥</Text>
          <Text style={styles.cardTitle}>Track Volunteers</Text>
          <Text style={styles.cardDesc}>Monitor volunteer activities</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.cardLarge}
          onPress={() => router.push('/track-volunteers')}
        >
          <Text style={styles.cardIcon}>👴</Text>
          <Text style={styles.cardTitle}>Track Seniors</Text>
          <Text style={styles.cardDesc}>Monitor senior activities</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DFF5E3',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
    padding: 6,
    backgroundColor: '#FFFDF6',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#2F5233',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navBar: {
    marginBottom: 30,
    alignItems: 'center',
  },
  navBarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2F5233',
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  cardLarge: {
    width: '100%',
    backgroundColor: '#FFFDF6',
    borderRadius: 16,
    padding: 28,
    marginBottom: 20,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 4,
  },
  cardIcon: {
    fontSize: 48,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2F5233',
    marginBottom: 6,
  },
  cardDesc: {
    fontSize: 16,
    color: '#2F5233',
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
});