// ============================================================
// Anchor — Community Detail Screen
// ============================================================

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  TextInput,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  Card,
  Avatar,
  Badge,
  Button,
  LoadingSpinner,
  EmptyState,
  ErrorState,
} from '../../components/ui';
import {
  getCommunityDetail,
  getCommunityPosts,
  joinCommunity,
  leaveCommunity,
  toggleLike,
} from '../../services/community';
import type { Post } from '../../types';
import { formatRelativeTime } from '../../utils';

type DetailNav = any;

export default function CommunityDetailScreen() {
  const route: any = useRoute();
  const { communityId } = route.params as { communityId: string };
  const navigation = useNavigation<DetailNav>();
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [showNewPost, setShowNewPost] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');

  // Fetch community details
  const {
    data: community,
    isLoading: loadingCommunity,
    isError: communityError,
  } = useQuery({
    queryKey: ['community', communityId],
    queryFn: () => getCommunityDetail(communityId),
  });

  // Fetch posts
  const {
    data: postsData,
    isLoading: loadingPosts,
    isError: postsError,
    refetch: refetchPosts,
    isFetching,
  } = useQuery({
    queryKey: ['community-posts', communityId, page],
    queryFn: () =>
      getCommunityPosts(communityId, { page, pageSize: 20, sort: 'latest' }),
  });

  const posts = postsData?.items || [];
  const isMember = !!community?.membership;

  // Join/Leave mutations
  const joinMutation = useMutation({
    mutationFn: () => joinCommunity(communityId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community', communityId] });
    },
  });

  const leaveMutation = useMutation({
    mutationFn: () => leaveCommunity(communityId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community', communityId] });
    },
  });

  // Like mutation
  const likeMutation = useMutation({
    mutationFn: (postId: string) => toggleLike(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community-posts', communityId] });
    },
  });

  const handleLoadMore = useCallback(() => {
    if (postsData?.hasMore && !isFetching) {
      setPage((p) => p + 1);
    }
  }, [postsData?.hasMore, isFetching]);

  const renderPost = ({ item }: { item: Post }) => (
    <TouchableOpacity
      className="mb-3"
      onPress={() => navigation.navigate('PostDetail', { postId: item.postId })}
    >
      <Card>
        {/* Author header */}
        <View className="flex-row items-center mb-2">
          <Avatar username={item.authorUsername} size="sm" />
          <View className="ml-3 flex-1">
            <View className="flex-row items-center">
              <Text className="text-white text-sm font-medium">
                {item.isAnonymous ? 'Anonymous' : item.authorUsername}
              </Text>
              {item.isPinned && <Text className="text-teal-400 text-xs ml-2">📌</Text>}
            </View>
            <Text className="text-deep-400 text-xs">
              {formatRelativeTime(item.createdAt)}
            </Text>
          </View>
        </View>

        {/* Post content */}
        <Text className="text-white font-semibold text-base mb-1">
          {item.title}
        </Text>
        <Text className="text-deep-200 text-sm leading-5" numberOfLines={3}>
          {item.content}
        </Text>

        {/* Tags */}
        {item.tags && item.tags.length > 0 && (
          <View className="flex-row flex-wrap mt-2">
            {item.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} label={tag} variant="default" size="sm" className="mr-1 mb-1" />
            ))}
          </View>
        )}

        {/* Actions */}
        <View className="flex-row items-center mt-3 pt-3 border-t border-deep-700">
          <TouchableOpacity
            className="flex-row items-center mr-6"
            onPress={() => likeMutation.mutate(item.postId)}
          >
            <Text className="text-deep-300 text-sm mr-1">
              {item.isLikedByMe ? '❤️' : '🤍'}
            </Text>
            <Text className="text-deep-400 text-xs">{item.likeCount}</Text>
          </TouchableOpacity>
          <View className="flex-row items-center">
            <Text className="text-deep-300 text-sm mr-1">💬</Text>
            <Text className="text-deep-400 text-xs">{item.commentCount}</Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );

  if (loadingCommunity) {
    return <SafeAreaView className="flex-1 bg-deep-900"><LoadingSpinner fullScreen message="Loading community..." /></SafeAreaView>;
  }

  if (communityError) {
    return (
      <SafeAreaView className="flex-1 bg-deep-900">
        <ErrorState
          title="Couldn't load community"
          message="Please check your connection and try again"
          onRetry={() => queryClient.invalidateQueries({ queryKey: ['community', communityId] })}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-deep-900" edges={['top']}>
      {/* Community Header */}
      <View className="px-4 py-4 border-b border-deep-700">
        <View className="flex-row items-center justify-between mb-2">
          <View className="flex-1">
            <Text className="text-white text-xl font-bold">{community?.name}</Text>
            <View className="flex-row items-center mt-1">
              <Badge label={community?.category || ''} variant="info" size="sm" />
              <Text className="text-deep-400 text-xs ml-3">
                👥 {community?.memberCount} members
              </Text>
            </View>
          </View>
          <Button
            title={isMember ? 'Leave' : 'Join'}
            variant={isMember ? 'outline' : 'primary'}
            size="sm"
            loading={joinMutation.isPending || leaveMutation.isPending}
            onPress={() => {
              if (isMember) {
                leaveMutation.mutate();
              } else {
                joinMutation.mutate();
              }
            }}
          />
        </View>
        <Text className="text-deep-300 text-sm leading-5">
          {community?.description}
        </Text>
      </View>

      {/* Posts Feed */}
      {loadingPosts ? (
        <LoadingSpinner message="Loading posts..." />
      ) : postsError ? (
        <ErrorState
          title="Couldn't load posts"
          message="Please try again"
          onRetry={() => refetchPosts()}
        />
      ) : posts.length === 0 ? (
        <EmptyState
          icon="📝"
          title="No posts yet"
          message="Be the first to share in this community"
        />
      ) : (
        <FlatList
          data={posts}
          renderItem={renderPost}
          keyExtractor={(item) => item.postId}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 16 }}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          refreshControl={
            <RefreshControl
              refreshing={isFetching && page === 1}
              onRefresh={() => {
                setPage(1);
                refetchPosts();
              }}
              tintColor="#5eead4"
            />
          }
          ListFooterComponent={
            isFetching && page > 1 ? <LoadingSpinner message="Loading more..." /> : null
          }
        />
      )}

      {/* Floating New Post Button */}
      {isMember && (
        <TouchableOpacity
          className="absolute bottom-6 right-6 w-14 h-14 bg-teal-500 rounded-full items-center justify-center shadow-lg"
          onPress={() => setShowNewPost(true)}
          accessibilityLabel="Create new post"
        >
          <Text className="text-white text-2xl">+</Text>
        </TouchableOpacity>
      )}

      {/* New Post Modal */}
      <Modal
        visible={showNewPost}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowNewPost(false)}
      >
        <SafeAreaView className="flex-1 bg-deep-900">
          <View className="flex-row items-center justify-between px-4 py-3 border-b border-deep-700">
            <TouchableOpacity onPress={() => setShowNewPost(false)}>
              <Text className="text-deep-300 text-base">Cancel</Text>
            </TouchableOpacity>
            <Text className="text-white font-semibold text-base">New Post</Text>
            <TouchableOpacity
              onPress={() => {
                // Will be wired to createPost mutation
                setShowNewPost(false);
                setNewPostTitle('');
                setNewPostContent('');
              }}
            >
              <Text className="text-teal-400 font-semibold text-base">Post</Text>
            </TouchableOpacity>
          </View>
          <View className="flex-1 px-4 pt-4">
            <TextInput
              className="bg-deep-800 text-white text-base rounded-xl px-4 py-3 mb-3 border border-deep-600"
              placeholder="Post title"
              placeholderTextColor="#6b8aa8"
              value={newPostTitle}
              onChangeText={setNewPostTitle}
            />
            <TextInput
              className="bg-deep-800 text-white text-base rounded-xl px-4 py-3 flex-1 border border-deep-600"
              placeholder="Share your thoughts..."
              placeholderTextColor="#6b8aa8"
              value={newPostContent}
              onChangeText={setNewPostContent}
              multiline
              textAlignVertical="top"
            />
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}