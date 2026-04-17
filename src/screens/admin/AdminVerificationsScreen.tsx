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

export default function AdminVerificationsScreen() {
  const navigation = useNavigation();

  // Mock data for MVP UI
  const [pendingUsers, setPendingUsers] = useState([
    { id: '1', name: 'Rahul Sharma', email: 'rahul.s@college.edu', role: 'rider', status: 'pending', idUrl: 'mock' },
    { id: '2', name: 'Priya Desai', email: 'priya.d@college.edu', role: 'passenger', status: 'pending', idUrl: 'mock' },
  ]);

  const handleApprove = (id: string) => {
    setPendingUsers(prev => prev.filter(u => u.id !== id));
  };

  const renderUser = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.userInfo}>
            <View style={styles.avatar}>
                <Text style={styles.avatarText}>{item.name.substring(0,2).toUpperCase()}</Text>
            </View>
            <View>
                <Text style={styles.userName}>{item.name}</Text>
                <Text style={styles.userEmail}>{item.email}</Text>
            </View>
        </View>
        <View style={[styles.roleBadge, item.role === 'rider' && styles.riderBadge]}>
            <Text style={[styles.roleText, item.role === 'rider' && styles.riderRoleText]}>
                {item.role.toUpperCase()}
            </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.viewIdBtn}>
        <Ionicons name="document-text-outline" size={16} color={theme.colors.primary} />
        <Text style={styles.viewIdText}>View Uploaded Documents</Text>
      </TouchableOpacity>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.rejectBtn} onPress={() => handleApprove(item.id)}>
          <Text style={styles.rejectText}>Reject</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.approveBtn} onPress={() => handleApprove(item.id)}>
          <Text style={styles.approveText}>Approve</Text>
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
        <Text style={styles.headerTitle}>Verifications</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={pendingUsers}
        keyExtractor={item => item.id}
        renderItem={renderUser}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <Ionicons name="checkmark-circle" size={48} color={theme.colors.primary} />
            <Text style={styles.emptyTitle}>All caught up!</Text>
            <Text style={styles.emptySub}>No pending verifications right now.</Text>
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
    alignItems: 'flex-start',
    marginBottom: theme.spacing.m,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.surfaceContainerHigh,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontFamily: theme.typography.fontFamily,
    fontWeight: '800',
    color: theme.colors.onSurface,
  },
  userName: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.black,
  },
  userEmail: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 13,
    color: theme.colors.onSurfaceVariant,
  },
  roleBadge: {
    backgroundColor: theme.colors.surfaceContainerLow,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  riderBadge: {
    backgroundColor: theme.colors.surfaceContainerHigh,
  },
  roleText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 10,
    fontWeight: '800',
    color: theme.colors.onSurface,
  },
  riderRoleText: {
    color: theme.colors.primary,
  },
  viewIdBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderStyle: 'dashed',
    padding: theme.spacing.s,
    borderRadius: theme.borderRadius.button,
    marginBottom: theme.spacing.m,
    gap: 8,
  },
  viewIdText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  actions: {
    flexDirection: 'row',
    gap: theme.spacing.s,
  },
  rejectBtn: {
    flex: 1,
    padding: theme.spacing.s,
    borderRadius: theme.borderRadius.button,
    backgroundColor: theme.colors.surfaceContainerHigh,
    alignItems: 'center',
  },
  rejectText: {
    fontFamily: theme.typography.fontFamily,
    fontWeight: '700',
    color: theme.colors.error,
  },
  approveBtn: {
    flex: 1,
    padding: theme.spacing.s,
    borderRadius: theme.borderRadius.button,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
  },
  approveText: {
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
