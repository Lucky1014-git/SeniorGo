import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { API_ENDPOINTS } from '../constants/api';
import { useUser } from '../contexts/usercontext';
import { Colors, CurrentRidesStyles, HeaderStyles, SeniorDashboardStyles, TextStyles, TrackerStyles } from '../styles/globalStyles';

const rideStatuses = [
  { icon: '🚕', label: 'Accepted' },
  { icon: '🧑‍🤝‍🧑', label: 'Started' },
  { icon: '🚗', label: 'Driving' },
  { icon: '🏁', label: 'Ended' }
];


export default function CurrentRides() {
  const { getUserInfo } = useUser();
  const userInfo = getUserInfo();
  const groupName = userInfo?.groupname || 'No Group Assigned';
  const emailaddress = userInfo?.emailaddress;
  const [rides, setRides] = useState<any[]>([]);
  const [currentStatus, setCurrentStatus] = useState<string | null>(null);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [rideStatusBar, setRideStatusBar] = useState<{ [key: string]: string }>({});
  const [cancellingRides, setCancellingRides] = useState<{ [key: string]: boolean }>({});
  const [volunteerModalVisible, setVolunteerModalVisible] = useState(false);
  const [selectedVolunteer, setSelectedVolunteer] = useState<any>(null);

  useEffect(() => {
    const fetchStatus = async () => {
      if (!emailaddress) return;
      try {
        const response = await fetch(API_ENDPOINTS.CURRENT_RIDES, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ emailaddress }),
        });
        const data = await response.json();
        setRides(data.currentRides || []);
        setCurrentStatus(data.status);
        // For each ride, call updateStatusBar and update ride status if needed
        if (data.currentRides && Array.isArray(data.currentRides)) {
          const updatedStatuses: { [key: string]: string } = {};
          await Promise.all(
            data.currentRides.map(async (ride: any) => {
              try {
                const statusRes = await fetch(API_ENDPOINTS.UPDATE_STATUS_BAR, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ rideId: ride.id }),
                });
                const statusData = await statusRes.json();
                console.log('UpdateStatusBar API response for ride', ride.id, ':', statusData);
                if (statusData.status) {
                  updatedStatuses[ride.id] = statusData.status;
                  console.log('Updated status for ride', ride.id, 'to:', statusData.status);
                }
              } catch (error) {
                console.log('Error fetching status for ride', ride.id, ':', error);
              }
            })
          );
          console.log('All updated statuses:', updatedStatuses);
          setRideStatusBar(updatedStatuses);
        }
      } catch (error) {
        setRides([]);
        setCurrentStatus(null);
      }
      setLoading(false);
    };
    fetchStatus();
  }, [emailaddress]);

  const handleSignOut = () => {
    router.replace('/');
  };

  // Cancel ride function
  const handleCancelRide = async (rideId: string) => {
    if (!emailaddress) {
      Alert.alert('Error', 'User not authenticated.');
      return;
    }

    Alert.alert(
      'Cancel Ride',
      'Are you sure you want to cancel this ride?',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            setCancellingRides(prev => ({ ...prev, [rideId]: true }));
            
            try {
              const response = await fetch(API_ENDPOINTS.CANCEL_RIDE, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                  rideId,
                  emailaddress 
                }),
              });

              if (response.status === 200) {
                const data = await response.json();
                Alert.alert('Success', data.message || 'Ride cancelled successfully.', [
                  {
                    text: 'OK',
                    onPress: () => {
                      // Reload all records by calling fetchStatus again
                      const fetchStatus = async () => {
                        if (!emailaddress) return;
                        setLoading(true);
                        try {
                          const response = await fetch(API_ENDPOINTS.CURRENT_RIDES, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ emailaddress }),
                          });
                          const data = await response.json();
                          setRides(data.currentRides || []);
                          setCurrentStatus(data.status);
                          // For each ride, call updateStatusBar and update ride status if needed
                          if (data.currentRides && Array.isArray(data.currentRides)) {
                            const updatedStatuses: { [key: string]: string } = {};
                            await Promise.all(
                              data.currentRides.map(async (ride: any) => {
                                try {
                                  const statusRes = await fetch(API_ENDPOINTS.UPDATE_STATUS_BAR, {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ rideId: ride.id }),
                                  });
                                  const statusData = await statusRes.json();
                                  if (statusData.status) {
                                    updatedStatuses[ride.id] = statusData.status;
                                  }
                                } catch (error) {
                                  console.log('Error fetching status for ride', ride.id, ':', error);
                                }
                              })
                            );
                            setRideStatusBar(updatedStatuses);
                          }
                        } catch (error) {
                          setRides([]);
                          setCurrentStatus(null);
                        }
                        setLoading(false);
                      };
                      fetchStatus();
                    }
                  }
                ]);
              } else {
                const data = await response.json();
                throw new Error(data.message || 'Failed to cancel ride');
              }
            } catch (error) {
              console.error('Error cancelling ride:', error);
              Alert.alert('Error', 'Failed to cancel ride. Please try again.');
            } finally {
              setCancellingRides(prev => ({ ...prev, [rideId]: false }));
            }
          },
        },
      ]
    );
  };

  return (
    <View style={CurrentRidesStyles.currentRidesContainer}>


      <View style={HeaderStyles.headerRow}>
      {/* Back Button on the left */}
      <TouchableOpacity
        style={HeaderStyles.headerButton}
        onPress={() => router.replace('/senior-dashboard')}
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
        <Text style={SeniorDashboardStyles.navBarText}>Current Requested Rides</Text>
        <Text style={SeniorDashboardStyles.groupName}>({groupName})</Text>
      </View>

      <ScrollView 
        style={CurrentRidesStyles.rideList}
        contentContainerStyle={CurrentRidesStyles.rideListContent}
        showsVerticalScrollIndicator={true}
      >
        {loading ? (
          <Text style={{ color: Colors.lightText, alignSelf: 'center', marginTop: 32 }}>Loading...</Text>
        ) : rides.length === 0 ? (
          <Text style={{ color: Colors.lightText, alignSelf: 'center', marginTop: 32 }}>No current rides found.</Text>
        ) : (
          rides
            .filter((ride) => {
              // Filter out rides that have ended status
              const currentRideStatus = rideStatusBar[ride.id] || ride.status || '';
              const status = currentRideStatus.toLowerCase();
              return status !== 'rideended' && status !== 'ended';
            })
            .map((ride, idx) => {
            // Use the status from updateStatusBar API if available, otherwise fall back to ride.status
            const currentRideStatus = rideStatusBar[ride.id] || ride.status || '';
            console.log('Ride', ride.id, 'currentRideStatus:', currentRideStatus, 'rideStatusBar[ride.id]:', rideStatusBar[ride.id], 'ride.status:', ride.status);
            
            // Determine status index based on the actual status returned from API
            const statusIndex = (() => {
              const status = currentRideStatus.toLowerCase();
              console.log('Processing status for ride', ride.id, '- original:', currentRideStatus, 'lowercase:', status);
              if (status === 'accepted') {
                console.log('Matched accepted status for ride', ride.id);
                return 0;
              }
              if (status === 'volunteerstarted') {
                console.log('Matched volunteerstarted status for ride', ride.id);
                return 1;
              }
              if (status === 'ridestarted') {
                console.log('Matched ridestarted status for ride', ride.id);
                return 2;
              }
              if (status === 'rideended') {
                console.log('Matched rideended status for ride', ride.id);
                return 3;
              }
              console.log('No status match for ride', ride.id, '- status:', status);
              return -1; // Unknown status
            })();
            console.log('Final statusIndex for ride', ride.id, ':', statusIndex);

            // Format pickupDateTime if present
            const formatLocalDateTime = (utcString: string) => {
              if (!utcString) return '';
              const date = new Date(utcString);
              const month = (date.getMonth() + 1).toString().padStart(2, '0');
              const day = date.getDate().toString().padStart(2, '0');
              const year = date.getFullYear();
              let hours = date.getHours();
              const minutes = date.getMinutes().toString().padStart(2, '0');
              const ampm = hours >= 12 ? 'PM' : 'AM';
              hours = hours % 12;
              hours = hours ? hours : 12;
              return `${month}/${day}/${year} ${hours}:${minutes} ${ampm}`;
            };

            return (
              <View key={ride.id || idx} style={CurrentRidesStyles.rideCard}>
                {/* Ride Progress Tracker */}
                <View style={TrackerStyles.trackerContainer}>
                  {rideStatuses.map((status, sidx) => {
                    // Color only the specific bar that matches the current status
                    const isActive = sidx === statusIndex;
                    return (
                      <React.Fragment key={status.label}>
                        <View style={[
                          TrackerStyles.trackerDivision,
                          isActive && TrackerStyles.trackerDivisionActive,
                          sidx === 0 && TrackerStyles.trackerDivisionFirst,
                          sidx === rideStatuses.length - 1 && TrackerStyles.trackerDivisionLast
                        ]}>
                          <Text style={[
                            TrackerStyles.trackerLabel,
                            isActive && TrackerStyles.trackerLabelActive
                          ]}>
                            {status.label}
                          </Text>
                        </View>
                      </React.Fragment>
                    );
                  })}
                </View>
                <Text style={TextStyles.label}>Current Location:</Text>
                <Text style={TextStyles.value}>{ride.currentlocation}</Text>
                <Text style={TextStyles.label}>Dropoff Location:</Text>
                <Text style={TextStyles.value}>{ride.dropofflocation}</Text>
                <Text style={TextStyles.label}>Accepted By:</Text>
                {ride.acceptedby ? (
                  <TouchableOpacity
                    onPress={async () => {
                      try {
                        const response = await fetch(API_ENDPOINTS.GET_VOLUNTEER_INFO, {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ emailaddress: ride.acceptedby }),
                        });
                        const data = await response.json();
                        
                        if (data.volunteer) {
                          setSelectedVolunteer(data.volunteer);
                          setVolunteerModalVisible(true);
                        } else {
                          Alert.alert('Error', 'Volunteer information not found.');
                        }
                      } catch (error) {
                        console.error('Error fetching volunteer info:', error);
                        Alert.alert('Error', 'Failed to fetch volunteer information.');
                      }
                    }}
                  >
                    <Text style={[TextStyles.value, { color: Colors.primary, textDecorationLine: 'underline' }]}>
                      {ride.acceptedby}
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <Text style={TextStyles.value}>Not Assigned</Text>
                )}
                <View style={CurrentRidesStyles.pickupSection}>
                  <View style={CurrentRidesStyles.pickupInfo}>
                    <Text style={TextStyles.label}>Pickup Date/Time:</Text>
                    <Text style={TextStyles.value}>
                      {formatLocalDateTime(ride.pickupDateTime)}
                      {ride.day && ` - ${ride.day}`}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={[
                      CurrentRidesStyles.cancelButton,
                      cancellingRides[ride.id] && CurrentRidesStyles.cancelButtonDisabled
                    ]}
                    onPress={() => handleCancelRide(ride.id)}
                    disabled={cancellingRides[ride.id]}
                  >
                    <Text style={CurrentRidesStyles.cancelButtonText}>
                      {cancellingRides[ride.id] ? 'Cancelling...' : 'Cancel Ride'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>

      {/* Volunteer Information Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={volunteerModalVisible}
        onRequestClose={() => {
          setVolunteerModalVisible(false);
          setSelectedVolunteer(null);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalTitle}>Volunteer Information</Text>
              
              {/* Volunteer Image */}
              {selectedVolunteer?.imageURL && (
                <View style={styles.imageContainer}>
                  <Image 
                    source={{ uri: selectedVolunteer.imageURL }} 
                    style={styles.volunteerImage}
                    resizeMode="cover"
                  />
                </View>
              )}
              
              {/* Volunteer Details */}
              <View style={styles.detailsContainer}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Name:</Text>
                  <Text style={styles.detailValue}>{selectedVolunteer?.fullname || 'N/A'}</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Email:</Text>
                  <Text style={styles.detailValue}>{selectedVolunteer?.emailaddress || 'N/A'}</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Phone:</Text>
                  <Text style={styles.detailValue}>{selectedVolunteer?.phone || 'N/A'}</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Address:</Text>
                  <Text style={styles.detailValue}>{selectedVolunteer?.address || 'N/A'}</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Date of Birth:</Text>
                  <Text style={styles.detailValue}>{selectedVolunteer?.dateofbirth || 'N/A'}</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Has Driver License:</Text>
                  <Text style={styles.detailValue}>{selectedVolunteer?.hasdriverlicense === true || selectedVolunteer?.hasdriverlicense === 'true' ? 'Yes' : 'No'}</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>License Number:</Text>
                  <Text style={styles.detailValue}>{selectedVolunteer?.licensenumber || 'N/A'}</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Has Vehicle:</Text>
                  <Text style={styles.detailValue}>{selectedVolunteer?.hasvehicle === true || selectedVolunteer?.hasvehicle === 'true' ? 'Yes' : 'No'}</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Vehicle Type:</Text>
                  <Text style={styles.detailValue}>{selectedVolunteer?.vehicletype || 'N/A'}</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Proof of Insurance:</Text>
                  <Text style={styles.detailValue}>{selectedVolunteer?.proofofinsurance === true || selectedVolunteer?.proofofinsurance === 'true' ? 'Yes' : 'No'}</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>First Aid Trained:</Text>
                  <Text style={styles.detailValue}>{selectedVolunteer?.firstaidtrained === true || selectedVolunteer?.firstaidtrained === 'true' ? 'Yes' : 'No'}</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Mobility Assistance:</Text>
                  <Text style={styles.detailValue}>{selectedVolunteer?.mobilityassistance === true || selectedVolunteer?.mobilityassistance === 'true' ? 'Yes' : 'No'}</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Volunteered Before:</Text>
                  <Text style={styles.detailValue}>{selectedVolunteer?.volunteeredbefore === true || selectedVolunteer?.volunteeredbefore === 'true' ? 'Yes' : 'No'}</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Background Check Consent:</Text>
                  <Text style={styles.detailValue}>{selectedVolunteer?.backgroundcheckconsent === true || selectedVolunteer?.backgroundcheckconsent === 'true' ? 'Yes' : 'No'}</Text>
                </View>
              </View>
              
              {/* Close Button */}
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => {
                  setVolunteerModalVisible(false);
                  setSelectedVolunteer(null);
                }}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// Any remaining page-specific styles that aren't in global styles
const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFDF6',
    borderRadius: 15,
    padding: 20,
    maxHeight: '80%',
    width: '100%',
    maxWidth: 400,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primary,
    textAlign: 'center',
    marginBottom: 20,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  volunteerImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: Colors.primary,
  },
  detailsContainer: {
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
    width: 100,
    marginRight: 10,
  },
  detailValue: {
    fontSize: 16,
    color: Colors.primary,
    flex: 1,
    flexWrap: 'wrap',
  },
  closeButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#FFFDF6',
    fontSize: 16,
    fontWeight: '600',
  },
});


