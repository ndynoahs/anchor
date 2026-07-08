import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '../../components/ui';
import { updateUserProfile } from '../../services/profile';
import { useAuthStore } from '../../stores/authStore';

const AVATAR_COLORS = ['#1d9d8e', '#f59e0b', '#ef4444', '#8b5cf6', '#3b82f6', '#ec4899', '#10b981', '#f97316'];

export default function EditProfileScreen() {
  const navigation: any = useNavigation();
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);

  const [bio, setBio] = useState('');

  const mutation = useMutation({
    mutationFn: () => updateUserProfile({ bio }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      navigation.goBack();
    },
  });

  return (
    <SafeAreaView className="flex-1 bg-deep-900" edges={['top']}>
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-deep-700">
        <TouchableOpacity onPress={() => navigation.goBack()}><Text className="text-deep-300">Cancel</Text></TouchableOpacity>
        <Text className="text-white font-semibold">Edit Profile</Text>
        <View style={{ width: 50 }} />
      </View>

      <ScrollView className="flex-1 px-4 pt-6">
        <Text className="text-deep-200 text-sm font-medium mb-2">Anonymous Username</Text>
        <View className="bg-deep-800 rounded-xl px-4 py-3 border border-deep-600 mb-4">
          <Text className="text-white">{user?.anonymousUsername || 'user_name'}</Text>
        </View>
        <Text className="text-deep-400 text-xs mb-4">Username cannot be changed once set.</Text>

        <Text className="text-deep-200 text-sm font-medium mb-2">Bio</Text>
        <TextInput
          className="bg-deep-800 text-white rounded-xl px-4 py-3 border border-deep-600 mb-2 min-h-[100px]"
          placeholder="A short bio about yourself..."
          placeholderTextColor="#6b8aa8"
          value={bio}
          onChangeText={setBio}
          multiline
          textAlignVertical="top"
          maxLength={280}
        />
        <Text className="text-deep-400 text-xs text-right mb-6">{bio.length}/280</Text>

        {mutation.isError && (
          <View className="bg-red-900/30 rounded-xl p-3 mb-4 border border-red-500/30">
            <Text className="text-red-300 text-sm text-center">{(mutation.error as any)?.message || 'Failed to update profile.'}</Text>
          </View>
        )}

        <Button title="Save Changes" variant="primary" size="lg" className="w-full mb-8" loading={mutation.isPending} onPress={() => mutation.mutate()} />
      </ScrollView>
    </SafeAreaView>
  );
}