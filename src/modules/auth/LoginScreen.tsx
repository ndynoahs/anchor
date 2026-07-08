// ============================================================
// Anchor — Login Screen
// ============================================================

import React, { useCallback } from 'react';
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
import { Button, Input } from '../../components/ui';
import { login as loginApi } from '../../services/auth';
import { loginSchema, type LoginFormData } from './auth.schemas';
import { useAuthStore } from '../../stores/authStore';
import type { AuthStackParamList } from '../../navigation/AuthNavigator';

type LoginNav = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

export default function LoginScreen() {
  const navigation = useNavigation<LoginNav>();
  const loginAction = useAuthStore((state) => state.login);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const loginMutation = useMutation({
    mutationFn: (data: LoginFormData) =>
      loginApi({
        email: data.email,
        password: data.password,
      }),
    onSuccess: (response) => {
      loginAction({
        userId: response.user.userId,
        anonymousUsername: response.user.anonymousUsername,
        avatarUrl: response.user.avatarUrl,
        timezone: 'UTC',
        isPremium: response.user.isPremium,
        streakDays: 0,
        longestStreak: 0,
        lastActiveAt: response.user.lastActiveAt,
        createdAt: response.user.lastActiveAt,
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
    onError: (error: { message?: string; code?: string; details?: Array<{ field: string; message: string }> }) => {
      // Handle field-level validation errors
      if (error.details && Array.isArray(error.details)) {
        error.details.forEach((detail) => {
          if (detail.field === 'email' || detail.field === 'password') {
            setError(detail.field, { message: detail.message });
          }
        });
      }
    },
  });

  const onSubmit = useCallback(
    (data: LoginFormData) => {
      loginMutation.mutate(data);
    },
    [loginMutation]
  );

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
            <View className="w-16 h-16 rounded-full bg-teal-500/20 items-center justify-center mb-4">
              <Text className="text-3xl">⚓</Text>
            </View>
            <Text className="text-3xl text-white font-bold mb-2">
              Welcome back
            </Text>
            <Text className="text-deep-300 text-sm text-center">
              Sign in to continue your journey
            </Text>
          </View>

          {/* Form */}
          <View className="mb-4">
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Email"
                  placeholder="you@example.com"
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

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Password"
                  placeholder="Enter your password"
                  secureTextEntry
                  autoCapitalize="none"
                  autoComplete="password"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={errors.password?.message}
                />
              )}
            />
          </View>

          {/* Error message */}
          {loginMutation.isError && !errors.email && !errors.password && (
            <View className="bg-red-900/30 rounded-xl p-3 mb-4 border border-red-500/30">
              <Text className="text-red-300 text-sm text-center">
                {(loginMutation.error as { message?: string })?.message ||
                  'Invalid email or password. Please try again.'}
              </Text>
            </View>
          )}

          {/* Submit */}
          <Button
            title={loginMutation.isPending ? 'Signing in...' : 'Sign In'}
            variant="primary"
            size="lg"
            className="w-full mb-4"
            loading={loginMutation.isPending}
            onPress={handleSubmit(onSubmit)}
            accessibilityLabel="Sign in to your account"
          />

          {/* Link to register */}
          <Button
            title="Start Anonymous — No account needed"
            variant="ghost"
            size="sm"
            className="w-full"
            onPress={() => navigation.navigate('Register')}
            accessibilityLabel="Go to anonymous registration"
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}