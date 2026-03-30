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
  navigation: NativeStackNavigationProp<RootStackParamList, 'RideRequests'>;
};

const MOCK_REQUESTS = [
  {
    id: '1',
    name: 'Priya Mehta',
    initials: 'PM',
    rating: 4.7,
    pickup: 'Library Gate, Block B',
    drop: 'Engineering Block',
  },
  {
    id: '2',
    name: 'Rahul Singh',
    initials: 'RS',
    rating: 4.2,
    pickup: 'Hostel 3, Campus South',
    drop: 'Admin Block',
  },
  {
    id: '3',
    name: 'Sneha Joshi',
    initials: 'SJ',
    rating: 5.0,
    pickup: 'Main Gate',
    drop: 'Science Building',
  },
];

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
  const handleAccept = (_id: string) => {
    navigation.navigate('ActiveRide');
  };

  const renderItem = ({ item }: { item: typeof MOCK_REQUESTS[0] }) => (
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
          onPress={() => {}}
        >
          <Ionicons name="close" size={18} color={theme.colors.error} style={{ marginRight: 6 }} />
          <Text style={styles.declineText}>Decline</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.acceptButton}
          onPress={() => handleAccept(item.id)}
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
            <Text style={styles.countText}>{MOCK_REQUESTS.length} waiting</Text>
          </View>
        </View>

        <FlatList
          data={MOCK_REQUESTS}
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
