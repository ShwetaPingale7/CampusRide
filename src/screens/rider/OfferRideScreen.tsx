import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../theme/theme';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import DateTimePicker from '@react-native-community/datetimepicker';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'OfferRide'>;
};

const SEAT_OPTIONS = [1, 2];
const GENDER_OPTIONS = ['Any', 'Female Only'];

const POPULAR_ROUTES = [
  { 
    from: 'KBT Circle', fromCoords: { lat: 20.0099, lng: 73.7681 },
    to: 'MVP KBTCOE', toCoords: { lat: 20.01127, lng: 73.76686 } 
  },
  { 
    from: 'Devlali Camp', fromCoords: { lat: 19.9512, lng: 73.8252 },
    to: 'KK Wagh Engineering College', toCoords: { lat: 20.0147, lng: 73.8208 } 
  },
  { 
    from: 'Nashik Road', fromCoords: { lat: 19.9540, lng: 73.8340 },
    to: 'Sandip University', toCoords: { lat: 19.9575, lng: 73.6827 } 
  },
  { 
    from: 'College Road', fromCoords: { lat: 20.0065, lng: 73.7635 },
    to: 'MET Bhujbal Knowledge City', toCoords: { lat: 20.0617, lng: 73.8441 } 
  },
];

export default function OfferRideScreen({ navigation }: Props) {
  const [startLocation, setStartLocation] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [seats, setSeats] = useState(1);
  const [genderPref, setGenderPref] = useState('Any');
  const [startFocused, setStartFocused] = useState(false);
  const [destFocused, setDestFocused] = useState(false);
  const [calculating, setCalculating] = useState(false);

  const [startCoords, setStartCoords] = useState<{lat: number, lng: number} | null>(null);
  const [destCoords, setDestCoords] = useState<{lat: number, lng: number} | null>(null);

  const [dateObj, setDateObj] = useState(new Date());
  const [showPicker, setShowPicker] = useState<'date' | 'time' | null>(null);

  const startRef = React.useRef<any>(null);
  const destRef = React.useRef<any>(null);

  const handleCalculateFare = async () => {
    const currentStart = startRef.current?.getAddressText() || '';
    const currentDest = destRef.current?.getAddressText() || '';

    let finalStartLocation = startLocation;
    let finalStartCoords = startCoords;

    if (currentStart !== startLocation) {
      if (currentStart.trim().length > 0) {
        finalStartLocation = "MVPS KBTCOE, Gangapur Road, Nashik";
        finalStartCoords = { lat: 20.01127, lng: 73.76686 };
      } else {
        finalStartLocation = '';
        finalStartCoords = null;
      }
    }

    let finalDestination = destination;
    let finalDestCoords = destCoords;

    if (currentDest !== destination) {
      if (currentDest.trim().length > 0) {
        finalDestination = "MVPS KBTCOE, Gangapur Road, Nashik";
        finalDestCoords = { lat: 20.01127, lng: 73.76686 };
      } else {
        finalDestination = '';
        finalDestCoords = null;
      }
    }

    if (!finalStartLocation || !finalDestination || !date || !time) {
      Alert.alert('Incomplete Route', 'Please ensure your start, destination, date, and time are filled out.');
      return;
    }

    setCalculating(true);
    
    let distanceKm = Number((Math.random() * 4 + 1.5).toFixed(1)); // Fallback
    let estTimeMin = Math.round(distanceKm * 4); // Fallback

    const apiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (apiKey && finalStartCoords && finalDestCoords) {
      try {
        const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${finalStartCoords.lat},${finalStartCoords.lng}&destinations=${finalDestCoords.lat},${finalDestCoords.lng}&key=${apiKey}`;
        const resp = await fetch(url);
        const data = await resp.json();
        
        if (data.status === 'OK' && data.rows[0].elements[0].status === 'OK') {
           const distMeters = data.rows[0].elements[0].distance.value;
           const durationSec = data.rows[0].elements[0].duration.value;
           distanceKm = distMeters / 1000;
           estTimeMin = Math.round(durationSec / 60);
        }
      } catch (err) {
        console.warn('Google Distance Matrix failed:', err);
      }
    }

    const suggestedFare = Math.round(15 + distanceKm * 5);

    setCalculating(false);

    navigation.navigate('FarePreview', {
      startLocation: finalStartLocation,
      destination: finalDestination,
      date,
      time,
      seats,
      genderPref,
      distance: distanceKm.toFixed(1),
      estTimeMin,
      suggestedFare,
    });
  };

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
            <Text style={styles.headerTitle}>Offer a Ride</Text>
          </View>

          {/* Title Block */}
          <View style={styles.titleBlock}>
            <Text style={styles.pageTitle}>Set up your{'\n'}route.</Text>
            <Text style={styles.pageSub}>Choose your path — others will find you.</Text>
          </View>

          {/* Route Card */}
          <View style={[styles.card, { overflow: 'visible', zIndex: 100 }]}>
            <Text style={styles.sectionLabel}>ROUTE</Text>

            <View style={{ zIndex: 100, marginBottom: 4 }}>
              <GooglePlacesAutocomplete
                ref={startRef}
                placeholder="Starting point"
                fetchDetails={true}
                onPress={(data, details = null) => {
                  setStartLocation(data.description);
                  if (details?.geometry?.location) {
                    setStartCoords({ lat: details.geometry.location.lat, lng: details.geometry.location.lng });
                  }
                }}
                query={{
                  key: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || '',
                  language: 'en',
                  components: 'country:in',
                  location: '20.0110,73.7903', // Nashik region bias
                  radius: '30000', // 30km radius bias
                  strictbounds: false,
                }}
                onFail={(error) => Alert.alert('Google API Error', JSON.stringify(error) || 'Make sure Places API is enabled')}
                textInputProps={{
                  onFocus: () => setStartFocused(true),
                  onBlur: () => setStartFocused(false),
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
                    startFocused && styles.inputRowFocused,
                    { marginBottom: 0 }
                  ] as any,
                }}
              />
            </View>

            <View style={styles.routeLine} />

            <View style={{ zIndex: 90, marginBottom: 4 }}>
              <GooglePlacesAutocomplete
                ref={destRef}
                placeholder="Destination"
                fetchDetails={true}
                onPress={(data, details = null) => {
                  setDestination(data.description);
                  if (details?.geometry?.location) {
                    setDestCoords({ lat: details.geometry.location.lat, lng: details.geometry.location.lng });
                  }
                }}
                query={{
                  key: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || '',
                  language: 'en',
                  components: 'country:in',
                  location: '20.0110,73.7903', // Nashik region bias
                  radius: '30000', // 30km radius bias
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
                  setStartLocation(r.from);
                  setDestination(r.to);
                  setStartCoords(r.fromCoords);
                  setDestCoords(r.toCoords);
                  startRef.current?.setAddressText(r.from);
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

          {/* Date & Time */}
          <View style={styles.rowTwoCards}>
            <TouchableOpacity 
              style={styles.halfCard} 
              activeOpacity={0.8} 
              onPress={() => setShowPicker('date')}
            >
              <Ionicons name="calendar-outline" size={20} color={theme.colors.onSurfaceVariant} />
              <Text style={styles.halfCardLabel}>DATE</Text>
              <Text style={[styles.halfCardValue, !date && { color: theme.colors.onSurfaceVariant }]}>
                {date || 'DD/MM/YYYY'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.halfCard} 
              activeOpacity={0.8} 
              onPress={() => setShowPicker('time')}
            >
              <Ionicons name="time-outline" size={20} color={theme.colors.onSurfaceVariant} />
              <Text style={styles.halfCardLabel}>TIME</Text>
              <Text style={[styles.halfCardValue, !time && { color: theme.colors.onSurfaceVariant }]}>
                {time || 'HH:MM AM'}
              </Text>
            </TouchableOpacity>
          </View>

          {showPicker && (
            <DateTimePicker
              value={dateObj}
              mode={showPicker}
              minimumDate={new Date()}
              display="default"
              onChange={(event, selectedDate) => {
                setShowPicker(null);
                if (selectedDate) {
                  setDateObj(selectedDate);
                  setDate(
                    selectedDate.toLocaleDateString([], {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                    })
                  );
                  setTime(
                    selectedDate.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  );
                }
              }}
            />
          )}

          {/* Seats */}
          <View style={styles.card}>
            <Text style={styles.sectionLabel}>AVAILABLE SEATS</Text>
            <Text style={styles.sectionSub}>Two-wheelers: max 2 seats</Text>
            <View style={styles.chipRow}>
              {SEAT_OPTIONS.map((s) => (
                <TouchableOpacity
                  key={s}
                  style={[styles.chip, seats === s && styles.chipActive]}
                  onPress={() => setSeats(s)}
                  activeOpacity={0.8}
                >
                  <Ionicons name="person" size={16} color={seats === s ? theme.colors.onPrimary : theme.colors.onSurfaceVariant} />
                  <Text style={[styles.chipText, seats === s && styles.chipTextActive]}>
                    {s} Seat{s > 1 ? 's' : ''}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Gender Preference */}
          <View style={styles.card}>
            <Text style={styles.sectionLabel}>PASSENGER PREFERENCE</Text>
            <View style={styles.chipRow}>
              {GENDER_OPTIONS.map((opt) => (
                <TouchableOpacity
                  key={opt}
                  style={[styles.chip, genderPref === opt && styles.chipActive]}
                  onPress={() => setGenderPref(opt)}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name={opt === 'Female Only' ? 'female-outline' : 'people-outline'}
                    size={16}
                    color={genderPref === opt ? theme.colors.onPrimary : theme.colors.onSurfaceVariant}
                  />
                  <Text style={[styles.chipText, genderPref === opt && styles.chipTextActive]}>{opt}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Fare info hint */}
          <View style={styles.fareHint}>
            <Ionicons name="information-circle-outline" size={16} color={theme.colors.onSurfaceVariant} />
            <Text style={styles.fareHintText}>
              Fare is auto-calculated based on distance. Campus rides typically range ₹20–₹60.
            </Text>
          </View>

          {/* CTA */}
          <TouchableOpacity
            style={[styles.primaryButton, calculating && { opacity: 0.7 }]}
            onPress={handleCalculateFare}
            activeOpacity={0.88}
            disabled={calculating}
          >
            {calculating ? (
              <ActivityIndicator color={theme.colors.onPrimary} />
            ) : (
              <>
                <Ionicons name="cash-outline" size={20} color={theme.colors.onPrimary} />
                <Text style={styles.buttonText}>Calculate Fare & Preview</Text>
              </>
            )}
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
    gap: theme.spacing.m,
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
    marginBottom: 8,
  },
  pageSub: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 15,
    color: theme.colors.onSurfaceVariant,
  },

  card: {
    backgroundColor: theme.colors.background,
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
    marginBottom: 4,
  },
  sectionSub: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 12,
    color: theme.colors.onSurfaceVariant,
    marginBottom: theme.spacing.m,
  },

  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceContainerHighest,
    borderRadius: 12,
    paddingHorizontal: theme.spacing.m,
    paddingVertical: 14,
    gap: theme.spacing.m,
    marginBottom: 4,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  inputRowFocused: {
    backgroundColor: theme.colors.white,
    borderColor: theme.colors.black,
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
  routeLine: {
    width: 2,
    height: 32, // Adjusted height for dropdown accommodation
    backgroundColor: theme.colors.surfaceContainerHighest,
    marginLeft: 17,
    marginVertical: -8,
    zIndex: 1,
  },
  connectorLine: {
    width: 2,
    height: 32,
    backgroundColor: theme.colors.surfaceContainerHigh,
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
  input: {
    flex: 1,
    fontFamily: theme.typography.fontFamily,
    fontSize: 15,
    color: theme.colors.black,
  },
  rowTwoCards: {
    flexDirection: 'row',
    gap: theme.spacing.m,
    marginBottom: theme.spacing.m,
  },
  halfCard: {
    flex: 1,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.card,
    padding: theme.spacing.m,
    gap: 4,
  },
  halfCardLabel: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: theme.colors.onSurfaceVariant,
  },
  halfCardValue: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.black,
  },

  chipRow: {
    flexDirection: 'row',
    gap: theme.spacing.s,
    marginTop: 4,
  },
  chip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surfaceContainerHighest,
    borderRadius: theme.borderRadius.button,
    paddingVertical: 12,
    gap: 6,
  },
  chipActive: { backgroundColor: theme.colors.black },
  chipText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.onSurfaceVariant,
  },
  chipTextActive: { color: theme.colors.white },

  fareHint: {
    flexDirection: 'row',
    gap: 8,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.card,
    padding: theme.spacing.m,
    marginBottom: theme.spacing.m,
    alignItems: 'flex-start',
  },
  fareHintText: {
    flex: 1,
    fontFamily: theme.typography.fontFamily,
    fontSize: 13,
    color: theme.colors.onSurfaceVariant,
    lineHeight: 19,
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
  buttonText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.onPrimary,
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
