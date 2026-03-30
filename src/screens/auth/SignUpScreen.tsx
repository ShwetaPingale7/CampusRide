import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../theme/theme';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'SignUp'>;
};

export default function SignUpScreen({ navigation }: Props) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
        <View style={styles.container}>

          {/* Back button */}
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={theme.colors.black} />
          </TouchableOpacity>

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.supLabel}>STEP 1 OF 3</Text>
            <Text style={styles.title}>Enter your{'\n'}phone number.</Text>
            <Text style={styles.subtitle}>
              You'll need a verified number to continue. We'll send a one-time code.
            </Text>
          </View>

          {/* Input */}
          <View style={[styles.inputContainer, isFocused && styles.inputFocused]}>
            <View style={styles.countryCodeBadge}>
              <Text style={styles.countryCode}>🇮🇳 +91</Text>
            </View>
            <View style={styles.divider} />
            <TextInput
              style={styles.input}
              placeholder="98765 43210"
              placeholderTextColor={theme.colors.onSurfaceVariant}
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              maxLength={10}
            />
            {phoneNumber.length > 0 && (
              <TouchableOpacity onPress={() => setPhoneNumber('')}>
                <Ionicons name="close-circle" size={20} color={theme.colors.onSurfaceVariant} />
              </TouchableOpacity>
            )}
          </View>

          {/* Note */}
          <View style={styles.noteRow}>
            <Ionicons name="lock-closed-outline" size={13} color={theme.colors.onSurfaceVariant} />
            <Text style={styles.noteText}>
              Your number is only used for verification and is never shared.
            </Text>
          </View>

          <View style={{ flex: 1 }} />

          {/* CTA */}
          <TouchableOpacity
            style={[styles.primaryButton, phoneNumber.length < 10 && styles.primaryButtonDisabled]}
            onPress={() => navigation.navigate('OTP')}
            activeOpacity={0.88}
          >
            <Text style={styles.buttonText}>Send OTP</Text>
            <Ionicons name="arrow-forward" size={20} color={theme.colors.onPrimary} />
          </TouchableOpacity>

        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  flex: { flex: 1 },
  container: {
    flex: 1,
    paddingHorizontal: theme.spacing.l,
    paddingTop: theme.spacing.m,
    paddingBottom: 36,
  },

  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.surfaceContainerLow,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },

  header: {
    marginBottom: theme.spacing.xl,
  },
  supLabel: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    color: theme.colors.primary,
    marginBottom: theme.spacing.s,
  },
  title: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 36,
    fontWeight: '800',
    color: theme.colors.black,
    letterSpacing: -1,
    marginBottom: theme.spacing.m,
    lineHeight: 42,
  },
  subtitle: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 15,
    color: theme.colors.onSurfaceVariant,
    lineHeight: 22,
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceContainerHighest,
    borderRadius: theme.borderRadius.card,
    paddingHorizontal: theme.spacing.m,
    height: 68,
    marginBottom: theme.spacing.m,
  },
  inputFocused: {
    backgroundColor: theme.colors.white,
    borderWidth: 1.5,
    borderColor: theme.colors.primary,
  },
  countryCodeBadge: {
    paddingRight: theme.spacing.m,
  },
  countryCode: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.black,
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: theme.colors.surfaceContainerHighest,
    marginRight: theme.spacing.m,
  },
  input: {
    flex: 1,
    fontFamily: theme.typography.fontFamily,
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.black,
    letterSpacing: 0.5,
  },

  noteRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    paddingHorizontal: 4,
  },
  noteText: {
    flex: 1,
    fontFamily: theme.typography.fontFamily,
    fontSize: 12,
    color: theme.colors.onSurfaceVariant,
    lineHeight: 18,
  },

  primaryButton: {
    flexDirection: 'row',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.button,
    height: 58,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 4,
  },
  primaryButtonDisabled: {
    opacity: 0.55,
  },
  buttonText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.onPrimary,
  },
});
