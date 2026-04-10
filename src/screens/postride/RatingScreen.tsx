import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../theme/theme';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { sendPushNotification } from '../../services/pushNotifications';
import { useAuth } from '../../services/AuthContext';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Rating'>;
};

export default function RatingScreen({ navigation }: Props) {
  const { session } = useAuth();
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState('');
  const [commentFocused, setCommentFocused] = useState(false);

  const displayRating = hovered || rating;

  const handleSubmitRating = async () => {
    if (rating === 0) return;
    
    // Alert the other party they received a rating!
    if (session?.user?.id) {
       await sendPushNotification(
         session.user.id,
         'New Rating Received! ⭐',
         `You just received a ${rating}-star rating for your recent ride! Keep up the great work.`
       );
    }
    
    navigation.navigate('RideSummary');
  };

  const LABELS: Record<number, string> = {
    1: 'Poor',
    2: 'Fair',
    3: 'Good',
    4: 'Great',
    5: 'Excellent!',
  };

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
            <Text style={styles.headerTitle}>Rate your ride</Text>
            <Text style={styles.headerSub}>Your feedback keeps our community safe</Text>
          </View>

          {/* Person Card */}
          <View style={styles.personCard}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>AV</Text>
            </View>
            <View style={styles.personInfo}>
              <Text style={styles.personName}>Arjun Verma</Text>
              <Text style={styles.personRole}>Your Rider</Text>
            </View>
            <View style={styles.ridesCountBadge}>
              <Text style={styles.ridesCountText}>42 rides</Text>
            </View>
          </View>

          {/* Stars */}
          <View style={styles.starsSection}>
            <View style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity
                  key={star}
                  onPress={() => setRating(star)}
                  onPressIn={() => setHovered(star)}
                  onPressOut={() => setHovered(0)}
                  activeOpacity={0.7}
                  style={styles.starButton}
                >
                  <Ionicons
                    name={star <= displayRating ? 'star' : 'star-outline'}
                    size={44}
                    color={star <= displayRating ? theme.colors.primary : theme.colors.surfaceContainerHighest}
                  />
                </TouchableOpacity>
              ))}
            </View>
            {displayRating > 0 && (
              <Text style={styles.ratingLabel}>{LABELS[displayRating]}</Text>
            )}
          </View>

          {/* Comment Input */}
          <View style={[styles.commentBox, commentFocused && styles.commentBoxFocused]}>
            <TextInput
              style={styles.commentInput}
              placeholder="Add a comment (optional)"
              placeholderTextColor={theme.colors.onSurfaceVariant}
              multiline
              numberOfLines={4}
              value={comment}
              onChangeText={setComment}
              onFocus={() => setCommentFocused(true)}
              onBlur={() => setCommentFocused(false)}
              textAlignVertical="top"
            />
          </View>

          {/* Report issue */}
          <TouchableOpacity style={styles.reportRow}>
            <Ionicons name="flag-outline" size={16} color={theme.colors.onSurfaceVariant} style={{ marginRight: 8 }} />
            <Text style={styles.reportText}>Report an issue with this ride</Text>
          </TouchableOpacity>

          {/* Submit */}
          <TouchableOpacity
            style={[styles.submitButton, rating === 0 && styles.submitButtonDisabled]}
            onPress={handleSubmitRating}
            activeOpacity={rating > 0 ? 0.8 : 1}
          >
            <Ionicons
              name="checkmark-circle-outline"
              size={20}
              color={rating > 0 ? theme.colors.onPrimary : theme.colors.onSurfaceVariant}
              style={{ marginRight: 8 }}
            />
            <Text style={[styles.submitButtonText, rating === 0 && styles.submitButtonTextDisabled]}>
              Submit Rating
            </Text>
          </TouchableOpacity>

          {/* Skip */}
          <TouchableOpacity
            style={styles.skipRow}
            onPress={() => navigation.navigate('RideSummary')}
          >
            <Text style={styles.skipText}>Skip for now</Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme.colors.background },
  scrollContent: {
    paddingHorizontal: theme.spacing.l,
    paddingTop: theme.spacing.xxl,
    paddingBottom: 48,
  },

  /* Header */
  header: { marginBottom: theme.spacing.xl },
  headerTitle: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 32,
    fontWeight: '800',
    color: theme.colors.black,
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  headerSub: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.onSurfaceVariant,
    lineHeight: 22,
  },

  /* Person Card */
  personCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceContainerLow,
    borderRadius: theme.borderRadius.card,
    padding: theme.spacing.m,
    marginBottom: theme.spacing.xl,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.m,
  },
  avatarText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.black,
  },
  personInfo: { flex: 1 },
  personName: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.body.fontSize,
    fontWeight: '700',
    color: theme.colors.black,
    marginBottom: 2,
  },
  personRole: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 13,
    color: theme.colors.onSurfaceVariant,
  },
  ridesCountBadge: {
    backgroundColor: theme.colors.surfaceContainerHighest,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  ridesCountText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.onSurfaceVariant,
  },

  /* Stars */
  starsSection: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  starsRow: {
    flexDirection: 'row',
    gap: theme.spacing.s,
    marginBottom: 12,
  },
  starButton: {
    padding: 4,
  },
  ratingLabel: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.black,
  },

  /* Comment */
  commentBox: {
    backgroundColor: theme.colors.surfaceContainerHighest,
    borderRadius: theme.borderRadius.card,
    padding: theme.spacing.m,
    minHeight: 120,
    marginBottom: theme.spacing.m,
  },
  commentBoxFocused: {
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.outlineVariant,
  },
  commentInput: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.black,
    lineHeight: 22,
    flex: 1,
  },

  /* Report */
  reportRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.m,
    marginBottom: theme.spacing.xl,
  },
  reportText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 14,
    color: theme.colors.onSurfaceVariant,
  },

  /* Submit */
  submitButton: {
    flexDirection: 'row',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.button,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.m,
    shadowColor: theme.colors.onSurface,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 24,
    elevation: 4,
  },
  submitButtonDisabled: {
    backgroundColor: theme.colors.surfaceContainerHighest,
  },
  submitButtonText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.label.fontSize,
    fontWeight: theme.typography.label.fontWeight as any,
    color: theme.colors.onPrimary,
  },
  submitButtonTextDisabled: {
    color: theme.colors.onSurfaceVariant,
  },

  /* Skip */
  skipRow: {
    alignItems: 'center',
    paddingVertical: theme.spacing.s,
  },
  skipText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.onSurfaceVariant,
  },
});
