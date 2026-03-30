import React, { useEffect, useRef } from 'react';
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
  navigation: NativeStackNavigationProp<RootStackParamList, 'RequestSent'>;
};

function PulseRing() {
  const scale1 = useRef(new Animated.Value(1)).current;
  const opacity1 = useRef(new Animated.Value(0.6)).current;
  const scale2 = useRef(new Animated.Value(1)).current;
  const opacity2 = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const pulse = (scaleVal: Animated.Value, opacityVal: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.parallel([
            Animated.timing(scaleVal, {
              toValue: 2.2,
              duration: 1400,
              easing: Easing.out(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(opacityVal, {
              toValue: 0,
              duration: 1400,
              easing: Easing.out(Easing.ease),
              useNativeDriver: true,
            }),
          ]),
          Animated.parallel([
            Animated.timing(scaleVal, { toValue: 1, duration: 0, useNativeDriver: true }),
            Animated.timing(opacityVal, { toValue: delay === 0 ? 0.6 : 0.4, duration: 0, useNativeDriver: true }),
          ]),
        ])
      );

    const a1 = pulse(scale1, opacity1, 0);
    const a2 = pulse(scale2, opacity2, 700);
    a1.start();
    a2.start();
    return () => { a1.stop(); a2.stop(); };
  }, []);

  return (
    <View style={pulseStyles.container}>
      <Animated.View style={[pulseStyles.ring, { transform: [{ scale: scale1 }], opacity: opacity1 }]} />
      <Animated.View style={[pulseStyles.ring, { transform: [{ scale: scale2 }], opacity: opacity2 }]} />
      <View style={pulseStyles.core}>
        <Ionicons name="bicycle-outline" size={36} color={theme.colors.black} />
      </View>
    </View>
  );
}

const pulseStyles = StyleSheet.create({
  container: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ring: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: theme.colors.primary,
  },
  core: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default function RequestSentScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>

        <View style={styles.content}>
          <PulseRing />

          <Text style={styles.headline}>Request Sent!</Text>
          <Text style={styles.subheadline}>Waiting for rider to accept</Text>
          <Text style={styles.body}>
            Arjun Verma will review your request and confirm shortly. You'll get notified instantly.
          </Text>

          {/* Status row */}
          <View style={styles.statusCard}>
            <View style={styles.statusRow}>
              <View style={styles.statusIconDone}>
                <Ionicons name="checkmark" size={14} color={theme.colors.black} />
              </View>
              <Text style={styles.statusTextDone}>Request submitted</Text>
            </View>
            <View style={styles.statusConnector} />
            <View style={styles.statusRow}>
              <View style={styles.statusIconPending}>
                <Ionicons name="time-outline" size={14} color={theme.colors.onSurfaceVariant} />
              </View>
              <Text style={styles.statusTextPending}>Waiting for rider confirmation</Text>
            </View>
            <View style={styles.statusConnector} />
            <View style={styles.statusRow}>
              <View style={styles.statusIconEmpty} />
              <Text style={styles.statusTextPending}>Ride confirmed</Text>
            </View>
          </View>
        </View>

        {/* Cancel */}
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelText}>Cancel Request</Text>
        </TouchableOpacity>

        {/* Simulate rider accept — demo only */}
        <TouchableOpacity
          style={styles.simulateButton}
          onPress={() => navigation.navigate('RideConfirmed')}
        >
          <Text style={styles.simulateText}>Rider Accepted →</Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme.colors.background },
  container: {
    flex: 1,
    paddingHorizontal: theme.spacing.l,
    paddingTop: theme.spacing.xxl,
    paddingBottom: 40,
    justifyContent: 'space-between',
  },

  content: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  headline: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 32,
    fontWeight: '800',
    color: theme.colors.black,
    letterSpacing: -0.5,
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.s,
  },
  subheadline: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.body.fontSize,
    fontWeight: '700',
    color: theme.colors.onSurfaceVariant,
    marginBottom: theme.spacing.m,
  },
  body: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 14,
    color: theme.colors.onSurfaceVariant,
    lineHeight: 21,
    textAlign: 'center',
    paddingHorizontal: theme.spacing.l,
    marginBottom: theme.spacing.xl,
  },

  statusCard: {
    backgroundColor: theme.colors.surfaceContainerLow,
    borderRadius: theme.borderRadius.card,
    padding: theme.spacing.m,
    width: '100%',
  },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.m },
  statusIconDone: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusIconPending: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.surfaceContainerHighest,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusIconEmpty: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.surfaceContainerHighest,
  },
  statusConnector: {
    width: 2,
    height: 20,
    backgroundColor: theme.colors.surfaceContainerHighest,
    marginLeft: 13,
    marginVertical: 4,
  },
  statusTextDone: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.black,
  },
  statusTextPending: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 14,
    color: theme.colors.onSurfaceVariant,
  },

  cancelButton: {
    borderWidth: 1.5,
    borderColor: theme.colors.error,
    borderRadius: theme.borderRadius.button,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.m,
  },
  cancelText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.label.fontSize,
    fontWeight: theme.typography.label.fontWeight as any,
    color: theme.colors.error,
  },

  simulateButton: {
    backgroundColor: theme.colors.surfaceContainerHighest,
    borderRadius: theme.borderRadius.button,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  simulateText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.onSurfaceVariant,
  },
});
