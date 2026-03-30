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
import { useNavigation } from '@react-navigation/native';

type NotifType = 'request' | 'accepted' | 'rating' | 'verification' | 'system';

interface Notification {
  id: string;
  type: NotifType;
  title: string;
  body: string;
  time: string;
  read: boolean;
}

const NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'accepted',
    title: 'Ride Accepted!',
    body: 'Arjun Verma accepted your ride request. Be ready at Main Gate by 9:30 AM.',
    time: '10 min ago',
    read: false,
  },
  {
    id: '2',
    type: 'rating',
    title: 'New Rating Received',
    body: 'Priya Mehta rated your ride ⭐⭐⭐⭐⭐. Keep it up!',
    time: '2 hrs ago',
    read: false,
  },
  {
    id: '3',
    type: 'request',
    title: 'New Ride Request',
    body: 'Rahul Singh wants to join your 9:00 AM ride to Engineering Block.',
    time: 'Yesterday',
    read: true,
  },
  {
    id: '4',
    type: 'verification',
    title: 'ID Verified ✅',
    body: 'Your student ID has been approved. You can now offer and book rides.',
    time: '2 days ago',
    read: true,
  },
  {
    id: '5',
    type: 'system',
    title: 'Welcome to CampusRide!',
    body: 'Your account is set up. Start by finding or offering a ride on campus.',
    time: '3 days ago',
    read: true,
  },
];

const ICON_MAP: Record<NotifType, { name: React.ComponentProps<typeof Ionicons>['name']; bg: string }> = {
  request: { name: 'bicycle-outline', bg: theme.colors.surfaceContainerHighest },
  accepted: { name: 'checkmark-circle-outline', bg: theme.colors.primary },
  rating: { name: 'star-outline', bg: theme.colors.primary },
  verification: { name: 'shield-checkmark-outline', bg: theme.colors.primary },
  system: { name: 'notifications-outline', bg: theme.colors.surfaceContainerHighest },
};

export default function NotificationsScreen() {
  const navigation = useNavigation();
  const renderItem = ({ item }: { item: Notification }) => {
    const iconConfig = ICON_MAP[item.type];
    return (
      <TouchableOpacity
        style={[styles.notifCard, !item.read && styles.notifCardUnread]}
        activeOpacity={0.7}
      >
        {/* Unread indicator */}
        {!item.read && <View style={styles.unreadDot} />}

        <View style={[styles.iconBox, { backgroundColor: iconConfig.bg }]}>
          <Ionicons name={iconConfig.name} size={22} color={theme.colors.black} />
        </View>

        <View style={styles.textGroup}>
          <View style={styles.titleRow}>
            <Text style={styles.notifTitle}>{item.title}</Text>
            <Text style={styles.notifTime}>{item.time}</Text>
          </View>
          <Text style={styles.notifBody} numberOfLines={2}>
            {item.body}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const unreadCount = NOTIFICATIONS.filter((n) => !n.read).length;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Notifications</Text>
            {unreadCount > 0 && (
              <Text style={styles.headerSub}>{unreadCount} unread</Text>
            )}
          </View>
          <TouchableOpacity style={styles.markAllButton}>
            <Text style={styles.markAllText}>Mark all read</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={NOTIFICATIONS}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ gap: theme.spacing.s, paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="notifications-off-outline" size={48} color={theme.colors.surfaceContainerHighest} />
              <Text style={styles.emptyTitle}>All caught up!</Text>
              <Text style={styles.emptySubtitle}>No notifications yet</Text>
            </View>
          }
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
    fontSize: 12,
    color: theme.colors.onSurfaceVariant,
    marginTop: 1,
  },
  markAllButton: { marginLeft: 'auto' },
  markAllText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.onSurfaceVariant,
  },

  /* Notif card */
  notifCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.card,
    padding: theme.spacing.m,
    position: 'relative',
    gap: theme.spacing.m,
  },
  notifCardUnread: {
    backgroundColor: theme.colors.white,
  },
  unreadDot: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.primary,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  textGroup: { flex: 1 },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
    gap: theme.spacing.s,
  },
  notifTitle: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.body.fontSize,
    fontWeight: '700',
    color: theme.colors.black,
    flex: 1,
  },
  notifTime: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 11,
    color: theme.colors.onSurfaceVariant,
    flexShrink: 0,
  },
  notifBody: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 13,
    color: theme.colors.onSurfaceVariant,
    lineHeight: 19,
  },

  emptyState: {
    alignItems: 'center',
    paddingTop: theme.spacing.xxl,
    gap: theme.spacing.m,
  },
  emptyTitle: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.title.fontSize,
    fontWeight: theme.typography.title.fontWeight as any,
    color: theme.colors.black,
  },
  emptySubtitle: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.onSurfaceVariant,
  },
});
