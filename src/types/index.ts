// ============================================================
// Anchor — Shared Types
// ============================================================

// --- Error ---
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 400,
    public details?: unknown
  ) {
    super(message);
    this.name = 'AppError';
  }
}

// --- User ---
export interface User {
  userId: string;
  anonymousUsername: string;
  avatarUrl: string | null;
  email?: string;
  timezone: string;
  isPremium: boolean;
  premiumExpiresAt?: string;
  streakDays: number;
  longestStreak: number;
  soberSince?: string;
  createdAt: string;
  lastActiveAt: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  darkMode: boolean;
  notificationsEnabled: boolean;
  emergencyContactId?: string;
}

// --- Auth ---
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface RegisterRequest {
  email?: string;
  timezone?: string;
  fcmToken?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterResponse {
  user: {
    userId: string;
    anonymousUsername: string;
    avatarUrl: string;
    timezone: string;
    createdAt: string;
  };
  tokens: AuthTokens;
}

export interface LoginResponse {
  user: {
    userId: string;
    anonymousUsername: string;
    avatarUrl: string;
    isPremium: boolean;
    lastActiveAt: string;
  };
  tokens: AuthTokens;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

// --- Community ---
export interface Community {
  communityId: string;
  name: string;
  description: string;
  category: string;
  memberCount: number;
  postCount: number;
  isPrivate: boolean;
  createdAt: string;
}

export interface CommunityDetail extends Community {
  rules: string[];
  createdBy: string;
  membership?: {
    role: string;
    joinedAt: string;
  };
}

// --- Community Posts ---
export interface Post {
  postId: string;
  communityId: string;
  authorId: string;
  authorUsername: string;
  isAnonymous: boolean;
  title: string;
  content: string;          // truncated in list view
  tags: string[];
  likeCount: number;
  commentCount: number;
  isPinned: boolean;
  isLikedByMe?: boolean;
  createdAt: string;
}

export interface PostDetail extends Post {
  isLocked: boolean;
  updatedAt: string;
}

export interface CreatePostRequest {
  title: string;
  content: string;
  tags?: string[];
  isAnonymous?: boolean;
}

// --- Emergency ---
export interface EmergencyRequestPayload {
  trigger?: string;
  priority?: 'normal' | 'high';
}

export interface EmergencyRequestResponse {
  sessionId: string;
  status: string;
  estimatedWaitSeconds: number;
  requestedAt: string;
}

export interface EmergencySessionStatus {
  sessionId: string;
  status: 'waiting' | 'active' | 'completed' | 'expired';
  responderId: string | null;
  responderUsername: string | null;
  conversationId: string | null;
  requestedAt: string;
  respondedAt: string | null;
  endedAt: string | null;
}

export interface PeerMatch {
  peerId: string;
  peerUsername: string;
  matchedAt: string;
  sessionId: string;
}

// --- Post Comment / Reply ---
export interface Comment {
  commentId: string;
  postId: string;
  authorId: string;
  authorUsername: string;
  content: string;
  createdAt: string;
}

// --- Message ---
export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderUsername: string;
  content: string;
  createdAt: string;
  readAt?: string;
}

export interface Conversation {
  id: string;
  participantIds: string[];
  participantUsernames: string[];
  lastMessage?: Message;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}

// --- Journal ---
export type Mood = 'great' | 'good' | 'neutral' | 'low' | 'crisis';
export type TriggerType = 'stress' | 'lonely' | 'angry' | 'sad' | 'anxious' | 'celebrating' | 'other';

export interface JournalEntry {
  id: string;
  userId: string;
  content: string;
  mood: Mood;
  triggers: TriggerType[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateJournalEntryRequest {
  content: string;
  mood: Mood;
  triggers: TriggerType[];
}

export interface MoodInsight {
  period: string;
  dominantMood: Mood;
  streakDays: number;
  entryCount: number;
  commonTriggers: { trigger: TriggerType; count: number }[];
}

// --- Friend ---
export interface Friend {
  id: string;
  userId: string;
  friendId: string;
  friendUsername: string;
  status: 'pending' | 'accepted';
  createdAt: string;
}

// --- Notification ---
export interface Notification {
  id: string;
  userId: string;
  type: 'friend_request' | 'message' | 'emergency_connect' | 'milestone' | 'system';
  title: string;
  body: string;
  data?: Record<string, string>;
  read: boolean;
  createdAt: string;
}

// --- API Response Wrappers ---
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}