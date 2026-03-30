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

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'RideList'>;
};

const MOCK_RIDES = [
  {
    id: '1',
    riderName: 'Arjun Verma',
    initials: 'AV',
    rating: 4.9,
    vehicle: 'Honda Activa',
    vehicleNo: 'MH 12 AB 3456',
    departureTime: 'Today, 9:30 AM',
    seats: 1,
    fare: 31,
  },
  {
    id: '2',
    riderName: 'Kavya Nair',
    initials: 'KN',
    rating: 4.6,
    vehicle: 'TVS Jupiter',
    vehicleNo: 'KA 05 CD 7890',
    departureTime: 'Today, 9:50 AM',
    seats: 2,
    fare: 25,
  },
  {
    id: '3',
    riderName: 'Dev Sharma',
    initials: 'DS',
    rating: 4.3,
    vehicle: 'Bajaj Pulsar',
    vehicleNo: 'DL 3C EF 1234',
    departureTime: 'Today, 10:15 AM',
    seats: 1,
    fare: 35,
  },
];

function StarRow({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Ionicons
          key={i}
          name={i < full ? 'star' : half && i === full ? 'star-half' : 'star-outline'}
          size={11}
          color={theme.colors.primary}
        />
      ))}
      <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
    </View>
  );
}

export default function RideListScreen({ navigation }: Props) {
  const renderItem = ({ item }: { item: typeof MOCK_RIDES[0] }) => (
    <View style={styles.rideCard}>

      {/* Top: Avatar + rider info + fare */}
      <View style={styles.cardTop}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{item.initials}</Text>
        </View>
        <View style={styles.riderInfo}>
          <Text style={styles.riderName}>{item.riderName}</Text>
          <StarRow rating={item.rating} />
        </View>
        <View style={styles.fareBox}>
          <Text style={styles.fareAmount}>₹{item.fare}</Text>
          <Text style={styles.fareLabel}>per seat</Text>
        </View>
      </View>

      {/* Divider via background shift */}
      <View style={styles.metaDivider} />

      {/* Meta row */}
      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <Ionicons name="bicycle-outline" size={15} color={theme.colors.onSurfaceVariant} />
          <Text style={styles.metaText}>{item.vehicle}</Text>
        </View>
        <View style={styles.metaItem}>
          <Ionicons name="time-outline" size={15} color={theme.colors.onSurfaceVariant} />
          <Text style={styles.metaText}>{item.departureTime}</Text>
        </View>
        <View style={styles.metaItem}>
          <Ionicons name="person-outline" size={15} color={theme.colors.onSurfaceVariant} />
          <Text style={styles.metaText}>{item.seats} seat{item.seats > 1 ? 's' : ''}</Text>
        </View>
      </View>

      {/* Vehicle number */}
      <View style={styles.vehicleNumRow}>
        <View style={styles.vehicleNumBadge}>
          <Text style={styles.vehicleNumText}>{item.vehicleNo}</Text>
        </View>
      </View>

      {/* View details */}
      <TouchableOpacity
        style={styles.detailsButton}
        onPress={() => navigation.navigate('RideDetail')}
      >
        <Text style={styles.detailsButtonText}>View Details</Text>
        <Ionicons name="arrow-forward" size={16} color={theme.colors.onPrimary} />
      </TouchableOpacity>

    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={theme.colors.black} />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Available Rides</Text>
            <Text style={styles.headerSub}>Main Gate → Engineering Block</Text>
          </View>
        </View>

        <FlatList
          data={MOCK_RIDES}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ gap: theme.spacing.m }}
          showsVerticalScrollIndicator={false}
        />
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
    marginTop: 2,
  },

  rideCard: {
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
  riderInfo: { flex: 1 },
  riderName: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.body.fontSize,
    fontWeight: '700',
    color: theme.colors.black,
    marginBottom: 4,
  },
  ratingText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 12,
    color: theme.colors.onSurfaceVariant,
    marginLeft: 4,
  },
  fareBox: { alignItems: 'flex-end' },
  fareAmount: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 20,
    fontWeight: '800',
    color: theme.colors.black,
  },
  fareLabel: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 11,
    color: theme.colors.onSurfaceVariant,
  },

  metaDivider: {
    height: 1,
    backgroundColor: theme.colors.surfaceContainerLow,
    marginBottom: theme.spacing.m,
  },

  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.m,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  metaText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 12,
    color: theme.colors.onSurfaceVariant,
  },

  vehicleNumRow: {
    marginBottom: theme.spacing.m,
  },
  vehicleNumBadge: {
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.surfaceContainerHighest,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  vehicleNumText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.black,
    letterSpacing: 1,
  },

  detailsButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.black,
    borderRadius: theme.borderRadius.button,
    paddingVertical: 13,
    gap: 8,
  },
  detailsButtonText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.label.fontSize,
    fontWeight: theme.typography.label.fontWeight as any,
    color: theme.colors.white,
  },
});
