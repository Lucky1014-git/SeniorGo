import { ButtonStyles, Colors, ContainerStyles, HeaderStyles, SeniorDashboardStyles } from '@/styles/globalStyles';
import { MaterialIcons } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { API_ENDPOINTS } from '../constants/api';

interface AdminUser {
  userid: string;
  createddate: string;
  email: string;
  groupcode: string;
  groupname: string;
  name: string;
  password: string;
  phone: string;
  role: string;
}

export default function ManageAdminUsers() {
  const router = useRouter();
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  const handleSignOut = () => {
    router.replace('/');
  };

  const fetchAdminUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_ENDPOINTS.GET_ALL_ADMIN_USERS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });
      if (response.ok) {
        const data = await response.json();
        setAdminUsers(data.groupAdminUsers || []); // Extract groupAdminUsers array from response
      } else {
        Alert.alert('Error', 'Failed to fetch admin users');
      }
    } catch (error) {
      Alert.alert('Error', 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminUsers();
  }, []);

  const handleDeactivateAdmin = async (userId: string, userName: string) => {
    Alert.alert(
      'Deactivate Admin User',
      `Are you sure you want to deactivate "${userName}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Deactivate',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await fetch(API_ENDPOINTS.DEACTIVATE_ADMIN_USER, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userid: userId }),
              });
              
              if (response.ok) {
                Alert.alert('Success', 'Admin user deactivated successfully');
                fetchAdminUsers(); // Refresh the list
              } else {
                Alert.alert('Error', 'Failed to deactivate admin user');
              }
            } catch (error) {
              Alert.alert('Error', 'Network error. Please try again.');
            }
          },
        },
      ]
    );
  };

  const renderAdminUser = ({ item }: { item: AdminUser }) => (
    <View style={styles.adminCard}>
      <View style={styles.adminHeader}>
        <Text style={styles.adminName}>{item.name}</Text>
        <Text style={styles.adminUserId}>ID: {item.userid}</Text>
      </View>
      
      <View style={styles.adminDetails}>
        <Text style={styles.detailText}>Email: {item.email}</Text>
        <Text style={styles.detailText}>Phone: {item.phone}</Text>
        <Text style={styles.detailText}>Group Code: {item.groupcode}</Text>
        <Text style={styles.detailText}>Group Name: {item.groupname}</Text>
        <Text style={styles.detailText}>Role: {item.role}</Text>
        <Text style={styles.detailText}>Created: {new Date(item.createddate).toLocaleDateString()}</Text>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => Alert.alert('Edit', `Edit admin user: ${item.name}`)}
        >
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.deactivateButton}
          onPress={() => handleDeactivateAdmin(item.userid, item.name)}
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
        <Text style={SeniorDashboardStyles.navBarText}>Manage Group Admin Users</Text>
      </View>

      {/* Admin Users List */}
      {loading ? (
        <View style={styles.centerContainer}>
          <Text style={styles.loadingText}>Loading admin users...</Text>
        </View>
      ) : adminUsers.length > 0 ? (
        <FlatList
          data={adminUsers}
          keyExtractor={(item) => item.userid}
          renderItem={renderAdminUser}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>No admin users found</Text>
          <TouchableOpacity
            style={ButtonStyles.primaryButton}
            onPress={() => router.push('/create-admin-group')}
          >
            <Text style={ButtonStyles.primaryButtonText}>Create First Admin User</Text>
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
  adminCard: {
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
  adminHeader: {
    marginBottom: 12,
  },
  adminName: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 4,
  },
  adminUserId: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.secondary,
  },
  adminDetails: {
    marginBottom: 15,
  },
  detailText: {
    fontSize: 14,
    color: Colors.text,
    marginBottom: 2,
  },
  statusText: {
    fontWeight: '600',
    color: Colors.secondary,
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