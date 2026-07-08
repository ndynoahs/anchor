// ============================================================
// Anchor — Auth Service
// ============================================================

import * as SecureStore from 'expo-secure-store';
import apiClient from './api';
import { STORAGE_KEYS } from '../constants';
import type {
  RegisterRequest,
  LoginRequest,
  RegisterResponse,
  LoginResponse,
  User,
} from '../types';

/**
 * Store auth tokens securely
 */
export async function storeTokens(accessToken: string, refreshToken: string): Promise<void> {
  await SecureStore.setItemAsync(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
  await SecureStore.setItemAsync(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
}

/**
 * Clear all stored auth tokens
 */
export async function clearTokens(): Promise<void> {
  await SecureStore.deleteItemAsync(STORAGE_KEYS.ACCESS_TOKEN);
  await SecureStore.deleteItemAsync(STORAGE_KEYS.REFRESH_TOKEN);
}

/**
 * Register a new anonymous user
 * POST /api/v1/auth/register
 */
export async function register(data: RegisterRequest): Promise<RegisterResponse> {
  const response = await apiClient.post<{ success: boolean; data: RegisterResponse }>(
    '/auth/register',
    data
  );
  const result = response.data.data;
  await storeTokens(result.tokens.accessToken, result.tokens.refreshToken);
  return result;
}

/**
 * Login with email and password
 * POST /api/v1/auth/login
 */
export async function login(data: LoginRequest): Promise<LoginResponse> {
  const response = await apiClient.post<{ success: boolean; data: LoginResponse }>(
    '/auth/login',
    data
  );
  const result = response.data.data;
  await storeTokens(result.tokens.accessToken, result.tokens.refreshToken);
  return result;
}

/**
 * Logout — clear tokens
 */
export async function logout(): Promise<void> {
  try {
    await apiClient.post('/auth/logout');
  } catch {
    // Ignore server errors during logout
  } finally {
    await clearTokens();
  }
}

/**
 * Get the currently authenticated user's profile
 */
export async function getCurrentUser(): Promise<User> {
  const response = await apiClient.get<{ success: boolean; data: User }>(
    '/auth/me'
  );
  return response.data.data;
}

/**
 * Check if user is authenticated (has a stored token)
 */
export async function isAuthenticated(): Promise<boolean> {
  try {
    const token = await SecureStore.getItemAsync(STORAGE_KEYS.ACCESS_TOKEN);
    return !!token;
  } catch {
    return false;
  }
}

/**
 * Get the stored access token
 */
export async function getAccessToken(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(STORAGE_KEYS.ACCESS_TOKEN);
  } catch {
    return null;
  }
}