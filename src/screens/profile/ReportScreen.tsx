import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../theme/theme';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { useAuth } from '../../services/AuthContext';
import { sendPushNotification } from '../../services/pushNotifications';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Report'>;
};

const REASONS = [
  'Inappropriate behaviour',
  'No show',
  'Unsafe driving',
  'Other',
];

export default function ReportScreen({ navigation }: Props) {
  const { session } = useAuth();
  const [selectedReason, setSelectedReason] = useState('');
  const [description, setDescription] = useState('');
  const [descFocused, setDescFocused] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const isValid = selectedReason !== '' && description.trim().length > 10;

  const handleSubmit = async () => {
    if (!isValid) return;
    setSubmitted(true);

    // 1. Notify Admin that a report was filed
    await sendPushNotification(
      'admin-id-placeholder',
      'New User Report 🚩',
      `A user just reported a rider for: ${selectedReason}. Immediate review required.`
    );

    // 2. Send receipt to the user who filed it
    if (session?.user?.id) {
       await sendPushNotification(
         session.user.id,
         'Report Received 🛡️',
         'Your report has been securely sent. We take safety very seriously and will investigate immediately.'
       );
    }
  };

  if (submitted) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.successContainer}>
          <View style={styles.successIcon}>
            <Ionicons name="checkmark" size={36} color={theme.colors.black} />
          </View>
          <Text style={styles.successTitle}>Report Submitted</Text>
          <Text style={styles.successBody}>
            Our team will review this report within 24 hours. We take all safety concerns seriously.
          </Text>
          <TouchableOpacity style={styles.doneButton} onPress={() => navigation.goBack()}>
            <Text style={styles.doneButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >

          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color={theme.colors.black} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Report User</Text>
          </View>

          {/* Reported user card */}
          <View style={styles.reportedCard}>
            <View style={styles.reportedAvatar}>
              <Text style={styles.reportedAvatarText}>AV</Text>
            </View>
            <View style={styles.reportedInfo}>
              <Text style={styles.reportedName}>Arjun Verma</Text>
              <Text style={styles.reportedRole}>Your Rider · Today 9:30 AM</Text>
            </View>
            <View style={styles.reportBadge}>
              <Ionicons name="flag" size={14} color={theme.colors.error} />
            </View>
          </View>

          {/* Reason selector */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>REASON FOR REPORT</Text>
            <View style={styles.reasonList}>
              {REASONS.map((reason) => (
                <TouchableOpacity
                  key={reason}
                  style={[
                    styles.reasonItem,
                    selectedReason === reason && styles.reasonItemSelected,
                  ]}
                  onPress={() => setSelectedReason(reason)}
                >
                  <View style={[
                    styles.radioOuter,
                    selectedReason === reason && styles.radioOuterSelected,
                  ]}>
                    {selectedReason === reason && <View style={styles.radioInner} />}
                  </View>
                  <Text style={[
                    styles.reasonText,
                    selectedReason === reason && styles.reasonTextSelected,
                  ]}>
                    {reason}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>DESCRIBE THE INCIDENT</Text>
            <View style={[styles.descriptionBox, descFocused && styles.descriptionBoxFocused]}>
              <TextInput
                style={styles.descriptionInput}
                placeholder="Please describe what happened in detail. The more information you provide, the better we can investigate."
                placeholderTextColor={theme.colors.onSurfaceVariant}
                multiline
                numberOfLines={6}
                value={description}
                onChangeText={setDescription}
                onFocus={() => setDescFocused(true)}
                onBlur={() => setDescFocused(false)}
                textAlignVertical="top"
              />
            </View>
            <Text style={styles.charCount}>{description.length} / 500</Text>
          </View>

          {/* Privacy note */}
          <View style={styles.noteBox}>
            <Ionicons name="lock-closed-outline" size={14} color={theme.colors.onSurfaceVariant} style={{ marginRight: 8, flexShrink: 0 }} />
            <Text style={styles.noteText}>
              Your report is confidential. The reported user will not know who submitted it.
            </Text>
          </View>

          {/* Submit */}
          <TouchableOpacity
            style={[styles.submitButton, !isValid && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            activeOpacity={isValid ? 0.8 : 1}
          >
            <Ionicons
              name="flag-outline"
              size={18}
              color={isValid ? theme.colors.white : theme.colors.onSurfaceVariant}
              style={{ marginRight: 8 }}
            />
            <Text style={[styles.submitButtonText, !isValid && styles.submitButtonTextDisabled]}>
              Submit Report
            </Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme.colors.surfaceContainerLow },
  scrollContent: {
    paddingHorizontal: theme.spacing.l,
    paddingTop: theme.spacing.m,
    paddingBottom: 48,
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

  /* Reported user */
  reportedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.card,
    padding: theme.spacing.m,
    marginBottom: theme.spacing.l,
  },
  reportedAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.surfaceContainerHighest,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.m,
  },
  reportedAvatarText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 16,
    fontWeight: '800',
    color: theme.colors.black,
  },
  reportedInfo: { flex: 1 },
  reportedName: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.body.fontSize,
    fontWeight: '700',
    color: theme.colors.black,
    marginBottom: 2,
  },
  reportedRole: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 12,
    color: theme.colors.onSurfaceVariant,
  },
  reportBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#FFDAD6',
    justifyContent: 'center',
    alignItems: 'center',
  },

  /* Sections */
  section: { marginBottom: theme.spacing.l },
  sectionLabel: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: theme.colors.onSurfaceVariant,
    marginBottom: theme.spacing.m,
  },

  /* Reason list */
  reasonList: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.card,
    overflow: 'hidden',
  },
  reasonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.m,
    paddingVertical: 16,
    gap: theme.spacing.m,
    backgroundColor: theme.colors.background,
  },
  reasonItemSelected: {
    backgroundColor: '#FFF9E0', // very light yellow tint
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: theme.colors.surfaceContainerHighest,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioOuterSelected: { borderColor: theme.colors.black },
  radioInner: {
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: theme.colors.black,
  },
  reasonText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.onSurfaceVariant,
  },
  reasonTextSelected: {
    fontWeight: '700',
    color: theme.colors.black,
  },

  /* Description */
  descriptionBox: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.card,
    padding: theme.spacing.m,
    minHeight: 140,
    marginBottom: 6,
  },
  descriptionBoxFocused: {
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.outlineVariant,
  },
  descriptionInput: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.black,
    lineHeight: 22,
    flex: 1,
  },
  charCount: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 12,
    color: theme.colors.onSurfaceVariant,
    textAlign: 'right',
  },

  /* Note */
  noteBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: theme.colors.surfaceContainerHighest,
    borderRadius: theme.borderRadius.card,
    padding: theme.spacing.m,
    marginBottom: theme.spacing.xl,
  },
  noteText: {
    flex: 1,
    fontFamily: theme.typography.fontFamily,
    fontSize: 13,
    color: theme.colors.onSurfaceVariant,
    lineHeight: 18,
  },

  /* Submit */
  submitButton: {
    flexDirection: 'row',
    backgroundColor: theme.colors.error,
    borderRadius: theme.borderRadius.button,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: theme.colors.error,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 6,
  },
  submitButtonDisabled: {
    backgroundColor: theme.colors.surfaceContainerHighest,
    shadowOpacity: 0,
    elevation: 0,
  },
  submitButtonText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.label.fontSize,
    fontWeight: theme.typography.label.fontWeight as any,
    color: theme.colors.white,
  },
  submitButtonTextDisabled: { color: theme.colors.onSurfaceVariant },

  /* Success state */
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  successIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 8,
  },
  successTitle: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 28,
    fontWeight: '800',
    color: theme.colors.black,
    marginBottom: theme.spacing.m,
    textAlign: 'center',
  },
  successBody: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.onSurfaceVariant,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  doneButton: {
    backgroundColor: theme.colors.black,
    borderRadius: theme.borderRadius.button,
    height: 56,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  doneButtonText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.label.fontSize,
    fontWeight: theme.typography.label.fontWeight as any,
    color: theme.colors.white,
  },
});
