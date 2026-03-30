import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../theme/theme';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'RideConfirmed'>;
};

export default function RideConfirmedScreen({ navigation }: Props) {
  const [shareLocation, setShareLocation] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>

        {/* Confirmation Header */}
        <View style={styles.confirmHeader}>
          <View style={styles.confirmIcon}>
            <Ionicons name="checkmark-circle" size={32} color={theme.colors.black} />
          </View>
          <Text style={styles.confirmTitle}>Ride Confirmed!</Text>
          <Text style={styles.confirmSub}>Arjun is on the way. Be ready at pickup point.</Text>
        </View>

        {/* Rider Card */}
        <View style={styles.riderCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>AV</Text>
          </View>
          <View style={styles.riderDetails}>
            <Text style={styles.riderName}>Arjun Verma</Text>
            <View style={styles.verifiedRow}>
              <Ionicons name="checkmark-circle" size={14} color={theme.colors.primary} />
              <Text style={styles.verifiedText}>ID Verified</Text>
            </View>
          </View>

          {/* Masked Phone */}
          <View style={styles.phoneBox}>
            <Ionicons name="call-outline" size={16} color={theme.colors.black} style={{ marginBottom: 2 }} />
            <Text style={styles.phoneNumber}>98××××××12</Text>
          </View>
        </View>

        {/* Vehicle Card */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>VEHICLE</Text>
          <View style={styles.vehicleRow}>
            <View style={styles.vehicleIconBox}>
              <Ionicons name="bicycle-outline" size={26} color={theme.colors.black} />
            </View>
            <View>
              <Text style={styles.vehicleName}>Honda Activa</Text>
              <View style={styles.vehicleNumBadge}>
                <Text style={styles.vehicleNumText}>MH 12 AB 3456</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Pickup Info */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>PICKUP DETAILS</Text>
          <View style={styles.pickupRow}>
            <View style={styles.pinDot} />
            <View style={styles.pickupTextGroup}>
              <Text style={styles.pickupPlace}>Main Gate, Campus</Text>
              <Text style={styles.pickupTime}>Today · 9:30 AM</Text>
            </View>
          </View>
        </View>

        {/* Share Location Toggle */}
        <View style={styles.toggleCard}>
          <View style={styles.toggleTextGroup}>
            <Text style={styles.toggleTitle}>Share Live Location</Text>
            <Text style={styles.toggleSub}>Lets trusted contacts track this ride</Text>
          </View>
          <Switch
            value={shareLocation}
            onValueChange={setShareLocation}
            trackColor={{ false: theme.colors.surfaceContainerHighest, true: '#2E7D32' }}
            thumbColor={shareLocation ? theme.colors.white : theme.colors.background}
          />
        </View>

        {/* SOS — always visible, cannot be hidden */}
        <TouchableOpacity style={styles.sosButton} activeOpacity={0.75} onPress={() => navigation.navigate('SOSConfirm')}>
          <Ionicons name="warning-outline" size={22} color={theme.colors.white} style={{ marginRight: 8 }} />
          <Text style={styles.sosText}>SOS — Emergency</Text>
        </TouchableOpacity>

        {/* Spacer */}
        <View style={{ flex: 1 }} />

        {/* Cancel / go home */}
        <TouchableOpacity
          style={styles.homeButton}
          onPress={() => navigation.navigate('MainTabs')}
        >
          <Text style={styles.homeButtonText}>Back to Home</Text>
        </TouchableOpacity>

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
    paddingBottom: 40,
  },

  /* Confirm Header */
  confirmHeader: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.card,
    padding: theme.spacing.l,
    alignItems: 'center',
    marginBottom: theme.spacing.m,
  },
  confirmIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(0,0,0,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.m,
  },
  confirmTitle: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 24,
    fontWeight: '800',
    color: theme.colors.black,
    marginBottom: 4,
  },
  confirmSub: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 14,
    color: theme.colors.onSurfaceVariant,
    textAlign: 'center',
  },

  /* Rider */
  riderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.card,
    padding: theme.spacing.m,
    marginBottom: theme.spacing.m,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.m,
  },
  avatarText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.black,
  },
  riderDetails: { flex: 1 },
  riderName: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.body.fontSize,
    fontWeight: '700',
    color: theme.colors.black,
    marginBottom: 4,
  },
  verifiedRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  verifiedText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.onSurfaceVariant,
  },
  phoneBox: { alignItems: 'center' },
  phoneNumber: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.black,
  },

  /* Cards */
  card: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.card,
    padding: theme.spacing.m,
    marginBottom: theme.spacing.m,
  },
  sectionLabel: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: theme.colors.onSurfaceVariant,
    marginBottom: theme.spacing.m,
  },

  /* Vehicle */
  vehicleRow: { flexDirection: 'row', alignItems: 'center' },
  vehicleIconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: theme.colors.surfaceContainerLow,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.m,
  },
  vehicleName: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.body.fontSize,
    fontWeight: '700',
    color: theme.colors.black,
    marginBottom: 6,
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

  /* Pickup */
  pickupRow: { flexDirection: 'row', alignItems: 'center' },
  pinDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.colors.primary,
    marginRight: theme.spacing.m,
  },
  pickupTextGroup: {},
  pickupPlace: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.body.fontSize,
    fontWeight: '700',
    color: theme.colors.black,
    marginBottom: 2,
  },
  pickupTime: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 13,
    color: theme.colors.onSurfaceVariant,
  },

  /* Toggle */
  toggleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.card,
    padding: theme.spacing.m,
    marginBottom: theme.spacing.m,
  },
  toggleTextGroup: {},
  toggleTitle: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.body.fontSize,
    fontWeight: '700',
    color: theme.colors.black,
    marginBottom: 2,
  },
  toggleSub: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 12,
    color: theme.colors.onSurfaceVariant,
  },

  /* SOS */
  sosButton: {
    flexDirection: 'row',
    backgroundColor: theme.colors.error,
    borderRadius: theme.borderRadius.button,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: theme.colors.error,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 6,
    marginBottom: theme.spacing.m,
  },
  sosText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.label.fontSize,
    fontWeight: theme.typography.label.fontWeight as any,
    color: theme.colors.white,
  },

  homeButton: {
    backgroundColor: theme.colors.black,
    borderRadius: theme.borderRadius.button,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },
  homeButtonText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.label.fontSize,
    fontWeight: theme.typography.label.fontWeight as any,
    color: theme.colors.white,
  },
});
