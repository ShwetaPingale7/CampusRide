import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../theme/theme';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { sendPushNotification, scheduleDayOfRideAlert } from '../../services/pushNotifications';
import { useAuth } from '../../services/AuthContext';
import { supabase } from '../../services/supabase';
import { useState, useEffect } from 'react';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'RideRequests'>;
};

// Removed static array
function StarRow({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2, marginTop: 2 }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Ionicons
          key={i}
          name={i < full ? 'star' : half && i === full ? 'star-half' : 'star-outline'}
          size={12}
          color={theme.colors.primary}
        />
      ))}
      <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
    </View>
  );
}

export default function RideRequestsScreen({ navigation }: Props) {
  const { session } = useAuth();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      if (!session?.user?.id) return;
      setLoading(true);

      const { data: ridesData } = await supabase
        .from('rides')
        .select('id')
        .eq('driver_id', session.user.id)
        .eq('status', 'scheduled');

      if (!ridesData || ridesData.length === 0) {
        setRequests([]);
        setLoading(false);
        return;
      }

      const rideIds = ridesData.map(r => r.id);

      const { data: bookingsData } = await supabase
        .from('bookings')
        .select('*, profiles:passenger_id(id, full_name, avatar_url), rides:ride_id(origin, destination)')
        .in('ride_id', rideIds)
        .eq('status', 'pending');

      if (bookingsData) {
        const mapped = bookingsData.map((b: any) => ({
          id: b.id, // booking id
          ride_id: b.ride_id,
          passenger_id: b.profiles?.id,
          name: b.profiles?.full_name || 'Passenger',
          initials: (b.profiles?.full_name || 'U').substring(0, 2).toUpperCase(),
          rating: 4.8, // MVP placeholder
          pickup: b.rides?.origin || 'Unknown',
          drop: b.rides?.destination || 'Unknown',
        }));
        setRequests(mapped);
      }
      setLoading(false);
    };

    fetchRequests();

    // Listen to real-time additions to bookings
    const channel = supabase
      .channel('booking_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, payload => {
        fetchRequests(); // Refresh on any change
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session]);

  const handleAccept = async (bookingId: string, passengerId: string, rideId: string) => {
    // 1. Accept the ride in Supabase
    await supabase.from('bookings').update({ status: 'confirmed' }).eq('id', bookingId);
    
    // 2. Send the push notification to the Passenger regarding acceptance + contact info!
    if (passengerId) {
      await sendPushNotification(
        passengerId, 
        'Ride Accepted! 🎉', 
        'A driver has accepted your ride request. You can now view their contact details and live track their location!'
      );
    }

    // 3. Send a push notification to the Driver (yourself) about contact info
    if (session?.user?.id) {
       await sendPushNotification(
         session.user.id,
         'Passenger Added 👤',
         'You accepted the ride request. The passenger\'s contact details are now unlocked for this trip!'
       );
    }

    // 4. Schedule a day-of-ride alert (Morning reminder 7:00 AM)
    // Assuming the ride is today or tomorrow (using current date for mock placeholder)
    await scheduleDayOfRideAlert(
       'Today is your carpool! 🚗',
       'Don\'t forget you have a ride scheduled today. Drive safely!',
       new Date().toISOString() 
    );
    navigation.navigate('ActiveRide', { rideId });
  };

  const handleDecline = async (bookingId: string) => {
    await supabase.from('bookings').update({ status: 'rejected' }).eq('id', bookingId);
    setRequests(prev => prev.filter(req => req.id !== bookingId));
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.requestCard}>
      {/* Top row: avatar + name/rating + accept/decline */}
      <View style={styles.cardTop}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{item.initials}</Text>
        </View>
        <View style={styles.passengerInfo}>
          <Text style={styles.passengerName}>{item.name}</Text>
          <StarRow rating={item.rating} />
        </View>
      </View>

      {/* Route */}
      <View style={styles.routeContainer}>
        <View style={styles.routeRow}>
          <View style={styles.pinDot} />
          <Text style={styles.routeText} numberOfLines={1}>{item.pickup}</Text>
        </View>
        <View style={styles.dottedJoin} />
        <View style={styles.routeRow}>
          <View style={styles.pinSquare} />
          <Text style={styles.routeText} numberOfLines={1}>{item.drop}</Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionRow}>
        <TouchableOpacity
          style={styles.declineButton}
          onPress={() => handleDecline(item.id)}
        >
          <Ionicons name="close" size={18} color={theme.colors.error} style={{ marginRight: 6 }} />
          <Text style={styles.declineText}>Decline</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.acceptButton}
          onPress={() => handleAccept(item.id, item.passenger_id, item.ride_id)}
        >
          <Ionicons name="checkmark" size={18} color={theme.colors.onPrimary} style={{ marginRight: 6 }} />
          <Text style={styles.acceptText}>Accept</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={theme.colors.black} />
          </TouchableOpacity>
        </View>

        <View style={styles.titleBlock}>
          <Text style={styles.pageTitle}>Pending{'\n'}Requests.</Text>
          <View style={styles.countBadge}>
            <View style={styles.countDot} />
            <Text style={styles.countText}>{requests.length} waiting</Text>
          </View>
        </View>

        {loading ? (
          <Text style={{ textAlign: 'center', marginTop: 40, color: theme.colors.onSurfaceVariant }}>Loading requests...</Text>
        ) : requests.length === 0 ? (
          <Text style={{ textAlign: 'center', marginTop: 40, color: theme.colors.onSurfaceVariant }}>No pending requests right now.</Text>
        ) : (
          <FlatList
            data={requests}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={{ gap: theme.spacing.m }}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme.colors.surfaceContainerLow },
  container: {
    flex: 1,
    paddingHorizontal: theme.spacing.l,
    paddingTop: theme.spacing.m,
    paddingBottom: 20,
  },

  topBar: {
    marginBottom: theme.spacing.m,
  },
  titleBlock: {
    marginBottom: theme.spacing.xl,
  },
  pageTitle: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 36,
    fontWeight: '800',
    color: theme.colors.black,
    letterSpacing: -1,
    lineHeight: 42,
    marginBottom: theme.spacing.m,
  },
  countBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: theme.colors.primary,
    alignSelf: 'flex-start',
    borderRadius: theme.borderRadius.button,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  countDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.onPrimary,
  },
  countText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.black,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.m,
  },
  headerTitle: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.title.fontSize,
    fontWeight: theme.typography.title.fontWeight as any,
    color: theme.colors.black,
  },
  headerSub: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 13,
    color: theme.colors.onSurfaceVariant,
  },

  /* Card */
  requestCard: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.card,
    padding: theme.spacing.m,
  },

  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.m,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.m,
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
    fontSize: theme.typography.body.fontSize,
    fontWeight: '700',
    color: theme.colors.black,
  },
  ratingText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 12,
    color: theme.colors.onSurfaceVariant,
    marginLeft: 4,
  },

  /* Route inside card */
  routeContainer: {
    backgroundColor: theme.colors.surfaceContainerLow,
    borderRadius: 12,
    padding: theme.spacing.m,
    marginBottom: theme.spacing.m,
  },
  routeRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 2 },
  pinDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: theme.colors.primary, marginRight: 10 },
  pinSquare: { width: 10, height: 10, borderRadius: 2, backgroundColor: theme.colors.black, marginRight: 10 },
  dottedJoin: {
    width: 2,
    height: 16,
    backgroundColor: theme.colors.surfaceContainerHighest,
    marginLeft: 4,
    marginVertical: 2,
  },
  routeText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 14,
    color: theme.colors.black,
    flex: 1,
  },

  /* Action buttons */
  actionRow: {
    flexDirection: 'row',
    gap: theme.spacing.m,
  },
  declineButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.borderRadius.button,
    borderWidth: 1.5,
    borderColor: theme.colors.error,
    paddingVertical: 12,
  },
  declineText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.label.fontSize,
    fontWeight: theme.typography.label.fontWeight as any,
    color: theme.colors.error,
  },
  acceptButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.borderRadius.button,
    backgroundColor: '#2E7D32', // Deep green for accept
    paddingVertical: 12,
  },
  acceptText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.label.fontSize,
    fontWeight: theme.typography.label.fontWeight as any,
    color: theme.colors.white,
  },
});
