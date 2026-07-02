// ============================================================
// Anchor — Register Screen
// ============================================================

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Button, Input, LoadingSpinner } from '../../components/ui';
import { register as registerApi } from '../../services/auth';
import { registerSchema, type RegisterFormData } from './auth.schemas';
import { useAuthStore } from '../../stores/authStore';
import { COLORS } from '../../constants';
import type { AuthStackParamList } from '../../navigation/AuthNavigator';
import { generateAnonymousUsername } from '../../utils';

type RegisterNav = NativeStackNavigationProp<AuthStackParamList, 'Register'>;

export default function RegisterScreen() {
  const navigation = useNavigation<RegisterNav>();
  const loginAction = useAuthStore((state) => state.register);
  const [generatedUsername, setGeneratedUsername] = useState('');
  const [showUsername, setShowUsername] = useState(false);

  // Generate a username on mount
  useEffect(() => {
    setGeneratedUsername(generateAnonymousUsername());
    const timer = setTimeout(() => setShowUsername(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
    },
  });

  const registerMutation = useMutation({
    mutationFn: (data: RegisterFormData) =>
      registerApi({
        email: data.email || undefined,
        timezone: data.timezone || 'UTC',
      }),
    onSuccess: (response) => {
      loginAction({
        userId: response.user.userId,
        anonymousUsername: response.user.anonymousUsername,
        avatarUrl: response.user.avatarUrl,
        timezone: response.user.timezone,
        isPremium: false,
        streakDays: 0,
        longestStreak: 0,
        createdAt: response.user.createdAt,
        lastActiveAt: response.user.createdAt,
        preferences: {
          darkMode: true,
          notificationsEnabled: true,
        },
      });
      // Navigate to main app
      navigation.getParent()?.reset({
        index: 0,
        routes: [{ name: 'Main' }],
      });
    },
    onError: (error: { message?: string; code?: string }) => {
      // Error is handled via the form
    },
  });

  const onSubmit = useCallback(
    (data: RegisterFormData) => {
      registerMutation.mutate(data);
    },
    [registerMutation]
  );

  if (registerMutation.isPending) {
    return (
      <SafeAreaView className="flex-1 bg-deep-900">
        <LoadingSpinner
          fullScreen
          message="Creating your anonymous account..."
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-deep-900">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          className="flex-1 px-6"
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View className="items-center mb-8">
            <Text className="text-3xl text-white font-bold mb-2">
              Join Anonymous
            </Text>
            <Text className="text-deep-300 text-sm text-center">
              No personal information required.{'\n'}Stay anonymous, always.
            </Text>
          </View>

          {/* Animated username reveal */}
          {showUsername && (
            <View className="bg-deep-800 rounded-2xl p-4 mb-6 border border-teal-500/20">
              <Text className="text-deep-300 text-xs mb-1">
                Your anonymous username
              </Text>
              <Text className="text-teal-400 text-xl font-semibold tracking-wide">
                @{generatedUsername}
              </Text>
              <Text className="text-deep-400 text-xs mt-1">
                You can change this later in your profile
              </Text>
            </View>
          )}

          {/* Form */}
          <View className="mb-6">
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Email (optional)"
                  placeholder="you@example.com"
                  helperText="Add email to recover your account"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={errors.email?.message}
                />
              )}
            />
          </View>

          {/* Error message */}
          {registerMutation.isError && (
            <View className="bg-red-900/30 rounded-xl p-3 mb-4 border border-red-500/30">
              <Text className="text-red-300 text-sm text-center">
                {(registerMutation.error as { message?: string })?.message ||
                  'Registration failed. Please try again.'}
              </Text>
            </View>
          )}

          {/* Submit */}
          <Button
            title="Join Anonymous"
            variant="primary"
            size="lg"
            className="w-full mb-4"
            onPress={handleSubmit(onSubmit)}
            accessibilityLabel="Complete anonymous registration"
          />

          {/* Back to login */}
          <Button
            title="Already have an account? Sign In"
            variant="ghost"
            size="sm"
            className="w-full"
            onPress={() => navigation.navigate('Login')}
            accessibilityLabel="Go to login"
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}