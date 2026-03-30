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

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'EditProfile'>;
};

const GENDER_OPTIONS = ['Female', 'Male', 'Prefer not to say'];

export default function EditProfileScreen({ navigation }: Props) {
  const [name, setName] = useState('Anjali Sharma');
  const [phone, setPhone] = useState('98XXXXXXXX');
  const [gender, setGender] = useState('Female');
  const [nameFocused, setNameFocused] = useState(false);
  const [phoneFocused, setPhoneFocused] = useState(false);

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
            <Text style={styles.headerTitle}>Edit Profile</Text>
          </View>

          {/* Avatar Upload */}
          <View style={styles.avatarSection}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>A</Text>
              </View>
              <TouchableOpacity style={styles.cameraButton}>
                <Ionicons name="camera" size={16} color={theme.colors.black} />
              </TouchableOpacity>
            </View>
            <Text style={styles.avatarHint}>Tap to change photo</Text>
          </View>

          {/* Form */}
          <View style={styles.formGroup}>
            <Text style={styles.fieldLabel}>Full Name</Text>
            <View style={[styles.inputWrapper, nameFocused && styles.inputWrapperFocused]}>
              <Ionicons name="person-outline" size={18} color={theme.colors.onSurfaceVariant} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Full name"
                placeholderTextColor={theme.colors.onSurfaceVariant}
                onFocus={() => setNameFocused(true)}
                onBlur={() => setNameFocused(false)}
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.fieldLabel}>Phone Number</Text>
            <View style={[styles.inputWrapper, phoneFocused && styles.inputWrapperFocused]}>
              <Ionicons name="call-outline" size={18} color={theme.colors.onSurfaceVariant} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                placeholder="Phone number"
                placeholderTextColor={theme.colors.onSurfaceVariant}
                keyboardType="phone-pad"
                onFocus={() => setPhoneFocused(true)}
                onBlur={() => setPhoneFocused(false)}
              />
            </View>
          </View>

          {/* College — read only */}
          <View style={styles.formGroup}>
            <View style={styles.labelRow}>
              <Text style={styles.fieldLabel}>College</Text>
              <View style={styles.readOnlyBadge}>
                <Ionicons name="lock-closed" size={10} color={theme.colors.onSurfaceVariant} style={{ marginRight: 4 }} />
                <Text style={styles.readOnlyText}>Read only</Text>
              </View>
            </View>
            <View style={[styles.inputWrapper, styles.inputWrapperReadOnly]}>
              <Ionicons name="school-outline" size={18} color={theme.colors.onSurfaceVariant} style={styles.inputIcon} />
              <Text style={styles.inputReadOnly}>Pune Institute of Technology</Text>
            </View>
          </View>

          {/* Gender Selector */}
          <View style={styles.formGroup}>
            <Text style={styles.fieldLabel}>Gender</Text>
            <View style={styles.genderRow}>
              {GENDER_OPTIONS.map((opt) => (
                <TouchableOpacity
                  key={opt}
                  style={[styles.genderChip, gender === opt && styles.genderChipActive]}
                  onPress={() => setGender(opt)}
                >
                  <Text style={[styles.genderChipText, gender === opt && styles.genderChipTextActive]}>
                    {opt}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Save Button */}
          <TouchableOpacity
            style={styles.saveButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="checkmark-circle-outline" size={20} color={theme.colors.onPrimary} style={{ marginRight: 8 }} />
            <Text style={styles.saveButtonText}>Save Changes</Text>
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

  /* Avatar */
  avatarSection: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: theme.spacing.s,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 36,
    fontWeight: '800',
    color: theme.colors.black,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.colors.surfaceContainerLow,
  },
  avatarHint: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 13,
    color: theme.colors.onSurfaceVariant,
  },

  /* Form */
  formGroup: { marginBottom: theme.spacing.l },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.s,
    gap: theme.spacing.s,
  },
  fieldLabel: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
    color: theme.colors.black,
    marginBottom: theme.spacing.s,
  },
  readOnlyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceContainerHighest,
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginBottom: theme.spacing.s,
  },
  readOnlyText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.onSurfaceVariant,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.card,
    paddingHorizontal: theme.spacing.m,
    height: 58,
  },
  inputWrapperFocused: {
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.outlineVariant,
  },
  inputWrapperReadOnly: {
    backgroundColor: theme.colors.surfaceContainerHighest,
  },
  inputIcon: { marginRight: theme.spacing.s },
  input: {
    flex: 1,
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.black,
  },
  inputReadOnly: {
    flex: 1,
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.onSurfaceVariant,
  },

  /* Gender */
  genderRow: {
    flexDirection: 'row',
    gap: theme.spacing.s,
    flexWrap: 'wrap',
  },
  genderChip: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.button,
    paddingHorizontal: theme.spacing.m,
    paddingVertical: 12,
    flex: 1,
    alignItems: 'center',
  },
  genderChipActive: { backgroundColor: theme.colors.primary },
  genderChipText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.onSurfaceVariant,
  },
  genderChipTextActive: { color: theme.colors.black },

  /* Save */
  saveButton: {
    flexDirection: 'row',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.button,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing.s,
    shadowColor: theme.colors.onSurface,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 24,
    elevation: 4,
  },
  saveButtonText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.label.fontSize,
    fontWeight: theme.typography.label.fontWeight as any,
    color: theme.colors.onPrimary,
  },
});
