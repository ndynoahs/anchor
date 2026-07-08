import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Card, Button } from '../../components/ui';

export default function PremiumScreen() {
  const navigation: any = useNavigation();

  return (
    <SafeAreaView className="flex-1 bg-deep-900" edges={['top']}>
      <View className="px-4 py-3 border-b border-deep-700">
        <Text className="text-white text-xl font-bold">Anchor Premium</Text>
      </View>

      <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingVertical: 24 }}>
        {/* Hero */}
        <View className="items-center mb-8">
          <Text className="text-5xl mb-4">⭐</Text>
          <Text className="text-white text-2xl font-bold text-center">Unlock the Full Experience</Text>
          <Text className="text-deep-300 text-sm text-center mt-2">Take your recovery journey further with premium features</Text>
        </View>

        {/* Features */}
        <Card className="mb-4">
          <FeatureRow emoji="💬" title="Unlimited Direct Messaging" description="Message your support network without limits" />
          <FeatureRow emoji="📊" title="Advanced Journal Insights" description="Mood trends, patterns, and personalized recommendations" />
          <FeatureRow emoji="🚀" title="Priority Emergency Matching" description="Get connected to a peer faster when you need support" />
          <FeatureRow emoji="🌙" title="Extended Community Access" description="Access private premium-only support communities" />
          <FeatureRow emoji="🎯" title="Personalized Milestones" description="Custom goals, progress tracking, and celebration moments" />
          <FeatureRow emoji="🔔" title="Priority Notifications" description="Never miss a message from your support circle" last />
        </Card>

        {/* Pricing */}
        <View className="flex-row mt-6 mb-6 space-x-3">
          <Card className="flex-1">
            <View className="items-center py-4">
              <Text className="text-deep-300 text-sm font-medium uppercase">Monthly</Text>
              <Text className="text-white text-3xl font-bold mt-2">$9.99</Text>
              <Text className="text-deep-400 text-xs mt-1">per month</Text>
              <Button title="Subscribe" variant="primary" size="sm" className="mt-4 w-full" onPress={() => {}} />
            </View>
          </Card>
          <Card className="flex-1 border-teal-500">
            <View className="items-center py-4">
              <View className="bg-teal-500 px-3 py-0.5 rounded-full mb-2"><Text className="text-white text-xs font-semibold">BEST VALUE</Text></View>
              <Text className="text-deep-300 text-sm font-medium uppercase">Yearly</Text>
              <Text className="text-white text-3xl font-bold mt-2">$89.99</Text>
              <Text className="text-deep-400 text-xs mt-1">$7.50/mo</Text>
              <Button title="Subscribe" variant="primary" size="sm" className="mt-4 w-full" onPress={() => {}} />
            </View>
          </Card>
        </View>

        <Text className="text-deep-400 text-xs text-center mb-4">Cancel anytime. Subscription auto-renews unless cancelled.</Text>

        <TouchableOpacity onPress={() => navigation.goBack()} className="items-center py-2"><Text className="text-teal-400">Maybe later</Text></TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function FeatureRow({ emoji, title, description, last = false }: { emoji: string; title: string; description: string; last?: boolean }) {
  return (
    <View className={`flex-row py-4 ${!last ? 'border-b border-deep-700' : ''}`}>
      <Text className="text-2xl mr-3">{emoji}</Text>
      <View className="flex-1">
        <Text className="text-white font-semibold">{title}</Text>
        <Text className="text-deep-300 text-sm">{description}</Text>
      </View>
    </View>
  );
}