// ============================================================
// Anchor — Auth Service
// ============================================================

import * as SecureStore from 'expo-secure-store';
import apiClient from './api';
import { STORAGE_KEYS } from '../constants';
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  User,
} from '../types';

/**
 * Store auth tokens securely
 */
async function storeTokens(accessToken: string, refreshToken: string): Promise<void> {
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
 */
export async function register(data: RegisterRequest): Promise<AuthResponse> {
  const response = await apiClient.post<{ success: boolean; data: AuthResponse }>(
    '/auth/register',
    data
  );
  const { user, tokens } = response.data.data;
  await storeTokens(tokens.accessToken, tokens.refreshToken);
  return response.data.data;
}

/**
 * Login with username and password
 */
export async function login(data: LoginRequest): Promise<AuthResponse> {
  const response = await apiClient.post<{ success: boolean; data: AuthResponse }>(
    '/auth/login',
    data
  );
  const { user, tokens } = response.data.data;
  await storeTokens(tokens.accessToken, tokens.refreshToken);
  return response.data.data;
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