import React, { useState, useRef } from 'react';
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
  navigation: NativeStackNavigationProp<RootStackParamList, 'OTP'>;
};

export default function OTPScreen({ navigation }: Props) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputs = useRef<TextInput[]>([]);

  const handleOtpChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    if (text && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const isComplete = otp.every((d) => d !== '');

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
        <View style={styles.container}>

          {/* Back */}
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={theme.colors.black} />
          </TouchableOpacity>

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.supLabel}>STEP 2 OF 3</Text>
            <Text style={styles.title}>Verify your{'\n'}identity.</Text>
            <Text style={styles.subtitle}>
              Enter the 6-digit code sent to{' '}
              <Text style={styles.phoneHighlight}>+91 98765 43210</Text>
            </Text>
          </View>

          {/* OTP Boxes */}
          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(input) => { if (input) inputs.current[index] = input; }}
                style={[styles.otpBox, digit ? styles.otpBoxFilled : null]}
                keyboardType="number-pad"
                maxLength={1}
                value={digit}
                onChangeText={(text) => handleOtpChange(text, index)}
                onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
                caretHidden
              />
            ))}
          </View>

          {/* Resend */}
          <TouchableOpacity style={styles.resendRow}>
            <Text style={styles.resendText}>Didn't receive a code? </Text>
            <Text style={styles.resendLink}>Resend OTP</Text>
          </TouchableOpacity>

          <View style={{ flex: 1 }} />

          {/* Verify CTA */}
          <TouchableOpacity
            style={[styles.primaryButton, !isComplete && styles.primaryButtonDisabled]}
            onPress={() => navigation.navigate('ProfileSetup')}
            activeOpacity={0.88}
          >
            <Ionicons
              name="shield-checkmark-outline"
              size={20}
              color={theme.colors.onPrimary}
            />
            <Text style={styles.buttonText}>Verify Identity</Text>
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
    lineHeight: 42,
    marginBottom: theme.spacing.m,
  },
  subtitle: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 15,
    color: theme.colors.onSurfaceVariant,
    lineHeight: 22,
  },
  phoneHighlight: {
    fontWeight: '700',
    color: theme.colors.black,
  },

  otpContainer: {
    flexDirection: 'row',
    gap: theme.spacing.s,
    marginBottom: theme.spacing.l,
  },
  otpBox: {
    flex: 1,
    height: 60,
    backgroundColor: theme.colors.surfaceContainerHighest,
    borderRadius: 14,
    fontSize: 24,
    fontFamily: theme.typography.fontFamily,
    fontWeight: '800',
    color: theme.colors.black,
    textAlign: 'center',
  },
  otpBoxFilled: {
    backgroundColor: theme.colors.primary,
    color: theme.colors.black,
  },

  resendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  resendText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 14,
    color: theme.colors.onSurfaceVariant,
  },
  resendLink: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.black,
  },

  primaryButton: {
    flexDirection: 'row',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.button,
    height: 58,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    shadowColor: theme.colors.onSurface,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 24,
    elevation: 4,
  },
  primaryButtonDisabled: { opacity: 0.5 },
  buttonText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.onPrimary,
  },
});
