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
  id: string;
  anonymousUsername: string;
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
  expiresAt: number;
}

export interface RegisterRequest {
  anonymousUsername: string;
  password: string;
  confirmPassword: string;
}

export interface LoginRequest {
  anonymousUsername: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

// --- Community Post ---
export interface Post {
  id: string;
  authorId: string;
  authorUsername: string;
  content: string;
  tags: string[];
  isAnonymous: boolean;
  createdAt: string;
  updatedAt: string;
  likeCount: number;
  commentCount: number;
  isLikedByMe: boolean;
}

export interface CreatePostRequest {
  content: string;
  tags?: string[];
  isAnonymous?: boolean;
}

// --- Emergency ---
export interface EmergencyRequest {
  id: string;
  userId: string;
  createdAt: string;
  status: 'pending' | 'matched' | 'resolved';
  matchedPeerId?: string;
  resolvedAt?: string;
}

export interface PeerMatch {
  peerId: string;
  peerUsername: string;
  matchedAt: string;
  sessionId: string;
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