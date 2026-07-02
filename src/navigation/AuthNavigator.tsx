// ============================================================
// Anchor — Auth Stack Navigator
// ============================================================

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import WelcomeScreen from '../modules/auth/WelcomeScreen';
import RegisterScreen from '../modules/auth/RegisterScreen';
import LoginScreen from '../modules/auth/LoginScreen';

export type AuthStackParamList = {
  Welcome: undefined;
  Register: undefined;
  Login: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#0f1e2e' },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{
          headerShown: true,
          headerTitle: '',
          headerStyle: { backgroundColor: '#0f1e2e' },
          headerTintColor: '#b3c2d6',
          headerShadowVisible: false,
          headerBackTitle: 'Back',
        }}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          headerShown: true,
          headerTitle: '',
          headerStyle: { backgroundColor: '#0f1e2e' },
          headerTintColor: '#b3c2d6',
          headerShadowVisible: false,
          headerBackTitle: 'Back',
        }}
      />
    </Stack.Navigator>
  );
}