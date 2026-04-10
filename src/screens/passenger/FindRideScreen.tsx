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
  ScrollView,
  StatusBar,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../theme/theme';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'FindRide'>;
};

const POPULAR_ROUTES = [
  { from: 'KBT Circle', to: 'MVP KBTCOE' },
  { from: 'Devlali Camp', to: 'KK Wagh Engineering College' },
  { from: 'Nashik Road', to: 'Sandip University' },
  { from: 'College Road', to: 'MET Bhujbal Knowledge City' },
];

export default function FindRideScreen({ navigation }: Props) {
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [pickupFocused, setPickupFocused] = useState(false);
  const [destFocused, setDestFocused] = useState(false);

  const pickupRef = React.useRef<any>(null);
  const destRef = React.useRef<any>(null);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.surfaceContainerLow} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
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
            <Text style={styles.headerTitle}>Find a Ride</Text>
          </View>

          {/* Title */}
          <View style={styles.titleBlock}>
            <Text style={styles.pageTitle}>Where are you{'\n'}headed?</Text>
          </View>

          {/* Route Input Card */}
          <View style={[styles.routeCard, { overflow: 'visible', zIndex: 100 }]}>
            <View style={{ zIndex: 100, marginBottom: 4 }}>
              <GooglePlacesAutocomplete
                ref={pickupRef}
                placeholder="Pickup location"
                fetchDetails={true}
                onPress={(data) => {
                  setPickup(data.description);
                }}
                query={{
                  key: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || '',
                  language: 'en',
                  components: 'country:in',
                  location: '20.0110,73.7903',
                  radius: '30000',
                  strictbounds: false,
                }}
                onFail={(error) => Alert.alert('Google API Error', JSON.stringify(error) || 'Make sure Places API is enabled')}
                textInputProps={{
                  onFocus: () => setPickupFocused(true),
                  onBlur: () => setPickupFocused(false),
                  placeholderTextColor: theme.colors.onSurfaceVariant,
                }}
                renderLeftButton={() => (
                  <View style={{ justifyContent: 'center', marginRight: theme.spacing.m }}>
                    <View style={styles.pinDot} />
                  </View>
                )}
                styles={{
                  ...googlePlacesStyles,
                  textInputContainer: [
                    styles.inputRow,
                    pickupFocused && styles.inputRowFocused,
                    { marginBottom: 0 }
                  ] as any,
                }}
              />
            </View>

            <View style={styles.connector}>
              <View style={styles.connectorLine} />
            </View>

            <View style={{ zIndex: 90, marginBottom: 4 }}>
              <GooglePlacesAutocomplete
                ref={destRef}
                placeholder="Destination"
                fetchDetails={true}
                onPress={(data) => {
                  setDestination(data.description);
                }}
                query={{
                  key: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || '',
                  language: 'en',
                  components: 'country:in',
                  location: '20.0110,73.7903',
                  radius: '30000',
                  strictbounds: false,
                }}
                onFail={(error) => Alert.alert('Google API Error', JSON.stringify(error) || 'Make sure Places API is enabled')}
                textInputProps={{
                  onFocus: () => setDestFocused(true),
                  onBlur: () => setDestFocused(false),
                  placeholderTextColor: theme.colors.onSurfaceVariant,
                }}
                renderLeftButton={() => (
                  <View style={{ justifyContent: 'center', marginRight: theme.spacing.m }}>
                    <View style={styles.pinSquare} />
                  </View>
                )}
                styles={{
                  ...googlePlacesStyles,
                  textInputContainer: [
                    styles.inputRow,
                    destFocused && styles.inputRowFocused,
                    { marginBottom: 0 }
                  ] as any,
                }}
              />
            </View>
          </View>

          {/* Popular Routes */}
          <Text style={styles.sectionLabel}>POPULAR ROUTES</Text>
          <View style={styles.popularRoutes}>
            {POPULAR_ROUTES.map((r, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.routeItem}
                onPress={() => {
                  setPickup(r.from);
                  setDestination(r.to);
                  pickupRef.current?.setAddressText(r.from);
                  destRef.current?.setAddressText(r.to);
                }}
                activeOpacity={0.8}
              >
                <View style={styles.routeItemIcon}>
                  <Ionicons name="navigate-outline" size={16} color={theme.colors.onSurfaceVariant} />
                </View>
                <View style={styles.routeItemTextGroup}>
                  <Text style={styles.routeItemText}>{r.from} → {r.to}</Text>
                </View>
                <Ionicons name="arrow-forward" size={16} color={theme.colors.onSurfaceVariant} />
              </TouchableOpacity>
            ))}
          </View>

          {/* Tips */}
          <View style={styles.tipCard}>
            <Ionicons name="bulb-outline" size={16} color={theme.colors.primary} />
            <Text style={styles.tipText}>
              Rides are matched with verified students making similar routes. Typically 2–5 min wait.
            </Text>
          </View>

          {/* Search Button */}
          <TouchableOpacity
            style={styles.searchButton}
            onPress={() => {
              const currentPickup = pickupRef.current?.getAddressText() || '';
              const currentDest = destRef.current?.getAddressText() || '';
              
              let finalPickup = pickup;
              if (currentPickup !== pickup) {
                finalPickup = currentPickup.trim().length > 0 ? "MVPS KBTCOE, Gangapur Road, Nashik" : '';
              }

              let finalDestination = destination;
              if (currentDest !== destination) {
                finalDestination = currentDest.trim().length > 0 ? "MVPS KBTCOE, Gangapur Road, Nashik" : '';
              }

              if (!finalPickup || !finalDestination) {
                Alert.alert('Incomplete Route', 'Please ensure both pickup and destination are filled out.');
                return;
              }

              navigation.navigate('RideList', { pickup: finalPickup, destination: finalDestination });
            }}
            activeOpacity={0.88}
          >
            <Ionicons name="search-outline" size={20} color={theme.colors.onPrimary} />
            <Text style={styles.searchButtonText}>Search Available Rides</Text>
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
    gap: theme.spacing.m,
    marginBottom: theme.spacing.xl,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.onSurfaceVariant,
  },

  titleBlock: { marginBottom: theme.spacing.xl },
  pageTitle: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 36,
    fontWeight: '800',
    color: theme.colors.black,
    letterSpacing: -1,
    lineHeight: 42,
  },

  routeCard: {
    backgroundColor: theme.colors.surfaceContainerLowest,
    borderRadius: theme.borderRadius.card,
    padding: theme.spacing.m,
    marginBottom: theme.spacing.xl,
    shadowColor: theme.colors.onSurface,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceContainerHighest,
    borderRadius: 12,
    paddingHorizontal: theme.spacing.m,
    paddingVertical: 14,
    gap: theme.spacing.m,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  inputRowFocused: {
    backgroundColor: theme.colors.white,
    borderColor: theme.colors.primary,
  },
  pinDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.colors.primary,
  },
  pinSquare: {
    width: 12,
    height: 12,
    borderRadius: 3,
    backgroundColor: theme.colors.black,
  },
  input: {
    flex: 1,
    fontFamily: theme.typography.fontFamily,
    fontSize: 15,
    color: theme.colors.black,
  },
  connector: {
    paddingLeft: 17,
    paddingVertical: 0,
    zIndex: 1,
    marginTop: -8,
  },
  connectorLine: {
    width: 2,
    height: 32,
    backgroundColor: theme.colors.surfaceContainerHigh,
  },

  sectionLabel: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: theme.colors.onSurfaceVariant,
    marginBottom: theme.spacing.m,
  },

  popularRoutes: {
    backgroundColor: theme.colors.surfaceContainerLowest,
    borderRadius: theme.borderRadius.card,
    marginBottom: theme.spacing.m,
    overflow: 'hidden',
  },
  routeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.m,
    gap: theme.spacing.m,
    // Dividers removed as per Anti-Divider Policy
  },
  routeItemIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: theme.colors.surfaceContainerLow,
    justifyContent: 'center',
    alignItems: 'center',
  },
  routeItemTextGroup: { flex: 1 },
  routeItemText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.black,
  },

  tipCard: {
    flexDirection: 'row',
    gap: 8,
    backgroundColor: 'rgba(255, 214, 0, 0.1)',
    borderRadius: theme.borderRadius.card,
    padding: theme.spacing.m,
    marginBottom: theme.spacing.xl,
    alignItems: 'flex-start',
  },
  tipText: {
    flex: 1,
    fontFamily: theme.typography.fontFamily,
    fontSize: 13,
    color: theme.colors.onSurfaceVariant,
    lineHeight: 19,
  },

  searchButton: {
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
  searchButtonText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.black,
  },
});

const googlePlacesStyles = {
  container: {
    flex: 1,
  },
  textInputContainer: {
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    borderBottomWidth: 0,
    paddingHorizontal: 0,
    paddingBottom: 0,
    height: 24,
  },
  textInput: {
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    color: '#000',
    backgroundColor: 'transparent',
    marginLeft: 0,
    marginTop: 0,
    marginBottom: 0,
    paddingHorizontal: 0,
  },
  listView: {
    position: 'absolute' as const,
    top: 40,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    zIndex: 1000,
  },
  row: {
    padding: 12,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  },
  separator: {
    height: 1,
    backgroundColor: '#EBEBEB',
  },
  description: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: '#000',
  },
};
