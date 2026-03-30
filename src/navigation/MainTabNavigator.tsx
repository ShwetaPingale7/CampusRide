import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { theme } from '../theme/theme';

import HomeScreen from '../screens/home/HomeScreen';
import MyRidesScreen from '../screens/profile/MyRidesScreen';
import NotificationsScreen from '../screens/profile/NotificationsScreen';
import ProfileScreen from '../screens/home/ProfileScreen';

export type MainTabParamList = {
  HomeTab: undefined;
  MyRidesTab: undefined;
  NotificationsTab: undefined;
  ProfileTab: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

function TabLabel({ label, focused }: { label: string; focused: boolean }) {
  return (
    <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>
      {label}
    </Text>
  );
}

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
              <Ionicons name={focused ? 'home' : 'home-outline'} size={22} color={focused ? theme.colors.black : color} />
            </View>
          ),
          tabBarLabel: ({ focused }) => <TabLabel label="Home" focused={focused} />,
          tabBarShowLabel: true,
        }}
      />
      <Tab.Screen
        name="MyRidesTab"
        component={MyRidesScreen}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
              <Ionicons name={focused ? 'bicycle' : 'bicycle-outline'} size={22} color={focused ? theme.colors.black : color} />
            </View>
          ),
          tabBarLabel: ({ focused }) => <TabLabel label="My Rides" focused={focused} />,
          tabBarShowLabel: true,
        }}
      />
      <Tab.Screen
        name="NotificationsTab"
        component={NotificationsScreen}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
              <Ionicons name={focused ? 'notifications' : 'notifications-outline'} size={22} color={focused ? theme.colors.black : color} />
              {/* Unread badge */}
              <View style={styles.badge}>
                <Text style={styles.badgeText}>2</Text>
              </View>
            </View>
          ),
          tabBarLabel: ({ focused }) => <TabLabel label="Alerts" focused={focused} />,
          tabBarShowLabel: true,
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
              <Ionicons name={focused ? 'person' : 'person-outline'} size={22} color={focused ? theme.colors.black : color} />
            </View>
          ),
          tabBarLabel: ({ focused }) => <TabLabel label="Profile" focused={focused} />,
          tabBarShowLabel: true,
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: theme.colors.background,
    borderTopWidth: 0,
    elevation: 0,
    shadowOpacity: 0,
    height: Platform.OS === 'ios' ? 84 : 68,
    paddingBottom: Platform.OS === 'ios' ? 24 : 10,
    paddingTop: 8,
    paddingHorizontal: theme.spacing.s,
    // tonal elevation without a 1px line — background shift
    shadowColor: theme.colors.onSurface,
    shadowOffset: { width: 0, height: -4 },
    shadowRadius: 16,
  },
  iconWrapper: {
    width: 40,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  iconWrapperActive: {
    backgroundColor: theme.colors.primary,
  },
  tabLabel: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 10,
    fontWeight: '600',
    color: theme.colors.onSurfaceVariant,
    marginTop: 2,
  },
  tabLabelActive: {
    color: theme.colors.black,
    fontWeight: '700',
  },
  badge: {
    position: 'absolute',
    top: 2,
    right: 2,
    minWidth: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: theme.colors.error,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 2,
  },
  badgeText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 8,
    fontWeight: '800',
    color: theme.colors.white,
  },
});
