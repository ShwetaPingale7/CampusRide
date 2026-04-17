import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../theme/theme';
import { useNavigation } from '@react-navigation/native';

export default function AdminComplaintsScreen() {
  const navigation = useNavigation();

  // Mock data
  const [complaints, setComplaints] = useState([
    {
      id: 'c1',
      reporterName: 'Anjali Gupta',
      reportedName: 'Vikram Singh',
      rideId: 'RIDE-891',
      date: 'Today, 2:30 PM',
      reason: 'Reckless driving during ride.',
      status: 'open'
    },
     {
      id: 'c2',
      reporterName: 'Rohit Kumar',
      reportedName: 'Neha Patel',
      rideId: 'RIDE-842',
      date: 'Yesterday, 9:15 AM',
      reason: 'Passenger did not show up.',
      status: 'open'
    }
  ]);

  const handleResolve = (id: string) => {
    setComplaints(prev => prev.filter(c => c.id !== id));
  };

  const renderComplaint = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.tag}>
            <Text style={styles.tagText}>Reported: {item.reportedName}</Text>
        </View>
        <Text style={styles.date}>{item.date}</Text>
      </View>

      <Text style={styles.rideId}>Related to: {item.rideId}</Text>
      <Text style={styles.reasonLabel}>Complaint:</Text>
      <Text style={styles.reasonText}>"{item.reason}"</Text>

      <View style={styles.reporterInfo}>
          <Ionicons name="person-circle-outline" size={16} color={theme.colors.onSurfaceVariant} />
          <Text style={styles.reporterText}>Submitted by {item.reporterName}</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.warnBtn}>
          <Text style={styles.warnText}>Issue Warning</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.resolveBtn} onPress={() => handleResolve(item.id)}>
          <Ionicons name="checkmark" size={18} color={theme.colors.white} />
          <Text style={styles.resolveText}>Mark Resolved</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Complaints</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={complaints}
        keyExtractor={item => item.id}
        renderItem={renderComplaint}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <Ionicons name="shield-checkmark" size={48} color={theme.colors.primary} />
            <Text style={styles.emptyTitle}>All Clear!</Text>
            <Text style={styles.emptySub}>There are no open complaints.</Text>
          </View>
        )}
      />
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
    paddingBottom: theme.spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceContainerHigh,
  },
  backButton: { padding: theme.spacing.s, marginLeft: -theme.spacing.s },
  headerTitle: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.black,
  },
  listContent: {
    padding: theme.spacing.m,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: theme.colors.surfaceContainerLowest,
    borderRadius: theme.borderRadius.card,
    padding: theme.spacing.m,
    marginBottom: theme.spacing.m,
    borderWidth: 1,
    borderColor: theme.colors.surfaceContainerHigh,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  tag: {
      backgroundColor: theme.colors.surfaceContainerHigh,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
  },
  tagText: {
      fontFamily: theme.typography.fontFamily,
      fontSize: 11,
      fontWeight: '700',
      color: theme.colors.error,
  },
  date: {
      fontFamily: theme.typography.fontFamily,
      fontSize: 12,
      color: theme.colors.onSurfaceVariant,
  },
  rideId: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.primary,
    marginBottom: 12,
  },
  reasonLabel: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.onSurfaceVariant,
    marginBottom: 4,
  },
  reasonText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 15,
    fontStyle: 'italic',
    color: theme.colors.black,
    lineHeight: 22,
    marginBottom: 16,
  },
  reporterInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginBottom: 16,
      padding: 8,
      backgroundColor: theme.colors.surfaceContainerLow,
      borderRadius: 8,
  },
  reporterText: {
      fontFamily: theme.typography.fontFamily,
      fontSize: 12,
      color: theme.colors.onSurfaceVariant,
  },
  actions: {
    flexDirection: 'row',
    gap: theme.spacing.s,
  },
  warnBtn: {
    flex: 1,
    padding: theme.spacing.s,
    borderRadius: theme.borderRadius.button,
    backgroundColor: theme.colors.surfaceContainerHigh,
    alignItems: 'center',
  },
  warnText: {
    fontFamily: theme.typography.fontFamily,
    fontWeight: '700',
    color: theme.colors.black,
  },
  resolveBtn: {
    flex: 1.5,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    padding: theme.spacing.s,
    borderRadius: theme.borderRadius.button,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
  },
  resolveText: {
    fontFamily: theme.typography.fontFamily,
    fontWeight: '700',
    color: theme.colors.white,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 64,
  },
  emptyTitle: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 20,
    fontWeight: '800',
    color: theme.colors.black,
    marginTop: 16,
    marginBottom: 4,
  },
  emptySub: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 14,
    color: theme.colors.onSurfaceVariant,
  }
});
