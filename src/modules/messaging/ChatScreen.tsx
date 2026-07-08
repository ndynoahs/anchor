import React, { useState, useRef, useEffect } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, LoadingSpinner, ErrorState, Avatar } from '../../components/ui';
import { getMessages, sendMessage, markConversationRead } from '../../services/messaging';
import { useAuthStore } from '../../stores/authStore';
import { formatRelativeTime } from '../../utils';

export default function ChatScreen() {
  const route: any = useRoute();
  const navigation: any = useNavigation();
  const queryClient = useQueryClient();
  const { conversationId } = route.params as { conversationId: string };
  const userId = useAuthStore((s) => s.user?.userId);
  const [text, setText] = useState('');
  const flatListRef = useRef<FlatList>(null);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['messages', conversationId],
    queryFn: () => getMessages(conversationId),
  });

  useEffect(() => { markConversationRead(conversationId).catch(() => {}); }, []);

  const sendMutation = useMutation({
    mutationFn: () => sendMessage(conversationId, text),
    onSuccess: () => {
      setText('');
      queryClient.invalidateQueries({ queryKey: ['messages', conversationId] });
    },
  });

  const messages = data?.items || [];

  return (
    <SafeAreaView className="flex-1 bg-deep-900" edges={['top']}>
      <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={90}>
        {isLoading ? <LoadingSpinner message="Loading messages..." /> :
         isError ? <ErrorState title="Couldn't load messages" onRetry={() => refetch()} /> : (
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.messageId}
            className="flex-1 px-4"
            contentContainerStyle={{ paddingVertical: 8 }}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
            renderItem={({ item }) => {
              const isMine = item.senderId === userId;
              return (
                <View className={`mb-3 flex-row ${isMine ? 'justify-end' : 'justify-start'}`}>
                  {!isMine && <Avatar username="Peer" size="sm" className="mr-2 self-end" />}
                  <View className={`max-w-[75%] rounded-2xl px-4 py-2 ${isMine ? 'bg-teal-600 rounded-br-md' : 'bg-deep-700 rounded-bl-md'}`}>
                    <Text className="text-white text-base">{item.content}</Text>
                    <Text className={`text-xs mt-1 ${isMine ? 'text-teal-200' : 'text-deep-400'}`}>
                      {formatRelativeTime(item.createdAt)}
                      {isMine && item.readAt && ' ✓✓'}
                    </Text>
                  </View>
                </View>
              );
            }}
            ListEmptyComponent={<View className="flex-1 items-center justify-center py-20"><Text className="text-deep-400">No messages yet. Say hello!</Text></View>}
          />
        )}

        <View className="flex-row items-center px-4 py-3 border-t border-deep-700 bg-deep-800">
          <TextInput
            className="flex-1 bg-deep-900 text-white rounded-xl px-4 py-3 mr-2 border border-deep-600"
            placeholder="Type a message..."
            placeholderTextColor="#6b8aa8"
            value={text}
            onChangeText={setText}
            multiline
          />
          <TouchableOpacity
            className="bg-teal-500 w-12 h-12 rounded-xl items-center justify-center"
            onPress={() => text.trim() && sendMutation.mutate()}
            disabled={!text.trim() || sendMutation.isPending}
          >
            <Text className="text-white text-xl">➤</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}