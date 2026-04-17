import { Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { supabase } from './supabase';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});


export async function registerForPushNotificationsAsync(userId: string) {
  let token;

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  // Skip expo-notifications remote push registration if we are inside Expo Go
  const isExpoGo = Constants.appOwnership === 'expo' || Constants.executionEnvironment === 'storeClient';

  if (Device.isDevice && !isExpoGo) {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        console.log('Failed to get push token for push notification!');
        return;
      }
      
      // Get the Expo Push Token for the device
      token = await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig?.extra?.eas?.projectId,
      });
    } catch (e) {
      console.log('Push token fetch failed or unsupported:', e);
    }
    
    // Save this token to your backend!
    if (token && token.data) {
      await supabase
        .from('profiles')
        .update({ push_token: token.data })
        .eq('id', userId);
    }
  } else {
    console.log('Must use physical device for Push Notifications');
  }

  return token?.data;
}

// Helper function to trigger a push notification to another user directly from the app
export async function sendPushNotification(targetUserId: string, title: string, body: string, data = {}) {
  // 1. Fetch the target user's push token from Supabase
  const { data: profile } = await supabase
    .from('profiles')
    .select('push_token')
    .eq('id', targetUserId)
    .single();

  const pushToken = profile?.push_token;
  if (!pushToken) return; // User hasn't registered for notifications

  // 2. Send the push notification via Expo Push API
  const message = {
    to: pushToken,
    sound: 'default',
    title: title,
    body: body,
    data: data,
  };

  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });
}

// Local scheduling for reminders (like 30 mins before a ride)
export async function scheduleUpcomingRideReminder(title: string, body: string, rideDateString: string) {
  const rideDate = new Date(rideDateString);
  const triggerTime = new Date(rideDate.getTime() - 30 * 60000); // 30 minutes before

  if (triggerTime <= new Date()) {
    return; // Already past that time, so don't schedule
  }

  await Notifications.scheduleNotificationAsync({
    content: { title, body, sound: true },
    trigger: { date: triggerTime, type: Notifications.SchedulableTriggerInputTypes.DATE },
  });
}

// Local scheduling for Day-Of alert (e.g. at 7:00 AM on the day of the ride)
export async function scheduleDayOfRideAlert(title: string, body: string, rideDateString: string) {
  const rideDate = new Date(rideDateString);
  const triggerTime = new Date(rideDate.getFullYear(), rideDate.getMonth(), rideDate.getDate(), 7, 0, 0); // 7:00 AM day-of

  if (triggerTime <= new Date()) {
    return; // Already past 7AM today
  }

  await Notifications.scheduleNotificationAsync({
    content: { title, body, sound: true },
    trigger: { date: triggerTime, type: Notifications.SchedulableTriggerInputTypes.DATE },
  });
}

// Local scheduling for "Ride starting soon" alert (e.g., 10 minutes prior)
export async function scheduleRideStartingSoonAlert(title: string, body: string, rideDateString: string) {
  const rideDate = new Date(rideDateString);
  const triggerTime = new Date(rideDate.getTime() - 10 * 60000); // 10 mins before

  if (triggerTime <= new Date()) return;

  await Notifications.scheduleNotificationAsync({
    content: { title, body, sound: true },
    trigger: { date: triggerTime, type: Notifications.SchedulableTriggerInputTypes.DATE },
  });
}

// Local scheduling for "Auto-cancel warning" (e.g., if not started 5 mins after set time)
export async function scheduleAutoCancelWarning(title: string, body: string, rideDateString: string) {
  const rideDate = new Date(rideDateString);
  const triggerTime = new Date(rideDate.getTime() + 5 * 60000); // 5 mins AFTER start time

  if (triggerTime <= new Date()) return;

  await Notifications.scheduleNotificationAsync({
    content: { title, body, sound: true },
    trigger: { date: triggerTime, type: Notifications.SchedulableTriggerInputTypes.DATE },
  });
}

