// ============================================================
// Anchor — Welcome Screen
// ============================================================

import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { Button } from '../../components/ui';
import type { AuthStackParamList } from '../../navigation/AuthNavigator';

type WelcomeNav = NativeStackNavigationProp<AuthStackParamList, 'Welcome'>;

export default function WelcomeScreen() {
  const navigation = useNavigation<WelcomeNav>();

  return (
    <SafeAreaView className="flex-1 bg-deep-900">
      <View className="flex-1 px-6 justify-center">
        {/* Logo / Icon */}
        <View className="items-center mb-8">
          <View className="w-24 h-24 rounded-full bg-teal-500/20 items-center justify-center mb-6">
            <Text className="text-5xl">⚓</Text>
          </View>
          <Text className="text-4xl font-bold text-white tracking-tight">
            Anchor
          </Text>
        </View>

        {/* Tagline */}
        <View className="mb-12 px-4">
          <Text className="text-teal-200 text-lg text-center leading-7">
            Reach another human{' '}
            <Text className="text-teal-400 font-semibold">before</Text>
            {' '}you relapse
          </Text>
          <Text className="text-deep-300 text-sm text-center mt-3 leading-5">
            Anonymous peer support, available when you need it most.
            No name. No photo. No judgment.
          </Text>
        </View>

        {/* Actions */}
        <View className="space-y-4">
          <Button
            title="Start Anonymous"
            variant="primary"
            size="lg"
            className="w-full"
            onPress={() => navigation.navigate('Register')}
            accessibilityLabel="Start anonymous registration"
          />

          <Button
            title="I have an account"
            variant="outline"
            size="lg"
            className="w-full"
            onPress={() => navigation.navigate('Login')}
            accessibilityLabel="Login to existing account"
          />
        </View>

        {/* Footer */}
        <View className="mt-12 items-center">
          <Text className="text-deep-400 text-xs text-center leading-5">
            By continuing, you agree to our Terms of Service{'\n'}
            and Privacy Policy. Your identity stays anonymous.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}