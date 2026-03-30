import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { theme } from '../../theme/theme';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'PendingApproval'>;
};

export default function PendingApprovalScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Ionicons name="time-outline" size={60} color={theme.colors.onSurface} />
          </View>
          <Text style={styles.headline}>In Review</Text>
          <Text style={styles.bodyText}>
            We're verifying your student ID. This usually takes under 5 minutes. We'll notify you as soon as you're approved to ride.
          </Text>
        </View>

        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={() => navigation.replace('MainTabs')}
        >
          <Text style={styles.buttonText}>Check Status</Text>
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
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.m,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  headline: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.display.fontSize,
    fontWeight: theme.typography.display.fontWeight as any,
    letterSpacing: theme.typography.display.letterSpacing,
    color: theme.colors.black,
    marginBottom: theme.spacing.m,
    textAlign: 'center',
  },
  bodyText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.onSurfaceVariant,
    lineHeight: theme.typography.body.lineHeight,
    textAlign: 'center',
  },
  primaryButton: {
    backgroundColor: theme.colors.black, // Dark button for contrast per system
    borderRadius: theme.borderRadius.button,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  buttonText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.label.fontSize,
    fontWeight: theme.typography.label.fontWeight as any,
    color: theme.colors.white,
  },
});
