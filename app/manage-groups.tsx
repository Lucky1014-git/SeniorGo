import { ButtonStyles, Colors, ContainerStyles, HeaderStyles, SeniorDashboardStyles } from '@/styles/globalStyles';
import { MaterialIcons } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { API_ENDPOINTS } from '../constants/api';

interface Group {
  groupid: string;
  groupcode: string;
  emailaddress: string;
  phonenumber: string;
  groupname: string;
  location: string;
  grouptype: string;
}

export default function ManageGroups() {
  const router = useRouter();
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);

  const handleSignOut = () => {
    router.replace('/');
  };

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_ENDPOINTS.GET_ALL_GROUPS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });
      if (response.ok) {
        const data = await response.json();
        setGroups(data.groups); // Extract groups array from response
      } else {
        Alert.alert('Error', 'Failed to fetch groups');
      }
    } catch (error) {
      Alert.alert('Error', 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleDeactivateGroup = async (groupId: string, groupName: string) => {
    Alert.alert(
      'Deactivate Group',
      `Are you sure you want to deactivate "${groupName}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Deactivate',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await fetch(API_ENDPOINTS.DEACTIVATE_GROUP, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ groupid: groupId }),
              });
              
              if (response.ok) {
                Alert.alert('Success', 'Group deactivated successfully');
                fetchGroups(); // Refresh the list
              } else {
                Alert.alert('Error', 'Failed to deactivate group');
              }
            } catch (error) {
              Alert.alert('Error', 'Network error. Please try again.');
            }
          },
        },
      ]
    );
  };

  const renderGroup = ({ item }: { item: Group }) => (
    <View style={styles.groupCard}>
      <View style={styles.groupHeader}>
        <Text style={styles.groupName}>{item.groupname}</Text>
        <Text style={styles.groupCode}>Code: {item.groupcode}</Text>
      </View>
      
      <View style={styles.groupDetails}>
        <Text style={styles.detailText}>Type: {item.grouptype}</Text>
        <Text style={styles.detailText}>Location: {item.location}</Text>
        <Text style={styles.detailText}>Email: {item.emailaddress}</Text>
        <Text style={styles.detailText}>Phone: {item.phonenumber}</Text>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => Alert.alert('Edit', `Edit group: ${item.groupname}`)}
        >
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.deactivateButton}
          onPress={() => handleDeactivateGroup(item.groupid, item.groupname)}
        >
          <Text style={styles.buttonText}>Deactivate</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={ContainerStyles.screenContainer}>
      {/* Header */}
      <View style={HeaderStyles.headerRow}>
        {/* Back Button on the left */}
        <TouchableOpacity
          style={HeaderStyles.headerButton}
          onPress={() => router.replace('/admin-dashboard')}
        >
          <AntDesign name="home" size={25} color={Colors.primary} />
        </TouchableOpacity>

        {/* Logout Button on the right */}
        <TouchableOpacity
          style={HeaderStyles.headerButton}
          onPress={handleSignOut}
        >
          <MaterialIcons name="logout" size={25} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={SeniorDashboardStyles.navBar}>
        <Text style={SeniorDashboardStyles.navBarText}>Manage Groups</Text>
      </View>

      {/* Groups List */}
      {loading ? (
        <View style={styles.centerContainer}>
          <Text style={styles.loadingText}>Loading groups...</Text>
        </View>
      ) : groups.length > 0 ? (
        <FlatList
          data={groups}
          keyExtractor={(item) => item.groupid}
          renderItem={renderGroup}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>No groups found</Text>
          <TouchableOpacity
            style={ButtonStyles.primaryButton}
            onPress={() => router.push('/create-group')}
          >
            <Text style={ButtonStyles.primaryButtonText}>Create First Group</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  groupCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 14,
    padding: 18,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  groupHeader: {
    marginBottom: 12,
  },
  groupName: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 4,
  },
  groupCode: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.secondary,
  },
  groupDetails: {
    marginBottom: 15,
  },
  detailText: {
    fontSize: 14,
    color: Colors.text,
    marginBottom: 2,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  editButton: {
    flex: 1,
    backgroundColor: Colors.secondary,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#DC3545',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  deactivateButton: {
    flex: 1,
    backgroundColor: '#FF8C00',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: 15,
  },
  loadingText: {
    fontSize: 16,
    color: Colors.lightText,
  },
  emptyText: {
    fontSize: 18,
    color: Colors.lightText,
    textAlign: 'center',
    marginBottom: 20,
  },
});