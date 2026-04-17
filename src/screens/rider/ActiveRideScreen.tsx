import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Switch,
  ScrollView,
  StatusBar,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../theme/theme';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { supabase } from '../../services/supabase';
import { sendPushNotification } from '../../services/pushNotifications';
import * as Location from 'expo-location';
import MapView, { Marker, PROVIDER_GOOGLE } from '../../components/common/MapView';

type Props = NativeStackScreenProps<RootStackParamList, 'ActiveRide'>;

export default function ActiveRideScreen({ navigation, route }: Props) {
  const rideId = route.params?.rideId;
  const [ride, setRide] = useState<any>(null);
  const [passenger, setPassenger] = useState<any>(null);
  const [location, setLocation] = useState<{lat: number, lng: number} | null>({ lat: 20.0110, lng: 73.7903 }); // Nashik default

  useEffect(() => {
    const notifyRideStarted = async () => {
      // In a real app we'd fetch the passenger if not populated yet
      // For MVP placeholder, we simulate if we had it
      const passengerIdToAlert = passenger?.id || ride?.passenger_id;
      if (passengerIdToAlert) {
        await sendPushNotification(
          passengerIdToAlert,
          'Ride Started! 🚙',
          'Your driver has started the ride and is en route. Live location tracking is now active.'
        );
      }
    };
    notifyRideStarted();
  }, []);

  useEffect(() => {
    let locationSubscription: any = null;

    const startTracking = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;

      locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000,
          distanceInterval: 10,
        },
        async (loc) => {
          setLocation({ lat: loc.coords.latitude, lng: loc.coords.longitude });
          if (rideId) {
            // Update Supabase with current lat/lng
            await supabase
              .from('rides')
              .update({ 
                driver_lat: loc.coords.latitude, 
                driver_lng: loc.coords.longitude 
              })
              .eq('id', rideId);
          }
        }
      );
    };

    startTracking();
    return () => locationSubscription?.remove();
  }, []);

  const handleCompleteRide = async () => {
    // 1. Update status to 'completed' in Supabase
    if (rideId) {
      await supabase.from('rides').update({ status: 'completed' }).eq('id', rideId);
    }
    
    // 2. Alert the passenger!
    // Note: ensure 'passenger.id' or 'passenger_id' is set when fetching the active ride details
    const passengerIdToAlert = passenger?.id || ride?.passenger_id; 
    if (passengerIdToAlert) {
      await sendPushNotification(
        passengerIdToAlert,
        'Ride Completed ✅',
        'Your driver has marked the ride as completed. Don\'t forget to pay and leave a rating!'
      );
    }

    Alert.alert('Success', 'Ride completed!', [
      { text: 'OK', onPress: () => navigation.navigate('Payment') }
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.surfaceContainerLow} />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Status badge */}
        <View style={styles.statusBadge}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>Ride in Progress</Text>
        </View>

        {/* Live Map */}
        <View style={styles.mapArea}>
          {location ? (
            <MapView
              style={StyleSheet.absoluteFillObject}
              provider={PROVIDER_GOOGLE}
              region={{
                 latitude: location.lat,
                 longitude: location.lng,
                 latitudeDelta: 0.01,
                 longitudeDelta: 0.01,
              }}
              showsUserLocation={true}
              showsMyLocationButton={false}
            >
              <Marker
                coordinate={{ latitude: location.lat, longitude: location.lng }}
                title="Your Car"
              >
                <View style={{ backgroundColor: theme.colors.primary, padding: 8, borderRadius: 20, borderWidth: 2, borderColor: 'white', elevation: 4 }}>
                  <Ionicons name="car" size={18} color="black" />
                </View>
              </Marker>
            </MapView>
          ) : (
            <View style={styles.mapInner}>
              <Ionicons name="map-outline" size={40} color="rgba(255,255,255,0.3)" />
              <Text style={styles.mapLabel}>Acquiring GPS...</Text>
            </View>
          )}

          {/* Floating ETA card over map */}
          <View style={styles.etaFloat}>
            <View style={styles.etaItem}>
              <Text style={styles.etaValue}>2.1 km</Text>
              <Text style={styles.etaLabel}>Remaining</Text>
            </View>
            <View style={styles.etaDivider} />
            <View style={styles.etaItem}>
              <Text style={styles.etaValue}>~6 min</Text>
              <Text style={styles.etaLabel}>ETA</Text>
            </View>
            <View style={styles.etaDivider} />
            <View style={styles.etaItem}>
              <Text style={styles.etaValue}>₹31</Text>
              <Text style={styles.etaLabel}>Fare</Text>
            </View>
          </View>
        </View>

        {/* Passenger card */}
        <View style={styles.passengerCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>PM</Text>
          </View>
          <View style={styles.passengerInfo}>
            <Text style={styles.passengerName}>Priya Mehta</Text>
            <View style={styles.starRow}>
              {[1,2,3,4].map(i => (
                <Ionicons key={i} name="star" size={13} color={theme.colors.primary} />
              ))}
              <Ionicons name="star-half" size={13} color={theme.colors.primary} />
              <Text style={styles.ratingText}>4.7</Text>
            </View>
            <View style={styles.verifiedRow}>
              <Ionicons name="shield-checkmark" size={12} color={theme.colors.primary} />
              <Text style={styles.verifiedText}>ID Verified · Passenger</Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.msgButton}
            onPress={() => navigation.navigate('Chat', { rideId, otherName: passenger?.full_name || 'Passenger' })}
          >
            <Ionicons name="chatbubble-outline" size={20} color={theme.colors.black} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.callButton}>
            <Ionicons name="call-outline" size={20} color={theme.colors.black} />
          </TouchableOpacity>
        </View>

        {/* Route Card */}
        <View style={styles.routeCard}>
          <Text style={styles.sectionLabel}>CURRENT ROUTE</Text>
          <View style={styles.routeRow}>
            <View style={styles.pinDot} />
            <View style={styles.routeTextGroup}>
              <Text style={styles.routeMeta}>PICKUP</Text>
              <Text style={styles.routeName}>Library Gate, Block B</Text>
            </View>
          </View>
          <View style={styles.routeConnector} />
          <View style={styles.routeRow}>
            <View style={styles.pinSquare} />
            <View style={styles.routeTextGroup}>
              <Text style={styles.routeMeta}>DROP</Text>
              <Text style={styles.routeName}>Engineering Block</Text>
            </View>
          </View>
        </View>



        {/* SOS Button */}
        <TouchableOpacity
          style={styles.sosButton}
          activeOpacity={0.7}
          onPress={() => navigation.navigate('SOSConfirm')}
        >
          <View style={styles.sosDot} />
          <Ionicons name="warning" size={20} color={theme.colors.white} />
          <Text style={styles.sosText}>SOS — Emergency Alert</Text>
        </TouchableOpacity>

        {/* Complete CTA */}
        <TouchableOpacity
          style={styles.completeButton}
          onPress={handleCompleteRide}
          activeOpacity={0.88}
        >
          <Ionicons name="flag" size={20} color={theme.colors.onPrimary} />
          <Text style={styles.completeText}>Complete Ride</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme.colors.surfaceContainerLow },
  scrollContent: {
    paddingHorizontal: theme.spacing.l,
    paddingTop: theme.spacing.m,
    paddingBottom: 40,
  },

  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(46, 125, 50, 0.1)',
    borderRadius: theme.borderRadius.button,
    paddingHorizontal: 14,
    paddingVertical: 8,
    gap: 8,
    marginBottom: theme.spacing.m,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2E7D32',
  },
  statusText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 13,
    fontWeight: '700',
    color: '#2E7D32',
  },

  mapArea: {
    height: 200,
    backgroundColor: theme.colors.black,
    borderRadius: theme.borderRadius.card,
    marginBottom: theme.spacing.m,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapInner: {
    alignItems: 'center',
    gap: 8,
  },
  mapLabel: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 13,
    color: 'rgba(255,255,255,0.3)',
    fontWeight: '600',
  },
  etaFloat: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
    flexDirection: 'row',
    backgroundColor: theme.colors.surfaceContainerLowest,
    borderRadius: 12,
    paddingVertical: 12,
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  etaItem: {
    flex: 1,
    alignItems: 'center',
  },
  etaDivider: {
    width: 1,
    backgroundColor: theme.colors.surfaceContainerHigh,
  },
  etaValue: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 16,
    fontWeight: '800',
    color: theme.colors.black,
    marginBottom: 2,
  },
  etaLabel: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 11,
    color: theme.colors.onSurfaceVariant,
  },

  passengerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceContainerLowest,
    borderRadius: theme.borderRadius.card,
    padding: theme.spacing.m,
    marginBottom: theme.spacing.m,
    gap: theme.spacing.m,
    shadowColor: theme.colors.onSurface,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: theme.colors.surfaceContainerHigh,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 16,
    fontWeight: '800',
    color: theme.colors.black,
  },
  passengerInfo: { flex: 1 },
  passengerName: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.black,
    marginBottom: 3,
  },
  starRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginBottom: 3,
  },
  ratingText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 12,
    color: theme.colors.onSurfaceVariant,
    marginLeft: 4,
  },
  verifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  verifiedText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 12,
    color: theme.colors.onSurfaceVariant,
  },
  callButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.surfaceContainerHigh,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  msgButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.surfaceContainerHigh,
    justifyContent: 'center',
    alignItems: 'center',
  },

  routeCard: {
    backgroundColor: theme.colors.surfaceContainerLowest,
    borderRadius: theme.borderRadius.card,
    padding: theme.spacing.m,
    marginBottom: theme.spacing.m,
    shadowColor: theme.colors.onSurface,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  sectionLabel: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: theme.colors.onSurfaceVariant,
    marginBottom: theme.spacing.m,
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.m,
    paddingVertical: 4,
  },
  pinDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.colors.primary,
  },
  pinSquare: {
    width: 12,
    height: 12,
    borderRadius: 3,
    backgroundColor: theme.colors.black,
  },
  routeConnector: {
    width: 2,
    height: 20,
    backgroundColor: theme.colors.surfaceContainerHigh,
    marginLeft: 5,
    marginVertical: 2,
  },
  routeTextGroup: { flex: 1 },
  routeMeta: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    color: theme.colors.onSurfaceVariant,
    marginBottom: 2,
  },
  routeName: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.black,
  },



  sosButton: {
    flexDirection: 'row',
    backgroundColor: theme.colors.error,
    borderRadius: theme.borderRadius.button,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginBottom: theme.spacing.m,
    shadowColor: theme.colors.error,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 6,
  },
  sosDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
  sosText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.white,
  },

  completeButton: {
    flexDirection: 'row',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.button,
    height: 58,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 4,
  },
  completeText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.black,
  },
});
