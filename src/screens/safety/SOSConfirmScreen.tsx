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
  navigation: NativeStackNavigationProp<RootStackParamList, 'SOSConfirm'>;
};

const COUNTDOWN_SECONDS = 3;

export default function SOSConfirmScreen({ navigation }: Props) {
  const [count, setCount] = useState(COUNTDOWN_SECONDS);
  const [triggered, setTriggered] = useState(false);

  // Circular progress animation
  const progressAnim = useRef(new Animated.Value(0)).current;
  // Pulse animation for the giant red button
  const pulseAnim = useRef(new Animated.Value(1)).current;
  // Opacity for the urgent fade-in
  const fadeIn = useRef(new Animated.Value(0)).current;

  /* ── Fade-in on mount ── */
  useEffect(() => {
    Animated.timing(fadeIn, {
      toValue: 1,
      duration: 250,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, []);

  /* ── Pulse loop on the SOS button ── */
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.06,
          duration: 600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  /* ── Countdown + auto-confirm ── */
  useEffect(() => {
    if (triggered) return;

    // Animate the arc to full over COUNTDOWN_SECONDS
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: COUNTDOWN_SECONDS * 1000,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();

    const ticker = setInterval(() => {
      setCount((prev) => {
        if (prev <= 1) {
          clearInterval(ticker);
          setTriggered(true);
          navigation.replace('SOSActivated');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(ticker);
  }, [triggered]);

  const handleSOS = () => {
    setTriggered(true);
    navigation.replace('SOSActivated');
  };

  const handleCancel = () => {
    setTriggered(true);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Animated.View style={[styles.container, { opacity: fadeIn }]}>

        {/* Warning Icon */}
        <View style={styles.warningIconContainer}>
          <Ionicons name="warning" size={48} color={theme.colors.error} />
        </View>

        {/* Heading */}
        <Text style={styles.headline}>Are you in an{'\n'}emergency?</Text>
        <Text style={styles.subtext}>
          Your live location and ride details will be shared with your emergency contacts and campus security.
        </Text>

        {/* Auto-confirm countdown badge */}
        <View style={styles.countdownBadge}>
          <Ionicons name="time-outline" size={16} color={theme.colors.error} style={{ marginRight: 6 }} />
          <Text style={styles.countdownText}>
            Auto-confirming in <Text style={styles.countdownHighlight}>{count}s</Text>
          </Text>
        </View>

        <View style={{ flex: 1 }} />

        {/* Big SOS Button */}
        <Animated.View style={{ transform: [{ scale: pulseAnim }], width: '100%' }}>
          <TouchableOpacity
            style={styles.sosButton}
            onPress={handleSOS}
            activeOpacity={0.85}
          >
            <Ionicons name="warning-outline" size={24} color={theme.colors.white} style={{ marginRight: 10 }} />
            <Text style={styles.sosButtonText}>YES — Send SOS Alert</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Cancel Button */}
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel} activeOpacity={0.7}>
          <Text style={styles.cancelButtonText}>No, I accidentally tapped</Text>
        </TouchableOpacity>

      </Animated.View>
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
    paddingBottom: 48,
    alignItems: 'center',
  },

  warningIconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#FFDAD6', // error_container from design system
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },

  headline: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 36,
    fontWeight: '800',
    color: theme.colors.black,
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
    paddingHorizontal: theme.spacing.m,
    marginBottom: theme.spacing.xl,
  },

  countdownBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFDAD6',
    borderRadius: theme.borderRadius.button,
    paddingHorizontal: theme.spacing.m,
    paddingVertical: 10,
  },
  countdownText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.error,
  },
  countdownHighlight: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.error,
  },

  sosButton: {
    flexDirection: 'row',
    backgroundColor: theme.colors.error,
    borderRadius: theme.borderRadius.button,
    height: 64,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.m,
    shadowColor: theme.colors.error,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.45,
    shadowRadius: 24,
    elevation: 10,
  },
  sosButtonText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.white,
    letterSpacing: -0.2,
  },

  cancelButton: {
    height: 52,
    width: '100%',
    backgroundColor: theme.colors.surfaceContainerHighest,
    borderRadius: theme.borderRadius.button,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.label.fontSize,
    fontWeight: theme.typography.label.fontWeight as any,
    color: theme.colors.onSurfaceVariant,
  },
});
