import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../theme/theme';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { sendPushNotification } from '../../services/pushNotifications';
import { useAuth } from '../../services/AuthContext';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Payment'>;
};

type PaymentMethod = 'upi' | 'cash';

export default function PaymentScreen({ navigation }: Props) {
  const [selected, setSelected] = useState<PaymentMethod>('upi');
  const { session } = useAuth();

  const handleConfirmPayment = async () => {
    // Simulating sending to the passenger, but routing to current device for testability
    if (session?.user?.id) {
      await sendPushNotification(
        session.user.id,
        'Payment Successful! ✅',
        'The ₹31 payment has been officially recorded. Please take a moment to rate your ride.'
      );
    }
    navigation.navigate('Rating');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Payment</Text>
          <Text style={styles.headerSub}>Ride completed successfully</Text>
        </View>

        {/* Fare Hero */}
        <View style={styles.fareHero}>
          <Text style={styles.fareLabel}>TOTAL FARE</Text>
          <Text style={styles.fareAmount}>₹31.00</Text>
          <View style={styles.fareBadge}>
            <Ionicons name="checkmark-circle" size={14} color={theme.colors.black} />
            <Text style={styles.fareBadgeText}>Fare confirmed by both parties</Text>
          </View>
        </View>

        {/* Ride Summary Card */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>RIDE SUMMARY</Text>

          {/* Route */}
          <View style={styles.routeRow}>
            <View style={styles.pinDot} />
            <View style={styles.routeTextGroup}>
              <Text style={styles.routeMeta}>FROM</Text>
              <Text style={styles.routeName}>Main Gate, Campus</Text>
            </View>
          </View>
          <View style={styles.routeConnector} />
          <View style={styles.routeRow}>
            <View style={styles.pinSquare} />
            <View style={styles.routeTextGroup}>
              <Text style={styles.routeMeta}>TO</Text>
              <Text style={styles.routeName}>Engineering Block</Text>
            </View>
          </View>

          {/* Stats row */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Ionicons name="navigate-outline" size={16} color={theme.colors.onSurfaceVariant} />
              <Text style={styles.statValue}>3.2 km</Text>
            </View>
            <View style={styles.statDot} />
            <View style={styles.statItem}>
              <Ionicons name="time-outline" size={16} color={theme.colors.onSurfaceVariant} />
              <Text style={styles.statValue}>14 min</Text>
            </View>
            <View style={styles.statDot} />
            <View style={styles.statItem}>
              <Ionicons name="person-outline" size={16} color={theme.colors.onSurfaceVariant} />
              <Text style={styles.statValue}>1 seat</Text>
            </View>
          </View>
        </View>

        {/* Payment Method Cards */}
        <Text style={styles.sectionLabel}>PAYMENT METHOD</Text>

        <TouchableOpacity
          style={[styles.paymentCard, selected === 'upi' && styles.paymentCardSelected]}
          onPress={() => setSelected('upi')}
          activeOpacity={0.8}
        >
          <View style={[styles.paymentIconBox, selected === 'upi' && styles.paymentIconBoxSelected]}>
            <Ionicons
              name="phone-portrait-outline"
              size={24}
              color={selected === 'upi' ? theme.colors.black : theme.colors.onSurfaceVariant}
            />
          </View>
          <View style={styles.paymentTextGroup}>
            <Text style={[styles.paymentTitle, selected === 'upi' && styles.paymentTitleSelected]}>
              Pay via UPI
            </Text>
            <Text style={styles.paymentSub}>GPay, PhonePe, Paytm, etc.</Text>
          </View>
          <View style={[styles.radioOuter, selected === 'upi' && styles.radioOuterSelected]}>
            {selected === 'upi' && <View style={styles.radioInner} />}
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.paymentCard, selected === 'cash' && styles.paymentCardSelected]}
          onPress={() => setSelected('cash')}
          activeOpacity={0.8}
        >
          <View style={[styles.paymentIconBox, selected === 'cash' && styles.paymentIconBoxSelected]}>
            <Ionicons
              name="cash-outline"
              size={24}
              color={selected === 'cash' ? theme.colors.black : theme.colors.onSurfaceVariant}
            />
          </View>
          <View style={styles.paymentTextGroup}>
            <Text style={[styles.paymentTitle, selected === 'cash' && styles.paymentTitleSelected]}>
              Mark as Cash Paid
            </Text>
            <Text style={styles.paymentSub}>Paid directly to the rider</Text>
          </View>
          <View style={[styles.radioOuter, selected === 'cash' && styles.radioOuterSelected]}>
            {selected === 'cash' && <View style={styles.radioInner} />}
          </View>
        </TouchableOpacity>

        {/* Confirm CTA */}
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={handleConfirmPayment}
        >
          <Ionicons
            name="checkmark-done-outline"
            size={20}
            color={theme.colors.onPrimary}
            style={{ marginRight: 8 }}
          />
          <Text style={styles.confirmButtonText}>Confirm Payment</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme.colors.surfaceContainerLow },
  scrollContent: {
    paddingHorizontal: theme.spacing.l,
    paddingTop: theme.spacing.xl,
    paddingBottom: 48,
  },

  /* Header */
  header: { marginBottom: theme.spacing.xl },
  headerTitle: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 32,
    fontWeight: '800',
    color: theme.colors.black,
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  headerSub: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.onSurfaceVariant,
  },

  /* Fare Hero — primary yellow block, Kinetic Contrast signature moment */
  fareHero: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.card,
    padding: theme.spacing.l,
    alignItems: 'center',
    marginBottom: theme.spacing.m,
  },
  fareLabel: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: theme.colors.onSurfaceVariant,
    marginBottom: 8,
  },
  fareAmount: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 52,
    fontWeight: '800',
    color: theme.colors.black,
    letterSpacing: -1,
    marginBottom: 12,
  },
  fareBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.08)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    gap: 6,
  },
  fareBadgeText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.black,
  },

  /* Card */
  card: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.card,
    padding: theme.spacing.m,
    marginBottom: theme.spacing.l,
  },
  sectionLabel: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: theme.colors.onSurfaceVariant,
    marginBottom: theme.spacing.m,
  },

  /* Route */
  routeRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 4 },
  pinDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.colors.primary,
    marginRight: theme.spacing.m,
  },
  pinSquare: {
    width: 12,
    height: 12,
    borderRadius: 3,
    backgroundColor: theme.colors.black,
    marginRight: theme.spacing.m,
  },
  routeConnector: {
    width: 2,
    height: 20,
    backgroundColor: theme.colors.surfaceContainerHighest,
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
    fontSize: theme.typography.body.fontSize,
    fontWeight: '700',
    color: theme.colors.black,
  },

  /* Stats */
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceContainerLow,
    borderRadius: 12,
    padding: theme.spacing.m,
    marginTop: theme.spacing.m,
  },
  statItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  statDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.surfaceContainerHighest,
  },
  statValue: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.black,
  },

  /* Payment option cards */
  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.card,
    padding: theme.spacing.m,
    marginBottom: theme.spacing.m,
  },
  paymentCardSelected: {
    backgroundColor: theme.colors.primary,
  },
  paymentIconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: theme.colors.surfaceContainerHighest,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.m,
  },
  paymentIconBoxSelected: {
    backgroundColor: 'rgba(0,0,0,0.10)',
  },
  paymentTextGroup: { flex: 1 },
  paymentTitle: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.body.fontSize,
    fontWeight: '700',
    color: theme.colors.onSurfaceVariant,
    marginBottom: 2,
  },
  paymentTitleSelected: {
    color: theme.colors.black,
  },
  paymentSub: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 12,
    color: theme.colors.onSurfaceVariant,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: theme.colors.surfaceContainerHighest,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioOuterSelected: {
    borderColor: theme.colors.black,
  },
  radioInner: {
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: theme.colors.black,
  },

  /* Confirm */
  confirmButton: {
    flexDirection: 'row',
    backgroundColor: theme.colors.black,
    borderRadius: theme.borderRadius.button,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing.s,
    shadowColor: theme.colors.onSurface,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.10,
    shadowRadius: 24,
    elevation: 4,
  },
  confirmButtonText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.label.fontSize,
    fontWeight: theme.typography.label.fontWeight as any,
    color: theme.colors.white,
  },
});
