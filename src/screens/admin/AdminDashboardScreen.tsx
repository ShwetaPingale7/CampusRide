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

export default function AdminDashboardScreen() {
  const navigation = useNavigation<NavProp>();

  // Placeholder stats
  const stats = {
    totalUsers: 1420,
    pendingVerifications: 12,
    openComplaints: 3,
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Admin Panel</Text>
        <View style={{ width: 24 }} /> {/* align center spacer */}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.greetSection}>
          <Text style={styles.greetHeadline}>Dashboard</Text>
          <Text style={styles.greetSub}>Overview of platform operations</Text>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsCard}>
           <View style={styles.statItem}>
             <Text style={styles.statValue}>{stats.totalUsers}</Text>
             <Text style={styles.statLabel}>Total Users</Text>
           </View>
           <View style={styles.statDivider} />
           <View style={styles.statItem}>
             <Text style={[styles.statValue, { color: theme.colors.primary }]}>{stats.pendingVerifications}</Text>
             <Text style={styles.statLabel}>Pending KYCs</Text>
           </View>
           <View style={styles.statDivider} />
           <View style={styles.statItem}>
             <Text style={[styles.statValue, { color: theme.colors.error }]}>{stats.openComplaints}</Text>
             <Text style={styles.statLabel}>Complaints</Text>
           </View>
         </View>

        {/* Action Cards */}
        <View style={styles.actionCards}>
          
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('AdminVerifications')}
            activeOpacity={0.88}
          >
            <View style={[styles.cardIconBox, { backgroundColor: theme.colors.surfaceContainerHigh }]}>
              <Ionicons name="id-card-outline" size={28} color={theme.colors.primary} />
            </View>
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>Verifications</Text>
              <Text style={styles.cardSub}>Review Student IDs and Licenses</Text>
            </View>
            <View style={styles.badge}>
                <Text style={styles.badgeText}>{stats.pendingVerifications}</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color={theme.colors.onSurfaceVariant} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('AdminComplaints')}
            activeOpacity={0.88}
          >
            <View style={[styles.cardIconBox, { backgroundColor: theme.colors.surfaceContainerHigh }]}>
              <Ionicons name="warning-outline" size={28} color={theme.colors.error} />
            </View>
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>Complaints</Text>
              <Text style={styles.cardSub}>Handle disputes and reports</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: theme.colors.error }]}>
                <Text style={[styles.badgeText, { color: theme.colors.white }]}>{stats.openComplaints}</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color={theme.colors.onSurfaceVariant} />
          </TouchableOpacity>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme.colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.l,
    paddingTop: theme.spacing.m,
    paddingBottom: theme.spacing.s,
  },
  backButton: {
    padding: theme.spacing.s,
    marginLeft: -theme.spacing.s,
  },
  headerTitle: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.black,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.l,
    paddingTop: theme.spacing.m,
    paddingBottom: 100,
  },
  greetSection: { marginBottom: theme.spacing.xl },
  greetHeadline: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 32,
    fontWeight: '800',
    color: theme.colors.black,
    letterSpacing: -1,
  },
  greetSub: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 16,
    color: theme.colors.onSurfaceVariant,
    marginTop: 4,
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surfaceContainerLow,
    borderRadius: theme.borderRadius.card,
    paddingVertical: theme.spacing.l,
    marginBottom: theme.spacing.xl,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: theme.colors.surfaceContainerHigh,
  },
  statValue: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 24,
    fontWeight: '800',
    color: theme.colors.black,
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 11,
    color: theme.colors.onSurfaceVariant,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  actionCards: {
    gap: theme.spacing.m,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceContainerLowest,
    borderRadius: theme.borderRadius.card,
    padding: theme.spacing.m,
    gap: theme.spacing.m,
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  cardIconBox: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardText: { flex: 1 },
  cardTitle: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 17,
    fontWeight: '700',
    color: theme.colors.black,
    marginBottom: 3,
  },
  cardSub: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 13,
    color: theme.colors.onSurfaceVariant,
  },
  badge: {
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 24,
    alignItems: 'center',
    marginRight: 4,
  },
  badgeText: {
    color: theme.colors.onPrimary,
    fontSize: 12,
    fontWeight: '700',
  }
});
