import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function CreateGroups() {
  const router = useRouter();
  const [groupName, setGroupName] = useState('');
  const [groupLocation, setGroupLocation] = useState('');
  const [groupType, setGroupType] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleCreateGroup = async () => {
    if (!groupName || !groupLocation || !groupType) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
    setSubmitting(true);
    try {
      const response = await fetch('http://10.0.0.23:5000/createGroup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          groupName,
          groupLocation,
          groupType,
        }),
      });
      const data = await response.json();
      if (response.ok && response.status === 200) {
        Alert.alert('Success', 'Group created successfully.', [
          { text: 'OK', onPress: () => router.replace('/') },
        ]);
      } else {
        Alert.alert('Error', data.message || 'Failed to create group.');
      }
    } catch (error) {
      Alert.alert('Error', 'Could not connect to server.');
    }
    setSubmitting(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Create Group</Text>
      <TextInput
        style={styles.input}
        placeholder="Group Name"
        value={groupName}
        onChangeText={setGroupName}
      />
      <TextInput
        style={styles.input}
        placeholder="Group Location"
        value={groupLocation}
        onChangeText={setGroupLocation}
      />
      <TextInput
        style={styles.input}
        placeholder="Group Type"
        value={groupType}
        onChangeText={setGroupType}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={handleCreateGroup}
        disabled={submitting}
        activeOpacity={0.85}
      >
        <Text style={styles.buttonText}>{submitting ? 'Submitting...' : 'Submit'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E6F4EA',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2F5233',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    borderWidth: 2,
    borderColor: '#2F5233',
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
    backgroundColor: '#FFFDF6',
    marginBottom: 18,
    color: '#2F5233',
  },
  button: {
    width: 180,
    backgroundColor: '#2F5233',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    elevation: 2,
    alignSelf: 'center',
  },
  buttonText: {
    color: '#FFFDF6',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});
