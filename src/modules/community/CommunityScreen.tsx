// ============================================================
// Anchor — Community Screen (Browse + My Communities)
// ============================================================

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  FlatList,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { Card, Badge, LoadingSpinner, EmptyState, ErrorState } from '../../components/ui';
import { getCommunities } from '../../services/community';
import type { Community } from '../../types';

type CommunityNav = any;

const CATEGORIES = ['All', 'Substance', 'Alcohol', 'Behavioral', 'Mental Health'];

export default function CommunityScreen() {
  const navigation = useNavigation<CommunityNav>();
  const [activeTab, setActiveTab] = useState<'browse' | 'mine'>('browse');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [page, setPage] = useState(1);

  const {
    data: communitiesData,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['communities', selectedCategory, page],
    queryFn: () =>
      getCommunities({
        category: selectedCategory === 'All' ? undefined : selectedCategory.toLowerCase(),
        page,
        pageSize: 20,
      }),
  });

  const communities = communitiesData?.items || [];

  const filteredCommunities = searchQuery
    ? communities.filter((c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : communities;

  const handleLoadMore = useCallback(() => {
    if (communitiesData?.hasMore && !isFetching) {
      setPage((p) => p + 1);
    }
  }, [communitiesData?.hasMore, isFetching]);

  const renderCommunityCard = ({ item }: { item: Community }) => (
    <TouchableOpacity
      className="mb-3"
      onPress={() => navigation.navigate('CommunityDetail', { communityId: item.communityId })}
      accessibilityLabel={`Community: ${item.name}`}
    >
      <Card>
        <View className="flex-row items-start">
          <View className="flex-1">
            <View className="flex-row items-center mb-1">
              <Text className="text-white font-semibold text-base flex-1">
                {item.name}
              </Text>
              <Badge
                label={item.category}
                variant="info"
                size="sm"
              />
            </View>
            <Text className="text-deep-300 text-sm leading-5 mb-2" numberOfLines={2}>
              {item.description}
            </Text>
            <View className="flex-row items-center">
              <Text className="text-deep-400 text-xs mr-4">
                👥 {item.memberCount} members
              </Text>
              <Text className="text-deep-400 text-xs">
                📝 {item.postCount} posts
              </Text>
              {item.isPrivate && (
                <Badge label="Private" variant="warning" size="sm" className="ml-2" />
              )}
            </View>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-deep-900" edges={['top']}>
      {/* Tab Switcher */}
      <View className="flex-row mx-4 mb-4 bg-deep-800 rounded-xl p-1">
        <TouchableOpacity
          className={`flex-1 py-2 rounded-lg ${activeTab === 'browse' ? 'bg-teal-500' : ''}`}
          onPress={() => setActiveTab('browse')}
        >
          <Text className={`text-center font-medium text-sm ${activeTab === 'browse' ? 'text-white' : 'text-deep-300'}`}>
            Browse
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`flex-1 py-2 rounded-lg ${activeTab === 'mine' ? 'bg-teal-500' : ''}`}
          onPress={() => setActiveTab('mine')}
        >
          <Text className={`text-center font-medium text-sm ${activeTab === 'mine' ? 'text-white' : 'text-deep-300'}`}>
            My Communities
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'browse' ? (
        <View className="flex-1 px-4">
          {/* Search Bar */}
          <View className="bg-deep-800 rounded-xl px-4 py-3 flex-row items-center mb-4 border border-deep-600">
            <Text className="text-deep-400 mr-2">🔍</Text>
            <TextInput
              className="flex-1 text-white text-base"
              placeholder="Search communities..."
              placeholderTextColor="#6b8aa8"
              value={searchQuery}
              onChangeText={setSearchQuery}
              accessibilityLabel="Search communities"
            />
            {searchQuery ? (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Text className="text-deep-400">✕</Text>
              </TouchableOpacity>
            ) : null}
          </View>

          {/* Category Filter Chips */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mb-4"
          >
            <View className="flex-row space-x-2">
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  className={`px-4 py-2 rounded-full ${
                    selectedCategory === cat ? 'bg-teal-500' : 'bg-deep-700'
                  }`}
                  onPress={() => {
                    setSelectedCategory(cat);
                    setPage(1);
                  }}
                >
                  <Text
                    className={`text-sm font-medium ${
                      selectedCategory === cat ? 'text-white' : 'text-deep-200'
                    }`}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          {/* Community List */}
          {isLoading ? (
            <LoadingSpinner message="Loading communities..." />
          ) : isError ? (
            <ErrorState
              title="Couldn't load communities"
              message="We had trouble connecting. Please try again."
              onRetry={() => refetch()}
            />
          ) : filteredCommunities.length === 0 ? (
            <EmptyState
              icon="🔍"
              title="No communities found"
              message={searchQuery ? 'Try a different search term' : 'No communities in this category yet'}
            />
          ) : (
            <FlatList
              data={filteredCommunities}
              renderItem={renderCommunityCard}
              keyExtractor={(item) => item.communityId}
              showsVerticalScrollIndicator={false}
              onEndReached={handleLoadMore}
              onEndReachedThreshold={0.5}
              refreshControl={
                <RefreshControl
                  refreshing={isFetching && page === 1}
                  onRefresh={() => {
                    setPage(1);
                    refetch();
                  }}
                  tintColor="#5eead4"
                />
              }
              ListFooterComponent={
                isFetching && page > 1 ? (
                  <LoadingSpinner message="Loading more..." />
                ) : null
              }
            />
          )}
        </View>
      ) : (
        /* My Communities Tab */
        <View className="flex-1 px-4">
          {communities.length === 0 ? (
            <EmptyState
              icon="👥"
              title="No communities yet"
              message="Join a community to connect with peers on your journey"
              action={
                <TouchableOpacity
                  className="bg-teal-500 px-6 py-3 rounded-xl"
                  onPress={() => setActiveTab('browse')}
                >
                  <Text className="text-white font-semibold">Browse Communities</Text>
                </TouchableOpacity>
              }
            />
          ) : (
            <FlatList
              data={communities.slice(0, 5)}
              renderItem={renderCommunityCard}
              keyExtractor={(item) => item.communityId}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      )}
    </SafeAreaView>
  );
}