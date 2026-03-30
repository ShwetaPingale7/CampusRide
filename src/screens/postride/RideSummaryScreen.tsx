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
  navigation: NativeStackNavigationProp<RootStackParamList, 'RideSummary'>;
};

function SuccessCheckmark() {
  const scale = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(200),
      Animated.parallel([
        Animated.spring(scale, {
          toValue: 1,
          tension: 60,
          friction: 6,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  return (
    <Animated.View style={[checkStyles.container, { transform: [{ scale }], opacity }]}>
      <View style={checkStyles.ring}>
        <Ionicons name="checkmark" size={52} color={theme.colors.black} />
      </View>
    </Animated.View>
  );
}

const checkStyles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.xl,
  },
  ring: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 8,
  },
});

export default function RideSummaryScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>

        {/* Success Section */}
        <View style={styles.successSection}>
          <SuccessCheckmark />
          <Text style={styles.headline}>Ride Complete!</Text>
          <Text style={styles.subheadline}>Thanks for riding with CampusRide</Text>
        </View>

        {/* Summary Card */}
        <View style={styles.summaryCard}>
          <Text style={styles.sectionLabel}>RIDE RECAP</Text>

          <View style={styles.summaryRow}>
            <View style={styles.summaryIconBox}>
              <Ionicons name="navigate-outline" size={18} color={theme.colors.onSurfaceVariant} />
            </View>
            <View style={styles.summaryTextGroup}>
              <Text style={styles.summaryLabel}>Route</Text>
              <Text style={styles.summaryValue}>Main Gate → Engineering Block</Text>
            </View>
          </View>

          <View style={styles.summaryDivider} />

          <View style={styles.summaryRow}>
            <View style={styles.summaryIconBox}>
              <Ionicons name="cash-outline" size={18} color={theme.colors.onSurfaceVariant} />
            </View>
            <View style={styles.summaryTextGroup}>
              <Text style={styles.summaryLabel}>Total Paid</Text>
              <Text style={styles.summaryHighlight}>₹31.00</Text>
            </View>
          </View>

          <View style={styles.summaryDivider} />

          <View style={styles.summaryRow}>
            <View style={styles.summaryIconBox}>
              <Ionicons name="star" size={18} color={theme.colors.primary} />
            </View>
            <View style={styles.summaryTextGroup}>
              <Text style={styles.summaryLabel}>Rating Given</Text>
              <View style={styles.starsRow}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <Ionicons
                    key={s}
                    name={s <= 5 ? 'star' : 'star-outline'}
                    size={18}
                    color={theme.colors.primary}
                  />
                ))}
                <Text style={styles.ratingText}>5.0</Text>
              </View>
            </View>
          </View>

          <View style={styles.summaryDivider} />

          <View style={styles.summaryRow}>
            <View style={styles.summaryIconBox}>
              <Ionicons name="time-outline" size={18} color={theme.colors.onSurfaceVariant} />
            </View>
            <View style={styles.summaryTextGroup}>
              <Text style={styles.summaryLabel}>Duration</Text>
              <Text style={styles.summaryValue}>14 min · 3.2 km</Text>
            </View>
          </View>
        </View>

        {/* Share prompt */}
        <View style={styles.shareCard}>
          <Ionicons name="heart-outline" size={20} color={theme.colors.black} style={{ marginRight: theme.spacing.m }} />
          <Text style={styles.shareText}>
            Enjoying CampusRide? Invite a classmate to join.
          </Text>
        </View>

        <View style={{ flex: 1 }} />

        {/* Back to Home */}
        <TouchableOpacity
          style={styles.homeButton}
          onPress={() => navigation.navigate('MainTabs')}
        >
          <Ionicons name="home-outline" size={20} color={theme.colors.onPrimary} style={{ marginRight: 8 }} />
          <Text style={styles.homeButtonText}>Back to Home</Text>
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
    paddingBottom: 48,
  },

  /* Success */
  successSection: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  headline: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 36,
    fontWeight: '800',
    color: theme.colors.black,
    letterSpacing: -0.8,
    marginBottom: 6,
  },
  subheadline: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.onSurfaceVariant,
  },

  /* Summary Card */
  summaryCard: {
    backgroundColor: theme.colors.surfaceContainerLow,
    borderRadius: theme.borderRadius.card,
    padding: theme.spacing.m,
    marginBottom: theme.spacing.m,
  },
  sectionLabel: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: theme.colors.onSurfaceVariant,
    marginBottom: theme.spacing.m,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.s,
  },
  summaryIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: theme.colors.surfaceContainerHighest,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.m,
  },
  summaryTextGroup: { flex: 1 },
  summaryLabel: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 12,
    color: theme.colors.onSurfaceVariant,
    marginBottom: 2,
  },
  summaryValue: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.body.fontSize,
    fontWeight: '700',
    color: theme.colors.black,
  },
  summaryHighlight: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 22,
    fontWeight: '800',
    color: theme.colors.black,
  },
  summaryDivider: {
    height: 8,
    backgroundColor: theme.colors.surfaceContainerHighest,
    marginHorizontal: -theme.spacing.m,
    marginVertical: theme.spacing.s,
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 2,
  },
  ratingText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.black,
    marginLeft: 4,
  },

  /* Share Card */
  shareCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceContainerLow,
    borderRadius: theme.borderRadius.card,
    padding: theme.spacing.m,
    marginBottom: theme.spacing.m,
  },
  shareText: {
    flex: 1,
    fontFamily: theme.typography.fontFamily,
    fontSize: 14,
    color: theme.colors.onSurfaceVariant,
    lineHeight: 20,
  },

  /* Home Button */
  homeButton: {
    flexDirection: 'row',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.button,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: theme.colors.onSurface,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 24,
    elevation: 4,
  },
  homeButtonText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.label.fontSize,
    fontWeight: theme.typography.label.fontWeight as any,
    color: theme.colors.onPrimary,
  },
});
