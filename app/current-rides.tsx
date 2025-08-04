import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { API_ENDPOINTS } from '../constants/api';
import { useUser } from '../contexts/usercontext';

const rideStatuses = [
  { icon: '🚕', label: 'Accepted' },
  { icon: '🧑‍🤝‍🧑', label: 'Started' },
  { icon: '🚗', label: 'Driving' },
  { icon: '🏁', label: 'Ended' }
];


export default function CurrentRides() {
  const { getUserInfo } = useUser();
  const emailaddress = getUserInfo()?.emailaddress;
  const [rides, setRides] = useState<any[]>([]);
  const [currentStatus, setCurrentStatus] = useState<string | null>(null);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [rideStatusBar, setRideStatusBar] = useState<{ [key: string]: string }>({});

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

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backArrow} onPress={() => router.replace('/senior-dashboard')}>
        <Text style={{ fontSize: 28, color: '#2F5233' }}>{'\u2190'}</Text>
      </TouchableOpacity>
      <Text style={styles.header}>Current Rides</Text>
      <View style={styles.rideList}>
        {loading ? (
          <Text style={{ color: '#888', alignSelf: 'center', marginTop: 32 }}>Loading...</Text>
        ) : rides.length === 0 ? (
          <Text style={{ color: '#888', alignSelf: 'center', marginTop: 32 }}>No current rides found.</Text>
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
              <View key={ride.id || idx} style={styles.rideCard}>
                {/* Ride Progress Tracker */}
                <View style={styles.trackerContainer}>
                  {rideStatuses.map((status, sidx) => {
                    // Color only the specific bar that matches the current status
                    const isActive = sidx === statusIndex;
                    return (
                      <React.Fragment key={status.label}>
                        <View style={[
                          styles.trackerDivision,
                          isActive && styles.trackerDivisionActive,
                          sidx === 0 && styles.trackerDivisionFirst,
                          sidx === rideStatuses.length - 1 && styles.trackerDivisionLast
                        ]}>
                          <Text style={[
                            styles.trackerLabel,
                            isActive && styles.trackerLabelActive
                          ]}>
                            {status.label}
                          </Text>
                        </View>
                      </React.Fragment>
                    );
                  })}
                </View>
                <Text style={styles.label}>Current Location:</Text>
                <Text style={styles.value}>{ride.currentlocation}</Text>
                <Text style={styles.label}>Dropoff Location:</Text>
                <Text style={styles.value}>{ride.dropofflocation}</Text>
                <Text style={styles.label}>Accepted By:</Text>
                <Text style={styles.value}>{ride.acceptedby}</Text>
                <Text style={styles.label}>Pickup Date/Time:</Text>
                <Text style={styles.value}>{formatLocalDateTime(ride.pickupDateTime)}</Text>
              </View>
            );
          })
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4FFF7',
    paddingTop: 40,
    paddingHorizontal: 16,
  },
  statusBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  statusLabelBar: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statusItem: {
    alignItems: 'center',
    width: 36,
    flexDirection: 'column',
    // Remove marginRight here, handled by connector
  },
  statusCircleButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFDF6',
    borderRadius: 18,
    width: 36,
    height: 36,
    borderWidth: 2,
    borderColor: '#2F5233',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 2,
    marginBottom: 2,
    zIndex: 2,
  },
  statusCircleActive: {
    backgroundColor: '#4CAF50', // green fill
    borderColor: '#388E3C',
  },
  statusConnector: {
    height: 4,
    backgroundColor: '#2F5233',
    flex: 1,
    alignSelf: 'center',
    marginHorizontal: -2,
    zIndex: 1,
  },
  statusIcon: {
    fontSize: 16,
    marginBottom: 0,
  },
  statusLabel: {
    fontSize: 9,
    color: '#2F5233',
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 4,
    width: 36,
    alignSelf: 'center',
  },
  backArrow: {
    position: 'absolute',
    top: 44,
    left: 16,
    zIndex: 10,
    padding: 4,
  },
  rideList: {
    marginTop: 24,
  },
  rideCard: {
    backgroundColor: '#FFFDF6',
    borderRadius: 14,
    padding: 18,
    marginBottom: 18,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 4,
  },
  label: {
    fontWeight: '600',
    marginTop: 8,
    color: '#2F5233',
  },
  value: {
    fontSize: 15,
    color: '#2F5233',
    marginBottom: 8,
  },
  trackerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 22,
    marginTop: 8,
    width: '100%',
  },
  trackerDivision: {
    flex: 1,
    height: 16,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 4,
    borderRadius: 8,
    justifyContent: 'flex-end',
    alignItems: 'center',
    position: 'relative',
    minWidth: 0,
    // Ensure equal width for all divisions
    maxWidth: '25%',
  },
  trackerDivisionActive: {
    backgroundColor: '#4CAF50',
  },
  trackerDivisionFirst: {
    marginLeft: 0,
    borderTopLeftRadius: 12, // increased from 8
    borderBottomLeftRadius: 12, // increased from 8
  },
  trackerDivisionLast: {
    marginRight: 0,
    borderTopRightRadius: 12, // increased from 8
    borderBottomRightRadius: 12, // increased from 8
  },
  trackerLabel: {
    position: 'absolute',
    top: 20, // increased from 12
    left: 0,
    right: 0,
    fontSize: 12, // increased from 9
    color: '#2F5233',
    fontWeight: '600',
    textAlign: 'center',
    paddingHorizontal: 2,
  },
  trackerLabelActive: {
    color: '#388E3C',
    fontWeight: 'bold',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2F5233',
    textAlign: 'center',
    marginBottom: 16,
  },
});


