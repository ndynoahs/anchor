// ============================================================
// Anchor — Emergency Screen
// ============================================================

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button, Card, LoadingSpinner } from '../../components/ui';
import {
  requestEmergencySupport,
  getSessionStatus,
  endSession,
} from '../../services/emergency';

type ScreenState = 'idle' | 'waiting' | 'connected' | 'ended';

export default function EmergencyScreen() {
  const [screenState, setScreenState] = useState<ScreenState>('idle');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [isSupporter, setIsSupporter] = useState(false);

  // Pulse animation
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.08,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [pulseAnim]);

  // Glow animation for waiting state
  useEffect(() => {
    if (screenState === 'waiting') {
      const glow = Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      );
      glow.start();
      return () => glow.stop();
    }
  }, [screenState, glowAnim]);

  // Timer for connected state
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (screenState === 'connected' || screenState === 'waiting') {
      interval = setInterval(() => {
        setElapsed((e) => e + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [screenState]);

  // Poll for session status when waiting
  useEffect(() => {
    let pollInterval: ReturnType<typeof setInterval>;
    if (screenState === 'waiting' && sessionId) {
      pollInterval = setInterval(async () => {
        try {
          const status = await getSessionStatus(sessionId);
          if (status.status === 'active') {
            setScreenState('connected');
            clearInterval(pollInterval);
          }
        } catch {
          // continue polling
        }
      }, 3000);
    }
    return () => clearInterval(pollInterval);
  }, [screenState, sessionId]);

  // Request support mutation
  const requestMutation = useMutation({
    mutationFn: () => requestEmergencySupport({ priority: 'normal' }),
    onSuccess: (data) => {
      setSessionId(data.sessionId);
      setScreenState('waiting');
    },
  });

  // End session mutation
  const endMutation = useMutation({
    mutationFn: () => endSession(sessionId!),
    onSuccess: () => {
      setScreenState('ended');
    },
  });

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Idle State
  if (screenState === 'idle') {
    return (
      <SafeAreaView className="flex-1 bg-deep-900">
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-4xl mb-4">🆘</Text>
          <Text className="text-white text-2xl font-bold text-center mb-3">
            You're not alone
          </Text>
          <Text className="text-deep-300 text-base text-center mb-8 leading-6">
            A trained peer supporter is ready to listen,{'\n'}right now, anonymously.
          </Text>

          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <TouchableOpacity
              className="bg-red-600 w-72 h-72 rounded-full items-center justify-center"
              onPress={() => requestMutation.mutate()}
              disabled={requestMutation.isPending}
              accessibilityLabel="Request emergency support"
              activeOpacity={0.8}
            >
              <Text className="text-white text-xl font-bold text-center leading-7">
                I need support{'\n'}right now
              </Text>
              <Text className="text-red-200 text-sm mt-2">Tap to connect</Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Supporter toggle */}
          <TouchableOpacity
            className="mt-8"
            onPress={() => setIsSupporter(!isSupporter)}
          >
            <Text className="text-teal-400 text-sm">
              {isSupporter ? '✓ I want to help' : 'I want to help others'}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Requesting state
  if (requestMutation.isPending) {
    return (
      <SafeAreaView className="flex-1 bg-deep-900">
        <LoadingSpinner fullScreen message="Connecting you to a peer..." />
      </SafeAreaView>
    );
  }

  // Waiting for match
  if (screenState === 'waiting') {
    const glowColor = glowAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['rgba(239, 68, 68, 0.1)', 'rgba(239, 68, 68, 0.3)'],
    });

    return (
      <SafeAreaView className="flex-1 bg-deep-900">
        <View className="flex-1 items-center justify-center px-6">
          <Animated.View
            className="w-40 h-40 rounded-full items-center justify-center mb-6"
            style={{ backgroundColor: glowColor }}
          >
            <Text className="text-5xl">🆘</Text>
          </Animated.View>

          <Text className="text-white text-xl font-bold mb-2">
            Finding someone for you
          </Text>
          <Text className="text-deep-300 text-base text-center mb-4">
            A peer supporter will be with you shortly
          </Text>

          <Card className="w-full mb-6">
            <View className="items-center py-2">
              <Text className="text-white text-2xl font-bold tabular-nums">
                {formatTime(elapsed)}
              </Text>
              <Text className="text-deep-400 text-sm">waiting</Text>
            </View>
          </Card>

          <Button
            title="Cancel Request"
            variant="ghost"
            size="sm"
            onPress={() => {
              setScreenState('idle');
              setSessionId(null);
              setElapsed(0);
            }}
          />
        </View>
      </SafeAreaView>
    );
  }

  // Connected
  if (screenState === 'connected') {
    return (
      <SafeAreaView className="flex-1 bg-deep-900">
        <View className="flex-1 items-center justify-center px-6">
          <View className="w-24 h-24 rounded-full bg-green-500/20 items-center justify-center mb-4">
            <Text className="text-4xl">🤝</Text>
          </View>

          <Text className="text-white text-2xl font-bold mb-2">
            You're connected
          </Text>
          <Text className="text-green-400 text-base mb-6">
            A peer is here for you
          </Text>

          <Card className="w-full mb-6">
            <View className="items-center py-4">
              <Text className="text-white text-3xl font-bold tabular-nums mb-1">
                {formatTime(elapsed)}
              </Text>
              <Text className="text-deep-400 text-sm">session duration</Text>
            </View>
          </Card>

          <Card className="w-full mb-6">
            <View className="items-center py-3">
              <Text className="text-teal-400 font-semibold mb-1">
                Your supporter is here
              </Text>
              <Text className="text-deep-300 text-sm text-center leading-5">
                You're in a safe, anonymous space.{'\n'}
                Take your time. They're here to listen.
              </Text>
            </View>
          </Card>

          <Button
            title="End Session"
            variant="danger"
            size="lg"
            className="w-full"
            loading={endMutation.isPending}
            onPress={() => endMutation.mutate()}
          />
        </View>
      </SafeAreaView>
    );
  }

  // Ended
  return (
    <SafeAreaView className="flex-1 bg-deep-900">
      <View className="flex-1 items-center justify-center px-6">
        <View className="w-24 h-24 rounded-full bg-teal-500/20 items-center justify-center mb-4">
          <Text className="text-4xl">💙</Text>
        </View>

        <Text className="text-white text-2xl font-bold mb-2">
          You're not alone
        </Text>
        <Text className="text-deep-300 text-base text-center mb-8 leading-6">
          Thank you for reaching out.{'\n'}
          Your courage inspires others.
        </Text>

        <Card className="w-full mb-8">
          <View className="items-center py-3">
            <Text className="text-white text-xl font-bold tabular-nums">
              {formatTime(elapsed)}
            </Text>
            <Text className="text-deep-400 text-sm">session length</Text>
          </View>
        </Card>

        <Button
          title="Done"
          variant="primary"
          size="lg"
          className="w-full"
          onPress={() => {
            setScreenState('idle');
            setSessionId(null);
            setElapsed(0);
          }}
        />
      </View>
    </SafeAreaView>
  );
}