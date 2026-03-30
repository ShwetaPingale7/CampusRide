import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SplashScreen from '../screens/auth/SplashScreen';
import WelcomeScreen from '../screens/auth/WelcomeScreen';
import SignUpScreen from '../screens/auth/SignUpScreen';
import OTPScreen from '../screens/auth/OTPScreen';
import ProfileSetupScreen from '../screens/auth/ProfileSetupScreen';
import IDUploadScreen from '../screens/auth/IDUploadScreen';
import PendingApprovalScreen from '../screens/auth/PendingApprovalScreen';

export type AuthStackParamList = {
  Splash: undefined;
  Welcome: undefined;
  SignUp: undefined;
  OTP: undefined;
  ProfileSetup: undefined;
  IDUpload: undefined;
  PendingApproval: undefined;
};

const AuthStack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthNavigator() {
  return (
    <AuthStack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false,
      }}
    >
      <AuthStack.Screen name="Splash" component={SplashScreen} />
      <AuthStack.Screen name="Welcome" component={WelcomeScreen} />
      <AuthStack.Screen name="SignUp" component={SignUpScreen} />
      <AuthStack.Screen name="OTP" component={OTPScreen} />
      <AuthStack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
      <AuthStack.Screen name="IDUpload" component={IDUploadScreen} />
      <AuthStack.Screen name="PendingApproval" component={PendingApprovalScreen} />
    </AuthStack.Navigator>
  );
}
