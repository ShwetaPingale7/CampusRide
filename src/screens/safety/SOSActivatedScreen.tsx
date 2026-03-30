import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Animated,
  Easing,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../theme/theme';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'SOSActivated'>;
};

const CHECKLIST = [
  {
    id: 1,
    icon: 'location-outline' as const,
    label: 'Live location sent via SMS',
    delay: 400,
  },
  {
    id: 2,
    icon: 'people-outline' as const,
    label: 'Emergency contact notified',
    delay: 900,
  },
  {
    id: 3,
    icon: 'shield-checkmark-outline' as const,
    label: 'College security alerted',
    delay: 1400,
    optional: true,
  },
];

function ChecklistItem({
  icon,
  label,
  delay,
  optional,
}: (typeof CHECKLIST)[0]) {
  const slideAnim = useRef(new Animated.Value(20)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 380,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 380,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.checklistItem,
        { transform: [{ translateY: slideAnim }], opacity: opacityAnim },
      ]}
    >
      <View style={styles.checkIconBox}>
        <Ionicons name="checkmark" size={14} color={theme.colors.black} />
      </View>
      <View style={styles.checkTextGroup}>
        <Ionicons name={icon} size={16} color={theme.colors.onSurfaceVariant} style={{ marginRight: 8 }} />
        <Text style={styles.checkLabel}>{label}</Text>
        {optional && (
          <View style={styles.optionalBadge}>
            <Text style={styles.optionalText}>optional</Text>
          </View>
        )}
      </View>
    </Animated.View>
  );
}

function PulseAlert() {
  const scale1 = useRef(new Animated.Value(1)).current;
  const op1 = useRef(new Animated.Value(0.5)).current;
  const scale2 = useRef(new Animated.Value(1)).current;
  const op2 = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const ring = (s: Animated.Value, o: Animated.Value, d: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(d),
          Animated.parallel([
            Animated.timing(s, { toValue: 2.4, duration: 1600, easing: Easing.out(Easing.ease), useNativeDriver: true }),
            Animated.timing(o, { toValue: 0, duration: 1600, easing: Easing.out(Easing.ease), useNativeDriver: true }),
          ]),
          Animated.parallel([
            Animated.timing(s, { toValue: 1, duration: 0, useNativeDriver: true }),
            Animated.timing(o, { toValue: d === 0 ? 0.5 : 0.3, duration: 0, useNativeDriver: true }),
          ]),
        ])
      );

    const a1 = ring(scale1, op1, 0);
    const a2 = ring(scale2, op2, 800);
    a1.start();
    a2.start();
    return () => { a1.stop(); a2.stop(); };
  }, []);

  return (
    <View style={alertStyles.wrapper}>
      <Animated.View style={[alertStyles.ring, { transform: [{ scale: scale1 }], opacity: op1 }]} />
      <Animated.View style={[alertStyles.ring, { transform: [{ scale: scale2 }], opacity: op2 }]} />
      <View style={alertStyles.core}>
        <Ionicons name="warning" size={40} color={theme.colors.white} />
      </View>
    </View>
  );
}

