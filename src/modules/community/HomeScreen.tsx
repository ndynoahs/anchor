// ============================================================
// Anchor — Home Screen
// ============================================================

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { Avatar, Card, Badge } from '../../components/ui';
import { useAuthStore } from '../../stores/authStore';

type HomeNav = any;

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function HomeScreen() {
  const navigation = useNavigation<HomeNav>();
  const user = useAuthStore((state) => state.user);

  // Pulse animation for emergency button
  const pulseAnim = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [pulseAnim]);

  return (
    <SafeAreaView className="flex-1 bg-deep-900">
      <ScrollView
        className="flex-1 px-4"
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header — Greeting + Avatar */}
        <View className="flex-row items-center justify-between mt-2 mb-6">
          <View className="flex-1">
            <Text className="text-deep-300 text-sm">{getGreeting()}</Text>
            <Text className="text-white text-xl font-semibold mt-0.5">
              {user?.anonymousUsername || 'Friend'}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate('Profile')}
            accessibilityLabel="View profile"
          >
            <Avatar
              username={user?.anonymousUsername || 'You'}
              size="md"
            />
          </TouchableOpacity>
        </View>

        {/* Streak Card */}
        <Card className="mb-4">
          <View className="flex-row items-center">
            <Text className="text-2xl mr-3">🔥</Text>
            <View>
              <Text className="text-white text-lg font-semibold">
                {user?.streakDays || 0} day streak
              </Text>
              <Text className="text-deep-300 text-sm">
                Keep going, you're doing great
              </Text>
            </View>
          </View>
        </Card>

        {/* Emergency Button */}
        <Animated.View style={{ transform: [{ scale: pulseAnim }] }} className="mb-6">
          <TouchableOpacity
            className="bg-red-600/90 rounded-2xl p-5 items-center"
            onPress={() => navigation.navigate('Emergency')}
            accessibilityLabel="Need to talk to someone? Emergency support"
            activeOpacity={0.8}
          >
            <Text className="text-3xl mb-2">🆘</Text>
            <Text className="text-white text-lg font-bold">
              Need to talk to someone?
            </Text>
            <Text className="text-red-200 text-sm mt-1">
              A peer is ready to listen. Tap to connect.
            </Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Quick Journal Entry */}
        <Card className="mb-6" highlighted>
          <TouchableOpacity
            onPress={() => navigation.navigate('Journal')}
            className="flex-row items-center"
            accessibilityLabel="Quick journal entry"
          >
            <View className="w-12 h-12 rounded-full bg-teal-500/20 items-center justify-center mr-4">
              <Text className="text-2xl">📓</Text>
            </View>
            <View className="flex-1">
              <Text className="text-white font-semibold text-base">
                How are you feeling?
              </Text>
              <Text className="text-deep-300 text-sm mt-0.5">
                Write a quick journal entry
              </Text>
            </View>
            <Text className="text-teal-400 text-lg">→</Text>
          </TouchableOpacity>
        </Card>

        {/* Recent Community Posts */}
        <View className="mb-4">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-white text-lg font-semibold">
              Recent in communities
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Community')}>
              <Text className="text-teal-400 text-sm">See all</Text>
            </TouchableOpacity>
          </View>

          {/* Placeholder posts — will be replaced with real data */}
          <Card className="mb-3">
            <View className="flex-row items-center mb-2">
              <Avatar username="BraveHeart" size="sm" />
              <View className="ml-3 flex-1">
                <Text className="text-white text-sm font-medium">BraveHeart</Text>
                <Text className="text-deep-400 text-xs">2h ago</Text>
              </View>
              <Badge label="Sobriety" variant="info" size="sm" />
            </View>
            <Text className="text-deep-200 text-sm leading-5" numberOfLines={2}>
              Today marks 30 days. It hasn't been easy, but this community has
              been a lifeline. Thank you all for being here.
            </Text>
            <View className="flex-row items-center mt-3 pt-3 border-t border-deep-700">
              <Text className="text-deep-400 text-xs mr-4">❤️ 12</Text>
              <Text className="text-deep-400 text-xs">💬 4</Text>
            </View>
          </Card>

          <Card>
            <View className="flex-row items-center mb-2">
              <Avatar username="CalmWave" size="sm" />
              <View className="ml-3 flex-1">
                <Text className="text-white text-sm font-medium">CalmWave</Text>
                <Text className="text-deep-400 text-xs">5h ago</Text>
              </View>
              <Badge label="Support" variant="info" size="sm" />
            </View>
            <Text className="text-deep-200 text-sm leading-5" numberOfLines={2}>
              Having a rough day. Anyone else find that exercise helps with the
              cravings? Looking for new strategies to try.
            </Text>
            <View className="flex-row items-center mt-3 pt-3 border-t border-deep-700">
              <Text className="text-deep-400 text-xs mr-4">❤️ 8</Text>
              <Text className="text-deep-400 text-xs">💬 7</Text>
            </View>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}