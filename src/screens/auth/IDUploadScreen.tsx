import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { theme } from '../../theme/theme';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'IDUpload'>;
};

export default function IDUploadScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.safeArea}>
        
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Campus Verification</Text>
          <Text style={styles.subtitle}>Upload your student ID for safety verification. We review this manually.</Text>
        </View>

        <View style={styles.content}>
          <TouchableOpacity style={styles.uploadCard}>
            <View style={styles.iconContainer}>
              <Ionicons name="camera-outline" size={40} color={theme.colors.onSurfaceVariant} />
            </View>
            <Text style={styles.uploadTitle}>Tap to scan Student ID</Text>
            <Text style={styles.uploadSubtitle}>Make sure your name and picture are clearly visible</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={() => navigation.navigate('PendingApproval')}
        >
          <Text style={styles.buttonText}>Submit ID</Text>
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
  },
  header: {
    marginBottom: theme.spacing.xl,
  },
  title: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.headline.fontSize,
    fontWeight: theme.typography.headline.fontWeight as any,
    letterSpacing: theme.typography.headline.letterSpacing,
    color: theme.colors.black,
    marginBottom: theme.spacing.s,
  },
  subtitle: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.onSurfaceVariant,
    lineHeight: theme.typography.body.lineHeight,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  uploadCard: {
    backgroundColor: theme.colors.surfaceContainerLow,
    borderRadius: theme.borderRadius.card,
    padding: theme.spacing.xxl,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: theme.colors.outlineVariant,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.surfaceContainerHighest,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.l,
  },
  uploadTitle: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.title.fontSize,
    fontWeight: theme.typography.title.fontWeight as any,
    color: theme.colors.black,
    marginBottom: theme.spacing.s,
    textAlign: 'center',
  },
  uploadSubtitle: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.onSurfaceVariant,
    textAlign: 'center',
  },
  primaryButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.button,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
    shadowColor: theme.colors.onSurface,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 24,
    elevation: 4,
  },
  buttonText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.label.fontSize,
    fontWeight: theme.typography.label.fontWeight as any,
    color: theme.colors.onPrimary,
  },
});