const alertStyles = StyleSheet.create({
  wrapper: {
    width: 110,
    height: 110,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  ring: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: theme.colors.error,
  },
  core: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: theme.colors.error,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default function SOSActivatedScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        {/* Pulsing Alert Icon */}
        <View style={styles.topSection}>
          <PulseAlert />
          <Text style={styles.headline}>Emergency Alert{'\n'}Sent!</Text>
          <Text style={styles.subtext}>
            Help is on the way. Stay calm and stay in your current location if it is safe to do so.
          </Text>
        </View>

        {/* Checklist Card */}
        <View style={styles.checklistCard}>
          <Text style={styles.sectionLabel}>ACTIONS TAKEN</Text>
          {CHECKLIST.map((item) => (
            <ChecklistItem key={item.id} {...item} />
          ))}
        </View>

        {/* Live Location Card */}
        <View style={styles.locationCard}>
          <Text style={styles.sectionLabel}>YOUR CURRENT LOCATION</Text>
          <View style={styles.locationRow}>
            <View style={styles.locationIconBox}>
              <Ionicons name="location" size={22} color={theme.colors.error} />
            </View>
            <View style={styles.locationTextGroup}>
              <Text style={styles.locationName}>Near Engineering Block</Text>
              <Text style={styles.locationCoords}>18.5204° N, 73.8567° E</Text>
            </View>
            <View style={styles.liveBadge}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>LIVE</Text>
            </View>
          </View>
        </View>

        {/* Emergency contacts list */}
        <View style={styles.contactsCard}>
          <Text style={styles.sectionLabel}>NOTIFIED CONTACTS</Text>
          {[
            { name: 'Mom (Priya Sharma)', icon: 'person-outline' as const },
            { name: 'Campus Security', icon: 'shield-outline' as const },
          ].map((c) => (
            <View key={c.name} style={styles.contactRow}>
              <View style={styles.contactIconBox}>
                <Ionicons name={c.icon} size={18} color={theme.colors.onSurfaceVariant} />
              </View>
              <Text style={styles.contactName}>{c.name}</Text>
              <View style={styles.notifiedBadge}>
                <Ionicons name="checkmark" size={12} color={theme.colors.black} />
                <Text style={styles.notifiedText}>Notified</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Safe now button */}
        <TouchableOpacity
          style={styles.safeButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.85}
        >
          <Ionicons name="checkmark-circle-outline" size={22} color={theme.colors.black} style={{ marginRight: 10 }} />
          <Text style={styles.safeButtonText}>I am Safe Now</Text>
        </TouchableOpacity>

        <Text style={styles.disclaimer}>
          Tapping "I am Safe Now" will stop sharing your live location and notify your contacts.
        </Text>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme.colors.background },
  scrollContent: {
    paddingHorizontal: theme.spacing.l,
    paddingTop: theme.spacing.xxl,
    paddingBottom: 48,
  },

  topSection: {
    alignItems: 'center',
    marginBottom: theme.spacing.l,
  },
  headline: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 34,
    fontWeight: '800',
    color: theme.colors.error,
    letterSpacing: -0.8,
    textAlign: 'center',
    marginBottom: theme.spacing.m,
  },
  subtext: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.onSurfaceVariant,
    lineHeight: 24,
    textAlign: 'center',
    paddingHorizontal: theme.spacing.s,
  },

  sectionLabel: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: theme.colors.onSurfaceVariant,
    marginBottom: theme.spacing.m,
  },

  /* Checklist */
  checklistCard: {
    backgroundColor: theme.colors.surfaceContainerLow,
    borderRadius: theme.borderRadius.card,
    padding: theme.spacing.m,
    marginBottom: theme.spacing.m,
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.s,
    gap: theme.spacing.m,
  },
  checkIconBox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  checkTextGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    flexWrap: 'wrap',
  },
  checkLabel: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.body.fontSize,
    fontWeight: '700',
    color: theme.colors.black,
    flex: 1,
  },
  optionalBadge: {
    backgroundColor: theme.colors.surfaceContainerHighest,
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 6,
  },
  optionalText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.onSurfaceVariant,
  },

  /* Location */
  locationCard: {
    backgroundColor: theme.colors.surfaceContainerLow,
    borderRadius: theme.borderRadius.card,
    padding: theme.spacing.m,
    marginBottom: theme.spacing.m,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FFDAD6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.m,
  },
  locationTextGroup: { flex: 1 },
  locationName: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.body.fontSize,
    fontWeight: '700',
    color: theme.colors.black,
    marginBottom: 2,
  },
  locationCoords: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 12,
    color: theme.colors.onSurfaceVariant,
    letterSpacing: 0.5,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.error,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    gap: 4,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.white,
  },
  liveText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 11,
    fontWeight: '800',
    color: theme.colors.white,
    letterSpacing: 1,
  },

  /* Contacts */
  contactsCard: {
    backgroundColor: theme.colors.surfaceContainerLow,
    borderRadius: theme.borderRadius.card,
    padding: theme.spacing.m,
    marginBottom: theme.spacing.xl,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: theme.spacing.m,
  },
  contactIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: theme.colors.surfaceContainerHighest,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactName: {
    flex: 1,
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.body.fontSize,
    fontWeight: '600',
    color: theme.colors.black,
  },
  notifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    gap: 4,
  },
  notifiedText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.black,
  },

  /* Safe button */
  safeButton: {
    flexDirection: 'row',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.button,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.m,
    shadowColor: theme.colors.onSurface,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 24,
    elevation: 4,
  },
  safeButtonText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.black,
  },

  disclaimer: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 12,
    color: theme.colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: theme.spacing.m,
  },
});
