import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../theme/theme';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'RequestingRide'>;
};

/**
 * RequestingRideScreen — shown between "Find a Ride" search and results appearing.
 * Appears as an animated searching state from the Stitch "Requesting Ride Screen" design.
 * Auto-advances to RideList after 3 seconds (simulating backend match).
 */
export default function RequestingRideScreen({ navigation }: Props) {
  const pulseScale = useRef(new Animated.Value(1)).current;
  const pulseOpacity = useRef(new Animated.Value(0.5)).current;
  const pulse2Scale = useRef(new Animated.Value(1)).current;
  const pulse2Opacity = useRef(new Animated.Value(0.3)).current;
  const spinValue = useRef(new Animated.Value(0)).current;
  const [dotCount, setDotCount] = useState(0);

  useEffect(() => {
    // Pulse ring animation
    const ring = (s: Animated.Value, o: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.parallel([
            Animated.timing(s, { toValue: 2.2, duration: 1600, easing: Easing.out(Easing.ease), useNativeDriver: true }),
            Animated.timing(o, { toValue: 0, duration: 1600, easing: Easing.out(Easing.ease), useNativeDriver: true }),
          ]),
          Animated.parallel([
            Animated.timing(s, { toValue: 1, duration: 0, useNativeDriver: true }),
            Animated.timing(o, { toValue: delay === 0 ? 0.5 : 0.3, duration: 0, useNativeDriver: true }),
          ]),
        ])
      );

    const a1 = ring(pulseScale, pulseOpacity, 0);
    const a2 = ring(pulse2Scale, pulse2Opacity, 800);
    a1.start();
    a2.start();

    // Spin animation for search icon
    const spinAnim = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    spinAnim.start();

    // Animated dots
    const dotInterval = setInterval(() => {
      setDotCount((prev) => (prev + 1) % 4);
    }, 500);

    // Auto-navigate to ride list after simulation
    const timer = setTimeout(() => {
      navigation.replace('RideList', { pickup: 'Main Gate, Campus', destination: 'Engineering Block' });
    }, 3000);

    return () => {
      a1.stop();
      a2.stop();
      spinAnim.stop();
      clearInterval(dotInterval);
      clearTimeout(timer);
    };
  }, []);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const dots = '.'.repeat(dotCount);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>

        {/* Pulsing search indicator */}
        <View style={styles.pulseWrapper}>
          <Animated.View style={[styles.pulseRing, { transform: [{ scale: pulseScale }], opacity: pulseOpacity }]} />
          <Animated.View style={[styles.pulseRing, { transform: [{ scale: pulse2Scale }], opacity: pulse2Opacity }]} />
          <View style={styles.iconCore}>
            <Animated.View style={{ transform: [{ rotate: spin }] }}>
              <Ionicons name="search-outline" size={40} color={theme.colors.black} />
            </Animated.View>
          </View>
        </View>

        {/* Search text */}
        <Text style={styles.headline}>Finding Rides{dots}</Text>
        <Text style={styles.subtext}>
          Scanning nearby verified students making a similar route
        </Text>

        {/* Route recap */}
        <View style={styles.routeCard}>
          <Text style={styles.sectionLabel}>SEARCHING FOR</Text>
          <View style={styles.routeRow}>
            <View style={styles.pinDot} />
            <Text style={styles.routeText}>Main Gate, Campus</Text>
          </View>
          <View style={styles.routeConnector} />
          <View style={styles.routeRow}>
            <View style={styles.pinSquare} />
            <Text style={styles.routeText}>Engineering Block</Text>
          </View>
        </View>

        {/* Live status indicators */}
        <View style={styles.statusList}>
          {[
            { icon: 'shield-checkmark-outline', text: 'Checking verified riders only' },
            { icon: 'navigate-outline', text: 'Matching your route & timing' },
            { icon: 'star-outline', text: 'Prioritising top-rated riders' },
          ].map((item, idx) => (
            <View key={idx} style={styles.statusItem}>
              <View style={styles.statusIconBox}>
                <Ionicons name={item.icon as any} size={16} color={theme.colors.primary} />
              </View>
              <Text style={styles.statusText}>{item.text}</Text>
            </View>
          ))}
        </View>

        <View style={{ flex: 1 }} />

        {/* Cancel button */}
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <Text style={styles.cancelText}>Cancel Search</Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: theme.spacing.l,
    paddingTop: theme.spacing.xxl,
    paddingBottom: 40,
    alignItems: 'center',
  },

  pulseWrapper: {
    width: 130,
    height: 130,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  pulseRing: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.colors.primary,
  },
  iconCore: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 6,
  },

  headline: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 28,
    fontWeight: '800',
    color: theme.colors.black,
    letterSpacing: -0.5,
    textAlign: 'center',
    marginBottom: theme.spacing.m,
    minWidth: 240, // prevent layout shift from dots
  },
  subtext: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 15,
    color: theme.colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: theme.spacing.m,
    marginBottom: theme.spacing.xl,
  },

  routeCard: {
    backgroundColor: theme.colors.surfaceContainerLow,
    borderRadius: theme.borderRadius.card,
    padding: theme.spacing.m,
    width: '100%',
    marginBottom: theme.spacing.xl,
  },
  sectionLabel: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: theme.colors.onSurfaceVariant,
    marginBottom: theme.spacing.m,
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.m,
    paddingVertical: 4,
  },
  pinDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.colors.primary,
  },
  pinSquare: {
    width: 12,
    height: 12,
    borderRadius: 3,
    backgroundColor: theme.colors.black,
  },
  routeConnector: {
    width: 2,
    height: 18,
    backgroundColor: theme.colors.surfaceContainerHighest,
    marginLeft: 5,
    marginVertical: 2,
  },
  routeText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.black,
  },

  statusList: {
    width: '100%',
    gap: theme.spacing.m,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.m,
    backgroundColor: theme.colors.surfaceContainerLow,
    borderRadius: 12,
    padding: theme.spacing.m,
  },
  statusIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: theme.colors.surfaceContainerHighest,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.black,
  },

  cancelButton: {
    backgroundColor: theme.colors.surfaceContainerHighest,
    borderRadius: theme.borderRadius.button,
    height: 52,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.onSurfaceVariant,
  },
});
