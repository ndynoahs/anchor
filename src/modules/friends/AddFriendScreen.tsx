import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '../../components/ui';
import { sendFriendRequest } from '../../services/friends';

export default function AddFriendScreen() {
  const navigation: any = useNavigation();
  const queryClient = useQueryClient();
  const [username, setUsername] = useState('');

  const mutation = useMutation({
    mutationFn: () => sendFriendRequest(username),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friends'] });
      navigation.goBack();
    },
  });

  return (
    <SafeAreaView className="flex-1 bg-deep-900" edges={['top']}>
      <View className="px-4 py-3 border-b border-deep-700">
        <Text className="text-white text-xl font-bold">Add Friend</Text>
      </View>
      <View className="flex-1 px-4 pt-6">
        <Text className="text-deep-200 text-sm mb-2">Search by anonymous username</Text>
        <TextInput
          className="bg-deep-800 text-white rounded-xl px-4 py-3 border border-deep-600 mb-4"
          placeholder="Enter username..."
          placeholderTextColor="#6b8aa8"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
        {mutation.isError && (
          <View className="bg-red-900/30 rounded-xl p-3 mb-4 border border-red-500/30">
            <Text className="text-red-300 text-sm text-center">{(mutation.error as any)?.message || 'User not found'}</Text>
          </View>
        )}
        <Button title="Send Request" variant="primary" size="lg" className="w-full" loading={mutation.isPending} onPress={() => mutation.mutate()} disabled={!username.trim()} />
      </View>
    </SafeAreaView>
  );
}