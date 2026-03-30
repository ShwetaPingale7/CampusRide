import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../theme/theme';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';

type NavProp = NativeStackNavigationProp<RootStackParamList>;

const MENU_ITEMS = [
  { label: 'Edit Profile', icon: 'person-outline', nav: 'EditProfile', group: 'ACCOUNT' },
  { label: 'Verification Status', icon: 'shield-checkmark-outline', nav: 'EditProfile', badge: 'Verified ✓', group: 'ACCOUNT' },
  { label: 'My Rides', icon: 'document-text-outline', nav: 'MyRidesTab', group: 'ACTIVITY' },
  { label: 'Notifications', icon: 'notifications-outline', nav: 'Notifications', group: 'ACTIVITY' },
  { label: 'Report a User', icon: 'flag-outline', nav: 'Report', group: 'SAFETY' },
  { label: 'SOS & Emergency', icon: 'warning-outline', nav: 'SOSConfirm', group: 'SAFETY', danger: true },
];

export default function ProfileScreen() {
  const navigation = useNavigation<NavProp>();

  const groups = ['ACCOUNT', 'ACTIVITY', 'SAFETY'];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <Text style={styles.pageTitle}>Profile</Text>

        {/* Hero Profile Card */}
        <View style={styles.heroCard}>
          {/* Avatar */}
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>A</Text>
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark" size={10} color={theme.colors.black} />
            </View>
          </View>
          <Text style={styles.profileName}>Anjali Sharma</Text>
          <Text style={styles.profileCollege}>Pune Institute of Technology · Year 3</Text>

          {/* Stats row */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>4.8</Text>
              <View style={styles.starsRow}>
                {[1,2,3,4].map(s => (
                  <Ionicons key={s} name="star" size={10} color={theme.colors.primary} />
                ))}
                <Ionicons name="star-half" size={10} color={theme.colors.primary} />
              </View>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>42</Text>
              <Text style={styles.statLabel}>Total Rides</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>₹684</Text>
              <Text style={styles.statLabel}>Saved</Text>
            </View>
          </View>
        </View>

        {/* My Vehicle — from Stitch design */}
        <View style={styles.vehicleCard}>
          <View style={styles.vehicleHeader}>
            <Text style={styles.cardSectionLabel}>MY VEHICLE</Text>
            <TouchableOpacity>
              <Text style={styles.editLink}>Edit</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.vehicleRow}>
            <View style={styles.vehicleIcon}>
              <Ionicons name="bicycle-outline" size={28} color={theme.colors.black} />
            </View>
            <View style={styles.vehicleInfo}>
              <Text style={styles.vehicleName}>TVS Apache RTR</Text>
              <Text style={styles.vehicleSub}>Sport Performance Edition</Text>
              <View style={styles.vehiclePlate}>
                <Text style={styles.vehiclePlateText}>MH 12 AB 3456</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Edit Profile Button */}
        <TouchableOpacity
          style={styles.editProfileButton}
          onPress={() => navigation.navigate('EditProfile')}
          activeOpacity={0.85}
        >
          <Ionicons name="create-outline" size={18} color={theme.colors.white} />
          <Text style={styles.editProfileText}>Edit Profile</Text>
        </TouchableOpacity>

        {/* Menu Groups */}
        {groups.map((group) => {
          const items = MENU_ITEMS.filter((i) => i.group === group);
          return (
            <View key={group} style={styles.menuGroup}>
              <Text style={styles.groupLabel}>{group}</Text>
              <View style={styles.menuCard}>
                {items.map((item, idx) => (
                  <TouchableOpacity
                    key={item.label}
                    style={[styles.menuItem, idx === items.length - 1 && styles.menuItemLast]}
                    onPress={() => navigation.navigate(item.nav as any)}
                    activeOpacity={0.8}
                  >
                    <View style={[styles.menuIconBox, item.danger && styles.menuIconBoxDanger]}>
                      <Ionicons
                        name={item.icon as any}
                        size={20}
                        color={item.danger ? theme.colors.error : theme.colors.onSurfaceVariant}
                      />
                    </View>
                    <Text style={[styles.menuText, item.danger && styles.menuTextDanger]}>
                      {item.label}
                    </Text>
                    {item.badge ? (
                      <View style={styles.verifiedChip}>
                        <Text style={styles.verifiedChipText}>{item.badge}</Text>
                      </View>
                    ) : (
                      <Ionicons
                        name="chevron-forward"
                        size={18}
                        color={item.danger ? theme.colors.error : theme.colors.onSurfaceVariant}
                      />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          );
        })}

        {/* Safety Note */}
        <View style={styles.safetyNote}>
          <Ionicons name="shield-checkmark" size={16} color={theme.colors.primary} />
          <Text style={styles.safetyText}>
            Verified Identity — This rider has completed a background check and verified their University ID and driver's license.
          </Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.l,
    paddingTop: theme.spacing.m,
    paddingBottom: 100,
  },

  pageTitle: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 32,
    fontWeight: '800',
    color: theme.colors.black,
    letterSpacing: -1,
    marginBottom: theme.spacing.xl,
  },

  heroCard: {
    backgroundColor: theme.colors.surfaceContainerLow,
    borderRadius: theme.borderRadius.card,
    padding: theme.spacing.l,
    alignItems: 'center',
    marginBottom: theme.spacing.m,
  },
  avatarContainer: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.m,
    position: 'relative',
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 6,
  },
  avatarText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 36,
    fontWeight: '800',
    color: theme.colors.black,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.colors.surfaceContainerLow,
  },
  profileName: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 22,
    fontWeight: '800',
    color: theme.colors.black,
    marginBottom: 4,
  },
  profileCollege: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 14,
    color: theme.colors.onSurfaceVariant,
    marginBottom: theme.spacing.l,
    textAlign: 'center',
  },

  statsRow: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: theme.colors.surfaceContainerLowest,
    borderRadius: 12,
    paddingVertical: theme.spacing.m,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
  },
  statDivider: {
    width: 1,
    backgroundColor: theme.colors.surfaceContainerHigh,
  },
  statValue: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.black,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 1,
  },
  statLabel: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 11,
    color: theme.colors.onSurfaceVariant,
    fontWeight: '600',
  },

  vehicleCard: {
    backgroundColor: theme.colors.surfaceContainerLow,
    borderRadius: theme.borderRadius.card,
    padding: theme.spacing.m,
    marginBottom: theme.spacing.m,
  },
  vehicleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.m,
  },
  cardSectionLabel: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: theme.colors.onSurfaceVariant,
  },
  editLink: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  vehicleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.m,
  },
  vehicleIcon: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  vehicleInfo: { flex: 1 },
  vehicleName: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.black,
    marginBottom: 2,
  },
  vehicleSub: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 13,
    color: theme.colors.onSurfaceVariant,
    marginBottom: 6,
  },
  vehiclePlate: {
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.surfaceContainerHigh,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  vehiclePlateText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.black,
    letterSpacing: 1,
  },

  editProfileButton: {
    flexDirection: 'row',
    backgroundColor: theme.colors.black,
    borderRadius: theme.borderRadius.button,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginBottom: theme.spacing.xl,
  },
  editProfileText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.white,
  },

  menuGroup: {
    marginBottom: theme.spacing.m,
  },
  groupLabel: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: theme.colors.onSurfaceVariant,
    marginBottom: theme.spacing.s,
    paddingHorizontal: 4,
  },
  menuCard: {
    backgroundColor: theme.colors.surfaceContainerLow,
    borderRadius: theme.borderRadius.card,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.m,
    gap: theme.spacing.m,
    // Dividers removed as per Anti-Divider Policy
  },
  menuItemLast: {},
  menuIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: theme.colors.surfaceContainerHigh,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuIconBoxDanger: { backgroundColor: 'rgba(186, 26, 26, 0.1)' },
  menuText: {
    flex: 1,
    fontFamily: theme.typography.fontFamily,
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.black,
  },
  menuTextDanger: { color: theme.colors.error },
  verifiedChip: {
    backgroundColor: theme.colors.primary,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  verifiedChipText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.black,
  },

  safetyNote: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 214, 0, 0.12)',
    borderRadius: theme.borderRadius.card,
    padding: theme.spacing.m,
    gap: theme.spacing.s,
    marginTop: theme.spacing.s,
    alignItems: 'flex-start',
  },
  safetyText: {
    flex: 1,
    fontFamily: theme.typography.fontFamily,
    fontSize: 13,
    color: theme.colors.onSurfaceVariant,
    lineHeight: 19,
  },
});
