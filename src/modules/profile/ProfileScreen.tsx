import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, Avatar, Button, Badge, LoadingSpinner, ErrorState } from '../../components/ui';
import { useAuthStore } from '../../stores/authStore';
import { getUserProfile } from '../../services/profile';

export default function ProfileScreen() {
  const navigation: any = useNavigation();
  const queryClient = useQueryClient();
  const { user, logout } = useAuthStore();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const userId = user?.userId || '';
  const { data: profile, isLoading, isError, refetch } = useQuery({
    queryKey: ['profile', userId],
    queryFn: () => getUserProfile(userId),
    enabled: !!userId,
  });

  const handleLogout = async () => {
    await logout();
    queryClient.clear();
  };

  if (isLoading) return <SafeAreaView className="flex-1 bg-deep-900"><LoadingSpinner fullScreen message="Loading profile..." /></SafeAreaView>;
  if (isError || !profile) return <SafeAreaView className="flex-1 bg-deep-900"><ErrorState title="Couldn't load profile" onRetry={() => refetch()} /></SafeAreaView>;

  return (
    <SafeAreaView className="flex-1 bg-deep-900" edges={['top']}>
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 32 }}>
        {/* Profile header */}
        <View className="items-center py-8 px-4">
          <Avatar username={profile.anonymousUsername} size="xl" className="mb-4" />
          <Text className="text-white text-2xl font-bold">{profile.anonymousUsername}</Text>
          {profile.bio && <Text className="text-deep-300 text-sm mt-1 text-center">{profile.bio}</Text>}
        </View>

        {/* Stats */}
        <View className="flex-row px-4 mb-6">
          <Card className="flex-1 mr-2"><View className="items-center py-3"><Text className="text-2xl">🔥</Text><Text className="text-white text-lg font-bold">{profile.streakDays}</Text><Text className="text-deep-400 text-xs">Day Streak</Text></View></Card>
          <Card className="flex-1 ml-2"><View className="items-center py-3"><Text className="text-2xl">🤝</Text><Text className="text-white text-lg font-bold">{profile.isPremium ? 'Premium' : 'Free'}</Text><Text className="text-deep-400 text-xs">Account</Text></View></Card>
        </View>

        {profile.soberSince && (
          <Card className="mx-4 mb-4">
            <View className="flex-row items-center py-2">
              <Text className="text-2xl mr-3">📅</Text>
              <View>
                <Text className="text-white font-semibold">Sober since</Text>
                <Text className="text-deep-300 text-sm">{new Date(profile.soberSince).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</Text>
              </View>
            </View>
          </Card>
        )}

        {/* Menu items */}
        <Card className="mx-4 mb-4">
          <TouchableOpacity onPress={() => navigation.navigate('EditProfile')} className="flex-row items-center justify-between py-4 border-b border-deep-700">
            <Text className="text-white">Edit Profile</Text>
            <Text className="text-deep-400">›</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('JournalInsights')} className="flex-row items-center justify-between py-4 border-b border-deep-700">
            <Text className="text-white">Journal Insights</Text>
            <Text className="text-deep-400">›</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Settings')} className="flex-row items-center justify-between py-4 border-b border-deep-700">
            <Text className="text-white">Settings</Text>
            <Text className="text-deep-400">›</Text>
          </TouchableOpacity>
          {!profile.isPremium && (
            <TouchableOpacity onPress={() => navigation.navigate('Premium')} className="flex-row items-center justify-between py-4 border-b border-deep-700">
              <View className="flex-row items-center"><Text className="text-amber-400">⭐ </Text><Text className="text-amber-400">Go Premium</Text></View>
              <Text className="text-deep-400">›</Text>
            </TouchableOpacity>
          )}
        </Card>

        {/* Logout */}
        {showLogoutConfirm ? (
          <Card className="mx-4 mb-4 bg-red-900/20 border border-red-500/30">
            <Text className="text-red-300 text-center mb-3">Are you sure you want to log out?</Text>
            <View className="flex-row">
              <Button title="Cancel" variant="secondary" size="sm" className="flex-1 mr-2" onPress={() => setShowLogoutConfirm(false)} />
              <Button title="Log Out" variant="danger" size="sm" className="flex-1 ml-2" onPress={handleLogout} />
            </View>
          </Card>
        ) : (
          <TouchableOpacity onPress={() => setShowLogoutConfirm(true)} className="mx-4 py-4 items-center bg-deep-800 rounded-xl border border-red-500/20">
            <Text className="text-red-400 font-semibold">Log Out</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}