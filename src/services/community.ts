// ============================================================
// Anchor — Community API Service
// ============================================================

import apiClient from './api';
import type {
  Community,
  CommunityDetail,
  Post,
  PostDetail,
  PaginatedResponse,
  CreatePostRequest,
} from '../types';

/**
 * List communities with optional filtering
 * GET /api/v1/communities
 */
export async function getCommunities(params?: {
  category?: string;
  page?: number;
  pageSize?: number;
}): Promise<PaginatedResponse<Community>> {
  const response = await apiClient.get<{ success: boolean; data: PaginatedResponse<Community> }>(
    '/communities',
    { params }
  );
  return response.data.data;
}

/**
 * Get community details
 * GET /api/v1/communities/:communityId
 */
export async function getCommunityDetail(communityId: string): Promise<CommunityDetail> {
  const response = await apiClient.get<{ success: boolean; data: CommunityDetail }>(
    `/communities/${communityId}`
  );
  return response.data.data;
}

/**
 * Join a community
 * POST /api/v1/communities/:communityId/join
 */
export async function joinCommunity(communityId: string): Promise<{ role: string; joinedAt: string }> {
  const response = await apiClient.post<{ success: boolean; data: { role: string; joinedAt: string } }>(
    `/communities/${communityId}/join`
  );
  return response.data.data;
}

/**
 * Leave a community
 * POST /api/v1/communities/:communityId/leave
 */
export async function leaveCommunity(communityId: string): Promise<void> {
  await apiClient.post(`/communities/${communityId}/leave`);
}

/**
 * Get posts in a community
 * GET /api/v1/communities/:communityId/posts
 */
export async function getCommunityPosts(
  communityId: string,
  params?: { page?: number; pageSize?: number; sort?: 'latest' | 'popular'; tag?: string }
): Promise<PaginatedResponse<Post>> {
  const response = await apiClient.get<{ success: boolean; data: PaginatedResponse<Post> }>(
    `/communities/${communityId}/posts`,
    { params }
  );
  return response.data.data;
}

/**
 * Create a post in a community
 * POST /api/v1/communities/:communityId/posts
 */
export async function createPost(
  communityId: string,
  data: CreatePostRequest
): Promise<Post> {
  const response = await apiClient.post<{ success: boolean; data: Post }>(
    `/communities/${communityId}/posts`,
    data
  );
  return response.data.data;
}

/**
 * Get a single post with full content
 * GET /api/v1/posts/:postId
 */
export async function getPostDetail(postId: string): Promise<PostDetail> {
  const response = await apiClient.get<{ success: boolean; data: PostDetail }>(
    `/posts/${postId}`
  );
  return response.data.data;
}

/**
 * Toggle like on a post
 * POST /api/v1/posts/:postId/like
 */
export async function toggleLike(postId: string): Promise<{ liked: boolean; likeCount: number }> {
  const response = await apiClient.post<{ success: boolean; data: { liked: boolean; likeCount: number } }>(
    `/posts/${postId}/like`
  );
  return response.data.data;
}