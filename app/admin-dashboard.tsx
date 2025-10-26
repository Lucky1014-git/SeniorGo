import { Colors, HeaderStyles, SeniorDashboardStyles } from '@/styles/globalStyles';
import { MaterialIcons } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useUser } from '../contexts/usercontext'; // import useUser

export default function AdminDashboard() {
  const router = useRouter();
  const { getUserInfo } = useUser(); // get userInfo from context
  
  // Extract group name from user info, similar to senior-dashboard.tsx
  const groupName = getUserInfo()?.groupname || 'No Group Assigned';
  const name = getUserInfo()?.name || 'Admin';
  const role = getUserInfo()?.role || 'N/A';


  const handleSignOut = () => {
    router.replace('/');
  };

  return (
    <View style={styles.container}>
      {/* Signout Icon Button */}

      <View style={HeaderStyles.headerRow}>
        {/* Back/Home Button on the left */}
        <View style={{ width: 25 }} />

        {/* Logout Button on the right */}
        <TouchableOpacity
          style={HeaderStyles.headerButton}
          onPress={handleSignOut}
        >
          <MaterialIcons name="logout" size={25} color={Colors.primary} />
        </TouchableOpacity>
      </View>


      {/* Welcome Section */}
      <View style={SeniorDashboardStyles.navBar}>
        <Text style={SeniorDashboardStyles.navBarText}>Welcome, {name}!</Text>
        <View style={SeniorDashboardStyles.groupContainer}>
          <Text style={SeniorDashboardStyles.groupLabel}>Group:</Text>
          <Text style={SeniorDashboardStyles.groupName}>{groupName}</Text>
        </View>
      </View>
      

      <View style={SeniorDashboardStyles.cardsGrid}>
        {role === 'GLOBAL_ADMIN' ? (
          <>
            <TouchableOpacity
              style={SeniorDashboardStyles.card}
              onPress={() => router.push('/create-group')}
            >
              <Text style={SeniorDashboardStyles.cardIcon}><AntDesign name="team" size={40} color={Colors.primary} /></Text>
              <Text style={SeniorDashboardStyles.cardTitle}>Create Group</Text>
              <Text style={SeniorDashboardStyles.cardDesc}>Add a new group</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={SeniorDashboardStyles.card}
              onPress={() => router.push('/create-admin-group')}
            >
              <Text style={SeniorDashboardStyles.cardIcon}><AntDesign name="profile" size={40} color={Colors.primary} /></Text>
              <Text style={SeniorDashboardStyles.cardTitle}>Group Admin User</Text>
              <Text style={SeniorDashboardStyles.cardDesc}>Create new group admin user</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={SeniorDashboardStyles.card}
              onPress={() => router.push('/manage-groups')}
            >
              <Text style={SeniorDashboardStyles.cardIcon}><AntDesign name="setting" size={40} color={Colors.primary} /></Text>
              <Text style={SeniorDashboardStyles.cardTitle}>Manage Groups</Text>
              <Text style={SeniorDashboardStyles.cardDesc}>View and manage all groups</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={SeniorDashboardStyles.card}
              onPress={() => router.push('/manage-admin-users')}
            >
              <Text style={SeniorDashboardStyles.cardIcon}><AntDesign name="contacts" size={40} color={Colors.primary} /></Text>
              <Text style={SeniorDashboardStyles.cardTitle}>Manage Group Admin User</Text>
              <Text style={SeniorDashboardStyles.cardDesc}>View and manage admin users</Text>
            </TouchableOpacity>
          </>
        ) : role === 'GROUP_ADMIN' ? (
          <>
            <TouchableOpacity
              style={SeniorDashboardStyles.card}
              onPress={() => router.push('/track-seniors')}
            >
              <Text style={SeniorDashboardStyles.cardIcon}><AntDesign name="user" size={40} color={Colors.primary} /></Text>
              <Text style={SeniorDashboardStyles.cardTitle}>Manage Seniors</Text>
              <Text style={SeniorDashboardStyles.cardDesc}>Monitor/Manage seniors</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={SeniorDashboardStyles.card}
              onPress={() => router.push('/track-volunteers')}
            >
              <Text style={SeniorDashboardStyles.cardIcon}><AntDesign name="team" size={40} color={Colors.primary} /></Text>
              <Text style={SeniorDashboardStyles.cardTitle}>Manage Volunteers</Text>
              <Text style={SeniorDashboardStyles.cardDesc}>Monitor/Manage volunteer</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={SeniorDashboardStyles.card}
              onPress={() => router.push('/track-rides')}
            >
              <Text style={SeniorDashboardStyles.cardIcon}><AntDesign name="car" size={40} color={Colors.primary} /></Text>
              <Text style={SeniorDashboardStyles.cardTitle}>Manage Rides</Text>
              <Text style={SeniorDashboardStyles.cardDesc}>Monitor/Manage ride requests</Text>
            </TouchableOpacity>
          </>
        ) : (
          <Text style={SeniorDashboardStyles.navBarText}>Invalid admin role</Text>
        )}
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
  navBar: {
    marginBottom: 30,
    alignItems: 'center',
  },
  navBarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2F5233',
  },
  groupName: {
    fontSize: 18,
    color: '#4F8A8B',
    fontWeight: '600',
    marginTop: 2,
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
