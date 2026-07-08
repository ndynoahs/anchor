// ============================================================
// Anchor — Post Detail Screen
// ============================================================

import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { Card, Avatar, Badge, LoadingSpinner, ErrorState } from '../../components/ui';
import { getPostDetail } from '../../services/community';
import { formatRelativeTime } from '../../utils';

export default function PostDetailScreen() {
  const route: any = useRoute();
  const { postId } = route.params as { postId: string };

  const {
    data: post,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['post', postId],
    queryFn: () => getPostDetail(postId),
  });

  if (isLoading) {
    return <SafeAreaView className="flex-1 bg-deep-900"><LoadingSpinner fullScreen message="Loading post..." /></SafeAreaView>;
  }

  if (isError || !post) {
    return (
      <SafeAreaView className="flex-1 bg-deep-900">
        <ErrorState
          title="Couldn't load post"
          message="Please check your connection and try again"
          onRetry={() => refetch()}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-deep-900" edges={['top']}>
      <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 24 }}>
        {/* Author header */}
        <View className="flex-row items-center mb-4 mt-2">
          <Avatar username={post.authorUsername} size="md" />
          <View className="ml-3 flex-1">
            <View className="flex-row items-center">
              <Text className="text-white font-medium">
                {post.isAnonymous ? 'Anonymous' : post.authorUsername}
              </Text>
              {post.isPinned && <Text className="text-teal-400 text-xs ml-2">📌</Text>}
            </View>
            <Text className="text-deep-400 text-sm">
              {formatRelativeTime(post.createdAt)}
            </Text>
          </View>
        </View>

        {/* Post content */}
        <Text className="text-white text-xl font-bold mb-3">{post.title}</Text>
        <Text className="text-deep-200 text-base leading-7 mb-4">{post.content}</Text>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <View className="flex-row flex-wrap mb-4">
            {post.tags.map((tag) => (
              <Badge key={tag} label={tag} variant="default" size="sm" className="mr-1 mb-1" />
            ))}
          </View>
        )}

        {/* Stats */}
        <Card>
          <View className="flex-row justify-around">
            <View className="items-center">
              <Text className="text-xl mb-1">❤️</Text>
              <Text className="text-white font-semibold">{post.likeCount}</Text>
              <Text className="text-deep-400 text-xs">Likes</Text>
            </View>
            <View className="items-center">
              <Text className="text-xl mb-1">💬</Text>
              <Text className="text-white font-semibold">{post.commentCount}</Text>
              <Text className="text-deep-400 text-xs">Comments</Text>
            </View>
            <View className="items-center">
              <Text className="text-xl mb-1">📅</Text>
              <Text className="text-white font-semibold">
                {new Date(post.createdAt).toLocaleDateString()}
              </Text>
              <Text className="text-deep-400 text-xs">Posted</Text>
            </View>
          </View>
        </Card>

        {post.isLocked && (
          <View className="bg-yellow-900/30 rounded-xl p-3 mt-4 border border-yellow-500/30">
            <Text className="text-yellow-300 text-sm text-center">
              🔒 This post has been locked by a moderator
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}